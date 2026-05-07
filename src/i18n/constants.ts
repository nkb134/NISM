// Client-safe locale constants. No server-only imports here so this can be
// pulled into client components (e.g. LangSwitcher).

export const LOCALES = ['en', 'hi'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Locales that exist as URL prefixes. English never gets a prefix. */
export const LOCALE_PREFIXES: ReadonlyArray<Exclude<Locale, 'en'>> = ['hi'];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Return the URL prefix for a locale ('' for the default, '/hi' for Hindi). */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/** Strip any locale prefix from a pathname. */
export function stripLocalePrefix(pathname: string): string {
  for (const p of LOCALE_PREFIXES) {
    if (pathname === `/${p}`) return '/';
    if (pathname.startsWith(`/${p}/`)) return pathname.slice(p.length + 1);
  }
  return pathname;
}
