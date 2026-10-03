// The Old Town Square set (design.md §7.1, M14, M18, M19): the row 8607, 8608 and 8609 look at, on
// its OSM footprints and parts. The Kinský palace (rococo, white with its ornament pink: pilasters,
// an entablature, the two pavilions under triangular pediments, a balustraded attic with statues and
// urns, a red tiled roof; M19: its windows modelled, the stucco carved, one balcony on the portals'
// paired columns); the Stone Bell house (Gothic ashlar, traceried windows, the corner bell, the
// steep roof); the Týn school (an arcade of pointed arches, a storey and the attic storey, the two
// Venetian gables of semicircular crests); U Bílého jednorožce (M18: hooded windows in three storeys,
// quoins, the attic's pedimented gables). M19: the school and U Bílého jednorožce at the heights
// 8607 shows through its camera solved again. None is one of §6.2's landmarks; none carries a name
// on the screen.

import { Kit, mat, arch, ngon, offsetRing, PROFILE, type Mat, type V2, type V3 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style, SFlag } from '../../src/core/buildings.ts';
import { pilaster, entablature, pediment, balustrade, statue, traceryWindow, surround, column, rib, scroll, cartouche, crest, drop, swag } from './ornament.ts';

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

export const kinskyPalace: Model = {
  id: 'kinsky-palace',
  unnamed: true,
  floodlit: true,
  // M19: the four small parts OSM draws before the pavilions are the portals' paired columns under
  // the balcony, modelled here; drawn as parts they stood as pink-capped pillars to the pediments.
  replaces: ['relation/127987', 'way/479284830', 'way/479284832', 'way/479284834', 'way/479284836'],
  build(site, k, d, f) {
    k.seed = 141; d.seed = 142; f.seed = 143;
    const fr = front(site, [k, d, f], 'way/479284818');
    const { L, g } = fr;
    // M19: OSM's front steps back a metre along its northern bays and skews behind the left
    // pavilion, where 8608 shows one straight front; its vertices on the square are laid on the line.
    const line = fr.ring.filter(([x, z], i, r) => z > -2.5 && [r[(i + r.length - 1) % r.length], r[(i + 1) % r.length]].some(([x2, z2]) => z2 > -2.5 && Math.abs(x2 - x) > 3)).sort((p, q) => p[0] - q[0]);
    const zLine = (x: number) => {
      if (x <= line[0][0]) return line[0][1];
      for (let i = 1; i < line.length; i++) if (x <= line[i][0]) { const t = (x - line[i - 1][0]) / (line[i][0] - line[i - 1][0]); return line[i - 1][1] + t * (line[i][1] - line[i - 1][1]); }
      return line[line.length - 1][1];
    };
    const ring = fr.ring.map(([x, z]) => (z > -2.5 ? [x, z - zLine(x)] : [x, z]) as V2);
    const X0 = line[0][0], X1 = L;
    // M18, from 8608: a white field with the rococo ornament pink, white dressings, a red tiled
    // roof (OSM's roof:colour). M19, from 8597 and 8608: the ornament modelled in stucco.
    // M20, measured in 8608: the field a warm pinkish cream, not white, and the stucco terracotta
    // (it had been lighter and yellower than the photograph's, the ornament half as strong).
    const WALL = mat('#e9d6cf', Surface.Wall, Style.Palace, 0, SFlag.TrimDeep);
    const TRIM = mat('#f3ece0', Surface.Stone, Stone.Render, 0.05);
    const PINK = mat('#c4836d', Surface.Stone, Stone.Render, 0.05);
    const ROOF = mat('#94593f', Surface.Roof);
    const STONE = mat('#7d766d', Surface.Stone, Stone.Ashlar, 0.5);
    const EAVE = 17.2, GF = 5.0, ATTIC = 15.6;
    // The wings round the courtyard, plainer and lower, from the palace's outline, kept 0.4 m behind
    // the front (M19: the outline takes in the pavilions and the portals' columns, and the wings had
    // raised the columns as pillars 14 m tall).
    const outline = ringOf(site, k, 'relation/127987').map(([x, z]) => [x, z > -2.5 ? Math.min(z - zLine(x), -0.4) : z] as V2)
      .filter((p, i, r) => !(p[1] === -0.4 && r[(i + r.length - 1) % r.length][1] === -0.4 && r[(i + 1) % r.length][1] === -0.4));
    const wings = offsetRing(outline, -0.2);
    k.prism(wings, -2, 14.2, mat('#e9d8d0', Surface.Wall, Style.Palace, 0, SFlag.TrimDeep), null, { windows: true, eave: g + 14.2 });
    k.roof(wings, 14.2, { shape: 'hipped', pitch: 45, cap: 5, gable: () => false }, ROOF, ROOF);
    // The front block, three storeys under the entablature and the balustraded attic, a hipped roof;
    // its walls on the square plain, for the windows modelled below (the shader's grid had stood off
    // the pavilions' pilasters and the stucco).
    walls(k, ring, -2, EAVE, WALL, EAVE, -2, 2.5);
    // M20, from 8608 and 8597: a mansard, its lower slope steep and 4 m tall with the oval dormers
    // in it, the upper at 38°.
    k.roof(ring, EAVE + 1.3, { shape: 'mansard', pitch: 38, lower: 72, inset: 1.3, cap: 8, gable: () => false }, ROOF, ROOF);
    k.prism(ring, EAVE, EAVE + 1.3, TRIM, TRIM);
    const path = (y: number, out = 0): V3[] => [[X0 - 0.2, y, out], [X1 + 0.2, y, out]];
    k.sweep(path(GF), PROFILE.string(0.22, 0.4), TRIM, { caps: true });
    entablature(k, path(ATTIC), TRIM, { out: 0.55, h: EAVE - ATTIC, closed: false });

    // The bays, as 8608 counts them: two, the left pavilion's three, three, the right pavilion's
    // three, two. A pavilion's bays lie between its pilasters.
    const pav = ['way/479284816', 'way/479284815'].map((key) => {
      let x0 = Infinity, x1 = -Infinity;
      for (const [x] of ringOf(site, k, key)) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
      return { x0, x1, w: x1 - x0, cx: (x0 + x1) / 2 };
    }).sort((p, q) => p.x0 - q.x0);
    const even = (x0: number, x1: number, n: number) => Array.from({ length: n }, (_, i) => x0 + ((i + 0.5) * (x1 - x0)) / n);
    const pil = (p: { x0: number; w: number }, i: number) => p.x0 + 0.9 + (i / 3) * (p.w - 1.8);
    const bays: { x: number; z: number; pav: boolean; portal: boolean }[] = [
      ...even(X0 + 0.5, pav[0].x0, 2).map((x) => ({ x, z: 0, pav: false, portal: false })),
      ...[0, 1, 2].map((i) => ({ x: (pil(pav[0], i) + pil(pav[0], i + 1)) / 2, z: 0.45, pav: true, portal: i === 1 })),
      ...even(pav[0].x1, pav[1].x0, 3).map((x) => ({ x, z: 0, pav: false, portal: false })),
      ...[0, 1, 2].map((i) => ({ x: (pil(pav[1], i) + pil(pav[1], i + 1)) / 2, z: 0.45, pav: true, portal: i === 1 })),
      ...even(pav[1].x1, X1 - 0.6, 2).map((x) => ({ x, z: 0, pav: false, portal: false })),
    ];
    const balcony = [pav[0].x0 - 0.2, pav[1].x1 + 0.2];

    // The two pavilions stand proud under triangular pediments, pilastered through the upper storeys.
    for (const p of pav) {
      k.prism([[p.x0, 0.45], [p.x1, 0.45], [p.x1, 0.1], [p.x0, 0.1]], -2, EAVE + 1.3, WALL, TRIM);
      // Pilasters with pink capitals, in the fine tier (a shadow map streaks the wall with them).
      for (let i = 0; i < 4; i++) {
        const x = pil(p, i);
        pilaster(f, [0, 0, 0.45], U, V, x, GF + 0.2, ATTIC, 0.75, 0.22, TRIM, { cap: PINK, capH: 0.55 });
        for (const s of [-1, 1]) scroll(f, [0, 0, 0.45 + 0.3], U, V, x + s * 0.3, ATTIC - 0.2, 0.13, s < 0 ? 0 : Math.PI, 0.9, s < 0 ? 1 : -1, 0.05, 0.06, PINK);
      }
      pediment(d, [0, 0, 0.45], U, V, p.cx, EAVE + 1.3, p.w * 0.86, 1.9, 0.45, TRIM, 'triangular', TRIM);
      // The tympanum's stucco: a cartouche between two sprays of scrolls.
      const ty: V3 = [0, 0, 0.45 + 0.27];
      d.plate(ty, U, V, ngon(12, 0.5, 0, p.cx, EAVE + 2.05).map(([a, b]) => [a, EAVE + 2.05 + (b - EAVE - 2.05) * 0.8] as V2), PINK, 0.02);
      cartouche(f, ty, U, V, p.cx, EAVE + 2.1, 1.2, 0.95, PINK, { proud: 0.1 });
      for (const s of [-1, 1]) {
        const sp: V2[] = [];
        for (let i = 0; i <= 10; i++) { const t = i / 10; sp.push([p.cx + s * (0.75 + t * p.w * 0.26), EAVE + 1.75 + 0.35 * Math.sin(t * Math.PI) - t * 0.2]); }
        rib(f, ty, U, V, sp, 0.07, 0.07, PINK);
        for (const t of [0.3, 0.6, 0.9]) scroll(f, ty, U, V, p.cx + s * (0.75 + t * p.w * 0.26), EAVE + 1.95 + 0.3 * Math.sin(t * Math.PI) - t * 0.2, 0.1, s < 0 ? -Math.PI / 2 : -Math.PI / 2, 0.8, s < 0 ? -1 : 1, 0.045, 0.05, PINK);
      }
    }

    // The windows, their stucco and the ground floor, bay by bay.
    for (const b of bays) {
      for (const kit of [k, d, f]) kit.push().at(0, 0, b.z);
      const x = b.x, onBalcony = x > balcony[0] && x < balcony[1];
      // The ground floor: a window under a straight hood, or the portal.
      if (b.portal) {
        const P = arch(2.6, 4.3, 'round');
        k.plate([x, 0, 0], U, V, P, mat('#2a2622', Surface.Opening), 0.05);
        f.sweep(P.map(([px, py]) => [x + px, py, 0] as V3), PROFILE.ring(0.42, 0.18), STONE, { v: [0, 0, 1] });
      } else casement(k, d, f, x, 1.3, 1.2, 2.3, TRIM, { sw: 0.16, hood: 'straight' });
      // The first floor: a tall window under a white hood, a cartouche between them, drops beside.
      casement(k, d, f, x, GF + 0.9, 1.25, 2.8, TRIM, { sw: 0.16, ears: true });
      pediment(f, [0, 0, 0], U, V, x, GF + 5.4, 2.2, 0.35, 0.22, TRIM, 'segmental');
      // M20: the cartouche as large as 8608 shows it, a pink field behind it in the detail tier so
      // the mass carries across the square.
      d.plate([0, 0, 0], U, V, ngon(14, 0.78, 0, x, GF + 4.4).map(([a, c]) => [a, GF + 4.4 + (c - GF - 4.4) * 0.62] as V2), PINK, 0.03);
      cartouche(f, [0, 0, 0], U, V, x, GF + 4.4, 1.7, 1.05, PINK);
      for (const s of [-1, 1]) drop(f, [0, 0, 0], U, V, x + s * 1.02, GF + 3.9, 1.3, PINK, 0.1);
      // Off the balcony, a garland under the sill.
      if (!onBalcony) { swag(f, [0, 0, 0], U, V, x, GF + 0.45, 1.1, 0.16, PINK); d.plate([0, 0, 0], U, V, R(x - 0.45, GF + 0.3, x + 0.45, GF + 0.42), PINK, 0.03); }
      // The top floor: a swag under the sill, the window, a crest over it with drops beside.
      swag(f, [0, 0, 0], U, V, x, GF + 6.35, 1.2, 0.2, PINK);
      d.plate([0, 0, 0], U, V, R(x - 0.5, GF + 6.18, x + 0.5, GF + 6.32), PINK, 0.03);
      casement(k, d, f, x, GF + 6.7, 1.25, 2.4, TRIM, { sw: 0.16, ears: true });
      crest(f, [0, 0, 0], U, V, x, GF + 9.3, 2.2, PINK);
      d.plate([0, 0, 0], U, V, ngon(12, 0.42, 0, x, GF + 9.62).map(([a, c]) => [a, GF + 9.62 + (c - GF - 9.62) * 0.7] as V2), PINK, 0.03);
      for (const s of [-1, 1]) drop(f, [0, 0, 0], U, V, x + s * 0.97, GF + 9.1, 0.95, PINK, 0.07);
      for (const kit of [k, d, f]) kit.pop();
    }

    // The balcony across the pavilions and the bays between them, on the portals' paired columns
    // (OSM's four small parts), with a balustrade of dark stone.
    const [b0, b1] = balcony, bd = 1.6;
    k.box((b0 + b1) / 2, bd / 2, b1 - b0, bd, GF - 0.3, GF, STONE, STONE);
    balustrade(f, [[b0 + 0.1, GF, 0.2], [b0 + 0.1, GF, bd - 0.1], [b1 - 0.1, GF, bd - 0.1], [b1 - 0.1, GF, 0.2]], STONE, { h: 1.0, step: 0.34, w: 0.16, posts: true });
    for (const key of ['way/479284830', 'way/479284832', 'way/479284834', 'way/479284836']) {
      let cx = 0, n = 0;
      for (const [x] of ringOf(site, k, key)) { cx += x; n++; }
      for (const s of [-1, 1]) column(k, cx / n + s * 0.42, 1.0, 0, GF - 0.3, 0.26, STONE, { order: 'tuscan' });
    }

    // The attic's balustrade over the bays between the pavilions, statues and urns on it in turn,
    // and statues on the pediments' feet (8608; M20: it had run the whole front).
    balustrade(f, [[pav[0].x1 + 0.1, EAVE + 1.3, 0.1], [pav[1].x0 - 0.1, EAVE + 1.3, 0.1]], TRIM, { h: 1.1, step: 0.36, w: 0.18, posts: true });
    const STATUE = mat('#8e877b', Surface.Stone, Stone.Ashlar, 0.6);
    for (let i = 0; i < 7; i++) {
      const x = pav[0].x1 + 0.6 + (i / 6) * (pav[1].x0 - pav[0].x1 - 1.2);
      if (i % 2 === 0) statue(d, [x, EAVE + 1.4, -0.3], [0, 1], 2.3, STATUE, 'single', 40 + i);
      else d.lathe(x, -0.3, [[0.3, EAVE + 1.4], [0.42, EAVE + 1.9], [0.32, EAVE + 2.5], [0.4, EAVE + 2.7], [0.08, EAVE + 3.0]], 8, STATUE);
    }
    for (const [j, p] of pav.entries()) for (const s of [-1, 1]) statue(d, [p.cx + s * p.w * 0.4, EAVE + 1.5, 0.3], [0, 1], 2.2, STATUE, 'single', 50 + 2 * j + (s + 1) / 2);

    // M20, the roof as 8608 shows it. An oval dormer over each end of the front and one on the
    // south return, rising from the cornice in the lower slope (8597 close by); three small
    // dormers up the upper slope; white chimneys with red caps.
    const dorm = (k2: Kit, d2: Kit, f2: Kit) => ovalDormer(k2, d2, f2, EAVE + 1.3, TRIM, PINK, ROOF);
    for (const x of [(X0 + pav[0].x0) / 2, (pav[1].x1 + X1) / 2]) {
      for (const kit of [k, d, f]) kit.push().at(x, 0, 0);
      dorm(k, d, f);
      for (const kit of [k, d, f]) kit.pop();
    }
    // The south return: the edge that runs back from the front's right end.
    for (let i = 0; i < ring.length; i++) {
      const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % ring.length], len = Math.hypot(bx - ax, bz - az);
      if (Math.abs(ax - X1) > 1.5 || az < -2.5 || len < 6 || bz > az - 4) continue;
      const deg = (Math.atan2(bz - az, bx - ax) * 180) / Math.PI;
      for (const kit of [k, d, f]) kit.push().at((ax + bx) / 2, 0, (az + bz) / 2, deg);
      dorm(k, d, f);
      for (const kit of [k, d, f]) kit.pop();
      break;
    }
    const brk = EAVE + 1.3 + 1.3 * Math.tan((72 * Math.PI) / 180), up = 1.2, zt = -1.3 - up / Math.tan((38 * Math.PI) / 180);
    for (const x of [-0.7, 6.8, 15.0]) {
      k.slab([x, brk + up - 0.3, zt], U, V, [[-0.6, 0], [0.6, 0], [0.6, 0.85], [0, 1.25], [-0.6, 0.85]], 1.6, ROOF);
      k.plate([x, brk + up - 0.1, zt], U, V, R(-0.38, 0, 0.38, 0.62), FRAMED, 0.03);
    }
    const CHIM = mat('#ece6dc', Surface.Stone, Stone.Render, 0.1), CAP = mat('#a25d43', Surface.Stone, Stone.Render, 0.1);
    for (const [x, z, w, dd] of [[1.0, -7.5, 0.9, 0.7], [11.5, -8.5, 0.8, 0.6], [22.5, -5.0, 1.3, 1.0]] as [number, number, number, number][]) {
      k.box(x, z, w, dd, EAVE + 4, EAVE + 11.2, CHIM, null);
      k.box(x, z, w + 0.2, dd + 0.2, EAVE + 11.2, EAVE + 11.6, CAP, CAP);
    }
    k.light([L / 2, 22, 8], 1);
  },
};

