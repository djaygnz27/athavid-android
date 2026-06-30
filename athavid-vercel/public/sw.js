// SACHi STREAM Service Worker — cache-first, NO forced reloads
const CACHE_VERSION = 'sachi-v5';
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const CACHE_EXTENSIONS = ['.png', '.ico', '.jpg', '.jpeg', '.webp', '.svg', '.woff2', '.woff'];

self.addEventListener('install', event => {
  // DO NOT skipWaiting — let the old SW finish serving the current session
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache =>
      cache.addAll(['/icon-192.png', '/icon-512.png', '/favicon.ico']).catch(() => {})
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
    // NO postMessage SW_UPDATED — never force-reload an active user session
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // HTML — always network fresh (but DON'T reload if offline, serve cache)
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

  // Vite-hashed JS/CSS assets — cache-first (filename changes on every deploy)
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(resp => {
          const clone = resp.clone();
          caches.open(STATIC_CACHE).then(c => c.put(event.request, clone));
          return resp;
        });
      })
    );
    return;
  }

  // Static icons/images — cache-first
  const ext = '.' + url.pathname.split('.').pop();
  if (CACHE_EXTENSIONS.includes(ext)) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(resp => {
          const clone = resp.clone();
          caches.open(STATIC_CACHE).then(c => c.put(event.request, clone));
          return resp;
        })
      )
    );
    return;
  }

  // Cloudflare Stream TUS uploads — must bypass SW entirely
  // The SW wrapping breaks streaming PATCH requests (body can't be cloned/re-read)
  if (
    url.hostname.includes('cloudflarestream.com') ||
    url.hostname.includes('cloudflarestorage.com') ||
    url.hostname.includes('r2.cloudflarestorage.com')
  ) {
    return; // Do NOT call event.respondWith — browser handles it natively
  }

  // Everything else (API calls etc) — network only, no caching
  event.respondWith(fetch(event.request));
});
