// The Castle's neighbours and Hradčany (design.md §7.1, M15): St George's basilica with its two
// slender white Romanesque towers under steep dark pyramids and its red Baroque front; the Black
// Tower at the east gate, Daliborka and the Powder Tower (Mihulka) as round towers under conical
// roofs, All Saints' church behind the Old Royal Palace; Loreta's front with the clock tower under
// its copper onion and the Santa Casa in its court; and the Černín palace's 150 m front with its
// thirty colossal half-columns on a rusticated base.

import { Kit, mat, rect, ngon, arch, orientedRect, PROFILE, type V2, type V3 } from './kit.ts';
import { pilaster, entablature, traceryWindow, statue, balustrade, column } from './ornament.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Metal, Glass, Style } from '../../src/core/buildings.ts';
import { buildParts, COPPER } from './parts.ts';
import { parseLength } from '../lib/osm.ts';

const UP: V3 = [0, 1, 0];
const GOLD = mat('#c9a34a', Surface.Metal, Metal.Gold);
const SLATE = mat('#3a3d42', Surface.Metal, Metal.Slate);
const TILES = mat('#a4634a', Surface.Roof);
const WINDOW = mat('#232629', Surface.Glass, Glass.Plain);
const DARK = mat('#1b1a18', Surface.Opening);
const WHITE = mat('#e9e3d8', Surface.Stone, Stone.Render, 0.15);

/** A local ring from a feature's outer ring in the kit's frame at ground g. */
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
/** The longest edge of a ring whose outward normal points roughly along (nx, nz). */
function face(r: V2[], nx: number, nz: number) {
  let best: { a: V2; b: V2; n: V2; len: number } | null = null;
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], n = edgeNormal(r, i), len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (n[0] * nx + n[1] * nz < 0.7) continue;
    if (!best || len > best.len) best = { a, b, n, len };
  }
  return best;
}
function place(kits: Kit[], site: Site, key: string, bearing = 90) {
  const r = orientedRect(site.feature(key)!.polygons[0].outer);
  const g = site.bare(r.cx, r.cz);
  for (const kit of kits) { kit.place(r.cx, g, r.cz, bearing); kit.ground = g; }
  return { ...r, g };
}

// ---- St George's basilica -------------------------------------------------------------------------

