// Priority indicator. 1-3 filled stars; rest faded. No animation, single glyph.

export function Stars({ priority }: { priority: 1 | 2 | 3 }) {
  return (
    <span
      aria-label={`Priority ${priority} of 3`}
      title={`Priority ${priority}/3`}
      style={{ letterSpacing: '1px', color: 'var(--color-navy)' }}
    >
      <span>{'★'.repeat(priority)}</span>
      <span style={{ color: 'var(--color-text-faint)' }}>{'★'.repeat(3 - priority)}</span>
    </span>
  );
}
