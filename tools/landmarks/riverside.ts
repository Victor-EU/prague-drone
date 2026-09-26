// The landmarks along the Old Town and New Town bank (design.md §7.1): the National Theatre with its
// dark vaulted roof over the auditorium, its golden crown and the chariots on the front; the Šítkov
// water tower of dark rubble under a copper onion; St Francis of Assisi's dome on its drum; the
// Klementinum's astronomical tower with Atlas on top; the Rudolfinum with its corner pavilions and
// the statues along its balustrade. All floodlit at night.

import { Kit, mat, rect, arch, offsetRing, orientedRect, ngon, type V2, type V3, type Mat } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style } from '../../src/core/buildings.ts';
import { buildParts, COPPER } from './parts.ts';
import { pilaster, entablature, traceryWindow, ribs, column, balustrade, statue } from './ornament.ts';

const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const WINDOW = mat('#1e2226', Surface.Glass, Glass.Plain);
const OPENING = mat('#181612', Surface.Opening);
const BRONZE = mat('#2f3531', Surface.Stone, Stone.Render, 0.2);

/** A ring as local V2 from a feature's outer ring, relative to (ox, oz). */
function ringOf(site: Site, key: string, ox = 0, oz = 0): V2[] {
  const r = site.feature(key)!.polygons[0].outer, out: V2[] = [];
  for (let i = 0; i < r.length; i += 2) out.push([r[i] - ox, r[i + 1] - oz]);
  return out;
}
function centre(site: Site, key: string): V2 {
  const r = site.feature(key)!.polygons[0].outer;
  let x = 0, z = 0;
  for (let i = 0; i < r.length; i += 2) { x += r[i]; z += r[i + 1]; }
  return [x / (r.length / 2), z / (r.length / 2)];
}

/** Rounded rectangle, w by d, corners of radius r, as a ring of n points per corner. */
function rounded(w: number, d: number, r: number, cx = 0, cz = 0, n = 4): V2[] {
  const out: V2[] = [];
  const c = [[w / 2 - r, d / 2 - r, 0], [-w / 2 + r, d / 2 - r, 90], [-w / 2 + r, -d / 2 + r, 180], [w / 2 - r, -d / 2 + r, 270]];
  for (const [x, z, a0] of c) for (let i = 0; i <= n; i++) { const a = ((a0 + (90 * i) / n) * Math.PI) / 180; out.push([cx + x + r * Math.cos(a), cz + z + r * Math.sin(a)]); }
  return out;
}

