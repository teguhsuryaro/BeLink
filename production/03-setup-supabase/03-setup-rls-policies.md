# 03 - Setup Row Level Security (RLS) Policies

## Tujuan
Mengaktifkan RLS dan membuat security policies agar setiap user hanya bisa mengakses data yang sesuai dengan role dan kepemilikannya.

---

## Langkah-Langkah

### 1. Buka SQL Editor di Supabase

Di dashboard Supabase, klik **SQL Editor** → **New query**.

### 2. Jalankan SQL — Aktifkan RLS dan Buat Policies

**Salin SELURUH kode SQL berikut, paste, lalu klik "Run":**

```sql
-- ============================================
-- BeLink — Row Level Security Policies
-- ============================================

-- Helper function: cek apakah user adalah superadmin
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: ambil role user saat ini
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- User bisa baca profil sendiri
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Superadmin bisa baca semua profil
CREATE POLICY "profiles_select_admin"
  ON profiles FOR SELECT
  USING (is_superadmin());

-- Semua user terautentikasi bisa baca profil publik (untuk melihat nama mitra, dll)
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- User bisa update profil sendiri
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Superadmin bisa update semua profil (ban/unban)
CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (is_superadmin());

-- ============================================
-- MITRA_PROFILES
-- ============================================
ALTER TABLE mitra_profiles ENABLE ROW LEVEL SECURITY;

-- Semua user terautentikasi bisa baca data mitra (untuk pencarian)
CREATE POLICY "mitra_select_all"
  ON mitra_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Mitra bisa update data miliknya sendiri
CREATE POLICY "mitra_update_own"
  ON mitra_profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Mitra bisa insert data miliknya sendiri (saat daftar mitra)
CREATE POLICY "mitra_insert_own"
  ON mitra_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Superadmin bisa update semua data mitra (verifikasi)
CREATE POLICY "mitra_update_admin"
  ON mitra_profiles FOR UPDATE
  USING (is_superadmin());

-- ============================================
-- ORDERS
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- User bisa baca order miliknya sendiri
CREATE POLICY "orders_select_user"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

-- Mitra bisa baca order yang ditugaskan padanya
CREATE POLICY "orders_select_mitra"
  ON orders FOR SELECT
  USING (mitra_id = auth.uid());

-- Mitra verified bisa baca order dengan status 'searching' (untuk ambil order)
CREATE POLICY "orders_select_searching"
  ON orders FOR SELECT
  USING (
    status = 'searching'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM mitra_profiles
      WHERE id = auth.uid()
      AND verification_status = 'verified'
    )
  );

-- Superadmin bisa baca semua order
CREATE POLICY "orders_select_admin"
  ON orders FOR SELECT
  USING (is_superadmin());

-- User terautentikasi bisa membuat order baru
CREATE POLICY "orders_insert_user"
  ON orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- User & mitra yang terlibat bisa update order
CREATE POLICY "orders_update_participant"
  ON orders FOR UPDATE
  USING (user_id = auth.uid() OR mitra_id = auth.uid());

-- Superadmin bisa update semua order
CREATE POLICY "orders_update_admin"
  ON orders FOR UPDATE
  USING (is_superadmin());

-- ============================================
-- CHATS
-- ============================================
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Peserta order bisa baca chat
CREATE POLICY "chats_select_participant"
  ON chats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = chats.order_id
      AND (orders.user_id = auth.uid() OR orders.mitra_id = auth.uid())
    )
  );

-- Superadmin bisa baca semua chat (untuk investigasi laporan)
CREATE POLICY "chats_select_admin"
  ON chats FOR SELECT
  USING (is_superadmin());

-- Peserta order bisa kirim chat
CREATE POLICY "chats_insert_participant"
  ON chats FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND (orders.user_id = auth.uid() OR orders.mitra_id = auth.uid())
    )
  );

-- ============================================
-- ORDER_REVIEWS
-- ============================================
ALTER TABLE order_reviews ENABLE ROW LEVEL SECURITY;

-- Semua user terautentikasi bisa baca review (untuk lihat rating mitra)
CREATE POLICY "reviews_select_all"
  ON order_reviews FOR SELECT
  USING (auth.role() = 'authenticated');

-- Reviewer bisa membuat review (hanya untuk order yang sudah selesai)
CREATE POLICY "reviews_insert_reviewer"
  ON order_reviews FOR INSERT
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND orders.status = 'completed'
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- DEPOSIT_TRANSACTIONS
-- ============================================
ALTER TABLE deposit_transactions ENABLE ROW LEVEL SECURITY;

-- Mitra bisa baca transaksi deposit miliknya
CREATE POLICY "deposit_select_own"
  ON deposit_transactions FOR SELECT
  USING (mitra_id = auth.uid());

-- Superadmin bisa baca semua transaksi
CREATE POLICY "deposit_select_admin"
  ON deposit_transactions FOR SELECT
  USING (is_superadmin());

-- Superadmin bisa insert transaksi (top-up manual)
CREATE POLICY "deposit_insert_admin"
  ON deposit_transactions FOR INSERT
  WITH CHECK (is_superadmin());

-- ============================================
-- REPORTS
-- ============================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Reporter bisa baca laporan miliknya
CREATE POLICY "reports_select_own"
  ON reports FOR SELECT
  USING (reporter_id = auth.uid());

-- Superadmin bisa baca semua laporan
CREATE POLICY "reports_select_admin"
  ON reports FOR SELECT
  USING (is_superadmin());

-- User terautentikasi bisa membuat laporan
CREATE POLICY "reports_insert_user"
  ON reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- Superadmin bisa update laporan (review, resolve)
CREATE POLICY "reports_update_admin"
  ON reports FOR UPDATE
  USING (is_superadmin());

-- ============================================
-- NOTIFICATIONS
-- ============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User bisa baca notifikasi miliknya
CREATE POLICY "notif_select_own"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- User bisa update notifikasi miliknya (mark as read)
CREATE POLICY "notif_update_own"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- System bisa insert notifikasi (via trigger/service role)
-- Catatan: notifikasi akan di-insert oleh trigger atau edge function
-- menggunakan service_role key, jadi tidak perlu policy insert untuk user biasa
CREATE POLICY "notif_insert_system"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

---

## Validasi

- [ ] SQL berhasil dijalankan tanpa error
- [ ] Di **Authentication → Policies** atau di **Table Editor → setiap tabel → Policies**:
  - Setiap tabel menunjukkan "RLS Enabled"
  - Setiap tabel memiliki setidaknya 1 policy
- [ ] Cek tabel `profiles` — terlihat policies: `profiles_select_own`, `profiles_update_own`, dll
- [ ] Cek tabel `orders` — terlihat policy `orders_select_searching` (penting untuk pencarian mitra)

---

## Catatan

- RLS memastikan bahwa meskipun frontend menggunakan `anon key` (publik), user tidak bisa membaca data user lain
- Policy `orders_select_searching` memungkinkan mitra verified untuk melihat order yang sedang mencari mekanik — ini kunci dari sistem pencarian
- Superadmin memiliki akses baca ke semua tabel untuk keperluan manajemen

---

**Selesai? Lanjut ke `04-setup-storage-buckets.md`**
