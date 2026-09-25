// A small modelling kit for the hand-built landmarks (design.md §7.1): triangles with the vertex
// layout of the building tiles (position, normal, colour, facade coordinates, surface info), so
// the landmarks share the building shader (src/world/building-material.ts). Models are written in
// a local frame (origin and heading) and come out in world coordinates. Build side only.

import { ShapeUtils, Vector2 } from 'three';
import { Surface, Face } from '../../src/core/buildings.ts';
import { roofModel, meshRoof, type RoofSpec } from '../lib/roofs.ts';

export type V2 = [number, number];
export type V3 = [number, number, number];
export type F4 = [number, number, number, number];

/** A surface: sRGB colour, the shader's kind and style, a weathering amount for stone, flags. */
export interface Mat { c: [number, number, number]; kind: number; style: number; w: number; flags: number }

export function mat(colour: string, kind: number, style = 0, w = 0, flags = 0): Mat {
  const c = [1, 3, 5].map((i) => parseInt(colour.slice(i, i + 2), 16)) as [number, number, number];
  return { c, kind, style, w, flags };
}
/** The same surface a little lighter or darker. */
export function shade(m: Mat, k: number): Mat {
  return { ...m, c: m.c.map((v) => Math.min(255, v * k)) as [number, number, number] };
}

const LINEAR = new Uint8Array(256).map((_, i) => {
  const c = i / 255;
  return Math.round(255 * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
});

export interface MeshBuffers {
  position: Float32Array; normal: Int8Array; color: Uint8Array; facade: Float32Array; info: Uint8Array; index: Uint32Array;
}

/** Local frame: origin, and the unit vector (a, b) in world x–z that local +x points along. */
interface Frame { x: number; y: number; z: number; a: number; b: number }

const DEG = Math.PI / 180;
const sub = (p: V3, q: V3): V3 => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const cross = (p: V3, q: V3): V3 => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const dot = (p: V3, q: V3) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const norm = (p: V3): V3 => { const l = Math.hypot(p[0], p[1], p[2]) || 1; return [p[0] / l, p[1] / l, p[2] / l]; };

/** A regular polygon of n corners around (cx, cz), the first at angle `phase` degrees from +x. */
export function ngon(n: number, r: number, phase = 0, cx = 0, cz = 0): V2[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (phase + (360 * i) / n) * DEG;
    return [cx + r * Math.cos(a), cz + r * Math.sin(a)] as V2;
  });
}
/** A rectangle w along x by d along z, centred on (cx, cz). */
export function rect(w: number, d: number, cx = 0, cz = 0): V2[] {
  return [[cx - w / 2, cz - d / 2], [cx + w / 2, cz - d / 2], [cx + w / 2, cz + d / 2], [cx - w / 2, cz + d / 2]];
}
/** A ring grown (or shrunk, d < 0) by d along its edge normals; corners mitred. */
export function offsetRing(r: V2[], d: number): V2[] {
  const n = r.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += r[i][0] * r[j][1] - r[j][0] * r[i][1]; }
  const s = Math.sign(area) || 1;
  const normal = (i: number): V2 => {
    const j = (i + 1) % n, dx = r[j][0] - r[i][0], dz = r[j][1] - r[i][1], l = Math.hypot(dx, dz) || 1;
    return [(s * dz) / l, (-s * dx) / l];
  };
  return r.map((p, i) => {
    const n0 = normal((i + n - 1) % n), n1 = normal(i);
    const mx = n0[0] + n1[0], mz = n0[1] + n1[1], ml = Math.hypot(mx, mz) || 1;
    const k = d / Math.max(0.3, (mx / ml) * n1[0] + (mz / ml) * n1[1]);
    return [p[0] + (mx / ml) * k, p[1] + (mz / ml) * k];
  });
}

/** The in-plane axis across a wall that faces (nx, nz), running to the right as seen from outside. */
export const across = (nx: number, nz: number): V3 => [nz, 0, -nx];

/**
 * The smallest rectangle round a world ring (flat x, z list), along one of its edges: centre,
 * length `w` along compass bearing `bearing` (degrees), depth `d` across.
 */
