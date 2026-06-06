# 09 - Review dan Rating

## Tujuan
Membuat modal review yang muncul setelah order selesai — user bisa memberi rating 1-5 bintang dan komentar.

---

## Langkah-Langkah

### 1. Buat Komponen StarRating

**BUAT FILE**: `src/components/order/StarRating.tsx`

```typescript
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function StarRating({ value, onChange, size = 'md', readOnly = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);

        return (
          <motion.button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            whileTap={readOnly ? {} : { scale: 1.3 }}
            className={cn(
              'transition-colors duration-150',
              readOnly ? 'cursor-default' : 'cursor-pointer',
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                isFilled
                  ? 'fill-warning text-warning'
                  : 'fill-transparent text-gray-300 dark:text-gray-600',
              )}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
```

### 2. Buat Komponen ReviewModal

**BUAT FILE**: `src/components/order/ReviewModal.tsx`

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, type ReviewFormData } from '@/lib/validators';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { StarRating } from './StarRating';
import { toast } from '@/components/ui/Toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/types/order.types';

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export function ReviewModal({ open, onOpenChange, order }: ReviewModalProps) {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!profile || !order.mitra_id || rating === 0) {
      toast.warning('Pilih rating terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('order_reviews').insert({
        order_id: order.id,
        reviewer_id: profile.id,
        reviewee_id: order.mitra_id,
        rating: rating,
        comment: data.comment || null,
      });

      if (error) {
        if (error.code === '23505') {
          // Unique constraint — sudah pernah review
          toast.info('Kamu sudah memberikan ulasan untuk pesanan ini');
        } else {
          throw error;
        }
      } else {
        toast.success(t('review.thank_you'));
      }

      reset();
      setRating(0);
      onOpenChange(false);
    } catch (err: any) {
      toast.error('Gagal mengirim ulasan', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t('review.title')}
      description={t('review.subtitle')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star Rating */}
        <div className="flex flex-col items-center gap-2 py-2">
          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            {t('review.rating_label')}
          </p>
          <StarRating value={rating} onChange={setRating} size="lg" />
          {rating === 0 && (
            <p className="text-xs text-danger">Pilih rating</p>
          )}
        </div>

        {/* Komentar */}
        <Textarea
          label={t('review.comment_label')}
          placeholder={t('review.comment_placeholder')}
          {...register('comment')}
          error={errors.comment?.message}
          rows={3}
        />

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isSubmitting}
          disabled={rating === 0}
        >
          {t('review.submit')}
        </Button>
      </form>
    </Modal>
  );
}
```

---

## Validasi

- [ ] File `src/components/order/StarRating.tsx` sudah ada
- [ ] File `src/components/order/ReviewModal.tsx` sudah ada
- [ ] Star rating: hover effect bintang, klik untuk pilih, animasi scale saat tap
- [ ] ReviewModal muncul setelah order selesai
- [ ] Submit review → data masuk ke tabel `order_reviews`
- [ ] Trigger `update_mitra_rating` otomatis update rata-rata rating mitra
- [ ] Review kedua kali → toast info "Kamu sudah memberikan ulasan"

---

**Selesai? Lanjut ke `10-halaman-riwayat-order.md`**
