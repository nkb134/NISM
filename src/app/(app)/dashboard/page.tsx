import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/login');
  }

  return (
    <main className="mx-auto max-w-[640px] px-6 py-12">
      <h1 className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>
        Welcome
        {session.user.name ? `, ${session.user.name}` : ''}.
      </h1>
      <p className="mt-2" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)' }}>
        Phase 1 placeholder. Test sets, topic mastery, and recent attempts ship in Phase 2.
      </p>
      <p className="mt-6" style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}>
        Signed in as {session.user.email}.
      </p>
    </main>
  );
}
