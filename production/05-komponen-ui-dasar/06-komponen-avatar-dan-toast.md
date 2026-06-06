# 06 - Komponen Avatar dan Toast

## Tujuan
Membuat komponen Avatar (foto profil dengan fallback inisial) dan konfigurasi Toast.

---

## Buat File Avatar

**BUAT FILE**: `src/components/ui/Avatar.tsx`

```typescript
import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** Menampilkan dot status online/offline */
  showStatus?: boolean;
  isOnline?: boolean;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

const statusSizeClasses = {
  xs: 'h-1.5 w-1.5 -bottom-0 -right-0',
  sm: 'h-2 w-2 -bottom-0 -right-0',
  md: 'h-2.5 w-2.5 bottom-0 right-0',
  lg: 'h-3 w-3 bottom-0.5 right-0.5',
  xl: 'h-4 w-4 bottom-1 right-1',
};

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  showStatus = false,
  isOnline = false,
}: AvatarProps) {
  return (
    <div className="relative inline-flex shrink-0">
      <AvatarPrimitive.Root
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-full',
          'bg-primary-100 dark:bg-primary/20',
          sizeClasses[size],
          className,
        )}
      >
        <AvatarPrimitive.Image
          src={src || undefined}
          alt={name}
          className="h-full w-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center font-semibold text-primary dark:text-primary-300"
          delayMs={100}
        >
          {getInitials(name)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>

      {showStatus && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-card-light dark:border-card-dark',
            statusSizeClasses[size],
            isOnline ? 'bg-success' : 'bg-gray-400 dark:bg-gray-600',
          )}
        />
      )}
    </div>
  );
}
```

## Buat File Toast (wrapper Sonner)

**BUAT FILE**: `src/components/ui/Toast.tsx`

```typescript
import { toast as sonnerToast } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Wrapper toast functions dengan ikon dari Lucide.
 * Menggantikan toast bawaan Sonner agar lebih konsisten.
 *
 * Penggunaan:
 * toast.success('Berhasil disimpan');
 * toast.error('Gagal menyimpan data');
 * toast.warning('Saldo deposit menipis');
 * toast.info('Pesanan baru masuk');
 */
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      icon: <CheckCircle2 className="h-5 w-5 text-success" />,
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      icon: <AlertCircle className="h-5 w-5 text-danger" />,
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      icon: <AlertTriangle className="h-5 w-5 text-warning" />,
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      icon: <Info className="h-5 w-5 text-primary" />,
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  promise: sonnerToast.promise,
};
```

---

## Validasi

- [ ] File `src/components/ui/Avatar.tsx` sudah ada
- [ ] File `src/components/ui/Toast.tsx` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error

---

## Catatan Penting

Setelah semua komponen UI di folder ini selesai, berikut daftar file yang seharusnya ada di `src/components/ui/`:

```
src/components/ui/
├── Avatar.tsx
├── Badge.tsx
├── Button.tsx
├── Card.tsx
├── Input.tsx       (berisi Input + Textarea)
├── Modal.tsx
├── Skeleton.tsx
├── Spinner.tsx
└── Toast.tsx
```

---

**Selesai? Lanjut ke folder `06-layout-dan-navigasi/` → file `01-page-transition-wrapper.md`**
