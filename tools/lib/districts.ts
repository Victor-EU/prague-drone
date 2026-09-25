// The district rules of design.md §7.2, §7.3 and §8.1: which cadastral area a building stands in
// decides its roof mix, pitch, storeys, plaster, facade style and how many dormers and chimneys it
// carries. Colours are the §8.9 palette (sRGB), used as material bases before the grade.

import { Style } from '../../src/core/buildings.ts';
import type { Polygon } from './osm.ts';
import { pointInPolygon } from './osm.ts';

export const TERRACOTTA = ['#a46d54', '#b5714f', '#8f5a42', '#c08063', '#9c6a50', '#b87a5c'];
export const TERRACOTTA_BRIGHT = ['#b8704a', '#c47a4f', '#b5714f', '#c98458', '#a9684a', '#bf7d5a'];
export const TERRACOTTA_WEATHERED = ['#8f5a42', '#9c6a50', '#86604c', '#a46d54', '#7f5a48', '#96654e'];
export const SLATE = ['#5e5d55', '#6d6a62', '#4a4d52'];
export const COPPER = ['#5f8a7a', '#6f9a88'];
export const OTHER = ['#7a6a5a', '#8a7f72', '#74493b', '#6b4a3e'];
export const FLAT = ['#6d6a62', '#7d7a74', '#8a8680', '#5e5d55'];

// From the air Malá Strana reads whiter than its street-level ochres: the light plasters weigh double.
export const PLASTER_MALA_STRANA = ['#eaccb3', '#dc9d64', '#cb7655', '#d8b08a', '#e8d6c4', '#c9b79c', '#eaccb3', '#e8d6c4', '#efe6dc', '#e9dccb'];
// The pale blue and the pink of 8628 are accents: each weighs one in eleven.
export const PLASTER_OLD_TOWN = ['#e4dddd', '#f2e6da', '#d9c9a8', '#e8d6c4', '#b2c6d8', '#e9c9c6', '#f2e6da', '#e8d6c4', '#e6d3b3', '#e4dddd', '#d9c9a8'];
export const PLASTER_BLOCK = ['#e8e0d0', '#d9c9a8', '#e4d6bd', '#cfc2a8', '#c9b9a0', '#bdb3a4', '#e6d3b3', '#d8c3a0', '#e9dccb', '#c4bcae'];
export const PLASTER_OUTER = ['#d9c9a8', '#e8d6c4', '#cfc6b8', '#bdb4a6', '#d8b08a', '#c9c3bb', '#a9a49c'];
export const PLASTER_MODERN = ['#c9c3bb', '#b8b4ac', '#d6d2ca', '#a9a49c', '#e0dcd4', '#9fa3a4'];

export const District = {
  Outer: 0, MalaStrana: 1, Hradcany: 2, StareMesto: 3, Josefov: 4, NoveMesto: 5, Vysehrad: 6, Smichov: 7, Block: 8,
} as const;
export type DistrictId = (typeof District)[keyof typeof District];

const CADASTRE: Record<string, DistrictId> = {
  'Malá Strana': District.MalaStrana,
  Hradčany: District.Hradcany,
  'Staré Město': District.StareMesto,
  Josefov: District.Josefov,
  'Nové Město': District.NoveMesto,
  Vyšehrad: District.Vysehrad,
  Smíchov: District.Smichov,
  // The 19th-century blocks (design.md §7.3).
  Vinohrady: District.Block, Žižkov: District.Block, Karlín: District.Block, Holešovice: District.Block,
  Bubeneč: District.Block, Nusle: District.Block, Vršovice: District.Block, Libeň: District.Block, Dejvice: District.Block,
};

