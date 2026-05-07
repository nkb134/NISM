'use client';

// Tiny chip on each chapter row showing whether the user has marked it read
// on this device. Uses the same localStorage keys that ChapterReader writes.
// Listens to the 'study-progress-change' custom event so toggling on the
// chapter page updates the badge here without a refresh.

import { useEffect, useState } from 'react';

function completeKey(examCode: string, slug: string) {
  return `nism:study:${examCode}:${slug}:done`;
}

export function ProgressBadge({ examCode, slug }: { examCode: string; slug: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setDone(window.localStorage.getItem(completeKey(examCode, slug)) === '1');
      } catch {}
    };
    read();
    window.addEventListener('study-progress-change', read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('study-progress-change', read);
      window.removeEventListener('storage', read);
    };
  }, [examCode, slug]);

  if (!done) {
    return (
      <span
        aria-label="Not started"
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: '1.5px solid var(--color-border)',
          display: 'inline-block',
        }}
      />
    );
  }
  return (
    <span
      aria-label="Completed"
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: 'var(--color-pass)',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      ✓
    </span>
  );
}
