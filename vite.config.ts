import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const vitePWA = VitePWA({
	registerType: 'autoUpdate',
	outDir: 'dist',
	manifest: {
		name: 'Timers App',
		short_name: 'Timers',
		description: 'Timer application for UpStream offline game',
		theme_color: '#181818',
		background_color: '#181818',
		icons: [
			{
				src: 'assets/images/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			}, {
				src: 'assets/images/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		]
	}
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
	vue(),
	vitePWA,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
