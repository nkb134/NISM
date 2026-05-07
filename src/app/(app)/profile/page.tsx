import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { listExamSummaries } from '@/lib/db/queries';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { SignOutButton } from '@/components/profile/SignOutButton';

export const metadata = {
  title: 'Your profile',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login?next=/profile');

  const summaries = await listExamSummaries(session.user.id);
  const totalAttempts = summaries.reduce((a, s) => a + s.testsTaken, 0);

  return (
    <main className="mx-auto max-w-[720px] px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>
            Your profile
          </h1>
          <p
            className="mt-1 truncate"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
          >
            {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="mb-10">
        <h2
          className="mb-3 font-semibold uppercase"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.4px',
          }}
        >
          Progress across exams
        </h2>

        {summaries.length === 0 ? (
          <div
            className="rounded-xl border p-6 text-center sm:p-8"
            style={{
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-surface-hover)',
            }}
          >
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              You haven't taken a test yet. Pick an exam to get started.
            </p>
            <Link
              href={'/dashboard' as never}
              className="mt-4 inline-flex items-center justify-center"
              style={{
                padding: '9px 16px',
                background: 'var(--color-navy)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              Browse exams →
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {summaries.map((s) => {
              const exam = getExamFromCatalog(s.examCode);
              const passMark = exam?.passMarkPercent ?? 50;
              const above = s.bestScore >= passMark;
              return (
                <li key={s.examCode}>
                  <Link
                    href={`/exam/${s.examCode}/progress` as never}
                    className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors hover:bg-[var(--color-surface-hover)]"
                    style={{
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      background: 'var(--color-bg)',
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className="truncate font-semibold"
                        style={{ fontSize: 'var(--text-md)', color: 'var(--color-text)' }}
                      >
                        {exam?.shortName ?? s.examCode}
                      </div>
                      <div
                        className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1"
                        style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
                      >
                        <span>
                          {s.testsTaken} {s.testsTaken === 1 ? 'attempt' : 'attempts'}
                        </span>
                        <span>·</span>
                        <span>avg {s.avgScore}%</span>
                        <span>·</span>
                        <span>last {formatRelative(s.lastAttemptAt)}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className="tabular font-bold"
                        style={{
                          fontSize: 'var(--text-lg)',
                          color: above ? 'var(--color-pass)' : 'var(--color-text)',
                        }}
                      >
                        {s.bestScore}%
                      </div>
                      <div
                        style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
                      >
                        best
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {totalAttempts > 0 && (
        <p
          className="mb-2 text-center"
          style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
        >
          {totalAttempts} total {totalAttempts === 1 ? 'attempt' : 'attempts'} across{' '}
          {summaries.length} {summaries.length === 1 ? 'exam' : 'exams'}.
        </p>
      )}
    </main>
  );
}

function formatRelative(date: Date): string {
  const ms = Date.now() - new Date(date).getTime();
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  if (days < 1) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
