# 01 — Fix Tombol Top Up di Dark Mode

## Tujuan
Memperbaiki visibilitas tombol "Top Up Saldo" di `DepositPage.tsx` agar teksnya tidak tenggelam dengan warna *background* di *dark mode*.

---

## File yang Dimodifikasi

### `src/pages/mitra/DepositPage.tsx`

---

## Akar Masalah

Tombol di baris 112-119 menggunakan warna `bg-white text-primary`.
Di *dark mode*, `text-primary` berpadu buruk dengan latar *card gradient* atau menyebabkan kekacauan kontras jika warna *background* tombol ter-override.

---

## Langkah Perbaikan

### 1. Perbarui *Class Tailwind* pada Tombol

Ubah prop `className` dari tombol Top Up.

**Sebelum:**
```tsx
<Button 
  variant="secondary" 
  size="lg" 
  className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow bg-white text-primary hover:bg-gray-50"
  onClick={() => setIsTopUpModalOpen(true)}
>
  Top Up Saldo
</Button>
```

**Sesudah:**
```tsx
<Button 
  variant="secondary" 
  size="lg" 
  className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow bg-white text-primary hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700"
  onClick={() => setIsTopUpModalOpen(true)}
>
  Top Up Saldo
</Button>
```

> Menambahkan *classes* spesifik `dark:bg-gray-800 dark:text-white` memastikan tombol terlihat seperti tombol solid di *dark mode* dan tetap menonjol di atas latar belakang gradient.

---

## Validasi

- [ ] Buka `/mitra/deposit`
- [ ] Nyalakan *Dark Mode*
- [ ] Pastikan tombol "Top Up Saldo" terlihat jelas, kontrasnya baik, dan interaktif (efek hover terlihat).

---

**Selesai? Lanjut ke `02-fix-tabel-pengguna-desktop.md`**
