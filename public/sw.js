self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', async () => {
  // ❌ 기존 서비스 워커 제거
  await self.registration.unregister();

  // ❗️모든 탭 새로고침(중요)
  const clients = await self.clients.matchAll();
  clients.forEach((client) => client.navigate(client.url));
});