/**
 * An oval dormer as the Kinský palace's (8597, 8608), its front on the current frame's z = 0 at x = 0
 * rising from `y0`: a white aedicule, straight-sided and then drawn in on an ogee to its cornice, an
 * oval window in a moulded ring with a cross, a pink mask over it and a swag under it, a segmental
 * cornice capped with tiles; the body runs back 2.2 m into the roof.
 */
function ovalDormer(k: Kit, d: Kit, f: Kit, y0: number, white: Mat, pink: Mat, roof: Mat) {
  const w = 2.3, h = 3.3, inn = 0.35, F: V3 = [0, 0, 0.1];
  const right: V2[] = [[w / 2, 0], [w / 2, 0.45 * h]];
  for (let i = 1; i <= 8; i++) { const t = i / 8; right.push([w / 2 - (inn * (1 - Math.cos(t * Math.PI))) / 2, 0.45 * h + 0.4 * h * t]); }
  right.push([w / 2 - inn, h]);
  const shape: V2[] = [...right, ...right.slice().reverse().map(([x, y]) => [-x, y] as V2)].map(([x, y]) => [x, y0 + y] as V2);
  k.slab(F, U, V, shape, 2.3, white);
  // The cornice, segmental, and the tiles over it running back into the roof.
  const cw = w - 2 * inn + 0.5;
  pediment(k, F, U, V, 0, y0 + h, cw, 0.45, 0.3, white, 'segmental');
  const arc: V2[] = [];
  for (let i = 0; i <= 10; i++) { const t = -1 + (2 * i) / 10; arc.push([(cw / 2 + 0.12) * t, y0 + h + 0.1 + 0.5 * (1 - t * t)]); }
  k.slab([0, 0, 0.2], U, V, [[-(cw / 2 + 0.12), y0 + h + 0.02], ...arc, [cw / 2 + 0.12, y0 + h + 0.02]], 2.6, roof);
  // The oval window with its cross (the casement's shader draws the mullion and the bar), its ring.
  const oval = (rx: number, ry: number, cy: number, n = 20): V2[] => Array.from({ length: n }, (_, i) => [rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI)] as V2);
  const wy = y0 + 0.52 * h;
  k.plate(F, U, V, oval(0.42, 0.52, wy), FRAMED, 0.02);
  rib(f, F, U, V, oval(0.5, 0.6, wy), 0.13, 0.09, white, true);
  d.plate(F, U, V, oval(0.5, 0.6, wy), white, 0.015);
  // The stucco: a cartouche for the mask over the window, a swag under it.
  d.plate(F, U, V, oval(0.36, 0.2, wy + 0.88, 12), pink, 0.03);
  cartouche(f, F, U, V, 0, wy + 0.88, 0.75, 0.42, pink, { proud: 0.08 });
  swag(f, F, U, V, 0, wy - 0.68, 0.8, 0.1, pink, 0.07);
}

