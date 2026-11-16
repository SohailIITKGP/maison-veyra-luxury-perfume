import { expect, test, type Page } from "@playwright/test";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  (page as Page & { errors: string[] }).errors = errors;
});

test.afterEach(async ({ page }) => {
  expect((page as Page & { errors: string[] }).errors, "no console errors").toEqual([]);
});

test("homepage presents the campaign and links into the collection", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Maison Veyra/);
  await expect(page.getByRole("heading", { level: 1, name: /Some moments are meant to linger/ })).toBeVisible();
  await expect(page.locator("#signature-title")).toBeVisible();
  await noHorizontalOverflow(page);
  await page.getByRole("link", { name: "Explore the Collection" }).click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByTestId("product-card").locator("visible=true")).toHaveCount(7);
});

test("collection filters and sorting work", async ({ page }) => {
  await page.goto("/shop");
  if (isMobile(page)) {
    await page.getByRole("button", { name: /Filter & sort/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Floral" }).click();
  } else {
    await page.getByRole("group", { name: "Filter by family" }).getByRole("button", { name: "Floral" }).click();
  }
  await expect(page).toHaveURL(/family=floral/);
  const names = page.locator("main").getByTestId("product-card").locator("visible=true").locator("h3");
  await expect(names).toHaveText(["Fleur de Nuit", "Iris Poudré"]);

  await page.goto("/shop?sort=price-asc");
  await expect(names.first()).toHaveText("The Discovery Set");
  await page.goto("/shop?sort=name");
  await expect(names.first()).toHaveText("Ambre 09");
  await noHorizontalOverflow(page);
});

test("product size selection updates price and the bag variant", async ({ page }) => {
  await page.goto("/fragrances/santal-no-04");
  await expect(page.getByRole("heading", { level: 1, name: "Santal No. 04" })).toBeVisible();
  await expect(page.getByTestId("pdp-price")).toContainText("$165");
  await page.getByText("100 ml", { exact: true }).click();
  await expect(page.getByTestId("pdp-price")).toContainText("$240");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.getByTestId("add-to-bag")).toContainText("$480");
  await page.getByTestId("add-to-bag").click();

  const drawer = page.getByRole("dialog", { name: /Your bag/ });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText("Added — Santal No. 04, 100 ml")).toBeVisible();
  await expect(page.getByTestId("drawer-subtotal")).toHaveText("$480");
  await drawer.getByRole("button", { name: "Decrease quantity" }).click();
  await expect(page.getByTestId("drawer-subtotal")).toHaveText("$240");
  await noHorizontalOverflow(page);
});

test("bag: change size, quantity, remove, persistence and empty state", async ({ page }) => {
  await page.goto("/fragrances/ambre-09");
  await page.getByTestId("add-to-bag").click();
  await page.keyboard.press("Escape");
  await page.goto("/bag");
  await expect(page.locator("main").getByTestId("line-item").locator("visible=true")).toHaveCount(1);
  await expect(page.getByTestId("summary-subtotal")).toHaveText("$175");
  await expect(page.getByTestId("summary-shipping")).toHaveText("Complimentary");

  await page.getByLabel("Size for Ambre 09").selectOption({ label: "30 ml — $105" });
  await expect(page.getByTestId("summary-subtotal")).toHaveText("$105");
  await expect(page.getByTestId("summary-shipping")).toHaveText("$8");
  await expect(page.getByTestId("summary-tax")).toHaveText("$8.40");
  await expect(page.getByTestId("summary-total")).toHaveText("$121.40");

  await page.reload();
  await expect(page.getByTestId("summary-subtotal")).toHaveText("$105");

  await page.locator("main").getByRole("button", { name: "Remove" }).click();
  await expect(page.locator("main").getByText("Your bag is empty.")).toBeVisible();
});

test("wishlist add, persist, move to bag and remove", async ({ page }) => {
  await page.goto("/fragrances/fleur-de-nuit");
  await page.getByRole("button", { name: "Save Fleur de Nuit to wishlist" }).first().click();
  await page.goto("/wishlist");
  await page.reload();
  const main = page.locator("main");
  await expect(main.getByTestId("wishlist-item")).toHaveCount(1);
  await main.getByRole("button", { name: /Add to bag/ }).click();
  await expect(page.getByRole("dialog", { name: /Your bag/ })).toContainText("Fleur de Nuit");
  await page.keyboard.press("Escape");
  await main.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(main.getByText("Nothing saved yet.")).toBeVisible();
});

