# 06 - Real-Time Chat

## Tujuan
Membuat komponen chat real-time antara user dan mitra menggunakan Supabase Realtime.

---

## Langkah-Langkah

### 1. Buat Hook useChat

**BUAT FILE**: `src/hooks/useChat.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { ChatMessage } from '@/types/order.types';

export function useChat(orderId: string | undefined) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);

  // Ambil semua pesan chat
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chats', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('order_id', orderId!)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as ChatMessage[];
    },
    enabled: !!orderId,
  });

  // Subscribe ke pesan baru (real-time)
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`chat:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `order_id=eq.${orderId}`,
        },
        () => {
          // Invalidate cache agar pesan baru muncul
          queryClient.invalidateQueries({ queryKey: ['chats', orderId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);

  // Kirim pesan
  const sendMessage = useCallback(
    async (message: string) => {
      if (!orderId || !profile || !message.trim()) return;

      setIsSending(true);
      try {
        // Anti-bypass filter diterapkan di file berikutnya (07)
        const { error } = await supabase.from('chats').insert({
          order_id: orderId,
          sender_id: profile.id,
          message: message.trim(),
        });

        if (error) throw error;
      } catch (error) {
        console.error('Send message error:', error);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [orderId, profile],
  );

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    currentUserId: profile?.id,
  };
}
```

### 2. Buat Komponen ChatBubble

**BUAT FILE**: `src/components/chat/ChatBubble.tsx`

```typescript
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
```

### 3. Buat Komponen ChatInput

**BUAT FILE**: `src/components/chat/ChatInput.tsx`

```typescript
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
        placeholder={t('chat.placeholder')}
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
```

### 4. Buat Komponen ChatWindow

**BUAT FILE**: `src/components/chat/ChatWindow.tsx`

```typescript
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
            <p className="text-sm">{t('chat.no_messages')}</p>
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
```

---

## Validasi

- [ ] File `src/hooks/useChat.ts` sudah ada
- [ ] File `src/components/chat/ChatBubble.tsx` sudah ada
- [ ] File `src/components/chat/ChatInput.tsx` sudah ada
- [ ] File `src/components/chat/ChatWindow.tsx` sudah ada
- [ ] Pesan baru langsung muncul tanpa refresh (real-time via Supabase)
- [ ] Pesan milik sendiri tampil di kanan (biru), pesan lawan di kiri (abu)
- [ ] Auto-scroll ke bawah saat ada pesan baru
- [ ] Enter untuk kirim, Shift+Enter untuk baris baru

---

**Selesai? Lanjut ke `07-anti-bypass-filter.md`**
