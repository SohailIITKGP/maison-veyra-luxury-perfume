"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { families } from "@/data/products";
import { useAddToBag } from "@/hooks/useAddToBag";
import { useHydrated } from "@/hooks/useHydrated";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/store/wishlist";
import type { Product } from "@/types";

export function WishlistView() {
  const hydrated = useHydrated();
  const slugs = useWishlist((s) => s.slugs);
  const items = slugs.map(getProduct).filter((p): p is Product => !!p);

  if (!hydrated) return <div className="h-96" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center border-t border-line py-24 text-center md:py-32">
        <p className="display text-[2.6rem] md:text-[3.4rem]">Nothing saved yet.</p>
        <p className="mt-4 max-w-sm text-stone">Tap the heart on any fragrance to keep it here while you decide. Your wishlist is remembered on this device.</p>
        <ButtonLink href="/shop" className="mt-10">
          Explore the collection
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <p className="border-t border-line pt-5 text-sm text-stone">
        {items.length} saved {items.length === 1 ? "fragrance" : "fragrances"}
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-4 lg:gap-x-6">
        {items.map((p) => (
          <li key={p.slug}>
            <WishlistItem product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}

function WishlistItem({ product }: { product: Product }) {
  const remove = useWishlist((s) => s.remove);
  const addToBag = useAddToBag();
  const [variantId, setVariantId] = useState(product.defaultVariantId);
  const variant = product.variants.find((v) => v.id === variantId)!;
  const href = `/fragrances/${product.slug}`;

  return (
    <article data-testid="wishlist-item">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-sand-light">
        <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
      </Link>
      <h2 className="mt-4 font-serif text-[1.35rem] leading-tight md:text-[1.6rem]">
        <Link href={href}>{product.name}</Link>
      </h2>
      <p className="mt-1 text-[0.8125rem] text-stone">{product.family === "set" ? "Discovery" : families[product.family].label}</p>
      {product.variants.length > 1 && (
        <label className="mt-3 block text-sm">
          <span className="sr-only">Size</span>
          <select value={variantId} onChange={(e) => setVariantId(e.target.value)} className="h-10 w-full cursor-pointer border-b border-line bg-transparent focus:border-charcoal focus:outline-none">
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} — {formatPrice(v.price)}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={() => addToBag(product.slug, variant.id)} className="label min-h-11 bg-charcoal px-4 text-[0.6875rem] text-ivory transition-colors hover:bg-ink">
          Add to bag · {formatPrice(variant.price)}
        </button>
        <button type="button" onClick={() => remove(product.slug)} className="min-h-11 text-left text-xs tracking-[0.12em] text-stone uppercase underline-offset-4 hover:text-charcoal hover:underline">
          Remove
        </button>
      </div>
    </article>
  );
}
