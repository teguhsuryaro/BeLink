# 05 - Setup Environment Variables

## Tujuan
Membuat file environment variables untuk menyimpan konfigurasi Supabase dan aplikasi.

---

## Langkah-Langkah

### 1. Buat File `.env.local`

**BUAT FILE**: `.env.local`

```env
# ============================================
# BeLink — Environment Variables
# ============================================
# File ini TIDAK boleh di-commit ke GitHub!
# Pastikan .env.local ada di .gitignore

# Supabase
# Dapatkan dari: Supabase Dashboard → Project Settings → API
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# App
VITE_APP_NAME=BeLink
VITE_APP_ENV=development
```

### 2. Isi Dengan Nilai Supabase Yang Benar

Nilai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` akan diisi setelah membuat project Supabase di folder `03-setup-supabase/`. Untuk sementara, biarkan nilainya seperti placeholder di atas.

### 3. Pastikan `.env.local` Ada di `.gitignore`

Buka file `.gitignore` dan pastikan ada baris berikut:

```
.env.local
```

Ini sudah dilakukan di langkah sebelumnya, tapi periksa ulang untuk memastikan.

### 4. Buat Type Definition untuk Environment Variables

**BUAT FILE**: `src/env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_ENV: 'development' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

File ini memberikan autocomplete dan type-checking saat mengakses `import.meta.env.VITE_...` di mana saja dalam kode.

---

## Validasi

- [ ] File `.env.local` sudah ada di root proyek
- [ ] File `.env.local` **TIDAK** muncul saat menjalankan `git status`
- [ ] File `src/env.d.ts` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error

---

## Peringatan

- File `.env.local` berisi secret keys yang **TIDAK BOLEH** di-share secara publik
- Setiap developer yang meng-clone proyek harus membuat `.env.local` sendiri berdasarkan `.env.example`
- Semua environment variable yang diakses dari client-side **HARUS** diawali dengan `VITE_`

---

**Selesai? Lanjut ke folder `03-setup-supabase/` → file `01-buat-project-supabase.md`**
