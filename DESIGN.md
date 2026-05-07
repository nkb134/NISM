# DESIGN.md — NISMPracticeTests Design System

This document captures the visual and interaction design language already validated through real usage by the founder and his co-founder. The reference implementation is at `design-reference/tracker.html`. **Read that file before building any component.** It is the canonical source of truth. This document explains the *why* and codifies the patterns into Tailwind config.

## Design Philosophy

- **NISM Schoolnet aesthetic, modernized.** The actual exam interface (Schoolnet) feels institutional, slightly outdated, but trustworthy. Match that trustworthiness; don't try to be flashy. Users should feel they're practicing on something that resembles the real exam.
- **Information density over whitespace.** Mock exam apps that prioritize whitespace look like marketing sites. Users want to see their progress, scores, weak areas at a glance. Pack the dashboard.
- **Functional color use only.** Color signals state (correct/wrong/passed/failed/weak topic). No decorative gradients except the brand logo.
- **Typography over icons.** No icon library beyond the brand mark and a handful of unicode glyphs (⬇ ⬆ ⏱ ✓ ✗). Text labels everywhere.

## Color Tokens

Use these exact values. Add to `tailwind.config.ts` under `theme.extend.colors`:

```typescript
colors: {
  // Brand
  navy: {
    DEFAULT: '#1a1f3a',  // Primary text, primary buttons, brand
    hover: '#2a2f5a',    // Button hover
    deeper: '#3b3f6e',   // Logo gradient end
  },
  accent: {
    DEFAULT: '#a3e635',  // Lime — used sparingly for "EXAM" badges, logo glyph
  },
  // Semantic — score states
  pass: '#10b981',       // Green — passed, strong topic, correct
  fail: '#ef4444',       // Red — failed, weak topic, wrong, danger
  warn: '#f59e0b',       // Amber — middling topic mastery
  // Neutrals
  bg: '#fff',            // Main background
  surface: '#f4f6f9',    // Profile switch background, chips
  surfaceHover: '#fafbfd', // Row hover
  border: '#e5e7eb',     // All borders
  borderSoft: '#f3f4f6', // Inner row dividers
  text: '#1a1f3a',       // Headings, body
  textMuted: '#6b7280',  // Secondary text, labels
  textFaint: '#9ca3af',  // Disabled, untested, empty states
}
```

**Do not introduce new colors without explicit approval.** Every UI need maps to one of the tokens above.

## Typography

```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
fontSize: {
  // Use these sizes only
  xs: '11px',    // Meta text, attempt timestamps
  sm: '12px',    // Default body, labels, buttons
  base: '13px',  // Card content, set titles
  md: '14px',    // Card headers, nav
  lg: '18px',    // Timer, large numbers
  xl: '24px',    // Page headers
  '2xl': '26px', // Stat values
}
```

- **No heading font.** Inter handles everything.
- **Letter-spacing on uppercase labels:** `0.4px` for stat labels, `0.6px` for "EXAM" badge.
- **Tabular numerics for the timer:** `font-variant-numeric: tabular-nums` so digits don't shift width.

## Spacing Scale

Strictly stick to: **4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 32, 48px**. No 5, no 7, no 15.

Tailwind's default scale already covers most. Define custom only as needed.

## Border Radius

```
3px   — small chips, "EXAM" badge inside set row
4px   — chips inside set meta row
6px   — buttons, profile switch buttons
8px   — large buttons, profile switch container, palette tiles, logo
10px  — cards, stat cards
12px  — modal panels (rare — use 10 by default)
```

## Shadows

**Almost none.** The design uses borders for separation, not shadows. The only shadow:
- Modal overlay (subtle): `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15)`

## Component Patterns

### Top Navigation

Sticky top bar, 64px height. Three sections:

- **Left:** Brand. Logo (36×36px gradient navy→deeper, lime "N" inside, 800 weight). Title "NISMPracticeTests" + subtitle "NISM V-A Mock Exams".
- **Center:** Tabs (Dashboard, History). Active tab: navy text + 2px navy bottom border. Inactive: gray text, no border.
- **Right:** Profile switcher pill (`bg-surface`, 8px radius, 3px padding, two buttons inside). Active button: navy bg + white text. Inactive: transparent + gray text. **This is multi-user-on-same-device pattern; remove for the multi-tenant version where each user has their own login.**

