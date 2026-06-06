# Fase 03: Konfigurasi Environment Variables

Aplikasi React (Frontend) ini harus tahu ke alamat *database* mana dia harus berkomunikasi. Oleh karena itu, kamu harus menyambungkannya dengan proyek Supabase milikmu yang baru saja dibuat.

## 1. Dapatkan API Key Supabase
1. Di Dashboard Supabase milikmu, buka menu **Project Settings** (ikon roda gigi) di pojok kiri bawah.
2. Pilih tab **API**.
3. Temukan kotak berisikan **Project URL** dan kotak berisikan **anon `public` key**.

## 2. Buat File `.env.local`
1. Buka folder kode proyek (misal: `belink`) di VS Code atau editor kodemu.
2. Di barisan *file* terluar, temukan file bernama `.env.example`.
3. Salin (copy-paste) file tersebut di lokasi yang sama dan ubah namanya menjadi `.env.local` (titik env titik local).
4. Buka file `.env.local` yang baru dibuat, dan ganti nilainya dengan *URL* serta *Key* milikmu:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIU... (key panjang milikmu)
VITE_APP_NAME=BeLink
VITE_APP_ENV=development
```

Simpan file tersebut (`Ctrl+S` / `Cmd+S`). 

> **Catatan:** File `.env.local` sudah masuk ke daftar rahasia (`.gitignore`), sehingga API Key milikmu tidak akan bocor ketika nanti kodenya kamu unggah ke GitHub pribadimu.

Sekarang kodemu sudah sepenuhnya tersambung dengan *database* milikmu secara mandiri! Lanjutkan ke panduan **04-menjalankan-dan-deploy.md**.
