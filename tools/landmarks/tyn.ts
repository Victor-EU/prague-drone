// The Church of Our Lady before Týn (design.md §7.1): two 80 m towers of mottled, blackened stone,
// their galleries at 44 m, each crowned by a steep dark spire with four corner turrets and four
// spirelets round it, gilded balls on every point; between them the west gable with its pinnacles
// and the golden Madonna; behind, the very steep roof of the nave with its polygonal apse, and the
// high aisles under their own steep roofs, buttressed, with tall windows. The west front stands
// behind the Týn school houses on the square (OSM buildings of their own), so from the square the
// towers rise out of a row of roofs, as in 8607. Placed on OSM's nave and towers
// (way/455314032, 455314030, 455314031). M12: the windows in stone surrounds with their mullions,
// the galleries on corbels behind pierced balustrades, the turrets' spires crocketed, the string
// courses moulded.

import { Kit, mat, rect, ngon, offsetRing, orientedRect, centreOf, PROFILE, type V2, type V3, type Mat } from './kit.ts';
import { pinnacle, traceryWindow, corbels, balustrade } from './ornament.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

const STONE = mat('#b9ac97', Surface.Stone, Stone.Ashlar, 1);
const WALLS = mat('#b3a894', Surface.Stone, Stone.Rubble, 0.6);
const BAND = mat('#6a635a', Surface.Stone, Stone.Ashlar, 1);
const DRESSING = mat('#8d847a', Surface.Stone, Stone.Ashlar, 0.6);
const SLATE = mat('#383b3f', Surface.Metal, Metal.Slate);
const SPIRE = mat('#2f3236', Surface.Metal, Metal.Lead);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const TRACERY = mat('#8a8274', Surface.Glass, Glass.Tracery);
const DARK = mat('#1b1a18', Surface.Opening);
const UP: V3 = [0, 1, 0];

/** A small octagonal pinnacle or turret: shaft from y0 to y1 with radius r, a crocketed spire to `apex`, a gilded ball. */
function turret(k: Kit, d: Kit, f: Kit, x: number, z: number, r: number, y0: number, y1: number, apex: number, body: Mat, ball = 0.22) {
  pinnacle(k, f, x, z, y0, y1, apex, r, body, { sides: 8, spire: SPIRE, cap: BAND, crockets: r >= 0.5 });
  if (ball > 0) {
    d.lathe(x, z, [[0.05, apex - 0.1], [0.04, apex + 1.1]], 4, SPIRE);
    d.ball(x, apex + 0.75, z, ball, GOLD, 6);
  }
}

