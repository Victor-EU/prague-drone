// Roofs for footprints (design.md §8.1): the straight skeleton of the footprint, lifted by a height
// profile. Hipped roofs are the skeleton itself; gabled roofs turn the skeleton's triangular end
// faces upright; mansards and domes bend the profile; above a height cap the roof turns flat, as
// the big Prague blocks do. Pyramids and skillions are built directly. Build side only.

import { ShapeUtils, Vector2 } from 'three';
import { skeleton } from './skeleton.ts';
import { Face } from '../../src/core/buildings.ts';

export type Shape = 'flat' | 'hipped' | 'gabled' | 'mansard' | 'gambrel' | 'pyramidal' | 'skillion' | 'dome' | 'onion' | 'round';

export interface RoofSpec {
  shape: Shape;
  /** The main slope in degrees (the upper one of a mansard). */
  pitch: number;
  /** Mansard: the steep lower slope in degrees and its horizontal depth in metres. */
  lower?: number;
  inset?: number;
  /** A tagged roof height in metres, which then sets the slope. */
  height?: number;
  /** The highest the roof may rise above the eave; above it the roof is flat. */
  cap: number;
  /** Which triangular end faces become upright gables, by footprint edge. */
  gable: (edge: number, length: number) => boolean;
  /** Skillion: the azimuth the roof faces (downhill), radians clockwise from north. */
  direction?: number;
}

/**
 * The roof before it is cut into triangles: every vertex (the footprint's first, then the
 * skeleton's) with its position and time t, the faces as vertex lists, and the profile that turns
 * t into height above the eave. Kept for placing chimneys and dormers (tools/lib/props.ts).
 */
export interface RoofModel {
  n: number; // footprint vertices
  X: number[]; Z: number[]; T: number[];
  faces: { verts: number[]; edge: number; kind: number }[];
  h: (t: number) => number;
  breaks: number[];
  tmax: number;
  /** t above which the roof is flat (Infinity when it never is). */
  tcap: number;
  /** Apexes moved onto their edge to make gables: vertex → edge. */
  gables: Map<number, number>;
  /** Skillions carry explicit heights per vertex. */
  H?: number[];
}

export interface Roof {
  /** Vertices beyond the footprint's own: position and height above the eave. */
  x: number[]; z: number[]; h: number[];
  /** Triangles by vertex index: footprint vertices first (at the eave), then the extra ones. */
  faces: { kind: number; edge: number; tris: number[] }[];
  /** Highest point above the eave. */
  height: number;
}

const DEG = Math.PI / 180;

/** Signed area in the x–z plane. */
function ringArea(r: number[]): number {
  let a = 0;
  const n = r.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) a += r[j * 2] * r[i * 2 + 1] - r[i * 2] * r[j * 2 + 1];
  return a / 2;
}

/** The ring and position within it of footprint vertex v, and the vertex after it. */
function nextInRing(v: number, rings: number[][]): number {
  let first = 0;
  for (const r of rings) {
    const n = r.length / 2;
    if (v < first + n) return first + ((v - first + 1) % n);
    first += n;
  }
  return -1;
}

