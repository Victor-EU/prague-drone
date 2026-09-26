// The river beyond its surface (design.md §8.5): which way the water flows at every point, the
// weirs (the level steps down at each one, under a band of foam), and the stone embankment walls
// that the water meets instead of a beach. Build side only.

import type { Ring, Polygon, OsmElement } from './osm.ts';
import { lineOf } from './osm.ts';
import type { Grid } from './raster.ts';
import { Kit, mat, arch, type V3, type V2 } from '../landmarks/kit.ts';
import { Surface, Stone, Glass } from '../../src/core/buildings.ts';

/** The 5 m node grids of the world build: water mask, water surface per node, the DEM before carving. */
export interface RiverGrids {
  water: Uint8Array;
  level: Float32Array;
  bare: Grid<Float32Array>;
}

const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---- Flow ---------------------------------------------------------------------------------------

/** The downstream direction anywhere on the water, from the OSM centrelines (drawn downstream). */
export class Flow {
  private segs: number[] = [];
  private cells = new Map<number, number[]>();
  private static G = 100;

  constructor(lines: Ring[]) {
    for (const l of lines)
      for (let k = 0; k + 3 < l.length; k += 2) {
        const id = this.segs.length / 4;
        this.segs.push(l[k], l[k + 1], l[k + 2], l[k + 3]);
        const G = Flow.G;
        for (let gx = Math.floor(Math.min(l[k], l[k + 2]) / G); gx <= Math.floor(Math.max(l[k], l[k + 2]) / G); gx++)
          for (let gz = Math.floor(Math.min(l[k + 1], l[k + 3]) / G); gz <= Math.floor(Math.max(l[k + 1], l[k + 3]) / G); gz++) {
            const key = (gx + 500) * 1000 + gz + 500;
            (this.cells.get(key) ?? this.cells.set(key, []).get(key)!).push(id);
          }
      }
  }

  /** Unit downstream direction at (x, z): nearby centrelines weighted by nearness. */
  at(x: number, z: number): [number, number] {
    const G = Flow.G, gx = Math.floor(x / G), gz = Math.floor(z / G);
    let best = Infinity;
    const found: { d: number; dx: number; dz: number }[] = [];
    for (let r = 0; r <= 6; r++) {
      for (let i = gx - r; i <= gx + r; i++)
        for (let j = gz - r; j <= gz + r; j++) {
          if (Math.max(Math.abs(i - gx), Math.abs(j - gz)) !== r) continue;
          for (const id of this.cells.get((i + 500) * 1000 + j + 500) ?? []) {
            const ax = this.segs[id * 4], az = this.segs[id * 4 + 1], bx = this.segs[id * 4 + 2], bz = this.segs[id * 4 + 3];
            const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1e-9;
            const t = Math.min(1, Math.max(0, ((x - ax) * ex + (z - az) * ez) / l2));
            const d = Math.hypot(ax + ex * t - x, az + ez * t - z), l = Math.sqrt(l2);
            found.push({ d, dx: ex / l, dz: ez / l });
            best = Math.min(best, d);
          }
        }
      if (best < (r - 1) * G) break;
    }
    let sx = 0, sz = 0;
    for (const f of found) {
      if (f.d > best + 40) continue;
      const w = 1 / (f.d - best + 8);
      sx += f.dx * w; sz += f.dz * w;
    }
    const l = Math.hypot(sx, sz);
    return l > 1e-6 ? [sx / l, sz / l] : [0, -1];
  }
}

/** Centrelines of the river, its side channels and canals. */
export function flowLines(els: OsmElement[]): Ring[] {
  return els.filter((e) => e.type === 'way' && /^(river|canal|stream)$/.test(e.tags?.waterway ?? '')).map(lineOf);
}

// ---- Weirs ----------------------------------------------------------------------------------------

export interface Weir {
  key: string;
  /** The crest as a polyline, resampled every 2 m. */
  pts: [number, number][];
  /** Unit normals pointing downstream, per point. */
  down: [number, number][];
  /** Water surface above and below. */
  upper: number; lower: number;
  length: number;
}

