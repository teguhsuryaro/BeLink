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
