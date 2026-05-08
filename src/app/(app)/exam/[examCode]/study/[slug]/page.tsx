import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getExamFromCatalog } from '@/data/exam-catalog';
import { getChapter, hasLocalisedStudy, listChapters } from '@/lib/study/content';
import { topicName } from '@/lib/topics';
import { ChapterReader } from '@/components/study/ChapterReader';
import { Stars } from '@/components/study/Stars';
import { isFreeChapter } from '@/lib/access';
import { getLocale, t } from '@/i18n';

type Props = { params: Promise<{ examCode: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { examCode, slug } = await params;
  const chapter = getChapter(examCode, slug);
  return { title: chapter ? `Ch ${chapter.chapter}: ${chapter.title}` : 'Chapter' };
}

export default async function ChapterPage({ params }: Props) {
  const { examCode, slug } = await params;
  const exam = getExamFromCatalog(examCode);
  if (!exam) notFound();
  const locale = await getLocale();
  const chapter = getChapter(exam.code, slug, locale);
  if (!chapter) notFound();

  // Hindi visitor + no Hindi chapter authored yet → English content with banner.
  const fellBackToEnglish =
    locale !== 'en' && !hasLocalisedStudy(exam.code, locale);
  const fallbackBanner = fellBackToEnglish ? await t('fallback.hindiSoon') : null;

  // Freemium gate: chapter 1 is free; rest require login.
  if (!isFreeChapter(exam.code, slug)) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      redirect(`/login?next=/exam/${exam.code}/study/${slug}`);
    }
  }

  const allChapters = listChapters(exam.code, locale);
  const idx = allChapters.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? allChapters[idx - 1] : null;
  const next = idx >= 0 && idx < allChapters.length - 1 ? allChapters[idx + 1] : null;

  const resolvedTopicName = topicName(chapter.topicCode) ?? chapter.topicCode;

  return (
    <main className="mx-auto max-w-[760px] px-6 py-10">
      {fallbackBanner && (
        <div
          lang="hi"
          className="mb-5 rounded-lg border px-4 py-3"
          style={{
            borderColor: '#fcd34d',
            background: '#fffbeb',
            color: '#78350f',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-devanagari)',
          }}
        >
          {fallbackBanner}
        </div>
      )}
      {/* Chapter header */}
      <div className="mb-6">
        <Link
          href={`/exam/${exam.code}/study` as never}
          style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
        >
          ← All chapters
        </Link>
        <h1
          className="mt-3 font-bold"
          style={{ fontSize: 'var(--text-xl)', lineHeight: 1.3 }}
        >
          <span style={{ color: 'var(--color-text-faint)' }}>
            Chapter {chapter.chapter} ·{' '}
          </span>
          {chapter.title}
        </h1>
        <div
          className="mt-2 flex flex-wrap items-center gap-3"
          style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
        >
          <span
            style={{
              background: 'var(--color-surface)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            {resolvedTopicName}
          </span>
          <span>{chapter.marks} marks</span>
          <span>·</span>
          <span>{chapter.estimatedMinutes} min read</span>
          <span>·</span>
          <span style={{ textTransform: 'capitalize' }}>{chapter.difficulty}</span>
          <span>·</span>
          <Stars priority={chapter.priority} />
        </div>
      </div>

      <ChapterReader examCode={exam.code} slug={chapter.slug} layers={chapter.layers} />

      {/* Practice CTA — deep-links into the topic-set when V-A questions are seeded */}
      {exam.mockTestStatus === 'available' && (
        <div
          className="mt-10 rounded-xl border p-5"
          style={{
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-surface-hover)',
          }}
        >
          <p style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
            Test yourself on {resolvedTopicName.toLowerCase()}
          </p>
          <p
            className="mt-1"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
          >
            Best signal you've actually retained the chapter. Open the topic-set when you're ready.
          </p>
          <Link
            href={`/exam/${exam.code}/tests` as never}
            className="mt-3 inline-flex items-center justify-center"
            style={{
              padding: '8px 16px',
              background: 'var(--color-navy)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            Practice this topic →
          </Link>
        </div>
      )}

      {/* Prev / next */}
      <nav
        className="mt-10 flex items-center justify-between border-t pt-6"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {prev ? (
          <Link
            href={`/exam/${exam.code}/study/${prev.slug}` as never}
            style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: 'var(--text-sm)' }}
          >
            ← Ch {prev.chapter}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/exam/${exam.code}/study/${next.slug}` as never}
            style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: 'var(--text-sm)' }}
          >
            Ch {next.chapter}: {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
