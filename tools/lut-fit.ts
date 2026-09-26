// Refines the Classic Negative grade against the hero frames (design.md §5.2, §12.3). For each
// viewpoint captured with `node tools/compare.ts --fit`, compare/fit/ holds the image as it enters
// the LUT, the render's sky mask (from depth) and the photograph at the render's size. The
// photograph's own sky is found by growing a region down from the top edge.
//
// The fit compares, city and sky apart, what the grade makes of the render with the photograph:
// lightness percentiles, the chroma and hue of each of twelve hue sectors, and the tint of the
// near-greys in shadow and in highlight. Composition differs between a render and its photograph,
// so each frame's mismatch is capped (a frame cannot pull the grade alone) and the parameters are
// held near the hand authoring of tools/lib/grade.ts. Reported, not fitted: the ΔE between the
// dominant colour clusters of each pair (k-means in OKLab, ΔE as OKLab distance × 100).
//
//   node tools/lut-fit.ts            fit, write assets/lut/classic-neg.params.json and the LUT
//   node tools/lut-fit.ts --report   the statistics for the current parameters only
//   node tools/lut-fit.ts --masks    also compare/fit/masks.png, the sky masks for checking
//   node tools/lut-fit.ts --detail   also each frame's statistics, photograph against render

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { decodePng, encodePng } from './lib/png.ts';
import { HAND, grade, cube, type GradeParams } from './lib/grade.ts';
import { toLinear, linearToOklab } from './lib/oklab.ts';

const DIR = 'compare/fit';
const PARAMS = 'assets/lut/classic-neg.params.json';
/** Images are averaged down by this factor each side before anything is measured. */
const DOWN = 4;
const report = process.argv.includes('--report');
const masks = process.argv.includes('--masks');
const detail = process.argv.includes('--detail');

interface Meta { id: string; clock: string; overcast: boolean; contrast: number; lift: number; vignette: number; grade: boolean }

// ---------------------------------------------------------------- images

type Image = { w: number; h: number; rgb: Float32Array };

function load(file: string): Image {
  const { width, height, rgb } = decodePng(readFileSync(file));
  const w = Math.floor(width / DOWN), h = Math.floor(height / DOWN), out = new Float32Array(w * h * 3);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      for (let k = 0; k < 3; k++) {
        let s = 0;
        for (let dy = 0; dy < DOWN; dy++) for (let dx = 0; dx < DOWN; dx++) s += rgb[((y * DOWN + dy) * width + x * DOWN + dx) * 3 + k];
        out[(y * w + x) * 3 + k] = s / (DOWN * DOWN * 255);
      }
  return { w, h, rgb: out };
}

const lab = (r: number, g: number, b: number) => linearToOklab(toLinear(r), toLinear(g), toLinear(b));

function toLab(im: Image): Float32Array {
  const out = new Float32Array(im.rgb.length);
  for (let i = 0; i < im.rgb.length; i += 3) out.set(lab(im.rgb[i], im.rgb[i + 1], im.rgb[i + 2]), i);
  return out;
}

/**
 * The photograph's sky: grown from the top of the frame through smooth, bright pixels, stepping
 * only across small changes; bright near-neutral pixels (cumulus) are taken across their edges.
 * Only where the render has sky nearby (`near`): smooth blue water must not pass for it (8849).
 */
