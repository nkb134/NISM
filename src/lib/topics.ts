// Per-exam topic taxonomies. Mirror src/data/exams/<code>/topics.json.
// Topic codes are namespaced per exam — a code may exist in multiple exams
// with different labels (e.g. V-A's INV = "Investment Landscape"; VIII has
// no INV, uses IPS = "Investor Protection"). Keep codes distinct across
// exams when possible to avoid label collisions in the topic chip.

type TopicSpec = { name: string; weight: number; order: number };

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
} as const satisfies Record<string, TopicSpec>;

export const NISM_VIII_TOPICS = {
  BAS: { name: 'Basics of Derivatives', weight: 10, order: 1 },
  IDX: { name: 'Understanding Index', weight: 5, order: 2 },
  FUT: { name: 'Forwards and Futures', weight: 20, order: 3 },
  OPT: { name: 'Options', weight: 20, order: 4 },
  ESS: { name: 'Equity Strategies', weight: 10, order: 5 },
  TRD: { name: 'Trading Mechanism', weight: 10, order: 6 },
  CLR: { name: 'Clearing & Settlement', weight: 10, order: 7 },
  ELG: { name: 'Legal & Regulatory', weight: 5, order: 8 },
  TXA: { name: 'Accounting & Taxation', weight: 5, order: 9 },
  IPS: { name: 'Sales & Investor Protection', weight: 5, order: 10 },
} as const satisfies Record<string, TopicSpec>;

export type TopicCode = keyof typeof NISM_VA_TOPICS;

export const TOPIC_CODES: TopicCode[] = Object.keys(NISM_VA_TOPICS) as TopicCode[];

/** Flat lookup across all registered exams. First-match-wins; safe because
 *  topic codes are namespaced per exam (no real collisions today). */
const ALL_TOPICS: Record<string, TopicSpec> = {
  ...NISM_VA_TOPICS,
  ...NISM_VIII_TOPICS,
};

/** Return the human-readable name for a topic code, or null if unknown. */
export function topicName(code: string | null | undefined): string | null {
  if (!code) return null;
  return ALL_TOPICS[code]?.name ?? null;
}
