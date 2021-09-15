const STATIC_CACHE_NAME = "budget-static-files-v1";
const DATA_CACHE_NAME = "budget-data-files-v1";

const STATIC_FILES_TO_CACHE = [
	"/",
	"/index.html",
	"/manifest.json",
	"/service-worker.js",
	"/assets/js/index.js",
	"/assets/css/styles.css",
	"/assets/icons/icon-192x192.png",
	"/assets/icons/icon-512x512.png",
];

// Add new files to cache
self.addEventListener("install", function (event) {
	// add static files
	event.waitUntil(
		caches.open(STATIC_CACHE_NAME).then(function (cache) {
			return cache.addAll(STATIC_FILES_TO_CACHE);
		})
	);

	// add data files
	event.waitUntil(
		caches.open(DATA_CACHE_NAME).then(function (cache) {
			cache.add("/api/transaction");
		})
	);
});

// Remove old cache
self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (
						cacheName !== STATIC_CACHE_NAME &&
						cacheName !== DATA_CACHE_NAME
					) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// handle offline requests
self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.open(STATIC_CACHE_NAME).then(function (cache) {
			return cache.match(event.request).then(function (response) {
				return (
					response ||
					fetch(event.request).then(function (response) {
						cache.put(event.request, response.clone());
						return response;
					})
				);
			});
		})
	);
});
