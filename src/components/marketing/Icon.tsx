// Small icon set, hand-rolled (no icon library). Heroicons-inspired line
// icons at 24x24, with auto stroke-width that thickens at smaller sizes
// so the line stays optically consistent. Used in the why-us blocks and
// the exam catalog category glyphs.

type IconName =
  | 'check-shield'
  | 'spark'
  | 'phone'
  | 'briefcase'
  | 'chart-bar'
  | 'lightbulb'
  | 'shield-check'
  | 'building-library'
  | 'academic-cap'
  | 'arrow-right';

const PATHS: Record<IconName, React.ReactNode> = {
  // why-us trio
  'check-shield': (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="1.6" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10 18h4" />
    </>
  ),
  // catalog category icons
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </>
  ),
  'chart-bar': (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a7 7 0 0 0-4 12.7c.8.5 1 1 1 1.7v.6h6v-.6c0-.7.2-1.2 1-1.7A7 7 0 0 0 12 3z" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path d="m8.5 12 2.5 2.5L16 9.5" />
    </>
  ),
  'building-library': (
    <>
      <path d="M12 3 3 8h18L12 3z" />
      <path d="M4 21V8M20 21V8" />
      <path d="M8 21v-9M12 21v-9M16 21v-9" />
      <path d="M3 21h18" />
    </>
  ),
  'academic-cap': (
    <>
      <path d="M12 4 2 9l10 5 10-5-10-5z" />
      <path d="M6 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
};

export function Icon({
  name,
  size = 22,
  color = 'currentColor',
  strokeWidth,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  color?: string;
  /** Override default stroke. Default scales with size: 2.0 (≤16) / 1.8 (≤24) / 1.6 (≥32). */
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const sw = strokeWidth ?? (size <= 16 ? 2.0 : size <= 24 ? 1.8 : 1.6);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {PATHS[name]}
    </svg>
  );
}

/** Map an exam code to its category icon. */
export function iconForExamCode(code: string): IconName {
  if (code.startsWith('nism-v')) return 'briefcase';
  if (['nism-i', 'nism-iv', 'nism-viii', 'nism-xvi'].includes(code)) return 'chart-bar';
  if (['nism-xa', 'nism-xb'].includes(code)) return 'lightbulb';
  if (['nism-iia', 'nism-iib', 'nism-iiia', 'nism-xxiv'].includes(code)) return 'shield-check';
  if (code.startsWith('nism-xix') || code === 'nism-xxia') return 'building-library';
  return 'academic-cap';
}
