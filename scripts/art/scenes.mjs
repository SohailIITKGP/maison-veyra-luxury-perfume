import {
  bottle, foldedLinen, grainAndVignette, grassBundle, leafShadow, linenDrape, petals, plinth, resin,
  shade, svgDoc, vial, wall, windowLight, woodBlock, linear, blur, radial,
} from "./lib.mjs";

/**
 * Art direction per fragrance. Keys match product slugs in src/data/products.ts.
 * wall / plinth / liquid palettes are tuned so the six packshots read as one shoot.
 */
export const DIRECTION = {
  "santal-no-04": {
    name: "Santal No. 04", liquid: ["#D9B783", "#B4884F"], cap: "bronze",
    wall: ["#E6DACA", "#CDBCA5"], floor: ["#BFAE96", "#A8957C"],
    plinth: { top: "#EEE6D9", front: "#D6C8B3" }, prop: "wood", leafSeed: 7,
  },
  "fleur-de-nuit": {
    name: "Fleur de Nuit", liquid: ["#9A4D5B", "#4E1F2B"], cap: "black",
    wall: ["#463A3B", "#2A2224"], floor: ["#2C2425", "#1C1617"],
    plinth: { top: "#5A4E4D", front: "#3D3433", edge: "#7D706C" }, prop: "petals", leafSeed: 3,
    light: "#F3D9D0", lightOpacity: 0.22, vignette: 0.35, dark: true,
  },
  "ambre-09": {
    name: "Ambre 09", liquid: ["#CF8434", "#8A4614"], cap: "bronze",
    wall: ["#D9B994", "#BD9468"], floor: ["#A9825A", "#8E6A46"],
    plinth: { top: "#E2C7A6", front: "#C4A07A" }, prop: "resin", leafSeed: 15, light: "#FFE7C4",
  },
  "sillage-blanc": {
    name: "Sillage Blanc", liquid: ["#F4EFE6", "#E0D5C3"], cap: "ivory",
    wall: ["#F2EDE5", "#E2DACD"], floor: ["#D9D0C1", "#CBC1B1"],
    plinth: { top: "#F7F3EC", front: "#E3DBCE" }, prop: "linen", leafSeed: 19, causticColor: "#FFF8EA",
  },
  "iris-poudre": {
    name: "Iris Poudré", liquid: ["#D8CAD3", "#AD98A8"], cap: "ivory",
    wall: ["#DDD6D2", "#C4BAB5"], floor: ["#B9AEA9", "#A39893"],
    plinth: { top: "#E8E2DD", front: "#CFC6C0" }, prop: "iris", leafSeed: 25,
  },
  "vetiver-fume": {
    name: "Vétiver Fumé", liquid: ["#A28F52", "#62522A"], cap: "black",
    wall: ["#BDB9A9", "#959080"], floor: ["#8C8776", "#76715F"],
    plinth: { top: "#C9C5B6", front: "#A9A493" }, prop: "grass", leafSeed: 31,
  },
};

function propFor(kind, { x, y, scale = 1, seed = 1 }) {
  switch (kind) {
    case "wood": return woodBlock({ x: x - 560 * scale, y: y - 118 * scale, w: 280 * scale, h: 100 * scale, seed, rotate: -2 });
    case "resin": return resin({ x: x - 200 * scale, y: y - 30 * scale, size: 95 * scale, seed, count: 4, spread: 260 * scale });
    case "petals": return petals({ x: x - 160 * scale, y: y - 40 * scale, size: 120 * scale, seed, count: 6 });
    case "linen": return foldedLinen({ x: x - 420 * scale, y: y, w: 360 * scale });
    case "iris": return petals({ x: x - 330 * scale, y: y - 20 * scale, size: 110 * scale, seed, count: 5, colors: ["#A897BC", "#5E4E7A"], stem: true });
    case "grass": return grassBundle({ x: x - 600 * scale, y: y - 40 * scale, len: 540 * scale, rotate: -6, seed });
    default: return { defs: "", body: "" };
  }
}

