// Completely remove previous PWA service worker
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  self.registration.unregister();
  return self.clients.claim();
});
