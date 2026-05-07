'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { attempts, testSets, exams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { scoreAttempt, type ClientResponse } from '@/lib/scoring';
import { isFreeTest } from '@/lib/access';

export type SubmitInput = {
  examCode: string;
  setId: string;
  startedAt: number; // ms epoch
  responses: ClientResponse[];
};

export type SubmitResult =
  | {
      ok: true;
      // Server-computed result. Always returned.
      attempted: number;
      correct: number;
      total: number;
      scorePercent: number;
      passed: boolean;
      topicBreakdown: Record<string, { total: number; correct: number; percent: number }>;
      // Persisted attempt id, present only for signed-in users.
      attemptId?: string;
    }
  | { ok: false; error: string };

export async function submitAttempt(input: SubmitInput): Promise<SubmitResult> {
  // Look up the exam (for passMarkPercent) and the set (to validate it
  // belongs to that exam). Both must exist.
  const examRows = await db
    .select()
    .from(exams)
    .where(eq(exams.code, input.examCode))
    .limit(1);
  const exam = examRows[0];
  if (!exam) return { ok: false, error: 'Unknown exam.' };

  const setRows = await db
    .select()
    .from(testSets)
    .where(eq(testSets.id, input.setId))
    .limit(1);
  const set = setRows[0];
  if (!set || set.examCode !== exam.code) {
    return { ok: false, error: 'Unknown test set.' };
  }

  // Anonymous users can submit only the free mock for this exam.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session && !isFreeTest(exam.code, set.id)) {
    return { ok: false, error: 'This test requires sign-in.' };
  }

  const scored = await scoreAttempt(exam.code, exam.passMarkPercent, input.responses);

  let attemptId: string | undefined;
  if (session) {
    const startedAt = new Date(input.startedAt);
    const submittedAt = new Date();
    const durationSecondsTaken = Math.max(
      0,
      Math.round((submittedAt.getTime() - startedAt.getTime()) / 1000)
    );

    const inserted = await db
      .insert(attempts)
      .values({
        userId: session.user.id,
        setId: set.id,
        examCode: exam.code,
        startedAt,
        submittedAt,
        durationSecondsTaken,
        totalQuestions: scored.totalQuestions,
        attempted: scored.attempted,
        correct: scored.correct,
        scorePercent: scored.scorePercent,
        passed: scored.passed,
        responses: scored.responses,
      })
      .returning({ id: attempts.id });

    attemptId = inserted[0]?.id;
  }

  return {
    ok: true,
    attempted: scored.attempted,
    correct: scored.correct,
    total: scored.totalQuestions,
    scorePercent: scored.scorePercent,
    passed: scored.passed,
    topicBreakdown: scored.topicBreakdown,
    attemptId,
  };
}
