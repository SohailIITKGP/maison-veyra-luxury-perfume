import { products } from "@/data/products";
import type { Family, Product, Variant } from "@/types";

export const fragrances = products.filter((p) => p.kind === "fragrance");
export const signatureCollection = products.filter((p) => p.signature);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, variantId: string): Variant | undefined {
  return product.variants.find((v) => v.id === variantId);
}

export function resolveLine(slug: string, variantId: string) {
  const product = getProduct(slug);
  const variant = product && getVariant(product, variantId);
  return product && variant ? { product, variant } : undefined;
}

export function fromPrice(product: Product) {
  return Math.min(...product.variants.map((v) => v.price));
}

export function relatedProducts(product: Product, count = 3): Product[] {
  const sameFamily = fragrances.filter((p) => p.slug !== product.slug && p.family === product.family);
  const others = fragrances.filter((p) => p.slug !== product.slug && p.family !== product.family);
  return [...sameFamily, ...others].slice(0, count);
}

export function productsByFamily(family: Family | "set" | "all") {
  return family === "all" ? products : products.filter((p) => p.family === family);
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Lightweight search across names, families, moods and notes. */
export function searchProducts(query: string): Product[] {
  const q = normalize(query);
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products
    .map((p) => {
      const fields = [
        [p.name, 6],
        [p.family, 4],
        [p.tagline, 2],
        [p.summary, 1],
        [(p.notes ? [...p.notes.top, ...p.notes.heart, ...p.notes.base] : p.contents ?? []).join(" "), 3],
        [(p.character?.mood ?? []).join(" "), 2],
      ] as const;
      let score = 0;
      for (const t of terms) {
        let hit = false;
        for (const [text, weight] of fields) {
          if (normalize(text).includes(t)) {
            score += weight;
            hit = true;
          }
        }
        if (!hit) return { p, score: 0 };
      }
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}
