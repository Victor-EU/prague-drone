// Tiles to meshes, in the tile worker. Walls rise from the base to the eave with the facade
// coordinates the building shader draws windows from (design.md §8.2); roofs are the faces built
// by tools/lib/roofs.ts (§8.1); flat roofs are the footprint capped at the eave. Chimneys, dormers
// and roof boxes go into a separate detail mesh that is dropped with distance.

import { ShapeUtils, Vector2 } from 'three';
import { Face, Surface, Prop, BFlag, EFlag, SFlag } from '../core/buildings.ts';

export interface TileArrays {
  ring: Uint32Array; vert: Uint32Array; xy: Int16Array; edge: Uint8Array;
  base: Int16Array; top: Int16Array; eave: Int16Array; gnd: Int16Array;
  landmark: Int8Array; kind: Uint8Array; style: Uint8Array; flags: Uint8Array;
  wall: Uint8Array; roof: Uint8Array;
  roofV: Uint32Array; roofF: Uint32Array; rv: Int16Array;
  fk: Uint8Array; fe: Int16Array; fn: Uint16Array; ti: Uint16Array;
  pt: Uint8Array; pa: Uint8Array; pb: Uint16Array; pp: Int16Array;
}

export interface MeshBuffers {
  position: Float32Array;
  normal: Int8Array;
  color: Uint8Array;
  /** Walls: along the wall, wall length (0: no windows), height above ground, eave height. Roofs: along the eave, up the slope, slope length. */
  facade: Float32Array;
  /** Surface kind, facade style, flags (EFlag bits), a per-building seed. */
  info: Uint8Array;
  index: Uint32Array;
}

