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
