const CACHE_VERSION = "v4";
const APP_CACHE_PREFIX = "cashflow-";
const SHELL_CACHE_NAME = `${APP_CACHE_PREFIX}shell-${CACHE_VERSION}`;
const APP_SHELL_URL = new URL("./index.html", self.registration.scope).toString();
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./variables.css",
  "./base.css",
  "./layout.css",
  "./components.css",
  "./auth.css",
  "./config.js",
  "./auth.js",
  "./script.js",
  "./state.js",
  "./i18n.js",
  "./dom.js",
  "./events.js",
  "./financial-engine.js",
  "./validation.js",
  "./utils.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];
const CORE_PATHS = new Set(
  CORE_ASSETS.map((asset) => new URL(asset, self.registration.scope).pathname)
);

const openShellCache = () => caches.open(SHELL_CACHE_NAME);

const buildCacheKey = (requestUrl) => {
  const cacheUrl = new URL(requestUrl, self.registration.scope);
  cacheUrl.search = "";
  cacheUrl.hash = "";
  return cacheUrl.toString();
};

const cacheShellAsset = async (cacheKey, response) => {
  if (!response || !response.ok) {
    return response;
  }

  const cache = await openShellCache();
  await cache.put(cacheKey, response.clone());
  return response;
};

const matchShellAsset = async (cacheKey) => {
  const cache = await openShellCache();
  return cache.match(cacheKey);
};

const fetchAndCache = async (request, cacheKey) => {
  const networkResponse = await fetch(request, { cache: "no-store" });
  await cacheShellAsset(cacheKey, networkResponse.clone());
  return networkResponse;
};

const deleteOldCaches = async () => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((cacheName) => cacheName.startsWith(APP_CACHE_PREFIX) && cacheName !== SHELL_CACHE_NAME)
      .map((cacheName) => caches.delete(cacheName))
  );
};

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    deleteOldCaches().then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
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

  const isNavigationRequest = request.mode === "navigate" || request.destination === "document";
  const isCoreAssetRequest = CORE_PATHS.has(requestUrl.pathname);

  if (!isNavigationRequest && !isCoreAssetRequest) {
    return;
  }

  // Strip cache-busting query params so each core file keeps a single fresh fallback entry.
  const cacheKey = isNavigationRequest ? APP_SHELL_URL : buildCacheKey(request.url);

  event.respondWith(
    (async () => {
      try {
        return await fetchAndCache(request, cacheKey);
      } catch (error) {
        const cachedResponse = await matchShellAsset(cacheKey);
        return cachedResponse || Response.error();
      }
    })()
  );
});
