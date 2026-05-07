import type { MetadataRoute } from 'next';
import { CANONICAL_HOST } from '@/lib/canonical';
import { EXAM_CATALOG } from '@/data/exam-catalog';
import { listChapters, listReferences } from '@/lib/study/content';

const DEFAULT_LANGUAGES = ['en'] as const;

/** Build alternate-language URLs for the same path so Google can match
 *  /hi/foo to /foo as hreflang siblings. */
function alternates(path: string, languages: ReadonlyArray<'en' | 'hi'>) {
  const out: Record<string, string> = {};
  for (const lang of languages) {
    out[lang] = lang === 'en' ? `${CANONICAL_HOST}${path}` : `${CANONICAL_HOST}/${lang}${path}`;
  }
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const root: MetadataRoute.Sitemap = [
    { url: `${CANONICAL_HOST}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${CANONICAL_HOST}/dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
  ];

  const examPages: MetadataRoute.Sitemap = EXAM_CATALOG.flatMap((exam) => {
    const langs = exam.languages ?? DEFAULT_LANGUAGES;

    const base: MetadataRoute.Sitemap = [
      {
        url: `${CANONICAL_HOST}/exam/${exam.code}/study`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: exam.studyGuideStatus === 'available' ? 0.9 : 0.4,
        alternates: { languages: alternates(`/exam/${exam.code}/study`, langs) },
      },
      {
        url: `${CANONICAL_HOST}/exam/${exam.code}/tests`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: exam.mockTestStatus === 'available' ? 0.9 : 0.4,
        alternates: { languages: alternates(`/exam/${exam.code}/tests`, langs) },
      },
    ];

    if (exam.studyGuideStatus !== 'available') return base;

    const chapters = listChapters(exam.code).map<MetadataRoute.Sitemap[number]>((c) => ({
      url: `${CANONICAL_HOST}/exam/${exam.code}/study/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: alternates(`/exam/${exam.code}/study/${c.slug}`, langs) },
    }));
    const refs = listReferences(exam.code).map<MetadataRoute.Sitemap[number]>((r) => ({
      url: `${CANONICAL_HOST}/exam/${exam.code}/study/ref/${r.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: alternates(`/exam/${exam.code}/study/ref/${r.slug}`, langs) },
    }));

    return [...base, ...chapters, ...refs];
  });

  return [...root, ...examPages];
}