export const stGeorge: Model = {
  id: 'st-george',
  unnamed: true,
  floodlit: true,
  replaces: ['relation/3372132', 'relation/13847530', 'way/456778885', 'way/456778886', 'way/456778887', 'way/480145478', 'way/480145479', 'way/480145480', 'way/480145481', 'way/1034784278', 'way/1034784279'],
  build(site, k, d, f) {
    k.seed = 131; d.seed = 132; f.seed = 133;
    // Local +x runs up the axis from the Baroque front (on St George's Square) to the towers and the apse.
    const r = place([k, d, f], site, 'relation/3372132', 66);
    const g = r.g;
    const ASHLAR = mat('#eee8d9', Surface.Stone, Stone.Ashlar, 0.2), RED = mat('#b04d3c', Surface.Stone, Stone.Render, 0.15);
    const outline = ringOf(k, site, 'relation/3372132', g), nave = ringOf(k, site, 'relation/13847530', g);
    let xW = Infinity, xE = -Infinity, zMin = Infinity, zMax = -Infinity;
    for (const [x, z] of outline) { xW = Math.min(xW, x); xE = Math.max(xE, x); zMin = Math.min(zMin, z); zMax = Math.max(zMax, z); }
    // Aisles and chapels: the outline to 11 m under a low tiled roof; the nave higher under its own steep roof.
    k.prism(outline, -2, 11, ASHLAR, null);
    k.roof(outline, 11, { shape: 'hipped', pitch: 36, cap: 99, gable: () => false }, TILES, ASHLAR);
    k.prism(nave, -2, 16, ASHLAR, null);
    k.roof(nave, 16, { shape: 'gabled', pitch: 52, cap: 99, gable: (_, len) => len < 12 }, TILES, ASHLAR);
    k.sweep(at(nave, 15.4), PROFILE.string(0.25, 0.4), WHITE, { closed: true });
    // Round-headed windows along the nave's clerestory and the aisles.
    for (let i = 0; i < nave.length; i++) {
      const a = nave[i], b = nave[(i + 1) % nave.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 12) continue;
      const n = edgeNormal(nave, i), u: V3 = [n[1], 0, -n[0]], mid: V3 = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
      const count = Math.floor((len - 4) / 4.5);
      for (let q = 0; q < count; q++) traceryWindow(k, f, mid, u, UP, (q - (count - 1) / 2) * 4.5, 12.2, 1.1, 2.6, WHITE, WINDOW, { kind: 'round', lights: 1, proud: 0.1, depth: 0.2 });
    }
    // The two towers: white ashlar, paired round-headed openings on the top stages, steep dark pyramids.
    for (const key of ['way/456778886', 'way/456778887']) {
      const ring = ringOf(k, site, key, g), rr = orientedRect(site.feature(key)!.polygons[0].outer);
      const h = parseLength(site.feature(key)!.tags.height) ?? 40, roofH = parseLength(site.feature(key)!.tags['roof:height']) ?? 12;
      const body = h - roofH + 1;
      k.prism(ring, -2, body, ASHLAR, null);
      for (const y of [body * 0.42, body * 0.62, body * 0.82]) k.sweep(at(ring, y), PROFILE.string(0.2, 0.35), WHITE, { closed: true });
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (len < 3) continue;
        const n = edgeNormal(ring, i), u: V3 = [n[1], 0, -n[0]], mid: V3 = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
        for (const y of [body * 0.66, body * 0.85]) for (const dx of [-0.9, 0.9]) k.plate([mid[0] + u[0] * dx, y, mid[2] + u[2] * dx], u, UP, arch(1.0, 2.4, 'round'), DARK, 0.04);
        k.plate(mid, u, UP, arch(0.8, 1.8, 'round').map(([x, y]) => [x, y + body * 0.46] as V2), DARK, 0.04);
      }
      const c: V2 = [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length];
      const s = Math.min(rr.w, rr.d), R = (s / 2) * Math.SQRT2;
      const phase = rr.bearing - 66;
      k.lathe(c[0], c[1], [[R * 1.06, body], [R * 1.02, body + 0.4], [0.08, body + roofH + 2.5], [0, body + roofH + 3]], 4, SLATE, { flat: true, phase: phase + 45 });
      d.ball(c[0], body + roofH + 3.3, c[1], 0.3, GOLD, 6);
      d.beam([c[0], body + roofH + 3.3, c[1]], [c[0], body + roofH + 4.6, c[1]], 0.1, GOLD);
    }
    // The Baroque front on the square: red render with cream dressings, a volute gable over the
    // nave, pilasters, a portal, statues on the cornice.
    const fx = xW - 0.6, W = zMax - zMin, zc = (zMin + zMax) / 2, u: V3 = [0, 0, 1];
    k.prism([[fx, zMin], [xW + 0.4, zMin], [xW + 0.4, zMax], [fx, zMax]], -2, 12.5, RED, WHITE);
    entablature(k, [[fx, 11, zMax], [fx, 11, zMin]], WHITE, { out: 0.55, h: 1.3 });
    const gw = Math.min(W * 0.62, 16);
    const gable: V2[] = [[-gw / 2, 0], [gw / 2, 0], [gw / 2, 2.2], [gw * 0.34, 3.2], [gw * 0.3, 6.5], [gw * 0.16, 7.6], [gw * 0.12, 9.5], [0, 10.2], [-gw * 0.12, 9.5], [-gw * 0.16, 7.6], [-gw * 0.3, 6.5], [-gw * 0.34, 3.2], [-gw / 2, 2.2]];
    k.slab([fx, 12.5, zc], u, UP, gable, 1.2, RED, RED);
    k.sweep(gable.slice(1).map(([a, b]) => [fx, 12.5 + b, zc + a] as V3), PROFILE.ring(0.4, 0.28), WHITE, { v: [-1, 0, 0], caps: true });
    for (const dz of [-W * 0.4, -W * 0.14, W * 0.14, W * 0.4]) pilaster(k, [fx, 0, zc], u, UP, dz, 0.6, 11, 1.1, 0.3, WHITE, { capH: 0.8, baseH: 0.5 });
    for (const dz of [-gw * 0.22, gw * 0.22]) pilaster(k, [fx, 12.5, zc], u, UP, dz, 0, 6.2, 0.9, 0.3, WHITE, { capH: 0.6, baseH: 0.4 });
    traceryWindow(k, f, [fx, 0, zc], u, UP, 0, 0, 2.6, 5.2, WHITE, DARK, { kind: 'round', lights: 1, proud: 0.18, depth: 0.36 });
    k.plate([fx, 15.6, zc], u, UP, ngon(12, 1.1), WINDOW, 0.05);
    for (const dz of [-W * 0.27, W * 0.27]) traceryWindow(k, f, [fx, 0, zc], u, UP, dz, 6.2, 1.5, 3.4, WHITE, WINDOW, { kind: 'round', lights: 1 });
    for (const dz of [-W * 0.4, -W * 0.14, W * 0.14, W * 0.4]) statue(d, [fx - 0.3, 12.5, zc + dz], [-1, 0], 2.3, mat('#b7ab98', Surface.Stone, Stone.Render, 0.3), 'single', 140 + Math.round(dz));
    statue(d, [fx - 0.2, 22.7, zc], [-1, 0], 1.6, mat('#b7ab98', Surface.Stone, Stone.Render, 0.3), 'single', 149);
    // The chapel of St John Nepomuk on the corner, under a small copper dome.
    const ch = ringOf(k, site, 'way/1034784279', g), cc: V2 = [ch.reduce((s, p) => s + p[0], 0) / ch.length, ch.reduce((s, p) => s + p[1], 0) / ch.length];
    k.lathe(cc[0], cc[1], [[2.6, 11], [2.6, 13.2]], 8, RED, { flat: true });
    k.lathe(cc[0], cc[1], [[2.9, 13.2], [2.6, 14.2], [1.6, 15.4], [0.5, 16.2], [0, 16.4]], 12, COPPER);
    d.ball(cc[0], 16.8, cc[1], 0.25, GOLD, 6);
    k.light([r.cx, g + 12, r.cz], 1);
  },
};

