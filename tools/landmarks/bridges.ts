// The other bridges of design.md §7.1, each with its own profile: Legion Bridge's granite arches and
// candelabra, Mánes Bridge's flat concrete arches with open spandrels and lamp pylons, Čechův
// Bridge's steel arches between stone piers and its columns with gilded figures, the pale concrete
// ellipses of Jiráskův and Štefánik bridges, Palacký Bridge's granite arches with their red and grey
// voussoirs, and the railway bridge at Výtoň: three riveted trusses with a walkway outside each,
// and its stone viaduct on the Vyšehrad side.
//
// One generator does them all. The axis, the width and the ends come from OSM's outline of the
// deck; the piers are spaced across the water the axis crosses (as the site's water says), in the
// numbers the real bridges have; the deck rises from the street at each end to clear the river.

import { Kit, mat, shade, ngon, type V3, type V2, type Mat } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

interface Axis {
  /** World (x, z) at distance s along the axis and t across it (t > 0 to the left of the axis's direction). */
  at(s: number, t?: number): V2;
  D: V2; P: V2; s0: number; s1: number; half: number;
  /** Runs of the axis over water: [from, to, water level]. */
  water: [number, number, number][];
  bearing: number;
}

/** The principal axis of an outline, its extent, its usual half width and the water it crosses. */
function axisOf(site: Site, key: string, clip?: [number, number]): Axis {
  const r = site.feature(key)!.polygons[0].outer, n = r.length / 2;
  let mx = 0, mz = 0;
  for (let i = 0; i < n; i++) { mx += r[i * 2]; mz += r[i * 2 + 1]; }
  mx /= n; mz /= n;
  let sxx = 0, sxz = 0, szz = 0;
  for (let i = 0; i < n; i++) { const dx = r[i * 2] - mx, dz = r[i * 2 + 1] - mz; sxx += dx * dx; sxz += dx * dz; szz += dz * dz; }
  const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz);
  let D: V2 = [Math.cos(ang), Math.sin(ang)];
  if (D[0] < 0) D = [-D[0], -D[1]];
  const P: V2 = [-D[1], D[0]];
  const lo = new Map<number, number>(), hi = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, ax = r[i * 2], az = r[i * 2 + 1], bx = r[j * 2], bz = r[j * 2 + 1];
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 0.25));
    for (let q = 0; q < steps; q++) {
      const x = ax + ((bx - ax) * q) / steps - mx, z = az + ((bz - az) * q) / steps - mz;
      const s = Math.round(x * D[0] + z * D[1]), t = x * P[0] + z * P[1];
      lo.set(s, Math.min(lo.get(s) ?? Infinity, t)); hi.set(s, Math.max(hi.get(s) ?? -Infinity, t));
    }
  }
  const keys = [...lo.keys()].sort((a, b) => a - b);
  const mid = keys.slice(Math.floor(keys.length * 0.25), Math.ceil(keys.length * 0.75));
  const widths = mid.map((s) => hi.get(s)! - lo.get(s)!).sort((a, b) => a - b);
  const centres = mid.map((s) => (hi.get(s)! + lo.get(s)!) / 2).sort((a, b) => a - b);
  const half = widths[widths.length >> 1] / 2, tc = centres[centres.length >> 1];
  let s0 = keys[0], s1 = keys[keys.length - 1];
  if (clip) { s0 = Math.max(s0, clip[0]); s1 = Math.min(s1, clip[1]); }
  const at = (s: number, t = 0): V2 => [mx + D[0] * s + P[0] * (tc + t), mz + D[1] * s + P[1] * (tc + t)];
  const water: [number, number, number][] = [];
  let run: number[] = [], lv: number[] = [];
  for (let s = s0; s <= s1; s++) {
    const [x, z] = at(s);
    const w = site.water(x, z);
    if (!Number.isNaN(w)) { run.push(s); lv.push(w); continue; }
    if (run.length > 4) water.push([run[0], run[run.length - 1], lv.sort((a, b) => a - b)[lv.length >> 1]]);
    run = []; lv = [];
  }
  if (run.length > 4) water.push([run[0], run[run.length - 1], lv.sort((a, b) => a - b)[lv.length >> 1]]);
  // A few metres of land between two runs is a gap in the data, not an island.
  for (let i = water.length - 1; i > 0; i--) if (water[i][0] - water[i - 1][1] < 8) { water[i - 1][1] = water[i][1]; water.splice(i, 1); }
  return { at, D, P, s0, s1, half, water, bearing: (Math.atan2(D[0], -D[1]) * 180) / Math.PI };
}

