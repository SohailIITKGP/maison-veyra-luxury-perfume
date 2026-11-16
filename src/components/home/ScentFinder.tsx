"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { families } from "@/data/products";
import { useAddToBag } from "@/hooks/useAddToBag";
import { getVariant } from "@/lib/catalog";
import { finderQuestions, recommend, type FinderAnswers } from "@/lib/finder";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

const numerals = ["I", "II", "III", "IV"];

export function ScentFinder() {
  const uid = useId();
  const [answers, setAnswers] = useState<FinderAnswers>({ moment: "dusk", texture: "woods", presence: "close" });
  const { product, reason } = recommend(answers);
  const variant = getVariant(product, product.defaultVariantId)!;
  const addToBag = useAddToBag();

  return (
    <section aria-labelledby="finder-title" className="bg-charcoal py-24 text-ivory md:py-36">
      <div className="container-veyra grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="eyebrow text-bronze">Scent families</p>
          <h2 id="finder-title" className="display mt-4 text-[2.6rem] md:text-[3.8rem]">
            Find your <em>signature.</em>
          </h2>
          <p className="mt-6 max-w-md text-ivory/70">
            Every Veyra fragrance belongs to one of four families. Read them as temperaments rather than categories — then answer three questions.
          </p>
          <dl className="mt-12 divide-y divide-ivory/15 border-y border-ivory/15">
            {Object.entries(families).map(([key, f], i) => (
              <div key={key} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-5">
                <dt className="contents">
                  <span className="font-serif text-lg text-bronze italic">{numerals[i]}</span>
                  <Link href={`/shop?family=${key}`} className="font-serif text-2xl hover:italic">
                    {f.label}
                  </Link>
                </dt>
                <dd className="col-start-2 mt-1 text-sm leading-relaxed text-ivory/65">{f.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="space-y-9">
            {(Object.keys(finderQuestions) as (keyof FinderAnswers)[]).map((key, qi) => {
              const q = finderQuestions[key];
              return (
                <fieldset key={key}>
                  <legend className="flex items-baseline gap-3 text-[0.9375rem] text-ivory/85">
                    <span className="eyebrow text-bronze">0{qi + 1}</span>
                    {q.label}
                  </legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {q.options.map((o) => {
                      const id = `${uid}-${key}-${o.value}`;
                      const checked = answers[key] === o.value;
                      return (
                        <div key={o.value}>
                          <input
                            type="radio"
                            id={id}
                            name={`${uid}-${key}`}
                            value={o.value}
                            checked={checked}
                            onChange={() => setAnswers((a) => ({ ...a, [key]: o.value }))}
                            className="peer sr-only"
                          />
                          <label
                            htmlFor={id}
                            className={cn(
                              "inline-flex min-h-11 items-center border px-4 text-sm transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze",
                              checked ? "border-ivory bg-ivory text-charcoal" : "border-ivory/25 text-ivory/80 hover:border-ivory/60",
                            )}
                          >
                            {o.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          <div className="mt-12 border-t border-ivory/15 pt-10" aria-live="polite">
            {/* Re-keyed on change so the CSS entrance replays for each new match. */}
            <div key={product.slug} className="rise grid grid-cols-[7.5rem_1fr] gap-6 [animation-duration:0.6s] sm:grid-cols-[10rem_1fr] sm:gap-8">
                <Link href={`/fragrances/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-ink">
                  <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="160px" className="object-cover" />
                </Link>
                <div>
                  <p className="eyebrow text-bronze">Your match</p>
                  <h3 className="mt-2 font-serif text-[2rem] leading-tight">{product.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">{reason}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <button
                      type="button"
                      onClick={() => addToBag(product.slug, variant.id)}
                      className="label inline-flex min-h-11 items-center bg-ivory px-5 text-[0.6875rem] text-charcoal transition-colors hover:bg-sand"
                    >
                      Add {variant.label} · {formatPrice(variant.price)}
                    </button>
                    <Link href={`/fragrances/${product.slug}`} className="link-line label text-[0.6875rem]">
                      Discover
                    </Link>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
