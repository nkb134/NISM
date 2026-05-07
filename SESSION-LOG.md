# Session log — NISMPracticeTests build

**Last updated:** 2026-05-07 · Phase 4 Sprint 1 shipped — logos, landing v3, favicon
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
