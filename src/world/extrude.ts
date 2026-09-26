// Tiles to meshes, in the tile worker. Walls rise from the base to the eave with the facade
// coordinates the building shader draws windows from (design.md §8.2); roofs are the faces built
// by tools/lib/roofs.ts (§8.1); flat roofs are the footprint capped at the eave. Chimneys, dormers
// and roof boxes, and since M14 the gables, turrets, bays and figures of §8.1, go into a separate
// detail mesh that is dropped with distance. The squares' arcades (§8.3) take the ground floor of
// the walls flagged for them. The relief within reach of the camera is built apart (relief.ts).

import { ShapeUtils, Vector2 } from 'three';
import { Face, Surface, Prop, BFlag, EFlag, SFlag, Glass, trimFlags, grid } from '../core/buildings.ts';
import { Writer, Frame, type MeshBuffers, type RGB, type P2, type V3 } from './mesh-writer.ts';
import { Palette } from './relief.ts';

export type { MeshBuffers } from './mesh-writer.ts';

export interface TileArrays {
  ring: Uint32Array; vert: Uint32Array; xy: Int16Array; edge: Uint8Array;
  base: Int16Array; top: Int16Array; eave: Int16Array; gnd: Int16Array;
  landmark: Int8Array; kind: Uint8Array; style: Uint8Array; flags: Uint8Array;
  wall: Uint8Array; roof: Uint8Array;
  roofV: Uint32Array; roofF: Uint32Array; rv: Int16Array;
  fk: Uint8Array; fe: Int16Array; fn: Uint16Array; ti: Uint16Array;
  pt: Uint8Array; pa: Uint8Array; pb: Uint16Array; pp: Int16Array;
}

export { hash } from './mesh-writer.ts';
import { hash } from './mesh-writer.ts';

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

const shade = (k: number[], s: number) => k.map((v) => Math.min(255, v * s));
/** sRGB bytes, shaded, as linear values. */
const lin = (c: number[], s = 1): RGB => {
  const f = (v: number) => { const q = Math.min(1, (v * s) / 255); return q <= 0.04045 ? q / 12.92 : ((q + 0.055) / 1.055) ** 2.4; };
  return [f(c[0]), f(c[1]), f(c[2])];
};

/** A solid of revolution round (cx, cz) from a profile of (radius, y), flat-shaded facets. */
function lathe(W: Writer, cx: number, cz: number, prof: [number, number][], sides: number, c: RGB, kind: number, seed: number, phase = 0) {
  const fac = (p: V3): [number, number, number, number] => [0, 0, p[1], 0];
  for (let j = 0; j + 1 < prof.length; j++) {
    const [r0, y0] = prof[j], [r1, y1] = prof[j + 1];
    for (let i = 0; i < sides; i++) {
      const a0 = phase + (i / sides) * Math.PI * 2, a1 = phase + ((i + 1) / sides) * Math.PI * 2, am = (a0 + a1) / 2;
      const P = (r: number, y: number, a: number): V3 => [cx + r * Math.cos(a), y, cz + r * Math.sin(a)];
      const dr = r1 - r0, dy = y1 - y0, l = Math.hypot(dr, dy) || 1;
      const n: V3 = [Math.cos(am) * (dy / l), -dr / l, Math.sin(am) * (dy / l)];
      const pts: V3[] = [P(r0, y0, a0), P(r0, y0, a1)];
      if (r1 > 1e-4) pts.push(P(r1, y1, a1), P(r1, y1, a0)); else pts.push(P(0, y1, am));
      if (r0 <= 1e-4) { pts.splice(0, 2, P(0, y0, am)); }
      W.face(pts, n, c, fac, kind, 0, 0, seed);
    }
  }
}

