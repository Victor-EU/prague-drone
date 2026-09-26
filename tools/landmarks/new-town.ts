// The New Town's and the east's skyline (design.md §7.1, M15): the Jindřišská tower and the New
// Town Hall's tower, both of the Gothic type with a steep hipped roof between corner turrets; the
// Municipal House with its copper dome and lantern over the corner, its glass roofs, the great arch
// of the entrance and statues on the attic; the National Museum from its parts with the central
// dome, the corner pavilions, the cornice and the balustrade; and the National Monument on Vítkov,
// a granite block with the equestrian statue on its terrace.

import { Kit, mat, rect, ngon, arch, offsetRing, orientedRect, PROFILE, type V2, type V3 } from './kit.ts';
import { entablature, pilaster, statue, balustrade, traceryWindow, column, ribs } from './ornament.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style } from '../../src/core/buildings.ts';
import { gothicTower, placeOn } from './bridge-towers.ts';
import { buildParts, COPPER } from './parts.ts';

const UP: V3 = [0, 1, 0];
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const SLATE = mat('#3a3d42', Surface.Metal, Metal.Slate);
const WINDOW = mat('#232629', Surface.Glass, Glass.Plain);
const DARK = mat('#1b1a18', Surface.Opening);
const WHITE = mat('#e9e3d8', Surface.Stone, Stone.Render, 0.15);
const STATUE = mat('#b7ab98', Surface.Stone, Stone.Render, 0.3);
const BRONZE = mat('#2f3531', Surface.Stone, Stone.Render, 0.2);

function ringOf(k: Kit, site: Site, key: string, g: number): V2[] {
  const r = site.feature(key)!.polygons[0].outer, out: V2[] = [];
  for (let i = 0; i < r.length; i += 2) { const l = k.local(r[i], g, r[i + 1]); out.push([l[0], l[2]]); }
  return out;
}
const at = (r: V2[], y: number) => r.map(([x, z]) => [x, y, z] as V3);
const ringSign = (r: V2[]) => { let a = 0; for (let i = 0; i < r.length; i++) { const j = (i + 1) % r.length; a += r[i][0] * r[j][1] - r[j][0] * r[i][1]; } return Math.sign(a) || 1; };
function edgeNormal(r: V2[], i: number): V2 {
  const s = ringSign(r), j = (i + 1) % r.length, dx = r[j][0] - r[i][0], dz = r[j][1] - r[i][1], l = Math.hypot(dx, dz) || 1;
  return [(s * dz) / l, (-s * dx) / l];
}
function face(r: V2[], nx: number, nz: number) {
  let best: { a: V2; b: V2; n: V2; len: number } | null = null;
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], n = edgeNormal(r, i), len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (n[0] * nx + n[1] * nz < 0.6) continue;
    if (!best || len > best.len) best = { a, b, n, len };
  }
  return best;
}

// ---- The Gothic towers -----------------------------------------------------------------------------

export const jindrisskaTower: Model = {
  id: 'jindrisska-tower',
  unnamed: true,
  floodlit: true,
  replaces: ['way/1175034425', 'way/482009486', 'relation/14006346'],
  build(site, k, d, f) {
    k.seed = 151; d.seed = 152; f.seed = 153;
    const r = placeOn([k, d, f], site, 'way/482009486', 45);
    gothicTower(k, d, f, {
      w: r.w, d: r.d, body: 41, gallery: 44.5, roofTop: 66, ridge: 3.2,
      turret: { r: 0.85, shaft: 47, spire: 54.5 }, tracery: [33.5, 40.5], strings: [12, 22.5], windows: [15, 26],
      stone: mat('#5f5850', Surface.Stone, Stone.Ashlar, 0.9), dressing: mat('#8a7f72', Surface.Stone, Stone.Ashlar, 0.5),
      roof: SLATE, lucarnes: true,
    });
    k.light([0, 30, 0], 1);
  },
};

