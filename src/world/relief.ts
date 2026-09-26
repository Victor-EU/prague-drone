// The facades in relief (design.md §8.2, M14): cornices, string courses, plinths, lesenes, window
// surrounds, sills and hoods, balconies and portals, built as geometry in the tile worker for the
// buildings of one 200 m chunk of a tile, exactly where the building shader paints them (the
// grid, the storeys and every choice are the shader's, through core/buildings.ts). Nothing here
// ships: the app asks for a chunk when the camera comes within reach and drops it when it goes.

import { Style, Surface, Prop, BFlag, EFlag, SFlag, Choice, rand, trimFlags, grid } from '../core/buildings.ts';
import { Writer, Frame, course, LINEAR, hash, type MeshBuffers, type CourseEdge, type RGB, type P2 } from './mesh-writer.ts';
import type { TileArrays } from './extrude.ts';

/** The chunk's side, metres (a 1 km tile holds 10 by 10). */
export const CHUNK = 100;
/** Within this distance a chunk carries the full relief; beyond, to the range, only what a pixel can show. */
export const NEAR = 140;

const IRON: RGB = [0.025, 0.028, 0.028];
const ORN = new Set<number>([Style.Baroque, Style.OldTown, Style.Palace, Style.Block, Style.House]);
const RICH = new Set<number>([Style.Baroque, Style.OldTown, Style.Palace]);

/** Where the balconies are (the shader's praBalcony). */
function balcony(style: number, rich: boolean, portal: boolean, fl: number, col: number, n: number, nS: number, dcol: number, hb: number): boolean {
  if (style === Style.Block) return hb < 0.6 && Math.abs(col - 0.5 * (n - 1)) < 0.6 && fl > 0.5 && fl < nS - 1.5;
  return rich && portal && fl > 0.5 && fl < 1.5 && col === dcol && hb < (style === Style.Palace ? 0.8 : 0.45);
}

/** A half ring between radii r0 < r1 about (cx, cy), from angle 0 to π: an arch ring or a hood. */
function archBand(cx: number, cy: number, r0: number, r1: number, steps = 8): P2[] {
  const out: P2[] = [];
  for (let i = 0; i <= steps; i++) { const a = (i / steps) * Math.PI; out.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); }
  for (let i = steps; i >= 0; i--) { const a = (i / steps) * Math.PI; out.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]); }
  return out;
}

const mul = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** The colours of one building's relief, as the shader mixes them from the wall's colour. */
export class Palette {
  private wall: number[]; private tone: number; private vb: number; private top: number; private trimK: number;
  constructor(wall: number[], tone: number, vb: number, top: number, trimK: number) {
    this.wall = wall; this.tone = tone; this.vb = vb; this.top = top; this.trimK = trimK;
  }
  /** The wall's colour at height v above the ground, linear: darker toward the foot, as the tiles' vertices are. */
  wall_(v: number): RGB {
    const t = this.top > this.vb ? Math.min(1, Math.max(0, (v - this.vb) / (this.top - this.vb))) : 1;
    const s = this.tone * (0.8 + 0.2 * t);
    return [LINEAR[Math.min(255, Math.round(this.wall[0] * s))] / 255, LINEAR[Math.min(255, Math.round(this.wall[1] * s))] / 255, LINEAR[Math.min(255, Math.round(this.wall[2] * s))] / 255];
  }
  trim(v: number): RGB {
    const c = this.wall_(v);
    if (this.trimK & SFlag.TrimDeep) return [c[0] * 0.8, c[1] * 0.44, c[2] * 0.34];
    if (this.trimK & SFlag.TrimPale) return mix(c, [0.86, 0.82, 0.72], 0.75);
    return mul(c, 1.08);
  }
  cornice(v: number): RGB { return mul(mix(this.wall_(v), this.trim(v), 0.85), 1.12); }
  string(v: number): RGB { return mul(mix(this.wall_(v), this.trim(v), 0.7), 0.82); }
  stone(v: number, rich: boolean): RGB { return rich ? mix(this.trim(v), [0.6, 0.58, 0.53], 0.5) : mul(this.trim(v), 1.05); }
}