/** The outline of a gable standing on the eave, half-width hw, height H, in (along, up) metres: volute, stepped, or a pediment. */
function gableOutline(kind: number, hw: number, H: number): P2[] {
  const right: P2[] = [];
  if (kind === Prop.GableStepped) {
    right.push([hw, 0], [hw, 0.28 * H], [0.74 * hw, 0.28 * H], [0.74 * hw, 0.52 * H], [0.48 * hw, 0.52 * H], [0.48 * hw, 0.76 * H], [0.22 * hw, 0.76 * H], [0.22 * hw, H]);
  } else if (kind === Prop.Pediment) {
    right.push([hw, 0], [hw, 0.3 * H], [hw + 0.15, 0.3 * H], [hw + 0.15, 0.38 * H]);
    for (let i = 1; i <= 3; i++) { const t = i / 4; right.push([(hw + 0.15) * (1 - t), 0.38 * H + 0.62 * H * t]); }
    right.push([0, H]);
  } else {
    // A baroque volute gable: a lower stage under a lip, scrolls in to the upper stage, a segmental cap.
    right.push([hw, 0], [hw, 0.4 * H], [hw + 0.12, 0.4 * H], [hw + 0.12, 0.46 * H], [0.92 * hw, 0.46 * H]);
    right.push([0.9 * hw, 0.49 * H], [0.84 * hw, 0.53 * H], [0.74 * hw, 0.56 * H], [0.64 * hw, 0.555 * H], [0.6 * hw, 0.57 * H]);
    right.push([0.6 * hw, 0.8 * H], [0.68 * hw, 0.8 * H], [0.68 * hw, 0.85 * H], [0.6 * hw, 0.85 * H]);
    for (let i = 1; i <= 3; i++) { const t = i / 4; right.push([0.6 * hw * (1 - t), 0.85 * H + 0.15 * H * Math.sin((t * Math.PI) / 2)]); }
    right.push([0, H]);
  }
  const left = right.slice(0, -1).map(([a, b]) => [-a, b] as P2).reverse();
  return [...right, ...left];
}

