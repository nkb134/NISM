import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import 'server-only';

// ── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ChapterFrontmatter = {
  chapter: number;
  title: string;
  topicCode: string;
  marks: number;
  difficulty: Difficulty;
  priority: 1 | 2 | 3;
  estimatedMinutes: number;
};

export type ChapterLayers = {
  summaryHtml: string;
  coreHtml: string;
  memoryHtml: string;
};

export type Chapter = ChapterFrontmatter & {
  slug: string;
  layers: ChapterLayers;
};

export type ChapterMeta = ChapterFrontmatter & { slug: string };

export type ReferenceDoc = {
  slug: string;
  title: string;
  html: string;
};

// ── Renderer setup ───────────────────────────────────────────────────────────

const renderer = new marked.Renderer();
renderer.blockquote = ({ text }) =>
  `<aside class="study-callout">${marked.parser(marked.lexer(text))}</aside>`;

marked.use({ renderer, gfm: true });

function mdToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

// ── Section splitter ─────────────────────────────────────────────────────────

const HEADING_PATTERNS = {
  summary: /^##\s*🎯\s*Summary Card\s*$/m,
  core: /^##\s*📖\s*Core Content\s*$/m,
  memory: /^##\s*🧠\s*Memory Hooks\s*$/m,
} as const;

function splitChapterLayers(body: string, slug: string): { summary: string; core: string; memory: string } {
  const summary = body.match(HEADING_PATTERNS.summary);
  const core = body.match(HEADING_PATTERNS.core);
  const memory = body.match(HEADING_PATTERNS.memory);

  if (!summary || !core || !memory || summary.index === undefined || core.index === undefined || memory.index === undefined) {
    throw new Error(
      `Chapter "${slug}" is missing one of the required layer headings ` +
        `(🎯 Summary Card / 📖 Core Content / 🧠 Memory Hooks).`
    );
  }

  if (!(summary.index < core.index && core.index < memory.index)) {
    throw new Error(`Chapter "${slug}" sections are out of order — expected Summary → Core → Memory.`);
  }

  const slice = (m: RegExpMatchArray, end: number): string => {
    const start = (m.index ?? 0) + m[0].length;
    return body.slice(start, end).trim();
  };

  return {
    summary: slice(summary, core.index),
    core: slice(core, memory.index),
    memory: slice(memory, body.length),
  };
}

// ── File loaders ─────────────────────────────────────────────────────────────

function studyRoot(examCode: string): string {
  return join(process.cwd(), 'src/data/exams', examCode, 'study');
}

/** Resolve the study directory for a locale. Hindi (and any future locale)
 *  lives under `study/<lang>/`; English content stays at `study/` (no
 *  subdir) so V-A's existing layout doesn't move. Falls back to the English
 *  root if the localised directory doesn't exist — paired with a
 *  "translation coming" banner in the page UI. */
function studyDir(examCode: string, lang: 'en' | 'hi' = 'en'): string {
  const root = studyRoot(examCode);
  if (lang === 'en') return root;
  const localised = join(root, lang);
  return existsSync(localised) ? localised : root;
}

/** True when the requested locale has its own directory (not falling back). */
export function hasLocalisedStudy(examCode: string, lang: 'en' | 'hi'): boolean {
  if (lang === 'en') return existsSync(studyRoot(examCode));
  return existsSync(join(studyRoot(examCode), lang));
}

function isFrontmatterValid(fm: Record<string, unknown>): fm is ChapterFrontmatter {
  return (
    typeof fm.chapter === 'number' &&
    typeof fm.title === 'string' &&
    typeof fm.topicCode === 'string' &&
    typeof fm.marks === 'number' &&
    (fm.difficulty === 'easy' || fm.difficulty === 'medium' || fm.difficulty === 'hard') &&
    (fm.priority === 1 || fm.priority === 2 || fm.priority === 3) &&
    typeof fm.estimatedMinutes === 'number'
  );
}

export function listChapters(examCode: string, lang: 'en' | 'hi' = 'en'): ChapterMeta[] {
  const dir = join(studyDir(examCode, lang), 'chapters');
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(dir, f), 'utf8');
      const { data } = matter(raw);
      if (!isFrontmatterValid(data)) {
        throw new Error(`Chapter "${f}" has invalid or missing frontmatter.`);
      }
      const slug = f.replace(/\.md$/, '').replace(/^\d+-/, '');
      return { slug, ...data };
    })
    .sort((a, b) => a.chapter - b.chapter);
}

export function getChapter(examCode: string, slug: string, lang: 'en' | 'hi' = 'en'): Chapter | null {
  const dir = join(studyDir(examCode, lang), 'chapters');
  if (!existsSync(dir)) return null;

  const file = readdirSync(dir).find(
    (f) => f.endsWith('.md') && f.replace(/\.md$/, '').replace(/^\d+-/, '') === slug
  );
  if (!file) return null;

  const raw = readFileSync(join(dir, file), 'utf8');
  const { data, content } = matter(raw);
  if (!isFrontmatterValid(data)) {
    throw new Error(`Chapter "${file}" has invalid frontmatter.`);
  }

  const sections = splitChapterLayers(content, slug);

  return {
    ...data,
    slug,
    layers: {
      summaryHtml: mdToHtml(sections.summary),
      coreHtml: mdToHtml(sections.core),
      memoryHtml: mdToHtml(sections.memory),
    },
  };
}

const REFERENCE_FILES = [
  { slug: 'overview', title: 'Overview & Exam Strategy' },
  { slug: 'number-sheet', title: 'Number Sheet' },
  { slug: 'common-traps', title: 'Common Traps' },
  { slug: 'memory-hooks', title: 'Memory Hooks Master List' },
  { slug: 'exam-day', title: 'Exam Day Checklist' },
] as const;

export function listReferences(examCode: string, lang: 'en' | 'hi' = 'en'): ReferenceDoc[] {
  const dir = studyDir(examCode, lang);
  if (!existsSync(dir)) return [];

  return REFERENCE_FILES.flatMap((meta) => {
    const path = join(dir, `${meta.slug}.md`);
    if (!existsSync(path)) return [];
    const raw = readFileSync(path, 'utf8');
    const parsed = matter(raw);
    return [
      {
        slug: meta.slug,
        title: (parsed.data.title as string | undefined) ?? meta.title,
        html: mdToHtml(parsed.content),
      },
    ];
  });
}

export function getReference(examCode: string, slug: string, lang: 'en' | 'hi' = 'en'): ReferenceDoc | null {
  return listReferences(examCode, lang).find((r) => r.slug === slug) ?? null;
}
