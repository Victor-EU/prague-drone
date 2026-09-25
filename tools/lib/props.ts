// Chimneys, dormers and the boxes on flat roofs (design.md §8.1, rules 3 and 4), placed at build
// time on the roof model of tools/lib/roofs.ts and shipped as small records; the app makes boxes
// of them. Seeds are deterministic from the building.

import { Face, Prop } from '../../src/core/buildings.ts';
import type { RoofModel } from './roofs.ts';

export interface PropRec {
  type: number;
  /** Centre of the base: for dormers the middle of the front wall's foot, on the roof. */
  x: number; z: number;
  y0: number; y1: number;
  /** Width (across) and depth (along the facing), metres. */
  w: number; d: number;
  /** The direction the front faces, radians in the x–z plane (atan2(z, x)). */
  angle: number;
}

export interface PropRules {
  /** Dormers per 10 m of eave (design.md §8.1: 0.4 to 1.2 in the core). */
  dormers: number;
  /** Chimneys: how many for a building of about 150 m² of roof, and the chance per party gable. */
  chimneys: number;
  partyChimney: number;
}

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** Where the face crosses the line at distance c from its edge: intervals along the edge. */
function crossSection(us: number[], ws: number[], c: number): [number, number][] {
  const xs: number[] = [];
  const m = us.length;
  for (let i = 0; i < m; i++) {
    const j = (i + 1) % m;
    const a = ws[i] - c, b = ws[j] - c;
    if ((a > 0 && b <= 0) || (a <= 0 && b > 0)) xs.push(us[i] + ((us[j] - us[i]) * a) / (a - b));
  }
  xs.sort((p, q) => p - q);
  const out: [number, number][] = [];
  for (let k = 0; k + 1 < xs.length; k += 2) out.push([xs[k], xs[k + 1]]);
  return out;
}

function widest(iv: [number, number][]): [number, number] | null {
  let best: [number, number] | null = null;
  for (const i of iv) if (!best || i[1] - i[0] > best[1] - best[0]) best = i;
  return best;
}

/** The t at which the profile reaches height y (the profile rises with t). */
function invert(m: RoofModel, y: number): number {
  let lo = 0, hi = m.tmax;
  if (m.h(hi) < y) return Infinity;
  for (let k = 0; k < 30; k++) {
    const mid = (lo + hi) / 2;
    if (m.h(mid) < y) lo = mid; else hi = mid;
  }
  return hi;
}

/**
 * Props of one building. `eave` is the absolute eave height; `party(edge)` tells party walls;
 * `next(v)` gives the footprint vertex after v in its ring.
 */
