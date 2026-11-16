import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { paymentMode } from "@/lib/payments";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container-veyra pt-14 pb-28 md:pt-20">
      <p className="eyebrow text-bronze-deep">Secure checkout · Demo</p>
      <h1 className="display mt-4 mb-10 text-[3.2rem] md:text-[4.5rem]">Checkout</h1>
      <CheckoutFlow paymentMode={paymentMode()} />
    </div>
  );
}
