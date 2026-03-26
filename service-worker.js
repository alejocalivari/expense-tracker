const CACHE_NAME = "cashflow-shell-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./state.js",
  "./i18n.js",
  "./dom.js",
  "./events.js",
  "./utils.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];
const CORE_PATHS = new Set(CORE_ASSETS.map((asset) => new URL(asset, self.location.href).pathname));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const isNavigationRequest = request.mode === "navigate";
  const isCoreAssetRequest = CORE_PATHS.has(requestUrl.pathname);

  if (!isNavigationRequest && !isCoreAssetRequest) {
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(isNavigationRequest ? "./index.html" : request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok && isCoreAssetRequest) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        if (isNavigationRequest) {
          return caches.match("./index.html");
        }

        throw error;
      }
    })()
  );
});
