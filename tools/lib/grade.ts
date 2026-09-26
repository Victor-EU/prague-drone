// The Classic Negative grade of design.md §5.1 and §5.2, as parameters applied in OKLCh: shared by
// tools/make-lut.ts, which writes the LUT, and tools/lut-fit.ts, which refines the parameters
// against the hero frames. The LUT maps display sRGB after the filmic curve to graded display sRGB.

import { toLinear, toSrgb, linearToOklab, oklabToLinear } from './oklab.ts';

export interface Window { centre: number; width: number; chroma: number; hue: number; lightness?: number }
export interface GradeParams {
  chroma: number;
  red: Window; yellow: Window; green: Window; blue: Window; purple: Window;
  shadowTint: [number, number];
  highlightTint: [number, number];
  contrast: number;
  black: number;
}

// The hand authoring, each a row of the §5.1 table. Hue windows in OKLCh degrees (terracotta 47,
// tram red 29, ochre 62, gold 85, foliage 132 to 137, lime 128, copper 169, sky 218 to 252).
export const HAND: GradeParams = {
  // Saturation overall: below neutral by about 12%.
  chroma: 0.88,
  // Reds and oranges kept saturated and a touch warm.
  red: { centre: 40, width: 32, chroma: 1.06, hue: -2 },
  // Yellows muted and slightly green.
  yellow: { centre: 88, width: 22, chroma: 0.82, hue: 6 },
  // Greens desaturated and cooled toward olive-teal, never lime. The window reaches down to the
  // yellow-greens of sunlit grass and young leaves, which the photographs turn teal (8725: the
  // meadow at OKLCh hue 141, chroma 0.043); widened and strengthened in M5.
  green: { centre: 130, width: 42, chroma: 0.64, hue: 17, lightness: -0.02 },
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

const inWindow = (h: number, centre: number, width: number) => {
  let d = Math.abs(h - centre) % 360;
  if (d > 180) d = 360 - d;
  return d >= width ? 0 : 0.5 + 0.5 * Math.cos((Math.PI * d) / width);
};

/** Grades one display sRGB colour (0 to 1). */
export function grade(P: GradeParams, r: number, g: number, b: number): [number, number, number] {
  let [L, A, B] = linearToOklab(toLinear(r), toLinear(g), toLinear(b));
  let C = Math.hypot(A, B);
  let h = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  // Near-greys have no hue to speak of: fade the hue-selective moves out with chroma.
  const hueWeight = Math.min(1, C / 0.04);
  let cMul = P.chroma, hShift = 0, lShift = 0;
  for (const w of [P.red, P.yellow, P.green, P.blue, P.purple]) {
    const k = inWindow(h, w.centre, w.width) * hueWeight;
    cMul *= 1 + (w.chroma - 1) * k;
    hShift += w.hue * k;
    lShift += (w.lightness ?? 0) * k;
  }
  // Vivid reds keep their strength and hue (M11): the film holds roses, geraniums and the trams'
  // red as the strongest colours in a frame (design.md §5.1), where the fit's loss of chroma and
  // turn toward crimson, made on the roofs and plaster, had turned 8722's vermilion roses pink. It
  // fades in above the roofs' chroma.
  const v = inWindow(h, P.red.centre, P.red.width) * Math.min(1, Math.max(0, (C - 0.15) / 0.04)), vivid = v * v * (3 - 2 * v);
  cMul += (1 - cMul) * vivid;
  C *= cMul;
  h += hShift * (1 - vivid);
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

/** The grade as a .cube 3D LUT, `n` a side. */
export function cube(P: GradeParams, title: string, n = 32): string {
  const lines = [
    `TITLE "${title}"`,
    '# Display sRGB in, display sRGB out. Written by tools/make-lut.ts; see design.md §5.2.',
    `LUT_3D_SIZE ${n}`,
    'DOMAIN_MIN 0.0 0.0 0.0',
    'DOMAIN_MAX 1.0 1.0 1.0',
  ];
  for (let bi = 0; bi < n; bi++)
    for (let gi = 0; gi < n; gi++)
      for (let ri = 0; ri < n; ri++) {
        const [r, g, b] = grade(P, ri / (n - 1), gi / (n - 1), bi / (n - 1));
        lines.push(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)}`);
      }
  return lines.join('\n') + '\n';
}
