import { useState, useEffect, useCallback } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { filterChatMessage } from '@/lib/chatFilter';
import { toast } from '@/components/ui/Toast';
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
        // Terapkan filter anti-bypass
        const filtered = filterChatMessage(message.trim());

        const { error } = await supabase.from('chats').insert({
          order_id: orderId,
          sender_id: profile.id,
          message: filtered.filteredMessage,
          is_filtered: filtered.isFiltered,
          original_message: filtered.isFiltered ? filtered.originalMessage : null,
        });

        if (error) throw error;

        // Beritahu user jika pesannya difilter
        if (filtered.isFiltered) {
          toast.warning(
            'Pesan difilter',
            'Pesan mengandung nomor telepon atau link yang tidak diizinkan. Harap gunakan fitur chat untuk komunikasi.'
          );
        }
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
