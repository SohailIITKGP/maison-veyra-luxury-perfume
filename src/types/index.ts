export type Family = "woody" | "floral" | "amber" | "musk";

export type Moment = "day" | "dusk" | "night";
export type Texture = "woods" | "petals" | "resins" | "skin";
export type Presence = "close" | "trail" | "bold";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Variant {
  id: string;
  /** e.g. "50 ml" */
  label: string;
  sizeMl: number;
  /** Price in minor units (cents). */
  price: number;
}

export interface Notes {
  top: string[];
  heart: string[];
  base: string[];
}

/** Descriptive, perfumer-style character — not a measured performance claim. */
export interface Character {
  intensity: 1 | 2 | 3 | 4 | 5;
  sillage: 1 | 2 | 3 | 4 | 5;
  longevity: 1 | 2 | 3 | 4 | 5;
  mood: string[];
}

export interface Product {
  slug: string;
  kind: "fragrance" | "set";
  name: string;
  number: string;
  family: Family | "set";
  tagline: string;
  summary: string;
  description: string[];
  notes?: Notes;
  character?: Character;
  finder?: { moments: Moment[]; texture: Texture; presence: Presence };
  story?: { title: string; body: string };
  contents?: string[];
  /** Liquid colour, used for subtle UI accents. */
  accent: string;
  images: ProductImage[];
  variants: Variant[];
  defaultVariantId: string;
  signature?: boolean;
}

export interface CartLine {
  productSlug: string;
  variantId: string;
  quantity: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface OrderLine {
  productSlug: string;
  variantId: string;
  name: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  email: string;
  address: Address;
  shippingMethod: string;
  lines: OrderLine[];
  totals: OrderTotals;
  status: "confirmed" | "shipped" | "delivered";
  payment: "simulated" | "stripe-test";
}