export function extrude(f: TileArrays, seed = 0): { main: MeshBuffers; detail: MeshBuffers } {
  const count = f.ring.length - 1;
  const M = new Writer(f.xy.length * 3, f.xy.length * 6);
  const D = new Writer(f.pp.length * 4 + 16, f.pp.length * 6 + 16);
  const colours: { wall: number[]; roof: number[]; tone: number; seed: number; style: number; trim: number; gnd: number; eave: number; sh: number; pal: Palette }[] = [];
  const ORN = new Set<number>([1, 2, 3, 5, 6]);

  for (let b = 0; b < count; b++) {
    const base = f.base[b] / 10, top = f.top[b] / 10, eave = f.eave[b] / 10, gnd = f.gnd[b] / 10;
    const bseed = Math.floor(hash(b * 7919 + seed * 104729) * 256);
    const tone = 0.94 + hash(b * 7919 + seed) * 0.1;
    const wall = [f.wall[b * 3], f.wall[b * 3 + 1], f.wall[b * 3 + 2]];
    const roofC = [f.roof[b * 3], f.roof[b * 3 + 1], f.roof[b * 3 + 2]];
    const landmark = (f.flags[b] & BFlag.Landmark) !== 0;
    const style = f.style[b];
    const bridge = f.kind[b] === 2;
    const eaveRel = eave - gnd;
    // The trim's tone (design.md §8.2), decided here for the shader and the relief alike.
    const trim = !landmark && !bridge && ORN.has(style) ? trimFlags(bseed, wall) : 0;
    const sh = grid(20, eaveRel, style).sh;
    colours.push({ wall, roof: roofC, tone, seed: bseed, style, trim, gnd, eave, sh, pal: new Palette(wall, tone, base - gnd, eaveRel, trim) });
    if (top - base < 0.5) continue;
    const wallKind = bridge ? Surface.Plain : Surface.Wall;
    const r0 = f.ring[b], r1 = f.ring[b + 1];
    const v0 = f.vert[r0], nFoot = f.vert[r1] - v0;

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
        const fl = party | (landmark ? SFlag.Floodlit : 0) | trim;
        // An arcade on a square (design.md §8.3) takes the ground floor: the wall starts at the first floor.
        const arcade = (f.edge[s + i] & EFlag.Arcade) !== 0 && !party && !landmark && !bridge && ORN.has(style) && eaveRel > 5.5 && len >= 4;
        let y0 = base, vb = base - gnd;
        if (arcade) {
          y0 = gnd + sh; vb = sh;
          arcadeGeom(M, ax, az, (bx - ax) / len, (bz - az) / len, nx, nz, len, base, gnd, eaveRel, style, bseed, trim, colours[b].pal);
        }
        const a0 = M.vert(ax, y0, az, nx, 0, nz, wall, tone * (arcade ? 0.9 : 0.8), 0, L, vb, eaveRel, wallKind, style, fl, bseed);
        const b0 = M.vert(bx, y0, bz, nx, 0, nz, wall, tone * (arcade ? 0.9 : 0.8), len, L, vb, eaveRel, wallKind, style, fl, bseed);
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

  // Props: chimneys, dormers, roof boxes; gables, turrets, bays and figures (M14).
  const np = f.pt.length;
  for (let p = 0; p < np; p++) {
    const type = f.pt[p], bi = f.pb[p];
    const x = f.pp[p * 6] / 10, z = f.pp[p * 6 + 1] / 10, y0 = f.pp[p * 6 + 2] / 10, y1 = f.pp[p * 6 + 3] / 10;
    const w = f.pp[p * 6 + 4] / 100, d = f.pp[p * 6 + 5] / 100;
    const ang = (f.pa[p] / 256) * Math.PI * 2;
    const dx = Math.cos(ang), dz = Math.sin(ang);
    const c = colours[bi];
    if (!c) continue;
    if (type === Prop.Chimney) {
      box(D, x, z, y0, y1, w, d, dx, dz, shade(c.wall, c.tone * 0.97), Surface.Chimney, c.seed);
    } else if (type === Prop.RoofBox) {
      const g = 150 + Math.floor(hash(p * 31 + seed) * 40);
      box(D, x, z, y0, y1, w, d, dx, dz, [g, g - 2, g - 6], Surface.Plain, c.seed);
    } else if (type === Prop.Gable || type === Prop.GableStepped || type === Prop.Pediment) {
      gable(D, type, x, z, y0, y1 - y0, w, d, dx, dz, c);
    } else if (type === Prop.Turret) {
      turret(D, x, z, y0, y1, w / 2, d, ang, c);
    } else if (type === Prop.Bay) {
      bay(D, x, z, y0, y1, w, d, dx, dz, c);
    } else if (type === Prop.Figure || type === Prop.Urn) {
      // Built with the relief (relief.ts): 2 m tall, they show only near.
    } else {
      // Dormer: the box reaches back into the roof and a little below it; the front carries a window.
      const fh = y1 - y0;
      const bx = x - dx * (d / 2), bz = z - dz * (d / 2); // box centre (front face at x, z)
      box(D, bx, bz, y0 - 0.4, y1, w, d, dx, dz, shade(c.wall, c.tone), Surface.Plain, c.seed, Surface.DormerFront, true, shade(c.roof, c.tone * 0.8), Surface.FlatRoof);
      // Fix the front's height coordinate to start at the roof line, not 0.4 m below it.
      const front = D.v - 20; // the first four vertices written by box() are the front face
      for (let q = 0; q < 4; q++) D.fac[(front + q) * 4 + 2] -= 0.4, D.fac[(front + q) * 4 + 3] = fh;
      const ax2 = -dz, az2 = dx, roofCol = shade(c.roof, c.tone);
      if (type === Prop.DormerGabled) {
        // A small gabled roof on top, its ridge running back into the main roof.
        const rise = w * 0.42;
        const hw = w / 2 + 0.12;
        const fx = x + dx * 0.15, fz = z + dz * 0.15, rx = x - dx * d, rz = z - dz * d;
        const L = [fx - ax2 * hw, fz - az2 * hw], R = [fx + ax2 * hw, fz + az2 * hw], T = [fx, fz];
        const Lb = [rx - ax2 * hw, rz - az2 * hw], Rb = [rx + ax2 * hw, rz + az2 * hw], Tb = [rx, rz];
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
      } else {
        // A hipped roof on the large dormers (M14): four slopes to a short ridge running back.
        const rise = Math.min(w, d) * 0.36, hw = w / 2 + 0.1;
        const fx = x + dx * 0.12, fz = z + dz * 0.12, rx = x - dx * d, rz = z - dz * d;
        const FL: V3 = [fx - ax2 * hw, y1 - 0.05, fz - az2 * hw], FR: V3 = [fx + ax2 * hw, y1 - 0.05, fz + az2 * hw];
        const BL: V3 = [rx - ax2 * hw, y1 - 0.05, rz - az2 * hw], BR: V3 = [rx + ax2 * hw, y1 - 0.05, rz + az2 * hw];
        const run = Math.max(0, d + 0.12 - 2 * hw * 0.8) / 2, mx = (fx + rx) / 2, mz = (fz + rz) / 2;
        const AF: V3 = [mx + dx * run, y1 + rise, mz + dz * run], AB: V3 = [mx - dx * run, y1 + rise, mz - dz * run];
        const sl = Math.hypot(hw, rise), rc = lin(roofCol);
        const fac = (p: V3): [number, number, number, number] => [(p[0] - FL[0]) * ax2 + (p[2] - FL[2]) * az2, ((p[1] - (y1 - 0.05)) / rise) * sl, sl, 0];
        const nrm = (pts: V3[]): V3 => {
          const [A, B, C] = pts;
          let nx = (B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1]), ny = (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2]), nz = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
          const l = Math.hypot(nx, ny, nz) || 1;
          nx /= l; ny /= l; nz /= l;
          return ny < 0 ? [-nx, -ny, -nz] : [nx, ny, nz];
        };
        for (const pts of [[FL, FR, AF], [FR, BR, AB, AF], [BR, BL, AB], [BL, FL, AF, AB]] as V3[][]) D.face(pts, nrm(pts), rc, fac, Surface.DormerRoof, 0, 0, c.seed);
      }
    }
  }
  return { main: M.finish(), detail: D.finish() };
}