// ---- The east gate and the round towers ----------------------------------------------------------

export const castleTowers: Model = {
  id: 'castle-towers',
  unnamed: true,
  floodlit: true,
  replaces: ['relation/3367850', 'way/422194036', 'way/422194037', 'relation/3367848', 'relation/3367566', 'relation/3372133'],
  build(site, k, d, f) {
    k.seed = 134; d.seed = 135; f.seed = 136;
    const STONE = mat('#5e5850', Surface.Stone, Stone.Ashlar, 0.9), PALE = mat('#d9cdb4', Surface.Stone, Stone.Render, 0.3);
    // The Black Tower: a dark ashlar tower under a steep tiled roof, the gate house beside it.
    {
      const r = place([k, d, f], site, 'relation/3367850', 90);
      buildParts(site, k, ['way/422194036', 'way/422194037'], r.g, { wall: STONE, roof: () => TILES });
      const t = ringOf(k, site, 'way/422194037', r.g);
      for (const y of [12, 22]) k.sweep(at(t, y), PROFILE.string(0.2, 0.35), mat('#7d7266', Surface.Stone, Stone.Ashlar, 0.5), { closed: true });
      for (let i = 0; i < t.length; i++) {
        const a = t[i], b = t[(i + 1) % t.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (len < 5) continue;
        const n = edgeNormal(t, i), u: V3 = [n[1], 0, -n[0]], mid: V3 = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
        k.plate(mid, u, UP, arch(1.2, 2.2, 'pointed').map(([x, y]) => [x, y + 20] as V2), DARK, 0.04);
        k.plate(mid, u, UP, arch(0.9, 1.6, 'flat').map(([x, y]) => [x, y + 14] as V2), DARK, 0.04);
      }
      k.light([r.cx, r.g + 15, r.cz], 1);
    }
    // Daliborka and Mihulka: round towers of pale render under conical roofs.
    for (const [key, h, rh] of [['relation/3367848', 14, 8], ['relation/3367566', 24, 12]] as [string, number, number][]) {
      const r = place([k, d, f], site, key, 90);
      const R = Math.min(r.w, r.d) / 2;
      k.lathe(0, 0, [[R, -2], [R, h]], 16, PALE);
      k.sweep(ngon(16, R).map(([x, z]) => [x, h - 0.6, z] as V3), PROFILE.string(0.25, 0.45), mat('#a89b86', Surface.Stone, Stone.Ashlar, 0.5), { closed: true });
      k.lathe(0, 0, [[R * 1.12, h], [R * 1.08, h + 0.5], [0.1, h + rh], [0, h + rh + 0.4]], 16, TILES, { flat: true });
      for (let q = 0; q < 4; q++) { const a = (q * Math.PI) / 2 + Math.PI / 4; k.plate([R * Math.cos(a), h * 0.6, R * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], UP, arch(0.7, 1.3, 'flat'), DARK, 0.04); }
      d.ball(0, h + rh + 0.7, 0, 0.25, GOLD, 6);
    }
    // All Saints: the collegiate church behind the Old Royal Palace, under a steep roof with a turret.
    {
      const r = place([k, d, f], site, 'relation/3372133', 66);
      const ring = ringOf(k, site, 'relation/3372133', r.g);
      k.prism(ring, -2, 14, PALE, null);
      const top = k.roof(ring, 14, { shape: 'gabled', pitch: 55, cap: 99, gable: (_, len) => len < 16 }, SLATE, PALE);
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (len < 10) continue;
        const n = edgeNormal(ring, i), u: V3 = [n[1], 0, -n[0]], mid: V3 = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
        const count = Math.floor((len - 3) / 5);
        for (let q = 0; q < count; q++) traceryWindow(k, f, mid, u, UP, (q - (count - 1) / 2) * 5, 4.5, 1.8, 6.5, mat('#a89b86', Surface.Stone, Stone.Ashlar, 0.5), mat('#8a8274', Surface.Glass, Glass.Tracery), { lights: 2, rise: 1.3 });
      }
      k.lathe(0, 0, [[0.9, 14 + top - 1.5], [0.9, 14 + top + 2.5], [1.15, 14 + top + 2.8], [0, 14 + top + 6.5]], 6, SLATE, { flat: true });
      d.ball(0, 14 + top + 6.8, 0, 0.22, GOLD, 6);
    }
  },
};

