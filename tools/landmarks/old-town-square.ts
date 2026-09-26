// The Old Town Square set (design.md §7.1, M14): the row 8607, 8608 and 8609 look at, on its OSM
// footprints and parts. The Kinský palace (rococo: pilasters, an entablature, the two pavilions
// under segmental pediments, a balustraded attic with statues and urns, portals with balconies, a
// mansard roof); the Stone Bell house (Gothic ashlar, traceried windows, the corner bell, the steep
// roof); the Týn school (an arcade of pointed arches, three storeys of windows, the two Venetian
// gables of stacked arcs). None is one of §6.2's landmarks; none carries a name on the screen.

import { Kit, mat, arch, offsetRing, PROFILE, type Mat, type V2, type V3 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style, SFlag, grid } from '../../src/core/buildings.ts';
import { pilaster, entablature, pediment, balustrade, statue, traceryWindow, surround } from './ornament.ts';

const DARK = mat('#1e2226', Surface.Glass, Glass.Plain);
const SLATE = mat('#3f4247', Surface.Metal, Metal.Slate);

/** The Hus memorial, the middle of the square, in world x, z. */
const SQUARE: V2 = [710, -131];

/**
 * Places the kits on a building's front: the footprint edge facing `towards` most, the origin at
 * its left end (seen from outside) on the bare ground, local +x along the front and +z out of it.
 * Returns the front's length, the footprint in the local frame, and the ground.
 */
function front(site: Site, kits: Kit[], key: string, towards: V2 = SQUARE): { L: number; ring: V2[]; g: number } {
  const o = site.feature(key)!.polygons[0].outer, n = o.length / 2;
  let area = 0;
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += o[i * 2] * o[j * 2 + 1] - o[j * 2] * o[i * 2 + 1]; }
  const sgn = Math.sign(area) || 1;
  let best = -Infinity, bi = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, ex = o[j * 2] - o[i * 2], ez = o[j * 2 + 1] - o[i * 2 + 1], len = Math.hypot(ex, ez);
    if (len < 3) continue;
    const nx = (sgn * ez) / len, nz = (-sgn * ex) / len;
    const mx = (o[i * 2] + o[j * 2]) / 2, mz = (o[i * 2 + 1] + o[j * 2 + 1]) / 2;
    const dx = towards[0] - mx, dz = towards[1] - mz, dl = Math.hypot(dx, dz) || 1;
    const score = ((nx * dx + nz * dz) / dl) * Math.sqrt(len);
    if (score > best) { best = score; bi = i; }
  }
  const j = (bi + 1) % n, ex = o[j * 2] - o[bi * 2], ez = o[j * 2 + 1] - o[bi * 2 + 1], len = Math.hypot(ex, ez);
  const nx = (sgn * ez) / len, nz = (-sgn * ex) / len;
  // Local +z along the outward normal; +x then runs (nz, −nx), to the right seen from outside.
  const bearing = (Math.atan2(nz, nx) * 180) / Math.PI;
  const ax = o[bi * 2], az = o[bi * 2 + 1];
  const g = site.bare(ax, az);
  for (const k of kits) { k.place(ax, g, az, bearing); k.ground = g; }
  let ring: V2[] = [];
  for (let i = 0; i < n; i++) { const l = kits[0].local(o[i * 2], 0, o[i * 2 + 1]); ring.push([l[0], l[2]]); }
  // The front: the footprint's extent along x at z near 0, and the origin at its left end.
  let x0 = Infinity, x1 = -Infinity;
  for (const [x, z] of ring) if (Math.abs(z) < 0.8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  if (x0 !== 0) {
    for (const k of kits) k.at(x0, 0, 0);
    ring = ring.map(([x, z]) => [x - x0, z] as V2);
  }
  return { L: x1 - x0, ring, g };
}

/** The local ring of another OSM element, in the kit's frame. */
function ringOf(site: Site, k: Kit, key: string): V2[] {
  const o = site.feature(key)!.polygons[0].outer;
  const out: V2[] = [];
  for (let i = 0; i < o.length; i += 2) { const l = k.local(o[i], 0, o[i + 1]); out.push([l[0], l[2]]); }
  return out;
}

