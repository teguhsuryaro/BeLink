# 06 - Buat Konstanta dan Types

## Tujuan
Mendefinisikan semua konstanta bisnis dan TypeScript type definitions yang digunakan di seluruh aplikasi.

---

## Langkah-Langkah

### 1. Buat File Konstanta

**BUAT FILE**: `src/lib/constants.ts`

```typescript
// ============================================
// BeLink — Business Constants
// ============================================

/**
 * Rate komisi platform (10%)
 */
export const COMMISSION_RATE = 0.10;

/**
 * Harga minimum per kilometer (Rp5.000)
 */
export const MIN_PRICE_PER_KM = 5000;

/**
 * Saldo deposit minimum untuk mitra (Rp10.000)
 */
export const MIN_DEPOSIT_BALANCE = 10000;

/**
 * Batas saldo deposit rendah (soft alert) (Rp12.000)
 */
export const LOW_DEPOSIT_THRESHOLD = 12000;

/**
 * Radius pencarian mitra default (dalam km)
 */
export const DEFAULT_SEARCH_RADIUS_KM = 15;

/**
 * Maksimum ukuran file upload (dalam bytes)
 */
export const MAX_FILE_SIZE = {
  AVATAR: 2 * 1024 * 1024,        // 2MB
  VEHICLE_PHOTO: 5 * 1024 * 1024,  // 5MB
  DAMAGE_PHOTO: 5 * 1024 * 1024,   // 5MB
  DOCUMENT: 5 * 1024 * 1024,       // 5MB
};

/**
 * Tipe file yang diterima untuk upload
 */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Daftar jenis kerusakan yang bisa dipilih
 */
export const DAMAGE_TYPES = [
  'ban_bocor',
  'mesin_mati',
  'aki_soak',
  'rantai_putus',
  'rem_blong',
  'kelistrikan',
  'lainnya',
] as const;

/**
 * Daftar status order
 */
export const ORDER_STATUSES = [
  'searching',
  'negotiating',
  'agreed',
  'otw',
  'arrived',
  'in_progress',
  'completed',
  'cancelled_user',
  'cancelled_mitra',
  'expired',
] as const;

/**
 * Status order yang dianggap "aktif" (belum selesai)
 */
export const ACTIVE_ORDER_STATUSES = [
  'searching',
  'negotiating',
  'agreed',
  'otw',
  'arrived',
  'in_progress',
] as const;

/**
 * Daftar role yang ada
 */
export const USER_ROLES = [
  'user',
  'mitra_independen',
  'mitra_bengkel',
  'superadmin',
] as const;

/**
 * OSRM API endpoint (gratis, tanpa API key)
 */
export const OSRM_API_URL = 'https://router.project-osrm.org';

/**
 * OpenStreetMap tile URL
 */
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/**
 * Default map center (Jakarta, Indonesia)
 */
export const DEFAULT_MAP_CENTER: [number, number] = [-6.2088, 106.8456];
export const DEFAULT_MAP_ZOOM = 13;

/**
 * Regex patterns untuk anti-bypass filter
 */
export const ANTI_BYPASS_PATTERNS = {
  PHONE: /(\+62|62|08)\d{8,12}/g,
  URL: /(https?:\/\/|www\.)[^\s]+/gi,
  GENERAL_NUMBER: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
};

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  VEHICLES: 'vehicles',
  DAMAGES: 'damages',
  DOCUMENTS: 'documents',
} as const;
```

### 2. Buat File Types — User

**BUAT FILE**: `src/types/user.types.ts`

```typescript
import type { USER_ROLES } from '@/lib/constants';

export type UserRole = (typeof USER_ROLES)[number];

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_banned: boolean;
  is_online: boolean;
  language_preference: 'id' | 'en';
  theme_preference: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface MitraProfile {
  id: string;
  business_name: string | null;
  bio: string | null;
  ktp_url: string | null;
  selfie_url: string | null;
  workshop_photo_url: string | null;
  lat: number | null;
  lng: number | null;
  address: string | null;
  deposit_balance: number;
  total_orders_completed: number;
  average_rating: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  is_accepting_orders: boolean;
  max_concurrent_orders: number;
  specializations: string[];
  created_at: string;
}

export interface MitraWithProfile extends MitraProfile {
  profiles: Profile;
}
```

### 3. Buat File Types — Order

**BUAT FILE**: `src/types/order.types.ts`

