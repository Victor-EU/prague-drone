// Charles Bridge (design.md §7.1): sixteen sandstone arches on fifteen piers, 515 m from the Old
// Town Bridge Tower to the Lesser Town gate, with its slight S in plan and a gentle rise to the
// middle of the river. Pointed cutwaters on both sides of every pier, the wooden ice guards
// upstream, the arch rings standing proud of the spandrels, a string course under the parapet,
// the cobbled deck, and on the parapets above the piers the thirty statues (dark silhouettes on
// their plinths) with the lamps between them.
//
// Everything is placed from OSM's outline of the bridge (way/119016167): its axis, the curve of the
// deck, and the piers, which the outline draws as the places where it widens round the cutwaters.

import { Kit, mat, type V3, type V2 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Glass } from '../../src/core/buildings.ts';

const STONE = mat('#8c8275', Surface.Stone, Stone.Ashlar, 0.6);
const RING = mat('#7d7366', Surface.Stone, Stone.Ashlar, 0.75);
const PIER = mat('#7f766a', Surface.Stone, Stone.Ashlar, 0.8);
const COPING = mat('#9a8f80', Surface.Stone, Stone.Ashlar, 0.45);
const SETTS = mat('#6e6962', Surface.Stone, Stone.Setts, 0.15);
const STATUE = mat('#3e3a36', Surface.Stone, Stone.Render, 0.2);
const PLINTH = mat('#857b6e', Surface.Stone, Stone.Ashlar, 0.7);
const WOOD = mat('#4c4034', Surface.Plain);
const IRON = mat('#2b2d2c', Surface.Plain);
const LANTERN = mat('#c9b27a', Surface.Glass, Glass.Plain);

export const HALF = 4.8; // half the width of the bridge
const PARAPET = 1.1; // above the deck
const WALL = 0.5; // parapet thickness
const PIER_T = 8.2; // pier thickness along the bridge

/** The bridge's axis: position, direction across (towards upstream, south) and deck height, by distance s along it. */
export interface Axis {
  at(s: number): { x: number; z: number; ax: number; az: number; tx: number; tz: number };
  deck(s: number): number;
  /** Pier centres, west to east, and how far each cutwater reaches beyond the deck upstream and down. */
  piers: { s: number; up: number; down: number }[];
  /** West end (the Lesser Town gate), west abutment, east abutment (the Old Town tower's face). */
  sGate: number; sWest: number; sEast: number;
  /** The Old Town tower's position along the axis. */
  sTower: number;
}

let cached: Axis | undefined;

