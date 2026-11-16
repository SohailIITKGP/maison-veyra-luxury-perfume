"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { DemoNote } from "@/components/ui/DemoNote";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice } from "@/lib/format";
import { useOrders } from "@/store/orders";

export function Confirmation() {
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.id === s.lastOrderId));

  if (!hydrated) return <div className="h-96" aria-busy="true" />;
  if (!order) {
    return (
      <div className="py-24 text-center">
        <h1 className="display text-[3rem]">No recent order</h1>
        <p className="mt-4 text-stone">Orders you place in this browser will appear here and in your account.</p>
        <ButtonLink href="/shop" className="mt-8">
          Explore the collection
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6">
        <p className="eyebrow text-bronze-deep">Order {order.id}</p>
        <h1 className="display mt-4 text-[3.2rem] md:text-[4.8rem]">
          Thank you, <em>{order.address.firstName}.</em>
        </h1>
        <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink/80">
          Your order has been received. A confirmation would be sent to <span className="text-charcoal">{order.email}</span>, and your fragrances wrapped by hand
          before they leave the house.
        </p>
        <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
          <div>
            <dt className="text-stone">Delivering to</dt>
            <dd className="mt-1">
              {order.address.firstName} {order.address.lastName}
              <br />
              {order.address.line1}
              <br />
              {order.address.city} {order.address.postalCode}
              <br />
              {order.address.country}
            </dd>
          </div>
          <div>
            <dt className="text-stone">Method</dt>
            <dd className="mt-1">{order.shippingMethod}</dd>
            <dt className="mt-4 text-stone">Payment</dt>
            <dd className="mt-1">{order.payment === "simulated" ? "Simulated — not charged" : "Stripe (test mode)"}</dd>
          </div>
        </dl>
        <DemoNote className="mt-10 max-w-md">This order exists only in your browser. No payment was taken and nothing will be shipped.</DemoNote>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/shop">Continue shopping</ButtonLink>
          <ButtonLink href="/account" variant="outline">
            View order history
          </ButtonLink>
        </div>
      </div>
      <aside className="bg-paper p-6 sm:p-8 lg:col-span-5 lg:col-start-8 lg:self-start">
        <h2 className="label">Order summary</h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {order.lines.map((l) => (
            <li key={l.variantId} className="flex items-center gap-4 py-4">
              <Image src={l.image} alt="" width={64} height={80} className="h-20 w-16 object-cover" />
              <div className="flex-1">
                <p className="font-serif text-lg leading-tight">{l.name}</p>
                <p className="text-sm text-stone">
                  {l.variantLabel} × {l.quantity}
                </p>
              </div>
              <p className="text-sm tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <OrderSummary totals={order.totals} shippingLabel={order.shippingMethod} />
        </div>
      </aside>
    </div>
  );
}
