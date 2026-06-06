# 05 - Protected Route dan Redirect Logic

## Tujuan
Memverifikasi bahwa routing protection dan redirect sudah berfungsi.

---

## Yang Sudah Dibuat

File `ProtectedRoute.tsx` dan `PublicRoute.tsx` sudah dibuat di folder `06-layout-dan-navigasi/06-setup-routing.md`. Langkah ini hanya memverifikasi bahwa semuanya bekerja.

---

## Test Skenario

### 1. User Belum Login
- Buka `/home` → harus redirect ke `/login`
- Buka `/mitra/dashboard` → harus redirect ke `/login`
- Buka `/admin/dashboard` → harus redirect ke `/login`
- Buka `/` (landing) → harus bisa diakses (guest mode)

### 2. User Sudah Login (role: user)
- Buka `/login` → harus redirect ke `/home` (PublicRoute)
- Buka `/register` → harus redirect ke `/home`
- Buka `/home` → bisa diakses, layout dengan navigasi muncul
- Buka `/mitra/dashboard` → redirect ke `/home` (role tidak sesuai)
- Buka `/admin/dashboard` → redirect ke `/home` (role tidak sesuai)

### 3. User Sudah Login (role: mitra_independen)
- Buka `/mitra/dashboard` → bisa diakses
- Buka `/admin/dashboard` → redirect ke `/home`

### 4. User Sudah Login (role: superadmin)
- Buka `/mitra/dashboard` → bisa diakses
- Buka `/admin/dashboard` → bisa diakses

---

## Validasi

- [ ] Semua skenario di atas berhasil
- [ ] Loading spinner muncul saat session sedang dicek
- [ ] Tidak ada flash (halaman muncul sebentar sebelum redirect)

---

## Catatan

Untuk menguji role yang berbeda, kamu perlu membuat akun baru dan mengubah role-nya langsung di Supabase:

1. Buka Supabase Dashboard → Table Editor → `profiles`
2. Temukan user yang baru didaftarkan
3. Edit kolom `role` menjadi `mitra_independen`, `mitra_bengkel`, atau `superadmin`
4. Refresh halaman di browser

Atau gunakan akun seed yang akan dibuat di folder `12-data-dummy/`.

---

**Selesai? Lanjut ke folder `08-fitur-user-pemesanan/` → file `01-home-page-user.md`**
