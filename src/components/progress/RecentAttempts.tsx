// Recent attempts list. Each row → click to open the persisted result page
// for review. With more than `initialLimit` rows, "Show all" expands.

'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { AttemptRowLite } from '@/lib/db/queries';

function relativeDate(d: Date): string {
  const ms = Date.now() - new Date(d).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}wk ago`;
  return new Date(d).toLocaleDateString();
}

function durationFmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

const INITIAL_LIMIT = 10;

export function RecentAttempts({
  attempts,
  examCode,
}: {
  attempts: AttemptRowLite[];
  examCode: string;
}) {
  const [showAll, setShowAll] = useState(false);

  if (attempts.length === 0) {
    return (
      <section>
        <h2
          className="mb-3 font-semibold uppercase"
          style={{
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.4px',
          }}
        >
          Recent attempts
        </h2>
        <p
          className="rounded-xl border p-8 text-center"
          style={{
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            color: 'var(--color-text-faint)',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.6,
          }}
        >
          No attempts yet. Take the{' '}
          <Link
            href={`/exam/${examCode}/tests` as never}
            style={{ color: 'var(--color-navy)', fontWeight: 600 }}
          >
            free mock test
          </Link>{' '}
          to get a baseline.
        </p>
      </section>
    );
  }

  const visible = showAll ? attempts : attempts.slice(0, INITIAL_LIMIT);
  const remaining = attempts.length - visible.length;

  return (
    <section>
      <header className="mb-3 flex items-center justify-between">
        <h2
          className="font-semibold uppercase"
          style={{
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.4px',
          }}
        >
          Recent attempts
        </h2>
        <span style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}>
          {attempts.length} total
        </span>
      </header>

      <ul
        className="divide-y rounded-xl border"
        style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
      >
        {visible.map((a) => (
          <li key={a.id}>
            <Link
              href={`/exam/${examCode}/test/result/${a.id}` as never}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-surface-hover)] sm:gap-4 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold" style={{ fontSize: 'var(--text-sm)' }}>
                  {a.setName}
                </div>
                <div
                  className="mt-0.5 flex flex-wrap items-center gap-x-2"
                  style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
                >
                  <span>{relativeDate(a.submittedAt)}</span>
                  <span aria-hidden>·</span>
                  <span>
                    {a.correct}/{a.totalQuestions} correct
                  </span>
                  <span aria-hidden>·</span>
                  <span>{durationFmt(a.durationSecondsTaken)}</span>
                </div>
              </div>
              <span
                className="tabular shrink-0 font-bold"
                style={{
                  fontSize: 'var(--text-base)',
                  color: a.passed ? 'var(--color-pass)' : 'var(--color-fail)',
                }}
              >
                {a.scorePercent}% {a.passed ? '✓' : '✗'}
              </span>
              <span aria-hidden style={{ color: 'var(--color-text-faint)' }}>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {!showAll && remaining > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4"
          style={{
            padding: '8px 16px',
            background: 'var(--color-bg)',
            color: 'var(--color-navy)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Show all {attempts.length} attempts
        </button>
      )}
    </section>
  );
}
