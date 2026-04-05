import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/sachi-${Date.now()}.js`,
        chunkFileNames: 'assets/sachi-chunk-[hash].js',
      }
    }
  }
})
