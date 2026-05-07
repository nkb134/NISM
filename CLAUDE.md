# NISMPracticeTests.com — Build Instructions for Claude Code

## Project Overview

Build a free practice test platform for NISM (National Institute of Securities Markets) certification candidates in India. Starting with NISM Series V-A (Mutual Fund Distributors). Designed to expand to NISM V-C, VIII, XV, XX and other series.

**Domain:** nismpracticetests.com

**Core proposition:** Free, login-based, syllabus-aligned practice tests with topic mastery analytics. Better UX than incumbents (Pass4sure, ModelExam, ZFunds, BankExamsToday). Focused on India.

**Owner context:** Solo founder (Nissar Behera, CPO of Optimize fintech). Limited bandwidth — max 5 hours/week post-launch. Optimize is the primary venture; this is a lead-gen / SEO play that may also generate ad revenue at scale.

## Critical Constraints

1. **Quality bar:** Every question must be original, syllabus-accurate, and explained well. No copying from commercial test series. Source material is the official NISM workbook PDF (already structured into a question pool of ~530 questions).

2. **Performance budget:** Site must score 95+ on Lighthouse mobile. Most users will be on mid-range Android phones on patchy 4G connections.

3. **Cost ceiling:** Total infrastructure cost must stay under $10/month for first 12 months. Use free tiers aggressively.

4. **No payments in v1:** Free with login. Email capture is the monetization. Maybe ads at 10K+ MAU. Do NOT build payment infrastructure.

5. **Mobile-first:** Design for 375px width screens first. Desktop is secondary.

## Tech Stack (Locked Decisions — Do Not Change)

```
Framework:        Next.js 15 (App Router, Server Components by default)
Language:         TypeScript (strict mode)
Styling:          Tailwind CSS v4
UI primitives:    shadcn/ui (copy components, don't import as library)
Database:         Postgres on Neon (free tier)
ORM:              Drizzle ORM (lightweight, good TypeScript)
Auth:             Better-Auth (better DX than NextAuth, supports magic link + Google)
Email:            Resend (free tier: 3,000 emails/month)
Deployment:       Vercel (free tier)
Analytics:        PostHog (free tier — 1M events/month)
Forms:            React Hook Form + Zod
State:            Zustand for client state, Server Components for everything else
```

## Directory Structure

```
nismpracticetests/
├── CLAUDE.md                       # This file — read first
├── DESIGN.md                       # Design system spec — read before any component
├── design-reference/
│   └── tracker.html                # The working tracker — visual source of truth
├── README.md                       # Public-facing readme
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── .env.local.example
├── .env.local                      # gitignored
│
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── about/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   └── blog/
│   │   │       ├── page.tsx        # Blog index
│   │   │       └── [slug]/page.tsx # Individual post
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── verify/page.tsx     # Magic link verification
│   │   ├── (app)/
│   │   │   ├── layout.tsx          # Authed layout with nav
│   │   │   ├── dashboard/page.tsx  # User dashboard
│   │   │   ├── test/
│   │   │   │   ├── [setId]/page.tsx     # Take a test
│   │   │   │   └── result/[attemptId]/page.tsx
│   │   │   ├── topics/page.tsx     # Topic mastery view
│   │   │   ├── history/page.tsx    # Attempt history
│   │   │   └── exam/[exam]/page.tsx # Exam-specific dashboard (future)
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts  # Better-Auth handler
│   │   │   ├── attempts/route.ts        # POST: save attempt
│   │   │   └── attempts/[id]/route.ts   # GET: fetch attempt
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn primitives
│   │   ├── marketing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── ExamList.tsx
│   │   │   └── EmailCapture.tsx
│   │   ├── test/
│   │   │   ├── QuestionPalette.tsx
│   │   │   ├── QuestionView.tsx
│   │   │   ├── Timer.tsx
│   │   │   ├── EndTestModal.tsx
│   │   │   └── ResultView.tsx
│   │   └── dashboard/
│   │       ├── TopicMastery.tsx
│   │       ├── RecentAttempts.tsx
│   │       └── TestSetCard.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts            # Drizzle client
│   │   │   ├── schema.ts           # All tables
│   │   │   └── migrations/
│   │   ├── auth.ts                 # Better-Auth config
│   │   ├── email.ts                # Resend wrapper
│   │   ├── scoring.ts              # Score computation logic
│   │   └── topics.ts               # Topic codes & labels
│   │
│   ├── data/
│   │   ├── exams/
│   │   │   └── nism-va/
│   │   │       ├── meta.json       # Exam metadata
│   │   │       ├── topics.json     # Topic taxonomy
│   │   │       ├── sets.json       # Test sets
│   │   │       └── questions/
│   │   │           ├── inv.json
│   │   │           ├── str.json
│   │   │           ├── sch.json
│   │   │           ├── reg.json
│   │   │           ├── doc.json
│   │   │           ├── nav.json
│   │   │           ├── tax.json
│   │   │           ├── ops.json
│   │   │           ├── rsk.json
│   │   │           └── prf.json
│   │   └── seed.ts                 # Seed script: data/ → DB
│   │
│   └── types/
│       └── index.ts                # Shared types
│
└── public/
    ├── favicon.ico
    ├── og-image.png                # Open Graph share image
    ├── manifest.json               # PWA manifest
    └── icons/                      # PWA icons
```