function photoSky(L: Float32Array, w: number, h: number, near: Uint8Array): Uint8Array {
  const at = (x: number, y: number, k: number) => L[(y * w + x) * 3 + k];
  const grad = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const c = at(x, y, 0);
      grad[y * w + x] = Math.max(Math.abs(c - at(x - 1, y, 0)), Math.abs(c - at(x + 1, y, 0)), Math.abs(c - at(x, y - 1, 0)), Math.abs(c - at(x, y + 1, 0)));
    }
  // Seeds: smooth, bright pixels of sky colour (blue, or near grey) in the top sixth of the frame,
  // so branches across the top edge (8825, 9204) do not hide the sky beneath them.
  const top = Math.max(2, Math.round(h / 6));
  const skyLike = (x: number, y: number) => {
    const a = at(x, y, 1), b = at(x, y, 2), C = Math.hypot(a, b), hue = (Math.atan2(b, a) * 180) / Math.PI;
    return C < 0.03 || (hue < -90 && hue > -150);
  };
  const seedL: number[] = [];
  for (let y = 1; y < top; y++) for (let x = 1; x < w - 1; x++) if (near[y * w + x] && grad[y * w + x] < 0.015 && skyLike(x, y)) seedL.push(at(x, y, 0));
  const mask = new Uint8Array(w * h);
  if (seedL.length < w * 0.2) return mask;
  seedL.sort((a, b) => a - b);
  // The brighter half of the candidates: the sky is the brightest smooth thing at the top.
  const sL = seedL[Math.floor(seedL.length * 0.75)], floor = sL * 0.55;
  const queue: number[] = [];
  for (let y = 1; y < top; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    if (near[i] && grad[i] < 0.015 && skyLike(x, y) && Math.abs(at(x, y, 0) - sL) < 0.1) { mask[i] = 1; queue.push(i); }
  }
  while (queue.length) {
    const i = queue.pop()!, x = i % w, y = (i / w) | 0;
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 1 || ny < 1 || nx >= w - 1 || ny >= h - 1) continue;
      const j = ny * w + nx;
      if (mask[j] || !near[j]) continue;
      const Lq = at(nx, ny, 0), aq = at(nx, ny, 1), bq = at(nx, ny, 2), C = Math.hypot(aq, bq);
      const dL = Math.abs(Lq - at(x, y, 0)), dE = Math.hypot(Lq - at(x, y, 0), aq - at(x, y, 1), bq - at(x, y, 2));
      const smooth = grad[j] < 0.03 && dL < 0.02 && dE < 0.025;
      const cloud = C < 0.03 && Lq > sL * 0.92 && Lq > 0.55;
      if (Lq > floor && (smooth || cloud)) { mask[j] = 1; queue.push(j); }
    }
  }
  return mask;
}

// ---------------------------------------------------------------- statistics

const SECTORS = 12;

interface Stats {
  n: number;
  /** OKLab lightness at the 5th, 25th, 50th, 75th and 95th percentiles. */
  L: number[];
  /** Per hue sector (30° wide, from 0°): share of pixels, mean chroma, mean hue (degrees), mean lightness. */
  sector: { share: number; C: number; h: number; L: number }[];
  /** Mean a, b of near-greys in shadow (L < 0.4) and in highlight (L > 0.7), and their shares. */
  shadow: [number, number, number];
  highlight: [number, number, number];
  meanC: number;
}

/** Statistics of weighted OKLab samples (L, a, b interleaved). */
function stats(v: Float32Array | number[], wt: Float32Array | number[]): Stats {
  const n = wt.length;
  let total = 0;
  for (let i = 0; i < n; i++) total += wt[i];
  const order = [...Array(n).keys()].sort((p, q) => v[p * 3] - v[q * 3]);
  const L: number[] = [];
  let acc = 0, k = 0;
  const qs = [0.05, 0.25, 0.5, 0.75, 0.95];
  for (const i of order) {
    acc += wt[i];
    while (k < qs.length && acc >= qs[k] * total) { L.push(v[i * 3]); k++; }
  }
  while (L.length < 5) L.push(L[L.length - 1] ?? 0);
  const sec = Array.from({ length: SECTORS }, () => ({ w: 0, C: 0, x: 0, y: 0, L: 0 }));
  const sh = [0, 0, 0], hi = [0, 0, 0];
  let meanC = 0;
  for (let i = 0; i < n; i++) {
    const l = v[i * 3], a = v[i * 3 + 1], b = v[i * 3 + 2], C = Math.hypot(a, b), w = wt[i];
    meanC += C * w;
    if (C > 0.02) {
      const h = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360, s = sec[Math.floor(h / (360 / SECTORS)) % SECTORS];
      s.w += w; s.C += C * w; s.x += a * w; s.y += b * w; s.L += l * w;
    }
    if (C < 0.05 && l < 0.4) { sh[0] += a * w; sh[1] += b * w; sh[2] += w; }
    if (C < 0.06 && l > 0.7) { hi[0] += a * w; hi[1] += b * w; hi[2] += w; }
  }
  return {
    n: total,
    L,
    sector: sec.map((s) => ({ share: s.w / total, C: s.w ? s.C / s.w : 0, h: (Math.atan2(s.y, s.x) * 180 / Math.PI + 360) % 360, L: s.w ? s.L / s.w : 0 })),
    shadow: [sh[2] ? sh[0] / sh[2] : 0, sh[2] ? sh[1] / sh[2] : 0, sh[2] / total],
    highlight: [hi[2] ? hi[0] / hi[2] : 0, hi[2] ? hi[1] / hi[2] : 0, hi[2] / total],
    meanC: meanC / total,
  };
}