/** Nearest point on a polyline: distance along it (unclamped beyond the ends), distance from it, side (+1 left of its direction). */
function project(line: [number, number][], x: number, z: number) {
  let best = { d: Infinity, t: 0, s: 1 }, acc = 0;
  for (let k = 0; k + 1 < line.length; k++) {
    const [ax, az] = line[k], [bx, bz] = line[k + 1];
    const ex = bx - ax, ez = bz - az, l = Math.hypot(ex, ez) || 1e-9;
    let u = ((x - ax) * ex + (z - az) * ez) / l;
    const lo = k === 0 ? -Infinity : 0, hi = k === line.length - 2 ? Infinity : l;
    u = Math.min(hi, Math.max(lo, u));
    const cu = Math.min(l, Math.max(0, u));
    const d = Math.hypot(ax + (ex * cu) / l - x, az + (ez * cu) / l - z);
    if (d < best.d) best = { d, t: acc + u, s: Math.sign(ex * (z - az) - ez * (x - ax)) || 1 };
    acc += l;
  }
  return best;
}

/**
 * The weirs of the world (OSM waterway=weir). At each one the water surface each side is made
 * level up to the crest, so the step falls exactly there, under the foam.
 */
export function weirs(els: OsmElement[], g: RiverGrids, flow: Flow, inside: (x: number, z: number) => boolean): Weir[] {
  const { bare } = g, NX = bare.nx, NZ = bare.nz, C = bare.cell;
  interface Found { key: string; line: [number, number][]; length: number; near: { k: number; d: number; s: number }[]; a: number; b: number; downSide: number; group: number }
  const found: Found[] = [];
  const median = (a: number[]) => { const b = a.slice().sort((p, q) => p - q); return b.length ? b[b.length >> 1] : NaN; };
  for (const el of els) {
    if (el.type !== 'way' || el.tags?.waterway !== 'weir') continue;
    const raw = lineOf(el);
    const line: [number, number][] = [];
    for (let k = 0; k < raw.length; k += 2) {
      const p: [number, number] = [raw[k], raw[k + 1]];
      if (!line.length || Math.hypot(p[0] - line[line.length - 1][0], p[1] - line[line.length - 1][1]) > 0.5) line.push(p);
    }
    if (line.length < 2 || !line.every(([x, z]) => inside(x, z))) continue;
    let length = 0;
    for (let k = 0; k + 1 < line.length; k++) length += Math.hypot(line[k + 1][0] - line[k][0], line[k + 1][1] - line[k][1]);
    if (length < 15) continue;
    // Water nodes near the crest, by side.
    const xs = line.map((p) => p[0]), zs = line.map((p) => p[1]);
    const i0 = Math.max(0, Math.floor((Math.min(...xs) - 90 - bare.x0) / C)), i1 = Math.min(NX - 1, Math.ceil((Math.max(...xs) + 90 - bare.x0) / C));
    const j0 = Math.max(0, Math.floor((Math.min(...zs) - 90 - bare.z0) / C)), j1 = Math.min(NZ - 1, Math.ceil((Math.max(...zs) + 90 - bare.z0) / C));
    const near: Found['near'] = [];
    const sides: Record<number, number[]> = { 1: [], [-1]: [] };
    for (let j = j0; j <= j1; j++)
      for (let i = i0; i <= i1; i++) {
        const k = j * NX + i;
        if (!g.water[k] || Number.isNaN(g.level[k])) continue;
        const p = project(line, bare.x0 + i * C, bare.z0 + j * C);
        if (p.t < -3 || p.t > length + 3 || p.d > 85) continue;
        near.push({ k, d: p.d, s: p.s });
        if (p.d > 30) sides[p.s].push(g.level[k]);
      }
    let a = median(sides[1]), b = median(sides[-1]);
    if (Number.isNaN(a)) a = b;
    if (Number.isNaN(b)) b = a;
    if (Number.isNaN(a)) continue;
    // The downstream side: the lower one, or the way the river flows if they are nearly equal.
    const [ax, az] = line[0], [bx, bz] = line[line.length - 1], el0 = Math.hypot(bx - ax, bz - az) || 1;
    const left: [number, number] = [-(bz - az) / el0, (bx - ax) / el0];
    let downSide = a < b ? 1 : -1;
    if (Math.abs(a - b) < 0.25) {
      const f = flow.at((ax + bx) / 2, (az + bz) / 2);
      downSide = f[0] * left[0] + f[1] * left[1] > 0 ? 1 : -1;
    }
    found.push({ key: `way/${el.id}`, line, length, near, a, b, downSide, group: found.length });
  }
  // Pieces of one weir (OSM draws some in two, either side of a lock) share their levels.
  const close = (p: Found, q: Found) => p.line.some(([x, z]) => q.line.some(([u, w]) => Math.hypot(x - u, z - w) < 60));
  for (let changed = true; changed; ) {
    changed = false;
    for (const p of found) for (const q of found) if (p.group !== q.group && close(p, q)) { const gid = Math.min(p.group, q.group); if (p.group !== gid || q.group !== gid) { p.group = q.group = gid; changed = true; } }
  }
  const out: Weir[] = [];
  for (const f of found) {
    const members = found.filter((q) => q.group === f.group);
    const total = members.reduce((s, q) => s + q.length, 0);
    const upper = members.reduce((s, q) => s + Math.max(q.a, q.b) * q.length, 0) / total;
    let lower = members.reduce((s, q) => s + Math.min(q.a, q.b) * q.length, 0) / total;
    if (upper - lower < 0.25) lower = upper - 0.6;
    for (const n of f.near) {
      const target = n.s === f.downSide ? lower : upper;
      const w = 1 - smooth(35, 60, n.d);
      g.level[n.k] += (target - g.level[n.k]) * w;
    }
    // Resample every 2 m, with downstream normals.
    const { line, length } = f;
    const pts: [number, number][] = [], down: [number, number][] = [];
    const steps = Math.max(2, Math.ceil(length / 2));
    const at = (t: number): [number, number] => {
      let acc = 0;
      for (let k = 0; k + 1 < line.length; k++) {
        const l = Math.hypot(line[k + 1][0] - line[k][0], line[k + 1][1] - line[k][1]);
        if (t <= acc + l || k === line.length - 2) { const u = (t - acc) / (l || 1); return [line[k][0] + (line[k + 1][0] - line[k][0]) * u, line[k][1] + (line[k + 1][1] - line[k][1]) * u]; }
        acc += l;
      }
      return line[line.length - 1];
    };
    for (let q = 0; q <= steps; q++) pts.push(at((length * q) / steps));
    for (let q = 0; q <= steps; q++) {
      const p = pts[Math.max(0, q - 2)], r = pts[Math.min(steps, q + 2)];
      const tx = r[0] - p[0], tz = r[1] - p[1], l = Math.hypot(tx, tz) || 1;
      down.push([(-tz / l) * f.downSide, (tx / l) * f.downSide]);
    }
    out.push({ key: f.key, pts, down, upper, lower, length });
  }
  return out;
}

