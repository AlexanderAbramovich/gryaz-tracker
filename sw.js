const CACHE = "gryaz-v11.0";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];
/* В зале без связи запуск раньше ждал сеть без ограничения. Теперь ждём 3 секунды и отдаём кэш. */
const NET_TIMEOUT = 3000;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;
  /* Сервер и кабинет тренера никогда не кэшируем: там всегда свежее */
  const path = new URL(req.url).pathname;
  if (path.indexOf("/api/") >= 0 || path.indexOf("/coach/") >= 0) return;
  const isApp = /\/$|\/index\.html$/.test(path);

  // HTML: network first, so updates arrive; cache as fallback for offline
  if (req.mode === "navigate" || req.destination === "document") {
    const net = fetch(req).then(res => {
      if (res && res.ok && isApp) caches.open(CACHE).then(c => c.put("./index.html", res.clone()));
      return res;
    });
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), NET_TIMEOUT));
    e.respondWith(
      Promise.race([net, timeout]).catch(() => (isApp ? caches.match("./index.html") : Promise.resolve(null)).then(hit => hit || net))
    );
    return;
  }

  // everything else: cache first
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }))
  );
});
