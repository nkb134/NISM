import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { listTestSets, lastScoresForUser, type TestSetWithMeta } from '@/lib/db/queries';
import { isFreeTest } from '@/lib/access';
import { TopicChip } from '@/components/topic/TopicChip';

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

  const sets = await listTestSets(exam.code);
  const session = await auth.api.getSession({ headers: await headers() });
  const lastScores = session ? await lastScoresForUser(session.user.id, exam.code) : {};
  const signedIn = !!session;

  // Three buckets: full simulator (top), mocks, topic-wise sets.
  const fullSim = sets.find((s) => s.isDynamic);
  const mocks = sets.filter((s) => !s.isDynamic && !s.topicCode);
  const topicSets = sets.filter((s) => s.topicCode);

  return (
    <main className="mx-auto max-w-[920px] px-4 py-10 sm:px-6">
      <h1 className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>
        Practice Tests
      </h1>
      <p
        className="mt-2 max-w-[640px]"
        style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}
      >
        522 questions across {sets.length} sets. The free mock test is open to everyone — sign in
        to take topic-wise sets and the full simulator.
      </p>

      {fullSim && (
        <Section title="Full Simulator">
          <SetRow
            set={fullSim}
            examCode={exam.code}
            featured
            signedIn={signedIn}
            lastScore={lastScores[fullSim.id]}
          />
        </Section>
      )}

      <Section title="Mock Tests">
        {mocks.map((s) => (
          <SetRow
            key={s.id}
            set={s}
            examCode={exam.code}
            signedIn={signedIn}
            lastScore={lastScores[s.id]}
          />
        ))}
      </Section>

      <Section title="Topic-wise Sets">
        {topicSets.map((s) => (
          <SetRow
            key={s.id}
            set={s}
            examCode={exam.code}
            signedIn={signedIn}
            lastScore={lastScores[s.id]}
          />
        ))}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2
        className="mb-3 font-semibold"
        style={{
          fontSize: 'var(--text-md)',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}
      >
        {title}
      </h2>
      <ul
        className="divide-y rounded-xl border"
        style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-xl)' }}
      >
        {children}
      </ul>
    </section>
  );
}

function SetRow({
  set,
  examCode,
  signedIn,
  featured,
  lastScore,
}: {
  set: TestSetWithMeta;
  examCode: string;
  signedIn: boolean;
  featured?: boolean;
  lastScore?: { scorePercent: number; passed: boolean };
}) {
  const free = isFreeTest(examCode, set.id);
  const locked = !signedIn && !free;
  const minutes = Math.round(set.durationSeconds / 60);
  const qCount = set.isDynamic ? '100' : `${set.questionCount}`;

  const inner = (
    <div
      className="flex items-center gap-3 px-4 py-4 sm:gap-5 sm:px-5"
      style={
        featured
          ? {
              background: 'linear-gradient(180deg, var(--color-surface-hover) 0%, var(--color-bg) 100%)',
              borderLeft: '3px solid var(--color-accent)',
            }
          : undefined
      }
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold" style={{ fontSize: 'var(--text-base)' }}>
            {set.name}
          </span>
          {featured && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: 'var(--color-navy)',
                color: 'var(--color-accent)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                letterSpacing: '0.6px',
              }}
            >
              EXAM
            </span>
          )}
          {free && !signedIn && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                background: '#ecfdf5',
                color: 'var(--color-pass)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              FREE
            </span>
          )}
        </div>
        <div
          className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5"
          style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
        >
          <span>⏱ {minutes} min</span>
          <span aria-hidden>·</span>
          <span>{qCount} questions</span>
          {set.topicCode && (
            <>
              <span aria-hidden>·</span>
              <TopicChip code={set.topicCode} />
            </>
          )}
        </div>
        {set.description && (
          <p
            className="mt-1 line-clamp-2"
            style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)', lineHeight: 1.5 }}
          >
            {set.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        {lastScore && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: lastScore.passed ? 'var(--color-pass)' : 'var(--color-fail)',
            }}
          >
            {lastScore.scorePercent}% {lastScore.passed ? '✓' : '✗'}
          </span>
        )}
        <span
          style={{
            background: locked ? 'var(--color-surface)' : 'var(--color-navy)',
            color: locked ? 'var(--color-text-faint)' : '#fff',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            border: locked ? '1px solid var(--color-border)' : 'none',
          }}
        >
          {locked ? '🔒 Sign in' : 'Start →'}
        </span>
      </div>
    </div>
  );

  return (
    <li>
      <Link
        href={`/exam/${examCode}/test/${set.id}` as never}
        className="block transition-colors hover:bg-[var(--color-surface-hover)]"
      >
        {inner}
      </Link>
    </li>
  );
}
