# 03 - Setup Git dan GitHub

## Tujuan
Menginisialisasi Git, membuat file `.gitignore` yang lengkap, dan menghubungkan proyek ke repository GitHub.

---

## Langkah-Langkah

### 1. Inisialisasi Git

**PERINTAH** — Jalankan di folder root proyek:

```bash
git init
```

### 2. Buat File `.gitignore`

**BUAT FILE**: `.gitignore`

Ganti seluruh isi file `.gitignore` (jika sudah ada dari Vite) dengan konten berikut:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build output
dist/
build/

# Environment variables (PENTING: jangan pernah commit file ini)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE / Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# TypeScript cache
*.tsbuildinfo

# Tailwind
.tailwindcss/

# Vercel
.vercel

# Production planning docs (tidak perlu di-deploy)
production/
```

### 3. Buat File `.env.example`

**BUAT FILE**: `.env.example`

```env
# Supabase Configuration
# Dapatkan dari: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# App Configuration
VITE_APP_NAME=BeLink
VITE_APP_ENV=development
```

### 4. Buat File `vercel.json`

**BUAT FILE**: `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

File ini memastikan semua route di-redirect ke `index.html` untuk SPA routing.

### 5. Buat Repository di GitHub

1. Buka https://github.com/new
2. Isi nama repository: `belink` (atau sesuai preferensi)
3. Biarkan visibility sebagai **Public** (gratis) atau **Private** (juga gratis)
4. **JANGAN** centang "Add a README file" — kita sudah punya file lokal
5. Klik **Create repository**
6. Salin URL repository (contoh: `https://github.com/USERNAME/belink.git`)

### 6. Hubungkan Lokal ke GitHub

**PERINTAH** — Jalankan perintah berikut satu per satu (ganti URL dengan URL repository kamu):

```bash
git add .
git commit -m "feat: initial project setup - Vite + React + TypeScript"
git branch -M main
git remote add origin https://github.com/USERNAME/belink.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub kamu.

---

## Validasi

- [ ] Folder `.git/` sudah ada di root proyek
- [ ] File `.gitignore` sudah ada dan berisi daftar yang disebutkan di atas
- [ ] File `.env.example` sudah ada
- [ ] File `vercel.json` sudah ada
- [ ] `git status` menunjukkan working tree clean (tidak ada perubahan yang belum di-commit)
- [ ] `git remote -v` menunjukkan URL repository GitHub
- [ ] Cek di GitHub: repository sudah berisi file-file proyek

---

## Peringatan

- **JANGAN PERNAH** commit file `.env.local` ke GitHub. File ini berisi secret keys.
- Pastikan `.env.local` sudah ada di `.gitignore` sebelum membuat file `.env.local` nanti.

---

**Selesai? Lanjut ke folder `02-konfigurasi-proyek/` → file `01-konfigurasi-tailwind.md`**