/** Offsets across a weir (metres downstream of the crest) that its strip spans, and the band the water mesh leaves to it. */
const ACROSS = [-17, -11, -7, -4, -2, -1, 0, 1, 2.5, 4, 5.5, 7, 8, 9.5, 12, 15, 18.5, 23];
export const WEIR_HOLE: [number, number] = [-8, 13];

/** True where a point falls in a weir's band, which the weir's own strip covers. */
export function inWeirBand(ws: Weir[], x: number, z: number): boolean {
  for (const w of ws) {
    const p = project(w.pts, x, z);
    if (p.t < 0 || p.t > w.length) continue;
    // Signed distance downstream: the side the normals point to.
    const q = w.pts[Math.min(w.pts.length - 1, Math.round((p.t / w.length) * (w.pts.length - 1)))], n = w.down[Math.min(w.down.length - 1, Math.round((p.t / w.length) * (w.down.length - 1)))];
    const v = (x - q[0]) * n[0] + (z - q[1]) * n[1];
    if (v >= WEIR_HOLE[0] && v <= WEIR_HOLE[1]) return true;
  }
  return false;
}

/**
 * A weir's water as a strip: level water above, a hump over the crest, the glacis down to the
 * lower level, the white roller at its foot and the foam trailing away. Appends to the water
 * mesh: position, downstream direction, foam (0–255).
 */
