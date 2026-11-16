import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Honest labelling for simulated functionality. */
export function DemoNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex gap-3 border border-bronze/40 bg-sand-light/60 px-4 py-3 text-[0.8125rem] leading-relaxed text-stone", className)}>
      <Info size={16} strokeWidth={1.25} className="mt-0.5 shrink-0 text-bronze-deep" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
