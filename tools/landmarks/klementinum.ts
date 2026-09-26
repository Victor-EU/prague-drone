// The Klementinum's churches at the Old Town end of Charles Bridge (design.md §7.1, added in M12
// for 8704, 8683 and 8694): St Salvator, whose Baroque west front closes Křižovnické square behind
// the Old Town Bridge Tower, a portico of three arches under a balustrade crowded with statues, a
// pilastered upper storey round its great window, an entablature and a pediment with the Saviour
// on top, and its two towers with onion caps at the east end; and beside it the Italian Chapel of
// the Assumption, an oval under a copper dome. Built on OSM's footprints and parts, which they
// replace. Not §6.2 landmarks: no entry in data/landmarks.json, no name on screen.

import { Kit, mat, rect, ngon, arch, offsetRing, orientedRect, PROFILE, type V2, type V3 } from './kit.ts';
import { pilaster, entablature, traceryWindow, balustrade, statue, pediment, onPlane } from './ornament.ts';
import type { Model } from './index.ts';
import { buildParts } from './parts.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

const RENDER = mat('#d8cdb8', Surface.Stone, Stone.Render, 0.3);
const DRESSING = mat('#e6dccb', Surface.Stone, Stone.Render, 0.2);
const TILES = mat('#a35f48', Surface.Roof);
const COPPER = mat('#7aa08f', Surface.Metal, Metal.Copper);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const WINDOW = mat('#23272b', Surface.Glass, Glass.Plain);
const OPENING = mat('#1a1815', Surface.Opening);
const STATUE = mat('#6a655c', Surface.Stone, Stone.Render, 0.4);
const UP: V3 = [0, 1, 0];

