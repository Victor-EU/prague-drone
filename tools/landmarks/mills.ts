// The Zlomkovský mill's wing across the Čertovka (design.md §7.1, added in M11, 9204): at the end of
// the canal's straight reach by Kampa park the mill race runs under the house in two segmental
// arches of red-brown sandstone voussoirs on a pier with a cutwater, the left one closed by the
// sluice's iron rack, under two storeys of cream plaster and a tiled hipped roof. OSM maps the mill
// on the bank only; the wing over the water is built here, from the mill's footprint and the water
// the site reports. Not one of §6.2's landmarks: no entry in data/landmarks.json, no name on screen.

import { mat, rect, offsetRing, centreOf, type V2, type V3 } from './kit.ts';
import type { Model } from './index.ts';
import { pointInPolygon } from '../lib/osm.ts';
import { Surface, Stone, Style } from '../../src/core/buildings.ts';

const FACE = mat('#d6c0b0', Surface.Stone, Stone.Render, 0.45);
const RING = mat('#8a624f', Surface.Stone, Stone.Ashlar, 0.45);
const RING2 = mat('#76513f', Surface.Stone, Stone.Ashlar, 0.45);
const SOFFIT = mat('#4f4a42', Surface.Stone, Stone.Rubble, 0.85);
const PIER = mat('#6e665b', Surface.Stone, Stone.Rubble, 0.8);
const STRING = mat('#e9dfcf', Surface.Stone, Stone.Render, 0.2);
const WING = mat('#e6d8bd', Surface.Wall, Style.Baroque);
const TILES = mat('#a3563f', Surface.Roof);
const IRON = mat('#55585a', Surface.Plain);

/** The Čertovka's bearing at the mill: its OSM centreline from (−294, −266) to (−276, −197). */
const CANAL_BEARING = 14.6;

