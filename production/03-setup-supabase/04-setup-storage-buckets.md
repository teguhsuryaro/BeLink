# 04 - Setup Storage Buckets

## Tujuan
Membuat storage buckets di Supabase untuk menyimpan foto profil, foto kendaraan, dan foto kerusakan.

---

## Langkah-Langkah

### 1. Buka SQL Editor

Di Supabase Dashboard → **SQL Editor** → **New query**.

### 2. Jalankan SQL — Buat Buckets dan Policies

```sql
-- ============================================
-- BeLink — Storage Buckets
-- ============================================

-- 1. BUCKET: avatars (foto profil user & mitra)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,  -- 2MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- 2. BUCKET: vehicles (foto kendaraan)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicles',
  'vehicles',
  true,
  5242880,  -- 5MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- 3. BUCKET: damages (foto kerusakan)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'damages',
  'damages',
  true,
  5242880,  -- 5MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- 4. BUCKET: documents (KTP, selfie verifikasi mitra)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,  -- PRIVATE — hanya owner dan admin yang bisa akses
  5242880,  -- 5MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- === AVATARS ===
-- Siapa saja bisa melihat avatar (public)
CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- User terautentikasi bisa upload avatar ke folder miliknya
CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- User bisa update avatar miliknya
CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- User bisa hapus avatar miliknya
CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- === VEHICLES ===
-- Siapa saja bisa melihat foto kendaraan (public)
CREATE POLICY "vehicles_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicles');

-- User terautentikasi bisa upload foto kendaraan
CREATE POLICY "vehicles_insert_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicles'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- User bisa hapus foto kendaraan miliknya
CREATE POLICY "vehicles_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vehicles'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- === DAMAGES ===
-- Siapa saja bisa melihat foto kerusakan (public)
CREATE POLICY "damages_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'damages');

-- User terautentikasi bisa upload foto kerusakan
CREATE POLICY "damages_insert_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'damages'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- User bisa hapus foto kerusakan miliknya
CREATE POLICY "damages_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'damages'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- === DOCUMENTS (Private) ===
-- Owner bisa melihat dokumen miliknya
CREATE POLICY "documents_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Superadmin bisa melihat semua dokumen (untuk verifikasi mitra)
CREATE POLICY "documents_select_admin"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- User terautentikasi bisa upload dokumen ke folder miliknya
CREATE POLICY "documents_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- User bisa hapus dokumen miliknya
CREATE POLICY "documents_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );
```

### 3. Verifikasi Buckets

1. Di sidebar kiri, klik **Storage**
2. Kamu harus melihat 4 buckets:
   - `avatars` (public)
   - `vehicles` (public)
   - `damages` (public)
   - `documents` (private)

---

## Cara Penggunaan Storage (Referensi)

Saat nanti mengupload file dari frontend, path-nya mengikuti pola:

```
{bucket_name}/{user_id}/{filename}
```

Contoh:
```
avatars/550e8400-e29b-41d4-a716-446655440000/profile.jpg
vehicles/550e8400-e29b-41d4-a716-446655440000/honda-beat.jpg
damages/550e8400-e29b-41d4-a716-446655440000/ban-pecah.jpg
documents/550e8400-e29b-41d4-a716-446655440000/ktp.jpg
```

URL publik untuk bucket public:
```
https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/avatars/{user_id}/profile.jpg
```

---

## Validasi

- [ ] SQL berhasil dijalankan tanpa error
- [ ] 4 buckets terlihat di halaman Storage
- [ ] `avatars`, `vehicles`, `damages` bertanda **Public**
- [ ] `documents` bertanda **Private**

---

**Selesai? Lanjut ke `05-setup-realtime.md`**
