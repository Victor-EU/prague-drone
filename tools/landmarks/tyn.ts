// The Church of Our Lady before Týn (design.md §7.1): two 80 m towers of mottled, blackened stone,
// their galleries at 50.5 m, each crowned by a steep dark spire with four corner turrets and four
// spirelets round it, gilded balls on every point; between them the west gable with its pinnacles
// and the golden Madonna; behind, the very steep roof of the nave with its polygonal apse, and the
// high aisles under their own steep roofs, buttressed, with tall windows. The west front stands
// behind the Týn school houses on the square (OSM buildings of their own), so from the square the
// towers rise out of a row of roofs, as in 8607. Placed on OSM's nave and towers
// (way/455314032, 455314030, 455314031). M12: the windows in stone surrounds with their mullions,
// the galleries on corbels behind pierced balustrades, the turrets' spires crocketed, the string
// courses moulded. M18 (8607): the corner turrets in slate, gilded stars over the balls, copper
// needles, and the west gable dressed in dark stone with blind tracery, shields and the Madonna.
// M19: the heights measured from 8607's camera solved again (design.md §12.1): the galleries 7 m
// higher, the spires shorter over them, the spirelets higher, the nave and its gable 4 m higher.

import { Kit, mat, rect, ngon, offsetRing, orientedRect, areaCentre, PROFILE, type V2, type V3, type Mat } from './kit.ts';
import { pinnacle, traceryWindow, corbels, balustrade, shields, statue } from './ornament.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, SFlag } from '../../src/core/buildings.ts';

// M18: the pale stone greyer and pinker (8607), and blackened stone by stone by the shader.
const STONE = mat('#bdaea0', Surface.Stone, Stone.Ashlar, 1, SFlag.Blackened);
const WALLS = mat('#b2a496', Surface.Stone, Stone.Rubble, 0.7, SFlag.Blackened);
const BAND = mat('#6a635a', Surface.Stone, Stone.Ashlar, 1, SFlag.Blackened);
const DRESSING = mat('#8d847a', Surface.Stone, Stone.Ashlar, 0.6, SFlag.Blackened);
const SLATE = mat('#383b3f', Surface.Metal, Metal.Slate);
const SPIRE = mat('#2f3236', Surface.Metal, Metal.Lead);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const COPPER = mat('#5f8a78', Surface.Metal, Metal.Copper);
const IRON = mat('#1c1d1f', Surface.Metal, Metal.Lead);
const TRACERY = mat('#8a8274', Surface.Glass, Glass.Tracery);
const DARK = mat('#1b1a18', Surface.Opening);
const UP: V3 = [0, 1, 0];
/** The towers' gallery floor and the nave's eaves, above the ground (M19, from 8607 solved again). */
const GAL = 50.5, NAVE = 34;

/** A gilded eight-pointed star of radius r at (x, y, z), two crossed plates each way (8607: one over every ball). */
function star(d: Kit, x: number, y: number, z: number, r: number) {
  const pts: V2[] = [];
  for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8, q = i % 2 ? r * 0.38 : r; pts.push([q * Math.sin(a), q * Math.cos(a)]); }
  for (const u of [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]] as V3[]) d.plate([x, y, z], u, UP, pts, GOLD, 0);
}

/** A small octagonal pinnacle or turret: shaft from y0 to y1 with radius r, a crocketed spire to `apex`, a gilded ball and star. */
function turret(k: Kit, d: Kit, f: Kit, x: number, z: number, r: number, y0: number, y1: number, apex: number, body: Mat, ball = 0.22) {
  pinnacle(k, f, x, z, y0, y1, apex, r, body, { sides: 8, spire: SPIRE, cap: BAND, crockets: r >= 0.5 });
  if (ball > 0) {
    d.lathe(x, z, [[0.05, apex - 0.1], [0.04, apex + 1.1]], 4, COPPER);
    d.ball(x, apex + 0.75, z, ball, GOLD, 6);
    if (ball >= 0.15) star(d, x, apex + 1.1 + ball * 1.6, z, ball * 1.8);
  }
}

