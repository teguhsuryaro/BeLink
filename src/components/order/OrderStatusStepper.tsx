import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { OrderStatus } from '@/types/order.types';

const STEPS = [
  { id: 'agreed', label: 'Deal' },
  { id: 'otw', label: 'OTW' },
  { id: 'arrived', label: 'Tiba' },
  { id: 'in_progress', label: 'Kerja' },
  { id: 'completed', label: 'Selesai' },
];

export function OrderStatusStepper({ currentStatus }: { currentStatus: OrderStatus }) {
  // If not in standard flow, don't show steps normally
  if (['searching', 'negotiating', 'cancelled_user', 'cancelled_mitra', 'expired'].includes(currentStatus)) {
    return null;
  }

  const currentIndex = STEPS.findIndex((s) => s.id === currentStatus);

  return (
    <div className="flex w-full items-center justify-between mt-2">
      {STEPS.map((step, index) => {
        const isCompleted = currentIndex > index || currentStatus === 'completed';
        const isCurrent = currentStatus === step.id;

        return (
          <div key={step.id} className="relative flex flex-1 flex-col items-center">
            {/* Line connecting steps */}
            {index > 0 && (
              <div
                className={cn(
                  'absolute right-[50%] top-4 h-1 w-full -translate-y-1/2',
                  isCompleted || isCurrent ? 'bg-primary' : 'bg-border-light dark:bg-border-dark'
                )}
              />
            )}
            
            {/* Step dot */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300',
                isCompleted
                  ? 'border-success bg-success text-white'
                  : isCurrent
                  ? 'border-primary bg-primary text-white'
                  : 'border-border-light bg-surface-light text-text-muted-light dark:border-border-dark dark:bg-surface-dark dark:text-text-muted-dark'
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : isCurrent ? (
                <motion.div
                  className="h-2 w-2 rounded-full bg-white"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
            
            {/* Label */}
            <span
              className={cn(
                'mt-2 text-[10px] font-medium text-center',
                isCompleted ? 'text-success' : isCurrent ? 'text-primary' : 'text-text-muted-light dark:text-text-muted-dark'
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
