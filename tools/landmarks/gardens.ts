// The gardens' landmarks (design.md §7.1, added in M5): the gloriette at the top of the Schönborn
// garden, the white pavilion that stands over the Petřín orchards in 8725. A block rendered white
// with rusticated corners, the open arcade on the side toward the orchards, round windows on the
// other, a terrace, and on it a small square belvedere under a grey pyramid roof, with the flagpole.

import { mat, rect, arch, offsetRing, orientedRect, ngon, type V3 } from './kit.ts';
import type { Model } from './index.ts';
import { Surface, Stone, Metal } from '../../src/core/buildings.ts';

const WHITE = mat('#ece8df', Surface.Stone, Stone.Render, 0.1);
const TRIM = mat('#f3f0e8', Surface.Stone, Stone.Render, 0.05);
const OPENING = mat('#23241f', Surface.Opening);
const ROOF = mat('#5b6064', Surface.Metal, Metal.Slate);

export const schonbornGloriette: Model = {
  id: 'schonborn-gloriette',
  build(site, k, d) {
    k.seed = 111; d.seed = 112;
    const r = orientedRect(site.feature('way/27580901')!.polygons[0].outer);
    const g = site.bare(r.cx, r.cz);
    k.place(r.cx, g, r.cz, r.bearing); d.place(r.cx, g, r.cz, r.bearing);
    k.ground = d.ground = g;
    const W = r.w, D = r.d, H = 9.5;
    const body = rect(W, D);
    k.prism(body, -3, H, WHITE, null);
    k.prism(offsetRing(body, 0.35), H - 0.6, H, TRIM, TRIM);
    k.prism(offsetRing(body, 0.05), H, H + 0.9, WHITE, WHITE);
    // Rusticated corner pilasters.
    for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) k.box(x * (W / 2 - 0.4), z * (D / 2 - 0.4), 1.2, 1.2, 0, H - 0.6, TRIM, null);
    // The faces: the long sides open in arches, the short ones with round windows over blind niches.
    const faces: [V3, V3, number][] = [
      [[0, 0, D / 2 + 0.01], [1, 0, 0], W], [[0, 0, -D / 2 - 0.01], [-1, 0, 0], W],
      [[W / 2 + 0.01, 0, 0], [0, 0, -1], D], [[-W / 2 - 0.01, 0, 0], [0, 0, 1], D],
    ];
    faces.forEach(([o, u, len], f) => {
      const n = Math.max(2, Math.round(len / 4.2));
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n - 0.5;
        const at: V3 = [o[0] + u[0] * t * len, 0, o[2] + u[2] * t * len];
        if (f < 2) k.plate([at[0], 3.2, at[2]], u, [0, 1, 0], arch(2.2, 5.2, 'round'), OPENING, 0.05);
        else {
          k.plate([at[0], 6.4, at[2]], u, [0, 1, 0], ngon(16, 0.6, 0, 0, 0.6), OPENING, 0.05);
          k.plate([at[0], 2.6, at[2]], u, [0, 1, 0], arch(1.5, 3.2, 'round'), TRIM, 0.08);
        }
      }
    });
    // The belvedere on the terrace.
    const b = rect(3.6, 3.6);
    k.prism(b, H + 0.9, H + 4.2, WHITE, null);
    k.prism(offsetRing(b, 0.25), H + 3.9, H + 4.3, TRIM, TRIM);
    for (const [o, u] of [[[0, 0, 1.81], [1, 0, 0]], [[0, 0, -1.81], [-1, 0, 0]], [[1.81, 0, 0], [0, 0, -1]], [[-1.81, 0, 0], [0, 0, 1]]] as [V3, V3][])
      k.plate([o[0], H + 1.9, o[2]], u, [0, 1, 0], arch(0.9, 1.4, 'flat'), OPENING, 0.05);
    k.pyramid(offsetRing(b, 0.4), H + 4.3, H + 5.6, ROOF);
    d.box(0.9, 0.9, 0.08, 0.08, H + 5.2, H + 9.5, mat('#cfcfcf', Surface.Metal, Metal.Lead), null);
  },
};
