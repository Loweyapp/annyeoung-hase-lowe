const CACHE = 'hase-lowe-v1';
const BASE = '/annyeoung-hase-lowe';

const PRECACHE = [
  BASE + '/',
  BASE + '/index.html',
];

// On install, cache the shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// On activate, clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for navigation, cache-first for assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin and tile requests
  if (!url.origin.includes(self.location.hostname) && !url.hostname.includes('tile.openstreetmap.org')) {
    return;
  }

  if (request.mode === 'navigate') {
    // Navigation: network first, fall back to cached index.html
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(BASE + '/index.html'))
    );
    return;
  }

  // Assets + tiles: cache first, then network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