export interface Rules {
  /** Tier 2 districts (design.md §7.2) carry dormers and chimneys in number. */
  tier: 2 | 3;
  style: number;
  levels: [number, number];
  pitch: [number, number];
  /** Chance of a mansard for an untagged pitched roof. */
  mansard: number;
  /** Chance that the ends of a long footprint are gabled rather than hipped. */
  gabled: number;
  /** Chance that a triangular face on a party wall stands up as a gable (a firewall). */
  partyGable: number;
  /** Roof height above which the roof turns flat. */
  cap: number;
  walls: string[];
  terracotta: string[];
  /** Roof mix: terracotta, slate, copper; the rest is "other" (design.md §8.1, rule 5). */
  mix: [number, number, number];
  /** Footprints above this area (m²) get flat roofs when untagged. */
  flatArea: number;
  dormers: number;
  chimneys: number;
  partyChimney: number;
}

const CORE: Rules = {
  tier: 2, style: Style.Baroque, levels: [2, 4], pitch: [40, 50], mansard: 0.05, gabled: 0.7, partyGable: 0.85, cap: 10,
  walls: PLASTER_MALA_STRANA, terracotta: TERRACOTTA_WEATHERED, mix: [0.78, 0.14, 0.05], flatArea: 4000,
  dormers: 1.0, chimneys: 2.2, partyChimney: 0.6,
};
export const RULES: Record<DistrictId, Rules> = {
  [District.MalaStrana]: CORE,
  [District.Hradcany]: { ...CORE, levels: [2, 3] },
  [District.StareMesto]: { ...CORE, style: Style.OldTown, levels: [3, 5], walls: PLASTER_OLD_TOWN, terracotta: TERRACOTTA, dormers: 0.9 },
  [District.Josefov]: {
    ...CORE, style: Style.Block, levels: [5, 6], pitch: [36, 45], mansard: 0.35, gabled: 0.4, walls: PLASTER_OLD_TOWN, terracotta: TERRACOTTA,
    mix: [0.6, 0.35, 0.03], flatArea: 3000, dormers: 0.7, chimneys: 1.6, partyChimney: 0.4,
  },
  [District.NoveMesto]: {
    ...CORE, style: Style.Block, levels: [4, 6], pitch: [34, 44], mansard: 0.3, gabled: 0.4, partyGable: 0.75, cap: 9,
    walls: PLASTER_BLOCK, terracotta: TERRACOTTA, mix: [0.72, 0.22, 0.03], flatArea: 2500, dormers: 0.6, chimneys: 1.6, partyChimney: 0.4,
  },
  [District.Vysehrad]: {
    ...CORE, style: Style.OldTown, levels: [3, 5], pitch: [38, 48], mansard: 0.15, walls: PLASTER_OLD_TOWN, terracotta: TERRACOTTA_BRIGHT,
    mix: [0.84, 0.1, 0.03], dormers: 0.7, chimneys: 1.8, partyChimney: 0.5,
  },
  [District.Smichov]: {
    ...CORE, style: Style.Block, levels: [4, 6], pitch: [34, 42], mansard: 0.3, gabled: 0.4, partyGable: 0.7, cap: 9,
    walls: PLASTER_BLOCK, terracotta: TERRACOTTA, mix: [0.7, 0.25, 0.02], flatArea: 2000, dormers: 0.5, chimneys: 1.4, partyChimney: 0.35,
  },
  [District.Block]: {
    tier: 3, style: Style.Block, levels: [5, 6], pitch: [33, 40], mansard: 0.4, gabled: 0.3, partyGable: 0.7, cap: 8,
    walls: PLASTER_BLOCK, terracotta: TERRACOTTA, mix: [0.75, 0.22, 0.01], flatArea: 2000, dormers: 0.15, chimneys: 0.6, partyChimney: 0.25,
  },
  [District.Outer]: {
    tier: 3, style: Style.Modern, levels: [2, 4], pitch: [28, 38], mansard: 0.05, gabled: 0.5, partyGable: 0.6, cap: 6,
    walls: PLASTER_OUTER, terracotta: TERRACOTTA, mix: [0.7, 0.27, 0.01], flatArea: 600, dormers: 0, chimneys: 0.2, partyChimney: 0.1,
  },
};

export interface DistrictMap { name: string; id: DistrictId; poly: Polygon; box: [number, number, number, number] }

