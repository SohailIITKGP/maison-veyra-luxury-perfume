import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CharacterScale } from "@/components/product/CharacterScale";
import { Disclosure } from "@/components/product/Disclosure";
import { NotesPyramid } from "@/components/product/NotesPyramid";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { families, products } from "@/data/products";
import { getProduct, relatedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { jsonLd, productJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/fragrances/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Fragrance not found" };
  const from = formatPrice(Math.min(...product.variants.map((v) => v.price)));
  return {
    title: product.kind === "set" ? product.name : `${product.name} — Eau de Parfum`,
    description: `${product.summary} From ${from}.`,
    alternates: { canonical: `/fragrances/${product.slug}` },
    openGraph: {
      title: `${product.name} · Maison Veyra`,
      description: product.summary,
      images: [{ url: product.images[0].src, width: 1600, height: 2000, alt: product.images[0].alt }],
    },
  };
}

export default function ProductPage({ params }: PageProps<"/fragrances/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <div className="container-veyra grid gap-10 pt-16 pb-20 lg:grid-cols-12 lg:gap-12" aria-busy="true" aria-label="Loading fragrance">
      <div className="aspect-[4/5] bg-sand-light lg:col-span-7" />
      <div className="space-y-5 lg:col-span-5">
        <div className="h-3 w-40 bg-sand-light" />
        <div className="h-14 w-3/4 bg-sand-light" />
        <div className="h-5 w-1/2 bg-sand-light" />
        <div className="mt-10 h-20 bg-sand-light" />
        <div className="h-13 bg-sand-light" />
      </div>
    </div>
  );
}

async function ProductContent({ params }: { params: PageProps<"/fragrances/[slug]">["params"] }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const isSet = product.kind === "set";
  const familyLabel = isSet ? "Discovery" : families[product.family as keyof typeof families].label;
  const related = isSet ? products.filter((p) => p.signature) : [...relatedProducts(product, 3), getProduct("discovery-set")!];
  const storyImage = product.images[2] ?? product.images[1];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productJsonLd(product))} />

      <div className="container-veyra pt-6 pb-20 lg:pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-stone lg:mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/shop" className="hover:text-charcoal">
                The Collection
              </Link>
            </li>
            <li aria-hidden>/</li>
            {!isSet && (
              <>
                <li>
                  <Link href={`/shop?family=${product.family}`} className="hover:text-charcoal">
                    {familyLabel}
                  </Link>
                </li>
                <li aria-hidden>/</li>
              </>
            )}
            <li aria-current="page" className="text-charcoal">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-bronze-deep">
                {isSet ? "Discovery Set" : `Nº ${product.number} · ${familyLabel} · Eau de Parfum`}
              </p>
              <h1 className="display mt-4 text-[3rem] md:text-[4rem]">{product.name}</h1>
              <p className="mt-2 font-serif text-[1.4rem] text-stone italic">{product.tagline}</p>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink/85">{product.summary}</p>

              <div className="mt-8">
                <PurchasePanel product={product} />
              </div>

              <div className="mt-10 border-t border-line">
                <Disclosure title="Description" open>
                  {product.description.map((p) => (
                    <p key={p} className="mb-4 last:mb-0">
                      {p}
                    </p>
                  ))}
                </Disclosure>
                {isSet ? (
                  <Disclosure title="What's inside">
                    <ul className="space-y-1">
                      {product.contents!.map((c) => (
                        <li key={c}>{c} — 2 ml eau de parfum, spray vial</li>
                      ))}
                    </ul>
                  </Disclosure>
                ) : (
                  <Disclosure title="How to wear">
                    <p>
                      Spray once or twice on pulse points — the inside of the wrists, the base of the throat, behind the ears — from a short distance. Let it
                      settle rather than rubbing. Fragrance clings well to hair and natural fibres.
                    </p>
                  </Disclosure>
                )}
                <Disclosure title="Shipping & returns">
                  <p>
                    Standard delivery in 3–5 business days, complimentary on orders over $150. Express delivery in 1–2 business days. Unopened items may be
                    returned within 30 days. <Link href="/info/shipping" className="underline underline-offset-4">Shipping details</Link> ·{" "}
                    <Link href="/info/returns" className="underline underline-offset-4">Returns policy</Link>
                  </p>
                </Disclosure>
              </div>
            </div>
          </div>
        </div>
      </div>

      {product.notes && product.character && (
        <section aria-labelledby="notes-title" className="bg-paper py-20 md:py-32">
          <div className="container-veyra">
            <Reveal className="text-center">
              <p className="eyebrow text-bronze-deep">The composition</p>
              <h2 id="notes-title" className="display mt-4 text-[2.6rem] md:text-[3.6rem]">
                Notes of <em>{product.name}</em>
              </h2>
            </Reveal>
            <Reveal className="mt-14">
              <NotesPyramid notes={product.notes} />
            </Reveal>
            <div className="mx-auto mt-20 grid max-w-5xl gap-14 md:grid-cols-2 md:gap-20">
              <Reveal>
                <h3 className="eyebrow text-bronze-deep">Character</h3>
                <div className="mt-6">
                  <CharacterScale character={product.character} />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h3 className="eyebrow text-bronze-deep">Family</h3>
                <p className="mt-6 font-serif text-[2rem] leading-tight">{familyLabel}</p>
                <p className="mt-3 leading-relaxed text-ink/80">{families[product.family as keyof typeof families].description}</p>
                <p className="mt-2 text-sm text-stone italic">{families[product.family as keyof typeof families].mood}</p>
                <Link href={`/shop?family=${product.family}`} className="link-line label mt-6 text-[0.6875rem]">
                  Explore the {familyLabel.toLowerCase()} family
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {product.story && storyImage && (
        <section aria-labelledby="pdp-story" className="container-veyra grid items-center gap-10 py-20 md:py-32 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5 lg:col-start-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={storyImage.src} alt={storyImage.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-8">
            <p className="eyebrow text-bronze-deep">The story</p>
            <h2 id="pdp-story" className="display mt-4 text-[2.4rem] md:text-[3.2rem]">
              {product.story.title}
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink/80">{product.story.body}</p>
          </Reveal>
        </section>
      )}

      {isSet && (
        <section aria-labelledby="set-contents" className="bg-paper py-20 md:py-28">
          <div className="container-veyra">
            <h2 id="set-contents" className="display text-[2.4rem] md:text-[3.2rem]">
              Inside the set
            </h2>
            <ol className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {product.contents!.map((name, i) => {
                const p = products.find((x) => x.name === name)!;
                return (
                  <li key={name} className="border-t border-line py-6">
                    <Link href={`/fragrances/${p.slug}`} className="group flex items-baseline gap-4">
                      <span className="font-serif text-lg text-bronze-deep italic">0{i + 1}</span>
                      <span>
                        <span className="block font-serif text-2xl group-hover:italic">{name}</span>
                        <span className="mt-1 block text-sm text-stone">{p.summary}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      <section aria-labelledby="related-title" className="container-veyra border-t border-line py-20 md:py-28">
        <h2 id="related-title" className="display text-[2.4rem] md:text-[3.2rem]">
          {isSet ? "The full bottles" : "You may also wear"}
        </h2>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
          {related.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
