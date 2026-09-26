// The Dancing House (design.md §7.1; 8146 to 8173, 8158, 9567 to 9581) on the corner of the Rašín
// embankment and Resslova: "Ginger", the glass tower, narrow at the waist, flaring below into a
// wide skirt of glass that stands on slanting concrete legs and swelling a little above, leaning
// into "Fred", the white cylinder whose windows sit in grey boxes standing out of the plaster in
// rows that wave up and down between wavy bands, with the steel "Medusa" on top; and behind them
// the white body along the river, its windows in the same boxes. Floodlit at night, Ginger lit
// from within.
//
// Rebuilt in M13 after the M12 verdicts (8158 "needs major rework"; 7940): the first model had
// Ginger as a plain swelling column apart from Fred, without the skirt, the legs, the mullions or
// the platform between the two, and Fred's windows flat in even rows.

import { Kit, mat, PROFILE, type V2, type V3 } from './kit.ts';
import type { Model, Site } from './index.ts';
import { Surface, Stone, Glass } from '../../src/core/buildings.ts';

const WHITE = mat('#e4e1db', Surface.Stone, Stone.Render, 0.12);
const BAND = mat('#c9c6bf', Surface.Plain);
const FRAME = mat('#7c8184', Surface.Plain);
const BOX = mat('#9a9ea0', Surface.Plain);
const WINDOW = mat('#262d33', Surface.Glass, Glass.Plain);
const CURTAIN = mat('#adb6bb', Surface.Glass, Glass.Curtain);
const MULLION = mat('#8f9497', Surface.Plain);
const LOBBY = mat('#20262a', Surface.Glass, Glass.Plain);
const STEEL = mat('#8b9094', Surface.Plain);
const LEGS = mat('#d3d2cd', Surface.Stone, Stone.Render, 0.1);
const COPING = mat('#d6d3cc', Surface.Plain);

// World positions (x, z) of the two towers and of the body's outline, from OSM's parts.
const GINGER: V2 = [200.2, 1219.2];
const FRED: V2 = [192, 1223.4];
const FRED_R = 4.6;
const BODY: V2[] = [[187, 1250], [205, 1250], [209, 1240], [208, 1223], [204, 1223], [197, 1225.5], [191.5, 1228.4], [189, 1230], [187, 1235], [186, 1240], [187, 1246]];
// From Ginger toward Fred, unit, and the distance between their centres.
const GF = Math.hypot(FRED[0] - GINGER[0], FRED[1] - GINGER[1]);
const DIR: V2 = [(FRED[0] - GINGER[0]) / GF, (FRED[1] - GINGER[1]) / GF];
const PERP: V2 = [-DIR[1], DIR[0]];

const inRing = (x: number, z: number, r: V2[]) => {
  let inside = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, zi] = r[i], [xj, zj] = r[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
};

/**
 * A window in its box: a grey frame standing `depth` out of the wall with the glass at its front
 * (8150, 8166). On the plane (o on the wall; u across, up), w by h.
 */
function boxedWindow(k: Kit, o: V3, u: V3, w = 1.35, h = 1.65, depth = 0.5) {
  const n: V3 = [-u[2], 0, u[0]];
  const front: V3 = [o[0] + n[0] * depth, o[1], o[2] + n[2] * depth];
  k.slab(front, u, [0, 1, 0], [[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]], depth, FRAME, BOX);
  k.plate(o, u, [0, 1, 0], [[-w / 2 + 0.14, 0.14], [w / 2 - 0.14, 0.14], [w / 2 - 0.14, h - 0.14], [-w / 2 + 0.14, h - 0.14]], WINDOW, depth + 0.02);
}

