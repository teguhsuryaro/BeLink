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
