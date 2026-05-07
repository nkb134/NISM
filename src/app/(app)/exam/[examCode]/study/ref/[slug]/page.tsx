import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { getReference } from '@/lib/study/content';
import { ProseHtml } from '@/components/study/ProseHtml';
import { isFreeReference } from '@/lib/access';

type Props = { params: Promise<{ examCode: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { examCode, slug } = await params;
  const ref = getReference(examCode, slug);
  return { title: ref?.title ?? 'Reference' };
}

export default async function ReferencePage({ params }: Props) {
  const { examCode, slug } = await params;
  const exam = getExamFromCatalog(examCode);
  if (!exam) notFound();
  const ref = getReference(exam.code, slug);
  if (!ref) notFound();

  // Reference docs are gated by default — they're high-leverage cross-cutting
  // content (Number Sheet, Common Traps, etc.) and a primary reason to log in.
  if (!isFreeReference(exam.code, slug)) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      redirect(`/login?next=/exam/${exam.code}/study/ref/${slug}`);
    }
  }

  const isExamDay = slug === 'exam-day';

  return (
    <main className={`mx-auto px-6 py-10 ${isExamDay ? 'max-w-[640px]' : 'max-w-[760px]'}`}>
      <Link
        href={`/exam/${exam.code}/study` as never}
        style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
      >
        ← All chapters
      </Link>
      <div className="mt-6">
        <ProseHtml html={ref.html} />
      </div>
    </main>
  );
}
