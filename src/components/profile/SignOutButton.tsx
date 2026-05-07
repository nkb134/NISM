'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await signOut();
      // Drop the PostHog distinct id so the next session starts anonymous
      // — prevents identity leakage on a shared device.
      try {
        window.localStorage.removeItem('ph_did');
      } catch {
        // localStorage can throw in private mode; ignore.
      }
      router.push('/');
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      style={{
        padding: '8px 16px',
        background: 'var(--color-bg)',
        color: 'var(--color-fail)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        cursor: pending ? 'wait' : 'pointer',
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