const angle = (a: number, b: number) => { let d = (a - b) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };

/** How unlike the photograph's statistics the render's are: a sum of squares in rough units of "visibly off". */
function mismatch(r: Stats, p: Stats): number {
  if (r.n === 0 || p.n === 0) return 0;
  let e = 0;
  const wL = [0.5, 1, 1, 1, 0.5];
  for (let k = 0; k < 5; k++) e += wL[k] * ((r.L[k] - p.L[k]) / 0.03) ** 2;
  for (let s = 0; s < SECTORS; s++) {
    const a = r.sector[s], b = p.sector[s], w = Math.min(a.share, b.share);
    if (w < 0.01) continue;
    const k = Math.sqrt(w / 0.1);
    e += k * ((a.C - b.C) / 0.012) ** 2;
    e += k * Math.min(1, (a.C + b.C) / 0.1) * (angle(a.h, b.h) / 8) ** 2;
  }
  for (const [x, y] of [[r.shadow, p.shadow], [r.highlight, p.highlight]] as const)
    if (x[2] > 0.02 && y[2] > 0.02) e += ((x[0] - y[0]) / 0.006) ** 2 + ((x[1] - y[1]) / 0.006) ** 2;
  return e;
}

/** K-means in OKLab (lightness counted half), the `k` dominant clusters: [L, a, b, weight]. */
function clusters(v: Float32Array | number[], wt: Float32Array | number[], k = 5): number[][] {
  const n = wt.length;
  if (!n) return [];
  let total = 0;
  for (let i = 0; i < n; i++) total += wt[i];
  // Seeds spread along lightness.
  const order = [...Array(n).keys()].sort((p, q) => v[p * 3] - v[q * 3]);
  let c = Array.from({ length: k }, (_, j) => { const i = order[Math.floor(((j + 0.5) / k) * n)]; return [v[i * 3], v[i * 3 + 1], v[i * 3 + 2], 0]; });
  for (let it = 0; it < 12; it++) {
    const sum = c.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < n; i++) {
      let best = 0, bd = Infinity;
      for (let j = 0; j < k; j++) {
        const d = 0.25 * (v[i * 3] - c[j][0]) ** 2 + (v[i * 3 + 1] - c[j][1]) ** 2 + (v[i * 3 + 2] - c[j][2]) ** 2;
        if (d < bd) { bd = d; best = j; }
      }
      const s = sum[best];
      s[0] += v[i * 3] * wt[i]; s[1] += v[i * 3 + 1] * wt[i]; s[2] += v[i * 3 + 2] * wt[i]; s[3] += wt[i];
    }
    c = sum.map((s, j) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3], s[3] / total] : c[j]));
  }
  return c.sort((a, b) => b[3] - a[3]);
}

/** Weighted mean ΔE (OKLab × 100) from each photograph cluster to the render's nearest. */
function clusterDE(r: number[][], p: number[][]): number {
  let s = 0, w = 0;
  for (const q of p) {
    const d = Math.min(...r.map((x) => Math.hypot(x[0] - q[0], x[1] - q[1], x[2] - q[2])));
    s += d * q[3]; w += q[3];
  }
  return w ? (100 * s) / w : 0;
}

// ---------------------------------------------------------------- the frames

interface Region {
  photo: { v: Float32Array; w: Float32Array; stats: Stats; clusters: number[][] };
  /** The render's pixels before the LUT, gathered by colour: key, count, vignette factor. */
  cells: Map<number, [number, number]>;
}
interface Frame { id: string; meta: Meta; weight: number; city: Region; sky: Region; skyShare: [number, number] }

