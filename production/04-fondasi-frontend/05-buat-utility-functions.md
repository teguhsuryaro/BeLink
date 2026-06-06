# 05 - Buat Utility Functions

## Tujuan
Membuat helper functions yang akan digunakan di seluruh aplikasi: `cn()`, `formatIDR()`, dan fungsi-fungsi utilitas lainnya.

---

## Langkah-Langkah

### 1. Buat File Utils

**BUAT FILE**: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { id as idLocale, enUS } from 'date-fns/locale';

/**
 * Menggabungkan className secara kondisional dengan Tailwind merge.
 * Menghindari konflik class Tailwind (misal: "p-2 p-4" menjadi "p-4").
 *
 * Contoh penggunaan:
 * cn('p-4 bg-white', isActive && 'bg-primary text-white', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka menjadi format Rupiah Indonesia.
 *
 * Contoh: formatIDR(25000) → "Rp25.000"
 * Contoh: formatIDR(2500000) → "Rp2.500.000"
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka menjadi format pendek.
 *
 * Contoh: formatCompact(1500) → "1.5K"
 * Contoh: formatCompact(1000000) → "1M"
 */
export function formatCompact(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1).replace('.0', '')}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1).replace('.0', '')}K`;
  }
  return amount.toString();
}

/**
 * Format tanggal ke format yang mudah dibaca.
 *
 * Contoh: formatDate('2024-01-15T10:30:00Z') → "15 Jan 2024, 10:30"
 */
export function formatDate(date: string | Date, locale: string = 'id'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateLocale = locale === 'id' ? idLocale : enUS;

  return format(dateObj, 'd MMM yyyy, HH:mm', { locale: dateLocale });
}

/**
 * Format tanggal menjadi relatif (misal: "5 menit lalu").
 */
export function formatRelativeTime(date: string | Date, locale: string = 'id'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateLocale = locale === 'id' ? idLocale : enUS;

  return formatDistanceToNow(dateObj, { addSuffix: true, locale: dateLocale });
}

/**
 * Format jarak dalam kilometer.
 *
 * Contoh: formatDistance(3.5) → "3.5 km"
 * Contoh: formatDistance(0.3) → "300 m"
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Mendapatkan inisial dari nama lengkap.
 *
 * Contoh: getInitials("John Doe") → "JD"
 * Contoh: getInitials("Ahmad") → "A"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Delay utility (untuk animasi atau debounce).
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mendapatkan URL publik file di Supabase Storage.
 */
export function getStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Validasi apakah string adalah URL.
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncate string jika terlalu panjang.
 *
 * Contoh: truncate("Ini adalah teks yang sangat panjang", 20) → "Ini adalah teks ya..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Generate warna status badge berdasarkan status order.
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    searching: 'bg-primary-50 text-primary-700 dark:bg-primary/20 dark:text-primary-300',
    negotiating: 'bg-warning-light text-warning-dark dark:bg-warning/20 dark:text-warning',
    agreed: 'bg-success-light text-success-dark dark:bg-success/20 dark:text-success',
    otw: 'bg-primary-100 text-primary-800 dark:bg-primary/20 dark:text-primary-300',
    arrived: 'bg-primary-200 text-primary-900 dark:bg-primary/30 dark:text-primary-200',
    in_progress: 'bg-warning-light text-warning-dark dark:bg-warning/20 dark:text-warning',
    completed: 'bg-success-light text-success-dark dark:bg-success/20 dark:text-success',
    cancelled_user: 'bg-danger-light text-danger-dark dark:bg-danger/20 dark:text-danger',
    cancelled_mitra: 'bg-danger-light text-danger-dark dark:bg-danger/20 dark:text-danger',
    expired: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}
```

---

## Validasi

- [ ] File `src/lib/utils.ts` sudah ada
- [ ] Import `clsx`, `twMerge`, dan `date-fns` tidak error (semua dependency sudah terinstall)
- [ ] Jalankan `npm run dev` — tidak ada error TypeScript

---

**Selesai? Lanjut ke `06-buat-konstanta-dan-types.md`**
