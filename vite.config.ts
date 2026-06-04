// @ts-nocheck
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path alias agar bisa import dengan @/
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Server development
  server: {
    port: 5173,
    open: true, // Auto-buka browser saat npm run dev
  },

  // Build optimization
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // @ts-ignore
      output: {
        // Pisahkan vendor chunks untuk caching yang lebih baik
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('@supabase') || id.includes('@tanstack') || id.includes('zustand')) {
              return 'data-vendor';
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'map-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
