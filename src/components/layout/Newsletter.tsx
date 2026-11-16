"use client";

import { useId, useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  return (
    <div>
      <h2 className="display text-[2.4rem] md:text-[3rem]">Letters from the house</h2>
      <p className="mt-3 max-w-md text-ivory/70">
        Occasional notes on new compositions, raw materials and the stories behind them. Never more than once a month.
      </p>
      {state === "done" ? (
        <p role="status" className="mt-8 max-w-md border-t border-ivory/25 pt-5 font-serif text-xl italic">
          Thank you — you would now receive our letters. <span className="not-italic font-sans text-sm text-ivory/60">(Demo: no address was stored.)</span>
        </p>
      ) : (
        <form
          noValidate
          className="mt-8 max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            setState(EMAIL.test(email.trim()) ? "done" : "error");
          }}
        >
          <label htmlFor={id} className="eyebrow text-ivory/60">
            Email address
          </label>
          <div className="mt-2 flex border-b border-ivory/40 focus-within:border-ivory">
            <input
              id={id}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              aria-invalid={state === "error"}
              aria-describedby={state === "error" ? `${id}-err` : undefined}
              className="h-12 min-w-0 flex-1 bg-transparent text-ivory placeholder:text-ivory/55 focus:outline-none"
              placeholder="you@example.com"
            />
            <button type="submit" className="label px-1 text-[0.6875rem] text-ivory hover:text-sand">
              Subscribe
            </button>
          </div>
          {state === "error" && (
            <p id={`${id}-err`} role="alert" className="mt-2 text-sm text-[#E5B4A8]">
              Please enter a valid email address, such as name@domain.com.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
