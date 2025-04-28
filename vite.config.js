import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js', 'lenis', 'tsparticles'],
        }
      }
    }
  },
  plugins: [
    compression({
      algorithm: 'brotliCompress',
      // Only compress files that are larger than 1024 bytes
      threshold: 1024,
      // Don't compress .br files
      exclude: [/\.(br)$/],
      // Delete the original files after compression
      deleteOriginalAssets: false,
    }),
  ]
});