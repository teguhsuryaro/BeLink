import { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  isSending?: boolean;
}

export function ChatInput({ onSend, disabled = false, isSending = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleSend = async () => {
    if (!message.trim() || disabled || isSending) return;

    const msg = message;
    setMessage('');
    try {
      await onSend(msg);
    } catch {
      setMessage(msg); // Restore message if send fails
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-border-light bg-card-light p-3 dark:border-border-dark dark:bg-card-dark">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('chat.placeholder', 'Ketik pesan...')}
        disabled={disabled}
        className={cn(
          'flex-1 rounded-full border border-border-light bg-surface-light px-4 py-2 text-sm',
          'placeholder:text-text-muted-light',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          'dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-muted-dark',
          'transition-colors duration-200',
        )}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled || isSending}
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          'bg-primary text-white transition-all duration-200',
          'hover:bg-primary-dark active:scale-95',
          'disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
