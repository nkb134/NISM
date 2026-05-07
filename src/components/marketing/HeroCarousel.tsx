'use client';

// Hero carousel — three real product screens cross-fading through a
// phone-frame chassis. Each slide ships with a "super copy" overlay that
// names the feature in one breath:
//
//   1. Study guide      — "Read in three depths"
//   2. Mock test        — "Real Schoolnet feel"
//   3. Result + review  — "Every wrong answer, explained"
//
// Auto-cycles every TICK_MS. User can click the dot indicators to jump.
// Pauses on hover/focus so they can actually read the super copy.

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { PhoneFrame } from './PhoneFrame';

// Founder asked for 1 second; tune here.
const TICK_MS = 1000;
const FADE_MS = 350;

type Slide = {
  src: string;
  alt: string;
  /** Tiny lime label, top of card. Sets the bucket. */
  badge: string;
  /** Big bold copy, the moment. Two lines max. */
  headline: string;
  /** One-line plain English under the headline. */
  detail: string;
};

const SLIDES: Slide[] = [
  {
    src: '/images/hero-study.webp',
    alt: 'A V-A study chapter with the three reading-depth tabs (Summary / Detail / Memory) visible at the top.',
    badge: 'Study guide',
    headline: 'Read in three depths.',
    detail: '🎯 Summary, 📖 Detail, 🧠 Memory hooks — pick your gear.',
  },
  {
    src: '/images/hero-test.webp',
    alt: 'A NISM mock test mid-attempt: timer, question palette with green answered pips, multiple-choice options.',
    badge: 'Mock tests',
    headline: 'Real Schoolnet feel.',
    detail: 'Question palette, mark-for-review, the timer that ticks red <60s.',
  },
  {
    src: '/images/hero-result.webp',
    alt: 'A result page showing a 78% pass score arc, stats grid, and topic breakdown with weak topics highlighted.',
    badge: 'Reviews',
    headline: 'Every wrong answer, explained.',
    detail: 'Score arc, topic breakdown, weakest-first drill list.',
  },
];

export function HeroCarousel({ width = 300 }: { width?: number }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, TICK_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const current = SLIDES[active]!;

  return (
    <div
      className="hero-carousel relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{ width: 'fit-content' }}
    >
      {/* Super copy chip — sits above the phone, animates with the slide */}
      <div
        className="mb-3 flex max-w-[300px] flex-col items-start"
        aria-live="polite"
        style={{ minHeight: 78 }}
      >
        <span
          key={`badge-${active}`}
          className="hero-carousel-fade inline-flex items-center gap-1.5"
          style={{
            padding: '4px 10px',
            background: 'var(--color-navy)',
            color: 'var(--color-accent)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {current.badge}
        </span>
        <p
          key={`headline-${active}`}
          className="hero-carousel-fade mt-2 font-bold tracking-tight"
          style={{
            fontSize: 'clamp(16px, 2.4vw, 20px)',
            lineHeight: 1.2,
            color: 'var(--color-text)',
            letterSpacing: '-0.2px',
          }}
        >
          {current.headline}
          <span
            className="ml-2 font-normal"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
          >
            {current.detail}
          </span>
        </p>
      </div>

      {/* Glow layer behind the phone */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '15% -8% 8% -8%',
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(163,230,53,0.16) 0%, rgba(26,31,58,0) 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />

      <PhoneFrame width={width}>
        {/* Stack all 3 slides; only the active one is visible (fade between) */}
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            aria-hidden={i !== active}
            className="hero-carousel-slide"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: i === active ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes={`${width}px`}
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              priority={i === 0}
            />
          </div>
        ))}
      </PhoneFrame>

      {/* Dot indicators */}
      <div
        role="tablist"
        aria-label="Hero carousel"
        className="mt-4 flex items-center justify-center gap-2"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show slide ${i + 1}: ${s.badge}`}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 999,
              border: 'none',
              background: i === active ? 'var(--color-navy)' : 'var(--color-border)',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.2s ease, background 0.2s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
