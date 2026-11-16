import { fragrances } from "@/lib/catalog";
import type { Moment, Presence, Product, Texture } from "@/types";

export interface FinderAnswers {
  moment: Moment;
  texture: Texture;
  presence: Presence;
}

export const finderQuestions = {
  moment: {
    label: "When do you most often wear fragrance?",
    options: [
      { value: "day", label: "In daylight" },
      { value: "dusk", label: "Into the evening" },
      { value: "night", label: "After dark" },
    ],
  },
  texture: {
    label: "Which texture draws you in?",
    options: [
      { value: "woods", label: "Warm woods" },
      { value: "petals", label: "Dark petals" },
      { value: "resins", label: "Golden resins" },
      { value: "skin", label: "Clean skin" },
    ],
  },
  presence: {
    label: "How should it be noticed?",
    options: [
      { value: "close", label: "Only up close" },
      { value: "trail", label: "A soft trail" },
      { value: "bold", label: "Unmistakably" },
    ],
  },
} as const;

/** Simple weighted match — texture matters most, then presence, then moment. */
export function recommend(answers: FinderAnswers): { product: Product; reason: string } {
  const scored = fragrances.map((p) => {
    const f = p.finder!;
    const score =
      (f.texture === answers.texture ? 5 : 0) +
      (f.presence === answers.presence ? 3 : 0) +
      (f.moments.includes(answers.moment) ? 2 : 0);
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const product = scored[0].p;
  const t = finderQuestions.texture.options.find((o) => o.value === answers.texture)!.label.toLowerCase();
  const pr = finderQuestions.presence.options.find((o) => o.value === answers.presence)!.label.toLowerCase();
  return {
    product,
    reason: `Drawn to ${t}, worn ${finderQuestions.moment.options.find((o) => o.value === answers.moment)!.label.toLowerCase()} and noticed ${pr}: ${product.summary}`,
  };
}