export const stoneBell: Model = {
  id: 'stone-bell',
  unnamed: true,
  floodlit: true,
  replaces: ['way/462411200', 'way/462411201'],
  build(site, k, d, f) {
    k.seed = 144; d.seed = 145; f.seed = 146;
    const { L, ring } = front(site, [k, d, f], 'way/462411200');
    const STONE = mat('#b9a98d', Surface.Stone, Stone.Ashlar, 0.55, SFlag.Blackened);
    const DRESS = mat('#cbbea6', Surface.Stone, Stone.Ashlar, 0.3, SFlag.Blackened);
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

/**
 * The walls of a front's ring from y0 to y1: the front's own edges (on z ≈ 0) plain, for the
 * model's windows in geometry; the others with the shader's windows under an eave `eave` above the
 * ground. `from` lifts the front's walls (an arcade takes the ground floor); `tol` is how far off
 * the front's line an edge's ends may lie and count as the front.
 */
function walls(k: Kit, ring: V2[], y0: number, y1: number, m: Mat, eave: number, from = y0, tol = 0.8) {
  const n = ring.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += ring[i][0] * ring[j][1] - ring[j][0] * ring[i][1]; }
  const sg = Math.sign(area) || 1;
  for (let i = 0; i < n; i++) {
    const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % n];
    const len = Math.hypot(bx - ax, bz - az);
    if (len < 1e-3) continue;
    const nrm: V3 = [(sg * (bz - az)) / len, 0, (-sg * (bx - ax)) / len];
    if (Math.abs(az) < tol && Math.abs(bz) < tol) {
      // Plain: no window grid, no cornice; the height above the ground for the lamps' pools.
      k.poly([[ax, from, az], [bx, from, bz], [bx, y1, bz], [ax, y1, az]], m, { normal: nrm, fac: (w) => [0, 0, w[1] - k.ground, 0] });
    } else {
      const w0 = k.world([ax, y0, az]);
      k.poly([[ax, y0, az], [bx, y0, bz], [bx, y1, bz], [ax, y1, az]], m, { normal: nrm, fac: (w) => [Math.hypot(w[0] - w0[0], w[2] - w0[2]), len, w[1] - k.ground, eave] });
    }
  }
}

