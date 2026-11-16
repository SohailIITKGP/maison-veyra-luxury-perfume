import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { infoPages } from "@/data/pages";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/shop", "/our-story"].map((path) => ({ url: `${brand.url}${path}`, changeFrequency: "weekly" as const, priority: path ? 0.8 : 1 }));
  return [
    ...routes,
    ...products.map((p) => ({ url: `${brand.url}/fragrances/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...infoPages.map((p) => ({ url: `${brand.url}/info/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
