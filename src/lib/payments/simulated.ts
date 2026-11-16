import type { PaymentProvider } from "./types";

/** Demo provider: confirms the order without contacting any payment network. */
export const simulatedProvider: PaymentProvider = {
  id: "simulated",
  async createCheckout({ orderId, totals }) {
    return { kind: "confirmed", orderId, totals, payment: "simulated" };
  },
};
