const CACHE_NAME = 'sectograph-cache-v6'; // Önbelleği sıfırlamak için versiyon yükseltildi
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
];

// Yükleme: Yeni dosyaları önbelleğe al
self.addEventListener('install', event => {
  self.skipWaiting(); // Eski service worker'ın beklemesini engelle
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbellek açıldı ve dosyalar ekleniyor.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivasyon: Eski önbellekleri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski önbellek siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Kontrolü hemen al
  );
});

// Fetch: Önce önbellekten, bulamazsa ağdan yanıt ver
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Önbellekte varsa, oradan döndür
                if (response) {
                    return response;
                }
                // Önbellekte yoksa, ağdan al
                return fetch(event.request);
            })
    );
});

