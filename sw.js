const V = "nova-v5";
const PRE = ["/", "/index.html", "/portfolio.html", "/tools.html", "/contact.html", "/about.html", "/css/style.css", "/js/app.js", "/js/data.js", "/js/tools.js", "/offline.html", "/assets/logo.png", "/assets/favicon.svg"];
self.addEventListener("install", (e) => e.waitUntil(
  caches.open(V).then((c) => Promise.allSettled(PRE.map((u) => c.add(u)))).then(() => self.skipWaiting())
));
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then((k) => Promise.all(k.filter((x) => x !== V).map((x) => caches.delete(x)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  // pages & code: network first (always fresh), fall back to cache / offline page
  if (r.mode === "navigate" || /\.(css|js)$/.test(u.pathname)) {
    e.respondWith(fetch(r).then((x) => { if (x.ok) { const c = x.clone(); caches.open(V).then((h) => h.put(r, c)); } return x; })
      .catch(() => caches.match(r).then((m) => m || (r.mode === "navigate" ? caches.match("/offline.html") : Response.error()))));
    return;
  }
  // images & other assets: cache first, refresh in background
  e.respondWith(caches.match(r).then((m) => {
    const net = fetch(r).then((x) => { if (x.ok) { const c = x.clone(); caches.open(V).then((h) => h.put(r, c)); } return x; }).catch(() => m || Response.error());
    return m || net;
  }));
});