const Q = 64; // colour cells a side for gathering the render's pixels
const cellKey = (r: number, g: number, b: number) => (Math.min(Q - 1, Math.floor(r * Q)) * Q + Math.min(Q - 1, Math.floor(g * Q))) * Q + Math.min(Q - 1, Math.floor(b * Q));
const cellRgb = (key: number): [number, number, number] => [((key / (Q * Q)) | 0) / Q + 0.5 / Q, (((key / Q) | 0) % Q) / Q + 0.5 / Q, (key % Q) / Q + 0.5 / Q];

if (!existsSync(DIR)) throw new Error(`no ${DIR}: run node tools/compare.ts --fit first`);
const ids = readdirSync(DIR).filter((f) => /^\d+\.json$/.test(f)).map((f) => f.replace('.json', '')).sort();
const frames: Frame[] = [];
const maskOut: { w: number; h: number; rgb: Uint8Array }[] = [];

for (const id of ids) {
  const meta = JSON.parse(readFileSync(`${DIR}/${id}.json`, 'utf8')) as Meta;
  const photo = load(`${DIR}/${id}-photo.png`), pre = load(`${DIR}/${id}-pre.png`), sky = load(`${DIR}/${id}-sky.png`);
  const { w, h } = photo;
  const pLab = toLab(photo);
  // The render's sky, grown by a tenth of the frame's width: where the photograph's may be.
  const near = new Uint8Array(w * h), R = Math.round(w / 10);
  const rowMin = new Int32Array(w).fill(h);
  for (let x = 0; x < w; x++) for (let y = h - 1; y >= 0; y--) if (sky.rgb[(y * w + x) * 3] > 0.5) { rowMin[x] = y; break; }
  for (let x = 0; x < w; x++) {
    let lowest = -1;
    for (let d = -R; d <= R; d++) { const xx = x + d; if (xx >= 0 && xx < w && rowMin[xx] < h) lowest = Math.max(lowest, rowMin[xx]); }
    for (let y = 0; y <= Math.min(h - 1, lowest + R); y++) near[y * w + x] = 1;
  }
  const pSky = photoSky(pLab, w, h, near);
  const aspect = w / h, diag = Math.hypot(aspect, 1) * 0.5;
  const regions = [0, 1].map(() => ({ pv: [] as number[], pw: [] as number[], cells: new Map<number, [number, number]>() }));
  let rs = 0, ps = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const rSky = sky.rgb[i * 3] > 0.5 ? 1 : 0;
      rs += rSky; ps += pSky[i];
      const P = regions[pSky[i]];
      P.pv.push(pLab[i * 3], pLab[i * 3 + 1], pLab[i * 3 + 2]); P.pw.push(1);
      const r = Math.hypot(((x + 0.5) / w - 0.5) * aspect, (y + 0.5) / h - 0.5) / diag;
      const vig = 1 - meta.vignette * r ** 2.4;
      const key = cellKey(pre.rgb[i * 3], pre.rgb[i * 3 + 1], pre.rgb[i * 3 + 2]);
      const c = regions[rSky].cells.get(key) ?? [0, 0];
      c[0] += 1; c[1] += vig;
      regions[rSky].cells.set(key, c);
    }
  const region = (k: number): Region => {
    const v = Float32Array.from(regions[k].pv), wt = Float32Array.from(regions[k].pw);
    return { photo: { v, w: wt, stats: stats(v, wt), clusters: clusters(v, wt) }, cells: regions[k].cells };
  };
  // Night frames are mostly the lamps and the exposure, which the LUT does not set: half weight.
  const hour = Number(meta.clock.split(':')[0]);
  frames.push({ id, meta, weight: hour >= 21 ? 0.5 : 1, city: region(0), sky: region(1), skyShare: [rs / (w * h), ps / (w * h)] });
  if (masks) {
    // Photograph on the left with its sky tinted, the render's mask on the right.
    const out = new Uint8Array(w * 2 * h * 3);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x, o = (y * w * 2 + x) * 3, o2 = (y * w * 2 + w + x) * 3;
      for (let k = 0; k < 3; k++) out[o + k] = Math.round(255 * (pSky[i] ? 0.4 * photo.rgb[i * 3 + k] + 0.6 * [1, 0, 1][k] : photo.rgb[i * 3 + k]));
      for (let k = 0; k < 3; k++) out[o2 + k] = sky.rgb[i * 3] > 0.5 ? [255, 0, 255][k] : Math.round(255 * photo.rgb[i * 3 + k] * 0.5);
    }
    maskOut.push({ w: w * 2, h, rgb: out });
  }
}
console.log(`${frames.length} frames: ${frames.map((f) => f.id).join(' ')}`);

