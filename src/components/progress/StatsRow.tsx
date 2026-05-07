// Four-card stats row for the per-exam progress page. Mirrors the
// dashboard pattern from DESIGN.md — uppercase label, big number,
// small sub-text. Pass/fail tint applies only to score-flavored cards.

import type { AttemptStats } from '@/lib/db/queries';

export function StatsRow({
  stats,
  passMarkPercent,
}: {
  stats: AttemptStats;
  passMarkPercent: number;
}) {
  const ratio =
    stats.testsTaken === 0 ? 0 : Math.round((stats.passedCount / stats.testsTaken) * 100);

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <Card label="Tests taken" value={stats.testsTaken} />
      <Card
        label="Avg score"
        value={`${stats.avgScore}%`}
        tone={stats.testsTaken === 0 ? undefined : stats.avgScore >= passMarkPercent ? 'pass' : 'fail'}
      />
      <Card
        label="Best score"
        value={`${stats.bestScore}%`}
        tone={stats.testsTaken === 0 ? undefined : stats.bestScore >= passMarkPercent ? 'pass' : 'fail'}
      />
      <Card
        label="Pass rate"
        value={`${ratio}%`}
        sub={
          stats.testsTaken > 0
            ? `${stats.passedCount} / ${stats.testsTaken} cleared`
            : undefined
        }
      />
    </ul>
  );
}

function Card({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: 'pass' | 'fail';
}) {
  const valueColor =
    tone === 'pass'
      ? 'var(--color-pass)'
      : tone === 'fail'
        ? 'var(--color-fail)'
        : 'var(--color-text)';
  return (
    <li
      className="rounded-xl border p-4 sm:p-5"
      style={{
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-bg)',
      }}
    >
      <div
        className="font-semibold uppercase"
        style={{
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.4px',
        }}
      >
        {label}
      </div>
      <div
        className="tabular mt-1.5 font-bold"
        style={{ fontSize: 'var(--text-2xl)', color: valueColor }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="mt-1"
          style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
        >
          {sub}
        </div>
      )}
    </li>
  );
}
