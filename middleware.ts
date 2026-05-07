import { NextResponse, type NextRequest } from 'next/server';

// Locale routing. Hindi lives at /hi/...; English is prefix-less so existing
// URLs and SEO equity stay intact. The middleware rewrites /hi/foo → /foo
// and stamps an x-locale header that server components read via getLocale().
//
// Adding a new locale: add the prefix to LOCALE_PREFIXES below + add a JSON
// dictionary at src/i18n/<code>.json + add to src/i18n/index.ts LOCALES.

const LOCALE_PREFIXES = ['hi'] as const;
const LOCALE_RE = new RegExp(`^/(${LOCALE_PREFIXES.join('|')})(?:/|$)`);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(LOCALE_RE);

  if (match) {
    const locale = match[1]!;
    const stripped = pathname.replace(LOCALE_RE, '/').replace(/\/{2,}/g, '/');
    const url = request.nextUrl.clone();
    url.pathname = stripped;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);
    requestHeaders.set('x-pathname', pathname);

    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // English (default) — no rewrite, just stamp the header.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', 'en');
  requestHeaders.set('x-pathname', pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Match everything except API routes and static assets. Auth callbacks must
// never get rewritten; manifest/sitemap/sw must be served as-is.
export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|favicon.svg|icons|images|brand|fonts|manifest.webmanifest|robots.txt|sitemap.xml|sw.js).*)',
  ],
};
