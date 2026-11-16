import { getImageProps } from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

const alt = "Ambre 09, Santal No. 04 and Sillage Blanc on travertine plinths in late window light";

export function Hero() {
  const common = { alt, sizes: "100vw", priority: true } as const;
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: "/images/campaign/hero.webp", width: 2400, height: 1400 });
  const { props: { srcSet: mobile, ...rest } } = getImageProps({ ...common, src: "/images/campaign/hero-mobile.webp", width: 1200, height: 1800 });

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-sand-light">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop} />
        <source srcSet={mobile} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is supplied via getImageProps */}
        <img {...rest} className="settle absolute inset-0 -z-10 size-full object-cover object-[50%_80%] md:object-[72%_50%]" />
      </picture>

      <div className="container-veyra flex h-[calc(100svh-6.5rem)] max-h-[60rem] min-h-[36rem] flex-col pt-12 pb-10 md:min-h-[40rem] md:justify-center md:pt-0 md:pb-0 lg:h-[calc(100svh-7.5rem)]">
        <div className="max-w-[34rem] md:max-w-[40%] lg:max-w-[36rem]">
          <p className="eyebrow rise text-bronze-deep" style={{ animationDelay: "0.1s" }}>
            Eaux de Parfum · Collection I
          </p>
          <h1 id="hero-title" className="display rise mt-5 text-[3.1rem] xs:text-[3.5rem] md:text-[4.4rem] lg:text-[5.6rem]" style={{ animationDelay: "0.2s" }}>
            Some moments are <em className="font-light">meant to linger.</em>
          </h1>
          <p className="rise mt-6 max-w-sm text-[1.0625rem] leading-relaxed text-ink/80" style={{ animationDelay: "0.35s" }}>
            A collection of fragrances inspired by the art of remembering.
          </p>
          <div className="rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "0.5s" }}>
            <ButtonLink href="/shop">Explore the Collection</ButtonLink>
            <Link href="/fragrances/discovery-set" className="link-line label text-[0.6875rem] max-sm:hidden">
              Begin with the Discovery Set
            </Link>
          </div>
        </div>
        <p className="mt-auto hidden text-[0.75rem] tracking-[0.08em] text-ink/70 md:absolute md:right-10 md:bottom-8 md:mt-0 md:block lg:right-16">
          Nº 09 Ambre · Nº 04 Santal · Nº 01 Sillage Blanc
        </p>
      </div>
    </section>
  );
}
