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
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-6 px-6">
          <Link
            href={'/dashboard' as never}
            className="font-semibold"
            style={{ fontSize: 'var(--text-md)', color: 'var(--color-text)' }}
          >
            ← All exams
          </Link>
          <div className="flex-1 truncate">
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>
              {exam.shortName}
            </span>
            <span
              style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginLeft: 8 }}
            >
              {exam.fullName}
            </span>
          </div>
          <nav className="flex items-center gap-5">
            <Link
              href={`/exam/${exam.code}/study` as never}
              style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                paddingBottom: 2,
              }}
            >
              Study guide
            </Link>
            <Link
              href={`/exam/${exam.code}/tests` as never}
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                paddingBottom: 2,
              }}
            >
              Practice tests
            </Link>
            <a
              href={exam.nismOfficialUrl}
              target="_blank"
              rel="noopener noreferrer"
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
