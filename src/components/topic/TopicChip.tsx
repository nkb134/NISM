// Per-topic chip — used on chapter rows, set rows, result-page topic
// breakdown, and dashboard topic mastery. Colors come from the topic
// palette in globals.css (--topic-{code} / --topic-{code}-bg).
//
// One source of truth. Don't recolor topic labels per page; they should
// always look the same so users learn to associate "blue = Investment
// Landscape" across the product.

import { topicName } from '@/lib/topics';

// V-A native colors. Other exams alias their topic codes onto these slots
// (see ALIAS below) so chips always have a colour without us needing to
// define 10 fresh OKLCH ramps per exam.
const COLOR: Record<string, { fg: string; bg: string }> = {
  INV: { fg: 'var(--topic-inv)', bg: 'var(--topic-inv-bg)' },
  STR: { fg: 'var(--topic-str)', bg: 'var(--topic-str-bg)' },
  SCH: { fg: 'var(--topic-sch)', bg: 'var(--topic-sch-bg)' },
  REG: { fg: 'var(--topic-reg)', bg: 'var(--topic-reg-bg)' },
  DOC: { fg: 'var(--topic-doc)', bg: 'var(--topic-doc-bg)' },
  NAV: { fg: 'var(--topic-nav)', bg: 'var(--topic-nav-bg)' },
  TAX: { fg: 'var(--topic-tax)', bg: 'var(--topic-tax-bg)' },
  OPS: { fg: 'var(--topic-ops)', bg: 'var(--topic-ops-bg)' },
  RSK: { fg: 'var(--topic-rsk)', bg: 'var(--topic-rsk-bg)' },
  PRF: { fg: 'var(--topic-prf)', bg: 'var(--topic-prf-bg)' },
  MIX: { fg: 'var(--topic-mix)', bg: 'var(--topic-mix-bg)' },
  FULL: { fg: 'var(--color-navy)', bg: 'var(--color-surface)' },
};

// VIII codes mapped to V-A colour slots — never shown side-by-side with V-A
// chips, so reusing the palette is safe and keeps globals.css small.
const ALIAS: Record<string, keyof typeof COLOR> = {
  BAS: 'INV',
  IDX: 'STR',
  FUT: 'SCH',
  OPT: 'REG',
  ESS: 'DOC',
  TRD: 'NAV',
  CLR: 'TAX',
  ELG: 'OPS',
  TXA: 'RSK',
  IPS: 'PRF',
};

export function topicLabel(code: string | null | undefined): string {
  if (!code) return '';
  if (code === 'MIX') return 'Mixed';
  if (code === 'FULL') return 'Full Simulator';
  return topicName(code) ?? code;
}

export function topicColors(code: string | null | undefined) {
  if (!code) return { fg: 'var(--color-text-muted)', bg: 'var(--color-surface)' };
  const slot = COLOR[code] ?? COLOR[ALIAS[code] ?? ''];
  return slot ?? { fg: 'var(--color-text-muted)', bg: 'var(--color-surface)' };
}

type Size = 'sm' | 'md';

export function TopicChip({
  code,
  size = 'sm',
  showLabel = true,
}: {
  code: string | null | undefined;
  size?: Size;
  showLabel?: boolean;
}) {
  const c = topicColors(code);
  const label = topicLabel(code);
  if (!label) return null;
  const padding = size === 'sm' ? '2px 8px' : '3px 10px';
  const fontSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding,
        background: c.bg,
        color: c.fg,
        fontSize,
        fontWeight: 600,
        borderRadius: 'var(--radius-sm)',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: c.fg,
          flexShrink: 0,
        }}
      />
      {showLabel && label}
    </span>
  );
}
