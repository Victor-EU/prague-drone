// The hundred spires (design.md §7.1, M15): a generator that builds every OSM church, cathedral,
// chapel, basilica, temple and synagogue no hand model stands for, into the landmark pack as an
// unnamed model of its own with the three tiers, replacing the OSM outline and its parts.
//
// The type comes from the tags and the place: `building:architecture` or `start_date` give the
// era, an untagged church in the old town's districts is Baroque, in the blocks neo-Gothic. Where
// the mappers drew Simple 3D parts, the parts carry the massing: a small tall part is a tower (its
// cap by its `roof:shape`), a large part the nave, the rest chapels and sacristies. Where there
// are none, the outline is the plan: the nave under a steep roof from the straight skeleton, the
// towers at the west end (one at a corner, two where the west end is wide, none for a chapel),
// windows, buttresses or pilasters, a west front and a spire by type. A table of overrides names
// the churches whose real form the rules would miss.

import { Kit, mat, shade, rect, ngon, arch, offsetRing, orientedRect, PROFILE, type V2, type V3, type Mat } from './kit.ts';
import { pinnacle, traceryWindow, entablature, pilaster, pediment, statue, hash } from './ornament.ts';
import type { Model, Site } from './index.ts';
import type { Feature, Tags } from '../lib/osm.ts';
import { parseLength, parseNumber, pointInPolygon, signedArea, simplifyRing } from '../lib/osm.ts';
import { parseColour } from '../lib/districts.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';
import { WORLD } from '../../src/core/geo.ts';

type Era = 'romanesque' | 'gothic' | 'renaissance' | 'baroque' | 'neogothic' | 'neoromanesque' | 'modern';
type Kind = 'church' | 'chapel' | 'synagogue';
type Cap = 'needle' | 'onion' | 'helmet' | 'pyramid' | 'dome' | 'none';

/** What a table entry may override (the rest is read from the tags and the plan). */
interface Override {
  era?: Era;
  /** The number of towers to add at the west end (beyond any tower parts). */
  towers?: 0 | 1 | 2;
  /** The towers' total height. */
  towerTop?: number;
  cap?: Cap;
  /** The compass bearing the west front faces. */
  west?: number;
  eave?: number;
  /** Emmaus: the concrete sails of 1967 over the nave. */
  sails?: boolean;
}

/** The churches whose real form the rules would miss (design.md §7.1, M15). */
const OVERRIDES: Record<string, Override> = {
  'way/27854653': { era: 'neogothic', towers: 2, towerTop: 60, cap: 'needle', west: 347 }, // St Ludmila, Vinohrady
  'way/27113302': { towers: 1, towerTop: 48, west: 300 }, // St Ignatius, Charles Square: one tower over the front
  'way/34639878': { towers: 1, towerTop: 40 }, // Kajetán, Nerudova
  'way/28517329': { towers: 2, towerTop: 42 }, // St Giles: two Gothic west towers
  'way/30874540': { era: 'gothic', towers: 2, towerTop: 32, cap: 'none', west: 270 }, // Our Lady under the Chain: two unfinished towers
  'way/30094075': { towers: 2, towerTop: 30, cap: 'dome', west: 200 }, // the Jubilee synagogue's Moorish front
  'way/28518985': { era: 'gothic', sails: true, towers: 0 }, // Emmaus: the sails are its towers
  'way/28552886': { era: 'neoromanesque' }, // Sts Cyril and Methodius, Karlín
  'way/29169022': { towers: 0 }, // St Joseph, Malá Strana: a front without towers
  'way/28517376': { towers: 0 }, // St Ursula
  'way/30621684': { towers: 0 }, // the Prague Crossroads (St Anne), deconsecrated
  'way/27909528': { era: 'gothic' }, // Our Lady of the Snows
  'way/28553161': { era: 'modern', towers: 0 }, // the Sacred Heart, Vinohrady (Plečnik): its own form, kept from its parts
};

const KINDS = new Set(['church', 'cathedral', 'chapel', 'basilica', 'temple', 'synagogue']);
const OLD_TOWN = new Set(['Malá Strana', 'Hradčany', 'Staré Město', 'Josefov', 'Nové Město']);

// ---- Materials -----------------------------------------------------------------------------------

const UP: V3 = [0, 1, 0];
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const COPPER = mat('#6f9a88', Surface.Metal, Metal.Copper);
const SLATE = mat('#3b3e43', Surface.Metal, Metal.Slate);
const LEAD = mat('#34373b', Surface.Metal, Metal.Lead);
const TRACERY = mat('#8a8274', Surface.Glass, Glass.Tracery);
const ROSE = mat('#7a7468', Surface.Glass, Glass.Rose);
const WINDOW = mat('#232629', Surface.Glass, Glass.Plain);
const DARK = mat('#1b1a18', Surface.Opening);
const WHITE = mat('#e9e3d8', Surface.Stone, Stone.Render, 0.15);
const STATUE = mat('#b7ab98', Surface.Stone, Stone.Render, 0.3);
const RENDER_PALETTE = ['#ead9b6', '#e6e0d3', '#e2cf95', '#e4c2ae', '#d6dcc6', '#ecdcc0'];

interface Materials { wall: Mat; dress: Mat; roof: Mat; spire: Mat; glass: Mat }