export const nationalTheatre: Model = {
  id: 'national-theatre',
  floodlit: true,
  replaces: ['way/379386266'],
  build(site, k, d) {
    k.seed = 91; d.seed = 92;
    const out = orientedRect(site.feature('way/7649971')!.polygons[0].outer);
    const g = site.bare(out.cx, out.cz);
    const SAND = mat('#b09470', Surface.Wall, Style.Palace), SAND_STONE = mat('#a58a66', Surface.Stone, Stone.Ashlar, 0.35);
    // The stage house and the wings from their parts; the main block to its cornice.
    buildParts(site, k, ['way/481972519', 'way/481972520', 'way/565056632', 'way/565056633'], g, { wall: SAND, roof: () => COPPER });
    k.place(0, g, 0, 90); k.ground = g;
    k.prism(ringOf(site, 'way/7649971'), -2, 22, SAND, mat('#6d6f6a', Surface.FlatRoof), { windows: true, eave: g + 22 });
    k.prism(offsetRing(ringOf(site, 'way/7649971'), 0.5), 21.2, 22.3, SAND_STONE, SAND_STONE);
    // The auditorium's roof: a dark vault rising from the cornice, a gilded band and the crown.
    const au = orientedRect(site.feature('way/454893462')!.polygons[0].outer);
    k.place(au.cx, g, au.cz, au.bearing);
    const W = au.w, D = au.d;
    const levels: [number, number, number][] = [[1.0, 1.0, 22.3], [0.97, 0.97, 27], [0.88, 0.9, 31], [0.7, 0.78, 34.5], [0.45, 0.6, 36.8], [0.22, 0.46, 37.9]];
    const ringAt = ([sw, sd]: [number, number, number]) => rounded(W * sw, D * sd, Math.min(W * sw, D * sd) * 0.3);
    const ROOF = mat('#343a45', Surface.Metal, Metal.Lead);
    for (let i = 0; i + 1 < levels.length; i++) k.loft(ringAt(levels[i]), levels[i][2], ringAt(levels[i + 1]), levels[i + 1][2], ROOF);
    k.poly(ringAt(levels[levels.length - 1]).map(([x, z]) => [x, 37.9, z] as V3), GOLD, { normal: [0, 1, 0] });
    k.loft(offsetRing(ringAt(levels[1]), 0.08), 26.6, offsetRing(ringAt(levels[1]), 0.08), 27.2, GOLD);
    // The crown: gilded posts and a rail round the top.
    const top = ringAt(levels[levels.length - 1]);
    top.forEach(([x, z], i) => { if (i % 2 === 0) d.beam([x, 37.9, z], [x, 39.4, z], 0.28, GOLD); });
    d.loft(offsetRing(top, 0.1), 39.2, offsetRing(top, 0.1), 39.5, GOLD);
    // The chariots on the front's attic corners (the north end, facing Národní).
    k.place(out.cx, g, out.cz, out.bearing);
    const front = (() => { const a = k.world([-out.w / 2, 0, 0]), b = k.world([out.w / 2, 0, 0]); return a[2] < b[2] ? -1 : 1; })();
    for (const sz of [-1, 1]) {
      const x = front * (out.w / 2 - 3), z = sz * (out.d / 2 - 3);
      k.box(x, z, 4.2, 3.2, 22, 25, SAND_STONE, SAND_STONE);
      d.box(x, z, 3.2, 1.6, 25, 26.3, BRONZE);
      for (const dz of [-0.9, 0, 0.9]) d.lathe(x + front * 0.8, z + dz, [[0.5, 25], [0.35, 26.6], [0.1, 27.4]], 6, BRONZE, { flat: true });
      d.lathe(x - front * 0.6, z, [[0.4, 26.2], [0.3, 28.4], [0.18, 29], [0, 29.4]], 6, BRONZE, { flat: true });
    }
    k.light([0, 12, 0], 1);
  },
};

export const sitkovTower: Model = {
  id: 'sitkov-tower',
  floodlit: true,
  replaces: ['way/574421394', 'way/574697893'],
  build(site, k, d) {
    k.seed = 93; d.seed = 94;
    const r = orientedRect(site.feature('way/30169179')!.polygons[0].outer);
    const g = site.bare(r.cx, r.cz);
    k.place(r.cx, g, r.cz, r.bearing); d.place(r.cx, g, r.cz, r.bearing);
    k.ground = d.ground = g;
    const STONE = mat('#6f655b', Surface.Stone, Stone.Rubble, 0.5), BAND = mat('#8b8072', Surface.Stone, Stone.Ashlar, 0.3);
    const ONION = mat('#44594f', Surface.Metal, Metal.Copper);
    const body = rect(r.w, r.d);
    k.prism(body, -4, 29.4, STONE, null);
    for (const y of [8, 17.5]) k.prism(offsetRing(body, 0.1), y, y + 0.35, BAND, BAND);
    k.prism(offsetRing(body, 0.35), 29.4, 30.4, BAND, BAND);
    for (const [o, u] of [[[0, 0, r.d / 2], [1, 0, 0]], [[0, 0, -r.d / 2], [-1, 0, 0]], [[r.w / 2, 0, 0], [0, 0, -1]], [[-r.w / 2, 0, 0], [0, 0, 1]]] as [V3, V3][])
      for (const y of [4, 11, 20, 25.5]) k.plate([o[0], y, o[2]], u, [0, 1, 0], arch(0.9, 1.8, 'round'), WINDOW, 0.05);
    // The onion: a square base, the bulb, a lantern and the spire.
    const R = Math.min(r.w, r.d) / 2;
    k.lathe(0, 0, [[R * 1.25, 30.4], [R * 1.05, 31.3]], 4, ONION, { flat: true, phase: 45 });
    k.lathe(0, 0, [[R * 0.95, 31.3], [R * 1.05, 33.5], [R * 0.9, 36], [R * 0.45, 38.2], [0.9, 39.6]], 16, ONION);
    k.lathe(0, 0, [[0.9, 39.6], [0.85, 41.5]], 8, OPENING, { flat: true });
    k.lathe(0, 0, [[1.05, 41.4], [0.9, 42.4], [0.35, 43.6], [0.06, 46.5]], 8, ONION);
    d.ball(0, 46.8, 0, 0.25, GOLD);
  },
};

