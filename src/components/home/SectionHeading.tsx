import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  id,
  className,
  tone = "dark",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  id?: string;
  className?: string;
  tone?: "dark" | "light";
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className={cn("eyebrow", tone === "dark" ? "text-bronze-deep" : "text-bronze")}>{eyebrow}</p>
      <h2 id={id} className="display mt-4 text-[2.5rem] md:text-[3.6rem]">
        {title}
      </h2>
      {children}
    </div>
  );
}
