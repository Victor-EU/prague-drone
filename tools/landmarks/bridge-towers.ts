// The bridge towers of Charles Bridge (design.md §7.1; rebuilt in M12 with the parts of
// ornament.ts). The Old Town Bridge Tower and the taller of the Lesser Town towers are the same
// Gothic type: a square body of sandstone (blackened on the Old Town side, pale and rough on the
// Lesser Town side) on a moulded plinth, string courses, blind tracery panels with their mullions
// in the upper third, a corbelled gallery with a pierced parapet, four corner turrets with
// crocketed spires and gilded finials, a steep slate roof with lucarnes between two finials, and
// the pointed gate the bridge runs through in two moulded rings. The Old Town tower's east face
// carries its sculpture: a band of shields over the gate, the two seated kings and St Vitus in
// canopied niches between pinnacled buttresses, and two saints in niches above. The lower Judith
// tower has a tall hipped roof with a Renaissance gable; the gate between the two is crenellated.
// All sit on their OSM footprints. The generator also serves the Powder Tower and the Old Town
// Hall tower (old-town.ts).

import { Kit, mat, shade, rect, arch, offsetRing, orientedRect, PROFILE, type Mat, type V2, type V3 } from './kit.ts';
import { pinnacle, traceryWindow, surround, corbels, crenellation, balustrade, niche, shields, onPlane, type StatueKind } from './ornament.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass } from '../../src/core/buildings.ts';

const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const OPENING = mat('#15130f', Surface.Opening);
const DARK = mat('#1b1916', Surface.Opening);
const WINDOW = mat('#1c1f22', Surface.Glass, Glass.Plain);
const IRON = mat('#2a2a2a', Surface.Plain);
const STATUE = mat('#3a3531', Surface.Stone, Stone.Render, 0.3);
const SHIELD = mat('#7a4a3c', Surface.Stone, Stone.Render, 0.2);

export interface TowerSpec {
  /** Body along local x (the bridge) and z. */
  w: number; d: number;
  /** Heights above the ground: top of the body, of the gallery's parapet, of the roof. */
  body: number; gallery: number; roofTop: number;
  /** Length of the roof's ridge, along x. */
  ridge: number;
  turret: { r: number; shaft: number; spire: number; sides?: number };
  /** The band of blind tracery panels, from y0 to y1, and how many to a face (by its length if not given). */
  tracery: [number, number];
  panels?: number;
  /** The pointed passage through the faces along x, if the bridge runs through the tower. */
  gate?: { w: number; h: number };
  stone: Mat; roof: Mat;
  /** The paler stone of the mouldings, tracery and turrets' caps; a shade lighter than the body if not given. */
  dressing?: Mat;
  /** String courses, heights above the ground. */
  strings?: number[];
  /** Small windows on the faces along x, heights above the ground. */
  windows?: number[];
  /** The gallery's parapet. */
  parapet?: 'pierced' | 'crenellated' | 'balustrade';
  /** The face (local +x or −x) that carries the sculpture: shields, niches, buttresses and saints. */
  sculpted?: 1 | -1;
  /** Lucarnes on the roof's long sides. */
  lucarnes?: boolean;
}