/** One of the two towers, centred on the current origin: body, belfry, gallery, the spire cluster. */
function tower(k: Kit, d: Kit, f: Kit, s: number) {
  const h = s / 2;
  const body = rect(s, s);
  k.prism(body, -2, GAL, STONE, null);
  for (const y of [15, 27, 38]) k.sweep(body.map(([x, z]) => [x, y, z] as V3), PROFILE.string(0.26, 0.5), BAND, { closed: true });
  // Stepped corner buttresses with sloped set-offs.
  for (const [cx, cz] of offsetRing(body, 0.2)) {
    const sx = Math.sign(cx), sz = Math.sign(cz);
    k.box(cx + sx * 0.3, cz + sz * 0.3, 1.9, 1.9, -2, 27, BAND, BAND);
    k.pyramid(rect(1.9, 1.9, cx + sx * 0.3, cz + sz * 0.3), 27, 28.1, BAND, [cx + sx * 0.1, cz + sz * 0.1]);
    k.box(cx + sx * 0.1, cz + sz * 0.1, 1.5, 1.5, 27, 41.5, BAND, BAND);
    k.pyramid(rect(1.5, 1.5, cx + sx * 0.1, cz + sz * 0.1), 41.5, 42.8, BAND, [cx, cz]);
  }
  // Belfry openings and the windows below, in stone surrounds with their mullions.
  const faces: { o: V3; u: V3 }[] = [
    { o: [0, 0, h], u: [1, 0, 0] }, { o: [0, 0, -h], u: [-1, 0, 0] }, { o: [h, 0, 0], u: [0, 0, -1] }, { o: [-h, 0, 0], u: [0, 0, 1] },
  ];
  for (const fc of faces) {
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 39.5, 2.4, 7.4, DRESSING, DARK, { lights: 2, rise: 1.8, proud: 0.16, depth: 0.28 });
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 29.5, 1.8, 6.5, DRESSING, TRACERY, { lights: 2, rise: 1.3, proud: 0.14, depth: 0.24 });
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 20, 1.2, 4, DRESSING, TRACERY, { lights: 1, rise: 0.9, proud: 0.12, depth: 0.2 });
  }
  // Gallery on corbels, behind a pierced balustrade.
  const gal = offsetRing(body, 0.55);
  corbels(f, offsetRing(body, 0.02).map(([x, z]) => [x, GAL - 1.2, z] as V3), BAND, { step: 1.2, w: 0.45, h: 1.1, out: 0.5, closed: true });
  k.loft(body, GAL - 1.2, gal, GAL, BAND);
  balustrade(f, gal.map(([x, z]) => [x, GAL, z] as V3), BAND, { h: 1.4, closed: true, posts: true, w: 0.3, step: 0.36 });
  // The main spire: an octagonal needle from the gallery to 82 m.
  // Slate to 77.5 m, then a copper needle carrying the ball and the star (8607).
  k.lathe(0, 0, [[4.1, GAL], [4.1, GAL + 1.4], [2.6, 63], [1.1, 73], [0.32, 77.5]], 8, SPIRE, { flat: true, phase: 22.5 });
  d.lathe(0, 0, [[0.32, 77.5], [0.14, 80.5], [0.06, 83.2]], 8, COPPER);
  d.ball(0, 81.9, 0, 0.38, GOLD, 8);
  star(d, 0, 83.8, 0, 0.6);
  // Four corner turrets on the gallery, clad in slate with lancets (8607), four spirelets on the spire's faces.
  for (const [cx, cz] of offsetRing(body, 0.05)) {
    turret(k, d, f, cx, cz, 0.85, GAL - 2, GAL + 3, 61.5, SPIRE);
    for (let e = 0; e < 8; e += 2) {
      const a = (e * Math.PI) / 4, ca = Math.cos(a), sa = Math.sin(a);
      k.plate([cx + 0.8 * ca, GAL + 1.5, cz + 0.8 * sa], [sa, 0, -ca], UP, [[-0.1, 0], [0.1, 0], [0.1, 1.0], [0, 1.2], [-0.1, 1.0]], DARK, 0.02);
    }
  }
  for (let q = 0; q < 4; q++) {
    const a = (q * Math.PI) / 2, x = 3.0 * Math.cos(a), z = 3.0 * Math.sin(a);
    // Lanterns on corbelled skirts high on the spire's faces (8607), their stars at 71 m.
    turret(k, d, f, x, z, 0.75, 58.3, 63.1, 69.9, SPIRE, 0.2);
  }
  // Lucarnes on the spire.
  for (let q = 0; q < 4; q++) {
    const a = (q * Math.PI) / 2 + Math.PI / 4;
    k.push().at(3.6 * Math.cos(a), 0, 3.6 * Math.sin(a), (a * 180) / Math.PI);
    k.box(0.2, 0, 0.9, 1.1, GAL + 3.4, GAL + 5, SPIRE, null);
    k.pyramid(rect(1.1, 1.3, 0.2, 0), GAL + 5, GAL + 6.2, SPIRE);
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
    // M19: the towers on their outlines' area centroids, 20.3 m apart, as 8607 and 8608 show them (the
    // vertex centres had them 2.5 m further apart).
    const tN = areaCentre(site.feature('way/455314030')!.polygons[0].outer), tS = areaCentre(site.feature('way/455314031')!.polygons[0].outer);
    const ln = k.local(tN[0], g, tN[1]), ls = k.local(tS[0], g, tS[1]);
    const tx = (ln[0] + ls[0]) / 2, ts = 9.6;
    const west = tx - ts / 2 - 1.2;
    const eastX = L / 2 - hw;

    // Nave: walls to 34 m, its apse of five sides, a 67° roof with an upright gable to the west.
    const nave: V2[] = [[west, hw], [west, -hw]];
    for (let q = 0; q <= 4; q++) { const a = -Math.PI / 2 + (q * Math.PI) / 4; nave.push([eastX + hw * Math.cos(a), hw * Math.sin(a)]); }
    k.prism(nave, -2, NAVE, WALLS, null);
    k.roof(nave, NAVE, { shape: 'gabled', pitch: 67, cap: 99, gable: (e) => e === 0 }, SLATE, STONE);
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
    traceryWindow(k, f, [west, 0, 0], [0, 0, 1], UP, 0, 18, 5.2, 12, DRESSING, TRACERY, { lights: 3, rise: 4, transom: true, proud: 0.18, depth: 0.32 });
    // M18, the gable as 8607 shows it: faced in dark stone, a balustrade along its foot, four blind
    // lancets over it, a row of shields, three small arches, the Madonna gilded in an aureole of
    // rays, pinnacles up the rakes standing clear of them, and an iron cross on the apex.
    const GH = hw * Math.tan((67 * Math.PI) / 180), gw: V3 = [0, 0, 1];
    k.slab([west - 0.16, NAVE, 0], gw, UP, [[-hw + 0.25, 0], [hw - 0.25, 0], [0, GH - 0.6]], 0.16, BAND);
    corbels(f, [[west - 0.1, NAVE - 0.7, -hw], [west - 0.1, NAVE - 0.7, hw]], BAND, { step: 1.0, w: 0.4, h: 0.8, out: 0.55 });
    k.box(west - 0.35, 0, 0.7, 2 * hw, NAVE - 0.05, NAVE + 0.1, BAND, BAND);
    balustrade(f, [[west - 0.55, NAVE + 0.1, -hw + 0.2], [west - 0.55, NAVE + 0.1, hw - 0.2]], BAND, { h: 1.1, posts: true, w: 0.26, step: 0.34 });
    const BLIND = mat('#2b2824', Surface.Opening);
    for (const a of [-3.0, -1.0, 1.0, 3.0]) traceryWindow(k, f, [west - 0.16, 0, 0], gw, UP, a, NAVE + 1.3, 1.5, 3.6, BAND, BLIND, { lights: 2, rise: 1.1, proud: 0.12, depth: 0.16 });
    shields(f, [west - 0.16, 0, 0], gw, UP, 0, NAVE + 5.3, 4, 1.25, 0.7, 0.85, mat('#4a4540', Surface.Stone, Stone.Ashlar, 0.3), BAND);
    for (const a of [-1.4, 0, 1.4]) traceryWindow(k, f, [west - 0.16, 0, 0], gw, UP, a, NAVE + 6.5, 1.0, 2.0 + (a === 0 ? 0.6 : 0), BAND, BLIND, { lights: 1, rise: 0.7, proud: 0.1, depth: 0.12 });
    const rays: V2[] = [];
    for (let i = 0; i < 48; i++) { const a = (i * Math.PI) / 24, q = i % 2 ? 1.0 : 1.5; rays.push([q * 0.8 * Math.sin(a), 1.3 + q * Math.cos(a)]); }
    k.plate([west - 0.16, NAVE + 8.2, 0], gw, UP, rays, GOLD, 0.05);
    k.plate([west - 0.16, NAVE + 8.2, 0], gw, UP, ngon(16, 1.0, 0, 0, 0).map(([a, b]) => [a * 0.55, 1.3 + b] as V2), mat('#e6dccb', Surface.Stone, Stone.Render, 0), 0.08);
    statue(d, [west - 0.35, NAVE + 8.5, 0], [-1, 0], 1.9, GOLD, 'single', 11);
    for (let q = 1; q <= 4; q++) {
      const t = q / 5, y = NAVE + GH * t;
      for (const sz of [-1, 1]) turret(k, d, f, west - 0.2, sz * hw * (1 - t), 0.3, y - 1.2, y + 1.2, y + 4.2, BAND, 0.1);
    }
    // A short finial on the apex and the iron cross over it, 3.3 m tall (8607).
    const top = NAVE + GH - 0.6;
    k.lathe(west - 0.2, 0, [[0.3, top], [0.3, top + 0.5], [0, top + 1.1]], 6, BAND, { flat: true });
    d.beam([west - 0.2, top + 0.8, 0], [west - 0.2, top + 4.0, 0], 0.16, IRON);
    d.beam([west - 0.2, top + 2.9, -0.9], [west - 0.2, top + 2.9, 0.9], 0.14, IRON);
    for (const [y, z] of [[top + 4.15, 0], [top + 2.9, -1.0], [top + 2.9, 1.0]] as [number, number][]) d.ball(west - 0.2, y, z, 0.12, IRON, 6);
    // Ridge turret over the crossing.
    const rx = eastX - 8;
    k.lathe(rx, 0, [[0.9, NAVE + 11], [0.9, NAVE + 17], [1.3, NAVE + 18], [0.6, NAVE + 19.7], [0.15, NAVE + 21.5], [0, NAVE + 23]], 8, SPIRE, { flat: true });
    d.ball(rx, NAVE + 23.4, 0, 0.2, GOLD, 6);

    // The towers.
    for (const lt of [ln, ls]) {
      for (const kit of [k, d, f]) kit.push().at(lt[0], 0, lt[2]);
      tower(k, d, f, ts);
      for (const kit of [k, d, f]) kit.pop();
    }
  },
};
