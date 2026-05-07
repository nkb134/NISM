# Adding a NISM exam — one-page playbook

End-to-end flow for taking a new NISM certification from "coming soon" to
fully live. Most of this is Claude-driven now; the founder steps are marked.

---

## 0. Prereqs

- Workbook PDF for the cert is in `/Users/nissar.behera/Documents/NISM/Study Materials/<folder>/`. Use the latest version inside that folder (ignore older ones).
- Catalog entry already exists in `src/data/exam-catalog.ts` (all 18 are pre-seeded as `coming-soon`).
- Per-machine: `pip3 install --user pypdf`.

---

## 1. Extract the workbook (Claude)

```bash
python3 scripts/extract-workbook.py \
  --pdf "/Users/nissar.behera/Documents/NISM/Study Materials/256/2 NISM-Series-VIII Equity Derivatives Certification Examination_Mar 2026.pdf" \
  --code nism-viii
```

Writes per-chapter text into `src/data/exams/nism-viii/research/raw/en/`.
The directory is gitignored — workbook text is NISM IP.

## 2. Portal capture (founder logs in, Claude captures)

1. Founder opens the NISM candidate portal in **Claude_in_Chrome** browser session.
2. Founder types password directly. Claude is blind to the password.
3. Once authenticated, Claude:
   - Reads the portal's terms; flags any clause restricting automated capture.
   - On founder confirm, navigates to a practice exam and screenshots every Q + answer reveal.
   - Writes structured JSON to `src/data/exams/<code>/research/portal-capture/<exam>-<set>.json` (gitignored).
4. Notes/observations go in `research/portal-notes.md` (also gitignored).

## 3. Author the content (Claude)

Copy the template:

```bash
cp -R src/data/exams/_template src/data/exams/nism-viii
```

Then fill in, in this order:

1. `meta.json` — copy structural fields from the catalog row.
2. `topics.json` — extract from the workbook ToC (3-letter codes, weights summing to ~100).
3. `study/chapters/01-*.md` … `12-*.md` — three-layer V-A format. Quality bar = V-A Ch 1.
4. `study/{overview,number-sheet,common-traps,memory-hooks,exam-day}.md` — five reference docs.
5. `questions/<topic>.json` — paraphrased from workbook + portal capture. Aim 200+ pool.
6. `sets.json` — 1 free mock + 4 topic drills + 1 full simulator (default).
7. `set-question-map.json` — wires each set to its ordered questions.

## 4. Seed the DB

```bash
npm run db:seed
```

Auto-discovers the new exam directory. Idempotent — safe to re-run.

## 5. Spot-check (founder, ~10 min)

Visit `http://localhost:3000/preview/exam/nism-viii` — single page surfaces:

- catalog status + DB-seeded counts
- chapter list + reference docs (click through to read)
- test sets (click through to take)
- topics + weights

Random-sample 5 questions from the free mock. If anything reads off, ping
Claude to fix. Quality bar stays = V-A Ch 1.

## 6. Activate

In `src/data/exam-catalog.ts`, flip the row:

```ts
studyGuideStatus: 'available',
mockTestStatus: 'available',
```

In `src/lib/access.ts`, add freemium-gate entries:

```ts
FREE_CHAPTER_SLUG['nism-viii'] = '01-equity-derivatives-overview';  // your Ch 1 slug
FREE_TEST_SET_ID['nism-viii']  = 'set_mock1';                        // first mock id
```

Commit, push. The sitemap, landing-page teaser, dashboard catalog card,
and per-exam routes all pick it up automatically (no other code changes).

## 7. Hindi (or other language) follow-up

Same flow with `--lang hi` on `extract-workbook.py`. Author chapters under
`study/hi/chapters/...` and questions under `questions/hi/<topic>.json`.
The i18n middleware serves `/hi/exam/<code>/...` automatically; English
is still the default at the prefix-less path.

---

## Don'ts

- ❌ Don't commit anything from `research/raw/` or `research/portal-capture/` — workbook + portal content is NISM IP.
- ❌ Don't paste workbook prose verbatim into chapters or questions. Always paraphrase.
- ❌ Don't change `examCode` after first seed. Question UUIDs are namespaced by it; changing it orphans every saved attempt.
- ❌ Don't ship a chapter that doesn't pass the V-A Ch 1 quality bar — better to delay than to ship slop.
