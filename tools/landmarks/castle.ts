// The Castle (design.md §7.1), modelled for massing: it is always seen from 500 m and more. St Vitus
// Cathedral in blackened sandstone: the two west towers with their openwork spires, the nave and
// the choir under steep roofs of patterned grey tiles, aisles and chapels lower down, the flying
// buttresses and pinnacles round the choir, the slender copper spire over the crossing, and the
// great south tower with its golden clock and its Renaissance helmet of stacked copper bells. Then
// the long palace wings along the ridge (OSM's relation/3367557) with their even rows of windows:
// grey roofs over the west and south wings, red over the Old Royal Palace, as the photographs from
// Petřín and from across the river show (8753, 8809).

import { Kit, mat, rect, ngon, arch, offsetRing, orientedRect, centreOf, PROFILE, type V2, type V3, type Mat } from './kit.ts';
import { pinnacle as crocketed, traceryWindow, balustrade } from './ornament.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style } from '../../src/core/buildings.ts';

// In the sun of 8809 the stone is a warm mid grey, darker in the Gothic dressings: blackened in
// patches, not all over (fully blackened, M15's rendered near black at half the photograph's tone).
const STONE = mat('#8a7c6c', Surface.Stone, Stone.Ashlar, 0.4);
const STONE_DARK = mat('#69635a', Surface.Stone, Stone.Ashlar, 0.55);
// The roofs' glazed tiles laid in lozenges, a neutral grey (8809).
const TILES = mat('#656664', Surface.Metal, Metal.Glazed);
const UP: V3 = [0, 1, 0];
const SPIRE = mat('#45474a', Surface.Metal, Metal.Lead);
// The helmet's old copper is a dull grey-green; the crossing spire's is paler (8809, 8753).
const COPPER = mat('#56645f', Surface.Metal, Metal.Copper);
const COPPER_LANTERN = mat('#5d6a66', Surface.Metal, Metal.Copper);
const COPPER_SPIRE = mat('#657d76', Surface.Metal, Metal.Copper);
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const TRACERY = mat('#5a544c', Surface.Glass, Glass.Tracery);
const ROSE = mat('#5a544c', Surface.Glass, Glass.Rose);
const DARK = mat('#16150f', Surface.Opening);
const PALACE = mat('#ece2cf', Surface.Wall, Style.Palace);
const PALACE_GREY = mat('#6f7472', Surface.Roof);
const PALACE_RED = mat('#a8664b', Surface.Roof);

/** A pinnacle: a slim square shaft, a moulded cap and a spirelet, crockets up its edges in the fine kit (M15). */
function pinnacle(k: Kit, f: Kit, x: number, z: number, y0: number, y1: number, w: number, top: number, m: Mat = STONE) {
  crocketed(k, f, x, z, y0, y1, top, w * 0.58, m, { sides: 4, crockets: true });
}