export function orientedRect(r: number[]): { cx: number; cz: number; w: number; d: number; bearing: number } {
  const n = r.length / 2;
  let best = { area: Infinity, cx: 0, cz: 0, w: 0, d: 0, bearing: 0 };
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, ex = r[j * 2] - r[i * 2], ez = r[j * 2 + 1] - r[i * 2 + 1], l = Math.hypot(ex, ez);
    if (l < 0.5) continue;
    const ux = ex / l, uz = ez / l;
    let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (let k = 0; k < n; k++) {
      const a = r[k * 2] * ux + r[k * 2 + 1] * uz, b = -r[k * 2] * uz + r[k * 2 + 1] * ux;
      a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b);
    }
    const area = (a1 - a0) * (b1 - b0);
    if (area < best.area - 1e-6) {
      const am = (a0 + a1) / 2, bm = (b0 + b1) / 2;
      best = { area, cx: am * ux - bm * uz, cz: am * uz + bm * ux, w: a1 - a0, d: b1 - b0, bearing: (Math.atan2(ux, -uz) * 180) / Math.PI };
    }
  }
  return { cx: best.cx, cz: best.cz, w: best.w, d: best.d, bearing: best.bearing };
}

/** Centre of a world ring's vertices. */
export function centreOf(r: number[]): [number, number] {
  let x = 0, z = 0;
  const n = r.length / 2;
  for (let i = 0; i < n; i++) { x += r[i * 2]; z += r[i * 2 + 1]; }
  return [x / n, z / n];
}

/**
 * An opening's outline in its wall plane, centred on u = 0, from v = 0 up to v = h: straight
 * jambs, then a pointed (Gothic), round or segmental head of the given rise.
 */
export function arch(w: number, h: number, kind: 'pointed' | 'round' | 'flat' | 'segment' = 'round', rise = kind === 'round' ? w / 2 : kind === 'pointed' ? w * 0.75 : w * 0.2, steps = 8): V2[] {
  const hw = w / 2, spring = h - (kind === 'flat' ? 0 : rise);
  const pts: V2[] = [[-hw, 0], [hw, 0], [hw, spring]];
  if (kind === 'round') {
    for (let i = 1; i < steps; i++) { const a = (i / steps) * Math.PI; pts.push([hw * Math.cos(a), spring + rise * Math.sin(a)]); }
  } else if (kind === 'pointed') {
    // Two arcs meet at the apex, each centred on the springing line at c beyond the middle, on
    // the far side: R = hw + c reaches the near jamb, and R² − c² = rise² puts the apex at h.
    const c = Math.max(0, (rise * rise - hw * hw) / (2 * hw)), R = hw + c, top = Math.acos(Math.min(1, c / R));
    const half = Math.max(2, steps >> 1);
    for (let i = 1; i < half; i++) { const a = (top * i) / half; pts.push([-c + R * Math.cos(a), spring + R * Math.sin(a)]); }
    pts.push([0, h]);
    for (let i = half - 1; i >= 1; i--) { const a = (top * i) / half; pts.push([c - R * Math.cos(a), spring + R * Math.sin(a)]); }
  } else if (kind === 'segment') {
    const R = (hw * hw + rise * rise) / (2 * rise), cy = spring + rise - R, a0 = Math.asin(hw / R);
    for (let i = 1; i < steps; i++) { const a = -a0 + (2 * a0 * i) / steps; pts.push([R * Math.sin(-a), cy + R * Math.cos(a)]); }
  }
  pts.push([-hw, spring]);
  return pts;
}

export interface PolyOptions {
  /** Facade coordinates per world vertex; by default derived from the surface's orientation. */
  fac?: (w: V3, n: V3) => F4;
  /** Holes, local, in the plane of the polygon. */
  holes?: V3[][];
  /** Brightness factor for the vertex colour. */
  shade?: number;
  /** A known outward normal (local), instead of the one the winding gives. */
  normal?: V3;
  /** Lowest height (world) for up-the-slope coordinates; default the polygon's own. */
  base?: number;
}

