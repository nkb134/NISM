'use client';

import { useEffect } from 'react';

// Registers /sw.js once per page load. Only in production: in dev the SW
// would aggressively cache HMR responses and Turbopack output, which is
// painful to debug. The presence of an active SW is the second signal
// Android Chrome looks for before showing the auto-install prompt.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registration failures are non-fatal — app still works without offline.
      });
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