export const newTownHallTower: Model = {
  id: 'new-town-hall-tower',
  unnamed: true,
  floodlit: true,
  // The mappers' tower: its body, its hipped roof and the four corner turrets as parts on the corner of the hall.
  replaces: ['way/30986186', 'way/456579938', 'way/456579942', 'way/482529252', 'way/482529253', 'way/482529254', 'way/482529255', 'way/482529256'],
  build(site, k, d, f) {
    k.seed = 154; d.seed = 155; f.seed = 156;
    const r = placeOn([k, d, f], site, 'way/30986186', 90);
    gothicTower(k, d, f, {
      w: r.w, d: r.d, body: 44, gallery: 47, roofTop: 70, ridge: 2.4,
      turret: { r: 0.9, shaft: 49.5, spire: 57.5 }, tracery: [34, 42], strings: [14, 27], windows: [17, 30],
      stone: mat('#a89b86', Surface.Stone, Stone.Ashlar, 0.5), dressing: mat('#c2b6a0', Surface.Stone, Stone.Ashlar, 0.3),
      roof: SLATE, lucarnes: true,
    });
    k.light([0, 30, 0], 1);
  },
};

// ---- The Municipal House ------------------------------------------------------------------------------

export const municipalHouse: Model = {
  id: 'municipal-house',
  unnamed: true,
  floodlit: true,
  replaces: ['way/27124435', 'way/482524690', 'way/482524691', 'way/482524692'],
  build(site, k, d, f) {
    k.seed = 157; d.seed = 158; f.seed = 159;
    const r = orientedRect(site.feature('way/27124435')!.polygons[0].outer);
    const g = site.bare(r.cx, r.cz);
    for (const kit of [k, d, f]) { kit.place(0, g, 0, 90); kit.ground = g; }
    const WALL = mat('#e3d3b4', Surface.Wall, Style.Palace), PLASTER = mat('#e3d3b4', Surface.Stone, Stone.Render, 0.15);
    const outline = ringOf(k, site, 'way/27124435', g);
    const EAVE = 21;
    k.prism(outline, -2, EAVE, WALL, null, { windows: true, eave: g + EAVE });
    entablature(k, at(outline, EAVE - 1.7), WHITE, { out: 0.8, h: 1.7, closed: true });
    k.prism(offsetRing(outline, 0.2), EAVE, EAVE + 1.2, PLASTER, PLASTER);
    k.roof(outline, EAVE + 1.2, { shape: 'mansard', pitch: 30, lower: 68, inset: 3.2, cap: 7.5, gable: () => false }, COPPER, PLASTER);
    // The glass roofs of the halls.
    buildParts(site, k, ['way/482524691', 'way/482524692'], g, { wall: PLASTER });
    // Statues along the attic, every 9 m.
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 14) continue;
      const n = edgeNormal(outline, i), count = Math.floor(len / 9);
      for (let q = 1; q < count; q++) {
        const t = q / count, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
        d.box(x, z, 0.9, 0.9, EAVE + 1.2, EAVE + 2.2, WHITE);
        statue(d, [x, EAVE + 2.2, z], [n[0], n[1]], 2.4, STATUE, 'single', 300 + i * 9 + q);
      }
    }
    // The dome over the corner: a drum with windows, the ribbed copper dome, the lantern and its finial.
    const dc = orientedRect(site.feature('way/482524690')!.polygons[0].outer);
    const c = k.local(dc.cx, g, dc.cz);
    const R = 6.4;
    k.lathe(c[0], c[2], [[R + 1.2, EAVE - 0.5], [R + 1.2, EAVE + 1.6], [R, EAVE + 1.9], [R, EAVE + 5.6]], 16, PLASTER, { flat: true });
    for (let q = 0; q < 8; q++) {
      const a = (q * Math.PI) / 4 + Math.PI / 8;
      k.plate([c[0] + R * Math.cos(a), EAVE + 2.6, c[2] + R * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, arch(1.4, 2.4, 'round'), WINDOW, 0.04);
    }
    entablature(k, ngon(16, R, 0, c[0], c[2]).map(([x, z]) => [x, EAVE + 5.3, z] as V3), WHITE, { out: 0.5, h: 0.8, closed: true });
    const prof: V2[] = [[R + 0.3, EAVE + 6.1], [R + 0.2, EAVE + 7.4], [R * 0.9, EAVE + 9.2], [R * 0.68, EAVE + 11], [R * 0.4, EAVE + 12.2], [R * 0.22, EAVE + 12.7]];
    k.lathe(c[0], c[2], [...prof, [0, EAVE + 12.7]], 24, COPPER);
    ribs(k, c[0], c[2], prof, 12, 0.2, mat('#5e8a78', Surface.Metal, Metal.Copper), 15);
    k.lathe(c[0], c[2], [[R * 0.2, EAVE + 12.5], [R * 0.2, EAVE + 15.5]], 8, PLASTER, { flat: true, phase: 22.5 });
    for (let q = 0; q < 8; q++) { const a = (q * Math.PI) / 4 + Math.PI / 8, rr = R * 0.2 * Math.cos(Math.PI / 8); k.plate([c[0] + rr * Math.cos(a), EAVE + 13, c[2] + rr * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, arch(0.6, 1.8, 'round'), DARK, 0.03); }
    k.lathe(c[0], c[2], [[R * 0.26, EAVE + 15.5], [R * 0.24, EAVE + 16.2], [R * 0.14, EAVE + 17.2], [0.1, EAVE + 18.6], [0, EAVE + 19]], 8, COPPER);
    d.lathe(c[0], c[2], [[0.06, EAVE + 18.8], [0.05, EAVE + 21.5]], 4, GOLD);
    d.ball(c[0], EAVE + 20, c[2], 0.35, GOLD, 6);
    // The entrance under the dome: the great arch with the mosaic in its tympanum, the balcony on columns.
    const pt = site.landmark('powder-tower');
    const towards = k.local(pt.x, g, pt.z);
    const dir: V2 = [towards[0] - c[0], towards[2] - c[2]], dl = Math.hypot(dir[0], dir[1]) || 1;
    const fc = face(outline, dir[0] / dl, dir[1] / dl);
    if (fc) {
      const { a, b, n } = fc, u: V3 = [n[1], 0, -n[0]];
      // The nearest point of the face to the dome's centre.
      const ex = b[0] - a[0], ez = b[1] - a[1], el = Math.hypot(ex, ez), t = Math.max(0.2, Math.min(0.8, ((c[0] - a[0]) * ex + (c[2] - a[1]) * ez) / (el * el)));
      const o: V3 = [a[0] + ex * t, 0, a[1] + ez * t];
      k.plate(o, u, UP, arch(9, 11.5, 'round').map(([x, y]) => [x, y + 8.5] as V2), mat('#8a6a3c', Surface.Plain), 0.05);
      k.plate(o, u, UP, arch(8.4, 10.6, 'round').map(([x, y]) => [x, y + 8.8] as V2), mat('#3a4a5e', Surface.Plain), 0.07);
      k.plate(o, u, UP, [[-4.2, 0], [4.2, 0], [4.2, 5.2], [-4.2, 5.2]], DARK, 0.05);
      k.slab([o[0] + n[0] * 3.2, 6.2, o[2] + n[1] * 3.2], u, UP, [[-6, 0], [6, 0], [6, 0.9], [-6, 0.9]], 3.2, WHITE);
      for (const dx of [-5, -1.7, 1.7, 5]) column(k, o[0] + u[0] * dx + n[0] * 2.4, o[2] + u[2] * dx + n[1] * 2.4, 0, 6.2, 0.45, WHITE, { order: 'ionic', sides: 10 });
      balustrade(f, [[o[0] + u[0] * -6 + n[0] * 3.2, 7.1, o[2] + u[2] * -6 + n[1] * 3.2], [o[0] + u[0] * 6 + n[0] * 3.2, 7.1, o[2] + u[2] * 6 + n[1] * 3.2]], WHITE, { h: 1.0, w: 0.26, step: 0.34, posts: true });
      k.light([o[0] + n[0] * 6, 4, o[2] + n[1] * 6], 1);
    }
    k.light([c[0], EAVE + 8, c[2]], 1);
  },
};