test("search finds fragrances by note", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search fragrances" }).click();
  await page.getByRole("searchbox").fill("tuberose");
  const dialog = page.getByRole("dialog", { name: "Search fragrances" });
  await expect(dialog.getByRole("link", { name: /Fleur de Nuit/ })).toBeVisible();
  await dialog.getByRole("link", { name: /Fleur de Nuit/ }).click();
  await expect(page).toHaveURL(/fleur-de-nuit/);
  await expect(page.getByRole("heading", { level: 1, name: "Fleur de Nuit" })).toBeVisible();
});

test("complete simulated checkout and see the order in the account", async ({ page }) => {
  await page.goto("/fragrances/discovery-set");
  await page.getByTestId("add-to-bag").click();
  await page.getByRole("dialog", { name: /Your bag/ }).getByRole("link", { name: "Proceed to checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  const main = page.locator("main");
  await page.getByRole("button", { name: "Continue to delivery" }).click();
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await main.getByLabel("Email address").fill("client@example.com");
  await page.getByRole("button", { name: "Continue to delivery" }).click();

  await page.getByRole("button", { name: "Continue to shipping" }).click();
  await expect(page.getByText("Please enter your first name.")).toBeVisible();
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Moreau");
  await page.getByLabel("Street address").fill("12 Linden Street");
  await page.getByLabel("City").fill("Boston");
  await page.getByLabel("Postal code").fill("02108");
  await page.getByRole("button", { name: "Continue to shipping" }).click();

  await main.getByRole("radio", { name: /Express delivery/ }).check();
  await expect(page.getByTestId("summary-shipping")).toHaveText("$18");
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page.getByText(/Card numbers are never collected/)).toBeVisible();
  // $38 + $18 shipping + $3.04 tax
  await expect(page.getByTestId("place-order")).toContainText("$59.04");
  await page.getByTestId("place-order").click();

  await expect(page).toHaveURL(/\/checkout\/confirmation$/);
  await expect(page.getByRole("heading", { level: 1, name: /Thank you, Ada/ })).toBeVisible();
  await expect(page.getByText("Simulated — not charged")).toBeVisible();

  await page.goto("/account");
  await page.getByRole("button", { name: "Continue with the demo account" }).click();
  await expect(page.getByRole("heading", { name: /Welcome, Camille/ })).toBeVisible();
  await expect(main.getByTestId("order-row")).toHaveCount(3);
});

test("checkout API recomputes prices and rejects unknown items", async ({ request }) => {
  const address = { firstName: "A", lastName: "B", line1: "1 St", city: "C", postalCode: "12345", country: "United States" };
  const ok = await request.post("/api/checkout", {
    data: { email: "a@b.co", address, shippingMethod: "standard", lines: [{ productSlug: "santal-no-04", variantId: "santal-no-04-30", quantity: 2, price: 1 }] },
  });
  expect(ok.status()).toBe(200);
  const body = await ok.json();
  expect(body.totals).toEqual({ subtotal: 19600, shipping: 0, tax: 1568, total: 21168 });
  expect(body.payment).toBe("simulated");

  const bad = await request.post("/api/checkout", {
    data: { email: "a@b.co", address, shippingMethod: "standard", lines: [{ productSlug: "santal-no-04", variantId: "free-bottle", quantity: 1 }] },
  });
  expect(bad.status()).toBe(422);
});

test("newsletter validates email", async ({ page }) => {
  await page.goto("/our-story");
  const footer = page.locator("footer");
  await footer.getByRole("button", { name: "Subscribe" }).click();
  await expect(footer.getByRole("alert")).toContainText("valid email");
  await footer.getByLabel("Email address").fill("reader@example.com");
  await footer.getByRole("button", { name: "Subscribe" }).click();
  await expect(footer.getByRole("status")).toContainText("Thank you");
});

test("mobile navigation and key pages have no horizontal overflow", async ({ page }) => {
  test.skip(!isMobile(page), "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Our Story" }).click();
  await expect(page).toHaveURL(/our-story/);
  for (const path of ["/", "/shop", "/fragrances/iris-poudre", "/fragrances/discovery-set", "/our-story", "/bag", "/checkout", "/wishlist", "/account", "/info/shipping"]) {
    await page.goto(path);
    await noHorizontalOverflow(page);
  }
});

test("unknown product shows the 404 page", async ({ page }) => {
  const res = await page.goto("/fragrances/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /This page has faded/ })).toBeVisible();
  (page as Page & { errors: string[] }).errors.length = 0; // the 404 response itself is logged
});
