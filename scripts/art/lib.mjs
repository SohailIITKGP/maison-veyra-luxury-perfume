/**
 * Maison Veyra — art direction primitives.
 *
 * Every product and editorial image in the demo is an original composition
 * built from these SVG primitives and pre-rendered to WebP (see render.mjs).
 * Light always falls from the upper left, through a four-pane window, so
 * every frame shares the same shadows and colour grading.
 */

let uid = 0;
export const id = (p = "g") => `${p}${++uid}`;

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const blur = (sd) => {
  const fid = id("b");
  return {
    id: fid,
    def: `<filter id="${fid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`,
  };
};

/** Stone / plaster speckle used for plinths and walls. */
export const texture = (freq = 0.8, alpha = 0.12, seed = 3) => {
  const fid = id("t");
  return {
    id: fid,
    def: `<filter id="${fid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}"/><feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 ${alpha * 6} -${alpha * 2.4}"/><feComposite in2="SourceGraphic" operator="in"/></filter>`,
  };
};

export const linear = (stops, { x1 = 0, y1 = 0, x2 = 0, y2 = 1, units } = {}) => {
  const gid = id("l");
  const s = stops
    .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
    .join("");
  const u = units ? ` gradientUnits="${units}"` : "";
  return { id: gid, def: `<linearGradient id="${gid}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${u}>${s}</linearGradient>` };
};

export const radial = (stops, { cx = 0.5, cy = 0.5, r = 0.5, fx, fy } = {}) => {
  const gid = id("r");
  const s = stops
    .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
    .join("");
  const f = fx !== undefined ? ` fx="${fx}" fy="${fy}"` : "";
  return { id: gid, def: `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}"${f}>${s}</radialGradient>` };
};

/* ------------------------------------------------------------------ */
/* Environment                                                         */
/* ------------------------------------------------------------------ */

export function wall({ W, H, top, bottom, horizon, floorTop, floorBottom }) {
  const g = linear([[0, top], [1, bottom]]);
  const f = linear([[0, floorTop], [1, floorBottom]]);
  const tx = texture(0.55, 0.05, 11);
  return {
    defs: g.def + f.def + tx.def,
    body: `<rect width="${W}" height="${H}" fill="url(#${g.id})"/>
<rect width="${W}" height="${H}" fill="#000" filter="url(#${tx.id})" opacity=".55"/>
<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#${f.id})"/>
<rect y="${horizon - 1}" width="${W}" height="3" fill="#000" opacity=".06"/>`,
  };
}

/** Window light: four skewed panes, blurred, falling on the wall. */
export function windowLight({ x, y, w, h, skew = 0.32, shear = -0.18, opacity = 0.32, color = "#FFF6E6", soft = 22 }) {
  const b = blur(soft);
  const pw = w / 2 - 14;
  const ph = h / 2 - 14;
  const panes = [
    [0, 0],
    [pw + 28, 0],
    [0, ph + 28],
    [pw + 28, ph + 28],
  ]
    .map(([dx, dy]) => `<rect x="${dx}" y="${dy}" width="${pw}" height="${ph}"/>`)
    .join("");
  return {
    defs: b.def,
    body: `<g filter="url(#${b.id})" opacity="${opacity}" fill="${color}" style="mix-blend-mode:screen"><g transform="translate(${x} ${y}) matrix(1 ${shear} ${skew} 1 0 0)">${panes}</g></g>`,
  };
}

/** Dappled branch shadow — a quiet botanical presence on the wall. */
export function leafShadow({ x, y, scale = 1, rotate = 0, opacity = 0.16, seed = 7, color = "#2B2118", soft = 7 }) {
  const r = rng(seed);
  const b = blur(soft);
  let leaves = "";
  const stemPts = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    stemPts.push([t * 620, Math.sin(t * 2.2) * 90 + t * t * 160]);
  }
  const stem = "M" + stemPts.map((p) => p.join(",")).join(" L");
  for (let i = 1; i < stemPts.length; i++) {
    const [px, py] = stemPts[i];
    const side = i % 2 ? 1 : -1;
    const len = 70 + r() * 70;
    const ang = side * (35 + r() * 30) + 20;
    leaves += `<ellipse cx="${len / 2}" cy="0" rx="${len / 2}" ry="${11 + r() * 8}" transform="translate(${px} ${py}) rotate(${ang})"/>`;
  }
  return {
    defs: b.def,
    body: `<g filter="url(#${b.id})" opacity="${opacity}" fill="${color}" transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="${stem}" stroke="${color}" stroke-width="7" fill="none"/>${leaves}</g>`,
  };
}

