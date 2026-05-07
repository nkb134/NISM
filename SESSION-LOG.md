# Session log — NISMPracticeTests build

**Last updated:** 2026-05-07 · Phase 4 Sprint 5 shipped — NISM Series V-B (MF Foundation) live
**Repo:** https://github.com/nkb134/NISM
**Owner:** Nissar Behera (nkb134) · CPO of Optimize fintech
**Domains:** nismpracticetests.com (canonical) + nismmocktest.xyz (mirror)

> **Anyone joining cold (Claude or human): read this file first, then `CLAUDE.md` and `DESIGN.md`. After every commit, append the new commit + status changes to this log so the doc never goes stale.**

---

## Where we are

### Phase 1 — Foundation ✅

Stack scaffolded, DB live, auth working end-to-end.

- Next.js 15.5 (App Router, Turbopack dev, server components by default)
- TypeScript strict, Tailwind v4 (CSS-defined `@theme` tokens in `globals.css`)
- Drizzle ORM + Neon Postgres 17 (AWS Singapore, pooled connection)
- Better-Auth (magic link + Google OAuth wired but disabled — no creds yet)
- Resend for transactional email (free tier, `onboarding@resend.dev` sender in dev)
- Schema: 10 tables — `users / sessions / accounts / verifications` (Better-Auth, plural names mapped to its singular models via `schema:` option), `exams / topics / test_sets / questions / test_set_questions / attempts`. Migration `0000_init.sql`.
- Seed: 522 questions across 10 topics, 32 sets, 530 set→Q rows. Deterministic UUIDv5 keys keep `attempts.responses[].questionId` stable across reseeds.
- DB env loads `.env.local` (drizzle/seed use `dotenv.config({ path: ['.env.local', '.env'] })`).

### Phase 2 — Test runner + result page ✅

- `/exam/[code]/test/[setId]` — full-screen overlay runner. Sticky header with timer (red <60s) + thin progress bar. Question card with topic-coloured Q-tag, radio options (large hit targets), Mark for Review pill, Clear Answer link. Sticky palette sidebar on lg+, slide-up drawer on mobile.
- Palette: 5 states — unvisited / visited-not-answered / answered / marked / marked+answered — plus current outline. Colours match DESIGN.md exactly (functional, not decorative).
- Keyboard shortcuts: 1-4 select option, M mark, N next, P prev.
- End-Test modal with answered/skipped/marked tally.
- Submit server action (`actions.ts`) re-fetches `correctIndex` from DB so the client can't fake a perfect score.
- Anon submissions render result inline; signed-in writes to `attempts` and redirects to `/test/result/[attemptId]`.
- Result page: hero band with **score arc** (radial SVG showing pct + pass-mark tick), 3-4 stat cards, topic breakdown (sorted weakest-first, colour-coded bars), per-question review with filter pills (All / Wrong / Skipped / Marked) and explanation callouts.
- 10-colour **topic palette** (one OKLCH-balanced colour per V-A topic) lives in globals.css + `src/components/topic/TopicChip.tsx`. Used everywhere a topic identity needs to read at a glance.

### Phase 3 (partial) — Progress + PWA install ✅

- `/exam/[code]/progress` — auth-gated. Stats row (tests taken / avg / best / pass rate) + topic mastery (recency-weighted, 14-day half-life — Q today counts 2× one from 2 weeks ago) + recent attempts list (show-all expand).
- **Progress** tab added to exam-layout header (signed-in only).
- Result page CTA reorders to "See full progress →" as primary.
- PWA: `src/app/manifest.ts` returns Next 15 dynamic manifest at `/manifest.webmanifest`. Icons under `public/icons/` (192/512 in any + maskable, 180 apple-touch, 32/16 favicons) rendered from an HTML brand-mark template via headless Chrome. Apple Web App meta + theme color wired in root layout.
- iOS install works fully via "Add to Home Screen". Android Chrome auto-prompt requires a service worker (next item).

### Phase 3 (continued) — Landing-v2 design refresh ✅

Founder feedback: original landing read as "well-built spec but missing professional finish." Refresh shipped without breaking DESIGN.md:

- **Hero rebuilt** as a 2-col (lg+) grid: confident headline with lime-underline accent on "real exam-style mocks" + a CSS-only phone-frame embedding a real screenshot of `/exam/nism-va/study/investment-landscape` (captured via headless Chrome to `public/images/hero-chapter.png`). Show-the-product, Unacademy-pattern.
- **Stats strip** under hero — real derived numbers (`522 questions`, `12 chapters`, `32 mock tests`, `18 exams catalogued`). No fictional testimonials.
- **Why-us blocks** got minimal hand-rolled SVG line icons (check-shield / spark / phone) in `src/components/marketing/Icon.tsx`. Same icon set powers catalog cards.
- **Catalog cards** (landing teaser + `/dashboard`) now lead with a navy/lime gradient icon block. `iconForExamCode()` maps exam family → glyph (briefcase for MF, chart-bar for derivatives, lightbulb for adviser, shield-check for compliance, building-library for AIF/PMS, academic-cap for foundation/operations). Instant scannability without clutter.
- **Footer** rebuilt in 3 columns (brand · product · built-openly with GitHub link).
- **Mobile gotcha caught:** the radial-glow blob behind the phone frame used negative insets (`-8%`) to extend past the column. Wrapped in `overflow-hidden` so it clips on narrow viewports without losing the visual.

