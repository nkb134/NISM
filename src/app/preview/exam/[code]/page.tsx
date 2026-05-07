// Founder review surface for newly-authored exam content. Single page that
// surfaces every authored asset for a given exam so the founder can do a
// 10-minute spot-check before flipping `studyGuideStatus`/`mockTestStatus`
// to 'available' in EXAM_CATALOG.
//
// Public route by URL path but `noindex` so it never leaks to search.
// No auth — the founder shouldn't have to sign in to spot-check.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { questions, testSets, topics } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { listChapters, listReferences } from '@/lib/study/content';

type Props = { params: Promise<{ code: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  return {
    title: `Preview · ${code}`,
    robots: { index: false, follow: false },
  };
}

export default async function ExamPreview({ params }: Props) {
  const { code } = await params;
  const exam = getExamFromCatalog(code);
  if (!exam) notFound();

  const [chapters, references, topicRows, setRows, qCount] = await Promise.all([
    Promise.resolve(listChapters(code)),
    Promise.resolve(listReferences(code)),
    db.select().from(topics).where(eq(topics.examCode, code)).orderBy(topics.displayOrder),
    db.select().from(testSets).where(eq(testSets.examCode, code)).orderBy(testSets.displayOrder),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(questions)
      .where(eq(questions.examCode, code))
      .then((r) => r[0]?.n ?? 0),
  ]);

  return (
    <main className="mx-auto max-w-[960px] px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p
          className="font-semibold uppercase"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.4px',
          }}
        >
          Preview surface · noindex
        </p>
        <h1 className="mt-1 font-bold" style={{ fontSize: 'var(--text-xl)' }}>
          {exam.shortName} — content review
        </h1>
        <p
          className="mt-2"
          style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
        >
          Spot-check every authored asset for this exam before flipping{' '}
          <code>studyGuideStatus</code> / <code>mockTestStatus</code> to{' '}
          <code>'available'</code> in <code>src/data/exam-catalog.ts</code> and the matching
          entries in <code>src/lib/access.ts</code>.
        </p>
      </header>

      <Section title={`Catalog status — currently ${exam.studyGuideStatus} / ${exam.mockTestStatus}`}>
        <Grid>
          <Stat label="Pass mark" value={`${exam.passMarkPercent}%`} />
          <Stat label="Duration" value={`${exam.durationMinutes} min`} />
          <Stat label="Total Qs (real exam)" value={exam.totalQuestions} />
          <Stat label="Negative marking" value={exam.negativeMarking ? 'Yes' : 'No'} />
        </Grid>
      </Section>

      <Section title={`DB-seeded counts (refresh after \`npm run db:seed\`)`}>
        <Grid>
          <Stat label="Topics" value={topicRows.length} />
          <Stat label="Test sets" value={setRows.length} />
          <Stat label="Question pool" value={qCount} />
          <Stat
            label="Mocks vs topic drills"
            value={`${setRows.filter((s) => !s.topicCode).length} / ${setRows.filter((s) => !!s.topicCode).length}`}
          />
        </Grid>
      </Section>

      <Section title={`Chapters (${chapters.length})`}>
        {chapters.length === 0 ? (
          <Empty>No chapters authored yet. Drop MDs into <code>src/data/exams/{code}/study/chapters/</code>.</Empty>
        ) : (
          <List>
            {chapters.map((ch) => (
              <li key={ch.slug}>
                <Link
                  href={`/exam/${code}/study/${ch.slug}` as never}
                  style={{ color: 'var(--color-navy)', fontSize: 'var(--text-sm)' }}
                >
                  Ch {ch.chapter} — {ch.title}
                </Link>
                <span
                  className="ml-2"
                  style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
                >
                  · topic {ch.topicCode} · ~{ch.estimatedMinutes ?? '?'} min
                </span>
              </li>
            ))}
          </List>
        )}
      </Section>

      <Section title={`Reference docs (${references.length})`}>
        {references.length === 0 ? (
          <Empty>No reference docs authored yet (overview / number-sheet / common-traps / memory-hooks / exam-day).</Empty>
        ) : (
          <List>
            {references.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/exam/${code}/study/ref/${r.slug}` as never}
                  style={{ color: 'var(--color-navy)', fontSize: 'var(--text-sm)' }}
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </List>
        )}
      </Section>

      <Section title={`Test sets (${setRows.length})`}>
        {setRows.length === 0 ? (
          <Empty>No test sets seeded. Check <code>sets.json</code> + run seed.</Empty>
        ) : (
          <List>
            {setRows.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/exam/${code}/test/${s.id}` as never}
                  style={{ color: 'var(--color-navy)', fontSize: 'var(--text-sm)' }}
                >
                  {s.name}
                </Link>
                <span
                  className="ml-2"
                  style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}
                >
                  · {s.topicCode ?? 'mixed'} · {Math.round(s.durationSeconds / 60)} min
                  {s.isDynamic ? ' · dynamic' : ''}
                </span>
              </li>
            ))}
          </List>
        )}
      </Section>

      <Section title={`Topics (${topicRows.length})`}>
        {topicRows.length === 0 ? (
          <Empty>No topics seeded.</Empty>
        ) : (
          <List>
            {topicRows.map((t) => (
              <li key={t.code} style={{ fontSize: 'var(--text-sm)' }}>
                <strong>{t.code}</strong> — {t.name}
                <span style={{ color: 'var(--color-text-faint)', marginLeft: 8 }}>
                  · {t.weightInExam ?? 0}% weight
                </span>
              </li>
            ))}
          </List>
        )}
      </Section>

      <footer
        className="mt-10 rounded-xl border p-5"
        style={{
          borderColor: 'var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-surface-hover)',
        }}
      >
        <h3 className="font-bold" style={{ fontSize: 'var(--text-md)' }}>
          Activation checklist
        </h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          <li>Spot-check Ch 1 + free mock + 5 random questions above.</li>
          <li>Flip <code>studyGuideStatus</code> + <code>mockTestStatus</code> to <code>'available'</code> in <code>src/data/exam-catalog.ts</code>.</li>
          <li>Add entries to <code>FREE_CHAPTER_SLUG</code> + <code>FREE_TEST_SET_ID</code> in <code>src/lib/access.ts</code>.</li>
          <li>Commit, push. Sitemap + landing teaser pick it up automatically.</li>
        </ol>
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2
        className="mb-3 font-semibold"
        style={{ fontSize: 'var(--text-md)', color: 'var(--color-text)' }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{children}</div>;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-lg border p-3"
      style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)' }}
    >
      <div className="tabular font-bold" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-navy)' }}>
        {value}
      </div>
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
        {label}
      </div>
    </div>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1.5">{children}</ul>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: 'var(--color-text-faint)',
        fontSize: 'var(--text-sm)',
        fontStyle: 'italic',
      }}
    >
      {children}
    </p>
  );
}