## Database Schema (Drizzle)

```typescript
// src/lib/db/schema.ts

import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, index } from 'drizzle-orm/pg-core';

// Better-Auth managed tables
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  providerId: text('provider_id').notNull(),
  accountId: text('account_id').notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// App-specific tables
export const exams = pgTable('exams', {
  code: text('code').primaryKey(),           // e.g., 'nism-va'
  name: text('name').notNull(),              // e.g., 'NISM Series V-A'
  fullName: text('full_name').notNull(),     // Mutual Fund Distributors
  description: text('description'),
  totalQuestions: integer('total_questions').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  passMarkPercent: integer('pass_mark_percent').notNull(),
  negativeMarking: boolean('negative_marking').default(false),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const topics = pgTable('topics', {
  code: text('code').primaryKey(),           // e.g., 'INV', 'REG'
  examCode: text('exam_code').notNull().references(() => exams.code),
  name: text('name').notNull(),              // 'Investment Landscape'
  weightInExam: integer('weight_in_exam'),   // %ge weight in 100Q simulator
  displayOrder: integer('display_order').notNull(),
});

export const testSets = pgTable('test_sets', {
  id: text('id').primaryKey(),               // e.g., 'set_inv'
  examCode: text('exam_code').notNull().references(() => exams.code),
  name: text('name').notNull(),
  description: text('description'),
  topicCode: text('topic_code'),             // null = mixed
  durationSeconds: integer('duration_seconds').notNull(),
  isDynamic: boolean('is_dynamic').default(false),  // Full Simulator samples dynamically
  displayOrder: integer('display_order').notNull(),
});

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  examCode: text('exam_code').notNull().references(() => exams.code),
  topicCode: text('topic_code').notNull(),
  question: text('question').notNull(),
  options: jsonb('options').notNull().$type<string[]>(),
  correctIndex: integer('correct_index').notNull(),
  explanation: text('explanation').notNull(),
  difficulty: integer('difficulty').default(2),  // 1=easy, 2=medium, 3=hard
}, (table) => ({
  examTopicIdx: index('exam_topic_idx').on(table.examCode, table.topicCode),
}));

export const testSetQuestions = pgTable('test_set_questions', {
  setId: text('set_id').notNull().references(() => testSets.id),
  questionId: uuid('question_id').notNull().references(() => questions.id),
  questionOrder: integer('question_order').notNull(),
}, (table) => ({
  pk: { primaryKey: true, columns: [table.setId, table.questionId] },
}));

export const attempts = pgTable('attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  setId: text('set_id').notNull().references(() => testSets.id),
  examCode: text('exam_code').notNull().references(() => exams.code),
  startedAt: timestamp('started_at').notNull(),
  submittedAt: timestamp('submitted_at').notNull(),
  durationSecondsTaken: integer('duration_seconds_taken').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  attempted: integer('attempted').notNull(),
  correct: integer('correct').notNull(),
  scorePercent: integer('score_percent').notNull(),
  passed: boolean('passed').notNull(),
  // Store the snapshot of question IDs + user's answer per Q for review
  responses: jsonb('responses').notNull().$type<Array<{
    questionId: string;
    questionSnapshot: { question: string; options: string[]; correctIndex: number; explanation: string; topicCode: string };
    userAnswerIndex: number | null;
    isCorrect: boolean;
    markedForReview: boolean;
  }>>(),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  userExamIdx: index('user_exam_idx').on(table.userId, table.examCode),
}));
```

