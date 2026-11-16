import type { Metadata } from "next";
import { BagView } from "@/components/cart/BagView";

export const metadata: Metadata = { title: "Shopping Bag", robots: { index: false } };

export default function BagPage() {
  return (
    <div className="container-veyra pt-14 pb-28 md:pt-20">
      <h1 className="display mb-10 text-[3.2rem] md:text-[4.5rem]">Shopping bag</h1>
      <BagView />
    </div>
  );
}
