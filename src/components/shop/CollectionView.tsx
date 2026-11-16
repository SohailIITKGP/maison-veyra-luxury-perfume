"use client";

import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { families, products } from "@/data/products";
import { useDialog } from "@/hooks/useDialog";
import { fromPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { Family, Product } from "@/types";
import { ProductCard } from "./ProductCard";

const FILTERS = [
  { value: "all", label: "All" },
  ...Object.entries(families).map(([value, f]) => ({ value, label: f.label })),
  { value: "set", label: "Discovery" },
] as const;

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "name", label: "Name, A–Z" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];
type SortValue = (typeof SORTS)[number]["value"];

function apply(list: Product[], family: FilterValue, sort: SortValue) {
  const filtered = family === "all" ? list : list.filter((p) => p.family === family);
  const sorted = [...filtered];
  if (sort === "price-asc") sorted.sort((a, b) => fromPrice(a) - fromPrice(b));
  if (sort === "price-desc") sorted.sort((a, b) => fromPrice(b) - fromPrice(a));
  if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

export function CollectionView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useDialog<HTMLDivElement>(sheetOpen, () => setSheetOpen(false));

  const familyParam = params.get("family");
  const sortParam = params.get("sort");
  const family: FilterValue = FILTERS.some((f) => f.value === familyParam) ? (familyParam as FilterValue) : "all";
  const sort: SortValue = SORTS.some((s) => s.value === sortParam) ? (sortParam as SortValue) : "featured";
  const list = useMemo(() => apply(products, family, sort), [family, sort]);

  const update = (key: "family" | "sort", value: string) => {
    const next = new URLSearchParams(params.toString());
    if ((key === "family" && value === "all") || (key === "sort" && value === "featured")) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filterButtons = (onPick?: () => void) =>
    FILTERS.map((f) => (
      <button
        key={f.value}
        type="button"
        aria-pressed={family === f.value}
        onClick={() => {
          update("family", f.value);
          onPick?.();
        }}
        className={cn(
          "min-h-11 border px-4 text-sm transition-colors duration-300",
          family === f.value ? "border-charcoal bg-charcoal text-ivory" : "border-line hover:border-charcoal",
        )}
      >
        {f.label}
      </button>
    ));

  const sortSelect = (id: string) => (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="label text-[0.6875rem] text-stone">
        Sort
      </label>
      <select
        id={id}
        value={sort}
        onChange={(e) => update("sort", e.target.value)}
        className="h-11 cursor-pointer border-b border-line bg-transparent pr-2 text-sm focus:border-charcoal focus:outline-none"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );

  // An editorial tile breaks the grid after the fourth product when unfiltered.
  const showEditorial = family === "all" && list.length > 4;

  return (
    <>
      <div className="sticky top-16 z-30 -mx-5 border-y border-line bg-ivory/97 px-5 md:static md:mx-0 md:border-x-0 md:px-0 lg:top-20">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="hidden flex-wrap gap-2 md:flex" role="group" aria-label="Filter by family">
            {filterButtons()}
          </div>
          <button type="button" className="label inline-flex min-h-11 items-center gap-3 text-[0.6875rem] md:hidden" onClick={() => setSheetOpen(true)}>
            <SlidersHorizontal size={16} strokeWidth={1.1} />
            Filter &amp; sort
            {family !== "all" && <span className="text-stone normal-case tracking-normal">· {FILTERS.find((f) => f.value === family)?.label}</span>}
          </button>
          <div className="hidden md:block">{sortSelect("sort-desktop")}</div>
          <p className="text-sm text-stone md:hidden" aria-live="polite">
            {list.length} {list.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <p className="mt-6 hidden text-sm text-stone md:block" aria-live="polite">
        Showing {list.length} {list.length === 1 ? "item" : "items"}
        {family !== "all" && family !== "set" && <> in the {families[family as Family].label.toLowerCase()} family — {families[family as Family].description}</>}
      </p>

      <h2 className="sr-only">Products</h2>
      {list.length === 0 ? (
        <p className="py-24 text-center text-stone">No fragrances match this filter.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-14 md:mt-10 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-20 xl:grid-cols-4">
          {list.map((p, i) => (
            <li key={p.slug} className="contents">
              {showEditorial && i === 4 && (
                // Spans so every breakpoint fills evenly: 2 cols → 1, 3 cols → 2, 4 cols → 1.
                <div className="relative min-h-[20rem] overflow-hidden bg-charcoal text-ivory lg:col-span-2 xl:col-span-1">
                  <Image
                    src="/images/editorial/materials.webp"
                    alt="Raw materials on a travertine shelf: sandalwood, golden resin, violet and rose petals, tied vetiver"
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 66vw, 50vw"
                    className="object-cover object-[45%_50%] opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                    <p className="eyebrow text-bronze">From the atelier</p>
                    <p className="display mt-2 text-[1.2rem] italic sm:text-[1.6rem] lg:text-[2.1rem] xl:text-[1.6rem]">
                      Every formula begins with a single raw material — and the memory it belongs to.
                    </p>
                  </div>
                </div>
              )}
              <div>
                <ProductCard product={p} priority={i < 2} sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw" />
              </div>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {sheetOpen && (
          <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" tabIndex={-1} aria-label="Close filters" className="absolute inset-0 cursor-default bg-charcoal/35" onClick={() => setSheetOpen(false)} />
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label="Filter and sort"
              className="absolute inset-x-0 bottom-0 bg-ivory px-5 pt-5 pb-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <p className="label">Filter &amp; sort</p>
                <button type="button" onClick={() => setSheetOpen(false)} className="-mr-2 grid size-11 place-items-center" aria-label="Close filters">
                  <X size={20} strokeWidth={1.1} />
                </button>
              </div>
              <p className="eyebrow mt-6 text-stone">Family</p>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by family">
                {filterButtons(() => setSheetOpen(false))}
              </div>
              <div className="mt-8">{sortSelect("sort-mobile")}</div>
              <button type="button" onClick={() => setSheetOpen(false)} className="label mt-8 h-13 w-full bg-charcoal text-[0.75rem] text-ivory">
                Show {list.length} {list.length === 1 ? "item" : "items"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Server-safe fallback rendered while search params resolve. */
export function CollectionFallback() {
  return (
    <ul className="mt-24 grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
      {products.map((p) => (
        <li key={p.slug}>
          <div className="aspect-[4/5] bg-sand-light" />
          <p className="mt-4 font-serif text-[1.35rem]">{p.name}</p>
        </li>
      ))}
    </ul>
  );
}
