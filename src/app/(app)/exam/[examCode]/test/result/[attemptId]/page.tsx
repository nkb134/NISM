import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { testSets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { getAttempt } from '@/lib/db/queries';
import { ScoreArc } from '@/components/test/ScoreArc';
import { TopicBreakdown } from '@/components/test/TopicBreakdown';
import { ReviewList } from '@/components/test/ReviewList';

type Props = { params: Promise<{ examCode: string; attemptId: string }> };

export async function generateMetadata({ params }: Props) {
  const { examCode } = await params;
  const exam = getExamFromCatalog(examCode);
  return {
    title: exam ? `Result · ${exam.shortName}` : 'Result',
    robots: { index: false, follow: false },
  };
}

export default async function ResultPage({ params }: Props) {
  const { examCode, attemptId } = await params;
  const exam = getExamFromCatalog(examCode);
  if (!exam) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/login?next=/exam/${examCode}/test/result/${attemptId}`);
  }

  const attempt = await getAttempt(attemptId, session.user.id);
  if (!attempt || attempt.examCode !== exam.code) notFound();

  const setRows = await db.select().from(testSets).where(eq(testSets.id, attempt.setId)).limit(1);
  const set = setRows[0];

  // Build topic breakdown from the persisted responses (no extra DB call).
  const topicBreakdown: Record<string, { total: number; correct: number; percent: number }> = {};
  for (const r of attempt.responses) {
    const code = r.questionSnapshot.topicCode;
    if (!topicBreakdown[code]) topicBreakdown[code] = { total: 0, correct: 0, percent: 0 };
    topicBreakdown[code]!.total++;
    if (r.isCorrect) topicBreakdown[code]!.correct++;
  }
  for (const code of Object.keys(topicBreakdown)) {
    const t = topicBreakdown[code]!;
    t.percent = t.total === 0 ? 0 : Math.round((t.correct / t.total) * 100);
  }

  const skipped = attempt.totalQuestions - attempt.attempted;
  const wrong = attempt.attempted - attempt.correct;
  const cushion = attempt.scorePercent - exam.passMarkPercent;
  const minutes = Math.floor(attempt.durationSecondsTaken / 60);
  const seconds = attempt.durationSecondsTaken % 60;

  return (
    <main className="mx-auto max-w-[920px] px-4 py-10 sm:px-6">
      {/* Hero band */}
      <section
        className="rounded-xl border p-6 sm:p-8"
        style={{
          background: attempt.passed
            ? 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)'
            : 'linear-gradient(135deg, #fef2f2 0%, #ffffff 60%)',
          borderColor: attempt.passed ? '#a7f3d0' : '#fecaca',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p
              className="font-semibold"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}
            >
              {exam.shortName}
            </p>
            <h1
              className="mt-1 font-bold"
              style={{ fontSize: 'var(--text-xl)', lineHeight: 1.2 }}
            >
              {set?.name ?? 'Test'}
            </h1>
            <p
              className="mt-3"
              style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
            >
              {attempt.passed
                ? cushion >= 15
                  ? `Cleared with ${cushion} marks of cushion. Solid.`
                  : `Cleared by ${cushion} marks. Aim for ${exam.passMarkPercent + 15}%+ before the real exam.`
                : `${exam.passMarkPercent - attempt.scorePercent} marks short of pass. Drill weak topics below.`}
            </p>
            <p
              className="mt-3 tabular"
              style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
            >
              Took {minutes}m {seconds}s · Submitted {new Date(attempt.submittedAt).toLocaleString()}
            </p>
          </div>
          <div className="shrink-0 self-center">
            <ScoreArc
              scorePercent={attempt.scorePercent}
              passed={attempt.passed}
              passMarkPercent={exam.passMarkPercent}
            />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Stat label="Total" value={attempt.totalQuestions} />
          <Stat label="Correct" value={attempt.correct} tone="pass" />
          <Stat label="Wrong" value={wrong} tone={wrong > 0 ? 'fail' : undefined} />
          <Stat label="Skipped" value={skipped} tone={skipped > 0 ? 'warn' : undefined} />
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/exam/${exam.code}/progress` as never}
            className="inline-flex items-center justify-center"
            style={{
              padding: '8px 16px',
              background: 'var(--color-navy)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            See full progress →
          </Link>
          <Link
            href={`/exam/${exam.code}/tests` as never}
            className="inline-flex items-center justify-center border"
            style={{
              padding: '8px 16px',
              borderColor: 'var(--color-border)',
              color: 'var(--color-navy)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            Take another test
          </Link>
          <Link
            href={`/exam/${exam.code}/study` as never}
            className="inline-flex items-center justify-center"
            style={{
              padding: '8px 16px',
              color: 'var(--color-navy)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            Open study guide
          </Link>
        </div>
      </section>

      {/* Topic breakdown */}
      <div className="mt-10">
        <TopicBreakdown topicBreakdown={topicBreakdown} />
      </div>

      {/* Per-question review */}
      <div className="mt-10">
        <ReviewList responses={attempt.responses} />
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'pass' | 'warn' | 'fail';
}) {
  const color =
    tone === 'pass'
      ? 'var(--color-pass)'
      : tone === 'warn'
        ? 'var(--color-warn)'
        : tone === 'fail'
          ? 'var(--color-fail)'
          : 'var(--color-text)';
  return (
    <div
      className="rounded-lg border p-3 text-center"
      style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg)' }}
    >
      <div
        className="font-semibold uppercase"
        style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', letterSpacing: '0.4px' }}
      >
        {label}
      </div>
      <div
        className="tabular mt-1 font-bold"
        style={{ fontSize: 'var(--text-2xl)', color }}
      >
        {value}
      </div>
    </div>
  );
}