/** A roof material from a part's or outline's tags, or the default. */
function roofOf(t: Tags, dflt: Mat): Mat {
  const c = (t['roof:colour'] ?? '').toLowerCase(), m = (t['roof:material'] ?? '').toLowerCase();
  if (/copper|green|#aecbbd|#2aa16f|teal/.test(c) || m === 'copper') return COPPER;
  if (/gray|grey|dark|black|slate|#3f3f40|#7a7782/.test(c) || m === 'slate' || m === 'metal') return SLATE;
  if (/white|#fff/.test(c)) return mat('#d8d3c8', Surface.Metal, Metal.Lead);
  if (/firebrick|red|brown|orange|terracotta/.test(c) || m === 'roof_tiles') {
    const rgb = parseColour(t['roof:colour']);
    return rgb && !/firebrick/.test(c) ? mat('#' + rgb.map((q) => Math.round(q * 0.85 + 20).toString(16).padStart(2, '0')).join(''), Surface.Roof) : mat('#a4634a', Surface.Roof);
  }
  return dflt;
}

function materials(era: Era, kind: Kind, t: Tags, seed: number): Materials {
  const tagged = parseColour(t['building:colour']);
  const hex = (rgb: [number, number, number]) => '#' + rgb.map((q) => q.toString(16).padStart(2, '0')).join('');
  const tiles = mat(hash(seed, 3) < 0.5 ? '#a4634a' : '#9a5d47', Surface.Roof);
  switch (era) {
    case 'romanesque':
    case 'gothic': {
      const wall = mat(tagged ? hex(tagged) : '#b3a894', Surface.Stone, Stone.Rubble, 0.6);
      return { wall, dress: mat('#8d847a', Surface.Stone, Stone.Ashlar, 0.6), roof: roofOf(t, tiles), spire: LEAD, glass: TRACERY };
    }
    case 'neogothic':
    case 'neoromanesque': {
      const brick = hash(seed, 4) < 0.5 && !tagged;
      const wall = brick ? mat('#8f5f4c', Surface.Stone, Stone.Brick, 0.4) : mat(tagged ? hex(tagged) : '#a39c90', Surface.Stone, Stone.Ashlar, 0.5);
      return { wall, dress: mat(brick ? '#b9ad9a' : '#8b847a', Surface.Stone, Stone.Ashlar, 0.5), roof: roofOf(t, SLATE), spire: SLATE, glass: TRACERY };
    }
    case 'modern':
      return { wall: mat(tagged ? hex(tagged) : '#d9d2c4', Surface.Stone, Stone.Render, 0.2), dress: WHITE, roof: roofOf(t, SLATE), spire: SLATE, glass: WINDOW };
    default: {
      // Renaissance and Baroque: render in the pale palette, white dressings, copper caps.
      const wall = mat(tagged ? hex(tagged) : RENDER_PALETTE[Math.floor(hash(seed, 5) * RENDER_PALETTE.length)], Surface.Stone, Stone.Render, 0.15);
      return { wall, dress: WHITE, roof: roofOf(t, tiles), spire: COPPER, glass: WINDOW };
    }
  }
}

// ---- Reading the tags -----------------------------------------------------------------------------

function eraOf(t: Tags, district: string): Era {
  const a = (t['building:architecture'] ?? '').toLowerCase();
  if (/neo-gothic|neogothic|gothic_revival/.test(a)) return 'neogothic';
  if (/neo-romanesque|neoromanesque/.test(a)) return 'neoromanesque';
  // "gothic, baroque" is a Gothic body under Baroque caps: the massing is the Gothic one.
  if (/gothic/.test(a)) return 'gothic';
  if (/romanesque/.test(a)) return 'romanesque';
  if (/baroque|rococo/.test(a)) return 'baroque';
  if (/renaissance/.test(a) && !/neo/.test(a)) return 'renaissance';
  if (/modern|functional|cubis|art_nouveau|brutal|contemporary/.test(a)) return 'modern';
  const y = parseNumber((t.start_date ?? '').match(/\d{4}/)?.[0]);
  if (y !== undefined) {
    if (y < 1250) return 'romanesque';
    if (y < 1520) return 'gothic';
    if (y < 1620) return 'renaissance';
    if (y < 1800) return 'baroque';
    if (y < 1920) return /orthodox|lutheran|protestant|evangelical/.test(t.denomination ?? '') ? 'neoromanesque' : 'neogothic';
    return 'modern';
  }
  return OLD_TOWN.has(district) ? 'baroque' : 'neogothic';
}

function kindOf(t: Tags, area: number): Kind {
  if (t.building === 'synagogue' || t.religion === 'jewish') return 'synagogue';
  if (t.building === 'chapel' || area < 150) return 'chapel';
  return 'church';
}

// ---- Geometry helpers -----------------------------------------------------------------------------

/** Outward normal of ring edge i (the ring's winding decides which way is out). */
function edgeNormal(r: V2[], i: number, s: number): V2 {
  const j = (i + 1) % r.length, dx = r[j][0] - r[i][0], dz = r[j][1] - r[i][1], l = Math.hypot(dx, dz) || 1;
  return [(s * dz) / l, (-s * dx) / l];
}
const ringSign = (r: V2[]) => { let a = 0; for (let i = 0; i < r.length; i++) { const j = (i + 1) % r.length; a += r[i][0] * r[j][1] - r[j][0] * r[i][1]; } return Math.sign(a) || 1; };

/** The extent across the axis (z) where a ring crosses x = xs. */
function crossing(r: V2[], xs: number): [number, number] | null {
  let z0 = Infinity, z1 = -Infinity;
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length];
    if ((a[0] <= xs && b[0] > xs) || (b[0] <= xs && a[0] > xs)) {
      const t = (xs - a[0]) / (b[0] - a[0]), z = a[1] + (b[1] - a[1]) * t;
      z0 = Math.min(z0, z); z1 = Math.max(z1, z);
    }
  }
  return z0 <= z1 ? [z0, z1] : null;
}

/** A local ring from a world ring, in the kit's frame at ground g. */
function localRing(k: Kit, r: number[], g: number): V2[] {
  const out: V2[] = [];
  for (let i = 0; i < r.length; i += 2) { const l = k.local(r[i], g, r[i + 1]); out.push([l[0], l[2]]); }
  return out;
}

const ringCentre = (r: V2[]): V2 => [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length];
const inRing = (x: number, z: number, r: V2[]) => pointInPolygon(x, z, { outer: r.flat(), holes: [] });

// ---- Parts ---------------------------------------------------------------------------------------

interface Part { key: string; tags: Tags; ring: V2[]; area: number; h: number; min: number | undefined; roofH: number; shape: string; rect: ReturnType<typeof orientedRect>; roofOnly: boolean }
interface Group { parts: Part[]; base: Part; top: Part; centre: V2; tower: boolean }

/** Stacks of parts over one footprint: the tallest part's cap over the widest part's body. */
function groupParts(parts: Part[]): Group[] {
  const groups: Group[] = [];
  const sorted = parts.slice().sort((a, b) => b.area - a.area);
  for (const p of sorted) {
    const c = ringCentre(p.ring), size = Math.max(p.rect.w, p.rect.d);
    const g = groups.find((q) => {
      const s = Math.max(q.base.rect.w, q.base.rect.d);
      return Math.hypot(q.centre[0] - c[0], q.centre[1] - c[1]) < 0.35 * s && (p.roofOnly || size > 0.45 * s || s <= 14);
    });
    if (g) { g.parts.push(p); if (p.h > g.top.h) g.top = p; }
    else groups.push({ parts: [p], base: p, top: p, centre: c, tower: false });
  }
  return groups;
}

// ---- Towers ----------------------------------------------------------------------------------------

interface TowerOpts { era: Era; cap: Cap; capH?: number; capRing?: V2[]; m: Materials; seed: number; y0: number; body: number; belfry?: boolean; f: Kit; d: Kit }

/**
 * A tower on a local ring: body from y0 to `body`, string courses, a window and a belfry opening
 * on every face wide enough, a cornice, and its cap: a needle (an octagonal spire between corner
 * pinnacles), an onion (a bell, a lantern, the onion), a helmet (a steep pyramid), a pyramid or a
 * dome, ending in a gilded ball and cross.
 */
function tower(k: Kit, ring: V2[], o: TowerOpts) {
  const { m, era, d, f } = o;
  const c = ringCentre(ring), s = Math.min(o.capRing ? Math.min(orientedRect(o.capRing.flat()).w, orientedRect(o.capRing.flat()).d) : Infinity, Math.min(orientedRect(ring.flat()).w, orientedRect(ring.flat()).d));
  const H = o.body - o.y0, gothic = era === 'gothic' || era === 'neogothic' || era === 'romanesque' || era === 'neoromanesque';
  const at = (y: number) => ring.map(([x, z]) => [x, y, z] as V3);
  k.prism(ring, o.y0, o.body, m.wall, null);
  const sg = ringSign(ring);
  // String courses at the thirds; a cornice under the cap.
  for (const t of [0.36, 0.66]) k.sweep(at(o.y0 + H * t), PROFILE.string(0.22, 0.4), m.dress, { closed: true });
  if (gothic) k.sweep(at(o.body - 0.5), PROFILE.string(0.3, 0.5), m.dress, { closed: true });
  else entablature(k, at(o.body - 1.3), m.dress, { out: Math.min(0.7, s * 0.09), h: Math.min(1.4, s * 0.18), closed: true });
  // Corner buttresses (Gothic) or pilaster strips (Baroque).
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], n0 = edgeNormal(ring, (i + ring.length - 1) % ring.length, sg), n1 = edgeNormal(ring, i, sg);
    const bx = (n0[0] + n1[0]), bz = (n0[1] + n1[1]), bl = Math.hypot(bx, bz) || 1;
    if (gothic && s >= 5) {
      const w = Math.min(1.3, s * 0.16);
      const sq: V2[] = [[p[0] + n0[0] * w * 0.5 + n1[0] * w * 0.5, p[1] + n0[1] * w * 0.5 + n1[1] * w * 0.5], [p[0] - n1[0] * w + n0[0] * w * 0.5, p[1] - n1[1] * w + n0[1] * w * 0.5], [p[0] - n1[0] * w - n0[0] * w, p[1] - n1[1] * w - n0[1] * w], [p[0] + n1[0] * w * 0.5 - n0[0] * w, p[1] + n1[1] * w * 0.5 - n0[1] * w]];
      k.prism(sq, o.y0, o.y0 + H * 0.66, m.dress, m.dress);
    } else if (!gothic && s >= 5) {
      k.box(p[0] + (bx / bl) * 0.12, p[1] + (bz / bl) * 0.12, Math.min(0.9, s * 0.13), Math.min(0.9, s * 0.13), o.y0, o.body - 1.3, m.dress, null);
    }
  }
  // Openings on each face: a window at mid height, the belfry's opening under the cornice.
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 2.6) continue;
    const n = edgeNormal(ring, i, sg), u: V3 = [n[1], 0, -n[0]];
    const o3: V3 = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
    const w = Math.min(len * 0.36, gothic ? 1.9 : 2.3), kind = gothic ? 'pointed' : 'round';
    if (o.belfry !== false) traceryWindow(k, f, o3, u, UP, 0, o.body - (gothic ? 8.5 : 8.8) * Math.min(1, H / 24), w, Math.min(6.5, H * 0.24), m.dress, DARK, { kind, lights: gothic ? 2 : 1, proud: 0.12, depth: 0.22 });
    if (H > 16) traceryWindow(k, f, o3, u, UP, 0, o.y0 + H * 0.42, w * 0.75, Math.min(4.5, H * 0.15), m.dress, m.glass, { kind, lights: 1, proud: 0.1, depth: 0.2 });
    if (H > 30) traceryWindow(k, f, o3, u, UP, 0, o.y0 + H * 0.18, w * 0.6, Math.min(3.2, H * 0.1), m.dress, m.glass, { kind, lights: 1, proud: 0.1, depth: 0.2 });
  }
  // The cap, on the top part's footprint where the mappers drew one (a slender spire on a broad body).
  const capRing = o.capRing ?? ring;
  const cr = orientedRect(capRing.flat()), cs = Math.min(cr.w, cr.d), cc = ringCentre(capRing);
  const phase = cr.bearing - kitBearing(k);
  const y1 = o.body;
  if (o.capRing && cs < s - 1.5) {
    // A parapet round the body's top, pinnacles at its corners, the spire's base within.
    k.prism(offsetRing(ring, 0.25), y1 - 0.2, y1 + 1.1, m.dress, m.dress);
    for (const [x, z] of ring) pinnacle(k, f, x, z, y1 - 0.4, y1 + 2.2, y1 + 4.6, Math.min(0.5, s * 0.07), m.dress, { sides: 4, crockets: era === 'neogothic' });
    k.prism(capRing, y1 - 0.5, y1 + 1.2, m.wall, null);
  }
  const capH = o.capH ?? capHeight(o.cap, cs, era);
  const apex = y1 + capH;
  const fin = (y: number, r: number) => { d.lathe(cc[0], cc[1], [[0.06, y - 0.3], [0.05, y + r * 3.2]], 4, m.spire); d.ball(cc[0], y + r * 2.2, cc[1], r, GOLD, 6); d.box(cc[0], cc[1], 0.1, r * 1.6, y + r * 2.6, y + r * 3.2, GOLD, GOLD); };
  switch (o.cap) {
    case 'none':
      k.prism(offsetRing(capRing, 0.2), y1, y1 + 1.2, m.dress, m.dress);
      break;
    case 'needle': {
      // Corner pinnacles on the body's corners, the octagonal spire between them.
      if (!(o.capRing && cs < s - 1.5)) for (const [x, z] of capRing) pinnacle(k, f, x, z, y1 - 0.4, y1 + Math.min(2.4, cs * 0.3), y1 + Math.min(5.4, cs * 0.65), Math.min(0.55, cs * 0.075), m.dress, { sides: 4, crockets: era === 'neogothic' });
      k.lathe(cc[0], cc[1], [[cs * 0.52, y1 + (o.capRing && cs < s - 1.5 ? 1.2 : 0)], [cs * 0.5, y1 + 1.0], [cs * 0.05, apex - 0.6], [0, apex]], 8, m.spire, { flat: true, phase: phase + 22.5 });
      fin(apex, Math.min(0.4, cs * 0.06));
      break;
    }
    case 'pyramid':
    case 'helmet': {
      const r = (cs / 2) * Math.SQRT2;
      const tip = o.cap === 'helmet' ? apex - cs * 0.35 : apex;
      k.lathe(cc[0], cc[1], [[r * 1.04, y1], [r * 1.02, y1 + 0.5], [0.12 * r, tip - (o.cap === 'helmet' ? 0.5 : 0.2)], [0, tip]], 4, m.spire, { flat: true, phase: phase + 45 });
      if (o.cap === 'helmet') {
        // A small lantern and onion on the helmet's tip.
        k.lathe(cc[0], cc[1], [[cs * 0.1, tip - 0.6], [cs * 0.1, tip + cs * 0.12], [cs * 0.14, tip + cs * 0.14], [cs * 0.09, tip + cs * 0.24], [cs * 0.03, tip + cs * 0.32], [0, apex]], 8, m.spire, { flat: true, phase: phase + 22.5 });
      }
      fin(apex, Math.min(0.4, cs * 0.06));
      break;
    }
    case 'dome': {
      const r = cs * 0.55;
      k.lathe(cc[0], cc[1], [[r, y1], [r * 0.98, y1 + r * 0.25], [r * 0.85, y1 + r * 0.6], [r * 0.6, y1 + r * 0.85], [r * 0.3, y1 + r * 0.98], [0, y1 + r]], 16, m.spire);
      k.lathe(cc[0], cc[1], [[r * 0.2, y1 + r - 0.2], [r * 0.2, y1 + r + r * 0.35], [r * 0.26, y1 + r + r * 0.38], [r * 0.12, y1 + r + r * 0.55], [0, apex]], 8, m.spire, { flat: true, phase: phase + 22.5 });
      fin(apex, Math.min(0.35, cs * 0.05));
      break;
    }
    default: {
      // Onion: a copper bell on the body, an open lantern, the onion, the finial.
      const r = (cs / 2) * Math.SQRT2, bell = Math.min(2.2, cs * 0.24), lan = Math.min(4.2, cs * 0.5);
      const yB = y1 + bell, yL = yB + lan;
      k.lathe(cc[0], cc[1], [[r * 1.05, y1], [r * 1.0, y1 + bell * 0.3], [r * 0.7, y1 + bell * 0.7], [r * 0.5, yB]], 4, m.spire, { flat: true, phase: phase + 45 });
      const lr = cs * 0.3;
      k.lathe(cc[0], cc[1], [[lr, yB - 0.1], [lr, yL]], 8, m.dress, { flat: true, phase: phase + 22.5 });
      for (let q = 0; q < 8; q++) {
        const a = ((phase + 22.5 + 45 * q) * Math.PI) / 180 + Math.PI / 8, rr = lr * Math.cos(Math.PI / 8);
        k.plate([cc[0] + rr * Math.cos(a), yB + 0.4, cc[1] + rr * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, arch(lr * 0.7, lan * 0.7, 'round'), DARK, 0.03);
      }
      entablature(k, ngon(8, lr, phase + 22.5, cc[0], cc[1]).map(([x, z]) => [x, yL - 0.5, z] as V3), m.dress, { out: lr * 0.25, h: 0.5, closed: true });
      const on = cs * 0.36;
      k.lathe(cc[0], cc[1], [[on * 0.9, yL], [on, yL + on * 0.35], [on * 0.86, yL + on * 0.8], [on * 0.5, yL + on * 1.3], [on * 0.22, yL + on * 1.7], [on * 0.16, yL + on * 2.0], [on * 0.2, yL + on * 2.15], [0, yL + on * 2.4]], 12, m.spire);
      fin(yL + on * 2.4, Math.min(0.4, cs * 0.06));
      break;
    }
  }
}

