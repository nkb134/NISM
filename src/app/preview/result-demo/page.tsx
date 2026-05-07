// Demo result page rendered with seeded sample data. Public, unlinked, used
// only for marketing screenshots — gives us a flattering "passed at 78%"
// hero shot without needing real DB state or knowledge of correct answers.
//
// Renders as close to the real result page as possible using the same
// components (ScoreArc, TopicBreakdown), so visual drift between this and
// the actual product stays minimal.
//
// Not indexed (robots: noindex). Not in sitemap.

import { ScoreArc } from '@/components/test/ScoreArc';
import { TopicBreakdown } from '@/components/test/TopicBreakdown';

export const metadata = {
  title: 'Result preview',
  robots: { index: false, follow: false },
};

const SAMPLE = {
  scorePercent: 78,
  passed: true,
  passMarkPercent: 50,
  totalQuestions: 30,
  attempted: 30,
  correct: 23,
  cushion: 28, // 78 - 50
  setName: 'Mock Test 1 — 30Q (foundational mix)',
  examShort: 'NISM Series V-A',
  topicBreakdown: {
    REG: { total: 5, correct: 5, percent: 100 },
    OPS: { total: 5, correct: 4, percent: 80 },
    PRF: { total: 4, correct: 3, percent: 75 },
    INV: { total: 3, correct: 2, percent: 67 },
    NAV: { total: 4, correct: 3, percent: 75 },
    STR: { total: 3, correct: 2, percent: 67 },
    TAX: { total: 3, correct: 1, percent: 33 },
    SCH: { total: 3, correct: 3, percent: 100 },
  },
};

export default function ResultDemoPage() {
  const skipped = SAMPLE.totalQuestions - SAMPLE.attempted;
  const wrong = SAMPLE.attempted - SAMPLE.correct;

  return (
    <main className="mx-auto max-w-[920px] px-4 py-10 sm:px-6">
      <section
        className="rounded-xl border p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)',
          borderColor: '#a7f3d0',
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
              {SAMPLE.examShort}
            </p>
            <h1
              className="mt-1 font-bold"
              style={{ fontSize: 'var(--text-xl)', lineHeight: 1.2 }}
            >
              {SAMPLE.setName}
            </h1>
            <p
              className="mt-3"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.6,
              }}
            >
              Cleared with {SAMPLE.cushion} marks of cushion. Solid.
            </p>
            <p
              className="mt-3 tabular"
              style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
            >
              Took 24m 18s · Submitted just now
            </p>
          </div>
          <div className="shrink-0 self-center">
            <ScoreArc
              scorePercent={SAMPLE.scorePercent}
              passed={SAMPLE.passed}
              passMarkPercent={SAMPLE.passMarkPercent}
            />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Stat label="Total" value={SAMPLE.totalQuestions} />
          <Stat label="Correct" value={SAMPLE.correct} tone="pass" />
          <Stat label="Wrong" value={wrong} tone={wrong > 0 ? 'fail' : undefined} />
          <Stat label="Skipped" value={skipped} tone={skipped > 0 ? 'warn' : undefined} />
        </dl>
      </section>

      <div className="mt-10">
        <TopicBreakdown topicBreakdown={SAMPLE.topicBreakdown} />
      </div>
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
  tone?: 'pass' | 'warn' | 'fail';
}) {
  const color =
    tone === 'pass'
      ? 'var(--color-pass)'
      : tone === 'warn'
        ? 'var(--color-warn)'
        : tone === 'fail'
          ? 'var(--color-fail)'
          : 'var(--color-text)';
  return (
    <div
      className="rounded-lg border p-3 text-center"
      style={{
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg)',
      }}
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
      <div className="tabular mt-1 font-bold" style={{ fontSize: 'var(--text-2xl)', color }}>
        {value}
      </div>
    </div>
  );
}
