// SACHi STREAM Service Worker — v6 MINIMAL
// Removed all fetch interception to fix Cloudflare TUS upload blocking
const CACHE_VERSION = 'sachi-v6';
const STATIC_CACHE = `${CACHE_VERSION}-static`;

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache =>
      cache.addAll(['/icon-192.png', '/icon-512.png', '/favicon.ico']).catch(() => {})
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// NO fetch handler — all requests go directly to network
// This prevents the SW from intercepting Cloudflare TUS uploads