interface Style {
  face: Mat; ring: Mat; pier: Mat; coping: Mat;
  /** Voussoirs alternating with the ring stone (Palacký, Legion). */
  ring2?: Mat;
  /** Radial voussoirs of about this length on the soffit, and the ring's depth (Legion); else vertical slices 0.9 m deep. */
  voussoir?: number; band?: number;
  /** The arches' underside, where it differs from the ring. */
  soffit?: Mat;
  road: Mat; walk: Mat;
  /** 'segment': circular arcs; 'ellipse': flatter at the crown; 'steel': ribs and posts; 'truss': girders above the deck. */
  arch: 'segment' | 'ellipse' | 'steel' | 'truss';
  /** Rise over span. */
  rise: number;
  /** Pier thickness along the bridge, and how far the cutwaters reach beyond the faces. */
  pierT: number; cut: number;
  cutwater: 'round' | 'pointed';
  parapet: 'solid' | 'balustrade' | 'rail';
  /** Openings in the spandrels over each arch (Mánes). */
  open?: boolean;
  /** Arches per water run, in order along the axis; and arches over land between runs (Legion's island). */
  arches: number[];
  land?: { at: number; span: number }[];
  /** Height of the deck above the water at the middle, and the street at the ends. */
  clear: number;
  lamp: 'candelabra' | 'pylon' | 'post' | 'nouveau';
  /** Lamps between the piers as well, every so many metres. */
  lampEvery?: number;
}

const GRANITE = mat('#6c6760', Surface.Stone, Stone.Ashlar, 0.55);
const IRON = mat('#2a2d2b', Surface.Plain);
const LANTERN = mat('#cdb67e', Surface.Glass, Glass.Plain);
const ASPHALT = mat('#55524e', Surface.Plain);
const WALK = mat('#8a857c', Surface.Stone, Stone.Setts, 0.1);
const GOLD = mat('#c49a44', Surface.Metal, Metal.Gold);
const STEEL = mat('#46534d', Surface.Plain);
const RAILS = mat('#5a5752', Surface.Plain);

/** The deck's height along the axis: the street at both ends, rising to clear the river. */
function deckProfile(site: Site, A: Axis, clear: number) {
  const e0 = A.at(A.s0 + 2), e1 = A.at(A.s1 - 2);
  const y0 = site.bare(e0[0], e0[1]), y1 = site.bare(e1[0], e1[1]);
  const wl = Math.max(...A.water.map((w) => w[2]), 0);
  const top = Math.max(wl + clear, (y0 + y1) / 2 + 0.3);
  return (s: number) => {
    const u = Math.min(1, Math.max(0, (s - A.s0) / (A.s1 - A.s0)));
    const base = y0 + (y1 - y0) * u, lift = top - (y0 + y1) / 2;
    // Flat over the river, easing down to the streets over the last fifth.
    const k = Math.min(1, Math.min(u, 1 - u) / 0.2);
    return base + lift * k * k * (3 - 2 * k);
  };
}

interface Span { a: number; b: number; spring: number; rise: number; kind: Style['arch'] }

/** The arches: per water run, `n` equal spans between piers; plus any land arches. */
function layout(A: Axis, st: Style, deck: (s: number) => number, site: Site): { spans: Span[]; piers: { s: number; wl: number }[] } {
  const spans: Span[] = [], piers: { s: number; wl: number }[] = [];
  A.water.forEach(([a, b, wl], i) => {
    const n = st.arches[i] ?? 0;
    if (n <= 0) return;
    const w = (b - a + 1 - (n - 1) * st.pierT) / n;
    for (let k = 0; k < n; k++) {
      const sa = a + k * (w + st.pierT), sb = sa + w;
      const spring = wl + 0.6, rise = Math.min(st.rise * w, deck((sa + sb) / 2) - 1.4 - spring);
      spans.push({ a: sa, b: sb, spring, rise, kind: st.arch });
      if (k > 0) piers.push({ s: sa - st.pierT / 2, wl });
    }
  });
  for (const l of st.land ?? []) {
    const [x, z] = A.at(l.at);
    const g = site.ground(x, z) - 0.3;
    spans.push({ a: l.at - l.span / 2, b: l.at + l.span / 2, spring: g, rise: Math.min(l.span * 0.4, deck(l.at) - 1.4 - g), kind: 'segment' });
  }
  spans.sort((p, q) => p.a - q.a);
  return { spans, piers };
}

/** The soffit's height at s within a span. */
function soffit(h: Span, s: number): number {
  const w = h.b - h.a, m = (h.a + h.b) / 2, x = (s - m) / (w / 2);
  if (Math.abs(x) > 1) return h.spring;
  if (h.kind === 'ellipse') return h.spring + h.rise * Math.sqrt(Math.max(0, 1 - x * x)) ** 0.85;
  const R = (w * w / 4 + h.rise * h.rise) / (2 * h.rise), yc = h.spring + h.rise - R;
  return yc + Math.sqrt(Math.max(0, R * R - (s - m) ** 2));
}

