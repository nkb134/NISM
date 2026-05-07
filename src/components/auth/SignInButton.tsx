'use client';

// Client island used inside the otherwise-server-rendered SiteNav. Owns the
// LoginModal's open state and reads the current pathname so post-sign-in
// brings the user back to where they were.

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LoginModal } from './LoginModal';

export function SignInButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '/dashboard';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center"
        style={{
          padding: '6px 14px',
          background: 'var(--color-navy)',
          color: '#fff',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Sign in
      </button>
      <LoginModal open={open} onClose={() => setOpen(false)} next={pathname} />
    </>
  );
}
