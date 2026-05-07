#!/usr/bin/env python3
"""
Extract a NISM workbook PDF into per-chapter text under
src/data/exams/<code>/research/raw/.

The output is gitignored — it's the unprocessed source the founder + Claude
read while authoring the derivative chapters/questions. Never committed.

Usage:
    python3 scripts/extract-workbook.py \\
        --pdf "/Users/nissar.behera/Documents/NISM/Study Materials/256/2 NISM-Series-VIII Equity Derivatives Certification Examination_Mar 2026.pdf" \\
        --code nism-viii \\
        [--lang en]

Requires:  pip3 install --user pypdf
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    sys.exit("pypdf not installed — run: pip3 install --user pypdf")


REPO_ROOT = Path(__file__).resolve().parent.parent
EXAMS_ROOT = REPO_ROOT / "src" / "data" / "exams"

# Crude chapter heading detector: matches lines like
#   "CHAPTER 3" / "Chapter 3:" / "3. Investment Landscape"
# Tune per workbook if the heuristic misses; this is a starting point.
CHAPTER_RE = re.compile(
    r"^\s*(?:CHAPTER\s+|Chapter\s+|(?P<num>\d+)\.\s)\s*(?P<rest>.*)$",
    re.MULTILINE,
)


def extract_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    parts = []
    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text() or ""
        except Exception as exc:  # noqa: BLE001
            print(f"  page {i + 1}: extract failed ({exc})", file=sys.stderr)
            continue
        parts.append(text)
    return "\n".join(parts)


def split_into_chapters(text: str) -> list[tuple[str, str]]:
    """Return [(chapter_label, body), ...]. Naive split — review before use."""
    headings = list(CHAPTER_RE.finditer(text))
    if not headings:
        return [("00-full-text", text)]

    chunks: list[tuple[str, str]] = []
    for i, m in enumerate(headings):
        start = m.start()
        end = headings[i + 1].start() if i + 1 < len(headings) else len(text)
        body = text[start:end].strip()
        # Try to extract a numeric chapter for the filename.
        num_match = re.search(r"\d+", m.group(0))
        num = num_match.group(0) if num_match else f"x{i:02d}"
        # First non-empty line after the heading becomes the slug.
        first_line = m.group("rest").strip() or body.splitlines()[0]
        slug = re.sub(r"[^a-zA-Z0-9]+", "-", first_line.lower()).strip("-")[:40]
        label = f"{int(num):02d}-{slug}" if num.isdigit() else f"{num}-{slug}"
        chunks.append((label, body))
    return chunks


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract a NISM workbook PDF.")
    parser.add_argument("--pdf", required=True, type=Path, help="Path to the workbook PDF.")
    parser.add_argument("--code", required=True, help="Exam code (e.g. nism-viii).")
    parser.add_argument("--lang", default="en", help="Language tag (default: en).")
    args = parser.parse_args()

    if not args.pdf.is_file():
        sys.exit(f"PDF not found: {args.pdf}")

    out_dir = EXAMS_ROOT / args.code / "research" / "raw" / args.lang
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"→ extracting {args.pdf.name} into {out_dir.relative_to(REPO_ROOT)}")

    full = extract_text(args.pdf)
    chunks = split_into_chapters(full)

    for label, body in chunks:
        path = out_dir / f"{label}.txt"
        path.write_text(body, encoding="utf-8")
        print(f"   wrote {path.relative_to(REPO_ROOT)}  ({len(body)} chars)")

    print(f"done. {len(chunks)} chunks. Review the chapter splits before authoring.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
