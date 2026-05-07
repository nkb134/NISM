import Link from 'next/link';
import { SiteNav } from '@/components/marketing/SiteNav';
import { ProseHtml } from '@/components/study/ProseHtml';
import { PhoneFrame } from '@/components/marketing/PhoneFrame';
import { Icon, iconForExamCode } from '@/components/marketing/Icon';
import { EXAM_CATALOG, getExamFromCatalog } from '@/data/exam-catalog';
import { getChapter, listChapters } from '@/lib/study/content';
import { freeChapterSlugFor, freeTestSetIdFor } from '@/lib/access';

export const metadata = {
  title: 'Free NISM Study Guides & Practice Tests',
  alternates: { canonical: '/' },
};

export default function LandingPage() {
  const chapter1 = getChapter('nism-va', freeChapterSlugFor('nism-va') ?? 'investment-landscape');
  const summaryHtml = chapter1?.layers.summaryHtml ?? '';

  const va = getExamFromCatalog('nism-va');
  const freeMockId = freeTestSetIdFor('nism-va');

  // Real stats — derived, no fiction.
  const stats = [
    { label: 'Questions seeded', value: 522 },
    { label: 'Chapters in V-A', value: listChapters('nism-va').length },
    { label: 'Mock tests', value: 32 },
    { label: 'NISM exams catalogued', value: EXAM_CATALOG.length },
  ];

  const featured = EXAM_CATALOG.slice(0, 6);

  return (
    <>
      <SiteNav />

      {/* Hero gradient lives in a single absolutely-positioned layer behind
          the main column, so it doesn't interfere with the grid below. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 720,
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(26,31,58,0.07) 0%, rgba(163,230,53,0.06) 35%, rgba(255,255,255,0) 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <main className="relative mx-auto max-w-[1120px] px-4 sm:px-6" style={{ zIndex: 1 }}>
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <span
              className="inline-flex items-center gap-2"
              style={{
                padding: '4px 10px',
                background: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: '0.4px',
                border: '1px solid var(--color-border)',
                borderRadius: 999,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: 'var(--color-accent)',
                  boxShadow: '0 0 0 3px rgba(163,230,53,0.18)',
                }}
              />
              March 2026 syllabus · V-A available now
            </span>
            <h1
              className="mt-5 font-bold tracking-tight"
              style={{ fontSize: 'clamp(34px, 5.2vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.8px' }}
            >
              Pass NISM with{' '}
              <span
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-deeper) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                free
              </span>{' '}
              study guides<br className="hidden sm:block" />
              and{' '}
              <span style={{ position: 'relative', whiteSpace: 'nowrap' }}>
                real exam-style mocks
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: '-4px',
                    height: 6,
                    background: 'var(--color-accent)',
                    opacity: 0.4,
                    borderRadius: 4,
                  }}
                />
              </span>
              .
            </h1>
            <p
              className="mt-5 max-w-[560px]"
              style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-md)', lineHeight: 1.6 }}
            >
              One full chapter and one mock test, free, for every exam — no signup. Sign in to
              unlock the rest of the guide, all 32 sets, and your topic-mastery dashboard.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {chapter1 && (
                <Link
                  href={`/exam/nism-va/study/${chapter1.slug}` as never}
                  className="inline-flex items-center justify-center gap-2 font-semibold"
                  style={{
                    padding: '12px 20px',
                    background: 'var(--color-navy)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-md)',
                  }}
                >
                  Try a free chapter
                  <Icon name="arrow-right" size={16} />
                </Link>
              )}
              {va && freeMockId && (
                <Link
                  href={`/exam/${va.code}/test/${freeMockId}` as never}
                  className="inline-flex items-center justify-center gap-2 border font-semibold"
                  style={{
                    padding: '12px 20px',
                    borderColor: 'var(--color-navy)',
                    color: 'var(--color-navy)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-md)',
                  }}
                >
                  Take a free mock test
                  <Icon name="arrow-right" size={16} />
                </Link>
              )}
            </div>

            <p
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1"
              style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)', letterSpacing: '0.2px' }}
            >
              <span>100% free</span>
              <span aria-hidden>·</span>
              <span>No payments</span>
              <span aria-hidden>·</span>
              <span>No ads</span>
              <span aria-hidden>·</span>
              <span>Made in India</span>
            </p>
          </div>

          {/* Phone frame — embedded actual product screenshot. overflow-hidden
              clips the glow behind it (negative-inset radial would otherwise
              push the page wider on mobile). */}
          <div className="relative flex justify-center overflow-hidden lg:justify-end">
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: '8% -8% 8% -8%',
                background:
                  'radial-gradient(60% 60% at 50% 50%, rgba(163,230,53,0.18) 0%, rgba(26,31,58,0.0) 70%)',
                filter: 'blur(8px)',
                zIndex: 0,
              }}
            />
            <div className="relative" style={{ zIndex: 1 }}>
              <PhoneFrame
                src="/images/hero-chapter.png"
                alt="A NISM V-A study chapter open in the app, showing the three-layer reader (Summary / Detail / Memory) on a phone."
                width={300}
              />
            </div>
          </div>
        </section>

        {/* ── Stats strip ──────────────────────────────────────────────── */}
        <section
          className="my-2 grid grid-cols-2 gap-3 rounded-xl border p-5 sm:grid-cols-4 sm:gap-6 sm:p-6"
          style={{
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-bg)',
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div
                className="tabular font-bold"
                style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-navy)', lineHeight: 1.1 }}
              >
                {s.value}
              </div>
              <div
                className="mt-1 font-semibold uppercase"
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.4px',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
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
                className="inline-flex items-center gap-1.5 font-semibold"
                style={{ color: 'var(--color-navy)', fontSize: 'var(--text-sm)' }}
              >
                Read the full chapter
                <Icon name="arrow-right" size={14} />
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
              icon="check-shield"
              title="Built from the official workbook"
              body="Every number, every rule, traceable to NISM's March 2026 syllabus. No AI-generated questions — the entire pool is paraphrased from validated sources."
            />
            <FeatureBlock
              icon="spark"
              title="Topic mastery, not just scores"
              body="See which topics you're weak in. The 4-chapter rule (master Chapters 4, 5, 9, 12) gets you to 65/100 with margin to spare."
            />
            <FeatureBlock
              icon="phone"
              title="Schoolnet-feel, on mobile"
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
              className="inline-flex shrink-0 items-center gap-1.5 font-semibold"
              style={{ color: 'var(--color-navy)', fontSize: 'var(--text-sm)' }}
            >
              See all
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
          <p
            className="mt-2 max-w-[640px]"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
          >
            V-A is fully loaded today. Other exams ship study guides and practice tests on a
            rolling basis — the official PDF is on nism.ac.in for every exam meanwhile.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {featured.map((exam) => {
              const ready =
                exam.studyGuideStatus === 'available' || exam.mockTestStatus === 'available';
              const iconName = iconForExamCode(exam.code);
              return (
                <li key={exam.code}>
                  <Link
                    href={`/exam/${exam.code}/study` as never}
                    className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-[var(--color-surface-hover)]"
                    style={{
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                    }}
                  >
                    <span
                      aria-hidden
                      className="flex shrink-0 items-center justify-center"
                      style={{
                        width: 44,
                        height: 44,
                        background:
                          'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-deeper) 100%)',
                        color: 'var(--color-accent)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Icon name={iconName} size={22} strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0 flex-1">
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
                    </div>
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
            style={{
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              background:
                'linear-gradient(135deg, var(--color-surface-hover) 0%, var(--color-bg) 100%)',
            }}
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
                className="inline-flex items-center justify-center gap-2 font-semibold"
                style={{
                  padding: '12px 20px',
                  background: 'var(--color-navy)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-md)',
                }}
              >
                Sign in
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link
                href={'/dashboard' as never}
                className="inline-flex items-center justify-center border font-semibold"
                style={{
                  padding: '12px 20px',
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
          className="mx-auto grid max-w-[1120px] gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6"
          style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}
        >
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-7 w-7 items-center justify-center rounded font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, var(--color-navy), var(--color-navy-deeper))',
                  color: 'var(--color-accent)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 11,
                }}
              >
                N
              </span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)' }}>
                NISMPracticeTests
              </span>
            </div>
            <p className="mt-3 max-w-[280px]" style={{ lineHeight: 1.6 }}>
              Free, syllabus-aligned study guides and practice tests for every NISM certification.
              Made in India.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold uppercase" style={{ letterSpacing: '0.4px' }}>
              Product
            </h3>
            <ul className="flex flex-col gap-2">
              <li><Link href={'/dashboard' as never}>All exams</Link></li>
              <li><Link href={'/exam/nism-va/study' as never}>V-A study guide</Link></li>
              <li><Link href={'/exam/nism-va/tests' as never}>V-A practice tests</Link></li>
              <li><Link href={'/login' as never}>Sign in</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold uppercase" style={{ letterSpacing: '0.4px' }}>
              Built openly
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="https://github.com/nkb134/NISM" target="_blank" rel="noopener noreferrer">
                  GitHub repository ↗
                </a>
              </li>
              <li>
                <a href="https://www.nism.ac.in/certifications/" target="_blank" rel="noopener noreferrer">
                  Official NISM PDFs ↗
                </a>
              </li>
            </ul>
            <p className="mt-4" style={{ color: 'var(--color-text-faint)' }}>
              © {new Date().getFullYear()} NISMPracticeTests
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function FeatureBlock({
  icon,
  title,
  body,
}: {
  icon: 'check-shield' | 'spark' | 'phone';
  title: string;
  body: string;
}) {
  return (
    <article
      className="rounded-xl border p-5"
      style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          background: 'var(--color-surface)',
          color: 'var(--color-navy)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <Icon name={icon} size={20} strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 font-semibold" style={{ fontSize: 'var(--text-md)' }}>
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
