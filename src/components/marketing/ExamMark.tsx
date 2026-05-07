// Per-exam visual identity. Hybrid: series monogram (e.g. "V-A", "VIII",
// "XIX-A") in the centre, family glyph in the corner. Cards become instantly
// scannable at any size; sibling exams (V-A vs V-B, XIX-A vs XIX-B) read as
// distinct.
//
// Coming-soon variant: monochrome gray gradient + muted accent, so the catalog
// visually telegraphs which exams are click-worthy.

import { Icon, iconForExamCode } from './Icon';
import type { ExamCatalogEntry } from '@/data/exam-catalog';

type Size = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<Size, { tile: number; mono: number; glyph: number; radius: number }> = {
  sm: { tile: 44, mono: 14, glyph: 14, radius: 8 },
  md: { tile: 64, mono: 22, glyph: 18, radius: 10 },
  lg: { tile: 96, mono: 32, glyph: 22, radius: 14 },
};

type Props = {
  exam: Pick<ExamCatalogEntry, 'code' | 'series' | 'studyGuideStatus'>;
  size?: Size;
  className?: string;
};

export function ExamMark({ exam, size = 'md', className }: Props) {
  const { tile, mono, glyph, radius } = SIZE_MAP[size];
  const muted = exam.studyGuideStatus === 'coming-soon';

  // Series monograms can be 1-5 chars (I, V-A, VIII, XIX-A); auto-shrink so
  // the longest still fits inside the tile without clipping.
  const monoFontPx = Math.round(mono * (exam.series.length <= 3 ? 1 : exam.series.length <= 5 ? 0.78 : 0.62));

  return (
    <span
      aria-hidden
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: tile,
        height: tile,
        flexShrink: 0,
        borderRadius: radius,
        background: muted
          ? 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)'
          : 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-deeper, #0f1426) 100%)',
        color: muted ? 'rgba(255,255,255,0.55)' : 'var(--color-accent)',
        overflow: 'hidden',
        boxShadow: muted ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          fontWeight: 800,
          fontSize: monoFontPx,
          letterSpacing: exam.series.length > 3 ? '-0.02em' : '0',
          lineHeight: 1,
        }}
      >
        {exam.series}
      </span>
      <span
        style={{
          position: 'absolute',
          bottom: 4,
          right: 5,
          opacity: muted ? 0.35 : 0.55,
          color: muted ? 'rgba(255,255,255,0.7)' : 'var(--color-accent)',
          display: 'inline-flex',
        }}
      >
        <Icon name={iconForExamCode(exam.code)} size={glyph} />
      </span>
    </span>
  );
}
