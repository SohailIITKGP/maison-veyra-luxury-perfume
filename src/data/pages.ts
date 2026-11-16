export interface InfoPage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

/** Client-care and legal content. Demo copy — to be replaced with the client's policies. */
export const infoPages: InfoPage[] = [
  {
    slug: "shipping",
    title: "Shipping",
    description: "Delivery options, timings and costs for Maison Veyra orders.",
    intro: "Every order is wrapped by hand in tissue and linen-paper before it leaves the house.",
    sections: [
      { heading: "Delivery options", body: ["Standard delivery — 3 to 5 business days, $8, or complimentary on orders over $150.", "Express delivery — 1 to 2 business days, $18."] },
      { heading: "Dispatch", body: ["Orders placed before 1 pm on a business day are dispatched the same day. You will receive tracking details by email once your parcel is on its way."] },
      { heading: "International", body: ["Fragrance is classed as a restricted good for air freight in some regions. Available destinations and any duties are shown at checkout."] },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    description: "How to return or exchange a Maison Veyra purchase.",
    intro: "If a fragrance is not right for you, we would rather you found the one that is.",
    sections: [
      { heading: "Unopened items", body: ["Unopened items in their original condition may be returned within 30 days of delivery for a full refund to the original payment method."] },
      { heading: "Opened bottles", body: ["For hygiene reasons opened full bottles cannot be returned. This is why every full bottle ships with two complimentary samples — try those first, and keep the bottle sealed until you are sure."] },
      { heading: "Discovery Set credit", body: ["The price of a Discovery Set is credited toward a full bottle purchased within 60 days, using the code printed inside the box."] },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Contact Maison Veyra client care.",
    intro: "Our client care team can help with orders, deliveries and choosing a fragrance.",
    sections: [
      { heading: "Write to us", body: ["care@maisonveyra.example — we reply within one business day."] },
      { heading: "Hours", body: ["Monday to Friday, 9:00–18:00."] },
      { heading: "Fragrance advice", body: ["Not sure where to begin? Tell us which scents you have loved before and we will suggest two or three to try from the Discovery Set."] },
    ],
  },
  {
    slug: "faq",
    title: "Frequently asked",
    description: "Answers to common questions about Maison Veyra fragrances and orders.",
    intro: "If your question is not answered here, our client care team is glad to help.",
    sections: [
      { heading: "What concentration are Veyra fragrances?", body: ["All six are eaux de parfum, composed to wear close to the skin and develop over the course of the day."] },
      { heading: "Which size should I choose?", body: ["30 ml suits travel or a first bottle; 50 ml is the most popular size; 100 ml is the most economical for a fragrance you wear daily."] },
      { heading: "Can I layer fragrances?", body: ["Yes. Sillage Blanc was composed as a base layer and pairs well beneath any other Veyra fragrance, particularly Santal No. 04 and Fleur de Nuit."] },
      { heading: "How should I store my fragrance?", body: ["Away from direct sunlight and heat, ideally in its box. A bathroom shelf is the least kind place for a perfume."] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    description: "How Maison Veyra handles personal data.",
    intro: "This demonstration storefront does not collect or transmit personal data.",
    sections: [
      { heading: "In this demo", body: ["Your bag, wishlist, demo account and demo orders are stored only in your browser's local storage. Clearing your browser data removes them. No analytics or tracking scripts are installed."] },
      { heading: "In production", body: ["A launched store would publish a full privacy notice covering order processing, payment providers, email marketing consent and cookie choices, reviewed by the client's legal advisers."] },
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    description: "Terms of use for the Maison Veyra demonstration storefront.",
    intro: "Maison Veyra is a fictional brand created to demonstrate the design and engineering of a luxury e-commerce experience.",
    sections: [
      { heading: "No real transactions", body: ["No products are sold, no payments are taken and no goods are shipped. Prices, policies and product descriptions are illustrative."] },
      { heading: "Imagery", body: ["All product and editorial imagery is original artwork created for this concept. Brand names and likenesses of other fragrance houses are not used."] },
    ],
  },
];
