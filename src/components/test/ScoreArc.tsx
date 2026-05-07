// Radial score visualization. The "moment" on the result page — a single
// glance shows pass/fail, score, and how close to threshold.
//
// Pure SVG, no library. The arc fills clockwise from 12 o'clock by score
// percent. Color is pass green if passed, fail red otherwise. Pass-mark
// threshold is rendered as a tick on the ring so users see how much margin
// they had.

export function ScoreArc({
  scorePercent,
  passed,
  passMarkPercent,
  size = 200,
}: {
  scorePercent: number;
  passed: boolean;
  passMarkPercent: number;
  size?: number;
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const fillLen = (scorePercent / 100) * circumference;
  const color = passed ? 'var(--color-pass)' : 'var(--color-fail)';

  // Pass-mark tick angle (in radians, 0 at 12 o'clock going clockwise)
  const tickAngle = (passMarkPercent / 100) * 2 * Math.PI - Math.PI / 2;
  const tickInner = r - stroke / 2 - 2;
  const tickOuter = r + stroke / 2 + 2;
  const tickX1 = cx + Math.cos(tickAngle) * tickInner;
  const tickY1 = cy + Math.sin(tickAngle) * tickInner;
  const tickX2 = cx + Math.cos(tickAngle) * tickOuter;
  const tickY2 = cy + Math.sin(tickAngle) * tickOuter;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Score ${scorePercent} percent, ${passed ? 'passed' : 'did not pass'}`}
    >
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={stroke}
      />
      {/* Score arc */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${fillLen} ${circumference - fillLen}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 600ms ease-out' }}
      />
      {/* Pass-mark tick */}
      <line
        x1={tickX1}
        y1={tickY1}
        x2={tickX2}
        y2={tickY2}
        stroke="var(--color-text-faint)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Center label */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        style={{
          fontSize: 36,
          fontWeight: 800,
          fill: 'var(--color-text)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {scorePercent}%
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        style={{
          fontSize: 12,
          fontWeight: 700,
          fill: color,
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
        }}
      >
        {passed ? 'Pass' : 'Did not pass'}
      </text>
    </svg>
  );
}
