import type { Metadata } from "next";
import { Confirmation } from "@/components/checkout/Confirmation";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default function ConfirmationPage() {
  return (
    <div className="container-veyra pt-14 pb-28 md:pt-20">
      <Confirmation />
    </div>
  );
}
