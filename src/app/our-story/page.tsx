import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Maison Veyra composes fragrances the way memory works — slowly, and in fragments. Read the story of the house.",
  alternates: { canonical: "/our-story" },
};

const materials = [
  ["Sandalwood", "Santal No. 04"],
  ["Labdanum", "Ambre 09"],
  ["Orris", "Iris Poudré"],
  ["Tuberose", "Fleur de Nuit"],
  ["Vetiver", "Vétiver Fumé"],
  ["White musk", "Sillage Blanc"],
];

export default function OurStoryPage() {
  return (
    <article>
      <header className="container-veyra pt-16 pb-20 md:pt-28 md:pb-32">
        <p className="eyebrow rise text-bronze-deep">Our Story</p>
        <h1 className="display rise mt-6 max-w-5xl text-[3.1rem] md:text-[5.4rem] lg:text-[6.6rem]" style={{ animationDelay: "0.15s" }}>
          We make fragrances the way memory works — <em>slowly, and in fragments.</em>
        </h1>
      </header>

      <section className="container-veyra grid gap-12 pb-24 md:pb-36 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4 lg:col-start-2 lg:pt-40">
          <p className="eyebrow text-stone">I. Memory</p>
          <p className="mt-6 font-serif text-[1.65rem] leading-snug">
            Maison Veyra began with a question: why can a scent return us to a place more completely than a photograph?
          </p>
          <p className="mt-6 leading-relaxed text-ink/80">
            The answer is partly anatomy — smell travels to the parts of the brain that hold emotion and memory — but mostly it is feeling. We never remember a
            scent precisely. We remember who we were when we first met it.
          </p>
          <p className="mt-4 leading-relaxed text-ink/80">
            So each Veyra fragrance begins as a single remembered moment, written down in words before a single material is weighed.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/editorial/archway.webp" alt="A plaster archway niche holding a single bottle in slanting window light" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-xs tracking-[0.08em] text-stone">The arch — a doorway to a remembered room — recurs throughout the house.</figcaption>
          </figure>
        </Reveal>
      </section>

      <section aria-labelledby="materials-title" className="bg-charcoal text-ivory">
        <Reveal>
          <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[24/10]">
            <Image src="/images/editorial/materials.webp" alt="Sandalwood, golden resin, violet and rose petals and tied vetiver laid along a travertine shelf" fill sizes="100vw" className="object-cover" />
          </div>
        </Reveal>
        <div className="container-veyra grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-bronze">II. Material</p>
            <h2 id="materials-title" className="display mt-5 text-[2.6rem] md:text-[3.8rem]">
              One material at the <em>heart</em> of each.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <p className="leading-relaxed text-ivory/75">
              Rather than building fragrances from fashionable accords, every composition is organised around one raw material and the memory it carries.
              Everything else in the formula exists to reveal it — to warm it, cool it, or cast it in shadow.
            </p>
            <ul className="mt-10 divide-y divide-ivory/15 border-y border-ivory/15">
              {materials.map(([m, f]) => (
                <li key={m} className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-serif text-2xl">{m}</span>
                  <span className="text-sm text-ivory/60">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="container-veyra grid gap-12 py-24 md:py-36 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5 lg:col-start-1">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/editorial/scent-strips.webp" alt="Scent strips fanned in a glass beaker on a walnut table" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col justify-end lg:col-span-5 lg:col-start-7">
          <p className="eyebrow text-stone">III. Composition</p>
          <blockquote className="mt-6">
            <p className="display text-[2.2rem] italic md:text-[3rem]">“A formula is finished when there is nothing left to remove.”</p>
          </blockquote>
          <p className="mt-8 leading-relaxed text-ink/80">
            Compositions are worn for weeks before they are judged — on skin, on wool, in cold air and warm rooms. Many are abandoned. The collection grows
            rarely and deliberately, which is why there are six fragrances, not sixty.
          </p>
        </Reveal>
      </section>

      <section className="bg-paper py-24 md:py-36">
        <div className="container-veyra">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/10]">
              <Image src="/images/editorial/trace.webp" alt="A single bottle on draped linen in evening light" fill sizes="100vw" className="object-cover object-[70%_50%]" />
            </div>
          </Reveal>
          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow text-stone">IV. The trace</p>
              <h2 className="display mt-5 text-[2.6rem] md:text-[3.8rem]">
                What remains <em>after you leave.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
              <p className="leading-relaxed text-ink/80">
                Perfumers call it sillage: the trail a fragrance leaves in the air behind someone. It is the most personal thing a scent can do — the part of it
                that belongs to other people&rsquo;s memories of you.
              </p>
              <p className="mt-4 leading-relaxed text-ink/80">
                Veyra fragrances are designed with that trace in mind. Some stay close, discovered only in an embrace; others linger in a room. None of them
                announce themselves before you do.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-veyra py-24 text-center md:py-36">
        <Reveal>
          <p className="display mx-auto max-w-3xl text-[2.4rem] md:text-[3.6rem]">
            Find the one that <em>remembers you.</em>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/fragrances/discovery-set">Begin with the Discovery Set</ButtonLink>
            <ButtonLink href="/shop" variant="outline">
              Explore the collection
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
