const CACHE_NAME = 'weather-app-v1';
const STATIC_CACHE_NAME = 'weather-app-static-v1';
const DYNAMIC_CACHE_NAME = 'weather-app-dynamic-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Activate the service worker immediately
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network and cache
self.addEventListener('fetch', (event) => {
  // Check if the request is for an API
  const url = new URL(event.request.url);
  const isApiRequest = url.hostname.includes('api.weatherapi.com');

  if (isApiRequest) {
    // Network-first strategy for API requests
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              // Cache response with 15-minute expiration
              cache.put(event.request, responseToCache);
              // Clean old API responses
              cleanupOldApiCache();
            });
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(STATIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              return response;
            });
        })
    );
  }
});

// Function to clean up old API cache items
function cleanupOldApiCache() {
  caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > 30) { // Limit the number of cached API responses
        cache.delete(keys[0]); // Delete the oldest item
      }
    });
  });
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the service worker takes control immediately
  return self.clients.claim();
}); 