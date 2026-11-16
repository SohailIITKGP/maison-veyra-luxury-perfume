"use client";

import dynamic from "next/dynamic";
import { useUi } from "@/store/ui";

// Overlays (and the animation library they use) load on first open, keeping
// them out of the initial JavaScript for every page.
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const SearchDialog = dynamic(() => import("./SearchDialog").then((m) => m.SearchDialog), { ssr: false });
const MobileMenu = dynamic(() => import("./MobileMenu").then((m) => m.MobileMenu), { ssr: false });

export function Overlays() {
  const { bagEverOpened, searchEverOpened, menuEverOpened } = useUi();
  return (
    <>
      {bagEverOpened && <CartDrawer />}
      {searchEverOpened && <SearchDialog />}
      {menuEverOpened && <MobileMenu />}
    </>
  );
}