export function districtMaps(features: { tags: Record<string, string>; polygons: Polygon[] }[]): DistrictMap[] {
  const out: DistrictMap[] = [];
  for (const f of features) {
    const id = CADASTRE[f.tags.name];
    if (id === undefined) continue;
    for (const poly of f.polygons) {
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (let i = 0; i < poly.outer.length; i += 2) {
        x0 = Math.min(x0, poly.outer[i]); x1 = Math.max(x1, poly.outer[i]);
        z0 = Math.min(z0, poly.outer[i + 1]); z1 = Math.max(z1, poly.outer[i + 1]);
      }
      out.push({ name: f.tags.name, id, poly, box: [x0, x1, z0, z1] });
    }
  }
  return out;
}

export function districtAt(maps: DistrictMap[], x: number, z: number): DistrictId {
  for (const m of maps) {
    if (x < m.box[0] || x > m.box[1] || z < m.box[2] || z > m.box[3]) continue;
    if (pointInPolygon(x, z, m.poly)) return m.id;
  }
  return District.Outer;
}

// ---- Colours ----------------------------------------------------------------------------------

export const hexRgb = (hex: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];

const NAMED: Record<string, string> = {
  red: '#b03a2e', darkred: '#7a2a22', brown: '#7a5040', maroon: '#6b2f25', orange: '#c47a4f', salmon: '#c98870', coral: '#c47a60',
  grey: '#808080', gray: '#808080', darkgrey: '#555555', darkgray: '#555555', lightgrey: '#bbbbbb', lightgray: '#bbbbbb',
  silver: '#aaaaaa', black: '#303030', white: '#eeeeee', green: '#4e7d62', darkgreen: '#3a5a48', teal: '#4f8a80',
  blue: '#50709a', lightblue: '#a4bcd4', yellow: '#e2c46a', beige: '#dccfb0', cream: '#efe4cc', ivory: '#eee8d8',
  pink: '#e2b8b8', tan: '#c8a878', ochre: '#c9974e', sand: '#d8c49a', gold: '#c9a34a', copper: '#5f8a7a', terracotta: '#b5714f',
};

/** An OSM colour value as sRGB, or undefined. */
export function parseColour(v: string | undefined): [number, number, number] | undefined {
  if (!v) return undefined;
  const s = v.trim().toLowerCase().replace(/[\s_-]/g, '');
  if (/^#[0-9a-f]{6}$/.test(s)) return hexRgb(s);
  if (/^#[0-9a-f]{3}$/.test(s)) return hexRgb('#' + [...s.slice(1)].map((c) => c + c).join(''));
  return NAMED[s] ? hexRgb(NAMED[s]) : undefined;
}

function hsl([r, g, b]: [number, number, number]) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B), l = (max + min) / 2, d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d > 0) h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return { h: (h * 60 + 360) % 360, s, l };
}

