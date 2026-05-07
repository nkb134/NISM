import type { MetadataRoute } from 'next';
import { CANONICAL_HOST } from '@/lib/canonical';
import { EXAM_CATALOG } from '@/data/exam-catalog';
import { listChapters, listReferences } from '@/lib/study/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const root: MetadataRoute.Sitemap = [
    { url: `${CANONICAL_HOST}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${CANONICAL_HOST}/dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
  ];

  const examPages: MetadataRoute.Sitemap = EXAM_CATALOG.flatMap((exam) => {
    const base: MetadataRoute.Sitemap = [
      {
        url: `${CANONICAL_HOST}/exam/${exam.code}/study`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: exam.studyGuideStatus === 'available' ? 0.9 : 0.4,
      },
      {
        url: `${CANONICAL_HOST}/exam/${exam.code}/tests`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: exam.mockTestStatus === 'available' ? 0.9 : 0.4,
      },
    ];

    if (exam.studyGuideStatus !== 'available') return base;

    const chapters = listChapters(exam.code).map<MetadataRoute.Sitemap[number]>((c) => ({
      url: `${CANONICAL_HOST}/exam/${exam.code}/study/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
    const refs = listReferences(exam.code).map<MetadataRoute.Sitemap[number]>((r) => ({
      url: `${CANONICAL_HOST}/exam/${exam.code}/study/ref/${r.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...base, ...chapters, ...refs];
  });

  return [...root, ...examPages];
}
