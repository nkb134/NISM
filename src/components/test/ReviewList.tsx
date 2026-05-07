'use client';

// Per-question review list with filter pills (All / Wrong / Skipped /
// Marked). Pure client component; reads the persisted responses passed in
// from the server.

import { useMemo, useState } from 'react';
import type { AttemptResponse } from '@/lib/db/schema';
import { TopicChip } from '@/components/topic/TopicChip';

type Filter = 'all' | 'wrong' | 'skipped' | 'marked';

export function ReviewList({ responses }: { responses: AttemptResponse[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    let wrong = 0;
    let skipped = 0;
    let marked = 0;
    for (const r of responses) {
      if (r.userAnswerIndex === null) skipped++;
      else if (!r.isCorrect) wrong++;
      if (r.markedForReview) marked++;
    }
    return { all: responses.length, wrong, skipped, marked };
  }, [responses]);

  const filtered = useMemo(() => {
    return responses
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => {
        if (filter === 'all') return true;
        if (filter === 'wrong') return r.userAnswerIndex !== null && !r.isCorrect;
        if (filter === 'skipped') return r.userAnswerIndex === null;
        if (filter === 'marked') return r.markedForReview;
        return true;
      });
  }, [responses, filter]);

  return (
    <section>
      <h2 className="font-bold" style={{ fontSize: 'var(--text-lg)' }}>
        Review
      </h2>
      <div role="tablist" className="mt-3 flex flex-wrap gap-2">
        <Pill label={`All (${counts.all})`} active={filter === 'all'} onClick={() => setFilter('all')} />
        <Pill
          label={`Wrong (${counts.wrong})`}
          active={filter === 'wrong'}
          onClick={() => setFilter('wrong')}
          tone="fail"
        />
        <Pill
          label={`Skipped (${counts.skipped})`}
          active={filter === 'skipped'}
          onClick={() => setFilter('skipped')}
          tone="warn"
        />
        <Pill
          label={`Marked (${counts.marked})`}
          active={filter === 'marked'}
          onClick={() => setFilter('marked')}
        />
      </div>

      {filtered.length === 0 ? (
        <p
          className="mt-6 rounded-xl border p-8 text-center"
          style={{
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {filter === 'wrong'
            ? 'Nothing wrong. Clean run.'
            : filter === 'skipped'
              ? 'Nothing skipped — every question attempted.'
              : 'No questions match this filter.'}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {filtered.map(({ r, i }) => (
            <ReviewCard key={r.questionId} response={r} index={i} />
          ))}
        </ul>
      )}
    </section>
  );
}

function Pill({
  label,
  active,
  onClick,
  tone,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: 'fail' | 'warn';
}) {
  const activeBg = active ? 'var(--color-navy)' : 'var(--color-bg)';
  const activeFg = active ? '#fff' : tone === 'fail' ? 'var(--color-fail)' : tone === 'warn' ? 'var(--color-warn)' : 'var(--color-text-muted)';
  const border = active ? 'var(--color-navy)' : 'var(--color-border)';
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      style={{
        padding: '6px 14px',
        background: activeBg,
        color: activeFg,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

function ReviewCard({
  response,
  index,
}: {
  response: AttemptResponse;
  index: number;
}) {
  const q = response.questionSnapshot;
  const userIdx = response.userAnswerIndex;
  const status: 'correct' | 'wrong' | 'skipped' =
    userIdx === null ? 'skipped' : response.isCorrect ? 'correct' : 'wrong';

  const statusColor =
    status === 'correct'
      ? { bg: '#ecfdf5', fg: 'var(--color-pass)' }
      : status === 'wrong'
        ? { bg: '#fef2f2', fg: 'var(--color-fail)' }
        : { bg: 'var(--color-surface)', fg: 'var(--color-text-faint)' };

  return (
    <li
      className="rounded-xl border"
      style={{
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-bg)',
      }}
    >
      <div
        className="flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-5"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span
          className="tabular"
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            background: statusColor.bg,
            color: statusColor.fg,
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
          }}
        >
          Q {index + 1} · {status === 'correct' ? '✓ Correct' : status === 'wrong' ? '✗ Wrong' : '— Skipped'}
        </span>
        <TopicChip code={q.topicCode} />
        {response.markedForReview && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: '#92400e',
              background: '#fef3c7',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Marked for review
          </span>
        )}
      </div>

      <div className="px-4 py-4 sm:px-5">
        <p
          className="font-semibold"
          style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}
        >
          {q.question}
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isUser = i === userIdx;
            let bg = 'var(--color-bg)';
            let border = 'var(--color-border)';
            let icon: string | null = null;
            if (isCorrect) {
              bg = '#ecfdf5';
              border = '#a7f3d0';
              icon = '✓';
            } else if (isUser && !isCorrect) {
              bg = '#fef2f2';
              border = '#fecaca';
              icon = '✗';
            }
            const letter = String.fromCharCode(65 + i);
            return (
              <li
                key={i}
                className="flex items-start gap-3 px-3 py-2.5"
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text)',
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 22,
                    height: 22,
                    flexShrink: 0,
                    borderRadius: 999,
                    border: `1px solid ${border}`,
                    background: 'var(--color-bg)',
                    color: isCorrect
                      ? 'var(--color-pass)'
                      : isUser && !isCorrect
                        ? 'var(--color-fail)'
                        : 'var(--color-text-muted)',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {icon ?? letter}
                </span>
                <span className="flex-1">
                  {opt}
                  {isUser && (
                    <span
                      className="ml-2"
                      style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
                    >
                      Your answer
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <aside
          className="mt-4 rounded-lg p-3 sm:p-4"
          style={{
            background: 'var(--color-surface-hover)',
            borderLeft: '3px solid var(--color-accent)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text)',
            lineHeight: 1.6,
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
        >
          <strong style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.4px', color: 'var(--color-text-muted)' }}>
            EXPLANATION
          </strong>
          <p className="mt-1.5">{q.explanation}</p>
        </aside>
      </div>
    </li>
  );
}