export function weirStrip(w: Weir, pos: number[], flow: number[], foam: number[], bank: number[], idx: number[]) {
  const drop = w.upper - w.lower;
  const height = (v: number) =>
    v <= -2 ? w.upper : v <= 0 ? w.upper + 0.1 * smooth(-2, -1, v) : v <= 8 ? w.lower + drop * (1 - smooth(0, 8, v)) + 0.1 * (1 - smooth(0, 1, v)) : w.lower;
  // Glassy over the crest, whitening down the glacis, the roller at its foot, streaks trailing off.
  const foamAt = (v: number) =>
    v < -2 ? 0 : v < 0 ? 0.15 * smooth(-2, 0, v) : v < 6.5 ? 0.15 + 0.4 * smooth(0, 6.5, v) : v < 8.5 ? 0.95 : 0.95 - 0.95 * smooth(8.5, 15, v);
  const first = pos.length / 3, cols = ACROSS.length;
  w.pts.forEach(([x, z], q) => {
    const [nx, nz] = w.down[q];
    for (const v of ACROSS) {
      pos.push(x + nx * v, height(v) + 0.04, z + nz * v);
      flow.push(Math.round(nx * 127), Math.round(nz * 127));
      foam.push(Math.round(foamAt(v) * 255));
      bank.push(30);
    }
  });
  for (let q = 0; q + 1 < w.pts.length; q++)
    for (let c = 0; c + 1 < cols; c++) {
      const a = first + q * cols + c, b = a + 1, d = a + cols, e = d + 1;
      idx.push(a, d, b, b, d, e);
    }
}

/**
 * Metres from every water node to the nearest land node (a chamfer distance over the grid): the
 * fetch the wind's ripples have, so the water lies glassy under the walls and roughens out in the
 * stream (design.md §8.5, M13). Land nodes are 0.
 */
export function bankDistance(water: Uint8Array, nx: number, nz: number, cell: number): Float32Array {
  const d = new Float32Array(nx * nz);
  for (let k = 0; k < d.length; k++) d[k] = water[k] ? 1e9 : 0;
  const o = cell, q = cell * Math.SQRT2;
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const k = j * nx + i;
    if (i > 0) d[k] = Math.min(d[k], d[k - 1] + o);
    if (j > 0) { d[k] = Math.min(d[k], d[k - nx] + o); if (i > 0) d[k] = Math.min(d[k], d[k - nx - 1] + q); if (i < nx - 1) d[k] = Math.min(d[k], d[k - nx + 1] + q); }
  }
  for (let j = nz - 1; j >= 0; j--) for (let i = nx - 1; i >= 0; i--) {
    const k = j * nx + i;
    if (i < nx - 1) d[k] = Math.min(d[k], d[k + 1] + o);
    if (j < nz - 1) { d[k] = Math.min(d[k], d[k + nx] + o); if (i < nx - 1) d[k] = Math.min(d[k], d[k + nx + 1] + q); if (i > 0) d[k] = Math.min(d[k], d[k + nx - 1] + q); }
  }
  return d;
}

// ---- Embankment walls ------------------------------------------------------------------------