/** A west tower of St Vitus centred on the origin: square body, openwork octagonal spire to 82 m with its cross (8753, 8809). */
function westTower(k: Kit, d: Kit, f: Kit, s: number) {
  const body = rect(s, s), tip = 80.5;
  k.prism(body, -3, 58, STONE, null);
  for (const y of [22, 40]) k.sweep(body.map(([x, z]) => [x, y, z] as V3), PROFILE.string(0.3, 0.55), STONE_DARK, { closed: true });
  // Corner buttresses with set-offs, pinnacled above the gallery.
  for (const [x, z] of offsetRing(body, 0.3)) {
    const sx = Math.sign(x), sz = Math.sign(z);
    k.box(x + sx * 0.25, z + sz * 0.25, 2.0, 2.0, -3, 30, STONE_DARK, null);
    k.pyramid(rect(2.0, 2.0, x + sx * 0.25, z + sz * 0.25), 30, 31.2, STONE_DARK, [x, z]);
    k.box(x, z, 1.5, 1.5, 30, 56, STONE_DARK, null);
    pinnacle(k, f, x, z, 56, 59.5, 1.3, 64.5);
  }
  const faces: { o: V3; u: V3 }[] = [{ o: [0, 0, s / 2], u: [1, 0, 0] }, { o: [0, 0, -s / 2], u: [-1, 0, 0] }, { o: [s / 2, 0, 0], u: [0, 0, -1] }, { o: [-s / 2, 0, 0], u: [0, 0, 1] }];
  for (const fc of faces) {
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 44, 2.6, 11, STONE_DARK, DARK, { lights: 2, rise: 2, proud: 0.16, depth: 0.3 });
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 27, 2.4, 10, STONE_DARK, TRACERY, { lights: 2, rise: 1.8, proud: 0.14, depth: 0.26, transom: true });
    traceryWindow(k, f, fc.o, fc.u, UP, 0, 12, 1.6, 5, STONE_DARK, TRACERY, { lights: 1, rise: 1.2, proud: 0.12, depth: 0.22 });
  }
  // The gallery behind its balustrade, and the openwork spire: a slim dark core with eight
  // crocketed ribs standing off it, lucarnes at its foot.
  k.prism(offsetRing(body, 0.5), 56.6, 58, STONE_DARK, STONE_DARK);
  balustrade(f, offsetRing(body, 0.45).map(([x, z]) => [x, 58, z] as V3), STONE_DARK, { h: 1.3, closed: true, posts: true, w: 0.28, step: 0.36 });
  // Slender: at half its height the spire is about 3.5 m across, crockets and all (8809).
  k.lathe(0, 0, [[s * 0.32, 58], [s * 0.28, 60], [s * 0.17, 67], [s * 0.07, 75.5], [0, tip]], 8, SPIRE, { flat: true, phase: 22.5 });
  for (let q = 0; q < 8; q++) {
    const a = ((q + 0.5) * Math.PI) / 4, c = Math.cos(a), sn = Math.sin(a);
    k.beam([c * s * 0.37, 58.2, sn * s * 0.37], [c * 0.2, tip - 0.4, sn * 0.2], 0.36, STONE_DARK);
    for (const t of [0.25, 0.45, 0.65, 0.82]) {
      const r = s * 0.37 * (1 - t) + 0.2 * t + 0.22, y = 58.2 + (tip - 0.4 - 58.2) * t;
      f.lathe(c * r, sn * r, [[0.22, y - 0.2], [0, y + 0.55]], 4, STONE_DARK, { flat: true });
    }
  }
  for (let q = 0; q < 4; q++) {
    const a = (q * Math.PI) / 2;
    k.push().at(s * 0.34 * Math.cos(a), 0, s * 0.34 * Math.sin(a), (a * 180) / Math.PI);
    k.box(0.3, 0, 1.0, 1.4, 59.5, 61.6, STONE_DARK, null);
    k.pyramid(rect(1.2, 1.6, 0.3, 0), 61.6, 63.4, SPIRE);
    k.pop();
  }
  d.lathe(0, 0, [[0.08, tip - 0.2], [0.06, tip + 2.2]], 4, GOLD);
  d.ball(0, tip + 0.9, 0, 0.35, GOLD, 6);
}