### Profile Switch (Single-Device Multi-User)

This is in the reference HTML for Nissar/Sanjay. **In the production multi-tenant version, replace this with a user menu (avatar + dropdown with Sign Out).** Keep the visual style for the user menu trigger.

### Dashboard Layout

```
┌───────────────────────────────────────────┐
│  Page Header: H1 + subtitle               │  24px gap below
├───────────────────────────────────────────┤
│  Stats Row: 4 cards in a grid             │  32px gap below
│  ┌──────┬──────┬──────┬──────┐            │
│  │ #    │ %    │ Topic│ Streak│           │
│  │ Tests│ Avg  │ Best │       │           │
│  └──────┴──────┴──────┴──────┘            │
├───────────────────────────────────────────┤
│  Two-column grid (1.4fr : 1fr)            │
│  ┌───────────────┬───────────────────┐    │
│  │  Test Sets    │  Topic Mastery    │    │
│  │  (left, big)  │  (right)          │    │
│  │               ├───────────────────┤    │
│  │               │  Recent Attempts  │    │
│  └───────────────┴───────────────────┘    │
└───────────────────────────────────────────┘
```

### Stat Card

```
┌─────────────────────────┐
│  TESTS TAKEN            │  ← stat-label: 12px, uppercase, tracking, gray
│  47                     │  ← stat-value: 26px, 700, navy
│  Last week: 12          │  ← stat-sub: 11px, gray
└─────────────────────────┘
```

White bg, 1px border, 10px radius, 18px padding. Pass state colors stat-value green; Fail colors red.

### Set Row (List Item in Test Sets Card)

```
┌──────────────────────────────────────────────────┐
│  Set 1 — Investment Landscape                    │
│  ⏱ 10 min  · 12 questions  · [topic chip]        │   75% ✓   [Start →]
└──────────────────────────────────────────────────┘
```

- **Hover state:** very subtle bg (`#fafbfd`). Cursor pointer.
- **"Featured" variant for the Full Simulator:** left 3px lime border, soft gradient bg, "EXAM" badge (lime text on navy, 9px, letter-spacing).
- **Last score badge** on the right shows "75% ✓" in pass green, "42% ✗" in fail red.
- **Start button:** navy bg, white text, 6px radius, 12px font.

### Topic Mastery Card

Each row:
```
┌────────────────────────────────────┐
│ Investment Landscape       72% ⬤   │  ← topic-name + topic-pct
│ ████████████░░░░░░░░░░░            │  ← progress bar
│ Last attempted 3 days ago          │  ← topic-meta
└────────────────────────────────────┘
```

- **Color logic on the percentage:** `<50%` red, `50-75%` amber, `≥75%` green, no attempts gray.
- **Bar fill color matches.**
- **"Practice →" link** appears for topics with score below 75%, links directly to that topic's foundational set.
- **Untested topics** show "—" instead of percentage and no bar fill (gray track only).

### Test-Taking Page

Full-screen layout (no marketing nav). Three sections:

1. **Top exam header (sticky):** Test name (truncated if long, max-width 70%) on left. Right side: timer + "End Test" button.
2. **Main area (flex):**
   - **Left (flex-1):** Question card with Q-tag badge, question text, options as radio-list, action buttons row.
   - **Right (320px fixed):** Question palette grid + legend + summary stats.
3. **No footer during exam.**

#### Q-tag Badge (above question text)

Small lime-green pill. "Q 23 of 100". Bold. 11px.

#### Question Text

`base` size (13px), 1.6 line-height, navy color. Numerals like "₹10,000" should never break across lines (use `&nbsp;`).

#### Options (Radio List)

