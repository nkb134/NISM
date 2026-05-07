'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth-client';

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; msg: string };

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: 'sending' });
    const { error } = await signIn.magicLink({
      email,
      callbackURL: '/dashboard',
    });
    if (error) {
      setState({ kind: 'error', msg: error.message ?? 'Could not send link.' });
      return;
    }
    setState({ kind: 'sent' });
  }

  async function handleGoogle() {
    await signIn.social({ provider: 'google', callbackURL: '/dashboard' });
  }

  if (state.kind === 'sent') {
    return (
      <div className="mt-6 rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <p style={{ fontSize: 'var(--text-base)' }}>
          Check your email — the link expires in 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleMagicLink} className="mt-6 flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="rounded-md border px-3 py-2 outline-none"
          style={{
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
          }}
        />
      </label>
      <button
        type="submit"
        disabled={state.kind === 'sending'}
        className="rounded-md px-4 py-2 font-semibold disabled:opacity-60"
        style={{
          background: 'var(--color-navy)',
          color: '#fff',
          fontSize: 'var(--text-base)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        {state.kind === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
      </button>

      {state.kind === 'error' && (
        <p style={{ color: 'var(--color-fail)', fontSize: 'var(--text-sm)' }}>{state.msg}</p>
      )}

      <div
        className="my-2 flex items-center gap-3 text-center"
        style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
      >
        <span className="flex-1 border-t" style={{ borderColor: 'var(--color-border)' }} />
        <span>or</span>
        <span className="flex-1 border-t" style={{ borderColor: 'var(--color-border)' }} />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="rounded-md border px-4 py-2 font-semibold"
        style={{
          color: 'var(--color-navy)',
          borderColor: 'var(--color-border)',
          fontSize: 'var(--text-base)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        Continue with Google
      </button>
    </form>
  );
}
