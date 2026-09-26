// The vertex writer of the tile worker: buffers in the building tiles' layout (position, normal,
// colour, facade coordinates, surface info), grown as they fill, and a frame on a wall for the
// relief's shapes (design.md §8.2, M14): faces, slabs proud of the wall, boxes, and mouldings
// swept round a footprint with mitred corners.

import { ShapeUtils, Vector2 } from 'three';

export interface MeshBuffers {
  position: Float32Array;
  normal: Int8Array;
  color: Uint8Array;
  /** Walls: along the wall, wall length (0: no windows), height above ground, eave height. Roofs: along the eave, up the slope, slope length. */
  facade: Float32Array;
  /** Surface kind, facade style, flags (SFlag bits), a per-building seed. */
  info: Uint8Array;
  index: Uint32Array;
}

export type V3 = [number, number, number];
export type RGB = [number, number, number];
export type P2 = [number, number];

export const LINEAR = new Uint8Array(256).map((_, i) => {
  const c = i / 255;
  return Math.round(255 * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
});

export function hash(n: number): number {
  n = (n ^ 61) ^ (n >>> 16);
  n = (n + (n << 3)) | 0;
  n ^= n >>> 4;
  n = Math.imul(n, 0x27d4eb2d);
  n ^= n >>> 15;
  return (n >>> 0) / 4294967296;
}

export class Writer {
  pos: Float32Array; nor: Int8Array; col: Uint8Array; fac: Float32Array; inf: Uint8Array; idx: Uint32Array;
  v = 0; i = 0;
  constructor(nv: number, ni: number) {
    this.pos = new Float32Array(nv * 3); this.nor = new Int8Array(nv * 3); this.col = new Uint8Array(nv * 3);
    this.fac = new Float32Array(nv * 4); this.inf = new Uint8Array(nv * 4); this.idx = new Uint32Array(ni);
  }
  private grow(nv: number, ni: number) {
    if (this.v + nv > this.pos.length / 3) {
      const n = Math.max(this.pos.length / 3 * 2, this.v + nv);
      const g = <T extends Float32Array | Int8Array | Uint8Array>(a: T, k: number) => { const b = new (a.constructor as any)(n * k); b.set(a); return b as T; };
      this.pos = g(this.pos, 3); this.nor = g(this.nor, 3); this.col = g(this.col, 3); this.fac = g(this.fac, 4); this.inf = g(this.inf, 4);
    }
    if (this.i + ni > this.idx.length) {
      const b = new Uint32Array(Math.max(this.idx.length * 2, this.i + ni));
      b.set(this.idx);
      this.idx = b;
    }
  }
  reserve(nv: number, ni: number) { this.grow(nv, ni); }
  /** c: sRGB bytes, shaded; f: facade; info: kind, style, flags, seed. */
  vert(x: number, y: number, z: number, nx: number, ny: number, nz: number, c: number[], shade: number, f0: number, f1: number, f2: number, f3: number, kind: number, style: number, flags: number, seed: number): number {
    this.grow(1, 0);
    const v = this.v++;
    this.pos[v * 3] = x; this.pos[v * 3 + 1] = y; this.pos[v * 3 + 2] = z;
    this.nor[v * 3] = Math.round(nx * 127); this.nor[v * 3 + 1] = Math.round(ny * 127); this.nor[v * 3 + 2] = Math.round(nz * 127);
    this.col[v * 3] = LINEAR[Math.min(255, Math.round(c[0] * shade))];
    this.col[v * 3 + 1] = LINEAR[Math.min(255, Math.round(c[1] * shade))];
    this.col[v * 3 + 2] = LINEAR[Math.min(255, Math.round(c[2] * shade))];
    this.fac[v * 4] = f0; this.fac[v * 4 + 1] = f1; this.fac[v * 4 + 2] = f2; this.fac[v * 4 + 3] = f3;
    this.inf[v * 4] = kind; this.inf[v * 4 + 1] = style; this.inf[v * 4 + 2] = flags; this.inf[v * 4 + 3] = seed;
    return v;
  }
  /** As `vert`, with the colour as linear values 0 to 1. */
  vertL(x: number, y: number, z: number, nx: number, ny: number, nz: number, c: RGB, f0: number, f1: number, f2: number, f3: number, kind: number, style: number, flags: number, seed: number): number {
    const v = this.vert(x, y, z, nx, ny, nz, [0, 0, 0], 1, f0, f1, f2, f3, kind, style, flags, seed);
    this.col[v * 3] = Math.max(0, Math.min(255, Math.round(c[0] * 255)));
    this.col[v * 3 + 1] = Math.max(0, Math.min(255, Math.round(c[1] * 255)));
    this.col[v * 3 + 2] = Math.max(0, Math.min(255, Math.round(c[2] * 255)));
    return v;
  }
  tri(a: number, b: number, c: number) {
    this.grow(0, 3);
    this.idx[this.i++] = a; this.idx[this.i++] = b; this.idx[this.i++] = c;
  }
  /**
   * A flat polygon of world points with the given outward normal (linear colour), wound to face it;
   * convex ones as a fan, others by ear clipping in the plane's two dominant axes.
   */
  face(pts: V3[], n: V3, c: RGB, fac: (p: V3) => [number, number, number, number], kind: number, style: number, flags: number, seed: number, convex = true) {
    if (pts.length < 3) return;
    const first = this.v;
    for (const p of pts) { const f = fac(p); this.vertL(p[0], p[1], p[2], n[0], n[1], n[2], c, f[0], f[1], f[2], f[3], kind, style, flags, seed); }
    let tris: number[][];
    if (convex || pts.length <= 4) tris = Array.from({ length: pts.length - 2 }, (_, k) => [0, k + 1, k + 2]);
    else {
      const ax = Math.abs(n[0]) > Math.abs(n[1]) ? (Math.abs(n[0]) > Math.abs(n[2]) ? 0 : 2) : Math.abs(n[1]) > Math.abs(n[2]) ? 1 : 2;
      const [i0, i1] = ax === 0 ? [1, 2] : ax === 1 ? [2, 0] : [0, 1];
      tris = ShapeUtils.triangulateShape(pts.map((p) => new Vector2(p[i0], p[i1])), []);
    }
    for (const [a, b, d] of tris) {
      const A = pts[a], B = pts[b], C = pts[d];
      const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2], wx = C[0] - A[0], wy = C[1] - A[1], wz = C[2] - A[2];
      const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx;
      if (cx * n[0] + cy * n[1] + cz * n[2] >= 0) this.tri(first + a, first + b, first + d); else this.tri(first + a, first + d, first + b);
    }
  }
  finish(): MeshBuffers {
    return {
      position: this.pos.slice(0, this.v * 3), normal: this.nor.slice(0, this.v * 3), color: this.col.slice(0, this.v * 3),
      facade: this.fac.slice(0, this.v * 4), info: this.inf.slice(0, this.v * 4), index: this.idx.slice(0, this.i),
    };
  }
}