/** Primary packshot, 4:5. */
export function packshot(slug, { variant = "day", size = "100 ml" } = {}) {
  const d = DIRECTION[slug];
  const W = 1600, H = 2000;
  const dusk = variant === "dusk";
  const horizon = 1520;
  const topY = dusk ? 1520 : 1400;
  const baseY = topY + 44;
  const bx = dusk ? 980 : 800;
  const parts = [
    wall({ W, H, top: d.wall[0], bottom: d.wall[1], horizon, floorTop: d.floor[0], floorBottom: d.floor[1] }),
    windowLight({
      x: dusk ? -120 : 120, y: dusk ? 520 : 160, w: dusk ? 900 : 760, h: dusk ? 700 : 900,
      skew: dusk ? 0.75 : 0.34, shear: dusk ? -0.08 : -0.16, opacity: d.lightOpacity ?? (dusk ? 0.42 : 0.34), color: dusk ? "#FFD9A8" : d.light || "#FFF6E6",
    }),
    leafShadow({ x: dusk ? 1100 : 1050, y: dusk ? 120 : -40, scale: 1.25, rotate: dusk ? 150 : 120, seed: d.leafSeed, opacity: d.dark ? 0.3 : 0.15 }),
  ];
  parts.push(plinth({ x: dusk ? 380 : 300, w: dusk ? 1400 : 1000, topY, depth: 88, H, ...d.plinth, seed: 4 }));
  const b = bottle({
    x: bx, baseY, w: dusk ? 430 : 480, h: dusk ? 540 : 600, liquid: d.liquid, cap: d.cap, name: d.name, size,
    shadowLen: dusk ? 1.7 : 1.1, causticColor: d.causticColor,
  });
  const prop = propFor(d.prop, { x: bx - (dusk ? 40 : 0), y: baseY + 24, scale: dusk ? 1.3 : 1.15, seed: d.leafSeed });
  parts.push({ defs: b.defs, body: b.shadow }, prop, { body: b.body });
  if (dusk) {
    const warm = linear([[0, "#8A5A2E", 0.08], [0.55, "#5A3214", 0.3], [1, "#2E1808", 0.55]], { x1: 0, y1: 0, x2: 1, y2: 1 });
    parts.push({ defs: warm.def, body: `<rect width="${W}" height="${H}" fill="url(#${warm.id})" style="mix-blend-mode:multiply"/>` });
    parts.push(windowLight({ x: -260, y: 980, w: 1100, h: 520, skew: 1.1, shear: -0.04, opacity: 0.2, color: "#FFC98A", soft: 26 }));
  }
  parts.push(grainAndVignette({ W, H, vignette: d.vignette ?? (dusk ? 0.32 : 0.2) }));
  return { svg: svgDoc(W, H, parts), W, H, bottle: b };
}

/** Macro: the same scene, cropped tight on cap and label. */
export function macro(slug) {
  const { svg, W, H, bottle: b } = packshot(slug);
  const cw = 640, ch = 800;
  const cx = 800, cy = (b.bounds.capTop + b.bounds.labelY + b.bounds.labelH) / 2 + 20;
  return { svg: svg.replace(`viewBox="0 0 ${W} ${H}"`, `viewBox="${cx - cw / 2} ${cy - ch / 2} ${cw} ${ch}"`), W, H };
}

