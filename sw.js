// ── RAFIKI PRO Service Worker ──────────────────────────────────────────────────
// Bump version string on every new deployment to clear old caches
const CACHE_NAME = 'rafiki-pro-v1';

// App shell files to pre-cache on install
const PRECACHE_URLS = [
  '/RAFIKI-APP/',
  '/RAFIKI-APP/index.html',
  '/RAFIKI-APP/manifest.json',
  '/RAFIKI-APP/icons/icon-72x72.png',
  '/RAFIKI-APP/icons/icon-96x96.png',
  '/RAFIKI-APP/icons/icon-128x128.png',
  '/RAFIKI-APP/icons/icon-144x144.png',
  '/RAFIKI-APP/icons/icon-152x152.png',
  '/RAFIKI-APP/icons/icon-192x192.png',
  '/RAFIKI-APP/icons/icon-384x384.png',
  '/RAFIKI-APP/icons/icon-512x512.png',
  // CDN scripts — cached so app shell loads offline
  'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://unpkg.com/html5-qrcode'
];

// ── INSTALL ────────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching RAFIKI PRO shell…');
      return Promise.allSettled(
        PRECACHE_URLS.map(url =>
          cache.add(url).catch(err =>
            console.warn('[SW] Could not cache:', url, err)
          )
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: delete old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ──────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. PeerJS signalling server → always network (real-time P2P must be live)
  if (url.hostname.includes('peerjs.com') || url.hostname.includes('0.peerjs.com')) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. Google Translate API → always network (live translation)
  if (url.hostname.includes('translate.googleapis.com') || url.hostname.includes('translation.googleapis.com')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ error: 'Translation unavailable offline.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // 3. Google Fonts → stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request).then(res => {
            cache.put(request, res.clone());
            return res;
          });
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // 4. CDN scripts (PeerJS, QRCode, html5-qrcode) → cache-first
  if (url.hostname === 'unpkg.com' || url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return res;
        });
      })
    );
    return;
  }

  // 5. App shell → cache-first, fallback to network, offline fallback
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok && url.hostname.includes('github.io')) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return res;
      }).catch(() => {
        // Offline fallback for navigation
        if (request.mode === 'navigate') {
          return caches.match('/RAFIKI-APP/index.html');
        }
      });
    })
  );
});

// ── PUSH NOTIFICATIONS (future-ready) ─────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'RAFIKI PRO';
  const options = {
    body: data.body || 'You have a new message!',
    icon: '/RAFIKI-APP/icons/icon-192x192.png',
    badge: '/RAFIKI-APP/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/RAFIKI-APP/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/RAFIKI-APP/')
  );
});
