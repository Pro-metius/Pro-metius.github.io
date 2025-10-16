const CACHE_NAME = 'zaman-planlayici-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Yükleme sırasında temel dosyaları önbelleğe al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbellek açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});

// Gelen isteklere yanıt ver
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Önbellekte varsa, önbellekten döndür
        if (response) {
          return response;
        }
        // Önbellekte yoksa, ağdan getirmeye çalış
        return fetch(event.request);
      })
  );
});
