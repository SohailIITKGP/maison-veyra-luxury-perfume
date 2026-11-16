"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { useHydrated } from "@/hooks/useHydrated";
import { computeTotals } from "@/lib/pricing";
import { selectCount, useCart } from "@/store/cart";
import { LineItem } from "./LineItem";
import { OrderSummary } from "./OrderSummary";
import { ShippingProgress } from "./ShippingProgress";

export function BagView() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const count = useCart(selectCount);
  const totals = computeTotals(lines, "standard");

  if (!hydrated) return <div className="h-96" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center border-t border-line py-24 text-center md:py-32">
        <p className="display text-[2.6rem] md:text-[3.4rem]">Your bag is empty.</p>
        <p className="mt-4 max-w-sm text-stone">A fragrance is easier to choose once you have worn it. The Discovery Set holds all six.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/shop">Explore the collection</ButtonLink>
          <ButtonLink href="/fragrances/discovery-set" variant="outline">
            Discovery Set
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <p className="border-t border-line pt-5 text-sm text-stone">
          {count} {count === 1 ? "item" : "items"}
        </p>
        <ul className="divide-y divide-line border-b border-line">
          {lines.map((line) => (
            <LineItem key={line.variantId} line={line} />
          ))}
        </ul>
        <Link href="/shop" className="link-line label mt-8 text-[0.6875rem]">
          Continue shopping
        </Link>
      </div>
      <aside className="lg:col-span-5" aria-labelledby="summary-title">
        <div className="bg-paper p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 id="summary-title" className="label">
            Order summary
          </h2>
          <div className="mt-6">
            <ShippingProgress subtotal={totals.subtotal} />
          </div>
          <div className="mt-8">
            <OrderSummary totals={totals} shippingLabel="Standard shipping" />
          </div>
          <ButtonLink href="/checkout" className="mt-8 w-full">
            Proceed to checkout
          </ButtonLink>
          <p className="mt-4 text-center text-xs text-stone">Express delivery can be chosen at checkout.</p>
        </div>
      </aside>
    </div>
  );
}
