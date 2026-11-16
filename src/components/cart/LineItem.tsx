"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { resolveLine } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";
import type { CartLine } from "@/types";

export function LineItem({ line, compact = false, onNavigate }: { line: CartLine; compact?: boolean; onNavigate?: () => void }) {
  const { setQuantity, remove, changeVariant } = useCart();
  const resolved = resolveLine(line.productSlug, line.variantId);
  if (!resolved) return null;
  const { product, variant } = resolved;
  const href = `/fragrances/${product.slug}`;

  return (
    <li className={cn("flex gap-4 py-6 sm:gap-6", compact && "py-5")} data-testid="line-item">
      <Link href={href} onClick={onNavigate} className="shrink-0 bg-sand-light">
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          width={compact ? 96 : 140}
          height={compact ? 120 : 175}
          className={cn("object-cover", compact ? "h-30 w-24" : "h-36 w-28 sm:h-44 sm:w-35")}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={href} onClick={onNavigate} className="font-serif text-xl leading-tight sm:text-2xl">
              {product.name}
            </Link>
            <p className="mt-0.5 text-sm text-stone">{product.kind === "set" ? "Discovery set" : "Eau de parfum"}</p>
          </div>
          <p className="text-sm tabular-nums" data-testid="line-total">
            {formatPrice(variant.price * line.quantity)}
          </p>
        </div>

        <div className="mt-3">
          {product.variants.length > 1 ? (
            <label className="inline-flex items-center gap-2 text-sm text-stone">
              <span className="sr-only">Size for {product.name}</span>
              <select
                value={variant.id}
                onChange={(e) => changeVariant(variant.id, e.target.value)}
                className="h-9 cursor-pointer border-b border-line bg-transparent pr-1 text-sm text-charcoal focus:border-charcoal focus:outline-none"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} — {formatPrice(v.price)}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="text-sm text-stone">{variant.label}</p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <QuantityStepper size="sm" value={line.quantity} onChange={(n) => setQuantity(variant.id, n)} label={`Quantity for ${product.name}`} />
          <button type="button" onClick={() => remove(variant.id)} className="link-line text-xs tracking-[0.12em] text-stone uppercase hover:text-charcoal">
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
