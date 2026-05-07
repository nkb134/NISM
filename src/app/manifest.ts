import type { MetadataRoute } from 'next';

// PWA manifest. Exposed at /manifest.webmanifest by Next 15.
//
// Install behavior:
// - On Android Chrome: visiting the site twice (separated by 5+ minutes) plus
//   meeting the installability checks (HTTPS, valid manifest, 192+512 icons,
//   service worker presence in some Chrome versions) prompts an install banner.
// - On iOS Safari: tap Share → Add to Home Screen. No automatic prompt.
// - Both honour `theme_color` for the status bar tint.

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NISMPracticeTests',
    short_name: 'NISMPractice',
    description:
      'Free NISM practice tests and study guides — V-A available now, more exams rolling out.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#1a1f3a',
    lang: 'en-IN',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
