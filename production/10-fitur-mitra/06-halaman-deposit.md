# 06 - Halaman Deposit

## Tujuan
Membuat halaman `/mitra/deposit` untuk melihat saldo dan riwayat transaksi deposit mitra.

---

## Instruksi

**EDIT FILE**: `src/pages/mitra/DepositPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Saldo Card** (card utama di atas)
   - Label: `mitra.deposit_balance`
   - Angka besar: `formatIDR(deposit_balance)` dengan font `text-3xl font-bold`
   - Badge warning jika < `LOW_DEPOSIT_THRESHOLD`
   - Alert jika < `MIN_DEPOSIT_BALANCE`: `mitra.min_deposit_alert`
   - Tombol "Top Up" → buka modal instruksi (lihat di bawah)

2. **Instruksi Top Up** (dalam Modal)
   - Karena sistem top up BeLink masih manual (transfer ke admin):
     - "Hubungi admin BeLink via WhatsApp untuk melakukan top up deposit"
     - "Transfer ke rekening yang diberikan admin"
     - "Admin akan menambahkan saldo deposit setelah konfirmasi pembayaran"
   - Ini adalah placeholder — nantinya bisa diganti dengan payment gateway

3. **Riwayat Transaksi**
   - Daftar transaksi dari tabel `deposit_transactions`
   - Setiap item:
     - Icon: `ArrowUpCircle` (hijau) untuk topup, `ArrowDownCircle` (merah) untuk commission_deduction
     - Judul: "Top Up" atau "Komisi Platform"
     - Detail: `notes` dari database
     - Jumlah: `+Rp...` (hijau) atau `-Rp...` (merah)
     - Saldo setelah: `Saldo: formatIDR(balance_after)`
     - Tanggal: `formatDate(created_at)`
   - Pagination: load more (infinite scroll) atau sederhana "Lihat lebih banyak"
   - Empty state jika belum ada transaksi

### Data Fetching

```typescript
const { data: transactions, isLoading } = useQuery({
  queryKey: ['deposit-transactions', profile?.id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('deposit_transactions')
      .select('*')
      .eq('mitra_id', profile!.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data || []) as DepositTransaction[];
  },
  enabled: !!profile,
});
```

### Spesifikasi Desain

- Max width `max-w-2xl mx-auto`
- Saldo card: gradient background subtle, saldo di tengah
- Transaksi list: garis pemisah tipis antar item, alternating subtle bg
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/mitra/deposit` — saldo dan riwayat transaksi muncul
- [ ] Saldo menunjukkan angka yang benar dari `mitra_profiles.deposit_balance`
- [ ] Riwayat transaksi menampilkan top-up (hijau) dan komisi (merah)
- [ ] Modal top up muncul dengan instruksi
- [ ] Warning muncul jika saldo rendah

---

**Selesai? Lanjut ke `07-riwayat-order-mitra.md`**