export function grainAndVignette({ W, H, grain = 0.85, vignette = 0.22, warmth = "#2A1C10" }) {
  const g = id("n");
  const v = radial([[0.55, warmth, 0], [1, warmth, vignette]], { r: 0.75 });
  return {
    defs:
      v.def +
      `<filter id="${g}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${grain}" numOctaves="2" seed="5" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer></filter>`,
    body: `<rect width="${W}" height="${H}" fill="url(#${v.id})"/><rect width="${W}" height="${H}" filter="url(#${g})" style="mix-blend-mode:multiply"/>`,
  };
}

/** Travertine-like plinth: thin top face (camera slightly above) + front face. */
export function plinth({ x, w, topY, depth = 70, H, top = "#EDE5D8", front = "#D3C6B2", edge = "#F8F3EA", seed = 2, shadow = true }) {
  const fg = linear([[0, front], [1, shade(front, -0.12)]]);
  const tg = linear([[0, shade(top, -0.04)], [1, top]]);
  const side = linear([[0, shade(front, 0.04)], [0.12, front, 1], [0.88, front], [1, shade(front, -0.18)]], { x2: 1, y2: 0 });
  const tx = texture(0.9, 0.11, seed);
  const tx2 = texture(0.02, 0.045, seed + 9);
  const sh = blur(30);
  const clip = id("c");
  const frontY = topY + depth;
  return {
    defs: fg.def + tg.def + side.def + tx.def + tx2.def + sh.def + `<clipPath id="${clip}"><rect x="${x}" y="${topY}" width="${w}" height="${H - topY}"/></clipPath>`,
    body: `${
      shadow
        ? `<path d="M${x + w},${frontY} L${x + w + w * 0.55},${frontY - depth * 0.6} L${x + w + w * 0.55},${H} L${x + w},${H} Z" fill="#1E140C" opacity=".22" filter="url(#${sh.id})"/>`
        : ""
    }
<g clip-path="url(#${clip})">
<rect x="${x}" y="${frontY}" width="${w}" height="${H - frontY}" fill="url(#${fg.id})"/>
<rect x="${x}" y="${frontY}" width="${w}" height="${H - frontY}" fill="url(#${side.id})" opacity=".6"/>
<rect x="${x}" y="${topY}" width="${w}" height="${depth}" fill="url(#${tg.id})"/>
<rect x="${x}" y="${topY}" width="${w}" height="${H - topY}" fill="#000" filter="url(#${tx.id})"/>
<rect x="${x}" y="${topY}" width="${w}" height="${H - topY}" fill="#000" filter="url(#${tx2.id})"/>
<rect x="${x}" y="${frontY - 1}" width="${w}" height="3" fill="${edge}" opacity=".75"/>
<rect x="${x}" y="${frontY + 2}" width="${w}" height="10" fill="#000" opacity=".05"/>
</g>`,
  };
}

/* ------------------------------------------------------------------ */
/* The Veyra bottle — heavy glass block, arched bronze/stone cap.       */
/* ------------------------------------------------------------------ */

const CAPS = {
  bronze: [
    [0, "#3B2C1E"], [0.1, "#634C34"], [0.3, "#AE8E66"], [0.4, "#E8D5B2"], [0.5, "#B9976D"], [0.72, "#71573B"], [1, "#35281B"],
  ],
  black: [
    [0, "#0A0908"], [0.18, "#1F1D1B"], [0.34, "#4D4945"], [0.42, "#2A2826"], [0.7, "#141311"], [1, "#080707"],
  ],
  ivory: [
    [0, "#B4A996"], [0.16, "#DCD3C3"], [0.38, "#FBF8F1"], [0.55, "#ECE6DA"], [0.82, "#CABFAD"], [1, "#9F947F"],
  ],
};

