// Horizontal scroller of testimonials. CSS-only on desktop (overflow-x-auto
// + scroll-snap), no JS, no client bundle. Fades the right edge so users see
// there's more to scroll.

import { TESTIMONIALS } from '@/data/marketing/testimonials';
import { TestimonialCard } from './TestimonialCard';

export function TestimonialScroller() {
  return (
    <section
      className="my-16 sm:my-20"
      aria-labelledby="testimonials-heading"
    >
      <header className="mb-6 sm:mb-8 text-center">
        <p
          className="font-semibold uppercase"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.4px',
          }}
        >
          From early users
        </p>
        <h2
          id="testimonials-heading"
          className="mt-2 font-bold"
          style={{ fontSize: 'var(--text-xl)', letterSpacing: '-0.4px' }}
        >
          What people are saying
        </h2>
      </header>

      <div
        className="testimonial-scroll relative -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            style={{ scrollSnapAlign: 'start', flex: '0 0 auto' }}
          >
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>
    </section>
  );
}
