import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { testSets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { isFreeTest } from '@/lib/access';
import { questionsForSet, sampleQuestionsForExam } from '@/lib/db/queries';
import { TestRunner } from '@/components/test/TestRunner';

type Props = { params: Promise<{ examCode: string; setId: string }> };

export async function generateMetadata({ params }: Props) {
  const { setId } = await params;
  const rows = await db.select().from(testSets).where(eq(testSets.id, setId)).limit(1);
  return { title: rows[0]?.name ?? 'Test', robots: { index: false, follow: false } };
}

export default async function TestRunnerPage({ params }: Props) {
  const { examCode, setId } = await params;
  const exam = getExamFromCatalog(examCode);
  if (!exam) notFound();

  const setRows = await db.select().from(testSets).where(eq(testSets.id, setId)).limit(1);
  const set = setRows[0];
  if (!set || set.examCode !== exam.code) notFound();

  // Auth gate: anyone can take the free mock; everything else needs sign-in.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session && !isFreeTest(exam.code, set.id)) {
    redirect(`/login?next=/exam/${exam.code}/test/${set.id}`);
  }

  const questions = set.isDynamic
    ? await sampleQuestionsForExam(exam.code, exam.totalQuestions)
    : await questionsForSet(set.id);

  if (questions.length === 0) notFound();

  return (
    <TestRunner
      examCode={exam.code}
      examName={exam.shortName}
      setId={set.id}
      setName={set.name}
      topicCode={set.topicCode}
      durationSeconds={set.durationSeconds}
      passMarkPercent={exam.passMarkPercent}
      questions={questions}
      anonymous={!session}
    />
  );
}
