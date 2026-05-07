import Link from 'next/link';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { EXAM_CATALOG } from '@/data/exam-catalog';
import { Icon, iconForExamCode } from '@/components/marketing/Icon';

export const metadata = {
  title: 'NISM Certifications',
  alternates: { canonical: '/dashboard' },
};

// Public catalog. Anyone can browse exams; auth is required only when they
// start taking a test.
export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="mx-auto max-w-[960px] px-6 py-12">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>
            Pick an exam
          </h1>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)' }}>
            Free study guides + practice tests for NISM certifications.
          </p>
        </div>
        {session ? (
          <span style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}>
            {session.user.email}
          </span>
        ) : (
          <Link
            href={'/login' as never}
            style={{
              color: 'var(--color-navy)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            Sign in →
          </Link>
        )}
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {EXAM_CATALOG.map((exam) => {
          const isReady = exam.studyGuideStatus === 'available' || exam.mockTestStatus === 'available';
          const Card = (
            <article
              className="flex h-full gap-4 rounded-xl border p-5 transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-bg)',
              }}
            >
              <span
                aria-hidden
                className="flex shrink-0 items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  background:
                    'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-deeper) 100%)',
                  color: 'var(--color-accent)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Icon name={iconForExamCode(exam.code)} size={22} strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="truncate font-semibold" style={{ fontSize: 'var(--text-md)' }}>
                    {exam.shortName}
                  </h2>
                  {!isReady && (
                    <span
                      className="shrink-0"
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-faint)',
                        background: 'var(--color-surface)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      Coming soon
                    </span>
                  )}
                </div>
                <p
                  className="mt-1"
                  style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}
                >
                  {exam.fullName}
                </p>
                <p
                  className="mt-2"
                  style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)', lineHeight: 1.5 }}
                >
                  {exam.audience}
                </p>
                <div
                  className="mt-4 flex flex-wrap items-center gap-2"
                  style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
                >
                  <Pill label="Study guide" status={exam.studyGuideStatus} />
                  <Pill label="Practice tests" status={exam.mockTestStatus} />
                </div>
              </div>
            </article>
          );
          return isReady ? (
            <Link
              key={exam.code}
              href={`/exam/${exam.code}/study` as never}
              className="block transition-colors hover:[&>article]:bg-[var(--color-surface-hover)]"
            >
              {Card}
            </Link>
          ) : (
            <div key={exam.code} aria-disabled="true" style={{ opacity: 0.65 }}>
              {Card}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Pill({ label, status }: { label: string; status: 'available' | 'coming-soon' }) {
  const ok = status === 'available';
  return (
    <span
      style={{
        background: ok ? '#ecfdf5' : 'var(--color-surface)',
        color: ok ? 'var(--color-pass)' : 'var(--color-text-faint)',
        fontWeight: 600,
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--text-xs)',
      }}
    >
      {ok ? '✓' : '○'} {label}
    </span>
  );
}