/** A lamp on the parapet or a pier head: pole, lantern(s), and its light. */
function lamp(d: Kit, x: number, y: number, z: number, kind: Style['lamp']) {
  if (kind === 'pylon') {
    // Mánes: a tall square pylon with a lantern.
    d.box(x, z, 0.9, 0.9, y, y + 1.6, GRANITE);
    d.box(x, z, 0.55, 0.55, y + 1.6, y + 8.5, GRANITE);
    d.lathe(x, z, [[0.2, y + 8.5], [0.34, y + 8.9], [0.32, y + 9.6], [0.1, y + 9.8]], 8, LANTERN, { flat: true });
    d.lathe(x, z, [[0.38, y + 9.75], [0, y + 10.3]], 8, IRON, { flat: true });
    d.light([x, y + 9.3, z]);
    return;
  }
  const h = kind === 'candelabra' ? 5.6 : kind === 'nouveau' ? 5.2 : 6.5;
  d.lathe(x, z, [[0.22, y], [0.18, y + 0.5], [0.09, y + 0.7], [0.07, y + h]], 6, IRON);
  if (kind === 'candelabra') {
    // Legion Bridge: a cast-iron candelabra, a crown of five globes.
    d.ball(x, y + h + 0.35, z, 0.26, LANTERN, 8);
    for (const [ox, oz] of ngon(4, 0.62, 45)) {
      d.beam([x, y + h - 0.2, z], [x + ox, y + h + 0.05, z + oz], 0.06, IRON);
      d.ball(x + ox, y + h + 0.3, z + oz, 0.22, LANTERN, 8);
    }
    d.light([x, y + h + 0.3, z]);
  } else if (kind === 'nouveau') {
    // Čechův Bridge: a curved arm and a hanging lantern either side.
    for (const sx of [-1, 1]) {
      d.beam([x, y + h - 0.3, z], [x + sx * 0.7, y + h + 0.1, z], 0.07, IRON);
      d.lathe(x + sx * 0.7, z, [[0.1, y + h - 0.45], [0.2, y + h - 0.2], [0.18, y + h + 0.05], [0.05, y + h + 0.12]], 6, LANTERN, { flat: true });
    }
    d.light([x, y + h - 0.2, z]);
  } else {
    d.lathe(x, z, [[0.1, y + h], [0.25, y + h + 0.1], [0.22, y + h + 0.5], [0.05, y + h + 0.6]], 6, LANTERN, { flat: true });
    d.light([x, y + h + 0.3, z]);
  }
}

