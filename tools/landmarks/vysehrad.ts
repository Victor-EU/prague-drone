// Vyšehrad (design.md §7.1): the brick ramparts of the Baroque fortress round the rock, the
// Leopold Gate in sandstone, the Brick Gate and the Tábor Gate, the Romanesque rotunda of
// St Martin, and the neo-Gothic basilica of Sts Peter and Paul with its two openwork spires.
//
// The ramparts are retaining walls 10 to 15 m high, and the 5 m terrain grid smears each into a
// slope. So each wall is built as a solid rampart: a battered brick face on OSM's wall line
// (barrier=city_wall), a parapet, and the earth walk behind it; the terrain is lowered in front
// of the face (the foot of the wall) and for 7 m behind it, where the walk covers it, so no slope
// of the grid is left in front of the brick (carveRamparts, run by the world build before the
// terrain is written).

import { Kit, mat, rect, ngon, arch, offsetRing, orientedRect, centreOf, type V2, type V3, type Mat } from './kit.ts';
import type { Model, Site } from './index.ts';
import type { Grid } from '../lib/raster.ts';
import type { Ring, Tags } from '../lib/osm.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

const BRICK = mat('#9a7862', Surface.Stone, Stone.Brick, 0.3);
const COPING = mat('#9d8a76', Surface.Stone, Stone.Ashlar, 0.4);
const WALK = mat('#6c7a4b', Surface.Plain);
const SANDSTONE = mat('#ad9f86', Surface.Stone, Stone.Ashlar, 0.55);
const BASILICA = mat('#5b5853', Surface.Stone, Stone.Ashlar, 0.7);
const BASILICA_DARK = mat('#46443f', Surface.Stone, Stone.Ashlar, 0.8);
const SLATE = mat('#3f4448', Surface.Metal, Metal.Slate);
const SPIRE = mat('#303337', Surface.Metal, Metal.Lead);
const RUBBLE = mat('#b3a893', Surface.Stone, Stone.Rubble, 0.45);
const SHINGLE = mat('#5a5048', Surface.Metal, Metal.Lead);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const TRACERY = mat('#6a655c', Surface.Glass, Glass.Tracery);
const ROSE = mat('#6a655c', Surface.Glass, Glass.Rose);
const DARK = mat('#17150f', Surface.Opening);
const WINDOW = mat('#23272b', Surface.Glass, Glass.Plain);

/** The fortress, for picking its walls out of the city's. */
const BOX = { x0: 250, x1: 1050, z0: 2100, z1: 2850 };
/** How far behind the face the terrain is lowered, and how deep the walk on top reaches in. */
const TROUGH = 7.2, WALK_DEPTH = 14.5, FOOT = 6;

/** One stretch of rampart: from a to b, `n` pointing out over the foot, the walk's height at each end and the foot's. */
interface Stretch { a: V2; b: V2; n: V2; Ha: number; Hb: number; Fa: number; Fb: number; retaining: boolean }
interface Line { pts: V2[]; H: number[]; F: number[]; n: V2[]; retaining: boolean[] }

let cached: Line[] | undefined;

