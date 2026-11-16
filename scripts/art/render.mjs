/**
 * Renders every art-directed scene to optimised WebP in /public/images.
 *
 *   npm run art              # render everything
 *   npm run art -- hero      # render jobs whose name contains "hero"
 *
 * Uses the Playwright Chromium already installed for e2e tests and sharp
 * (bundled with Next.js image optimisation) for encoding.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import * as S from "./scenes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const out = path.join(root, "public/images");
const filter = process.argv[2];

const jobs = [];
for (const slug of Object.keys(S.DIRECTION)) {
  jobs.push([`products/${slug}-1`, () => S.packshot(slug)]);
  jobs.push([`products/${slug}-2`, () => S.macro(slug)]);
  jobs.push([`products/${slug}-3`, () => S.packshot(slug, { variant: "dusk" })]);
}
jobs.push(["products/discovery-set-1", () => S.discoverySet()]);
jobs.push(["products/discovery-set-2", () => S.discoverySet({ wide: true })]);
jobs.push(["campaign/hero", () => S.hero()]);
jobs.push(["campaign/hero-mobile", () => S.hero({ mobile: true })]);
jobs.push(["editorial/scent-strips", () => S.scentStrips()]);
jobs.push(["editorial/archway", () => S.archway()]);
jobs.push(["editorial/materials", () => S.materials()]);
jobs.push(["editorial/trace", () => S.trace()]);
jobs.push(["og", () => S.ogCard()]);

const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Jost:wght@400;500&display=block";

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, build] of jobs) {
  if (filter && !name.includes(filter)) continue;
  const { svg, W, H } = build();
  await page.setViewportSize({ width: W, height: H });
  await page.setContent(
    `<!doctype html><html><head><link rel="stylesheet" href="${FONTS}"><style>html,body{margin:0;background:#000}svg{display:block}</style></head><body>${svg}</body></html>`,
    { waitUntil: "networkidle" },
  );
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('40px "Cormorant Garamond"'),
      document.fonts.load('italic 40px "Cormorant Garamond"'),
      document.fonts.load('40px "Jost"'),
      document.fonts.load('500 40px "Jost"'),
    ]);
    await document.fonts.ready;
  });
  const png = await page.screenshot({ type: "png" });
  const file = path.join(out, `${name}.${name === "og" ? "jpg" : "webp"}`);
  await mkdir(path.dirname(file), { recursive: true });
  const img = sharp(png);
  const buf = name === "og" ? await img.jpeg({ quality: 86, mozjpeg: true }).toBuffer() : await img.webp({ quality: 84, effort: 5 }).toBuffer();
  await writeFile(file, buf);
  console.log(`✓ ${name} ${W}×${H} ${(buf.length / 1024).toFixed(0)} kB`);
}
await browser.close();