// ---- The National Museum ----------------------------------------------------------------------------

export const nationalMuseum: Model = {
  id: 'national-museum',
  floodlit: true,
  replaces: ['way/31518628', 'way/31518629', 'way/454864679', 'way/454893465', 'way/483435052', 'way/483435053', 'way/483435054', 'way/483435055', 'way/483435056', 'way/483435057', 'way/490886760', 'way/490886761', 'way/654980944', 'way/654980945', 'way/654980946', 'way/654980947', 'way/655674130'],
  build(site, k, d, f) {
    k.seed = 160; d.seed = 161; f.seed = 162;
    const r = orientedRect(site.feature('relation/3366506')!.polygons[0].outer);
    const g = site.bare(r.cx, r.cz);
    const WALL = mat('#d9c7a2', Surface.Wall, Style.Palace), STONE = mat('#cdbb95', Surface.Stone, Stone.Ashlar, 0.3);
    // The pavilions, the wings and the central drum from their parts; the main block to its cornice.
    buildParts(site, k, ['way/454893465', 'way/483435052', 'way/483435053', 'way/483435054', 'way/483435057', 'way/454864679', 'way/483435056', 'way/654980944', 'way/654980945', 'way/654980946', 'way/654980947', 'way/655674130', 'way/483435055'], g, { wall: STONE, roof: () => COPPER });
    buildParts(site, k, ['way/31518628', 'way/31518629'], g, { wall: STONE, roof: () => mat('#9fb0b8', Surface.Glass, Glass.Curtain) });
    for (const kit of [k, d, f]) { kit.place(0, g, 0, 90); kit.ground = g; }
    const outline = ringOf(k, site, 'relation/3366506', g);
    const holes = site.feature('relation/3366506')!.polygons[0].holes.map((h) => { const out: V2[] = []; for (let i = 0; i < h.length; i += 2) { const l = k.local(h[i], g, h[i + 1]); out.push([l[0], l[2]]); } return out; });
    const EAVE = 28;
    k.prism(outline, -2, EAVE, WALL, mat('#8d8f8c', Surface.FlatRoof), { windows: true, eave: g + EAVE });
    for (const h of holes) k.prism(h, -2, EAVE, WALL, null, { windows: true, eave: g + EAVE, inward: true });
    entablature(k, at(outline, EAVE - 2), STONE, { out: 1.0, h: 2.0, closed: true });
    k.prism(offsetRing(outline, 0.3), EAVE, EAVE + 0.8, STONE, STONE);
    balustrade(f, offsetRing(outline, 0.1).map(([x, z]) => [x, EAVE + 0.8, z] as V3), STONE, { h: 1.2, w: 0.3, step: 0.4, closed: true });
    // Statues over the pavilions' corners and along the front; the gilded finial on the lantern.
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 20) continue;
      const n = edgeNormal(outline, i), count = Math.floor(len / 8);
      for (let q = 1; q < count; q++) {
        const t = q / count, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
        d.box(x, z, 0.9, 0.9, EAVE + 0.8, EAVE + 1.8, STONE);
        statue(d, [x, EAVE + 1.8, z], [n[0], n[1]], 2.5, STATUE, 'single', 400 + i * 11 + q);
      }
    }
    const lc = orientedRect(site.feature('way/483435056')!.polygons[0].outer), l = k.local(lc.cx, g, lc.cz);
    d.ball(l[0], 70, l[2], 0.6, GOLD, 8);
    k.light([0, 30, 0], 1);
  },
};

