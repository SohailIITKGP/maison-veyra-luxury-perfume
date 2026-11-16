import { Plus } from "lucide-react";
import type { ReactNode } from "react";

/** Native <details> disclosure — accessible and works without JavaScript. */
export function Disclosure({ title, children, open }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="group border-b border-line" open={open}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span className="label text-[0.6875rem]">{title}</span>
        <Plus size={16} strokeWidth={1.1} className="transition-transform duration-500 group-open:rotate-45" aria-hidden />
      </summary>
      <div className="pb-6 text-[0.9375rem] leading-relaxed text-ink/80">{children}</div>
    </details>
  );
}
