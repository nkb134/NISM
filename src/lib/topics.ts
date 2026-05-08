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

// V-B reuses 8 of V-A's topic codes (same labels, same domain). Two new
// codes: LEG (Legal Structure) and DIS (Distribution & Channel) — V-A
// rolls these into REG, but V-B treats them as separate chapters.
export const NISM_VB_NEW_TOPICS = {
  LEG: { name: 'Legal Structure of MFs', weight: 8, order: 3 },
  DIS: { name: 'Distribution & Channel', weight: 10, order: 6 },
} as const satisfies Record<string, TopicSpec>;

export const NISM_VII_TOPICS = {
  SMI: { name: 'Securities Market Intro', weight: 5, order: 1 },
  MKP: { name: 'Market Participants', weight: 10, order: 2 },
  BRO: { name: 'Broking Operations', weight: 20, order: 3 },
  RIS: { name: 'Risk Management (SORM)', weight: 15, order: 4 },
  CLG: { name: 'Clearing Process', weight: 15, order: 5 },
  STL: { name: 'Settlement Process', weight: 15, order: 6 },
  GRV: { name: 'Grievance & Arbitration', weight: 10, order: 7 },
  OTH: { name: 'Other Broker Services', weight: 10, order: 8 },
} as const satisfies Record<string, TopicSpec>;

export const NISM_XV_TOPICS = {
  RAP: { name: 'Research Analyst Profession', weight: 1, order: 1 },
  SMK: { name: 'Securities Market', weight: 2, order: 2 },
  TER: { name: 'Equity & Debt Terminology', weight: 2, order: 3 },
  RES: { name: 'Fundamentals of Research', weight: 5, order: 4 },
  ECO: { name: 'Economic Analysis', weight: 5, order: 5 },
  IND: { name: 'Industry Analysis', weight: 8, order: 6 },
  BIZ: { name: 'Business & Governance', weight: 6, order: 7 },
  FIN: { name: 'Financial Analysis', weight: 12, order: 8 },
  COR: { name: 'Corporate Actions', weight: 5, order: 9 },
  VAL: { name: 'Valuation Principles', weight: 12, order: 10 },
  COM: { name: 'Commodity Analysis', weight: 5, order: 11 },
  RTN: { name: 'Risk & Return', weight: 7, order: 12 },
  RPT: { name: 'Research Report Quality', weight: 5, order: 13 },
  LEX: { name: 'Legal & Regulatory (RA)', weight: 10, order: 14 },
  TEC: { name: 'Technical Analysis', weight: 15, order: 15 },
} as const satisfies Record<string, TopicSpec>;

export type TopicCode = keyof typeof NISM_VA_TOPICS;

export const TOPIC_CODES: TopicCode[] = Object.keys(NISM_VA_TOPICS) as TopicCode[];

/** Flat lookup across all registered exams. First-match-wins; safe because
 *  topic codes are namespaced per exam (no real collisions today). */
const ALL_TOPICS: Record<string, TopicSpec> = {
  ...NISM_VA_TOPICS,
  ...NISM_VB_NEW_TOPICS,
  ...NISM_VII_TOPICS,
  ...NISM_VIII_TOPICS,
  ...NISM_XV_TOPICS,
};

/** Return the human-readable name for a topic code, or null if unknown. */
export function topicName(code: string | null | undefined): string | null {
  if (!code) return null;
  return ALL_TOPICS[code]?.name ?? null;
}