const U: V3 = [1, 0, 0], V: V3 = [0, 1, 0];

/**
 * Surrounds and sills in the fine tier on every window the shader lays on a front `L` long under
 * an eave `top` above the ground, on the plane at z = `z`: the landmarks have no relief of their
 * own (§8.2), so the rows are dressed here by the shader's grid.
 */
function dress(f: Kit, L: number, top: number, style: number, m: Mat, z = 0, floors?: [number, number]) {
  const { n, span, nS, sh, A } = grid(L, top, style);
  if (n < 1) return;
  for (let fl = floors ? floors[0] : 0; fl < (floors ? floors[1] : nS); fl++) {
    const gf = fl === 0;
    const y0 = gf ? 0.3 * sh : A.sill, y1 = gf ? Math.min(0.88 * sh, 0.3 * sh + A.winH) : Math.min(A.sill + A.winH, 0.9 * sh);
    for (let col = 0; col < n; col++) {
      const cu = 0.4 + (col + 0.5) * span, sw = 0.16;
      surround(f, [0, 0, z], U, V, cu, fl * sh + y0 - sw, A.winW + 2 * sw, y1 - y0 + 2 * sw, m, { proud: 0.08, depth: sw });
      f.sweep([[cu - A.winW / 2 - sw - 0.08, fl * sh + y0 - sw - 0.02, z], [cu + A.winW / 2 + sw + 0.08, fl * sh + y0 - sw - 0.02, z]], PROFILE.sill(0.16, 0.1), m, { caps: true });
    }
  }
}