if (masks) {
  // Stacked, each scaled to 450 px wide per half.
  const W = 900;
  const scaled = maskOut.map((m) => {
    const s = W / m.w, h = Math.round(m.h * s), rgb = new Uint8Array(W * h * 3);
    for (let y = 0; y < h; y++) for (let x = 0; x < W; x++) {
      const sx = Math.min(m.w - 1, Math.floor(x / s)), sy = Math.min(m.h - 1, Math.floor(y / s));
      for (let k = 0; k < 3; k++) rgb[(y * W + x) * 3 + k] = m.rgb[(sy * m.w + sx) * 3 + k];
    }
    return { h, rgb };
  });
  const H = scaled.reduce((a, m) => a + m.h + 4, 0), all = new Uint8Array(W * H * 3).fill(255);
  let y0 = 0;
  for (const m of scaled) { all.set(m.rgb, y0 * W * 3); y0 += m.h + 4; }
  writeFileSync(`${DIR}/masks.png`, encodePng(W, H, all));
  console.log(`wrote ${DIR}/masks.png`);
}

// ---------------------------------------------------------------- the grade applied to the render

const keys = new Set<number>();
for (const f of frames) for (const r of [f.city, f.sky]) for (const k of r.cells.keys()) keys.add(k);
const allKeys = [...keys];
console.log(`${allKeys.length} colour cells`);

function graded(P: GradeParams) {
  const map = new Map<number, [number, number, number]>();
  for (const k of allKeys) map.set(k, grade(P, ...cellRgb(k)));
  return map;
}

/** The render's statistics under the grade `P`, as the final pass would draw it. */
function renderSide(f: Frame, r: Region, lut: Map<number, [number, number, number]>) {
  const v: number[] = [], w: number[] = [];
  const { contrast, lift } = f.meta;
  for (const [key, [count, vigSum]] of r.cells) {
    const g = lut.get(key)!, vig = vigSum / count;
    // As the final pass: the family's contrast as an S keeping black and white, the lift, the vignette.
    const s = g.map((c) => (lift + Math.min(1, Math.max(0, c + 4 * (contrast - 1) * (c - 0.5) * c * (1 - c))) * (1 - lift)) * vig) as [number, number, number];
    v.push(...lab(...s));
    w.push(count);
  }
  return { v, w };
}

