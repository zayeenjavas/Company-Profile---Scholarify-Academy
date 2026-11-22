const CACHE_NAME = "scholarify-static-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ATURAN KRITIS CBT: Endpoint /api/* WAJIB Network-Only (jangan pernah di-cache)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Untuk navigasi & aset lain: Network-First dengan fallback cache
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok && url.pathname.startsWith("/_next/static/")) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
