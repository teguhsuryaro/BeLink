# 04 - Komponen Badge dan Skeleton

## Tujuan
Membuat komponen Badge (untuk status) dan Skeleton (untuk loading placeholder).

---

## Buat File Badge

**BUAT FILE**: `src/components/ui/Badge.tsx`

```typescript
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-50 text-primary-700 dark:bg-primary/20 dark:text-primary-300',
        success: 'bg-success-light text-success-dark dark:bg-success/20 dark:text-success',
        warning: 'bg-warning-light text-warning-dark dark:bg-warning/20 dark:text-warning',
        danger: 'bg-danger-light text-danger-dark dark:bg-danger/20 dark:text-danger',
        neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        outline: 'border border-border-light text-text-muted-light dark:border-border-dark dark:text-text-muted-dark',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean; // Menampilkan dot kecil di samping teks
  dotColor?: string; // Warna dot (Tailwind class)
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot, dotColor, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              dotColor || 'bg-current',
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
```

## Buat File Skeleton

**BUAT FILE**: `src/components/ui/Skeleton.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bentuk skeleton */
  variant?: 'rectangular' | 'circular' | 'text';
  /** Lebar (hanya untuk circular) */
  width?: number | string;
  /** Tinggi */
  height?: number | string;
}

function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-border-light dark:bg-border-dark',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        variant === 'text' && 'rounded-md',
        className,
      )}
      style={{
        width: width ?? (variant === 'circular' ? 40 : '100%'),
        height:
          height ??
          (variant === 'circular'
            ? width ?? 40
            : variant === 'text'
            ? 16
            : 'auto'),
      }}
      {...props}
    />
  );
}

/**
 * Skeleton preset: Card loading
 */
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" height={14} />
          <Skeleton variant="text" className="w-1/2" height={12} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" height={12} />
        <Skeleton variant="text" className="w-5/6" height={12} />
        <Skeleton variant="text" className="w-2/3" height={12} />
      </div>
    </div>
  );
}

/**
 * Skeleton preset: List item
 */
function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton variant="circular" width={44} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-1/2" height={14} />
        <Skeleton variant="text" className="w-3/4" height={12} />
      </div>
      <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonListItem };
```

---

## Validasi

- [ ] File `src/components/ui/Badge.tsx` sudah ada
- [ ] File `src/components/ui/Skeleton.tsx` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error

---

**Selesai? Lanjut ke `05-komponen-modal-dan-spinner.md`**
