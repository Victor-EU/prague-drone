// One building, planned (design.md §7.2, §8.1, §8.2): its heights, roof, colours, facade style,
// chimneys and dormers, from its OSM tags and its district's rules. Pure, so tools/build-world.ts
// can run it on a pool of worker threads (tools/lib/plan-worker.ts).

import { roofModel, meshRoof, type Roof, type RoofModel, type RoofSpec, type Shape } from './roofs.ts';
import { placeProps, flatRoofBoxes, rng, type PropRec } from './props.ts';
import { RULES, roofColour, wallColour, parseColour, LANDMARK_COLOURS, type DistrictId } from './districts.ts';
import { parseLength, parseNumber, pointInPolygon, type Polygon, type Ring, type Tags } from './osm.ts';
import { STYLES, Style, BFlag, EFlag } from '../../src/core/buildings.ts';

export interface PlanInput {
  key: string; part: boolean; tags: Tags; area: number; cx: number; poly: Polygon;
  /** Landmark id when the footprint is one that is not modelled by hand. */
  landmark?: string;
  /** Ground under the footprint: lowest, and the reference storeys count from. */
  gmin: number; gref: number;
  district: DistrictId;
  edges: Uint8Array;
}

export interface PlanOutput {
  base: number; top: number; eave: number; gnd: number;
  style: number; flags: number; wall: string; roofC: string;
  roof: Roof | null; props: PropRec[];
  /** For the build log. */
  failed: boolean;
}

export const SMALL = new Set(['garage', 'garages', 'shed', 'carport', 'hut', 'kiosk', 'cabin', 'toilets', 'service', 'transformer_tower', 'container', 'shelter']);
export const HOUSE = new Set(['house', 'detached', 'semidetached_house', 'bungalow', 'terrace', 'villa']);

/** Total height and floating base of a stand-in box (the M0 rules, kept for the landmarks). */
export function boxHeights(t: Tags, area: number): { h: number; minH: number } {
  let h = parseLength(t.height);
  const levels = parseNumber(t['building:levels']);
  if (h === undefined && levels !== undefined) {
    const roofH = parseLength(t['roof:height']);
    const roofLevels = parseNumber(t['roof:levels']) ?? 0;
    const pitched = t['roof:shape'] && t['roof:shape'] !== 'flat';
    h = levels * 3.3 + (roofH ?? (roofLevels ? roofLevels * 2.6 : pitched ? 3 : 1));
  }
  if (h === undefined) {
    const type = t.building ?? t['building:part'] ?? 'yes';
    if (SMALL.has(type)) h = 3.5;
    else if (HOUSE.has(type)) h = 9;
    else if (type === 'church' || type === 'cathedral' || type === 'chapel') h = 20;
    else if (area < 40) h = 4;
    else if (area < 120) h = 9;
    else h = 16;
  }
  let minH = parseLength(t.min_height);
  if (minH === undefined) {
    const ml = parseNumber(t['building:min_level']);
    if (ml) minH = ml * 3.3;
  }
  h = Math.max(2, Math.min(250, h));
  return { h, minH: Math.max(0, Math.min(h - 0.5, minH ?? 0)) };
}

const SHAPES: Record<string, Shape> = {
  flat: 'flat', gabled: 'gabled', hipped: 'hipped', 'half-hipped': 'hipped', side_hipped: 'hipped', 'side_half-hipped': 'hipped',
  many: 'hipped', crosspitched: 'hipped', quadruple_saltbox: 'hipped', mansard: 'mansard', gambrel: 'gambrel',
  pyramidal: 'pyramidal', cone: 'pyramidal', skillion: 'skillion', lean_to: 'skillion', triple_skillion: 'hipped', sawtooth: 'skillion',
  saltbox: 'gabled', double_saltbox: 'gabled', dome: 'dome', onion: 'onion', round: 'round', barrel: 'round',
};
const FLAT_TYPES = new Set(['industrial', 'warehouse', 'retail', 'commercial', 'supermarket', 'hangar', 'greenhouse', 'transportation',
  'train_station', 'parking', 'manufacture', 'storage_tank', 'silo', 'garages', 'garage', 'carport', 'kiosk', 'stadium', 'grandstand',
  'sports_hall', 'sports_centre', 'service', 'transformer_tower', 'container', 'toilets', 'shelter', 'bunker']);
