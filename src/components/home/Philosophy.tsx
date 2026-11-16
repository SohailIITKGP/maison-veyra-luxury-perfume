import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

const principles = [
  {
    title: "Materials first",
    body: "Each composition is written around one raw material — sandalwood, orris, labdanum, vetiver — and everything else exists to reveal it.",
  },
  {
    title: "Composed, not assembled",
    body: "Formulas are revised slowly, worn for weeks, and released only when they feel finished. The collection grows rarely, and on purpose.",
  },
  {
    title: "Yours to complete",
    body: "A fragrance is unfinished until it meets skin. We design for the way scent changes on you — and leave room for it to become personal.",
  },
];

export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="container-veyra grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:gap-8">
      <Reveal className="lg:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="/images/editorial/archway.webp"
            alt="A plaster archway niche in window light, with a single bottle of Santal No. 04"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
      <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
        <Reveal>
          <p className="eyebrow text-bronze-deep">Our philosophy</p>
          <h2 id="philosophy-title" className="display mt-4 text-[2.6rem] md:text-[3.6rem]">
            Made slowly. <em>Worn personally.</em>
          </h2>
        </Reveal>
        <ol className="mt-12 divide-y divide-line border-y border-line">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="grid gap-2 py-7 sm:grid-cols-[3.5rem_12rem_1fr] sm:gap-6">
              <span className="font-serif text-xl text-bronze-deep italic">{["I", "II", "III"][i]}.</span>
              <h3 className="font-serif text-[1.6rem] leading-tight">{p.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-stone">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
