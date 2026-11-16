"use client";

import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { families } from "@/data/products";
import { useAddToBag } from "@/hooks/useAddToBag";
import { fromPrice, getVariant } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw",
  className,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const addToBag = useAddToBag();
  const variant = getVariant(product, product.defaultVariantId)!;
  const href = `/fragrances/${product.slug}`;
  const familyLabel = product.family === "set" ? "Discovery" : families[product.family].label;
  const hover = product.images[2] ?? product.images[1];

  return (
    <article className={cn("group relative", className)} data-testid="product-card">
      <div className="relative">
        <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-sand-light" aria-label={product.name}>
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1.4s] ease-(--ease-veyra) group-hover:scale-[1.035]"
          />
          {hover && (
            <Image
              src={hover.src}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-[0.9s] ease-(--ease-veyra) group-hover:opacity-100 max-lg:hidden"
            />
          )}
        </Link>
        <WishlistButton slug={product.slug} name={product.name} className="absolute top-1 right-1 grid size-11 place-items-center" />
        <button
          type="button"
          onClick={() => addToBag(product.slug, variant.id)}
          className="label absolute inset-x-3 bottom-3 hidden h-11 translate-y-2 items-center justify-center bg-ivory/95 text-[0.6875rem] opacity-0 transition-[opacity,transform,background-color] duration-500 ease-(--ease-veyra) group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-charcoal hover:text-ivory lg:flex"
          aria-label={`Quick add ${product.name}, ${variant.label}, to bag`}
        >
          Quick add · {variant.label}
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-[1.35rem] leading-tight md:text-[1.6rem]">
            <Link href={href} className="hover:italic">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-[0.8125rem] text-stone">
            {familyLabel} · {product.variants.length > 1 ? `from ${formatPrice(fromPrice(product))}` : formatPrice(variant.price)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => addToBag(product.slug, variant.id)}
        className="mt-2 inline-flex min-h-11 items-center text-[0.75rem] tracking-[0.12em] uppercase underline decoration-line underline-offset-6 hover:decoration-charcoal lg:hidden"
        aria-label={`Add ${product.name}, ${variant.label}, to bag`}
      >
        Add {variant.label}
      </button>
    </article>
  );
}