export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function bottle({
  x, baseY, w = 480, h = 600, liquid = ["#D6B47E", "#B98C4F"], cap = "bronze", name = "Santal No. 04", size = "100 ml",
  shadowLen = 1.15, label = true, causticColor,
}) {
  const left = x - w / 2;
  const right = x + w / 2;
  const top = baseY - h;
  const r = w * 0.075;
  const t = w * 0.07;
  const baseT = h * 0.15;
  const liqTop = top + h * 0.13;
  const liqBottom = baseY - baseT;
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);

  const glass = add(linear([
    [0, "#1E160E", 0.55], [0.03, "#FFFFFF", 0.32], [0.075, "#FFF9EE", 0.1], [0.5, "#FFF9EE", 0.03],
    [0.925, "#FFF9EE", 0.1], [0.965, "#FFFFFF", 0.26], [1, "#1E160E", 0.6],
  ], { x2: 1, y2: 0 }));
  const liq = add(linear([[0, shade(liquid[0], 0.22)], [0.35, liquid[0]], [0.8, liquid[1]], [1, shade(liquid[1], -0.12)]]));
  const glow = add(radial([[0, shade(liquid[0], 0.45), 0.85], [1, shade(liquid[0], 0.45), 0]], { cx: 0.5, cy: 0.5, r: 0.5 }));
  const liqShade = add(linear([
    [0, "#000", 0.3], [0.14, "#000", 0], [0.62, "#FFF", 0.07], [0.86, "#000", 0.04], [1, "#000", 0.34],
  ], { x2: 1, y2: 0 }));
  const baseG = add(linear([[0, liquid[1], 0.5], [0.6, shade(liquid[0], 0.35), 0.35], [1, "#FFFFFF", 0.25]]));
  const capG = add(linear(CAPS[cap], { x2: 1, y2: 0 }));
  const capTopLight = add(linear([[0, "#FFFFFF", 0.32], [0.4, "#FFFFFF", 0]]));
  const b2 = add(blur(2.2));
  const b10 = add(blur(12));
  const b16 = add(blur(18));
  const b5 = add(blur(5));
  const brushed = id("br");
  defs.push(
    `<filter id="${brushed}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.003 ${cap === "bronze" ? 0.35 : 0.9}" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${cap === "bronze" ? 1.4 : 0.6} -0.5"/><feComposite in2="SourceGraphic" operator="in"/></filter>`,
  );

  const collarW = w * 0.27;
  const collarH = h * 0.035;
  const capW = w * 0.42;
  const capH = h * 0.43;
  const capBottom = top - collarH + 2;
  const capTop = capBottom - capH;
  const cl = x - capW / 2;
  const cr = x + capW / 2;
  const capPath = `M${cl},${capBottom} L${cl},${capTop + capW / 2} A${capW / 2},${capW / 2} 0 0 1 ${cr},${capTop + capW / 2} L${cr},${capBottom} Z`;
  const bodyPath = `M${left + r},${top} H${right - r} Q${right},${top} ${right},${top + r} V${baseY - r * 0.5} Q${right},${baseY} ${right - r * 0.5},${baseY} H${left + r * 0.5} Q${left},${baseY} ${left},${baseY - r * 0.5} V${top + r} Q${left},${top} ${left + r},${top} Z`;

  const L = w * shadowLen;
  const d = h * 0.07;
  const caus = causticColor || shade(liquid[0], 0.15);

  const shadow = `
<path d="M${left + w * 0.04},${baseY} L${right},${baseY} L${right + L},${baseY - d} L${left + w * 0.3 + L},${baseY - d * 1.1} Z" fill="#20150B" opacity=".55" filter="url(#${b16})"/>
<ellipse cx="${right + L * 0.38}" cy="${baseY - d * 0.45}" rx="${w * 0.36}" ry="${h * 0.03}" fill="${caus}" opacity=".9" filter="url(#${b10})" style="mix-blend-mode:screen"/>
<ellipse cx="${right + L * 0.3}" cy="${baseY - d * 0.4}" rx="${w * 0.14}" ry="${h * 0.012}" fill="#FFF3D9" opacity=".5" filter="url(#${b5})" style="mix-blend-mode:screen"/>
<ellipse cx="${x + w * 0.04}" cy="${baseY}" rx="${w * 0.54}" ry="${h * 0.022}" fill="#140D06" opacity=".55" filter="url(#${b5})"/>`;

  const labelW = w * 0.5;
  const labelH = h * 0.28;
  const lx = x - labelW / 2;
  const ly = top + h * 0.37;
  const labelSvg = label
    ? `
<rect x="${lx + 3}" y="${ly + 5}" width="${labelW}" height="${labelH}" fill="#000" opacity=".18" filter="url(#${b5})"/>
<rect x="${lx}" y="${ly}" width="${labelW}" height="${labelH}" fill="#F3EEE4"/>
<rect x="${lx}" y="${ly}" width="${labelW}" height="${labelH}" fill="url(#${liqShade})" opacity=".35"/>
<rect x="${lx + labelW * 0.045}" y="${ly + labelW * 0.045}" width="${labelW * 0.91}" height="${labelH - labelW * 0.09}" fill="none" stroke="#A98B69" stroke-width="${Math.max(1, w / 420)}" opacity=".8"/>
<text x="${x}" y="${ly + labelH * 0.25}" text-anchor="middle" font-family="Jost" font-weight="500" font-size="${labelW * 0.052}" letter-spacing="${labelW * 0.022}" fill="#1B1B19">MAISON VEYRA</text>
<line x1="${x - labelW * 0.08}" x2="${x + labelW * 0.08}" y1="${ly + labelH * 0.34}" y2="${ly + labelH * 0.34}" stroke="#A98B69" stroke-width="${Math.max(1, w / 500)}"/>
<text x="${x}" y="${ly + labelH * 0.6}" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="500" font-size="${labelW * (name.length > 13 ? 0.125 : 0.145)}" fill="#1B1B19">${name}</text>
<text x="${x}" y="${ly + labelH * 0.79}" text-anchor="middle" font-family="Jost" font-weight="400" font-size="${labelW * 0.038}" letter-spacing="${labelW * 0.014}" fill="#3B3833">EAU DE PARFUM</text>
<text x="${x}" y="${ly + labelH * 0.9}" text-anchor="middle" font-family="Jost" font-weight="400" font-size="${labelW * 0.036}" letter-spacing="${labelW * 0.012}" fill="#6B655B">${size.toUpperCase()}</text>`
    : "";

  const body = `
<g>
  <path d="${bodyPath}" fill="#FFFFFF" opacity=".07"/>
  <rect x="${left + t}" y="${liqTop}" width="${w - 2 * t}" height="${liqBottom - liqTop}" rx="${r * 0.5}" fill="url(#${liq})" opacity=".93"/>
  <rect x="${left + t}" y="${liqTop}" width="${w - 2 * t}" height="${liqBottom - liqTop}" rx="${r * 0.5}" fill="url(#${liqShade})"/>
  <ellipse cx="${left + w * 0.66}" cy="${liqTop + (liqBottom - liqTop) * 0.7}" rx="${w * 0.26}" ry="${h * 0.26}" fill="url(#${glow})" opacity=".55" style="mix-blend-mode:screen"/>
  <rect x="${left + t}" y="${liqTop}" width="${w * 0.1}" height="${liqBottom - liqTop}" fill="#000" opacity=".1" filter="url(#${b10})"/>
  <rect x="${left + t}" y="${liqTop}" width="${w - 2 * t}" height="${Math.max(2, h * 0.004)}" fill="#FFFFFF" opacity=".55"/>
  <rect x="${left + t}" y="${liqTop + h * 0.006}" width="${w - 2 * t}" height="${h * 0.01}" fill="#000" opacity=".12"/>
  <rect x="${left + t * 0.5}" y="${liqBottom}" width="${w - t}" height="${baseT - h * 0.012}" rx="${r * 0.4}" fill="url(#${baseG})"/>
  <rect x="${left + t * 0.6}" y="${baseY - h * 0.026}" width="${w - t * 1.2}" height="${h * 0.006}" fill="#FFFFFF" opacity=".55" filter="url(#${b2})"/>
  <rect x="${left + t * 0.6}" y="${liqBottom + 2}" width="${w - t * 1.2}" height="${h * 0.012}" fill="${liquid[1]}" opacity=".55" filter="url(#${b2})"/>
  ${labelSvg}
  <path d="${bodyPath}" fill="url(#${glass})"/>
  <rect x="${left + w * 0.115}" y="${top + h * 0.05}" width="${w * 0.032}" height="${h * 0.86}" rx="${w * 0.016}" fill="#FFFFFF" opacity=".55" filter="url(#${b2})"/>
  <rect x="${left + w * 0.18}" y="${top + h * 0.08}" width="${w * 0.12}" height="${h * 0.8}" fill="#FFFFFF" opacity=".1" filter="url(#${b10})"/>
  <rect x="${left + w * 0.925}" y="${top + h * 0.06}" width="${w * 0.012}" height="${h * 0.85}" fill="#FFFFFF" opacity=".4" filter="url(#${b2})"/>
  <rect x="${left + w * 0.7}" y="${top + h * 0.05}" width="${w * 0.07}" height="${h * 0.16}" fill="#FFFFFF" opacity=".16" filter="url(#${b2})"/>
  <rect x="${left + w * 0.79}" y="${top + h * 0.05}" width="${w * 0.07}" height="${h * 0.16}" fill="#FFFFFF" opacity=".16" filter="url(#${b2})"/>
  <path d="M${left + r},${top + 1.5} H${right - r}" stroke="#FFFFFF" stroke-width="${Math.max(1.5, w / 260)}" opacity=".6"/>
  <path d="${bodyPath}" fill="none" stroke="#24190F" stroke-width="${Math.max(1, w / 320)}" opacity=".35"/>
</g>
<ellipse cx="${x}" cy="${top + 4}" rx="${collarW * 0.75}" ry="${h * 0.012}" fill="#000" opacity=".3" filter="url(#${b5})"/>
<rect x="${x - collarW / 2}" y="${top - collarH}" width="${collarW}" height="${collarH}" fill="url(#${capG})"/>
<rect x="${x - collarW / 2}" y="${top - collarH}" width="${collarW}" height="${collarH * 0.3}" fill="#FFFFFF" opacity=".25"/>
<path d="${capPath}" fill="url(#${capG})"/>
<path d="${capPath}" fill="#000" filter="url(#${brushed})" opacity=".5"/>
<path d="${capPath}" fill="url(#${capTopLight})"/>
<rect x="${cl}" y="${capBottom - h * 0.01}" width="${capW}" height="${h * 0.01}" fill="#000" opacity=".25"/>
<path d="${capPath}" fill="none" stroke="#000" stroke-width="${Math.max(1, w / 400)}" opacity=".25"/>`;

  return {
    defs: defs.join(""),
    shadow,
    body,
    bounds: { left, right, top: capTop, bottom: baseY, capTop, labelY: ly, labelH },
  };
}

