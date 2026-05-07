import Link from 'next/link';
import { SiteNav } from '@/components/marketing/SiteNav';
import { ProseHtml } from '@/components/study/ProseHtml';
import { EXAM_CATALOG, getExamFromCatalog } from '@/data/exam-catalog';
import { getChapter } from '@/lib/study/content';
import { freeChapterSlugFor, freeTestSetIdFor } from '@/lib/access';

export const metadata = {
  title: 'Free NISM Study Guides & Practice Tests',
  alternates: { canonical: '/' },
};

export default function LandingPage() {
  // Pull Chapter 1's Summary Card from the live markdown so the landing
  // never drifts from the actual content.
  const chapter1 = getChapter('nism-va', freeChapterSlugFor('nism-va') ?? 'investment-landscape');
  const summaryHtml = chapter1?.layers.summaryHtml ?? '';

  const va = getExamFromCatalog('nism-va');
  const freeMockId = freeTestSetIdFor('nism-va');

  // Top 6 catalog cards on the landing; "see all 18" links to /dashboard.
  const featured = EXAM_CATALOG.slice(0, 6);

  return (
    <>
      <SiteNav />

      <main className="mx-auto max-w-[1080px] px-4 sm:px-6">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <h1
            className="font-bold tracking-tight"
            style={{ fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.5px' }}
          >
            Free NISM practice tests <br className="hidden sm:block" />and study guides for{' '}
            <span style={{ color: 'var(--color-navy)' }}>18 certifications</span>.
          </h1>
          <p
            className="mt-5 max-w-[640px]"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-md)', lineHeight: 1.6 }}
          >
            One chapter and one mock test free for every exam — no signup required. Sign in to
            unlock the full guide, all sets, and topic-mastery analytics.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {chapter1 && (
              <Link
                href={`/exam/nism-va/study/${chapter1.slug}` as never}
                className="inline-flex items-center justify-center font-semibold"
                style={{
                  padding: '10px 18px',
                  background: 'var(--color-navy)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-md)',
                }}
              >
                Try a free chapter →
              </Link>
            )}
            {va && freeMockId && (
              <Link
                href={`/exam/${va.code}/tests` as never}
                className="inline-flex items-center justify-center border font-semibold"
                style={{
                  padding: '10px 18px',
                  borderColor: 'var(--color-navy)',
                  color: 'var(--color-navy)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-md)',
                }}
              >
                Take a free mock test →
              </Link>
            )}
          </div>

          <p
            className="mt-6"
            style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)', letterSpacing: '0.2px' }}
          >
            100% free · No payments · No ads · Made in India
          </p>
        </section>

        {/* ── Sample Summary Card (live from Chapter 1) ───────────────── */}
        {chapter1 && summaryHtml && (
          <section className="border-t pt-14 pb-16" style={{ borderColor: 'var(--color-border)' }}>
            <p
              className="font-semibold uppercase"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.4px',
              }}
            >
              Sample · Chapter {chapter1.chapter} · {chapter1.title}
            </p>
            <h2
              className="mt-2 font-bold"
              style={{ fontSize: 'var(--text-xl)', lineHeight: 1.3 }}
            >
              <span aria-hidden>🎯</span> Summary Card — what the 60-second version looks like
            </h2>
            <p
              className="mt-2 mb-6 max-w-[640px]"
              style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
            >
              Every chapter has three reading depths: <strong>Summary</strong> (this),{' '}
              <strong>Detail</strong>, and <strong>Memory hooks</strong>. Re-reading the night
              before? You only read the Summary cards.
            </p>
            <div
              className="rounded-xl border p-5 sm:p-7"
              style={{
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-surface-hover)',
              }}
            >
              <ProseHtml html={summaryHtml} />
            </div>
            <p className="mt-5">
              <Link
                href={`/exam/nism-va/study/${chapter1.slug}` as never}
                style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: 'var(--text-sm)' }}
              >
                Read the full chapter →
              </Link>
            </p>
          </section>
        )}

        {/* ── Why us ──────────────────────────────────────────────────── */}
        <section className="border-t py-14" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>
            Why this beats the workbook
          </h2>
          <p
            className="mt-2 max-w-[640px]"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
          >
            The official PDF is the source of truth. This guide is the exam-tactical layer on top.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <FeatureBlock
              title="Built from the official workbook"
              body="Every number, every rule, traceable to NISM's March 2026 syllabus. No AI-generated questions — every set is paraphrased from validated sources."
            />
            <FeatureBlock
              title="Topic mastery, not just scores"
              body="See which topics you're weak in. The 4-chapter rule (master Chapters 4, 5, 9, 12) gets you to a 65/100 with margin to spare."
            />
            <FeatureBlock
              title="Real-exam Schoolnet feel, on mobile"
              body="Question palette, timer, marked-for-review — same patterns as the actual NISM exam interface. Designed for one-handed Android use."
            />
          </div>
        </section>

        {/* ── Catalog teaser ──────────────────────────────────────────── */}
        <section className="border-t py-14" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>
              All 18 NISM certifications
            </h2>
            <Link
              href={'/dashboard' as never}
              style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: 'var(--text-sm)' }}
              className="shrink-0"
            >
              See all →
            </Link>
          </div>
          <p
            className="mt-2 max-w-[640px]"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
          >
            V-A is fully loaded today. Other exams ship study guides and practice tests on a rolling
            basis — the official PDF is on nism.ac.in for every exam meanwhile.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {featured.map((exam) => {
              const ready =
                exam.studyGuideStatus === 'available' || exam.mockTestStatus === 'available';
              return (
                <li key={exam.code}>
                  <Link
                    href={`/exam/${exam.code}/study` as never}
                    className="block rounded-xl border p-4 transition-colors hover:bg-[var(--color-surface-hover)]"
                    style={{
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold" style={{ fontSize: 'var(--text-md)' }}>
                        {exam.shortName}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: ready ? 'var(--color-pass)' : 'var(--color-text-faint)',
                          fontWeight: 600,
                        }}
                      >
                        {ready ? '✓ Live' : 'Coming soon'}
                      </span>
                    </div>
                    <p
                      className="mt-1"
                      style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}
                    >
                      {exam.fullName}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────── */}
        <section className="border-t py-16" style={{ borderColor: 'var(--color-border)' }}>
          <div
            className="rounded-xl border p-6 sm:p-8"
            style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
          >
            <h2 className="font-bold" style={{ fontSize: 'var(--text-lg)' }}>
              Ready for the rest?
            </h2>
            <p
              className="mt-2 max-w-[560px]"
              style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
            >
              Sign in to unlock all 12 chapters, every mock test, the Number Sheet, the Common
              Traps list, and your topic-mastery dashboard. One link in your inbox — no password.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={'/login' as never}
                className="inline-flex items-center justify-center font-semibold"
                style={{
                  padding: '10px 18px',
                  background: 'var(--color-navy)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-md)',
                }}
              >
                Sign in
              </Link>
              <Link
                href={'/dashboard' as never}
                className="inline-flex items-center justify-center border font-semibold"
                style={{
                  padding: '10px 18px',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-navy)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-md)',
                }}
              >
                Browse all exams
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer
        className="border-t"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
      >
        <div
          className="mx-auto flex max-w-[1080px] flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6"
          style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}
        >
          <span>© {new Date().getFullYear()} NISMPracticeTests · Free and open</span>
          <span className="flex flex-wrap gap-4">
            <Link href={'/dashboard' as never}>Exams</Link>
            <Link href={'/login' as never}>Sign in</Link>
          </span>
        </div>
      </footer>
    </>
  );
}

function FeatureBlock({ title, body }: { title: string; body: string }) {
  return (
    <article
      className="rounded-xl border p-5"
      style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
    >
      <h3 className="font-semibold" style={{ fontSize: 'var(--text-md)' }}>
        {title}
      </h3>
      <p
        className="mt-2"
        style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
      >
        {body}
      </p>
    </article>
  );
}
