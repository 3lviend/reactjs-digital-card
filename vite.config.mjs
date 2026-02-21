import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(), 
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Enable parsing PWA in dev mode
        type: 'module',
        navigateFallback: 'index.html'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
        ignoreURLParametersMatching: [/^v/], // avoid busting cache on random hash
        navigateFallback: '/index.html'
      },
      manifest: {
        name: 'My Digital Card',
        short_name: 'DigitalCard',
        description: 'Your interactive digital business card.',
        theme_color: '#000000',
        icons: [
          {
            src: '/assets/favicon/favicon-96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['@journeyapps/wa-sqlite', '@powersync/web']
  },
  worker: {
    format: 'es'
  },
  server: {
    host: true
  },
  preview: {
    host: true
  }
});