export function bridgeAxis(site: Site): Axis {
  if (cached) return cached;
  const r = site.feature('way/119016167')!.polygons[0].outer;
  const n = r.length / 2;
  // Principal axis of the outline.
  let mx = 0, mz = 0;
  for (let i = 0; i < n; i++) { mx += r[i * 2]; mz += r[i * 2 + 1]; }
  mx /= n; mz /= n;
  let sxx = 0, sxz = 0, szz = 0;
  for (let i = 0; i < n; i++) { const dx = r[i * 2] - mx, dz = r[i * 2 + 1] - mz; sxx += dx * dx; sxz += dx * dz; szz += dz * dz; }
  const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz);
  let D: V2 = [Math.cos(ang), Math.sin(ang)];
  if (D[0] < 0) D = [-D[0], -D[1]]; // west to east
  const P: V2 = [-D[1], D[0]]; // across, towards the south (upstream)
  // The outline's extent across the axis, metre by metre along it.
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
  // The deck's centre where the outline is narrow, interpolated across the piers and smoothed.
  const narrow = keys.filter((s) => hi.get(s)! - lo.get(s)! < 12.5).map((s) => [s, (hi.get(s)! + lo.get(s)!) / 2] as V2);
  const centreRaw = (s: number) => {
    let a = narrow[0], b = narrow[narrow.length - 1];
    for (const p of narrow) { if (p[0] <= s) a = p; if (p[0] >= s) { b = p; break; } }
    return b[0] === a[0] ? a[1] : a[1] + ((b[1] - a[1]) * (s - a[0])) / (b[0] - a[0]);
  };
  const centre = (s: number) => { let t = 0; for (let k = -10; k <= 10; k++) t += centreRaw(s + k * 2); return t / 21; };
  // Piers: the runs where the outline is wide.
  const piers: { s: number; up: number; down: number }[] = [];
  let run: number[] = [];
  const flush = () => {
    if (run.length >= 5) {
      // A long run holds two piers (the outline merges them on Kampa).
      const count = Math.max(1, Math.round((run[run.length - 1] - run[0] + 1) / 30.8));
      for (let c = 0; c < count; c++) {
        const a = run[0] + ((run[run.length - 1] - run[0]) * c) / count, b = run[0] + ((run[run.length - 1] - run[0]) * (c + 1)) / count;
        const s = count === 1 ? (a + b) / 2 : c === 0 ? run[0] + 4 : run[run.length - 1] - 4;
        let up = 0, down = 0;
        for (const q of run) if (q >= a - 1 && q <= b + 1) { const tc = centre(q); up = Math.max(up, hi.get(q)! - tc - HALF); down = Math.max(down, tc - lo.get(q)! - HALF); }
        piers.push({ s, up, down });
      }
    }
    run = [];
  };
  for (const s of keys) { if (hi.get(s)! - lo.get(s)! > 13) run.push(s); else flush(); }
  flush();
  const at = (s: number) => {
    const t = centre(s), t1 = centre(s + 1), t0 = centre(s - 1);
    const x = mx + D[0] * s + P[0] * t, z = mz + D[1] * s + P[1] * t;
    // Tangent from the centreline's own slope.
    let tx = D[0] + P[0] * (t1 - t0) / 2, tz = D[1] + P[1] * (t1 - t0) / 2;
    const l = Math.hypot(tx, tz); tx /= l; tz /= l;
    return { x, z, ax: -tz, az: tx, tx, tz };
  };
  // The Old Town tower closes the east end: its footprint's centre, projected on the axis.
  const tower = site.feature('way/839278890')!.polygons[0].outer;
  let tx = 0, tz = 0;
  for (let i = 0; i < tower.length / 2; i++) { tx += tower[i * 2]; tz += tower[i * 2 + 1]; }
  tx /= tower.length / 2; tz /= tower.length / 2;
  const sTower = (tx - mx) * D[0] + (tz - mz) * D[1];
  // The last wide run is the tower itself, not a pier.
  const east = piers.filter((p) => Math.abs(p.s - sTower) < 8);
  for (const e of east) piers.splice(piers.indexOf(e), 1);
  // The west end: the gate between the Lesser Town towers (way/460016966), its east face.
  const g = site.feature('way/460016966')!.polygons[0].outer;
  let gx = 0, gz = 0;
  for (let i = 0; i < g.length / 2; i++) { gx += g[i * 2]; gz += g[i * 2 + 1]; }
  gx /= g.length / 2; gz /= g.length / 2;
  const sGate = (gx - mx) * D[0] + (gz - mz) * D[1] + 5;
  const sEast = sTower - 5.3;
  const sWest = piers[0].s - PIER_T / 2 - 17.5;
  // Deck: the ground at both ends, a rise of about four metres to the middle of the river.
  const endW = at(sGate), endE = at(sTower);
  const yW = site.bare(endW.x, endW.z), yE = site.bare(endE.x, endE.z);
  const peak = 12.6;
  const deck = (s: number) => {
    const u = Math.min(1, Math.max(0, (s - sGate) / (sTower - sGate)));
    const base = yW + (yE - yW) * u;
    const mid = (yW + yE) / 2;
    return base + (peak - mid) * Math.sin(Math.PI * u) ** 1.3;
  };
  cached = { at, deck, piers, sGate, sWest, sEast, sTower };
  return cached;
}

