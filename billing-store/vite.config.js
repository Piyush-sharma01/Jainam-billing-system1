import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['jainam-store-icon-192.png', 'jainam-store-icon-512.png', 'jainam-store-icon-maskable-512.png'],
      manifest: {
        id: '/',
        name: 'Jainam Auto Industries',
        short_name: 'Jainam Auto',
        description: 'Automotive pipes, hoses and fluid-transmission components from Jainam Auto Industries, Pune.',
        theme_color: '#223382',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'jainam-store-icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'jainam-store-icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'jainam-store-icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
      },
    }),
  ],
})
