// The Castle (design.md §7.1), modelled for massing: it is always seen from 500 m and more. St Vitus
// Cathedral in blackened sandstone: the two west towers with their openwork spires, the nave and
// the choir under steep roofs of patterned grey tiles, aisles and chapels lower down, the flying
// buttresses and pinnacles round the choir, the slender copper spire over the crossing, and the
// great south tower with its golden clock and its Renaissance helmet of stacked copper bells. Then
// the long palace wings along the ridge (OSM's relation/3367557) with their even rows of windows:
// grey roofs over the west and south wings, red over the Old Royal Palace, as the photographs from
// Petřín and from across the river show (8753, 8809).

import { Kit, mat, rect, ngon, arch, offsetRing, orientedRect, centreOf, type V2, type V3, type Mat } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style } from '../../src/core/buildings.ts';

const STONE = mat('#645c52', Surface.Stone, Stone.Ashlar, 1);
const STONE_DARK = mat('#4f4943', Surface.Stone, Stone.Ashlar, 1);
const TILES = mat('#5d6262', Surface.Metal, Metal.Slate);
const SPIRE = mat('#34363a', Surface.Metal, Metal.Lead);
const COPPER = mat('#6d9786', Surface.Metal, Metal.Copper);
const COPPER_LANTERN = mat('#7aa292', Surface.Metal, Metal.Copper);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const TRACERY = mat('#5a544c', Surface.Glass, Glass.Tracery);
const ROSE = mat('#5a544c', Surface.Glass, Glass.Rose);
const DARK = mat('#16150f', Surface.Opening);
const PALACE = mat('#ece2cf', Surface.Wall, Style.Palace);
const PALACE_GREY = mat('#6f7472', Surface.Roof);
const PALACE_RED = mat('#a8664b', Surface.Roof);

/** A pinnacle: a slim square shaft and a spirelet. */
function pinnacle(k: Kit, x: number, z: number, y0: number, y1: number, w: number, top: number, m: Mat = STONE) {
  k.box(x, z, w, w, y0, y1, m, null);
  k.pyramid(rect(w * 1.1, w * 1.1, x, z), y1, top, m);
}

/** A west tower of St Vitus centred on the origin: square body, openwork octagonal spire. */
function westTower(k: Kit, d: Kit, s: number) {
  const body = rect(s, s);
  k.prism(body, -3, 58, STONE, null);
  for (const y of [22, 40]) k.prism(offsetRing(body, 0.2), y, y + 0.5, STONE_DARK, STONE_DARK);
  for (const [x, z] of offsetRing(body, 0.3)) {
    k.box(x, z, 1.5, 1.5, -3, 56, STONE_DARK, null);
    pinnacle(k, x, z, 56, 59.5, 1.3, 64);
  }
  const faces: { o: V3; u: V3 }[] = [{ o: [0, 0, s / 2], u: [1, 0, 0] }, { o: [0, 0, -s / 2], u: [-1, 0, 0] }, { o: [s / 2, 0, 0], u: [0, 0, -1] }, { o: [-s / 2, 0, 0], u: [0, 0, 1] }];
  for (const f of faces) {
    k.plate([f.o[0], 44, f.o[2]], f.u, [0, 1, 0], arch(2.6, 11, 'pointed', 2), DARK, 0.05);
    k.plate([f.o[0], 27, f.o[2]], f.u, [0, 1, 0], arch(2.4, 10, 'pointed', 1.8), TRACERY, 0.05);
  }
  // Openwork spire: eight ribs with crockets, dark between them.
  k.lathe(0, 0, [[s * 0.42, 58], [s * 0.3, 66], [s * 0.16, 76], [0, 84]], 8, SPIRE, { flat: true, phase: 22.5 });
  for (let q = 0; q < 8; q++) {
    const a = ((q + 0.5) * Math.PI) / 4, c = Math.cos(a), sn = Math.sin(a);
    d.beam([c * s * 0.45, 58.5, sn * s * 0.45], [c * 0.2, 83.5, sn * 0.2], 0.35, STONE_DARK);
  }
  d.ball(0, 84.4, 0, 0.35, GOLD, 6);
}