**Why store question snapshot in attempts:** Questions might get edited/improved later. Attempts must remain stable for review. Trade-off: more storage per attempt, but pricing on Neon makes this trivial.

## Topic Codes (NISM V-A)

```typescript
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
};
```

## Initial Question Pool

You'll be given a JSON export of 530 questions across 32 sets, already organized by topic code. Schema for each question:

```typescript
{
  q: string,           // Question text
  o: string[],         // Options (4 typically)
  a: number,           // Correct answer index (0-based)
  e: string,           // Explanation
  topic: string,       // Topic code: 'INV', 'STR', etc.
  difficulty?: number  // Optional, default 2
}
```

For each topic, split into separate JSON files under `src/data/exams/nism-va/questions/` to keep them manageable.

## Build Phases

### Phase 1: Foundation (Session 1, ~2-3 hours)

1. Initialize Next.js 15 with TypeScript, Tailwind, App Router
2. Set up Drizzle + Neon Postgres connection
3. Define schema, generate first migration, push to Neon
4. Set up Better-Auth with magic link + Google OAuth
5. Build seed script that loads JSON question files into DB
6. Run seed, verify counts in Neon dashboard
7. Build basic landing page (no styling yet) with login button

**Acceptance:** User can sign up via magic link or Google, lands on a placeholder dashboard, DB has 530 questions and 32 test sets seeded.

### Phase 2: Test-taking flow (Session 1 continued or Session 2)

1. Dashboard page lists test sets (grouped by topic / mocks / simulator)
2. `/test/[setId]` page renders test:
   - Question palette (with 4-state legend: Not Visited, Visited Not Answered, Answered, Marked for Review)
   - Single question view with options as radio buttons
   - Timer (red when under 60s)
   - Mark for Review button
   - Clear Answer button
   - End Test button with confirmation modal
3. On submit, compute score server-side, save attempt, redirect to result page
4. Result page shows:
   - PASS/FAIL banner (50% threshold)
   - Score breakdown
   - Topic-wise breakdown (red <50%, amber 50-75%, green ≥75%)
   - Question-by-question review with explanations
   - Filter pills: All / Wrong only / Skipped

**Acceptance:** User can take any test set, get scored, see topic breakdown, review answers.

### Phase 3: Analytics & polish (Session 2)

1. Topic Mastery view on dashboard (aggregate across attempts, weighted recent)
2. Recent attempts list with click-through to review
3. Full attempt history page with sort/filter
4. Profile page with email, exam progress summary
5. PWA manifest + service worker for offline test-taking
6. Open Graph tags + sitemap + robots.txt
7. Email capture on landing page
8. Analytics events: signup, test_started, test_completed, topic_drill

**Acceptance:** Lighthouse mobile score 95+, PWA installable, analytics flowing into PostHog, sitemap submitted to Google Search Console.

### Phase 4: Content & SEO (ongoing, post-launch)

