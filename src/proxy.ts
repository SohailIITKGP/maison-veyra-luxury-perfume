import { NextResponse, type NextRequest } from "next/server";
import { infoPages } from "@/data/pages";
import { products } from "@/data/products";

const known = {
  fragrances: new Set(products.map((p) => p.slug)),
  info: new Set(infoPages.map((p) => p.slug)),
};

/**
 * Pages stream their shell before content resolves, so an unknown slug would
 * otherwise answer 200 (with noindex). Checking slugs here — before streaming
 * starts — gives crawlers and analytics a true 404.
 */
export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  const set = known[section as keyof typeof known];
  if (set && slug && !set.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
  }
}

export const config = {
  matcher: ["/fragrances/:slug", "/info/:slug"],
};
