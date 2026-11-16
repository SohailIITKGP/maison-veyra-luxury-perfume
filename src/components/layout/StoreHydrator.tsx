"use client";

import { useEffect } from "react";
import { useAccount } from "@/store/account";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { useUi } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";

/** Restores persisted stores after mount so server and client HTML match. */
export function StoreHydrator() {
  const setHydrated = useUi((s) => s.setHydrated);
  useEffect(() => {
    Promise.all([
      useCart.persist.rehydrate(),
      useWishlist.persist.rehydrate(),
      useOrders.persist.rehydrate(),
      useAccount.persist.rehydrate(),
    ]).finally(setHydrated);
  }, [setHydrated]);
  return null;
}
