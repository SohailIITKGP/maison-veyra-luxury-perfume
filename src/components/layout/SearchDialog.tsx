"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { families } from "@/data/products";
import { useDialog } from "@/hooks/useDialog";
import { searchProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { fromPrice } from "@/lib/catalog";
import { useUi } from "@/store/ui";

const SUGGESTIONS = ["Sandalwood", "Tuberose", "Vanilla", "Iris", "Musk", "Smoke"];

export function SearchDialog() {
  const open = useUi((s) => s.searchOpen);
  const setSearch = useUi((s) => s.setSearch);
  const [query, setQuery] = useState("");
  const close = () => {
    setSearch(false);
    setQuery("");
  };
  const ref = useDialog<HTMLDivElement>(open, close);
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <button type="button" aria-label="Close search" tabIndex={-1} className="absolute inset-0 cursor-default bg-charcoal/30" onClick={close} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Search fragrances"
            className="relative max-h-[100dvh] overflow-y-auto bg-ivory shadow-[0_30px_60px_-40px_rgb(27_27_25/0.5)]"
            initial={{ y: -24 }}
            animate={{ y: 0 }}
            exit={{ y: -24 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="container-veyra py-6 md:py-10">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-stone">Search the collection</p>
                <button type="button" onClick={close} className="-mr-2 grid size-11 place-items-center" aria-label="Close search">
                  <X size={20} strokeWidth={1.1} />
                </button>
              </div>
              <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-2 border-b border-charcoal">
                <label htmlFor="site-search" className="sr-only">
                  Search by fragrance, note or mood
                </label>
                <input
                  id="site-search"
                  data-autofocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="A name, a note, a mood…"
                  autoComplete="off"
                  className="display w-full bg-transparent py-3 text-[2rem] placeholder:text-stone/60 focus:outline-none md:text-[3rem]"
                />
              </form>

              <div className="mt-8 min-h-40 pb-4" aria-live="polite">
                {!query && (
                  <div className="grid gap-10 md:grid-cols-2">
                    <div>
                      <p className="eyebrow mb-4 text-stone">Notes</p>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((s) => (
                          <button key={s} type="button" onClick={() => setQuery(s)} className="border border-line px-4 py-2 text-sm transition-colors hover:border-charcoal">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="eyebrow mb-4 text-stone">Families</p>
                      <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        {Object.entries(families).map(([key, f]) => (
                          <li key={key}>
                            <Link href={`/shop?family=${key}`} onClick={close} className="font-serif text-2xl hover:italic">
                              {f.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {query && results.length === 0 && (
                  <p className="text-stone">
                    Nothing matches “{query}”. Try a note such as <em>sandalwood</em> or a mood such as <em>warm</em>.
                  </p>
                )}
                {results.length > 0 && (
                  <>
                    <p className="eyebrow mb-4 text-stone">
                      {results.length} {results.length === 1 ? "result" : "results"}
                    </p>
                    <ul className="divide-y divide-line border-y border-line">
                      {results.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/fragrances/${p.slug}`} onClick={close} className="group flex items-center gap-5 py-4">
                            <Image src={p.images[0].src} alt="" width={64} height={80} className="h-20 w-16 object-cover" />
                            <span className="min-w-0 flex-1">
                              <span className="block font-serif text-2xl leading-tight">{p.name}</span>
                              <span className="block truncate text-sm text-stone">{p.summary}</span>
                            </span>
                            <span className="hidden text-sm sm:block">from {formatPrice(fromPrice(p))}</span>
                            <ArrowRight size={16} strokeWidth={1.1} className="transition-transform group-hover:translate-x-1" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
