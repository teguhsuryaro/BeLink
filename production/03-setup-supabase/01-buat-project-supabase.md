# 01 - Buat Project Supabase

## Tujuan
Membuat project baru di Supabase, mendapatkan URL dan API Key, lalu mengisi file `.env.local`.

---

## Langkah-Langkah

### 1. Buat Akun Supabase (Jika Belum)

1. Buka https://supabase.com
2. Klik **Start your project**
3. Sign up dengan **GitHub** (rekomendasi) atau Email
4. Akun gratis — tidak perlu kartu kredit

### 2. Buat Project Baru

1. Setelah login, klik **New Project**
2. Isi form:
   - **Organization**: Pilih organization yang sudah ada atau buat baru
   - **Name**: `belink`
   - **Database Password**: Buat password yang kuat, **simpan di tempat aman** (akan dibutuhkan nanti)
   - **Region**: Pilih yang paling dekat, misalnya `Southeast Asia (Singapore)`
   - **Pricing Plan**: Free (sudah default)
3. Klik **Create new project**
4. Tunggu 1-2 menit sampai project selesai dibuat

### 3. Ambil API Keys

1. Setelah project siap, pergi ke **Project Settings** (ikon gear di sidebar kiri bawah)
2. Klik **API** di menu kiri
3. Kamu akan melihat:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon public key**: string panjang yang dimulai dengan `eyJ...`
4. **Salin kedua nilai tersebut**

### 4. Isi `.env.local`

**EDIT FILE**: `.env.local`

Ganti placeholder dengan nilai yang disalin:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...PANJANG_SEKALI

# App
VITE_APP_NAME=BeLink
VITE_APP_ENV=development
```

### 5. Matikan Email Confirmation

Karena ini prototype, kita tidak perlu verifikasi email saat register:

1. Di Supabase Dashboard, pergi ke **Authentication** (sidebar kiri)
2. Klik **Providers** di sub-menu
3. Klik **Email** provider
4. **Matikan** toggle **Confirm email** (set ke OFF)
5. Pastikan **Enable Email provider** tetap ON
6. Klik **Save**

### 6. Aktifkan Sign Up

1. Masih di halaman **Authentication**
2. Klik **Settings** (atau **Auth Settings**)
3. Pastikan **Allow new users to sign up** aktif (ON)

---

## Validasi

- [ ] Project Supabase sudah aktif dan bisa diakses di dashboard
- [ ] File `.env.local` sudah berisi URL dan anon key yang valid (bukan placeholder)
- [ ] Email Confirmation sudah dimatikan
- [ ] Sign Up sudah diaktifkan

---

## Catatan

- **Project URL** dan **anon key** bersifat publik (aman di client-side). Yang **TIDAK boleh** di-expose adalah **service_role key** — jangan pernah memasukkannya ke kode frontend.
- Supabase Free Tier mencakup:
  - 500MB database
  - 1GB file storage
  - 50MB edge functions
  - 2GB bandwidth
  - 50.000 monthly active users

---

**Selesai? Lanjut ke `02-buat-tabel-database.md`**
