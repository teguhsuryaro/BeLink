# 01 — Alur Top Up Saldo Baru (Prototype)

## Tujuan
Mengganti modal top up yang sebelumnya hanya menampilkan instruksi transfer manual menjadi alur langsung: input angka → QR gimmick → konfirmasi → saldo bertambah.

---

## File yang Dimodifikasi

### `src/pages/mitra/DepositPage.tsx`

---

## Langkah Implementasi

### 1. Ganti State dan Alur Modal

Hapus seluruh konten modal lama (baris 198-248). Ganti dengan alur 2-step:

**State baru yang diperlukan:**
```typescript
const [topUpStep, setTopUpStep] = useState<'input' | 'qr'>('input');
const [topUpAmount, setTopUpAmount] = useState<number>(0);
const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
```

### 2. Step 1: Input Angka Top Up

Di dalam modal, tampilkan:
- Judul: "Masukkan Nominal Top Up"
- Input angka dengan format Rupiah (gunakan `<Input type="number" />`)
- Validasi: minimum Rp10.000 (ambil dari `MIN_DEPOSIT_BALANCE` di constants)
- Tombol "Lanjut" (disabled jika angka < 10000)

```tsx
{topUpStep === 'input' && (
  <div className="space-y-6">
    <div className="text-center">
      <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
        Masukkan Nominal Top Up
      </h4>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
        Minimum top up: {formatIDR(MIN_DEPOSIT_BALANCE)}
      </p>
    </div>

    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted-light dark:text-text-muted-dark">Rp</span>
      <input
        type="number"
        min={MIN_DEPOSIT_BALANCE}
        value={topUpAmount || ''}
        onChange={(e) => setTopUpAmount(Number(e.target.value))}
        placeholder="10000"
        className="w-full rounded-xl border border-border-light bg-card-light py-4 pl-12 pr-4 text-2xl font-bold text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark dark:text-white"
      />
    </div>

    {/* Quick Amount Buttons */}
    <div className="grid grid-cols-3 gap-2">
      {[10000, 25000, 50000, 100000, 200000, 500000].map((amount) => (
        <button
          key={amount}
          type="button"
          onClick={() => setTopUpAmount(amount)}
          className={cn(
            "rounded-lg border py-2 text-sm font-medium transition-colors",
            topUpAmount === amount
              ? "border-primary bg-primary/10 text-primary"
              : "border-border-light hover:border-primary/50 dark:border-border-dark"
          )}
        >
          {formatIDR(amount)}
        </button>
      ))}
    </div>

    <Button
      size="lg"
      className="w-full"
      disabled={topUpAmount < MIN_DEPOSIT_BALANCE}
      onClick={() => setTopUpStep('qr')}
    >
      Lanjut
    </Button>
  </div>
)}
```

### 3. Step 2: QR Code Gimmick + Konfirmasi

Tampilkan:
- QR Code visual (bisa generate pakai library `qrcode.react` atau cukup gambar statis)
- Teks nominal yang dipilih
- Tombol "Konfirmasi Pembayaran"
- Tombol "Kembali"

**Untuk QR Code gimmick**, gunakan salah satu pendekatan:
- **Opsi A (Sederhana):** Tampilkan gambar QR statis dari placeholder, misalnya kotak hitam-putih sederhana dengan CSS.
- **Opsi B (Lebih realistis):** Buat pattern kotak-kotak menggunakan div dengan CSS grid yang menyerupai QR code.

```tsx
{topUpStep === 'qr' && (
  <div className="space-y-6 text-center">
    <div>
      <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
        Scan QR untuk Pembayaran
      </h4>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
        Nominal: <span className="font-bold text-primary">{formatIDR(topUpAmount)}</span>
      </p>
    </div>

    {/* QR Code Gimmick */}
    <div className="mx-auto w-48 h-48 bg-white rounded-xl p-4 shadow-inner border">
      {/* SVG atau pattern yang menyerupai QR code */}
      <div className="w-full h-full bg-[url('data:image/svg+xml,...')] bg-contain bg-no-repeat bg-center" />
      {/* Alternatif: grid pattern sederhana */}
    </div>

    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
      (Demo mode — pembayaran disimulasikan)
    </p>

    <div className="flex gap-3">
      <Button variant="outline" className="w-1/3" onClick={() => setTopUpStep('input')}>
        Kembali
      </Button>
      <Button
        className="w-2/3"
        size="lg"
        isLoading={isProcessingTopUp}
        onClick={handleConfirmTopUp}
      >
        Konfirmasi Pembayaran
      </Button>
    </div>
  </div>
)}
```

### 4. Fungsi Konfirmasi Pembayaran

Buat fungsi `handleConfirmTopUp` yang:
1. Menambah saldo di `mitra_profiles.deposit_balance`
2. Mencatat transaksi di `deposit_transactions`
3. Refresh data

```typescript
const handleConfirmTopUp = async () => {
  if (!profile || topUpAmount < MIN_DEPOSIT_BALANCE) return;

  setIsProcessingTopUp(true);
  try {
    const newBalance = currentBalance + topUpAmount;

    // 1. Update saldo di mitra_profiles
    const { error: updateError } = await supabase
      .from('mitra_profiles')
      .update({ deposit_balance: newBalance })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    // 2. Catat transaksi
    const { error: txError } = await supabase
      .from('deposit_transactions')
      .insert({
        mitra_id: profile.id,
        type: 'topup',
        amount: topUpAmount,
        balance_after: newBalance,
        notes: `Top up saldo via QR (Demo)`,
      });

    if (txError) throw txError;

    // 3. Refresh data
    queryClient.invalidateQueries({ queryKey: ['mitra-profile'] });
    queryClient.invalidateQueries({ queryKey: ['deposit-transactions'] });

    toast.success('Top up berhasil!', `Saldo bertambah ${formatIDR(topUpAmount)}`);
    setIsTopUpModalOpen(false);
    setTopUpStep('input');
    setTopUpAmount(0);
  } catch (error) {
    console.error('Top up error:', error);
    toast.error('Gagal melakukan top up');
  } finally {
    setIsProcessingTopUp(false);
  }
};
```

### 5. Reset Modal saat Ditutup

Pastikan modal di-reset ke state awal saat ditutup:
```typescript
onOpenChange={(open) => {
  setIsTopUpModalOpen(open);
  if (!open) {
    setTopUpStep('input');
    setTopUpAmount(0);
  }
}}
```

---

## Import Tambahan

```typescript
import { useQueryClient } from '@tanstack/react-query';
// queryClient sudah bisa diambil dari useQueryClient()
```

---

## Validasi

- [ ] Klik "Top Up Saldo" → Modal muncul dengan input angka
- [ ] Input < 10000 → Tombol "Lanjut" disabled
- [ ] Klik quick amount (misal Rp50.000) → Input terisi otomatis
- [ ] Klik "Lanjut" → Tampilan QR muncul dengan nominal yang benar
- [ ] Klik "Konfirmasi Pembayaran" → Loading, lalu saldo bertambah
- [ ] Riwayat transaksi menampilkan entry "Top up saldo via QR (Demo)" baru
- [ ] Saldo di card atas terupdate real-time
- [ ] Klik "Kembali" di step QR → Kembali ke step input
- [ ] Tutup modal → State ter-reset (kembali ke step input, angka 0)

---

**Selesai? Lanjut ke `02-fix-warna-riwayat.md`**
