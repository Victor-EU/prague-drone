// The Dancing House (design.md §7.1; 8146 to 8173, 8158, 9567 to 9581) on the corner of the Rašín
// embankment and Resslova: "Ginger", the glass tower with its pinched waist and flared skirt on
// slanting legs, leaning into "Fred", the white cylinder of staggered, framed windows with the steel
// "Medusa" on top; and behind them the white body along the river, its windows stepping up and
// down in waves. Floodlit at night, Ginger lit from within.

import { Kit, mat, type V2, type V3, type F4 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Glass } from '../../src/core/buildings.ts';

const WHITE = mat('#e3e0da', Surface.Stone, Stone.Render, 0.12);
const LINE = mat('#9a9994', Surface.Plain);
const FRAME = mat('#7d8488', Surface.Plain);
const WINDOW = mat('#2a3136', Surface.Glass, Glass.Plain);
const CURTAIN = mat('#c3c8ca', Surface.Glass, Glass.Curtain);
const LOBBY = mat('#20262a', Surface.Glass, Glass.Plain);
const STEEL = mat('#45494b', Surface.Plain);
const LEGS = mat('#cfd0cc', Surface.Stone, Stone.Render, 0.1);

// World positions (x, z) of the two towers and of the body's outline, from OSM's parts.
const GINGER: V2 = [200.2, 1219.2];
const FRED: V2 = [192, 1223.4];
const BODY: V2[] = [[187, 1250], [205, 1250], [209, 1240], [208, 1223], [204, 1223], [197, 1225.5], [191.5, 1228.4], [189, 1230], [187, 1235], [186, 1240], [187, 1246]];

/** A window with its frame on a plane (o; u across, up), the frame standing out. */
function framed(k: Kit, o: V3, u: V3, w = 1.25, h = 1.45) {
  k.plate(o, u, [0, 1, 0], [[-w / 2 - 0.18, -0.18], [w / 2 + 0.18, -0.18], [w / 2 + 0.18, h + 0.18], [-w / 2 - 0.18, h + 0.18]], FRAME, 0.12);
  k.plate(o, u, [0, 1, 0], [[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]], WINDOW, 0.16);
}

/** Fred: the cylinder on its recessed ground floor, the waving windows and lines, the Medusa. */
function fred(k: Kit, d: Kit) {
  const [cx, cz] = FRED;
  const r = (y: number) => 4.55 + 0.35 * Math.sin((y / 26) * Math.PI);
  k.lathe(cx, cz, [[3.3, -1], [3.3, 3.6]], 20, LOBBY);
  k.lathe(cx, cz, [[3.3, 3.6], [4.6, 3.9], ...Array.from({ length: 12 }, (_, i) => [r(4 + (i * 22) / 11), 4 + (i * 22) / 11] as V2), [4.2, 26.3], [0, 26.4]], 28, WHITE);
  for (let row = 0; row < 7; row++) {
    const y0 = 5 + row * 3.05;
    for (let c = 0; c < 9; c++) {
      const a = ((c + (row % 2) * 0.5) / 9) * Math.PI * 2 + 0.25 * Math.sin(row * 1.7 + c);
      const y = y0 + 0.35 * Math.sin(c * 1.3 + row * 0.9);
      const R = r(y + 0.7);
      framed(k, [cx + R * Math.cos(a), y, cz + R * Math.sin(a)], [Math.sin(a), 0, -Math.cos(a)], 1.2, 1.4);
    }
    // A wavy line round the cylinder between the rows.
    const yl = y0 + 2.2;
    for (let q = 0; q < 36; q++) {
      const a0 = (q / 36) * Math.PI * 2, a1 = ((q + 1) / 36) * Math.PI * 2;
      const w0 = yl + 0.45 * Math.sin(a0 * 2 + row), w1 = yl + 0.45 * Math.sin(a1 * 2 + row);
      const R = r(yl) + 0.05;
      k.poly([[cx + R * Math.cos(a0), w0, cz + R * Math.sin(a0)], [cx + R * Math.cos(a1), w1, cz + R * Math.sin(a1)], [cx + R * Math.cos(a1), w1 + 0.1, cz + R * Math.sin(a1)], [cx + R * Math.cos(a0), w0 + 0.1, cz + R * Math.sin(a0)]], LINE, { normal: [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)] });
    }
  }
  // The Medusa: a dome of tangled steel tubes.
  const R = 3.3, y = 26.3;
  for (let m = 0; m < 10; m++) {
    const a = (m / 10) * Math.PI * 2;
    let prev: V3 | null = null;
    for (let q = 0; q <= 6; q++) {
      const t = (q / 6) * (Math.PI / 2), tw = a + 0.5 * Math.sin(q + m);
      const p: V3 = [cx + R * Math.cos(t) * Math.cos(tw), y + R * 0.9 * Math.sin(t), cz + R * Math.cos(t) * Math.sin(tw)];
      if (prev) d.beam(prev, p, 0.16, STEEL);
      prev = p;
    }
  }
  for (const [h, n] of [[0.8, 14], [1.8, 10], [2.6, 7]] as const) {
    const rr = Math.sqrt(Math.max(0.1, R * R - (h / 0.9) ** 2));
    for (let q = 0; q < n; q++) {
      const a0 = (q / n) * Math.PI * 2, a1 = ((q + 1) / n) * Math.PI * 2;
      d.beam([cx + rr * Math.cos(a0), y + h + 0.3 * Math.sin(q), cz + rr * Math.sin(a0)], [cx + rr * Math.cos(a1), y + h + 0.3 * Math.sin(q + 1), cz + rr * Math.sin(a1)], 0.14, STEEL);
    }
  }
  k.light([cx, y + 1, cz], 1);
}

