// St Nicholas, Malá Strana (design.md §7.1), the dome of the Petřín panoramas: the cream drum with
// paired pilasters and tall windows, the light copper dome with its oculi, the lantern with a
// ring of statues, a copper cupola, gilded crown and star; the long nave under red tiles, its
// curved Baroque front to the upper square; and the city belfry at the south-east corner, stage
// on chamfered stage to the clocks and a copper helmet with its own lantern. Placed on OSM's
// church (way/7645355) and belfry (way/26426951). M12: pilasters with capitals, entablatures
// swept round the drum, the nave and the belfry's stages, ribs down the dome, columns round the
// lantern, the windows in moulded surrounds, statues on the front and the belfry's terraces.

import { Kit, mat, rect, ngon, arch, offsetRing, centreOf, type V2, type V3 } from './kit.ts';
import { pilaster, entablature, traceryWindow, ribs, column, statue } from './ornament.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

const PLASTER = mat('#e3d9c7', Surface.Stone, Stone.Render, 0.4);
const CORNICE = mat('#d2c8b5', Surface.Stone, Stone.Render, 0.55);
const TILES = mat('#b06a4c', Surface.Roof);
const COPPER = mat('#83a898', Surface.Metal, Metal.Copper);
const COPPER_DARK = mat('#6a9383', Surface.Metal, Metal.Copper);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const WINDOW = mat('#2a2e33', Surface.Glass, Glass.Plain);
const DIAL = mat('#1d1f24', Surface.Plain);
const STATUE = mat('#5b5750', Surface.Stone, Stone.Render, 0.4);
const UP: V3 = [0, 1, 0];

/** Square with chamfered corners, side s, chamfer c. */
function chamfered(s: number, c: number): V2[] {
  const h = s / 2;
  return [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]];
}
/** A ring lifted to height y. */
const at = (r: V2[], y: number): V3[] => r.map(([x, z]) => [x, y, z] as V3);

