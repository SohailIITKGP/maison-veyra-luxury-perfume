import type { Order } from "@/types";
import type { DemoUser } from "@/store/account";

/** Sample data for the demo account. Clearly fictional. */
export const demoUser: DemoUser = {
  firstName: "Camille",
  lastName: "Laurent",
  email: "camille@example.com",
  memberSince: "2025-03-14T10:00:00.000Z",
};

export const sampleOrders: Order[] = [
  {
    id: "MV-SAMPLE1",
    createdAt: "2026-09-02T14:20:00.000Z",
    email: demoUser.email,
    address: { firstName: "Camille", lastName: "Laurent", line1: "18 Rue des Archives", city: "Paris", postalCode: "75004", country: "France" },
    shippingMethod: "Standard delivery",
    status: "delivered",
    payment: "simulated",
    lines: [
      { productSlug: "santal-no-04", variantId: "santal-no-04-50", name: "Santal No. 04", variantLabel: "50 ml", unitPrice: 16500, quantity: 1, image: "/images/products/santal-no-04-1.webp" },
    ],
    totals: { subtotal: 16500, shipping: 0, tax: 1320, total: 17820 },
  },
  {
    id: "MV-SAMPLE0",
    createdAt: "2026-06-11T09:05:00.000Z",
    email: demoUser.email,
    address: { firstName: "Camille", lastName: "Laurent", line1: "18 Rue des Archives", city: "Paris", postalCode: "75004", country: "France" },
    shippingMethod: "Standard delivery",
    status: "delivered",
    payment: "simulated",
    lines: [
      { productSlug: "discovery-set", variantId: "discovery-set-6x2", name: "The Discovery Set", variantLabel: "6 × 2 ml", unitPrice: 3800, quantity: 1, image: "/images/products/discovery-set-1.webp" },
    ],
    totals: { subtotal: 3800, shipping: 800, tax: 304, total: 4904 },
  },
];
