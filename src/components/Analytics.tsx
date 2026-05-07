// Server wrapper: reads the current session and forwards user identity to
// the client bootstrap. Rendered once in the root layout.
//
// Why server-side: we can compute `isNewSignup` from `users.createdAt` (only
// available in the DB) without exposing the timestamp to JS.

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { AnalyticsBootstrap } from './AnalyticsBootstrap';

const SIGNUP_WINDOW_MS = 5 * 60 * 1000;

export async function Analytics() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return <AnalyticsBootstrap userId={null} />;

  let isNewSignup = false;
  try {
    const rows = await db
      .select({ createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);
    const created = rows[0]?.createdAt;
    if (created && Date.now() - new Date(created).getTime() < SIGNUP_WINDOW_MS) {
      isNewSignup = true;
    }
  } catch {
    // DB hiccup shouldn't break the layout — fall through with isNewSignup=false.
  }

  return (
    <AnalyticsBootstrap
      userId={session.user.id}
      email={session.user.email}
      isNewSignup={isNewSignup}
    />
  );
}
