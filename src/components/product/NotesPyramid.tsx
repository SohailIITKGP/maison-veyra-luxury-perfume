import type { Notes } from "@/types";

const tiers: { key: keyof Notes; label: string; hint: string; inset: [number, number]; tone: string }[] = [
  { key: "top", label: "Top notes", hint: "The first impression", inset: [31, 21], tone: "bg-sand-light" },
  { key: "heart", label: "Heart notes", hint: "The character, over hours", inset: [20.5, 10.5], tone: "bg-sand" },
  { key: "base", label: "Base notes", hint: "What remains on skin", inset: [10, 0], tone: "bg-[#CFC5B5]" },
];

/** Olfactory pyramid drawn as three stacked trapezoids. */
export function NotesPyramid({ notes }: { notes: Notes }) {
  return (
    <div className="mx-auto max-w-3xl">
      <ol className="space-y-1.5">
        {tiers.map((t) => {
          const [a, b] = t.inset;
          return (
            <li key={t.key} className="relative">
              <div
                className={`${t.tone} px-[24%] py-7 text-center sm:py-9`}
                style={{ clipPath: `polygon(${a}% 0, ${100 - a}% 0, ${100 - b}% 100%, ${b}% 100%)`, paddingInline: `${a + 4}%` }}
              >
                <h3 className="eyebrow text-bronze-deep">{t.label}</h3>
                <p className="mt-2 font-serif text-[1.15rem] leading-snug sm:text-[1.6rem]">{notes[t.key].join(" · ")}</p>
              </div>
              <p className="absolute top-1/2 hidden -translate-y-1/2 text-xs text-stone italic md:block" style={{ left: 0, maxWidth: `${b + 2}%` }}>
                {t.key !== "base" && t.hint}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-center text-xs text-stone">Top notes lead for the first minutes; the heart unfolds over hours; the base lingers longest.</p>
    </div>
  );
}
