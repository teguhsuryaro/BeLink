# 01 - Buat Proyek Vite + React + TypeScript

## Tujuan
Membuat proyek React baru menggunakan Vite sebagai bundler dengan template TypeScript.

---

## Prasyarat

Pastikan sudah terinstall di komputer:
- **Node.js** versi 18 atau lebih baru (cek: `node -v`)
- **npm** versi 9 atau lebih baru (cek: `npm -v`)

Jika belum, download dan install dari: https://nodejs.org/

---

## Langkah-Langkah

### 1. Buka Terminal

Buka terminal (PowerShell / CMD / Terminal) dan arahkan ke folder proyek:

```bash
cd e:\CODING\BELINK
```

### 2. Buat Proyek Vite

**PERINTAH** — Jalankan perintah berikut:

```bash
npm create vite@latest . -- --template react-ts
```

Penjelasan:
- `npm create vite@latest` = menggunakan Vite terbaru
- `.` = buat di folder saat ini (BELINK)
- `--template react-ts` = template React dengan TypeScript

Jika muncul pertanyaan apakah ingin menimpa file yang sudah ada, pilih **Yes** / ketik **y**.

### 3. Install Dependencies Bawaan

**PERINTAH** — Setelah proyek dibuat, jalankan:

```bash
npm install
```

### 4. Coba Jalankan

**PERINTAH** — Pastikan proyek bisa berjalan:

```bash
npm run dev
```

Buka browser dan akses `http://localhost:5173`. Kamu harus melihat halaman default Vite + React.

Tekan `Ctrl + C` di terminal untuk menghentikan dev server setelah berhasil.

---

## Validasi

Pastikan semua kondisi berikut terpenuhi sebelum lanjut:

- [ ] Folder `node_modules/` sudah ada
- [ ] File `package.json` sudah ada dan berisi `"react"` dan `"react-dom"`
- [ ] File `vite.config.ts` sudah ada
- [ ] File `tsconfig.json` sudah ada
- [ ] Folder `src/` sudah ada dengan file `App.tsx` dan `main.tsx`
- [ ] `npm run dev` berhasil dan halaman terbuka di browser tanpa error

---

## Catatan

- Jangan hapus file apapun yang dihasilkan oleh Vite. Beberapa file akan diedit di langkah selanjutnya.
- File seperti `src/App.css`, `src/index.css`, dan `src/assets/react.svg` akan diganti nanti.

---

**Selesai? Lanjut ke `02-install-dependencies.md`**
