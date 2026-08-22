const CACHE_NAME = 'nepalhub-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/components/sidebar.js',
    '/components/pos.js',
    '/components/inventory.js',
    '/components/udharo.js',
    '/components/finance.js',
    '/components/tax.js',
    '/components/calendar.js',
    '/components/settings.js',
    '/components/calculator.js',
    '/components/lowStock.js',
    '/aio.png',
    '/aio2.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
