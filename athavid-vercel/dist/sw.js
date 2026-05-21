// SACHi STREAM Service Worker — auto-update on new deploy
const CACHE_VERSION = 'sachi-v3';
const STATIC_CACHE = `${CACHE_VERSION}-static`;

// Only cache static assets — NEVER cache index.html or navigation requests
const CACHE_EXTENSIONS = ['.png', '.ico', '.jpg', '.jpeg', '.webp', '.svg', '.woff2', '.woff'];

self.addEventListener('install', event => {
  // Take over immediately — no waiting for old SW to die
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache =>
      cache.addAll(['/icon-192.png', '/icon-512.png', '/favicon.ico'])
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    // Delete all old caches on activation
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k))
      )
    ).then(() => {
      // Claim all clients immediately and tell them to reload
      return self.clients.claim().then(() => {
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'SW_UPDATED' });
          });
        });
      });
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Always fetch HTML fresh from network — critical for deploy updates
  if (
    event.request.mode === 'navigate' ||
    event.request.headers.get('accept')?.includes('text/html') ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // JS/CSS assets: network-first (Vite hashes filenames so these are always fresh)
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Static icons/images: cache-first
  const ext = url.pathname.split('.').pop();
  if (CACHE_EXTENSIONS.includes('.' + ext)) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(resp => {
          const clone = resp.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(event.request, clone));
          return resp;
        })
      )
    );
    return;
  }

  // Everything else — network only
  event.respondWith(fetch(event.request));
});