// Changed in M13 (8683, 8825, 9486): the walls are the dark grey-brown of the photographs' quays,
// not the pale sand they were.
const FACE = mat('#585249', Surface.Stone, Stone.Ashlar, 0.7);
const COPING = mat('#7d7669', Surface.Stone, Stone.Ashlar, 0.3);
const WALK = mat('#7c776f', Surface.Stone, Stone.Setts, 0.1);
const STEP = mat('#767069', Surface.Stone, Stone.Ashlar, 0.4);
// The Náplavka's vaults (M13): along the Rašín embankment the wall opens in round arches every
// ten metres or so, the old ice cellars glazed as cafés; dark openings at the drone's distance.
const VAULT = mat('#2b2e31', Surface.Glass, Glass.Plain);
const NAPLAVKA = { x0: 95, x1: 235, z0: 1040, z1: 1560 };
/** The quays' stairs down to the water (M13): a flight every 150 m or so of wall in the core. */
const STAIR_EVERY = 30;
const CORE = (x: number, z: number) => Math.abs(x) < 700 && z > -900 && z < 1900;

/** How far into the water the face stands (the terrain grid's slope stays behind it), and the walk behind the parapet. */
const OUT = 2, BACK = 3.5, PARAPET = 0.9, THICK = 0.5;

/**
 * Stone walls along the river's edges where the bank stands more than a metre above the water:
 * a face from below the water to the bank, a parapet, and the paved walk behind it, wide enough to
 * cover the slope the 5 m terrain grid makes there.
 */
export function embankments(polys: Polygon[], g: RiverGrids, k: Kit, seen: (x: number, z: number) => boolean, canal: (x: number, z: number) => boolean = () => false): number {
  const { bare } = g, C = bare.cell;
  const node = (x: number, z: number) => {
    const i = Math.round((x - bare.x0) / C), j = Math.round((z - bare.z0) / C);
    return i >= 0 && j >= 0 && i < bare.nx && j < bare.nz ? j * bare.nx + i : -1;
  };
  const isWater = (x: number, z: number) => { const n = node(x, z); return n >= 0 && g.water[n] === 1; };
  let metres = 0;
  k.place(0, 0, 0);
  k.seed = 41;
  for (const p of polys)
    for (const raw of [p.outer, ...p.holes]) {
      // The Čertovka's outline has steps of a metre or two in it, which the walls followed and
      // stood across the canal as blocks (9204, M11): its rings are simplified first.
      let wet = 0;
      for (let i = 0; i < raw.length; i += 2) if (canal(raw[i], raw[i + 1])) wet++;
      const ring = wet * 4 > raw.length ? simplify(raw, 1.6) : raw;
      // Points at most 5 m apart round the ring.
      const pts: [number, number][] = [];
      const n = ring.length / 2;
      for (let i = 0; i < n; i++) {
        const ax = ring[i * 2], az = ring[i * 2 + 1], bx = ring[((i + 1) % n) * 2], bz = ring[((i + 1) % n) * 2 + 1];
        const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 5));
        for (let s = 0; s < steps; s++) pts.push([ax + ((bx - ax) * s) / steps, az + ((bz - az) * s) / steps]);
      }
      const m = pts.length;
      if (m < 3) continue;
      // Per point: the normal toward the land, the water level, the bank's height; or invalid.
      const info = pts.map(([x, z], i) => {
        const [px, pz] = pts[(i + m - 1) % m], [qx, qz] = pts[(i + 1) % m];
        const tx = qx - px, tz = qz - pz, l = Math.hypot(tx, tz) || 1;
        let nx = -tz / l, nz = tx / l;
        const aLand = !isWater(x + nx * 4, z + nz * 4), bLand = !isWater(x - nx * 4, z - nz * 4);
        if (aLand === bLand || !seen(x, z)) return null;
        if (!aLand) { nx = -nx; nz = -nz; }
        const wn = node(x - nx * 4, z - nz * 4);
        const L = wn >= 0 ? g.level[wn] : NaN;
        if (Number.isNaN(L)) return null;
        const B = Math.max(bare.sample(x + nx * 3, z + nz * 3), bare.sample(x + nx * 5.5, z + nz * 5.5));
        if (B - L < 0.9) return null;
        return { x, z, nx, nz, L, B, c: canal(x, z) };
      });
      // Walls along each run of valid points, the bank's height smoothed along it.
      let start = info.findIndex((q) => q === null);
      if (start < 0) start = 0;
      const order = Array.from({ length: m + 1 }, (_, i) => (start + i) % m);
      let run: NonNullable<(typeof info)[number]>[] = [];
      const flush = () => {
        if (run.length >= 2) {
          const B = run.map((_, i) => { let s = 0, c = 0; for (let d = -2; d <= 2; d++) { const q = run[i + d]; if (q) { s += q.B; c++; } } return s / c; });
          // The Čertovka's walls end in a slope down to the water, not a cut end standing as a
          // block in the bank (9204, M11).
          for (const i of [0, run.length - 1]) if (run[i].c) B[i] = Math.min(B[i], run[i].L + 0.3);
          for (let i = 0; i + 1 < run.length; i++) (run[i].c && run[i + 1].c ? canalPiece : wallPiece)(k, run[i], run[i + 1], B[i], B[i + 1], i);
          for (let i = 0; i + 1 < run.length; i++) metres += Math.hypot(run[i + 1].x - run[i].x, run[i + 1].z - run[i].z);
          // Stairs down to the water, every so often along the photographed quays.
          for (let i = STAIR_EVERY >> 1; i + 2 < run.length; i += STAIR_EVERY)
            if (!run[i].c && CORE(run[i].x, run[i].z) && B[i] - run[i].L > 2 && B[i] - run[i].L < 6.5) stairPiece(k, run[i], run[i + 1], B[i]);
        }
        run = [];
      };
      for (const i of order) { const q = info[i]; if (q) run.push(q); else flush(); }
      flush();
    }
  return metres;
}

