// Brand mark for the top nav. Same gradient + lime "N" used in DESIGN.md.
// Used across landing + dashboard nav.

import Link from 'next/link';

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <Link href={'/' as never} className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-extrabold"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy), var(--color-navy-deeper))',
          color: 'var(--color-accent)',
          fontSize: 'var(--text-base)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        N
      </span>
      <span className="leading-tight">
        <span className="block font-semibold tracking-[0.2px]" style={{ fontSize: 'var(--text-md)' }}>
          NISMPracticeTests
        </span>
        {subtitle && (
          <span className="block" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}
