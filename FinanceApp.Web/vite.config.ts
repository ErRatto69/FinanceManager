import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-icon.svg'],
      manifest: {
        name: 'Finance Manager',
        short_name: 'Finance',
        description: 'Personal Finance & Collaborative Grocery Manager',
        theme_color: '#10b981',
        background_color: '#090d16',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/pwa-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://finance.home-ratti.duckdns.org/',
        changeOrigin: true,
        secure: false,
      },
      '/hubs': {
        target: 'https://finance.home-ratti.duckdns.org/',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});