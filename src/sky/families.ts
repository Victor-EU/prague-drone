// The light families of design.md §5.3 as keyframes on the clock, blended linearly, plus the
// overcast weather variant blended on top. Everything here is a knob on physics, not a
// replacement for it: the sun's colour and the sky's colours come from the scattering tables.

export interface Light {
  /** Aerosol amount in the sky (1 = a very clear standard atmosphere). Whitens the horizon. */
  aerosol: number;
  /** Ground haze: extinction per km at the river, and its scale height in metres. */
  haze: number;
  hazeHeight: number;
  /** Saturation of the sky itself before the grade. */
  skySat: number;
  /** Lifts the sky's dark band toward the horizon (0 = physical). The photographs' skies are flatter. */
  skyFlat: number;
  /** Gives the low band away from the sun the pale blue of the sky above it (0 = physical). */
  skyHorizon: number;
  /** Direct sun and sky light multipliers. */
  sun: number;
  ambient: number;
  /** Exposure bias in stops on top of the meter. */
  ev: number;
  /** Grade trims: white balance multipliers (linear), saturation, contrast, black lift. */
  wb: [number, number, number];
  sat: number;
  contrast: number;
  lift: number;
  /** Fraction of the session's cumulus coverage present at this hour. */
  cumulus: number;
  /** 0 by day, 1 at night: city glow at the horizon and stars. */
  night: number;
}

type Key = Light & { t: number };

// Clock in hours, CEST. Dawn to 09:30, cumulus midday to 16:00, late afternoon and golden hour to
// 21:00, blue hour and night after (design.md §5.3).
const KEYS: Key[] = [
  { t: 4.5, aerosol: 2.5, haze: 0.30, hazeHeight: 500, skySat: 0.9, skyFlat: 0, sun: 1, ambient: 1, ev: -0.6, wb: [0.94, 0.98, 1.08], sat: 0.95, contrast: 1.0, lift: 0.01, cumulus: 0.25, night: 0.6 },
  { t: 5.3, aerosol: 3, haze: 0.34, hazeHeight: 500, skySat: 0.88, skyFlat: 0.1, sun: 1, ambient: 1, ev: -0.2, wb: [1.03, 1.0, 0.97], sat: 0.97, contrast: 1.0, lift: 0.01, cumulus: 0.25, night: 0 },
  { t: 7.0, aerosol: 2.6, haze: 0.28, hazeHeight: 600, skySat: 0.9, skyFlat: 0.25, sun: 1, ambient: 0.7, ev: 0.1, wb: [1.03, 1.0, 0.97], sat: 1.0, contrast: 1.08, lift: 0.005, cumulus: 0.3 },
  { t: 9.5, aerosol: 1.8, haze: 0.2, hazeHeight: 800, skySat: 0.92, skyFlat: 0.35, sun: 1, ambient: 0.75, ev: 0.15, wb: [1.0, 1.0, 1.0], sat: 1.0, contrast: 1.08, lift: 0, cumulus: 0.6 },
  // Midday (8372, 8385): with real roofs, the sky's light in shadows at 72% and a little contrast
  // give the photographs' white plaster and dark gaps.
  { t: 11.5, aerosol: 1.2, haze: 0.1, hazeHeight: 1000, skySat: 0.94, skyFlat: 0.5, sun: 1, ambient: 0.72, ev: 0.2, wb: [1.0, 1.0, 1.0], sat: 1.0, contrast: 1.1, lift: 0, cumulus: 1 },
  { t: 16.0, aerosol: 1.3, haze: 0.1, hazeHeight: 1000, skySat: 0.94, skyFlat: 0.5, sun: 1, ambient: 0.72, ev: 0.2, wb: [1.0, 1.0, 1.0], sat: 1.0, contrast: 1.1, lift: 0, cumulus: 1 },
  // The Petřín panoramas (7924 to 7944, 18:50): clear air, deep shadows, bright sunlit plaster.
  { t: 18.5, aerosol: 1.4, haze: 0.05, hazeHeight: 900, skySat: 0.96, skyFlat: 0.35, sun: 1, ambient: 0.55, ev: 0.15, wb: [1.0, 1.0, 1.0], sat: 1.0, contrast: 1.12, lift: 0, cumulus: 0.75 },
  { t: 20.2, aerosol: 2, haze: 0.2, hazeHeight: 800, skySat: 0.9, skyFlat: 0.2, sun: 1, ambient: 1, ev: 0, wb: [1.04, 1.0, 0.96], sat: 1.02, contrast: 1.0, lift: 0, cumulus: 0.55 },
  { t: 21.0, aerosol: 2, haze: 0.15, hazeHeight: 800, skySat: 0.75, skyFlat: 0.2, sun: 1, ambient: 1, ev: -0.3, wb: [0.99, 1.0, 1.01], sat: 1.0, contrast: 1.0, lift: 0, cumulus: 0.45 },
  { t: 21.75, aerosol: 1.4, haze: 0.14, hazeHeight: 800, skySat: 0.7, skyFlat: 0.3, sun: 1, ambient: 1, ev: -0.8, wb: [0.94, 1.0, 1.05], sat: 1.0, contrast: 1.0, lift: 0.005, cumulus: 0.35, night: 0.5 },
  { t: 22.5, aerosol: 1.4, haze: 0.14, hazeHeight: 800, skySat: 0.65, skyFlat: 0, sun: 1, ambient: 1, ev: -1.2, wb: [0.95, 0.98, 1.06], sat: 0.95, contrast: 1.0, lift: 0.01, cumulus: 0.3, night: 1 },
  { t: 23.0, aerosol: 1.4, haze: 0.14, hazeHeight: 800, skySat: 0.65, skyFlat: 0, sun: 1, ambient: 1, ev: -1.4, wb: [0.95, 0.98, 1.06], sat: 0.95, contrast: 1.0, lift: 0.01, cumulus: 0.3, night: 1 },
].map((k) => ({ night: 0, skyHorizon: 0.8, ...k }) as Key);

// The pastel overcast of 8952 to 9026: flat light, no shadows, colours pastel, a bright grey sky.
const OVERCAST: Partial<Light> = {
  aerosol: 6, haze: 0.3, hazeHeight: 700, skySat: 0.5, skyFlat: 0, sun: 0.04, ev: 0.2,
  wb: [0.99, 1.0, 1.02], sat: 0.88, contrast: 0.9, lift: 0.02, cumulus: 0,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function mix(a: Light, b: Partial<Light>, t: number): Light {
  const out = { ...a };
  for (const k of Object.keys(b) as (keyof Light)[]) {
    const bv = b[k]!;
    if (Array.isArray(bv)) (out as Record<string, unknown>)[k] = (a[k] as number[]).map((v, i) => lerp(v, bv[i], t));
    else (out as Record<string, unknown>)[k] = lerp(a[k] as number, bv as number, t);
  }
  return out;
}

/** The light at `clock` hours, with the overcast variant blended in by `overcast` (0 to 1). */
export function lightAt(clock: number, overcast: number): Light {
  let light: Light;
  if (clock <= KEYS[0].t) light = KEYS[0];
  else if (clock >= KEYS[KEYS.length - 1].t) light = KEYS[KEYS.length - 1];
  else {
    let i = 0;
    while (clock > KEYS[i + 1].t) i++;
    const a = KEYS[i], b = KEYS[i + 1];
    const t = (clock - a.t) / (b.t - a.t);
    light = mix(a, b, t * t * (3 - 2 * t));
  }
  return overcast > 0 ? mix(light, OVERCAST, overcast) : light;
}