/** Miniature vial for the discovery set. */
export function vial({ x, baseY, w = 70, h = 260, liquid = "#C9A77A", cap = "bronze" }) {
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);
  const glass = add(linear([
    [0, "#1E160E", 0.5], [0.12, "#FFFFFF", 0.35], [0.3, "#FFFFFF", 0.06], [0.75, "#FFFFFF", 0.05], [0.9, "#FFFFFF", 0.3], [1, "#1E160E", 0.55],
  ], { x2: 1, y2: 0 }));
  const capG = add(linear(CAPS[cap], { x2: 1, y2: 0 }));
  const lq = add(linear([[0, shade(liquid, 0.15)], [1, shade(liquid, -0.15)]]));
  const left = x - w / 2;
  const top = baseY - h;
  const capH = h * 0.24;
  return {
    defs: defs.join(""),
    body: `
<rect x="${left}" y="${top + capH}" width="${w}" height="${h - capH}" rx="${w * 0.18}" fill="#FFF" opacity=".08"/>
<rect x="${left + w * 0.12}" y="${top + capH + h * 0.12}" width="${w * 0.76}" height="${h - capH - h * 0.17}" rx="${w * 0.1}" fill="url(#${lq})" opacity=".9"/>
<rect x="${left}" y="${top + capH}" width="${w}" height="${h - capH}" rx="${w * 0.18}" fill="url(#${glass})"/>
<rect x="${left + w * 0.2}" y="${top + capH + h * 0.05}" width="${w * 0.08}" height="${h * 0.62}" rx="${w * 0.04}" fill="#FFF" opacity=".6"/>
<rect x="${left - w * 0.04}" y="${top}" width="${w * 1.08}" height="${capH}" rx="${w * 0.08}" fill="url(#${capG})"/>
<rect x="${left - w * 0.04}" y="${top}" width="${w * 1.08}" height="${capH * 0.2}" rx="${w * 0.06}" fill="#FFF" opacity=".25"/>`,
  };
}

