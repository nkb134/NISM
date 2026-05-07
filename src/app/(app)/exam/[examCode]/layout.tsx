import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExamFromCatalog } from '@/data/exam-catalog';

// Exam pages are public by default — study guides are SEO landing pages.
// Auth gating happens at the action level (e.g. starting a test).

export default async function ExamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ examCode: string }>;
}) {
  const { examCode } = await params;
  const exam = getExamFromCatalog(examCode);
  if (!exam) notFound();

  return (
    <div>
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-4 sm:gap-6 sm:px-6">
          <Link
            href={'/dashboard' as never}
            className="shrink-0 font-semibold"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}
            aria-label="All exams"
          >
            <span className="sm:hidden" aria-hidden>←</span>
            <span className="hidden sm:inline">← All exams</span>
          </Link>
          {/* min-w-0 is required for `truncate` to actually clip inside a flex
           * row — default `min-width: auto` (= min-content) prevents shrink. */}
          <div className="min-w-0 flex-1 truncate">
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>
              {exam.shortName}
            </span>
            <span
              className="hidden sm:inline"
              style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginLeft: 8 }}
            >
              {exam.fullName}
            </span>
          </div>
          <nav className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Link
              href={`/exam/${exam.code}/study` as never}
              style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              Study
            </Link>
            <Link
              href={`/exam/${exam.code}/tests` as never}
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              Tests
            </Link>
            <a
              href={exam.nismOfficialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              Official PDF ↗
            </a>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
