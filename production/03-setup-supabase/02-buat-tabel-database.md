# 02 - Buat Tabel Database

## Tujuan
Membuat seluruh tabel database BeLink di Supabase menggunakan SQL Editor.

---

## Langkah-Langkah

### 1. Buka SQL Editor

1. Di Supabase Dashboard, klik **SQL Editor** di sidebar kiri
2. Klik **New query** (tombol `+`)
3. Salin dan jalankan SQL berikut **secara berurutan** (satu blok per satu, atau semuanya sekaligus)

### 2. Jalankan SQL — Buat Semua Tabel

**Salin SELURUH kode SQL di bawah, paste ke SQL Editor, lalu klik "Run":**

```sql
-- ============================================
-- BeLink Database Schema
-- Jalankan di Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. TABEL: profiles
-- Menyimpan data profil user (semua role)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'mitra_independen', 'mitra_bengkel', 'superadmin')),
  is_banned BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  language_preference TEXT DEFAULT 'id'
    CHECK (language_preference IN ('id', 'en')),
  theme_preference TEXT DEFAULT 'light'
    CHECK (theme_preference IN ('light', 'dark')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian berdasarkan email dan role
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- 2. TABEL: mitra_profiles
-- Data spesifik mitra (deposit, lokasi, verifikasi)
-- ============================================
CREATE TABLE IF NOT EXISTS mitra_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT,
  bio TEXT,
  ktp_url TEXT,
  selfie_url TEXT,
  workshop_photo_url TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  address TEXT,
  deposit_balance NUMERIC(12, 2) DEFAULT 0.00,
  total_orders_completed INTEGER DEFAULT 0,
  average_rating NUMERIC(3, 2) DEFAULT 0.00,
  verification_status TEXT DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_accepting_orders BOOLEAN DEFAULT TRUE,
  max_concurrent_orders INTEGER DEFAULT 1,
  specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian mitra berdasarkan lokasi dan status
CREATE INDEX IF NOT EXISTS idx_mitra_verification ON mitra_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_mitra_location ON mitra_profiles(lat, lng);
CREATE INDEX IF NOT EXISTS idx_mitra_accepting ON mitra_profiles(is_accepting_orders);

-- ============================================
-- 3. TABEL: orders
-- Data pemesanan layanan darurat
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  mitra_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  vehicle_type TEXT NOT NULL
    CHECK (vehicle_type IN ('motor', 'mobil')),
  vehicle_brand TEXT,
  vehicle_photo_url TEXT,
  damage_type TEXT,
  damage_description TEXT,
  damage_photo_url TEXT,
  user_lat DOUBLE PRECISION NOT NULL,
  user_lng DOUBLE PRECISION NOT NULL,
  user_address TEXT,
  mitra_lat DOUBLE PRECISION,
  mitra_lng DOUBLE PRECISION,
  route_distance_km NUMERIC(8, 2),
  price_per_km NUMERIC(12, 2) NOT NULL DEFAULT 5000.00,
  travel_fee NUMERIC(12, 2) NOT NULL,
  platform_commission NUMERIC(12, 2),
  status TEXT DEFAULT 'searching'
    CHECK (status IN (
      'searching',
      'negotiating',
      'agreed',
      'otw',
      'arrived',
      'in_progress',
      'completed',
      'cancelled_user',
      'cancelled_mitra',
      'expired'
    )),
  agreed_at TIMESTAMPTZ,
  otw_at TIMESTAMPTZ,
  arrived_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian order
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_mitra ON orders(mitra_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ============================================
-- 4. TABEL: order_reviews
-- Ulasan dari user ke mitra setelah order selesai
-- ============================================
CREATE TABLE IF NOT EXISTS order_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON order_reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON order_reviews(order_id);

-- ============================================
-- 5. TABEL: chats
-- Pesan chat antara user dan mitra dalam suatu order
-- ============================================
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  message TEXT NOT NULL,
  is_filtered BOOLEAN DEFAULT FALSE,
  original_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk loading chat per order
CREATE INDEX IF NOT EXISTS idx_chats_order ON chats(order_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chats_sender ON chats(sender_id);

-- ============================================
-- 6. TABEL: deposit_transactions
-- Riwayat transaksi deposit mitra (top-up & potongan komisi)
-- ============================================
CREATE TABLE IF NOT EXISTS deposit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mitra_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL
    CHECK (type IN ('topup', 'commission_deduction')),
  amount NUMERIC(12, 2) NOT NULL,
  balance_after NUMERIC(12, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_deposit_mitra ON deposit_transactions(mitra_id);
CREATE INDEX IF NOT EXISTS idx_deposit_created ON deposit_transactions(created_at DESC);

-- ============================================
-- 7. TABEL: reports
-- Laporan pelanggaran antar user
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  reported_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open'
    CHECK (status IN ('open', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON reports(reported_id);

-- ============================================
-- 8. TABEL: notifications
-- Notifikasi in-app untuk user
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('order', 'chat', 'deposit', 'system', 'review')),
  is_read BOOLEAN DEFAULT FALSE,
  related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ============================================
-- FUNCTION: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: profiles.updated_at
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Auto-create profile after sign up
-- Otomatis buat row di profiles saat user sign up
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: jalankan saat user baru mendaftar
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- FUNCTION: Hitung komisi dan potong deposit
-- Dipanggil saat order status berubah ke 'completed'
-- ============================================
CREATE OR REPLACE FUNCTION process_order_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_commission NUMERIC(12, 2);
  v_current_balance NUMERIC(12, 2);
  v_new_balance NUMERIC(12, 2);
BEGIN
  -- Hanya proses jika status berubah ke 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Hitung komisi 10% dari travel_fee
    v_commission := ROUND(NEW.travel_fee * 0.10, 2);

    -- Update komisi di order
    NEW.platform_commission := v_commission;
    NEW.completed_at := NOW();

    -- Ambil saldo deposit mitra saat ini
    SELECT deposit_balance INTO v_current_balance
    FROM mitra_profiles
    WHERE id = NEW.mitra_id;

    -- Hitung saldo baru
    v_new_balance := v_current_balance - v_commission;

    -- Potong deposit mitra
    UPDATE mitra_profiles
    SET
      deposit_balance = v_new_balance,
      total_orders_completed = total_orders_completed + 1
    WHERE id = NEW.mitra_id;

    -- Catat transaksi deposit
    INSERT INTO deposit_transactions (mitra_id, order_id, type, amount, balance_after, notes)
    VALUES (
      NEW.mitra_id,
      NEW.id,
      'commission_deduction',
      v_commission,
      v_new_balance,
      'Komisi 10% dari ongkos jalan Rp' || NEW.travel_fee::TEXT
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: jalankan saat order di-update
CREATE TRIGGER trigger_order_completion
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION process_order_completion();

-- ============================================
-- FUNCTION: Update rata-rata rating mitra
-- ============================================
CREATE OR REPLACE FUNCTION update_mitra_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_avg_rating NUMERIC(3, 2);
BEGIN
  SELECT ROUND(AVG(rating)::NUMERIC, 2) INTO v_avg_rating
  FROM order_reviews
  WHERE reviewee_id = NEW.reviewee_id;

  UPDATE mitra_profiles
  SET average_rating = v_avg_rating
  WHERE id = NEW.reviewee_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: jalankan saat review baru ditambahkan
CREATE TRIGGER trigger_update_mitra_rating
  AFTER INSERT ON order_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_mitra_rating();
```

