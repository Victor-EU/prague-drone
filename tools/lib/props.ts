// Chimneys, dormers and the boxes on flat roofs (design.md §8.1, rules 3 and 4), and since M14
// the gables on the eaves, the corner turrets, the bays and the attic figures of the fronts,
// placed at build time on the roof model of tools/lib/roofs.ts and shipped as small records; the
// tile worker makes geometry of them (src/world/extrude.ts). Seeds are deterministic from the
// building.

import { Face, Prop, Style, grid } from '../../src/core/buildings.ts';
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

/** The front's facts the gables, turrets, bays and figures (M14) are placed by. */
export interface Front {
  style: number;
  /** Near the river: the embankment blocks carry turrets and figures. */
  river: boolean;
  /** The ground reference, the eave above it, the storey height the shader lays the windows by. */
  gnd: number; eaveRel: number; sh: number;
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
export function placeProps(m: RoofModel, eave: number, rules: PropRules, party: (edge: number) => boolean, next: (v: number) => number, seed: number, front?: Front): PropRec[] {
  const out: PropRec[] = [];
  const rand = rng(seed * 2654435761 + 97);
  if (m.H) return out; // skillions: sheds and garages, bare
  const old = front && (front.style === Style.OldTown || front.style === Style.Baroque);
  const block = front && front.style === Style.Block;
  const roofTop = m.h(m.tmax);
  // The outer ring's vertices, for the corners and the fronts.
  let n0 = 1;
  for (let v = next(0); v !== 0 && v > 0 && n0 < m.n; v = next(v)) n0++;

  // Gables on the eaves (M14, design.md §8.1): on the old town's street fronts of 7 m or more,
  // about one in three; pediments over the embankment blocks' fronts.
  const gables = new Map<number, [number, number]>(); // edge → the interval the gable takes
  if (front && (old || block)) {
    const p = old ? 0.32 : front.river ? 0.35 : 0.18;
    for (const f of m.faces) {
      if (f.kind !== Face.Slope || party(f.edge) || f.edge >= n0 || gables.size >= 2) continue;
      const a = f.edge, b = next(a);
      const ex = m.X[b] - m.X[a], ez = m.Z[b] - m.Z[a], len = Math.hypot(ex, ez);
      if (len < 7 || rand() >= p) continue;
      const ux = ex / len, uz = ez / len;
      let far = f.verts[0];
      for (const v of f.verts) if (m.T[v] > m.T[far]) far = v;
      const side = Math.sign((m.X[far] - m.X[a]) * -uz + (m.Z[far] - m.Z[a]) * ux) || 1;
      const nx = -uz * side, nz = ux * side; // inward
      const w = Math.min(8, Math.max(3.5, len * (block ? 0.42 : 0.55)));
      const H = Math.min(0.45 * w + 0.8, roofTop + 1.5);
      if (H < 2.2) continue;
      const r = rand();
      const type = old ? (r < 0.5 ? Prop.Gable : r < 0.75 ? Prop.GableStepped : Prop.Pediment) : r < 0.7 ? Prop.Pediment : Prop.Gable;
      const u = len / 2;
      out.push({ type, x: m.X[a] + ux * u, z: m.Z[a] + uz * u, y0: eave, y1: eave + H, w, d: 1.2, angle: Math.atan2(-nz, -nx) });
      gables.set(a, [u - w / 2, u + w / 2]);
      // An urn on a pediment's peak, on the blocks.
      if (type === Prop.Pediment && block) out.push({ type: Prop.Urn, x: m.X[a] + ux * u + nx * 0.6, z: m.Z[a] + uz * u + nz * 0.6, y0: eave + H - 0.05, y1: eave + H + 1.2, w: 1.2, d: 0.5, angle: 0 });
    }
  }

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
      // Beside a gable, not behind it.
      const g = gables.get(a);
      const runs: [number, number][] = g ? [[lo, g[0] - 0.6], [g[1] + 0.6, hi]] : [[lo, hi]];
      for (const [rlo, rhi] of runs) {
        const avail = rhi - rlo;
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
          const u = rlo + (i + 0.5) * step;
          out.push({
            type: big && rand() < 0.5 ? Prop.DormerHipped : Prop.DormerGabled,
            x: m.X[a] + ux * u + nx * c0, z: m.Z[a] + uz * u + nz * c0,
            y0: eave + y0, y1: eave + y0 + fh,
            w, d: Math.max(0.6, back - c0 + 0.35),
            angle: Math.atan2(-nz, -nx),
          });
        }
      }
    }
  }

  // The embankment blocks (M14): a corner turret, bays on the fronts, figures on the cornice.
  if (front && block) {
    const { gnd, eaveRel, sh } = front;
    // Outward normals of the outer ring's edges.
    let area = 0;
    for (let v = 0; v < n0; v++) { const w = next(v); area += m.X[v] * m.Z[w] - m.X[w] * m.Z[v]; }
    const sgn = Math.sign(area) || 1;
    const edge = (v: number) => {
      const w = next(v), ex = m.X[w] - m.X[v], ez = m.Z[w] - m.Z[v], len = Math.hypot(ex, ez) || 1;
      return { w, ux: ex / len, uz: ez / len, len, nx: (sgn * ez) / len, nz: (-sgn * ex) / len };
    };
    if (front.river && eaveRel >= 13 && rand() < 0.35) {
      // A corner where two street fronts of 6 m or more meet at a right angle or so.
      let prev = 0;
      for (let v = 0; v < n0; v++) if (next(v) === 0) prev = v;
      for (let v = 0, pv = prev; v < n0; pv = v, v++) {
        const e0 = edge(pv), e1 = edge(v);
        if (party(pv) || party(v) || e0.len < 6 || e1.len < 6) continue;
        const cross = (e0.ux * e1.uz - e0.uz * e1.ux) * sgn, dot = e0.ux * e1.ux + e0.uz * e1.uz;
        if (cross <= 0.5 || dot < -0.5) continue; // convex, 60° to 120° between the fronts
        const mx = e0.nx + e1.nx, mz = e0.nz + e1.nz, ml = Math.hypot(mx, mz) || 1;
        const r = 1.7;
        out.push({ type: Prop.Turret, x: m.X[v] + (mx / ml) * 0.5, z: m.Z[v] + (mz / ml) * 0.5, y0: gnd + sh, y1: eave + 1.6, w: 2 * r, d: 4.2, angle: Math.atan2(-mz, -mx) });
        break;
      }
    }
    const pBay = front.river ? 0.6 : 0.35, pFig = front.river && eaveRel >= 14 ? 0.35 : 0;
    const figures = rand() < pFig;
    for (let v = 0; v < n0; v++) {
      if (party(v)) continue;
      const e = edge(v);
      if (e.len < 10) continue;
      const gr = grid(e.len, eaveRel, front.style);
      if (gr.n >= 3 && gr.nS >= 4 && !gables.has(v) && rand() < pBay) {
        const col = Math.floor((gr.n - 1) / 2), u = 0.4 + (col + 0.5) * gr.span;
        const w = Math.min(gr.A.cell + 0.9, gr.span - 0.3);
        out.push({ type: Prop.Bay, x: m.X[v] + e.ux * u, z: m.Z[v] + e.uz * u, y0: gnd + sh, y1: eave - 0.5, w, d: 1.1, angle: Math.atan2(e.nz, e.nx) });
      }
      if (figures) for (const u of [0.9, e.len - 0.9]) out.push({ type: Prop.Figure, x: m.X[v] + e.ux * u + e.nx * 0.2, z: m.Z[v] + e.uz * u + e.nz * 0.2, y0: eave + 0.02, y1: eave + 2.2, w: 2.2, d: 0.7, angle: Math.atan2(e.nz, e.nx) });
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