export function hero({ mobile = false } = {}) {
  const W = mobile ? 1200 : 2400;
  const H = mobile ? 1800 : 1400;
  const horizon = mobile ? 1500 : 1080;
  const parts = [
    wall({ W, H, top: "#E9DFD0", bottom: "#CDBBA3", horizon, floorTop: "#BCA88E", floorBottom: "#A38E73" }),
    windowLight({ x: mobile ? -100 : 80, y: mobile ? 80 : -60, w: mobile ? 820 : 1000, h: mobile ? 900 : 1000, skew: 0.45, shear: -0.16, opacity: 0.38 }),
    leafShadow({ x: mobile ? 760 : 1900, y: mobile ? -80 : -120, scale: mobile ? 1.1 : 1.5, rotate: 125, seed: 9, opacity: 0.16 }),
  ];
  const s = mobile ? 0.72 : 0.9;
  const ox = mobile ? 0 : 1100;
  const plinths = mobile
    ? [{ x: 90, w: 500, topY: 1400 }, { x: 560, w: 600, topY: 1560 }]
    : [{ x: ox + 40, w: 560, topY: 870 }, { x: ox + 560, w: 720, topY: 1040 }];
  // Plinths drawn back-to-front: taller one first.
  plinths.forEach((p, i) => parts.push(plinth({ ...p, depth: 70, H, top: "#EFE7DA", front: i ? "#D9CCB8" : "#D2C3AD", seed: 6 + i })));
  const p0 = plinths[0], p1 = plinths[1];
  const b1 = bottle({ x: p0.x + p0.w * 0.5, baseY: p0.topY + 34, w: 360 * s, h: 450 * s, liquid: DIRECTION["ambre-09"].liquid, cap: "bronze", name: "Ambre 09", shadowLen: 1.0 });
  const b2 = bottle({ x: p1.x + p1.w * 0.36, baseY: p1.topY + 38, w: 420 * s, h: 525 * s, liquid: DIRECTION["santal-no-04"].liquid, cap: "bronze", name: "Santal No. 04", shadowLen: 1.0 });
  const b3 = bottle({ x: p1.x + p1.w * 0.8, baseY: p1.topY + 46, w: 250 * s, h: 312 * s, liquid: DIRECTION["sillage-blanc"].liquid, cap: "ivory", name: "Sillage Blanc", size: "30 ml", shadowLen: 0.8, causticColor: "#FFF8EA" });
  parts.push({ defs: b1.defs, body: b1.shadow }, { body: b1.body });
  parts.push(resin({ x: p0.x + p0.w * 0.12, y: p0.topY + 40, size: 60 * s, seed: 3, count: 3, spread: 120 * s }));
  parts.push({ defs: b2.defs + b3.defs, body: b2.shadow + b3.shadow });
  parts.push({ body: b2.body + b3.body });
  parts.push(grainAndVignette({ W, H, vignette: 0.18 }));
  return { svg: svgDoc(W, H, parts), W, H };
}

export function discoverySet({ wide = false } = {}) {
  const W = wide ? 2400 : 1600, H = wide ? 1400 : 2000;
  const horizon = wide ? 1100 : 1500;
  const topY = wide ? 980 : 1380;
  const parts = [
    wall({ W, H, top: "#E8DFD2", bottom: "#D1C2AE", horizon, floorTop: "#BCAA92", floorBottom: "#A69279" }),
    windowLight({ x: wide ? 200 : 60, y: wide ? -80 : 120, w: 900, h: 900, skew: 0.4, opacity: 0.34 }),
    leafShadow({ x: wide ? 1800 : 1000, y: -60, scale: 1.3, rotate: 120, seed: 4, opacity: 0.14 }),
  ];
  const cx = W / 2;
  const plW = wide ? 1500 : 1200;
  parts.push(plinth({ x: cx - plW / 2, w: plW, topY, depth: 90, H, top: "#F0E9DE", front: "#D8CBB8", seed: 8 }));
  // Lid leaning on the wall behind the tray.
  const lidW = wide ? 760 : 680, lidH = wide ? 520 : 470;
  const lidG = linear([[0, "#F4EFE6"], [1, "#E1D7C7"]]);
  const sb = blur(22);
  const b4 = blur(4);
  parts.push({
    defs: lidG.def + sb.def + b4.def,
    body: `<g transform="translate(${cx - lidW / 2 + 40} ${topY + 40 - lidH}) rotate(-3)">
<rect x="30" y="30" width="${lidW}" height="${lidH}" fill="#20150B" opacity=".25" filter="url(#${sb.id})"/>
<rect width="${lidW}" height="${lidH}" fill="url(#${lidG.id})"/>
<rect x="18" y="18" width="${lidW - 36}" height="${lidH - 36}" fill="none" stroke="#A98B69" stroke-width="2"/>
<text x="${lidW / 2}" y="${lidH * 0.42}" text-anchor="middle" font-family="Jost" font-weight="500" font-size="${lidW * 0.04}" letter-spacing="${lidW * 0.018}" fill="#8E7356">MAISON VEYRA</text>
<text x="${lidW / 2}" y="${lidH * 0.58}" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="${lidW * 0.08}" fill="#1B1B19">The Discovery Set</text>
<text x="${lidW / 2}" y="${lidH * 0.7}" text-anchor="middle" font-family="Jost" font-size="${lidW * 0.024}" letter-spacing="${lidW * 0.01}" fill="#6B655B">SIX EAUX DE PARFUM · 6 × 2 ML</text>
</g>`,
  });
  // Tray with vials.
  const trayW = wide ? 820 : 760, trayH = 120;
  const ty = topY + 60;
  const tx = cx - trayW / 2;
  const trayG = linear([[0, "#EFE8DC"], [1, "#D9CEBD"]]);
  const inner = linear([[0, "#2C241C", 0.35], [1, "#2C241C", 0.05]]);
  parts.push({ defs: trayG.def + inner.def, body: `<ellipse cx="${cx + 60}" cy="${ty + trayH}" rx="${trayW * 0.6}" ry="22" fill="#1A1008" opacity=".4" filter="url(#${sb.id})"/><rect x="${tx}" y="${ty - 40}" width="${trayW}" height="40" fill="url(#${inner.id})"/>` });
  const slugs = Object.keys(DIRECTION);
  const vb = [];
  slugs.forEach((s, i) => {
    const v = vial({ x: tx + 80 + i * ((trayW - 160) / 5), baseY: ty + 20, w: 56, h: 250, liquid: DIRECTION[s].liquid[0], cap: DIRECTION[s].cap });
    vb.push(v);
  });
  parts.push({ defs: vb.map((v) => v.defs).join(""), body: vb.map((v) => v.body).join("") });
  parts.push({ body: `<rect x="${tx}" y="${ty}" width="${trayW}" height="${trayH}" fill="url(#${trayG.id})"/><rect x="${tx}" y="${ty}" width="${trayW}" height="3" fill="#FFF" opacity=".8"/><rect x="${tx + trayW - 16}" y="${ty}" width="16" height="${trayH}" fill="#000" opacity=".1"/><text x="${cx}" y="${ty + trayH * 0.6}" text-anchor="middle" font-family="Jost" font-weight="500" font-size="18" letter-spacing="8" fill="#8E7356">MAISON VEYRA</text>` });
  parts.push(grainAndVignette({ W, H, vignette: 0.2 }));
  return { svg: svgDoc(W, H, parts), W, H };
}

