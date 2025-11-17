import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicons.ico/favicon.ico',
        'favicons.ico/apple-icon.png',
        'favicons.ico/apple-icon-57x57.png',
        'favicons.ico/apple-icon-60x60.png',
        'favicons.ico/apple-icon-72x72.png',
        'favicons.ico/apple-icon-76x76.png',
        'favicons.ico/apple-icon-114x114.png',
        'favicons.ico/apple-icon-120x120.png',
        'favicons.ico/apple-icon-144x144.png',
        'favicons.ico/apple-icon-152x152.png',
        'favicons.ico/apple-icon-180x180.png',
        'favicons.ico/android-icon-36x36.png',
        'favicons.ico/android-icon-48x48.png',
        'favicons.ico/android-icon-72x72.png',
        'favicons.ico/android-icon-96x96.png',
        'favicons.ico/android-icon-144x144.png',
        'favicons.ico/android-icon-192x192.png',
        'favicons.ico/ms-icon-70x70.png',
        'favicons.ico/ms-icon-144x144.png',
        'favicons.ico/ms-icon-150x150.png',
        'favicons.ico/ms-icon-310x310.png',
        'favicons.ico/favicon-16x16.png',
        'favicons.ico/favicon-32x32.png',
        'favicons.ico/favicon-96x96.png',
        'favicons.ico/browserconfig.xml',
        'favicons.ico/manifest.json'
      ],
      manifest: {
        name: 'Canvas',
        short_name: 'Canvas',
        description: 'An interactive web map application for visualizing geographical data.',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        scope: '/',
        icons: [
          {
            src: '/favicons.ico/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/favicons.ico/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: process.env.VITE_BASE_PATH || '/'
})