/** The Vyšehrad walls as lines of stretches, each with its high and low side measured from the bare terrain. */
export function rampartLines(walls: { tags: Tags; line: Ring }[], bare: (x: number, z: number) => number): Line[] {
  if (cached) return cached;
  const lines: Line[] = [];
  for (const w of walls) {
    if (w.tags.barrier !== 'city_wall' || w.line.length < 4) continue;
    const pts: V2[] = [];
    for (let i = 0; i < w.line.length; i += 2) {
      const p: V2 = [w.line[i], w.line[i + 1]];
      if (pts.length && Math.hypot(p[0] - pts[pts.length - 1][0], p[1] - pts[pts.length - 1][1]) < 0.8) continue;
      pts.push(p);
    }
    if (pts.length < 2 || !pts.every(([x, z]) => x > BOX.x0 && x < BOX.x1 && z > BOX.z0 && z < BOX.z1)) continue;
    // Per stretch: which side is low, and the levels on each side.
    const segs = pts.slice(0, -1).map((a, i) => {
      const b = pts[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz);
      let nx = dz / l, nz = -dx / l;
      const side = (s: number) => {
        const v: number[] = [];
        for (const t of [0.25, 0.5, 0.75]) for (const d of [8, 10, 12, 14]) v.push(bare(a[0] + dx * t + nx * d * s, a[1] + dz * t + nz * d * s));
        return v.sort((p, q) => p - q);
      };
      let hi = side(-1), lo = side(1);
      if (hi[hi.length >> 1] < lo[lo.length >> 1]) { [hi, lo] = [lo, hi]; nx = -nx; nz = -nz; }
      const H = hi[hi.length >> 1], F = lo[0];
      return { n: [nx, nz] as V2, H, F };
    });
    // Levels at the vertices, smoothed along the line.
    const at = (i: number, f: (s: { H: number; F: number }) => number) => {
      let s = 0, c = 0;
      for (let k = i - 3; k <= i + 2; k++) if (k >= 0 && k < segs.length) { s += f(segs[k]); c++; }
      return s / c;
    };
    const H = pts.map((_, i) => at(i, (s) => s.H));
    const F = pts.map((_, i) => at(i, (s) => s.F)).map((f, i) => H[i] - Math.min(16, Math.max(3, H[i] - f)));
    lines.push({ pts, H, F, n: segs.map((s) => s.n), retaining: segs.map((s) => s.H - s.F > 3) });
  }
  cached = lines;
  return lines;
}

function stretches(lines: Line[]): Stretch[] {
  const out: Stretch[] = [];
  for (const L of lines)
    for (let i = 0; i + 1 < L.pts.length; i++)
      out.push({ a: L.pts[i], b: L.pts[i + 1], n: L.n[i], Ha: L.H[i], Hb: L.H[i + 1], Fa: L.F[i], Fb: L.F[i + 1], retaining: L.retaining[i] });
  return out;
}

/**
 * Lowers the terrain along the ramparts: at the foot in front of each face, and in the band just
 * behind it that the walk on top covers, so the grid's slopes stay behind the brick.
 */
export function carveRamparts(lines: Line[], ground: Grid<Float32Array>): number {
  const S = stretches(lines).filter((s) => s.retaining);
  let changed = 0;
  const reach = Math.max(FOOT, TROUGH) + 1;
  for (const s of S) {
    const x0 = Math.min(s.a[0], s.b[0]) - reach, x1 = Math.max(s.a[0], s.b[0]) + reach;
    const z0 = Math.min(s.a[1], s.b[1]) - reach, z1 = Math.max(s.a[1], s.b[1]) + reach;
    for (let j = Math.ceil((z0 - ground.z0) / ground.cell); j <= Math.floor((z1 - ground.z0) / ground.cell); j++)
      for (let i = Math.ceil((x0 - ground.x0) / ground.cell); i <= Math.floor((x1 - ground.x0) / ground.cell); i++) {
        if (i < 0 || j < 0 || i >= ground.nx || j >= ground.nz) continue;
        const x = ground.x0 + i * ground.cell, z = ground.z0 + j * ground.cell;
        const dx = s.b[0] - s.a[0], dz = s.b[1] - s.a[1], l2 = dx * dx + dz * dz;
        const t = ((x - s.a[0]) * dx + (z - s.a[1]) * dz) / l2;
        if (t < -0.05 || t > 1.05) continue;
        const tc = Math.min(1, Math.max(0, t));
        const d = (x - s.a[0] - dx * tc) * s.n[0] + (z - s.a[1] - dz * tc) * s.n[1];
        if (d < -TROUGH || d > FOOT) continue;
        const F = s.Fa + (s.Fb - s.Fa) * tc;
        const k = j * ground.nx + i;
        if (ground.data[k] > F) { ground.data[k] = F; changed++; }
      }
  }
  return changed;
}

