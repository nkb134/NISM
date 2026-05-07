// Server-side i18n helpers. Re-exports the client-safe constants so most
// callers can keep importing from '@/i18n', and adds `getLocale()` + `t()`
// which depend on next/headers (server-only).

import 'server-only';
import { headers } from 'next/headers';
import en from './en.json';
import hi from './hi.json';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './constants';

export * from './constants';

const DICTIONARIES: Record<Locale, Record<string, string>> = { en, hi };

export type MessageKey = keyof typeof en;

/** Server-side locale lookup. Reads the x-locale header set by middleware.ts. */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const candidate = h.get('x-locale');
  if (candidate && (LOCALES as readonly string[]).includes(candidate)) {
    return candidate as Locale;
  }
  return DEFAULT_LOCALE;
}

/** Fetch a string. Falls back to English if a key isn't translated yet. */
export async function t(key: MessageKey, vars?: Record<string, string | number>): Promise<string> {
  const locale = await getLocale();
  const dict = DICTIONARIES[locale];
  let s = dict[key] ?? en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, String(v));
    }
  }
  return s;
}
