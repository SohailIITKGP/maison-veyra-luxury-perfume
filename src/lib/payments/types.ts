import type { Address, CartLine, OrderTotals } from "@/types";

export interface CheckoutRequest {
  email: string;
  address: Address;
  shippingMethod: string;
  lines: CartLine[];
}

export type CheckoutResult =
  | { kind: "confirmed"; orderId: string; totals: OrderTotals; payment: "simulated" }
  | { kind: "redirect"; orderId: string; totals: OrderTotals; url: string; payment: "stripe-test" };

/**
 * A payment provider turns a validated order into either an immediate
 * confirmation (simulated) or a hosted-checkout redirect (Stripe, PayPal,
 * regional gateways). Card data never touches this application.
 */
export interface PaymentProvider {
  id: "simulated" | "stripe-test";
  createCheckout(input: {
    orderId: string;
    request: CheckoutRequest;
    totals: OrderTotals;
    origin: string;
  }): Promise<CheckoutResult>;
}
