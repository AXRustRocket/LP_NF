import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    assetsInlineLimit: 4096, // 4kb - small assets are inlined
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js', 'lenis', 'tsparticles'],
          ui: ['lucide']
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name].[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js'
      }
    }
  },
  plugins: [
    // Optimize and compress images
    imagetools(),
    
    // Brotli compression for static assets
    compression({
      algorithm: 'brotliCompress',
      threshold: 1024, // Only compress files larger than 1024 bytes
      exclude: [/\.(br)$/],
      deleteOriginalAssets: false,
    }),
    
    // Gzip compression as fallback
    compression({
      algorithm: 'gzip',
      threshold: 1024,
      exclude: [/\.(gz)$/],
      deleteOriginalAssets: false,
    }),
    
    // PWA support for offline capability
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/icons/*.png', 'assets/logo.svg'],
      manifest: {
        name: 'Rust Rocket',
        short_name: 'RustRocket',
        description: 'Meme-Coin Sniper Bot with <80ms latency and advanced rug protection',
        theme_color: '#04070D',
        icons: [
          {
            src: '/assets/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    open: true,
    port: 3000
  }
});