import { initialsOf, type Testimonial } from '@/data/marketing/testimonials';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #14b8a6, #06b6d4)',
  'linear-gradient(135deg, #f97316, #ef4444)',
  'linear-gradient(135deg, #84cc16, #10b981)',
  'linear-gradient(135deg, #ec4899, #d946ef)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
];

function pickGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_GRADIENTS[Math.abs(h) % AVATAR_GRADIENTS.length]!;
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  const langAttr = t.lang === 'hi' ? 'hi' : t.lang === 'hi-en' ? 'hi-Latn' : 'en';

  return (
    <article
      className="flex h-full min-w-[280px] max-w-[320px] flex-col gap-3 rounded-xl border p-5"
      style={{
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-bg)',
      }}
    >
      <p
        lang={langAttr}
        style={{
          color: 'var(--color-text)',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        “{t.quote}”
      </p>
      <footer className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex shrink-0 items-center justify-center font-semibold"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: pickGradient(t.id),
            color: '#fff',
            fontSize: 13,
            letterSpacing: '0.4px',
          }}
        >
          {initialsOf(t.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div
            className="truncate font-semibold"
            style={{ color: 'var(--color-text)', fontSize: 'var(--text-xs)' }}
          >
            {t.name}
          </div>
          <div
            className="truncate"
            style={{ color: 'var(--color-text-muted)', fontSize: 11, letterSpacing: '0.2px' }}
          >
            {t.city} · {t.prepTag}
          </div>
        </div>
      </footer>
    </article>
  );
}