/** One of the two towers, centred on the current origin: body, belfry, gallery, the spire cluster. */
function tower(k: Kit, d: Kit, f: Kit, s: number) {
  const h = s / 2;
  const body = rect(s, s);
  k.prism(body, -2, 43.5, STONE, null);
  for (const y of [13, 23.5, 33]) k.sweep(body.map(([x, z]) => [x, y, z] as V3), PROFILE.string(0.26, 0.5), BAND, { closed: true });
  // Stepped corner buttresses with sloped set-offs.
  for (const [cx, cz] of offsetRing(body, 0.2)) {
    const sx = Math.sign(cx), sz = Math.sign(cz);
    k.box(cx + sx * 0.3, cz + sz * 0.3, 1.9, 1.9, -2, 23.5, BAND, BAND);
    k.pyramid(rect(1.9, 1.9, cx + sx * 0.3, cz + sz * 0.3), 23.5, 24.6, BAND, [cx + sx * 0.1, cz + sz * 0.1]);
    k.box(cx + sx * 0.1, cz + sz * 0.1, 1.5, 1.5, 23.5, 36, BAND, BAND);
    k.pyramid(rect(1.5, 1.5, cx + sx * 0.1, cz + sz * 0.1), 36, 37.3, BAND, [cx, cz]);
  }
  // Belfry openings and the windows below, in stone surrounds with their mullions.
  const faces: { o: V3; u: V3 }[] = [
    { o: [0, 0, h], u: [1, 0, 0] }, { o: [0, 0, -h], u: [-1, 0, 0] }, { o: [h, 0, 0], u: [0, 0, -1] }, { o: [-h, 0, 0], u: [0, 0, 1] },
  ];
  for (const fc of faces) {
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 34.2, 2.4, 7.4, DRESSING, DARK, { lights: 2, rise: 1.8, proud: 0.16, depth: 0.28 });
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 25, 1.8, 6.5, DRESSING, TRACERY, { lights: 2, rise: 1.3, proud: 0.14, depth: 0.24 });
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 17, 1.2, 4, DRESSING, TRACERY, { lights: 1, rise: 0.9, proud: 0.12, depth: 0.2 });
  }
  // Gallery on corbels, behind a pierced balustrade.
  const gal = offsetRing(body, 0.55);
  corbels(f, offsetRing(body, 0.02).map(([x, z]) => [x, 42.3, z] as V3), BAND, { step: 1.2, w: 0.45, h: 1.1, out: 0.5, closed: true });
  k.loft(body, 42.3, gal, 43.5, BAND);
  balustrade(f, gal.map(([x, z]) => [x, 43.5, z] as V3), DRESSING, { h: 1.4, closed: true, posts: true, w: 0.3, step: 0.36 });
  // The main spire: an octagonal needle from the gallery to 80 m.
  k.lathe(0, 0, [[4.1, 43.5], [4.1, 44.9], [2.6, 58], [1.1, 71], [0, 80]], 8, SPIRE, { flat: true, phase: 22.5 });
  d.lathe(0, 0, [[0.07, 79.8], [0.05, 82.2]], 4, SPIRE);
  d.ball(0, 81.2, 0, 0.38, GOLD, 8);
  // Four corner turrets on the gallery, four spirelets on the spire's faces.
  for (const [cx, cz] of offsetRing(body, 0.05)) turret(k, d, f, cx, cz, 1.1, 41.5, 49.5, 60.5, STONE);
  for (let q = 0; q < 4; q++) {
    const a = (q * Math.PI) / 2, x = 3.0 * Math.cos(a), z = 3.0 * Math.sin(a);
    turret(k, d, f, x, z, 0.66, 51.5, 55.2, 65.5, SPIRE, 0.18);
  }
  // Lucarnes on the spire.
  for (let q = 0; q < 4; q++) {
    const a = (q * Math.PI) / 2 + Math.PI / 4;
    k.push().at(3.3 * Math.cos(a), 0, 3.3 * Math.sin(a), (a * 180) / Math.PI);
    k.box(0.2, 0, 0.9, 1.1, 47.2, 48.8, SPIRE, null);
    k.pyramid(rect(1.1, 1.3, 0.2, 0), 48.8, 50, SPIRE);
    k.pop();
  }
}

