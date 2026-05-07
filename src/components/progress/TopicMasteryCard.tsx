// Topic mastery view: each row = one topic with a colored progress bar
// (recency-weighted). Shows where to drill next.
//
// CLAUDE.md says: "<50% red, 50-75% amber, ≥75% green, no attempts gray".
// We respect that for the percentage label and the bar fill.
//
// "Practice →" link appears for topics below 75%, deep-linking to the
// topic's foundational set on the tests hub.

import Link from 'next/link';
import { TopicChip, topicColors, topicLabel } from '@/components/topic/TopicChip';
import { NISM_VA_TOPICS, type TopicCode } from '@/lib/topics';
import type { TopicMasteryRow } from '@/lib/db/queries';

function relativeDate(d: Date | null): string {
  if (!d) return '';
  const ms = Date.now() - new Date(d).getTime();
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} wk ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

function tone(percent: number): 'weak' | 'mid' | 'strong' {
  if (percent < 50) return 'weak';
  if (percent < 75) return 'mid';
  return 'strong';
}

const TONE_COLOR = {
  weak: 'var(--color-fail)',
  mid: 'var(--color-warn)',
  strong: 'var(--color-pass)',
} as const;

export function TopicMasteryCard({
  rows,
  examCode,
}: {
  rows: TopicMasteryRow[];
  examCode: string;
}) {
  // Render one row per topic in the exam, even if there's no data for it
  // — surfaces "untested" gaps so the user knows what they haven't drilled.
  const allTopicCodes = Object.keys(NISM_VA_TOPICS) as TopicCode[];
  const byCode: Record<string, TopicMasteryRow> = {};
  for (const r of rows) byCode[r.topicCode] = r;

  // Order: weakest with data first, then untested at bottom.
  const sorted = allTopicCodes
    .map((code) => ({ code, row: byCode[code] }))
    .sort((a, b) => {
      if (!a.row && !b.row) return NISM_VA_TOPICS[a.code].order - NISM_VA_TOPICS[b.code].order;
      if (!a.row) return 1;
      if (!b.row) return -1;
      return a.row.weightedPercent - b.row.weightedPercent;
    });

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
          Topic mastery
        </h2>
        <span
          style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
          title="Recent attempts weighted more (14-day half-life)"
        >
          Recency-weighted
        </span>
      </header>

      <ul
        className="divide-y rounded-xl border"
        style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
      >
        {sorted.map(({ code, row }) => (
          <Row key={code} code={code} row={row} examCode={examCode} />
        ))}
      </ul>
    </section>
  );
}

function Row({
  code,
  row,
  examCode,
}: {
  code: TopicCode;
  row: TopicMasteryRow | undefined;
  examCode: string;
}) {
  const c = topicColors(code);
  const noData = !row;
  const pct = row?.weightedPercent ?? 0;
  const t = noData ? null : tone(pct);

  return (
    <li className="px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <TopicChip code={code} />
        <div className="flex items-center gap-3">
          {noData ? (
            <span
              style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
            >
              —
            </span>
          ) : (
            <span
              className="tabular"
              style={{ color: TONE_COLOR[t!], fontSize: 'var(--text-sm)', fontWeight: 700 }}
            >
              {pct}%{' '}
              <span style={{ color: 'var(--color-text-faint)', fontWeight: 500 }}>
                ({row.correct}/{row.total})
              </span>
            </span>
          )}
        </div>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full"
        style={{ background: 'var(--color-border-soft)' }}
      >
        <div
          style={{
            height: '100%',
            width: noData ? 0 : `${pct}%`,
            background: c.fg,
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>

      <div
        className="mt-1.5 flex items-center justify-between"
        style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
      >
        <span>
          {noData
            ? 'Not yet attempted'
            : `Last answered ${relativeDate(row.lastAnsweredAt)}`}
        </span>
        {(noData || pct < 75) && (
          <Link
            href={`/exam/${examCode}/tests` as never}
            style={{ color: 'var(--color-navy)', fontWeight: 600 }}
          >
            Practice {topicLabel(code).split(' ')[0]} →
          </Link>
        )}
      </div>
    </li>
  );
}
