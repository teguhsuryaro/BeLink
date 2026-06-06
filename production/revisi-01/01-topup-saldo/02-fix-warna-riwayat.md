# 02 — Fix Warna & Tanda Riwayat Transaksi

## Tujuan
Memperbaiki tampilan riwayat transaksi agar top up ditampilkan hijau (+) dan komisi/withdrawal ditampilkan merah (-).

---

## File yang Dimodifikasi

### `src/pages/mitra/DepositPage.tsx`

---

## Akar Masalah

Di baris 146, variabel `isPositive` mengecek:
```typescript
const isPositive = tx.type === 'top_up'; // ← pakai underscore
```

Namun data yang disimpan ke database (dari seed SQL dan dari alur top up) menggunakan string `'topup'` **tanpa underscore**. Pencocokan gagal, sehingga semua transaksi dianggap negatif.

---

## Langkah Perbaikan

### 1. Perbaiki Interface Type

Di baris 21, ubah tipe `type` pada interface `DepositTransaction`:

**Sebelum:**
```typescript
type: 'top_up' | 'commission_deduction' | 'withdrawal';
```

**Sesudah:**
```typescript
type: 'topup' | 'top_up' | 'commission_deduction' | 'withdrawal';
```

> **Catatan:** Mendukung kedua format (`topup` dan `top_up`) untuk backward compatibility. Idealnya, pastikan semua entry baru menggunakan `'topup'`.

### 2. Perbaiki Logika isPositive

Di baris 146, ubah:

**Sebelum:**
```typescript
const isPositive = tx.type === 'top_up';
```

**Sesudah:**
```typescript
const isPositive = tx.type === 'topup' || tx.type === 'top_up';
```

---

## Validasi

- [ ] Buka halaman Deposit (`/mitra/deposit`)
- [ ] Transaksi "Top Up" menampilkan ikon hijau (↑) dan teks `+Rp...` berwarna hijau
- [ ] Transaksi "Komisi" menampilkan ikon merah (↓) dan teks `-Rp...` berwarna merah
- [ ] Cek di dark mode — warna tetap kontras dan terbaca

---

**Selesai? Lanjut ke folder `02-profil-mitra/`**