/** The ramparts: battered brick faces, parapets, the walks behind; free-standing walls where the ground is level. */
function buildRamparts(k: Kit, d: Kit, lines: Line[], site: Site) {
  for (const L of lines) {
    const n = L.pts.length;
    for (let i = 0; i + 1 < n; i++) {
      const [ax, az] = L.pts[i], [bx, bz] = L.pts[i + 1], [nx, nz] = L.n[i];
      if (!L.retaining[i]) {
        const y0a = site.bare(ax, az) - 1, y0b = site.bare(bx, bz) - 1, h = 4;
        for (const s of [1, -1]) {
          const o = 0.45 * s;
          k.poly([[ax + nx * o, y0a, az + nz * o], [bx + nx * o, y0b, bz + nz * o], [bx + nx * o, y0b + h + 1, bz + nz * o], [ax + nx * o, y0a + h + 1, az + nz * o]], BRICK, { normal: [nx * s, 0, nz * s] });
        }
        k.poly([[ax - nx * 0.45, y0a + h + 1, az - nz * 0.45], [ax + nx * 0.45, y0a + h + 1, az + nz * 0.45], [bx + nx * 0.45, y0b + h + 1, bz + nz * 0.45], [bx - nx * 0.45, y0b + h + 1, bz - nz * 0.45]], COPING, { normal: [0, 1, 0] });
        continue;
      }
      const Ha = L.H[i], Hb = L.H[i + 1], Fa = L.F[i] - 1.5, Fb = L.F[i + 1] - 1.5;
      // The battered face, from the foot a metre and a half out up to the parapet's foot on the line.
      k.poly([[ax + nx * 1.5, Fa, az + nz * 1.5], [bx + nx * 1.5, Fb, bz + nz * 1.5], [bx, Hb, bz], [ax, Ha, az]], BRICK, { normal: [nx, 0.1, nz] });
      // Parapet: outer and inner faces, coping.
      const P = 1.1, T = 0.7;
      k.poly([[ax, Ha, az], [bx, Hb, bz], [bx, Hb + P, bz], [ax, Ha + P, az]], BRICK, { normal: [nx, 0, nz] });
      k.poly([[bx - nx * T, Hb, bz - nz * T], [ax - nx * T, Ha, az - nz * T], [ax - nx * T, Ha + P, az - nz * T], [bx - nx * T, Hb + P, bz - nz * T]], BRICK, { normal: [-nx, 0, -nz] });
      k.poly([[ax, Ha + P, az], [bx, Hb + P, bz], [bx - nx * T, Hb + P, bz - nz * T], [ax - nx * T, Ha + P, az - nz * T]], COPING, { normal: [0, 1, 0] });
      // The walk behind, down to the terrain at its inner edge.
      const ia: V2 = [ax - nx * WALK_DEPTH, az - nz * WALK_DEPTH], ib: V2 = [bx - nx * WALK_DEPTH, bz - nz * WALK_DEPTH];
      const ga = Math.min(site.bare(ia[0], ia[1]), Ha + 3), gb = Math.min(site.bare(ib[0], ib[1]), Hb + 3);
      k.poly([[ax - nx * T, Ha, az - nz * T], [bx - nx * T, Hb, bz - nz * T], [ib[0], gb + 0.15, ib[1]], [ia[0], ga + 0.15, ia[1]]], WALK, { normal: [0, 1, 0] });
      // Where the line bends away from the walk, fill the wedge between this stretch's walk and the next.
      if (i + 2 < n) {
        const [cx, cz] = L.pts[i + 2], tx = cx - bx, tz = cz - bz;
        const [mx, mz] = L.n[i + 1];
        if (tx * -nx + tz * -nz < -0.05 && L.retaining[i + 1]) {
          const fan: V3[] = [[bx, Hb, bz]];
          const a0 = Math.atan2(-nz, -nx), a1 = Math.atan2(-mz, -mx);
          let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
          for (let q = 0; q <= 4; q++) {
            const a = a0 + (da * q) / 4, px = bx + Math.cos(a) * WALK_DEPTH, pz = bz + Math.sin(a) * WALK_DEPTH;
            fan.push([px, Math.min(site.bare(px, pz), Hb + 3) + 0.15, pz]);
          }
          k.poly(fan, WALK, { normal: [0, 1, 0] });
        }
      }
      // Open ends of a wall: an end face.
      for (const [end, px, pz, H, F] of [[i === 0, ax, az, Ha, Fa], [i + 2 === n, bx, bz, Hb, Fb]] as [boolean, number, number, number, number][]) {
        if (!end) continue;
        const tx = bx - ax, tz = bz - az, l = Math.hypot(tx, tz), sgn = px === ax ? -1 : 1;
        k.poly([[px + nx * 1.5, F, pz + nz * 1.5], [px - nx * WALK_DEPTH, F, pz - nz * WALK_DEPTH], [px - nx * WALK_DEPTH, H, pz - nz * WALK_DEPTH], [px, H + P, pz]], BRICK, { normal: [(tx / l) * sgn, 0, (tz / l) * sgn] });
      }
    }
  }
  void d;
}