/** A bridge of arches (stone, concrete or steel) on the given style. */
function archBridge(site: Site, k: Kit, d: Kit, key: string, st: Style, clip?: [number, number]) {
  const A = axisOf(site, key, clip);
  const deck = deckProfile(site, A, st.clear);
  const { spans, piers } = layout(A, st, deck, site);
  const H = A.half;
  k.place(0, 0, 0); d.place(0, 0, 0);
  k.ground = d.ground = 0;
  const P3 = (s: number, t: number, y: number): V3 => { const [x, z] = A.at(s, t); return [x, y, z]; };
  const side = (t: number): V3 => [A.P[0] * Math.sign(t), 0, A.P[1] * Math.sign(t)];
  const spanAt = (s: number) => spans.find((h) => s >= h.a - 1e-6 && s <= h.b + 1e-6);
  const wlAt = (s: number) => { for (const w of A.water) if (s >= w[0] - 3 && s <= w[1] + 3) return w[2]; return NaN; };
  const foot = (s: number) => { const wl = wlAt(s); const [x, z] = A.at(s); return Number.isNaN(wl) ? site.ground(x, z) - 1.2 : wl - 3; };
  const steel = st.arch === 'steel';
  const girder = steel ? 1.5 : 0.9; // the deck's own depth over the crown
  const parH = st.parapet === 'rail' ? 0 : st.parapet === 'balustrade' ? 1.0 : 1.1;

  const radial = (h: Span) => !!st.voussoir && h.kind === 'segment';
  // Stations: every 1.5 m under an arch, where the soffit curves; every 5 m elsewhere.
  const cuts = new Set<number>();
  for (const h of spans) {
    cuts.add(h.a); cuts.add(h.b);
    const n = Math.max(4, Math.ceil((h.b - h.a) / 1.5));
    for (let q = 1; q < n; q++) cuts.add(h.a + ((h.b - h.a) * q) / n);
  }
  for (let s = Math.ceil(A.s0); s <= Math.floor(A.s1); s += 5) if (!spans.some((h) => s > h.a - 1 && s < h.b + 1)) cuts.add(s);
  cuts.add(A.s0); cuts.add(A.s1);
  const S = [...cuts].filter((s) => s >= A.s0 && s <= A.s1).sort((a, b) => a - b);

  for (let i = 0; i + 1 < S.length; i++) {
    const s0 = S[i], s1 = S[i + 1], sm = (s0 + s1) / 2;
    const d0 = deck(s0), d1 = deck(s1);
    const h = spanAt(sm);
    const B0 = h ? soffit(h, s0) : foot(s0), B1 = h ? soffit(h, s1) : foot(s1);
    // Faces: steel bridges show only the deck girder over their arches; the rest are walls.
    for (const t of [-H, H]) {
      const lo0 = steel && h ? d0 - girder : B0, lo1 = steel && h ? d1 - girder : B1;
      k.poly([P3(s0, t, lo0), P3(s1, t, lo1), P3(s1, t, d1 + parH), P3(s0, t, d0 + parH)], steel && h ? STEEL : st.face, { normal: side(t) });
      if (h && !steel) {
        // The arch ring standing proud of the face; Palacký's alternates its stones.
        const band = 0.9, o = t + Math.sign(t) * 0.1;
        const m = st.ring2 && Math.floor((s0 - h.a) / 1.4) % 2 ? st.ring2 : st.ring;
        if (!radial(h)) k.poly([P3(s0, o, B0), P3(s1, o, B1), P3(s1, o, Math.min(B1 + band, d1)), P3(s0, o, Math.min(B0 + band, d0))], m, { normal: side(t) });
        k.poly([P3(s0, t, B0), P3(s1, t, B1), P3(s1, o, B1), P3(s0, o, B0)], radial(h) ? st.soffit ?? st.ring : m, { normal: [0, -1, 0] });
      }
    }
    // Underside.
    if (h) {
      const y0 = steel ? d0 - girder : B0, y1 = steel ? d1 - girder : B1;
      k.poly([P3(s0, -H, y0), P3(s0, H, y0), P3(s1, H, y1), P3(s1, -H, y1)], steel ? STEEL : st.soffit ?? st.ring, { normal: [0, -1, 0] });
    }
    // Deck: road, raised walks, parapets.
    const walkW = Math.min(3.2, H * 0.28), inner = H - (parH ? 0.45 : 0.1);
    k.poly([P3(s0, -H + walkW, d0), P3(s0, H - walkW, d0), P3(s1, H - walkW, d1), P3(s1, -H + walkW, d1)], st.road, { normal: [0, 1, 0] });
    for (const sg of [-1, 1]) {
      const a = sg * (H - walkW), b = sg * inner;
      k.poly([P3(s0, a, d0 + 0.15), P3(s0, b, d0 + 0.15), P3(s1, b, d1 + 0.15), P3(s1, a, d1 + 0.15)], st.walk, { normal: [0, 1, 0] });
      k.poly([P3(s0, a, d0), P3(s1, a, d1), P3(s1, a, d1 + 0.15), P3(s0, a, d0 + 0.15)], st.walk, { normal: side(-sg) });
      if (parH) {
        k.poly([P3(s0, b, d0 + 0.15), P3(s1, b, d1 + 0.15), P3(s1, b, d1 + parH), P3(s0, b, d0 + parH)], st.face, { normal: side(-sg) });
        k.poly([P3(s0, b, d0 + parH), P3(s0, sg * H, d0 + parH), P3(s1, sg * H, d1 + parH), P3(s1, b, d1 + parH)], st.coping, { normal: [0, 1, 0] });
      } else {
        // An iron railing: a thin dark screen with a rail.
        const rt = sg * (H - 0.05);
        d.poly([P3(s0, rt, d0 + 0.15), P3(s1, rt, d1 + 0.15), P3(s1, rt, d1 + 1.15), P3(s0, rt, d0 + 1.15)], IRON, { normal: side(sg) });
        d.poly([P3(s0, rt, d0 + 0.15), P3(s0, rt, d0 + 1.15), P3(s1, rt, d1 + 1.15), P3(s1, rt, d1 + 0.15)], IRON, { normal: side(-sg) });
      }
    }
    // String course under the parapet.
    if (!steel) for (const t of [-H, H]) {
      const o = t + Math.sign(t) * 0.15;
      k.poly([P3(s0, o, d0 - 0.5), P3(s1, o, d1 - 0.5), P3(s1, o, d1 - 0.1), P3(s0, o, d0 - 0.1)], st.coping, { normal: side(t) });
      k.poly([P3(s0, t, d0 - 0.1), P3(s0, o, d0 - 0.1), P3(s1, o, d1 - 0.1), P3(s1, t, d1 - 0.1)], st.coping, { normal: [0, 1, 0] });
    }
  }
  // Ends of the deck, and the jambs of every opening down to the foundations.
  for (const s of [A.s0, A.s1]) {
    const dir = s === A.s0 ? -1 : 1;
    k.poly([P3(s, -H, foot(s)), P3(s, H, foot(s)), P3(s, H, deck(s) + parH), P3(s, -H, deck(s) + parH)], st.face, { normal: [A.D[0] * dir, 0, A.D[1] * dir] });
  }
  for (const h of spans)
    for (const [s, dir] of [[h.a, 1], [h.b, -1]] as const)
      k.poly([P3(s, -H, foot(s)), P3(s, H, foot(s)), P3(s, H, h.spring), P3(s, -H, h.spring)], st.pier, { normal: [A.D[0] * dir, 0, A.D[1] * dir] });

  // Radial voussoirs (8440): pale granite stones round each arch, two tones alternating and each
  // its own shade, the joints a hair's gap onto the darker face behind; the ring's top stays under
  // the string course.
  for (const h of spans) {
    if (!radial(h) || steel) continue;
    const w = h.b - h.a, m = (h.a + h.b) / 2;
    const R = (w * w / 4 + h.rise * h.rise) / (2 * h.rise), yc = h.spring + h.rise - R;
    const th = Math.asin(Math.min(1, w / 2 / R)), band = st.band ?? 1.1;
    const n = Math.max(8, Math.round((2 * th * R) / st.voussoir!)), gap = 0.03 / R;
    const at = (a: number, r: number, t: number) => {
      const s = m + r * Math.sin(a);
      return P3(s, t, Math.min(yc + r * Math.cos(a), deck(s) - 0.55));
    };
    for (let q = 0; q < n; q++) {
      const a0 = -th + (2 * th * q) / n + gap, a1 = -th + (2 * th * (q + 1)) / n - gap, am = (a0 + a1) / 2;
      // Every other stone reaches a little higher, as dressed voussoirs do.
      const r1 = R + band * (q % 2 ? 1 : 0.86);
      const mq = st.ring2 && q % 2 ? st.ring2 : st.ring;
      const tone = 0.93 + 0.12 * (((q * 7919 + k.seed * 31) % 97) / 97);
      for (const t of [-H, H]) {
        const o = t + Math.sign(t) * 0.1;
        k.poly([at(a0, R, o), at(a1, R, o), at(a1, r1, o), at(a0, r1, o)], mq, { normal: side(t), shade: tone });
        // The stone's top, where it stands proud of the face.
        k.poly([at(a0, r1, t), at(a1, r1, t), at(a1, r1, o), at(a0, r1, o)], mq, { normal: [Math.sin(am) * A.D[0], Math.cos(am), Math.sin(am) * A.D[1]], shade: tone });
      }
    }
  }

  // Open spandrels: a row of dark openings over each arch, between the ring and the deck.
  if (st.open)
    for (const h of spans) {
      const w = h.b - h.a, n = Math.max(3, Math.round(w / 3.4)), step = w / n;
      for (let q = 1; q < n - 1; q++) {
        const sa = h.a + q * step + 0.45, sb = h.a + (q + 1) * step - 0.45;
        const bot = Math.max(soffit(h, sa), soffit(h, sb)) + 1.1, top = Math.min(deck(sa), deck(sb)) - 1.0;
        if (top - bot < 0.8) continue;
        for (const t of [-H, H]) {
          const o = t + Math.sign(t) * 0.03;
          k.poly([P3(sa, o, bot), P3(sb, o, bot), P3(sb, o, top), P3(sa, o, top)], mat('#1d1f21', Surface.Opening), { normal: side(t) });
        }
      }
    }

  // Steel: arch ribs under the deck (one at each face and two inside), with posts up to the girder.
  if (steel)
    for (const h of spans) {
      for (const t of [-H + 0.5, -H * 0.35, H * 0.35, H - 0.5]) {
        const face = Math.abs(t) > H * 0.5;
        const n = Math.max(8, Math.round((h.b - h.a) / 2));
        for (let q = 0; q < n; q++) {
          const sa = h.a + ((h.b - h.a) * q) / n, sb = h.a + ((h.b - h.a) * (q + 1)) / n;
          const ya = soffit(h, sa), yb = soffit(h, sb);
          (face ? k : d).beam(P3(sa, t, ya + 0.45), P3(sb, t, yb + 0.45), 0.5, STEEL, false, 1.0);
        }
        if (!face) continue;
        for (let s = h.a + 3; s < h.b - 2; s += 3) {
          const y = soffit(h, s) + 0.95, top = deck(s) - girder;
          if (top - y > 0.3) k.beam(P3(s, t, y), P3(s, t, top), 0.3, STEEL);
        }
      }
    }

  // Piers: cutwaters both sides, capped; pier heads on the parapet with lamps.
  for (const p of piers) {
    const [x, z] = A.at(p.s);
    const dk = deck(p.s), base = p.wl - 3;
    const h0 = spans.find((q) => Math.abs(q.b - (p.s - st.pierT / 2)) < 0.5), h1 = spans.find((q) => Math.abs(q.a - (p.s + st.pierT / 2)) < 0.5);
    const top = Math.min(h0 ? h0.spring + h0.rise * 0.55 : dk - 3, h1 ? h1.spring + h1.rise * 0.55 : dk - 3, dk - 2);
    for (const sg of [1, -1]) {
      // Local x along the bridge, z out from this face.
      k.push().place(...P3(p.s, sg * H, 0), A.bearing + (sg > 0 ? 0 : 180));
      const W = st.pierT, L = st.cut;
      // In this frame: x along the bridge (either way), z out from the face.
      if (st.cutwater === 'pointed') {
        k.prism([[-W / 2, 0], [0, L], [W / 2, 0]] as V2[], base, top, st.pier, null);
        k.poly([[-W / 2, top, 0], [0, top, L], [0, top + 1.6, 0]], st.coping, { normal: [-1, 1, 1] });
        k.poly([[0, top, L], [W / 2, top, 0], [0, top + 1.6, 0]], st.coping, { normal: [1, 1, 1] });
      } else {
        const ring: V2[] = [[-W / 2, 0], ...Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (1 - (i + 1) / 10); return [(W / 2) * Math.cos(a), Math.max(L, 0.1) * Math.sin(a)] as V2; }), [W / 2, 0]];
        k.prism(ring, base, top, st.pier, null);
        const capRing = ring.map(([a, b]) => [a * 1.06, b * 1.06] as V2);
        k.prism(capRing, top, top + 0.5, st.coping, st.coping);
      }
      k.pop();
      // The pier head: a refuge on the parapet (stone bridges) and its lamp.
      const lampT = sg * (st.parapet === 'rail' ? H + 0.3 : H - 0.2);
      const [lx, lz] = A.at(p.s, lampT);
      if (!steel && st.parapet !== 'rail') {
        k.push().place(...P3(p.s, sg * H, 0), A.bearing + (sg > 0 ? 0 : 180));
        k.box(0, 0.35, st.pierT * 0.7, 0.7, dk - 1.2, dk + parH + 0.1, st.face, st.coping);
        k.pop();
      }
      lamp(d, lx, dk + (st.parapet === 'rail' ? 0.15 : parH + 0.1), lz, st.lamp);
    }
    void x; void z;
  }
  // Lamps between the piers.
  if (st.lampEvery)
    for (const h of spans) {
      const n = Math.max(1, Math.round((h.b - h.a) / st.lampEvery));
      for (let q = 1; q < n; q++) {
        const s = h.a + ((h.b - h.a) * q) / n;
        for (const sg of [1, -1]) {
          const [lx, lz] = A.at(s, sg * (H - 0.25));
          lamp(d, lx, deck(s) + (parH || 0.15), lz, st.lamp === 'pylon' ? 'post' : st.lamp);
        }
      }
    }
  return { A, deck, spans };
}

