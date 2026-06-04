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
