# Study guide content format

This directory holds the source-of-truth content for the V-A study guide.
The reader at `/exam/nism-va/study` is built from these files at request time —
edit a file and redeploy to update.

## Layout

```
study/
├── overview.md            ← Cover + "How to use this guide" + Exam strategy
├── chapters/
│   ├── 01-investment-landscape.md
│   ├── 02-concept-and-role.md
│   └── ...                ← one file per chapter
├── number-sheet.md        ← Quick-reference: numbers, formulas
├── common-traps.md        ← "NO" answers list
├── memory-hooks.md        ← Master mnemonic table
└── exam-day.md            ← Before / At / During checklist
```

## Chapter file format

```markdown
---
chapter: 1
title: Investment Landscape
topicCode: INV          # must match a topic code in topics.json
marks: 8                # weight in 100Q exam
difficulty: easy        # easy | medium | hard
priority: 2             # 1, 2, or 3 stars (★★ = 2)
estimatedMinutes: 12    # honest read-time estimate
---

## 🎯 Summary Card

The 60-second version. 3-5 sentences max. What you need to know if you only had a minute before the exam.

## 📖 Core Content

The full testable detail. Use ## subsections, tables, lists. GitHub-Flavored Markdown.
This is the bulk of the chapter — aim for the level of depth in the workbook,
not a regurgitation of it.

## 🧠 Memory Hooks

Mnemonics, acronyms, visual tricks. Each on its own bullet. Use **bold** for the
mnemonic itself, then the unpacked meaning.
```

The three section headings (`## 🎯 Summary Card`, `## 📖 Core Content`,
`## 🧠 Memory Hooks`) are required and used by the reader to drive the
layer-toggle. Don't rename them.

## Cross-cutting files

`overview.md`, `number-sheet.md`, `common-traps.md`, `memory-hooks.md`, and
`exam-day.md` are plain markdown with optional frontmatter. They render as
single-page references — no layer toggle.

`exam-day.md`'s frontmatter may set `mode: exam-day` to enable the special
"Exam Day Mode" layout (simplified type, big touch targets).

## Markdown features supported

GitHub-Flavored Markdown:

- Headings (H2 starts a section, H3+ are subsections within)
- Tables
- Ordered + unordered lists
- `inline code` and code blocks
- **bold**, *italic*
- > blockquotes (rendered as callout boxes)
- Links (use them sparingly — site is exam-prep, not a reference index)

## Tone

Match the sample (`NISM_Series_V-A_Study_Guide_March2026.md`). Direct,
exam-tactical, opinionated. No fluff. Numbers and exact rules get bolded.
Common-sense framings ("the 4-chapter rule") are encouraged.
