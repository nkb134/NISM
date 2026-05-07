// Canonical-domain config.
// Both nismpracticetests.com and nismmocktest.xyz serve the same content;
// per the founder's call, .com is the canonical for SEO. The .xyz domain
// stays live as a brand mirror — every page sets rel=canonical to the .com
// equivalent so search engines pick the right one.

export const CANONICAL_HOST = 'https://nismpracticetests.com';

export function canonicalUrl(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${CANONICAL_HOST}${cleaned === '/' ? '' : cleaned}`;
}
