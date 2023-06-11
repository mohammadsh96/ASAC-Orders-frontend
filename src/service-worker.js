const CACHE_NAME = 'my-app-cache';
const urlsToCache = ['/', '/index.html', '/css/style.css', '/js/app.js'];
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['my-app-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/serviceWorker.js')
        .then((registration) => {
          console.log('Service worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service worker registration failed:', error);
        });
    });
  }
}
