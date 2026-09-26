// The Old Town's landmarks beyond Týn (design.md §7.1): the Powder Tower, blackened, with its gate,
// gallery, corner turrets and steep roof; the Old Town Hall tower of the same Gothic type, with the
// astronomical clock on its south face (the blue astronomical dial over the golden calendar in
// their carved frame) and the chapel's oriel; on the square, St Nicholas with its two onion
// towers and the dome, the Jan Hus memorial and the Marian column.

import { Kit, mat, rect, arch, offsetRing, orientedRect, ngon, PROFILE, type V2, type V3 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style } from '../../src/core/buildings.ts';
import { gothicTower, placeOn } from './bridge-towers.ts';
import { pinnacle, traceryWindow, surround, statue } from './ornament.ts';
import { COPPER } from './parts.ts';

const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const WINDOW = mat('#1e2226', Surface.Glass, Glass.Plain);
const BRONZE = mat('#2c3330', Surface.Stone, Stone.Render, 0.25);

export const powderTower: Model = {
  id: 'powder-tower',
  floodlit: true,
  replaces: ['way/225234255'],
  build(site, k, d, f) {
    k.seed = 101; d.seed = 102; f.seed = 109;
    const r = placeOn([k, d, f], site, 'way/27124370', 108);
    gothicTower(k, d, f, {
      w: r.w, d: r.d, body: 43.5, gallery: 46.6, roofTop: 64.5, ridge: 3.4,
      turret: { r: 1.0, shaft: 48.2, spire: 54.5 }, tracery: [26, 41], gate: { w: 5.6, h: 8.4 },
      strings: [10.4, 17.5, 24.8], windows: [12.5, 19.5],
      stone: mat('#4f443d', Surface.Stone, Stone.Ashlar, 1), dressing: mat('#7d7266', Surface.Stone, Stone.Ashlar, 0.5),
      roof: mat('#3b3f44', Surface.Metal, Metal.Slate), sculpted: 1,
    });
    k.light([0, 30, 0], 1);
  },
};