function capHeight(cap: Cap, s: number, era: Era): number {
  switch (cap) {
    case 'none': return 1.2;
    case 'needle': return era === 'neogothic' ? s * 2.6 : s * 1.9;
    case 'pyramid': return s * 1.1;
    case 'helmet': return s * 1.5;
    case 'dome': return s * 0.55 + s * 0.55 * 0.65;
    default: return Math.min(2.2, s * 0.24) + Math.min(4.2, s * 0.5) + s * 0.36 * 2.4;
  }
}

/** The compass bearing of the kit's local +x. */
function kitBearing(k: Kit): number {
  const o = k.world([0, 0, 0]), x = k.world([1, 0, 0]);
  return (Math.atan2(x[0] - o[0], -(x[2] - o[2])) * 180) / Math.PI;
}

// ---- The plan ---------------------------------------------------------------------------------------

interface Plan {
  key: string; tags: Tags; outline: Feature; parts: Feature[]; district: string;
  cx: number; cz: number; g: number; bearing: number; seed: number;
  era: Era; kind: Kind; ov: Override; far: boolean;
}

function buildChurch(site: Site, k: Kit, d: Kit, f: Kit, p: Plan) {
  const { era, kind, ov } = p;
  const m = materials(era, kind, p.tags, p.seed);
  const gothic = era === 'gothic' || era === 'neogothic' || era === 'romanesque' || era === 'neoromanesque';
  const baroqued = /baroque/.test((p.tags['building:architecture'] ?? '').toLowerCase());
  const cap: Cap = ov.cap ?? (era === 'baroque' || era === 'renaissance' || (gothic && baroqued) ? 'onion' : era === 'modern' ? 'pyramid' : 'needle');
  for (const kit of [k, d, f]) { kit.place(p.cx, p.g, p.cz, p.bearing); kit.ground = p.g; kit.seed = p.seed & 255; }
  // The fine and detail tiers stay empty far out, where the app never draws them.
  const fine = p.far ? new Kit() : f, det = p.far ? new Kit() : d;
  const poly = { outer: simplifyRing(p.outline.polygons[0].outer), holes: p.outline.polygons[0].holes.map(simplifyRing).filter((h) => h.length >= 6) };
  const ring = localRing(k, poly.outer, p.g), holes = poly.holes.map((h) => localRing(k, h, p.g));
  const sg = ringSign(ring);
  let xW = Infinity, xE = -Infinity;
  for (const [x] of ring) { xW = Math.min(xW, x); xE = Math.max(xE, x); }
  const L = xE - xW;
  const westEnd = crossing(ring, xW + Math.min(4, L * 0.15)) ?? [-5, 5];
  const We = westEnd[1] - westEnd[0];

  // The parts, read: towers, the nave, the rest.
  const parts: Part[] = [];
  for (const q of p.parts) {
    const pr = q.polygons[0]; if (!pr) continue;
    const outer = simplifyRing(pr.outer);
    if (outer.length < 6) continue;
    const r = localRing(k, outer, p.g), area = Math.abs(signedArea(outer));
    if (area < 6) continue;
    const t = q.tags;
    const h = parseLength(t.height) ?? (parseNumber(t['building:levels']) ?? 0) * 3.6;
    const shape = t['roof:shape'] ?? '';
    const roofH = shape && shape !== 'flat' ? (parseLength(t['roof:height']) ?? ((parseNumber(t['roof:levels']) ?? 0) * 2.6 || Math.min(6, h * 0.25))) : 0;
    parts.push({ key: q.key, tags: t, ring: r, area, h: h || 6, min: parseLength(t.min_height), roofH, shape, rect: orientedRect(outer), roofOnly: t['building:part'] === 'roof' });
  }
  // Emmaus's concrete sails: thin tall parts, built as fins over the nave, kept out of the towers.
  const sailParts = ov.sails ? parts.filter((q) => Math.max(q.rect.w, q.rect.d) / Math.min(q.rect.w, q.rect.d) > 4 && q.h >= 30) : [];
  const groups = groupParts(parts.filter((q) => !sailParts.includes(q)));
  const naveGroup = groups.find((g) => g.base.area >= 120 && Math.max(g.base.rect.w, g.base.rect.d) > 14);
  const naveEave = naveGroup ? naveGroup.base.h - naveGroup.base.roofH : 0;
  for (const g of groups) {
    const s = Math.max(g.base.rect.w, g.base.rect.d);
    g.tower = g !== naveGroup && ((s <= 14 && g.base.area <= 200 && g.top.h >= Math.max(20, naveEave * 1.15)) || /tower|belfry|steeple/.test(g.base.tags['tower:type'] ?? '') || /tower/.test(g.base.tags['building:part'] ?? ''));
  }
  const towerGroups = groups.filter((g) => g.tower);
  const LOG = !!process.env.CHURCH_LOG;

  // ---- The nave and the roof ----
  let eave: number, roofTop = 0;
  const pitch = era === 'gothic' || era === 'neogothic' ? 60 : era === 'romanesque' || era === 'neoromanesque' ? 52 : kind === 'synagogue' ? 35 : era === 'modern' ? 32 : 48;
  const gableEdge = (r: V2[]) => (e: number, len: number) => {
    const n = edgeNormal(r, e, ringSign(r));
    return Math.abs(n[0]) > 0.7 && len >= Math.min(6, We * 0.4) && kind !== 'synagogue';
  };
  const covered = parts.reduce((a, q) => a + q.area, 0), outlineArea = Math.abs(signedArea(poly.outer));
  if (naveGroup) {
    eave = naveEave;
    // The parts stand: the nave and the chapels with their tagged roofs, the towers below.
    for (const g of groups) {
      if (g.tower) continue;
      for (const q of g.parts) {
        if (q.roofOnly && q.roofH <= 0) continue;
        const y1 = q.h, y0 = q.min ?? (g.base === q ? -2 : Math.max(-2, g.base.h - 1));
        const ev = y1 - q.roofH;
        const shape = q.shape === 'gabled' ? 'gabled' : q.shape === 'hipped' || q.shape === 'half-hipped' ? 'hipped' : q.shape === 'pyramidal' ? 'pyramidal' : q.shape === 'dome' || q.shape === 'onion' ? 'dome' : q.shape === 'skillion' ? 'skillion' : q.shape ? 'hipped' : 'flat';
        if (ev - y0 > 0.3) k.prism(q.ring, y0, ev, m.wall, shape === 'flat' ? m.roof : null);
        if (shape !== 'flat' && q.roofH > 0.2) {
          const dir = parseNumber(q.tags['roof:direction']);
          roofTop = Math.max(roofTop, ev + k.roof(q.ring, ev, { shape, pitch, height: q.roofH, cap: 99, gable: q === naveGroup.base ? gableEdge(q.ring) : () => shape === 'gabled', direction: dir !== undefined ? (dir * Math.PI) / 180 : undefined }, shape === 'dome' && q.area > 100 ? COPPER : roofOf(q.tags, m.roof), m.wall));
        }
        if (g.base === q && q.area >= 120) dress(k, det, fine, q.ring, ev, m, era, kind, We, towerGroups.map((t) => t.base.ring), gothic);
      }
    }
    for (const q of sailParts) sail(k, q, m, naveEave);
    // Aisles the mappers left to the outline: a low body under a hipped roof round the parts.
    if (covered < 0.7 * outlineArea) {
      const ev = Math.min(naveEave * 0.62, 11);
      k.prism(ring, -2, ev, m.wall, null);
      k.roof(ring, ev, { shape: 'hipped', pitch: Math.min(pitch, 42), cap: 99, gable: () => false }, m.roof, m.wall, holes);
      dress(k, det, fine, ring, ev, m, era, kind, We, parts.map((q) => q.ring), gothic, true);
    }
  } else {
    // The outline is the plan.
    const tagged = parseLength(p.tags.height);
    const ridge = (We / 2) * Math.tan((pitch * Math.PI) / 180);
    const byWidth = kind === 'chapel' ? Math.max(4.5, Math.min(8, We * 0.55 + 2.5)) : kind === 'synagogue' ? Math.max(9, Math.min(16, We * 0.5 + 5)) : gothic ? Math.max(9, Math.min(22, We * 0.7 + 4)) : Math.max(8, Math.min(20, We * 0.65 + 3.5));
    eave = ov.eave ?? (tagged && tagged >= 8 ? Math.max(0.5 * tagged, Math.min(tagged - 2, tagged - ridge)) : byWidth);
    k.prism(ring, -2, eave, m.wall, null);
    for (const h of holes) k.prism(h, -2, eave, m.wall, null, { inward: true });
    roofTop = eave + k.roof(ring, eave, { shape: kind === 'synagogue' ? 'hipped' : 'gabled', pitch, cap: 99, gable: gableEdge(ring) }, m.roof, m.wall, holes);
    dress(k, det, fine, ring, eave, m, era, kind, We, [], gothic);
  }

  // ---- Towers ----
  const y0 = -2;
  const towerRings: V2[][] = [];
  for (const g of towerGroups) {
    const base = g.base, top = g.top;
    const body = Math.max(base.h - (base === top ? base.roofH : 0), ...g.parts.filter((q) => !q.roofOnly).map((q) => q.h - q.roofH));
    const shape = top.shape;
    const tcap: Cap = shape === 'onion' ? 'onion' : shape === 'dome' ? 'dome' : shape === 'pyramidal' ? (top.roofH >= 1.4 * Math.min(top.rect.w, top.rect.d) ? 'needle' : 'pyramid') : shape === 'hipped' || shape === 'gabled' ? 'helmet' : top.roofH > 0 ? 'pyramid' : cap;
    // A lantern over a part it stands in starts on that part's roof.
    let ty0 = base.min ?? y0;
    const under = groups.find((q) => q !== g && !q.tower && inRing(g.centre[0], g.centre[1], q.base.ring));
    if (base.min === undefined && under) ty0 = under.top.h - 1.5;
    const capH = top.roofH > 0 && top.h - top.roofH >= body - 0.5 ? Math.max(1.5, top.h - body) : undefined;
    const spire = roofOf(top.tags, tcap === 'onion' || tcap === 'dome' ? COPPER : m.spire);
    tower(k, base.ring, { era, cap: tcap, capH, capRing: top !== base && top.area < base.area * 0.8 ? top.ring : undefined, m: { ...m, spire }, seed: p.seed, y0: ty0, body, f: fine, d: det });
    towerRings.push(base.ring);
  }
  // Towers the plan adds at the west end.
  const want = ov.towers ?? (kind !== 'church' || We < 8 ? 0 : towerGroups.length ? 0 : gothic ? (We >= (era === 'neogothic' ? 20 : 26) ? 2 : 1) : era === 'modern' ? 1 : We >= 18 ? 2 : 1);
  const s = Math.max(4.5, Math.min(9, We * (want === 2 ? 0.27 : 0.32)));
  const T = ov.towerTop ?? (era === 'neogothic' ? Math.max(38, eave * 2.9) : gothic ? Math.max(28, eave * 2.5) : Math.max(26, eave * 2.3));
  const capH = capHeight(cap, s, era);
  const spots: V2[] = want === 2 ? [[xW + s / 2 + 0.3, westEnd[0] + s / 2 + 0.3], [xW + s / 2 + 0.3, westEnd[1] - s / 2 - 0.3]] : want === 1 ? [[xW + s / 2 + 0.3, hash(p.seed, 7) < 0.5 ? westEnd[0] + s / 2 + 0.3 : westEnd[1] - s / 2 - 0.3]] : [];
  if (want === 1 && era === 'modern') spots[0] = [xW + s / 2 + 0.3, (westEnd[0] + westEnd[1]) / 2];
  for (const [tx, tz] of spots) {
    const r = rect(s, s, tx, tz);
    tower(k, r, { era, cap, m, seed: p.seed, y0, body: T - capH, f: fine, d: det });
    towerRings.push(r);
  }

  // ---- The west front ----
  const free = towerRings.filter((r) => ringCentre(r)[0] < xW + L * 0.3).map((r) => ringCentre(r)[1]);
  let z0 = westEnd[0], z1 = westEnd[1];
  for (const tz of free) { if (tz < (z0 + z1) / 2) z0 = Math.max(z0, tz + s / 2 + 0.2); else z1 = Math.min(z1, tz - s / 2 - 0.2); }
  const W = z1 - z0, zc = (z0 + z1) / 2;
  const front: V3 = [xW, 0, zc], u: V3 = [0, 0, 1];
  if (kind === 'chapel') {
    // A small gable: a round window or an oculus and the door; a ridge turret and a cross.
    k.plate(front, u, UP, arch(1.2, 2.2, 'round'), DARK, 0.04);
    if (eave > 5) k.plate([xW, eave * 0.7, zc], u, UP, ngon(10, 0.4), m.glass, 0.04);
    ridgeTurret(k, det, ring, xW + L * 0.35, eave, roofTop, m, era, Math.max(2.4, Math.min(4.5, eave * 0.5)));
    det.beam([xW - 0.2, roofTop - 0.5, zc], [xW - 0.2, roofTop + 1.4, zc], 0.1, m.dress); det.beam([xW - 0.2, roofTop + 1.0, zc - 0.45], [xW - 0.2, roofTop + 1.0, zc + 0.45], 0.1, m.dress);
  } else if (kind === 'synagogue') {
    k.plate([xW, eave * 0.62, zc], u, UP, ngon(16, Math.min(2.2, W * 0.12)).map(([a, b]) => [a, b] as V2), ROSE, 0.05);
    for (const dz of [-W * 0.28, W * 0.28]) traceryWindow(k, fine, front, u, UP, dz, eave * 0.35, 1.4, eave * 0.3, m.dress, m.glass, { kind: 'round', lights: 1 });
    k.plate(front, u, UP, arch(2.4, 3.6, 'round'), DARK, 0.04);
  } else if (gothic && W > 6) {
    // A great window under the gable, the portal below; pinnacles up the rakes for the neo-Gothic.
    const ww = Math.min(6, W * 0.32), wh = Math.min(eave * 0.5, ww * 2.6);
    if (era === 'neogothic' && want !== 1) k.plate([xW, eave * 0.62, zc], u, UP, ngon(16, ww * 0.42).map(([a, b]) => [a, b] as V2), ROSE, 0.05);
    else traceryWindow(k, fine, front, u, UP, 0, eave * 0.38, ww, wh, m.dress, m.glass, { kind: era === 'romanesque' || era === 'neoromanesque' ? 'round' : 'pointed', lights: 3, transom: true, proud: 0.16, depth: 0.28 });
    traceryWindow(k, fine, front, u, UP, 0, 0, Math.min(3.4, W * 0.2), Math.min(6, eave * 0.32), m.dress, DARK, { kind: era === 'romanesque' || era === 'neoromanesque' ? 'round' : 'pointed', lights: 1, proud: 0.2, depth: 0.4 });
    if (era === 'neogothic' && roofTop > eave + 3) {
      for (const t of [0.35, 0.7]) for (const sz of [-1, 1]) pinnacle(k, fine, xW - 0.15, zc + sz * (W / 2) * (1 - t), eave + (roofTop - eave) * t - 1.2, eave + (roofTop - eave) * t + 0.4, eave + (roofTop - eave) * t + 2.2, 0.28, m.dress, { sides: 4, crockets: true });
      pinnacle(k, fine, xW - 0.15, zc, roofTop - 1.5, roofTop + 0.6, roofTop + 3.2, 0.34, m.dress, { sides: 4, crockets: true });
    }
    if (era === 'gothic' && kind === 'church' && !towerGroups.length && want === 1) ridgeTurret(k, det, ring, xW + L * 0.3, eave, roofTop, m, era, 5);
  } else if (!gothic && W > 6) {
    // A Baroque screen standing a little proud of the gable, with pilasters, an entablature, a
    // round window, the portal, statues on the cornice and a curved pediment over an attic.
    const xs = xW - 0.45, o: V3 = [xs, 0, zc];
    const top = eave + 0.5;
    k.prism([[xs, z0], [xW + 0.3, z0], [xW + 0.3, z1], [xs, z1]], -2, top, m.wall, m.dress);
    entablature(k, [[xs, eave - 1.9, z1], [xs, eave - 1.9, z0]], m.dress, { out: 0.6, h: 1.5 });
    const attW = W * 0.72, attH = Math.min(W * 0.28, eave * 0.35);
    k.slab([xs, top, zc], u, UP, arch(attW, attH, 'segment', attH * 0.8, 10), 0.8, m.wall, m.wall);
    k.sweep([[xs, top + attH * 0.2, zc + attW / 2], ...Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (i + 1) / 10; return [xs, top + attH * 0.2 + attH * 0.8 * Math.sin(a), zc + (attW / 2) * Math.cos(a)] as V3; }), [xs, top + attH * 0.2, zc - attW / 2]], PROFILE.ring(0.5, 0.3), m.dress, { v: [-1, 0, 0], caps: true });
    const cols = W > 14 ? [-0.42, -0.15, 0.15, 0.42] : [-0.38, 0.38];
    for (const c of cols) pilaster(k, o, u, UP, c * W, 0.6, eave - 1.9, Math.min(1.3, W * 0.07), 0.35, m.dress, { capH: 0.9, baseH: 0.6 });
    k.plate([xs, eave * 0.62, zc], u, UP, ngon(12, Math.min(1.4, W * 0.08)).map(([a, b]) => [a, b] as V2), m.glass, 0.05);
    traceryWindow(k, fine, o, u, UP, 0, 0, Math.min(3.2, W * 0.2), Math.min(6, eave * 0.32), m.dress, DARK, { kind: 'round', lights: 1, proud: 0.2, depth: 0.4 });
    for (const c of cols) statue(det, [xs - 0.3, eave - 0.3, zc + c * W], [-1, 0], Math.min(2.6, eave * 0.14), STATUE, 'single', p.seed + Math.round(c * 10));
    if (W > 10) for (const dz of [-W * 0.28, W * 0.28]) traceryWindow(k, fine, o, u, UP, dz, eave * 0.36, Math.min(2.2, W * 0.12), Math.min(5, eave * 0.28), m.dress, m.glass, { kind: 'round', lights: 1 });
  }
  if (kind === 'church' && !gothic && towerGroups.length === 0 && want === 0) ridgeTurret(k, det, ring, xW + L * 0.4, eave, roofTop, m, era, 5.5);
  if (kind === 'church' && ov.sails) ridgeTurret(k, det, ring, xW + L * 0.5, eave, roofTop, m, era, 5);

  const tallest = Math.max(roofTop, ...towerRings.map(() => T), ...towerGroups.map((g) => g.top.h));
  if (LOG) console.log(`church ${p.key} ${p.tags.name ?? ''}: ${era} ${kind} We ${We.toFixed(0)} L ${L.toFixed(0)} eave ${eave.toFixed(1)} roofTop ${roofTop.toFixed(1)} parts ${parts.length} groups ${groups.length} towers ${towerGroups.map((g) => `${g.base.key}@${g.centre.map((v) => v.toFixed(0))} top ${g.top.h} ${g.top.shape}`).join(' | ')} want ${want} T ${T.toFixed(0)} tallest ${tallest.toFixed(0)}`);
  if (tallest >= 30) k.light([p.cx, p.g + tallest * 0.5, p.cz], 1);
}

