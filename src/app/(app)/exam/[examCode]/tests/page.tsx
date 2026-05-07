import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getExamFromCatalog } from '@/data/exam-catalog';

type Props = { params: Promise<{ examCode: string }> };

export async function generateMetadata({ params }: Props) {
  const { examCode } = await params;
  const exam = getExamFromCatalog(examCode);
  return { title: exam ? `${exam.shortName} — Practice Tests` : 'Practice Tests' };
}

export default async function PracticeTestsPage({ params }: Props) {
  const { examCode } = await params;
  const exam = getExamFromCatalog(examCode);
  if (!exam) notFound();

  if (exam.mockTestStatus !== 'available') {
    return (
      <main className="mx-auto max-w-[640px] px-6 py-16 text-center">
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
          Practice tests coming soon
        </h1>
        <p
          className="mt-3"
          style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}
        >
          We're building the question pool for {exam.shortName}. The study guide is the priority
          first; tests follow.
        </p>
        <Link
          href={`/exam/${exam.code}/study` as never}
          className="mt-6 inline-flex items-center justify-center"
          style={{
            padding: '8px 16px',
            background: 'var(--color-navy)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          Open study guide →
        </Link>
      </main>
    );
  }

  // V-A is ready — but the test runner ships in Phase 2. Show a placeholder
  // that lists what's coming so users aren't surprised.
  return (
    <main className="mx-auto max-w-[760px] px-6 py-10">
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Practice tests</h1>
      <p
        className="mt-2"
        style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}
      >
        522 questions across 32 sets are seeded. The test-taking interface (palette, timer, review)
        ships in Phase 2.
      </p>
      <p
        className="mt-6"
        style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}
      >
        In the meantime, the{' '}
        <Link
          href={`/exam/${exam.code}/study` as never}
          style={{ color: 'var(--color-navy)', fontWeight: 600 }}
        >
          study guide
        </Link>{' '}
        is fully readable.
      </p>
    </main>
  );
}