/** A Gothic tower in the current frame (origin at the ground, centre of the body). */
export function gothicTower(k: Kit, d: Kit, f: Kit, t: TowerSpec) {
  const dressing = t.dressing ?? { ...shade(t.stone, 1.14), w: Math.min(0.5, t.stone.w) };
  const dark = { ...shade(t.stone, 0.72), w: 1 };
  const blind = { ...shade(t.stone, 0.62), style: Stone.Render, w: Math.min(1, t.stone.w + 0.2) };
  const body = rect(t.w, t.d), up: V3 = [0, 1, 0];
  const gateH = t.gate?.h ?? 8.3;
  const strings = t.strings ?? [gateH + 1.6, t.tracery[0] - 0.7];
  const ring = (y: number, r: V2[]): V3[] => r.map(([x, z]) => [x, y, z] as V3);
  k.prism(body, -2, t.body, t.stone, null);
  k.sweep(ring(-0.6, body), PROFILE.plinth(0.32, 1.8), dressing, { closed: true });
  for (const y of strings) k.sweep(ring(y, body), PROFILE.string(0.24, 0.42), dressing, { closed: true });
  // The faces: origin at the ground under the face's middle, u to the right as seen from outside.
  const faces: { o: V3; u: V3; len: number; n: V2; x: boolean; sgn: number }[] = [
    { o: [0, 0, t.d / 2], u: [1, 0, 0], len: t.w, n: [0, 1], x: false, sgn: 1 },
    { o: [0, 0, -t.d / 2], u: [-1, 0, 0], len: t.w, n: [0, -1], x: false, sgn: -1 },
    { o: [t.w / 2, 0, 0], u: [0, 0, -1], len: t.d, n: [1, 0], x: true, sgn: 1 },
    { o: [-t.w / 2, 0, 0], u: [0, 0, 1], len: t.d, n: [-1, 0], x: true, sgn: -1 },
  ];
  // Blind tracery panels round the upper third: pointed, two lights, their mullions in the fine kit.
  const th = t.tracery[1] - t.tracery[0];
  for (const fc of faces) {
    const sculpted = t.sculpted !== undefined && fc.x && fc.sgn === t.sculpted;
    const count = t.panels ?? Math.max(2, Math.round(fc.len / 2.7)), step = (fc.len - 1.1) / count, pw = Math.min(step * (t.panels ? 0.62 : 0.7), th * 0.42);
    for (let i = 0; i < count; i++) {
      const a = (i - (count - 1) / 2) * step;
      if (sculpted && Math.abs(a) < 2.3) continue;
      traceryWindow(k, f, fc.o, fc.u, up, a, t.tracery[0], pw, th, dressing, blind, { lights: 2, proud: 0.14, depth: 0.22, rise: pw * 0.72 });
    }
  }
  // Gate: a pointed opening through both faces along x, in two moulded rings, the outer one wider.
  if (t.gate) for (const fc of faces.filter((q) => q.x)) {
    const gw = t.gate.w, gh = t.gate.h, v: V3 = [fc.sgn, 0, 0];
    k.plate(fc.o, fc.u, up, arch(gw, gh, 'pointed', gw * 0.62), OPENING, 0.06);
    const ringPath = (w: number, h: number): V3[] => { const s = arch(w, h, 'pointed', w * 0.62); return [[-w / 2, 0], ...s.slice(2).reverse(), [w / 2, 0]].map(([x, y]) => onPlane(fc.o, fc.u, up, x, y)); };
    k.sweep(ringPath(gw, gh), PROFILE.ring(0.55, 0.2), dressing, { v });
    f.sweep(ringPath(gw + 1.1, gh + 0.55), PROFILE.ring(0.32, 0.12), dressing, { v });
  }
  // Small windows up the faces along x, in stone surrounds.
  for (const fc of faces.filter((q) => q.x)) for (const y of t.windows ?? [gateH + 3.2, gateH + 6.4]) {
    const sculpted = t.sculpted !== undefined && fc.sgn === t.sculpted;
    if (sculpted) continue;
    k.plate(onPlane(fc.o, fc.u, up, 0, y), fc.u, up, [[-0.45, 0], [0.45, 0], [0.45, 1.6], [-0.45, 1.6]], WINDOW, 0.05);
    surround(f, fc.o, fc.u, up, 0, y, 0.9, 1.6, dressing, { proud: 0.08, depth: 0.16 });
  }
  // The sculpted face: shields over the gate, niches with the kings and saints between buttresses.
  if (t.sculpted !== undefined && t.gate) {
    const fc = faces.find((q) => q.x && q.sgn === t.sculpted)!;
    shields(f, fc.o, fc.u, up, 0, gateH + 1.9, 9, Math.min(0.9, (fc.len - 1.6) / 9), 0.56, 0.72, SHIELD, dressing);
    const y1 = strings[0] + 0.9, nh = strings[1] - y1 - 1.6;
    const figures: [number, StatueKind, number, number][] = [[-2.85, 'seated', 0, 3], [0, 'single', 0.4, 4], [2.85, 'seated', 0, 5]];
    for (const [a, kind, dy, seed] of figures) niche(k, f, d, fc.o, fc.u, up, a, y1 + dy, kind === 'single' ? 1.9 : 1.75, nh - dy, 0.32, dressing, DARK, { figure: kind, figureM: STATUE, seed, halo: kind === 'single' ? GOLD : undefined });
    for (const a of [-4.35, -1.45, 1.45, 4.35]) {
      const y0 = strings[0] + 0.42, yTop = t.tracery[0] - 0.3;
      k.slab(onPlane(fc.o, fc.u, up, a, y0, 0.3), fc.u, up, [[-0.36, 0], [0.36, 0], [0.36, yTop - y0], [-0.36, yTop - y0]], 0.3, dressing);
      const p = onPlane(fc.o, fc.u, up, a, yTop, 0.15);
      pinnacle(k, f, p[0], p[2], p[1], p[1] + 1.3, p[1] + 3.4, 0.3, dressing, { sides: 4, crockets: true });
    }
    const y2 = t.tracery[0] + 0.5, h2 = Math.min(4.8, th - 1.2);
    for (const [a, seed] of [[-1.25, 6], [1.25, 7]] as const) niche(k, f, d, fc.o, fc.u, up, a, y2, 1.6, h2, 0.3, dressing, DARK, { figure: 'single', figureM: STATUE, seed, halo: GOLD });
  }
  // Corbelled gallery and its parapet; the roof sits on the parapet's cap.
  const gal = offsetRing(body, 0.6);
  corbels(f, ring(t.body - 1.15, offsetRing(body, 0.02)), dressing, { step: 1.15, w: 0.46, h: 1.05, out: 0.56, closed: true });
  k.loft(body, t.body - 1.1, gal, t.body, dark);
  const parapet = t.parapet ?? 'pierced';
  if (parapet === 'balustrade') balustrade(f, ring(t.body, gal), dressing, { h: t.gallery - t.body, closed: true, posts: true, w: 0.34 });
  else if (parapet === 'crenellated') {
    k.prism(gal, t.body, t.body + 0.8, t.stone, dressing);
    crenellation(k, ring(t.body + 0.8, gal), dressing, { w: 0.9, gap: 0.62, h: t.gallery - t.body - 0.8, depth: 0.55, closed: true });
  } else {
    k.prism(gal, t.body, t.gallery, t.stone, dressing);
    k.sweep(ring(t.gallery - 0.28, gal), PROFILE.string(0.14, 0.28), dressing, { closed: true });
    for (const fc of faces) {
      const n = Math.max(5, Math.round(fc.len / 0.95)), step = (fc.len + 0.6) / n;
      const o: V3 = [fc.o[0] + fc.n[0] * 0.6, t.body + 0.35, fc.o[2] + fc.n[1] * 0.6];
      f.row(o, fc.u, up, arch(0.34, 0.95, 'pointed', 0.3), OPENING, n, step, 0, 0.04);
    }
  }
  // Corner turrets with crocketed needle spires and gilded finials.
  for (const [x, z] of offsetRing(body, 0.25)) {
    pinnacle(k, f, x, z, t.body - 3.5, t.turret.shaft, t.turret.spire, t.turret.r, t.stone, { sides: t.turret.sides ?? 8, spire: t.roof, cap: dressing, crockets: true });
    d.lathe(x, z, [[0.05, t.turret.spire - 0.2], [0.04, t.turret.spire + 1.4]], 4, IRON);
    d.ball(x, t.turret.spire + 0.9, z, 0.2, GOLD, 6);
  }
  // The steep roof: hipped with a short ridge along x.
  const rd = t.d - 0.8, rw = Math.min(t.w - 0.8, rd + t.ridge);
  const pitch = (Math.atan((t.roofTop - t.gallery) / (rd / 2)) * 180) / Math.PI;
  k.roof(rect(rw, rd), t.gallery, { shape: 'hipped', pitch, cap: 99, gable: () => false }, t.roof, t.roof);
  // Gilded finials at the ends of the ridge, and lucarnes on each long side with their own.
  for (const sx of [-1, 1]) {
    const x = (sx * (rw - rd)) / 2;
    d.lathe(x, 0, [[0.07, t.roofTop - 0.3], [0.05, t.roofTop + 3.4]], 4, IRON);
    d.ball(x, t.roofTop + 2.4, 0, 0.36, GOLD, 8);
    d.ball(x, t.roofTop + 3.2, 0, 0.18, GOLD, 6);
  }
  if (t.lucarnes ?? true) for (const sz of [-1, 1]) {
    const y = t.gallery + (t.roofTop - t.gallery) * 0.3, z = sz * (rd / 2) * 0.7;
    k.box(0, z, 1.0, 1.0, y - 0.6, y + 0.9, t.stone, null);
    k.pyramid(rect(1.2, 1.2, 0, z), y + 0.9, y + 2.1, t.roof);
    k.plate([0, y - 0.2, z + sz * 0.5], [sz, 0, 0], up, [[-0.3, 0], [0.3, 0], [0.3, 0.8], [-0.3, 0.8]], WINDOW, 0.03);
    d.lathe(0, z, [[0.04, y + 2.0], [0.03, y + 2.9], [0, y + 3.0]], 4, IRON);
    d.ball(0, y + 2.75, z, 0.14, GOLD, 6);
  }
}

