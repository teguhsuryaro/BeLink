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
