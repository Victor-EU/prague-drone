// St Nicholas, Malá Strana (design.md §7.1), the dome of the Petřín panoramas: the cream drum with
// paired pilasters and tall windows, the light copper dome with its oculi, the lantern with a
// ring of statues, a copper cupola, gilded crown and star; the long nave under red tiles, its
// curved Baroque front to the upper square; and the city belfry at the south-east corner, stage
// on chamfered stage to the clocks and a copper helmet with its own lantern. Placed on OSM's
// church (way/7645355) and belfry (way/26426951).

import { Kit, mat, rect, ngon, arch, offsetRing, centreOf, type V2, type V3 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

const PLASTER = mat('#e9e1d2', Surface.Stone, Stone.Render, 0.35);
const CORNICE = mat('#d9d0bf', Surface.Stone, Stone.Render, 0.5);
const TILES = mat('#b06a4c', Surface.Roof);
const COPPER = mat('#83a898', Surface.Metal, Metal.Copper);
const COPPER_DARK = mat('#6a9383', Surface.Metal, Metal.Copper);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const WINDOW = mat('#2a2e33', Surface.Glass, Glass.Plain);
const DIAL = mat('#1d1f24', Surface.Plain);
const STATUE = mat('#5b5750', Surface.Stone, Stone.Render, 0.4);

/** Square with chamfered corners, side s, chamfer c. */
function chamfered(s: number, c: number): V2[] {
  const h = s / 2;
  return [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]];
}