/** Places the given kits on an OSM footprint: origin at its centre on the bare ground, local x along the rectangle's axis nearest `bearingNear`. */
export function placeOn(kits: Kit[], site: Site, key: string, bearingNear?: number) {
  const r = orientedRect(site.feature(key)!.polygons[0].outer);
  let b = r.bearing, w = r.w, dd = r.d;
  if (bearingNear !== undefined) {
    const diff = (a: number) => Math.abs(((a - bearingNear + 540) % 360) - 180);
    if (Math.min(diff(b + 90), diff(b - 90)) < Math.min(diff(b), diff(b + 180))) { b += 90; [w, dd] = [dd, w]; }
    if (diff(b + 180) < diff(b)) b += 180;
  }
  const g = site.bare(r.cx, r.cz);
  for (const kit of kits) { kit.place(r.cx, g, r.cz, b); kit.ground = g; }
  return { ...r, w, d: dd, bearing: b, g };
}

export const oldTownBridgeTower: Model = {
  id: 'old-town-bridge-tower',
  floodlit: true,
  build(site, k, d, f) {
    k.seed = 31; d.seed = 31; f.seed = 32;
    const r = placeOn([k, d, f], site, 'way/93479848', 103);
    gothicTower(k, d, f, {
      w: r.w, d: r.d, body: 26.6, gallery: 28.3, roofTop: 43.2, ridge: 3.2,
      turret: { r: 0.72, shaft: 30.4, spire: 37.6 }, tracery: [19.4, 25.6], gate: { w: 5.4, h: 8.8 },
      strings: [11.6, 18.4], windows: [13.4, 16.2],
      stone: mat('#4b433c', Surface.Stone, Stone.Ashlar, 0.95), dressing: mat('#7b7063', Surface.Stone, Stone.Ashlar, 0.5),
      roof: mat('#3d4145', Surface.Metal, Metal.Slate), sculpted: 1, parapet: 'pierced',
    });
  },
};