const CHURCH = new Set(['church', 'cathedral', 'chapel', 'basilica', 'monastery']);
/** Boats moored for good (restaurants, botels), which OSM maps as buildings. */
const BOATS = new Set(['houseboat', 'ship']);
/** Where a copper roof is at home when untagged (design.md §8.1, rule 5: churches, palaces). */
const GRAND = new Set(['church', 'cathedral', 'chapel', 'basilica', 'monastery', 'palace', 'civic', 'government', 'public', 'museum', 'university', 'college']);
const DIRECTIONS: Record<string, number> = { N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5, S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5 };

export function hashKey(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** Long over short side of the footprint's tightest box among its edge directions. */
function aspect(r: Ring): number {
  const n = r.length / 2;
  let best = Infinity, ratio = 1;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, ex = r[j * 2] - r[i * 2], ez = r[j * 2 + 1] - r[i * 2 + 1], l = Math.hypot(ex, ez);
    if (l < 2) continue;
    const ux = ex / l, uz = ez / l;
    let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (let k = 0; k < n; k++) {
      const a = r[k * 2] * ux + r[k * 2 + 1] * uz, b = -r[k * 2] * uz + r[k * 2 + 1] * ux;
      a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b);
    }
    const area = (a1 - a0) * (b1 - b0);
    if (area < best) { best = area; ratio = Math.max(a1 - a0, b1 - b0) / Math.max(0.1, Math.min(a1 - a0, b1 - b0)); }
  }
  return ratio;
}

/** Footprint vertex after v, within its ring. */
export function nextVertex(rings: Ring[], v: number): number {
  let first = 0;
  for (const r of rings) {
    const n = r.length / 2;
    if (v < first + n) return first + ((v - first + 1) % n);
    first += n;
  }
  return -1;
}

const roofTop = (m: RoofModel) => (m.H ? Math.max(...m.H) : m.h(m.tmax));

