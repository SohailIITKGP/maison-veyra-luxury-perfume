"use client";

import { Menu, Search, ShoppingBag, User, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/cn";
import { selectCount, useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCart(selectCount);
  const saved = useWishlist((s) => s.slugs.length);
  const { openBag, setSearch, setMenu } = useUi();
  const bagCount = hydrated ? count : 0;
  const savedCount = hydrated ? saved : 0;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <p className="bg-charcoal px-4 py-2.5 text-center text-[0.6875rem] tracking-[0.14em] text-ivory/85 uppercase">
        Complimentary shipping over $150
        <span className="hidden sm:inline"> · A concept storefront — no real orders are placed</span>
      </p>
      <header className="sticky top-0 z-40 border-b border-line bg-ivory/97 backdrop-blur-[2px]">
        <div className="container-veyra grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-20">
          <nav aria-label="Primary" className="flex items-center">
            <button
              type="button"
              className="-ml-2 grid size-11 place-items-center lg:hidden"
              onClick={() => setMenu(true)}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.1} />
            </button>
            <ul className="hidden items-center gap-9 lg:flex">
              {brand.nav.primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "label relative py-2 text-[0.6875rem] transition-colors hover:text-bronze-deep",
                      isActive(item.href) && "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-charcoal",
                    )}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="justify-self-center text-center" aria-label={`${brand.name} — home`}>
            <span className="block text-[0.95rem] font-medium tracking-[0.42em] [margin-right:-0.42em] sm:text-[1.05rem] lg:text-[1.15rem]">
              {brand.wordmark}
            </span>
          </Link>

          <div className="flex items-center justify-end gap-0.5 lg:gap-8">
            <button type="button" onClick={() => setSearch(true)} className="group grid size-11 place-items-center lg:flex lg:size-auto lg:gap-2" aria-label="Search fragrances">
              <Search size={19} strokeWidth={1.1} className="lg:hidden" />
              <span className="label hidden text-[0.6875rem] group-hover:text-bronze-deep lg:inline">Search</span>
            </button>
            <Link href="/account" className="group hidden size-11 place-items-center sm:grid lg:flex lg:size-auto" aria-label="Account">
              <User size={19} strokeWidth={1.1} className="lg:hidden" />
              <span className="label hidden text-[0.6875rem] group-hover:text-bronze-deep lg:inline">Account</span>
            </Link>
            <Link href="/wishlist" className="group relative hidden size-11 place-items-center sm:grid lg:flex lg:size-auto" aria-label={`Wishlist, ${savedCount} saved`}>
              <Heart size={19} strokeWidth={1.1} className="lg:hidden" />
              <span className="label hidden text-[0.6875rem] group-hover:text-bronze-deep lg:inline">
                Wishlist{savedCount > 0 && <span className="tabular-nums"> ({savedCount})</span>}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => openBag()}
              className="group relative -mr-2 grid size-11 place-items-center lg:mr-0 lg:flex lg:size-auto"
              aria-label={`Shopping bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`}
            >
              <ShoppingBag size={19} strokeWidth={1.1} className="lg:hidden" />
              {bagCount > 0 && (
                <span className="absolute top-1.5 right-1 grid size-4 place-items-center rounded-full bg-charcoal text-[0.6rem] text-ivory tabular-nums lg:hidden">
                  {bagCount}
                </span>
              )}
              <span className="label hidden text-[0.6875rem] group-hover:text-bronze-deep lg:inline">
                Bag <span className="tabular-nums">({bagCount})</span>
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
