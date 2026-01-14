const CACHE_NAME = "expense-v2026-vDark-Mode-R1";
// ... বাকি কোড একই থাকবে ...

const ASSETS = ["./", "./index.html", "./style.css", "./script.js", "./i18n.js", "./manifest.json", "./icon-192.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(res => {
    const clone = res.clone();
    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
    return res;
  }).catch(() => caches.match(e.request)));
});
