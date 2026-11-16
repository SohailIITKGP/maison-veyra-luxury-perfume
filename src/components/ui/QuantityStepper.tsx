"use client";

import { Minus, Plus } from "lucide-react";
import { brand } from "@/config/brand";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const max = brand.commerce.maxQuantity;
  const h = size === "sm" ? "h-10" : "h-13";
  return (
    <div className={cn("inline-flex items-center border border-line", h)} role="group" aria-label={label}>
      <button
        type="button"
        className="grid h-full w-11 place-items-center text-charcoal transition-colors hover:bg-sand-light disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={14} strokeWidth={1.25} />
      </button>
      <output className="w-8 text-center text-sm tabular-nums" aria-live="polite" aria-label="Quantity">
        {value}
      </output>
      <button
        type="button"
        className="grid h-full w-11 place-items-center text-charcoal transition-colors hover:bg-sand-light disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} strokeWidth={1.25} />
      </button>
    </div>
  );
}
