# 03 - Setup Design System CSS

## Tujuan
File `src/index.css` sudah dibuat di langkah konfigurasi Tailwind (folder `02`). Langkah ini menambahkan CSS tambahan khusus untuk Leaflet map.

---

## Langkah-Langkah

### 1. Pastikan Leaflet CSS Diimpor

Leaflet membutuhkan CSS bawaan untuk rendering peta yang benar. Kita akan mengimpornya di `main.tsx` nanti, tapi perlu memastikan file CSS Leaflet tersedia.

**EDIT FILE**: `src/index.css`

Tambahkan baris berikut **di paling atas file** (sebelum import Google Fonts):

```css
/* Leaflet CSS — diperlukan untuk rendering peta */
@import 'leaflet/dist/leaflet.css';
```

Jadi baris pertama di `src/index.css` menjadi:

```css
/* Leaflet CSS — diperlukan untuk rendering peta */
@import 'leaflet/dist/leaflet.css';

/* ============================================
   BeLink — Base Styles
   ============================================ */
/* ... sisa file tetap sama ... */
```

### 2. Pastikan File index.css Sudah Lengkap

Verifikasi bahwa `src/index.css` berisi (minimal) bagian-bagian ini secara berurutan:

1. Import Leaflet CSS
2. Import Google Fonts (Plus Jakarta Sans)
3. `@tailwind base;`
4. `@tailwind components;`
5. `@tailwind utilities;`
6. `@layer base { ... }` — reset, dark mode, scrollbar
7. `@layer components { ... }` — card, gradient, skeleton, badge
8. `@layer utilities { ... }` — glass, safe area, hover lift
9. Leaflet map overrides

Jika semua sudah ada dari langkah sebelumnya (folder `02-konfigurasi-proyek/01-konfigurasi-tailwind.md`), maka yang perlu ditambahkan hanyalah import Leaflet CSS di baris pertama.

---

## Validasi

- [ ] Baris pertama `src/index.css` adalah `@import 'leaflet/dist/leaflet.css';`
- [ ] Jalankan `npm run dev` — tidak ada error CSS

---

**Selesai? Lanjut ke `04-setup-i18n.md`**
