import { LoginForm } from './LoginForm';

export const metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[420px] flex-col justify-center px-6 py-16">
      <h1 className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>
        Sign in
      </h1>
      <p className="mt-2" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)' }}>
        We'll email you a one-time link. No password needed.
      </p>
      <LoginForm />
    </main>
  );
}