interface Bay { x: number; z: number; dx: number; dz: number; w: number; d: number }

interface WallOpts {
  /** Only the windows between these heights above the ground: a wall standing on a lower part (a part's base), a bay's front. */
  vMin?: number; vMax?: number;
  /** No portal, lesenes or plinth (a bay's front); an arcade takes the ground floor. */
  bare?: boolean; arcade?: boolean;
  /** Window columns hidden behind a bay. */
  skip?: Set<number>;
  /** The far level: no surrounds, keystones or balusters, which are under a pixel beyond 140 m; the sills, hoods, cornices and balconies' slabs cast the shadows that show. */
  far?: boolean;
}

/**
 * The relief of one wall: the frame's origin at the wall's foot (u = 0) on the ground reference,
 * `L` long under an eave `top` above it.
 */
function wall(fr: Frame, pal: Palette, L: number, top: number, style: number, seed: number, o: WallOpts) {
  const rich = RICH.has(style);
  const { n, span, nS, sh, A } = grid(L, top, style);
  const vMin = o.vMin ?? -Infinity;
  if (!o.bare && style !== Style.House && L > 5 && top > 3 && top - 0.5 > Math.max(0.9, vMin) + 1) {
    // Lesenes: strips of the trim up the ends of the front, from the plinth to the cornice.
    const c = pal.trim(top * 0.5), v0 = Math.max(0.9, vMin);
    fr.box(0, 0.55, v0, top - 0.5, 0, 0.05, c, { top: false, bottom: false });
    fr.box(L - 0.55, L, v0, top - 0.5, 0, 0.05, c, { top: false, bottom: false });
  }
  if (n < 1 || top <= 2.5) return;
  const hd = rand(seed, Choice.Portal + Math.round(L * 10)), hb = rand(seed, Choice.Balcony);
  const archK = rand(seed, Choice.Arch), hk = rand(seed, Choice.Hood);
  const portal = !o.bare && top > 3 && hd < 0.9 && span > 1.9 && vMin < 0.5;
  const dcol = rich && n >= 3 ? Math.floor(n * 0.5) : Math.floor((hd / 0.9) * n);
  const W = A.winW, sw = rich ? 0.17 : 0.12;
  for (let fl = 0; fl < nS; fl++) {
    const gf = fl === 0;
    if (gf && o.arcade) continue;
    const vf = fl * sh;
    if (vf + 0.5 < vMin) continue;
    if (o.vMax !== undefined && vf + sh - 0.5 > o.vMax) continue;
    const shop = gf && A.ground > 0.5;
    const y0 = gf ? 0.3 * sh : A.sill, y1 = gf ? Math.min(0.88 * sh, 0.3 * sh + A.winH) : Math.min(A.sill + A.winH, 0.9 * sh);
    for (let col = 0; col < n; col++) {
      if (fl >= 1 && o.skip?.has(col)) continue;
      const cu = 0.4 + (col + 0.5) * span;
      const door = portal && gf && col === dcol;
      const balc = balcony(style, rich, portal, fl, col, n, nS, dcol, hb);
      const arch = rich && gf && A.ground < 0.5 && !door && archK < 0.65;
      const ys = arch ? y1 - 0.5 * W : y1;
      if (door) {
        // The portal: jambs and a round head with its keystone, or a lintel under a cornice.
        const Wd = Math.min(rich ? 1.7 : 1.3, span - 0.7), Hd = Math.min(sh - 0.7, rich ? 3.1 : 2.6);
        const roundTop = style === Style.Baroque || style === Style.Palace ? hd < 0.6 : hd < 0.25;
        const ps = rich ? 0.3 : 0.18;
        const yS = roundTop ? Hd - 0.5 * Wd : Hd - 0.5;
        const stone = pal.stone(Hd * 0.5, rich), key = mul(stone, 1.12);
        const jambTop = roundTop ? yS : Hd;
        fr.box(cu - 0.5 * Wd - ps, cu - 0.5 * Wd, 0, jambTop, 0, 0.12, stone, { bottom: false, top: false });
        fr.box(cu + 0.5 * Wd, cu + 0.5 * Wd + ps, 0, jambTop, 0, 0.12, stone, { bottom: false, top: false });
        if (roundTop) {
          fr.slab(archBand(cu, yS, 0.5 * Wd, 0.5 * Wd + ps), 0, 0.12, stone);
          if (!o.far) fr.box(cu - 0.13, cu + 0.13, Hd - 0.08, Hd + ps + 0.1, 0, 0.16, key);
        } else {
          fr.box(cu - 0.5 * Wd - ps, cu + 0.5 * Wd + ps, Hd, Hd + ps, 0, 0.12, stone, { bottom: false });
          if (rich) fr.box(cu - 0.5 * Wd - ps - 0.15, cu + 0.5 * Wd + ps + 0.15, Hd + ps, Hd + ps + 0.17, 0, 0.2, key);
        }
        continue;
      }
      if (!shop) {
        const trim = pal.trim(vf + 0.5 * (y0 + y1));
        // The surround: jambs, and a head straight or following the arch.
        if (!o.far) {
          fr.box(cu - 0.5 * W - sw, cu - 0.5 * W, vf + y0 - sw, vf + ys, 0, 0.07, trim, { bottom: false, top: false });
          fr.box(cu + 0.5 * W, cu + 0.5 * W + sw, vf + y0 - sw, vf + ys, 0, 0.07, trim, { bottom: false, top: false });
          if (arch) fr.slab(archBand(cu, vf + ys, 0.5 * W, 0.5 * W + sw), 0, 0.07, trim);
          else fr.box(cu - 0.5 * W - sw, cu + 0.5 * W + sw, vf + y1, vf + y1 + sw, 0, 0.07, trim, { bottom: false });
        }
        // The sill, a ledge with its shadow under it.
        if (!balc) fr.box(cu - 0.5 * W - sw - 0.06, cu + 0.5 * W + sw + 0.06, vf + y0 - sw - 0.07, vf + y0 - sw + 0.01, 0, 0.14, mul(trim, 1.15), { bottom: o.far ? false : undefined });
        // The hood: over the first-floor windows of the rich fronts, segmental, triangular or
        // straight by building; straight over the blocks' upper windows but the top row.
        if (((rich && fl === 1) || (style === Style.Block && fl >= 1 && fl < nS - 1)) && !balc) {
          const yt = vf + y1 + sw + 0.05, hwH = 0.5 * W + sw + 0.1;
          const hood = mul(trim, 1.12);
          const kind = style === Style.Block || hk < 0.34 ? 0 : hk < 0.67 ? 1 : 2;
          if (kind === 0) fr.box(cu - hwH, cu + hwH, yt, yt + 0.14, 0, 0.22, hood);
          else if (kind === 2) fr.slab([[cu - hwH, yt], [cu + hwH, yt], [cu + hwH, yt + 0.14], [cu, yt + 0.48], [cu - hwH, yt + 0.14]], 0, 0.2, hood);
          else {
            const shape: P2[] = [[cu - hwH, yt], [cu + hwH, yt], [cu + hwH, yt + 0.14]];
            for (let i = 1; i < 6; i++) { const xx = 1 - (2 * i) / 6; shape.push([cu + xx * hwH, yt + 0.14 + 0.26 * Math.sqrt(1 - xx * xx)]); }
            shape.push([cu - hwH, yt + 0.14]);
            fr.slab(shape, 0, 0.2, hood);
          }
        }
      }
      if (balc) {
        // A slab on two consoles with an iron railing of balusters.
        const yb = vf + 0.12, bw = 0.5 * W + 0.45;
        const trim = pal.trim(yb);
        fr.box(cu - bw, cu + bw, yb - 0.16, yb, 0, 0.95, mul(trim, 1.15));
        for (const s of [-1, 1]) fr.box(cu + s * (bw - 0.3) - 0.08, cu + s * (bw - 0.3) + 0.08, yb - 0.5, yb - 0.16, 0, 0.55, mul(trim, 0.92), { top: false });
        fr.box(cu - bw, cu + bw, yb + 0.9, yb + 0.95, 0.88, 0.94, IRON, { bottom: false });
        if (o.far) continue;
        fr.box(cu - bw, cu + bw, yb + 0.03, yb + 0.07, 0.88, 0.94, IRON, { bottom: false });
        for (const s of [-1, 1]) fr.box(cu + s * bw - (s < 0 ? 0 : 0.05), cu + s * bw + (s < 0 ? 0.05 : 0), yb + 0.9, yb + 0.95, 0.05, 0.9, IRON, { bottom: false });
        const k = Math.max(3, Math.round((2 * bw) / 0.16));
        for (let i = 0; i < k; i++) {
          const x = cu - bw + ((i + 0.5) / k) * 2 * bw;
          fr.box(x - 0.015, x + 0.015, yb + 0.07, yb + 0.9, 0.895, 0.925, IRON, { top: false, bottom: false });
        }
      }
    }
  }
}

