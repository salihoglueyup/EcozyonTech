/* Ecozyon Tech service worker — small hand-rolled offline shell (no Workbox).
 * Strategy:
 *  - navigations: network-first, fall back to cached page, then /offline.html
 *  - same-origin GET assets: cache-first, populate cache on first fetch
 * Bump CACHE to invalidate everything on the next activate. */
const CACHE = 'ecozyon-v2';
const PRECACHE = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/favicon.svg',
  // Self-hosted latin base fonts (same-origin now) so the offline shell and the
  // first offline-viewed page render in-brand; latin-ext is runtime-cached.
  '/fonts/inter-latin.woff2',
  '/fonts/space-grotesk-latin.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch cross-origin (analytics, embeds…)

  // Page navigations: try the network, fall back to cache, then offline shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/offline.html'))),
    );
    return;
  }

  // Static assets: serve from cache, populate on first successful fetch.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        }),
    ),
  );
});