/** Fred: the cylinder on its recessed ground floor, the boxed windows in waving rows, the bands, the Medusa. */
function fred(k: Kit, d: Kit, f: Kit) {
  const [cx, cz] = FRED;
  const r = (y: number) => FRED_R + 0.3 * Math.sin(((y - 4) / 23) * Math.PI);
  const TOP = 26.8;
  k.lathe(cx, cz, [[3.4, -1], [3.4, 3.6]], 20, LOBBY);
  k.lathe(cx, cz, [[3.4, 3.6], [FRED_R + 0.05, 3.9], ...Array.from({ length: 12 }, (_, i) => [r(4 + (i * 22) / 11), 4 + (i * 22) / 11] as V2), [4.75, TOP - 0.5], [4.8, TOP], [4.4, TOP + 0.1], [0, TOP + 0.1]], 32, WHITE);
  // The windows: ten a row, the rows waving, none where Ginger leans on him or the body joins.
  const toG = Math.atan2(-DIR[1], -DIR[0]);
  for (let row = 0; row < 7; row++) {
    const y0 = 4.9 + row * 3.05;
    for (let c = 0; c < 10; c++) {
      const a = ((c + (row % 2) * 0.5) / 10) * Math.PI * 2;
      let da = Math.abs(a - toG) % (Math.PI * 2);
      da = Math.min(da, Math.PI * 2 - da);
      if (da < 0.5) continue;
      const y = y0 + 0.55 * Math.sin(2 * a + row * 1.3);
      const R = r(y + 0.8);
      const px = cx + R * Math.cos(a), pz = cz + R * Math.sin(a);
      if (inRing(px + Math.cos(a) * 0.6, pz + Math.sin(a) * 0.6, BODY)) continue;
      boxedWindow(k, [px, y, pz], [Math.sin(a), 0, -Math.cos(a)]);
    }
    // A wavy band round the cylinder between the rows, standing a little proud.
    const yl = y0 + 2.3;
    for (let q = 0; q < 48; q++) {
      const a0 = (q / 48) * Math.PI * 2, a1 = ((q + 1) / 48) * Math.PI * 2;
      const w0 = yl + 0.5 * Math.sin(a0 * 2 + row * 1.3 + 1.2), w1 = yl + 0.5 * Math.sin(a1 * 2 + row * 1.3 + 1.2);
      const R0 = r(w0) + 0.07, R1 = r(w1) + 0.07, Ri0 = r(w0), Ri1 = r(w1);
      const n: V3 = [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)];
      f.poly([[cx + R0 * Math.cos(a0), w0, cz + R0 * Math.sin(a0)], [cx + R1 * Math.cos(a1), w1, cz + R1 * Math.sin(a1)], [cx + R1 * Math.cos(a1), w1 + 0.14, cz + R1 * Math.sin(a1)], [cx + R0 * Math.cos(a0), w0 + 0.14, cz + R0 * Math.sin(a0)]], BAND, { normal: n });
      f.poly([[cx + Ri0 * Math.cos(a0), w0 + 0.14, cz + Ri0 * Math.sin(a0)], [cx + R0 * Math.cos(a0), w0 + 0.14, cz + R0 * Math.sin(a0)], [cx + R1 * Math.cos(a1), w1 + 0.14, cz + R1 * Math.sin(a1)], [cx + Ri1 * Math.cos(a1), w1 + 0.14, cz + Ri1 * Math.sin(a1)]], BAND, { normal: [0, 1, 0] });
    }
  }
  // The Medusa: a dome of tangled steel tubes on a low drum.
  const R = 3.2, y = TOP + 0.1;
  k.lathe(cx, cz, [[2.6, y], [2.6, y + 0.5], [0, y + 0.5]], 16, STEEL);
  for (let m = 0; m < 16; m++) {
    const a = (m / 16) * Math.PI * 2;
    let prev: V3 | null = null;
    for (let q = 0; q <= 7; q++) {
      const t = (q / 7) * (Math.PI / 2), tw = a + 0.6 * Math.sin(q * 1.3 + m);
      const p: V3 = [cx + R * Math.cos(t) * Math.cos(tw), y + 0.4 + R * 0.95 * Math.sin(t), cz + R * Math.cos(t) * Math.sin(tw)];
      if (prev) d.beam(prev, p, 0.14, STEEL);
      prev = p;
    }
  }
  for (const [h, n] of [[0.6, 18], [1.4, 14], [2.1, 10], [2.7, 6]] as const) {
    const rr = Math.sqrt(Math.max(0.1, R * R - (h / 0.95) ** 2));
    for (let q = 0; q < n; q++) {
      const a0 = (q / n) * Math.PI * 2, a1 = ((q + 1) / n) * Math.PI * 2;
      d.beam([cx + rr * Math.cos(a0), y + 0.4 + h + 0.3 * Math.sin(q * 2.1), cz + rr * Math.sin(a0)], [cx + rr * Math.cos(a1), y + 0.4 + h + 0.3 * Math.sin(q * 2.1 + 2.1), cz + rr * Math.sin(a1)], 0.12, STEEL);
    }
  }
  k.light([cx, y + 1.5, cz], 1);
}