export function roofModel(rings: number[][], spec: RoofSpec): RoofModel | null {
  const n = rings.reduce((a, r) => a + r.length / 2, 0);
  if (spec.shape === 'flat') return null;
  if (spec.shape === 'skillion') return skillion(rings, spec);
  if (spec.shape === 'pyramidal') {
    const p = pyramid(rings, spec);
    if (p) return p;
  }
  const sk = skeleton(rings);
  if (!sk) return null;
  const X = Array.from(sk.x), Z = Array.from(sk.z), T = Array.from(sk.t);
  let tmax = 0;
  for (const t of T) if (!(t >= 0)) return null; else tmax = Math.max(tmax, t);
  if (tmax < 0.3) return null;

  const faces = sk.faces.map((verts, i) => ({ verts, edge: sk.edge[i], kind: Face.Slope as number }));
  if (faces.some((f) => f.edge < 0)) return null;

  // Upright gables: a triangular face whose apex joins exactly three faces moves its apex onto
  // its edge. The neighbouring faces stretch to the gable, and stay planar at right-angled corners.
  const gables = new Map<number, number>();
  const shape = spec.shape;
  const wantsGables = shape === 'gabled' || shape === 'gambrel' || shape === 'round' || shape === 'hipped' || shape === 'mansard';
  if (wantsGables) {
    const degree = new Map<number, number>();
    for (const f of faces) for (const v of f.verts) if (v >= n) degree.set(v, (degree.get(v) ?? 0) + 1);
    for (const f of faces) {
      if (f.verts.length !== 3) continue;
      const apex = f.verts.find((v) => v >= n);
      if (apex === undefined || degree.get(apex) !== 3 || gables.has(apex)) continue;
      const a = f.edge, b = nextInRing(a, rings);
      const ex = X[b] - X[a], ez = Z[b] - Z[a], len = Math.hypot(ex, ez);
      if (len < 3 || !spec.gable(a, len)) continue;
      const s = ((X[apex] - X[a]) * ex + (Z[apex] - Z[a]) * ez) / (len * len);
      if (s < 0.2 || s > 0.8) continue;
      X[apex] = X[a] + ex * s;
      Z[apex] = Z[a] + ez * s;
      gables.set(apex, a);
      f.kind = Face.Gable;
    }
  }

  // The profile.
  let h: (t: number) => number;
  const breaks: number[] = [];
  let tcap = Infinity;
  const cap = spec.height !== undefined ? Math.max(spec.height, 0.5) : spec.cap;
  if (shape === 'mansard' || shape === 'gambrel') {
    const lowerTan = Math.tan((spec.lower ?? 70) * DEG);
    let d1 = Math.min(spec.inset ?? 1.2, tmax * 0.35);
    let upperTan = Math.tan(spec.pitch * DEG);
    if (spec.height !== undefined) {
      d1 = Math.min(d1, (spec.height * 0.8) / lowerTan);
      upperTan = Math.max(0.05, (spec.height - d1 * lowerTan) / Math.max(0.1, tmax - d1));
    }
    const h1 = d1 * lowerTan;
    h = (t) => Math.min(cap, t < d1 ? t * lowerTan : h1 + (t - d1) * upperTan);
    breaks.push(d1);
    if (h(tmax) >= cap) tcap = h1 >= cap ? cap / lowerTan : d1 + (cap - h1) / upperTan;
  } else if (shape === 'dome' || shape === 'onion' || shape === 'round') {
    const H = spec.height ?? (shape === 'onion' ? 1.7 : shape === 'round' ? 0.8 : 1) * tmax;
    const k = shape === 'onion' ? 0.55 : 1;
    h = (t) => {
      const c = Math.max(0, 1 - Math.min(1, t / tmax));
      return H * Math.pow(Math.sqrt(1 - c * c), k);
    };
    for (let i = 1; i < 7; i++) breaks.push(tmax * (1 - Math.cos((i * Math.PI) / 14)));
  } else {
    let tan = Math.tan(spec.pitch * DEG);
    if (spec.height !== undefined) tan = Math.min(Math.tan(72 * DEG), spec.height / tmax);
    h = (t) => Math.min(cap, t * tan);
    if (tmax * tan > cap) tcap = cap / tan;
  }
  if (tcap < tmax) breaks.push(tcap);
  breaks.sort((a, b) => a - b);
  return { n, X, Z, T, faces, h, breaks: breaks.filter((b) => b > 1e-3 && b < tmax - 1e-3), tmax, tcap, gables };
}

