// Per-exam freemium gate.
// Public, no login required: Chapter 1 of every available study guide, and
// one foundational mock-test set per exam. Everything else is auth-gated.
//
// Centralized here so the rule lives in one place — the catalog rows, the
// chapter and reference pages, and (in Phase 2) the tests page all consult
// these helpers.

/** Slug of the free chapter for each exam. */
const FREE_CHAPTER_SLUG: Record<string, string> = {
  'nism-va': 'investment-landscape',
  'nism-viii': 'basics-of-derivatives',
  'nism-xv': 'research-analyst-profession',
};

/** ID of the free mock-test set for each exam. */
const FREE_TEST_SET_ID: Record<string, string> = {
  'nism-va': 'set_mock',          // "Mock Test 1 — 30Q foundational mix"
  'nism-viii': 'set_viii_mock1',  // "Mock Test 1 — 30Q foundational mix" (VIII)
  'nism-xv': 'set_xv_mock1',      // "Mock Test 1 — 30Q foundational mix" (XV)
};

export function isFreeChapter(examCode: string, slug: string): boolean {
  return FREE_CHAPTER_SLUG[examCode] === slug;
}

export function isFreeTest(examCode: string, setId: string): boolean {
  return FREE_TEST_SET_ID[examCode] === setId;
}

/**
 * Reference docs (Number Sheet, Common Traps, etc.) are all login-gated.
 * They're high-leverage cross-cutting content; gating them is a major reason
 * to sign in. If a future exam wants a free reference doc, return true here.
 */
export function isFreeReference(_examCode: string, _slug: string): boolean {
  return false;
}

export function freeChapterSlugFor(examCode: string): string | undefined {
  return FREE_CHAPTER_SLUG[examCode];
}

export function freeTestSetIdFor(examCode: string): string | undefined {
  return FREE_TEST_SET_ID[examCode];
}