export const stSalvator: Model = {
  id: 'st-salvator',
  unnamed: true,
  floodlit: true,
  replaces: ['way/28517284', 'way/420533160', 'way/420533161', 'way/420533162', 'way/420533163', 'way/334314630', 'way/334314631', 'way/28517285', 'way/420695646', 'way/420695647', 'way/420695648', 'way/420695649'],
  build(site, k, d, f) {
    k.seed = 131; d.seed = 132; f.seed = 133;
    const west = orientedRect(site.feature('way/420533162')!.polygons[0].outer);
    const g = site.bare(west.cx, west.cz);
    // The nave and the crossing from their parts, in plain render under tiles.
    buildParts(site, k, ['way/420533162', 'way/420533163', 'way/420533160'], g, { wall: RENDER, roof: () => TILES, flatTop: TILES });
    // The crossing's cupola: a low octagonal drum under a copper cap with a lantern.
    {
      const c = orientedRect(site.feature('way/420533161')!.polygons[0].outer);
      k.place(c.cx, g, c.cz, c.bearing); k.ground = g;
      const r = Math.min(c.w, c.d) / 2;
      k.prism(ngon(8, r, 22.5), 26, 31.5, RENDER, null);
      entablature(k, ngon(8, r, 22.5).map(([x, z]) => [x, 30.4, z] as V3), DRESSING, { out: 0.5, h: 1.1, closed: true });
      k.lathe(0, 0, [[r + 0.3, 31.5], [r * 0.85, 33.5], [r * 0.45, 35.5], [0.8, 36.5]], 8, COPPER, { flat: true, phase: 22.5 });
      k.lathe(0, 0, [[0.8, 36.5], [0.8, 38.5], [1.0, 39], [0.2, 40.5]], 8, COPPER, { flat: true, phase: 22.5 });
      d.ball(0, 40.8, 0, 0.2, GOLD, 6);
    }
    // The west front, closing the square: which end of the west nave faces the bridge tower.
    for (const kit of [k, d, f]) { kit.place(west.cx, g, west.cz, west.bearing); kit.ground = g; }
    const tower = site.landmark('old-town-bridge-tower');
    const lt = k.local(tower.x, g, tower.z);
    const sx = lt[0] < 0 ? -1 : 1; // the front is the end nearer the tower
    const fx = (sx * west.w) / 2, W = Math.max(22, west.d + 4), u: V3 = [0, 0, -sx], o: V3 = [fx, 0, 0];
    const F = (a: number, b: number, off = 0) => onPlane(o, u, UP, a, b, off);
    // The screen: a wall 1.6 m thick, the portico 4.2 m deep before it.
    k.prism(rect(1.6, W, fx - sx * 0.8, 0), -2, 25.6, RENDER, DRESSING);
    k.prism(rect(4.2, W - 1.0, fx + sx * 2.1, 0), -2, 9.6, RENDER, null);
    entablature(k, rect(4.2, W - 1.0, fx + sx * 2.1, 0).map(([x, z]) => [x, 8.6, z] as V3), DRESSING, { out: 0.5, h: 1.0, closed: true });
    const po: V3 = [fx + sx * 4.2, 0, 0];
    for (const a of [-6.4, 0, 6.4]) {
      traceryWindow(k, f, po, u, UP, a, 0.2, 4.2, 7.2, DRESSING, OPENING, { lights: 1, kind: 'round', proud: 0.2, depth: 0.5 });
      pilaster(k, po, u, UP, a + 3.2, 0, 8.6, 1.1, 0.45, DRESSING, { capH: 0.7, baseH: 0.5 });
      pilaster(k, po, u, UP, a - 3.2, 0, 8.6, 1.1, 0.45, DRESSING, { capH: 0.7, baseH: 0.5 });
    }
    // The balustrade over the portico and the statues along it.
    const rail: V3[] = [onPlane(o, u, UP, -W / 2 + 0.7, 9.6, 4.0), onPlane(o, u, UP, W / 2 - 0.7, 9.6, 4.0)];
    balustrade(f, rail, DRESSING, { h: 1.1, w: 0.3, step: 0.36, posts: true });
    const count = 12;
    for (let i = 0; i < count; i++) {
      const a = -W / 2 + 1.6 + ((W - 3.2) * i) / (count - 1);
      const p = onPlane(o, u, UP, a, 10.7, 3.6);
      statue(d, p, [sx, 0], 2.4, STATUE, i % 4 === 1 ? 'pair' : 'single', 140 + i);
    }
    // The upper storey: six pilasters, the great window, two round-headed niches with saints, the
    // entablature and the pediment with the Saviour and two figures on the attic.
    for (const a of [-9.5, -5.7, -2.2, 2.2, 5.7, 9.5]) pilaster(k, o, u, UP, a, 10.2, 24.2, 1.3, 0.5, DRESSING, { capH: 1.0, baseH: 0.6 });
    traceryWindow(k, f, o, u, UP, 0, 12.5, 3.4, 8.6, DRESSING, WINDOW, { lights: 1, kind: 'round', proud: 0.18, depth: 0.4 });
    for (const a of [-7.6, 7.6]) {
      k.plate(F(a, 12.6), u, UP, arch(1.7, 4.4, 'round'), OPENING, 0.04);
      f.sweep([[-0.85, 0], ...arch(1.7, 4.4, 'round').slice(2).reverse(), [0.85, 0]].map(([x, y]) => F(a + x, 12.6 + y)), PROFILE.ring(0.2, 0.14), DRESSING, { v: [sx, 0, 0] });
      statue(d, F(a, 12.7, 0.3), [sx, 0], 3.2, STATUE, 'single', 150 + a);
    }
    entablature(k, [F(-W / 2, 24.2), F(W / 2, 24.2)], DRESSING, { out: 0.9, h: 1.8 });
    k.prism(rect(1.6, 12, fx - sx * 0.8, 0), 25.6, 27.4, RENDER, DRESSING);
    pediment(k, [fx, 0, 0], u, UP, 0, 27.4, 12.4, 3.4, 0.9, RENDER, 'triangular', DRESSING);
    statue(d, F(0, 30.9, -0.4), [sx, 0], 3.0, STATUE, 'single', 160, { pose: 'bless', halo: GOLD });
    for (const a of [-7.5, 7.5]) statue(d, F(a, 26.2, -0.4), [sx, 0], 2.6, STATUE, 'single', 162 + a);
    k.light([fx + sx * 6, 8, 0], 1);
    // The two towers at the east end: their OSM footprints to 30 m, an entablature, an octagonal
    // belfry, the copper onion, a lantern and a small onion under the cross.
    for (const key of ['way/334314630', 'way/334314631']) {
      const t = orientedRect(site.feature(key)!.polygons[0].outer);
      for (const kit of [k, d, f]) { kit.place(t.cx, g, t.cz, t.bearing); kit.ground = g; }
      const w = Math.max(t.w, t.d) * 0.96, body = rect(w, w);
      k.prism(body, 20, 30.5, RENDER, null);
      for (let q = 0; q < 4; q++) {
        const a = (q * Math.PI) / 2, nx = Math.cos(a), nz = Math.sin(a);
        traceryWindow(k, f, [nx * w / 2, 0, nz * w / 2], [nz, 0, -nx], UP, 0, 23.5, 1.5, 4.2, DRESSING, WINDOW, { lights: 1, kind: 'round', proud: 0.12, depth: 0.26 });
      }
      entablature(k, body.map(([x, z]) => [x, 29.4, z] as V3), DRESSING, { out: 0.55, h: 1.2, closed: true });
      const r = w / 2 * 0.86;
      k.prism(ngon(8, r, 22.5), 30.5, 35.5, RENDER, null);
      for (let q = 0; q < 8; q += 2) {
        const a = ((q + 0.5) * Math.PI) / 4, rr = r * Math.cos(Math.PI / 8);
        k.plate([rr * Math.cos(a), 31.4, rr * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, arch(0.9, 2.6, 'round'), OPENING, 0.04);
      }
      entablature(k, ngon(8, r, 22.5).map(([x, z]) => [x, 34.6, z] as V3), DRESSING, { out: 0.4, h: 1.0, closed: true });
      k.lathe(0, 0, [[r + 0.2, 35.6], [r * 1.02, 37.4], [r * 0.8, 39.6], [r * 0.4, 41.4], [0.7, 42.4]], 12, COPPER);
      k.lathe(0, 0, [[0.7, 42.4], [0.7, 44.4]], 8, OPENING, { flat: true });
      k.lathe(0, 0, [[0.95, 44.3], [0.9, 44.8], [0.6, 45.8], [0.3, 46.6], [0.1, 47.6]], 8, COPPER);
      d.lathe(0, 0, [[0.06, 47.5], [0.05, 49.4]], 4, GOLD);
      d.beam([-0.45, 48.7, 0], [0.45, 48.7, 0], 0.08, GOLD);
      d.ball(0, 47.9, 0, 0.18, GOLD, 6);
    }
    // The Italian Chapel: an oval on its footprint under a copper dome with a lantern.
    {
      const c = orientedRect(site.feature('way/28517285')!.polygons[0].outer);
      const gc = site.bare(c.cx, c.cz);
      for (const kit of [k, d, f]) { kit.place(c.cx, gc, c.cz, c.bearing); kit.ground = gc; }
      const oval = (sw: number, sd: number): V2[] => Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return [(c.w / 2) * sw * Math.cos(a), (c.d / 2) * sd * Math.sin(a)] as V2; });
      k.prism(oval(1, 1), -2, 15.5, RENDER, null);
      entablature(k, oval(1, 1).map(([x, z]) => [x, 14.2, z] as V3), DRESSING, { out: 0.55, h: 1.3, closed: true });
      for (let q = 0; q < 6; q++) {
        const a = ((q + 0.5) / 6) * Math.PI * 2, px = (c.w / 2) * Math.cos(a), pz = (c.d / 2) * Math.sin(a);
        const nx = Math.cos(a) / (c.w / 2), nz = Math.sin(a) / (c.d / 2), l = Math.hypot(nx, nz);
        traceryWindow(k, f, [px, 0, pz], [nz / l, 0, -nx / l], UP, 0, 7.5, 1.6, 4.6, DRESSING, WINDOW, { lights: 1, kind: 'round', proud: 0.12, depth: 0.26 });
      }
      const steps: [number, number][] = [[1.04, 15.5], [1.0, 17.2], [0.88, 19.4], [0.66, 21.4], [0.38, 22.8], [0.16, 23.4]];
      for (let i = 0; i + 1 < steps.length; i++) k.loft(oval(steps[i][0], steps[i][0]), steps[i][1], oval(steps[i + 1][0], steps[i + 1][0]), steps[i + 1][1], COPPER);
      k.lathe(0, 0, [[1.1, 23.2], [1.1, 25.6], [1.3, 26], [0.5, 27.2], [0.1, 28.2]], 8, COPPER, { flat: true, phase: 22.5 });
      d.ball(0, 28.4, 0, 0.16, GOLD, 6);
      k.light([0, 6, 0], 1);
    }
  },
};