/** The basilica of Sts Peter and Paul: two openwork spires over the west front, nave and aisles, apse. */
function basilica(k: Kit, d: Kit, site: Site) {
  const r = orientedRect(site.feature('way/24376643')!.polygons[0].outer);
  let bearing = r.w > r.d ? r.bearing : r.bearing + 90;
  if (Math.abs(((bearing - 93 + 540) % 360) - 180) > 90) bearing += 180;
  const g = site.bare(r.cx, r.cz);
  for (const kit of [k, d]) { kit.push().place(r.cx, g, r.cz, bearing); kit.ground = g; }
  const L = Math.max(r.w, r.d);
  const west = -L / 2, east = L / 2;
  const t1 = centreOf(site.feature('way/454748868')!.polygons[0].outer), t2 = centreOf(site.feature('way/454748870')!.polygons[0].outer);
  const lt = [k.local(t1[0], g, t1[1]), k.local(t2[0], g, t2[1])];
  const hv = 5.6;
  const nave: V2[] = [[west + 3, hv], [west + 3, -hv], [east - 8, -hv]];
  for (let q = 1; q < 4; q++) { const a = -Math.PI / 2 + (q * Math.PI) / 4; nave.push([east - 8 + hv * Math.cos(a), hv * Math.sin(a)]); }
  nave.push([east - 8, hv]);
  k.prism(nave, -2, 20, BASILICA, null);
  k.roof(nave, 20, { shape: 'gabled', pitch: 58, cap: 99, gable: (e) => e === 0 }, SLATE, BASILICA);
  for (const sz of [-1, 1]) {
    const aisle: V2[] = [[west + 9, sz * hv], [east - 9, sz * hv], [east - 9, sz * 14], [west + 9, sz * 14]];
    k.prism(aisle, -2, 11, BASILICA, null);
    k.roof(aisle, 11, { shape: 'skillion', pitch: 35, cap: 99, gable: () => false, direction: (((bearing + sz * 90) % 360 + 360) % 360) * Math.PI / 180 }, SLATE, BASILICA);
    for (let x = west + 12; x < east - 11; x += 5.5) {
      k.plate([x, 3, sz * 14], [sz, 0, 0], [0, 1, 0], arch(1.8, 6.5, 'pointed', 1.3), TRACERY, 0.04);
      k.plate([x, 13, sz * hv], [sz, 0, 0], [0, 1, 0], arch(1.6, 5.5, 'pointed', 1.2), TRACERY, 0.04);
      k.box(x + 2.75, sz * 14.6, 1.0, 1.2, -2, 10, BASILICA_DARK, null);
    }
  }
  k.plate([west + 3, 11, 0], [0, 0, 1], [0, 1, 0], ngon(20, 3, 0).map(([a, b]) => [a, b + 3] as V2), ROSE, 0.05);
  // The towers: square to 40 m, then openwork spires to 58 m with pinnacles round their foot.
  for (const t of lt) {
    for (const kit of [k, d]) kit.push().at(t[0], 0, t[2]);
    const body = rect(6.8, 6.8);
    k.prism(body, -2, 40, BASILICA, null);
    for (const y of [11, 22, 31]) k.prism(offsetRing(body, 0.15), y, y + 0.4, BASILICA_DARK, BASILICA_DARK);
    for (const [x, z] of offsetRing(body, 0.2)) {
      k.box(x, z, 1.1, 1.1, -2, 38, BASILICA_DARK, null);
      k.box(x, z, 0.8, 0.8, 38, 42, BASILICA, null);
      k.pyramid(rect(0.9, 0.9, x, z), 42, 45, SPIRE);
    }
    for (const [o, u] of [[[0, 0, 3.4], [1, 0, 0]], [[0, 0, -3.4], [-1, 0, 0]], [[3.4, 0, 0], [0, 0, -1]], [[-3.4, 0, 0], [0, 0, 1]]] as [V3, V3][]) {
      k.plate([o[0], 32, o[2]], u, [0, 1, 0], arch(1.8, 6.5, 'pointed', 1.3), DARK, 0.04);
      k.plate([o[0], 22.5, o[2]], u, [0, 1, 0], arch(1.2, 5, 'pointed', 0.9), TRACERY, 0.04);
      k.slab([o[0], 40, o[2]], u, [0, 1, 0], [[-2.6, 0], [2.6, 0], [0, 3.6]], 0.4, BASILICA);
    }
    k.lathe(0, 0, [[3.0, 40], [2.0, 47], [1.0, 53], [0, 58.5]], 8, SPIRE, { flat: true, phase: 22.5 });
    for (let q = 0; q < 8; q++) {
      const a = ((q + 0.5) * Math.PI) / 4;
      d.beam([Math.cos(a) * 3.1, 40.3, Math.sin(a) * 3.1], [Math.cos(a) * 0.15, 58.2, Math.sin(a) * 0.15], 0.28, BASILICA_DARK);
    }
    d.lathe(0, 0, [[0.06, 58.3], [0.05, 60.2]], 4, GOLD);
    d.beam([0, 59.6, -0.5], [0, 59.6, 0.5], 0.1, GOLD);
    for (const kit of [k, d]) kit.pop();
  }
  for (const kit of [k, d]) kit.pop();
}