// Parameters the fit may move, how far one step is at the start, and how far from the hand
// authoring they may wander before the prior pushes back (one σ).
type Knob = { get: (P: GradeParams) => number; set: (P: GradeParams, x: number) => void; step: number; sigma: number; lo: number; hi: number; name: string };
const knob = (name: string, path: (P: GradeParams) => [Record<string, unknown>, string], step: number, sigma: number, lo: number, hi: number): Knob => ({
  name, step, sigma, lo, hi,
  get: (P) => { const [o, k] = path(P); return o[k] as number; },
  set: (P, x) => { const [o, k] = path(P); o[k] = Math.min(hi, Math.max(lo, x)); },
});
const KNOBS: Knob[] = [
  knob('chroma', (P) => [P as unknown as Record<string, unknown>, 'chroma'], 0.04, 0.1, 0.6, 1.1),
  knob('red.chroma', (P) => [P.red as unknown as Record<string, unknown>, 'chroma'], 0.04, 0.12, 0.7, 1.3),
  knob('red.hue', (P) => [P.red as unknown as Record<string, unknown>, 'hue'], 2, 6, -15, 15),
  knob('yellow.chroma', (P) => [P.yellow as unknown as Record<string, unknown>, 'chroma'], 0.04, 0.12, 0.5, 1.2),
  knob('yellow.hue', (P) => [P.yellow as unknown as Record<string, unknown>, 'hue'], 2, 6, -15, 20),
  knob('green.chroma', (P) => [P.green as unknown as Record<string, unknown>, 'chroma'], 0.04, 0.12, 0.4, 1.1),
  knob('green.hue', (P) => [P.green as unknown as Record<string, unknown>, 'hue'], 2, 6, 0, 30),
  knob('green.lightness', (P) => [P.green as unknown as Record<string, unknown>, 'lightness'], 0.01, 0.02, -0.08, 0.04),
  knob('blue.chroma', (P) => [P.blue as unknown as Record<string, unknown>, 'chroma'], 0.04, 0.12, 0.5, 1.2),
  knob('blue.hue', (P) => [P.blue as unknown as Record<string, unknown>, 'hue'], 2, 6, -25, 10),
  // The evening's pale skies ask for lighter blues and the deep afternoon skies (8607, 9369) for
  // darker; the grade cannot tell them apart, so it may lighten them only so far.
  knob('blue.lightness', (P) => [P.blue as unknown as Record<string, unknown>, 'lightness'], 0.01, 0.02, -0.05, 0.03),
  knob('purple.chroma', (P) => [P.purple as unknown as Record<string, unknown>, 'chroma'], 0.05, 0.15, 0.3, 1.0),
  knob('purple.hue', (P) => [P.purple as unknown as Record<string, unknown>, 'hue'], 3, 10, -60, 0),
  knob('shadowTint.a', (P) => [P.shadowTint as unknown as Record<string, unknown>, '0'], 0.003, 0.008, -0.03, 0.02),
  knob('shadowTint.b', (P) => [P.shadowTint as unknown as Record<string, unknown>, '1'], 0.003, 0.008, -0.04, 0.02),
  // Warm highlights are yellow, not pink: past +0.004 in a the overcast skies turned rose (8942).
  knob('highlightTint.a', (P) => [P.highlightTint as unknown as Record<string, unknown>, '0'], 0.003, 0.008, -0.004, 0.004),
  knob('highlightTint.b', (P) => [P.highlightTint as unknown as Record<string, unknown>, '1'], 0.003, 0.008, -0.02, 0.04),
  knob('contrast', (P) => [P as unknown as Record<string, unknown>, 'contrast'], 0.03, 0.08, -0.1, 0.4),
  knob('black', (P) => [P as unknown as Record<string, unknown>, 'black'], 0.004, 0.01, 0, 0.05),
];

const clone = (P: GradeParams): GradeParams => JSON.parse(JSON.stringify(P));
/** Caps one frame's pull: its mismatch counts fully up to about C2 and only logarithmically beyond. */
const C2 = 60;

function evaluate(P: GradeParams, detail = false) {
  const lut = graded(P);
  let loss = 0;
  const rows: { id: string; city: number; sky: number; de: number }[] = [];
  for (const f of frames) {
    let e = 0;
    const row = { id: f.id, city: 0, sky: 0, de: 0 };
    // The skies are compared only where render and photograph show about as much of it.
    const [rs, ps] = f.skyShare, skyOk = Math.min(rs, ps) > 0.03 && Math.min(rs, ps) / Math.max(rs, ps) > 0.5;
    for (const [name, r, wr] of [['city', f.city, 1], ['sky', f.sky, skyOk ? 0.5 : 0]] as const) {
      if (!wr || !r.cells.size || r.photo.stats.n === 0) continue;
      const { v, w } = renderSide(f, r, lut);
      const m = mismatch(stats(v, w), r.photo.stats);
      e += wr * m;
      row[name] = m;
      if (detail && name === 'city') row.de = clusterDE(clusters(v, w), r.photo.clusters);
    }
    loss += f.weight * C2 * Math.log1p(e / C2);
    rows.push(row);
  }
  // The prior is summed and the data averaged over the frames: σ counts three times over, or the
  // hand authoring holds against thirty frames that agree.
  let prior = 0;
  for (const k of KNOBS) prior += ((k.get(P) - k.get(HAND)) / (3 * k.sigma)) ** 2;
  return { loss: loss / frames.length, prior, total: loss / frames.length + prior, rows };
}

// A fit starts from the hand authoring; a report reads the refined parameters.
const start: GradeParams = report && existsSync(PARAMS) ? JSON.parse(readFileSync(PARAMS, 'utf8')).params : clone(HAND);
const before = evaluate(start, true);
let P = clone(start), best = before.total;