export const tyn: Model = {
  id: 'tyn',
  floodlit: true,
  build(site: Site, k: Kit, d: Kit, f: Kit) {
    k.seed = d.seed = 53; f.seed = 54;
    const nr = orientedRect(site.feature('way/455314032')!.polygons[0].outer);
    let bearing = nr.w > nr.d ? nr.bearing : nr.bearing + 90;
    if (Math.abs(((bearing - 72 + 540) % 360) - 180) > 90) bearing += 180; // towards the east end
    const g = site.bare(nr.cx, nr.cz);
    for (const kit of [k, d, f]) { kit.place(nr.cx, g, nr.cz, bearing); kit.ground = g; }
    const L = Math.max(nr.w, nr.d), hw = 5.9;
    const tN = centreOf(site.feature('way/455314030')!.polygons[0].outer), tS = centreOf(site.feature('way/455314031')!.polygons[0].outer);
    const ln = k.local(tN[0], g, tN[1]), ls = k.local(tS[0], g, tS[1]);
    const tx = (ln[0] + ls[0]) / 2, ts = 9.6;
    const west = tx - ts / 2 - 1.2;
    const eastX = L / 2 - hw;

    // Nave: walls to 33 m, its apse of five sides, a 68° roof with an upright gable to the west.
    const nave: V2[] = [[west, hw], [west, -hw]];
    for (let q = 0; q <= 4; q++) { const a = -Math.PI / 2 + (q * Math.PI) / 4; nave.push([eastX + hw * Math.cos(a), hw * Math.sin(a)]); }
    k.prism(nave, -2, 30, WALLS, null);
    k.roof(nave, 30, { shape: 'gabled', pitch: 67, cap: 99, gable: (e) => e === 0 }, SLATE, STONE);
    // Aisles: high walls, a steep roof each against the nave, chamfered at the east.
    const aisleW = Math.max(8.5, Math.min(11, Math.abs(ln[2]) + ts / 2 - hw));
    for (const sz of [-1, 1]) {
      const z0 = sz * hw, z1 = sz * (hw + aisleW), x0 = tx + ts / 2 - 0.4, x1 = eastX - 1.5;
      const ring: V2[] = [[x0, z0], [x1 + 2, z0], [x1 + 2, z1 - 3 * sz], [x1 - 1, z1], [x0, z1]];
      k.prism(ring, -2, 17, WALLS, null);
      k.roof(ring, 17, { shape: 'skillion', pitch: 50, cap: 99, gable: () => false, direction: ((bearing + (sz < 0 ? -90 : 90) + 360) % 360) * Math.PI / 180 }, SLATE, WALLS);
      // Buttresses with set-offs, and tall traceried windows between them along the outer wall.
      for (let x = x0 + 4; x < x1 - 2; x += 6.8) {
        k.box(x, z1 + sz * 1.0, 1.4, 2.0, -2, 16, BAND, null);
        k.push().at(x, 16, z1 + sz * 1.0);
        k.poly([[-0.7, 0, sz * 1.0], [0.7, 0, sz * 1.0], [0.7, 1.6, -sz * 1.0], [-0.7, 1.6, -sz * 1.0]], BAND, { normal: [0, 1, sz] });
        k.pop();
        if (x + 3.4 < x1 - 3) traceryWindow(k, f, [x + 3.4, 0, z1], [-sz, 0, 0], UP, 0, 4.5, 2.6, 11, DRESSING, TRACERY, { lights: 2, rise: 2.0, transom: true, proud: 0.14, depth: 0.26 });
      }
    }
    // The chevet: buttresses at the apse's corners and tall windows between.
    for (let q = 0; q <= 4; q++) {
      const a = -Math.PI / 2 + (q * Math.PI) / 4, nx = Math.cos(a), nz = Math.sin(a);
      k.push().at(eastX + (hw + 0.9) * nx, 0, (hw + 0.9) * nz, (a * 180) / Math.PI);
      k.box(0, 0, 2.4, 1.3, -2, 25, BAND, BAND);
      k.pyramid(rect(2.4, 1.3), 25, 27.5, BAND);
      k.pop();
      if (q < 4) {
        const b = a + Math.PI / 8, r = hw * Math.cos(Math.PI / 8);
        traceryWindow(k, f, [eastX + r * Math.cos(b), 0, r * Math.sin(b)], [-Math.sin(b), 0, Math.cos(b)], UP, 0, 8, 2.2, 17, DRESSING, TRACERY, { lights: 2, rise: 1.7, transom: true, proud: 0.14, depth: 0.26 });
      }
    }
    // The west front between the towers: a great window under the gable, the Madonna in gold,
    // pinnacles up both rakes.
    traceryWindow(k, f, [west, 0, 0], [0, 0, 1], UP, 0, 16, 5.2, 12, DRESSING, TRACERY, { lights: 3, rise: 4, transom: true, proud: 0.18, depth: 0.32 });
    k.plate([west, 38.5, 0], [0, 0, 1], UP, ngon(16, 1.3, 0, 0, 0).map(([a, b]) => [a, b] as V2), GOLD, 0.08);
    for (let q = 1; q <= 4; q++) {
      const t = q / 5, y = 30 + 13.9 * t;
      for (const sz of [-1, 1]) turret(k, d, f, west - 0.2, sz * hw * (1 - t), 0.28, y - 1.2, y + 0.6, y + 2.8, STONE, 0.1);
    }
    k.lathe(west - 0.2, 0, [[0.3, 43.5], [0.3, 45], [0, 47]], 6, STONE, { flat: true });
    d.beam([west - 0.2, 46.5, 0], [west - 0.2, 48.8, 0], 0.14, GOLD);
    d.beam([west - 0.2, 48, -0.6], [west - 0.2, 48, 0.6], 0.12, GOLD);
    // Ridge turret over the crossing.
    const rx = eastX - 8;
    k.lathe(rx, 0, [[0.9, 41], [0.9, 47], [1.3, 48], [0.6, 49.7], [0.15, 51.5], [0, 53]], 8, SPIRE, { flat: true });
    d.ball(rx, 53.4, 0, 0.2, GOLD, 6);

    // The towers.
    for (const lt of [ln, ls]) {
      for (const kit of [k, d, f]) kit.push().at(lt[0], 0, lt[2]);
      tower(k, d, f, ts);
      for (const kit of [k, d, f]) kit.pop();
    }
  },
};