/** Emmaus's sails: a concrete fin from the nave's eave, leaning out to its tip. */
function sail(k: Kit, q: Part, m: Materials, naveEave: number) {
  void m;
  const c = ringCentre(q.ring), r = orientedRect(q.ring.flat());
  const long = Math.max(r.w, r.d), bearing = r.w >= r.d ? r.bearing : r.bearing + 90;
  const along = ((bearing - kitBearing(k)) * Math.PI) / 180, ux = Math.sin(along), uz = -Math.cos(along);
  const out = c[0] * ux + c[1] * uz > 0 ? 1 : -1;
  const CONC = mat('#d9d4c9', Surface.Stone, Stone.Render, 0.1);
  k.prism(q.ring, naveEave - 1, q.h - q.roofH, CONC, null);
  k.pyramid(q.ring, q.h - q.roofH, q.h, CONC, [c[0] + ux * out * long * 0.45, c[1] + uz * out * long * 0.45]);
}

/** A slender turret on the ridge at x: a lantern under a tall cap, a gilded ball. */
function ridgeTurret(k: Kit, d: Kit, ring: V2[], x: number, eave: number, roofTop: number, m: Materials, era: Era, h: number) {
  const cz = crossing(ring, x);
  if (!cz) return;
  const z = (cz[0] + cz[1]) / 2, y = Math.max(eave + 1, roofTop - 1.2), r = Math.max(0.45, Math.min(1.1, h * 0.2));
  const baroque = !(era === 'gothic' || era === 'neogothic' || era === 'romanesque' || era === 'neoromanesque');
  k.lathe(x, z, [[r, y - 2.5], [r, y + h * 0.45]], baroque ? 8 : 6, m.dress, { flat: true });
  if (baroque) k.lathe(x, z, [[r * 1.25, y + h * 0.45], [r * 1.2, y + h * 0.55], [r * 0.9, y + h * 0.75], [r * 0.4, y + h * 0.9], [r * 0.3, y + h * 0.96], [0, y + h * 1.1]], 8, m.spire);
  else k.lathe(x, z, [[r * 1.15, y + h * 0.45], [r * 1.1, y + h * 0.5], [0, y + h * 1.2]], 6, m.spire, { flat: true });
  d.ball(x, y + h * 1.2 + 0.25, z, Math.min(0.3, r * 0.4), GOLD, 6);
}

