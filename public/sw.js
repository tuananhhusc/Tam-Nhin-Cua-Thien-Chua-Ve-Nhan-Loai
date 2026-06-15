const CACHE_NAME = "tnctcvnl-cache-v1";
const ASSETS_TO_CACHE = [
  "/Tam-Nhin-Cua-Thien-Chua-Ve-Nhan-Loai/",
  "/Tam-Nhin-Cua-Thien-Chua-Ve-Nhan-Loai/manifest.json",
  "/Tam-Nhin-Cua-Thien-Chua-Ve-Nhan-Loai/favicon.ico"
];

// Install Service Worker and cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker and clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First falling back to Cache strategy for offline availability
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and local requests (http/https scheme)
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the request succeeds, clone it and save to cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network request fails, search in cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If fallback fails, return a basic error or offline message
          return new Response("Bạn đang ngoại tuyến. Vui lòng kết nối Internet để tải nội dung mới.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({ "Content-Type": "text/plain; charset=utf-8" })
          });
        });
      })
  );
});
