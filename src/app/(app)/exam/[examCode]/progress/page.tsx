import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { attemptStats, listAttempts, topicMastery } from '@/lib/db/queries';
import { StatsRow } from '@/components/progress/StatsRow';
import { TopicMasteryCard } from '@/components/progress/TopicMasteryCard';
import { RecentAttempts } from '@/components/progress/RecentAttempts';

type Props = { params: Promise<{ examCode: string }> };

export async function generateMetadata({ params }: Props) {
  const { examCode } = await params;
  const exam = getExamFromCatalog(examCode);
  return {
    title: exam ? `${exam.shortName} — Your Progress` : 'Progress',
    robots: { index: false, follow: false },
  };
}

export default async function ProgressPage({ params }: Props) {
  const { examCode } = await params;
  const exam = getExamFromCatalog(examCode);
  if (!exam) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/login?next=/exam/${examCode}/progress`);
  }

  // Fire all three queries in parallel to keep the page fast.
  const [stats, attempts, mastery] = await Promise.all([
    attemptStats(session.user.id, exam.code),
    listAttempts(session.user.id, exam.code),
    topicMastery(session.user.id, exam.code),
  ]);

  const empty = stats.testsTaken === 0;

  return (
    <main className="mx-auto max-w-[920px] px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <p
          className="font-semibold uppercase"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.4px',
          }}
        >
          {exam.shortName}
        </p>
        <h1
          className="mt-1 font-bold"
          style={{ fontSize: 'var(--text-xl)', lineHeight: 1.2 }}
        >
          Your progress
        </h1>
        {!empty && (
          <p
            className="mt-2"
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.6,
            }}
          >
            {stats.avgScore >= exam.passMarkPercent + 15
              ? `Averaging ${stats.avgScore}% — you're exam-ready. Lock it in with the Full Simulator.`
              : stats.avgScore >= exam.passMarkPercent
                ? `Averaging ${stats.avgScore}% — past the line, target ${exam.passMarkPercent + 15}%+ before booking the real exam.`
                : `Averaging ${stats.avgScore}%. Drill the weak topics below.`}
          </p>
        )}
      </header>

      {empty ? <EmptyState examCode={exam.code} /> : (
        <>
          <StatsRow stats={stats} passMarkPercent={exam.passMarkPercent} />

          <div className="mt-10">
            <TopicMasteryCard rows={mastery} examCode={exam.code} />
          </div>

          <div className="mt-10">
            <RecentAttempts attempts={attempts} examCode={exam.code} />
          </div>
        </>
      )}
    </main>
  );
}

function EmptyState({ examCode }: { examCode: string }) {
  return (
    <div
      className="rounded-xl border p-8 text-center sm:p-12"
      style={{
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-surface-hover)',
      }}
    >
      <h2 className="font-bold" style={{ fontSize: 'var(--text-lg)' }}>
        No attempts yet
      </h2>
      <p
        className="mx-auto mt-2 max-w-[480px]"
        style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
      >
        Take a test to see your topic mastery, weak spots, and pass rate. The free mock test
        gives you a baseline in 30 minutes.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={`/exam/${examCode}/tests` as never}
          className="inline-flex items-center justify-center"
          style={{
            padding: '10px 18px',
            background: 'var(--color-navy)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          Take a test →
        </Link>
        <Link
          href={`/exam/${examCode}/study` as never}
          className="inline-flex items-center justify-center border"
          style={{
            padding: '10px 18px',
            borderColor: 'var(--color-border)',
            color: 'var(--color-navy)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          Open study guide
        </Link>
      </div>
    </div>
  );
}