type Colours = { wall: number[]; roof: number[]; tone: number; seed: number; style: number; trim: number; gnd: number; eave: number; sh: number; pal: Palette };

/**
 * A gable standing on the eave in the facade's plane: a slab `d` thick reaching back into the
 * roof, its outline volute, stepped or pedimented, the field in the wall's colour, its coping in
 * the trim's, a window (or two) of dark glass in a pale frame.
 */
function gable(D: Writer, type: number, x: number, z: number, y0: number, H: number, w: number, d: number, dx: number, dz: number, c: Colours) {
  const ux = -dz, uz = dx;
  const fr = new Frame(D, [x, y0, z], [ux, 0, uz], [dx, 0, dz], c.gnd, Surface.Gable, c.style, c.trim, c.seed);
  const shape = gableOutline(type, w / 2, H);
  const field = lin(c.wall, c.tone), coping = c.pal.trim(y0 - c.gnd + H);
  // The front and the back (the back mostly inside the roof) in the wall's colour.
  fr.slab(shape, -d, 0, field, { back: true, sides: false });
  // The sides: the sloping and curved edges as coping in the trim, the vertical ones as wall.
  let area = 0;
  for (let i = 0; i < shape.length; i++) { const j = (i + 1) % shape.length; area += shape[i][0] * shape[j][1] - shape[j][0] * shape[i][1]; }
  const s = Math.sign(area) || 1;
  for (let i = 0; i < shape.length; i++) {
    const j = (i + 1) % shape.length, da = shape[j][0] - shape[i][0], db = shape[j][1] - shape[i][1];
    if (Math.abs(da) + Math.abs(db) < 1e-6 || (Math.abs(db) < 1e-6 && shape[i][1] < 1e-6)) continue;
    const l = Math.hypot(da, db);
    const out: V3 = [(ux * db * s) / l, (-da * s) / l, (uz * db * s) / l];
    const vertical = Math.abs(da) < 0.05 * l;
    fr.face([fr.P(shape[i][0], shape[i][1], -d), fr.P(shape[j][0], shape[j][1], -d), fr.P(shape[j][0], shape[j][1], 0), fr.P(shape[i][0], shape[i][1], 0)], out, vertical ? field : coping);
  }
  // Windows: one in the lower stage, and one above on a tall volute gable.
  const glass = (a: number, b: number, ww: number, hh: number) => {
    const pale = c.pal.trim(y0 - c.gnd + b);
    fr.box(a - ww / 2 - 0.09, a - ww / 2, b - 0.09, b + hh + 0.09, 0, 0.06, pale, { top: false, bottom: false });
    fr.box(a + ww / 2, a + ww / 2 + 0.09, b - 0.09, b + hh + 0.09, 0, 0.06, pale, { top: false, bottom: false });
    fr.box(a - ww / 2 - 0.09, a + ww / 2 + 0.09, b + hh, b + hh + 0.09, 0, 0.06, pale, { bottom: false });
    fr.box(a - ww / 2 - 0.12, a + ww / 2 + 0.12, b - 0.14, b - 0.06, 0, 0.1, pale.map((v) => v * 1.1) as RGB);
    const pts = [fr.P(a - ww / 2, b, 0.02), fr.P(a + ww / 2, b, 0.02), fr.P(a + ww / 2, b + hh, 0.02), fr.P(a - ww / 2, b + hh, 0.02)];
    D.face(pts, [dx, 0, dz], [0.03, 0.036, 0.044], (p) => [(p[0] - pts[0][0]) * ux + (p[2] - pts[0][2]) * uz, p[1] - pts[0][1], ww, hh], Surface.Glass, Glass.Plain, 0, c.seed);
  };
  if (type === Prop.Pediment) glass(0, 0.08 * H, Math.min(1.1, w * 0.22), Math.min(0.9, H * 0.2));
  else {
    const ww = Math.min(1.0, w * 0.2), hh = Math.min(1.5, H * 0.3);
    if (w > 5.2) { glass(-w * 0.2, 0.08 * H, ww, hh); glass(w * 0.2, 0.08 * H, ww, hh); } else glass(0, 0.08 * H, ww, hh);
  }
}

