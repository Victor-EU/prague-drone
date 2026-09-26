// Shared by tools/build-world.ts (which decides) and the app (which draws): the kinds of roof
// face, the facade styles of design.md §8.2, and the flags carried per building and per edge.

/** Roof faces as shipped in the tiles. */
export const Face = { Slope: 1, Flat: 2, Gable: 3 } as const;

/**
 * What a piece of surface is, for the building shader (the `aKind` attribute). The last four are
 * the landmarks' own (tools/landmarks/): stone and brick, metal roofs, glazed windows, openings.
 */
export const Surface = {
  Wall: 0, Roof: 1, FlatRoof: 2, Gable: 3, Chimney: 4, DormerFront: 5, DormerRoof: 6, Plain: 7,
  Stone: 8, Metal: 9, Glass: 10, Opening: 11,
  /** The facades' relief (M14): mouldings, surrounds, sills, balconies, portals, the arcades' piers; its facade is (0, 0, height above ground, 0), for the lamps' pools. */
  Trim: 12,
} as const;

/** Styles of Surface.Stone: its facade is (along, up, weathering 0–1, unused). */
export const Stone = { Ashlar: 0, Brick: 1, Rubble: 2, Render: 3, Setts: 4 } as const;
/** Styles of Surface.Metal: its facade is (along, up the slope, slope length, unused). */
export const Metal = { Slate: 0, Copper: 1, Lead: 2, Gold: 3 } as const;
/** Styles of Surface.Glass: its facade is (across, up, width, height) in metres. Curtain: a modern glass wall that mirrors the sky. */
export const Glass = { Plain: 0, Tracery: 1, Rose: 2, Curtain: 3 } as const;

/**
 * Small things on roofs and fronts, placed at build time (tools/lib/props.ts) and made into
 * geometry by the tile worker (src/world/extrude.ts). Since M14: gables standing on the eave
 * (volute, stepped, or a pediment), corner turrets, bays and attic figures; the large dormers
 * are hipped.
 */
export const Prop = { Chimney: 0, DormerGabled: 1, DormerHipped: 2, RoofBox: 3, Gable: 4, GableStepped: 5, Pediment: 6, Turret: 7, Bay: 8, Figure: 9, Urn: 10 } as const;

/** Per building. */
export const BFlag = { Landmark: 1, Detail: 2 } as const;
/** Per footprint edge: a party wall, shared with a neighbour (no windows, no cornice); an arcade on a square (M14). */
export const EFlag = { Party: 1, Arcade: 2 } as const;
/**
 * Per vertex of the building shader (the aInfo flags byte): a party wall, a floodlit landmark,
 * and the trim's tone (M14: deeper and warmer, paler, or neither: the field's own colour in relief).
 */
export const SFlag = { Party: 1, Floodlit: 2, TrimDeep: 4, TrimPale: 8 } as const;

/**
 * A choice made from a building's seed byte and a key, alike in JavaScript and in GLSL
 * (`RAND_GLSL`), so what the tile worker builds in relief (M14) stands where the shader paints it.
 */
export function rand(seed: number, k: number): number {
  let h = (Math.imul(seed, 747796405) + Math.imul(k, 2891336453)) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995) >>> 0;
  h ^= h >>> 15;
  return (h & 0xffffff) / 16777216;
}
export const RAND_GLSL = 'float praRand(uint s, uint k) { uint h = s * 747796405u + k * 2891336453u; h ^= h >> 13; h *= 0x5bd1e995u; h ^= h >> 15; return float(h & 0xffffffu) / 16777216.0; }';

const LIN = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
/**
 * The trim's tone for a wall of the given sRGB colour bytes (design.md §8.2): deeper and warmer,
 * paler, or the field's own colour, weighted by the field's saturation; as SFlag bits.
 */
export function trimFlags(seed: number, wall: ArrayLike<number>): number {
  const r = LIN(wall[0]), g = LIN(wall[1]), b = LIN(wall[2]);
  const mx = Math.max(r, g, b), sat = (mx - Math.min(r, g, b)) / Math.max(mx, 1e-3);
  const tk = rand(seed, Choice.Trim), pDeep = sat < 0.35 ? 0.5 : 0.2, pPale = sat < 0.35 ? 0.3 : 0.65;
  return tk < pDeep ? SFlag.TrimDeep : tk < pDeep + pPale ? SFlag.TrimPale : 0;
}

/** The keys of `rand` the shader and the worker share. */
export const Choice = { Portal: 100, Balcony: 2, Arch: 3, Hood: 4, WreathPier: 5, Wreath: 6, Wood: 7, Shutters: 8, Trim: 9 } as const;

/**
 * Facade styles (design.md §8.2). Metres: the window pitch along the wall, window width and
 * height, sill above the storey's floor, storey height, and the ground floor's kind (0 plain with
 * a door, 1 shopfronts, 2 arcade-dark).
 */
export interface FacadeStyle { name: string; cell: number; winW: number; winH: number; sill: number; storey: number; ground: number }
export const STYLES: FacadeStyle[] = [
  { name: 'blank', cell: 0, winW: 0, winH: 0, sill: 0, storey: 3.5, ground: 0 },
  // Malá Strana, Hradčany: small windows, 2 to 3 storeys (design.md §8.2).
  { name: 'baroque', cell: 2.7, winW: 1.0, winH: 1.55, sill: 1.0, storey: 3.4, ground: 0 },
  // Old Town: 3 to 4 storeys, shops below.
  { name: 'old-town', cell: 2.9, winW: 1.1, winH: 1.75, sill: 0.95, storey: 3.6, ground: 1 },
  // New Town embankments and the 19th-century blocks: 5 to 6 storeys, tall windows.
  { name: 'block', cell: 3.1, winW: 1.2, winH: 2.05, sill: 0.9, storey: 3.6, ground: 1 },
  // Post-war: lower storeys, wide windows.
  { name: 'modern', cell: 2.6, winW: 1.9, winH: 1.45, sill: 0.9, storey: 3.0, ground: 1 },
  // Houses and villas.
  { name: 'house', cell: 3.2, winW: 1.2, winH: 1.4, sill: 0.9, storey: 3.0, ground: 0 },
  // The palace wings of the Castle (tools/landmarks/castle.ts): tall storeys, long even rows.
  { name: 'palace', cell: 3.0, winW: 1.25, winH: 2.1, sill: 1.0, storey: 3.9, ground: 0 },
];
export const Style = { Blank: 0, Baroque: 1, OldTown: 2, Block: 3, Modern: 4, House: 5, Palace: 6 } as const;

/**
 * The window grid the building shader lays on a wall `L` long under an eave `top` above the ground
 * (src/world/building-material.ts): columns, their pitch, storeys and the storey height. Shared
 * with the tile worker, which builds the relief and the arcades on the same grid (M14).
 */
export function grid(L: number, top: number, style: number) {
  const A = STYLES[style];
  const n = A.cell > 0 ? Math.floor((L - 0.8) / A.cell) : 0;
  const usable = Math.max(top - 0.9, 2.5);
  const nS = Math.max(1, Math.floor(usable / A.storey + 0.35));
  return { n, span: n >= 1 ? (L - 0.8) / n : 0, nS, sh: usable / nS, A };
}
