const CACHE = "flitz-bog-v1";
const PRECACHE = [
  "/",
  "/village",
  "/village/games",
  "/village/ranking",
  "/village/map",
  "/village/team",
  "/media/hero-welcome.jpg",
  "/media/game-olympic-crane.jpg",
  "/media/village-aerial.jpg",
  "/brand/flitz-logo.svg",
  "/icons/app-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.destination === "image" || url.pathname.startsWith("/media/") || url.pathname.startsWith("/brand/")) {
    event.respondWith(cacheFirst(req));
    return;
  }

  event.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  const copy = res.clone();
  caches.open(CACHE).then((c) => c.put(req, copy));
  return res;
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
    return res;
  } catch {
    const cached = await caches.match(req);
    return cached || caches.match("/village");
  }
}
