// Counter band for the landing. Server-fetches the live "attempts this week"
// number, then renders four animated counters that tick from 0 → value on
// first scroll into view. Replaces the static hardcoded stats strip.

import { db } from '@/lib/db';
import { attempts } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { EXAM_CATALOG } from '@/data/exam-catalog';
import { listChapters } from '@/lib/study/content';
import { Counter } from './Counter';

async function attemptsThisWeek(): Promise<number> {
  try {
    const rows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(attempts)
      .where(sql`${attempts.submittedAt} >= now() - interval '7 days'`);
    return rows[0]?.count ?? 0;
  } catch {
    // DB hiccup shouldn't break the landing — fall through to 0.
    return 0;
  }
}

export async function LiveCounters() {
  const weekly = await attemptsThisWeek();
  const stats = [
    { label: 'Questions seeded', value: 522, suffix: '' },
    { label: 'Chapters in V-A', value: listChapters('nism-va').length, suffix: '' },
    { label: 'NISM exams catalogued', value: EXAM_CATALOG.length, suffix: '' },
    {
      label: weekly > 0 ? 'Attempts this week' : 'Mock tests live',
      value: weekly > 0 ? weekly : 32,
      suffix: '',
    },
  ];

  return (
    <section
      className="my-12 sm:my-16"
      aria-label="Live numbers"
    >
      <ul
        className="grid grid-cols-2 gap-4 rounded-xl border p-5 sm:grid-cols-4 sm:gap-6 sm:p-7"
        style={{
          borderColor: 'var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-bg)',
        }}
      >
        {stats.map((s) => (
          <li key={s.label} className="text-center">
            <div
              className="tabular font-bold"
              style={{
                fontSize: 'var(--text-2xl)',
                color: 'var(--color-navy)',
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
              }}
            >
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div
              className="mt-1"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.2px',
              }}
            >
              {s.label}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
