import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionFallback, CollectionView } from "@/components/shop/CollectionView";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Shop Maison Veyra eaux de parfum — woody, floral, amber and musk fragrances in 30, 50 and 100 ml, and the six-fragrance Discovery Set.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="container-veyra pt-14 pb-28 md:pt-20">
      <header className="grid gap-6 pb-10 md:grid-cols-2 md:items-end md:pb-14">
        <div>
          <p className="eyebrow text-bronze-deep">Eaux de Parfum</p>
          <h1 className="display mt-4 text-[3.2rem] md:text-[5rem]">The Collection</h1>
        </div>
        <p className="max-w-md text-[1.0625rem] leading-relaxed text-ink/80 md:justify-self-end">
          Six compositions, each written around a single memory and a single raw material. Choose by family, or begin with the Discovery Set.
        </p>
      </header>
      <Suspense fallback={<CollectionFallback />}>
        <CollectionView />
      </Suspense>
    </div>
  );
}
