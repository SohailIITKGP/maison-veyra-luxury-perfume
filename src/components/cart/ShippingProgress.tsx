import { brand } from "@/config/brand";
import { formatPrice } from "@/lib/format";
import { remainingForFreeShipping } from "@/lib/pricing";

export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = remainingForFreeShipping(subtotal);
  const pct = Math.min(100, (subtotal / brand.commerce.freeShippingThreshold) * 100);
  return (
    <div>
      <p className="text-sm text-stone">
        {remaining > 0 ? (
          <>
            You are <span className="text-charcoal">{formatPrice(remaining)}</span> from complimentary shipping.
          </>
        ) : (
          <>Your order ships complimentary.</>
        )}
      </p>
      <div className="mt-3 h-px w-full bg-line" aria-hidden>
        <div className="h-px bg-charcoal transition-[width] duration-700 ease-(--ease-veyra)" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
