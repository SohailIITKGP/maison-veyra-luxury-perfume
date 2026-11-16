"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { brand } from "@/config/brand";
import { resolveLine } from "@/lib/catalog";
import type { CartLine } from "@/types";

interface CartState {
  lines: CartLine[];
  add: (productSlug: string, variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  changeVariant: (fromVariantId: string, toVariantId: string) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

const clamp = (n: number) => Math.max(1, Math.min(brand.commerce.maxQuantity, Math.round(n)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (productSlug, variantId, quantity = 1) =>
        set((s) => {
          if (!resolveLine(productSlug, variantId)) return s;
          const existing = s.lines.find((l) => l.variantId === variantId);
          if (existing) {
            return {
              lines: s.lines.map((l) => (l.variantId === variantId ? { ...l, quantity: clamp(l.quantity + quantity) } : l)),
            };
          }
          return { lines: [...s.lines, { productSlug, variantId, quantity: clamp(quantity) }] };
        }),
      setQuantity: (variantId, quantity) =>
        set((s) => ({ lines: s.lines.map((l) => (l.variantId === variantId ? { ...l, quantity: clamp(quantity) } : l)) })),
      changeVariant: (from, to) =>
        set((s) => {
          const line = s.lines.find((l) => l.variantId === from);
          if (!line || from === to) return s;
          const target = s.lines.find((l) => l.variantId === to);
          const rest = s.lines.filter((l) => l.variantId !== from && l.variantId !== to);
          const merged = { ...line, variantId: to, quantity: clamp(line.quantity + (target?.quantity ?? 0)) };
          const index = s.lines.findIndex((l) => l.variantId === from);
          rest.splice(Math.min(index, rest.length), 0, merged);
          return { lines: rest };
        }),
      remove: (variantId) => set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "veyra-bag",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // Drop anything that no longer exists in the catalogue.
      merge: (persisted, current) => {
        const lines = ((persisted as Partial<CartState>)?.lines ?? []).filter((l) => resolveLine(l.productSlug, l.variantId));
        return { ...current, lines };
      },
    },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