if (!report) {
  // Coordinate descent, halving each step when neither direction helps.
  const steps = KNOBS.map((k) => k.step);
  for (let round = 0; round < 8; round++) {
    let moved = false;
    for (let j = 0; j < KNOBS.length; j++) {
      const k = KNOBS[j];
      for (const dir of [1, -1]) {
        const T = clone(P);
        k.set(T, k.get(P) + dir * steps[j]);
        if (k.get(T) === k.get(P)) continue;
        const e = evaluate(T).total;
        if (e < best - 1e-6) { best = e; P = T; moved = true; break; }
      }
    }
    if (!moved) for (let j = 0; j < steps.length; j++) steps[j] /= 2;
    console.log(`round ${round + 1}: ${best.toFixed(2)}`);
  }
}

const after = evaluate(P, true);
console.log('\nframe   city mismatch     sky mismatch    cluster ΔE    sky share (render, photo)');
for (let i = 0; i < frames.length; i++) {
  const a = before.rows[i], b = after.rows[i], f = frames[i];
  console.log(`${f.id}   ${a.city.toFixed(0).padStart(5)} → ${b.city.toFixed(0).padEnd(5)}   ${a.sky.toFixed(0).padStart(5)} → ${b.sky.toFixed(0).padEnd(5)}   ${a.de.toFixed(1).padStart(4)} → ${b.de.toFixed(1).padEnd(4)}   ${f.skyShare.map((s) => (100 * s).toFixed(0) + '%').join(', ')}`);
}
if (detail) {
  // Lightness percentiles, mean chroma, the near-greys' tint and the three largest hue sectors.
  const lut = graded(P);
  const fmt = (st: Stats) => {
    const top = st.sector.map((x, i) => ({ ...x, i })).sort((a, b) => b.share - a.share).slice(0, 3);
    return `L ${st.L.map((x) => (100 * x).toFixed(0)).join('/')}  C ${(100 * st.meanC).toFixed(1)}  sh ${(1000 * st.shadow[0]).toFixed(0)},${(1000 * st.shadow[1]).toFixed(0)}  hi ${(1000 * st.highlight[0]).toFixed(0)},${(1000 * st.highlight[1]).toFixed(0)}  ` +
      top.map((t) => `${t.h.toFixed(0)}°:${(100 * t.share).toFixed(0)}%/C${(100 * t.C).toFixed(1)}`).join(' ');
  };
  for (const f of frames)
    for (const [name, r] of [['city', f.city], ['sky', f.sky]] as const) {
      if (!r.cells.size || r.photo.stats.n === 0) continue;
      const { v, w } = renderSide(f, r, lut);
      console.log(`${f.id} ${name.padEnd(4)} photo  ${fmt(r.photo.stats)}\n          render ${fmt(stats(v, w))}`);
    }
}
const mean = (rows: { de: number }[]) => rows.reduce((s, r) => s + r.de, 0) / rows.length;
console.log(`\nloss ${before.loss.toFixed(2)} → ${after.loss.toFixed(2)}, prior ${after.prior.toFixed(2)}; mean cluster ΔE ${mean(before.rows).toFixed(2)} → ${mean(after.rows).toFixed(2)}`);
for (const k of KNOBS) if (Math.abs(k.get(P) - k.get(HAND)) > 1e-9) console.log(`  ${k.name.padEnd(16)} ${k.get(HAND).toFixed(3)} → ${k.get(P).toFixed(3)}`);

if (!report) {
  mkdirSync('assets/lut', { recursive: true });
  writeFileSync(PARAMS, JSON.stringify({
    note: 'The Classic Negative grade refined against the hero frames by tools/lut-fit.ts (design.md §5.2, §12.3). tools/make-lut.ts writes the LUT from these parameters.',
    frames: frames.map((f) => f.id),
    params: P,
    report: Object.fromEntries(after.rows.map((r) => [r.id, { city: +r.city.toFixed(1), sky: +r.sky.toFixed(1), clusterDE: +r.de.toFixed(2) }])),
  }, null, 2) + '\n');
  writeFileSync('assets/lut/classic-neg.cube', cube(P, 'PRAHA Classic Negative v2'));
  console.log(`wrote ${PARAMS} and assets/lut/classic-neg.cube`);
}
