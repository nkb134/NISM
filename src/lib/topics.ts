// Single source of truth for NISM V-A topic taxonomy.
// Mirrors src/data/exams/nism-va/topics.json. Keep in sync if exam data changes.

export const NISM_VA_TOPICS = {
  INV: { name: 'Investment Landscape', weight: 8, order: 1 },
  STR: { name: 'Concept & Role of MF', weight: 8, order: 2 },
  SCH: { name: 'Schemes', weight: 6, order: 3 },
  REG: { name: 'Regulatory & Distribution', weight: 16, order: 4 },
  DOC: { name: 'Scheme Documents', weight: 8, order: 5 },
  NAV: { name: 'NAV, TER & Pricing', weight: 8, order: 6 },
  TAX: { name: 'Taxation', weight: 4, order: 7 },
  OPS: { name: 'Investor Services', weight: 15, order: 8 },
  RSK: { name: 'Risk & Returns', weight: 7, order: 9 },
  PRF: { name: 'Performance & Selection', weight: 20, order: 10 },
} as const satisfies Record<string, { name: string; weight: number; order: number }>;

export type TopicCode = keyof typeof NISM_VA_TOPICS;

export const TOPIC_CODES: TopicCode[] = Object.keys(NISM_VA_TOPICS) as TopicCode[];