// ---- Vítkov -------------------------------------------------------------------------------------------

export const vitkov: Model = {
  id: 'vitkov',
  unnamed: true,
  floodlit: true,
  replaces: ['way/454893470', 'way/1494628689'],
  build(site, k, d, f) {
    k.seed = 163; d.seed = 164; f.seed = 165;
    const r = placeOn([k, d, f], site, 'way/454893470', 76);
    const GRANITE = mat('#6a6560', Surface.Stone, Stone.Ashlar, 0.5);
    const ring = ringOf(k, site, 'way/454893470', r.g);
    k.prism(ring, -3, 31.5, GRANITE, GRANITE);
    k.sweep(at(ring, 30.4), PROFILE.band(0.4, 1.1), GRANITE, { closed: true });
    // The terrace before the west front, and Žižka on his horse in bronze on a granite plinth.
    const W = r.w / 2;
    k.box(-W - 12, 0, 24, 30, -3, 1.2, GRANITE);
    k.box(-W - 9, 0, 3.6, 9.2, 1.2, 7.4, GRANITE);
    d.box(-W - 9, 0, 2.6, 7.6, 7.4, 10.4, BRONZE);
    d.box(-W - 11.6, 0, 2.0, 2.4, 9.2, 12.4, BRONZE);
    statue(d, [-W - 9.2, 10.4, 0], [-1, 0], 4.2, BRONZE, 'single', 170, { pose: 'staff' });
    k.light([-W - 9, 6, 0], 1);
  },
};