What didn't change: DESIGN.md tokens, Schoolnet runner aesthetic, no animation budget bust, no new deps.

### Phase 4 Sprint 5 — NISM Series V-B (MF Foundation) ✅

Shipped 2026-05-07. Fourth loaded exam after V-A, VIII, XV. Cheapest authoring sprint per content unit (lots of overlap with V-A's domain).

**The "New Cadre" exam:**
- 50 Qs in 75 min, 50% pass mark, **NO negative marking**.
- Foundational distributor exam — V-B passers can sell only specific simple schemes (Index, Large-cap, Gilt, FMP, equity/gold ETF, Liquid, Ultra-short, Money Market). To sell broader products, they must pass V-A.

**Content** (Claude-authored from `Study Materials/225/NISM SERIES V-B MFF Workbook March 2026_Final.pdf`):
- 10 chapters in V-A 3-layer format. Tighter than V-A/VIII chapters (~500-700 words each vs 1000+) since V-B is foundational scope.
- 5 reference docs: `overview.md`, `number-sheet.md`, `common-traps.md` (25 entries), `memory-hooks.md`, `exam-day.md`.
- **77-question pool** by syllabus weight: INV 5, STR 9, LEG 6, SCH 5, DOC 9, DIS 8, PRF 9, TAX 5, OPS 15, REG 6.
- **6 test sets**: 1 free 25Q mock + 4 topic drills (OPS/STR/DOC/PRF, the heaviest topics) + 1 dynamic 50Q full simulator (75 min, no negative marking).

**Topic taxonomy decision:**
- V-B reuses **8 of V-A's topic codes** (INV, STR, SCH, DOC, PRF, TAX, OPS, REG) — same labels, same domain semantics. The two topic registries (`NISM_VA_TOPICS` + `NISM_VB_NEW_TOPICS`) merge cleanly via `ALL_TOPICS`.
- Two V-B-only codes: **LEG** (Legal Structure of MFs, Ch 3) and **DIS** (Distribution & Channel, Ch 6). V-A bundles both into REG; V-B treats them as separate chapters.
- `lib/topics.ts` adds `NISM_VB_NEW_TOPICS` (just LEG + DIS); the rest are reused from V-A.
- `TopicChip.tsx` ALIAS extended: LEG → NAV slot, DIS → RSK slot. The other 8 codes use V-A's native colours (no aliasing needed).

**Activation:**
- `EXAM_CATALOG`: nism-vb flipped to `studyGuideStatus: 'available'`, `mockTestStatus: 'available'`. Was `coming-soon` since project start.
- `access.ts`: `FREE_CHAPTER_SLUG['nism-vb'] = 'investment-landscape'` (slug matches V-A's by design — same chapter content).
- `FREE_TEST_SET_ID['nism-vb'] = 'set_vb_mock1'`.
- `/preview/exam/nism-vb` works for spot-check.

**Key V-B vs V-A differences (high-yield for the chip-rendering vs domain understanding):**
- V-B: 50 Qs / 75 min / 50% pass / **NO negative marking**.
- V-A: 100 Qs / 120 min / 50% pass / no negative marking either.
- Content scope: V-B is deliberately narrower — no mid/small-cap, no sectoral, no aggressive hybrid, no derivatives.
- The chapter structure mirrors V-A but Ch 4 is unique to V-B ("MF Products for the New Cadre of Distributors").

**Founder follow-up:**
1. `npm run db:seed` — V-A/VIII/XV untouched, only V-B added.
2. Visit `/preview/exam/nism-vb` for spot-check. Random-sample Ch 9 (Investor Services — 20% weight, biggest), free mock, 5 random questions.
3. Once happy, exam is publicly visible (catalog + sitemap auto-pick it up; landing teaser shows it in the first 6).

**Status of all 18 exams:**
- ✅ Live: V-A, V-B, VIII, XV (4 of 18).
- ⏳ Coming soon: 14 remaining.

### Phase 4 Sprint 4 — NISM Series XV (Research Analyst) ✅

Shipped 2026-05-07. Third loaded exam after V-A and VIII. Highest-search-volume cert in the queue. Largest single-exam content drop yet (15 chapters vs the usual 10-12).

**Catalog setup:**
- 'XV' added to `ExamSeries` type.
- New row in `EXAM_CATALOG` at `displayOrder: 4`. Used a one-shot Python script to bump every other row's displayOrder +1 (manual edits to 14 rows would've been error-prone). The script is throwaway — not committed.
- 100 Qs, **180 min** (longer than V-A/VIII's 120), 60% pass mark, negative marking 0.25, Feb 2026 syllabus.

**Content** (Claude-authored end-to-end from `Study Materials/NISM-Series-XV-ResearchAnalyst-Workbook (February 2026).pdfSD.pdf`):
- 15 chapters in V-A 3-layer format. Heaviest by syllabus weight: **Ch 15 Technical Analysis (15%) + Ch 8 Financial Analysis (12%) + Ch 10 Valuation (12%) + Ch 14 Legal & Regulatory (10%) = 49% of marks**.
- 5 reference docs: `overview.md` + `number-sheet.md` + `common-traps.md` (30 entries — biggest yet) + `memory-hooks.md` + `exam-day.md`.
- **122-question pool** by syllabus weight: RAP 2, SMK 3, TER 4, RES 6, ECO 6, IND 10, BIZ 8, FIN 14, COR 6, VAL 14, COM 6, RTN 8, RPT 6, LEX 12, TEC 18.
- **6 test sets**: 1 free 30Q mock + 4 topic drills (FIN/VAL/TEC/LEX — the four highest-weight topics) + 1 dynamic 100Q full simulator (180 min, matches the real exam).

**Topic taxonomy:**
- 15 distinct topic codes (RAP/SMK/TER/RES/ECO/IND/BIZ/FIN/COR/VAL/COM/RTN/RPT/LEX/TEC). None collide with V-A or VIII codes.
- `lib/topics.ts` adds `NISM_XV_TOPICS`; `ALL_TOPICS` lookup includes it.
- `TopicChip.tsx` ALIAS map extended: 15 codes → 10 V-A OKLCH colour slots. **5 codes share with another XV topic** (RAP+COM share INV slot, etc.) — chip labels still distinguish them, but visually adjacent chips can collide. **Follow-up**: when 4+ exams are live, do a real palette refresh adding ~6 fresh OKLCH ramps to globals.css.

**Activation:**
- `EXAM_CATALOG`: nism-xv flipped to `studyGuideStatus: 'available'`, `mockTestStatus: 'available'`.
- `access.ts`: `FREE_CHAPTER_SLUG['nism-xv'] = 'research-analyst-profession'`; `FREE_TEST_SET_ID['nism-xv'] = 'set_xv_mock1'`.
- `/preview/exam/nism-xv` works for spot-check.

**Founder follow-up:**
1. `npm run db:seed` to load XV into Postgres. Idempotent — V-A + VIII untouched.
2. Visit `/preview/exam/nism-xv` — random-sample Ch 8 (financial analysis), Ch 10 (valuation), Ch 15 (technical) since those are the heavy chapters.
3. Spot-check 5 questions from FIN, 5 from VAL, 5 from TEC. The numerical Qs (CAPM, Gordon Growth, DuPont) are the most error-prone if I made calculation slips — verify those carefully.
4. Once happy, exam is publicly visible (catalog + sitemap auto-pick it up; landing teaser shows it in the first 6).

**Notes:**
- Workbook source: `/Users/nissar.behera/Documents/NISM/Study Materials/NISM-Series-XV-ResearchAnalyst-Workbook (February 2026).pdfSD.pdf`. Raw extraction at `src/data/exams/nism-xv/research/raw/en/full.txt` (gitignored).
- This was the longest content sprint yet (~3700 insertions). Per-chapter chapters are tighter than V-A/VIII (~600-800 words each vs 1000+) given the 15-chapter syllabus — same quality bar, just less per-chapter padding.
- 'TopicChip ALIAS map saturating' is the next infra refactor when the 4th exam ships (V-B's MFF is structurally a subset of V-A so codes overlap might be acceptable; check before adding a 5th).

### Phase 4 Sprint 3 — NISM Series VIII (Equity Derivatives) ✅

Shipped 2026-05-07. Second loaded exam after V-A. Claude-authored end-to-end from the March 2026 workbook PDF; founder spot-checks via `/preview/exam/nism-viii`.

**Content:**
- 10 chapters in V-A 3-layer format (🎯 Summary / 📖 Core / 🧠 Memory). Chapters 3 (Forwards & Futures) + 4 (Options) sized largest to match the 20% syllabus weight each. Total ~10 KB markdown per chapter.
- 5 reference docs at `src/data/exams/nism-viii/study/`: `overview.md`, `number-sheet.md`, `common-traps.md`, `memory-hooks.md`, `exam-day.md`.
- **120-question pool** split by syllabus weight: BAS 12, IDX 6, FUT 24, OPT 24, ESS 12, TRD 12, CLR 12, ELG 6, TXA 6, IPS 6.
- **6 test sets** at `sets.json`: 1 free 30Q mock + 4 topic drills (FUT / OPT / ESS / CLR) + 1 dynamic 100Q full simulator (matches real exam: 120 min, negative marking 0.25, pass 60%).

**Topic taxonomy decision:**
- 10 distinct topic codes for VIII (BAS / IDX / FUT / OPT / ESS / TRD / CLR / ELG / TXA / IPS) chosen to NOT collide with V-A's INV / STR / SCH / REG / DOC / NAV / TAX / OPS / RSK / PRF.
- `lib/topics.ts` adds `NISM_VIII_TOPICS` + a flat `ALL_TOPICS` lookup. New `topicName(code)` helper exported.
- `TopicChip.tsx` refactored: `topicLabel` reads from the unified registry; `topicColors` uses an `ALIAS` map that points VIII codes onto V-A's 10 OKLCH colour slots (BAS→INV, IDX→STR, FUT→SCH, etc.) so chips have colour without 10 fresh palette ramps. Safe because V-A and VIII chips never appear on the same page.

**Activation:**
- `EXAM_CATALOG`: nism-viii flipped to `studyGuideStatus: 'available'`, `mockTestStatus: 'available'`. `displayOrder: 3` keeps it third on the catalog (after V-A and V-B).
- `access.ts`: `FREE_CHAPTER_SLUG['nism-viii'] = 'basics-of-derivatives'`; `FREE_TEST_SET_ID['nism-viii'] = 'set_viii_mock1'`. Ch 1 + 30Q mock free; rest gated.
- `/preview/exam/nism-viii` renders the founder review surface (built in Sprint 2).

**Founder follow-up:**
1. `npm run db:push` to apply the `lang` column migration from Sprint 2 (additive, harmless if re-run).
2. `npm run db:seed` to load VIII into Postgres. Idempotent — V-A stays untouched.
3. Visit `/preview/exam/nism-viii` to spot-check Ch 1 + the free mock + 5 random questions.
4. If anything reads off, ping Claude — fixes go in same-session.
5. Once happy, the exam is already publicly visible (catalog + sitemap auto-pick it up).

**Notes for future sprints:**
- Workbook source: `/Users/nissar.behera/Documents/NISM/Study Materials/256/`. Raw extraction at `src/data/exams/nism-viii/research/raw/en/` (gitignored).
- Same flow now repeats cheaply for XV (Research Analyst, top-level workbook) → V-B (`Study Materials/225/`) → rest.
- TopicChip ALIAS map will need extension for the next exams; consider per-exam colour palettes if/when 3+ exams share the same page (unlikely on per-exam routes).

### Phase 4 Sprint 2 — onboarding tooling + i18n scaffold ✅

Shipped 2026-05-07. Code-only sprint — no new exam content yet, but the rails are laid for Sprint 3 (VIII Equity Derivatives) to be a content-only push.

**Workstream C (exam onboarding):**
- `src/data/seed.ts` rewritten to walk `src/data/exams/` and seed every directory with a `meta.json` (skips `_template/` and dotfiles). Adding a new exam = drop the directory, run `npm run db:seed`. Idempotent guarantee preserved (UUIDs are deterministic per `examCode|question|v1` namespace, scoped per exam so collisions across exams are impossible).
- `src/data/exams/_template/` skeleton: `meta`, `topics`, `sets`, `set-question-map`, `questions/top.json`, `study/CONTENT-FORMAT.md`, `study/chapters/01-example.md`, `research/portal-notes.md`. Inline `"//"` keys in each JSON act as commentary.
- `scripts/extract-workbook.py` — pypdf-based extractor. Dumps per-chapter text under `src/data/exams/<code>/research/raw/<lang>/`. Naive chapter-heading detector; founder reviews splits before authoring. Workbook IP — gitignored.
- `/preview/exam/[code]` — single-page founder review surface. Shows catalog status, DB-seeded counts, chapter list, reference docs, test sets, topics, plus an activation checklist. `noindex`. Auth-free for founder convenience.
- `docs/ADDING-AN-EXAM.md` — one-page playbook covering the full flow (extract → portal capture → author → seed → spot-check → activate). Calls out the don'ts (don't change `examCode` post-seed, don't paste verbatim, don't ship below the V-A Ch 1 quality bar).
- `.gitignore` extends to `src/data/exams/*/research/raw/`, `research/portal-capture/`, and per-exam `research/portal-notes.md` — only `_template/research/portal-notes.md` is exempted so the template stays self-documenting.

**Workstream E (i18n scaffolding):**
- `middleware.ts` rewrites `/hi/*` → `/*` and stamps an `x-locale: hi` header. English (default) is prefix-less so existing URLs and SEO equity stay intact. Matcher excludes API routes and static assets.
- `src/i18n/constants.ts` — client-safe `Locale` type, `LOCALES`, `LOCALE_PREFIXES`, `localePrefix`, `stripLocalePrefix`, `isLocale`. `src/i18n/index.ts` — server-only `getLocale()` (reads `x-locale`) and `t(key, vars?)` with EN fallback. Two JSON dictionaries, ~20 keys each.
- `<LangSwitcher>` (client) — EN/हि toggle in SiteNav. `usePathname`-driven, links to the localised counterpart of the current path. Zero state.
- `src/lib/study/content.ts` — `listChapters` / `getChapter` / `listReferences` / `getReference` now take an optional `lang` param. Hindi content lives at `src/data/exams/<code>/study/hi/...`; falls back to the English root if not authored yet, paired with `fallback.hindiSoon` banner copy.
- `EXAM_CATALOG` entries gain optional `languages: ('en' | 'hi')[]` (defaults to `['en']`).
- `src/app/sitemap.ts` emits hreflang `alternates.languages` for every exam page based on the exam's available languages.
- `src/lib/db/schema.ts` — `questions.lang text not null default 'en'` + `exam_lang_idx`. **Founder action: `npm run db:generate && npm run db:push`** when convenient (additive, existing rows backfill cleanly).
- `globals.css`: `:lang(hi)` falls through to a Devanagari font stack (Noto Sans Devanagari → Mangal → Kohinoor → Nirmala UI). Self-hosted Noto download follows when first Hindi content lands.
- Root layout's `<html lang>` attribute reads from `getLocale()`.

**Sprint 3 ready to start whenever:** VIII Equity Derivatives content. Workbook at `Study Materials/256/`. Claude builds, founder spot-checks via `/preview/exam/nism-viii`.

### Phase 4 Sprint 1 — logos, landing v3, favicon ✅

Shipped 2026-05-07.

- **`<ExamMark>`** at `src/components/marketing/ExamMark.tsx`. Hybrid identity: series monogram ("V-A", "VIII", "XIX-A") on the navy/lime gradient + family glyph as a small corner accent. Coming-soon exams get a gray gradient + muted accent — visual telegraph for which cards are click-worthy. Used in landing teaser, `/dashboard`, `/profile`. Solves the audit finding that V-A vs V-B were visually identical.
- **`Icon.tsx` refinements** — stroke-width auto-scales with size (2.0 ≤16, 1.8 ≤24, 1.6 ≥32). Spark glyph got a centre dot; building-library re-shaped to read as columns rather than shelves.
- **Hero CTA strengthened** — "Start free — Chapter 1" replaces "Try a free chapter"; green "100% free · no card · no signup for Chapter 1" pill above the buttons.
- **Live counter band** at `src/components/marketing/LiveCounters.tsx` — server fetches `attempts this week` from the `attempts` table; renders 4 tabular counters that tween 0 → value on first scroll-into-view (IntersectionObserver, respects `prefers-reduced-motion`). Replaces the static hardcoded stats strip.
- **Comparison table** — 3 columns × 6 rows, honest trade-offs vs workbook-only and paid prep sites. Competitors named generically — legal hygiene. Third column highlighted (us) as visual anchor.
- **Testimonials** at `src/components/marketing/TestimonialScroller.tsx` — 6 synthetic v1 cards with EN/HI/Hinglish mix, plausible Indian student personas (Mumbai/Pune/Bengaluru/Delhi/Hyderabad/Chennai), **process-focused never outcome-claiming**. Horizontal scroll-snap, zero JS. Swap entries 1-by-1 as real opt-in quotes come in.
- **FAQ accordion** at `src/components/marketing/FAQAccordion.tsx` — 6 Q&As above the footer using native `<details>`; emits FAQPage JSON-LD for Google rich results. Defensively escapes `</` in the payload so no copy edit can break the surrounding HTML.
- **Favicon refresh** — hand-rolled SVG at `public/icons/favicon.svg` with `prefers-color-scheme` dark/light variants; `public/favicon.ico` generated from the existing 32px PNG via PIL for legacy contexts; `scripts/render-brand-mark.html` re-added so future icon regenerations are one command (`chrome --headless --screenshot=icon-512.png "file://...?size=512"`).

**Open decisions still hot for Sprint 2:** add SSH key on GitHub (founder, UI), revoke leaked PATs (founder, UI), Resend domain DNS (founder, UI), Vercel deploy (founder, UI). Plus the Sprint 2 build: auto-discover seed, `_template/`, `/preview/exam/<code>` review surface, i18n scaffolding (EN/HI). First content exam (VIII) follows in Sprint 3 — Claude builds, founder reviews.

### Phase 3 close-out — SW + PostHog + profile + tour ✅

All four pending items shipped on 2026-05-07.

- **Service worker** at `public/sw.js`. Four buckets:
  - `nism-shell-v1`: app shell (`/`, `/dashboard`, `manifest.webmanifest`) network-first, cache fallback. Pre-warmed on install.
  - `nism-study-v1`: `/exam/*/study*` cache-first with background refresh.
  - `nism-dynamic-v1`: `/api/*` and `/exam/*/test/*` network-first, no stale. `/api/auth/*` bypasses the SW entirely (auth callbacks must hit network).
  - `nism-assets-v1`: `/icons /images /brand /_next/static + fonts/images by extension` cache-first.
  Bumping `CACHE_VERSION` purges old caches on activate. Hand-rolled, ~150 lines, no `next-pwa`/Serwist dep.
  Registered via `<ServiceWorkerRegister />` in root layout — production-only (Turbopack HMR + SW = pain in dev).
- **PostHog wiring** — lightweight HTTP client at `src/lib/analytics.ts` posts directly to `/capture/`. No `posthog-js` dep (~30 LOC vs ~30KB gzipped). Distinct id is a `crypto.randomUUID()` in `localStorage` (no cookies). All four events fire:
  - `signup` — fired by `<AnalyticsBootstrap />` on first identify when the server has flagged `users.createdAt` as <5 min old. Per-user `ph_signup_fired:<userId>` flag prevents double-firing.
  - `test_started` — `TestRunner` mount.
  - `topic_drill` — `TestRunner` mount, only when the set has `topicCode` (not a mock/simulator).
  - `test_completed` — after `submitAttempt` resolves successfully, before any redirect; uses `keepalive: true` so the request finishes through the navigation.
  All wiring no-ops until `NEXT_PUBLIC_POSTHOG_KEY` is set.
- **Profile page** at `/profile` (auth-gated, redirects with `?next=/profile`). Lists one row per exam the user has attempted: best score, average, attempt count, last-attempt-relative ("3d ago"). New `listExamSummaries` query at `src/lib/db/queries.ts` aggregates with a single grouped SQL round-trip. Sign-out button clears the PostHog distinct id so the next session starts anonymous (prevents identity leakage on shared devices). Email pill in `SiteNav` and `/dashboard` links to `/profile`.
- **Product tour** — `<ProductTour />` is a small dismissable floating card pinned bottom-right of `/dashboard`. Four steps (~30s read), localStorage-gated by `tour_seen_v1`, deliberately not a full-screen overlay or anchored walkthrough (mobile users hate modals; the dashboard is already self-explanatory).

### Landing: prep-path banner ✅

Founder generated the editorial mountain illustration via nano banana on
2026-05-06. Saved to `public/images/hero-mountain.webp` (1586×992, 30 KB
after Pillow WebP-85 conversion from a 1 MB PNG). Wired into the landing
as a banner section between the hero and the stats strip — soft cream
background `#fbf7ee` matching the illustration sky, with the headline
"Free chapter. Free mock. Real exam." and a "See all exams" CTA below
the artwork. The path-with-three-checkpoints visually maps to the
freemium funnel.

### Landing: hero carousel ✅

Founder ask: replace the static phone screenshot with a carousel of real
product views, each labelled with "super copy" calling out the feature,
auto-cycling. Notch-off phone chassis. Built:

- `src/components/marketing/PhoneFrame.tsx` — chassis only, accepts
  children, no notch.
- `src/components/marketing/HeroCarousel.tsx` — three slides:
  1. Study guide (`hero-study.webp`) — "Read in three depths."
  2. Mock tests (`hero-test.webp`) — "Real Schoolnet feel."
  3. Reviews (`hero-result.webp`) — "Every wrong answer, explained."
  Auto-cycles every 3.5 seconds (TICK_MS const). Cross-fade 400 ms.
  Lime "STUDY GUIDE / MOCK TESTS / REVIEWS" badge + bold white headline +
  detail line are SUPERIMPOSED on the bottom third of the phone screen,
  with a translucent navy gradient (transparent → 0.92 opacity) so it
  reads on any slide background. Dot indicators below the phone.
  Pauses on hover/focus so users can read.
- All three screen captures are real product views at 390×844 @2x.
  Result captured from a new `/preview/result-demo` route that renders
  the result page with seeded sample data (78% pass, realistic topic
  breakdown). Public, never linked, used only for marketing screenshots
  so the site can show a flattering result without DB state hacks.

Total weight: 4 WebP slides ~165 KB combined. Old `hero-chapter.png`
(167 KB PNG) removed.

---

## Routing map

| Route | Status | Auth | Notes |
|---|---|---|---|
| `/` | live | public | Landing; pulls Ch 1 Summary card live from MD |
| `/dashboard` | live | public | Catalog of 18 NISM exams |
| `/login` | live | public | Magic link + Google (disabled). `?next=` honoured (same-origin only) |
| `/exam/[code]/study` | live | public | Chapter ToC + reference rail (locks shown to anon) |
| `/exam/[code]/study/[slug]` | live | Ch 1 free, rest gated | Three-layer reader (🎯/📖/🧠) |
| `/exam/[code]/study/ref/[slug]` | live | gated | Number Sheet / Common Traps / Memory Hooks / Exam Day / Overview |
| `/exam/[code]/tests` | live | public hub | Free mock open; rest show 🔒 to anon |
| `/exam/[code]/test/[setId]` | live | free mock or signed-in | Full-screen runner |
| `/exam/[code]/test/result/[attemptId]` | live | signed-in only | Persisted result page |
| `/exam/[code]/progress` | live | signed-in | Stats + topic mastery + history |
| `/api/auth/[...all]` | live | public (auth handler) | Better-Auth |
| `/profile` | live | signed-in only | Sign-out + cross-exam summary |
| `/manifest.webmanifest` | live | public | PWA manifest |
| `/sw.js` | live | public | Hand-rolled service worker (4 cache buckets) |
| `/sitemap.xml` | live | public | Auto-generated |
| `/robots.txt` | live | public | Allows /, disallows /api/, /login |

## Locked decisions worth not relitigating

| Decision | Why |
|---|---|
| **Freemium gate**: Ch 1 + one foundational mock per exam free; rest login-gated | Solves SEO/conversion tension. Reference docs (Number Sheet, Common Traps) gated deliberately — they're the primary reason to sign in. Logic centralised in `src/lib/access.ts`. |
| **Don't rehost NISM PDFs** | Copyright. Catalog links out to `nism.ac.in/certifications/<slug>/`. PDFs at `/Users/nissar.behera/Documents/NISM/Study Materials/` are *source material* for our derivative content; never bundled. |
| **Both domains, same content** | Founder owns both; canonical = `nismpracticetests.com` per `src/lib/canonical.ts`. `.xyz` inherits via `rel=canonical`. |
| **Test runner overlays** the exam-layout chrome | CLAUDE.md mandates Schoolnet feel for the actual exam interface — full-screen, no marketing nav. |
| **Marketing/dashboard/study CAN be more vibrant**, runner stays Schoolnet-strict | Founder explicitly asked for the design refresh; we kept the trust signal where it matters (in-exam) and warmed up surrounding pages. |
| **10-colour topic palette in OKLCH** | Used everywhere a topic identity reads at a glance; same colour always = same topic, so users learn associations. Source: `src/components/topic/TopicChip.tsx`. |
| **No `next-pwa` / `@serwist/next`** when SW lands | Hand-rolled SW is ~100 lines, fully understandable, no dep update treadmill. Solo founder budget. |
| **Anon attempts are not persisted** | The free mock is a taster; sign-in is the conversion moment. Inline result + "Sign in to save" CTA. |
| **Server-side scoring**, never trust client | Per `src/lib/scoring.ts`: re-fetches correctIndex from DB during submit. No anti-cheating beyond this for v1. |

## Commits on `main` (most recent first)

```
fb835cb  NISM Series V-B (MF Foundation) shipped: 10 chapters, 5 references, 77 Qs, 6 sets
f3b39b2  NISM Series XV (Research Analyst) shipped: 15 chapters, 5 references, 122 Qs, 6 sets
7d9d5ac  NISM Series VIII shipped: 10 chapters, 5 references, 120 Qs, 6 sets
bd5333a  Workstream E: i18n scaffolding (EN + HI), no content yet
07f043f  Workstream C: auto-discover seed + _template + PDF extractor + preview + playbook
d2f3976  Landing v3: counter band, comparison, testimonials, FAQ, sharper CTA
5ed10ec  ExamMark per-exam logo + favicon refresh
f26e763  Ch 2/4/7 audit fixes + gitignore .claude/settings.local.json
472b590  SESSION-LOG: Phase 3 close-out (SW + PostHog + profile + tour)
5bb33ec  Profile page + first-run product tour
1704a45  PWA service worker + PostHog event wiring
(history rewritten 2026-05-07: all prior commits re-authored to nkb134@gmail.com after fixing local git config; force-pushed to origin)
90d9a10  Profile page + first-run product tour
e5f0463  PWA service worker + PostHog event wiring
7640c5b  Hero carousel: superimpose super-copy on phone screen, 3.5s tick
87af7cf  Hero carousel: 3 real product screens with super copy
5e77800  Landing: prep-path banner with mountain illustration
5fd944b  Landing v2: phone-frame hero + stats + category icons + footer
6851b92  SESSION-LOG.md: rolling session-continuity doc
baac6e2  PWA installable: manifest + icons + Apple meta
e47e1e8  Topic mastery + attempt history per exam
9d71006  Phase 2: test runner + result page + 10-color topic palette
934d456  Fix Better-Auth schema mapping; add modal sign-in
f13a960  Load .env.local in seed and drizzle config
15a4a01  Landing page + freemium gate (Ch 1 + 1 mock free per exam)
c5b11fd  Author chapters 2-12 + verified NISM URLs + pre/code mobile fix
855260f  Mobile fixes: zero horizontal overflow at 375px viewport
fa93426  Multi-exam catalog + V-A study guide reader (10x experience pass)
6fd779b  Phase 1: Next.js 15 scaffold + DB schema + auth + seed + landing
a1d2e8c  Initial: build spec + design system + question pool
```

## Content state

- V-A: **all 12 chapters** authored (Ch 1 in full from scratch; Ch 2-12 from the founder's reference PDF, may need re-read for tone). Five reference docs (Overview, Number Sheet, Common Traps, Memory Hooks, Exam Day Checklist) authored faithfully.
- 522 questions seeded. 32 test sets including 9 mocks + the 100Q full simulator (dynamic, weighted-sample).
- Other 17 NISM exams: catalog entries only, all marked "Coming soon" pending content.
- NISM official URL per exam verified via WebFetch and stored in `src/data/exam-catalog.ts`.

## Outstanding items for the **owner** (you)

These are click-through items only the founder can complete (UI access required).

1. **Revoke both PATs** at https://github.com/settings/tokens — both leaked into chat history during early sessions. Even if scoped, kill them.
2. **Add SSH key to GitHub** at https://github.com/settings/ssh/new. Locally: `test -f ~/.ssh/id_ed25519.pub || ssh-keygen -t ed25519 -C "nkb134@gmail.com"` then `pbcopy < ~/.ssh/id_ed25519.pub`. Test with `ssh -T git@github.com`. After it works, run `git remote set-url origin git@github.com:nkb134/NISM.git` so future pushes don't need a token.
3. **Resend domain** — https://resend.com/domains → add `nismpracticetests.com`. Resend issues 3 DNS records (SPF / DKIM / return-path); add them at the registrar and click Verify. `EMAIL_FROM` is already set to `noreply@nismpracticetests.com` in `.env.local.example`.
4. **Vercel deployment** — https://vercel.com/new → import `github.com/nkb134/NISM`. Root directory must be `nismpracticetests` (not repo root). Required prod env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://nismpracticetests.com`, `RESEND_API_KEY`, `EMAIL_FROM`, `NEXT_PUBLIC_APP_URL=https://nismpracticetests.com`. Optional: `GOOGLE_CLIENT_ID/SECRET`, `NEXT_PUBLIC_POSTHOG_KEY/HOST`. After first deploy: add domains `nismpracticetests.com` (apex), `www` (redirect to apex), `nismmocktest.xyz` (mirror — canonical-tag handles SEO). Seed prod DB locally with `DATABASE_URL` exported: `npm run db:push && npm run db:seed`.

**Already shipped from the prior pre-launch list:**
- ~~Spot-check chapters 2-12~~ → done 2026-05-07. Audit found no PDF artifacts; 3 small fixes landed in `f26e763` (Ch 2 hybrid count, Ch 4 ELSS placement, Ch 7 long NAV equation mobile wrap).

## Conventions for future sessions

- **Update this file with every commit.** Add to the Commits list, update the Phase status, move pending items as they ship.
- **Persistent memory** lives at `~/.claude/projects/-Users-nissar-behera-Documents-NISM/memory/` (Claude only). The `MEMORY.md` index there points to `project_scope.md`, `project_freemium_gate.md`, `feedback_no_pdf_rehost.md`, `reference_source_paths.md`. If a durable fact emerges, add it.
- **Mobile audit** at 375px before every commit that touches UI. Script: `/tmp/audit_phase2.py` template.
- **Build + typecheck** before commit. `./node_modules/.bin/tsc --noEmit && npm run build`.
- **Don't commit `.env.local`** — gitignored and verified; never paste real credentials in chat (tokens, DB URLs).
- **Branch hygiene** — work has been on `main` with focused commits. If something gets risky, branch first.

## Tech stack quick reference (locked)

```
Framework      Next.js 15 (App Router, Server Components by default)
Language       TypeScript (strict)
Styling        Tailwind v4 (@theme tokens in globals.css)
DB             Postgres on Neon (free tier, AWS Singapore, PG17)
ORM            Drizzle ORM
Auth           Better-Auth (magic link primary, Google OAuth optional)
Email          Resend (free tier)
Deploy         Vercel (free tier — not yet connected)
Analytics      PostHog (free tier — not yet wired)
Forms          React Hook Form + Zod (only Zod is on deps; RHF added when first form needs it)
State          Local component state + server actions; Zustand reserved for client-heavy state if needed
```