/** A rectangle from (x0, y0) to (x1, y1) in the front's plane. */
const R = (x0: number, y0: number, x1: number, y1: number): V2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

interface WinOpts {
  /** The surround's width and how far it stands proud. */
  sw?: number; proud?: number;
  /** A hood over the window: a segmental arc on consoles ending in scrolls, a small pediment, or a straight cornice. */
  hood?: 'segmental' | 'triangular' | 'straight';
  /** A raised panel under the sill; ears at the surround's top corners; louvred shutters open beside it. */
  apron?: boolean; ears?: boolean; shutters?: Mat;
}

/**
 * A casement window in the front's plane (z = 0), centred at x with its sill at y, w by h: the
 * glass with its white frames and bars (the shader's Casement), a surround, a sill, and what the
 * options add. The glass is main geometry; the surround and sill the detail tier (they carry the
 * front's pattern to 1.4 km); the ears, the apron's frame and the hood's scrolls the fine tier.
 */
function casement(k: Kit, d: Kit, f: Kit, x: number, y: number, w: number, h: number, trim: Mat, o: WinOpts = {}) {
  const sw = o.sw ?? 0.2, pr = o.proud ?? 0.08;
  k.plate([x, y, 0], U, V, R(-w / 2, 0, w / 2, h), FRAMED, 0.03);
  surround(f, [0, 0, 0], U, V, x, y - sw, w + 2 * sw, h + 2 * sw, trim, { proud: pr, depth: sw });
  f.sweep([[x - w / 2 - sw - 0.08, y - sw - 0.06, 0], [x + w / 2 + sw + 0.08, y - sw - 0.06, 0]], PROFILE.sill(0.15, 0.1), trim, { caps: true });
  if (o.ears) for (const s of [-1, 1]) f.slab([x + s * (w / 2 + sw), y + h + sw, pr], U, V, s < 0 ? R(-0.12, -0.2, 0, 0) : R(0, -0.2, 0.12, 0), pr, trim);
  if (o.apron) {
    const a0 = y - sw - 0.7, a1 = y - sw - 0.12;
    f.slab([0, 0, 0.04], U, V, R(x - w / 2, a0, x + w / 2, a1), 0.04, trim);
    surround(f, [0, 0, 0.04], U, V, x, a0, w, a1 - a0, trim, { proud: 0.04, depth: 0.07 });
  }
  if (o.shutters) for (const s of [-1, 1]) {
    const x0 = x + s * (w / 2 + sw + 0.02), x1 = x0 + s * w * 0.5;
    f.slab([0, 0, 0.1], U, V, R(Math.min(x0, x1), y, Math.max(x0, x1), y + h), 0.05, o.shutters);
  }
  const yt = y + h + sw + (o.hood === 'segmental' ? 0.3 : 0.05), hw = w / 2 + sw + 0.12;
  if (o.hood === 'straight') {
    f.sweep([[x - hw, yt, 0], [x + hw, yt, 0]], PROFILE.cornice(0.22, 0.2), trim, { caps: true });
  } else if (o.hood === 'triangular') {
    pediment(f, [0, 0, 0], U, V, x, yt, 2 * hw, 0.45, 0.2, trim, 'triangular');
  } else if (o.hood === 'segmental') {
    // An arc band 0.15 thick rising 0.3 over the window, a scroll curling at each end on a console.
    const rise = 0.3, t = 0.15, Rr = (hw * hw + rise * rise) / (2 * rise), cy = yt + rise - Rr, a0 = Math.asin(Math.min(1, hw / Rr));
    const band: V2[] = [];
    for (let i = 0; i <= 10; i++) { const a = -a0 + (2 * a0 * i) / 10; band.push([x + (Rr + t) * Math.sin(a), cy + (Rr + t) * Math.cos(a)]); }
    for (let i = 10; i >= 0; i--) { const a = -a0 + (2 * a0 * i) / 10; band.push([x + Rr * Math.sin(a), cy + Rr * Math.cos(a)]); }
    f.slab([0, 0, 0.2], U, V, band, 0.2, trim);
    for (const s of [-1, 1]) {
      f.slab([0, 0, 0.16], U, V, [[x + s * (hw - 0.02), yt - 0.34], [x + s * (hw - 0.14), yt - 0.34], [x + s * (hw - 0.17), yt], [x + s * (hw + 0.01), yt]].map(([a, b]) => [a, b] as V2), 0.16, trim);
      f.slab([0, 0, 0.23], U, V, ngon(8, 0.09, 22.5, x + s * (hw + 0.02), yt + 0.05), 0.05, trim);
    }
    // The frieze between the surround and the hood, a panel a little proud.
    f.slab([0, 0, 0.03], U, V, R(x - w / 2 - sw, y + h + sw, x + w / 2 + sw, yt + 0.02), 0.03, trim);
  }
}

