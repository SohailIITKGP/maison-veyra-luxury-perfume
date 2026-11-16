import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "light";

const base =
  "inline-flex min-h-13 items-center justify-center gap-3 px-8 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-[background-color,color,border-color,opacity] duration-500 ease-(--ease-veyra) disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid: "bg-charcoal text-ivory hover:bg-ink active:opacity-90",
  outline: "border border-charcoal/80 text-charcoal hover:bg-charcoal hover:text-ivory",
  light: "bg-ivory text-charcoal hover:bg-paper",
};

export function buttonClass(variant: Variant = "solid", className?: string) {
  return cn(base, variants[variant], className);
}

export function Button({
  variant = "solid",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "solid",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      {children}
    </Link>
  );
}
