# Portal-capture notes — internal, never rendered

Founder logs in to the NISM candidate portal manually (Claude blind to
password). Once authenticated, Claude drives the practice-exam capture and
writes structured JSON under `../research/portal-capture/<exam>-<set>.json`.

This file is for free-text observations: question style, distractor patterns,
common pitfalls, anything that should shape the question pool but isn't a
question itself.

**Both `portal-notes.md` and `portal-capture/` are gitignored** — NISM's
content is their IP. Only the derivative paraphrased questions in
`questions/<topic>.json` get committed.
