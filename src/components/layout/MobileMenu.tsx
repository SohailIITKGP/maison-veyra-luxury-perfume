"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { useDialog } from "@/hooks/useDialog";
import { useUi } from "@/store/ui";

export function MobileMenu() {
  const open = useUi((s) => s.menuOpen);
  const setMenu = useUi((s) => s.setMenu);
  const setSearch = useUi((s) => s.setSearch);
  const close = () => setMenu(false);
  const ref = useDialog<HTMLDivElement>(open, close);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-ivory lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="container-veyra flex h-16 items-center justify-between border-b border-line">
            <span className="text-[0.95rem] font-medium tracking-[0.42em]">{brand.wordmark}</span>
            <button type="button" onClick={close} className="-mr-2 grid size-11 place-items-center" aria-label="Close menu">
              <X size={20} strokeWidth={1.1} />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-veyra flex flex-1 flex-col overflow-y-auto pt-10 pb-8">
            <ul className="space-y-1">
              {[{ label: "Home", href: "/" }, ...brand.nav.primary].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <Link href={item.href} onClick={close} className="display block py-2 text-[2.6rem]">
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <ul className="mt-10 space-y-4 border-t border-line pt-8">
              <li>
                <button type="button" className="label" onClick={() => setSearch(true)}>
                  Search
                </button>
              </li>
              {[
                { label: "Account", href: "/account" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Shopping bag", href: "/bag" },
                { label: "Client care", href: "/info/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={close} className="label">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-10 font-serif text-lg text-stone italic">{brand.tagline}</p>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