/**
 * An arcade along the front: the ground floor taken back `deep` behind `bays` arches (pointed or
 * round) on square piers, the soffit at the string course, the back wall dark.
 */
function arcade(k: Kit, L: number, GF: number, bays: number, kind: 'pointed' | 'round', pier: Mat, deep = 3.5, pw = 1.0) {
  const span = L / bays;
  k.box(L / 2, -deep - 0.15, L, 0.3, -2, GF, mat('#8c7d66', Surface.Wall, Style.Blank), null);
  k.quad([0, GF - 0.1, 0], [0, GF - 0.1, -deep], [L, GF - 0.1, -deep], [L, GF - 0.1, 0], mat('#b8a88c', Surface.Plain), { normal: [0, -1, 0] });
  for (let i = 0; i <= bays; i++) {
    const cx = Math.min(Math.max(i * span, pw / 2), L - pw / 2);
    k.box(cx, -pw / 2, pw, pw, -2, GF - 0.1, pier, null);
  }
  for (let i = 0; i < bays; i++) {
    const l = i * span + (i === 0 ? pw : pw / 2), r = (i + 1) * span - (i === bays - 1 ? pw : pw / 2), cx = (l + r) / 2, w = r - l;
    const A = arch(w, GF - 0.35, kind, kind === 'pointed' ? w * 0.55 : w / 2);
    // The spandrel between the arch and the string course, a slab the pier's depth.
    const shape: V2[] = [[l, A[2][1]]];
    for (let q = A.length - 1; q >= 3; q--) shape.push([cx + A[q][0], A[q][1]]);
    shape.push([r, A[2][1]], [r, GF], [l, GF]);
    k.slab([0, 0, 0], U, V, shape, pw, pier);
  }
}

