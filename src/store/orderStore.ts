import { create } from 'zustand';
import type { Order } from '@/types/order.types';

interface OrderState {
  // Order aktif saat ini (jika ada)
  activeOrder: Order | null;
  isSearching: boolean;

  // Actions
  setActiveOrder: (order: Order | null) => void;
  setIsSearching: (isSearching: boolean) => void;
  updateOrderStatus: (status: Order['status']) => void;
  clearActiveOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  activeOrder: null,
  isSearching: false,

  setActiveOrder: (order) => set({ activeOrder: order }),
  setIsSearching: (isSearching) => set({ isSearching }),

  updateOrderStatus: (status) =>
    set((state) => ({
      activeOrder: state.activeOrder
        ? { ...state.activeOrder, status }
        : null,
    })),

  clearActiveOrder: () => set({ activeOrder: null, isSearching: false }),
}));
