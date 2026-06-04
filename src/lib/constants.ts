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