export function planBuilding(b: PlanInput): PlanOutput {
  const t = b.tags;
  const out: PlanOutput = {
    base: b.gmin - 1, top: 0, eave: 0, gnd: b.gref, style: Style.Blank, flags: 0, wall: '#d9c9a8', roofC: '#6d6a62',
    roof: null, props: [], failed: false,
  };
  const seed = hashKey(b.key + (b.part ? '#p' : '') + b.cx.toFixed(1));
  const rand = rng(seed);
  const rules = RULES[b.district];
  const type = t.building ?? t['building:part'] ?? 'yes';
  let minH = parseLength(t.min_height);
  if (minH === undefined) { const ml = parseNumber(t['building:min_level']); if (ml) minH = ml * 3.3; }
  minH = Math.max(0, minH ?? 0);

  if (b.landmark !== undefined) {
    // Landmarks not yet modelled by hand (tools/landmarks/) stand as their OSM parts, with the
    // roof shapes and colours mapped there: spires, domes, onions. Plain walls, no dormers.
    const { h, minH: m2 } = boxHeights(t, b.area);
    const c = LANDMARK_COLOURS[b.landmark] ?? ['#d9c9a8', '#6d6a62'];
    const hex = (v: [number, number, number] | undefined, dflt: string) => v ? '#' + v.map((q) => q.toString(16).padStart(2, '0')).join('') : dflt;
    out.wall = hex(parseColour(t['building:colour']), c[0]);
    out.roofC = /copper/.test(t['roof:material'] ?? '') && !t['roof:colour'] ? '#6f9a88' : hex(parseColour(t['roof:colour']), c[1]);
    out.flags = BFlag.Landmark;
    const lshape: Shape = SHAPES[t['roof:shape'] ?? ''] ?? 'flat';
    const lrings = [b.poly.outer, ...b.poly.holes];
    let lmodel: RoofModel | null = null;
    if (lshape !== 'flat') {
      const angle = parseNumber(t['roof:angle']);
      const rh = parseLength(t['roof:height']) ?? (parseNumber(t['roof:levels']) ?? 0) * 2.6;
      lmodel = roofModel(lrings, {
        shape: lshape, pitch: angle && angle > 5 && angle < 85 ? angle : 45, cap: 99, height: rh > 0 ? Math.min(rh, h - m2 - 0.5) : undefined,
        gable: () => lshape === 'gabled' || lshape === 'gambrel' || lshape === 'round',
      });
    }
    const roofH = lmodel ? roofTop(lmodel) : 0;
    out.base = m2 > 0 ? b.gref + m2 : b.gmin - 1;
    out.eave = b.gref + Math.max(m2 + 0.5, h - roofH);
    out.roof = lmodel ? meshRoof(lmodel, lrings) : null;
    if (out.roof && out.roof.faces.length === 0) out.roof = null;
    out.top = out.eave + (out.roof ? out.roof.height : 0);
    out.failed = lshape !== 'flat' && !out.roof;
    return out;
  }

  // A boat stands low on the water, flat-topped, a row of windows along a pale cabin; by the
  // rules for houses it had a tiled roof and stood in the river as a town house (8683).
  if (BOATS.has(type) || t.floating === 'yes') {
    out.style = Style.Modern;
    out.eave = b.gref + 5.5;
    out.top = out.eave;
    out.wall = '#bdbcb6';
    out.roofC = '#45494b';
    return out;
  }

  // Facade style and storeys.
  const startYear = parseNumber((t.start_date ?? '').slice(0, 4));
  const small = SMALL.has(type);
  const flatType = FLAT_TYPES.has(type);
  const church = CHURCH.has(type);
  let style = rules.style;
  if (small || flatType || church) style = Style.Blank;
  else if (HOUSE.has(type)) style = Style.House;
  let levels = parseNumber(t['building:levels']);
  const height = parseLength(t.height);
  const roofHTag = parseLength(t['roof:height']);
  const roofLevels = parseNumber(t['roof:levels']);
  const modern = (startYear !== undefined && startYear >= 1950) || (levels !== undefined && levels >= 8);

  // Roof shape: tagged, or by the district rules (design.md §8.1, rule 1).
  let shape: Shape | undefined = SHAPES[t['roof:shape'] ?? ''];
  if (!shape) {
    if (b.part) shape = 'flat'; // Simple 3D Buildings: an untagged part is flat
    else if (flatType || b.area > rules.flatArea || (modern && b.area > 600) || (levels ?? 0) >= 8) shape = 'flat';
    else if (small) shape = b.area > 30 && rand() < 0.4 ? 'gabled' : 'flat';
    else {
      const long = aspect(b.poly.outer) > 1.6;
      shape = long && rand() < rules.gabled ? 'gabled' : 'hipped';
      if (!church && rand() < rules.mansard) shape = shape === 'gabled' ? 'gambrel' : 'mansard';
    }
  }
  if (shape === 'flat' && style === rules.style && (b.area > 1200 || modern)) style = Style.Modern;
  let pitch = rules.pitch[0] + rand() * (rules.pitch[1] - rules.pitch[0]);
  if (church) pitch = 55;
  else if (HOUSE.has(type)) pitch = 36 + rand() * 8;
  else if (small) pitch = 25;
  const angle = parseNumber(t['roof:angle']);
  if (angle !== undefined && angle > 5 && angle < 80) pitch = angle;
  const ends = shape === 'gabled' || shape === 'gambrel' || shape === 'round';
  const rings = [b.poly.outer, ...b.poly.holes];
  const edges = b.edges;
  const spec: RoofSpec = {
    shape, pitch, cap: church ? 18 : rules.cap, lower: 70, inset: 1.2,
    gable: (e) => ((edges[e] & EFlag.Party) ? rand() < rules.partyGable : ends),
    height: roofHTag,
  };
  const dirTag = t['roof:direction'] ?? t['roof:slope:direction'];
  if (dirTag) {
    const d = DIRECTIONS[dirTag.toUpperCase()] ?? parseNumber(dirTag);
    if (d !== undefined) spec.direction = (d * Math.PI) / 180;
  }
  let model = roofModel(rings, spec);
  if (model && roofLevels && roofHTag === undefined && roofTop(model) < roofLevels * 2.6) {
    spec.height = roofLevels * 2.6;
    model = roofModel(rings, spec);
  }
  out.failed = shape !== 'flat' && !model;

  // Eave height above the ground reference.
  const storey = STYLES[style].storey;
  let eave: number;
  if (height !== undefined) {
    let rh = model ? roofTop(model) : 0;
    if (model && roofHTag === undefined && rh > 0.45 * (height - minH)) {
      spec.height = Math.max(0.5, 0.45 * (height - minH));
      model = roofModel(rings, spec);
      rh = model ? roofTop(model) : 0;
    }
    eave = height - rh;
  } else {
    if (levels === undefined) {
      levels = rules.levels[0] + Math.floor(rand() * (rules.levels[1] - rules.levels[0] + 1));
      // Small untagged footprints are sheds, garages, kiosks and stair towers, not town houses.
      if (b.area < 30) levels = 1;
      else if (b.area < 60) levels = Math.min(levels, 2);
      else if (b.area < 120) levels = Math.max(1, Math.min(levels - 1, 3));
      if (small) levels = 1;
      else if (HOUSE.has(type)) levels = 2;
      else if (church) levels = 4;
    }
    eave = levels <= 0 ? 2.5 : levels * (small ? 3 : storey) + (levels >= 2 ? 0.5 : 0);
  }
  eave = Math.min(250, Math.max(eave, minH + 2));
  out.eave = b.gref + eave;
  out.base = minH > 0 ? b.gref + minH : b.gmin - 1;
  out.style = style;

  out.roof = model ? meshRoof(model, rings) : null;
  if (out.roof && out.roof.faces.length === 0) out.roof = null;
  out.top = out.eave + (out.roof ? out.roof.height : 0);

  const flat = !out.roof;
  out.wall = wallColour(rules, t, style === Style.Modern, rand());
  // Copper belongs to churches and palaces: other untagged roofs draw terracotta and slate only.
  const grand = GRAND.has(type) || church;
  const mix: [number, number, number] = grand ? [0.55, 0.2, 0.25] : [rules.mix[0] + rules.mix[2] * 0.8, rules.mix[1], rules.mix[2] * 0.2];
  out.roofC = roofColour({ ...rules, mix }, t, flat, rand(), rand());

  // Chimneys and dormers (design.md §8.1, rules 3 and 4).
  if (model && out.roof && !small && !flatType && !church) {
    const size = Math.min(2, Math.max(0.5, b.area / 200));
    out.props = placeProps(model, out.eave, {
      dormers: HOUSE.has(type) ? 0.4 : rules.dormers,
      chimneys: (HOUSE.has(type) ? 1 : rules.chimneys) * size,
      partyChimney: rules.partyChimney,
    }, (e) => (edges[e] & EFlag.Party) !== 0, (v) => nextVertex(rings, v), seed);
  } else if (flat && !b.part && (style === Style.Modern || flatType)) {
    out.props = flatRoofBoxes(rings, b.area, out.eave, (x, z) => pointInPolygon(x, z, b.poly), seed);
  }
  return out;
}
