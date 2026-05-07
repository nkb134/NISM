import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { listChapters, listReferences } from '@/lib/study/content';
import { Stars } from '@/components/study/Stars';
import { ProgressBadge } from '@/components/study/ProgressBadge';
import { isFreeChapter, isFreeReference } from '@/lib/access';

type Props = { params: Promise<{ examCode: string }> };

export async function generateMetadata({ params }: Props) {
  const { examCode } = await params;
  const exam = getExamFromCatalog(examCode);
  return { title: exam ? `${exam.shortName} — Study Guide` : 'Study Guide' };
}

export default async function StudyGuideHub({ params }: Props) {
  const { examCode } = await params;
  const exam = getExamFromCatalog(examCode);
  if (!exam) notFound();

  const chapters = listChapters(exam.code);
  const references = listReferences(exam.code);
  // Read once; signed-in users don't see lock pips on rows they can open.
  const session = await auth.api.getSession({ headers: await headers() });
  const signedIn = !!session;

  if (exam.studyGuideStatus !== 'available') {
    return (
      <main className="mx-auto max-w-[640px] px-6 py-16 text-center">
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Study guide coming soon</h1>
        <p
          className="mt-3"
          style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}
        >
          We're authoring this guide from the official {exam.syllabusVersion} workbook. In the
          meantime, the official syllabus PDF is on{' '}
          <a href={exam.nismOfficialUrl} target="_blank" rel="noopener noreferrer">
            nism.ac.in
          </a>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6 py-10">
      {/* `grid-cols-1` is required at mobile — without it the implicit grid track
       * sizes to max-content of children, which expands the column to the full
       * un-truncated chapter title and pushes the page wider than the viewport. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <section className="min-w-0">
          <h1 className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>
            Study Guide
          </h1>
          <p
            className="mt-2"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}
          >
            Twelve chapters, three reading depths each. Chapter 1 is free to read — sign in to
            unlock the rest, plus the Number Sheet, Common Traps, and exam-day checklist.
          </p>

          <h2
            className="mt-8 mb-3 font-semibold"
            style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}
          >
            Chapters
          </h2>
          <ul
            className="divide-y rounded-xl border"
            style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
          >
            {chapters.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/exam/${exam.code}/study/${c.slug}` as never}
                  className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--color-surface-hover)] sm:gap-4 sm:px-5"
                >
                  <span
                    className="tabular shrink-0 font-bold"
                    style={{
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-faint)',
                      minWidth: 26,
                    }}
                  >
                    {c.chapter.toString().padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold" style={{ fontSize: 'var(--text-base)' }}>
                      {c.title}
                    </div>
                    <div
                      className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5"
                      style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
                    >
                      <span>{c.marks} marks</span>
                      <span aria-hidden>·</span>
                      <span>{c.estimatedMinutes} min</span>
                      <span aria-hidden className="hidden sm:inline">·</span>
                      <span className="hidden sm:inline" style={{ textTransform: 'capitalize' }}>
                        {c.difficulty}
                      </span>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <Stars priority={c.priority} />
                    <ProgressBadge examCode={exam.code} slug={c.slug} />
                    {!signedIn && !isFreeChapter(exam.code, c.slug) ? (
                      <span
                        aria-label="Sign in required"
                        title="Sign in to read"
                        style={{ color: 'var(--color-text-faint)', fontSize: 14 }}
                      >
                        🔒
                      </span>
                    ) : (
                      <span aria-hidden style={{ color: 'var(--color-text-faint)' }}>
                        →
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <aside className="min-w-0">
          <h2
            className="mb-3 font-semibold"
            style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}
          >
            Quick reference
          </h2>
          <ul
            className="divide-y rounded-xl border"
            style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
          >
            {references.map((r) => {
              const locked = !signedIn && !isFreeReference(exam.code, r.slug);
              return (
                <li key={r.slug}>
                  <Link
                    href={`/exam/${exam.code}/study/ref/${r.slug}` as never}
                    className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--color-surface-hover)]"
                  >
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{r.title}</span>
                    {locked ? (
                      <span
                        aria-label="Sign in required"
                        title="Sign in to read"
                        style={{ color: 'var(--color-text-faint)', fontSize: 14 }}
                      >
                        🔒
                      </span>
                    ) : (
                      <span aria-hidden style={{ color: 'var(--color-text-faint)' }}>
                        →
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p
            className="mt-4"
            style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)', lineHeight: 1.5 }}
          >
            On exam morning, read just the <strong>Number Sheet</strong> and{' '}
            <strong>Common Traps</strong>. Trust the work you've already done.
          </p>
        </aside>
      </div>
    </main>
  );
}
