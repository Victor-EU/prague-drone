// The bridge towers of Charles Bridge (design.md §7.1). The Old Town Bridge Tower and the taller of
// the Lesser Town towers are the same Gothic type: a square body of blackened sandstone, blind
// tracery in its upper third, a corbelled gallery, four slender corner turrets with needle spires,
// a steep slate roof between two gilded finials, and the pointed gate the bridge runs through. The
// lower Judith tower has a tall hipped roof with a Renaissance gable; the gate between the two is
// crenellated. All sit on their OSM footprints.

import { Kit, mat, rect, arch, offsetRing, orientedRect, type Mat, type V2, type V3 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const OPENING = mat('#15130f', Surface.Opening);
const WINDOW = mat('#1c1f22', Surface.Glass, Glass.Plain);
const IRON = mat('#2a2a2a', Surface.Plain);

export interface TowerSpec {
  /** Body along local x (the bridge) and z. */
  w: number; d: number;
  /** Heights above the ground: top of the body, of the gallery's parapet, of the roof. */
  body: number; gallery: number; roofTop: number;
  /** Length of the roof's ridge, along x. */
  ridge: number;
  turret: { r: number; shaft: number; spire: number };
  tracery: [number, number];
  /** The pointed passage through the faces along x, if the bridge runs through the tower. */
  gate?: { w: number; h: number };
  stone: Mat; roof: Mat;
}

/** A Gothic bridge tower in the current frame (origin at the ground, centre of the body). */
export function gothicTower(k: Kit, d: Kit, t: TowerSpec) {
  const dark = { ...t.stone, c: t.stone.c.map((v) => v * 0.72) as [number, number, number], w: 1 };
  const band = { ...t.stone, c: t.stone.c.map((v) => Math.min(255, v * 1.12)) as [number, number, number], w: 0.5 };
  const body = rect(t.w, t.d);
  k.prism(body, -2, t.body, t.stone, null);
  k.prism(offsetRing(body, 0.22), -2, 1.3, dark, band);
  for (const y of [(t.gate?.h ?? 8.3) + 1.2, t.tracery[0] - 0.6]) k.prism(offsetRing(body, 0.15), y, y + 0.4, band, band);
  // Blind tracery: tall pointed panels, darker, standing slightly proud.
  const faces: { o: V3; u: V3; len: number; n: V2 }[] = [
    { o: [0, 0, t.d / 2], u: [1, 0, 0], len: t.w, n: [0, 1] },
    { o: [0, 0, -t.d / 2], u: [-1, 0, 0], len: t.w, n: [0, -1] },
    { o: [t.w / 2, 0, 0], u: [0, 0, -1], len: t.d, n: [1, 0] },
    { o: [-t.w / 2, 0, 0], u: [0, 0, 1], len: t.d, n: [-1, 0] },
  ];
  const th = t.tracery[1] - t.tracery[0];
  for (const f of faces) {
    const n = Math.max(3, Math.round(f.len / 2.3)), step = (f.len - 1.2) / n;
    k.row([f.o[0], t.tracery[0], f.o[2]], f.u, [0, 1, 0], arch(step * 0.72, th, 'pointed', step * 0.72 * 0.8), dark, n, step, 0, 0.05);
  }
  // Gate: a pointed opening in a moulded frame through both faces along x.
  if (t.gate) for (const sgn of [1, -1]) {
    const o: V3 = [(sgn * t.w) / 2, 0, 0], u: V3 = [0, 0, -sgn];
    k.plate(o, u, [0, 1, 0], arch(t.gate.w + 1.3, t.gate.h + 0.7, 'pointed', (t.gate.w + 1.3) * 0.62), band, 0.04);
    k.plate(o, u, [0, 1, 0], arch(t.gate.w, t.gate.h, 'pointed', t.gate.w * 0.62), OPENING, 0.07);
  }
  // Small windows up the sides.
  for (const f of faces.slice(0, 2)) for (const y of [(t.gate?.h ?? 8.3) + 3, (t.gate?.h ?? 8.3) + 6.5]) k.plate([f.o[0], y, f.o[2]], f.u, [0, 1, 0], [[-0.45, 0], [0.45, 0], [0.45, 1.6], [-0.45, 1.6]], WINDOW, 0.05);
  // Corbelled gallery and its parapet; the roof sits on the parapet's cap.
  const gal = offsetRing(body, 0.6);
  k.loft(body, t.body - 1.1, gal, t.body, dark);
  k.prism(gal, t.body, t.gallery, t.stone, band);
  for (const f of faces) {
    const n = Math.max(4, Math.round(f.len / 1.3)), step = (f.len + 0.6) / n;
    const o: V3 = [f.o[0] + f.n[0] * 0.6, t.body + 0.45, f.o[2] + f.n[1] * 0.6];
    d.row(o, f.u, [0, 1, 0], [[-0.22, 0], [0.22, 0], [0.22, 0.75], [-0.22, 0.75]], OPENING, n, step, 0, 0.04);
  }
  // Corner turrets with needle spires and finials.
  for (const [x, z] of offsetRing(body, 0.25)) {
    k.lathe(x, z, [[t.turret.r, t.body - 3.5], [t.turret.r, t.turret.shaft]], 8, t.stone, { flat: true, phase: 22.5 });
    k.lathe(x, z, [[t.turret.r * 1.15, t.turret.shaft], [t.turret.r * 1.15, t.turret.shaft + 0.35]], 8, band, { flat: true, phase: 22.5 });
    k.lathe(x, z, [[t.turret.r * 1.05, t.turret.shaft + 0.35], [0, t.turret.spire]], 8, t.roof, { flat: true, phase: 22.5 });
    d.lathe(x, z, [[0.05, t.turret.spire - 0.2], [0.04, t.turret.spire + 1.4]], 4, IRON);
    d.ball(x, t.turret.spire + 0.9, z, 0.2, GOLD, 6);
  }
  // The steep roof: hipped with a short ridge along x.
  const rd = t.d - 0.8, rw = Math.min(t.w - 0.8, rd + t.ridge);
  const pitch = (Math.atan((t.roofTop - t.gallery) / (rd / 2)) * 180) / Math.PI;
  k.roof(rect(rw, rd), t.gallery, { shape: 'hipped', pitch, cap: 99, gable: () => false }, t.roof, t.roof);
  // Gilded finials at the ends of the ridge, and a lucarne on each long side.
  for (const sx of [-1, 1]) {
    const x = (sx * (rw - rd)) / 2;
    d.lathe(x, 0, [[0.07, t.roofTop - 0.3], [0.05, t.roofTop + 3.4]], 4, IRON);
    d.ball(x, t.roofTop + 2.4, 0, 0.36, GOLD, 8);
    d.ball(x, t.roofTop + 3.2, 0, 0.18, GOLD, 6);
  }
  for (const sz of [-1, 1]) {
    const y = t.gallery + (t.roofTop - t.gallery) * 0.3, z = sz * (rd / 2) * 0.7;
    k.box(0, z, 1.0, 1.0, y - 0.6, y + 0.9, t.stone, null);
    k.pyramid(rect(1.2, 1.2, 0, z), y + 0.9, y + 1.9, t.roof);
    k.plate([0, y - 0.2, z + sz * 0.5], [sz, 0, 0], [0, 1, 0], [[-0.3, 0], [0.3, 0], [0.3, 0.8], [-0.3, 0.8]], WINDOW, 0.03);
  }
}

export function placeOn(k: Kit, d: Kit, site: Site, key: string, bearingNear?: number) {
  const r = orientedRect(site.feature(key)!.polygons[0].outer);
  // Local x along the bridge: pick the rectangle axis nearest the wanted bearing.
  let b = r.bearing, w = r.w, dd = r.d;
  if (bearingNear !== undefined) {
    const diff = (a: number) => Math.abs(((a - bearingNear + 540) % 360) - 180);
    if (Math.min(diff(b + 90), diff(b - 90)) < Math.min(diff(b), diff(b + 180))) { b += 90; [w, dd] = [dd, w]; }
    if (diff(b + 180) < diff(b)) b += 180;
  }
  const g = site.bare(r.cx, r.cz);
  for (const kit of [k, d]) { kit.place(r.cx, g, r.cz, b); kit.ground = g; }
  return { ...r, w, d: dd, bearing: b, g };
}

export const oldTownBridgeTower: Model = {
  id: 'old-town-bridge-tower',
  floodlit: true,
  build(site, k, d) {
    k.seed = 31; d.seed = 31;
    const r = placeOn(k, d, site, 'way/93479848', 103);
    gothicTower(k, d, {
      w: r.w, d: r.d, body: 26.6, gallery: 28.3, roofTop: 43.2, ridge: 3.2,
      turret: { r: 0.9, shaft: 30.4, spire: 38.2 }, tracery: [18.2, 25.4], gate: { w: 5.4, h: 8.8 },
      stone: mat('#74685b', Surface.Stone, Stone.Ashlar, 0.8), roof: mat('#3d4145', Surface.Metal, Metal.Slate),
    });
  },
};

export const lesserTownBridgeTowers: Model = {
  id: 'lesser-town-bridge-towers',
  floodlit: true,
  replaces: ['way/389652950', 'way/460016966', 'way/460016964', 'way/460016965', 'way/482310118', 'way/389652949'],
  build(site, k, d) {
    k.seed = 37; d.seed = 37;
    // The tall Gothic tower.
    const t = placeOn(k, d, site, 'way/389652949', 90);
    gothicTower(k, d, {
      w: t.w, d: t.d, body: 26.2, gallery: 27.9, roofTop: 44.8, ridge: 2.4,
      turret: { r: 0.8, shaft: 30.2, spire: 38.5 }, tracery: [17.8, 25],
      stone: mat('#7c7165', Surface.Stone, Stone.Ashlar, 0.7), roof: mat('#383c41', Surface.Metal, Metal.Slate),
    });
    const tallSouth = t.cz + t.d / 2;
    // The Judith tower: rubble walls, a tall hipped roof with a Renaissance gable facing the bridge.
    const j = placeOn(k, d, site, 'way/389652950', 90);
    const stone = mat('#8e8474', Surface.Stone, Stone.Rubble, 0.55), roof = mat('#586059', Surface.Metal, Metal.Slate);
    const band = mat('#9c9180', Surface.Stone, Stone.Ashlar, 0.4);
    k.prism(rect(j.w, j.d), -2, 16.4, stone, band);
    // Hipped, its short ridge running north–south (local z).
    const jw = j.w - 0.6, jd = j.d - 0.4;
    const jh = k.roof(rect(jw, jd), 16.4, { shape: 'hipped', pitch: 72, cap: 99, gable: () => false }, roof, roof);
    // The gable on the east face (local +x), stepped, with two windows.
    const gx = j.w / 2 - 0.4;
    k.prism([[gx - 1.2, -2.2], [gx + 0.3, -2.2], [gx + 0.3, 2.2], [gx - 1.2, 2.2]], 16.4, 19.2, band, null);
    k.prism([[gx - 1.2, -1.5], [gx + 0.3, -1.5], [gx + 0.3, 1.5], [gx - 1.2, 1.5]], 19.2, 20.8, band, null);
    k.pyramid([[gx - 1.2, -0.8], [gx + 0.3, -0.8], [gx + 0.3, 0.8], [gx - 1.2, 0.8]], 20.8, 22.2, band);
    for (const z of [-0.9, 0.9]) k.plate([gx + 0.3, 17.2, z], [0, 0, -1], [0, 1, 0], [[-0.35, 0], [0.35, 0], [0.35, 1.2], [-0.35, 1.2]], WINDOW, 0.04);
    for (const sz of [-1, 1]) d.lathe(0, (sz * Math.max(0, jd - jw)) / 2, [[0.08, 16.4 + jh - 0.3], [0.05, 16.4 + jh + 3.2]], 4, IRON);
    for (const y of [5, 10]) for (const x of [-2.5, 2.5]) k.plate([j.w / 2, y, x], [0, 0, -1], [0, 1, 0], [[-0.5, 0], [0.5, 0], [0.5, 1.4], [-0.5, 1.4]], WINDOW, 0.05);
    // The gate between them: a pointed passage under a crenellated top.
    const g = site.bare(t.cx, (tallSouth + j.cz - j.d / 2) / 2);
    const z0 = j.cz - j.d / 2, z1 = t.cz - t.d / 2; // world z of the two facing walls
    const zc = (z0 + z1) / 2, gap = Math.abs(z1 - z0) + 1.0;
    for (const kit of [k, d]) { kit.place(t.cx, g, zc, 90); kit.ground = g; }
    const gs = mat('#857a6c', Surface.Stone, Stone.Ashlar, 0.65);
    k.prism(rect(10.2, gap), -2, 11.2, gs, gs);
    for (const sgn of [1, -1]) {
      const o: V3 = [sgn * 5.1, 0, 0], u: V3 = [0, 0, -sgn];
      k.plate(o, u, [0, 1, 0], arch(6.2, 9.0, 'pointed', 4.2), band, 0.04);
      k.plate(o, u, [0, 1, 0], arch(5.0, 8.4, 'pointed', 3.4), OPENING, 0.07);
    }
    const merlons = Math.floor(gap / 1.6);
    for (const sx of [-1, 1])
      for (let m = 0; m < merlons; m++) {
        const z = -gap / 2 + 0.6 + (m * (gap - 1.2)) / Math.max(1, merlons - 1);
        k.box(sx * 4.8, z, 0.6, 0.9, 11.2, 12.6, gs, band);
      }
  },
};