Outside Claude Code scope but plan for:
- 5-10 SEO blog posts targeting `"NISM V-A free practice"`, `"NISM V-A vs V-C"`, `"How to prepare for NISM V-A"`, `"NISM V-A passing marks"`
- Submit to Google Search Console
- Submit to Bing Webmaster
- Get listed on r/IndiaInvestments, finance Discord servers

## UX Principles

1. **Speed over animations.** No fancy transitions. Page-to-page navigation must feel instant.
2. **Mobile-first.** Test palette must work with thumbs. Timer always visible. Submit button must be reachable from one-handed grip.
3. **Honest pass/fail.** No false praise. If user fails, say it clearly with what to study next.
4. **Progress is visible.** Always show: questions answered, time remaining, current question number.
5. **No popups except End Test confirm.** No newsletter modals, no "rate us" prompts.
6. **Keyboard shortcuts on desktop:** 1-4 for options, M for mark-review, N for next, P for previous.

## Visual Design

**THE DESIGN IS ALREADY DONE.** Do NOT generate styling from scratch.

Two reference files codify the existing design language:

1. **`DESIGN.md`** — design tokens (colors, typography, spacing, radii), every component pattern (set rows, topic mastery cards, question palette with all four state colors, end-test modal, result page layout, filter pills), interaction rules, mobile adaptations. **Read this end-to-end before writing any component.**

2. **`design-reference/tracker.html`** — the actual working tracker that the founder and his co-founder have been using. Every visual decision has been validated. When building React components, **open this HTML in a browser, find the equivalent component, and replicate it** — same colors, same spacing, same interactions, same micro-copy where applicable.

**Translation rules from the reference HTML to React:**

- Inline `<style>` block → Tailwind config + component classes (use `@apply` sparingly; prefer utility classes)
- CSS classes like `.set-row`, `.topic-row`, `.timer.danger` → React components named `SetRow`, `TopicRow`, `Timer` (with prop-driven variants)
- `onclick="..."` JavaScript → React event handlers
- `window.storage`/`localStorage` → server actions writing to Postgres via Drizzle
- The state machine for question palette (4 states: not visited, visited not answered, answered, marked for review) is already defined in the reference — do NOT redesign it.

**Quick design summary** (full details in `DESIGN.md`):

- **Primary color:** Navy `#1a1f3a`
- **Accent (sparingly):** Lime `#a3e635` (logo, "EXAM" badge)
- **Pass/Fail/Warn:** `#10b981` / `#ef4444` / `#f59e0b`
- **Surface backgrounds:** White, with `#f4f6f9` for chips/pills, `#fafbfd` for hover states
- **Typography:** Inter only, sizes 11/12/13/14/18/24/26
- **Border radius:** 6px buttons, 8px palette tiles, 10px cards
- **Spacing:** 4/6/8/10/12/14/16/18/20/24/32/48 only
- **No shadows, no gradients (except logo), no animations beyond 150ms hover transitions, no dark mode in v1**

Reference: NISM's actual exam interface (Schoolnet) — clean, functional, slightly outdated but trustworthy. The tracker matches that vibe with better typography. Continue this aesthetic — do not modernize it into a "SaaS landing page" look.

## Auth Flow

1. User clicks "Sign in" → goes to `/login`
2. Two options: "Continue with Google" or "Email magic link"
3. Magic link: enter email → submit → sees "Check your email" page → clicks link in email → lands authenticated on `/dashboard`
4. Google OAuth: standard flow, lands on `/dashboard`
5. First-time users: capture name + show 30-second product tour

**Important:** Magic link expiry: 15 minutes. Single-use. Rate limit: 3 per email per hour.

## SEO Requirements

- Every page has unique title, meta description, Open Graph tags
- Schema.org `Course` markup on landing page
- Schema.org `Quiz` markup on test set pages
- `sitemap.xml` auto-generated, includes all test sets and blog posts
- `robots.txt` allows all
- Canonical URLs everywhere
- Page slugs are clean: `/test/nism-va-mock-1` not `/test/abc123`

