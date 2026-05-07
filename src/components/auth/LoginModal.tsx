'use client';

// Modal sign-in dialog. Uses the native <dialog> element so ESC-to-close,
// focus-trapping, and backdrop click are all browser-handled.
//
// The standalone /login page still exists and is the canonical destination
// for ?next= redirects from gated pages — this modal is the inline shortcut
// for users browsing the public landing or catalog.

import { useEffect, useRef } from 'react';
import { LoginForm } from '@/app/(auth)/login/LoginForm';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Where to send the user after sign-in. Defaults to current pathname. */
  next?: string;
};

export function LoginModal({ open, onClose, next }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Click on backdrop = the dialog itself (children sit inside an inner
      // wrapper). Closing on backdrop click matches DESIGN.md modal pattern.
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="login-modal"
      aria-labelledby="login-modal-title"
    >
      <div className="login-modal-inner">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="login-modal-title"
              className="font-bold"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              Sign in
            </h2>
            <p
              className="mt-1"
              style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
            >
              We'll email you a one-time link. No password needed.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              color: 'var(--color-text-muted)',
              padding: 4,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        <LoginForm next={next} />
      </div>
    </dialog>
  );
}
