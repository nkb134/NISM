# Session log — NISMPracticeTests build

**Last updated:** 2026-05-06 · session pushed through `landing-v2` design refresh
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

### Pending in the current Phase 3 sequence

1. **Service worker for offline** — about to start. Hand-rolled `public/sw.js` (no `next-pwa` dep), four caching buckets:
   - app shell (HTML/JS/CSS) cache-first
   - study guide chapters cache-first
   - `/api/*` and `/test/*` network-first (no stale data)
   - icons / fonts cache-first
   Triggers Android Chrome's auto-install prompt as a side benefit.
2. **PostHog events** — `signup`, `test_started`, `test_completed`, `topic_drill`. Wiring lands first; user adds `NEXT_PUBLIC_POSTHOG_KEY` later. localStorage-only (no cookies — privacy spec).
3. **Profile page** — sign-out button, exam progress summary across all exams the user has taken. Small.
4. (Optional) 30-second product tour for first-time users.

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
| `/manifest.webmanifest` | live | public | PWA manifest |
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
(next)   Hero carousel: super-copy overlay inside the phone, 3.5s tick
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

1. **Revoke both PATs** at https://github.com/settings/tokens?type=beta — both are still in chat history. The second is currently active and being used for pushes; replace with SSH (next item) and revoke after.
2. **Add SSH key to GitHub** at https://github.com/settings/keys — paste contents of `~/.ssh/id_ed25519.pub`. Then `git remote set-url origin git@github.com:nkb134/NISM.git`. Future pushes are just `git push`.
3. **Spot-check chapters 2-12** of the V-A study guide. They were converted programmatically from the PDF; tone and table fidelity should be sanity-checked.
4. **Resend domain** — currently sending from `onboarding@resend.dev`. Before launch, verify `nismpracticetests.com` in Resend → Domains, add the 3 DNS records, switch `EMAIL_FROM` to `noreply@nismpracticetests.com`.
5. **Vercel deployment** — connect the GitHub repo + paste env vars from `.env.local` (don't paste them in chat). Production URL preview on every PR.

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
