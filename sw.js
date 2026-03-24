// ── CS Operations Service Worker v3 ──────────────────────────────────────────
// Strategy:
//   Static shell (HTML, manifest, icons) → Cache First (offline-safe)
//   All other requests (JS, API, Supabase) → Network First (always fresh)
//
// This works correctly in both Vite dev mode AND production build,
// because we never hard-code hashed JS bundle filenames.

const CACHE_NAME   = "cs-ops-v3";
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// ── Install: pre-cache the static shell ──────────────────────────────────────
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────────────────────────
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: smart routing ──────────────────────────────────────────────────────
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Never intercept: Supabase API, CDN, or non-GET requests
  if (
    event.request.method !== "GET" ||
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("jsdelivr.net") ||
    url.hostname.includes("cdnjs.cloudflare.com")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static shell assets → Cache First (instant load + offline support)
  const isShell = SHELL_ASSETS.includes(url.pathname) ||
                  url.pathname === "/index.html";

  if (isShell) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          // Update cache in background (stale-while-revalidate)
          fetch(event.request).then(fresh => {
            caches.open(CACHE_NAME).then(c => c.put(event.request, fresh));
          }).catch(() => {});
          return cached;
        }
        // Not cached yet → fetch and cache
        return fetch(event.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        }).catch(() => caches.match("/index.html")); // fallback to root
      })
    );
    return;
  }

  // JS/CSS bundles and everything else → Network First with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(res => {
        // Cache successful responses (for offline fallback)
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener("push", event => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: event.data.text(), body: "" }; }
  event.waitUntil(
    self.registration.showNotification(data.title || "CS Operations", {
      body:    data.body || "",
      icon:    "/icon-192.png",
      badge:   "/icon-192.png",
      tag:     data.tag || "cs-ops",
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data:    { url: data.url || "/" },
    })
  );
});

// ── Notification click: open/focus the app ────────────────────────────────────
self.addEventListener("notificationclick", event => {
  event.notification.close();
  if (event.action === "dismiss") return;
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      // If app already open, focus it
      for (const client of list) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
