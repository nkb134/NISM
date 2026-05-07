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
