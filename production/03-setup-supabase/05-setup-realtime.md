# 05 - Setup Realtime

## Tujuan
Mengaktifkan Supabase Realtime pada tabel-tabel yang membutuhkan update real-time (orders, chats, notifications).

---

## Langkah-Langkah

### 1. Aktifkan Realtime pada Tabel

Di Supabase Dashboard → **SQL Editor** → **New query**.

**Jalankan SQL berikut:**

```sql
-- ============================================
-- BeLink — Realtime Configuration
-- ============================================

-- Aktifkan Realtime pada tabel orders
-- Agar perubahan status order bisa langsung terdeteksi oleh user & mitra
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Aktifkan Realtime pada tabel chats
-- Agar pesan baru langsung muncul di kedua sisi (user & mitra)
ALTER PUBLICATION supabase_realtime ADD TABLE chats;

-- Aktifkan Realtime pada tabel notifications
-- Agar notifikasi baru langsung muncul tanpa refresh
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Aktifkan Realtime pada tabel mitra_profiles
-- Agar update lokasi mitra (lat/lng) bisa di-track saat OTW
ALTER PUBLICATION supabase_realtime ADD TABLE mitra_profiles;
```

### 2. Verifikasi Realtime Aktif

1. Di sidebar kiri, klik **Database**
2. Klik **Replication** (atau **Publications**)
3. Cari publication `supabase_realtime`
4. Pastikan 4 tabel terdaftar:
   - `orders`
   - `chats`
   - `notifications`
   - `mitra_profiles`

### Alternatif: Via Dashboard

Jika SQL di atas gagal (karena tabel sudah ditambahkan sebelumnya), kamu bisa melakukannya via UI:

1. Pergi ke **Database** → **Replication**
2. Pada bagian `supabase_realtime`, klik **Manage**
3. Aktifkan toggle untuk tabel: `orders`, `chats`, `notifications`, `mitra_profiles`
4. Klik **Save**

---

## Cara Kerja Realtime (Referensi)

Nantinya di frontend, kita akan subscribe ke perubahan tabel menggunakan Supabase client:

```typescript
// Contoh: subscribe ke perubahan order tertentu
supabase
  .channel('order-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `id=eq.${orderId}`,
    },
    (payload) => {
      // Handle perubahan status order
      console.log('Order updated:', payload.new);
    }
  )
  .subscribe();

// Contoh: subscribe ke chat baru pada order tertentu
supabase
  .channel('chat-messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'chats',
      filter: `order_id=eq.${orderId}`,
    },
    (payload) => {
      // Handle pesan baru
      console.log('New message:', payload.new);
    }
  )
  .subscribe();
```

Kode di atas hanya referensi — implementasi sebenarnya akan dibuat di folder `08-fitur-user-pemesanan/`.

---

## Validasi

- [ ] SQL berhasil dijalankan ATAU tabel sudah diaktifkan via dashboard
- [ ] Di halaman Replication, `supabase_realtime` mencakup 4 tabel
- [ ] Tidak ada error di Supabase logs

---

## Catatan

- Supabase Realtime gratis untuk Free Tier (cukup untuk prototype)
- Setiap client yang subscribe akan menerima update secara instan via WebSocket
- RLS tetap berlaku pada Realtime — user hanya akan menerima update untuk data yang bisa mereka akses

---

**Selesai? Lanjut ke folder `04-fondasi-frontend/` → file `01-struktur-folder-src.md`**