/**
 * A corner turret: a round bay of the wall's style from the first floor through the cornice, on a
 * corbel, under a bell cap with a finial; `ang` is the seam's direction, toward the building.
 */
function turret(D: Writer, x: number, z: number, y0: number, y1: number, r: number, cap: number, ang: number, c: Colours) {
  const sides = 12, L = 2 * Math.PI * r, eaveRel = c.eave - c.gnd;
  const wc = lin(c.wall, c.tone);
  for (let i = 0; i < sides; i++) {
    const a0 = ang + (i / sides) * Math.PI * 2, a1 = ang + ((i + 1) / sides) * Math.PI * 2, am = (a0 + a1) / 2;
    const n: V3 = [Math.cos(am), 0, Math.sin(am)];
    const u0 = (i / sides) * L, u1 = ((i + 1) / sides) * L;
    const P = (a: number, y: number): V3 => [x + r * Math.cos(a), y, z + r * Math.sin(a)];
    const fac = (p: V3): [number, number, number, number] => [0, L, p[1] - c.gnd, eaveRel];
    const pts = [P(a0, y0), P(a1, y0), P(a1, y1), P(a0, y1)];
    const first = D.v;
    D.face(pts, n, wc, fac, Surface.Wall, c.style, c.trim, c.seed);
    // Along the wall: the arc length at each corner.
    D.fac[first * 4] = u0; D.fac[(first + 1) * 4] = u1; D.fac[(first + 2) * 4] = u1; D.fac[(first + 3) * 4] = u0;
  }
  const trim = c.pal.trim(y0 - c.gnd);
  lathe(D, x, z, [[0.25, y0 - 1.4], [0.6, y0 - 0.9], [r * 0.9, y0 - 0.3], [r + 0.08, y0 - 0.12], [r + 0.08, y0]], sides, trim, Surface.Trim, c.seed, ang);
  const roof = lin(c.roof, c.tone * 0.95);
  lathe(D, x, z, [[r + 0.15, y1 - 0.25], [r + 0.15, y1], [r * 1.02, y1 + 0.25 * cap], [r * 0.78, y1 + 0.42 * cap], [r * 0.32, y1 + 0.68 * cap], [0.1, y1 + 0.9 * cap], [0.1, y1 + cap], [0, y1 + cap]], sides, roof, Surface.Plain, c.seed, ang);
  lathe(D, x, z, [[0, y1 + cap - 0.05], [0.16, y1 + cap + 0.12], [0, y1 + cap + 0.3]], 6, trim.map((v) => v * 1.15) as RGB, Surface.Plain, c.seed);
}

/** A bay (oriel) on a block's front: a box one window wide from the first floor to the cornice, its front the wall's, on consoles, under a small roof. */
function bay(D: Writer, x: number, z: number, y0: number, y1: number, w: number, d: number, dx: number, dz: number, c: Colours) {
  const eaveRel = c.eave - c.gnd;
  const first = D.v;
  box(D, x + dx * (d / 2), z + dz * (d / 2), y0, y1, w, d, dx, dz, shade(c.wall, c.tone), Surface.Plain, c.seed, Surface.Wall, true, shade(c.roof, c.tone * 0.9), Surface.Plain);
  // The front's coordinates are the wall's: height above the ground, the eave; the wall's style and trim.
  for (let q = 0; q < 4; q++) {
    D.fac[(first + q) * 4 + 2] = (q < 2 ? y0 : y1) - c.gnd; D.fac[(first + q) * 4 + 3] = eaveRel;
    D.inf[(first + q) * 4 + 1] = c.style; D.inf[(first + q) * 4 + 2] = c.trim;
  }
  const ax = -dz, az = dx, hw = w / 2;
  const fr = new Frame(D, [x - ax * hw, y0, z - az * hw], [ax, 0, az], [dx, 0, dz], c.gnd, Surface.Trim, c.style, c.trim, c.seed);
  const under = lin(c.wall, c.tone * 0.7), trim = c.pal.trim(y0 - c.gnd);
  fr.face([fr.P(0, 0, 0), fr.P(w, 0, 0), fr.P(w, 0, d), fr.P(0, 0, d)], [0, -1, 0], under);
  for (const a of [0.25, w - 0.25]) fr.slab([[a - 0.18, -0.9], [a + 0.18, -0.9], [a + 0.18, 0]].map(([p, q]) => [p, q] as P2), 0, d * 0.85, trim, { convex: true });
  // A hipped cap over the box's top.
  const rc = lin(c.roof, c.tone * 0.9), rise = 0.45;
  const F: V3[] = [fr.P(0, y1 - y0, d), fr.P(w, y1 - y0, d), fr.P(w, y1 - y0, 0), fr.P(0, y1 - y0, 0)];
  const A: V3 = [x + dx * (d / 2), y1 + rise, z + dz * (d / 2)];
  for (let i = 0; i < 4; i++) {
    const P0 = F[i], P1 = F[(i + 1) % 4];
    let nx = (P1[1] - P0[1]) * (A[2] - P0[2]) - (P1[2] - P0[2]) * (A[1] - P0[1]), ny = (P1[2] - P0[2]) * (A[0] - P0[0]) - (P1[0] - P0[0]) * (A[2] - P0[2]), nz = (P1[0] - P0[0]) * (A[1] - P0[1]) - (P1[1] - P0[1]) * (A[0] - P0[0]);
    const l = Math.hypot(nx, ny, nz) || 1;
    if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }
    D.face([P0, P1, A], [nx / l, ny / l, nz / l], rc, (p) => [0, 0, p[1], 0], Surface.Plain, 0, 0, c.seed);
  }
}

