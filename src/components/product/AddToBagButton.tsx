"use client";

import { Button } from "@/components/ui/Button";
import { useAddToBag } from "@/hooks/useAddToBag";

export function AddToBagButton({ slug, variantId, label, className }: { slug: string; variantId: string; label: string; className?: string }) {
  const addToBag = useAddToBag();
  return (
    <Button type="button" className={className} onClick={() => addToBag(slug, variantId)}>
      {label}
    </Button>
  );
}
