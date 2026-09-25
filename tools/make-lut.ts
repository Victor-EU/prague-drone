// Writes assets/lut/classic-neg.cube, the Classic Negative grade v1 (design.md §5.1, §5.2).
// The LUT maps display sRGB after the filmic curve to graded display sRGB. It is authored as the
// parameters below, each a row of the §5.1 table, applied in OKLCh; tools/lut-fit.ts refines them
// later against the hero frames. Run: node tools/make-lut.ts

import { writeFileSync, mkdirSync } from 'node:fs';
import { toLinear, toSrgb, linearToOklab, oklabToLinear } from './lib/oklab.ts';

const N = 32;

// Hue windows in OKLCh degrees (terracotta 47, tram red 29, ochre 62, gold 85, foliage 132 to
// 137, lime 128, copper 169, sky 218 to 252).
const P = {
  // Saturation overall: below neutral by about 12%.
  chroma: 0.88,
  // Reds and oranges kept saturated and a touch warm.
  red: { centre: 40, width: 32, chroma: 1.06, hue: -2 },
  // Yellows muted and slightly green.
  yellow: { centre: 88, width: 22, chroma: 0.82, hue: 6 },
  // Greens desaturated and cooled toward olive-teal, never lime.
  green: { centre: 135, width: 34, chroma: 0.72, hue: 12, lightness: -0.015 },
  // Blues toward a muted cyan, lighter and greyer.
  blue: { centre: 238, width: 40, chroma: 0.8, hue: -9, lightness: 0.012 },
  // Violets and magentas fall back toward blue: the film has no purple dusk (9530 to 9608).
  purple: { centre: 305, width: 50, chroma: 0.62, hue: -30 },
  // Shadows toward teal-blue, highlights slightly warm (offsets in OKLab a and b).
  shadowTint: [-0.008, -0.014],
  highlightTint: [0.003, 0.012],
  // Tone: a gentle S around the middle and blacks lifted a hair, so shadows hold detail.
  contrast: 0.12,
  black: 0.012,
};

const window = (h: number, centre: number, width: number) => {
  let d = Math.abs(h - centre) % 360;
  if (d > 180) d = 360 - d;
  return d >= width ? 0 : 0.5 + 0.5 * Math.cos((Math.PI * d) / width);
};

function grade(r: number, g: number, b: number): [number, number, number] {
  let [L, A, B] = linearToOklab(toLinear(r), toLinear(g), toLinear(b));
  let C = Math.hypot(A, B);
  let h = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  // Near-greys have no hue to speak of: fade the hue-selective moves out with chroma.
  const hueWeight = Math.min(1, C / 0.04);
  let cMul = P.chroma, hShift = 0, lShift = 0;
  for (const w of [P.red, P.yellow, P.green, P.blue, P.purple] as { centre: number; width: number; chroma: number; hue: number; lightness?: number }[]) {
    const k = window(h, w.centre, w.width) * hueWeight;
    cMul *= 1 + (w.chroma - 1) * k;
    hShift += w.hue * k;
    lShift += (w.lightness ?? 0) * k;
  }
  C *= cMul;
  h += hShift;
  L += lShift * Math.min(1, C / 0.05);
  // Split toning by lightness.
  const sh = Math.max(0, 1 - L / 0.5) ** 1.5, hi = Math.max(0, (L - 0.62) / 0.38) ** 1.2;
  A = C * Math.cos((h * Math.PI) / 180) + P.shadowTint[0] * sh + P.highlightTint[0] * hi;
  B = C * Math.sin((h * Math.PI) / 180) + P.shadowTint[1] * sh + P.highlightTint[1] * hi;
  // Tone on lightness.
  const s = L * L * (3 - 2 * L);
  L = L + (s - L) * P.contrast;
  L = P.black + L * (1 - P.black);
  const [lr, lg, lb] = oklabToLinear(L, A, B);
  const out = (x: number) => Math.min(1, Math.max(0, toSrgb(Math.min(1, Math.max(0, x)))));
  return [out(lr), out(lg), out(lb)];
}

const lines = [
  'TITLE "PRAHA Classic Negative v1"',
  '# Display sRGB in, display sRGB out. Written by tools/make-lut.ts; see design.md §5.2.',
  `LUT_3D_SIZE ${N}`,
  'DOMAIN_MIN 0.0 0.0 0.0',
  'DOMAIN_MAX 1.0 1.0 1.0',
];
for (let bi = 0; bi < N; bi++)
  for (let gi = 0; gi < N; gi++)
    for (let ri = 0; ri < N; ri++) {
      const [r, g, b] = grade(ri / (N - 1), gi / (N - 1), bi / (N - 1));
      lines.push(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)}`);
    }
mkdirSync('assets/lut', { recursive: true });
writeFileSync('assets/lut/classic-neg.cube', lines.join('\n') + '\n');

// A few palette colours through the grade, for a sanity check.
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
const toHex = (c: number[]) => '#' + c.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
for (const h of ['#b5714f', '#c8352a', '#dc9d64', '#e0b040', '#54644e', '#8fc040', '#4f7396', '#c9d3d6', '#e8d6c4', '#202020', '#808080', '#5a3a78', '#302040'])
  console.log(h, '→', toHex(grade(...hex(h))));
console.log(`wrote assets/lut/classic-neg.cube (${N}³)`);
