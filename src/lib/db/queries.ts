// Read-side query helpers for the test runner + result pages.
// Centralized here so pages stay focused on layout and we have one place to
// optimize when traffic warrants it.

import 'server-only';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from './index';
import {
  attempts,
  questions,
  testSets,
  testSetQuestions,
  topics,
  type AttemptResponse,
} from './schema';

// ── Test sets ────────────────────────────────────────────────────────────────

export type TestSetWithMeta = {
  id: string;
  name: string;
  description: string | null;
  topicCode: string | null;
  durationSeconds: number;
  isDynamic: boolean;
  displayOrder: number;
  questionCount: number;
};

export async function listTestSets(examCode: string): Promise<TestSetWithMeta[]> {
  // For each set, count its rows in test_set_questions. Dynamic sets have 0.
  const rows = await db
    .select({
      id: testSets.id,
      name: testSets.name,
      description: testSets.description,
      topicCode: testSets.topicCode,
      durationSeconds: testSets.durationSeconds,
      isDynamic: testSets.isDynamic,
      displayOrder: testSets.displayOrder,
      questionCount: sql<number>`coalesce(count(${testSetQuestions.questionId})::int, 0)`,
    })
    .from(testSets)
    .leftJoin(testSetQuestions, eq(testSetQuestions.setId, testSets.id))
    .where(eq(testSets.examCode, examCode))
    .groupBy(testSets.id)
    .orderBy(testSets.displayOrder);

  return rows;
}

/** User's most recent score per set (for the "last score" badge on the hub). */
export async function lastScoresForUser(
  userId: string,
  examCode: string
): Promise<Record<string, { scorePercent: number; passed: boolean; submittedAt: Date }>> {
  const rows = await db
    .select({
      setId: attempts.setId,
      scorePercent: attempts.scorePercent,
      passed: attempts.passed,
      submittedAt: attempts.submittedAt,
    })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.examCode, examCode)))
    .orderBy(desc(attempts.submittedAt));

  // First row per setId wins (we ordered desc by time)
  const out: Record<string, { scorePercent: number; passed: boolean; submittedAt: Date }> = {};
  for (const r of rows) {
    if (!(r.setId in out)) {
      out[r.setId] = {
        scorePercent: r.scorePercent,
        passed: r.passed,
        submittedAt: r.submittedAt,
      };
    }
  }
  return out;
}

// ── Questions for a set ──────────────────────────────────────────────────────

export type TakeableQuestion = {
  id: string;
  question: string;
  options: string[];
  topicCode: string;
};

/** Questions to take. correctIndex + explanation are NOT returned to the
 *  client — those are joined on the server during scoring. */
export async function questionsForSet(setId: string): Promise<TakeableQuestion[]> {
  const rows = await db
    .select({
      id: questions.id,
      question: questions.question,
      options: questions.options,
      topicCode: questions.topicCode,
      questionOrder: testSetQuestions.questionOrder,
    })
    .from(testSetQuestions)
    .innerJoin(questions, eq(questions.id, testSetQuestions.questionId))
    .where(eq(testSetQuestions.setId, setId))
    .orderBy(testSetQuestions.questionOrder);

  return rows.map((r) => ({
    id: r.id,
    question: r.question,
    options: r.options,
    topicCode: r.topicCode,
  }));
}

/** Sample N questions weighted by the exam's topic distribution. Used by
 *  the dynamic Full Simulator. The sample is deterministic per call (we
 *  shuffle within each topic bucket using random ordering on the DB side). */
export async function sampleQuestionsForExam(
  examCode: string,
  totalCount: number
): Promise<TakeableQuestion[]> {
  const topicRows = await db
    .select({ code: topics.code, weight: topics.weightInExam })
    .from(topics)
    .where(eq(topics.examCode, examCode));

  const totalWeight = topicRows.reduce((acc, t) => acc + (t.weight ?? 0), 0) || 1;

  const sampled: TakeableQuestion[] = [];
  for (const t of topicRows) {
    const count = Math.round(((t.weight ?? 0) / totalWeight) * totalCount);
    if (count <= 0) continue;
    const rows = await db
      .select({
        id: questions.id,
        question: questions.question,
        options: questions.options,
        topicCode: questions.topicCode,
      })
      .from(questions)
      .where(and(eq(questions.examCode, examCode), eq(questions.topicCode, t.code)))
      .orderBy(sql`random()`)
      .limit(count);
    sampled.push(...rows);
  }

  // Shuffle the combined order (Fisher-Yates).
  for (let i = sampled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = sampled[i] as TakeableQuestion;
    sampled[i] = sampled[j] as TakeableQuestion;
    sampled[j] = tmp;
  }
  return sampled.slice(0, totalCount);
}

// ── Attempt storage / lookup ─────────────────────────────────────────────────

