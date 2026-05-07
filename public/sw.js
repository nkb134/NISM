// Hand-rolled service worker for NISMPracticeTests.
//
// Four cache buckets:
//   1. app-shell — root HTML / navigation requests (network-first, cache fallback)
//   2. study     — study guide chapters (cache-first; rarely change)
//   3. dynamic   — /api/* and /exam/*/test/* (network-first, no stale)
//   4. assets    — /icons /images /fonts /_next/static (cache-first; immutable)
//
// Bumping CACHE_VERSION purges old caches on activate.
// Hand-rolled rather than next-pwa: ~150 lines we can read; no dep treadmill.

const CACHE_VERSION = 'v1';
const APP_SHELL = `nism-shell-${CACHE_VERSION}`;
const STUDY = `nism-study-${CACHE_VERSION}`;
const DYNAMIC = `nism-dynamic-${CACHE_VERSION}`;
const ASSETS = `nism-assets-${CACHE_VERSION}`;
const KNOWN = new Set([APP_SHELL, STUDY, DYNAMIC, ASSETS]);

// Pre-warm shell + manifest on install. Anything missing here just gets
// cached on first hit via the fetch handler.
const PRECACHE_URLS = [
  '/',
  '/dashboard',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {
        // Don't block install if a precache target 404s in dev.
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !KNOWN.has(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// ── routing ───────────────────────────────────────────────────────────────

function pickBucket(url) {
  const { pathname } = url;
  if (pathname.startsWith('/api/') || /^\/exam\/[^/]+\/test\//.test(pathname)) {
    return 'dynamic';
  }
  if (/^\/exam\/[^/]+\/study/.test(pathname)) {
    return 'study';
  }
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/brand/') ||
    /\.(png|jpg|jpeg|webp|svg|woff2?|ttf|ico)$/i.test(pathname)
  ) {
    return 'assets';
  }
  return 'shell';
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Auth callbacks must hit the network — never cache or serve cached.
  if (url.pathname.startsWith('/api/auth/')) return;

  const bucket = pickBucket(url);
  if (bucket === 'dynamic' || bucket === 'shell') {
    event.respondWith(networkFirst(req, bucket === 'dynamic' ? DYNAMIC : APP_SHELL));
  } else if (bucket === 'study') {
    event.respondWith(cacheFirst(req, STUDY));
  } else {
    event.respondWith(cacheFirst(req, ASSETS));
  }
});

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    if (fresh.ok && fresh.type === 'basic') cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    // Last resort for navigation: give them the cached landing.
    if (req.mode === 'navigate') {
      const shell = await caches.match('/');
      if (shell) return shell;
    }
    throw err;
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) {
    // Refresh in background so updates land on next view.
    fetch(req)
      .then((fresh) => {
        if (fresh.ok && fresh.type === 'basic') cache.put(req, fresh);
      })
      .catch(() => {});
    return cached;
  }
  const fresh = await fetch(req);
  if (fresh.ok && fresh.type === 'basic') cache.put(req, fresh.clone());
  return fresh;
}

// Allow the page to force activation after a deploy.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