export const stFrancis: Model = {
  id: 'st-francis',
  floodlit: true,
  build(site, k, d, f) {
    k.seed = 95; d.seed = 96; f.seed = 97;
    const r = orientedRect(site.feature('way/28552795')!.polygons[0].outer);
    const g = site.bare(r.cx, r.cz);
    const WALL = mat('#cfae93', Surface.Wall, Style.Palace), BAND = mat('#dcc5ae', Surface.Stone, Stone.Render, 0.25);
    const TILES = mat('#9a5c45', Surface.Roof), COPPER_DARK = mat('#5f8878', Surface.Metal, Metal.Copper);
    for (const kit of [k, d, f]) { kit.place(r.cx, g, r.cz, r.bearing); kit.ground = g; }
    const body = rect(r.w, r.d);
    k.prism(body, -2, 16.5, WALL, null, { windows: true, eave: g + 16.5 });
    entablature(k, body.map(([x, z]) => [x, 15.6, z] as V3), BAND, { out: 0.6, h: 1.4, closed: true });
    k.roof(body, 17, { shape: 'hipped', pitch: 40, cap: 99, gable: () => false }, TILES, BAND);
    // The drum, pilastered between its windows, under an entablature; the ribbed dome; the lantern
    // on eight columns.
    const [dx, dz] = centre(site, 'way/420538053');
    const [lx, , lz] = k.local(dx, 0, dz);
    const R = 7.4, UP: V3 = [0, 1, 0];
    k.prism(ngon(16, R, 11.25, lx, lz), 17, 27.5, BAND, null);
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * Math.PI * 2, b = (i / 8) * Math.PI * 2;
      traceryWindow(k, f, [lx + R * Math.cos(a), 0, lz + R * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, 0, 20.5, 1.5, 4.2, BAND, WINDOW, { lights: 1, kind: 'round', proud: 0.12, depth: 0.26 });
      pilaster(k, [lx + R * Math.cos(b), 17, lz + R * Math.sin(b)], [Math.sin(b), 0, -Math.cos(b)], UP, 0, 0.3, 10.2, 1.1, 0.45, BAND, { capH: 0.8, baseH: 0.5 });
    }
    entablature(k, ngon(16, R, 11.25, lx, lz).map(([x, z]) => [x, 27.3, z] as V3), BAND, { out: 0.7, h: 1.6, closed: true });
    const dome: V2[] = [[R + 0.2, 28.9], [R * 0.93, 31.9], [R * 0.72, 34.8], [R * 0.4, 37.0], [1.4, 37.8]];
    k.lathe(lx, lz, dome, 24, COPPER);
    ribs(k, lx, lz, dome, 16, 0.2, COPPER_DARK, 11.25);
    k.lathe(lx, lz, [[1.0, 37.8], [1.0, 40.4]], 8, BAND, { flat: true, phase: 22.5 });
    for (let q = 0; q < 8; q++) { const a = ((q + 0.5) * Math.PI) / 4; column(f, lx + 1.4 * Math.cos(a), lz + 1.4 * Math.sin(a), 37.8, 40.4, 0.14, BAND, { sides: 8 }); }
    k.lathe(lx, lz, [[1.6, 40.4], [1.6, 40.7], [1.55, 40.8], [0.9, 41.8], [0.12, 43.2]], 8, COPPER, { flat: true });
    d.lathe(lx, lz, [[0.06, 43], [0.05, 45]], 4, GOLD);
    d.beam([lx - 0.5, 44.3, lz], [lx + 0.5, 44.3, lz], 0.1, GOLD);
    k.light([lx, 20, lz], 1);
  },
};

