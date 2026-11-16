import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  name,
  error,
  className,
  optional,
  ...props
}: ComponentProps<"input"> & { label: string; name: string; error?: string; optional?: boolean }) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex justify-between text-[0.8125rem] text-stone">
        <span>{label}</span>
        {optional && <span className="text-xs">Optional</span>}
      </label>
      <input id={id} name={name} className="field" aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...props} />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.8125rem] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  name,
  children,
  className,
  ...props
}: ComponentProps<"select"> & { label: string; name: string }) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.8125rem] text-stone">
        {label}
      </label>
      <select id={id} name={name} className={cn("field cursor-pointer appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat")} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%231B1B19'/%3E%3C/svg%3E\")" }} {...props}>
        {children}
      </select>
    </div>
  );
}