/** Ginger: the glass tower, lofted from rings that pinch at the waist and lean into Fred. */
function ginger(k: Kit, d: Kit) {
  const [cx, cz] = GINGER;
  // Height, scale of the section, lean toward Fred (metres).
  // The skirt flares out away from Fred, toward the street corner; the head leans into him.
  const rings: [number, number, number][] = [[2.6, 1.55], [4, 1.32], [6, 1.1], [9, 0.84], [12.5, 0.64], [15.5, 0.72], [19, 0.92], [23, 1.0], [27, 0.99], [29, 0.95]]
    .map(([y, s]) => [y, s, y < 12 ? (y - 12) * 0.33 : (y - 12) * 0.1]);
  const N = 28, ax = 3.7, az = 3.95;
  const dir: V2 = [(FRED[0] - cx) / Math.hypot(FRED[0] - cx, FRED[1] - cz), (FRED[1] - cz) / Math.hypot(FRED[0] - cx, FRED[1] - cz)];
  const pt = (i: number, [y, s, lean]: [number, number, number]): V3 => {
    const a = (i / N) * Math.PI * 2;
    return [cx + ax * s * Math.cos(a) - dir[0] * lean, y, cz + az * s * Math.sin(a) - dir[1] * lean];
  };
  const perim = 2 * Math.PI * Math.sqrt((ax * ax + az * az) / 2);
  for (let r = 0; r + 1 < rings.length; r++)
    for (let i = 0; i < N; i++) {
      const q = [pt(i, rings[r]), pt(i + 1, rings[r]), pt(i + 1, rings[r + 1]), pt(i, rings[r + 1])];
      const u0 = (i / N) * perim, u1 = ((i + 1) / N) * perim;
      const fac = (w: V3): F4 => {
        const best = q.reduce((b, p, j) => (Math.hypot(p[0] - w[0], p[1] - w[1], p[2] - w[2]) < Math.hypot(q[b][0] - w[0], q[b][1] - w[1], q[b][2] - w[2]) ? j : b), 0);
        return [best === 1 || best === 2 ? u1 : u0, w[1] - k.ground, perim, 30];
      };
      const a = ((i + 0.5) / N) * Math.PI * 2;
      k.poly(q, CURTAIN, { normal: [Math.cos(a), 0, Math.sin(a)], fac });
    }
  // The top and the lobby under the skirt.
  const top = rings[rings.length - 1];
  k.poly(Array.from({ length: N }, (_, i) => pt(i, top)), mat('#8a9094', Surface.FlatRoof), { normal: [0, 1, 0] });
  k.lathe(cx, cz, [[3.2, -1], [3.2, 2.6], [0, 2.6]], 16, LOBBY);
  // The underside of the skirt, and the legs slanting up to it.
  k.poly(Array.from({ length: N }, (_, i) => pt(N - i, rings[0])), LEGS, { normal: [0, -1, 0] });
  for (const [a, lean] of [[0.4, 0.6], [1.5, -0.8], [2.6, 0.9], [3.7, -0.5], [4.8, 0.7], [5.7, -0.9]]) {
    const top3 = pt((a / (Math.PI * 2)) * N, rings[0]);
    d.beam([cx + 3.8 * Math.cos(a + lean * 0.3), -0.5, cz + 4.2 * Math.sin(a + lean * 0.3)], [top3[0], 2.7, top3[2]], 0.45, LEGS);
  }
  k.light([cx, 15, cz], 1);
}

export const dancingHouse: Model = {
  id: 'dancing-house',
  floodlit: true,
  build(site: Site, k: Kit, d: Kit) {
    k.seed = 81; d.seed = 82;
    const g = site.bare(GINGER[0], GINGER[1]);
    k.place(0, g, 0); d.place(0, g, 0);
    k.ground = d.ground = g;
    // The body: recessed dark ground floor, white storeys to 26 m, windows on the street faces.
    k.prism(BODY, -1, 3.8, LOBBY, null);
    k.prism(BODY, 3.8, 26, WHITE, mat('#9b9e9e', Surface.FlatRoof));
    const n = BODY.length;
    for (let i = 0; i < n; i++) {
      const [ax, az] = BODY[i], [bx, bz] = BODY[(i + 1) % n];
      const len = Math.hypot(bx - ax, bz - az);
      // Outward normal (the ring runs counter-clockwise seen from above): west and north faces only.
      const nx = -(bz - az) / len, nz = (bx - ax) / len;
      if (len < 3 || !(nx < -0.5 || nz < -0.5)) continue;
      const u: V3 = [(bx - ax) / len, 0, (bz - az) / len];
      const cols = Math.floor(len / 2.5);
      for (let row = 0; row < 7; row++)
        for (let c = 0; c < cols; c++) {
          const t = (c + 0.5) * (len / cols) + 0.45 * Math.sin(row * 1.7 + c * 0.8);
          if (t < 0.9 || t > len - 0.9) continue;
          const y = 5 + row * 3.05 + 0.3 * Math.sin(c * 1.1 + row);
          framed(k, [ax + u[0] * t + nx * 0.02, y, az + u[2] * t + nz * 0.02], u);
        }
    }
    fred(k, d);
    ginger(k, d);
  },
};
