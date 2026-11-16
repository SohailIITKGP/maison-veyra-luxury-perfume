"use client";

import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";

export function useAddToBag() {
  const add = useCart((s) => s.add);
  const openBag = useUi((s) => s.openBag);
  return (productSlug: string, variantId: string, quantity = 1) => {
    add(productSlug, variantId, quantity);
    openBag(variantId);
  };
}