/**
 * The walls' dressing along a ring: windows between buttresses (Gothic) or pilasters (Baroque)
 * along every edge long enough that no tower or part stands against, string courses and the
 * cornice. `low` for an aisle round the parts: smaller windows, no cornice.
 */
function dress(k: Kit, d: Kit, f: Kit, ring: V2[], eave: number, m: Materials, era: Era, kind: Kind, We: number, blockers: V2[][], gothic: boolean, low = false) {
  const sg = ringSign(ring);
  let xW = Infinity;
  for (const [x] of ring) xW = Math.min(xW, x);
  const at = (y: number) => ring.map(([x, z]) => [x, y, z] as V3);
  if (!low) {
    if (gothic || era === 'modern') k.sweep(at(eave - 0.55), PROFILE.string(0.28, 0.45), m.dress, { closed: true });
    else entablature(k, at(eave - 1.5), m.dress, { out: 0.55, h: 1.4, closed: true });
    if (eave > 9 && kind === 'church' && !gothic) k.sweep(at(eave * 0.42), PROFILE.string(0.18, 0.3), m.dress, { closed: true });
  }
  const step = kind === 'chapel' ? 4.5 : gothic ? Math.max(5.5, Math.min(7.5, eave * 0.36)) : Math.max(5.5, Math.min(8, eave * 0.4));
  const ww = kind === 'chapel' ? 0.9 : low ? Math.max(1.2, Math.min(2.0, eave * 0.14)) : Math.max(1.4, Math.min(2.8, eave * (gothic ? 0.12 : 0.14)));
  const wh = kind === 'chapel' ? 1.8 : low ? eave * 0.45 : eave * (gothic ? 0.5 : 0.42);
  const sill = kind === 'chapel' ? 1.4 : eave * (gothic ? 0.3 : 0.36);
  const kindA = gothic && era !== 'romanesque' && era !== 'neoromanesque' ? 'pointed' : 'round';
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < (kind === 'chapel' ? 4 : 6.5)) continue;
    const n = edgeNormal(ring, i, sg);
    // The west front is dressed by the plan, not here.
    if (n[0] < -0.7 && Math.abs((a[0] + b[0]) / 2 - xW) < 3) continue;
    const u: V3 = [n[1], 0, -n[0]], mid: V3 = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
    const count = Math.max(1, Math.floor((len - 2.5) / step)), pitch = (len - 2.5) / count;
    for (let q = 0; q < count; q++) {
      const off = (q - (count - 1) / 2) * pitch;
      const px = mid[0] + u[0] * off - n[0] * 0.6, pz = mid[2] + u[2] * off - n[1] * 0.6;
      if (blockers.some((r) => inRing(px, pz, r))) continue;
      traceryWindow(k, f, mid, u, UP, off, sill, ww, wh, m.dress, m.glass, { kind: kindA, lights: gothic && !low ? 2 : 1, transom: wh > 5, proud: 0.12, depth: 0.22 });
      if (kind === 'chapel' || low) continue;
      // Between the windows: a buttress or a pilaster.
      const bo = off + pitch / 2;
      if (q + 1 < count || count === 1) {
        const qx = mid[0] + u[0] * bo, qz = mid[2] + u[2] * bo;
        if (blockers.some((r) => inRing(qx - n[0] * 0.6, qz - n[1] * 0.6, r))) continue;
        if (gothic) {
          const w = 1.1, dp = Math.min(1.5, eave * 0.09);
          const bt: V2[] = [[qx - u[0] * w / 2, qz - u[2] * w / 2], [qx + u[0] * w / 2, qz + u[2] * w / 2], [qx + u[0] * w / 2 + n[0] * dp, qz + u[2] * w / 2 + n[1] * dp], [qx - u[0] * w / 2 + n[0] * dp, qz - u[2] * w / 2 + n[1] * dp]];
          const y1 = eave - Math.max(1.5, eave * 0.15);
          k.prism(bt, -2, y1, m.dress, null);
          k.loft(bt, y1, [[bt[0][0], bt[0][1]], [bt[1][0], bt[1][1]], [bt[1][0] + n[0] * 0.25, bt[1][1] + n[1] * 0.25], [bt[0][0] + n[0] * 0.25, bt[0][1] + n[1] * 0.25]], y1 + dp * 0.9, m.dress, m.dress);
        } else if (eave > 7) {
          pilaster(k, mid, u, UP, bo, 0.5, eave - 1.6, Math.min(1.2, pitch * 0.16), 0.3, m.dress, { capH: 0.8, baseH: 0.5 });
        }
      }
    }
  }
}