export class Kit {
  pos: number[] = []; nor: number[] = []; col: number[] = []; fac: number[] = []; inf: number[] = []; idx: number[] = [];
  /** Per-part random byte the shader varies tones with. */
  seed = 0;
  /** World height facade heights are measured from. */
  ground = 0;
  /** Flag bits added to every vertex (src/core/buildings.ts SFlag): floodlit at night. */
  flagsOr = 0;
  /** Lamps for the night (src/world/lights.ts): world x, y, z and kind, per lamp. */
  lights: number[] = [];
  private f: Frame = { x: 0, y: 0, z: 0, a: 1, b: 0 };
  private stack: Frame[] = [];

  get vertices() { return this.pos.length / 3; }
  get triangles() { return this.idx.length / 3; }

  // ---- Frames --------------------------------------------------------------------------------

  push() { this.stack.push({ ...this.f }); return this; }
  pop() { this.f = this.stack.pop()!; return this; }
  /** Moves the origin to local (x, y, z) and turns the axes clockwise (seen from above) by `deg`. */
  at(x: number, y: number, z: number, deg = 0) {
    const w = this.world([x, y, z]);
    const t = deg * DEG, { a, b } = this.f;
    this.f = { x: w[0], y: w[1], z: w[2], a: a * Math.cos(t) - b * Math.sin(t), b: a * Math.sin(t) + b * Math.cos(t) };
    return this;
  }
  /** Places the origin at world (x, y, z) with local +x along the compass bearing `deg`. */
  place(x: number, y: number, z: number, bearing = 90) {
    const t = bearing * DEG;
    this.f = { x, y, z, a: Math.sin(t), b: -Math.cos(t) };
    return this;
  }
  world(p: V3): V3 {
    const { x, y, z, a, b } = this.f;
    return [x + p[0] * a - p[2] * b, y + p[1], z + p[0] * b + p[2] * a];
  }
  dir(n: V3): V3 {
    const { a, b } = this.f;
    return [n[0] * a - n[2] * b, n[1], n[0] * b + n[2] * a];
  }
  /** World to local, for positions measured in the world. */
  local(x: number, y: number, z: number): V3 {
    const { a, b } = this.f;
    const dx = x - this.f.x, dz = z - this.f.z;
    return [dx * a + dz * b, y - this.f.y, -dx * b + dz * a];
  }

  // ---- Vertices and faces --------------------------------------------------------------------

  /** One vertex, world position and normal. */
  vertW(w: V3, n: V3, m: Mat, f: F4, k = 1): number {
    const v = this.pos.length / 3;
    this.pos.push(w[0], w[1], w[2]);
    this.nor.push(Math.round(n[0] * 127), Math.round(n[1] * 127), Math.round(n[2] * 127));
    this.col.push(LINEAR[Math.min(255, Math.round(m.c[0] * k))], LINEAR[Math.min(255, Math.round(m.c[1] * k))], LINEAR[Math.min(255, Math.round(m.c[2] * k))]);
    this.fac.push(f[0], f[1], f[2], f[3]);
    this.inf.push(m.kind, m.style, m.flags | this.flagsOr, this.seed & 255);
    return v;
  }
  tri(a: number, b: number, c: number) { this.idx.push(a, b, c); }
  /** A lamp at a local point, lit at night; `kind` 0 a street lantern, 1 a floodlight's glow. */
  light(p: V3, kind = 0) { const w = this.world(p); this.lights.push(w[0], w[1], w[2], kind); }

  /** Facade coordinates from a surface's orientation: see Surface, Stone and Metal. */
  autoFac(m: Mat, w: V3, n: V3, ymin: number, ymax: number): F4 {
    const hl = Math.hypot(n[0], n[2]);
    if (Math.abs(n[1]) > 0.97 || hl < 1e-3) return [w[0], w[2], m.w, 0];
    const tx = -n[2] / hl, tz = n[0] / hl;
    const u = w[0] * tx + w[2] * tz;
    if (Math.abs(n[1]) < 0.3 && m.kind !== Surface.Metal && m.kind !== Surface.Roof) return [u, w[1] - this.ground, m.w, 0];
    const sin = Math.sqrt(Math.max(1e-4, 1 - n[1] * n[1]));
    return [u, (w[1] - ymin) / sin, (ymax - ymin) / sin, m.kind === Surface.Stone ? m.w : 0];
  }

