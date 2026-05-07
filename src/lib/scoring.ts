// Server-side scoring. The client sends per-question answers; we re-fetch the
// canonical question + correctIndex from the DB so a tampered client can't
// score itself a perfect run.

import 'server-only';
import { inArray } from 'drizzle-orm';
import { db } from './db';
import { questions } from './db/schema';
import type { AttemptResponse } from './db/schema';

export type ClientResponse = {
  questionId: string;
  userAnswerIndex: number | null;
  markedForReview: boolean;
};

export type ScoredAttempt = {
  totalQuestions: number;
  attempted: number;
  correct: number;
  scorePercent: number;
  passed: boolean;
  responses: AttemptResponse[];
  topicBreakdown: Record<string, { total: number; correct: number; percent: number }>;
};

export async function scoreAttempt(
  examCode: string,
  passMarkPercent: number,
  clientResponses: ClientResponse[]
): Promise<ScoredAttempt> {
  const ids = clientResponses.map((r) => r.questionId);
  if (ids.length === 0) {
    return {
      totalQuestions: 0,
      attempted: 0,
      correct: 0,
      scorePercent: 0,
      passed: false,
      responses: [],
      topicBreakdown: {},
    };
  }

  const dbQuestions = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, ids));

  // Map for O(1) lookup. Reject any question that doesn't belong to this exam.
  const byId = new Map<string, (typeof dbQuestions)[number]>();
  for (const q of dbQuestions) {
    if (q.examCode === examCode) byId.set(q.id, q);
  }

  const responses: AttemptResponse[] = [];
  let correct = 0;
  let attempted = 0;
  const topic: Record<string, { total: number; correct: number }> = {};

  for (const r of clientResponses) {
    const q = byId.get(r.questionId);
    // If a question vanished or didn't belong to this exam, skip it. The
    // total is still the number of submitted responses though.
    if (!q) continue;

    const isCorrect = r.userAnswerIndex !== null && r.userAnswerIndex === q.correctIndex;
    if (r.userAnswerIndex !== null) attempted++;
    if (isCorrect) correct++;

    if (!topic[q.topicCode]) topic[q.topicCode] = { total: 0, correct: 0 };
    topic[q.topicCode]!.total++;
    if (isCorrect) topic[q.topicCode]!.correct++;

    responses.push({
      questionId: q.id,
      questionSnapshot: {
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        topicCode: q.topicCode,
      },
      userAnswerIndex: r.userAnswerIndex,
      isCorrect,
      markedForReview: r.markedForReview,
    });
  }

  const total = clientResponses.length;
  const scorePercent = total === 0 ? 0 : Math.round((correct / total) * 100);
  const passed = scorePercent >= passMarkPercent;

  const topicBreakdown: ScoredAttempt['topicBreakdown'] = {};
  for (const [code, t] of Object.entries(topic)) {
    topicBreakdown[code] = {
      total: t.total,
      correct: t.correct,
      percent: t.total === 0 ? 0 : Math.round((t.correct / t.total) * 100),
    };
  }

  return {
    totalQuestions: total,
    attempted,
    correct,
    scorePercent,
    passed,
    responses,
    topicBreakdown,
  };
}
