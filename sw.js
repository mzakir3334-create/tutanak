// Uygulama kabuğu: sayfa çevrimdışıyken de açılır; veri istekleri her zaman ağa gider
var AD = 'tutanak-v2';
self.addEventListener('install', function (e) { e.waitUntil(caches.open(AD).then(function (c) { return c.addAll(['./', 'index.html', 'icon-192.png']); }).catch(function () {})); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== AD; }).map(function (x) { return caches.delete(x); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) { var c = r.clone(); caches.open(AD).then(function (x) { x.put(e.request, c); }); return r; }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('./'); }); }));
});
