// Top nav for marketing pages (landing + per-exam study hub when public).
// Session-aware: signed-out users see "Sign in"; signed-in users see their
// email + a sign-out link.

import Link from 'next/link';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getLocale } from '@/i18n';
import { Brand } from './Brand';
import { SignInButton } from '@/components/auth/SignInButton';
import { LangSwitcher } from './LangSwitcher';

export async function SiteNav() {
  const [session, locale] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getLocale(),
  ]);

  return (
    <header
      className="sticky top-0 z-10 border-b"
      style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
    >
      <div className="mx-auto flex h-14 max-w-[1080px] items-center justify-between gap-3 px-4 sm:px-6">
        <Brand />
        <nav className="flex items-center gap-3 sm:gap-5">
          <LangSwitcher current={locale} />
          <Link
            href={'/dashboard' as never}
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
          >
            All exams
          </Link>
          {session ? (
            <>
              <Link
                href={'/profile' as never}
                className="hidden sm:inline truncate max-w-[160px]"
                style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
                title={session.user.email}
              >
                {session.user.email}
              </Link>
              <Link
                href={'/dashboard' as never}
                className="inline-flex items-center justify-center"
                style={{
                  padding: '6px 14px',
                  background: 'var(--color-navy)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                }}
              >
                Open dashboard
              </Link>
            </>
          ) : (
            <SignInButton />
          )}
        </nav>
      </div>
    </header>
  );
}