export const stNicholas: Model = {
  id: 'st-nicholas',
  floodlit: true,
  replaces: ['way/26426951'],
  build(site: Site, k: Kit, d: Kit) {
    k.seed = d.seed = 71;
    const church = site.feature('way/7645355')!.polygons[0].outer;
    const [ccx, ccz] = centreOf(church);
    const dome = centreOf(site.feature('way/420783554')!.polygons[0].outer);
    // The axis runs east–west through the church's centre line; the dome stands on it.
    const ox = dome[0], oz = (ccz + dome[1]) / 2;
    let g = Infinity;
    for (const [x, z] of [[ox, oz], [ox - 40, oz], [ox + 15, oz], [ox - 20, oz - 12], [ox - 20, oz + 12]]) g = Math.min(g, site.bare(x, z));
    for (const kit of [k, d]) { kit.place(ox, g, oz, 90); kit.ground = g; }
    const west = ccx - ox - 35; // the west front, local x

    // Nave: walls to 27 m, red roof to 40 m, gabled at both ends.
    const nave: V2[] = [[west, 14.5], [west, -14.5], [-11.5, -14.5], [-11.5, 14.5]];
    k.prism(nave, -2, 27, PLASTER, null);
    k.prism(offsetRing(nave, 0.4), 25.6, 27, CORNICE, null);
    k.roof(nave, 27, { shape: 'gabled', pitch: 41, cap: 99, gable: (e) => e === 0 || e === 2 }, TILES, PLASTER);
    for (const sz of [-1, 1]) {
      for (let x = west + 5; x < -14; x += 7) k.plate([x, 9, sz * 14.5], [sz > 0 ? 1 : -1, 0, 0], [0, 1, 0], arch(2.6, 9, 'round'), WINDOW, 0.05);
      // Dormers along the nave roof.
      for (let x = west + 8; x < -16; x += 9) {
        d.box(x, sz * 10.8, 1.2, 1.6, 30, 31.6, TILES, null);
        d.pyramid(rect(1.4, 1.8, x, sz * 10.8), 31.6, 32.6, TILES);
      }
    }
    // The west front: a tall Baroque screen with a curved pediment and statues.
    k.prism([[west - 1.8, 13], [west - 1.8, -13], [west + 0.2, -13], [west + 0.2, 13]], -2, 29, PLASTER, CORNICE);
    k.prism([[west - 1.8, 8], [west - 1.8, -8], [west + 0.2, -8], [west + 0.2, 8]], 29, 34, PLASTER, null);
    k.slab([west - 1.8, 34, 0], [0, 0, 1], [0, 1, 0], arch(16, 4.2, 'segment', 3.6, 10), 2.0, CORNICE);
    k.plate([west - 1.8, 16, 0], [0, 0, 1], [0, 1, 0], arch(4, 9, 'round'), WINDOW, 0.05);
    k.plate([west - 1.8, 0, 0], [0, 0, 1], [0, 1, 0], arch(3.4, 6.5, 'round'), mat('#3a3128', Surface.Plain), 0.05);
    for (const z of [-12, -6, 6, 12]) {
      k.box(west - 2.2, z, 0.8, 1.2, -2, 28.5, CORNICE, CORNICE);
      d.lathe(west - 1.4, z, [[0, 29], [0.45, 29], [0.35, 30.8], [0, 31.4]], 6, STATUE, { flat: true });
    }

    // Presbytery round the dome: walls to 27 m, a low tiled roof about the drum.
    const pres: V2[] = [[-11.5, -16.5], [22, -16.5], [22, 16.5], [-11.5, 16.5]];
    k.prism(pres, -2, 27, PLASTER, null);
    k.prism(offsetRing(pres, 0.4), 25.6, 27, CORNICE, null);
    k.roof(pres, 27, { shape: 'hipped', pitch: 32, cap: 4.5, gable: () => false }, TILES, PLASTER, [ngon(16, 11.2)]);
    for (const sz of [-1, 1]) for (const x of [-4, 6, 15]) k.plate([x, 9, sz * 16.5], [sz > 0 ? 1 : -1, 0, 0], [0, 1, 0], arch(2.6, 9, 'round'), WINDOW, 0.05);

    // The drum: paired pilasters and eight tall windows, an entablature, then the dome.
    k.lathe(0, 0, [[10.5, 20], [10.5, 44.6]], 32, PLASTER);
    k.lathe(0, 0, [[11.1, 44.4], [11.1, 46.4], [10.9, 46.6]], 32, CORNICE);
    for (let q = 0; q < 8; q++) {
      const a = ((q + 0.5) * Math.PI) / 4, nx = Math.cos(a), nz = Math.sin(a);
      k.plate([nx * 10.62, 33, nz * 10.62], [nz, 0, -nx], [0, 1, 0], arch(2.5, 8.2, 'round'), WINDOW, 0.02);
      for (const off of [-0.19, 0.19]) {
        const b = (q * Math.PI) / 4 + off, px = Math.cos(b) * 10.7, pz = Math.sin(b) * 10.7;
        k.push().at(px, 0, pz, (b * 180) / Math.PI);
        k.box(0, 0, 0.5, 0.9, 27, 44.4, CORNICE, null);
        k.pop();
      }
    }
    k.lathe(0, 0, [[10.95, 46.6], [10.8, 47.8], [10.2, 49.8], [9.1, 51.9], [7.5, 53.8], [5.5, 55.3], [3.5, 56.2], [2.9, 56.5], [0, 56.5]], 32, COPPER);
    // Oculi round the foot of the dome.
    for (let q = 0; q < 8; q++) {
      const a = ((q + 0.5) * Math.PI) / 4, r = 10.25;
      k.push().at(r * Math.cos(a), 0, r * Math.sin(a), (a * 180) / Math.PI);
      k.box(0.35, 0, 1.2, 1.5, 49, 50.9, PLASTER, null);
      k.lathe(0.35, 0, [[0.85, 50.9], [0.6, 51.5], [0, 51.8]], 6, COPPER_DARK, { flat: true });
      k.plate([0.95, 49.35, 0], [0, 0, -1], [0, 1, 0], ngon(10, 0.42, 0).map(([a2, b2]) => [a2, b2 + 0.6] as V2), WINDOW, 0.03);
      k.pop();
    }
    // Lantern: a ring of statues, the windowed drum, the cupola, crown and star.
    k.lathe(0, 0, [[3.7, 56.3], [3.7, 57.2], [0, 57.2]], 16, STATUE);
    for (let q = 0; q < 8; q++) {
      const a = (q * Math.PI) / 4;
      d.lathe(3.3 * Math.cos(a), 3.3 * Math.sin(a), [[0, 57.2], [0.35, 57.2], [0.28, 58.7], [0, 59.2]], 5, STATUE, { flat: true });
    }
    k.lathe(0, 0, [[2.8, 57.2], [2.8, 61.6]], 8, PLASTER, { flat: true, phase: 22.5 });
    for (let q = 0; q < 8; q++) {
      const a = (q * Math.PI) / 4, r = 2.8 * Math.cos(Math.PI / 8);
      k.plate([r * Math.cos(a), 58, r * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], [0, 1, 0], arch(1.0, 2.8, 'round'), WINDOW, 0.03);
    }
    k.lathe(0, 0, [[3.1, 61.6], [3.1, 62.2], [2.9, 62.4]], 8, CORNICE, { flat: true, phase: 22.5 });
    k.lathe(0, 0, [[2.95, 62.4], [2.7, 63.2], [2.0, 64.1], [1.2, 64.8], [0.55, 65.3], [0.45, 65.6], [0, 65.6]], 16, COPPER);
    d.lathe(0, 0, [[0.55, 65.6], [0.75, 66.1], [0.5, 66.7], [0.1, 66.9]], 8, GOLD, { flat: true });
    d.lathe(0, 0, [[0.08, 66.8], [0.06, 70]], 4, GOLD);
    d.ball(0, 67.6, 0, 0.35, GOLD, 8);
    d.box(0, 0, 0.12, 1.3, 68.6, 69.9, GOLD, GOLD);
    d.box(0, 0, 1.3, 0.12, 68.6, 69.9, GOLD, GOLD);

    // The belfry, on its own footprint.
    const bf = centreOf(site.feature('way/26426951')!.polygons[0].outer);
    const b = k.local(bf[0], g, bf[1]);
    for (const kit of [k, d]) kit.push().at(b[0], 0, b[2]);
    // Stage on stage, each narrower, its corners cut ever deeper, each under a heavy cornice.
    const stages: { s: number; c: number; y0: number; y1: number }[] = [
      { s: 12.4, c: 1.6, y0: -2, y1: 25 }, { s: 10.8, c: 2.6, y0: 26.4, y1: 41 }, { s: 8.8, c: 1.9, y0: 42.4, y1: 51.6 }, { s: 7.6, c: 1.5, y0: 52.6, y1: 57.6 },
    ];
    for (const st of stages) {
      k.prism(chamfered(st.s, st.c), st.y0, st.y1, PLASTER, null);
      k.prism(offsetRing(chamfered(st.s, st.c), 0.6), st.y1, st.y1 + 0.6, CORNICE, null);
      k.loft(offsetRing(chamfered(st.s, st.c), 0.6), st.y1 + 0.6, offsetRing(chamfered(st.s, st.c), 0.2), st.y1 + 1.2, CORNICE, CORNICE);
      // Pilasters at the cut corners.
      for (let q = 0; q < 4; q++) {
        const a = (q * Math.PI) / 2 + Math.PI / 4, r = (st.s / 2 - st.c / 2) * Math.SQRT2 + 0.15;
        k.push().at(r * Math.cos(a), 0, r * Math.sin(a), (a * 180) / Math.PI);
        k.box(0, 0, 0.5, st.c * 1.2, st.y0 + 0.5, st.y1, CORNICE, null);
        k.pop();
      }
    }
    // Windows and clocks on the four faces; statues on the lower terrace's corners.
    for (let q = 0; q < 4; q++) {
      const a = (q * Math.PI) / 2, nx = Math.cos(a), nz = Math.sin(a), u: V3 = [nz, 0, -nx];
      k.plate([nx * 6.2, 12, nz * 6.2], u, [0, 1, 0], arch(1.6, 3.6, 'round'), WINDOW, 0.04);
      k.plate([nx * 5.4, 30, nz * 5.4], u, [0, 1, 0], arch(2.6, 8, 'round'), WINDOW, 0.04);
      k.plate([nx * 4.4, 44, nz * 4.4], u, [0, 1, 0], arch(2.2, 5.8, 'round'), WINDOW, 0.04);
      k.plate([nx * 3.8, 53.2, nz * 3.8], u, [0, 1, 0], ngon(20, 1.75, 0).map(([x, y]) => [x, y + 1.9] as V2), GOLD, 0.05);
      k.plate([nx * 3.8, 53.2, nz * 3.8], u, [0, 1, 0], ngon(20, 1.5, 0).map(([x, y]) => [x, y + 1.9] as V2), DIAL, 0.08);
      const ca = a + Math.PI / 4;
      d.lathe(Math.cos(ca) * 5.6, Math.sin(ca) * 5.6, [[0, 41.9], [0.4, 41.9], [0.32, 43.7], [0, 44.2]], 5, STATUE, { flat: true });
      d.lathe(Math.cos(ca) * 6.6, Math.sin(ca) * 6.6, [[0, 25.9], [0.45, 25.9], [0.35, 27.9], [0, 28.4]], 5, STATUE, { flat: true });
    }
    // The helmet: a square bell of copper, a lantern, a cupola, the gilded star.
    k.lathe(0, 0, [[5.6, 58.6], [5.5, 59.4], [4.8, 60.8], [3.4, 62.5], [2.4, 63.6], [2.1, 64.2]], 4, COPPER, { flat: true, phase: 45 });
    k.lathe(0, 0, [[1.5, 64.2], [1.5, 67.6]], 8, PLASTER, { flat: true, phase: 22.5 });
    for (let q = 0; q < 4; q++) {
      const a = (q * Math.PI) / 2 + Math.PI / 8, r = 1.5 * Math.cos(Math.PI / 8);
      k.plate([r * Math.cos(a), 64.8, r * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], [0, 1, 0], arch(0.7, 2.1, 'round'), WINDOW, 0.03);
    }
    k.lathe(0, 0, [[1.9, 67.6], [1.8, 68.4], [1.35, 69.4], [0.7, 70.4], [0.3, 71.2], [0.25, 71.8], [0, 71.8]], 8, COPPER, { flat: true, phase: 22.5 });
    d.lathe(0, 0, [[0.08, 71.7], [0.06, 77.6]], 4, GOLD);
    d.ball(0, 72.8, 0, 0.45, GOLD, 8);
    for (let q = 0; q < 4; q++) d.beam([0, 76.4, 0], [Math.cos((q * Math.PI) / 4) * 0.9, 76.4 + Math.sin((q * Math.PI) / 4) * 0.9, 0], 0.14, GOLD);
    for (let q = 0; q < 4; q++) d.beam([0, 76.4, 0], [-Math.cos((q * Math.PI) / 4) * 0.9, 76.4 - Math.sin((q * Math.PI) / 4) * 0.9, 0], 0.14, GOLD);
    for (const kit of [k, d]) kit.pop();
  },
};
