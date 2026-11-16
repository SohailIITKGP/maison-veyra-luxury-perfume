import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="overflow-hidden bg-paper py-24 md:py-36">
      <div className="container-veyra grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <figure>
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src="/images/editorial/trace.webp"
                alt="Fleur de Nuit standing on draped linen in low evening light, a fallen petal beside it"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-[70%_50%]"
              />
            </div>
            <figcaption className="mt-3 text-xs tracking-[0.08em] text-stone">Fleur de Nuit, at the end of the day.</figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col justify-center lg:col-span-4 lg:col-start-9">
          <p className="eyebrow text-bronze-deep">The House</p>
          <h2 id="story-title" className="display mt-4 text-[2.6rem] md:text-[3.8rem]">
            The art of leaving a <em>trace.</em>
          </h2>
          <div className="mt-7 space-y-5 text-[1.0625rem] leading-relaxed text-ink/80">
            <p>
              Scent is the sense most closely bound to memory. A stranger passes on the stairs and, for a moment, you are somewhere else
              entirely — a kitchen, a coat, a summer.
            </p>
            <p>
              Maison Veyra composes fragrances to be remembered in that way: not loudly, but precisely. Each one begins as a single memory and is
              refined until it carries the feeling, rather than the facts.
            </p>
          </div>
          <Link href="/our-story" className="link-line label mt-9 self-start text-[0.6875rem]">
            Read our story
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-4 lg:col-start-2 lg:mt-6">
          <div className="relative mx-auto aspect-[4/5] w-3/4 max-w-sm overflow-hidden sm:w-1/2 lg:w-full">
            <Image
              src="/images/editorial/scent-strips.webp"
              alt="Perfumer's scent strips fanned in a glass beaker on a walnut worktable"
              fill
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="flex items-center lg:col-span-5 lg:col-start-7 lg:pt-24">
          <blockquote>
            <p className="display text-[2rem] italic md:text-[2.6rem]">
              “A fragrance is the only thing we wear that stays in the room after we have left it.”
            </p>
            <footer className="eyebrow mt-6 text-stone">From the house notebook</footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
