# 08 - Setup Query Client

## Tujuan
Mengkonfigurasi TanStack Query client dan menyiapkan App.tsx dan main.tsx sebagai entry point.

---

## Langkah-Langkah

### 1. Buat Query Client

**BUAT FILE**: `src/lib/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data dianggap "fresh" selama 30 detik
      staleTime: 30 * 1000,
      // Cache disimpan selama 5 menit
      gcTime: 5 * 60 * 1000,
      // Retry 1 kali jika gagal
      retry: 1,
      // Refetch saat window kembali fokus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry 0 kali untuk mutations
      retry: 0,
    },
  },
});
```

### 2. Edit `main.tsx`

**EDIT FILE**: `src/main.tsx`

**Ganti seluruh isi file** dengan:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './lib/i18n'; // Inisialisasi i18n

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Hapus class preload setelah initial render (mencegah flash transisi)
window.addEventListener('load', () => {
  document.body.classList.remove('preload');
});
```

### 3. Edit `App.tsx`

**EDIT FILE**: `src/App.tsx`

**Ganti seluruh isi file** dengan:

```typescript
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import AppRouter from '@/router';

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Inisialisasi tema dari localStorage
    initializeTheme();
    // Inisialisasi auth (cek session aktif)
    initialize();
  }, [initializeTheme, initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Router akan dibuat di folder 06-layout-dan-navigasi */}
        <AppRouter />

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            },
          }}
          richColors
          closeButton
        />
      </BrowserRouter>

      {/* DevTools hanya muncul di development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

### 4. Buat Placeholder Router

Karena file `src/router/index.tsx` belum ada (akan dibuat di folder `06`), buat placeholder dulu agar `App.tsx` tidak error:

**BUAT FILE**: `src/router/index.tsx`

```typescript
import { Routes, Route } from 'react-router-dom';

/**
 * Placeholder router — akan diisi lengkap di folder 06-layout-dan-navigasi
 */
export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary">BeLink</h1>
              <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
                Setup berhasil! Router akan diisi di langkah berikutnya.
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
```

### 5. Edit `index.html`

**EDIT FILE**: `index.html` (di root proyek)

**Ganti seluruh isi file** dengan:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- SEO -->
    <title>BeLink — Bantuan Mekanik Terdekat</title>
    <meta name="description" content="Platform layanan darurat kendaraan berbasis GPS. Hubungkan dirimu dengan mekanik terdekat dalam hitungan menit." />
    <meta name="theme-color" content="#3661E2" />

    <!-- Open Graph -->
    <meta property="og:title" content="BeLink — Bantuan Mekanik Terdekat" />
    <meta property="og:description" content="Platform layanan darurat kendaraan berbasis GPS." />
    <meta property="og:type" content="website" />

    <!-- PWA / Mobile -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="mobile-web-app-capable" content="yes" />
  </head>
  <body class="preload">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Validasi

- [ ] File `src/lib/queryClient.ts` sudah ada
- [ ] File `src/main.tsx` sudah diedit
- [ ] File `src/App.tsx` sudah diedit
- [ ] File `src/router/index.tsx` sudah ada (placeholder)
- [ ] File `index.html` sudah diedit
- [ ] Jalankan `npm run dev`:
  - Halaman terbuka di browser
  - Menampilkan teks "BeLink" dan "Setup berhasil!"
  - Background warna `#F8F9FF` (biru sangat muda)
  - Font Plus Jakarta Sans diterapkan
  - Tidak ada error di console browser

---

## Catatan

- Class `preload` pada `<body>` mencegah animasi transisi warna saat pertama kali load. Ini dihapus oleh JavaScript setelah halaman selesai dimuat.
- `viewport-fit=cover` penting untuk dukungan notch/dynamic island pada iPhone.
- Router placeholder akan diganti dengan versi lengkap di folder `06-layout-dan-navigasi`.

---

**Selesai? Lanjut ke folder `05-komponen-ui-dasar/` → file `01-komponen-button.md`**
