import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist/WishlistView";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="container-veyra pt-14 pb-28 md:pt-20">
      <h1 className="display mb-10 text-[3.2rem] md:text-[4.5rem]">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
