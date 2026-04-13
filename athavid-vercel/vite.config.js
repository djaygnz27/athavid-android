import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/sachi2-[hash].js',
        chunkFileNames: 'assets/sachi2-chunk-[hash].js',
      }
    }
  }
})
