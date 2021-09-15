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
	"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
	"https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
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

// Handle offline requests
self.addEventListener("fetch", function (event) {
	if (event.request.url.includes("/api/")) {
		event.respondWith(
			caches.open(DATA_CACHE_NAME).then(function (cache) {
				return fetch(event.request)
					.then(function (response) {
						if (response.status === 2000) {
							cache.put(event.request.url, response.clone());
						}
						return response;
					})
					.catch(function () {
						return cache.match(event.request);
					});
			})
		);
		return;
	}

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
