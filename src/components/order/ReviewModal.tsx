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
        toast.success(t('review.thank_you', 'Terima kasih atas ulasan Anda'));
      }

      reset();
      setRating(0);
      onOpenChange(false);
    } catch (err: any) {
      toast.error('Gagal mengirim ulasan');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t('review.title', 'Beri Ulasan')}
      description={t('review.subtitle', 'Bagaimana pengalaman Anda dengan mekanik ini?')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star Rating */}
        <div className="flex flex-col items-center gap-2 py-2">
          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            {t('review.rating_label', 'Rating')}
          </p>
          <StarRating value={rating} onChange={setRating} size="lg" />
          {rating === 0 && (
            <p className="text-xs text-danger">Pilih rating</p>
          )}
        </div>

        {/* Komentar */}
        <Textarea
          label={t('review.comment_label', 'Komentar (Opsional)')}
          placeholder={t('review.comment_placeholder', 'Ceritakan pengalaman Anda...')}
          {...register('comment')}
          error={errors.comment?.message}
          rows={3}
        />

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
          disabled={rating === 0}
        >
          {t('review.submit', 'Kirim Ulasan')}
        </Button>
      </form>
    </Modal>
  );
}
