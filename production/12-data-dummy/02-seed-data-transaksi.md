# 02 - Seed Data Transaksi

## Tujuan
Menambahkan data order, review, deposit, dan notifikasi dummy untuk testing UI.

---

## Langkah-Langkah

**Buka SQL Editor** → Jalankan SQL berikut:

### 1. Seed Orders

```sql
-- Ambil user IDs
DO $$
DECLARE
  v_user_id UUID;
  v_mitra1_id UUID;
  v_mitra2_id UUID;
  v_order1_id UUID := gen_random_uuid();
  v_order2_id UUID := gen_random_uuid();
  v_order3_id UUID := gen_random_uuid();
BEGIN
  SELECT id INTO v_user_id FROM profiles WHERE email = 'user@belink.test';
  SELECT id INTO v_mitra1_id FROM profiles WHERE email = 'mitra1@belink.test';
  SELECT id INTO v_mitra2_id FROM profiles WHERE email = 'mitra2@belink.test';

  -- Order 1: Completed (ban bocor, motor, mitra1)
  INSERT INTO orders (id, user_id, mitra_id, vehicle_type, vehicle_brand, damage_type, damage_description, user_lat, user_lng, user_address, mitra_lat, mitra_lng, route_distance_km, price_per_km, travel_fee, platform_commission, status, agreed_at, otw_at, arrived_at, completed_at, created_at)
  VALUES (
    v_order1_id, v_user_id, v_mitra1_id,
    'motor', 'Honda Beat', 'ban_bocor', 'Ban depan bocor kena paku',
    -6.2350, 106.8270, 'Jl. Sudirman No. 100, Jakarta',
    -6.2615, 106.8106, 3.5, 5000, 17500, 1750,
    'completed',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days' + INTERVAL '5 minutes',
    NOW() - INTERVAL '3 days' + INTERVAL '20 minutes',
    NOW() - INTERVAL '3 days' + INTERVAL '50 minutes',
    NOW() - INTERVAL '3 days'
  );

  -- Order 2: Completed (mesin mati, mobil, mitra2)
  INSERT INTO orders (id, user_id, mitra_id, vehicle_type, vehicle_brand, damage_type, damage_description, user_lat, user_lng, user_address, mitra_lat, mitra_lng, route_distance_km, price_per_km, travel_fee, platform_commission, status, agreed_at, otw_at, arrived_at, completed_at, created_at)
  VALUES (
    v_order2_id, v_user_id, v_mitra2_id,
    'mobil', 'Toyota Avanza', 'mesin_mati', 'Mesin mati mendadak di jalan tol',
    -6.2100, 106.8800, 'Jl. Raya Bekasi KM 10, Jakarta Timur',
    -6.2254, 106.9004, 2.8, 7000, 19600, 1960,
    'completed',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '3 minutes',
    NOW() - INTERVAL '1 day' + INTERVAL '15 minutes',
    NOW() - INTERVAL '1 day' + INTERVAL '45 minutes',
    NOW() - INTERVAL '1 day'
  );

  -- Order 3: Cancelled (aki soak)
  INSERT INTO orders (id, user_id, vehicle_type, vehicle_brand, damage_type, damage_description, user_lat, user_lng, user_address, price_per_km, travel_fee, status, cancelled_at, cancellation_reason, created_at)
  VALUES (
    v_order3_id, v_user_id,
    'motor', 'Yamaha NMAX', 'aki_soak', 'Aki habis, motor tidak bisa distarter',
    -6.2400, 106.8500, 'Jl. Gatot Subroto No. 55, Jakarta',
    5000, 5000,
    'cancelled_user',
    NOW() - INTERVAL '5 days',
    'Sudah ditangani teman',
    NOW() - INTERVAL '5 days'
  );

  -- Reviews
  INSERT INTO order_reviews (order_id, reviewer_id, reviewee_id, rating, comment)
  VALUES
    (v_order1_id, v_user_id, v_mitra1_id, 5, 'Sangat cepat dan profesional! Recommended!'),
    (v_order2_id, v_user_id, v_mitra2_id, 4, 'Bagus, tapi agak lama sampainya.');

  -- Deposit Transactions (Top-up + komisi)
  INSERT INTO deposit_transactions (mitra_id, type, amount, balance_after, notes, created_at)
  VALUES
    (v_mitra1_id, 'topup', 50000, 50000, 'Top up awal via admin', NOW() - INTERVAL '7 days'),
    (v_mitra2_id, 'topup', 100000, 100000, 'Top up awal via admin', NOW() - INTERVAL '7 days');

  INSERT INTO deposit_transactions (mitra_id, order_id, type, amount, balance_after, notes, created_at)
  VALUES
    (v_mitra1_id, v_order1_id, 'commission_deduction', 1750, 48250, 'Komisi 10% dari ongkos jalan Rp17500', NOW() - INTERVAL '3 days'),
    (v_mitra2_id, v_order2_id, 'commission_deduction', 1960, 98040, 'Komisi 10% dari ongkos jalan Rp19600', NOW() - INTERVAL '1 day');

  -- Update deposit balance mitra
  UPDATE mitra_profiles SET deposit_balance = 48250, total_orders_completed = 1, average_rating = 5.00
  WHERE id = v_mitra1_id;

  UPDATE mitra_profiles SET deposit_balance = 98040, total_orders_completed = 1, average_rating = 4.00
  WHERE id = v_mitra2_id;

  -- Notifications
  INSERT INTO notifications (user_id, title, body, type, is_read, created_at)
  VALUES
    (v_user_id, 'Pesanan Selesai', 'Pesanan ban bocor telah selesai. Berikan ulasan!', 'order', true, NOW() - INTERVAL '3 days'),
    (v_user_id, 'Pesanan Selesai', 'Pesanan mesin mati telah selesai. Berikan ulasan!', 'order', false, NOW() - INTERVAL '1 day'),
    (v_user_id, 'Selamat Datang!', 'Terima kasih telah mendaftar di BeLink.', 'system', true, NOW() - INTERVAL '7 days'),
    (v_mitra1_id, 'Ulasan Baru', 'Anda mendapat rating 5 bintang dari Budi Santoso', 'review', false, NOW() - INTERVAL '3 days'),
    (v_mitra2_id, 'Ulasan Baru', 'Anda mendapat rating 4 bintang dari Budi Santoso', 'review', false, NOW() - INTERVAL '1 day');

END $$;
```

---

## Validasi

- [ ] SQL berhasil dijalankan tanpa error
- [ ] Login sebagai `user@belink.test`:
  - Home: stats menunjukkan 3 total, 2 selesai, 1 dibatalkan
  - History: 3 order muncul di riwayat
  - Notifications: 3 notifikasi (1 belum dibaca)
- [ ] Login sebagai `mitra1@belink.test`:
  - Dashboard: saldo Rp48.250, 1 order selesai, rating 5.0
  - History: 1 order selesai
  - Deposit: 2 transaksi (1 topup, 1 komisi)
- [ ] Login sebagai `admin@belink.test`:
  - Dashboard stats menunjukkan data yang benar

---

**Selesai? Lanjut ke folder `13-polishing/` → file `01-review-animasi-dan-loading.md`**