export const oldTownHall: Model = {
  id: 'old-town-hall',
  floodlit: true,
  replaces: ['way/481986568', 'way/481986569', 'way/481986570', 'way/481986571', 'way/481986572', 'way/481986573', 'way/481986574', 'way/482235437', 'way/482235438'],
  build(site, k, d, f) {
    k.seed = 103; d.seed = 104; f.seed = 110;
    const r = placeOn([k, d, f], site, 'way/391354925', 66);
    const stone = mat('#84776a', Surface.Stone, Stone.Ashlar, 0.8);
    gothicTower(k, d, f, {
      w: r.w, d: r.d, body: 41, gallery: 43.8, roofTop: 60, ridge: 1.6,
      turret: { r: 0.85, shaft: 45.8, spire: 52 }, tracery: [29, 38.5], strings: [16, 27.6], windows: [18.5, 22.5],
      stone, dressing: mat('#9a8d7e', Surface.Stone, Stone.Ashlar, 0.45), roof: mat('#3a3e43', Surface.Metal, Metal.Slate),
    });
    // The orloj on the face toward the square (local +z points south-south-east): the two dials in
    // their carved frame, pinnacled, with the figures beside them.
    const face = r.d / 2 + 0.05;
    const u: V3 = [1, 0, 0], v: V3 = [0, 1, 0];
    const FRAME = mat('#6d6154', Surface.Stone, Stone.Ashlar, 0.6);
    k.slab([0, 2.8, face + 0.6], u, v, [[-2.9, 0], [2.9, 0], [2.9, 10.2], [0, 12.8], [-2.9, 10.2]], 0.6, FRAME);
    for (const sx of [-1, 1]) {
      pinnacle(k, f, sx * 2.6, face + 0.3, 13.0, 14.6, 17.0, 0.3, FRAME, { sides: 4, crockets: true });
      pinnacle(f, f, sx * 3.1, face + 0.35, 6.4, 7.2, 8.6, 0.16, FRAME, { sides: 4 });
      statue(f, [sx * 2.35, 7.6, face + 0.75], [0, 1], 1.15, BRONZE, 'single', 20 + sx);
      statue(f, [sx * 2.35, 3.3, face + 0.75], [0, 1], 1.05, BRONZE, 'single', 24 + sx);
    }
    surround(f, [0, 0, face + 0.6], u, v, -0.75, 10.9, 0.9, 0.9, FRAME, { proud: 0.08, depth: 0.14 });
    surround(f, [0, 0, face + 0.6], u, v, 0.75, 10.9, 0.9, 0.9, FRAME, { proud: 0.08, depth: 0.14 });
    const at = (y: number, rr: number, col: string, off: number) => k.plate([0, y, face + 0.6], u, v, ngon(32, rr, 0), mat(col, Surface.Plain), off);
    at(8.4, 1.95, '#2b2621', 0.04); at(8.4, 1.75, '#c8a655', 0.05); at(8.4, 1.45, '#2f4d78', 0.06); at(8.4, 0.75, '#1d1b1a', 0.07);
    k.plate([0, 8.4, face + 0.6], u, v, [[-1.45, -0.2], [1.45, -0.2], [1.2, -1.1], [-1.2, -1.1]], mat('#a3483a', Surface.Plain), 0.065);
    at(4.1, 1.75, '#2b2621', 0.04); at(4.1, 1.55, '#d6c08c', 0.05); at(4.1, 0.9, '#a3483a', 0.06); at(4.1, 0.4, '#c8a655', 0.07);
    k.plate([0, 10.9, face + 0.6], u, v, [[-1.2, 0], [-0.3, 0], [-0.3, 0.9], [-1.2, 0.9]], WINDOW, 0.05);
    k.plate([0, 10.9, face + 0.6], u, v, [[0.3, 0], [1.2, 0], [1.2, 0.9], [0.3, 0.9]], WINDOW, 0.05);
    k.pyramid(rect(6, 1.5, 0, face + 0.9), 12.6, 14.4, COPPER);
    // The chapel's oriel on the east face: a hexagonal bay on a corbel, traceried on its three
    // outer faces, pinnacles at its corners under the copper spire.
    const ox = r.w / 2 + 1.3;
    const ORIEL = mat('#8f8171', Surface.Stone, Stone.Ashlar, 0.6), OGLASS = mat('#262a2c', Surface.Glass, Glass.Tracery);
    const hex = ngon(6, 1.8, 0, ox, 1.2);
    k.lathe(ox, 1.2, [[0.4, 5.5], [1.2, 7.2], [1.85, 8]], 6, ORIEL, { flat: true });
    k.prism(hex, 8, 21, ORIEL, null);
    k.sweep(hex.map(([x, z]) => [x, 12.6, z] as V3), PROFILE.string(0.2, 0.35), FRAME, { closed: true });
    for (let q = -1; q <= 1; q++) {
      const a = (q * Math.PI) / 3, nx = Math.cos(a), nz = Math.sin(a), rr = 1.8 * Math.cos(Math.PI / 6);
      traceryWindow(k, f, [ox + rr * nx, 0, 1.2 + rr * nz], [-nz, 0, nx], v, 0, 13.4, 1.15, 5.5, FRAME, OGLASS, { lights: 1, proud: 0.1, depth: 0.16 });
    }
    for (const [x, z] of hex) pinnacle(k, f, x, z, 20.2, 21.4, 23.6, 0.22, FRAME, { sides: 4, crockets: true });
    k.lathe(ox, 1.2, [[2.0, 21], [0, 27.5]], 6, COPPER, { flat: true });
    d.ball(ox, 27.8, 1.2, 0.2, GOLD, 6);
    k.light([0, 30, face + 5], 1);
  },
};