export async function getAttempt(attemptId: string, userId: string) {
  const rows = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export type ScoredResponse = AttemptResponse;

// ── User progress queries ────────────────────────────────────────────────────

/** Lightweight rows for the recent-attempts list. Includes the set name so
 *  rendering doesn't have to round-trip per row. Excludes the responses
 *  JSONB (could be large) — that's fetched only when opening a result. */
export type AttemptRowLite = {
  id: string;
  setId: string;
  setName: string;
  submittedAt: Date;
  durationSecondsTaken: number;
  totalQuestions: number;
  correct: number;
  scorePercent: number;
  passed: boolean;
};

export async function listAttempts(
  userId: string,
  examCode: string,
  limit?: number
): Promise<AttemptRowLite[]> {
  const q = db
    .select({
      id: attempts.id,
      setId: attempts.setId,
      setName: testSets.name,
      submittedAt: attempts.submittedAt,
      durationSecondsTaken: attempts.durationSecondsTaken,
      totalQuestions: attempts.totalQuestions,
      correct: attempts.correct,
      scorePercent: attempts.scorePercent,
      passed: attempts.passed,
    })
    .from(attempts)
    .innerJoin(testSets, eq(testSets.id, attempts.setId))
    .where(and(eq(attempts.userId, userId), eq(attempts.examCode, examCode)))
    .orderBy(desc(attempts.submittedAt));

  return limit ? await q.limit(limit) : await q;
}

export type AttemptStats = {
  testsTaken: number;
  avgScore: number;        // overall average score across all attempts
  bestScore: number;       // best single-attempt score
  passedCount: number;     // # of attempts that cleared pass mark
  lastAttemptAt: Date | null;
};

export async function attemptStats(userId: string, examCode: string): Promise<AttemptStats> {
  const rows = await db
    .select({
      scorePercent: attempts.scorePercent,
      passed: attempts.passed,
      submittedAt: attempts.submittedAt,
    })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.examCode, examCode)));

  if (rows.length === 0) {
    return { testsTaken: 0, avgScore: 0, bestScore: 0, passedCount: 0, lastAttemptAt: null };
  }
  const sum = rows.reduce((a, r) => a + r.scorePercent, 0);
  const best = rows.reduce((m, r) => Math.max(m, r.scorePercent), 0);
  const passedCount = rows.filter((r) => r.passed).length;
  const last = rows.reduce<Date | null>(
    (m, r) => (m === null || r.submittedAt > m ? r.submittedAt : m),
    null
  );
  return {
    testsTaken: rows.length,
    avgScore: Math.round(sum / rows.length),
    bestScore: best,
    passedCount,
    lastAttemptAt: last,
  };
}

// ── Topic mastery aggregator ─────────────────────────────────────────────────
//
// Each question answered carries a per-topic correctness signal. We aggregate
// across all of a user's attempts on this exam, weighting recent attempts
// more heavily than old ones (14-day half-life — a question answered today
// counts twice as much as one answered two weeks ago).
//
// This is a JS-side aggregation rather than a SQL view because Postgres
// jsonb_array_elements + window functions get noisy fast and the volume is
// small (a few hundred questions per active user). If/when this gets hot,
// promote to a materialized `user_topic_stats` table refreshed on attempt
// insert.

export type TopicMasteryRow = {
  topicCode: string;
  total: number;
  correct: number;
  percent: number;          // simple % across all attempts (unweighted)
  weightedPercent: number;  // recency-weighted %
  lastAnsweredAt: Date | null;
};

const HALF_LIFE_DAYS = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function topicMastery(
  userId: string,
  examCode: string
): Promise<TopicMasteryRow[]> {
  const rows = await db
    .select({
      submittedAt: attempts.submittedAt,
      responses: attempts.responses,
    })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.examCode, examCode)));

  type Acc = {
    total: number;
    correct: number;
    weightedTotal: number;
    weightedCorrect: number;
    lastAnsweredAt: Date | null;
  };
  const byTopic = new Map<string, Acc>();
  const now = Date.now();

  for (const a of rows) {
    const ageDays = (now - new Date(a.submittedAt).getTime()) / MS_PER_DAY;
    const weight = Math.pow(0.5, ageDays / HALF_LIFE_DAYS); // 1.0 today, 0.5 in 14 days
    for (const r of a.responses) {
      // Skipped questions don't contribute to mastery — only attempted Qs.
      if (r.userAnswerIndex === null) continue;
      const code = r.questionSnapshot.topicCode;
      let acc = byTopic.get(code);
      if (!acc) {
        acc = { total: 0, correct: 0, weightedTotal: 0, weightedCorrect: 0, lastAnsweredAt: null };
        byTopic.set(code, acc);
      }
      acc.total++;
      acc.weightedTotal += weight;
      if (r.isCorrect) {
        acc.correct++;
        acc.weightedCorrect += weight;
      }
      const t = new Date(a.submittedAt);
      if (acc.lastAnsweredAt === null || t > acc.lastAnsweredAt) acc.lastAnsweredAt = t;
    }
  }

  const out: TopicMasteryRow[] = [];
  for (const [code, acc] of byTopic) {
    out.push({
      topicCode: code,
      total: acc.total,
      correct: acc.correct,
      percent: acc.total === 0 ? 0 : Math.round((acc.correct / acc.total) * 100),
      weightedPercent:
        acc.weightedTotal === 0 ? 0 : Math.round((acc.weightedCorrect / acc.weightedTotal) * 100),
      lastAnsweredAt: acc.lastAnsweredAt,
    });
  }
  return out;
}
