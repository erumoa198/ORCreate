/* Navi Beauty App — Service Worker（簡易オフラインキャッシュ） */
var CACHE = 'navi-beauty-v2';
var ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './css/fonts.css',
  './js/app.js',
  './js/qr.js',
  './js/vendor/qrcode.js',
  './data/diagnoses.json',
  './data/menus.json',
  './data/products.json',
  './data/tips.json',
  './data/news.json',
  './icons/grain.png',
  './fonts/cormorant-400.woff2',
  './fonts/cormorant-600.woff2',
  './fonts/inter-400.woff2',
  './fonts/inter-500.woff2',
  './fonts/inter-600.woff2',
  './fonts/shippori-600.woff2',
  './fonts/zenkaku-400.woff2',
  './fonts/zenkaku-700.woff2',
  './manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  // 同一オリジンのみ。フォント等はネット優先。
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return cached; });
    })
  );
});