export const kinskyPalace: Model = {
  id: 'kinsky-palace',
  unnamed: true,
  floodlit: true,
  replaces: ['relation/127987'],
  build(site, k, d, f) {
    k.seed = 141; d.seed = 142; f.seed = 143;
    const { L, ring, g } = front(site, [k, d, f], 'way/479284818');
    const WALL = mat('#e8cdc6', Surface.Wall, Style.Palace, 0, SFlag.TrimPale);
    const TRIM = mat('#f3ece0', Surface.Stone, Stone.Render, 0.05);
    const ROOF = mat('#4a4d52', Surface.Metal, Metal.Slate);
    const EAVE = 17.2, GF = 5.0, ATTIC = 15.6;
    // The wings round the courtyard, plainer and lower, from the palace's outline.
    const wings = offsetRing(ringOf(site, k, 'relation/127987'), -0.2);
    k.prism(wings, -2, 14.2, mat('#e6cfc9', Surface.Wall, Style.Palace, 0, SFlag.TrimPale), null, { windows: true, eave: g + 14.2 });
    k.roof(wings, 14.2, { shape: 'hipped', pitch: 40, cap: 4.5, gable: () => false }, ROOF, ROOF);
    // The front block, three storeys under the entablature and the balustraded attic, a mansard roof.
    k.prism(ring, -2, EAVE, WALL, null, { windows: true, eave: g + EAVE });
    k.roof(ring, EAVE + 1.3, { shape: 'mansard', pitch: 38, lower: 68, inset: 1.4, cap: 5.5, gable: () => false }, ROOF, ROOF);
    k.prism(ring, EAVE, EAVE + 1.3, TRIM, TRIM);
    const path = (y: number, out = 0): V3[] => [[-0.2, y, out], [L + 0.2, y, out]];
    k.sweep(path(GF), PROFILE.string(0.22, 0.4), TRIM, { caps: true });
    entablature(k, path(ATTIC), TRIM, { out: 0.55, h: EAVE - ATTIC, closed: false });
    // The two pavilions stand proud under segmental pediments, pilastered through the upper storeys.
    for (const key of ['way/479284815', 'way/479284816']) {
      const r = ringOf(site, k, key);
      let x0 = Infinity, x1 = -Infinity;
      for (const [x] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
      const w = x1 - x0, cx = (x0 + x1) / 2;
      // A thin prism 0.45 m proud of the front, its face carrying the wall's windows, through the attic.
      k.prism([[x0, 0.45], [x1, 0.45], [x1, 0.1], [x0, 0.1]], -2, EAVE + 1.3, WALL, TRIM, { windows: true, eave: g + EAVE });
      for (let i = 0; i < 4; i++) pilaster(d, [0, 0, 0.45], U, V, x0 + 0.9 + (i / 3) * (w - 1.8), GF + 0.2, ATTIC, 0.75, 0.22, TRIM, { capH: 0.55 });
      pediment(d, [0, 0, 0.45], U, V, cx, EAVE + 1.3, w * 0.8, 1.15, 0.45, TRIM, 'segmental', TRIM);
      f.push().at(x0, 0, 0);
      dress(f, w, EAVE, Style.Palace, TRIM, 0.45);
      f.pop();
      // The portal, and the balcony over it on consoles with its balustrade.
      const P = arch(2.6, 4.3, 'round');
      k.plate([cx, 0, 0.45], U, V, P, mat('#2a2622', Surface.Opening), 0.05);
      f.sweep(P.map(([x, y]) => [cx + x, y, 0.45] as V3), PROFILE.ring(0.42, 0.18), mat('#8f8578', Surface.Stone, Stone.Ashlar, 0.4), { v: [0, 0, 1] });
      k.slab([cx - 2.4, GF - 0.25, 1.35], U, V, [[0, 0], [4.8, 0], [4.8, 0.25], [0, 0.25]], 1.35, TRIM);
      balustrade(f, [[cx - 2.4, GF, 1.35], [cx + 2.4, GF, 1.35], [cx + 2.4, GF, 0.45]], TRIM, { h: 1.0, step: 0.34, w: 0.16, posts: true });
      balustrade(f, [[cx - 2.4, GF, 0.45], [cx - 2.4, GF, 1.35]], TRIM, { h: 1.0, step: 0.34, w: 0.16, posts: false });
    }
    dress(f, L, EAVE, Style.Palace, TRIM);
    // The attic's balustrade along the front, statues over the pilasters and urns between.
    balustrade(f, [[0.2, EAVE + 1.3, 0.1], [L - 0.2, EAVE + 1.3, 0.1]], TRIM, { h: 1.1, step: 0.36, w: 0.18, posts: true });
    const STATUE = mat('#d9d2c2', Surface.Stone, Stone.Render, 0.1);
    for (let i = 0; i < 9; i++) {
      const x = 1.2 + (i / 8) * (L - 2.4);
      if (i % 2 === 0) statue(d, [x, EAVE + 1.4, -0.3], [0, 1], 2.3, STATUE, 'single', 40 + i);
      else d.lathe(x, -0.3, [[0.3, EAVE + 1.4], [0.42, EAVE + 1.9], [0.32, EAVE + 2.5], [0.4, EAVE + 2.7], [0.08, EAVE + 3.0]], 8, STATUE);
    }
    k.light([L / 2, 22, 8], 1);
  },
};

export const stoneBell: Model = {
  id: 'stone-bell',
  unnamed: true,
  floodlit: true,
  replaces: ['way/462411200', 'way/462411201'],
  build(site, k, d, f) {
    k.seed = 144; d.seed = 145; f.seed = 146;
    const { L, ring } = front(site, [k, d, f], 'way/462411200');
    const STONE = mat('#b9a98d', Surface.Stone, Stone.Ashlar, 0.55);
    const DRESS = mat('#cbbea6', Surface.Stone, Stone.Ashlar, 0.3);
    const EAVE = 18;
    k.prism(ring, -2, EAVE, STONE, null);
    k.roof(ring, EAVE, { shape: 'hipped', pitch: 45, cap: 5, gable: () => false }, SLATE, SLATE);
    // The steep gabled roof over the front block, its gable on the square.
    const tower = ringOf(site, k, 'way/462411201');
    k.roof(tower, EAVE, { shape: 'gabled', pitch: 62, cap: 99, height: 12, gable: (_e, len) => len < 11 }, SLATE, STONE);
    k.sweep([[-0.2, EAVE, 0], [L + 0.2, EAVE, 0]], PROFILE.cornice(0.4, 0.5), DRESS, { caps: true });
    for (const y of [4.9, 10.2, 15.2]) k.sweep([[-0.15, y, 0], [L + 0.15, y, 0]], PROFILE.string(0.2, 0.35), DRESS, { caps: true });
    // Traceried Gothic windows in two storeys, three a row; the pointed portal below.
    const GL = mat('#22262a', Surface.Glass, Glass.Tracery);
    for (const [y, h] of [[5.6, 3.4], [10.9, 3.2]] as [number, number][])
      for (let i = 0; i < 3; i++) traceryWindow(k, f, [0, 0, 0], U, V, L * (0.2 + 0.3 * i), y, 1.5, h, DRESS, GL, { lights: 2, proud: 0.12, depth: 0.2, kind: 'pointed' });
    for (let i = 0; i < 2; i++) surround(f, [0, 0, 0], U, V, L * (0.28 + 0.44 * i), 15.6, 1.1, 1.6, DRESS, { proud: 0.08, depth: 0.14 });
    for (let i = 0; i < 2; i++) k.plate([L * (0.28 + 0.44 * i), 15.6, 0], U, V, [[-0.5, 0], [0.5, 0], [0.5, 1.5], [-0.5, 1.5]], DARK, 0.05);
    const P = arch(2.2, 4.0, 'pointed');
    k.plate([L * 0.5, 0, 0], U, V, P, mat('#221f1c', Surface.Opening), 0.05);
    f.sweep(P.map(([x, y]) => [L * 0.5 + x, y, 0] as V3), PROFILE.ring(0.4, 0.2), DRESS, { v: [0, 0, 1] });
    for (const x of [L * 0.18, L * 0.82]) k.plate([x, 1.4, 0], U, V, [[-0.6, 0], [0.6, 0], [0.6, 1.8], [-0.6, 1.8]], DARK, 0.05);
    // The stone bell on the corner.
    d.lathe(L + 0.35, 0.35, [[0.02, 3.6], [0.22, 4.0], [0.4, 4.7], [0.42, 5.1], [0.2, 5.3], [0.06, 5.45]], 8, mat('#8a7e6b', Surface.Stone, Stone.Ashlar, 0.5));
    k.light([L / 2, 14, 6], 1);
  },
};

export const tynSchool: Model = {
  id: 'tyn-school',
  unnamed: true,
  floodlit: true,
  replaces: ['way/30825032'],
  build(site, k, d, f) {
    k.seed = 147; d.seed = 148; f.seed = 149;
    const { L, ring, g } = front(site, [k, d, f], 'way/30825032');
    const WALL = mat('#e3caa0', Surface.Wall, Style.OldTown, 0, SFlag.TrimPale);
    const TRIM = mat('#f1e8d6', Surface.Stone, Stone.Render, 0.05);
    const ROOF = mat('#9c6a50', Surface.Roof);
    const EAVE = 15.6, GF = 4.9;
    // The walls above the arcade carry the shader's windows; behind and beside, the walls reach the ground.
    k.prism(ring, GF, EAVE, WALL, null, { windows: true, eave: g + EAVE });
    {
      // The ground floor's walls on every edge but the front's, which the arcade takes.
      const n = ring.length;
      let area = 0;
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += ring[i][0] * ring[j][1] - ring[j][0] * ring[i][1]; }
      const sg = Math.sign(area) || 1;
      for (let i = 0; i < n; i++) {
        const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % n];
        if (Math.abs(az) < 0.8 && Math.abs(bz) < 0.8) continue;
        const len = Math.hypot(bx - ax, bz - az);
        if (len < 1e-3) continue;
        k.poly([[ax, -2, az], [bx, -2, bz], [bx, GF, bz], [ax, GF, az]], WALL, { normal: [(sg * (bz - az)) / len, 0, (-sg * (bx - ax)) / len] });
      }
    }
    k.roof(ring, EAVE, { shape: 'hipped', pitch: 46, cap: 99, gable: () => false }, ROOF, WALL);
    k.sweep([[-0.2, EAVE, 0], [L + 0.2, EAVE, 0]], PROFILE.cornice(0.4, 0.5), TRIM, { caps: true });
    k.sweep([[-0.15, GF, 0], [L + 0.15, GF, 0]], PROFILE.string(0.18, 0.3), TRIM, { caps: true });
    dress(f, L, EAVE, Style.OldTown, TRIM, 0, [1, grid(L, EAVE, Style.OldTown).nS]);
    // The arcade: the front's ground floor is taken back 3.5 m behind four pointed arches on piers.
    const bays = 4, pw = 1.0, span = L / bays;
    const PIER = mat('#d9c39c', Surface.Stone, Stone.Render, 0.1);
    k.box(L / 2, -3.5 - 0.15, L, 0.3, -2, GF, mat('#8c7d66', Surface.Wall, Style.Blank), null);
    k.quad([0, GF - 0.1, 0], [0, GF - 0.1, -3.5], [L, GF - 0.1, -3.5], [L, GF - 0.1, 0], mat('#b8a88c', Surface.Plain), { normal: [0, -1, 0] });
    for (let i = 0; i <= bays; i++) {
      const cx = Math.min(Math.max(i * span, pw / 2), L - pw / 2);
      k.box(cx, -pw / 2, pw, pw, -2, GF - 0.1, PIER, null);
    }
    for (let i = 0; i < bays; i++) {
      const l = i * span + (i === 0 ? pw : pw / 2), r = (i + 1) * span - (i === bays - 1 ? pw : pw / 2), cx = (l + r) / 2, w = r - l;
      const A = arch(w, GF - 0.35, 'pointed', w * 0.55);
      // The spandrel between the arch and the string course, a slab the pier's depth.
      const shape: V2[] = [[l, A[2][1]]];
      for (let q = A.length - 1; q >= 3; q--) shape.push([cx + A[q][0], A[q][1]]);
      shape.push([r, A[2][1]], [r, GF], [l, GF]);
      k.slab([0, 0, 0], U, V, shape, pw, PIER);
    }
    // The two Venetian gables: each side a stair of semicircular arcs up to the arc at the peak.
    const GABLE = mat('#e6d0a8', Surface.Gable, 0, 0, 0);
    for (const gx of [L * 0.27, L * 0.73]) {
      const hw = Math.min(4.4, L * 0.22), r = hw / 9.5, h0 = 0.9, step = 1.25;
      const side: V2[] = [[hw, 0], [hw, h0]];
      for (let i = 0; i < 4; i++) {
        const x = hw - 2 * r * i, y = h0 + step * i;
        for (let q = 1; q <= 6; q++) { const a = (q / 6) * Math.PI; side.push([x - r + r * Math.cos(a), y + r * Math.sin(a)]); }
        if (i < 3) side.push([x - 2 * r, y + step]);
      }
      const top = h0 + step * 4 - 0.1;
      side.push([hw - 8 * r, top]);
      const capR = hw - 8 * r;
      const cap: V2[] = [];
      for (let q = 1; q < 8; q++) { const a = (q / 8) * Math.PI; cap.push([capR * Math.cos(a), top + capR * 1.15 * Math.sin(a)]); }
      const shape: V2[] = [...side.map(([x, y]) => [gx + x, y] as V2), ...cap.map(([x, y]) => [gx + x, y] as V2), ...side.slice().reverse().map(([x, y]) => [gx - x, y] as V2)];
      k.slab([0, EAVE, 0], U, V, shape, 1.0, GABLE);
      for (const [x, y, w, h] of [[-1.4, 1.4, 1.0, 1.5], [1.4, 1.4, 1.0, 1.5], [0, 3.6, 0.9, 1.3]] as [number, number, number, number][]) {
        k.plate([gx + x, EAVE + y, 0], U, V, [[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]], DARK, 0.04);
        surround(f, [0, EAVE, 0], U, V, gx + x, y, w, h, TRIM, { proud: 0.06, depth: 0.12 });
      }
    }
    k.light([L / 2, 12, 7], 1);
  },
};