### 3. Verifikasi Tabel Telah Dibuat

1. Di sidebar kiri, klik **Table Editor**
2. Kamu harus melihat 8 tabel:
   - `profiles`
   - `mitra_profiles`
   - `orders`
   - `order_reviews`
   - `chats`
   - `deposit_transactions`
   - `reports`
   - `notifications`

---

## Validasi

- [ ] SQL berhasil dijalankan tanpa error
- [ ] 8 tabel muncul di Table Editor
- [ ] Klik tabel `profiles` — kolom-kolomnya sesuai (id, full_name, email, role, dll)
- [ ] Klik tabel `orders` — kolom `status` memiliki constraint CHECK
- [ ] Di **Database → Functions**, terlihat 4 fungsi:
  - `update_updated_at_column`
  - `handle_new_user`
  - `process_order_completion`
  - `update_mitra_rating`

---

## Catatan

- Trigger `handle_new_user` akan **otomatis** membuat row di tabel `profiles` setiap kali ada user baru yang mendaftar via Supabase Auth. Jadi kamu tidak perlu manually insert ke `profiles` saat registrasi.
- Trigger `process_order_completion` akan **otomatis** menghitung komisi 10% dan memotong deposit mitra saat order di-mark completed.
- Trigger `update_mitra_rating` akan **otomatis** menghitung rata-rata rating mitra setiap kali ada review baru.

---

**Selesai? Lanjut ke `03-setup-rls-policies.md`**