const norm = (p: V3): V3 => { const l = Math.hypot(p[0], p[1], p[2]) || 1; return [p[0] / l, p[1] / l, p[2] / l]; };

/**
 * A frame on a wall: origin `o` at the wall's foot, `u` along the wall (unit, to the right seen
 * from outside), `n` its outward normal (unit), up is +y. Shapes are given in (a along, b up)
 * metres and stand `t` proud of the wall along n. Every vertex's facade is (0, 0, height above
 * `gnd`, 0) and its surface `kind` (Surface.Trim as a rule), for the street lamps' pools.
 */
export class Frame {
  W: Writer; o: V3; u: V3; n: V3; gnd: number; kind: number; style: number; flags: number; seed: number;
  constructor(W: Writer, o: V3, u: V3, n: V3, gnd: number, kind: number, style: number, flags: number, seed: number) {
    this.W = W; this.o = o; this.u = u; this.n = n; this.gnd = gnd; this.kind = kind; this.style = style; this.flags = flags; this.seed = seed;
  }
  at(o: V3, u: V3, n: V3) { this.o = o; this.u = u; this.n = n; return this; }
  P(a: number, b: number, t: number): V3 {
    return [this.o[0] + this.u[0] * a + this.n[0] * t, this.o[1] + b, this.o[2] + this.u[2] * a + this.n[2] * t];
  }
  private fac = (p: V3): [number, number, number, number] => [0, 0, p[1] - this.gnd, 0];
  face(pts: V3[], nrm: V3, c: RGB, convex = true) {
    this.W.face(pts, nrm, c, this.fac, this.kind, this.style, this.flags, this.seed, convex);
  }
  /**
   * A shape in the wall's plane standing from t0 to t1 proud of it: its front face at t1, its
   * sides along the outline (and its back at t0 when `back`). `cSide` colours the sides.
   */
  slab(shape: P2[], t0: number, t1: number, c: RGB, o: { back?: boolean; cSide?: RGB; convex?: boolean; sides?: boolean } = {}) {
    const n = this.n, u = this.u;
    const front = shape.map(([a, b]) => this.P(a, b, t1));
    this.face(front, n, c, o.convex ?? false);
    if (o.back) this.face(shape.map(([a, b]) => this.P(a, b, t0)), [-n[0], -n[1], -n[2]], c, o.convex ?? false);
    if (o.sides === false) return;
    let area = 0;
    for (let i = 0; i < shape.length; i++) { const j = (i + 1) % shape.length; area += shape[i][0] * shape[j][1] - shape[j][0] * shape[i][1]; }
    const s = Math.sign(area) || 1;
    const cs = o.cSide ?? c;
    for (let i = 0; i < shape.length; i++) {
      const j = (i + 1) % shape.length, da = shape[j][0] - shape[i][0], db = shape[j][1] - shape[i][1];
      if (Math.abs(da) + Math.abs(db) < 1e-6) continue;
      const out = norm([u[0] * db * s, -da * s, u[2] * db * s]);
      this.face([this.P(shape[i][0], shape[i][1], t0), this.P(shape[j][0], shape[j][1], t0), this.P(shape[j][0], shape[j][1], t1), this.P(shape[i][0], shape[i][1], t1)], out, cs);
    }
  }
  /** A box a0..a1 along, b0..b1 up, t0..t1 proud: front, top, bottom, ends (no back). */
  box(a0: number, a1: number, b0: number, b1: number, t0: number, t1: number, c: RGB, o: { back?: boolean; top?: boolean; bottom?: boolean; cSide?: RGB } = {}) {
    const n = this.n, u = this.u;
    const P = (a: number, b: number, t: number) => this.P(a, b, t);
    this.face([P(a0, b0, t1), P(a1, b0, t1), P(a1, b1, t1), P(a0, b1, t1)], n, c);
    const cs = o.cSide ?? c;
    if (o.top !== false) this.face([P(a0, b1, t0), P(a1, b1, t0), P(a1, b1, t1), P(a0, b1, t1)], [0, 1, 0], cs);
    if (o.bottom !== false) this.face([P(a0, b0, t0), P(a1, b0, t0), P(a1, b0, t1), P(a0, b0, t1)], [0, -1, 0], cs);
    this.face([P(a0, b0, t0), P(a0, b1, t0), P(a0, b1, t1), P(a0, b0, t1)], [-u[0], 0, -u[2]], cs);
    this.face([P(a1, b0, t0), P(a1, b1, t0), P(a1, b1, t1), P(a1, b0, t1)], [u[0], 0, u[2]], cs);
    if (o.back) this.face([P(a0, b0, t0), P(a1, b0, t0), P(a1, b1, t0), P(a0, b1, t0)], [-n[0], 0, -n[2]], cs);
  }
}