/** A gate in the local frame: a block w by dep, h high, a round passage through the faces along z. */
function gateBlock(k: Kit, w: number, dep: number, y0: number, h: number, m: Mat, pw: number, ph: number, top: Mat) {
  k.prism(rect(w, dep), y0, h, m, top);
  for (const s of [1, -1]) {
    k.plate([0, y0 + 1.5, (s * dep) / 2], [s, 0, 0], [0, 1, 0], arch(pw + 1.0, ph + 0.6, 'round'), COPING, 0.04);
    k.plate([0, y0 + 1.5, (s * dep) / 2], [s, 0, 0], [0, 1, 0], arch(pw, ph, 'round'), DARK, 0.07);
  }
}

export const vysehrad: Model = {
  id: 'vysehrad-basilica',
  covers: ['leopold-gate'],
  replaces: ['way/51700613', 'way/49811189', 'way/560209917'],
  build(site: Site, k: Kit, d: Kit) {
    k.seed = d.seed = 113;
    k.place(0, 0, 0); d.place(0, 0, 0);
    buildRamparts(k, d, rampartLines(site.walls, site.bare), site);
    basilica(k, d, site);

    // The Leopold Gate: rusticated sandstone, a round arch between pilasters, an attic and a broken pediment.
    {
      const r = orientedRect(site.feature('way/51718887')!.polygons[0].outer);
      const g = site.bare(r.cx, r.cz);
      for (const kit of [k, d]) { kit.push().place(r.cx, g, r.cz, r.bearing); kit.ground = g; }
      gateBlock(k, 9.5, 4.2, -1.5, 8.5, SANDSTONE, 3.4, 5.2, COPING);
      k.prism(rect(10.3, 5.0), 8.5, 9.3, COPING, COPING);
      k.prism(rect(6.5, 3.2), 9.3, 11.2, SANDSTONE, COPING);
      for (const s of [1, -1]) {
        for (const x of [-3.4, 3.4]) k.box(x, (s * 4.2) / 2 + s * 0.2, 1.0, 0.4, -1.5, 8.5, COPING, null);
        k.slab([0, 11.2, (s * 3.2) / 2], [s, 0, 0], [0, 1, 0], [[-3.5, 0], [-0.8, 0], [-0.8, 1.2], [-3.5, 0.2]], 0.5, COPING);
        k.slab([0, 11.2, (s * 3.2) / 2], [s, 0, 0], [0, 1, 0], [[0.8, 0], [3.5, 0], [3.5, 0.2], [0.8, 1.2]], 0.5, COPING);
      }
      d.lathe(0, 0, [[0, 11.2], [0.5, 11.2], [0.4, 12.5], [0, 13]], 6, COPING, { flat: true });
      for (const kit of [k, d]) kit.pop();
    }
    // The Brick Gate and the Tábor Gate, on their footprints.
    for (const [key, m, h] of [['way/51700613', BRICK, 11], ['way/49811189', SANDSTONE, 9]] as [string, Mat, number][]) {
      const r = orientedRect(site.feature(key)!.polygons[0].outer);
      const g = site.bare(r.cx, r.cz);
      for (const kit of [k, d]) { kit.push().place(r.cx, g, r.cz, r.bearing); kit.ground = g; }
      gateBlock(k, r.w, r.d, -2, h, m, 4.2, 5.4, WALK);
      for (const s of [1, -1]) for (const x of [-4.2, 0, 4.2]) if (r.w > 12) k.plate([x, 7, (s * r.d) / 2], [s, 0, 0], [0, 1, 0], arch(1.4, 2.4, 'round'), DARK, 0.05);
      for (const kit of [k, d]) kit.pop();
    }
    // The rotunda of St Martin: a round nave with a conical roof and lantern, an apse to the east.
    {
      const c = centreOf(site.feature('way/560209917')!.polygons[0].outer);
      const g = site.bare(c[0], c[1]);
      for (const kit of [k, d]) { kit.push().place(c[0], g, c[1], 90); kit.ground = g; }
      k.lathe(0, 0, [[4.0, -1], [4.0, 7.5]], 20, RUBBLE);
      k.lathe(0, 0, [[4.4, 7.5], [2.2, 10.3], [1.0, 11], [0, 11]], 20, SHINGLE);
      k.lathe(0, 0, [[0.85, 10.8], [0.85, 12.6]], 8, RUBBLE, { flat: true });
      k.lathe(0, 0, [[1.1, 12.6], [0, 14.2]], 8, SHINGLE, { flat: true });
      d.lathe(0, 0, [[0.05, 14], [0.04, 15.3]], 4, GOLD);
      k.push().at(4.2, 0, 0);
      k.lathe(0, 0, [[2.3, -1], [2.3, 5.2]], 12, RUBBLE);
      k.lathe(0, 0, [[2.6, 5.2], [0, 7.6]], 12, SHINGLE);
      k.pop();
      for (let q = 0; q < 3; q++) {
        const a = (Math.PI / 2) * (q + 1.5);
        k.plate([4.02 * Math.cos(a), 3.2, 4.02 * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], [0, 1, 0], arch(0.5, 1.5, 'round'), WINDOW, 0.03);
      }
      for (const kit of [k, d]) kit.pop();
    }
  },
};