export const klementinumTower: Model = {
  id: 'klementinum-tower',
  floodlit: true,
  build(site, k, d) {
    k.seed = 97; d.seed = 98;
    const r = orientedRect(site.feature('way/382636013')!.polygons[0].outer);
    const g = site.bare(r.cx, r.cz) + 0;
    k.place(r.cx, g, r.cz, r.bearing); d.place(r.cx, g, r.cz, r.bearing);
    k.ground = d.ground = g;
    const OCHRE = mat('#e0c688', Surface.Stone, Stone.Render, 0.25), WHITE = mat('#efe6cf', Surface.Stone, Stone.Render, 0.15);
    const body = rect(r.w, r.d);
    k.prism(body, 8, 36.5, OCHRE, null);
    for (const [x, z] of body) k.box(x * 0.93, z * 0.93, 1, 1, 8, 36.5, WHITE, null);
    k.prism(offsetRing(body, 0.4), 36.5, 37.4, WHITE, WHITE);
    // The belvedere: open arches on each side, then the copper cap and Atlas with the sphere.
    k.prism(offsetRing(body, -0.3), 37.4, 41.5, OCHRE, null);
    for (const [o, u] of [[[0, 0, r.d / 2 - 0.3], [1, 0, 0]], [[0, 0, -r.d / 2 + 0.3], [-1, 0, 0]], [[r.w / 2 - 0.3, 0, 0], [0, 0, -1]], [[-r.w / 2 + 0.3, 0, 0], [0, 0, 1]]] as [V3, V3][]) {
      k.plate([o[0], 37.9, o[2]], u, [0, 1, 0], arch(2.2, 3.1, 'round'), OPENING, 0.05);
      k.plate([o[0], 30, o[2]], u, [0, 1, 0], ngon(20, 1.1, 0), mat('#ece5d2', Surface.Plain), 0.06);
    }
    k.prism(offsetRing(body, 0.2), 41.5, 42, WHITE, WHITE);
    const R = Math.min(r.w, r.d) / 2 * Math.SQRT2;
    k.lathe(0, 0, [[R, 42], [R * 0.92, 43.2], [R * 0.55, 45.3], [R * 0.62, 46.4], [0.6, 48.4], [0.25, 49.6]], 4, COPPER, { flat: true, phase: 45 });
    d.lathe(0, 0, [[0.4, 49.6], [0.35, 51.2]], 6, GOLD, { flat: true });
    d.ball(0, 52, 0, 0.75, GOLD, 10);
  },
};

export const rudolfinum: Model = {
  id: 'rudolfinum',
  floodlit: true,
  build(site, k, d, f) {
    k.seed = 99; d.seed = 100; f.seed = 101;
    const out = orientedRect(site.feature('way/30123527')!.polygons[0].outer);
    const g = site.bare(out.cx, out.cz);
    const WALL = mat('#dac7a2', Surface.Wall, Style.Palace), STONE = mat('#d0bc96', Surface.Stone, Stone.Ashlar, 0.3);
    buildParts(site, k, ['way/668207433', 'way/1366644296'], g, { wall: WALL, flatTop: mat('#8d8f8c', Surface.FlatRoof) });
    buildParts(site, k, ['way/497192157', 'way/497192158', 'way/497192159', 'way/497192160', 'way/497192161', 'way/666627099', 'way/666627100'], g, { wall: STONE, roof: () => COPPER });
    buildParts(site, k, ['way/380044480', 'way/665521497', 'way/665521498'], g, { wall: STONE });
    // The cornice, the balustrade and its statues round the main block's attic.
    const main = ringOf(site, 'way/668207433');
    for (const kit of [k, d, f]) { kit.place(0, g, 0, 90); kit.ground = g; }
    entablature(k, main.map(([x, z]) => [x, 15.9, z] as V3), STONE, { out: 0.8, h: 1.5, closed: true });
    k.prism(offsetRing(main, 0.3), 17.2, 18, STONE, STONE);
    balustrade(f, offsetRing(main, 0.1).map(([x, z]) => [x, 18, z] as V3), STONE, { h: 1.15, w: 0.3, step: 0.38, closed: true });
    let cx = 0, cz = 0;
    for (const [x, z] of main) { cx += x / main.length; cz += z / main.length; }
    for (let i = 0; i < main.length; i++) {
      const [ax, az] = main[i], [bx, bz] = main[(i + 1) % main.length];
      const len = Math.hypot(bx - ax, bz - az), n = Math.floor(len / 6);
      for (let q = 1; q < n; q++) {
        const x = ax + ((bx - ax) * q) / n, z = az + ((bz - az) * q) / n, l = Math.hypot(x - cx, z - cz) || 1;
        d.box(x, z, 0.8, 0.8, 18, 19.1, STONE);
        statue(d, [x, 19.1, z], [(x - cx) / l, (z - cz) / l], 2.4, mat('#b9a887', Surface.Stone, Stone.Render, 0.3), 'single', 200 + i * 7 + q);
      }
    }
    k.light([out.cx, 10, out.cz], 1);
  },
};