export const lesserTownBridgeTowers: Model = {
  id: 'lesser-town-bridge-towers',
  floodlit: true,
  replaces: ['way/389652950', 'way/460016966', 'way/460016964', 'way/460016965', 'way/482310118', 'way/389652949'],
  build(site, k, d, f) {
    k.seed = 37; d.seed = 37; f.seed = 38;
    // The tall Gothic tower, in pale rough ashlar.
    const t = placeOn([k, d, f], site, 'way/389652949', 90);
    const stone = mat('#978b7c', Surface.Stone, Stone.Ashlar, 0.3), dressing = mat('#aa9f91', Surface.Stone, Stone.Ashlar, 0.2);
    gothicTower(k, d, f, {
      w: t.w, d: t.d, body: 26.2, gallery: 27.9, roofTop: 44.8, ridge: 2.4,
      turret: { r: 0.8, shaft: 30.2, spire: 38.5 }, tracery: [17.8, 25], strings: [9.5, 16.9], windows: [11.2, 14.2], panels: 2,
      stone, dressing, roof: mat('#383c41', Surface.Metal, Metal.Slate), parapet: 'pierced',
    });
    const tallSouth = t.cz + t.d / 2;
    // The Judith tower: rubble walls under a tall hipped roof, a Renaissance gable facing the bridge.
    const j = placeOn([k, d, f], site, 'way/389652950', 90);
    const rubble = mat('#8e8474', Surface.Stone, Stone.Rubble, 0.55), roof = mat('#586059', Surface.Metal, Metal.Slate);
    const band = mat('#9c9180', Surface.Stone, Stone.Ashlar, 0.4);
    k.prism(rect(j.w, j.d), -2, 16.4, rubble, band);
    k.sweep(rect(j.w, j.d).map(([x, z]) => [x, 16.0, z] as V3), PROFILE.cornice(0.4, 0.45), band, { closed: true });
    const jw = j.w - 0.6, jd = j.d - 0.4;
    const jh = k.roof(rect(jw, jd), 16.4, { shape: 'hipped', pitch: 72, cap: 99, gable: () => false }, roof, roof);
    // The gable on the east face (local +x): three storeys stepping in, scrolls at the steps, a
    // small pediment on top, obelisk finials; two windows in surrounds.
    const gx = j.w / 2 - 0.4, u: V3 = [0, 0, -1], up: V3 = [0, 1, 0], go: V3 = [gx + 0.3, 16.4, 0];
    const gable: V2[] = [[-2.3, 0], [2.3, 0], [2.3, 2.6], [1.7, 2.6], [1.7, 2.9], [1.5, 2.9], [1.5, 4.4], [0.9, 4.4], [0.9, 4.7], [0.7, 4.7], [0.7, 5.6], [0, 6.4], [-0.7, 5.6], [-0.7, 4.7], [-0.9, 4.7], [-0.9, 4.4], [-1.5, 4.4], [-1.5, 2.9], [-1.7, 2.9], [-1.7, 2.6], [-2.3, 2.6]];
    k.slab(go, u, up, gable, 1.5, band);
    for (const [a, y, w2] of [[2.3, 0, 2.6], [1.5, 2.9, 1.5], [0.7, 4.7, 0.9]] as const) for (const s of [-1, 1]) {
      // A scroll: a quarter disc leaning against the step.
      const q: V2[] = [[0, 0], [s * w2 * 0.35, 0]];
      for (let i = 1; i <= 5; i++) { const ang = (i / 5) * Math.PI / 2; q.push([s * w2 * 0.35 * Math.cos(ang), w2 * 0.35 * Math.sin(ang)]); }
      f.slab(onPlane(go, u, up, s * a, y, 0.05), u, up, q, 0.9, band);
      void s;
    }
    for (const [a, y] of [[2.3, 2.6], [1.5, 4.4], [-2.3, 2.6], [-1.5, 4.4]] as const) { const p = onPlane(go, u, up, a, y, -0.7); f.lathe(p[0], p[2], [[0.16, p[1]], [0.1, p[1] + 1.0], [0, p[1] + 1.4]], 4, band, { flat: true, phase: 45 }); }
    for (const z of [-0.9, 0.9]) { k.plate(onPlane(go, u, up, z, 0.8, 0), u, up, [[-0.35, 0], [0.35, 0], [0.35, 1.2], [-0.35, 1.2]], WINDOW, 0.04); surround(f, go, u, up, z, 0.8, 0.7, 1.2, band, { proud: 0.08, depth: 0.14 }); }
    k.plate(onPlane(go, u, up, 0, 3.2, 0), u, up, [[-0.3, 0], [0.3, 0], [0.3, 0.9], [-0.3, 0.9]], WINDOW, 0.04);
    for (const sz of [-1, 1]) d.lathe(0, (sz * Math.max(0, jd - jw)) / 2, [[0.08, 16.4 + jh - 0.3], [0.05, 16.4 + jh + 3.2]], 4, IRON);
    const jo: V3 = [j.w / 2, 0, 0];
    for (const y of [5, 10]) for (const x of [-2.5, 2.5]) { k.plate(onPlane(jo, u, up, x, y), u, up, [[-0.5, 0], [0.5, 0], [0.5, 1.4], [-0.5, 1.4]], WINDOW, 0.05); surround(f, jo, u, up, x, y, 1.0, 1.4, band, { proud: 0.08, depth: 0.15 }); }
    // The gate between them: a pointed passage in a moulded ring under a crenellated top.
    const g = site.bare(t.cx, (tallSouth + j.cz - j.d / 2) / 2);
    const z0 = j.cz - j.d / 2, z1 = t.cz - t.d / 2; // world z of the two facing walls
    const zc = (z0 + z1) / 2, gap = Math.abs(z1 - z0) + 1.0;
    for (const kit of [k, d, f]) { kit.place(t.cx, g, zc, 90); kit.ground = g; }
    const gs = mat('#857a6c', Surface.Stone, Stone.Ashlar, 0.65);
    k.prism(rect(10.2, gap), -2, 11.2, gs, gs);
    for (const sgn of [1, -1]) {
      const o: V3 = [sgn * 5.1, 0, 0], gu: V3 = [0, 0, -sgn];
      k.plate(o, gu, up, arch(5.0, 8.4, 'pointed', 3.4), OPENING, 0.07);
      const s = arch(5.0, 8.4, 'pointed', 3.4);
      k.sweep([[-2.5, 0], ...s.slice(2).reverse(), [2.5, 0]].map(([x, y]) => onPlane(o, gu, up, x, y)), PROFILE.ring(0.6, 0.18), band, { v: [sgn, 0, 0] });
    }
    k.sweep(rect(10.2, gap).map(([x, z]) => [x, 10.9, z] as V3), PROFILE.string(0.18, 0.3), band, { closed: true });
    for (const sx of [-1, 1]) crenellation(k, [[sx * 4.85, 11.2, -gap / 2 + 0.3], [sx * 4.85, 11.2, gap / 2 - 0.3]], gs, { w: 1.0, gap: 0.9, h: 1.4, depth: 0.55, cap: band });
  },
};