// ---- The bridges -------------------------------------------------------------------------------

// Changed in M10 (8440): the arch rings pale granite voussoirs, the piers' ashlar warmer.
const legion: Style = {
  face: mat('#77716a', Surface.Stone, Stone.Ashlar, 0.5), ring: mat('#b9b3a7', Surface.Stone, Stone.Render, 0.25), ring2: mat('#a39d92', Surface.Stone, Stone.Render, 0.3),
  voussoir: 0.62, band: 1.15, soffit: shade(GRANITE, 0.9),
  pier: mat('#85766a', Surface.Stone, Stone.Ashlar, 0.5), coping: mat('#8a857c', Surface.Stone, Stone.Ashlar, 0.3),
  road: ASPHALT, walk: WALK, arch: 'segment', rise: 0.17, pierT: 4.6, cut: 3.4, cutwater: 'round', parapet: 'solid',
  arches: [3, 0, 6], land: [], clear: 6.3, lamp: 'candelabra',
};

const manes: Style = {
  face: mat('#8e8678', Surface.Stone, Stone.Ashlar, 0.45), ring: mat('#857d70', Surface.Stone, Stone.Ashlar, 0.5), pier: mat('#7d766a', Surface.Stone, Stone.Ashlar, 0.6),
  coping: mat('#a09888', Surface.Stone, Stone.Ashlar, 0.25), road: ASPHALT, walk: WALK, arch: 'segment', rise: 0.13, pierT: 5.5, cut: 3.2,
  cutwater: 'round', parapet: 'balustrade', open: true, arches: [4], clear: 8.2, lamp: 'pylon',
};

