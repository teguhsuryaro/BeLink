import { ANTI_BYPASS_PATTERNS } from './constants';

interface FilterResult {
  isFiltered: boolean;
  filteredMessage: string;
  originalMessage: string;
}

/**
 * Filter pesan chat untuk mencegah pertukaran informasi kontak.
 *
 * Yang difilter:
 * - Nomor telepon Indonesia (08xxx, +62xxx, 62xxx)
 * - URL (http://, https://, www.)
 * - Pola angka yang menyerupai nomor telepon (4-4-4 digit)
 *
 * Cara kerja:
 * - Jika pesan mengandung pola terlarang, `isFiltered = true`
 * - `filteredMessage` berisi pesan yang sudah disensor (angka/url diganti dengan ****)
 * - `originalMessage` berisi pesan asli (disimpan di database untuk admin review)
 */
export function filterChatMessage(message: string): FilterResult {
  let filteredMessage = message;
  let isFiltered = false;

  // 1. Cek nomor telepon Indonesia
  if (ANTI_BYPASS_PATTERNS.PHONE.test(message)) {
    filteredMessage = filteredMessage.replace(ANTI_BYPASS_PATTERNS.PHONE, '[***nomor disensor***]');
    isFiltered = true;
  }
  // Reset regex lastIndex (karena global flag)
  ANTI_BYPASS_PATTERNS.PHONE.lastIndex = 0;

  // 2. Cek URL
  if (ANTI_BYPASS_PATTERNS.URL.test(message)) {
    filteredMessage = filteredMessage.replace(ANTI_BYPASS_PATTERNS.URL, '[***link disensor***]');
    isFiltered = true;
  }
  ANTI_BYPASS_PATTERNS.URL.lastIndex = 0;

  // 3. Cek pola angka umum yang mirip nomor telepon
  if (ANTI_BYPASS_PATTERNS.GENERAL_NUMBER.test(message)) {
    filteredMessage = filteredMessage.replace(ANTI_BYPASS_PATTERNS.GENERAL_NUMBER, '[***angka disensor***]');
    isFiltered = true;
  }
  ANTI_BYPASS_PATTERNS.GENERAL_NUMBER.lastIndex = 0;

  // 4. Deteksi upaya menghindari filter menggunakan spasi/separator
  // Misal: "nol delapan satu dua tiga" atau "0 8 1 2 3 4 5 6 7 8 9 0"
  const spacedDigits = message.replace(/[^0-9]/g, '');
  if (spacedDigits.length >= 10 && /^(08|62|628)/.test(spacedDigits)) {
    filteredMessage = '[***pesan mengandung pola kontak***]';
    isFiltered = true;
  }

  return {
    isFiltered,
    filteredMessage: isFiltered ? filteredMessage : message,
    originalMessage: message,
  };
}

/**
 * Daftar kata-kata yang sering digunakan untuk menyebutkan nomor dalam bahasa Indonesia.
 * Bisa digunakan untuk deteksi lebih lanjut di versi mendatang.
 */
export const PHONE_WORD_PATTERNS = [
  /nol\s*delapan/gi,
  /zero\s*eight/gi,
  /wa\s*[.:]\s*\d/gi,
  /whatsapp\s*[.:]\s*\d/gi,
  /telp\s*[.:]\s*\d/gi,
  /telepon\s*[.:]\s*\d/gi,
  /hubungi\s*[.:]\s*\d/gi,
  /contact\s*[.:]\s*\d/gi,
];
