# 01 — Implementasi Halaman Profil Mitra

## Tujuan
Membangun halaman profil mitra yang fungsional, memungkinkan mitra mengubah informasi usaha, lokasi lapak, dan spesialisasi kendaraan.

---

## File yang Dimodifikasi

### `src/pages/mitra/MitraProfilePage.tsx` (tulis ulang dari 0)

---

## Referensi Desain

Gunakan pola yang mirip dengan:
- `src/pages/user/ProfilePage.tsx` — untuk layout umum (avatar, card sections)
- `src/pages/user/RegisterMitraPage.tsx` — untuk field-field form (business_name, bio, address, lat/lng)

---

## Struktur Halaman

```
┌──────────────────────────────┐
│   ← Kembali    Profil Mitra  │  ← Header + Back button
├──────────────────────────────┤
│  🖼️ Avatar + Nama + Email    │  ← Info card (non-editable)
│  ⭐ Rating | 📦 Total Order  │
│  ✅ Status Verifikasi        │
│  💰 Saldo: Rp...             │
├──────────────────────────────┤
│  📝 Informasi Usaha          │  ← Section (editable)
│  Nama Bengkel: [___________] │
│  Bio: [____________________] │
│  Alamat: [_________________] │
├──────────────────────────────┤
│  📍 Lokasi Lapak             │  ← Section (editable)
│  [====== PETA INTERAKTIF ===]│
│  [==========================]│
│  Lat: -6.xxx  Lng: 106.xxx   │
├──────────────────────────────┤
│  🔧 Spesialisasi Kendaraan   │  ← Section (editable)
│  ☑ Motor  ☐ Mobil            │
│  Tags: [ban] [mesin] [aki]   │
├──────────────────────────────┤
│  [ Simpan Perubahan ]        │  ← Submit button
└──────────────────────────────┘
```

---

## Langkah Implementasi

### 1. Import dan Setup

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User, MapPin, Wrench, Save, Star, Package, Shield, Wallet } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { formatIDR } from '@/lib/utils';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { LocationPicker } from '@/components/map/LocationPicker';
import { toast } from '@/components/ui/Toast';

import type { MitraProfile } from '@/types/user.types';
```

### 2. Fetch Data Mitra

Query `mitra_profiles` + `profiles` untuk mendapatkan semua data:

```typescript
const { data: mitraProfile, isLoading } = useQuery({
  queryKey: ['mitra-profile-full', profile?.id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('mitra_profiles')
      .select('*, profiles(*)')
      .eq('id', profile!.id)
      .single();
    if (error) throw error;
    return data;
  },
  enabled: !!profile,
});
```

### 3. Form State

Gunakan `useState` untuk setiap field yang bisa diedit:

```typescript
const [businessName, setBusinessName] = useState('');
const [bio, setBio] = useState('');
const [address, setAddress] = useState('');
const [lat, setLat] = useState(-6.2);
const [lng, setLng] = useState(106.8);
const [specializations, setSpecializations] = useState<string[]>([]);

// Sync state saat data dari server berubah
useEffect(() => {
  if (mitraProfile) {
    setBusinessName(mitraProfile.business_name || '');
    setBio(mitraProfile.bio || '');
    setAddress(mitraProfile.address || '');
    setLat(mitraProfile.lat || -6.2);
    setLng(mitraProfile.lng || 106.8);
    setSpecializations(mitraProfile.specializations || []);
  }
}, [mitraProfile]);
```

### 4. Section: Info Card (Non-editable)

Tampilkan:
- Avatar (dari `profiles.avatar_url`)
- Nama lengkap + email
- Badge status verifikasi (`pending` / `verified` / `rejected`)
- Saldo deposit
- Rating rata-rata + total order selesai

### 5. Section: Informasi Usaha (Editable)

Form fields:
- **Nama Bengkel** (`Input`) — wajib
- **Bio** (`Textarea`) — opsional, max 200 karakter
- **Alamat** (`Input`) — wajib

### 6. Section: Lokasi Lapak (Editable) ⭐ PALING PENTING

Gunakan komponen `<LocationPicker />` yang sudah ada di project:

```tsx
<LocationPicker
  value={{ lat, lng }}
  onChange={(loc) => {
    setLat(loc.lat);
    setLng(loc.lng);
  }}
/>
```

Tambahkan keterangan:
```tsx
<p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">
  Geser pin di peta untuk memperbarui lokasi lapak/bengkel Anda. 
  Mitra keliling bisa update lokasi kapan saja.
</p>
```

### 7. Section: Spesialisasi Kendaraan (Editable)

Tampilkan sebagai toggle/checkbox:

```tsx
const VEHICLE_SPECS = [
  { id: 'motor', label: 'Motor', icon: Bike },
  { id: 'mobil', label: 'Mobil', icon: Car },
];

const SKILL_SPECS = ['ban', 'mesin', 'aki', 'kelistrikan', 'rem', 'rantai'];
```

User bisa toggle on/off setiap spesialisasi. Simpan sebagai array di `specializations`.

### 8. Mutation: Simpan Perubahan

```typescript
const saveMutation = useMutation({
  mutationFn: async () => {
    const { error } = await supabase
      .from('mitra_profiles')
      .update({
        business_name: businessName,
        bio: bio || null,
        address: address,
        lat: lat,
        lng: lng,
        specializations: specializations,
      })
      .eq('id', profile!.id);

    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['mitra-profile-full'] });
    toast.success('Profil berhasil diperbarui!');
  },
  onError: () => {
    toast.error('Gagal menyimpan perubahan');
  },
});
```

### 9. Tombol Simpan

```tsx
<Button
  size="lg"
  fullWidth
  isLoading={saveMutation.isPending}
  onClick={() => saveMutation.mutate()}
  leftIcon={<Save className="h-5 w-5" />}
>
  Simpan Perubahan
</Button>
```

---

## Styling Guidelines

- Gunakan class `bg-surface-light dark:bg-surface-dark` untuk background halaman.
- Setiap section dibungkus `<Card>` dengan padding `p-5`.
- Header section menggunakan `font-semibold` + ikon + border-b pemisah.
- Lokasi picker harus full-width dan tinggi minimal 250px.
- Gunakan `pb-24 md:pb-8` agar tidak tertutup bottom nav di mobile.

---

## Validasi

- [ ] Halaman menampilkan data mitra yang benar (nama, bio, alamat, lokasi, spesialisasi)
- [ ] Dapat mengubah nama bengkel → klik Simpan → data terupdate
- [ ] Dapat menggeser pin di peta → lokasi lat/lng berubah → klik Simpan → terupdate
- [ ] Dapat toggle spesialisasi (motor ↔ mobil) → klik Simpan → terupdate
- [ ] Info non-editable (rating, saldo, status verifikasi) tampil benar
- [ ] Loading skeleton muncul saat data belum siap
- [ ] Tampil rapi di mobile (375px) dan desktop (1280px)
- [ ] Dark mode tidak ada elemen yang hilang

---

**Selesai? Lanjut ke folder `03-hak-akses/`**
