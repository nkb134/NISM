'use client';

// Test-taking UI. Replicates the NISM Schoolnet feel — dense palette grid,
// big timer, four-state question palette — because the trust signal here is
// "this looks like the real thing." Visual richness lives on the result page,
// not here.
//
// Architecture:
// - Local state: current index, answers map, marked-for-review set, timer.
// - On submit, posts to a server action that re-validates correctIndex from
//   the DB so the client can't score itself a fake pass.
// - Anonymous users (free mock) see the result inline; signed-in users get
//   redirected to /test/result/[attemptId] for review.

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { TakeableQuestion } from '@/lib/db/queries';
import { submitAttempt, type SubmitResult } from '@/app/(app)/exam/[examCode]/test/[setId]/actions';
import { topicColors } from '@/components/topic/TopicChip';
import { ResultInline } from './ResultInline';

type PaletteState = 'unvisited' | 'visited' | 'answered' | 'marked' | 'marked-answered';

type Props = {
  examCode: string;
  examName: string;
  setId: string;
  setName: string;
  durationSeconds: number;
  passMarkPercent: number;
  questions: TakeableQuestion[];
  anonymous: boolean;
};

export function TestRunner(props: Props) {
  const { questions, durationSeconds } = props;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Persisted state. Maps keyed by question id so order shuffles don't lose state.
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [visited, setVisited] = useState<Set<string>>(() => new Set([questions[0]!.id]));
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const startedAtRef = useRef<number>(Date.now());
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [showEndModal, setShowEndModal] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false); // mobile drawer
  const submittedRef = useRef(false);

  // Timer — counts down once per second; auto-submits at 0.
  useEffect(() => {
    if (result) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          if (!submittedRef.current) {
            submittedRef.current = true;
            void doSubmit();
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  // Keyboard shortcuts (desktop): 1-4 select option, M mark/unmark, N next, P prev.
  useEffect(() => {
    if (result) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const q = questions[currentIdx]!;
      if (e.key >= '1' && e.key <= '4') {
        const idx = Number(e.key) - 1;
        if (idx < q.options.length) selectAnswer(q.id, idx);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMarked(q.id);
      } else if (e.key === 'n' || e.key === 'N') {
        goNext();
      } else if (e.key === 'p' || e.key === 'P') {
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, result]);

  function selectAnswer(qid: string, optionIdx: number) {
    setAnswers((a) => ({ ...a, [qid]: optionIdx }));
  }
  function clearAnswer(qid: string) {
    setAnswers((a) => ({ ...a, [qid]: null }));
  }
  function toggleMarked(qid: string) {
    setMarked((m) => {
      const next = new Set(m);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  }
  function goTo(i: number) {
    if (i < 0 || i >= questions.length) return;
    const q = questions[i]!;
    setVisited((v) => {
      if (v.has(q.id)) return v;
      const next = new Set(v);
      next.add(q.id);
      return next;
    });
    setCurrentIdx(i);
    setPaletteOpen(false);
  }
  function goNext() { goTo(currentIdx + 1); }
  function goPrev() { goTo(currentIdx - 1); }

  function paletteState(qid: string): PaletteState {
    const isAnswered = answers[qid] !== undefined && answers[qid] !== null;
    const isMarked = marked.has(qid);
    if (isMarked && isAnswered) return 'marked-answered';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (visited.has(qid)) return 'visited';
    return 'unvisited';
  }

  async function doSubmit() {
    if (submittedRef.current) {
      // Already triggered (e.g. by timer); don't double-fire from the modal.
    }
    submittedRef.current = true;
    setShowEndModal(false);
    const responses = questions.map((q) => ({
      questionId: q.id,
      userAnswerIndex: answers[q.id] ?? null,
      markedForReview: marked.has(q.id),
    }));

    startTransition(async () => {
      const r = await submitAttempt({
        examCode: props.examCode,
        setId: props.setId,
        startedAt: startedAtRef.current,
        responses,
      });
      if (r.ok && r.attemptId) {
        // Signed-in: redirect to the persisted result page so it's shareable.
        router.push(`/exam/${props.examCode}/test/result/${r.attemptId}` as never);
      } else {
        setResult(r);
      }
    });
  }

  // Show inline result for anonymous users; signed-in path redirects.
  if (result && result.ok) {
    return (
      <ResultInline
        examCode={props.examCode}
        examName={props.examName}
        setName={props.setName}
        result={result}
        passMarkPercent={props.passMarkPercent}
      />
    );
  }
  if (result && !result.ok) {
    return (
      <main className="mx-auto max-w-[640px] px-6 py-16 text-center">
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Submission failed</h1>
        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
          {result.error}
        </p>
      </main>
    );
  }

  const total = questions.length;
  const answeredCount = Object.values(answers).filter((a) => a !== null && a !== undefined).length;
  const markedCount = marked.size;
  const notVisitedCount = total - visited.size;
  const current = questions[currentIdx]!;

  return (
    // Full-screen overlay: covers the exam-layout chrome so the runner has
    // the focused, Schoolnet-style "you're in an exam" feel mandated by
    // CLAUDE.md ("Full-screen layout (no marketing nav)").
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-bg)',
        zIndex: 40,
        overflowY: 'auto',
      }}
    >
      <ExamHeader
        setName={props.setName}
        examName={props.examName}
        secondsLeft={secondsLeft}
        durationSeconds={durationSeconds}
        onEndClick={() => setShowEndModal(true)}
        onPaletteClick={() => setPaletteOpen((o) => !o)}
      />

      <div
        className="mx-auto grid max-w-[1200px] gap-5 px-4 py-6 sm:gap-6 sm:px-6 lg:grid-cols-[1fr_300px]"
      >
        {/* Question card */}
        <div className="min-w-0">
          <QuestionCard
            index={currentIdx}
            total={total}
            question={current}
            selectedIndex={answers[current.id] ?? null}
            isMarked={marked.has(current.id)}
            onSelect={(i) => selectAnswer(current.id, i)}
            onClear={() => clearAnswer(current.id)}
            onToggleMark={() => toggleMarked(current.id)}
            onPrev={goPrev}
            onNext={goNext}
            onSubmitClick={() => setShowEndModal(true)}
            isLast={currentIdx === total - 1}
            isFirst={currentIdx === 0}
          />
        </div>

        {/* Palette — sticky on desktop, drawer on mobile */}
        <aside className={`palette-rail ${paletteOpen ? 'palette-rail--open' : ''}`}>
          <PaletteCard
            questions={questions}
            currentIdx={currentIdx}
            paletteState={paletteState}
            answeredCount={answeredCount}
            markedCount={markedCount}
            notVisitedCount={notVisitedCount}
            total={total}
            onJumpTo={goTo}
            onClose={() => setPaletteOpen(false)}
          />
        </aside>
      </div>

      {showEndModal && (
        <EndTestModal
          totalQuestions={total}
          answered={answeredCount}
          marked={markedCount}
          secondsLeft={secondsLeft}
          submitting={pending}
          onCancel={() => setShowEndModal(false)}
          onConfirm={doSubmit}
        />
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ExamHeader({
  setName,
  examName,
  secondsLeft,
  durationSeconds,
  onEndClick,
  onPaletteClick,
}: {
  setName: string;
  examName: string;
  secondsLeft: number;
  durationSeconds: number;
  onEndClick: () => void;
  onPaletteClick: () => void;
}) {
  const danger = secondsLeft <= 60;
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  const elapsedFraction = 1 - secondsLeft / durationSeconds;

  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <div className="min-w-0 flex-1 truncate">
          <div
            className="truncate font-semibold"
            style={{ fontSize: 'var(--text-md)', color: 'var(--color-text)' }}
          >
            {setName}
          </div>
          <div
            className="hidden truncate sm:block"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
          >
            {examName}
          </div>
        </div>

        <div
          className="tabular flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5"
          aria-label={`${m} minutes ${s} seconds remaining`}
          title={`${m}m ${s}s remaining`}
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            background: danger ? '#fef2f2' : 'var(--color-surface)',
            color: danger ? 'var(--color-fail)' : 'var(--color-text)',
            borderRadius: 'var(--radius-md)',
            minWidth: 92,
            justifyContent: 'center',
          }}
        >
          <span aria-hidden>⏱</span>
          <span>{mm}:{ss}</span>
        </div>

        <button
          type="button"
          onClick={onPaletteClick}
          className="lg:hidden"
          aria-label="Open question palette"
          style={{
            padding: '8px 12px',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ☰
        </button>

        <button
          type="button"
          onClick={onEndClick}
          style={{
            padding: '8px 14px',
            background: 'var(--color-navy)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          End Test
        </button>
      </div>

      {/* Slim progress bar under the header — fills as time passes */}
      <div
        aria-hidden
        style={{
          height: 2,
          background: 'var(--color-border-soft)',
          width: '100%',
        }}
      >
        <div
          style={{
            height: 2,
            width: `${elapsedFraction * 100}%`,
            background: danger ? 'var(--color-fail)' : 'var(--color-navy)',
            transition: 'width 1s linear',
          }}
        />
      </div>
    </header>
  );
}

function QuestionCard({
  index,
  total,
  question,
  selectedIndex,
  isMarked,
  onSelect,
  onClear,
  onToggleMark,
  onPrev,
  onNext,
  onSubmitClick,
  isFirst,
  isLast,
}: {
  index: number;
  total: number;
  question: TakeableQuestion;
  selectedIndex: number | null;
  isMarked: boolean;
  onSelect: (i: number) => void;
  onClear: () => void;
  onToggleMark: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmitClick: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const tColor = topicColors(question.topicCode);

  return (
    <article
      className="rounded-xl border"
      style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg)' }}
    >
      <header
        className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="tabular"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: tColor.bg,
              color: tColor.fg,
              letterSpacing: '0.4px',
            }}
          >
            Q {index + 1} of {total}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleMark}
          aria-pressed={isMarked}
          style={{
            padding: '6px 12px',
            background: isMarked ? '#fef3c7' : 'var(--color-bg)',
            color: isMarked ? '#92400e' : 'var(--color-text-muted)',
            border: `1px solid ${isMarked ? '#fcd34d' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isMarked ? '✓ Marked for review' : 'Mark for review'}
        </button>
      </header>

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <p
          className="font-semibold"
          style={{ fontSize: 'var(--text-md)', color: 'var(--color-text)', lineHeight: 1.6 }}
        >
          {question.question}
        </p>

        <ul className="mt-5 flex flex-col gap-2.5">
          {question.options.map((opt, i) => {
            const selected = selectedIndex === i;
            const letter = String.fromCharCode(65 + i);
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-pressed={selected}
                  className="w-full text-left transition-colors"
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    padding: '12px 14px',
                    border: `1px solid ${selected ? 'var(--color-navy)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    background: selected ? '#f0f4ff' : 'var(--color-bg)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-base)',
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
                      border: `2px solid ${selected ? 'var(--color-navy)' : 'var(--color-border)'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: selected ? 'var(--color-navy)' : 'var(--color-bg)',
                      color: selected ? '#fff' : 'var(--color-text-muted)',
                      fontSize: 11,
                      fontWeight: 700,
                      marginTop: 1,
                    }}
                  >
                    {letter}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {selectedIndex !== null && (
          <button
            type="button"
            onClick={onClear}
            className="mt-3"
            style={{
              padding: 0,
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.4px',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Clear answer
          </button>
        )}
      </div>

      <footer
        className="flex items-center justify-between gap-3 border-t px-4 py-3 sm:px-5"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-hover)' }}
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          style={{
            padding: '8px 14px',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: isFirst ? 'not-allowed' : 'pointer',
            opacity: isFirst ? 0.4 : 1,
          }}
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onSubmitClick}
            style={{
              padding: '9px 18px',
              background: 'var(--color-navy)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Submit Test
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            style={{
              padding: '9px 18px',
              background: 'var(--color-navy)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Next →
          </button>
        )}
      </footer>
    </article>
  );
}

function PaletteCard({
  questions,
  currentIdx,
  paletteState,
  answeredCount,
  markedCount,
  notVisitedCount,
  total,
  onJumpTo,
  onClose,
}: {
  questions: TakeableQuestion[];
  currentIdx: number;
  paletteState: (qid: string) => PaletteState;
  answeredCount: number;
  markedCount: number;
  notVisitedCount: number;
  total: number;
  onJumpTo: (i: number) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg)' }}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Question palette</h4>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close palette"
          style={{
            padding: 4,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      <div className="px-4 py-3">
        <h4 className="mb-3 hidden lg:block" style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>
          Questions
        </h4>

        <div className="grid grid-cols-8 gap-1.5">
          {questions.map((q, i) => {
            const s = paletteState(q.id);
            const isCurrent = i === currentIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJumpTo(i)}
                aria-label={`Question ${i + 1}, ${s}`}
                className={`palette-pip palette-pip--${s}`}
                style={{
                  outline: isCurrent ? '2px solid var(--color-navy)' : 'none',
                  outlineOffset: 2,
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5" style={{ fontSize: 'var(--text-xs)' }}>
          <Stat label="Answered" value={answeredCount} colorBg="var(--color-palette-answered-bg)" colorFg="var(--color-palette-answered-text)" />
          <Stat label="Marked" value={markedCount} colorBg="var(--color-palette-marked-bg)" colorFg="var(--color-palette-marked-text)" />
          <Stat label="Visited" value={total - notVisitedCount - answeredCount} colorBg="var(--color-palette-visited-bg)" colorFg="var(--color-palette-visited-text)" />
          <Stat label="Not visited" value={notVisitedCount} colorBg="#fff" colorFg="var(--color-text-muted)" />
        </dl>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  colorBg,
  colorFg,
}: {
  label: string;
  value: number;
  colorBg: string;
  colorFg: string;
}) {
  return (
    <>
      <dt className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
        <span
          aria-hidden
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: colorBg,
            border: `1px solid ${colorFg}`,
            flexShrink: 0,
          }}
        />
        {label}
      </dt>
      <dd className="tabular text-right font-semibold" style={{ color: 'var(--color-text)' }}>
        {value}
      </dd>
    </>
  );
}

function EndTestModal({
  totalQuestions,
  answered,
  marked,
  secondsLeft,
  submitting,
  onCancel,
  onConfirm,
}: {
  totalQuestions: number;
  answered: number;
  marked: number;
  secondsLeft: number;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const m = Math.floor(secondsLeft / 60);
  const skipped = totalQuestions - answered;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-test-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[calc(100vw-32px)] max-w-[480px] rounded-xl"
        style={{
          background: 'var(--color-bg)',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <h3 id="end-test-title" className="font-bold" style={{ fontSize: 'var(--text-lg)' }}>
          End Test?
        </h3>
        <ul
          className="mt-4 flex flex-col gap-1"
          style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
        >
          <li>
            You've answered <strong>{answered} of {totalQuestions}</strong> questions.
          </li>
          {skipped > 0 && (
            <li>
              <strong>{skipped}</strong> {skipped === 1 ? 'is' : 'are'} unanswered — they'll count
              as incorrect.
            </li>
          )}
          {marked > 0 && (
            <li>
              <strong>{marked}</strong> marked for review.
            </li>
          )}
          <li>You have {m} {m === 1 ? 'minute' : 'minutes'} remaining.</li>
        </ul>
        <p
          className="mt-3"
          style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
        >
          This action can't be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
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
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            style={{
              padding: '8px 18px',
              background: 'var(--color-navy)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Submitting…' : 'End Test & Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

