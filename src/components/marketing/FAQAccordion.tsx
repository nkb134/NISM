// FAQ section. Uses native <details>/<summary> so it's zero-JS and stays
// expandable with no client bundle. Emits FAQPage JSON-LD for Google's
// rich-result treatment alongside.

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How is this free?',
    a: 'NISM publishes its workbooks publicly on nism.ac.in. We read them, write derivative study guides + question pools in our own words, and host the result. No payments, no ads, no sponsors. Sustaining cost is under ₹1,000/month — fits as a side project.',
  },
  {
    q: 'Are you affiliated with NISM?',
    a: 'No. NISMPracticeTests is independent. NISM is a SEBI-mandated certification body; the official workbooks and the real exam are at nism.ac.in. We link out for everything authoritative; we never rehost their PDFs.',
  },
  {
    q: 'Will my chapter progress and test history save?',
    a: 'Yes — once you sign in (magic link or Google). Anonymous attempts on the free mock test scoreboard show inline but aren\'t persisted. Sign in to get topic-mastery analytics across every attempt.',
  },
  {
    q: 'Can I take a test offline?',
    a: 'Mostly yes. The site is a Progressive Web App — install it on Android Chrome or iOS Safari ("Add to Home Screen") and the study guide chapters work offline. Test submission still needs network because scoring runs server-side.',
  },
  {
    q: 'When will the other 17 NISM exams launch?',
    a: 'Rolling, in order of search demand: VIII (Equity Derivatives), XV (Research Analyst), and V-B (MF Foundation) are next in queue. The other 14 follow as content gets authored. The official PDF for every exam is already linked from the catalog meanwhile.',
  },
  {
    q: 'How are the questions sourced?',
    a: 'Every question is hand-paraphrased from the official NISM workbook for that certification. Difficulty is calibrated against the model paper at the back of each workbook. We don\'t copy questions verbatim and we don\'t use unverified third-party question banks.',
  },
];

// Build the FAQPage JSON-LD payload Google reads for rich snippets.
// Defensively escape any "</" that might appear in copy so a future edit
// can't break the surrounding HTML by closing the script tag early.
function faqJsonLd(): string {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  return JSON.stringify(payload).replace(/<\//g, '<\\/');
}

export function FAQAccordion() {
  return (
    <section
      className="my-16 sm:my-20"
      aria-labelledby="faq-heading"
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
          Frequently asked
        </p>
        <h2
          id="faq-heading"
          className="mt-2 font-bold"
          style={{ fontSize: 'var(--text-xl)', letterSpacing: '-0.4px' }}
        >
          Things people usually ask
        </h2>
      </header>

      <ul className="mx-auto flex max-w-[720px] flex-col gap-2">
        {FAQ.map((item) => (
          <li key={item.q}>
            <details
              className="group rounded-xl border"
              style={{
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-bg)',
              }}
            >
              <summary
                className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5 sm:px-5"
                style={{ fontSize: 'var(--text-md)', fontWeight: 600, listStyle: 'none' }}
              >
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className="shrink-0 transition-transform group-open:rotate-45"
                  style={{
                    width: 24,
                    height: 24,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: 22,
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </summary>
              <div
                className="px-4 pb-4 sm:px-5"
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.65,
                }}
              >
                {item.a}
              </div>
            </details>
          </li>
        ))}
      </ul>

      {/* Schema.org FAQPage payload — Google can show these as rich results.
       * React renders the string child as the script's textContent. */}
      <script type="application/ld+json">{faqJsonLd()}</script>
    </section>
  );
}
