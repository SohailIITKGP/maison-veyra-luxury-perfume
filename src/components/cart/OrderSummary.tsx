import { formatPrice } from "@/lib/format";
import type { OrderTotals } from "@/types";

export function OrderSummary({ totals, shippingLabel }: { totals: OrderTotals; shippingLabel?: string }) {
  const rows: [string, string, string][] = [
    ["Subtotal", formatPrice(totals.subtotal), "subtotal"],
    [shippingLabel ?? "Shipping", totals.subtotal === 0 ? "—" : totals.shipping === 0 ? "Complimentary" : formatPrice(totals.shipping), "shipping"],
    ["Estimated tax", formatPrice(totals.tax), "tax"],
  ];
  return (
    <dl className="space-y-3 text-[0.9375rem]">
      {rows.map(([label, value, id]) => (
        <div key={id} className="flex justify-between gap-4">
          <dt className="text-stone">{label}</dt>
          <dd className="tabular-nums" data-testid={`summary-${id}`}>
            {value}
          </dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <dt className="label">Total</dt>
        <dd className="font-serif text-[1.75rem] tabular-nums" data-testid="summary-total">
          {formatPrice(totals.total)}
        </dd>
      </div>
    </dl>
  );
}
