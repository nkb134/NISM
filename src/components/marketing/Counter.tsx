'use client';

// Tiny 0 → N counter that ticks up only once, when first scrolled into view.
// IntersectionObserver-gated so it doesn't fire above the fold for users
// who land directly on the hero section.

import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 900;

export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Older browsers (Safari < 12.1): just snap to the final value.
      setValue(to);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || startedRef.current) continue;
          startedRef.current = true;
          obs.disconnect();

          // Respect prefers-reduced-motion: skip the tween, snap to value.
          if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            setValue(to);
            return;
          }

          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION_MS);
            // easeOutQuad
            const eased = 1 - (1 - t) * (1 - t);
            setValue(Math.round(to * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {value.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}