export const stNicholas: Model = {
  id: 'st-nicholas',
  floodlit: true,
  replaces: ['way/26426951'],
  build(site: Site, k: Kit, d: Kit, f: Kit) {
    k.seed = d.seed = 71; f.seed = 73;
    const church = site.feature('way/7645355')!.polygons[0].outer;
    const [ccx, ccz] = centreOf(church);
    const dome = centreOf(site.feature('way/420783554')!.polygons[0].outer);
    // The axis runs east–west through the church's centre line; the dome stands on it.
    const ox = dome[0], oz = (ccz + dome[1]) / 2;
    let g = Infinity;
    for (const [x, z] of [[ox, oz], [ox - 40, oz], [ox + 15, oz], [ox - 20, oz - 12], [ox - 20, oz + 12]]) g = Math.min(g, site.bare(x, z));
    for (const kit of [k, d, f]) { kit.place(ox, g, oz, 90); kit.ground = g; }
    const west = ccx - ox - 35; // the west front, local x

    // Nave: walls to 27 m under an entablature, red roof to 40 m, gabled at both ends.
    const nave: V2[] = [[west, 14.5], [west, -14.5], [-11.5, -14.5], [-11.5, 14.5]];
    k.prism(nave, -2, 27, PLASTER, null);
    entablature(k, at(nave, 25.3), CORNICE, { out: 0.7, h: 1.7, closed: true });
    k.roof(nave, 27, { shape: 'gabled', pitch: 41, cap: 99, gable: (e) => e === 0 || e === 2 }, TILES, PLASTER);
    for (const sz of [-1, 1]) {
      for (let x = west + 5; x < -14; x += 7) {
        traceryWindow(k, f, [x, 0, sz * 14.5], [sz > 0 ? 1 : -1, 0, 0], UP, 0, 9, 2.6, 9, CORNICE, WINDOW, { lights: 1, kind: 'round', proud: 0.14, depth: 0.3 });
        pilaster(k, [x + 3.5, 0, sz * 14.5], [sz > 0 ? 1 : -1, 0, 0], UP, 0, 1.2, 25.3, 1.4, 0.4, CORNICE);
      }
      // Dormers along the nave roof.
      for (let x = west + 8; x < -16; x += 9) {
        d.box(x, sz * 10.8, 1.2, 1.6, 30, 31.6, TILES, null);
        d.pyramid(rect(1.4, 1.8, x, sz * 10.8), 31.6, 32.6, TILES);
      }
    }
    // The west front: a tall Baroque screen with pilasters, an entablature, a curved pediment and statues.
    k.prism([[west - 1.8, 13], [west - 1.8, -13], [west + 0.2, -13], [west + 0.2, 13]], -2, 29, PLASTER, CORNICE);
    k.prism([[west - 1.8, 8], [west - 1.8, -8], [west + 0.2, -8], [west + 0.2, 8]], 29, 34, PLASTER, null);
    k.slab([west - 1.8, 34, 0], [0, 0, 1], UP, arch(16, 4.2, 'segment', 3.6, 10), 2.0, CORNICE);
    entablature(k, [[west - 1.8, 27.4, 13], [west - 1.8, 27.4, -13]], CORNICE, { out: 0.8, h: 1.6 });
    traceryWindow(k, f, [west - 1.8, 0, 0], [0, 0, 1], UP, 0, 16, 4, 9, CORNICE, WINDOW, { lights: 1, kind: 'round', proud: 0.16, depth: 0.36 });
    k.plate([west - 1.8, 0, 0], [0, 0, 1], UP, arch(3.4, 6.5, 'round'), mat('#3a3128', Surface.Plain), 0.05);
    for (const z of [-12, -6, 6, 12]) {
      pilaster(k, [west - 1.8, 0, 0], [0, 0, 1], UP, z, 0.4, 27.4, 1.5, 0.55, CORNICE, { capH: 1.0, baseH: 0.7 });
      statue(d, [west - 1.6, 29, z], [-1, 0], 2.7, STATUE, 'single', 40 + z);
    }
    for (const z of [-3, 3]) pilaster(k, [west - 1.8, 0, 0], [0, 0, 1], UP, z, 0.4, 27.4, 1.2, 0.4, CORNICE, { capH: 1.0, baseH: 0.7 });

    // Presbytery round the dome: walls to 27 m under an entablature, a low tiled roof about the drum.
    const pres: V2[] = [[-11.5, -16.5], [22, -16.5], [22, 16.5], [-11.5, 16.5]];
    k.prism(pres, -2, 27, PLASTER, null);
    entablature(k, at(pres, 25.3), CORNICE, { out: 0.7, h: 1.7, closed: true });
    k.roof(pres, 27, { shape: 'hipped', pitch: 32, cap: 4.5, gable: () => false }, TILES, PLASTER, [ngon(16, 11.2)]);
    for (const sz of [-1, 1]) for (const x of [-4, 6, 15]) traceryWindow(k, f, [x, 0, sz * 16.5], [sz > 0 ? 1 : -1, 0, 0], UP, 0, 9, 2.6, 9, CORNICE, WINDOW, { lights: 1, kind: 'round', proud: 0.14, depth: 0.3 });

    // The drum: paired pilasters with capitals and eight tall windows, an entablature, then the dome.
    k.lathe(0, 0, [[10.5, 20], [10.5, 44.4]], 32, PLASTER);
    entablature(k, at(ngon(32, 10.5), 44.2), CORNICE, { out: 0.95, h: 2.3, closed: true });
    for (let q = 0; q < 8; q++) {
      const a = ((q + 0.5) * Math.PI) / 4, nx = Math.cos(a), nz = Math.sin(a);
      traceryWindow(k, f, [nx * 10.5, 0, nz * 10.5], [nz, 0, -nx], UP, 0, 33, 2.5, 8.2, CORNICE, WINDOW, { lights: 1, kind: 'round', proud: 0.14, depth: 0.3 });
      for (const off of [-0.19, 0.19]) {
        const b = (q * Math.PI) / 4 + off, px = Math.cos(b) * 10.5, pz = Math.sin(b) * 10.5;
        pilaster(k, [px, 27, pz], [Math.sin(b), 0, -Math.cos(b)], UP, 0, 0, 17.2, 1.0, 0.55, CORNICE, { capH: 1.1, baseH: 0.6 });
      }
    }
    const domeProf: V2[] = [[10.95, 46.6], [10.8, 47.8], [10.2, 49.8], [9.1, 51.9], [7.5, 53.8], [5.5, 55.3], [3.5, 56.2], [2.9, 56.5]];
    k.lathe(0, 0, [...domeProf, [0, 56.5]], 32, COPPER);
    ribs(k, 0, 0, domeProf, 16, 0.24, COPPER_DARK, 11.25);
    // Oculi round the foot of the dome.
    for (let q = 0; q < 8; q++) {
      const a = ((q + 0.5) * Math.PI) / 4, r = 10.25;
      k.push().at(r * Math.cos(a), 0, r * Math.sin(a), (a * 180) / Math.PI);
      k.box(0.35, 0, 1.2, 1.5, 49, 50.9, PLASTER, null);
      k.lathe(0.35, 0, [[0.85, 50.9], [0.6, 51.5], [0, 51.8]], 6, COPPER_DARK, { flat: true });
      k.plate([0.95, 49.35, 0], [0, 0, -1], UP, ngon(10, 0.42, 0).map(([a2, b2]) => [a2, b2 + 0.6] as V2), WINDOW, 0.03);
      k.pop();
    }
    // Lantern: a ring of statues, the windowed drum between columns, the cupola, crown and star.
    k.lathe(0, 0, [[3.7, 56.3], [3.7, 57.2], [0, 57.2]], 16, STATUE);
    for (let q = 0; q < 8; q++) {
      const a = (q * Math.PI) / 4;
      statue(d, [3.3 * Math.cos(a), 57.2, 3.3 * Math.sin(a)], [Math.cos(a), Math.sin(a)], 1.9, STATUE, 'single', 60 + q);
    }
    k.lathe(0, 0, [[2.8, 57.2], [2.8, 61.6]], 8, PLASTER, { flat: true, phase: 22.5 });
    for (let q = 0; q < 8; q++) {
      const a = (q * Math.PI) / 4, r = 2.8 * Math.cos(Math.PI / 8);
      k.plate([r * Math.cos(a), 58, r * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, arch(1.0, 2.8, 'round'), WINDOW, 0.03);
      const c = a + Math.PI / 8;
      column(f, 3.05 * Math.cos(c), 3.05 * Math.sin(c), 57.2, 61.6, 0.22, CORNICE, { order: 'tuscan', sides: 8 });
    }
    entablature(k, at(ngon(8, 2.95, 22.5), 61.4), CORNICE, { out: 0.35, h: 0.9, closed: true });
    k.lathe(0, 0, [[2.95, 62.3], [2.7, 63.2], [2.0, 64.1], [1.2, 64.8], [0.55, 65.3], [0.45, 65.6], [0, 65.6]], 16, COPPER);
    d.lathe(0, 0, [[0.55, 65.6], [0.75, 66.1], [0.5, 66.7], [0.1, 66.9]], 8, GOLD, { flat: true });
    d.lathe(0, 0, [[0.08, 66.8], [0.06, 70]], 4, GOLD);
    d.ball(0, 67.6, 0, 0.35, GOLD, 8);
    d.box(0, 0, 0.12, 1.3, 68.6, 69.9, GOLD, GOLD);
    d.box(0, 0, 1.3, 0.12, 68.6, 69.9, GOLD, GOLD);

    // The belfry, on its own footprint.
    const bf = centreOf(site.feature('way/26426951')!.polygons[0].outer);
    const b = k.local(bf[0], g, bf[1]);
    for (const kit of [k, d, f]) kit.push().at(b[0], 0, b[2]);
    // Stage on stage, each narrower, its corners cut ever deeper, each under a heavy entablature,
    // pilasters with capitals on the cut corners.
    const stages: { s: number; c: number; y0: number; y1: number }[] = [
      { s: 12.4, c: 1.6, y0: -2, y1: 25 }, { s: 10.8, c: 2.6, y0: 26.4, y1: 41 }, { s: 8.8, c: 1.9, y0: 42.4, y1: 51.6 }, { s: 7.6, c: 1.5, y0: 52.6, y1: 57.6 },
    ];
    for (const st of stages) {
      const ring = chamfered(st.s, st.c);
      k.prism(ring, st.y0, st.y1 + 0.2, PLASTER, null);
      entablature(k, at(ring, st.y1 - 0.7), CORNICE, { out: 1.1, h: 1.9, closed: true });
      k.poly(at(offsetRing(ring, 0.2), st.y1 + 1.2), CORNICE, { normal: UP });
      for (let q = 0; q < 4; q++) {
        const a = (q * Math.PI) / 2 + Math.PI / 4, r = (st.s / 2 - st.c / 2) * Math.SQRT2;
        pilaster(k, [r * Math.cos(a), st.y0, r * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, 0, 0.6, st.y1 - st.y0 - 0.4, Math.min(1.1, st.c * 0.8), 0.4, CORNICE, { capH: 0.9, baseH: 0.5 });
      }
    }
    // Windows and clocks on the four faces; statues on the terraces' corners.
    for (let q = 0; q < 4; q++) {
      const a = (q * Math.PI) / 2, nx = Math.cos(a), nz = Math.sin(a), u: V3 = [nz, 0, -nx];
      traceryWindow(k, f, [nx * 6.2, 0, nz * 6.2], u, UP, 0, 12, 1.6, 3.6, CORNICE, WINDOW, { lights: 1, kind: 'round', proud: 0.12, depth: 0.28 });
      traceryWindow(k, f, [nx * 5.4, 0, nz * 5.4], u, UP, 0, 30, 2.6, 8, CORNICE, WINDOW, { lights: 1, kind: 'round', proud: 0.14, depth: 0.32 });
      traceryWindow(k, f, [nx * 4.4, 0, nz * 4.4], u, UP, 0, 44, 2.2, 5.8, CORNICE, WINDOW, { lights: 1, kind: 'round', proud: 0.12, depth: 0.28 });
      k.plate([nx * 3.8, 53.2, nz * 3.8], u, UP, ngon(20, 1.75, 0).map(([x, y]) => [x, y + 1.9] as V2), GOLD, 0.05);
      k.plate([nx * 3.8, 53.2, nz * 3.8], u, UP, ngon(20, 1.5, 0).map(([x, y]) => [x, y + 1.9] as V2), DIAL, 0.08);
      const ca = a + Math.PI / 4;
      statue(d, [Math.cos(ca) * 5.6, 42.4, Math.sin(ca) * 5.6], [Math.cos(ca), Math.sin(ca)], 2.3, STATUE, 'single', 80 + q);
      statue(d, [Math.cos(ca) * 6.6, 26.4, Math.sin(ca) * 6.6], [Math.cos(ca), Math.sin(ca)], 2.5, STATUE, 'single', 84 + q);
    }
    // The helmet: a square bell of copper, a lantern, a cupola, the gilded star.
    k.lathe(0, 0, [[5.6, 58.6], [5.5, 59.4], [4.8, 60.8], [3.4, 62.5], [2.4, 63.6], [2.1, 64.2]], 4, COPPER, { flat: true, phase: 45 });
    k.lathe(0, 0, [[1.5, 64.2], [1.5, 67.6]], 8, PLASTER, { flat: true, phase: 22.5 });
    for (let q = 0; q < 4; q++) {
      const a = (q * Math.PI) / 2 + Math.PI / 8, r = 1.5 * Math.cos(Math.PI / 8);
      k.plate([r * Math.cos(a), 64.8, r * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, arch(0.7, 2.1, 'round'), WINDOW, 0.03);
    }
    k.lathe(0, 0, [[1.9, 67.6], [1.8, 68.4], [1.35, 69.4], [0.7, 70.4], [0.3, 71.2], [0.25, 71.8], [0, 71.8]], 8, COPPER, { flat: true, phase: 22.5 });
    d.lathe(0, 0, [[0.08, 71.7], [0.06, 77.6]], 4, GOLD);
    d.ball(0, 72.8, 0, 0.45, GOLD, 8);
    for (let q = 0; q < 4; q++) d.beam([0, 76.4, 0], [Math.cos((q * Math.PI) / 4) * 0.9, 76.4 + Math.sin((q * Math.PI) / 4) * 0.9, 0], 0.14, GOLD);
    for (let q = 0; q < 4; q++) d.beam([0, 76.4, 0], [-Math.cos((q * Math.PI) / 4) * 0.9, 76.4 - Math.sin((q * Math.PI) / 4) * 0.9, 0], 0.14, GOLD);
    for (const kit of [k, d, f]) kit.pop();
  },
};
