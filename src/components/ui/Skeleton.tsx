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
