import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[640px] flex-col justify-center px-6 py-16">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg font-extrabold"
          style={{
            background: 'linear-gradient(135deg, var(--color-navy), var(--color-navy-deeper))',
            color: 'var(--color-accent)',
            fontSize: 'var(--text-base)',
          }}
        >
          N
        </span>
        <div>
          <div className="font-semibold tracking-[0.2px]" style={{ fontSize: 'var(--text-md)' }}>
            NISMPracticeTests
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            NISM V-A Mock Exams
          </div>
        </div>
      </div>

      <h1 className="mt-12 font-bold" style={{ fontSize: 'var(--text-xl)' }}>
        Free practice tests for NISM Series V-A.
      </h1>
      <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)' }}>
        530+ questions across 32 sets. Topic mastery analytics. Mock exams that match the real
        Schoolnet interface. No payments, no ads, no spam.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold transition-colors hover:opacity-95"
          style={{
            background: 'var(--color-navy)',
            color: '#fff',
            fontSize: 'var(--text-base)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Sign in to start
        </Link>
      </div>

      <p className="mt-16" style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}>
        Phase 1 placeholder — landing page is wired to /login. Full marketing layout ships in Phase
        3.
      </p>
    </main>
  );
}
