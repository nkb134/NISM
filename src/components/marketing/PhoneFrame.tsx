// CSS-only phone frame chassis. Holds either a single screenshot or the
// HeroCarousel as its screen content. No notch — clean bezels so any super
// copy overlaid on the screen has room to breathe. Aspect matches our
// captured screenshots (390:844).

export function PhoneFrame({
  width = 320,
  children,
}: {
  width?: number;
  children: React.ReactNode;
}) {
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
        {children}
      </div>
    </div>
  );
}