export const stNicholasOldTown: Model = {
  id: 'st-nicholas-old-town',
  floodlit: true,
  replaces: ['way/462411202', 'way/462411203', 'way/462411204', 'way/462411205', 'way/462411206', 'way/462411207'],
  build(site, k, d) {
    k.seed = 105; d.seed = 106;
    const r = orientedRect(site.feature('way/27859115')!.polygons[0].outer);
    const g = site.bare(r.cx, r.cz);
    k.place(0, g, 0, 90); d.place(0, g, 0, 90);
    k.ground = d.ground = g;
    const WALL = mat('#ece2cc', Surface.Wall, Style.Palace), TRIM = mat('#f4ecda', Surface.Stone, Stone.Render, 0.15);
    const ring: V2[] = [];
    const o = site.feature('way/27859115')!.polygons[0].outer;
    for (let i = 0; i < o.length; i += 2) ring.push([o[i], o[i + 1]]);
    k.prism(ring, -2, 17, WALL, null, { windows: true, eave: g + 17 });
    k.prism(offsetRing(ring, 0.45), 16.4, 17.3, TRIM, TRIM);
    k.roof(ring, 17.3, { shape: 'hipped', pitch: 38, cap: 99, gable: () => false }, mat('#a4584a', Surface.Roof), TRIM);
    const at = (key: string): V2 => { const p = site.feature(key)!.polygons[0].outer; let x = 0, z = 0; for (let i = 0; i < p.length; i += 2) { x += p[i]; z += p[i + 1]; } return [x / (p.length / 2), z / (p.length / 2)]; };
    // The two towers, each with its dome and onion lantern.
    for (const key of ['way/462411202', 'way/462411204']) {
      const [x, z] = at(key);
      k.prism(ngon(4, 4.4 * Math.SQRT2 / 1.4, 45 + r.bearing - 90, x, z), 17, 27.5, TRIM, null);
      k.lathe(x, z, [[3.3, 27.5], [3.1, 29], [2.1, 30.6], [0.9, 31.3]], 12, COPPER);
      k.lathe(x, z, [[0.9, 31.3], [0.9, 32.6], [1.25, 33.5], [0.2, 35.6]], 8, COPPER);
      d.ball(x, 36, z, 0.2, GOLD, 6);
    }
    // The dome on its drum.
    const [x, z] = at('way/462411206');
    k.prism(ngon(16, 6.4, 11.25, x, z), 17, 26.5, TRIM, null);
    for (let i = 0; i < 8; i++) { const a = ((i + 0.5) / 8) * Math.PI * 2; k.plate([x + 6.35 * Math.cos(a), 19.5, z + 6.35 * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], [0, 1, 0], arch(1.3, 3.6, 'round'), WINDOW, 0.05); }
    k.lathe(x, z, [[6.8, 26.5], [6.4, 29], [4.8, 31.6], [2.2, 33.4], [1.1, 33.8]], 20, COPPER);
    k.lathe(x, z, [[1.1, 33.8], [1.1, 36.2], [1.5, 37.2], [0.2, 40.5]], 8, COPPER);
    d.ball(x, 40.9, z, 0.22, GOLD, 6);
  },
};

export const husMemorial: Model = {
  id: 'hus-memorial',
  covers: ['marian-column'],
  build(site, k, d) {
    k.seed = 107; d.seed = 108;
    const c = site.landmark('hus-memorial');
    const g = site.bare(c.x, c.z);
    k.place(c.x, g, c.z, 90); d.place(c.x, g, c.z, 90);
    k.ground = d.ground = g;
    const GRANITE = mat('#6d6a64', Surface.Stone, Stone.Ashlar, 0.4);
    // The stepped oval base, the rock, the figure of Hus and the groups round him.
    const oval = (w: number, dd: number): V2[] => Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return [(w / 2) * Math.cos(a), (dd / 2) * Math.sin(a)] as V2; });
    k.prism(oval(22, 12), -0.5, 0.45, GRANITE, GRANITE);
    k.prism(oval(20, 10.5), 0.45, 0.9, GRANITE, GRANITE);
    k.prism(oval(15, 7.5), 0.9, 2.2, BRONZE, BRONZE);
    k.lathe(0, 0.8, [[1.6, 2.2], [1.2, 3.4], [0.7, 6.2], [0.45, 7], [0, 7.3]], 8, BRONZE, { flat: true });
    d.ball(0, 7.55, 0.8, 0.3, BRONZE, 6);
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2, x = 6 * Math.cos(a) * (0.8 + 0.2 * rnd()), z = 3 * Math.sin(a) * (0.8 + 0.2 * rnd()), h = 2.2 + 1.3 * rnd();
      d.lathe(x, z, [[0.55, 2.2], [0.45, 2.2 + h * 0.6], [0.3, 2.2 + h * 0.9], [0, 2.2 + h]], 6, BRONZE, { flat: true, phase: rnd() * 60 });
    }
    // The Marian column to the south.
    const m = site.landmark('marian-column');
    const gm = site.bare(m.x, m.z);
    k.place(m.x, gm, m.z, 90); d.place(m.x, gm, m.z, 90);
    k.ground = d.ground = gm;
    const SAND = mat('#b8a88c', Surface.Stone, Stone.Ashlar, 0.35);
    k.prism(ngon(8, 3.4, 22.5), -0.5, 1.6, SAND, SAND);
    k.box(0, 0, 3.2, 3.2, 1.6, 4.2, SAND, SAND);
    k.lathe(0, 0, [[0.6, 4.2], [0.52, 14.5], [0.8, 14.8], [0.8, 15.4]], 12, SAND);
    d.lathe(0, 0, [[0.35, 15.4], [0.3, 16.8], [0.15, 17.4], [0, 17.6]], 8, GOLD, { flat: true });
    for (const [x, z] of [[1.8, 1.8], [-1.8, 1.8], [1.8, -1.8], [-1.8, -1.8]]) d.lathe(x, z, [[0.35, 4.2], [0.25, 5.8], [0, 6.2]], 6, SAND, { flat: true });
  },
};
void arch;
