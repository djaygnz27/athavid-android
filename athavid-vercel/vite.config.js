import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⛔ LOCKED — vite.config.js
// Controls bundle optimization for sachistream.com
// minify MUST stay 'terser' — was 'false' which caused huge unminified bundles
// Do NOT revert minify to false
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        passes: 2,
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/sachi2-[hash].js',
        chunkFileNames: 'assets/sachi2-chunk-[hash].js',
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
        }
      }
    }
  }
})
