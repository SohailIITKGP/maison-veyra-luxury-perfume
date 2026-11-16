import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { signatureCollection } from "@/lib/catalog";
import { SectionHeading } from "./SectionHeading";

export function SignatureCollection() {
  return (
    <section aria-labelledby="signature-title" className="container-veyra py-24 md:py-36">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading id="signature-title" eyebrow="The Signature Collection" title={<>Four ways of being <em>remembered.</em></>} />
        <Link href="/shop" className="link-line label shrink-0 self-start text-[0.6875rem] md:self-auto">
          View all fragrances
        </Link>
      </div>
      <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 md:mt-20 lg:grid-cols-4 lg:gap-x-6">
        {signatureCollection.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 0.08} className={i % 2 ? "lg:mt-16" : undefined}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