export function placeProps(m: RoofModel, eave: number, rules: PropRules, party: (edge: number) => boolean, next: (v: number) => number, seed: number): PropRec[] {
  const out: PropRec[] = [];
  const rand = rng(seed * 2654435761 + 97);
  if (m.H) return out; // skillions: sheds and garages, bare

  // Dormers, along the eaves of sloping faces that face a street or a courtyard.
  if (rules.dormers > 0) {
    let small = rand() < 0.5;
    for (const f of m.faces) {
      if (f.kind !== Face.Slope || party(f.edge)) continue;
      const a = f.edge, b = next(a);
      const ex = m.X[b] - m.X[a], ez = m.Z[b] - m.Z[a], len = Math.hypot(ex, ez);
      if (len < 5) continue;
      const ux = ex / len, uz = ez / len;
      // Inward is the side the face's far vertices lie on.
      let far = f.verts[0];
      for (const v of f.verts) if (m.T[v] > m.T[far]) far = v;
      const side = Math.sign((m.X[far] - m.X[a]) * -uz + (m.Z[far] - m.Z[a]) * ux) || 1;
      const nx = -uz * side, nz = ux * side;
      const us = f.verts.map((v) => (m.X[v] - m.X[a]) * ux + (m.Z[v] - m.Z[a]) * uz);
      const ws = f.verts.map((v) => (m.X[v] - m.X[a]) * nx + (m.Z[v] - m.Z[a]) * nz);
      // The slope just above the eave decides the dormer's depth.
      const slope = (m.h(0.5) - m.h(0)) / 0.5;
      if (slope < Math.tan(28 * Math.PI / 180)) continue;
      const steep = slope > Math.tan(60 * Math.PI / 180); // the lower part of a mansard
      const c0 = steep ? 0.25 : 0.7 + rand() * 0.5;
      const y0 = m.h(c0);
      const fhMax = (steep ? 2.2 : 2.0);
      const c1 = invert(m, y0 + fhMax);
      if (!(c1 < m.tcap) || c1 > m.tmax * 0.92) continue;
      const i0 = widest(crossSection(us, ws, c0)), i1 = widest(crossSection(us, ws, c1));
      if (!i0 || !i1) continue;
      const lo = Math.max(i0[0], i1[0]) + 0.9, hi = Math.min(i0[1], i1[1]) - 0.9;
      const avail = hi - lo;
      if (avail < 1.6) continue;
      const k = Math.floor((rules.dormers * avail) / 10 + rand());
      if (k <= 0) continue;
      const step = avail / k;
      for (let i = 0; i < k; i++) {
        const big = !small;
        small = !small;
        let w = big ? 2.4 + rand() * 0.9 : 1.3 + rand() * 0.4;
        w = Math.min(w, step - 0.7);
        if (w < 1.1) continue;
        const fh = big ? fhMax * (0.9 + rand() * 0.1) : fhMax * (0.78 + rand() * 0.1);
        const back = invert(m, y0 + fh);
        const u = lo + (i + 0.5) * step;
        out.push({
          type: big && rand() < 0.5 ? Prop.DormerFlat : Prop.DormerGabled,
          x: m.X[a] + ux * u + nx * c0, z: m.Z[a] + uz * u + nz * c0,
          y0: eave + y0, y1: eave + y0 + fh,
          w, d: Math.max(0.6, back - c0 + 0.35),
          angle: Math.atan2(-nz, -nx),
        });
      }
    }
  }

  // Chimneys: on the ridges, and on the tops of party gables.
  const ridge: number[] = [];
  for (let v = m.n; v < m.X.length; v++) if (m.T[v] >= m.tmax * 0.6 && !m.gables.has(v)) ridge.push(v);
  let count = Math.floor(rules.chimneys + rand());
  const chimney = (x: number, z: number, top: number, dirx: number, dirz: number) => {
    const w = 0.55 + rand() * 0.25, d = 0.8 + rand() * 0.9;
    const rise = 1.0 + rand() * 0.9;
    out.push({ type: Prop.Chimney, x, z, y0: top - 1.4, y1: top + rise, w, d, angle: Math.atan2(dirz, dirx) });
  };
  for (const [apex, edge] of m.gables) {
    if (!party(edge) || rand() >= rules.partyChimney) continue;
    const b = next(edge);
    const ex = m.X[b] - m.X[edge], ez = m.Z[b] - m.Z[edge], len = Math.hypot(ex, ez);
    // Step off the gable's plane into the roof.
    let nx = -ez / len, nz = ex / len;
    const cx = m.X[apex], cz = m.Z[apex];
    let other = -1;
    for (const f of m.faces) if (f.verts.includes(apex)) for (const v of f.verts) if (v >= m.n && v !== apex) other = v;
    if (other >= 0 && (m.X[other] - cx) * nx + (m.Z[other] - cz) * nz < 0) { nx = -nx; nz = -nz; }
    chimney(cx + nx * 0.5, cz + nz * 0.5, eave + m.h(m.T[apex]), ex / len, ez / len);
    count--;
  }
  for (let k = 0; k < count && ridge.length; k++) {
    const v = ridge[Math.floor(rand() * ridge.length)];
    // Along a ridge line from this vertex, if there is one.
    let tx = 1, tz = 0, reach = 0;
    for (const f of m.faces) {
      const i = f.verts.indexOf(v);
      if (i < 0) continue;
      for (const w of [f.verts[(i + 1) % f.verts.length], f.verts[(i + f.verts.length - 1) % f.verts.length]]) {
        if (w < m.n || Math.abs(m.T[w] - m.T[v]) > 0.3) continue;
        const dx = m.X[w] - m.X[v], dz = m.Z[w] - m.Z[v], l = Math.hypot(dx, dz);
        if (l > reach) { reach = l; tx = dx / l; tz = dz / l; }
      }
    }
    const s = reach > 1.5 ? (0.15 + rand() * 0.7) * reach : 0;
    chimney(m.X[v] + tx * s, m.Z[v] + tz * s, eave + m.h(m.T[v]), tx, tz);
  }
  return out;
}

/** Machine rooms and vents on a flat roof: a few boxes inside the footprint. */
export function flatRoofBoxes(rings: number[][], area: number, top: number, inside: (x: number, z: number) => boolean, seed: number): PropRec[] {
  const out: PropRec[] = [];
  if (area < 250) return out;
  const rand = rng(seed * 40503 + 11);
  const r = rings[0];
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < r.length; i += 2) {
    minX = Math.min(minX, r[i]); maxX = Math.max(maxX, r[i]);
    minZ = Math.min(minZ, r[i + 1]); maxZ = Math.max(maxZ, r[i + 1]);
  }
  // Align with the longest edge.
  let best = 0, angle = 0;
  for (let i = 0; i < r.length / 2; i++) {
    const j = (i + 1) % (r.length / 2), ex = r[j * 2] - r[i * 2], ez = r[j * 2 + 1] - r[i * 2 + 1];
    if (Math.hypot(ex, ez) > best) { best = Math.hypot(ex, ez); angle = Math.atan2(ez, ex); }
  }
  const want = Math.min(4, 1 + Math.floor(area / 900 + rand()));
  for (let tries = 0; tries < want * 6 && out.length < want; tries++) {
    const x = minX + rand() * (maxX - minX), z = minZ + rand() * (maxZ - minZ);
    const w = 2 + rand() * 4, d = 2 + rand() * 3;
    const ca = Math.cos(angle), sa = Math.sin(angle);
    const ok = [[-1, -1], [1, -1], [1, 1], [-1, 1]].every(([p, q]) => {
      const a = p * (w / 2 + 1), b = q * (d / 2 + 1);
      return inside(x + a * ca - b * sa, z + a * sa + b * ca);
    });
    if (!ok) continue;
    out.push({ type: Prop.RoofBox, x, z, y0: top - 0.2, y1: top + 1.4 + rand() * 1.8, w, d, angle: angle + Math.PI / 2 });
  }
  return out;
}
