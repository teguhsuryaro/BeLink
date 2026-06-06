# 01 - Struktur Folder src

## Tujuan
Membuat seluruh struktur folder di dalam `src/` sebelum mulai mengisi file-file.

---

## Langkah-Langkah

### 1. Hapus File Bawaan Vite yang Tidak Dipakai

**PERINTAH** — Jalankan di folder root proyek:

```powershell
# Hapus file bawaan Vite yang akan diganti
Remove-Item src/App.css -ErrorAction SilentlyContinue
Remove-Item src/assets/react.svg -ErrorAction SilentlyContinue
```

### 2. Buat Seluruh Folder

**PERINTAH** — Jalankan untuk membuat semua folder sekaligus:

```powershell
# Komponen UI
New-Item -ItemType Directory -Force -Path src/components/ui
New-Item -ItemType Directory -Force -Path src/components/layout
New-Item -ItemType Directory -Force -Path src/components/map
New-Item -ItemType Directory -Force -Path src/components/order
New-Item -ItemType Directory -Force -Path src/components/chat
New-Item -ItemType Directory -Force -Path src/components/mitra
New-Item -ItemType Directory -Force -Path src/components/admin

# Hooks
New-Item -ItemType Directory -Force -Path src/hooks

# Library / utilities
New-Item -ItemType Directory -Force -Path src/lib

# Pages
New-Item -ItemType Directory -Force -Path src/pages/public
New-Item -ItemType Directory -Force -Path src/pages/user
New-Item -ItemType Directory -Force -Path src/pages/mitra
New-Item -ItemType Directory -Force -Path src/pages/admin

# Stores (Zustand)
New-Item -ItemType Directory -Force -Path src/store

# TypeScript types
New-Item -ItemType Directory -Force -Path src/types

# Router
New-Item -ItemType Directory -Force -Path src/router

# Assets
New-Item -ItemType Directory -Force -Path src/assets/images

# Locales (i18n)
New-Item -ItemType Directory -Force -Path public/locales/id
New-Item -ItemType Directory -Force -Path public/locales/en
```

### 3. Verifikasi Struktur

**PERINTAH** — Cek hasilnya:

```powershell
# Tampilkan tree folder src
Get-ChildItem -Path src -Recurse -Directory | ForEach-Object { $_.FullName.Replace((Get-Location).Path + "\", "") }
```

Hasilnya harus menunjukkan:

```
src/assets
src/assets/images
src/components
src/components/admin
src/components/chat
src/components/layout
src/components/map
src/components/mitra
src/components/order
src/components/ui
src/hooks
src/lib
src/pages
src/pages/admin
src/pages/mitra
src/pages/public
src/pages/user
src/router
src/store
src/types
```

---

## Validasi

- [ ] File `src/App.css` sudah dihapus
- [ ] File `src/assets/react.svg` sudah dihapus
- [ ] Semua 19 folder di atas sudah ada
- [ ] Folder `public/locales/id` dan `public/locales/en` sudah ada

---

**Selesai? Lanjut ke `02-setup-supabase-client.md`**
