import { brand } from "@/config/brand";

const money = new Intl.NumberFormat(brand.locale, {
  style: "currency",
  currency: brand.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats minor units (cents) as currency, dropping ".00". */
export function formatPrice(cents: number) {
  return money.format(cents / 100).replace(/\.00$/, "");
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat(brand.locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}