```
┌──────────────────────────────────────────┐
│ ○  A. Liquid funds                        │
├──────────────────────────────────────────┤
│ ●  B. Ultra-short duration funds          │   ← selected: navy radio + light bg
├──────────────────────────────────────────┤
│ ○  C. Gilt funds                          │
├──────────────────────────────────────────┤
│ ○  D. Equity-oriented funds               │
└──────────────────────────────────────────┘
```

Each option is a full-width clickable row (large hit target for mobile). 14px padding. Border-bottom dividers between options. Selected row: light navy bg (`#f0f1f8`), navy radio dot. Letters A/B/C/D shown in the radio space, not as separate badges.

#### Action Bar (Below Options)

```
[← Previous]    [Mark for Review]   [Clear Answer]    [Next →]
```

- **Previous/Next:** outline buttons, navy text, gray border. Disabled state when at start/end.
- **Mark for Review:** outline button. When marked, switches to filled amber state with text "✓ Marked".
- **Clear Answer:** text-link style, gray, smaller. No border.
- **Submit:** Only on the LAST question, replaces "Next" with a navy filled button "Submit Test".

#### Timer

Sticky in top-right of exam header. Format `MM:SS`. Tabular numerics. **Turns red 60 seconds before expiry**, no animation, just color change. Title attribute shows "X minutes Y seconds remaining" for accessibility.

### Question Palette (Right Sidebar During Exam)

Grid of 8 columns × N rows. Each cell is 32×32px, 6px radius, centered number.

**4 states with specific colors:**

| State | Background | Text Color | Border |
|---|---|---|---|
| Not Visited | `#fff` | `#6b7280` | 1px `#e5e7eb` |
| Visited Not Answered | `#fee2e2` | `#991b1b` | 1px `#fca5a5` |
| Answered | `#d1fae5` | `#065f46` | 1px `#6ee7b7` |
| Marked for Review | `#fef3c7` | `#92400e` | 1px `#fcd34d` |
| Answered + Marked (combined) | `#dbeafe` (blue) | `#1e3a8a` | 1px `#93c5fd` |
| Current question | (whichever above) | (whichever above) | **2px `#1a1f3a`** |

**Legend** appears below the palette: small grid showing each state with label.

**Below the legend:** summary stats — "Answered: 23 / Marked: 4 / Not Visited: 12".

### End Test Modal

Centered modal, max-width 480px, white, 12px radius, padding 32px.

```
┌─────────────────────────────────────────┐
│  End Test?                              │  ← H2, 18px, 700
│                                         │
│  You have answered 23 of 30 questions.  │  ← body, 13px
│  You have 14 minutes remaining.          │
│  This action cannot be undone.          │
│                                         │
│  [Cancel]    [End Test & Submit]        │  ← buttons right-aligned
└─────────────────────────────────────────┘
```

Backdrop: `rgba(0,0,0,0.5)`. Modal has subtle shadow. Cancel = outline button. Submit = navy filled.

### Result Page

```
┌──────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐     │
│  │  PASS                                   │     │  ← Banner: green bg if pass, red if fail. 18px, 700.
│  │  78 / 100 (78%)                         │     │
│  └─────────────────────────────────────────┘     │
│                                                  │
│  Score breakdown grid (3 cells)                  │
│  ┌─────────┬─────────┬─────────┐                 │
│  │Attempted│ Correct │ Skipped │                 │
│  │   95    │   78    │    5    │                 │
│  └─────────┴─────────┴─────────┘                 │
│                                                  │
│  Topic-wise breakdown (vertical list)            │
│  Same as Topic Mastery card style                │
│                                                  │
│  Filter pills: [All] [Wrong only] [Skipped]      │
│                                                  │
│  Question review list:                           │
│  Each question shows: Q text, all options with   │
│  user's selection marked, correct answer marked, │
│  explanation in a soft-bg box below.             │
└──────────────────────────────────────────────────┘
```

### Question Review (Result Page)

Each question card:
- Q number in a small badge (lime if correct, red if wrong, gray if skipped)
- Question text
- Options shown vertically; user's selection has subtle navy left border; correct option has green left border with ✓; if user was wrong, their selection has red left border with ✗
- Below options: explanation in a soft-gray bg (`#f9fafb`), 12px font, italic optional, with topic code chip in top-right

