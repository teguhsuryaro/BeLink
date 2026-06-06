# 04 - Konfigurasi Vite

## Tujuan
Mengkonfigurasi Vite dengan path alias `@/` dan optimasi untuk development.

---

## Langkah-Langkah

### 1. Edit Vite Config

**EDIT FILE**: `vite.config.ts`

**Ganti seluruh isi file** dengan:

```typescript
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
      output: {
        // Pisahkan vendor chunks untuk caching yang lebih baik
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'data-vendor': ['@supabase/supabase-js', '@tanstack/react-query', 'zustand'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
});
```

### 2. Pastikan `vite-env.d.ts` Ada

File ini biasanya sudah dibuat oleh Vite. Jika ada, biarkan. Jika tidak ada:

**BUAT FILE**: `src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />
```

---

## Penjelasan

- `resolve.alias` — memungkinkan import `@/components/...` alih-alih `../../components/...`
- `server.open` — otomatis membuka browser saat development
- `manualChunks` — memecah bundle menjadi beberapa file terpisah agar browser bisa cache vendor libraries secara independen. Ini meningkatkan kecepatan loading setelah kunjungan pertama.

---

## Validasi

- [ ] File `vite.config.ts` berisi konfigurasi di atas
- [ ] Jalankan `npm run dev` — server berjalan di port 5173 dan browser terbuka otomatis
- [ ] Jalankan `npm run build` — build berhasil tanpa error

---

**Selesai? Lanjut ke `05-setup-environment-variables.md`**