/** An edge of a footprint ring for `course`: its start, outward normal, and whether the moulding runs along it. */
export interface CourseEdge { x: number; z: number; nx: number; nz: number; on: boolean }

/**
 * A moulding swept round a footprint ring at height `y` (the profile's 0), the profile in
 * (proud of the wall, up) metres traversed with the solid on the left, from the wall out and back
 * to it; along the edges that are `on`, mitred where two such edges meet and ending square at a
 * corner where the next edge is not.
 */
export function course(fr: Frame, ring: CourseEdge[], prof: P2[], y: number, c: RGB, gnd: number) {
  const m = ring.length;
  const mitre = (i: number, before: boolean): [number, number] => {
    const e = ring[i], p = ring[(i + m - 1) % m];
    const a = before ? p : e, b = before ? e : p;
    // a is the edge whose end this is (when `before`, the previous edge; else this one), b the other.
    if (!b.on) return [a.nx, a.nz];
    const d = a.nx * b.nx + a.nz * b.nz;
    if (1 + d < 0.25) return [a.nx, a.nz];
    return [(a.nx + b.nx) / (1 + d), (a.nz + b.nz) / (1 + d)];
  };
  for (let i = 0; i < m; i++) {
    const e = ring[i];
    if (!e.on) continue;
    const f = ring[(i + 1) % m];
    const m0 = mitre(i, false), m1 = mitre((i + 1) % m, true);
    const P = (j: number, end: 0 | 1): V3 => {
      const [px, ph] = prof[j];
      const v = end ? f : e, mm = end ? m1 : m0;
      return [v.x + mm[0] * px, y + ph, v.z + mm[1] * px];
    };
    for (let j = 0; j + 1 < prof.length; j++) {
      const dp = prof[j + 1][0] - prof[j][0], dh = prof[j + 1][1] - prof[j][1];
      if (Math.abs(dp) + Math.abs(dh) < 1e-6) continue;
      const nrm = norm([e.nx * dh, -dp, e.nz * dh]);
      fr.W.face([P(j, 0), P(j, 1), P(j + 1, 1), P(j + 1, 0)], nrm, c, (p) => [0, 0, p[1] - gnd, 0], fr.kind, fr.style, fr.flags, fr.seed);
    }
  }
}