/** Ginger's section at height y: radius, and her centre, which moves toward Fred as she narrows so she keeps leaning on him. */
function section(y: number): { r: number; c: V2 } {
  // (height, radius): the skirt's rim, the waist, the swell, the top.
  const prof: V2[] = [[6.2, 5.0], [7.4, 4.6], [8.8, 3.9], [10.4, 3.1], [12.2, 2.55], [14, 2.35], [16, 2.55], [18.6, 3.0], [21.2, 3.35], [23.6, 3.35], [25.5, 3.0]];
  let r = prof[prof.length - 1][1];
  for (let i = 0; i + 1 < prof.length; i++)
    if (y <= prof[i + 1][0]) { const t = (y - prof[i][0]) / (prof[i + 1][0] - prof[i][0]); r = prof[i][1] + (prof[i + 1][1] - prof[i][1]) * Math.max(0, Math.min(1, t)); break; }
  // She keeps to Fred's skin as she narrows, and above the skirt leans over him: Fred holds her.
  const off = (5.0 - r) + Math.min(1, Math.max(0, (y - 8) / 8)) * 0.9 + Math.max(0, y - 14) * 0.07;
  return { r, c: [GINGER[0] + DIR[0] * off, GINGER[1] + DIR[1] * off] };
}

/** Ginger: the glass tower on her legs, her mullions and floors, the platform against Fred. */
function ginger(k: Kit, d: Kit, f: Kit) {
  const N = 32;
  const levels = [6.2, 7.4, 8.8, 10.4, 12.2, 14, 16, 18.6, 21.2, 23.6, 25.5];
  const ring = (y: number): V2[] => { const { r, c } = section(y); return Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as V2; }); };
  const rings = levels.map(ring);
  for (let i = 0; i + 1 < rings.length; i++) k.loft(rings[i], levels[i], rings[i + 1], levels[i + 1], CURTAIN);
  // Mullions up every vertex, a transom at every floor, and the skirt's diagonals.
  const P = (i: number, l: number): V3 => [rings[l][i % N][0], levels[l], rings[l][i % N][1]];
  for (let i = 0; i < N; i++)
    for (let l = 0; l + 1 < levels.length; l++) {
      d.beam(P(i, l), P(i, l + 1), 0.1, MULLION);
      d.beam(P(i, l), P(i + 1, l), 0.08, MULLION);
      if (l < 3) f.beam(P(i, l), P(i + (l % 2 ? 1 : -1) + N, l + 1), 0.06, MULLION);
    }
  for (let i = 0; i < N; i++) d.beam(P(i, levels.length - 1), P(i + 1, levels.length - 1), 0.08, MULLION);
  // The top: a white lip and the roof, the small glass drum of the bar over it.
  const top = rings[rings.length - 1], yT = levels[levels.length - 1];
  k.loft(top, yT, top.map(([x, z]) => [x, z] as V2), yT + 0.45, WHITE, mat('#8a9094', Surface.FlatRoof));
  const st = section(yT);
  k.lathe(st.c[0], st.c[1], [[st.r * 0.55, yT + 0.45], [st.r * 0.55, yT + 2.4], [0, yT + 2.4]], 16, CURTAIN);
  // The skirt's rim and underside, the lobby under it, the legs.
  const rim = rings[0], y0 = levels[0];
  k.loft(rim.map(([x, z]) => [x, z] as V2), y0 - 0.45, rim, y0, LEGS);
  k.poly(rim.slice().reverse().map(([x, z]) => [x, y0 - 0.45, z] as V3), LEGS, { normal: [0, -1, 0] });
  k.lathe(GINGER[0], GINGER[1], [[3.0, -1], [3.0, y0 - 0.45]], 20, LOBBY);
  const feet: [number, number][] = [[0.15, 0.4], [0.75, -0.45], [1.35, 0.5], [1.95, -0.35], [2.55, 0.55], [3.2, -0.5], [3.8, 0.45], [4.4, -0.4], [5.0, 0.5], [5.65, -0.45]];
  for (const [a, twist] of feet) {
    const fx = GINGER[0] + 3.5 * Math.cos(a), fz = GINGER[1] + 3.5 * Math.sin(a);
    const at = a + twist * 0.35;
    const tx = GINGER[0] + 4.85 * Math.cos(at), tz = GINGER[1] + 4.85 * Math.sin(at);
    blade(k, [fx, -0.6, fz], [tx, y0 - 0.2, tz], 0.4, 0.9, 0.45);
  }
  // The platform between the two at the third floor (8166): a white balcony on a strut.
  const yP = 9.8, sp = section(yP);
  const seam = GF - FRED_R;
  const S: V2 = [GINGER[0] + DIR[0] * (seam - 0.8), GINGER[1] + DIR[1] * (seam - 0.8)];
  const side = Math.sign(PERP[0] * -20 + PERP[1] * -27) || 1; // toward the street corner (the camera of 8158)
  const u: V3 = [PERP[0] * side, 0, PERP[1] * side], v: V3 = [DIR[0], 0, DIR[1]];
  const o: V3 = [S[0] + u[0] * 1.5, yP, S[1] + u[2] * 1.5];
  const shape: V2[] = [[0, -1.6], [2.8, -1.4], [3.6, -0.6], [3.6, 0.8], [2.8, 1.5], [0, 1.6]];
  // u × v points down here (u across, v along DIR): draw the plate in the plane and its parapet as a prism.
  k.slab([o[0], yP + 0.35, o[2]], u, v, shape, 0.35, LEGS);
  const outline = shape.map(([a, b]) => [o[0] + u[0] * a + v[0] * b, o[2] + u[2] * a + v[2] * b] as V2);
  k.prism(outline, yP + 0.35, yP + 1.4, WHITE, null);
  const far: V3 = [o[0] + u[0] * 3.4, yP, o[2] + u[2] * 3.4];
  const foot = section(7.2);
  k.beam(far, [foot.c[0] + u[0] * foot.r * 0.9, 7.2, foot.c[1] + u[2] * foot.r * 0.9], 0.35, LEGS);
  k.light([sp.c[0], 15, sp.c[1]], 1);
}

