"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Field } from "@/components/checkout/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DemoNote } from "@/components/ui/DemoNote";
import { demoUser, sampleOrders } from "@/data/account";
import { useHydrated } from "@/hooks/useHydrated";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useAccount } from "@/store/account";
import { useOrders } from "@/store/orders";
import { useWishlist } from "@/store/wishlist";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function AccountView() {
  const hydrated = useHydrated();
  const user = useAccount((s) => s.user);
  if (!hydrated) return <div className="h-96" aria-busy="true" />;
  return user ? <Overview /> : <AuthForms />;
}

function AuthForms() {
  const signIn = useAccount((s) => s.signIn);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (mode === "signup" && !form.firstName.trim()) err.firstName = "Please enter your first name.";
    if (!EMAIL.test(form.email.trim())) err.email = "Please enter a valid email address.";
    if (form.password.length < 8) err.password = "Passwords have at least 8 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const fromEmail = form.email.split("@")[0].replace(/[._-]+/g, " ");
    signIn({
      firstName: form.firstName.trim() || fromEmail.charAt(0).toUpperCase() + fromEmail.slice(1),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      memberSince: new Date().toISOString(),
    });
  };

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <div role="tablist" aria-label="Account" className="flex gap-8 border-b border-line">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setErrors({});
              }}
              className={cn("label -mb-px min-h-12 border-b text-[0.6875rem] transition-colors", mode === m ? "border-charcoal" : "border-transparent text-stone hover:text-charcoal")}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
        <form onSubmit={submit} noValidate className="mt-8 space-y-5" role="tabpanel" aria-label={mode === "signin" ? "Sign in" : "Create account"}>
          {mode === "signup" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" name="firstName" autoComplete="given-name" value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
              <Field label="Last name" name="lastName" optional autoComplete="family-name" value={form.lastName} onChange={set("lastName")} />
            </div>
          )}
          <Field label="Email address" name="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Field label="Password" name="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={form.password} onChange={set("password")} error={errors.password} />
          <Button type="submit" className="w-full">
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <div className="mt-6 flex items-center gap-4 text-xs text-stone before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">or</div>
        <Button type="button" variant="outline" className="mt-6 w-full" onClick={() => signIn(demoUser)}>
          Continue with the demo account
        </Button>
        <DemoNote className="mt-8">
          Sign-in is simulated in your browser for this concept — nothing is verified and passwords are never stored or sent. A production build would use a
          real identity provider such as Auth.js, Clerk or Shopify customer accounts.
        </DemoNote>
      </div>
      <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src="/images/editorial/archway.webp" alt="" fill sizes="45vw" className="object-cover" />
        </div>
        <p className="mt-4 max-w-sm font-serif text-xl text-stone italic">Your orders, saved fragrances and scent preferences, kept in one place.</p>
      </div>
    </div>
  );
}

function Overview() {
  const user = useAccount((s) => s.user)!;
  const signOut = useAccount((s) => s.signOut);
  const placed = useOrders((s) => s.orders);
  const saved = useWishlist((s) => s.slugs.length);
  const orders = [...placed, ...(user.email === demoUser.email ? sampleOrders : [])];

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-4">
        <p className="eyebrow text-bronze-deep">Account</p>
        <h2 className="display mt-4 text-[2.8rem] md:text-[3.4rem]">
          Welcome, <em>{user.firstName}.</em>
        </h2>
        <dl className="mt-8 space-y-4 border-t border-line pt-6 text-sm">
          <div>
            <dt className="text-stone">Email</dt>
            <dd className="mt-0.5">{user.email}</dd>
          </div>
          <div>
            <dt className="text-stone">Member since</dt>
            <dd className="mt-0.5">{formatDate(user.memberSince)}</dd>
          </div>
          <div>
            <dt className="text-stone">Wishlist</dt>
            <dd className="mt-0.5">
              <Link href="/wishlist" className="underline underline-offset-4">
                {saved} saved {saved === 1 ? "fragrance" : "fragrances"}
              </Link>
            </dd>
          </div>
        </dl>
        <Button type="button" variant="outline" className="mt-8" onClick={signOut}>
          Sign out
        </Button>
        <DemoNote className="mt-8">Demo session stored in this browser only.</DemoNote>
      </div>

      <section aria-labelledby="orders-title" className="lg:col-span-7 lg:col-start-6">
        <h2 id="orders-title" className="label border-b border-line pb-4">
          Order history
        </h2>
        {orders.length === 0 ? (
          <div className="py-16">
            <p className="font-serif text-2xl">No orders yet.</p>
            <p className="mt-2 text-stone">Orders you place through the demo checkout will appear here.</p>
            <ButtonLink href="/shop" className="mt-8">
              Explore the collection
            </ButtonLink>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id} className="py-7" data-testid="order-row">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-serif text-2xl">{o.id}</p>
                  <p className="text-sm text-stone">
                    {formatDate(o.createdAt)} · <span className="text-charcoal capitalize">{o.status}</span>
                    {o.id.includes("SAMPLE") && <span> · sample data</span>}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {o.lines.map((l) => (
                    <Image key={l.variantId} src={l.image} alt={`${l.name}, ${l.variantLabel}`} width={56} height={70} className="h-[70px] w-14 object-cover" />
                  ))}
                  <p className="ml-1 flex-1 text-sm text-stone">
                    {o.lines.map((l) => `${l.name} ${l.variantLabel}${l.quantity > 1 ? ` × ${l.quantity}` : ""}`).join(", ")}
                  </p>
                  <p className="tabular-nums">{formatPrice(o.totals.total)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
