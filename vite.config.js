import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      // アイコン類は下の globPatterns でまとめて precache する
      includeManifestIcons: false,
      manifest: {
        name: 'Focus',
        short_name: 'Focus',
        description: '「とりあえず5分」から始める作業タイマー',
        lang: 'ja',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f4f3ef',
        theme_color: '#f4f3ef',
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        globIgnores: ['og.png'],
        navigateFallback: '/index.html',
        // Firebase Hosting の予約 URL（/__/firebase/init.json など）は横取りしない
        navigateFallbackDenylist: [/^\/__\//],
        importScripts: ['/sw-notification.js'],
      },
    }),
  ],
  test: {
    include: ['tests/**/*.test.js'],
  },
})
