import type { Character } from "@/types";

const rows: { key: "intensity" | "sillage" | "longevity"; label: string; ends: [string, string] }[] = [
  { key: "intensity", label: "Intensity", ends: ["Soft", "Rich"] },
  { key: "sillage", label: "Sillage", ends: ["Close", "Trailing"] },
  { key: "longevity", label: "Presence", ends: ["Fleeting", "Lasting"] },
];

export function CharacterScale({ character }: { character: Character }) {
  return (
    <div>
      <dl className="space-y-6">
        {rows.map((r) => (
          <div key={r.key}>
            <dt className="flex items-baseline justify-between text-sm">
              <span className="label text-[0.6875rem]">{r.label}</span>
              <span className="sr-only">
                {character[r.key]} of 5
              </span>
            </dt>
            <dd className="mt-3">
              <div className="flex gap-1" aria-hidden>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`h-[3px] flex-1 ${n <= character[r.key] ? "bg-charcoal" : "bg-line"}`} />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-stone" aria-hidden>
                <span>{r.ends[0]}</span>
                <span>{r.ends[1]}</span>
              </div>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm">
        <span className="text-stone">Mood — </span>
        <span className="font-serif text-lg italic">{character.mood.join(", ")}</span>
      </p>
      <p className="mt-4 text-xs leading-relaxed text-stone">
        Descriptive guidance from the perfumer&rsquo;s brief, not a laboratory measurement. Every fragrance wears differently on every skin.
      </p>
    </div>
  );
}
