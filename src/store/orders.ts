"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Order } from "@/types";

interface OrdersState {
  orders: Order[];
  lastOrderId?: string;
  addOrder: (order: Order) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders], lastOrderId: order.id })),
    }),
    { name: "veyra-orders", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
