# 01 - Seed Akun Test

## Tujuan
Membuat akun-akun test di Supabase untuk keperluan testing semua fitur.

---

## Langkah-Langkah

### 1. Buat Akun Test via Supabase Dashboard

Buka Supabase Dashboard → **Authentication** → **Add user** → **Create new user**

Buat 4 akun berikut:

| Email | Password | Nama | Role |
|---|---|---|---|
| `user@belink.test` | `test123` | Budi Santoso | user |
| `mitra1@belink.test` | `test123` | Ahmad Mekanik | mitra_independen |
| `mitra2@belink.test` | `test123` | Bengkel Jaya Motor | mitra_bengkel |
| `admin@belink.test` | `test123` | Admin BeLink | superadmin |

### 2. Update Role di Profiles

Setelah keempat akun terbuat, trigger `handle_new_user` sudah otomatis membuat row di `profiles`. Tapi role-nya masih `user` semua. Update manual:

**Buka SQL Editor** → Jalankan:

```sql
-- Update role mitra1
UPDATE profiles SET role = 'mitra_independen'
WHERE email = 'mitra1@belink.test';

-- Update role mitra2
UPDATE profiles SET role = 'mitra_bengkel'
WHERE email = 'mitra2@belink.test';

-- Update role admin
UPDATE profiles SET role = 'superadmin'
WHERE email = 'admin@belink.test';

-- Update nama jika belum sesuai
UPDATE profiles SET full_name = 'Budi Santoso' WHERE email = 'user@belink.test';
UPDATE profiles SET full_name = 'Ahmad Mekanik' WHERE email = 'mitra1@belink.test';
UPDATE profiles SET full_name = 'Bengkel Jaya Motor' WHERE email = 'mitra2@belink.test';
UPDATE profiles SET full_name = 'Admin BeLink' WHERE email = 'admin@belink.test';
```

### 3. Buat Mitra Profiles untuk Akun Mitra

```sql
-- Mitra 1: Ahmad Mekanik (Independen, di daerah Jakarta Selatan)
INSERT INTO mitra_profiles (id, business_name, bio, lat, lng, address, deposit_balance, verification_status, is_accepting_orders, specializations)
SELECT
  id,
  'Bengkel Ahmad',
  'Mekanik berpengalaman 5 tahun, spesialis motor matic dan manual',
  -6.2615,
  106.8106,
  'Jl. Fatmawati Raya No. 15, Jakarta Selatan',
  50000.00,
  'verified',
  true,
  ARRAY['motor', 'ban', 'mesin', 'kelistrikan']
FROM profiles WHERE email = 'mitra1@belink.test';

-- Set online
UPDATE profiles SET is_online = true WHERE email = 'mitra1@belink.test';

-- Mitra 2: Bengkel Jaya Motor (di daerah Jakarta Timur)
INSERT INTO mitra_profiles (id, business_name, bio, lat, lng, address, deposit_balance, verification_status, is_accepting_orders, specializations)
SELECT
  id,
  'Bengkel Jaya Motor',
  'Bengkel resmi, melayani motor dan mobil. Buka 24 jam.',
  -6.2254,
  106.9004,
  'Jl. Raya Kalimalang No. 88, Jakarta Timur',
  100000.00,
  'verified',
  true,
  ARRAY['motor', 'mobil', 'ban', 'mesin', 'aki', 'rem']
FROM profiles WHERE email = 'mitra2@belink.test';

-- Set online
UPDATE profiles SET is_online = true WHERE email = 'mitra2@belink.test';
```

---

## Validasi

- [ ] Login sebagai `user@belink.test` → masuk ke Home user
- [ ] Login sebagai `mitra1@belink.test` → bisa akses Dashboard Mitra (verified)
- [ ] Login sebagai `mitra2@belink.test` → bisa akses Dashboard Mitra (verified)
- [ ] Login sebagai `admin@belink.test` → bisa akses Admin Dashboard
- [ ] Di dashboard admin, terlihat 4 user dan 2 mitra

---

## Daftar Akun Test

Simpan daftar ini untuk referensi:

| Akun | Email | Password | Role |
|---|---|---|---|
| User biasa | `user@belink.test` | `test123` | user |
| Mitra 1 | `mitra1@belink.test` | `test123` | mitra_independen |
| Mitra 2 | `mitra2@belink.test` | `test123` | mitra_bengkel |
| Admin | `admin@belink.test` | `test123` | superadmin |

---

**Selesai? Lanjut ke `02-seed-data-transaksi.md`**
