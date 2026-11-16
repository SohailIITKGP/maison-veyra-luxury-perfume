"use client";

import { Heart } from "lucide-react";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/cn";
import { useWishlist } from "@/store/wishlist";

export function WishlistButton({
  slug,
  name,
  className,
  withLabel = false,
}: {
  slug: string;
  name: string;
  className?: string;
  withLabel?: boolean;
}) {
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.slugs.includes(slug)) && hydrated;
  const toggle = useWishlist((s) => s.toggle);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn("group/wl inline-flex items-center gap-2.5 text-charcoal", className)}
    >
      <Heart
        size={18}
        strokeWidth={1.1}
        className={cn("transition-[fill,transform] duration-500 group-active/wl:scale-90", saved ? "fill-charcoal" : "fill-transparent")}
      />
      {withLabel && <span className="label">{saved ? "Saved" : "Save to wishlist"}</span>}
    </button>
  );
}