/**
 * A statue group as a dark silhouette: one to three robed figures, sometimes a cross or a raised
 * arm, about 3.5 m tall; `facing` is the way the figures look (towards the walkway).
 */
function statue(d: Kit, o: V3, facing: V2, k: number) {
  const [fx, fz] = facing, sx = -fz, sz = fx;
  const r = (a: number) => { const x = Math.sin(k * 12.9898 + a * 78.233) * 43758.5453; return x - Math.floor(x); };
  const h = 3.1 + 0.7 * r(1);
  const fig = (dx: number, dz: number, scale: number) => {
    const cx = o[0] + sx * dx + fx * dz, cz = o[2] + sz * dx + fz * dz, H = h * scale;
    d.lathe(cx, cz, [[0, o[1]], [0.72 * scale, o[1]], [0.62 * scale, o[1] + 0.45 * H], [0.46 * scale, o[1] + 0.74 * H], [0.36 * scale, o[1] + 0.8 * H], [0, o[1] + 0.82 * H]], 7, STATUE, { flat: true, phase: r(7) * 50 });
    d.ball(cx, o[1] + 0.89 * H, cz, 0.17 * scale, STATUE, 6);
  };
  const n = r(2) < 0.35 ? 2 : r(2) < 0.5 ? 3 : 1;
  if (n === 1) fig(0, 0, 1);
  else if (n === 2) { fig(-0.45, 0, 1); fig(0.6, -0.2, 0.75); }
  else { fig(0, -0.2, 1); fig(-0.75, 0.2, 0.7); fig(0.75, 0.2, 0.65); }
  if (r(4) < 0.3) {
    const cx = o[0] - fx * 0.5, cz = o[2] - fz * 0.5;
    d.beam([cx, o[1] + 0.5, cz], [cx, o[1] + h + 1.3, cz], 0.18, STATUE);
    d.beam([cx - sx * 0.7, o[1] + h + 0.5, cz - sz * 0.7], [cx + sx * 0.7, o[1] + h + 0.5, cz + sz * 0.7], 0.16, STATUE);
  } else if (r(5) < 0.55) {
    const side = r(6) < 0.5 ? -1 : 1;
    d.beam([o[0] + sx * side * 0.35, o[1] + h * 0.62, o[2] + sz * side * 0.35], [o[0] + sx * side * 0.75 + fx * 0.25, o[1] + h + 0.35, o[2] + sz * side * 0.75 + fz * 0.25], 0.18, STATUE);
  }
}