// ---- The generator -----------------------------------------------------------------------------------

export const churches: Model = {
  id: 'churches',
  unnamed: true,
  // Merged per tier into cells: the main tier in 2 km cells (always drawn, a handful of draws), the
  // detail in 700 m cells (drawn within 1.4 km), the fine in 300 m cells (drawn within 300 m).
  merge: { main: 2000, detail: 700, fine: 300 },
  build() {},
  expand(site: Site): Model[] {
    const out: Model[] = [];
    const all = site.features((t) => (!!t.building && t.building !== 'no') || (!!t['building:part'] && t['building:part'] !== 'no'));
    const parts = all.filter((q) => q.tags['building:part'] && !q.tags.building && q.polygons[0]).map((q) => {
      const r = q.polygons[0].outer;
      let x = 0, z = 0;
      for (let i = 0; i < r.length; i += 2) { x += r[i]; z += r[i + 1]; }
      return { q, cx: x / (r.length / 2), cz: z / (r.length / 2) };
    });
    for (const f of all) {
      const t = f.tags;
      if (!t.building || !(KINDS.has(t.building) || (t.amenity === 'place_of_worship' && !/monastery|residential|civic|yes/.test(t.building)))) continue;
      if (site.claimed(f.key)) continue;
      const poly = f.polygons[0]; if (!poly) continue;
      const area = Math.abs(signedArea(poly.outer));
      if (area < 12) continue;
      const r = orientedRect(poly.outer);
      if (r.cx < WORLD.xMin || r.cx >= WORLD.xMax || r.cz < WORLD.zMin || r.cz >= WORLD.zMax) continue;
      const ov = OVERRIDES[f.key] ?? {};
      const kind = kindOf(t, area);
      const district = site.district(r.cx, r.cz);
      const era = ov.era ?? eraOf(t, district);
      // The parts inside the outline (by their centres).
      const R = Math.hypot(r.w, r.d) / 2 + 2;
      const inside = parts.filter((p) => Math.hypot(p.cx - r.cx, p.cz - r.cz) <= R && pointInPolygon(p.cx, p.cz, poly) && !site.claimed(p.q.key)).map((p) => p.q);
      // The axis: local +x runs from the west end to the east; the west end faces west, or the towers' way, or the table's.
      let bearing = r.w >= r.d ? r.bearing : r.bearing + 90;
      const westBearing = ov.west;
      const towerParts = inside.filter((q) => { const c = orientedRect(q.polygons[0].outer); const h = parseLength(q.tags.height) ?? 0; return Math.max(c.w, c.d) <= 14 && h >= 20 && Math.abs(signedArea(q.polygons[0].outer)) <= 200; });
      const dir = (b: number): V2 => [Math.sin((b * Math.PI) / 180), -Math.cos((b * Math.PI) / 180)];
      if (towerParts.length && westBearing === undefined) {
        let mx = 0, mz = 0;
        for (const q of towerParts) { const c = orientedRect(q.polygons[0].outer); mx += c.cx - r.cx; mz += c.cz - r.cz; }
        const d = dir(bearing);
        if (mx * d[0] + mz * d[1] > 0) bearing += 180; // the towers stand at the −x end
      } else {
        const want = dir(westBearing ?? 270), d = dir(bearing);
        if (-(d[0] * want[0] + d[1] * want[1]) < 0) bearing += 180;
      }
      const g = site.bare(r.cx, r.cz);
      const seed = parseInt(f.key.split('/')[1], 10) % 100000;
      const far = Math.hypot(r.cx, r.cz) > 3200;
      const plan: Plan = { key: f.key, tags: t, outline: f, parts: inside, district, cx: r.cx, cz: r.cz, g, bearing, seed, era, kind, ov, far };
      const tall = towerParts.some((q) => (parseLength(q.tags.height) ?? 0) >= 30) || (kind === 'church' && (ov.towers ?? 1) > 0 && Math.max(r.w, r.d) > 30);
      out.push({
        id: `church:${f.key}`, unnamed: true, floodlit: tall && !far,
        replaces: [f.key, ...inside.map((q) => q.key)],
        build(s, k, d, fk) { buildChurch(s, k, d, fk, plan); },
      });
    }
    return out;
  },
};
