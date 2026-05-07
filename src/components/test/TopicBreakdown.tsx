// Topic-wise score breakdown. Each topic gets a colored bar using the topic
// palette so the user can see exactly which topics dragged them down.

import { TopicChip, topicColors, topicLabel } from '@/components/topic/TopicChip';

type Row = { topicCode: string; total: number; correct: number; percent: number };

export function TopicBreakdown({
  topicBreakdown,
}: {
  topicBreakdown: Record<string, { total: number; correct: number; percent: number }>;
}) {
  const rows: Row[] = Object.entries(topicBreakdown)
    .map(([code, v]) => ({ topicCode: code, ...v }))
    .sort((a, b) => a.percent - b.percent);

  if (rows.length === 0) return null;

  return (
    <section>
      <h2
        className="mb-3 font-semibold"
        style={{
          fontSize: 'var(--text-md)',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}
      >
        By topic
      </h2>
      <ul className="flex flex-col gap-3">
        {rows.map((r) => {
          const c = topicColors(r.topicCode);
          const tone =
            r.percent >= 75
              ? 'var(--color-pass)'
              : r.percent >= 50
                ? 'var(--color-warn)'
                : 'var(--color-fail)';

          return (
            <li
              key={r.topicCode}
              className="rounded-lg border p-3 sm:p-4"
              style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}
            >
              <div className="flex items-center justify-between gap-3">
                <TopicChip code={r.topicCode} />
                <span
                  className="tabular shrink-0"
                  style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: tone }}
                >
                  {r.percent}%{' '}
                  <span style={{ color: 'var(--color-text-faint)', fontWeight: 500 }}>
                    ({r.correct}/{r.total})
                  </span>
                </span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full"
                style={{ background: 'var(--color-border-soft)' }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${r.percent}%`,
                    background: c.fg,
                    transition: 'width 0.6s ease-out',
                  }}
                />
              </div>
              {r.percent < 75 && (
                <p
                  className="mt-1.5"
                  style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
                >
                  Weak — re-read{' '}
                  <span style={{ fontWeight: 600 }}>{topicLabel(r.topicCode)}</span> chapter.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