const cech: Style = {
  face: mat('#857c6f', Surface.Stone, Stone.Ashlar, 0.4), ring: STEEL, pier: mat('#7c7468', Surface.Stone, Stone.Ashlar, 0.5),
  coping: mat('#9d9585', Surface.Stone, Stone.Ashlar, 0.2), road: ASPHALT, walk: WALK, arch: 'steel', rise: 0.14, pierT: 6, cut: 4,
  cutwater: 'pointed', parapet: 'rail', arches: [3], clear: 8.6, lamp: 'nouveau', lampEvery: 14,
};

const jirasek: Style = {
  face: mat('#aaa497', Surface.Stone, Stone.Render, 0.2), ring: mat('#a19b8e', Surface.Stone, Stone.Render, 0.25), pier: mat('#958f83', Surface.Stone, Stone.Ashlar, 0.4),
  coping: mat('#b3ad9f', Surface.Stone, Stone.Render, 0.1), road: ASPHALT, walk: WALK, arch: 'ellipse', rise: 0.17, pierT: 4.2, cut: 2.6,
  cutwater: 'round', parapet: 'solid', arches: [6], clear: 7.8, lamp: 'post', lampEvery: 24,
};

const palacky: Style = {
  face: mat('#7b776f', Surface.Stone, Stone.Ashlar, 0.45), ring: mat('#6f6c67', Surface.Stone, Stone.Ashlar, 0.5), ring2: mat('#8a5b4d', Surface.Stone, Stone.Ashlar, 0.3),
  pier: mat('#716d66', Surface.Stone, Stone.Ashlar, 0.55), coping: mat('#908b82', Surface.Stone, Stone.Ashlar, 0.25), road: ASPHALT, walk: WALK,
  arch: 'segment', rise: 0.2, pierT: 4.4, cut: 3.4, cutwater: 'pointed', parapet: 'solid', arches: [7], clear: 8.6, lamp: 'candelabra',
};

const stefanik: Style = {
  face: mat('#a19d93', Surface.Stone, Stone.Render, 0.25), ring: mat('#98948a', Surface.Stone, Stone.Render, 0.3), pier: mat('#8e8a80', Surface.Stone, Stone.Render, 0.35),
  coping: mat('#aaa69c', Surface.Stone, Stone.Render, 0.1), road: ASPHALT, walk: WALK, arch: 'segment', rise: 0.1, pierT: 4, cut: 2.4,
  cutwater: 'round', parapet: 'solid', arches: [3], clear: 8.8, lamp: 'post', lampEvery: 22,
};

export const legionBridge: Model = {
  id: 'legion-bridge',
  build(site, k, d) {
    k.seed = 51; d.seed = 52;
    // Over Střelecký island: one arch across its promenade.
    const A = axisOf(site, 'way/244981647');
    const isl = A.water.length >= 2 ? [A.water[A.water.length - 2][1], A.water[A.water.length - 1][0]] : [0, 0];
    archBridge(site, k, d, 'way/244981647', { ...legion, arches: A.water.map((w, i) => i === A.water.length - 1 ? 6 : w[1] - w[0] > 40 ? 3 : 0), land: isl[1] - isl[0] > 30 ? [{ at: (isl[0] + isl[1]) / 2, span: 14 }] : [] });
  },
};

