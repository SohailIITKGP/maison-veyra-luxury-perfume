import { brand } from "@/config/brand";
import type { Product } from "@/types";

export function productJsonLd(product: Product) {
  const url = `${brand.url}/fragrances/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    brand: { "@type": "Brand", name: brand.name },
    image: product.images.map((i) => `${brand.url}${i.src}`),
    url,
    category: product.kind === "set" ? "Fragrance sample set" : "Eau de parfum",
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      sku: v.id,
      name: `${product.name} ${v.label}`,
      price: (v.price / 100).toFixed(2),
      priceCurrency: brand.currency,
      availability: "https://schema.org/InStock",
      url,
    })),
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