/** A closed ring (flat x, z) with every vertex dropped that lies within `tol` of the line its kept neighbours make (Douglas–Peucker). */
function simplify(r: Ring, tol: number): Ring {
  const n = r.length / 2;
  if (n < 5) return r;
  const keep = new Uint8Array(n);
  // Split the loop at vertex 0 and the vertex farthest from it.
  let far = 0, best = -1;
  for (let i = 1; i < n; i++) { const d = Math.hypot(r[i * 2] - r[0], r[i * 2 + 1] - r[1]); if (d > best) { best = d; far = i; } }
  keep[0] = keep[far] = 1;
  const stack: [number, number][] = [[0, far], [far, n]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const ax = r[a * 2], az = r[a * 2 + 1], bx = r[(b % n) * 2], bz = r[(b % n) * 2 + 1];
    const dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz) || 1;
    let m = -1, dm = tol;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((r[i * 2] - ax) * dz - (r[i * 2 + 1] - az) * dx) / L;
      if (d > dm) { dm = d; m = i; }
    }
    if (m >= 0) { keep[m] = 1; stack.push([a, m], [m, b]); }
  }
  const out: number[] = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(r[i * 2], r[i * 2 + 1]);
  return out;
}

interface Edge { x: number; z: number; nx: number; nz: number; L: number }

// The Čertovka (9204, M10): old rubble walls dark with damp and moss at the water's edge, no
// parapet and no walk; the bank above is dark ground under the bushes the world build puts there.
const CANAL_FACE = mat('#4a4a3e', Surface.Stone, Stone.Rubble, 0.9);
const CANAL_TOP = mat('#2e3327', Surface.Plain);
const CANAL_OUT = 0.4;