/** A solid of revolution round (cx, cz) from a profile of (radius, y), flat-shaded facets. */
function lathe(W: Writer, cx: number, cz: number, prof: [number, number][], sides: number, c: RGB, gnd: number, seed: number, phase = 0) {
  const fac = (p: [number, number, number]): [number, number, number, number] => [0, 0, p[1] - gnd, 0];
  for (let j = 0; j + 1 < prof.length; j++) {
    const [r0, y0] = prof[j], [r1, y1] = prof[j + 1];
    for (let i = 0; i < sides; i++) {
      const a0 = phase + (i / sides) * Math.PI * 2, a1 = phase + ((i + 1) / sides) * Math.PI * 2, am = (a0 + a1) / 2;
      const P = (r: number, y: number, a: number): [number, number, number] => [cx + r * Math.cos(a), y, cz + r * Math.sin(a)];
      const dr = r1 - r0, dy = y1 - y0, l = Math.hypot(dr, dy) || 1;
      const n: [number, number, number] = [Math.cos(am) * (dy / l), -dr / l, Math.sin(am) * (dy / l)];
      const pts: [number, number, number][] = r0 > 1e-4 ? [P(r0, y0, a0), P(r0, y0, a1)] : [P(0, y0, am)];
      if (r1 > 1e-4) pts.push(P(r1, y1, a1), P(r1, y1, a0)); else pts.push(P(0, y1, am));
      W.face(pts, n, c, fac, Surface.Trim, 0, 0, seed);
    }
  }
}