  /** A planar polygon, local corners in order; the side it faces follows the winding (counter-clockwise seen from the front). */
  poly(pts: V3[], m: Mat, o: PolyOptions = {}): void {
    if (pts.length < 3) return;
    const all = o.holes ? pts.concat(...o.holes) : pts;
    const W = all.map((p) => this.world(p));
    const nW = W.slice(0, pts.length);
    // Newell's normal of the outer ring.
    let n: V3 = [0, 0, 0];
    for (let i = 0; i < nW.length; i++) {
      const p = nW[i], q = nW[(i + 1) % nW.length];
      n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]);
    }
    if (Math.hypot(n[0], n[1], n[2]) < 1e-9) return;
    n = norm(n);
    if (o.normal) { const want = this.dir(o.normal); if (dot(want, n) < 0) n = [-n[0], -n[1], -n[2]]; }
    // Project onto the plane's dominant axes to triangulate.
    const ax = Math.abs(n[0]) > Math.abs(n[1]) ? (Math.abs(n[0]) > Math.abs(n[2]) ? 0 : 2) : Math.abs(n[1]) > Math.abs(n[2]) ? 1 : 2;
    const [i0, i1] = ax === 0 ? [1, 2] : ax === 1 ? [2, 0] : [0, 1];
    const to2 = (p: V3) => new Vector2(p[i0], p[i1]);
    let tris: number[][];
    if (pts.length === 3 && !o.holes) tris = [[0, 1, 2]];
    else if (pts.length === 4 && !o.holes) tris = [[0, 1, 2], [0, 2, 3]];
    else {
      const holes2 = (o.holes ?? []).map((h) => h.map((p) => to2(this.world(p))));
      tris = ShapeUtils.triangulateShape(nW.map(to2), holes2);
    }
    let ymin = Infinity, ymax = -Infinity;
    for (const p of W) { ymin = Math.min(ymin, p[1]); ymax = Math.max(ymax, p[1]); }
    if (o.base !== undefined) ymin = o.base;
    const first = this.pos.length / 3;
    for (const p of W) this.vertW(p, n, m, o.fac ? o.fac(p, n) : this.autoFac(m, p, n, ymin, ymax), o.shade ?? 1);
    for (const [a, b, c] of tris) {
      const A = W[a], B = W[b], C = W[c];
      const t = cross(sub(B, A), sub(C, A));
      if (dot(t, n) >= 0) this.tri(first + a, first + b, first + c); else this.tri(first + a, first + c, first + b);
    }
  }
  quad(a: V3, b: V3, c: V3, d: V3, m: Mat, o: PolyOptions = {}) { this.poly([a, b, c, d], m, o); }

  // ---- Solids ----------------------------------------------------------------------------------

  /**
   * An upright prism over a local ring from y0 to y1: walls facing out (or in), an optional cap. With
   * `windows`, the walls carry the tiles' window coordinates (Surface.Wall: along, length, height
   * above `ground`, eave height).
   */
  prism(ring: V2[], y0: number, y1: number, wall: Mat | null, cap: Mat | null = null, o: { bottom?: Mat; windows?: boolean; eave?: number; inward?: boolean } = {}) {
    const n = ring.length;
    let area = 0;
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += ring[i][0] * ring[j][1] - ring[j][0] * ring[i][1]; }
    // Walls face away from the ring's inside, or into it for a courtyard (`inward`).
    const s = (Math.sign(area) || 1) * (o.inward ? -1 : 1);
    if (wall) for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, [ax, az] = ring[i], [bx, bz] = ring[j], len = Math.hypot(bx - ax, bz - az);
      if (len < 1e-4) continue;
      const nrm: V3 = [(s * (bz - az)) / len, 0, (-s * (bx - ax)) / len];
      if (o.windows) {
        const w0 = this.world([ax, y0, az]), eave = (o.eave ?? this.f.y + y1) - this.ground;
        const fac = (w: V3): F4 => [Math.hypot(w[0] - w0[0], w[2] - w0[2]), len, w[1] - this.ground, eave];
        this.poly([[ax, y0, az], [bx, y0, bz], [bx, y1, bz], [ax, y1, az]], wall, { normal: nrm, fac });
      } else this.poly([[ax, y0, az], [bx, y0, bz], [bx, y1, bz], [ax, y1, az]], wall, { normal: nrm });
    }
    if (cap) this.poly(ring.map(([x, z]) => [x, y1, z] as V3), cap, { normal: [0, 1, 0] });
    if (o.bottom) this.poly(ring.map(([x, z]) => [x, y0, z] as V3), o.bottom, { normal: [0, -1, 0] });
  }
  /** An axis-aligned box in the local frame: centre (cx, cz), sizes w (x) and d (z), from y0 to y1. */
  box(cx: number, cz: number, w: number, d: number, y0: number, y1: number, wall: Mat, cap: Mat | null = wall, bottom?: Mat) {
    this.prism(rect(w, d, cx, cz), y0, y1, wall, cap, { bottom });
  }
  /** Sides between two rings of equal count (a tapered or battered prism), facing out. */
  loft(r0: V2[], y0: number, r1: V2[], y1: number, m: Mat, cap: Mat | null = null) {
    const n = r0.length;
    let area = 0;
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += r0[i][0] * r0[j][1] - r0[j][0] * r0[i][1]; }
    const s = Math.sign(area) || 1;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const dx = r0[j][0] - r0[i][0], dz = r0[j][1] - r0[i][1], l = Math.hypot(dx, dz) || 1;
      const out: V3 = [(s * dz) / l, 0, (-s * dx) / l];
      const pts: V3[] = [[r0[i][0], y0, r0[i][1]], [r0[j][0], y0, r0[j][1]], [r1[j][0], y1, r1[j][1]], [r1[i][0], y1, r1[i][1]]];
      if (Math.hypot(r1[j][0] - r1[i][0], r1[j][1] - r1[i][1]) < 1e-4) this.poly([pts[0], pts[1], pts[2]], m, { normal: out, base: this.f.y + Math.min(y0, y1) });
      else this.poly(pts, m, { normal: out, base: this.f.y + Math.min(y0, y1) });
    }
    if (cap) this.poly(r1.map(([x, z]) => [x, y1, z] as V3), cap, { normal: [0, 1, 0] });
  }
  /** A pyramid (or spire) over a ring from y0 to an apex at height y1 above the ring's centre. */
  pyramid(ring: V2[], y0: number, y1: number, m: Mat, apex?: V2) {
    const c = apex ?? [ring.reduce((a, p) => a + p[0], 0) / ring.length, ring.reduce((a, p) => a + p[1], 0) / ring.length];
    const n = ring.length;
    let area = 0;
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += ring[i][0] * ring[j][1] - ring[j][0] * ring[i][1]; }
    const s = Math.sign(area) || 1;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const dx = ring[j][0] - ring[i][0], dz = ring[j][1] - ring[i][1], l = Math.hypot(dx, dz) || 1;
      this.poly([[ring[i][0], y0, ring[i][1]], [ring[j][0], y0, ring[j][1]], [c[0], y1, c[1]]], m, { normal: [(s * dz) / l, 0.3, (-s * dx) / l] });
    }
  }
  /**
   * A solid of revolution around the local vertical through (cx, cz): profile of [radius, height]
   * from the bottom up. Smooth shading unless `flat`. Metal and roof facades run their seams along
   * the meridians.
   */
  lathe(cx: number, cz: number, prof: V2[], sides: number, m: Mat, o: { flat?: boolean; phase?: number; shade?: number } = {}) {
    const ph = (o.phase ?? 0) * DEG;
    const R = Math.max(...prof.map((p) => p[0]), 0.01);
    // Arc length up the profile, and a smooth 2D normal per profile point.
    const sLen = [0];
    for (let k = 1; k < prof.length; k++) sLen.push(sLen[k - 1] + Math.hypot(prof[k][0] - prof[k - 1][0], prof[k][1] - prof[k - 1][1]));
    const total = sLen[sLen.length - 1];
    const segN = (k: number): V2 => { const dr = prof[k + 1][0] - prof[k][0], dy = prof[k + 1][1] - prof[k][1], l = Math.hypot(dr, dy) || 1; return [dy / l, -dr / l]; };
    const pn = prof.map((_, k) => {
      const a = k > 0 ? segN(k - 1) : null, b = k < prof.length - 1 ? segN(k) : null;
      const x = (a?.[0] ?? 0) + (b?.[0] ?? 0), y = (a?.[1] ?? 0) + (b?.[1] ?? 0), l = Math.hypot(x, y) || 1;
      return [x / l, y / l] as V2;
    });
    const facOf = (k: number, ang: number): F4 => m.kind === Surface.Metal || m.kind === Surface.Roof ? [ang * R, sLen[k], total, 0] : [ang * R, this.f.y + prof[k][1] - this.ground, m.w, 0];
    if (o.flat) {
      for (let k = 0; k + 1 < prof.length; k++)
        for (let i = 0; i < sides; i++) {
          const a0 = ph + (i / sides) * 2 * Math.PI, a1 = ph + ((i + 1) / sides) * 2 * Math.PI;
          const P = (r: number, y: number, a: number): V3 => [cx + r * Math.cos(a), y, cz + r * Math.sin(a)];
          const [r0, y0] = prof[k], [r1, y1] = prof[k + 1];
          const mid = (a0 + a1) / 2, [nr, ny] = segN(k);
          const out: V3 = [nr * Math.cos(mid), ny, nr * Math.sin(mid)];
          const q = [P(r0, y0, a0), P(r0, y0, a1), P(r1, y1, a1), P(r1, y1, a0)];
          const fac = (w: V3): F4 => { const l = this.local(w[0], w[1], w[2]); const t = Math.hypot(l[0] - cx, l[2] - cz) > 1e-6 ? Math.atan2(l[2] - cz, l[0] - cx) : mid; const kk = Math.abs(l[1] - y0) < 1e-6 ? k : k + 1; return facOf(kk, ((t - ph + 4 * Math.PI) % (2 * Math.PI))); };
          if (r1 < 1e-6) this.poly([q[0], q[1], q[2]], m, { normal: out, fac, shade: o.shade });
          else if (r0 < 1e-6) this.poly([q[0], q[2], q[3]], m, { normal: out, fac, shade: o.shade });
          else this.poly(q, m, { normal: out, fac, shade: o.shade });
        }
      return;
    }
    const cols = sides + 1;
    const first = this.pos.length / 3;
    for (let k = 0; k < prof.length; k++)
      for (let i = 0; i <= sides; i++) {
        const a = ph + (i / sides) * 2 * Math.PI;
        const [r, y] = prof[k];
        const w = this.world([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]);
        const n = this.dir([pn[k][0] * Math.cos(a), pn[k][1], pn[k][0] * Math.sin(a)]);
        this.vertW(w, n, m, facOf(k, (i / sides) * 2 * Math.PI), o.shade ?? 1);
      }
    for (let k = 0; k + 1 < prof.length; k++)
      for (let i = 0; i < sides; i++) {
        const a = first + k * cols + i, b = a + 1, c = a + cols + 1, d = a + cols;
        // Counter-clockwise seen from outside: the angle grows clockwise seen from above.
        if (prof[k][0] > 1e-6) this.tri(a, d, b);
        if (prof[k + 1][0] > 1e-6) this.tri(b, d, c);
      }
  }
  /** A small ball (finial, lantern knob). */
  ball(cx: number, y: number, cz: number, r: number, m: Mat, sides = 8) {
    const prof: V2[] = [];
    for (let k = 0; k <= 4; k++) { const a = -Math.PI / 2 + (k / 4) * Math.PI; prof.push([r * Math.cos(a), y + r * Math.sin(a)]); }
    prof[0][0] = 0; prof[4][0] = 0;
    this.lathe(cx, cz, prof, sides, m);
  }
  /** A square beam of width w between two local points; ends open unless `caps`. */
  beam(p: V3, q: V3, w: number, m: Mat, caps = false, h = w) {
    const d = norm(sub(q, p));
    const up: V3 = Math.abs(d[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
    const s1 = norm(cross(d, up)), s2 = norm(cross(s1, d));
    const c = (o: V3, i: number): V3 => {
      const u = i === 0 || i === 3 ? -0.5 : 0.5, v = i < 2 ? -0.5 : 0.5;
      return [o[0] + s1[0] * u * w + s2[0] * v * h, o[1] + s1[1] * u * w + s2[1] * v * h, o[2] + s1[2] * u * w + s2[2] * v * h];
    };
    const P = [0, 1, 2, 3].map((i) => c(p, i)), Q = [0, 1, 2, 3].map((i) => c(q, i));
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      const mid: V3 = [(P[i][0] + P[j][0]) / 2 - p[0], (P[i][1] + P[j][1]) / 2 - p[1], (P[i][2] + P[j][2]) / 2 - p[2]];
      this.poly([P[i], P[j], Q[j], Q[i]], m, { normal: mid });
    }
    if (caps) { this.poly(P.slice().reverse(), m, { normal: [-d[0], -d[1], -d[2]] }); this.poly(Q, m, { normal: d }); }
  }

  /**
   * A flat shape on a plane: origin o, in-plane unit axes u (across) and v (up), shape in (u, v)
   * metres, lifted `off` along the plane's normal (u × v points out of the wall when u runs to
   * the right as seen from outside and v up). Glass gets its window coordinates.
   */
  plate(o: V3, u: V3, v: V3, shape: V2[], m: Mat, off = 0.04, shadeK = 1) {
    const n = norm(cross(u, v));
    const pts = shape.map(([a, b]) => [o[0] + u[0] * a + v[0] * b + n[0] * off, o[1] + u[1] * a + v[1] * b + n[1] * off, o[2] + u[2] * a + v[2] * b + n[2] * off] as V3);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const [a, b] of shape) { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); }
    const U = this.dir(u), V = this.dir(v), O = this.world(o);
    const fac = m.kind === Surface.Glass || m.kind === Surface.Opening
      ? (w: V3): F4 => [dot(sub(w, O), U) - x0, dot(sub(w, O), V) - y0, x1 - x0, y1 - y0]
      : undefined;
    this.poly(pts, m, { normal: n, fac, shade: shadeK });
  }
  /**
   * A flat shape in the plane (o; u across, v up) extruded back from that plane by `depth`, against
   * its normal u × v: a gable, pediment or screen with a front, a back and its edges.
   */
  slab(o: V3, u: V3, v: V3, shape: V2[], depth: number, m: Mat, back: Mat = m) {
    const n = norm(cross(u, v));
    const P = (a: number, b: number, t: number): V3 => [o[0] + u[0] * a + v[0] * b - n[0] * t, o[1] + u[1] * a + v[1] * b - n[1] * t, o[2] + u[2] * a + v[2] * b - n[2] * t];
    this.poly(shape.map(([a, b]) => P(a, b, 0)), m, { normal: n });
    this.poly(shape.map(([a, b]) => P(a, b, depth)), back, { normal: [-n[0], -n[1], -n[2]] });
    let area = 0;
    for (let i = 0; i < shape.length; i++) { const j = (i + 1) % shape.length; area += shape[i][0] * shape[j][1] - shape[j][0] * shape[i][1]; }
    const s = Math.sign(area) || 1;
    for (let i = 0; i < shape.length; i++) {
      const j = (i + 1) % shape.length, da = shape[j][0] - shape[i][0], db = shape[j][1] - shape[i][1];
      // Outward in the plane: the edge turned clockwise for a counter-clockwise shape.
      const out: V3 = [u[0] * db * s - v[0] * da * s, u[1] * db * s - v[1] * da * s, u[2] * db * s - v[2] * da * s];
      this.poly([P(shape[i][0], shape[i][1], 0), P(shape[j][0], shape[j][1], 0), P(shape[j][0], shape[j][1], depth), P(shape[i][0], shape[i][1], depth)], m, { normal: out });
    }
  }
  /** Openings along a straight wall: `count` shapes spaced `step` apart, centred on u = uc. */
  row(o: V3, u: V3, v: V3, shape: V2[], m: Mat, count: number, step: number, uc = 0, off = 0.04) {
    for (let i = 0; i < count; i++) {
      const du = uc + (i - (count - 1) / 2) * step;
      this.plate([o[0] + u[0] * du, o[1] + u[1] * du, o[2] + u[2] * du], u, v, shape, m, off);
    }
  }

  /**
   * A roof over a local ring from the straight-skeleton roofs of tools/lib/roofs.ts: slopes in
   * `roofM`, upright gables in `gableM`. Returns the roof's height above the eave.
   */
  roof(ring: V2[], eave: number, spec: RoofSpec, roofM: Mat, gableM: Mat = roofM, holes: V2[][] = [], pick?: (centre: V3) => Mat): number {
    const toW = (r: V2[]) => r.flatMap(([x, z]) => { const w = this.world([x, 0, z]); return [w[0], w[2]]; });
    const rings = [toW(ring), ...holes.map(toW)];
    const model = roofModel(rings, spec);
    if (!model) return 0;
    const roof = meshRoof(model, rings);
    const nFoot = rings.reduce((a, r) => a + r.length / 2, 0);
    const Y = this.f.y + eave;
    const P = (id: number): V3 => {
      if (id < nFoot) { let k = id; for (const r of rings) { if (k < r.length / 2) return [r[k * 2], Y, r[k * 2 + 1]]; k -= r.length / 2; } }
      const e = id - nFoot;
      return [roof.x[e], Y + roof.h[e], roof.z[e]];
    };
    // Outward normals of the footprint edges, for the gables.
    const edgeN: V2[] = [];
    for (const r of rings) {
      const n = r.length / 2;
      let area = 0;
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += r[i * 2] * r[j * 2 + 1] - r[j * 2] * r[i * 2 + 1]; }
      const s = (r === rings[0] ? 1 : -1) * (Math.sign(area) || 1);
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, dx = r[j * 2] - r[i * 2], dz = r[j * 2 + 1] - r[i * 2 + 1], l = Math.hypot(dx, dz) || 1;
        edgeN.push([(s * dz) / l, (-s * dx) / l]);
      }
    }
    for (const face of roof.faces) {
      const gable = face.kind === Face.Gable;
      const m0 = gable ? gableM : face.kind === Face.Flat ? { ...roofM, kind: roofM.kind === Surface.Metal ? Surface.Metal : Surface.FlatRoof } : roofM;
      for (let q = 0; q < face.tris.length; q += 3) {
        let A = P(face.tris[q]), B = P(face.tris[q + 1]), C = P(face.tris[q + 2]);
        let n = cross(sub(B, A), sub(C, A));
        if (Math.hypot(n[0], n[1], n[2]) < 1e-9) continue;
        n = norm(n);
        const m = pick && !gable ? pick([(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3]) : m0;
        const flip = gable ? (face.edge >= 0 ? n[0] * edgeN[face.edge][0] + n[2] * edgeN[face.edge][1] < 0 : false) : n[1] < 0;
        if (flip) { [B, C] = [C, B]; n = [-n[0], -n[1], -n[2]]; }
        const sin = Math.sqrt(Math.max(1e-4, 1 - n[1] * n[1]));
        const hl = Math.hypot(n[0], n[2]) || 1;
        const fac = (w: V3): F4 => gable ? this.autoFac(m, w, n, Y, Y) : [w[0] * (-n[2] / hl) + w[2] * (n[0] / hl), (w[1] - Y) / sin, (Y + roof.height - Y) / sin, 0];
        const first = this.pos.length / 3;
        for (const w of [A, B, C]) this.vertW(w, n, m, fac(w));
        this.tri(first, first + 1, first + 2);
      }
    }
    return roof.height;
  }

  // ---- Output --------------------------------------------------------------------------------

  finish(): MeshBuffers {
    return {
      position: new Float32Array(this.pos), normal: new Int8Array(this.nor), color: new Uint8Array(this.col),
      facade: new Float32Array(this.fac), info: new Uint8Array(this.inf), index: new Uint32Array(this.idx),
    };
  }
}
