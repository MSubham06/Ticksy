const CACHE_NAME = 'offline-v1';
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
                .catch(() => caches.match(OFFLINE_URL))
        );
    }
});