/** A tapered concrete blade from a foot to the skirt's rim: `w0` wide at the foot, `w1` at the top, `t` thick. */
function blade(k: Kit, p: V3, q: V3, w0: number, w1: number, t: number) {
  const dx = q[0] - p[0], dz = q[2] - p[2], l = Math.hypot(dx, dz) || 1;
  const along: V2 = [dx / l, dz / l], across: V2 = [-dz / l, dx / l];
  const c = (o: V3, w: number, i: number): V3 => {
    const a = (i === 0 || i === 3 ? -0.5 : 0.5) * w, b = (i < 2 ? -0.5 : 0.5) * t;
    return [o[0] + along[0] * a + across[0] * b, o[1], o[2] + along[1] * a + across[1] * b];
  };
  const P = [0, 1, 2, 3].map((i) => c(p, w0, i)), Q = [0, 1, 2, 3].map((i) => c(q, w1, i));
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    const mid: V3 = [(P[i][0] + P[j][0]) / 2 - p[0], 0, (P[i][2] + P[j][2]) / 2 - p[2]];
    k.poly([P[i], P[j], Q[j], Q[i]], LEGS, { normal: mid });
  }
}

export const dancingHouse: Model = {
  id: 'dancing-house',
  // A 15 m 'building' of 7 m² between the towers, and the legs mapped as 5 m parts.
  replaces: ['way/456783392', ...[319383482, 319383483, 319383484, 319383486, 319383487, 319383488, 319383489, 319383490, 319383491, 319383492, 319383493].map((n) => `way/${n}`)],
  floodlit: true,
  build(site: Site, k: Kit, d: Kit, f: Kit) {
    k.seed = 81; d.seed = 82; f.seed = 83;
    const g = site.bare(GINGER[0], GINGER[1]);
    for (const kit of [k, d, f]) { kit.place(0, g, 0); kit.ground = g; }
    // No tree stands on the pavement before it (7940): the corner and the embankment side are kept clear.
    k.claims.push([176, 1206, 212, 1206, 212, 1252, 176, 1252]);
    // The body: recessed dark ground floor, white storeys to 26 m, the boxed windows on the faces
    // toward the river and the street, a coping round the top.
    k.prism(BODY, -1, 3.8, LOBBY, null);
    k.prism(BODY, 3.8, 24.6, WHITE, mat('#9b9e9e', Surface.FlatRoof));
    f.sweep(BODY.map(([x, z]) => [x, 24.6, z] as V3), PROFILE.coping(0.6, 0.35), COPING, { closed: true });
    const n = BODY.length;
    for (let i = 0; i < n; i++) {
      const [ax, az] = BODY[i], [bx, bz] = BODY[(i + 1) % n];
      const len = Math.hypot(bx - ax, bz - az);
      if (len < 3) continue;
      let nx = -(bz - az) / len, nz = (bx - ax) / len;
      // Outward: the normal that leaves the ring.
      if (inRing((ax + bx) / 2 + nx, (az + bz) / 2 + nz, BODY)) { nx = -nx; nz = -nz; }
      // Only the faces toward the river (west) and the corner (north); the others meet the neighbours.
      if (!(nx < -0.4 || nz < -0.4)) continue;
      const u: V3 = [(bx - ax) / len, 0, (bz - az) / len];
      // u × up must point out: flip u if not.
      if (-u[2] * nx + u[0] * nz < 0) { u[0] = -u[0]; u[2] = -u[2]; }
      const cols = Math.floor(len / 2.6);
      for (let row = 0; row < 7; row++)
        for (let c = 0; c < cols; c++) {
          const t = (c + 0.5) * (len / cols) + 0.4 * Math.sin(row * 1.7 + c * 0.8);
          if (t < 1.0 || t > len - 1.0) continue;
          const y = 4.9 + row * 3.05 + 0.45 * Math.sin(c * 0.9 + row * 1.1);
          const px = ax + (bx - ax) * (t / len), pz = az + (bz - az) * (t / len);
          if (Math.hypot(px - FRED[0], pz - FRED[1]) < FRED_R + 1.2 || Math.hypot(px - GINGER[0], pz - GINGER[1]) < 5.7) continue;
          boxedWindow(k, [px, y, pz], u);
        }
      // A wavy band along the face between the rows.
      for (let row = 0; row < 7; row++) {
        const yl = 4.9 + row * 3.05 + 2.3, steps = Math.max(2, Math.round(len / 1.5));
        const pts: V3[] = [];
        for (let q = 0; q <= steps; q++) {
          const s = (q / steps) * len;
          pts.push([ax + (bx - ax) * (s / len) + nx * 0.07, yl + 0.4 * Math.sin(s * 0.5 + row * 1.3), az + (bz - az) * (s / len) + nz * 0.07]);
        }
        for (let q = 0; q + 1 < pts.length; q++)
          f.poly([pts[q], pts[q + 1], [pts[q + 1][0], pts[q + 1][1] + 0.14, pts[q + 1][2]], [pts[q][0], pts[q][1] + 0.14, pts[q][2]]], BAND, { normal: [nx, 0, nz] });
      }
    }
    fred(k, d, f);
    ginger(k, d, f);
  },
};
