const CACHE_NAME = 'offline-v2';
const OFFLINE_URL = 'offline.html';

// Install the service worker and cache the offline page
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.add(OFFLINE_URL))
    );
});

// Serve the offline page when fetch fails
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Return offline page but also update cache
                    return caches.match(OFFLINE_URL)
                        .then((response) => {
                            // Refresh cache in background
                            caches.open(CACHE_NAME)
                                .then((cache) => cache.add(OFFLINE_URL));
                            return response;
                        });
                })
        );
    } else {
        // For other requests, try cache first, then network
        event.respondWith(
            caches.match(event.request)
                .then((response) => response || fetch(event.request))
        );
    }
});

// Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
