'use client';

// Two-button locale switcher. Reads the current pathname, strips any locale
// prefix, and links to the same page under the new locale's prefix.
// Pure links (no JS state, no client-side reload), so it stays accessible.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/i18n/constants';

const LABELS: Record<Locale, string> = {
  en: 'EN',
  hi: 'हि',
};

function buildHref(locale: Locale, pathname: string): string {
  // Strip any leading locale prefix.
  let stripped = pathname;
  for (const code of LOCALES) {
    if (code === DEFAULT_LOCALE) continue;
    if (stripped === `/${code}`) {
      stripped = '/';
      break;
    }
    if (stripped.startsWith(`/${code}/`)) {
      stripped = stripped.slice(code.length + 1);
      break;
    }
  }
  return locale === DEFAULT_LOCALE ? stripped : `/${locale}${stripped === '/' ? '' : stripped}`;
}

export function LangSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="inline-flex overflow-hidden rounded-md border"
      style={{
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--radius-md)',
        fontSize: 11,
      }}
    >
      {LOCALES.map((code) => {
        const active = code === current;
        return (
          <Link
            key={code}
            href={buildHref(code, pathname) as never}
            aria-current={active ? 'true' : undefined}
            lang={code}
            style={{
              padding: '4px 9px',
              background: active ? 'var(--color-navy)' : 'var(--color-bg)',
              color: active ? '#fff' : 'var(--color-text-muted)',
              fontWeight: 700,
              letterSpacing: '0.4px',
              textDecoration: 'none',
            }}
          >
            {LABELS[code]}
          </Link>
        );
      })}
    </div>
  );
}
