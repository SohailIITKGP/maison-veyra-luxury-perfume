"use client";

import { Check, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DemoNote } from "@/components/ui/DemoNote";
import { brand } from "@/config/brand";
import { useHydrated } from "@/hooks/useHydrated";
import { resolveLine } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { CheckoutResult } from "@/lib/payments/types";
import { computeTotals } from "@/lib/pricing";
import { useAccount } from "@/store/account";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import type { Address, Order } from "@/types";
import { Field, SelectField } from "./Field";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COUNTRIES = ["United States", "Canada", "United Kingdom", "France", "Germany", "Italy", "Netherlands", "Australia", "Japan"];

type Step = 1 | 2 | 3 | 4;
type Errors = Record<string, string>;

const emptyAddress: Address = { firstName: "", lastName: "", line1: "", line2: "", city: "", postalCode: "", country: "United States", phone: "" };

export function CheckoutFlow({ paymentMode }: { paymentMode: "simulated" | "stripe-test" }) {
  const hydrated = useHydrated();
  // Mount the form only once persisted state (bag, demo account) is restored.
  if (!hydrated) return <div className="h-96" aria-busy="true" />;
  return <CheckoutForm paymentMode={paymentMode} />;
}

function CheckoutForm({ paymentMode }: { paymentMode: "simulated" | "stripe-test" }) {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const addOrder = useOrders((s) => s.addOrder);
  const user = useAccount((s) => s.user);

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState(user?.email ?? "");
  const [address, setAddress] = useState<Address>({ ...emptyAddress, firstName: user?.firstName ?? "", lastName: user?.lastName ?? "" });
  const [method, setMethod] = useState<string>(brand.commerce.shippingMethods[0].id);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const totals = computeTotals(lines, method);
  const shipping = brand.commerce.shippingMethods.find((m) => m.id === method)!;

  if (lines.length === 0 && !submitting) {
    return (
      <div className="border-t border-line py-24 text-center">
        <p className="display text-[2.6rem]">There is nothing to check out yet.</p>
        <ButtonLink href="/shop" className="mt-8">
          Explore the collection
        </ButtonLink>
      </div>
    );
  }

  const set = (k: keyof Address) => (e: { target: { value: string } }) => setAddress((a) => ({ ...a, [k]: e.target.value }));

  const submitContact = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) return setErrors({ email: "Please enter a valid email address." });
    setErrors({});
    setStep(2);
  };

  const submitAddress = (e: FormEvent) => {
    e.preventDefault();
    const err: Errors = {};
    if (!address.firstName.trim()) err.firstName = "Please enter your first name.";
    if (!address.lastName.trim()) err.lastName = "Please enter your last name.";
    if (!address.line1.trim()) err.line1 = "Please enter your street address.";
    if (!address.city.trim()) err.city = "Please enter your city.";
    if (!/^[A-Za-z0-9 -]{3,10}$/.test(address.postalCode.trim())) err.postalCode = "Please enter a valid postal code.";
    setErrors(err);
    if (Object.keys(err).length === 0) setStep(3);
    else document.getElementById(`f-${Object.keys(err)[0]}`)?.focus();
  };

  const placeOrder = async () => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), address, shippingMethod: method, lines }),
      });
      const data = (await res.json()) as CheckoutResult | { error: string };
      if (!res.ok || "error" in data) throw new Error("error" in data ? data.error : "Something went wrong.");
      const order: Order = {
        id: data.orderId,
        createdAt: new Date().toISOString(),
        email: email.trim(),
        address,
        shippingMethod: shipping.label,
        totals: data.totals,
        status: "confirmed",
        payment: data.payment,
        lines: lines.map((l) => {
          const r = resolveLine(l.productSlug, l.variantId)!;
          return { productSlug: l.productSlug, variantId: l.variantId, name: r.product.name, variantLabel: r.variant.label, unitPrice: r.variant.price, quantity: l.quantity, image: r.product.images[0].src };
        }),
      };
      addOrder(order);
      if (data.kind === "redirect") {
        window.location.assign(data.url);
        return;
      }
      router.push("/checkout/confirmation");
      clear();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-px lg:col-span-7">
        <Section n={1} title="Contact" step={step} onEdit={() => setStep(1)} summary={email}>
          <form onSubmit={submitContact} noValidate className="space-y-6">
            <Field label="Email address" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            {!user && (
              <p className="text-sm text-stone">
                Have an account?{" "}
                <Link href="/account" className="underline underline-offset-4">
                  Sign in
                </Link>{" "}
                to prefill your details.
              </p>
            )}
            <Button type="submit">Continue to delivery</Button>
          </form>
        </Section>

        <Section
          n={2}
          title="Delivery address"
          step={step}
          onEdit={() => setStep(2)}
          summary={`${address.firstName} ${address.lastName}, ${address.line1}, ${address.city} ${address.postalCode}, ${address.country}`}
        >
          <form onSubmit={submitAddress} noValidate className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" name="firstName" autoComplete="given-name" value={address.firstName} onChange={set("firstName")} error={errors.firstName} />
            <Field label="Last name" name="lastName" autoComplete="family-name" value={address.lastName} onChange={set("lastName")} error={errors.lastName} />
            <Field className="sm:col-span-2" label="Street address" name="line1" autoComplete="address-line1" value={address.line1} onChange={set("line1")} error={errors.line1} />
            <Field className="sm:col-span-2" label="Apartment, suite" name="line2" optional autoComplete="address-line2" value={address.line2} onChange={set("line2")} />
            <Field label="City" name="city" autoComplete="address-level2" value={address.city} onChange={set("city")} error={errors.city} />
            <Field label="Postal code" name="postalCode" autoComplete="postal-code" value={address.postalCode} onChange={set("postalCode")} error={errors.postalCode} />
            <SelectField label="Country" name="country" autoComplete="country-name" value={address.country} onChange={set("country")}>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectField>
            <Field label="Phone" name="phone" type="tel" optional autoComplete="tel" value={address.phone} onChange={set("phone")} />
            <div className="sm:col-span-2">
              <Button type="submit">Continue to shipping</Button>
            </div>
          </form>
        </Section>

        <Section n={3} title="Shipping method" step={step} onEdit={() => setStep(3)} summary={`${shipping.label} — ${totals.shipping === 0 ? "Complimentary" : formatPrice(totals.shipping)}`}>
          <fieldset>
            <legend className="sr-only">Shipping method</legend>
            <div className="space-y-2">
              {brand.commerce.shippingMethods.map((m) => {
                const cost = computeTotals(lines, m.id).shipping;
                return (
                  <label key={m.id} className={cn("flex min-h-16 items-center gap-4 border px-5 py-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-bronze-deep", method === m.id ? "border-charcoal bg-paper" : "border-line hover:border-charcoal/50")}>
                    <input type="radio" name="shipping" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="size-4 accent-charcoal" />
                    <span className="flex-1">
                      <span className="block text-[0.9375rem]">{m.label}</span>
                      <span className="block text-sm text-stone">{m.detail}</span>
                    </span>
                    <span className="text-sm tabular-nums">{cost === 0 ? "Complimentary" : formatPrice(cost)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <Button type="button" className="mt-6" onClick={() => setStep(4)}>
            Continue to payment
          </Button>
        </Section>

        <Section n={4} title="Payment & review" step={step} onEdit={() => setStep(4)}>
          <fieldset>
            <legend className="sr-only">Payment method</legend>
            <div className="space-y-2">
              <label className="flex min-h-16 items-center gap-4 border border-charcoal bg-paper px-5 py-4">
                <input type="radio" name="payment" defaultChecked className="size-4 accent-charcoal" />
                <span className="flex-1">
                  <span className="block text-[0.9375rem]">{paymentMode === "stripe-test" ? "Card — Stripe Checkout (test mode)" : "Simulated payment"}</span>
                  <span className="block text-sm text-stone">
                    {paymentMode === "stripe-test" ? "You will be redirected to Stripe’s hosted page. Use a Stripe test card." : "Confirms a demo order. No card details are requested and nothing is charged."}
                  </span>
                </span>
              </label>
              {paymentMode === "simulated" &&
                ["Card via Stripe Checkout", "PayPal", "Apple Pay & Google Pay"].map((label) => (
                  <div key={label} className="flex min-h-14 items-center gap-4 border border-line px-5 py-3 text-stone" aria-disabled="true">
                    <span className="size-4 rounded-full border border-line" aria-hidden />
                    <span className="flex-1 text-[0.9375rem]">{label}</span>
                    <span className="text-xs tracking-[0.12em] uppercase">At launch</span>
                  </div>
                ))}
            </div>
          </fieldset>
          <DemoNote className="mt-6">
            This is a concept storefront. Card numbers are never collected on this site — in production, payment happens on the provider’s hosted, PCI-compliant page
            (for example Stripe Checkout), and the order is confirmed by a server-side webhook.
          </DemoNote>

          <div className="mt-8 border-t border-line pt-6 text-sm">
            <p className="label mb-3 text-[0.6875rem]">Review</p>
            <p className="text-stone">
              {email} · {address.firstName} {address.lastName}, {address.line1}, {address.city} · {shipping.label}
            </p>
          </div>

          {serverError && (
            <p role="alert" className="mt-6 border border-error/40 px-4 py-3 text-sm text-error">
              {serverError}
            </p>
          )}
          <Button type="button" className="mt-8 w-full" onClick={placeOrder} disabled={submitting} data-testid="place-order">
            <Lock size={14} strokeWidth={1.25} aria-hidden />
            {submitting ? "Placing order…" : `${paymentMode === "simulated" ? "Place demo order" : "Pay with Stripe"} · ${formatPrice(totals.total)}`}
          </Button>
        </Section>
      </div>

      <aside className="lg:col-span-5" aria-labelledby="checkout-summary">
        <div className="bg-paper p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 id="checkout-summary" className="label">
            Your order
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {lines.map((l) => {
              const r = resolveLine(l.productSlug, l.variantId);
              if (!r) return null;
              return (
                <li key={l.variantId} className="flex items-center gap-4 py-4">
                  <div className="relative shrink-0">
                    <Image src={r.product.images[0].src} alt="" width={64} height={80} className="h-20 w-16 object-cover" />
                    <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-charcoal text-[0.65rem] text-ivory">{l.quantity}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg leading-tight">{r.product.name}</p>
                    <p className="text-sm text-stone">{r.variant.label}</p>
                  </div>
                  <p className="text-sm tabular-nums">{formatPrice(r.variant.price * l.quantity)}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-6">
            <OrderSummary totals={totals} shippingLabel={shipping.label} />
          </div>
          <Link href="/bag" className="link-line label mt-6 text-[0.6875rem]">
            Edit bag
          </Link>
        </div>
      </aside>
    </div>
  );
}

function Section({
  n,
  title,
  step,
  onEdit,
  summary,
  children,
}: {
  n: Step;
  title: string;
  step: Step;
  onEdit: () => void;
  summary?: string;
  children: ReactNode;
}) {
  const active = step === n;
  const done = step > n;
  return (
    <section aria-labelledby={`step-${n}`} className="border-t border-line py-7" aria-current={active ? "step" : undefined}>
      <div className="flex items-center justify-between gap-4">
        <h2 id={`step-${n}`} className={cn("flex items-center gap-4 font-serif text-[1.65rem]", !active && !done && "text-stone")}>
          <span className={cn("grid size-8 place-items-center rounded-full border font-sans text-xs", done ? "border-charcoal bg-charcoal text-ivory" : active ? "border-charcoal" : "border-line")}>
            {done ? <Check size={14} strokeWidth={1.5} aria-label="Completed" /> : n}
          </span>
          {title}
        </h2>
        {done && (
          <button type="button" onClick={onEdit} className="link-line text-xs tracking-[0.12em] uppercase">
            Edit
          </button>
        )}
      </div>
      {done && summary && <p className="mt-3 pl-12 text-sm text-stone">{summary}</p>}
      {active && <div className="mt-7 sm:pl-12">{children}</div>}
    </section>
  );
}