const lum = (c: [number, number, number]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

/** The palette entry nearest a tagged colour in brightness. */
function nearestTone(list: string[], c: [number, number, number]): string {
  let best = list[0], bd = Infinity;
  for (const h of list) {
    const d = Math.abs(lum(hexRgb(h)) - lum(c));
    if (d < bd) { bd = d; best = h; }
  }
  return best;
}

function nearestColour(list: string[], c: [number, number, number]): string {
  let best = list[0], bd = Infinity;
  for (const h of list) {
    const p = hexRgb(h);
    const d = (p[0] - c[0]) ** 2 * 0.3 + (p[1] - c[1]) ** 2 * 0.59 + (p[2] - c[2]) ** 2 * 0.11;
    if (d < bd) { bd = d; best = h; }
  }
  return best;
}

const pick = <T>(list: T[], u: number): T => list[Math.min(list.length - 1, Math.floor(u * list.length))];

/** Roof colour: from roof:colour and roof:material when tagged, snapped to the palette; otherwise the district mix. */
export function roofColour(r: Rules, tags: Record<string, string>, flat: boolean, u1: number, u2: number): string {
  const tagged = parseColour(tags['roof:colour']);
  const mat = tags['roof:material'] ?? '';
  if (tagged) {
    const { h, s, l } = hsl(tagged);
    if (s < 0.18 || l < 0.2) return flat ? nearestTone(FLAT, tagged) : nearestTone(SLATE, tagged);
    if (h >= 90 && h < 200) return pick(COPPER, u2);
    if (h < 45 || h >= 330) return nearestTone(r.terracotta.concat(TERRACOTTA), tagged);
  }
  if (/copper/.test(mat)) return pick(COPPER, u2);
  if (/slate/.test(mat)) return pick(SLATE, u2);
  if (/tile|clay/.test(mat)) return pick(r.terracotta, u2);
  if (flat || /concrete|tar|asphalt|gravel|eternit|glass|plastic|pvc/.test(mat)) return pick(FLAT, u2);
  const [t, sl, c] = r.mix;
  if (/metal|tin|zinc|steel/.test(mat)) return u1 < 0.5 ? pick(SLATE, u2) : pick(OTHER, u2);
  return u1 < t ? pick(r.terracotta, u2) : u1 < t + sl ? pick(SLATE, u2) : u1 < t + sl + c ? pick(COPPER, u2) : pick(OTHER, u2);
}

/** Wall colour: building:colour snapped to the plaster palettes, or the district's plaster. */
export function wallColour(r: Rules, tags: Record<string, string>, modern: boolean, u: number): string {
  const tagged = parseColour(tags['building:colour'] ?? tags.colour);
  const all = PLASTER_MALA_STRANA.concat(PLASTER_OLD_TOWN, PLASTER_BLOCK, PLASTER_MODERN);
  if (tagged) return nearestColour(all, tagged);
  return pick(modern ? PLASTER_MODERN : r.walls, u);
}

/** Stand-ins for the landmarks until M3 models them: wall and roof. */
export const LANDMARK_COLOURS: Record<string, [string, string]> = {
  'charles-bridge': ['#8a8074', '#8a8074'],
  'old-town-bridge-tower': ['#857b6f', '#4a4d52'],
  'lesser-town-bridge-towers': ['#857b6f', '#4a4d52'],
  tyn: ['#7d766c', '#3f4247'],
  'old-town-hall': ['#b8a790', '#6d6a62'],
  'st-nicholas': ['#e4dddd', '#5f8a7a'],
  'st-vitus': ['#858075', '#56806f'],
  'petrin-tower': ['#6d5a4a', '#6d5a4a'],
  strahov: ['#e8d6c4', '#a46d54'],
  'vysehrad-basilica': ['#8a8074', '#4a5a52'],
  'leopold-gate': ['#b07a5a', '#8f5a42'],
  'dancing-house': ['#d9d4ca', '#8a8a86'],
  'national-theatre': ['#d9c9a8', '#3f4a55'],
  'sitkov-tower': ['#e4d6c0', '#4a4d52'],
  'smetana-museum': ['#cdbfa6', '#5e5d55'],
  'st-francis': ['#d4c7b0', '#5f8a7a'],
  'klementinum-tower': ['#d9c9a8', '#5e5d55'],
  rudolfinum: ['#d9c9a8', '#7a6f60'],
  'powder-tower': ['#5a554e', '#4a4d52'],
  'national-museum': ['#d9c9a8', '#5f7d74'],
  'letna-metronome': ['#3a3a3a', '#3a3a3a'],
  'zizkov-tower': ['#b8b8b8', '#b8b8b8'],
  'legion-bridge': ['#b0a590', '#b0a590'],
  'manes-bridge': ['#cdc6b8', '#cdc6b8'],
  'cechuv-bridge': ['#3f5a52', '#8a8680'],
  'jiraskuv-bridge': ['#cdc6b8', '#cdc6b8'],
  'palacky-bridge': ['#a09584', '#a09584'],
  'railway-bridge': ['#4f4a44', '#4f4a44'],
  'stefanik-bridge': ['#c0bab0', '#c0bab0'],
};
export const BRIDGE = '#a39584';