### Filter Pills (Result Page)

Pill row, gap 8px:
```
[All (100)]  [Wrong only (22)]  [Skipped (5)]
```

Active pill: navy bg + white text. Inactive: surface bg + gray text. 6px radius, 12px font, 6px/12px padding.

### Footer (Marketing & Authed Pages)

24px padding top/bottom. Border-top.
- **Marketing pages:** copyright, privacy, terms, blog links.
- **Authed pages:** Export backup link, Import backup link, Reset profile link (red).

## Iconography

Almost no icons. Allowed:
- ⏱ in timer (single character, decorative)
- ✓ on correct answer indicator
- ✗ on wrong answer indicator
- ⬇ ⬆ on Export / Import buttons
- → on "Start" / "Practice" CTAs
- ⬤ in topic mastery rows (filled circle for state)

For anything else, use text labels.

## Interaction Patterns

### Hover

- Set rows, attempt rows: bg shifts to `#fafbfd`, no movement.
- Buttons: bg shifts one shade darker, no scale/transform.
- Links: subtle border-bottom shift.
- All transitions: `0.15s` ease.

### Active / Pressed

- Buttons: brief darker bg flash. No scale animation (avoid mobile delay).

### Loading States

- Inline spinner only when waiting for network. **No skeleton screens.** If data isn't ready, show "Loading..." text in muted color.

### Empty States

Single-paragraph text, 13px, faint gray, centered, 32px padding. No illustration, no CTA button. Examples:
- "No attempts yet. Start with Mock Test 1 to get a baseline."
- "No weak topics — your mastery looks balanced."

### Confirmation Dialogs

Use the End Test modal pattern for all confirmations (delete attempt, reset profile, etc.). Never use `window.confirm()` in production — that's only in the prototype.

## Mobile Adaptations (375px width)

- **Top nav:** Logo + title only on left (no subtitle). Tabs hidden. User menu becomes hamburger or simplified avatar.
- **Stats row:** Stack to 2×2 grid.
- **Two-column dashboard:** Stack to single column. Test sets first, then topic mastery, then attempts.
- **Test-taking page:** Question palette becomes a collapsible drawer (toggle button in exam header). Default collapsed on mobile.
- **Action bar:** Sticky to bottom of screen on mobile.
- **Modal:** full-width minus 16px each side.

## Accessibility

- All interactive elements have visible focus rings (2px navy outline, 2px offset).
- Color is never the only signal — pass/fail also has text label, correct/wrong also has ✓/✗.
- Form inputs always have visible labels (no placeholder-as-label).
- Buttons have descriptive `aria-label` when text is icon-only.
- Modal traps focus, ESC closes, Tab cycles within.
- Timer announces every minute via aria-live for screen readers (don't be too chatty).

## Animation Budget

Almost none. Allowed:
- Color transitions on hover/active (`0.15s ease`).
- Topic bar fill width animation (`0.3s ease`).
- Modal fade-in (`0.15s ease-out`).

**Forbidden:**
- Page transitions
- Scroll animations
- Loading skeletons
- "Pop in" effects
- Confetti, celebration animations on pass (resist this — keeps the tone serious)

## What NOT to Do

- ❌ Don't use shadcn/ui's default rounded-2xl — too soft for this aesthetic. Override radius tokens.
- ❌ Don't use shadcn/ui's default zinc/neutral grays — use the navy + custom grays from this doc.
- ❌ Don't add dark mode in v1. Light only. Dark mode for exam-prep apps confuses users (real exam is light).
- ❌ Don't add custom illustrations or 3D graphics.
- ❌ Don't use rounded-full pills for tags — use 4-6px radius rectangles.

## Reference Files

- **`design-reference/tracker.html`** — full working implementation with all patterns. Open in a browser to see them live.
- **NISM Schoolnet exam screenshots** (if available, drop into `design-reference/screenshots/`) — for verifying we match their patterns.

When in doubt, open the tracker and look at how it's done there. The design language is already battle-tested — preserve it, don't reinvent it.