/* ------------------------------------------------------------------ */
/* Props — raw materials                                               */
/* ------------------------------------------------------------------ */

export function woodBlock({ x, y, w = 300, h = 120, rotate = -4, seed = 5 }) {
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);
  const g = add(linear([[0, "#C29A6B"], [0.5, "#A97E52"], [1, "#7A5534"]]));
  const top = add(linear([[0, "#D8B587"], [1, "#C19566"]]));
  const grain = id("wg");
  defs.push(
    `<filter id="${grain}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves="3" seed="${seed}"/><feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.14  0 0 0 0 0.06  0 0 0 2.4 -0.95"/><feComposite in2="SourceGraphic" operator="in"/></filter>`,
  );
  const sb = add(blur(9));
  const r = rng(seed);
  const shavings = "";
  void r;
  return {
    defs: defs.join(""),
    body: `<ellipse cx="${x + w * 0.6}" cy="${y + h + 4}" rx="${w * 0.62}" ry="${h * 0.12}" fill="#1A1008" opacity=".45" filter="url(#${sb})"/>
<g transform="rotate(${rotate} ${x + w / 2} ${y + h / 2})">
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#${g})"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#000" filter="url(#${grain})"/>
<rect x="${x}" y="${y}" width="${w}" height="${h * 0.16}" rx="5" fill="url(#${top})"/>
<rect x="${x}" y="${y}" width="${w}" height="${h * 0.16}" rx="5" fill="#000" filter="url(#${grain})" opacity=".6"/>
<rect x="${x + w - 14}" y="${y}" width="14" height="${h}" rx="5" fill="#000" opacity=".18"/>
</g>
<g transform="rotate(${rotate + 9} ${x + w * 0.45} ${y - h * 0.3})">
<rect x="${x + w * 0.12}" y="${y - h * 0.62}" width="${w * 0.6}" height="${h * 0.62}" rx="5" fill="url(#${g})"/>
<rect x="${x + w * 0.12}" y="${y - h * 0.62}" width="${w * 0.6}" height="${h * 0.62}" rx="5" fill="#000" filter="url(#${grain})"/>
<rect x="${x + w * 0.12}" y="${y - h * 0.62}" width="${w * 0.6}" height="${h * 0.12}" rx="4" fill="url(#${top})"/>
<rect x="${x + w * 0.12}" y="${y - h * 0.02}" width="${w * 0.6}" height="${h * 0.06}" fill="#000" opacity=".22"/>
</g>${shavings}`,
  };
}

