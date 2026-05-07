/**
 * Seed: load JSON exam data into Postgres.
 *
 * Idempotent. Re-running maps each question text to the same deterministic UUID,
 * so existing attempts.responses[].questionId references stay valid across reseeds.
 *
 * Run: `npm run db:seed` (requires DATABASE_URL in .env.local).
 */

// Load .env.local first (Next.js convention), .env as fallback. Plain
// `dotenv/config` only loads `.env`, which leaves DATABASE_URL undefined when
// run via `npm run db:seed`.
import { config as loadEnv } from 'dotenv';
loadEnv({ path: ['.env.local', '.env'] });

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { db } from '../lib/db';
import {
  exams,
  topics,
  testSets,
  questions,
  testSetQuestions,
  attempts,
} from '../lib/db/schema';
import { NISM_VA_TOPICS, type TopicCode } from '../lib/topics';

type RawQuestion = {
  q: string;
  o: string[];
  a: number;
  e: string;
  topic: string;
  difficulty?: number;
};

type RawSet = {
  id: string;
  name: string;
  topic: string; // topic code, "MIX" for mocks, "FULL" for simulator
  duration: number;
  description: string;
  isDynamic: boolean;
  questionCount: number;
};

type SetQuestionMap = Record<string, Array<{ questionText: string; topic: string }>>;

const EXAM_CODE = 'nism-va';
const EXAM_DIR = join(process.cwd(), 'src/data/exams', EXAM_CODE);

const NAMESPACE = `${EXAM_CODE}|question|v1`;

function deterministicQuestionId(text: string): string {
  // SHA-1-derived UUIDv5 (RFC 4122 §4.3) keyed off the exam code + question text.
  // Stable across reseeds so attempts.responses keep their FK target.
  const hash = createHash('sha1').update(`${NAMESPACE}|${text}`).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const h = bytes.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(join(EXAM_DIR, relPath), 'utf8')) as T;
}