function canalPiece(k: Kit, a: Edge, b: Edge, Ba: number, Bb: number) {
  const P = (e: Edge, d: number, y: number): V3 => [e.x + e.nx * d, y, e.z + e.nz * d];
  const out: V3 = [-(a.nx + b.nx) / 2, 0, -(a.nz + b.nz) / 2];
  k.ground = (a.L + b.L) / 2;
  const lo = Math.min(a.L, b.L) - 1.2;
  k.poly([P(a, -CANAL_OUT, lo), P(b, -CANAL_OUT, lo), P(b, -CANAL_OUT, Bb + 0.2), P(a, -CANAL_OUT, Ba + 0.2)], CANAL_FACE, { normal: out });
  k.ground = (Ba + Bb) / 2;
  k.poly([P(a, -CANAL_OUT, Ba + 0.2), P(b, -CANAL_OUT, Bb + 0.2), P(b, BACK, Bb), P(a, BACK, Ba)], CANAL_TOP, { normal: [0, 1, 0] });
}

function wallPiece(k: Kit, a: Edge, b: Edge, Ba: number, Bb: number, i = 0) {
  const P = (e: Edge, d: number, y: number): V3 => [e.x + e.nx * d, y, e.z + e.nz * d];
  const out: V3 = [-(a.nx + b.nx) / 2, 0, -(a.nz + b.nz) / 2], land: V3 = [-out[0], 0, -out[2]];
  const lo = Math.min(a.L, b.L) - 1.2;
  // The Náplavka's vaults, on the wall facing the river, every other piece.
  const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
  if (i % 2 === 1 && out[0] < -0.5 && mx > NAPLAVKA.x0 && mx < NAPLAVKA.x1 && mz > NAPLAVKA.z0 && mz < NAPLAVKA.z1 && Math.min(Ba, Bb) - Math.max(a.L, b.L) > 4.2) {
    const tx = b.x - a.x, tz = b.z - a.z, tl = Math.hypot(tx, tz) || 1;
    let u: V3 = [tx / tl, 0, tz / tl];
    if (-u[2] * out[0] + u[0] * out[2] < 0) u = [-u[0], 0, -u[2]];
    k.plate([mx + out[0] * OUT, Math.max(a.L, b.L) + 0.45, mz + out[2] * OUT], u, [0, 1, 0], arch(3.0, 3.3, 'round'), VAULT, 0.05);
  }
  // The stone's grime band sits at the waterline.
  k.ground = (a.L + b.L) / 2;
  k.poly([P(a, -OUT, lo), P(b, -OUT, lo), P(b, -OUT, Bb + PARAPET), P(a, -OUT, Ba + PARAPET)], FACE, { normal: out });
  k.poly([P(a, -OUT, Ba + PARAPET), P(b, -OUT, Bb + PARAPET), P(b, -OUT + THICK, Bb + PARAPET), P(a, -OUT + THICK, Ba + PARAPET)], COPING, { normal: [0, 1, 0] });
  k.ground = (Ba + Bb) / 2;
  k.poly([P(a, -OUT + THICK, Ba), P(a, -OUT + THICK, Ba + PARAPET), P(b, -OUT + THICK, Bb + PARAPET), P(b, -OUT + THICK, Bb)], COPING, { normal: land });
  k.poly([P(a, -OUT + THICK, Ba), P(b, -OUT + THICK, Bb), P(b, BACK, Bb), P(a, BACK, Ba)], WALK, { normal: [0, 1, 0] });
}

/** A flight of stone steps down the wall's face to the water, running along the wall from `a` toward `b`. */
function stairPiece(k: Kit, a: Edge, b: Edge, B: number) {
  const tx = b.x - a.x, tz = b.z - a.z, tl = Math.hypot(tx, tz) || 1;
  const t: V2 = [tx / tl, tz / tl], out: V2 = [-a.nx, -a.nz];
  const drop = B - a.L + 0.35, n = Math.max(4, Math.round(drop / 0.17)), riser = drop / n, tread = 0.36, W = 1.7;
  k.ground = a.L;
  const at = (s: number, o: number): V2 => [a.x + t[0] * s + out[0] * (OUT + o), a.z + t[1] * s + out[1] * (OUT + o)];
  for (let q = 0; q < n; q++) {
    const s0 = q * tread, s1 = (n + 1) * tread + 0.6, top = B - q * riser;
    k.prism([at(s0, 0), at(s1, 0), at(s1, W), at(s0, W)], a.L - 0.8, top, STEP, STEP);
  }
}

