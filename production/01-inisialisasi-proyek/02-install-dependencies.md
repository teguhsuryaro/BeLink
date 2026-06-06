# 02 - Install Semua Dependencies

## Tujuan
Menginstall seluruh library yang dibutuhkan proyek BeLink. Dibagi menjadi 2 kategori: production dependencies dan dev dependencies.

---

## Langkah-Langkah

### 1. Install Production Dependencies

**PERINTAH** — Jalankan di folder root proyek (`e:\CODING\BELINK`):

```bash
npm install react-router-dom @supabase/supabase-js zustand @tanstack/react-query @tanstack/react-query-devtools react-hook-form zod @hookform/resolvers framer-motion leaflet react-leaflet @types/leaflet lucide-react i18next react-i18next i18next-browser-languagedetector date-fns sonner @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-avatar @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-progress @radix-ui/react-separator @radix-ui/react-slot clsx tailwind-merge class-variance-authority
```

Penjelasan singkat setiap dependency:

| Package | Fungsi |
|---|---|
| `react-router-dom` | Routing halaman (client-side) |
| `@supabase/supabase-js` | Koneksi ke database Supabase |
| `zustand` | State management global (ringan) |
| `@tanstack/react-query` | Fetch data, caching, loading states |
| `@tanstack/react-query-devtools` | DevTools untuk debug query (hanya dev) |
| `react-hook-form` | Pengelolaan form performant |
| `zod` | Validasi data / schema |
| `@hookform/resolvers` | Jembatan antara react-hook-form dan zod |
| `framer-motion` | Animasi halus (page transition, hover, dll) |
| `leaflet` | Library peta interaktif |
| `react-leaflet` | Wrapper React untuk Leaflet |
| `@types/leaflet` | TypeScript types untuk Leaflet |
| `lucide-react` | Icon library (modern, konsisten) |
| `i18next` | Framework internasionalisasi |
| `react-i18next` | Binding i18next untuk React |
| `i18next-browser-languagedetector` | Deteksi bahasa browser otomatis |
| `date-fns` | Utilitas tanggal/waktu (ringan) |
| `sonner` | Toast notification (elegan) |
| `@radix-ui/react-*` | Komponen UI headless (accessible) |
| `clsx` | Menggabungkan className secara kondisional |
| `tailwind-merge` | Merge Tailwind classes tanpa konflik |
| `class-variance-authority` | Membuat variant komponen UI |

### 2. Install Dev Dependencies

**PERINTAH** — Jalankan:

```bash
npm install -D tailwindcss@3 autoprefixer postcss prettier prettier-plugin-tailwindcss eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks eslint-plugin-react-refresh
```

Penjelasan:

| Package | Fungsi |
|---|---|
| `tailwindcss@3` | CSS framework utility-first (versi 3) |
| `autoprefixer` | Tambah vendor prefix CSS otomatis |
| `postcss` | Transformer CSS (dibutuhkan Tailwind) |
| `prettier` | Code formatter |
| `prettier-plugin-tailwindcss` | Urutkan class Tailwind otomatis |
| `eslint` | Linter JavaScript/TypeScript |
| `@typescript-eslint/*` | Plugin ESLint untuk TypeScript |
| `eslint-plugin-react-hooks` | Aturan lint untuk React Hooks |
| `eslint-plugin-react-refresh` | Aturan lint untuk Vite HMR |

### 3. Inisialisasi Tailwind CSS

**PERINTAH** — Jalankan:

```bash
npx tailwindcss init -p
```

Ini akan membuat 2 file:
- `tailwind.config.js` — konfigurasi Tailwind (akan diedit nanti)
- `postcss.config.js` — konfigurasi PostCSS

---

## Validasi

Pastikan semua kondisi berikut terpenuhi:

- [ ] Tidak ada error saat menjalankan kedua perintah `npm install`
- [ ] File `package.json` berisi semua dependency yang disebutkan di atas (buka dan cek bagian `"dependencies"` dan `"devDependencies"`)
- [ ] File `tailwind.config.js` sudah ada di root proyek
- [ ] File `postcss.config.js` sudah ada di root proyek
- [ ] Jalankan `npm run dev` dan pastikan tidak ada error

---

## Peringatan

- Jangan mengubah versi package secara manual di `package.json`
- Jika ada warning saat install, itu normal. Yang penting tidak ada **error**
- Jika ada error `ERESOLVE`, coba jalankan dengan flag `--legacy-peer-deps`:
  ```bash
  npm install --legacy-peer-deps
  ```

---

**Selesai? Lanjut ke `03-setup-git-dan-github.md`**
