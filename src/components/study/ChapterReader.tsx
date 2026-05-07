'use client';

// Chapter reader with the three-layer toggle.
// Server passes pre-rendered HTML for each layer (Summary / Core / Memory)
// and we just toggle which one is displayed. Reading state (which layer was
// last on, and whether the chapter is "marked complete") is persisted to
// localStorage keyed by examCode + slug, so it survives reloads without
// needing a round-trip to the DB. When user_exams is wired, this can promote
// to server state.
//
// We render the pre-built HTML via dangerouslySetInnerHTML. This is safe
// because the source is repo-controlled markdown (src/data/exams/.../study/),
// rendered server-side by `marked`, which HTML-escapes by default. There is
// no user-authored content in this path. Do not change this contract without
// adding a sanitizer like DOMPurify.

import { useEffect, useState } from 'react';

export type Layer = 'summary' | 'core' | 'memory';

const LAYERS: { id: Layer; emoji: string; label: string; sub: string }[] = [
  { id: 'summary', emoji: '🎯', label: 'Summary', sub: '60 seconds' },
  { id: 'core',    emoji: '📖', label: 'Detail',  sub: 'testable depth' },
  { id: 'memory',  emoji: '🧠', label: 'Memory',  sub: 'mnemonics' },
];

type Props = {
  examCode: string;
  slug: string;
  layers: { summaryHtml: string; coreHtml: string; memoryHtml: string };
};

function storageKey(examCode: string, slug: string) {
  return `nism:study:${examCode}:${slug}`;
}
function completeKey(examCode: string, slug: string) {
  return `nism:study:${examCode}:${slug}:done`;
}

export function ChapterReader({ examCode, slug, layers }: Props) {
  const [active, setActive] = useState<Layer>('core');
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    try {
      const last = window.localStorage.getItem(storageKey(examCode, slug));
      if (last === 'summary' || last === 'core' || last === 'memory') setActive(last);
      const isDone = window.localStorage.getItem(completeKey(examCode, slug)) === '1';
      setDone(isDone);
    } catch {
      // localStorage may be disabled (e.g. private browsing on iOS) — keep defaults.
    }
  }, [examCode, slug]);

  function selectLayer(layer: Layer) {
    setActive(layer);
    try {
      window.localStorage.setItem(storageKey(examCode, slug), layer);
    } catch {}
  }

  function toggleDone() {
    const next = !done;
    setDone(next);
    try {
      if (next) window.localStorage.setItem(completeKey(examCode, slug), '1');
      else window.localStorage.removeItem(completeKey(examCode, slug));
      window.dispatchEvent(new CustomEvent('study-progress-change'));
    } catch {}
  }

  const html =
    active === 'summary' ? layers.summaryHtml : active === 'core' ? layers.coreHtml : layers.memoryHtml;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Reading depth"
        className="flex flex-wrap gap-2"
        style={{ marginBottom: 24 }}
      >
        {LAYERS.map((layer) => {
          const isActive = active === layer.id;
          return (
            <button
              key={layer.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => selectLayer(layer.id)}
              className="inline-flex items-center gap-2"
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isActive ? 'var(--color-navy)' : 'var(--color-border)',
                background: isActive ? 'var(--color-navy)' : 'var(--color-bg)',
                color: isActive ? '#fff' : 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s',
              }}
            >
              <span aria-hidden>{layer.emoji}</span>
              <span>{layer.label}</span>
              <span
                style={{
                  fontWeight: 400,
                  color: isActive ? 'rgba(255,255,255,0.75)' : 'var(--color-text-faint)',
                  fontSize: 'var(--text-xs)',
                }}
              >
                {layer.sub}
              </span>
            </button>
          );
        })}
      </div>

      <article className="study-prose" dangerouslySetInnerHTML={{ __html: html }} />

      <div
        className="mt-10 flex items-center justify-between border-t pt-6"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <button
          onClick={toggleDone}
          className="inline-flex items-center gap-2"
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid',
            borderColor: done ? 'var(--color-pass)' : 'var(--color-border)',
            background: done ? '#ecfdf5' : 'var(--color-bg)',
            color: done ? 'var(--color-pass)' : 'var(--color-text)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          aria-pressed={done}
        >
          <span aria-hidden>{done ? '✓' : '○'}</span>
          {done ? 'Marked as read' : 'Mark as read'}
        </button>
        <span style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}>
          Saved on this device
        </span>
      </div>
    </div>
  );
}