// ---- The weirs' walkways --------------------------------------------------------------------

const TIMBER = mat('#4a423a', Surface.Plain);
const PLANK = mat('#5b5349', Surface.Plain);

/**
 * The timber walkway along a weir's crest (8825; M13): a row of piles on its downstream side and a
 * lower row upstream, a plank deck between them a little above the upper water. Piles in the
 * detail kit, the deck in the main one.
 */
export function weirWalk(w: { pts: [number, number][]; down: [number, number][]; upper: number; lower: number }, k: Kit, d: Kit, land: (x: number, z: number) => boolean = () => true) {
  k.place(0, 0, 0); d.place(0, 0, 0);
  k.ground = d.ground = w.upper;
  // The walkway runs on past the crest's mapped ends to the banks (8825 stands at its start).
  const pts = w.pts.slice(), down = w.down.slice();
  for (const end of [0, 1]) {
    const i = end ? pts.length - 1 : 0, j = end ? pts.length - 2 : 1;
    const dx = pts[i][0] - pts[j][0], dz = pts[i][1] - pts[j][1], l = Math.hypot(dx, dz) || 1;
    let [x, z] = pts[i];
    for (let step = 0; step < 25; step++) {
      x += (dx / l) * 2; z += (dz / l) * 2;
      if (land(x, z)) break;
      if (end) { pts.push([x, z]); down.push(down[down.length - 1]); } else { pts.unshift([x, z]); down.unshift(down[0]); }
    }
  }
  const deck = w.upper + 0.95, n = pts.length;
  const P = (q: number, v: number, y: number): V3 => [pts[q][0] + down[q][0] * v, y, pts[q][1] + down[q][1] * v];
  for (let q = 0; q < n; q++) {
    const [x, z] = pts[q], [nx, nz] = down[q];
    const sh = 0.9 + 0.2 * (((q * 7919) % 13) / 13);
    // Downstream piles, their heads above the deck; upstream piles, lower.
    // Downstream, a pair of piles with their heads well above the deck; upstream, a lower row.
    for (const v of [1.15, 1.7]) d.lathe(x + nx * v, z + nz * v, [[0.24, w.lower - 0.6], [0.24, deck + 1.05], [0.15, deck + 1.15], [0, deck + 1.15]], 6, TIMBER, { flat: true, shade: sh });
    d.lathe(x - nx * 1.0, z - nz * 1.0, [[0.2, w.lower - 0.6], [0.2, deck + 0.15], [0, deck + 0.15]], 6, TIMBER, { flat: true, shade: sh * 0.95 });
    if (q + 1 < n) {
      // The deck between: top, and the two edges down to the bearers.
      k.poly([P(q, -1.05, deck), P(q + 1, -1.05, deck), P(q + 1, 1.0, deck), P(q, 1.0, deck)], PLANK, { normal: [0, 1, 0], shade: sh });
      k.poly([P(q, 1.0, deck), P(q + 1, 1.0, deck), P(q + 1, 1.0, deck - 0.18), P(q, 1.0, deck - 0.18)], TIMBER, { normal: [nx, 0, nz] });
      k.poly([P(q, -1.05, deck), P(q, -1.05, deck - 0.18), P(q + 1, -1.05, deck - 0.18), P(q + 1, -1.05, deck)], TIMBER, { normal: [-nx, 0, -nz] });
      // A bearer across under the deck, and a beam tying the pile heads along the downstream side.
      d.beam(P(q, -1.05, deck - 0.25), P(q, 1.8, deck - 0.25), 0.16, TIMBER);
      d.beam(P(q, 1.42, deck + 0.85), P(q + 1, 1.42, deck + 0.85), 0.14, TIMBER);
    }
  }
}
