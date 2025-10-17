const CACHE_NAME = 'zaman-planlayici-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
];

// Service worker yüklendiğinde (install) çalışan olay
self.addEventListener('install', event => {
  // Yükleme işlemi tamamlanana kadar bekle
  event.waitUntil(
    // Belirtilen isimle cache'i aç
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı');
        // Önbelleğe alınacak tüm dosyaları ekle
        return cache.addAll(urlsToCache);
      })
  );
});

// Bir kaynak talebi (fetch) olduğunda çalışan olay
self.addEventListener('fetch', event => {
  event.respondWith(
    // Gelen talebe karşılık gelen bir şey cache'de var mı diye bak
    caches.match(event.request)
      .then(response => {
        // Eğer cache'de varsa, cache'deki yanıtı döndür
        if (response) {
          return response;
        }
        // Eğer cache'de yoksa, normal şekilde internetten talep et
        return fetch(event.request);
      }
    )
  );
});

// Service worker aktif olduğunda çalışan olay
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    // Tüm cache isimlerini al
    caches.keys().then(cacheNames => {
      return Promise.all(
        // Her bir cache'i kontrol et
        cacheNames.map(cacheName => {
          // Eğer bu cache, izin verilenler listesinde değilse, sil
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

