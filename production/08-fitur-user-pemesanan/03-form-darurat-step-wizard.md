# 03 - Form Darurat Step Wizard

## Tujuan
Membuat form pemesanan darurat 3 langkah (wizard) di halaman `/order`.

---

## Instruksi

**EDIT FILE**: `src/pages/user/OrderPage.tsx`

**Ganti seluruh isi file placeholder** dengan form wizard yang terdiri dari 3 step.

### Struktur Halaman

**Step Indicator** (di atas form):
- 3 bulatan terhubung garis: Step 1 → Step 2 → Step 3
- Step aktif: warna primary, step selesai: primary + checkmark, step belum: gray
- Label di bawah setiap step: `order.step_vehicle`, `order.step_damage`, `order.step_location`
- Animasi: garis progress mengisi saat berpindah step

**Step 1: Data Kendaraan**
- Radio button / toggle 2 pilihan: Motor | Mobil (`order.motor` / `order.mobil`)
  - Desain: 2 card besar side-by-side, aktif = border primary + bg primary muted
  - Icon: `Bike` untuk motor, `Car` untuk mobil (dari Lucide)
- Input teks: Merek kendaraan (`order.vehicle_brand`) — opsional
- Upload foto kendaraan (`order.vehicle_photo`) — opsional
  - Gunakan `<input type="file" accept="image/*">` dengan preview
  - Upload ke Supabase Storage bucket `vehicles`
  - Tampilkan preview gambar setelah dipilih

**Step 2: Detail Kerusakan**
- Radio group: Jenis kerusakan (`order.damage_type`)
  - 7 pilihan dari `DAMAGE_TYPES` constant
  - Desain: grid 2 kolom di mobile, 3 kolom di desktop
  - Setiap pilihan: card kecil dengan icon + label, aktif = border primary
  - Icon suggestions: `CircleDot` (ban), `Power` (mesin), `Battery` (aki), `Link` (rantai), `Disc` (rem), `Zap` (kelistrikan), `HelpCircle` (lainnya)
- Textarea: Deskripsi kerusakan (`order.damage_description`) — opsional jika sudah pilih tipe
- Upload foto kerusakan (`order.damage_photo`) — **WAJIB**
  - Upload ke Supabase Storage bucket `damages`
  - Validasi: file harus ada sebelum bisa lanjut

**Step 3: Lokasi & Ongkos Jalan**
- Komponen `LocationPicker` (dari file sebelumnya)
  - Tombol "Deteksi Lokasi GPS" + peta interaktif
  - User bisa klik peta untuk memilih lokasi manual
- Input angka: Harga per kilometer (`order.price_per_km`)
  - Default: Rp5.000/km (dari `MIN_PRICE_PER_KM`)
  - Minimum: Rp5.000/km (validasi dari `orderFormSchema`)
  - Format: input angka dengan prefix "Rp" dan suffix "/km"
  - Alert info: `order.min_fee_alert`
  - Alert tip: `order.higher_fee_alert`
- Preview kalkulasi:
  - Estimasi jarak (akan dihitung setelah mitra ditemukan): "Akan dihitung saat mekanik ditemukan"
  - Total estimasi ongkos jalan: harga/km x estimasi jarak
- Tombol submit: `order.submit_order` — primary, full width, size `lg`

### Navigasi Antar Step
- Tombol "Lanjut" (`order.next`) di setiap step → validasi step sebelum lanjut
- Tombol "Kembali" (`order.prev`) di step 2 dan 3
- Animasi transisi: slide left/right menggunakan Framer Motion `AnimatePresence`

### Logika Form

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderFormSchema, type OrderFormData } from '@/lib/validators';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/Toast';

// State wizard
const [currentStep, setCurrentStep] = useState(1);
const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState<string | null>(null);
const [damagePhotoUrl, setDamagePhotoUrl] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);

// Upload file ke Supabase Storage
async function uploadFile(bucket: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${profile!.id}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) throw error;
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

// Submit form — buat order baru
async function onSubmit(data: OrderFormData) {
  setIsSubmitting(true);
  try {
    const totalFee = data.price_per_km * 1; // jarak belum diketahui, set 1km sebagai placeholder
    
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: profile!.id,
        vehicle_type: data.vehicle_type,
        vehicle_brand: data.vehicle_brand || null,
        vehicle_photo_url: vehiclePhotoUrl,
        damage_type: selectedDamageType || null,
        damage_description: data.damage_description || null,
        damage_photo_url: damagePhotoUrl,
        user_lat: data.user_lat,
        user_lng: data.user_lng,
        user_address: data.user_address || null,
        price_per_km: data.price_per_km,
        travel_fee: totalFee,
        status: 'searching',
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Permintaan terkirim!', 'Mencari mekanik terdekat...');
    navigate(`/order/${order.id}`);
  } catch (err: any) {
    toast.error('Gagal mengirim permintaan', err.message);
  } finally {
    setIsSubmitting(false);
  }
}
```

### Spesifikasi Desain

- Bungkus seluruh konten dengan `<PageTransition>`
- Max width: `max-w-2xl mx-auto`
- Step indicator: sticky di atas pada mobile
- Setiap step dibungkus `motion.div` dengan animasi slide
- Card pilihan (kendaraan, kerusakan): interactive hover effect, selected state jelas
- Foto preview: rounded-lg, max-h-48, object-cover
- Input harga: style khusus dengan prefix Rp dan suffix /km

---

## Validasi

- [ ] Buka `/order` — form wizard muncul dengan step indicator
- [ ] Step 1: bisa pilih Motor/Mobil, upload foto kendaraan
- [ ] Step 2: bisa pilih jenis kerusakan, upload foto kerusakan (wajib)
- [ ] Step 3: peta muncul, bisa deteksi lokasi GPS, bisa input harga/km
- [ ] Submit → order terbuat di database → redirect ke `/order/{id}`
- [ ] Tombol Kembali/Lanjut bekerja dengan animasi slide
- [ ] Validasi form: tidak bisa submit tanpa foto kerusakan dan lokasi

---

**Selesai? Lanjut ke `04-pencarian-mitra-dan-osrm.md`**