const LINEAR = new Uint8Array(256).map((_, i) => {
  const c = i / 255;
  return Math.round(255 * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
});

function hash(n: number): number {
  n = (n ^ 61) ^ (n >>> 16);
  n = (n + (n << 3)) | 0;
  n ^= n >>> 4;
  n = Math.imul(n, 0x27d4eb2d);
  n ^= n >>> 15;
  return (n >>> 0) / 4294967296;
}

class Writer {
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
  /** c: linear bytes; f: facade; info: kind, style, flags, seed. */
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
  tri(a: number, b: number, c: number) {
    this.grow(0, 3);
    this.idx[this.i++] = a; this.idx[this.i++] = b; this.idx[this.i++] = c;
  }
  finish(): MeshBuffers {
    return {
      position: this.pos.slice(0, this.v * 3), normal: this.nor.slice(0, this.v * 3), color: this.col.slice(0, this.v * 3),
      facade: this.fac.slice(0, this.v * 4), info: this.inf.slice(0, this.v * 4), index: this.idx.slice(0, this.i),
    };
  }
}

/** A box: centre of the base (x, z), from y0 to y1, w across and d along the facing (dx, dz). Five faces, no bottom. */
function box(W: Writer, x: number, z: number, y0: number, y1: number, w: number, d: number, dx: number, dz: number, c: number[], kind: number, seed: number, frontKind = kind, frontFacade = false, top = c, topKind = kind) {
  const ax = -dz, az = dx; // across
  const hw = w / 2, hd = d / 2;
  // Corners: front-left, front-right, back-right, back-left (front at +d/2 along the facing).
  const cx = [x + dx * hd - ax * hw, x + dx * hd + ax * hw, x - dx * hd + ax * hw, x - dx * hd - ax * hw];
  const cz = [z + dz * hd - az * hw, z + dz * hd + az * hw, z - dz * hd + az * hw, z - dz * hd - az * hw];
  const normals = [[dx, dz], [ax, az], [-dx, -dz], [-ax, -az]];
  for (let s = 0; s < 4; s++) {
    const p = s, q = (s + 1) % 4;
    const [nx, nz] = normals[s];
    const len = Math.hypot(cx[q] - cx[p], cz[q] - cz[p]);
    const k = s === 0 ? frontKind : kind;
    const f1 = s === 0 && frontFacade ? len : 0;
    const a = W.vert(cx[p], y0, cz[p], nx, 0, nz, c, 0.92, 0, f1, 0, y1 - y0, k, 0, 0, seed);
    const b = W.vert(cx[q], y0, cz[q], nx, 0, nz, c, 0.92, len, f1, 0, y1 - y0, k, 0, 0, seed);
    const e = W.vert(cx[q], y1, cz[q], nx, 0, nz, c, 1, len, f1, y1 - y0, y1 - y0, k, 0, 0, seed);
    const f = W.vert(cx[p], y1, cz[p], nx, 0, nz, c, 1, 0, f1, y1 - y0, y1 - y0, k, 0, 0, seed);
    // Counter-clockwise seen from outside.
    W.tri(a, e, b); W.tri(a, f, e);
  }
  const t = [0, 1, 2, 3].map((k) => W.vert(cx[k], y1, cz[k], 0, 1, 0, top, 1, cx[k], cz[k], 0, 0, topKind, 0, 0, seed));
  W.tri(t[0], t[2], t[1]); W.tri(t[0], t[3], t[2]);
}

export function extrude(f: TileArrays, seed = 0): { main: MeshBuffers; detail: MeshBuffers } {
  const count = f.ring.length - 1;
  const M = new Writer(f.xy.length * 3, f.xy.length * 6);
  const D = new Writer(f.pp.length * 4 + 16, f.pp.length * 6 + 16);
  const colours: { wall: number[]; roof: number[]; tone: number; seed: number }[] = [];

  for (let b = 0; b < count; b++) {
    const base = f.base[b] / 10, top = f.top[b] / 10, eave = f.eave[b] / 10, gnd = f.gnd[b] / 10;
    const bseed = Math.floor(hash(b * 7919 + seed * 104729) * 256);
    const tone = 0.94 + hash(b * 7919 + seed) * 0.1;
    const wall = [f.wall[b * 3], f.wall[b * 3 + 1], f.wall[b * 3 + 2]];
    const roofC = [f.roof[b * 3], f.roof[b * 3 + 1], f.roof[b * 3 + 2]];
    colours.push({ wall, roof: roofC, tone, seed: bseed });
    if (top - base < 0.5) continue;
    const landmark = (f.flags[b] & BFlag.Landmark) !== 0;
    const style = f.style[b];
    const bridge = f.kind[b] === 2;
    const wallKind = bridge ? Surface.Plain : Surface.Wall;
    const r0 = f.ring[b], r1 = f.ring[b + 1];
    const v0 = f.vert[r0], nFoot = f.vert[r1] - v0;
    const eaveRel = eave - gnd;

    // Edge frames: outward normal per footprint vertex (for the edge starting there).
    const enx = new Float32Array(nFoot), enz = new Float32Array(nFoot), next = new Int32Array(nFoot);
    const contour: Vector2[] = [];
    const holes: Vector2[][] = [];
    for (let r = r0; r < r1; r++) {
      const s = f.vert[r], e = f.vert[r + 1], n = e - s;
      if (n < 3) continue;
      let area = 0;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += f.xy[(s + i) * 2] * f.xy[(s + j) * 2 + 1] - f.xy[(s + j) * 2] * f.xy[(s + i) * 2 + 1];
      }
      const isHole = r > r0;
      const outward = (isHole ? -1 : 1) * Math.sign(area || 1);
      const pts: Vector2[] = [];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const li = s + i - v0;
        next[li] = s + j - v0;
        const ax = f.xy[(s + i) * 2] / 10, az = f.xy[(s + i) * 2 + 1] / 10;
        const bx = f.xy[(s + j) * 2] / 10, bz = f.xy[(s + j) * 2 + 1] / 10;
        pts.push(new Vector2(ax, az));
        const len = Math.hypot(bx - ax, bz - az);
        if (len < 1e-3) continue;
        const nx = (outward * (bz - az)) / len, nz = (outward * -(bx - ax)) / len;
        enx[li] = nx; enz[li] = nz;
        const party = f.edge[s + i] & EFlag.Party;
        // Walls, with facade coordinates. Ground darkening stands in for occlusion at the foot.
        const L = party || landmark ? 0 : len;
        // Landmarks the modelling has not reached yet are floodlit at night all the same.
        const fl = party | (landmark ? SFlag.Floodlit : 0);
        const a0 = M.vert(ax, base, az, nx, 0, nz, wall, tone * 0.8, 0, L, base - gnd, eaveRel, wallKind, style, fl, bseed);
        const b0 = M.vert(bx, base, bz, nx, 0, nz, wall, tone * 0.8, len, L, base - gnd, eaveRel, wallKind, style, fl, bseed);
        const b1 = M.vert(bx, eave, bz, nx, 0, nz, wall, tone, len, L, eaveRel, eaveRel, wallKind, style, fl, bseed);
        const a1 = M.vert(ax, eave, az, nx, 0, nz, wall, tone, 0, L, eaveRel, eaveRel, wallKind, style, fl, bseed);
        if (outward > 0) M.tri(a0, a1, b1), M.tri(a0, b1, b0);
        else M.tri(a0, b1, a1), M.tri(a0, b0, b1);
      }
      if (isHole) holes.push(pts); else contour.push(...pts);
    }
    if (contour.length < 3) continue;

    const fv0 = f.roofF[b], fv1 = f.roofF[b + 1];
    if (fv1 === fv0) {
      // Flat roof: the footprint at the eave.
      const faces = ShapeUtils.triangulateShape(contour, holes);
      const all = contour.concat(...holes);
      const first = M.v;
      const kind = landmark || bridge ? Surface.Plain : Surface.FlatRoof;
      for (const p of all) M.vert(p.x, eave, p.y, 0, 1, 0, roofC, tone, p.x, p.y, 0, 0, kind, style, 0, bseed);
      for (const [a, b2, c2] of faces) {
        const pa = all[a], pb = all[b2], pc = all[c2];
        const cross = (pb.x - pa.x) * (pc.y - pa.y) - (pb.y - pa.y) * (pc.x - pa.x);
        if (cross < 0) M.tri(first + a, first + b2, first + c2);
        else M.tri(first + a, first + c2, first + b2);
      }
      continue;
    }

    // Roof faces. Local vertex ids: footprint first (at the eave), then the extra vertices.
    const rvs = f.roofV[b];
    const px = (id: number) => (id < nFoot ? f.xy[(v0 + id) * 2] / 10 : f.rv[(rvs + id - nFoot) * 3] / 10);
    const pz = (id: number) => (id < nFoot ? f.xy[(v0 + id) * 2 + 1] / 10 : f.rv[(rvs + id - nFoot) * 3 + 1] / 10);
    const py = (id: number) => (id < nFoot ? eave : f.rv[(rvs + id - nFoot) * 3 + 2] / 10);
    let t0 = 0;
    for (let k = f.roofF[0]; k < fv0; k++) t0 += f.fn[k];
    for (let k = fv0; k < fv1; k++) {
      const kind = f.fk[k], edge = f.fe[k], nt = f.fn[k];
      const tris = f.ti.subarray(t0 * 3, (t0 + nt) * 3);
      t0 += nt;
      const faceTone = tone * (0.9 + hash(b * 131 + k * 17 + seed) * 0.16);
      // The eave line this face falls to: along it (u) and up the slope from it (s).
      let ex = 1, ez = 0, ax = 0, az = 0, hasEdge = edge >= 0 && edge < nFoot;
      if (hasEdge) {
        ax = px(edge); az = pz(edge);
        const bx = px(next[edge]), bz = pz(next[edge]);
        const l = Math.hypot(bx - ax, bz - az) || 1;
        ex = (bx - ax) / l; ez = (bz - az) / l;
      }
      const slopeCoord = (id: number) => {
        const dx = px(id) - ax, dz = pz(id) - az;
        const d = Math.abs(dx * -ez + dz * ex);
        return Math.hypot(d, py(id) - eave);
      };
      let smax = 0;
      if (kind === Face.Slope && hasEdge) for (let q = 0; q < tris.length; q++) smax = Math.max(smax, slopeCoord(tris[q]));
      const seen = new Map<number, number>();
      for (let q = 0; q < tris.length; q += 3) {
        let ia = tris[q], ib = tris[q + 1], ic = tris[q + 2];
        const Ax = px(ia), Ay = py(ia), Az = pz(ia);
        let ux = px(ib) - Ax, uy = py(ib) - Ay, uz = pz(ib) - Az;
        let wx = px(ic) - Ax, wy = py(ic) - Ay, wz = pz(ic) - Az;
        let nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
        const nl = Math.hypot(nx, ny, nz);
        if (nl < 1e-6) continue;
        nx /= nl; ny /= nl; nz /= nl;
        // Face outward: roofs up, gables away from the building.
        const flip = kind === Face.Gable ? (hasEdge ? nx * enx[edge] + nz * enz[edge] < 0 : false) : ny < 0;
        if (flip) { const t = ib; ib = ic; ic = t; nx = -nx; ny = -ny; nz = -nz; }
        const ids = [ia, ib, ic].map((id) => {
          // Share a vertex between triangles of the same plane only.
          const key = id;
          const hit = seen.get(key);
          if (hit !== undefined) {
            const o = hit * 3;
            if (M.nor[o] === Math.round(nx * 127) && M.nor[o + 1] === Math.round(ny * 127) && M.nor[o + 2] === Math.round(nz * 127)) return hit;
          }
          const x = px(id), y = py(id), z = pz(id);
          let v: number;
          if (kind === Face.Gable) {
            const u = hasEdge ? (x - ax) * ex + (z - az) * ez : 0;
            const party = hasEdge ? f.edge[v0 + edge] & EFlag.Party : 0;
            v = M.vert(x, y, z, nx, ny, nz, wall, tone, u, 0, y - gnd, eaveRel, landmark ? Surface.Plain : Surface.Gable, style, party, bseed);
          } else if (kind === Face.Flat || !hasEdge) {
            v = M.vert(x, y, z, nx, ny, nz, roofC, faceTone * (kind === Face.Flat ? 0.85 : 1), x, z, 0, 0, kind === Face.Flat ? Surface.FlatRoof : Surface.Roof, style, 0, bseed);
          } else {
            const u = (x - ax) * ex + (z - az) * ez;
            v = M.vert(x, y, z, nx, ny, nz, roofC, faceTone, u, slopeCoord(id), smax, 0, Surface.Roof, style, 0, bseed);
          }
          seen.set(key, v);
          return v;
        });
        M.tri(ids[0], ids[1], ids[2]);
      }
    }
  }

  // Props: chimneys, dormers, roof boxes.
  const np = f.pt.length;
  for (let p = 0; p < np; p++) {
    const type = f.pt[p], bi = f.pb[p];
    const x = f.pp[p * 6] / 10, z = f.pp[p * 6 + 1] / 10, y0 = f.pp[p * 6 + 2] / 10, y1 = f.pp[p * 6 + 3] / 10;
    const w = f.pp[p * 6 + 4] / 100, d = f.pp[p * 6 + 5] / 100;
    const ang = (f.pa[p] / 256) * Math.PI * 2;
    const dx = Math.cos(ang), dz = Math.sin(ang);
    const c = colours[bi];
    if (!c) continue;
    const shade = (k: number[], s: number) => k.map((v) => Math.min(255, v * s));
    if (type === Prop.Chimney) {
      box(D, x, z, y0, y1, w, d, dx, dz, shade(c.wall, c.tone * 0.97), Surface.Chimney, c.seed);
    } else if (type === Prop.RoofBox) {
      const g = 150 + Math.floor(hash(p * 31 + seed) * 40);
      box(D, x, z, y0, y1, w, d, dx, dz, [g, g - 2, g - 6], Surface.Plain, c.seed);
    } else {
      // Dormer: the box reaches back into the roof and a little below it; the front carries a window.
      const fh = y1 - y0;
      const bx = x - dx * (d / 2), bz = z - dz * (d / 2); // box centre (front face at x, z)
      box(D, bx, bz, y0 - 0.4, y1, w, d, dx, dz, shade(c.wall, c.tone), Surface.Plain, c.seed, Surface.DormerFront, true, shade(c.roof, c.tone * 0.8), Surface.FlatRoof);
      // Fix the front's height coordinate to start at the roof line, not 0.4 m below it.
      const front = D.v - 20; // the first four vertices written by box() are the front face
      for (let q = 0; q < 4; q++) D.fac[(front + q) * 4 + 2] -= 0.4, D.fac[(front + q) * 4 + 3] = fh;
      if (type === Prop.DormerGabled) {
        // A small gabled roof on top, its ridge running back into the main roof.
        const rise = w * 0.42;
        const ax2 = -dz, az2 = dx, hw = w / 2 + 0.12;
        const fx = x + dx * 0.15, fz = z + dz * 0.15, rx = x - dx * d, rz = z - dz * d;
        const L = [fx - ax2 * hw, fz - az2 * hw], R = [fx + ax2 * hw, fz + az2 * hw], T = [fx, fz];
        const Lb = [rx - ax2 * hw, rz - az2 * hw], Rb = [rx + ax2 * hw, rz + az2 * hw], Tb = [rx, rz];
        const roofCol = shade(c.roof, c.tone);
        const sl = Math.hypot(hw, rise);
        for (const side of [-1, 1]) {
          const E = side < 0 ? L : R, Eb = side < 0 ? Lb : Rb;
          const nx = ax2 * side * rise / sl, ny = hw / sl, nz = az2 * side * rise / sl;
          const q0 = D.vert(E[0], y1 - 0.05, E[1], nx, ny, nz, roofCol, 1, 0, 0, sl, 0, Surface.DormerRoof, 0, 0, c.seed);
          const q1 = D.vert(Eb[0], y1 - 0.05, Eb[1], nx, ny, nz, roofCol, 1, d, 0, sl, 0, Surface.DormerRoof, 0, 0, c.seed);
          const q2 = D.vert(Tb[0], y1 + rise, Tb[1], nx, ny, nz, roofCol, 1, d, sl, sl, 0, Surface.DormerRoof, 0, 0, c.seed);
          const q3 = D.vert(T[0], y1 + rise, T[1], nx, ny, nz, roofCol, 1, 0, sl, sl, 0, Surface.DormerRoof, 0, 0, c.seed);
          if (side > 0) D.tri(q0, q2, q1), D.tri(q0, q3, q2);
          else D.tri(q0, q1, q2), D.tri(q0, q2, q3);
        }
        // The little gable over the window.
        const wc = shade(c.wall, c.tone);
        const g0 = D.vert(L[0], y1 - 0.05, L[1], dx, 0, dz, wc, 1, 0, 0, 0, 0, Surface.Plain, 0, 0, c.seed);
        const g1 = D.vert(R[0], y1 - 0.05, R[1], dx, 0, dz, wc, 1, 0, 0, 0, 0, Surface.Plain, 0, 0, c.seed);
        const g2 = D.vert(T[0], y1 + rise, T[1], dx, 0, dz, wc, 1, 0, 0, 0, 0, Surface.Plain, 0, 0, c.seed);
        D.tri(g0, g2, g1);
      }
    }
  }
  return { main: M.finish(), detail: D.finish() };
}