/** Scent strips (mouillettes) fanned in a glass beaker on a worktable. */
export function scentStrips() {
  const W = 1600, H = 2000;
  const horizon = 1340;
  const parts = [
    wall({ W, H, top: "#E3D8C8", bottom: "#C9B79F", horizon, floorTop: "#7B5B3F", floorBottom: "#5B4129" }),
    windowLight({ x: 40, y: 80, w: 860, h: 1000, skew: 0.38, opacity: 0.36 }),
    leafShadow({ x: 1000, y: -40, scale: 1.3, rotate: 115, seed: 2, opacity: 0.15 }),
  ];
  const wood = linear([[0, "#8A6847"], [1, "#4A341F"]]);
  const grainF = `<filter id="wgr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.002 0.06" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.07  0 0 0 0 0.03  0 0 0 2 -0.8"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
  parts.push({ defs: wood.def + grainF, body: `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#${wood.id})"/><rect y="${horizon}" width="${W}" height="${H - horizon}" fill="#000" filter="url(#wgr)"/><rect y="${horizon}" width="${W}" height="4" fill="#D9BC97" opacity=".5"/>` });
  const cx = 820, base = 1640, bw = 300, bh = 360;
  const sb = blur(16), b2 = blur(2), b8 = blur(8);
  let strips = "";
  for (let i = 0; i < 9; i++) {
    const a = -26 + i * 6.5;
    const len = 900 + (i % 3) * 60;
    strips += `<g transform="translate(${cx + (i - 4) * 10} ${base - 40}) rotate(${a})"><path d="M-11,0 L-11,-${len} L0,-${len + 34} L11,-${len} L11,0 Z" fill="#FBF8F2"/><path d="M5,0 L5,-${len} L0,-${len + 34}" fill="#E6DED0"/><rect x="-11" y="-${len * 0.86}" width="22" height="${len * 0.12}" fill="${["#C9A06A", "#8A4452", "#CF8434", "#E9E1D2", "#B9A3B6", "#9C8A4E"][i % 6]}" opacity=".22"/></g>`;
  }
  const beaker = linear([[0, "#1E160E", 0.45], [0.08, "#FFF", 0.35], [0.2, "#FFF", 0.05], [0.8, "#FFF", 0.05], [0.92, "#FFF", 0.3], [1, "#1E160E", 0.5]], { x2: 1, y2: 0 });
  parts.push({
    defs: sb.def + b2.def + b8.def + beaker.def,
    body: `<path d="M${cx - bw / 2},${base} L${cx + bw / 2},${base} L${cx + bw / 2 + 520},${base - 70} L${cx - bw / 2 + 560},${base - 76} Z" fill="#140C05" opacity=".4" filter="url(#${sb.id})"/>
${strips}
<rect x="${cx - bw / 2}" y="${base - bh}" width="${bw}" height="${bh}" rx="10" fill="#FFF" opacity=".08"/>
<rect x="${cx - bw / 2}" y="${base - bh}" width="${bw}" height="${bh}" rx="10" fill="url(#${beaker.id})"/>
<ellipse cx="${cx}" cy="${base - bh}" rx="${bw / 2}" ry="12" fill="none" stroke="#FFF" stroke-width="3" opacity=".55"/>
<rect x="${cx - bw / 2 + 26}" y="${base - bh + 20}" width="12" height="${bh - 50}" rx="6" fill="#FFF" opacity=".5" filter="url(#${b2.id})"/>
<rect x="${cx - bw / 2 + 4}" y="${base - 30}" width="${bw - 8}" height="26" rx="6" fill="#FFF" opacity=".2"/>
<ellipse cx="${cx + 20}" cy="${base}" rx="${bw * 0.58}" ry="12" fill="#0E0904" opacity=".55" filter="url(#${b8.id})"/>`,
  });
  parts.push(grainAndVignette({ W, H, vignette: 0.26 }));
  return { svg: svgDoc(W, H, parts), W, H };
}

