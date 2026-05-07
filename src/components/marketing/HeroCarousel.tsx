'use client';

// Hero carousel — three real product screens cross-fading through a
// notch-off phone-frame chassis. Super copy is overlaid on the bottom
// third of the screen with a translucent dark gradient so it reads on
// top of any slide background. Auto-cycles every TICK_MS, pauses on
// hover/focus.

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { PhoneFrame } from './PhoneFrame';

const TICK_MS = 3500;
const FADE_MS = 400;

type Slide = {
  src: string;
  alt: string;
  badge: string;
  headline: string;
  detail: string;
};

const SLIDES: Slide[] = [
  {
    src: '/images/hero-study.webp',
    alt: 'A V-A study chapter with the three reading-depth tabs (Summary / Detail / Memory) visible at the top.',
    badge: 'Study guide',
    headline: 'Read in three depths.',
    detail: '🎯 Summary · 📖 Detail · 🧠 Memory hooks',
  },
  {
    src: '/images/hero-test.webp',
    alt: 'A NISM mock test mid-attempt: timer, question palette with green answered pips, multiple-choice options.',
    badge: 'Mock tests',
    headline: 'Real Schoolnet feel.',
    detail: 'Palette, timer, mark-for-review — same as the actual exam.',
  },
  {
    src: '/images/hero-result.webp',
    alt: 'A result page showing a 78% pass score arc, stats grid, and topic breakdown with weak topics highlighted.',
    badge: 'Reviews',
    headline: 'Every wrong answer, explained.',
    detail: 'Score arc · topic breakdown · weakest-first drill list.',
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

  return (
    <div
      className="hero-carousel relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{ width: 'fit-content' }}
    >
      {/* Glow layer behind the phone */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '8% -8% 8% -8%',
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(163,230,53,0.16) 0%, rgba(26,31,58,0) 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />

      <PhoneFrame width={width}>
        {/* Slide stack — only the active one is opaque */}
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            aria-hidden={i !== active}
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

        {/* Super-copy overlay on the bottom third of the screen.
         * The gradient fades from transparent at the top so the slide
         * remains visible up there, to opaque navy near the bottom for
         * legibility of the headline. */}
        <div
          aria-live="polite"
          style={{
            position: 'absolute',
            inset: '64% 0 0 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '14px 18px 18px',
            background:
              'linear-gradient(180deg, rgba(11,16,32,0) 0%, rgba(11,16,32,0.6) 35%, rgba(11,16,32,0.92) 75%)',
            pointerEvents: 'none',
          }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={`copy-${s.src}`}
              aria-hidden={i !== active}
              style={{
                position: 'absolute',
                inset: '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '14px 18px 18px',
                opacity: i === active ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease-in-out`,
              }}
            >
              <span
                className="inline-flex w-fit items-center"
                style={{
                  padding: '3px 8px',
                  background: 'var(--color-accent)',
                  color: 'var(--color-navy)',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {s.badge}
              </span>
              <h3
                className="font-bold tracking-tight"
                style={{
                  marginTop: 8,
                  fontSize: 18,
                  lineHeight: 1.2,
                  color: '#fff',
                  letterSpacing: '-0.3px',
                }}
              >
                {s.headline}
              </h3>
              <p
                className="mt-1"
                style={{
                  color: 'rgba(255,255,255,0.78)',
                  fontSize: 12,
                  lineHeight: 1.45,
                }}
              >
                {s.detail}
              </p>
            </div>
          ))}
        </div>
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
