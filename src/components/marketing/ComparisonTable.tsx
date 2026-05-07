// "How we compare" — three options NISM candidates actually consider, with
// the trade-offs honestly laid out. Competitor names kept generic to avoid
// legal exposure. The point isn't to bash; it's to make the position obvious:
// real prep + free + structured = us. Workbook-only is slow, paid sites are
// expensive and locked.

const ROWS: Array<{
  feature: string;
  workbook: string | boolean;
  paid: string | boolean;
  ours: string | boolean;
}> = [
  { feature: 'Cost',                    workbook: 'Free PDF',    paid: '₹2,000–5,000',     ours: '₹0' },
  { feature: 'Mock tests',              workbook: false,          paid: true,                ours: true },
  { feature: 'Topic mastery analytics', workbook: false,          paid: 'Sometimes',         ours: true },
  { feature: 'Real Schoolnet UI',       workbook: false,          paid: 'Rarely',            ours: true },
  { feature: 'India-aware mnemonics',   workbook: false,          paid: false,               ours: true },
  { feature: 'Updates with syllabus',   workbook: 'Annual reprint', paid: 'Sometimes',       ours: 'Continuous' },
];

export function ComparisonTable() {
  return (
    <section
      className="my-16 sm:my-20"
      aria-labelledby="compare-heading"
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
          How we compare
        </p>
        <h2
          id="compare-heading"
          className="mt-2 font-bold"
          style={{ fontSize: 'var(--text-xl)', letterSpacing: '-0.4px' }}
        >
          Workbook, paid prep site, or this — what's the difference?
        </h2>
      </header>

      <div
        className="overflow-x-auto rounded-xl border"
        style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
      >
        <table className="min-w-full" style={{ fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface)' }}>
              <th
                scope="col"
                className="px-4 py-3 text-left font-semibold"
                style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', letterSpacing: '0.4px', textTransform: 'uppercase' }}
              >
                Feature
              </th>
              <Th>Workbook PDF only</Th>
              <Th>Paid prep sites</Th>
              <Th highlighted>NISMPracticeTests</Th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.feature}
                style={{
                  background: i % 2 === 0 ? 'var(--color-bg)' : 'var(--color-surface-hover)',
                  borderTop: '1px solid var(--color-border-soft, #eef0f4)',
                }}
              >
                <td
                  className="px-4 py-3 font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {row.feature}
                </td>
                <Cell value={row.workbook} />
                <Cell value={row.paid} />
                <Cell value={row.ours} highlighted />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p
        className="mt-3 text-center"
        style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
      >
        Honest take, not a sales pitch. The official PDF is on{' '}
        <a
          href="https://www.nism.ac.in/certifications/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}
        >
          nism.ac.in
        </a>{' '}
        — start there if you prefer.
      </p>
    </section>
  );
}

function Th({ children, highlighted }: { children: React.ReactNode; highlighted?: boolean }) {
  return (
    <th
      scope="col"
      className="px-4 py-3 text-left font-semibold"
      style={{
        color: highlighted ? 'var(--color-navy)' : 'var(--color-text-muted)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
        background: highlighted ? '#ecfdf5' : undefined,
      }}
    >
      {children}
    </th>
  );
}

function Cell({ value, highlighted }: { value: string | boolean; highlighted?: boolean }) {
  let body: React.ReactNode;
  let color: string;
  if (value === true) {
    body = (
      <>
        <span aria-hidden style={{ color: 'var(--color-pass)' }}>✓</span> Yes
      </>
    );
    color = 'var(--color-text)';
  } else if (value === false) {
    body = (
      <>
        <span aria-hidden style={{ color: 'var(--color-text-faint)' }}>—</span> No
      </>
    );
    color = 'var(--color-text-faint)';
  } else {
    body = value;
    color = 'var(--color-text)';
  }
  return (
    <td
      className="px-4 py-3"
      style={{
        color,
        background: highlighted ? '#ecfdf5' : undefined,
        fontWeight: highlighted ? 600 : 400,
      }}
    >
      {body}
    </td>
  );
}
