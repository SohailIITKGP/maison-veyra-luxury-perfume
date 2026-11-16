import { NextResponse } from "next/server";
import { brand } from "@/config/brand";
import { resolveLine } from "@/lib/catalog";
import { getPaymentProvider, type CheckoutRequest } from "@/lib/payments";
import { computeTotals } from "@/lib/pricing";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body: unknown): { ok: true; data: CheckoutRequest } | { ok: false; error: string } {
  const b = body as Partial<CheckoutRequest> | null;
  if (!b || typeof b !== "object") return { ok: false, error: "Invalid request." };
  if (typeof b.email !== "string" || !EMAIL.test(b.email)) return { ok: false, error: "A valid email is required." };
  const a = b.address;
  if (!a || !["firstName", "lastName", "line1", "city", "postalCode", "country"].every((k) => typeof a[k as keyof typeof a] === "string" && String(a[k as keyof typeof a]).trim())) {
    return { ok: false, error: "A complete shipping address is required." };
  }
  if (!brand.commerce.shippingMethods.some((m) => m.id === b.shippingMethod)) return { ok: false, error: "Unknown shipping method." };
  if (!Array.isArray(b.lines) || b.lines.length === 0 || b.lines.length > 50) return { ok: false, error: "Your bag is empty." };
  for (const l of b.lines) {
    if (!l || !resolveLine(l.productSlug, l.variantId)) return { ok: false, error: "An item in your bag is no longer available." };
    if (!Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > brand.commerce.maxQuantity) return { ok: false, error: "Invalid quantity." };
  }
  return { ok: true, data: b as CheckoutRequest };
}

/**
 * Creates an order. Prices are recomputed from the catalogue on the server —
 * the browser never decides what is charged. The provider is chosen by
 * environment: simulated (default) or Stripe Checkout in test mode.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const result = validate(json);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 422 });

  const totals = computeTotals(result.data.lines, result.data.shippingMethod);
  const orderId = `MV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const origin = new URL(request.url).origin;
  try {
    const checkout = await getPaymentProvider().createCheckout({ orderId, request: result.data, totals, origin });
    return NextResponse.json(checkout);
  } catch {
    return NextResponse.json({ error: "Payment could not be started. Please try again." }, { status: 502 });
  }
}
