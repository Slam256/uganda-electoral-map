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
        start_url: '/',
        orientation: 'portrait',
        prefer_related_applications: false,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        scope: '/',
  icons: [
          {
            src: '/favicons.ico/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png',
            density: '0.75'
          },
          {
            src: '/favicons.ico/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
            density: '1.0'
          },
          {
            src: '/favicons.ico/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            density: '1.5'
          },
          {
            src: '/favicons.ico/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            density: '2.0'
          },
          {
            src: '/favicons.ico/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            density: '3.0'
          },
          {
            src: '/favicons.ico/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
             density: '4.0'
            }
          ],
        screenshots: [
          {
            src: '/src/assets/candidate photos/localhost_4173_(iPhone 14 Pro Max).png',
            sizes: '1290x2796',
            type: 'image/png',
            label: 'localhost_4173 iPhone 14 Pro Max',
            form_factor: 'narrow'
          },
          {
            src: '/src/assets/candidate photos/localhost_4173_(iPhone 14 Pro Max).png',
            sizes: '1290x2796',
            type: 'image/png',
            label: 'localhost_4173 iPhone 14 Pro Max (web)',
            form_factor: 'wide'
          },
          {
            src: '/src/assets/candidate photos/localhost_417_(iPhone 14 Pro Max).png',
            sizes: '1290x2796',
            type: 'image/png',
            label: 'localhost_417 iPhone 14 Pro Max',
            form_factor: 'narrow'
          },
          {
            src: '/src/assets/candidate photos/localhost_417_(iPhone 14 Pro Max).png',
            sizes: '1290x2796',
            type: 'image/png',
            label: 'localhost_417 iPhone 14 Pro Max (web)',
            form_factor: 'wide'
          },
          {
            src: '/src/assets/candidate photos/localhst_4173_(iPhone 14 Pro Max).png',
            sizes: '1290x2796',
            type: 'image/png',
            label: 'localhst_4173 iPhone 14 Pro Max',
            form_factor: 'narrow'
          },
          {
            src: '/src/assets/candidate photos/localhst_4173_(iPhone 14 Pro Max).png',
            sizes: '1290x2796',
            type: 'image/png',
            label: 'localhst_4173 iPhone 14 Pro Max (web)',
            form_factor: 'wide'
          },
          {
            src: '/src/assets/candidate photos/lolhost_4173_(iPhone 14 Pro Max).png',
            sizes: '1290x2796',
            type: 'image/png',
            label: 'lolhost_4173 iPhone 14 Pro Max',
            form_factor: 'narrow'
          },
          {
            src: '/src/assets/candidate photos/lolhost_4173_(iPhone 14 Pro Max).png',
            sizes: '1290x2796',
            type: 'image/png',
            label: 'lolhost_4173 iPhone 14 Pro Max (web)',
            form_factor: 'wide'
          }
        ],
      }
    })
  ],
  base: process.env.VITE_BASE_PATH || '/'
})