/**
 * The relief of the buildings of one chunk (ci, cj of a `tile`-metre tile, in chunks of CHUNK) of
 * the tile's arrays, in the tile's frame; `seed` is the tile's, as `extrude` had it. `far` builds
 * the far level (see WallOpts). The attic figures and urns (props) are built here too, being small.
 */
export function relief(f: TileArrays, seed: number, ci: number, cj: number, tile: number, far = false): MeshBuffers {
  const W = new Writer(4096, 8192);
  const count = f.ring.length - 1;
  const x0 = -tile / 2 + ci * CHUNK, z0 = -tile / 2 + cj * CHUNK;
  // The bays, by building, to keep the wall's windows out from behind them and to dress their fronts.
  const bays = new Map<number, Bay[]>();
  for (let p = 0; p < f.pt.length; p++) {
    if (f.pt[p] !== Prop.Bay) continue;
    const ang = (f.pa[p] / 256) * Math.PI * 2;
    const list = bays.get(f.pb[p]) ?? bays.set(f.pb[p], []).get(f.pb[p])!;
    list.push({ x: f.pp[p * 6] / 10, z: f.pp[p * 6 + 1] / 10, dx: Math.cos(ang), dz: Math.sin(ang), w: f.pp[p * 6 + 4] / 100, d: f.pp[p * 6 + 5] / 100 });
  }

  const inChunk = (x: number, z: number) => x >= x0 && x < x0 + CHUNK && z >= z0 && z < z0 + CHUNK;
  for (let p = 0; p < f.pt.length; p++) {
    if (f.pt[p] !== Prop.Figure && f.pt[p] !== Prop.Urn) continue;
    const x = f.pp[p * 6] / 10, z = f.pp[p * 6 + 1] / 10;
    if (!inChunk(x, z)) continue;
    const b = f.pb[p], y0 = f.pp[p * 6 + 2] / 10, H = f.pp[p * 6 + 4] / 100, gnd = f.gnd[b] / 10;
    const bseed = Math.floor(hash(b * 7919 + seed * 104729) * 256), tone = 0.94 + hash(b * 7919 + seed) * 0.1;
    const wallC = [f.wall[b * 3], f.wall[b * 3 + 1], f.wall[b * 3 + 2]];
    const pal = new Palette(wallC, tone, f.base[b] / 10 - gnd, f.eave[b] / 10 - gnd, trimFlags(bseed, wallC));
    const stone = mul(pal.trim(y0 - gnd), 1.1);
    if (f.pt[p] === Prop.Figure) lathe(W, x, z, [[0.35, y0], [0.35, y0 + 0.25], [0.26, y0 + 0.25], [0.24, y0 + 0.3 * H], [0.19, y0 + 0.55 * H], [0.16, y0 + 0.72 * H], [0.07, y0 + 0.78 * H], [0.09 * H, y0 + 0.83 * H], [0.085 * H, y0 + 0.92 * H], [0, y0 + 0.98 * H]], far ? 5 : 7, stone, gnd, bseed, (f.pa[p] / 256) * Math.PI * 2);
    else lathe(W, x, z, [[0.24, y0], [0.24, y0 + 0.08], [0.12, y0 + 0.1], [0.24, y0 + 0.28 * H], [0.28, y0 + 0.45 * H], [0.18, y0 + 0.7 * H], [0.24, y0 + 0.8 * H], [0.05, y0 + 0.92 * H], [0, y0 + H]], far ? 5 : 7, stone, gnd, bseed);
  }

  for (let b = 0; b < count; b++) {
    if (f.kind[b] > 1 || (f.flags[b] & BFlag.Landmark) || !ORN.has(f.style[b])) continue;
    const r0 = f.ring[b], r1 = f.ring[b + 1];
    const v0 = f.vert[r0], nFoot = f.vert[r1] - v0;
    if (nFoot < 3) continue;
    let cx = 0, cz = 0;
    for (let k = f.vert[r0]; k < f.vert[r0 + 1]; k++) { cx += f.xy[k * 2] / 10; cz += f.xy[k * 2 + 1] / 10; }
    const nO = f.vert[r0 + 1] - f.vert[r0];
    cx /= nO; cz /= nO;
    if (!inChunk(cx, cz)) continue;
    const base = f.base[b] / 10, top = f.top[b] / 10, eave = f.eave[b] / 10, gnd = f.gnd[b] / 10;
    if (top - base < 0.5) continue;
    const eaveRel = eave - gnd;
    if (eaveRel <= 2.5) continue;
    const style = f.style[b];
    const bseed = Math.floor(hash(b * 7919 + seed * 104729) * 256);
    const tone = 0.94 + hash(b * 7919 + seed) * 0.1;
    const wallC = [f.wall[b * 3], f.wall[b * 3 + 1], f.wall[b * 3 + 2]];
    const trimK = trimFlags(bseed, wallC);
    const pal = new Palette(wallC, tone, base - gnd, eaveRel, trimK);
    const fr = new Frame(W, [0, gnd, 0], [1, 0, 0], [0, 0, 1], gnd, Surface.Trim, style, trimK, bseed);
    const { nS, sh } = grid(20, eaveRel, style);
    const myBays = bays.get(b) ?? [];

    for (let r = r0; r < r1; r++) {
      const s = f.vert[r], e = f.vert[r + 1], m = e - s;
      if (m < 3) continue;
      let area = 0;
      for (let i = 0; i < m; i++) {
        const j = (i + 1) % m;
        area += f.xy[(s + i) * 2] * f.xy[(s + j) * 2 + 1] - f.xy[(s + j) * 2] * f.xy[(s + i) * 2 + 1];
      }
      const outward = (r > r0 ? -1 : 1) * Math.sign(area || 1);
      const edges: (CourseEdge & { len: number; party: boolean; arcade: boolean; n: number; ux: number; uz: number })[] = [];
      for (let i = 0; i < m; i++) {
        const j = (i + 1) % m;
        const ax = f.xy[(s + i) * 2] / 10, az = f.xy[(s + i) * 2 + 1] / 10;
        const bx = f.xy[(s + j) * 2] / 10, bz = f.xy[(s + j) * 2 + 1] / 10;
        const len = Math.hypot(bx - ax, bz - az);
        const party = (f.edge[s + i] & EFlag.Party) !== 0, arcade = (f.edge[s + i] & EFlag.Arcade) !== 0 && !party && eaveRel > 5.5;
        const ux = len > 1e-3 ? (bx - ax) / len : 1, uz = len > 1e-3 ? (bz - az) / len : 0;
        edges.push({ x: ax, z: az, nx: outward * uz, nz: -outward * ux, on: !party && len >= 0.5, len, party, arcade, n: grid(len, eaveRel, style).n, ux, uz });
      }
      // The mouldings round the ring: the cornice under the eave, the string course over the
      // ground floor where there are windows, the plinth at the foot.
      if (eaveRel > 3) {
        course(fr, edges, [[0, -0.5], [0.12, -0.5], [0.12, -0.32], [0.3, -0.18], [0.3, -0.1], [0.45, -0.04], [0.45, 0], [0, 0]], gnd + eaveRel, pal.cornice(eaveRel), gnd);
        const vb = base - gnd;
        if (vb > -1.5 && vb < 0.6) course(fr, edges.map((e) => ({ ...e, on: e.on && !e.arcade })), [[0, vb - 0.9], [0.06, vb - 0.9], [0.06, -0.1], [0, 0]], gnd + 0.9, mul(pal.wall_(0.45), 0.8), gnd);
      }
      if (nS >= 2 && sh > base - gnd + 0.3) course(fr, edges.map((e) => ({ ...e, on: e.on && e.n >= 1 })), [[0, -0.14], [0.12, -0.14], [0.12, -0.06], [0, 0]], gnd + sh, pal.string(sh), gnd);
      for (const e of edges) {
        if (e.party || e.len < 2.5) continue;
        // Window columns behind a bay on this wall.
        let skip: Set<number> | undefined;
        for (const bay of myBays) {
          const dx = bay.x - e.x, dz = bay.z - e.z, u = dx * e.ux + dz * e.uz, d = Math.abs(dx * e.nx + dz * e.nz);
          if (d > 0.5 || u < 0 || u > e.len || bay.dx * e.nx + bay.dz * e.nz < 0.9) continue;
          const g = grid(e.len, eaveRel, style);
          if (g.n >= 1) (skip ??= new Set()).add(Math.floor((u - 0.4) / g.span));
        }
        fr.at([e.x, gnd, e.z], [e.ux, 0, e.uz], [e.nx, 0, e.nz]);
        // A part standing on a lower one (OSM's stacked parts) has relief from its own base up.
        wall(fr, pal, e.len, eaveRel, style, bseed, { arcade: e.arcade, skip, far, vMin: base - gnd > 0.5 ? base - gnd : undefined });
      }
    }
    // The bays' fronts: the same windows, between the bay's floor and its roof.
    for (const bay of myBays) {
      const ux = -bay.dz, uz = bay.dx;
      fr.at([bay.x + bay.dx * bay.d - ux * bay.w / 2, gnd, bay.z + bay.dz * bay.d - uz * bay.w / 2], [ux, 0, uz], [bay.dx, 0, bay.dz]);
      wall(fr, pal, bay.w, eaveRel, style, bseed, { bare: true, far, vMin: sh - 0.1, vMax: eaveRel - 0.5 });
    }
  }
  return W.finish();
}

