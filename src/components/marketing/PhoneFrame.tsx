// CSS-only phone frame that wraps a screenshot. Used in the hero to embed
// the actual product instead of a stock illustration. The frame is styled
// to feel like a generic flagship Android phone (rounded corners, narrow
// bezel, notch). The screenshot inside lives at its native aspect; the
// frame scales by `width` to maintain proportions.

import Image from 'next/image';

export function PhoneFrame({
  src,
  alt,
  width = 320,
}: {
  src: string;
  alt: string;
  width?: number;
}) {
  // Phone aspect: ~390:844 — match the screenshot we captured.
  const aspect = 844 / 390;
  const height = Math.round(width * aspect);
  const bezel = Math.max(8, Math.round(width * 0.025));
  const radius = Math.max(28, Math.round(width * 0.1));

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        background: '#0b1020',
        padding: bezel,
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 60px -15px rgba(26,31,58,0.35), 0 18px 30px -10px rgba(26,31,58,0.18)',
      }}
      aria-hidden={false}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: radius - bezel,
          overflow: 'hidden',
          background: 'var(--color-bg)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          style={{ objectFit: 'cover', objectPosition: 'top' }}
          priority
        />
      </div>
      {/* Subtle notch */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: bezel + 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: Math.round(width * 0.32),
          height: Math.round(width * 0.06),
          borderRadius: 999,
          background: '#0b1020',
        }}
      />
    </div>
  );
}
