import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: [
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/maskable-192.png',
    'icons/maskable-512.png',
  ],
  manifest: {
    name: 'My React PWA',
    short_name: 'ReactPWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#111827',
    description: 'Vite + React + TS Progressive Web App',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: 'icons/maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    navigateFallback: '/offline.html',
    runtimeCaching: [
      {
        urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 100,
          },
        },
      },
    ],
  },
  devOptions: {
    enabled: false,
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(pwaOptions)],
});
