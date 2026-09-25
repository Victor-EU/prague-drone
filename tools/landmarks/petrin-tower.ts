// Petřín lookout tower (design.md §7.1): the 1891 steel lattice tower on the summit, an octagon of
// eight legs curving in from about 21 m across at the foot to 5 m at the top gallery, braced in
// every panel; the first gallery at 20 m, the glazed top cabin at 55 m and the flagpole to 63.5 m;
// a stair and lift shaft up the middle; a low hall round the foot. Placed on OSM's octagon
// (way/456174848), which also gives the turn of the legs.

import { Kit, mat, ngon, type V3 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

const STEEL = mat('#6a5b50', Surface.Plain);
const STEEL_DARK = mat('#4a3f38', Surface.Plain);
const DECK = mat('#5c534c', Surface.Plain);
const HALL = mat('#d9cdb8', Surface.Stone, Stone.Render, 0.2);
const HALL_ROOF = mat('#5e5d55', Surface.Metal, Metal.Lead);
const CABIN_ROOF = mat('#5a5048', Surface.Metal, Metal.Lead);
const WINDOW = mat('#20262b', Surface.Glass, Glass.Plain);

/** Circumradius of the leg octagon at height y above the foot: the legs curve in like a pylon. */
function radius(y: number): number {
  const t = Math.min(1, y / 55);
  return 2.6 + (10.8 - 2.6) * (1 - t) ** 1.45;
}

export const petrinTower: Model = {
  id: 'petrin-tower',
  build(site: Site, k: Kit, d: Kit) {
    const oct = site.feature('way/456174848')!.polygons[0].outer;
    let cx = 0, cz = 0;
    const n = oct.length / 2;
    for (let i = 0; i < n; i++) { cx += oct[i * 2]; cz += oct[i * 2 + 1]; }
    cx /= n; cz /= n;
    // The legs stand at the octagon's corners.
    let far = 0, phase = 0;
    for (let i = 0; i < n; i++) {
      const dx = oct[i * 2] - cx, dz = oct[i * 2 + 1] - cz, r = Math.hypot(dx, dz);
      if (r > far) { far = r; phase = (Math.atan2(dz, dx) * 180) / Math.PI; }
    }
    let y0 = Infinity;
    for (const [dx, dz] of ngon(8, 10.5, phase)) y0 = Math.min(y0, site.ground(cx + dx, cz + dz));
    y0 = Math.min(y0, site.ground(cx, cz));
    for (const kit of [k, d]) { kit.place(cx, y0, cz); kit.ground = y0; kit.seed = 91; }

    // The hall round the foot.
    k.prism(ngon(8, 8.6, phase + 22.5), -1, 4.2, HALL, null);
    k.loft(ngon(8, 8.9, phase + 22.5), 4.2, ngon(8, 5.5, phase + 22.5), 5.6, HALL_ROOF, HALL_ROOF);
    for (let s = 0; s < 8; s++) {
      const a = ((phase + 22.5 + s * 45 + 22.5) * Math.PI) / 180, nx = Math.cos(a), nz = Math.sin(a);
      const r = 8.6 * Math.cos(Math.PI / 8);
      const o: V3 = [nx * r, 0.8, nz * r], u: V3 = [nz, 0, -nx], v: V3 = [0, 1, 0];
      k.row(o, u, v, [[-0.6, 0], [0.6, 0], [0.6, 2.2], [-0.6, 2.2]], WINDOW, 3, 2.1);
    }

    // Legs, rings and bracing, panel by panel.
    const levels = [0, 5, 10, 15, 19.5, 24, 28.5, 33, 37.5, 42, 46.5, 51, 55];
    const leg = (j: number, s: number): V3 => {
      const y = levels[j], r = radius(y), a = ((phase + s * 45) * Math.PI) / 180;
      return [r * Math.cos(a), y, r * Math.sin(a)];
    };
    for (let j = 0; j + 1 < levels.length; j++)
      for (let s = 0; s < 8; s++) {
        const a = leg(j, s), b = leg(j + 1, s), c = leg(j, (s + 1) % 8), e = leg(j + 1, (s + 1) % 8);
        k.beam(a, b, j < 4 ? 0.62 : 0.45, STEEL);
        k.beam(b, e, 0.3, STEEL);
        d.beam(a, e, 0.16, STEEL_DARK);
        d.beam(c, b, 0.16, STEEL_DARK);
      }
    // The stair and lift shaft.
    k.lathe(0, 0, [[1.5, 0], [1.5, 55]], 12, STEEL_DARK);

    // First gallery at 19.5 m: a deck round the tower with a railing.
    const gal = radius(19.5) + 1.8;
    k.loft(ngon(8, radius(19.5) - 0.2, phase), 19.2, ngon(8, gal, phase), 19.5, DECK, null);
    k.prism(ngon(8, gal, phase), 19.2, 19.55, STEEL_DARK, DECK);
    d.prism(ngon(8, gal, phase), 19.55, 20.6, STEEL_DARK, null);

    // Top: the glazed cabin, its roof, the flagpole.
    const top = radius(55);
    k.prism(ngon(8, top + 1.4, phase), 54.6, 55.1, DECK, DECK, { bottom: DECK });
    d.prism(ngon(8, top + 1.4, phase), 55.1, 56.1, STEEL_DARK, null);
    k.prism(ngon(8, top + 0.2, phase), 55.1, 58.2, STEEL, null);
    for (let s = 0; s < 8; s++) {
      const a = ((phase + s * 45 + 22.5) * Math.PI) / 180, nx = Math.cos(a), nz = Math.sin(a);
      const r = (top + 0.2) * Math.cos(Math.PI / 8);
      k.plate([nx * r, 55.9, nz * r], [nz, 0, -nx], [0, 1, 0], [[-0.8, 0], [0.8, 0], [0.8, 1.7], [-0.8, 1.7]], WINDOW);
    }
    k.pyramid(ngon(8, top + 0.8, phase), 58.2, 61.2, CABIN_ROOF);
    d.lathe(0, 0, [[0.12, 61], [0.06, 63.5], [0, 63.6]], 6, STEEL_DARK);
  },
};