export const castle: Model = {
  id: 'st-vitus',
  replaces: ['relation/3367557'],
  build(site: Site, k: Kit, d: Kit) {
    k.seed = d.seed = 97;
    const outline = site.feature('relation/15317899')!.polygons[0].outer;
    const r = orientedRect(outline);
    let bearing = r.w > r.d ? r.bearing : r.bearing + 90;
    if (Math.abs(((bearing - 69 + 540) % 360) - 180) > 90) bearing += 180;
    const g = site.bare(r.cx, r.cz);
    for (const kit of [k, d]) { kit.place(r.cx, g, r.cz, bearing); kit.ground = g; }
    // Extent along the axis, and the key parts in local coordinates.
    let x0 = Infinity, x1 = -Infinity;
    for (let i = 0; i < outline.length; i += 2) { const l = k.local(outline[i], g, outline[i + 1]); x0 = Math.min(x0, l[0]); x1 = Math.max(x1, l[0]); }
    const loc = (key: string) => { const c = centreOf(site.feature(key)!.polygons[0].outer); return k.local(c[0], g, c[1]); };
    const tw1 = loc('way/762259526'), tw2 = loc('way/762259534');
    const st = loc('way/462765679');
    const cr = loc('way/243800050');
    const xc = cr[0], west = Math.min(tw1[0], tw2[0]) - 4.6, east = x1;
    const hv = 6.6; // half the central vessel

    // Nave, transept and choir: walls to 40 m, 66° roofs to about 55 m; the choir ends in an apse.
    const apseX = east - 16;
    const nave: V2[] = [[west + 4, hv], [west + 4, -hv], [xc - 5.8, -hv], [xc - 5.8, hv]];
    const transept: V2[] = [[xc - 5.8, 24], [xc - 5.8, -24], [xc + 5.8, -24], [xc + 5.8, 24]];
    const choir: V2[] = [[xc + 5.8, hv], [xc + 5.8, -hv]];
    for (let q = 0; q <= 4; q++) { const a = -Math.PI / 2 + (q * Math.PI) / 4; choir.push([apseX + hv * Math.cos(a), hv * Math.sin(a)]); }
    k.prism(nave, -3, 40, STONE, null);
    k.roof(nave, 40, { shape: 'gabled', pitch: 66, cap: 99, gable: (e) => e === 0 }, TILES, STONE);
    k.prism(transept, -3, 40, STONE, null);
    k.roof(transept, 40, { shape: 'gabled', pitch: 66, cap: 99, gable: (e) => e === 1 || e === 3 }, TILES, STONE);
    k.prism(choir, -3, 40, STONE, null);
    k.roof(choir, 40, { shape: 'gabled', pitch: 66, cap: 99, gable: () => false }, TILES, STONE);
    // Aisles along nave and choir, and the chapels round the choir.
    for (const sz of [-1, 1]) {
      const aisle: V2[] = [[west + 12, sz * hv], [xc - 5.8, sz * hv], [xc - 5.8, sz * 14], [west + 12, sz * 14]];
      k.prism(aisle, -3, 22, STONE, null);
      k.roof(aisle, 22, { shape: 'skillion', pitch: 48, cap: 99, gable: () => false, direction: (((bearing + sz * 90) % 360 + 360) % 360) * Math.PI / 180 }, TILES, STONE);
      const amb: V2[] = [[xc + 5.8, sz * hv], [apseX, sz * hv], [apseX, sz * 19], [xc + 5.8, sz * 19]];
      k.prism(amb, -3, 21, STONE, null);
      k.roof(amb, 21, { shape: 'skillion', pitch: 40, cap: 99, gable: () => false, direction: (((bearing + sz * 90) % 360 + 360) % 360) * Math.PI / 180 }, TILES, STONE);
      // Clerestory and aisle windows.
      for (let x = west + 16; x < xc - 8; x += 7) {
        k.plate([x, 25, sz * hv], [sz, 0, 0], [0, 1, 0], arch(3.2, 13, 'pointed', 2.4), TRACERY, 0.05);
        k.plate([x, 5, sz * 14], [sz, 0, 0], [0, 1, 0], arch(3, 13, 'pointed', 2.2), TRACERY, 0.05);
      }
      for (let x = xc + 9; x < apseX - 1; x += 6.5) k.plate([x, 23.5, sz * hv], [sz, 0, 0], [0, 1, 0], arch(3.4, 15, 'pointed', 2.6), TRACERY, 0.05);
    }
    // Chapels round the apse: a ring of low polygonal bays under one roof.
    const ring: V2[] = [];
    for (let q = 0; q <= 8; q++) { const a = -Math.PI / 2 + (q * Math.PI) / 8; ring.push([apseX + 19 * Math.cos(a), 19 * Math.sin(a)]); }
    const inner: V2[] = [];
    for (let q = 8; q >= 0; q--) { const a = -Math.PI / 2 + (q * Math.PI) / 8; inner.push([apseX + hv * Math.cos(a), hv * Math.sin(a)]); }
    const chevet = ring.concat(inner);
    k.prism(chevet, -3, 20, STONE, null);
    k.roof(chevet, 20, { shape: 'hipped', pitch: 38, cap: 5, gable: () => false }, TILES, STONE);
    // Flying buttresses: piers at the outer walls, arms up to the clerestory, pinnacles on top.
    const flyer = (px: number, pz: number, wx: number, wz: number) => {
      pinnacle(k, px, pz, -3, 33, 1.9, 39.5, STONE_DARK);
      d.beam([px, 31.5, pz], [wx, 37.5, wz], 0.9, STONE_DARK);
      d.beam([px, 26.5, pz], [wx, 31.5, wz], 0.7, STONE_DARK);
    };
    for (const sz of [-1, 1]) for (let x = xc + 9; x < apseX - 1; x += 6.5) flyer(x, sz * 20.5, x, sz * (hv + 0.3));
    for (let q = 1; q < 8; q++) {
      const a = -Math.PI / 2 + (q * Math.PI) / 8, c = Math.cos(a), s = Math.sin(a);
      flyer(apseX + 20.5 * c, 20.5 * s, apseX + (hv + 0.3) * c, (hv + 0.3) * s);
      if (q % 2) k.plate([apseX + hv * c, 23.5, hv * s], [-s, 0, c], [0, 1, 0], arch(2.6, 15, 'pointed', 2.0), TRACERY, 0.05);
    }
    for (const sz of [-1, 1]) for (let x = west + 16; x < xc - 8; x += 7) pinnacle(k, x + 3.5, sz * 14.6, 20, 25, 1.2, 29.5, STONE_DARK);

    // West front: rose window and gable between the towers, and the towers.
    k.plate([west + 4, 26, 0], [0, 0, 1], [0, 1, 0], ngon(24, 5, 0).map(([a, b]) => [a, b + 5] as V2), ROSE, 0.06);
    k.plate([west + 4, 5, 0], [0, 0, 1], [0, 1, 0], arch(5, 14, 'pointed', 4), TRACERY, 0.06);
    for (const t of [tw1, tw2]) {
      for (const kit of [k, d]) kit.push().at(t[0], 0, t[2]);
      westTower(k, d, 9.3);
      for (const kit of [k, d]) kit.pop();
    }

    // Crossing spire: a copper lantern and needle.
    k.lathe(cr[0], cr[2], [[1.8, 50], [1.8, 60], [2.1, 60.4], [1.2, 64], [0.5, 72], [0, 80]], 8, COPPER, { flat: true, phase: 22.5 });
    d.ball(cr[0], 80.3, cr[2], 0.3, GOLD, 6);

    // The great south tower: dark body, golden clock, gallery with four cupolas, the stacked helmet.
    for (const kit of [k, d]) kit.push().at(st[0], 0, st[2]);
    const sb = rect(15.2, 15.2);
    k.prism(sb, -3, 58, STONE, null);
    for (const y of [20, 38]) k.prism(offsetRing(sb, 0.25), y, y + 0.6, STONE_DARK, STONE_DARK);
    for (const [x, z] of offsetRing(sb, 0.4)) k.box(x, z, 2, 2, -3, 50, STONE_DARK, null);
    k.plate([0, 22, 7.6], [1, 0, 0], [0, 1, 0], arch(4.5, 15, 'pointed', 3.4), TRACERY, 0.05);
    for (const [o, u] of [[[0, 0, 7.6], [1, 0, 0]], [[7.6, 0, 0], [0, 0, -1]]] as [V3, V3][]) {
      k.plate([o[0], 44, o[2]], u, [0, 1, 0], ngon(24, 2.2, 0).map(([a, b]) => [a, b + 2.2] as V2), GOLD, 0.06);
      k.plate([o[0], 44, o[2]], u, [0, 1, 0], ngon(24, 1.7, 0).map(([a, b]) => [a, b + 2.2] as V2), mat('#243a52', Surface.Plain), 0.09);
    }
    k.loft(sb, 57, offsetRing(sb, 0.7), 58.4, STONE_DARK);
    k.prism(offsetRing(sb, 0.7), 58.4, 60.2, STONE, STONE_DARK);
    for (const [x, z] of offsetRing(sb, 0.2)) {
      k.lathe(x, z, [[1.1, 60], [1.1, 64.5]], 8, STONE, { flat: true, phase: 22.5 });
      k.lathe(x, z, [[1.4, 64.5], [1.5, 65.6], [1.0, 67.4], [0.35, 68.8], [0.25, 69.6], [0, 70.8]], 8, COPPER, { flat: true, phase: 22.5 });
      d.ball(x, 71.2, z, 0.25, GOLD, 6);
    }
    k.lathe(0, 0, [[6.2, 60.2], [6.1, 61.4], [5.2, 63.4], [3.6, 65.4], [2.9, 66.4]], 8, COPPER, { flat: true, phase: 22.5 });
    k.lathe(0, 0, [[2.6, 66.4], [2.6, 71.4]], 8, COPPER_LANTERN, { flat: true, phase: 22.5 });
    for (let q = 0; q < 8; q++) {
      const a = (q * Math.PI) / 4, rr = 2.6 * Math.cos(Math.PI / 8);
      k.plate([rr * Math.cos(a), 67.2, rr * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], [0, 1, 0], arch(1.2, 3.2, 'round'), DARK, 0.03);
    }
    k.lathe(0, 0, [[3.4, 71.4], [3.3, 72.4], [2.5, 74.6], [1.6, 76.6], [1.2, 77.4]], 8, COPPER, { flat: true, phase: 22.5 });
    k.lathe(0, 0, [[1.2, 77.4], [1.2, 80.6]], 8, COPPER_LANTERN, { flat: true, phase: 22.5 });
    k.lathe(0, 0, [[1.7, 80.6], [1.6, 81.6], [1.0, 83.4], [0.4, 85.4], [0.2, 88], [0, 91]], 8, COPPER, { flat: true, phase: 22.5 });
    d.lathe(0, 0, [[0.08, 90.6], [0.06, 95.6]], 4, GOLD);
    d.ball(0, 92.3, 0, 0.5, GOLD, 8);
    d.box(0, 0, 0.16, 1.8, 93.8, 95.2, GOLD, GOLD);
    for (const kit of [k, d]) kit.pop();

    // The palace wings along the ridge: even windows, grey roofs west, red over the Old Royal Palace.
    const pal = site.feature('relation/3367557')!.polygons[0];
    const toLocal = (ring: number[]) => { const out: V2[] = []; for (let i = 0; i < ring.length; i += 2) { const l = k.local(ring[i], g, ring[i + 1]); out.push([l[0], l[2]]); } return out; };
    let gmin = Infinity, gs: number[] = [];
    for (let i = 0; i < pal.outer.length; i += 6) { const h = site.bare(pal.outer[i], pal.outer[i + 1]); gs.push(h); gmin = Math.min(gmin, h); }
    gs.sort((a, b) => a - b);
    const gref = (gmin + gs[gs.length >> 1]) / 2;
    const eave = gref + 19.5;
    for (const kit of [k, d]) { kit.place(r.cx, 0, r.cz, bearing); kit.ground = gref; }
    const outer = toLocal(pal.outer), holes = pal.holes.map(toLocal);
    k.prism(outer, gmin - 1, eave, PALACE, null, { windows: true, eave });
    for (const h of holes) k.prism(h, gmin - 1, eave, PALACE, null, { windows: true, eave, inward: true });
    k.roof(outer, eave, { shape: 'hipped', pitch: 40, cap: 7, gable: () => false }, PALACE_GREY, PALACE, holes, (c) => (c[0] < -770 ? PALACE_GREY : PALACE_RED));
  },
};
