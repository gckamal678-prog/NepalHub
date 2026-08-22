const CACHE_NAME = 'nepalhub-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './components/calculator.js',
  './components/finance.js',
  './components/inventory.js',
  './components/lowStock.js',
  './components/pos.js',
  './components/settings.js',
  './components/sidebar.js',
  './components/taxAudit.js',
  './components/udharo.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
