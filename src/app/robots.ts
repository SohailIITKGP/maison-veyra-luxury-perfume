import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/checkout", "/bag", "/account", "/wishlist", "/api/"] },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