/** A plaster archway — the house's recurring motif — with a single bottle in its niche. */
export function archway() {
  const W = 1600, H = 2000;
  const plaster = linear([[0, "#E7DDCF"], [1, "#CDBDA6"]]);
  const tx = `<filter id="pl" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="3"/><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.24  0 0 0 0 0.18  0 0 0 .22 -.07"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
  const ax = 400, aw = 800, aTop = 360, aBottom = 1560;
  const niche = linear([[0, "#A99479"], [0.5, "#BCA88C"], [1, "#CDBBA2"]]);
  const nicheSide = linear([[0, "#7D6A53", 0.55], [0.18, "#7D6A53", 0], [0.85, "#FFF", 0], [1, "#FFF", 0.12]], { x2: 1, y2: 0 });
  const arch = `M${ax},${aBottom} L${ax},${aTop + aw / 2} A${aw / 2},${aw / 2} 0 0 1 ${ax + aw},${aTop + aw / 2} L${ax + aw},${aBottom} Z`;
  const beam = blur(26);
  const parts = [
    { defs: plaster.def + tx + niche.def + nicheSide.def + beam.def, body: `<rect width="${W}" height="${H}" fill="url(#${plaster.id})"/><rect width="${W}" height="${H}" fill="#000" filter="url(#pl)"/>
<path d="${arch}" fill="url(#${niche.id})"/><path d="${arch}" fill="url(#${nicheSide.id})"/>
<path d="${arch}" fill="none" stroke="#6E5C46" stroke-width="18" opacity=".18" filter="url(#${beam.id})"/>
<rect x="${ax}" y="${aBottom - 10}" width="${aw}" height="30" fill="#E9DFD1"/>
<rect x="${ax}" y="${aBottom + 20}" width="${aw}" height="12" fill="#6E5C46" opacity=".15"/>
<rect y="${aBottom + 32}" width="${W}" height="${H - aBottom - 32}" fill="#D6C7B2"/>
<rect y="${aBottom + 32}" width="${W}" height="${H - aBottom - 32}" fill="#000" filter="url(#pl)"/>` },
    windowLight({ x: 300, y: 380, w: 520, h: 1100, skew: 0.62, shear: -0.12, opacity: 0.45, soft: 16 }),
  ];
  const d = DIRECTION["santal-no-04"];
  const b = bottle({ x: 840, baseY: aBottom + 2, w: 230, h: 288, liquid: d.liquid, cap: d.cap, name: d.name, shadowLen: 1.6 });
  parts.push({ defs: b.defs, body: b.shadow + b.body });
  parts.push(grainAndVignette({ W, H, vignette: 0.24 }));
  return { svg: svgDoc(W, H, parts), W, H };
}

/** Raw materials laid out along a long travertine shelf. */
export function materials() {
  const W = 2400, H = 1400;
  const horizon = 820;
  const topY = 760;
  const parts = [
    wall({ W, H, top: "#DED1BF", bottom: "#C5B198", horizon, floorTop: "#B09B80", floorBottom: "#98836A" }),
    windowLight({ x: 300, y: -260, w: 1300, h: 900, skew: 0.6, shear: -0.1, opacity: 0.32 }),
    leafShadow({ x: 1600, y: -80, scale: 1.2, rotate: 130, seed: 13, opacity: 0.13 }),
    plinth({ x: -20, w: W + 40, topY, depth: 120, H, top: "#EEE5D7", front: "#D3C4AE", seed: 10, shadow: false }),
  ];
  parts.push(woodBlock({ x: 180, y: topY + 10, w: 360, h: 130, seed: 4, rotate: -3 }));
  parts.push(resin({ x: 860, y: topY + 80, size: 90, seed: 11, count: 5, spread: 300 }));
  parts.push(petals({ x: 1300, y: topY + 70, size: 120, seed: 6, count: 5, stem: false, colors: ["#A897BC", "#5E4E7A"] }));
  parts.push(petals({ x: 1880, y: topY + 60, size: 110, seed: 2, count: 6, stem: false }));
  parts.push(grassBundle({ x: 1500, y: topY + 150, len: 620, rotate: 4, seed: 5 }));
  parts.push(grainAndVignette({ W, H, vignette: 0.22 }));
  return { svg: svgDoc(W, H, parts), W, H };
}

/** "The art of leaving a trace" — linen, low evening light, a single bottle. */
export function trace() {
  const W = 2400, H = 1500;
  const parts = [linenDrape({ W, H, base: "#E9E1D3", seed: 8, folds: 11 })];
  const warm = radial([[0, "#FFF4DE", 0.55], [1, "#FFF4DE", 0]], { cx: 0.25, cy: 0.3, r: 0.6 });
  const dusk = linear([[0, "#6B4120", 0], [1, "#3E2410", 0.35]], { x2: 1, y2: 1 });
  parts.push({ defs: warm.def + dusk.def, body: `<rect width="${W}" height="${H}" fill="url(#${warm.id})"/><rect width="${W}" height="${H}" fill="url(#${dusk.id})" style="mix-blend-mode:multiply"/>` });
  const d = DIRECTION["fleur-de-nuit"];
  const b = bottle({ x: 1640, baseY: 1080, w: 300, h: 375, liquid: d.liquid, cap: d.cap, name: d.name, shadowLen: 1.3 });
  parts.push({ defs: b.defs, body: b.shadow + b.body });
  parts.push(petals({ x: 1180, y: 1120, size: 80, seed: 9, count: 5, stem: false, colors: ["#8A4452", "#4E1F2B"] }));
  parts.push(grainAndVignette({ W, H, vignette: 0.3 }));
  return { svg: svgDoc(W, H, parts), W, H };
}

/** Open Graph card — 1200×630 with the wordmark. */
export function ogCard() {
  const { svg } = hero();
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  const W = 1200, H = 630;
  return {
    W, H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><svg x="0" y="0" width="${W}" height="${H}" viewBox="0 70 2400 1260" preserveAspectRatio="xMidYMid slice">${inner}</svg>
<rect width="${W * 0.42}" height="${H}" fill="#F7F5F0" opacity=".0"/>
<text x="70" y="250" font-family="Jost" font-weight="500" font-size="22" letter-spacing="9" fill="#1B1B19">MAISON VEYRA</text>
<text x="70" y="330" font-family="Cormorant Garamond" font-weight="400" font-size="58" fill="#1B1B19">Some moments are</text>
<text x="70" y="395" font-family="Cormorant Garamond" font-style="italic" font-weight="400" font-size="58" fill="#1B1B19">meant to linger.</text>
<rect x="70" y="440" width="60" height="1.5" fill="#A98B69"/>
<text x="70" y="480" font-family="Jost" font-size="17" letter-spacing="3" fill="#4A463F">EAUX DE PARFUM</text></svg>`,
  };
}

export { shade };
