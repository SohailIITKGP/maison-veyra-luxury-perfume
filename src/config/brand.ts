/**
 * Central brand configuration.
 * Re-branding the storefront for a real client starts here: name, copy,
 * navigation, commerce rules and contact details all live in this file.
 */
export const brand = {
  name: "Maison Veyra",
  wordmark: "MAISON VEYRA",
  tagline: "Fragrance as an intimate expression of memory, identity, and emotion.",
  description:
    "Maison Veyra is a niche fragrance house composing eaux de parfum inspired by the art of remembering. Discover woody, floral, amber and musk fragrances in 30, 50 and 100 ml.",
  /** Canonical origin: explicit override, else Vercel's production domain, else local. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  locale: "en-US",
  currency: "USD",

  contact: {
    email: "care@maisonveyra.example",
    hours: "Monday to Friday, 9:00–18:00",
  },

  commerce: {
    freeShippingThreshold: 15000, // cents
    taxRate: 0.08, // demo estimate only
    shippingMethods: [
      { id: "standard", label: "Standard delivery", detail: "3–5 business days", price: 800 },
      { id: "express", label: "Express delivery", detail: "1–2 business days", price: 1800 },
    ],
    maxQuantity: 10,
  },

  nav: {
    primary: [
      { label: "Shop", href: "/shop" },
      { label: "Our Story", href: "/our-story" },
      { label: "Discovery Set", href: "/fragrances/discovery-set" },
    ],
    footer: [
      {
        title: "Shop",
        links: [
          { label: "The Collection", href: "/shop" },
          { label: "Discovery Set", href: "/fragrances/discovery-set" },
          { label: "Wishlist", href: "/wishlist" },
          { label: "Shopping Bag", href: "/bag" },
        ],
      },
      {
        title: "The House",
        links: [
          { label: "Our Story", href: "/our-story" },
          { label: "Account", href: "/account" },
          { label: "Frequently Asked", href: "/info/faq" },
        ],
      },
      {
        title: "Client Care",
        links: [
          { label: "Shipping", href: "/info/shipping" },
          { label: "Returns", href: "/info/returns" },
          { label: "Contact", href: "/info/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/info/privacy" },
          { label: "Terms", href: "/info/terms" },
        ],
      },
    ],
  },

  /** Social handles are linked at launch; shown as text in the demo. */
  social: ["Instagram", "Pinterest", "Journal"],
} as const;

export type ShippingMethodId = (typeof brand.commerce.shippingMethods)[number]["id"];
