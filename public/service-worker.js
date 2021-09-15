const CACHE_NAME = "budget-static-files-v1";
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

// add files to cache
self.addEventListener("install", function (event) {
	// add static files
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
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
