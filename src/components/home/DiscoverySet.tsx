import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/product/AddToBagButton";
import { Reveal } from "@/components/ui/Reveal";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const steps = [
  ["Wear one a day", "Apply in the morning and live with it until evening. Fragrance changes on skin; a paper strip cannot tell you this."],
  ["Notice what stays", "The one you keep thinking about — or the one others mention — is usually the right one."],
  ["Choose your bottle", "The price of the set is credited toward your first full bottle within 60 days."],
];

export function DiscoverySet() {
  const set = getProduct("discovery-set")!;
  const variant = set.variants[0];
  return (
    <section aria-labelledby="set-title" className="bg-sand-light py-24 md:py-36">
      <div className="container-veyra grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <Link href="/fragrances/discovery-set" className="relative block aspect-[12/7] overflow-hidden">
            <Image src={set.images[1].src} alt={set.images[1].alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <p className="eyebrow text-bronze-deep">Begin here</p>
          <h2 id="set-title" className="display mt-4 text-[2.6rem] md:text-[3.6rem]">
            The Discovery Set
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink/80">
            All six fragrances in 2 ml vials — enough to wear each one for several days before choosing a full bottle.
          </p>
          <ol className="mt-9 space-y-6">
            {steps.map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[2rem_1fr] gap-x-3">
                <span className="font-serif text-lg text-bronze-deep italic">0{i + 1}</span>
                <div>
                  <h3 className="text-[0.9375rem] font-medium">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <AddToBagButton slug={set.slug} variantId={variant.id} label={`Add to bag · ${formatPrice(variant.price)}`} />
            <Link href="/fragrances/discovery-set" className="link-line label text-[0.6875rem]">
              Details
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
