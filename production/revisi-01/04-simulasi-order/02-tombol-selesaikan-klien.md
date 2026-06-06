# 02 — Tombol Selesaikan Orderan untuk Klien (Shortcut Simulasi)

## Tujuan
Menambahkan tombol *shortcut* "Selesaikan Orderan" di sisi pengguna (klien) setelah mitra OTW. Hal ini khusus untuk keperluan *prototype/testing* agar alur penyelesaian bisa dicek tanpa menunggu aksi dari mitra.

---

## File yang Dimodifikasi

### `src/components/order/OrderActionButtons.tsx`

---

## Langkah Implementasi

### 1. Modifikasi Render Tombol Klien (Role User)

Di file `OrderActionButtons.tsx`, cari blok `if (role === 'user')`.

Tambahkan tombol "Selesaikan Orderan" pada status `otw`, `arrived`, dan `in_progress`.

**Modifikasi pada `case 'otw':`, tambahkan juga untuk `arrived` dan `in_progress`:**

```tsx
      case 'otw':
      case 'arrived':
      case 'in_progress':
        return (
          <div className="flex flex-col gap-2 w-full">
            <Button variant="danger" size="sm" className="w-full" onClick={handleCancel}>
              Batalkan Pesanan
            </Button>
            {/* --- SHORTCUT PROTOTYPE --- */}
            <Button 
              variant="success" 
              size="sm" 
              className="w-full mt-2" 
              onClick={() => handleStatusUpdate('completed')}
              leftIcon={<Check className="h-4 w-4" />}
            >
              Selesaikan Orderan (Demo Shortcut)
            </Button>
          </div>
        );
```

### 2. Validasi Keamanan (Opsional namun disarankan)

Karena ini tombol *shortcut* yang langsung memaksa status menjadi `completed`, trigger `process_order_completion` di database akan otomatis memproses komisi dan *rating*.

Pastikan fungsi `handleStatusUpdate` menangani error jika saldo mitra tidak cukup (walaupun di trigger database biasanya sudah ditangani/dicek). Karena validasi saldo saat ini ada di `if (newStatus === 'completed' && role === 'mitra')`, tambahkan/sesuaikan agar validasi ini tidak memblokir tombol shortcut klien, atau biarkan database yang menolak transaksi jika saldo kurang.

---

## Validasi

- [ ] Login sebagai klien dan buat pesanan.
- [ ] Login sebagai mitra dan terima pesanan hingga status berubah ke OTW.
- [ ] Kembali ke klien, pastikan tombol "Selesaikan Orderan (Demo Shortcut)" muncul.
- [ ] Klik tombol tersebut.
- [ ] Pastikan pesanan langsung selesai, modal *review* muncul untuk klien, dan saldo deposit mitra terpotong secara *real-time*.

---

**Selesai? Lanjut ke folder `05-bug-visual/`**