export function resin({ x, y, size = 80, seed = 9, count = 4, spread = 220 }) {
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);
  const r = rng(seed);
  const g = add(radial([[0, "#FFD38A"], [0.35, "#E39A3F"], [0.75, "#9B4E14"], [1, "#4E2206"]], { cx: 0.42, cy: 0.38, r: 0.62 }));
  const sb = add(blur(8));
  const glow = add(blur(14));
  const hl = add(blur(2));
  let out = "";
  for (let i = 0; i < count; i++) {
    const cx = x + (r() - 0.3) * spread;
    const cy = y + (r() - 0.5) * size * 0.5;
    const s = size * (0.55 + r() * 0.6);
    const pts = [];
    const n = 7 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const rr = s * (0.42 + r() * 0.22);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.72]);
    }
    const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" L") + " Z";
    out += `<ellipse cx="${cx + s * 0.4}" cy="${cy + s * 0.3}" rx="${s * 0.62}" ry="${s * 0.14}" fill="#1A0E04" opacity=".5" filter="url(#${sb})"/>
<ellipse cx="${cx + s * 0.75}" cy="${cy + s * 0.28}" rx="${s * 0.45}" ry="${s * 0.1}" fill="#FF9F3D" opacity=".55" filter="url(#${glow})" style="mix-blend-mode:screen"/>
<path d="${d}" fill="url(#${g})" stroke="#5A2A0A" stroke-width="1.2" stroke-linejoin="round"/>
<ellipse cx="${cx - s * 0.12}" cy="${cy - s * 0.14}" rx="${s * 0.1}" ry="${s * 0.05}" fill="#FFF7E0" opacity=".85" filter="url(#${hl})"/>`;
  }
  return { defs: defs.join(""), body: out };
}