```typescript
import type { ORDER_STATUSES, DAMAGE_TYPES } from '@/lib/constants';
import type { Profile, MitraProfile } from './user.types';

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type DamageType = (typeof DAMAGE_TYPES)[number];
export type VehicleType = 'motor' | 'mobil';

export interface Order {
  id: string;
  user_id: string;
  mitra_id: string | null;
  vehicle_type: VehicleType;
  vehicle_brand: string | null;
  vehicle_photo_url: string | null;
  damage_type: string | null;
  damage_description: string | null;
  damage_photo_url: string | null;
  user_lat: number;
  user_lng: number;
  user_address: string | null;
  mitra_lat: number | null;
  mitra_lng: number | null;
  route_distance_km: number | null;
  price_per_km: number;
  travel_fee: number;
  platform_commission: number | null;
  status: OrderStatus;
  agreed_at: string | null;
  otw_at: string | null;
  arrived_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  user: Profile;
  mitra: (Profile & { mitra_profile: MitraProfile }) | null;
}

export interface OrderReview {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  order_id: string;
  sender_id: string;
  message: string;
  is_filtered: boolean;
  original_message: string | null;
  created_at: string;
}

export interface DepositTransaction {
  id: string;
  mitra_id: string;
  order_id: string | null;
  type: 'topup' | 'commission_deduction';
  amount: number;
  balance_after: number;
  notes: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  order_id: string | null;
  reason: string;
  status: 'open' | 'reviewed' | 'resolved' | 'dismissed';
  admin_notes: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'order' | 'chat' | 'deposit' | 'system' | 'review';
  is_read: boolean;
  related_order_id: string | null;
  created_at: string;
}
```

### 4. Buat File Types — Mitra

**BUAT FILE**: `src/types/mitra.types.ts`

```typescript
import type { MitraProfile, Profile } from './user.types';

/**
 * Data mitra yang ditampilkan saat pencarian
 */
export interface SearchableMitra {
  id: string;
  full_name: string;
  avatar_url: string | null;
  business_name: string | null;
  lat: number;
  lng: number;
  average_rating: number;
  total_orders_completed: number;
  distance_km?: number; // Dihitung di client dari posisi user
}

/**
 * Data lengkap mitra untuk dashboard
 */
export interface MitraDashboardData {
  profile: Profile;
  mitra_profile: MitraProfile;
  active_orders_count: number;
  today_earnings: number;
  this_month_earnings: number;
}

/**
 * Data registrasi mitra baru
 */
export interface MitraRegistrationForm {
  business_name: string;
  bio: string;
  address: string;
  lat: number;
  lng: number;
  ktp_file: File;
  selfie_file: File;
  workshop_photo_file?: File;
}
```

### 5. Buat File Validators (Zod Schemas)

**BUAT FILE**: `src/lib/validators.ts`

```typescript
import { z } from 'zod';
import { MIN_PRICE_PER_KM, DAMAGE_TYPES, MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from './constants';

/**
 * Schema registrasi user baru
 */
export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'Nama minimal 2 karakter')
      .max(100, 'Nama maksimal 100 karakter'),
    email: z
      .string()
      .email('Format email tidak valid'),
    password: z
      .string()
      .min(6, 'Kata sandi minimal 6 karakter'),
    confirm_password: z
      .string(),
    phone: z
      .string()
      .optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Kata sandi tidak cocok',
    path: ['confirm_password'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schema login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema form pemesanan darurat
 */
export const orderFormSchema = z.object({
  vehicle_type: z.enum(['motor', 'mobil']),
  vehicle_brand: z.string().optional(),
  damage_type: z.enum(DAMAGE_TYPES).optional(),
  damage_description: z.string().optional(),
  user_lat: z.number(),
  user_lng: z.number(),
  user_address: z.string().optional(),
  price_per_km: z
    .number()
    .min(MIN_PRICE_PER_KM, `Harga minimum Rp${MIN_PRICE_PER_KM.toLocaleString('id-ID')}/km`),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

/**
 * Schema registrasi mitra
 */
export const mitraRegistrationSchema = z.object({
  business_name: z
    .string()
    .min(2, 'Nama bengkel minimal 2 karakter')
    .max(100, 'Nama bengkel maksimal 100 karakter'),
  bio: z
    .string()
    .max(500, 'Bio maksimal 500 karakter')
    .optional(),
  address: z
    .string()
    .min(5, 'Alamat minimal 5 karakter'),
  lat: z.number(),
  lng: z.number(),
});

export type MitraRegistrationFormData = z.infer<typeof mitraRegistrationSchema>;

/**
 * Schema edit profil
 */
export const editProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  phone: z
    .string()
    .optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

/**
 * Schema review order
 */
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating minimal 1')
    .max(5, 'Rating maksimal 5'),
  comment: z
    .string()
    .max(500, 'Komentar maksimal 500 karakter')
    .optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

/**
 * Validasi file upload
 */
export function validateFile(
  file: File,
  maxSize: number = MAX_FILE_SIZE.DAMAGE_PHOTO,
): { valid: boolean; error?: string } {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Format file harus JPG, PNG, atau WebP' };
  }
  if (file.size > maxSize) {
    const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `Ukuran file maksimal ${maxMB}MB` };
  }
  return { valid: true };
}
```

---

## Validasi

- [ ] File `src/lib/constants.ts` sudah ada
- [ ] File `src/types/user.types.ts` sudah ada
- [ ] File `src/types/order.types.ts` sudah ada
- [ ] File `src/types/mitra.types.ts` sudah ada
- [ ] File `src/lib/validators.ts` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error TypeScript

---

**Selesai? Lanjut ke `07-buat-zustand-stores.md`**