/** A pyramid over a star-shaped footprint: every edge rises to one apex. */
function pyramid(rings: number[][], spec: RoofSpec): RoofModel | null {
  if (rings.length !== 1) return null;
  const r = rings[0], n = r.length / 2;
  let cx = 0, cz = 0, a2 = 0;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const f = r[j * 2] * r[i * 2 + 1] - r[i * 2] * r[j * 2 + 1];
    a2 += f; cx += (r[j * 2] + r[i * 2]) * f; cz += (r[j * 2 + 1] + r[i * 2 + 1]) * f;
  }
  if (Math.abs(a2) < 1e-6) return null;
  cx /= 3 * a2; cz /= 3 * a2;
  let inr = Infinity;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const tri = (r[i * 2] - cx) * (r[j * 2 + 1] - cz) - (r[j * 2] - cx) * (r[i * 2 + 1] - cz);
    if (Math.sign(tri) !== Math.sign(a2)) return null; // not star-shaped from the centroid
    const ex = r[j * 2] - r[i * 2], ez = r[j * 2 + 1] - r[i * 2 + 1];
    inr = Math.min(inr, Math.abs(tri) / Math.hypot(ex, ez));
  }
  const tan = Math.tan(spec.pitch * DEG);
  const H = Math.min(spec.height ?? inr * tan, spec.height ?? spec.cap);
  const X = [], Z = [], T = [];
  for (let i = 0; i < n; i++) { X.push(r[i * 2]); Z.push(r[i * 2 + 1]); T.push(0); }
  X.push(cx); Z.push(cz); T.push(H / tan);
  const faces = [];
  for (let i = 0; i < n; i++) faces.push({ verts: [i, (i + 1) % n, n], edge: i, kind: Face.Slope as number });
  return { n, X, Z, T, faces, h: (t) => t * tan, breaks: [], tmax: H / tan, tcap: Infinity, gables: new Map() };
}

/** One sloping plane over the whole footprint, with upright walls filling up to it. */
function skillion(rings: number[][], spec: RoofSpec): RoofModel | null {
  const n = rings.reduce((a, r) => a + r.length / 2, 0);
  const X: number[] = [], Z: number[] = [];
  for (const r of rings) for (let i = 0; i < r.length; i += 2) { X.push(r[i]); Z.push(r[i + 1]); }
  // Downhill direction: tagged, or away from the longest edge of the outer ring.
  let dx: number, dz: number;
  if (spec.direction !== undefined) {
    dx = Math.sin(spec.direction); dz = -Math.cos(spec.direction);
  } else {
    const r = rings[0], m = r.length / 2;
    let best = 0, bx = 1, bz = 0;
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m, ex = r[j * 2] - r[i * 2], ez = r[j * 2 + 1] - r[i * 2 + 1], l = Math.hypot(ex, ez);
      if (l > best) { best = l; bx = ex / l; bz = ez / l; }
    }
    // Perpendicular to the longest edge, pointing into the footprint's interior side.
    const s = Math.sign(ringArea(r)) || 1;
    dx = -bz * s; dz = bx * s;
  }
  let lo = Infinity, hi = -Infinity;
  for (let v = 0; v < n; v++) { const d = X[v] * dx + Z[v] * dz; lo = Math.min(lo, d); hi = Math.max(hi, d); }
  const depth = hi - lo;
  if (depth < 1) return null;
  const H = Math.min(spec.height ?? depth * Math.tan(spec.pitch * DEG), spec.height ?? spec.cap);
  // Height falls toward +d.
  const heightAt = (x: number, z: number) => H * (hi - (x * dx + z * dz)) / depth;
  const Hs = X.map((x, v) => heightAt(x, Z[v]));
  return { n, X, Z, T: new Array(n).fill(0), faces: [], h: () => 0, breaks: [], tmax: depth, tcap: Infinity, gables: new Map(), H: Hs };
}

interface V { x: number; z: number; t: number; id: number }

function clipHalf(poly: V[], c: number, keepAbove: boolean): V[] {
  const out: V[] = [];
  const m = poly.length;
  for (let i = 0; i < m; i++) {
    const a = poly[i], b = poly[(i + 1) % m];
    const da = keepAbove ? a.t - c : c - a.t, db = keepAbove ? b.t - c : c - b.t;
    if (da >= 0) out.push(a);
    if ((da > 0 && db < 0) || (da < 0 && db > 0)) {
      const s = da / (da - db);
      out.push({ x: a.x + (b.x - a.x) * s, z: a.z + (b.z - a.z) * s, t: c, id: -1 });
    }
  }
  return out;
}