export function petals({ x, y, count = 5, size = 120, seed = 4, colors = ["#7E3D49", "#4F1F2A"], rotate = 0, stem = true }) {
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);
  const r = rng(seed);
  const g = add(linear([[0, shade(colors[0], 0.25)], [0.6, colors[0]], [1, colors[1]]]));
  const sb = add(blur(9));
  const vein = add(blur(1.2));
  let out = "";
  if (stem) {
    out += `<path d="M${x - size * 2.6},${y + size * 0.55} C${x - size * 1.6},${y + size * 0.5} ${x - size * 0.8},${y + size * 0.28} ${x},${y}" fill="none" stroke="#1C2418" stroke-width="${size * 0.07}" stroke-linecap="round"/>
<path d="M${x - size * 2.6},${y + size * 0.55} C${x - size * 1.6},${y + size * 0.5} ${x - size * 0.8},${y + size * 0.28} ${x},${y}" fill="none" stroke="#6F7D5C" stroke-width="${size * 0.015}" opacity=".6" transform="translate(0 -${size * 0.02})"/>`;
  }
  out += `<ellipse cx="${x + size * 0.3}" cy="${y + size * 0.55}" rx="${size * 1.15}" ry="${size * 0.18}" fill="#140A08" opacity=".45" filter="url(#${sb})"/>`;
  out += `<g transform="rotate(${rotate} ${x} ${y})">`;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * 360 + r() * 20;
    const l = size * (0.85 + r() * 0.3);
    const wv = size * (0.28 + r() * 0.08);
    out += `<g transform="translate(${x} ${y}) rotate(${a}) scale(1 0.62)">
<path d="M0,0 C${wv},-${l * 0.25} ${wv * 1.1},-${l * 0.8} 0,-${l} C-${wv * 1.1},-${l * 0.8} -${wv},-${l * 0.25} 0,0 Z" fill="url(#${g})"/>
<path d="M0,-${l * 0.08} L0,-${l * 0.85}" stroke="#FFF" stroke-width="1.6" opacity=".22" filter="url(#${vein})"/>
</g>`;
  }
  out += `<circle cx="${x}" cy="${y}" r="${size * 0.09}" fill="${shade(colors[1], -0.3)}"/></g>`;
  return { defs: defs.join(""), body: out };
}

export function irisPetals({ x, y, size = 160, seed = 12 }) {
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);
  const r = rng(seed);
  const g = add(linear([[0, "#C9BCD8"], [0.5, "#8E7FA8"], [1, "#4E3F69"]]));
  const sb = add(blur(10));
  let out = `<ellipse cx="${x + size * 0.5}" cy="${y + size * 0.42}" rx="${size * 1.25}" ry="${size * 0.16}" fill="#140E14" opacity=".4" filter="url(#${sb})"/>`;
  [[-28, 0], [8, size * 0.5], [42, size * 1.0]].forEach(([rot, dx], i) => {
    const l = size * (1 + r() * 0.2);
    const wv = size * 0.42;
    const wav = Array.from({ length: 6 }, (_, k) => {
      const t = (k + 1) / 7;
      return `${(Math.sin(t * Math.PI) * wv * (1 + (k % 2 ? 0.12 : -0.08))).toFixed(1)},-${(l * t).toFixed(1)}`;
    });
    const right = wav.join(" L");
    const leftSide = wav.reverse().map((p) => { const [a, b] = p.split(","); return `${-a},${b}`; }).join(" L");
    out += `<g transform="translate(${x + dx} ${y + i * 6}) rotate(${rot + 80}) scale(1 .55)">
<path d="M0,0 L${right} L0,-${l} L${leftSide} Z" fill="url(#${g})" stroke="#3E2F55" stroke-width="1" stroke-linejoin="round"/>
<path d="M0,-${l * 0.05} L0,-${l * 0.55}" stroke="#E2B95C" stroke-width="${size * 0.05}" stroke-linecap="round" opacity=".85"/>
</g>`;
  });
  return { defs: defs.join(""), body: out };
}

