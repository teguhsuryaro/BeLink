# 03 - Komponen Card

## Tujuan
Membuat komponen Card reusable untuk menampilkan konten dalam panel/boks.

---

## Buat File

**BUAT FILE**: `src/components/ui/Card.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-5',
      lg: 'p-5 sm:p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border bg-card-light border-border-light shadow-soft',
          'dark:bg-card-dark dark:border-border-dark dark:shadow-dark-soft',
          'transition-all duration-200',
          hover && 'hover-lift cursor-pointer',
          paddingClasses[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// Card Title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-semibold text-text-primary-light dark:text-text-primary-dark',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

// Card Description
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-text-muted-light dark:text-text-muted-dark', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

// Card Content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('mt-3', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

// Card Footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
```

---

## Validasi

- [ ] File `src/components/ui/Card.tsx` sudah ada
- [ ] Export 6 sub-komponen: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

---

**Selesai? Lanjut ke `04-komponen-badge-dan-skeleton.md`**
