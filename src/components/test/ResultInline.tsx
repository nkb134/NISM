'use client';

// Inline result for anonymous users (free-mock takers). No persisted attempt,
// so we render the score + topic breakdown right in the runner's place. We
// don't show per-question review since we'd need the question snapshots —
// pushing the user to sign in for that is the right conversion moment.

import Link from 'next/link';
import { ScoreArc } from './ScoreArc';
import { TopicBreakdown } from './TopicBreakdown';

type SuccessResult = {
  ok: true;
  attempted: number;
  correct: number;
  total: number;
  scorePercent: number;
  passed: boolean;
  topicBreakdown: Record<string, { total: number; correct: number; percent: number }>;
};

export function ResultInline({
  examCode,
  examName,
  setName,
  result,
  passMarkPercent,
}: {
  examCode: string;
  examName: string;
  setName: string;
  result: SuccessResult;
  passMarkPercent: number;
}) {
  const skipped = result.total - result.attempted;

  return (
    <main className="mx-auto max-w-[760px] px-4 py-10 sm:px-6">
      {/* Hero result band */}
      <section
        className="rounded-xl border p-6 sm:p-8"
        style={{
          background: result.passed
            ? 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)'
            : 'linear-gradient(135deg, #fef2f2 0%, #ffffff 60%)',
          borderColor: result.passed ? '#a7f3d0' : '#fecaca',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p
              className="font-semibold"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}
            >
              {examName}
            </p>
            <h1
              className="mt-1 font-bold"
              style={{ fontSize: 'var(--text-xl)', lineHeight: 1.2 }}
            >
              {setName}
            </h1>
            <p
              className="mt-3"
              style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
            >
              {result.passed
                ? `Cleared with ${result.scorePercent - passMarkPercent} marks of cushion. Solid.`
                : `${passMarkPercent - result.scorePercent} marks short of pass. Keep grinding.`}
            </p>
          </div>
          <div className="shrink-0 self-center">
            <ScoreArc
              scorePercent={result.scorePercent}
              passed={result.passed}
              passMarkPercent={passMarkPercent}
            />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <Stat label="Attempted" value={result.attempted} />
          <Stat label="Correct" value={result.correct} tone="pass" />
          <Stat label="Skipped" value={skipped} tone={skipped > 0 ? 'warn' : undefined} />
        </dl>
      </section>

      {/* Topic breakdown */}
      <div className="mt-10">
        <TopicBreakdown topicBreakdown={result.topicBreakdown} />
      </div>

      {/* Conversion CTA — anonymous flow */}
      <section
        className="mt-10 rounded-xl border p-5 sm:p-6"
        style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface-hover)' }}
      >
        <h2 className="font-bold" style={{ fontSize: 'var(--text-lg)' }}>
          Save this result + see what you got wrong
        </h2>
        <p
          className="mt-2 max-w-[520px]"
          style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
        >
          Sign in (no password needed) to keep this attempt, see the per-question explanations,
          and unlock the other 31 mock tests + topic-wise sets.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={'/login' as never}
            className="inline-flex items-center justify-center"
            style={{
              padding: '10px 18px',
              background: 'var(--color-navy)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            Sign in to save
          </Link>
          <Link
            href={`/exam/${examCode}/study` as never}
            className="inline-flex items-center justify-center border"
            style={{
              padding: '10px 18px',
              borderColor: 'var(--color-border)',
              color: 'var(--color-navy)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            Read the study guide
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'pass' | 'warn';
}) {
  const color =
    tone === 'pass'
      ? 'var(--color-pass)'
      : tone === 'warn'
        ? 'var(--color-warn)'
        : 'var(--color-text)';
  return (
    <div
      className="rounded-lg border p-3 text-center"
      style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg)' }}
    >
      <div
        className="font-semibold uppercase"
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.4px',
        }}
      >
        {label}
      </div>
      <div
        className="tabular mt-1 font-bold"
        style={{ fontSize: 'var(--text-2xl)', color }}
      >
        {value}
      </div>
    </div>
  );
}