// ---- Loreta ---------------------------------------------------------------------------------------

export const loreta: Model = {
  id: 'loreta',
  unnamed: true,
  floodlit: true,
  replaces: ['way/42743295', 'way/28550218', 'way/28550219', 'way/477687439', 'way/477687440', 'way/477687441', 'way/477687442'],
  build(site, k, d, f) {
    k.seed = 137; d.seed = 138; f.seed = 139;
    const r = place([k, d, f], site, 'way/42743295', 90);
    const g = r.g;
    const WALL = mat('#e8dcc4', Surface.Wall, Style.Baroque), PLASTER = mat('#e8dcc4', Surface.Stone, Stone.Render, 0.15);
    const outline = ringOf(k, site, 'way/42743295', g);
    const holes = site.feature('way/42743295')!.polygons[0].holes.map((h) => { const out: V2[] = []; for (let i = 0; i < h.length; i += 2) { const l = k.local(h[i], g, h[i + 1]); out.push([l[0], l[2]]); } return out; });
    // The cloister ranges: two storeys under tiled roofs, windows in rows round the court.
    k.prism(outline, -2, 9.5, WALL, null, { windows: true, eave: g + 9.5 });
    for (const h of holes) k.prism(h, -2, 9.5, WALL, null, { windows: true, eave: g + 9.5, inward: true });
    k.roof(outline, 9.5, { shape: 'hipped', pitch: 40, cap: 5, gable: () => false }, TILES, PLASTER, holes);
    // The front on the square (west): a screen of two storeys with pilasters and a balustrade of
    // statues, the clock tower in the middle under its copper onion.
    const fc = face(outline, -1, 0);
    if (fc) {
      const { a, b, n } = fc, u: V3 = [n[1], 0, -n[0]], mid: V3 = [(a[0] + b[0]) / 2 + n[0] * 0.5, 0, (a[1] + b[1]) / 2 + n[1] * 0.5];
      const W = fc.len;
      k.prism([[a[0], a[1]], [b[0], b[1]], [b[0] + n[0] * 0.6, b[1] + n[1] * 0.6], [a[0] + n[0] * 0.6, a[1] + n[1] * 0.6]], -2, 13.5, PLASTER, PLASTER);
      entablature(k, [[b[0] + n[0] * 0.6, 12, b[1] + n[1] * 0.6], [a[0] + n[0] * 0.6, 12, a[1] + n[1] * 0.6]], WHITE, { out: 0.6, h: 1.4 });
      const count = Math.floor(W / 4.6);
      for (let q = 0; q < count; q++) {
        const off = (q - (count - 1) / 2) * 4.6;
        if (Math.abs(off) < 5) continue;
        traceryWindow(k, f, mid, u, UP, off, 7.2, 1.5, 3.2, WHITE, WINDOW, { kind: 'flat', lights: 1 });
        traceryWindow(k, f, mid, u, UP, off, 1.8, 1.5, 3.4, WHITE, WINDOW, { kind: 'round', lights: 1 });
        pilaster(k, mid, u, UP, off + 2.3, 0.5, 12, 0.9, 0.28, WHITE, { capH: 0.7, baseH: 0.4 });
      }
      balustrade(f, [[b[0] + n[0] * 0.5, 13.5, b[1] + n[1] * 0.5], [a[0] + n[0] * 0.5, 13.5, a[1] + n[1] * 0.5]], WHITE, { h: 1.1, w: 0.28, step: 0.36, posts: true });
      for (let q = 0; q < count; q += 2) { const off = (q - (count - 1) / 2) * 4.6; statue(d, [mid[0] + u[0] * off + n[0] * 0.2, 13.6, mid[2] + u[2] * off + n[1] * 0.2], [n[0], n[1]], 2.2, mat('#b7ab98', Surface.Stone, Stone.Render, 0.3), 'single', 160 + q); }
      // The tower: square over the middle of the front, stages under a cornice, the bell, the lantern, the onion.
      const tc: V2 = [mid[0] - n[0] * 3.6, mid[2] - n[1] * 3.6], s = 8.2;
      const ang = Math.atan2(n[1], n[0]) * 180 / Math.PI;
      k.push().at(tc[0], 0, tc[1], ang);
      const sq = rect(s, s);
      k.prism(sq, -2, 26, PLASTER, null);
      entablature(k, at(sq, 24.6), WHITE, { out: 0.7, h: 1.4, closed: true });
      k.sweep(at(sq, 16), PROFILE.string(0.25, 0.4), WHITE, { closed: true });
      for (let q = 0; q < 4; q++) {
        const aa = (q * Math.PI) / 2, nx = Math.cos(aa), nz = Math.sin(aa), uu: V3 = [nz, 0, -nx];
        traceryWindow(k, f, [nx * s / 2, 0, nz * s / 2], uu, UP, 0, 18.5, 2.2, 4.8, WHITE, DARK, { kind: 'round', lights: 1 });
        k.plate([nx * s / 2, 22.6, nz * s / 2], uu, UP, ngon(16, 1.1).map(([x, y]) => [x, y + 1.1] as V2), GOLD, 0.05);
        k.plate([nx * s / 2, 22.6, nz * s / 2], uu, UP, ngon(16, 0.9).map(([x, y]) => [x, y + 1.1] as V2), mat('#243a52', Surface.Plain), 0.08);
        pilaster(k, [nx * s / 2, 0, nz * s / 2], uu, UP, s * 0.38, 13.5, 24.6, 0.8, 0.3, WHITE, { capH: 0.7, baseH: 0.4 });
        pilaster(k, [nx * s / 2, 0, nz * s / 2], uu, UP, -s * 0.38, 13.5, 24.6, 0.8, 0.3, WHITE, { capH: 0.7, baseH: 0.4 });
      }
      const R = (s / 2) * Math.SQRT2;
      k.lathe(0, 0, [[R * 1.05, 26], [R, 26.6], [R * 0.7, 27.6], [R * 0.5, 28.4]], 4, COPPER, { flat: true, phase: 45 });
      k.lathe(0, 0, [[2.4, 28.3], [2.4, 32.4]], 8, PLASTER, { flat: true, phase: 22.5 });
      for (let q = 0; q < 8; q++) { const aa = (q * Math.PI) / 4 + Math.PI / 8, rr = 2.4 * Math.cos(Math.PI / 8); k.plate([rr * Math.cos(aa), 28.8, rr * Math.sin(aa)], [Math.sin(aa), 0, -Math.cos(aa)], UP, arch(1.1, 2.8, 'round'), DARK, 0.03); }
      entablature(k, ngon(8, 2.4, 22.5).map(([x, z]) => [x, 31.9, z] as V3), WHITE, { out: 0.5, h: 0.5, closed: true });
      k.lathe(0, 0, [[2.6, 32.4], [2.9, 33.4], [2.5, 34.8], [1.5, 36.2], [0.7, 37.2], [0.5, 38], [0.6, 38.5], [0, 39.2]], 12, COPPER);
      d.lathe(0, 0, [[0.06, 39], [0.05, 41.6]], 4, COPPER);
      d.ball(0, 40.2, 0, 0.35, GOLD, 6);
      d.box(0, 0, 0.1, 1.2, 40.7, 41.6, GOLD, GOLD);
      k.pop();
    }
    // The Santa Casa in the court: a stone box under a hipped roof, its walls dressed with pilasters.
    {
      const sc = ringOf(k, site, 'way/28550218', g);
      const ST = mat('#cbbfa6', Surface.Stone, Stone.Ashlar, 0.35);
      k.prism(sc, -1, 9.5, ST, null);
      entablature(k, at(sc, 8.3), WHITE, { out: 0.5, h: 1.2, closed: true });
      k.roof(sc, 9.5, { shape: 'hipped', pitch: 35, cap: 4, gable: () => false }, SLATE, ST);
      for (let i = 0; i < sc.length; i++) {
        const a = sc[i], b = sc[(i + 1) % sc.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (len < 5) continue;
        const n = edgeNormal(sc, i), u: V3 = [n[1], 0, -n[0]], mid: V3 = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
        const count = Math.floor(len / 3.2);
        for (let q = 0; q <= count; q++) pilaster(k, mid, u, UP, (q - count / 2) * (len / count) * 0.92, 0.4, 8.3, 0.7, 0.3, WHITE, { capH: 0.6, baseH: 0.3 });
      }
    }
    // The church of the Nativity on the east range: taller, under a steep roof with a ridge turret.
    {
      const ch = ringOf(k, site, 'way/28550219', g);
      k.prism(ch, -2, 12, PLASTER, null);
      const top = k.roof(ch, 12, { shape: 'hipped', pitch: 45, cap: 99, gable: () => false }, TILES, PLASTER);
      const c: V2 = [ch.reduce((s, p) => s + p[0], 0) / ch.length, ch.reduce((s, p) => s + p[1], 0) / ch.length];
      k.lathe(c[0], c[1], [[0.9, 12 + top - 1.5], [0.9, 12 + top + 2], [1.2, 12 + top + 2.3], [0.9, 12 + top + 3.2], [0.4, 12 + top + 4.2], [0, 12 + top + 5]], 8, COPPER);
      d.ball(c[0], 12 + top + 5.3, c[1], 0.2, GOLD, 6);
    }
    k.light([r.cx, g + 10, r.cz], 1);
  },
};

// ---- The Černín palace ---------------------------------------------------------------------------

export const cerninPalace: Model = {
  id: 'cernin-palace',
  unnamed: true,
  floodlit: true,
  replaces: ['relation/2403951', 'way/576304434'],
  build(site, k, d, f) {
    k.seed = 140; d.seed = 141; f.seed = 142;
    const r = place([k, d, f], site, 'relation/2403951', 90);
    const g = r.g;
    const WALL = mat('#e2d2b0', Surface.Wall, Style.Palace), PLASTER = mat('#e2d2b0', Surface.Stone, Stone.Render, 0.15), RUST = mat('#c9b995', Surface.Stone, Stone.Ashlar, 0.35);
    const outline = ringOf(k, site, 'relation/2403951', g);
    const holes = site.feature('relation/2403951')!.polygons[0].holes.map((h) => { const out: V2[] = []; for (let i = 0; i < h.length; i += 2) { const l = k.local(h[i], g, h[i + 1]); out.push([l[0], l[2]]); } return out; });
    const EAVE = 24;
    k.prism(outline, -2, EAVE, WALL, null, { windows: true, eave: g + EAVE });
    for (const h of holes) k.prism(h, -2, EAVE, WALL, null, { windows: true, eave: g + EAVE, inward: true });
    k.roof(outline, EAVE, { shape: 'hipped', pitch: 38, cap: 7, gable: () => false }, TILES, PLASTER, holes);
    entablature(k, at(outline, EAVE - 1.9), WHITE, { out: 0.9, h: 1.9, closed: true });
    // The front on the square (east): a rusticated base of arches, and above it the thirty colossal
    // half-columns through two storeys under the cornice.
    const fc = face(outline, 1, 0);
    if (fc) {
      const { a, b, n } = fc, u: V3 = [n[1], 0, -n[0]], mid: V3 = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
      const W = fc.len, base = 8.2;
      k.prism([[a[0], a[1]], [b[0], b[1]], [b[0] + n[0] * 0.5, b[1] + n[1] * 0.5], [a[0] + n[0] * 0.5, a[1] + n[1] * 0.5]], -2, base, RUST, RUST);
      const count = Math.min(30, Math.floor((W - 6) / 4.7));
      for (let q = 0; q < count; q++) {
        const off = (q - (count - 1) / 2) * ((W - 6) / count);
        // A half-column: a round shaft against the wall with a plinth and a capital.
        const cx = mid[0] + u[0] * off + n[0] * 0.55, cz = mid[2] + u[2] * off + n[1] * 0.55;
        column(k, cx, cz, base, EAVE - 2.0, 0.85, WHITE, { order: 'corinthian', sides: 10 });
        k.plate([mid[0] + u[0] * off, 0, mid[2] + u[2] * off], u, UP, arch(2.4, 5.6, 'round').map(([x, y]) => [x, y + 1.2] as V2), DARK, 0.06);
      }
      k.light([mid[0] + n[0] * 8, 6, mid[2] + n[1] * 8], 1);
    }
    k.light([r.cx, g + 12, r.cz], 1);
  },
};
