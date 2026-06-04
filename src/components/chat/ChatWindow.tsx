import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { Spinner } from '@/components/ui/Spinner';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/Toast';

interface ChatWindowProps {
  orderId: string;
  /** Tinggi area chat (tanpa input) */
  height?: string;
  /** Apakah chat disabled (misal: order sudah selesai) */
  disabled?: boolean;
}

export function ChatWindow({ orderId, height = '400px', disabled = false }: ChatWindowProps) {
  const { messages, isLoading, isSending, sendMessage, currentUserId } = useChat(orderId);
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (message: string) => {
    try {
      await sendMessage(message);
    } catch {
      toast.error('Gagal mengirim pesan');
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar" style={{ height }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner text={t('common.loading')} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted-light dark:text-text-muted-dark">
            <MessageSquare className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">{t('chat.no_messages', 'Belum ada pesan')}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={disabled} isSending={isSending} />
    </div>
  );
}