export const manesBridge: Model = { id: 'manes-bridge', build(site, k, d) { k.seed = 53; d.seed = 54; archBridge(site, k, d, 'way/166823562', manes); } };
export const jirasekBridge: Model = { id: 'jiraskuv-bridge', build(site, k, d) { k.seed = 55; d.seed = 56; archBridge(site, k, d, 'relation/18257746', jirasek); } };
export const palackyBridge: Model = { id: 'palacky-bridge', build(site, k, d) { k.seed = 57; d.seed = 58; archBridge(site, k, d, 'way/476017590', palacky); } };
export const stefanikBridge: Model = { id: 'stefanik-bridge', build(site, k, d) { k.seed = 59; d.seed = 60; archBridge(site, k, d, 'way/142370517', stefanik); } };

export const cechBridge: Model = {
  id: 'cechuv-bridge',
  build(site, k, d) {
    k.seed = 61; d.seed = 62;
    const { A, deck } = archBridge(site, k, d, 'way/904148543', cech);
    // The four columns at the ends, each carrying a gilded figure.
    for (const s of [A.water[0][0] - 4, A.water[A.water.length - 1][1] + 4])
      for (const sg of [-1, 1]) {
        const [x, z] = A.at(s, sg * (A.half + 1.2));
        const y = deck(s);
        k.box(x - 0, z, 2.2, 2.2, y - 6, y + 2.2, cech.face, cech.coping);
        k.lathe(x, z, [[0.75, y + 2.2], [0.6, y + 2.8], [0.52, y + 14.5], [0.8, y + 15.2], [0.7, y + 15.6]], 12, mat('#8a8173', Surface.Stone, Stone.Ashlar, 0.35));
        d.lathe(x, z, [[0, y + 15.6], [0.45, y + 15.7], [0.35, y + 17.6], [0.2, y + 18.3], [0, y + 18.6]], 8, GOLD, { flat: true });
        d.beam([x - 0.9, y + 17.4, z], [x + 0.9, y + 17.9, z], 0.2, GOLD);
      }
  },
};