const FRAMED = mat('#e8e3d7', Surface.Glass, Glass.Casement);

/**
 * The Týn school (8607, 8608, 8609): an arcade of four pointed arches; one tall storey of windows
 * in broad white surrounds, the painted Madonna in a shaped frame among them; a cornice; the attic
 * storey between white lesenes, its small windows with brown shutters; and over it the two
 * Venetian gables, each five bays of semicircular crests stepping up to the middle (low, higher,
 * highest, higher, low), white rims round the arcs, bands across the taller panels, a ball on a
 * pedestal on every shoulder, and a small turret between the two. Salmon plaster, white trim.
 */
export const tynSchool: Model = {
  id: 'tyn-school',
  unnamed: true,
  floodlit: true,
  replaces: ['way/30825032'],
  build(site, k, d, f) {
    k.seed = 147; d.seed = 148; f.seed = 149;
    const { L, ring } = front(site, [k, d, f], 'way/30825032');
    const WALL = mat('#ceb0a2', Surface.Wall, Style.OldTown, 0, SFlag.TrimPale);
    const TRIM = mat('#efe9df', Surface.Stone, Stone.Render, 0.03);
    const ROOF = mat('#9c6a50', Surface.Roof);
    // M19: the heights measured from 8607's camera solved again (design.md §12.1), a quarter taller than M18's.
    const GF = 5.0, F1 = 10.6, EAVE = 13.6;
    walls(k, ring, -2, EAVE, WALL, EAVE, GF);
    // Low behind the crests: from the square Týn's stone shows between them, not tiles.
    k.roof(ring, EAVE, { shape: 'hipped', pitch: 40, cap: 1.5, gable: () => false }, ROOF, WALL);
    arcade(k, L, GF, 4, 'pointed', mat('#cdb09f', Surface.Stone, Stone.Render, 0.1));
    k.sweep([[-0.15, GF, 0], [L + 0.15, GF, 0]], PROFILE.string(0.18, 0.3), TRIM, { caps: true });
    k.sweep([[-0.2, F1 - 0.1, 0], [L + 0.2, F1 - 0.1, 0]], PROFILE.cornice(0.32, 0.42), TRIM, { caps: true });
    k.sweep([[-0.15, EAVE - 0.22, 0], [L + 0.15, EAVE - 0.22, 0]], PROFILE.band(0.1, 0.22), TRIM, { caps: true });
    // The storey: seven bays, the fourth the painted panel.
    const p = L / 7;
    for (let i = 0; i < 7; i++) {
      const x = (i + 0.5) * p;
      if (i === 3) {
        // The Madonna in a frame with a shaped head: a dark painted field, no picture.
        const fw = 1.5, y0 = GF + 1.0, y1 = F1 - 0.3;
        const head: V2[] = [[-fw / 2, 0], [fw / 2, 0], [fw / 2, y1 - y0 - 0.5]];
        for (let q = 1; q < 8; q++) { const a = (q / 8) * Math.PI; head.push([(fw / 2) * Math.cos(a), y1 - y0 - 0.5 + 0.5 * Math.sin(a)]); }
        head.push([-fw / 2, y1 - y0 - 0.5]);
        k.plate([x, y0, 0], U, V, head, mat('#8a735c', Surface.Opening), 0.03);
        surround(d, [0, 0, 0], U, V, x, y0 - 0.1, fw + 0.2, y1 - y0 - 0.3, mat('#8b5a44', Surface.Stone, Stone.Render, 0.1), { proud: 0.06, depth: 0.1 });
        continue;
      }
      casement(k, d, f, x, GF + 1.0, 1.1, 2.1, TRIM, { sw: 0.26, proud: 0.05 });
    }
    // The attic storey and the crests: eleven bays, the gables' five each and the turret's between.
    const tw = 1.0, bw = (L - tw) / 10, tops = [1.3, 2.9, 4.4, 2.9, 1.3];
    const bays: { x0: number; x1: number; top: number }[] = [];
    for (let i = 0; i < 5; i++) bays.push({ x0: i * bw, x1: (i + 1) * bw, top: tops[i] });
    for (let i = 0; i < 5; i++) bays.push({ x0: 5 * bw + tw + i * bw, x1: 5 * bw + tw + (i + 1) * bw, top: tops[i] });
    const SHUT = mat('#6b4a33', Surface.Plain);
    for (const [i, b] of bays.entries()) {
      const cx = (b.x0 + b.x1) / 2, r = (b.x1 - b.x0) / 2, spring = EAVE + b.top - r;
      // The panel and its semicircular head, a slab standing on the wall's plane.
      const shape: V2[] = [[b.x0, EAVE - 0.05], [b.x1, EAVE - 0.05], [b.x1, spring]];
      for (let q = 1; q < 12; q++) { const a = (q / 12) * Math.PI; shape.push([cx + r * Math.cos(a), spring + r * Math.sin(a)]); }
      shape.push([b.x0, spring]);
      k.slab([0, 0, 0], U, V, shape, 0.7, WALL);
      // The white rim round the arc, and bands across the panel at the lower crests' heights.
      const rim: V3[] = [];
      for (let q = 0; q <= 12; q++) { const a = (q / 12) * Math.PI; rim.push([cx + (r - 0.08) * Math.cos(a), spring + (r - 0.08) * Math.sin(a), 0]); }
      k.sweep(rim, PROFILE.ring(0.16, 0.1), TRIM, { v: [0, 0, 1], caps: true });
      for (const t of tops) if (t < b.top - 0.5 && t > 1.0) k.box(cx, 0.04, b.x1 - b.x0 - 0.2, 0.08, EAVE + t - r - 0.1, EAVE + t - r + 0.08, TRIM, TRIM);
      // The attic storey's window, in the gables' three middle bays.
      const m5 = i % 5;
      if (m5 >= 1 && m5 <= 3) casement(k, d, f, cx, F1 + 1.2, 0.75, 1.05, TRIM, { sw: 0.08, proud: 0.04, shutters: SHUT });
    }
    // Lesenes at every bay's edge, from the cornice up the crests to a pedestal and ball.
    const edges = new Map<number, number>();
    for (const b of bays) for (const [x, other] of [[b.x0, b.top], [b.x1, b.top]] as [number, number][]) edges.set(Math.round(x * 100), Math.min(edges.get(Math.round(x * 100)) ?? 99, other));
    const BALL = mat('#f1ece4', Surface.Stone, Stone.Render, 0.03);
    for (const [xk, low] of edges) {
      const x = xk / 100, yTop = EAVE + low - 0.1;
      k.box(x, 0.05, 0.24, 0.1, F1 + 0.3, yTop, TRIM, null);
      d.box(x, -0.3, 0.3, 0.3, yTop, yTop + 0.35, BALL, BALL);
      d.ball(x, yTop + 0.52, -0.3, 0.17, BALL, 8);
    }
    // The turret between the gables: a small square tower with two slits, a cornice and a ball.
    const tx = 5 * bw + tw / 2, tTop = EAVE + 2.1;
    k.box(tx, -0.4, tw - 0.1, 0.9, F1, tTop, WALL, TRIM);
    for (const s of [-0.2, 0.2]) k.plate([tx + s, EAVE + 1.1, 0.05], U, V, R(-0.05, 0, 0.05, 0.35), mat('#1b1a18', Surface.Opening), 0.02);
    k.sweep([[tx - tw / 2, tTop, 0.07], [tx + tw / 2, tTop, 0.07]], PROFILE.cornice(0.12, 0.2), TRIM, { caps: true });
    d.ball(tx, tTop + 0.4, -0.4, 0.18, BALL, 8);
    k.light([L / 2, 10, 7], 1);
  },
};