## Performance Requirements

- LCP < 2.5s on 4G
- FID < 100ms
- CLS < 0.1
- JS bundle for test page < 100KB gzipped
- Question data lazy-loaded only when test starts (not on dashboard)
- Images use Next.js Image component with proper sizes
- Fonts self-hosted (no Google Fonts CDN — privacy + speed)

## What NOT to Build (Resist Scope Creep)

- Payment system (you're free for now)
- Admin panel (edit JSON files in repo, redeploy)
- Forum / community features
- Live tutoring / chat
- Other exams beyond NISM V-A in v1 (schema supports them; content comes later)
- Notifications, push messages
- Leaderboards, social features
- AI-generated questions (use the validated pool)
- Mobile native apps (PWA is enough)

## Important Implementation Notes

1. **Server Components first.** Use `'use client'` only when needed (forms, interactive components). Test pages are mostly client components but the shell is server-rendered.

2. **Database queries always parameterized.** Drizzle handles this; never construct raw SQL.

3. **Auth check on every authed page.** Don't rely on middleware alone — also check in server components.

4. **Attempt submission:**
   - Send the full attempt (responses + timing) to `/api/attempts` POST
   - Server validates: correctIndex was tampered? questions exist? user owns this attempt? Return attemptId.
   - Client redirects to `/test/result/[attemptId]`

5. **Anti-cheating:** Not a priority for free product. Trust the user. Server still validates `correctIndex` from question table, not from client.

6. **Rate limiting:** Use Vercel's built-in or `@upstash/ratelimit`. Cap attempts at 50/day per user (way above realistic usage).

7. **Privacy:** Default consent banner not required if you're not using cookies for tracking. PostHog: configure to use localStorage-only (no cookies).

8. **Email templates:** Plain text + minimal HTML. No images. Magic link, signup welcome, "you've been inactive 7 days" — three templates total.

## Environment Variables

```bash
# .env.local.example

# Database
DATABASE_URL=postgres://...

# Auth
BETTER_AUTH_SECRET=          # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=https://nismpracticetests.com

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Feature flags
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=  # Optional, GA4 if you want it
```

## First Commit Checklist

Before pushing first commit:
- [ ] All env vars in `.env.local.example`, none committed
- [ ] `.gitignore` includes `.env.local`, `.next`, `node_modules`
- [ ] `package.json` has `engines.node: ">=20"`
- [ ] README has 5-line description and setup instructions
- [ ] LICENSE file (MIT recommended)
- [ ] `CLAUDE.md` (this file) at root

## Deployment Checklist

Before going live on nismpracticetests.com:
- [ ] Domain registered, DNS pointed to Vercel
- [ ] Production env vars set in Vercel dashboard
- [ ] Database seeded in production
- [ ] Test full signup → take test → see result flow on production
- [ ] Submit sitemap to Google Search Console
- [ ] Add nismpracticetests.com to PostHog allowed domains
- [ ] Test PWA install on Android Chrome and iOS Safari
- [ ] Lighthouse mobile score ≥95 on landing page and test page
- [ ] Privacy policy and terms pages live
- [ ] Open Graph share preview tested via opengraph.xyz

## Future Expansion Notes

When adding NISM V-C:
1. Add row to `exams` table with code `nism-vc`
2. Create `src/data/exams/nism-vc/` with same structure as `nism-va/`
3. Generate questions in same JSON format
4. Run seed script — it's idempotent, only adds new
5. Landing page lists exams from DB; new one appears automatically
6. No code changes needed if data structure is followed

## Owner's Working Style (Important Context for Code Generation)

- Direct, terse communication
- Wants opinionated defaults, not options
- Reviews PRs by running them mentally — code should be self-documenting
- Aesthetic: clean, no unnecessary cleverness, boring tech where possible
- Hates: over-abstracted code, premature optimization, files split for the sake of splitting

When in doubt: pick a sensible default, ship it, leave a comment if the choice is non-obvious.
