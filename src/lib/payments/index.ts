import { simulatedProvider } from "./simulated";
import { createStripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

export type { CheckoutRequest, CheckoutResult, PaymentProvider } from "./types";

/** Server-only: picks the provider from environment configuration. */
export function getPaymentProvider(): PaymentProvider {
  const key = process.env.STRIPE_SECRET_KEY;
  if (key && key.startsWith("sk_test_")) return createStripeProvider(key);
  return simulatedProvider;
}

export function paymentMode(): PaymentProvider["id"] {
  return getPaymentProvider().id;
}