/**
 * An arcade on a square (design.md §8.3): piers at the window columns' boundaries, round arches
 * between them, a soffit at the first floor and the back wall 3 m in.
 */
function arcadeGeom(M: Writer, ax: number, az: number, ux: number, uz: number, nx: number, nz: number, len: number, base: number, gnd: number, eaveRel: number, style: number, seed: number, trim: number, pal: Palette) {
  const { n, span, sh } = grid(len, eaveRel, style);
  const fr = new Frame(M, [ax, gnd, az], [ux, 0, uz], [nx, 0, nz], gnd, Surface.Trim, style, trim, seed);
  const pier = pal.trim(1.5).map((v) => v * 0.95) as RGB, soffit = pal.wall_(sh).map((v) => v * 0.6) as RGB, back = pal.wall_(1).map((v) => v * 0.55) as RGB;
  const depth = 3.0, pw = 0.9;
  const piers: P2[] = [[0, pw]];
  if (n >= 2) for (let k = 1; k < n; k++) { const u = 0.4 + k * span; if (u > pw + 1.2 && u < len - pw - 1.2) piers.push([u - pw / 2, u + pw / 2]); }
  piers.push([len - pw, len]);
  let clear = Infinity;
  for (let k = 0; k + 1 < piers.length; k++) clear = Math.min(clear, piers[k + 1][0] - piers[k][1]);
  const rise = Math.min(0.5 * clear, sh * 0.32), ys = sh - 0.25 - rise;
  const vb = base - gnd;
  for (const [a0, a1] of piers) fr.box(a0, a1, vb, ys, -pw, 0, pier, { top: false, bottom: false, back: true });
  for (let k = 0; k + 1 < piers.length; k++) {
    const l = piers[k][1], r = piers[k + 1][0], cx = (l + r) / 2, hw = (r - l) / 2;
    const shape: P2[] = [[l, ys]];
    for (let i = 1; i < 8; i++) { const a = Math.PI - (i / 8) * Math.PI; shape.push([cx + hw * Math.cos(a), ys + rise * Math.sin(a)]); }
    shape.push([r, ys], [r, sh], [l, sh]);
    fr.slab(shape, -pw, 0, pier, { convex: false });
  }
  fr.face([fr.P(0, sh - 0.12, 0), fr.P(len, sh - 0.12, 0), fr.P(len, sh - 0.12, -depth), fr.P(0, sh - 0.12, -depth)], [0, -1, 0], soffit);
  fr.face([fr.P(0, vb, -depth), fr.P(len, vb, -depth), fr.P(len, sh, -depth), fr.P(0, sh, -depth)], [nx, 0, nz], back);
  // The ends, where the arcade meets a neighbour without one.
  for (const a of [0, len]) fr.face([fr.P(a, vb, 0), fr.P(a, vb, -depth), fr.P(a, sh, -depth), fr.P(a, sh, 0)], a === 0 ? [-ux, 0, -uz] : [ux, 0, uz], back);
}