/** The Výtoň railway bridge: three truss spans on stone piers, walkways outside the trusses. */
export const railwayBridge: Model = {
  id: 'railway-bridge',
  replaces: ['way/142371357'],
  build(site, k, d) {
    k.seed = 63; d.seed = 64;
    const A = axisOf(site, 'way/1327958390');
    const wl = A.water[0]?.[2] ?? 2.8;
    const y = wl + 9.5; // top of the deck
    const [w0, w1] = A.water.length ? [A.water[0][0], A.water[A.water.length - 1][1]] : [A.s0, A.s1];
    const PIER = mat('#817a6e', Surface.Stone, Stone.Ashlar, 0.6), COP = mat('#9a9283', Surface.Stone, Stone.Ashlar, 0.3);
    const TRUSS = mat('#4a5a52', Surface.Plain);
    const H = 3.4; // the track bed's half width; walkways outside the trusses
    k.place(0, 0, 0); d.place(0, 0, 0);
    const P3 = (s: number, t: number, yy: number): V3 => { const [x, z] = A.at(s, t); return [x, yy, z]; };
    const side = (t: number): V3 => [A.P[0] * Math.sign(t), 0, A.P[1] * Math.sign(t)];
    // Supports: two abutments at the banks and two river piers.
    const n = 3, pt = 5, span = (w1 - w0 - (n - 1) * pt) / n;
    const supports: [number, number][] = [[A.s0, w0], ...Array.from({ length: n - 1 }, (_, i) => [w0 + span * (i + 1) + pt * i, w0 + span * (i + 1) + pt * (i + 1)] as [number, number]), [w1, A.s1]];
    for (const [a, b] of supports) {
      const [cx, cz] = A.at((a + b) / 2);
      const land = Number.isNaN(site.water(cx, cz));
      const base = land ? site.ground(cx, cz) - 1 : wl - 3;
      k.push().place(...P3((a + b) / 2, 0, 0), A.bearing);
      k.box(0, 0, b - a, 2 * H + 3.4, base, y - 1.8, PIER, COP);
      if (!land) for (const sg of [1, -1]) k.prism(ngon(12, pt / 2, 0, 0, sg * (H + 1.7)), base, y - 3.5, PIER, COP);
      k.pop();
    }
    // Deck and trusses over each span.
    for (let i = 0; i < n; i++) {
      const a = supports[i][1] - 1, b = supports[i + 1][0] + 1, L = b - a;
      const topAt = (s: number) => { const u = (s - a) / L; return y + 4.2 + 5.8 * Math.sin(Math.PI * u); };
      // Track bed.
      k.poly([P3(a, -H, y), P3(a, H, y), P3(b, H, y), P3(b, -H, y)], RAILS, { normal: [0, 1, 0] });
      k.poly([P3(a, -H, y - 1.6), P3(b, -H, y - 1.6), P3(b, H, y - 1.6), P3(a, H, y - 1.6)], TRUSS, { normal: [0, -1, 0] });
      for (const sg of [-1, 1]) {
        const t = sg * H;
        // Bottom chord (a deep plate girder), panel points every ~5 m, top chord curved.
        k.poly([P3(a, t, y - 1.6), P3(b, t, y - 1.6), P3(b, t, y + 0.6), P3(a, t, y + 0.6)], TRUSS, { normal: side(t) });
        k.poly([P3(a, t, y - 1.6), P3(a, t, y + 0.6), P3(b, t, y + 0.6), P3(b, t, y - 1.6)], TRUSS, { normal: side(-t) });
        const panels = Math.max(8, Math.round(L / 5.2));
        for (let q = 0; q < panels; q++) {
          const sa = a + (L * q) / panels, sb = a + (L * (q + 1)) / panels;
          k.beam(P3(sa, t, topAt(sa)), P3(sb, t, topAt(sb)), 0.7, TRUSS, false, 0.9);
          if (q > 0) k.beam(P3(sa, t, y + 0.6), P3(sa, t, topAt(sa)), 0.35, TRUSS);
          // Diagonals toward the middle, crossed near it.
          const toMid = (sa + sb) / 2 < a + L / 2;
          d.beam(P3(toMid ? sa : sb, t, topAt(toMid ? sa : sb)), P3(toMid ? sb : sa, t, y + 0.6), 0.25, TRUSS);
          if (Math.abs((sa + sb) / 2 - (a + L / 2)) < L * 0.25) d.beam(P3(toMid ? sb : sa, t, topAt(toMid ? sb : sa)), P3(toMid ? sa : sb, t, y + 0.6), 0.2, TRUSS);
        }
        // Portal and top bracing between the trusses.
        for (let q = 1; q < panels; q += 2) { const s = a + (L * q) / panels; d.beam(P3(s, -H, topAt(s)), P3(s, H, topAt(s)), 0.25, TRUSS); }
        // Walkway outside the truss, with a railing.
        const w = sg * (H + 1.9);
        k.poly([P3(a, t, y - 0.2), P3(a, w, y - 0.2), P3(b, w, y - 0.2), P3(b, t, y - 0.2)].map((p) => p), mat('#6b5f52', Surface.Plain), { normal: [0, 1, 0] });
        k.poly([P3(a, w, y - 0.6), P3(b, w, y - 0.6), P3(b, w, y + 0.9), P3(a, w, y + 0.9)], TRUSS, { normal: side(w) });
        k.poly([P3(a, w, y - 0.6), P3(a, w, y + 0.9), P3(b, w, y + 0.9), P3(b, w, y - 0.6)], TRUSS, { normal: side(-w) });
      }
      for (const s of [a + L * 0.25, a + L * 0.75]) for (const sg of [-1, 1]) { const [lx, lz] = A.at(s, sg * (H + 1.9)); d.light([lx, y + 2.2, lz]); d.lathe(lx, lz, [[0.05, y + 0.9], [0.05, y + 2.1]], 5, IRON); d.ball(lx, y + 2.2, lz, 0.14, LANTERN, 6); }
    }
    // The stone viaduct on the Vyšehrad side (OSM's way/142371357): arches on piers.
    const V = site.feature('way/142371357');
    if (V) {
      const B = axisOf(site, 'way/142371357');
      const n2 = Math.max(3, Math.round((B.s1 - B.s0) / 14));
      const step = (B.s1 - B.s0) / n2;
      k.place(0, 0, 0);
      for (let q = 0; q < n2; q++) {
        const sa = B.s0 + q * step, sb = sa + step;
        const [ax, az] = B.at(sa), [bx, bz] = B.at(sb);
        const ga = site.ground(ax, az), gb = site.ground(bx, bz);
        const yy = y;
        const pa = sa + 1.2, pb = sb - 1.2, m = (pa + pb) / 2, w = pb - pa, spring = Math.max(ga, gb) + 3, rise = Math.min(w / 2, yy - 1.5 - spring);
        const Q = (s: number, t: number, h: number): V3 => { const [x, z] = B.at(s, t); return [x, h, z]; };
        const sof = (s: number) => { if (s < pa || s > pb) return Math.min(ga, gb) - 1; const R = (w * w / 4 + rise * rise) / (2 * rise); return spring + rise - R + Math.sqrt(Math.max(0, R * R - (s - m) ** 2)); };
        const steps = 10;
        for (let r = 0; r < steps; r++) {
          const s0 = sa + (step * r) / steps, s1 = sa + (step * (r + 1)) / steps;
          for (const t of [-B.half, B.half]) k.poly([Q(s0, t, sof(s0)), Q(s1, t, sof(s1)), Q(s1, t, yy + 1), Q(s0, t, yy + 1)], PIER, { normal: [B.P[0] * Math.sign(t), 0, B.P[1] * Math.sign(t)] });
          k.poly([Q(s0, -B.half, sof(s0)), Q(s0, B.half, sof(s0)), Q(s1, B.half, sof(s1)), Q(s1, -B.half, sof(s1))], PIER, { normal: [0, -1, 0] });
          k.poly([Q(s0, -B.half, yy), Q(s0, B.half, yy), Q(s1, B.half, yy), Q(s1, -B.half, yy)], RAILS, { normal: [0, 1, 0] });
        }
      }
    }
  },
};