export function grassBundle({ x, y, len = 520, rotate = -12, seed = 21 }) {
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);
  const r = rng(seed);
  const sb = add(blur(9));
  const cols = ["#8C8758", "#6E6A40", "#A9A273", "#5A5733", "#B8AE7D"];
  let blades = "";
  for (let i = 0; i < 46; i++) {
    const off = (r() - 0.5) * 34;
    const end = (r() - 0.5) * 120;
    const l = len * (0.75 + r() * 0.3);
    blades += `<path d="M0,${off} Q${l * 0.5},${off + end * 0.3} ${l},${end}" fill="none" stroke="${cols[i % cols.length]}" stroke-width="${2 + r() * 2.4}" stroke-linecap="round"/>`;
  }
  return {
    defs: defs.join(""),
    body: `<ellipse cx="${x + len * 0.45}" cy="${y + 30}" rx="${len * 0.55}" ry="22" fill="#1A140A" opacity=".4" filter="url(#${sb})"/>
<g transform="translate(${x} ${y}) rotate(${rotate})">${blades}
<rect x="${len * 0.16}" y="-24" width="26" height="48" rx="6" fill="#A98B69"/><rect x="${len * 0.16}" y="-24" width="26" height="10" rx="5" fill="#E2CBA5" opacity=".7"/></g>`,
  };
}

export function foldedLinen({ x, y, w = 360, layers = 4, color = "#ECE5D8" }) {
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);
  const sb = add(blur(10));
  const b3 = add(blur(3));
  let out = `<ellipse cx="${x + w * 0.55}" cy="${y + 8}" rx="${w * 0.6}" ry="16" fill="#1A140A" opacity=".35" filter="url(#${sb})"/>`;
  for (let i = 0; i < layers; i++) {
    const ly = y - i * 24;
    const lw = w - i * 6;
    const g = add(linear([[0, shade(color, 0.3)], [0.5, color], [1, shade(color, -0.12 - i * 0.02)]]));
    out += `<path d="M${x + i * 3},${ly} h${lw} q16,-12 0,-24 h-${lw} q-16,12 0,24 Z" fill="url(#${g})"/>
<path d="M${x + i * 3},${ly - 23} h${lw}" stroke="#FFF" stroke-width="3" opacity=".55" filter="url(#${b3})"/>`;
  }
  return { defs: defs.join(""), body: out };
}

/** Draped linen surface — soft folds across the whole frame. */
export function linenDrape({ W, H, base = "#EDE6DA", seed = 3, folds = 9, y0 = 0 }) {
  const defs = [];
  const add = (o) => (defs.push(o.def), o.id);
  const r = rng(seed);
  const b30 = add(blur(30));
  const b8 = add(blur(9));
  let out = `<rect y="${y0}" width="${W}" height="${H - y0}" fill="${base}"/>`;
  for (let i = 0; i < folds; i++) {
    const sx = r() * W;
    const amp = 120 + r() * 220;
    const thick = 40 + r() * 90;
    const path = `M${sx - 300},${y0 - 50} C${sx + amp},${y0 + H * 0.3} ${sx - amp},${y0 + H * 0.6} ${sx + amp * 0.6},${H + 60}`;
    out += `<path d="${path}" stroke="#5A4630" stroke-width="${thick}" fill="none" opacity=".12" filter="url(#${b30})"/>
<path d="${path}" stroke="#FFFFFF" stroke-width="${thick * 0.35}" fill="none" opacity=".35" filter="url(#${b8})" transform="translate(${-thick * 0.6} 0)"/>`;
  }
  return { defs: defs.join(""), body: out };
}

export function svgDoc(W, H, parts, { viewBox } = {}) {
  const defs = parts.map((p) => p.defs || "").join("\n");
  const body = parts.map((p) => p.body || "").join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${viewBox || `0 0 ${W} ${H}`}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>`;
}