/** Cuts the model into triangles, split at the profile's breaks so every piece is planar. */
export function meshRoof(m: RoofModel, rings: number[][]): Roof {
  const out: Roof = { x: [], z: [], h: [], faces: [], height: 0 };
  const key = new Map<string, number>();
  const vid = (v: V, height: number) => {
    if (v.id >= 0 && v.id < m.n && !m.H) return v.id;
    const k = v.id >= 0 ? `#${v.id}` : `${Math.round(v.x * 100)},${Math.round(v.z * 100)},${Math.round(v.t * 1000)}`;
    let i = key.get(k);
    if (i === undefined) {
      i = m.n + out.x.length;
      key.set(k, i);
      out.x.push(v.x); out.z.push(v.z); out.h.push(height);
      out.height = Math.max(out.height, height);
    }
    return i;
  };

  if (m.H) {
    // Skillion: the sloping plane over the triangulated footprint, and upright walls up to it.
    const contour = [], holes: Vector2[][] = [];
    let first = 0;
    for (const [k, r] of rings.entries()) {
      const pts = [];
      for (let i = 0; i < r.length; i += 2) pts.push(new Vector2(r[i], r[i + 1]));
      if (k === 0) contour.push(...pts); else holes.push(pts);
      first += r.length / 2;
    }
    const tris: number[] = [];
    for (const [a, b, c] of ShapeUtils.triangulateShape(contour, holes)) {
      const ids = [a, b, c].map((v) => vid({ x: m.X[v], z: m.Z[v], t: 0, id: v + 1e6 }, m.H![v]));
      tris.push(...ids);
    }
    out.faces.push({ kind: Face.Slope, edge: -1, tris });
    for (let a = 0; a < m.n; a++) {
      const b = nextInRing(a, rings);
      const ha = m.H[a], hb = m.H[b];
      if (ha < 0.05 && hb < 0.05) continue;
      const ta = vid({ x: m.X[a], z: m.Z[a], t: 0, id: a + 1e6 }, ha), tb = vid({ x: m.X[b], z: m.Z[b], t: 0, id: b + 1e6 }, hb);
      const g: number[] = [];
      if (ha >= 0.05) g.push(a, b, ta);
      if (hb >= 0.05) g.push(b, tb, ta);
      out.faces.push({ kind: Face.Gable, edge: a, tris: g });
    }
    return out;
  }

  const slabs = [0, ...m.breaks, Infinity];
  const heightOf = (v: V) => (v.id >= 0 && v.id < m.n ? 0 : m.h(v.t));
  for (const f of m.faces) {
    const poly: V[] = f.verts.map((v) => ({ x: m.X[v], z: m.Z[v], t: m.T[v], id: v }));
    // Triangles of the face: upright gables are triangles already; sloping faces are cut in plan.
    let tris: [V, V, V][];
    if (f.kind === Face.Gable || poly.length === 3) tris = poly.length === 3 ? [[poly[0], poly[1], poly[2]]] : [];
    else {
      const pts = poly.map((p) => new Vector2(p.x, p.z));
      tris = ShapeUtils.triangulateShape(pts, []).map(([a, b, c]) => [poly[a], poly[b], poly[c]] as [V, V, V]);
    }
    const byKind = new Map<number, number[]>();
    for (const tri of tris) {
      for (let s = 0; s + 1 < slabs.length; s++) {
        const lo = slabs[s], hi = slabs[s + 1];
        let piece: V[] = tri;
        if (lo > 0) piece = clipHalf(piece, lo, true);
        if (hi < Infinity && piece.length >= 3) piece = clipHalf(piece, hi, false);
        if (piece.length < 3) continue;
        const kind = f.kind === Face.Gable ? Face.Gable : lo >= m.tcap - 1e-6 ? Face.Flat : Face.Slope;
        const ids = piece.map((p) => vid(p, heightOf(p)));
        const list = byKind.get(kind) ?? byKind.set(kind, []).get(kind)!;
        for (let k = 1; k + 1 < ids.length; k++) {
          if (ids[0] === ids[k] || ids[k] === ids[k + 1] || ids[0] === ids[k + 1]) continue;
          list.push(ids[0], ids[k], ids[k + 1]);
        }
      }
    }
    for (const [kind, list] of byKind) if (list.length) out.faces.push({ kind, edge: kind === Face.Flat ? -1 : f.edge, tris: list });
  }
  return out;
}