/**
 * U Bílého jednorožce, the house south of the Týn school (8607, 8608, 8609): an arcade of four
 * round arches; seven bays of windows in three storeys, the first two under segmental hoods that
 * end in scrolls on consoles, with aprons below, the third plain with ears; bands between the
 * storeys, rusticated quoins at the south corner, a heavy cornice with a course of tiles on it; and
 * the baroque attic: three pedimented gables with louvred windows, the outer two over the first and
 * last pairs of windows and the middle one over the fourth, joined by a parapet that sweeps up to
 * them in scrolls, a slate mansard behind. Pale peach plaster, the relief in the same colour.
 */
export const whiteUnicorn: Model = {
  id: 'white-unicorn',
  unnamed: true,
  floodlit: true,
  replaces: ['way/30825030'],
  build(site, k, d, f) {
    k.seed = 150; d.seed = 151; f.seed = 152;
    const { L, ring } = front(site, [k, d, f], 'way/30825030');
    const WALL = mat('#d3b8ad', Surface.Wall, Style.OldTown, 0, SFlag.TrimPale);
    const TRIM = mat('#dbc1b5', Surface.Stone, Stone.Render, 0.04);
    const ROOF = mat('#35373b', Surface.Metal, Metal.Slate);
    // M19: the heights measured from 8607's camera solved again (design.md §12.1): taller windows
    // on the first floor, the cornice at 15.3 m, an attic storey, the gables' tips at 19.4 m.
    const GF = 4.3, S1 = 9.1, S2 = 13.73, EAVE = 15.3, TOP = 16.6;
    walls(k, ring, -2, TOP, WALL, EAVE, GF);
    // The mansard's top no higher than the gables' tips: from the square it shows between them (8607).
    k.roof(ring, TOP, { shape: 'mansard', pitch: 35, lower: 70, inset: 1.3, cap: 2.9, gable: () => false }, ROOF, ROOF);
    arcade(k, L, GF, 4, 'round', mat('#cfb3a6', Surface.Stone, Stone.Render, 0.1), 3.5, 0.9);
    k.sweep([[-0.15, GF, 0], [L + 0.15, GF, 0]], PROFILE.string(0.2, 0.35), TRIM, { caps: true });
    f.sweep([[0.1, S2 - 0.3, 0], [L - 0.1, S2 - 0.3, 0]], PROFILE.band(0.06, 0.14), TRIM, { caps: true });
    k.sweep([[-0.25, EAVE, 0], [L + 0.25, EAVE, 0]], PROFILE.cornice(0.6, 0.65), TRIM, { caps: true });
    // The course of tiles on the cornice.
    k.sweep([[-0.25, EAVE + 0.65, 0.6], [L + 0.25, EAVE + 0.65, 0.6]], [[0, 0], [0.05, 0], [-0.62, 0.22], [-0.66, 0.2]], mat('#8a5540', Surface.Roof), { caps: true });
    // Quoins up the south corner, long and short in turn.
    for (let y = GF + 0.1, i = 0; y + 0.5 < EAVE; y += 0.56, i++) {
      const w = i % 2 ? 0.55 : 0.9;
      f.slab([0, 0, 0.06], U, V, R(L - w, y, L, y + 0.5), 0.06, TRIM);
    }
    // Seven bays of windows.
    const e = 0.95, p = (L - 2 * e) / 7;
    for (let i = 0; i < 7; i++) {
      const x = e + (i + 0.5) * p;
      casement(k, d, f, x, GF + 1.35, 1.1, 2.3, TRIM, { hood: 'segmental', apron: true });
      casement(k, d, f, x, S1 + 0.95, 1.1, 2.0, TRIM, { hood: 'segmental', apron: true });
      casement(k, d, f, x, S2 + 0.05, 1.0, 1.25, TRIM, { ears: true, sw: 0.16 });
    }
    // The attic: a parapet over the cornice, three pedimented gables rising from it in scrolls, the
    // outer two over the first and last pairs of windows and the middle one over the fourth (8607).
    k.box(L / 2, -0.25, L, 0.5, EAVE + 0.65, TOP + 0.6, WALL, TRIM);
    for (const [x, gw] of [[e + p, 3.3], [e + 3.5 * p, 3.0], [e + 6 * p, 3.3]]) {
      const gh = 2.05;
      k.slab([0, 0, 0.05], U, V, R(x - gw / 2, TOP - 0.1, x + gw / 2, TOP + gh), 0.6, WALL);
      pediment(k, [0, 0, 0.05], U, V, x, TOP + gh, gw + 0.3, 0.75, 0.3, TRIM, 'triangular');
      for (const s of [-1, 1]) {
        k.box(x + s * (gw / 2 - 0.12), 0.1, 0.24, 0.1, TOP, TOP + gh, TRIM, null);
        // The scroll: a concave sweep from the gable's side down to the parapet, a curl at its foot.
        const wing: V2[] = [[0, 0], [0.95, 0], [0.95, 0.12]];
        for (let q = 1; q <= 6; q++) { const t = q / 6; wing.push([0.95 * (1 - t), 0.12 + (gh - 1.0) * (1 - Math.cos((t * Math.PI) / 2))]); }
        k.slab([0, 0, 0.02], U, V, wing.map(([a, b]) => [x + s * (gw / 2 + a), TOP + 0.55 + b] as V2), 0.45, WALL);
        f.slab([0, 0, 0.1], U, V, ngon(10, 0.13, 0, x + s * (gw / 2 + 0.9), TOP + 0.75), 0.08, TRIM);
      }
      k.plate([x, TOP + 0.75, 0.05], U, V, R(-0.36, 0, 0.36, 1.0), mat('#cfc9bf', Surface.Opening), 0.03);
      surround(d, [0, 0, 0.05], U, V, x, TOP + 0.67, 0.9, 1.16, TRIM, { proud: 0.06, depth: 0.09 });
      for (let q = 1; q < 7; q++) d.box(x, 0.12, 0.7, 0.03, TOP + 0.75 + q * 0.14, TOP + 0.77 + q * 0.14, mat('#9d978d', Surface.Plain), null);
    }
    k.sweep([[0, TOP + 0.6, 0.05], [L, TOP + 0.6, 0.05]], PROFILE.string(0.12, 0.18), TRIM, { caps: true });
    k.light([L / 2, 12, 7], 1);
  },
};
