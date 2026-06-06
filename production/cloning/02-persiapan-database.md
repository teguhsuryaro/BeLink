# Fase 02: Persiapan Database Supabase

Karena proyek ini menggunakan BaaS (Backend-as-a-Service) Supabase, kamu wajib memiliki *database* milikmu sendiri agar datanya tidak bercampur dengan milik pemilik kode asli.

## 1. Buat Proyek Supabase
1. Daftar atau login di [Supabase.com](https://supabase.com).
2. Buat "New Project". Beri nama misalnya "belink-db" dan ingat *database password*-mu.
3. Tunggu beberapa menit hingga *database*-mu selesai disiapkan.

## 2. Konfigurasi Auth (Autentikasi)
1. Di *dashboard* Supabase, pergi ke menu **Authentication** > **Providers**.
2. Pastikan **Email** aktif.
3. **Penting:** Matikan opsi "Confirm email" (jangan centang) agar kamu bisa langsung mendaftar akun palsu (dummy) tanpa perlu memverifikasi email asli untuk kebutuhan demontrasi dosen.

## 3. Eksekusi Skema Database & RLS
Buka menu **SQL Editor** di menu kiri Supabase, buat *New Query*, *Copy-Paste* SELURUH kode SQL di bawah ini, lalu klik **RUN**:

```sql
-- TABEL: profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'mitra_independen', 'mitra_bengkel', 'superadmin')),
  is_banned BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  language_preference TEXT DEFAULT 'id' CHECK (language_preference IN ('id', 'en')),
  theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABEL: mitra_profiles
CREATE TABLE mitra_profiles (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABEL: orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  mitra_id UUID REFERENCES profiles(id),
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('motor', 'mobil')),
  vehicle_brand TEXT,
  vehicle_photo_url TEXT,
  damage_description TEXT,
  damage_photo_url TEXT,
  user_lat DOUBLE PRECISION NOT NULL,
  user_lng DOUBLE PRECISION NOT NULL,
  user_address TEXT,
  mitra_lat DOUBLE PRECISION,
  mitra_lng DOUBLE PRECISION,
  route_distance_km NUMERIC(8, 2),
  travel_fee NUMERIC(12, 2) NOT NULL,
  platform_commission NUMERIC(12, 2),
  status TEXT DEFAULT 'searching'
    CHECK (status IN (
      'searching', 'negotiating', 'agreed', 'otw', 'arrived', 
      'in_progress', 'completed', 'cancelled_user', 'cancelled_mitra', 'expired'
    )),
  agreed_at TIMESTAMPTZ,
  otw_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABEL: deposit_transactions
CREATE TABLE deposit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mitra_id UUID REFERENCES profiles(id) NOT NULL,
  order_id UUID REFERENCES orders(id),
  type TEXT NOT NULL CHECK (type IN ('topup', 'commission_deduction')),
  amount NUMERIC(12, 2) NOT NULL,
  balance_after NUMERIC(12, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MENGAKTIFKAN RLS (ROW LEVEL SECURITY)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mitra_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_transactions ENABLE ROW LEVEL SECURITY;

-- KEBIJAKAN (POLICIES) KHUSUS DEMO PROTOTYPE
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Mitra profiles are viewable by everyone." ON mitra_profiles FOR SELECT USING (true);
CREATE POLICY "Mitra can update own profile." ON mitra_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Mitra can insert own profile." ON mitra_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Orders are viewable by everyone." ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update order" ON orders FOR UPDATE USING (true);

CREATE POLICY "Deposit transactions are viewable by own mitra" ON deposit_transactions FOR SELECT USING (auth.uid() = mitra_id);
CREATE POLICY "Mitra can insert own deposit_transactions" ON deposit_transactions FOR INSERT WITH CHECK (auth.uid() = mitra_id);
```
*(Catatan: RLS di atas dirancang sedikit dilonggarkan khusus untuk mempermudah pengerjaan dan presentasi tugas purwarupa/prototype tanpa terganggu error izin).*

## 4. Persiapan Storage (Bucket File)
1. Pergi ke menu **Storage** di Supabase.
2. Buat 3 *New Bucket* dengan nama persis berikut (huruf kecil semua):
   - `avatars`
   - `vehicles`
   - `damages`
3. Saat membuat, pastikan kamu **mencentang/mengaktifkan** opsi "Public bucket" agar gambar bisa dimuat di *website*.
4. **Penting:** Tambahkan *Policies* di setiap bucket: pilih *New Policy* -> *Get started quickly* -> pilih *Enable full access for all users* agar mudah dan tidak repot saat mendemokan fitur upload dari aplikasi.