async function main() {
  console.log('[seed] reading exam data from', EXAM_DIR);

  const meta = readJson<{
    examCode: string;
    examName: string;
    examFullName: string;
    totalQuestions: number;
    durationMinutes: number;
    passMarkPercent: number;
    negativeMarking: boolean;
  }>('meta.json');

  const sets = readJson<RawSet[]>('sets.json');
  const setMap = readJson<SetQuestionMap>('set-question-map.json');

  // Load questions from each topic file and build a text -> question lookup.
  const questionFiles = [
    'inv',
    'str',
    'sch',
    'reg',
    'doc',
    'nav',
    'tax',
    'ops',
    'rsk',
    'prf',
  ] as const;

  const allQuestions: RawQuestion[] = [];
  for (const t of questionFiles) {
    const arr = readJson<RawQuestion[]>(`questions/${t}.json`);
    allQuestions.push(...arr);
  }
  const byText = new Map<string, RawQuestion>();
  for (const q of allQuestions) {
    if (byText.has(q.q)) {
      throw new Error(`Duplicate question text in pool: ${q.q.slice(0, 60)}`);
    }
    byText.set(q.q, q);
  }
  console.log(`[seed] loaded ${allQuestions.length} questions across ${questionFiles.length} topics`);

  // Resolve set-question-map entries to actual questions before touching the DB
  // so we can fail fast if any set references a missing question.
  const resolvedSetQuestions: Record<string, RawQuestion[]> = {};
  for (const set of sets) {
    if (set.isDynamic) {
      resolvedSetQuestions[set.id] = [];
      continue;
    }
    const entries = setMap[set.id];
    if (!entries) {
      throw new Error(`set-question-map.json missing entry for set "${set.id}"`);
    }
    const resolved: RawQuestion[] = [];
    for (const e of entries) {
      const q = byText.get(e.questionText);
      if (!q) {
        throw new Error(
          `Set "${set.id}" references unknown question text: "${e.questionText.slice(0, 60)}…"`
        );
      }
      resolved.push(q);
    }
    if (set.questionCount && resolved.length !== set.questionCount) {
      console.warn(
        `[seed] WARN set "${set.id}" expects ${set.questionCount}, map has ${resolved.length}`
      );
    }
    resolvedSetQuestions[set.id] = resolved;
  }

  // Refuse to nuke seeded data if any user attempts exist (would break their reviews).
  const existingAttempts = await db.execute(sql`select count(*)::int as n from attempts`);
  const attemptCount = (existingAttempts.rows?.[0] as { n: number } | undefined)?.n ?? 0;
  if (attemptCount > 0 && process.env.SEED_FORCE !== '1') {
    console.log(
      `[seed] ${attemptCount} attempt(s) exist — switching to upsert-only mode (no destructive deletes).`
    );
  } else {
    console.log('[seed] clearing test_set_questions (questions/sets are upserted, not deleted)');
    await db.execute(sql`delete from test_set_questions`);
  }

  // Exams: upsert
  await db
    .insert(exams)
    .values({
      code: meta.examCode,
      name: meta.examName,
      fullName: meta.examFullName,
      description: null,
      totalQuestions: meta.totalQuestions,
      durationMinutes: meta.durationMinutes,
      passMarkPercent: meta.passMarkPercent,
      negativeMarking: meta.negativeMarking,
      active: true,
    })
    .onConflictDoUpdate({
      target: exams.code,
      set: {
        name: meta.examName,
        fullName: meta.examFullName,
        totalQuestions: meta.totalQuestions,
        durationMinutes: meta.durationMinutes,
        passMarkPercent: meta.passMarkPercent,
        negativeMarking: meta.negativeMarking,
      },
    });

  // Topics: upsert from canonical source in lib/topics.ts
  for (const [code, info] of Object.entries(NISM_VA_TOPICS)) {
    await db
      .insert(topics)
      .values({
        code: code as TopicCode,
        examCode: EXAM_CODE,
        name: info.name,
        weightInExam: info.weight,
        displayOrder: info.order,
      })
      .onConflictDoUpdate({
        target: [topics.examCode, topics.code],
        set: {
          name: info.name,
          weightInExam: info.weight,
          displayOrder: info.order,
        },
      });
  }
  console.log('[seed] upserted exam + topics');

  // Questions: upsert with deterministic UUIDs
  let qInserted = 0;
  for (const q of allQuestions) {
    const id = deterministicQuestionId(q.q);
    await db
      .insert(questions)
      .values({
        id,
        examCode: EXAM_CODE,
        topicCode: q.topic,
        question: q.q,
        options: q.o,
        correctIndex: q.a,
        explanation: q.e,
        difficulty: q.difficulty ?? 2,
      })
      .onConflictDoUpdate({
        target: questions.id,
        set: {
          topicCode: q.topic,
          options: q.o,
          correctIndex: q.a,
          explanation: q.e,
          difficulty: q.difficulty ?? 2,
        },
      });
    qInserted++;
  }
  console.log(`[seed] upserted ${qInserted} questions`);

  // Test sets: upsert
  for (const [i, s] of sets.entries()) {
    const topicCode = s.topic === 'MIX' || s.topic === 'FULL' ? null : s.topic;
    await db
      .insert(testSets)
      .values({
        id: s.id,
        examCode: EXAM_CODE,
        name: s.name,
        description: s.description,
        topicCode,
        durationSeconds: s.duration,
        isDynamic: s.isDynamic,
        displayOrder: i + 1,
      })
      .onConflictDoUpdate({
        target: testSets.id,
        set: {
          name: s.name,
          description: s.description,
          topicCode,
          durationSeconds: s.duration,
          isDynamic: s.isDynamic,
          displayOrder: i + 1,
        },
      });
  }
  console.log(`[seed] upserted ${sets.length} test sets`);

  // test_set_questions: rebuild fully (no attempts at this point or we already
  // bailed above; pivot table is safe to rebuild because it has no inbound FKs).
  let pivotInserted = 0;
  for (const set of sets) {
    if (set.isDynamic) continue;
    const list = resolvedSetQuestions[set.id]!;
    for (let i = 0; i < list.length; i++) {
      const q = list[i]!;
      await db
        .insert(testSetQuestions)
        .values({
          setId: set.id,
          questionId: deterministicQuestionId(q.q),
          questionOrder: i + 1,
        })
        .onConflictDoUpdate({
          target: [testSetQuestions.setId, testSetQuestions.questionId],
          set: { questionOrder: i + 1 },
        });
      pivotInserted++;
    }
  }
  console.log(`[seed] wired ${pivotInserted} set→question rows`);

  // Sanity counts
  const counts = await Promise.all([
    db.execute(sql`select count(*)::int as n from exams`),
    db.execute(sql`select count(*)::int as n from topics`),
    db.execute(sql`select count(*)::int as n from test_sets`),
    db.execute(sql`select count(*)::int as n from questions`),
    db.execute(sql`select count(*)::int as n from test_set_questions`),
  ]);
  const [e, t, ts, q, tsq] = counts.map((r) => (r.rows?.[0] as { n: number }).n);
  console.log('[seed] DB now contains:');
  console.log(`         exams:              ${e}`);
  console.log(`         topics:             ${t}`);
  console.log(`         test_sets:          ${ts}`);
  console.log(`         questions:          ${q}`);
  console.log(`         test_set_questions: ${tsq}`);

  // Reference attempts table to keep TS happy (used for the guard above).
  void attempts;
}

main().then(
  () => {
    console.log('[seed] done.');
    process.exit(0);
  },
  (err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  }
);
