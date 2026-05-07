'use client';

// 30-second onboarding tour — a small dismissable card in the lower-right
// corner of the dashboard. Shown once per device (localStorage-gated).
//
// Deliberately not a full-screen overlay or anchored-arrow walkthrough:
// solo founder budget, mobile users hate modals, and the dashboard is
// already self-explanatory. This is a "here's the 4 things to know" nudge.

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tour_seen_v1';

type Step = {
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    title: '1. Pick an exam',
    body: 'NISM publishes 18 certifications. V-A is fully loaded; the rest are on the way. Click any card to open its hub.',
  },
  {
    title: '2. Read the chapter, take the test',
    body: 'Each exam has a study guide (Chapter 1 free) and practice tests (one foundational mock free). Sign in unlocks everything.',
  },
  {
    title: '3. Real Schoolnet feel',
    body: 'The runner replicates NISM\'s exam interface — palette, timer, mark-for-review. No surprises on test day.',
  },
  {
    title: '4. Track topic mastery',
    body: 'Your weakest topics surface on the Progress tab so you know exactly where to drill before booking the real exam.',
  },
];

export function ProductTour() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // localStorage can throw in private mode; just don't show.
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  }

  if (!open) return null;
  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  return (
    <aside
      role="dialog"
      aria-labelledby="tour-title"
      className="tour-card"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        left: 16,
        maxWidth: 360,
        marginLeft: 'auto',
        zIndex: 30,
        padding: 16,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          id="tour-title"
          className="font-semibold"
          style={{ fontSize: 'var(--text-md)', color: 'var(--color-text)' }}
        >
          {current.title}
        </h3>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close tour"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: 18,
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
      <p
        className="mt-2"
        style={{
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.55,
        }}
      >
        {current.body}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div
          className="flex gap-1.5"
          aria-label={`Step ${step + 1} of ${STEPS.length}`}
        >
          {STEPS.map((_, i) => (
            <span
              key={i}
              aria-hidden
              style={{
                width: 18,
                height: 4,
                borderRadius: 2,
                background:
                  i === step ? 'var(--color-navy)' : 'var(--color-border)',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {!isLast && (
            <button
              type="button"
              onClick={dismiss}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 8px',
              }}
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={() => (isLast ? dismiss() : setStep((s) => s + 1))}
            style={{
              padding: '7px 14px',
              background: 'var(--color-navy)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isLast ? 'Got it' : 'Next →'}
          </button>
        </div>
      </div>
    </aside>
  );
}