export const zlomkovskyMill: Model = {
  id: 'zlomkovsky-mill',
  unnamed: true,
  build(site, k, d) {
    k.seed = 121; d.seed = 122;
    const mill = site.feature('way/30286844')!.polygons[0];
    const [cx, cz] = centreOf(mill.outer);
    // Across the canal, from the mill toward Kampa: out of the mill, to the water, over it.
    const t = ((CANAL_BEARING + 90) * Math.PI) / 180, ax = Math.sin(t), az = -Math.cos(t);
    const at = (s: number): V2 => [cx + ax * s, cz + az * s];
    let s = 0;
    while (s < 40 && pointInPolygon(...at(s), mill)) s += 0.25;
    const sMill = s;
    while (s < 60 && Number.isNaN(site.water(...at(s)))) s += 0.25;
    const sWest = s;
    while (s < 80 && !Number.isNaN(site.water(...at(s)))) s += 0.25;
    const sEast = s, hw = (sEast - sWest) / 2, mid = (sWest + sEast) / 2;
    const [mx, mz] = at(mid);
    const L = site.water(...at(mid - 1));
    // Local frame on the water at the canal's middle: +x across toward Kampa, +z up the canal,
    // toward the camera of 9204, which sees the south face.
    k.place(mx, L, mz, CANAL_BEARING + 90); d.place(mx, L, mz, CANAL_BEARING + 90);
    k.ground = d.ground = L;

    const uW = sMill - mid - 0.3, uE = hw + 1.6, D = 9, Z = D / 2;
    const PIER_W = 1.3, span = (2 * hw + 0.6 - PIER_W) / 2, spring = 0.75, rise = 0.36 * span;
    const band = 0.6, F = spring + rise + band + 0.5, E = F + 2 * 3.4 + 0.1;
    const arches = [-hw - 0.3, -hw - 0.3 + span + PIER_W].map((a) => ({ a, b: a + span, m: a + span / 2 }));
    const R = (span * span / 4 + rise * rise) / (2 * rise), yc = spring + rise - R, th = Math.asin(span / 2 / R);
    const N = 14;
    const arc = (m: number, r: number, a: number): V2 => [m + r * Math.sin(a), yc + r * Math.cos(a)];
    const angles = Array.from({ length: N + 1 }, (_, i) => -th + (2 * th * i) / N);

    // The two faces: the wall down into the water, the arches cut out of it.
    const outline: V2[] = [[uW, -1.2]];
    for (const h of arches) {
      outline.push([h.a, -1.2], [h.a, spring]);
      for (const a of angles.slice(1, -1)) outline.push(arc(h.m, R, a));
      outline.push([h.b, spring], [h.b, -1.2]);
    }
    outline.push([uE, -1.2], [uE, F], [uW, F]);
    for (const z of [Z, -Z]) k.poly(outline.map(([u, y]) => [u, y, z] as V3), FACE, { normal: [0, 0, Math.sign(z)] });
    k.poly([[uE, -1.2, Z], [uE, -1.2, -Z], [uE, F, -Z], [uE, F, Z]], FACE, { normal: [1, 0, 0] });
    // The tunnels: jambs and the vault through the house.
    for (const h of arches) {
      k.poly([[h.a, -1.2, Z], [h.a, spring, Z], [h.a, spring, -Z], [h.a, -1.2, -Z]], PIER, { normal: [1, 0, 0] });
      k.poly([[h.b, -1.2, Z], [h.b, spring, Z], [h.b, spring, -Z], [h.b, -1.2, -Z]], PIER, { normal: [-1, 0, 0] });
      for (let i = 0; i < N; i++) {
        const [u0, y0] = arc(h.m, R, angles[i]), [u1, y1] = arc(h.m, R, angles[i + 1]), am = (angles[i] + angles[i + 1]) / 2;
        k.poly([[u0, y0, Z], [u1, y1, Z], [u1, y1, -Z], [u0, y0, -Z]], SOFFIT, { normal: [-Math.sin(am), -Math.cos(am), 0] });
      }
    }
    // Voussoirs standing proud of both faces, two tones alternating, every other one higher, and
    // a keystone at the crown.
    const n = Math.max(9, Math.round((2 * th * R) / 0.42) | 1);
    for (const h of arches)
      for (const z of [Z, -Z]) {
        const o = z + Math.sign(z) * 0.08, gap = 0.025 / R;
        for (let q = 0; q < n; q++) {
          const a0 = -th + (2 * th * q) / n + gap, a1 = -th + (2 * th * (q + 1)) / n - gap, am = (a0 + a1) / 2;
          const key = q === (n >> 1);
          const r1 = R + (key ? band + 0.3 : band * (q % 2 ? 1 : 0.84));
          const m = q % 2 ? RING2 : RING, tone = 0.9 + 0.16 * (((q * 7919 + (z > 0 ? 13 : 57)) % 97) / 97);
          const P = (a: number, r: number, zz: number): V3 => { const [u, y] = arc(h.m, r, a); return [u, y, zz]; };
          k.poly([P(a0, R, o), P(a1, R, o), P(a1, r1, o), P(a0, r1, o)], key ? STRING : m, { normal: [0, 0, Math.sign(z)], shade: tone });
          k.poly([P(a0, r1, z), P(a1, r1, z), P(a1, r1, o), P(a0, r1, o)], key ? STRING : m, { normal: [Math.sin(am), Math.cos(am), 0], shade: tone });
          k.poly([P(a0, R, z), P(a1, R, z), P(a1, R, o), P(a0, R, o)], SOFFIT, { normal: [-Math.sin(am), -Math.cos(am), 0] });
        }
      }
    // The pier's cutwater on the upstream (south) face, and a plain buttress on the other.
    const pm = (arches[0].b + arches[1].a) / 2;
    const cut: V2[] = [[pm - PIER_W / 2, Z], [pm + PIER_W / 2, Z], [pm, Z + 0.95]];
    k.prism(cut, -1.2, spring + 0.1, PIER, null);
    k.pyramid(cut, spring + 0.1, spring + 0.9, PIER, [pm, Z + 0.05]);
    k.box(pm, -Z - 0.2, PIER_W, 0.4, -1.2, spring + 0.2, PIER, STRING);
    // The string course the house stands on.
    k.box((uW + uE) / 2, 0, uE - uW + 0.25, D + 0.25, F - 0.3, F, STRING, STRING, STRING);

    // The house: two storeys of windows over the water (the storey below them is the arcade), and
    // its hipped roof.
    const body = rect(uE - uW, D, (uW + uE) / 2, 0);
    k.ground = L + F - 3.4;
    k.prism(body, F, E, WING, null, { windows: true, eave: L + E });
    k.ground = L;
    k.prism(offsetRing(body, 0.3), E - 0.35, E, STRING, STRING);
    k.roof(offsetRing(body, 0.3), E, { shape: 'hipped', pitch: 42, cap: 99, gable: () => false }, TILES, WING);

    // The sluice's rack across the left arch: iron bars from under the water to above the springing.
    const g = arches[0];
    for (let u = g.a + 0.12; u < g.b - 0.08; u += 0.15) d.box(u, Z - 0.35, 0.04, 0.04, -0.4, spring + 0.4, IRON, IRON);
    for (const y of [0.15, spring, spring + 0.38]) d.box(g.m, Z - 0.35, span - 0.1, 0.06, y - 0.03, y + 0.03, IRON, IRON);

    // Keep the Čertovka's bushes and walls off the house (tools/build-world.ts).
    k.claims.push(body.flatMap(([u, z]) => { const w = k.world([u, 0, z]); return [w[0], w[2]]; }));
  },
};
