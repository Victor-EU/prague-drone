// Novotného lávka at the Old Town end of Charles Bridge (design.md §7.1; 8006 to 8012, 8490, 8694):
// the Old Town water tower, a square shaft of cream render with its clocks, a gallery, and the steep
// copper helmet with four corner turrets and a lantern; and the Smetana Museum at the tip of the
// lávka, two storeys of sgraffito render over an arcade, with Renaissance gables to the river and to
// the south. Both floodlit at night (9542).

import { Kit, mat, rect, arch, offsetRing, orientedRect, ngon, type V2, type V3, type Mat } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style } from '../../src/core/buildings.ts';

const RENDER = mat('#ded0b1', Surface.Stone, Stone.Render, 0.25);
const RENDER_DARK = mat('#c4b594', Surface.Stone, Stone.Render, 0.35);
const SGRAFFITO = mat('#cdb58f', Surface.Stone, Stone.Render, 0.3);
const STOREYS = mat('#d3bf99', Surface.Wall, Style.Palace);
const COPPER = mat('#6f9a88', Surface.Metal, Metal.Copper);
const TILES = mat('#a8664b', Surface.Roof);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const WINDOW = mat('#1e2226', Surface.Glass, Glass.Plain);
const OPENING = mat('#181612', Surface.Opening);
const CLOCK = mat('#ece5d2', Surface.Plain);
const CLOCK_RIM = mat('#2b2a28', Surface.Plain);

/**
 * A Renaissance gable's outline, w wide at the eave and h high: three tiers narrowing upward, each
 * shoulder a scroll, a small pediment on top.
 */
export function renaissanceGable(w: number, h: number): V2[] {
  const left: V2[] = [];
  const tiers = [[0.5, 0], [0.36, 0.36], [0.24, 0.66], [0.12, 0.9]];
  for (let i = 0; i < tiers.length; i++) {
    const [hw, y] = tiers[i];
    left.push([-hw * w, y * h]);
    if (i + 1 < tiers.length) {
      // The scroll up to the next tier: out, round and in.
      const [nw, ny] = tiers[i + 1], ym = y * h + (ny - y) * h * 0.55;
      left.push([-hw * w, ym - 0.3], [-(hw * 0.35 + nw * 0.65) * w, ym + 0.35], [-nw * w, ym + 0.2]);
    }
  }
  left.push([0, h]);
  const right = left.slice(0, -1).reverse().map(([x, y]) => [-x, y] as V2);
  return [...left, ...right];
}

