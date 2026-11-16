"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { useDialog } from "@/hooks/useDialog";
import { useHydrated } from "@/hooks/useHydrated";
import { resolveLine } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { subtotalOf } from "@/lib/pricing";
import { selectCount, useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { LineItem } from "./LineItem";
import { ShippingProgress } from "./ShippingProgress";

export function CartDrawer() {
  const open = useUi((s) => s.bagOpen);
  const justAdded = useUi((s) => s.justAdded);
  const closeBag = useUi((s) => s.closeBag);
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const count = useCart(selectCount);
  const ref = useDialog<HTMLDivElement>(open, closeBag);
  const subtotal = subtotalOf(lines);
  const added = justAdded ? lines.find((l) => l.variantId === justAdded) : undefined;
  const addedInfo = added && resolveLine(added.productSlug, added.variantId);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <button type="button" tabIndex={-1} aria-label="Close bag" className="absolute inset-0 cursor-default bg-charcoal/35" onClick={closeBag} />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-ivory"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="bag-title" className="label">
                Your bag <span className="tabular-nums">({hydrated ? count : 0})</span>
              </h2>
              <button type="button" onClick={closeBag} className="-mr-2 grid size-11 place-items-center" aria-label="Close bag">
                <X size={20} strokeWidth={1.1} />
              </button>
            </div>

            {addedInfo && (
              <p className="border-b border-line bg-sand-light/60 px-6 py-3 text-sm" role="status">
                Added — {addedInfo.product.name}, {addedInfo.variant.label}
              </p>
            )}

            {hydrated && lines.length > 0 ? (
              <>
                <div className="px-6 pt-5">
                  <ShippingProgress subtotal={subtotal} />
                </div>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {lines.map((line) => (
                    <LineItem key={line.variantId} line={line} compact onNavigate={closeBag} />
                  ))}
                </ul>
                <div className="border-t border-line px-6 pt-5 pb-6">
                  <div className="flex items-baseline justify-between">
                    <span className="label">Subtotal</span>
                    <span className="font-serif text-2xl tabular-nums" data-testid="drawer-subtotal">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone">Shipping and tax are calculated at checkout.</p>
                  <div className="mt-5 grid gap-3">
                    <ButtonLink href="/checkout" onClick={closeBag}>
                      Proceed to checkout
                    </ButtonLink>
                    <Link href="/bag" onClick={closeBag} className={buttonClass("outline")}>
                      View bag
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="display text-4xl">Your bag is empty.</p>
                <p className="mt-3 max-w-xs text-stone">Begin with the Discovery Set, or let the collection find you.</p>
                <ButtonLink href="/shop" className="mt-8" onClick={closeBag}>
                  Explore the collection
                </ButtonLink>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
