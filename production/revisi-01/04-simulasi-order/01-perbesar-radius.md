# 01 — Perbesar Radius Pencarian Mitra (Simulasi)

## Tujuan
Memperbesar jangkauan pencarian mitra mekanik agar mudah disimulasikan saat *testing* tanpa harus menggerakkan koordinat terlalu dekat.

---

## File yang Dimodifikasi

### `src/lib/constants.ts`

---

## Langkah Perbaikan

### 1. Ubah Nilai Konstanta Radius

Buka file `src/lib/constants.ts` dan cari baris 28.

**Sebelum:**
```typescript
/**
 * Radius pencarian mitra default (dalam km)
 */
export const DEFAULT_SEARCH_RADIUS_KM = 15;
```

**Sesudah:**
```typescript
/**
 * Radius pencarian mitra default (dalam km)
 * (Diperbesar untuk kebutuhan simulasi prototype)
 */
export const DEFAULT_SEARCH_RADIUS_KM = 20;
```

---

## Validasi

- [ ] Pastikan perubahan berhasil disimpan di `constants.ts`.
- [ ] Buat pesanan baru dengan klien.
- [ ] Pastikan mekanik dengan jarak di atas 15 km (tapi di bawah 20 km) masih mendapatkan notifikasi/muncul di pencarian.

---

**Selesai? Lanjut ke `02-tombol-selesaikan-klien.md`**
