/**
 * Captures README screenshots from a running server.
 *   npm run build && npm start   (in another terminal)
 *   node scripts/screenshots.mjs [baseUrl]
 */
import { chromium } from "playwright";
import sharp from "sharp";

const base = process.argv[2] ?? "http://localhost:3000";
const shots = [
  { name: "home-desktop", path: "/", viewport: { width: 1440, height: 900 }, scale: 2 },
  { name: "product-desktop", path: "/fragrances/santal-no-04", viewport: { width: 1440, height: 900 }, scale: 2 },
  { name: "shop-desktop", path: "/shop", viewport: { width: 1440, height: 900 }, scale: 2 },
  { name: "home-mobile", path: "/", viewport: { width: 390, height: 844 }, scale: 3, mobile: true },
  { name: "product-mobile", path: "/fragrances/fleur-de-nuit", viewport: { width: 390, height: 844 }, scale: 3, mobile: true },
];

const browser = await chromium.launch();
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.scale, isMobile: !!s.mobile, hasTouch: !!s.mobile });
  const page = await ctx.newPage();
  await page.goto(base + s.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600); // let the hero settle
  const png = await page.screenshot();
  await sharp(png).resize({ width: s.mobile ? 780 : 1600 }).webp({ quality: 86 }).toFile(`docs/screenshots/${s.name}.webp`);
  console.log("✓", s.name);
  await ctx.close();
}
await browser.close();