export const charlesBridge: Model = {
  id: 'charles-bridge',
  build(site: Site, k: Kit, d: Kit) {
    const A = bridgeAxis(site);
    k.place(0, 0, 0); d.place(0, 0, 0);
    k.ground = d.ground = 0;
    k.seed = 17; d.seed = 18;

    // Supports west to east: the west abutment, the piers, the tower's face.
    const faces: { a: number; b: number }[] = []; // spans, face to face
    let prev = A.sWest;
    for (const p of A.piers) { faces.push({ a: prev, b: p.s - PIER_T / 2 }); prev = p.s + PIER_T / 2; }
    faces.push({ a: prev, b: A.sEast });
    const water = (s: number) => {
      const c = A.at(s);
      let w = NaN;
      for (const t of [0, -3, 3, -6, 6]) { const v = site.water(c.x + c.ax * t, c.z + c.az * t); if (!Number.isNaN(v)) { w = v; break; } }
      return w;
    };
    const groundAt = (s: number) => { const c = A.at(s); return Math.min(site.ground(c.x - c.ax * 3, c.z - c.az * 3), site.ground(c.x, c.z), site.ground(c.x + c.ax * 3, c.z + c.az * 3)); };
    // Each arch: springing just above the water (or below the ground on land), as high as the deck allows.
    const arches = faces.map(({ a, b }) => {
      const m = (a + b) / 2, w = b - a;
      const wl = water(m);
      const spring = Number.isNaN(wl) ? Math.min(groundAt(a + 1), groundAt(b - 1)) - 0.8 : wl + 0.5;
      const rise = Math.min(0.5 * w, A.deck(m) - 1.5 - spring);
      const R = (w * w / 4 + rise * rise) / (2 * rise), yc = spring + rise - R;
      return { a, b, m, spring, rise, R, yc };
    });
    const archAt = (s: number) => {
      for (const h of arches) if (s >= h.a - 1e-6 && s <= h.b + 1e-6) return h.yc + Math.sqrt(Math.max(0, h.R * h.R - (s - h.m) ** 2));
      return NaN;
    };
    const foot = (s: number) => {
      const wl = water(s);
      return Number.isNaN(wl) ? groundAt(s) - 1.5 : wl - 3;
    };

    // Stations along the axis: every metre, plus every support face exactly.
    const cuts = new Set<number>();
    for (let s = Math.ceil(A.sGate); s <= Math.floor(A.sEast); s += 1) cuts.add(s);
    for (const f of faces) { cuts.add(f.a); cuts.add(f.b); }
    cuts.add(A.sGate); cuts.add(A.sEast);
    const S = [...cuts].sort((a, b) => a - b);
    const side = (s: number, t: number, y: number): V3 => { const c = A.at(s); return [c.x + c.ax * t, y, c.z + c.az * t]; };
    const inSpan = (s0: number, s1: number) => arches.find((h) => s0 >= h.a - 1e-6 && s1 <= h.b + 1e-6);

    for (let i = 0; i + 1 < S.length; i++) {
      const s0 = S[i], s1 = S[i + 1];
      const d0 = A.deck(s0), d1 = A.deck(s1);
      const span = s0 >= A.sWest ? inSpan(s0, s1) : undefined;
      const B0 = span ? archAt(s0) : foot(s0), B1 = span ? archAt(s1) : foot(s1);
      // Spandrel walls, both faces, from the arch (or the foundations) to the parapet's top.
      for (const t of [-HALF, HALF]) {
        const pts: V3[] = [side(s0, t, B0), side(s1, t, B1), side(s1, t, d1 + PARAPET), side(s0, t, d0 + PARAPET)];
        const c = A.at((s0 + s1) / 2);
        k.poly(pts, STONE, { normal: [c.ax * Math.sign(t), 0, c.az * Math.sign(t)] });
      }
      // The soffit of the arch.
      if (span) {
        const q = [side(s0, -HALF, B0), side(s0, HALF, B0), side(s1, HALF, B1), side(s1, -HALF, B1)];
        const cm = A.at(span.m);
        k.poly(q, RING, { normal: [cm.x - (q[0][0] + q[2][0]) / 2, span.yc - (B0 + B1) / 2, cm.z - (q[0][2] + q[2][2]) / 2] });
      }
      // Deck, parapets' inner faces and coping.
      k.poly([side(s0, -HALF + WALL, d0), side(s0, HALF - WALL, d0), side(s1, HALF - WALL, d1), side(s1, -HALF + WALL, d1)], SETTS, { normal: [0, 1, 0] });
      for (const t of [-HALF + WALL, HALF - WALL]) {
        const c = A.at((s0 + s1) / 2), inward = -Math.sign(t);
        k.poly([side(s0, t, d0), side(s1, t, d1), side(s1, t, d1 + PARAPET), side(s0, t, d0 + PARAPET)], STONE, { normal: [c.ax * inward, 0, c.az * inward] });
        const o = t + Math.sign(t) * WALL;
        k.poly([side(s0, t, d0 + PARAPET), side(s0, o, d0 + PARAPET), side(s1, o, d1 + PARAPET), side(s1, t, d1 + PARAPET)], COPING, { normal: [0, 1, 0] });
      }
      // String course under the parapet, standing out from both faces.
      for (const t of [-HALF, HALF]) {
        const o = t + Math.sign(t) * 0.18, c = A.at((s0 + s1) / 2), out: V3 = [c.ax * Math.sign(t), 0, c.az * Math.sign(t)];
        const y0a = d0 - 0.55, y0b = d0 - 0.2, y1a = d1 - 0.55, y1b = d1 - 0.2;
        k.poly([side(s0, o, y0a), side(s1, o, y1a), side(s1, o, y0b + (y1b - y0b)), side(s0, o, y0b)], COPING, { normal: out });
        k.poly([side(s0, t, y0b), side(s0, o, y0b), side(s1, o, y1b), side(s1, t, y1b)], COPING, { normal: [0, 1, 0] });
        k.poly([side(s0, t, y0a), side(s1, t, y1a), side(s1, o, y1a), side(s0, o, y0a)], COPING, { normal: [0, -1, 0] });
      }
      // The arch ring: a band a metre deep round the arch, standing 0.12 m proud of the face.
      if (span) {
        const ring = (s: number) => { const c = A.at(span.m); void c; const dy = archAt(s) - span.yc, ds = s - span.m, l = Math.hypot(ds, dy) || 1; return { ds: ds / l, dy: dy / l }; };
        for (const t of [-HALF, HALF]) {
          const o = t + Math.sign(t) * 0.12, c = A.at((s0 + s1) / 2), out: V3 = [c.ax * Math.sign(t), 0, c.az * Math.sign(t)];
          const r0 = ring(s0), r1 = ring(s1);
          const p0 = side(s0, o, B0), p1 = side(s1, o, B1);
          const q0 = side(s0 + r0.ds * 1.0, o, B0 + r0.dy * 1.0), q1 = side(s1 + r1.ds * 1.0, o, B1 + r1.dy * 1.0);
          k.poly([p0, p1, q1, q0], RING, { normal: out });
          // Its inner edge, facing the opening.
          k.poly([side(s0, t, B0), side(s1, t, B1), p1, p0], RING, { normal: [span.m - (s0 + s1) / 2, -1, 0].map((v, j) => j === 1 ? -1 : 0) as V3 });
        }
      }
    }
    // The jambs of every opening: the pier's (or abutment's) face below the springing.
    for (const h of arches)
      for (const [s, dir] of [[h.a, 1], [h.b, -1]] as const) {
        const c = A.at(s);
        k.poly([side(s, -HALF, foot(s)), side(s, HALF, foot(s)), side(s, HALF, h.spring), side(s, -HALF, h.spring)], PIER, { normal: [c.tx * dir, 0, c.tz * dir] });
      }
    // End walls at the Lesser Town gate (the tower closes the east end).
    {
      const s = A.sGate;
      k.poly([side(s, HALF, foot(s)), side(s, -HALF, foot(s)), side(s, -HALF, A.deck(s) + PARAPET), side(s, HALF, A.deck(s) + PARAPET)], STONE, { normal: [-A.at(s).tx, 0, -A.at(s).tz] });
    }

    // Piers. Upstream, a pointed cutwater; downstream, a square buttress; each rises to about
    // two thirds of the arches under a sloping cap, and above it a pilaster carries the statue's
    // pedestal past the parapet.
    A.piers.forEach((p, i) => {
      const c = A.at(p.s);
      const wl = water(p.s);
      const base = Number.isNaN(wl) ? groundAt(p.s) - 1.5 : wl - 3;
      const left = arches[i], right = arches[i + 1];
      const top = Math.min(left.spring + left.rise * 0.62, right.spring + right.rise * 0.62);
      const y = A.deck(p.s);
      const bearing = (Math.atan2(c.tx, -c.tz) * 180) / Math.PI;
      for (const dir of [1, -1]) {
        // In the pier's own frame: x along the bridge, z out from the face (dir > 0 upstream).
        k.push().place(...side(p.s, dir * HALF, 0), bearing + (dir > 0 ? 0 : 180));
        const L = dir > 0 ? Math.min(5.4, Math.max(3.2, p.up + 0.2)) : 3.0, W = dir > 0 ? 7.6 : 6.6;
        if (dir > 0) {
          k.prism([[-W / 2, 0], [0, L], [W / 2, 0]].map(([x, z]) => [x, z]) as V2[], base, top, PIER, null);
          // Hipped cap from the point back to the wall.
          const t: V3 = [0, top, L], a0: V3 = [-W / 2, top, 0], a1: V3 = [W / 2, top, 0], r0: V3 = [-1.8, top + 3.2, 0], r1: V3 = [1.8, top + 3.2, 0];
          k.poly([a0, t, r0], PIER, { normal: [-1, 1, 1] });
          k.poly([t, a1, r1], PIER, { normal: [1, 1, 1] });
          k.poly([t, r1, r0], PIER, { normal: [0, 1, 1] });
        } else {
          k.box(0, L / 2, W, L, base, top, PIER, null);
          const f0: V3 = [-W / 2, top, L], f1: V3 = [W / 2, top, L], b0: V3 = [-W / 2, top + 2.6, 0], b1: V3 = [W / 2, top + 2.6, 0];
          k.poly([f0, f1, b1, b0], PIER, { normal: [0, 1, 1] });
          k.poly([[-W / 2, top, 0], f0, b0], PIER, { normal: [-1, 0, 0] });
          k.poly([f1, [W / 2, top, 0], b1], PIER, { normal: [1, 0, 0] });
        }
        // The pilaster up to the parapet, and the pedestal on it.
        const pw = 3.8, pd = 1.25;
        k.box(0, pd / 2, pw, pd, top + 1.5, y + PARAPET, STONE, COPING);
        k.box(0, 0.25, pw - 1.2, 2.2, y + PARAPET, y + PARAPET + 2.3, PLINTH, null);
        k.box(0, 0.25, pw - 0.8, 2.6, y + PARAPET + 2.3, y + PARAPET + 2.65, COPING, COPING);
        k.box(0, 0.25, pw - 0.8, 2.6, y + PARAPET - 0.25, y + PARAPET + 0.1, COPING, null);
        k.pop();
        // Ice guards upstream of the river piers: wooden wedges on the water.
        if (dir > 0 && !Number.isNaN(wl) && p.up > 6.5) {
          const g0 = side(p.s - 2.4, HALF + L + 1.2, 0), g1 = side(p.s + 2.4, HALF + L + 1.2, 0), gt = side(p.s, Math.min(HALF + p.up, HALF + L + 9), 0);
          d.prism([[g0[0], g0[2]], [g1[0], g1[2]], [gt[0], gt[2]]], wl - 1, wl + 1.3, WOOD, WOOD);
        }
        const pc = side(p.s, dir * (HALF + 0.25), 0);
        statue(d, [pc[0], y + PARAPET + 2.65, pc[2]], [-c.ax * dir, -c.az * dir], i * 2 + (dir > 0 ? 1 : 0));
      }
    });

    // Lamps on the parapets, midway between the statues.
    for (const h of arches) {
      if (h.b - h.a < 10) continue;
      for (const dir of [1, -1]) {
        const pc = side(h.m, dir * (HALF - WALL / 2), 0), y = A.deck(h.m) + PARAPET;
        d.box(pc[0], pc[2], 0.3, 0.3, y, y + 0.4, IRON);
        d.lathe(pc[0], pc[2], [[0.07, y + 0.4], [0.05, y + 2.6]], 6, IRON);
        d.lathe(pc[0], pc[2], [[0.12, y + 2.55], [0.22, y + 2.7], [0.26, y + 3.2], [0.12, y + 3.3]], 6, LANTERN, { flat: true });
        d.lathe(pc[0], pc[2], [[0.3, y + 3.28], [0.08, y + 3.55], [0, y + 3.7]], 6, IRON, { flat: true });
      }
    }
  },
};
