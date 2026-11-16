"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { useAddToBag } from "@/hooks/useAddToBag";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

/** Bottle silhouette scaled to the selected size. */
function SizeGlyph({ ml }: { ml: number }) {
  const h = ml >= 100 ? 26 : ml >= 50 ? 20 : 15;
  const w = ml >= 100 ? 16 : ml >= 50 ? 13 : 10;
  return (
    <svg width="20" height="34" viewBox="0 0 20 34" aria-hidden className="shrink-0">
      <rect x={10 - w * 0.22} y={34 - h - 6} width={w * 0.44} height="6" rx="2.5" fill="currentColor" opacity=".55" />
      <rect x={10 - w / 2} y={34 - h} width={w} height={h} rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function PurchasePanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.defaultVariantId);
  const [quantity, setQuantity] = useState(1);
  const addToBag = useAddToBag();
  const variant = product.variants.find((v) => v.id === variantId)!;
  const isSet = product.kind === "set";

  return (
    <div>
      <p className="font-serif text-[1.75rem] tabular-nums" data-testid="pdp-price" aria-live="polite">
        {formatPrice(variant.price)}
        {!isSet && <span className="ml-3 align-middle font-sans text-sm text-stone">{variant.label}</span>}
      </p>

      {product.variants.length > 1 && (
        <fieldset className="mt-8">
          <legend className="label text-[0.6875rem]">Size</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {product.variants.map((v) => {
              const checked = v.id === variantId;
              return (
                <label
                  key={v.id}
                  className={cn(
                    "relative flex min-h-20 flex-col items-center justify-center gap-1 border px-2 py-3 text-center transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bronze-deep",
                    checked ? "border-charcoal bg-paper" : "border-line hover:border-charcoal/50",
                  )}
                >
                  <input type="radio" name="size" value={v.id} checked={checked} onChange={() => setVariantId(v.id)} className="sr-only" />
                  <SizeGlyph ml={v.sizeMl} />
                  <span className="text-sm">{v.label}</span>
                  <span className="text-xs text-stone tabular-nums">{formatPrice(v.price)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-8 flex gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} label="Quantity" />
        <Button type="button" className="flex-1" onClick={() => addToBag(product.slug, variant.id, quantity)} data-testid="add-to-bag">
          Add to bag · {formatPrice(variant.price * quantity)}
        </Button>
      </div>
      <WishlistButton slug={product.slug} name={product.name} withLabel className="mt-5 min-h-11" />

      <ul className="mt-8 space-y-2 border-t border-line pt-6 text-sm text-stone">
        <li>Complimentary standard shipping on orders over $150.</li>
        <li>{isSet ? "Price credited toward a full bottle within 60 days." : "Two complimentary samples with every full bottle."}</li>
        <li>Unopened bottles may be returned within 30 days.</li>
      </ul>
    </div>
  );
}