/** The water tower on its footprint: shaft, clocks, cornice and gallery, the copper helmet, the turrets. */
function waterTower(k: Kit, d: Kit, site: Site) {
  const r = orientedRect(site.feature('way/30619195')!.polygons[0].outer);
  const g = site.bare(r.cx, r.cz);
  k.place(r.cx, g, r.cz, r.bearing);
  d.place(r.cx, g, r.cz, r.bearing);
  k.ground = d.ground = g;
  const w = r.w, dd = r.d, body = rect(w, dd);
  k.prism(body, -2, 33, RENDER, null);
  k.prism(offsetRing(body, 0.2), -2, 1.6, RENDER_DARK, RENDER_DARK);
  for (const y of [11.5, 21.5]) k.prism(offsetRing(body, 0.12), y, y + 0.45, RENDER_DARK, RENDER_DARK);
  // Faces: small arched windows up the shaft, and a clock under the cornice on three sides.
  const faces: { o: V3; u: V3; n: V3 }[] = [
    { o: [0, 0, dd / 2], u: [1, 0, 0], n: [0, 0, 1] }, { o: [0, 0, -dd / 2], u: [-1, 0, 0], n: [0, 0, -1] },
    { o: [w / 2, 0, 0], u: [0, 0, -1], n: [1, 0, 0] }, { o: [-w / 2, 0, 0], u: [0, 0, 1], n: [-1, 0, 0] },
  ];
  for (const f of faces) {
    for (const y of [5, 14, 24]) k.plate([f.o[0], y, f.o[2]], f.u, [0, 1, 0], arch(1.1, 2.2, 'round'), WINDOW, 0.05);
    k.plate([f.o[0], 28.8, f.o[2]], f.u, [0, 1, 0], ngon(24, 1.85, 0).map(([a, b]) => [a, b] as V2), CLOCK_RIM, 0.06);
    k.plate([f.o[0], 28.8, f.o[2]], f.u, [0, 1, 0], ngon(24, 1.55, 0).map(([a, b]) => [a, b] as V2), CLOCK, 0.08);
  }
  // Cornice and the gallery above it, with its openings.
  k.prism(offsetRing(body, 0.45), 32.6, 33.4, RENDER_DARK, RENDER_DARK);
  const att = offsetRing(body, -0.25);
  k.prism(att, 33.4, 36.4, RENDER, null);
  for (const f of faces) {
    const len = Math.abs(f.u[0]) > 0.5 ? w : dd;
    const n = 4, step = (len - 1.2) / n;
    const o: V3 = [f.o[0] - f.n[0] * 0.25, 33.9, f.o[2] - f.n[2] * 0.25];
    k.row(o, f.u, [0, 1, 0], arch(step * 0.6, 2.0, 'round'), OPENING, n, step, 0, 0.05);
  }
  k.prism(offsetRing(body, 0.15), 36.4, 36.9, RENDER_DARK, RENDER_DARK);
  // The helmet: a four-sided bell, a lantern, a bulb and the spire.
  const R = Math.min(w, dd) / 2 * Math.SQRT2 * 0.98;
  k.lathe(0, 0, [[R, 36.9], [R * 0.86, 37.8], [R * 0.52, 40.2], [R * 0.3, 42.6], [0.95, 44.2]], 4, COPPER, { flat: true, phase: 45 });
  k.lathe(0, 0, [[0.95, 44.2], [0.9, 46.3]], 8, OPENING, { flat: true });
  k.lathe(0, 0, [[1.1, 46.2], [1.05, 46.6], [0.9, 47.4], [0.45, 48.4], [0.18, 50.5], [0.05, 53]], 8, COPPER, { flat: true });
  d.ball(0, 53.2, 0, 0.3, GOLD);
  // Four corner turrets.
  for (const [cx, cz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as V2[]) {
    const x = cx * (w / 2 - 0.55), z = cz * (dd / 2 - 0.55);
    k.prism(ngon(8, 0.55, 22.5, x, z), 36.9, 39.8, RENDER, null);
    k.lathe(x, z, [[0.7, 39.8], [0.5, 40.6], [0.08, 42.8]], 8, COPPER, { flat: true });
    d.ball(x, 43, z, 0.12, GOLD, 6);
  }
  k.light([0, 30, 0], 1);
}

/** The Smetana Museum: arcade, two storeys, hipped roof, gables to the river and the south. */
function museum(k: Kit, d: Kit, site: Site) {
  const r = orientedRect(site.feature('way/30619188')!.polygons[0].outer);
  // Local x along the long side (roughly north to south), z across; which way the river lies.
  const g = site.bare(r.cx, r.cz);
  k.place(r.cx, g, r.cz, r.bearing);
  d.place(r.cx, g, r.cz, r.bearing);
  k.ground = d.ground = g;
  const L = r.w, D = r.d, eave = 12.2;
  // The side facing the river: the one whose outside is water.
  const west = (() => { const p = k.world([0, 0, D / 2 + 8]), q = k.world([0, 0, -D / 2 - 8]); return Number.isNaN(site.water(p[0], p[2])) && !Number.isNaN(site.water(q[0], q[2])) ? -1 : 1; })();
  const body = rect(L, D);
  k.prism(body, -2, 4.4, RENDER_DARK, null, { windows: false });
  k.prism(body, 4.4, eave, STOREYS, null, { windows: true, eave: g + eave });
  k.prism(offsetRing(body, 0.3), 4.2, 4.6, RENDER, RENDER);
  k.prism(offsetRing(body, 0.45), eave - 0.5, eave, RENDER, RENDER);
  // The arcade under the river front and the south end.
  const front: V3 = [0, 0, west * D / 2], fu: V3 = [west, 0, 0];
  k.row(front, fu, [0, 1, 0], arch(2.6, 3.6, 'round'), OPENING, 9, 3.8, 0, 0.05);
  const southEnd: V3 = [L / 2, 0, 0];
  k.row(southEnd, [0, 0, -1], [0, 1, 0], arch(2.6, 3.6, 'round'), OPENING, 4, 4.2, 0, 0.05);
  // Roof.
  k.roof(body, eave, { shape: 'hipped', pitch: 46, cap: 99, gable: () => false }, TILES, SGRAFFITO);
  // Gables standing in front of the roof: a wide one over the middle of the river front, one at the south end.
  const gw = 11, gh = 9.5;
  k.slab([0, eave - 0.6, west * (D / 2 + 0.35)], [west, 0, 0], [0, 1, 0], renaissanceGable(gw, gh), 3.2, SGRAFFITO, RENDER);
  k.slab([L / 2 + 0.35, eave - 0.6, 0], [0, 0, -1], [0, 1, 0], renaissanceGable(D * 0.62, gh * 0.9), 3.2, SGRAFFITO, RENDER);
  for (const [o, u] of [[[0, eave + 1.2, west * (D / 2 + 0.4)], [west, 0, 0]], [[L / 2 + 0.4, eave + 1.2, 0], [0, 0, -1]]] as [V3, V3][]) {
    k.row(o, u, [0, 1, 0], arch(1.1, 2.1, 'round'), WINDOW, 3, 2.4, 0, 0.05);
    d.ball(o[0] + (u[0] ? 0 : 0), eave - 0.6 + gh + 0.35, o[2], 0.3, RENDER_DARK, 6);
  }
  k.light([0, 6, west * (D / 2 + 4)], 1);
}

export const smetanaMuseum: Model = {
  id: 'smetana-museum',
  replaces: ['way/30619188', 'way/30619195', 'way/492321197', 'way/492321198', 'way/563266896', 'way/563266897', 'way/563266898'],
  floodlit: true,
  build(site, k, d) {
    k.seed = 71; d.seed = 72;
    waterTower(k, d, site);
    museum(k, d, site);
  },
};
