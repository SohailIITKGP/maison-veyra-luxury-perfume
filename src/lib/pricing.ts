import { brand } from "@/config/brand";
import { resolveLine } from "@/lib/catalog";
import type { CartLine, OrderTotals } from "@/types";

export function shippingCost(subtotal: number, methodId: string) {
  const method = brand.commerce.shippingMethods.find((m) => m.id === methodId) ?? brand.commerce.shippingMethods[0];
  if (subtotal === 0) return 0;
  if (method.id === "standard" && subtotal >= brand.commerce.freeShippingThreshold) return 0;
  return method.price;
}

export function subtotalOf(lines: CartLine[]) {
  return lines.reduce((sum, line) => {
    const resolved = resolveLine(line.productSlug, line.variantId);
    return resolved ? sum + resolved.variant.price * line.quantity : sum;
  }, 0);
}

/**
 * Single source of truth for totals. Used by the bag, the checkout summary
 * and the /api/checkout route, which recomputes totals server-side from the
 * catalogue rather than trusting prices sent by the browser.
 */
export function computeTotals(lines: CartLine[], methodId = "standard"): OrderTotals {
  const subtotal = subtotalOf(lines);
  const shipping = shippingCost(subtotal, methodId);
  const tax = Math.round(subtotal * brand.commerce.taxRate);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

export function remainingForFreeShipping(subtotal: number) {
  return Math.max(0, brand.commerce.freeShippingThreshold - subtotal);
}
