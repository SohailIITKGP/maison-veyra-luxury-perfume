import { brand } from "@/config/brand";
import { resolveLine } from "@/lib/catalog";
import type { PaymentProvider } from "./types";

/**
 * Stripe Checkout (hosted page) via the REST API — no SDK dependency.
 * Enabled only when STRIPE_SECRET_KEY is a *test* key (sk_test_…).
 * Not exercised in the public demo, which has no Stripe credentials.
 * Production also needs a webhook (checkout.session.completed) to mark
 * orders as paid server-side.
 */
export function createStripeProvider(secretKey: string): PaymentProvider {
  return {
    id: "stripe-test",
    async createCheckout({ orderId, request, totals, origin }) {
      const body = new URLSearchParams();
      body.set("mode", "payment");
      body.set("customer_email", request.email);
      body.set("client_reference_id", orderId);
      body.set("success_url", `${origin}/checkout/confirmation?order=${orderId}`);
      body.set("cancel_url", `${origin}/checkout`);
      request.lines.forEach((line, i) => {
        const r = resolveLine(line.productSlug, line.variantId)!;
        body.set(`line_items[${i}][quantity]`, String(line.quantity));
        body.set(`line_items[${i}][price_data][currency]`, brand.currency.toLowerCase());
        body.set(`line_items[${i}][price_data][unit_amount]`, String(r.variant.price));
        body.set(`line_items[${i}][price_data][product_data][name]`, `${r.product.name} — ${r.variant.label}`);
      });
      if (totals.shipping > 0) {
        const n = request.lines.length;
        body.set(`line_items[${n}][quantity]`, "1");
        body.set(`line_items[${n}][price_data][currency]`, brand.currency.toLowerCase());
        body.set(`line_items[${n}][price_data][unit_amount]`, String(totals.shipping));
        body.set(`line_items[${n}][price_data][product_data][name]`, "Shipping");
      }
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) throw new Error(`Stripe returned ${res.status}`);
      const session = (await res.json()) as { url: string };
      return { kind: "redirect", orderId, totals, url: session.url, payment: "stripe-test" };
    },
  };
}
