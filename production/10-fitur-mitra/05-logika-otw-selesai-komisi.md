# 05 - Logika OTW, Selesai, dan Komisi

## Tujuan
Memastikan alur logika dari OTW hingga penyelesaian order dan pemotongan komisi berjalan dengan benar.

---

## Yang Sudah Dibuat

Sebagian besar logika sudah diimplementasikan:
- **Trigger `process_order_completion`** (di `02-buat-tabel-database.md`): otomatis potong komisi 10% dan catat transaksi saat status berubah ke `completed`
- **`useLocationTracking`** (di `08-tombol-aksi-dan-tracking.md`): kirim lokasi GPS mitra saat OTW
- **`useMitraLocation`** (di file yang sama): user bisa lacak posisi mitra

## File ini berisi: Verifikasi dan Edge Cases

### Alur Lengkap: Deal → Selesai

```
Status: agreed
├── Mitra klik "OTW"
│   ├── Update status → `otw`
│   ├── Set `otw_at = NOW()`
│   ├── Aktifkan GPS tracking (useLocationTracking)
│   └── User bisa melihat posisi mitra bergerak di peta
│
├── Mitra klik "Sudah Tiba"
│   ├── Update status → `arrived`
│   ├── Set `arrived_at = NOW()`
│   └── Matikan GPS tracking
│
├── Mitra klik "Mulai Kerjakan"
│   ├── Update status → `in_progress`
│   └── User tahu bahwa pekerjaan sedang berjalan
│
└── Mitra klik "Selesai"
    ├── Update status → `completed`
    ├── TRIGGER `process_order_completion` otomatis:
    │   ├── Hitung komisi: travel_fee × 10%
    │   ├── Potong deposit mitra
    │   ├── Insert ke deposit_transactions
    │   └── Increment total_orders_completed
    ├── User melihat ReviewModal muncul
    └── TRIGGER `update_mitra_rating` saat user submit review
```

### Validasi Sebelum Setiap Transisi

Tambahkan validasi di `OrderActionButtons.tsx`:

```typescript
// Validasi sebelum OTW
if (newStatus === 'otw') {
  // Cek apakah sudah deal (status harus 'agreed')
  if (order.status !== 'agreed') {
    toast.error('Tidak bisa OTW: pesanan belum di-deal');
    return;
  }
}

// Validasi sebelum selesai
if (newStatus === 'completed') {
  // Cek deposit cukup untuk komisi
  const estimatedCommission = order.travel_fee * 0.10;
  if (mitraProfile && mitraProfile.deposit_balance < estimatedCommission) {
    toast.error('Saldo deposit tidak cukup untuk membayar komisi');
    return;
  }
}
```

### Timestamps yang Di-set Per Status

| Status | Timestamp | Set Otomatis? |
|---|---|---|
| `agreed` | `agreed_at` | Manual di update |
| `otw` | `otw_at` | Manual di update |
| `arrived` | `arrived_at` | Manual di update |
| `completed` | `completed_at` | ✅ Otomatis oleh trigger |
| `cancelled_*` | `cancelled_at` | Manual di update |

---

## Validasi

- [ ] Alur Deal → OTW → Tiba → Mulai → Selesai berjalan mulus
- [ ] Saat "Selesai": deposit mitra berkurang 10% dari ongkos jalan
- [ ] Saat "Selesai": entry baru muncul di `deposit_transactions`
- [ ] Saat "Selesai": `total_orders_completed` mitra bertambah 1
- [ ] User submit review → `average_rating` mitra ter-update otomatis
- [ ] Validasi: mitra tidak bisa "Selesai" jika deposit kurang

---

**Selesai? Lanjut ke `06-halaman-deposit.md`**