export const castle: Model = {
  id: 'st-vitus',
  floodlit: 'bright',
  // The palace wings, and the remains under the third courtyard, mapped as a church 3 m high: the
  // churches generator raised a Baroque church with two towers on them beside the south tower.
  replaces: ['relation/3367557', 'way/485764471'],
  build(site: Site, k: Kit, d: Kit, f: Kit) {
    k.seed = d.seed = 97; f.seed = 98;
    const outline = site.feature('relation/15317899')!.polygons[0].outer;
    const r = orientedRect(outline);
    let bearing = r.w > r.d ? r.bearing : r.bearing + 90;
    if (Math.abs(((bearing - 69 + 540) % 360) - 180) > 90) bearing += 180;
    const g = site.bare(r.cx, r.cz);
    for (const kit of [k, d, f]) { kit.place(r.cx, g, r.cz, bearing); kit.ground = g; }
    // Extent along the axis, and the key parts in local coordinates.
    let x0 = Infinity, x1 = -Infinity;
    for (let i = 0; i < outline.length; i += 2) { const l = k.local(outline[i], g, outline[i + 1]); x0 = Math.min(x0, l[0]); x1 = Math.max(x1, l[0]); }
    const loc = (key: string) => { const c = centreOf(site.feature(key)!.polygons[0].outer); return k.local(c[0], g, c[1]); };
    const tw1 = loc('way/762259526'), tw2 = loc('way/762259534');
    const st = loc('way/462765679');
    const cr = loc('way/243800050');
    const xc = cr[0], west = Math.min(tw1[0], tw2[0]) - 4.6, east = x1;
    const hv = 6.6; // half the central vessel

    // Nave, transept and choir: walls to 38 m, 63° roofs to about 51 m (8809 against the south
    // tower); the choir ends in an apse, its chapels and flying buttresses within the outline.
    const wall = 38, pitch = 63, ridge = wall + hv * Math.tan((pitch * Math.PI) / 180);
    const apseX = east - 21.5;
    const nave: V2[] = [[west + 4, hv], [west + 4, -hv], [xc - 5.8, -hv], [xc - 5.8, hv]];
    const transept: V2[] = [[xc - 5.8, 24], [xc - 5.8, -24], [xc + 5.8, -24], [xc + 5.8, 24]];
    const choir: V2[] = [[xc + 5.8, hv], [xc + 5.8, -hv]];
    for (let q = 0; q <= 4; q++) { const a = -Math.PI / 2 + (q * Math.PI) / 4; choir.push([apseX + hv * Math.cos(a), hv * Math.sin(a)]); }
    k.prism(nave, -3, wall, STONE, null);
    k.roof(nave, wall, { shape: 'gabled', pitch, cap: 99, gable: (e) => e === 0 }, TILES, STONE);
    k.prism(transept, -3, wall, STONE, null);
    k.roof(transept, wall, { shape: 'gabled', pitch, cap: 99, gable: (e) => e === 1 || e === 3 }, TILES, STONE);
    k.prism(choir, -3, wall, STONE, null);
    k.roof(choir, wall, { shape: 'gabled', pitch, cap: 99, gable: () => false }, TILES, STONE);
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
        traceryWindow(k, f, [x, 0, sz * hv], [sz, 0, 0], UP, 0, 24.5, 3.2, 12, STONE_DARK, TRACERY, { lights: 3, rise: 2.4, transom: true, proud: 0.16, depth: 0.3 });
        traceryWindow(k, f, [x, 0, sz * 14], [sz, 0, 0], UP, 0, 5, 3, 13, STONE_DARK, TRACERY, { lights: 3, rise: 2.2, transom: true, proud: 0.16, depth: 0.3 });
      }
      for (let x = xc + 9; x < apseX - 1; x += 6.5) traceryWindow(k, f, [x, 0, sz * hv], [sz, 0, 0], UP, 0, 23, 3.4, 14, STONE_DARK, TRACERY, { lights: 3, rise: 2.6, transom: true, proud: 0.16, depth: 0.3 });
    }
    // Chapels round the apse: a ring of low polygonal bays under one roof.
    const ring: V2[] = [];
    for (let q = 0; q <= 8; q++) { const a = -Math.PI / 2 + (q * Math.PI) / 8; ring.push([apseX + 19 * Math.cos(a), 19 * Math.sin(a)]); }
    const inner: V2[] = [];
    for (let q = 8; q >= 0; q--) { const a = -Math.PI / 2 + (q * Math.PI) / 8; inner.push([apseX + hv * Math.cos(a), hv * Math.sin(a)]); }
    const chevet = ring.concat(inner);
    k.prism(chevet, -3, 20, STONE, null);
    k.roof(chevet, 20, { shape: 'hipped', pitch: 38, cap: 5, gable: () => false }, TILES, STONE);
    // Flying buttresses: piers at the outer walls, pinnacles on top, and from each pier an arm up
    // to the clerestory: a stone slab with a straight back over a quarter arch. (Two thin beams
    // read as black strokes from the river in 8809, where the photograph shows lit stone.)
    const flyer = (px: number, pz: number, wx: number, wz: number) => {
      k.box(px, pz, 1.9, 1.9, -3, 22, STONE_DARK, null);
      pinnacle(k, f, px, pz, 22, 33, 1.9, 40, STONE_DARK);
      const len = Math.hypot(wx - px, wz - pz) + 0.4, u: V3 = [(wx - px) / (len - 0.4), 0, (wz - pz) / (len - 0.4)];
      const arm: V2[] = [[0, 33], [len, wall - 0.2], [len, wall - 2.4]];
      for (let q = 7; q >= 0; q--) { const t = (q / 8) * (Math.PI / 2); arm.push([len * (1 - Math.cos(t)), 28 + (wall - 2.4 - 28) * Math.sin(t)]); }
      d.slab([px - u[2] * 0.4, 0, pz + u[0] * 0.4], u, UP, arm, 0.8, STONE_DARK);
    };
    for (const sz of [-1, 1]) for (let x = xc + 9; x < apseX - 1; x += 6.5) flyer(x, sz * 20.5, x, sz * (hv + 0.3));
    for (let q = 1; q < 8; q++) {
      const a = -Math.PI / 2 + (q * Math.PI) / 8, c = Math.cos(a), s = Math.sin(a);
      flyer(apseX + 20.5 * c, 20.5 * s, apseX + (hv + 0.3) * c, (hv + 0.3) * s);
      if (q % 2) traceryWindow(k, f, [apseX + hv * c, 0, hv * s], [-s, 0, c], UP, 0, 23, 2.6, 14, STONE_DARK, TRACERY, { lights: 2, rise: 2.0, transom: true, proud: 0.14, depth: 0.26 });
    }
    for (const sz of [-1, 1]) for (let x = west + 16; x < xc - 8; x += 7) { k.box(x + 3.5, sz * 14.6, 1.4, 1.4, -3, 20, STONE_DARK, null); pinnacle(k, f, x + 3.5, sz * 14.6, 20, 25, 1.2, 29.5, STONE_DARK); }

    // West front: rose window and gable between the towers, and the towers.
    k.plate([west + 4, 26, 0], [0, 0, 1], UP, ngon(24, 5, 0).map(([a, b]) => [a, b + 5] as V2), ROSE, 0.06);
    f.sweep(ngon(24, 5.4, 0).map(([a, b]) => [west + 4, 31 + b, a] as V3), PROFILE.ring(0.5, 0.3), STONE_DARK, { v: [-1, 0, 0], closed: true });
    traceryWindow(k, f, [west + 4, 0, 0], [0, 0, 1], UP, 0, 5, 5, 14, STONE_DARK, TRACERY, { lights: 3, rise: 4, transom: true, proud: 0.2, depth: 0.4 });
    // The gable between the towers: pinnacles up both rakes and a finial at the ridge.
    for (let q = 1; q <= 3; q++) {
      const t = q / 4, y = wall + (ridge - wall) * t;
      for (const sz of [-1, 1]) pinnacle(k, f, west + 3.8, sz * hv * (1 - t), y - 1.5, y + 0.5, 0.7, y + 3.2, STONE_DARK);
    }
    pinnacle(k, f, west + 3.8, 0, ridge - 2.3, ridge + 0.2, 0.9, ridge + 4.2, STONE_DARK);
    for (const t of [tw1, tw2]) {
      for (const kit of [k, d, f]) kit.push().at(t[0], 0, t[2]);
      westTower(k, d, f, 9.3);
      for (const kit of [k, d, f]) kit.pop();
    }

    // Crossing spire: an openwork lantern, dark against the sky, and the copper needle (8809).
    k.lathe(cr[0], cr[2], [[1.8, 50], [1.8, 60]], 8, SPIRE, { flat: true, phase: 22.5 });
    k.lathe(cr[0], cr[2], [[2.1, 60], [2.1, 60.4], [1.2, 64], [0.5, 72], [0, 80]], 8, COPPER_SPIRE, { flat: true, phase: 22.5 });
    d.ball(cr[0], 80.3, cr[2], 0.3, GOLD, 6);

    // The great south tower: dark body, golden clock, gallery with four cupolas, the stacked helmet.
    for (const kit of [k, d, f]) kit.push().at(st[0], 0, st[2]);
    const sb = rect(15.2, 15.2);
    k.prism(sb, -3, 58, STONE, null);
    for (const y of [20, 38]) k.sweep(sb.map(([x, z]) => [x, y, z] as V3), PROFILE.string(0.35, 0.6), STONE_DARK, { closed: true });
    for (const [x, z] of offsetRing(sb, 0.4)) {
      const sx = Math.sign(x), sz = Math.sign(z);
      k.box(x + sx * 0.3, z + sz * 0.3, 2.6, 2.6, -3, 20, STONE_DARK, null);
      k.pyramid(rect(2.6, 2.6, x + sx * 0.3, z + sz * 0.3), 20, 21.4, STONE_DARK, [x, z]);
      k.box(x, z, 2, 2, 20, 50, STONE_DARK, null);
    }
    traceryWindow(k, f, [0, 0, 7.6], [1, 0, 0], UP, 0, 22, 4.5, 15, STONE_DARK, TRACERY, { lights: 3, rise: 3.4, transom: true, proud: 0.2, depth: 0.4 });
    traceryWindow(k, f, [7.6, 0, 0], [0, 0, -1], UP, 0, 22, 4.5, 15, STONE_DARK, TRACERY, { lights: 3, rise: 3.4, transom: true, proud: 0.2, depth: 0.4 });
    for (const [o, u] of [[[0, 0, -7.6], [-1, 0, 0]], [[-7.6, 0, 0], [0, 0, 1]]] as [V3, V3][]) traceryWindow(k, f, o, u, UP, 0, 30, 3.2, 9, STONE_DARK, DARK, { lights: 2, rise: 2.4, proud: 0.16, depth: 0.3 });
    for (const [o, u] of [[[0, 0, 7.6], [1, 0, 0]], [[7.6, 0, 0], [0, 0, -1]]] as [V3, V3][]) {
      k.plate([o[0], 44, o[2]], u, [0, 1, 0], ngon(24, 2.2, 0).map(([a, b]) => [a, b + 2.2] as V2), GOLD, 0.06);
      k.plate([o[0], 44, o[2]], u, [0, 1, 0], ngon(24, 1.7, 0).map(([a, b]) => [a, b + 2.2] as V2), mat('#243a52', Surface.Plain), 0.09);
    }
    k.loft(sb, 57, offsetRing(sb, 0.7), 58.4, STONE_DARK);
    k.prism(offsetRing(sb, 0.7), 58.4, 60.2, STONE, STONE_DARK);
    balustrade(f, offsetRing(sb, 0.6).map(([x, z]) => [x, 60.2, z] as V3), STONE, { h: 1.3, closed: true, posts: true, w: 0.3, step: 0.38 });
    // The four corner turrets: short drums under fat copper onions, level with the bell (8809).
    for (const [x, z] of offsetRing(sb, 0.2)) {
      k.lathe(x, z, [[1.2, 60], [1.2, 63]], 8, STONE, { flat: true, phase: 22.5 });
      k.lathe(x, z, [[1.3, 63], [1.85, 64.2], [1.8, 65.4], [1.25, 66.6], [0.45, 67.6], [0.3, 68.2], [0.45, 68.6], [0.2, 69.6], [0, 71]], 8, COPPER, { flat: true, phase: 22.5 });
      d.ball(x, 71.3, z, 0.25, GOLD, 6);
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
    for (const kit of [k, d, f]) kit.pop();

    // The palace wings along the ridge: even windows, grey roofs west, red over the Old Royal Palace.
    const pal = site.feature('relation/3367557')!.polygons[0];
    const toLocal = (ring: number[]) => { const out: V2[] = []; for (let i = 0; i < ring.length; i += 2) { const l = k.local(ring[i], g, ring[i + 1]); out.push([l[0], l[2]]); } return out; };
    let gmin = Infinity, gs: number[] = [];
    for (let i = 0; i < pal.outer.length; i += 6) { const h = site.bare(pal.outer[i], pal.outer[i + 1]); gs.push(h); gmin = Math.min(gmin, h); }
    gs.sort((a, b) => a - b);
    const gref = (gmin + gs[gs.length >> 1]) / 2;
    // The reference lies about 10 m under the courtyards (the south front stands down on the
    // gardens); the eave about 13.5 m over them, as 8753 and 8809 show it against the cathedral.
    const eave = gref + 24;
    for (const kit of [k, d, f]) { kit.place(r.cx, 0, r.cz, bearing); kit.ground = gref; }
    const outer = toLocal(pal.outer), holes = pal.holes.map(toLocal);
    k.prism(outer, gmin - 1, eave, PALACE, null, { windows: true, eave });
    for (const h of holes) k.prism(h, gmin - 1, eave, PALACE, null, { windows: true, eave, inward: true });
    // Grey over the west and south wings, red east of a line across the south wing's end, from
    // (-752, -406) to (-737, -394): the Old Royal Palace and its south-west block (8809).
    const redRoof = (c: V3) => (c[0] + 752) * 0.75 - (c[2] + 406) * 0.66 > 2;
    k.roof(outer, eave, { shape: 'hipped', pitch: 40, cap: 7, gable: () => false }, PALACE_GREY, PALACE, holes, (c) => (redRoof(c) ? PALACE_RED : PALACE_GREY));
  },
};
