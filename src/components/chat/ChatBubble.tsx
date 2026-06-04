import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import type { ChatMessage } from '@/types/order.types';
import { useTranslation } from 'react-i18next';

interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5',
          isOwn
            ? 'rounded-br-md bg-primary text-white'
            : 'rounded-bl-md bg-gray-100 text-text-primary-light dark:bg-gray-800 dark:text-text-primary-dark',
        )}
      >
        {message.is_filtered ? (
          <p className="italic text-sm opacity-60 line-through">
            {t('chat.filtered_message')}
          </p>
        ) : (
          <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
        )}
        <p
          className={cn(
            'mt-1 text-[10px]',
            isOwn ? 'text-white/60' : 'text-text-muted-light dark:text-text-muted-dark',
          )}
        >
          {formatRelativeTime(message.created_at, i18n.language)}
        </p>
      </div>
    </div>
  );
}
