// Life on the Vltava (design.md §8.8): tour boats on circuits in the pools between the weirs,
// Palacký Bridge to Čechův Bridge; pedal boats meandering between Legion Bridge and the Old Town
// weir, from the pontoon on Střelecký island; rowing eights above the Šítkov weir in the morning;
// swans off Kampa, below Charles Bridge and at Náplavka; the boats moored at the quays. Circuits
// follow the clock; pedal boats and swans steer by the distance to the bank that the build lays
// over the river (tools/lib/life.ts), so they never run aground or over a weir. Moving boats draw
// a wake: the two arms of a V and the wash behind the stern.

import * as THREE from 'three';
import { Shape, rgb, capsulePlan, inset, setPose, rng, lifeMesh, commit, type Outline, type RGB } from './shapes.ts';
import { lifeMaterial } from './material.ts';
import { RIVER_STEP, type LifeMeta } from '../core/life.ts';

const PEDAL = ['#8fb8d8', '#e8b04a', '#d9674a', '#9cc79a', '#f0e6c8', '#6d8fc7'].map((h) => new THREE.Color(h));
const WHITE = rgb('#eeeeea'), NAVY = rgb('#27344a'), GLASS = rgb('#1d2227'), OFF = rgb('#d9d8d2'), DARK = rgb('#2c2824');
const KAYAK = ['#d9522f', '#e8c235', '#2f6fbd', '#4ea35a', '#e86a9a', '#f0f0ea'].map((h) => new THREE.Color(h));

// ---- Models --------------------------------------------------------------------------------------
// Rebuilt in M13 after the verdicts on 8849 ("the boat needs finetuning") and 9486 ("the boats are
// simplistic"): flared hulls with a boot-top and a rubbing strake, window rows panel by panel,
// railings of posts and rails, a canopy, the wheelhouse, the steamer's funnel, a flag; the pedal
// boats with their striped bucket seats and a windscreen; and kayaks.

const SEAT = rgb('#d4602c'), SEAT2 = rgb('#f1e9d6'), RAIL = rgb('#e6e6e2'), STRAKE = rgb('#3a3d40');
const FUNNEL = rgb('#1e1e1e'), REDBAND = rgb('#9b2a22'), BENCH = rgb('#35507a'), FLAG_W = rgb('#f4f4f2'), FLAG_R = rgb('#c8202a');

/** Posts every 1.6 m or so round an outline, with a rail on top and one halfway. */
function railing(s: Shape, o: Outline, y: number, h: number, col: RGB = RAIL) {
  const n = o.length;
  for (let i = 0; i < n; i++) {
    const [ax, az] = o[i], [bx, bz] = o[(i + 1) % n];
    const L = Math.hypot(bx - ax, bz - az);
    s.beam([ax, y + h, az], [bx, y + h, bz], 0.05, col);
    s.beam([ax, y + h * 0.5, az], [bx, y + h * 0.5, bz], 0.035, col);
    const posts = Math.max(1, Math.round(L / 1.6));
    for (let q = 0; q < posts; q++) {
      const t = q / posts, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
      s.beam([x, y, z], [x, y + h, z], 0.045, col);
    }
  }
}

/** The Czech flag on a staff: white over red, the blue wedge at the hoist. */
function flag(s: Shape, x: number, y: number, z: number, h: number) {
  s.beam([x, y, z], [x, y + h, z], 0.06, RAIL);
  s.box(x, y + h - 0.5, z - 0.02, x + 0.75, y + h - 0.25, z + 0.02, FLAG_W);
  s.box(x, y + h - 0.75, z - 0.02, x + 0.75, y + h - 0.5, z + 0.02, FLAG_R);
  s.box(x, y + h - 0.7, z - 0.025, x + 0.28, y + h - 0.3, z + 0.025, rgb('#1d3f8a'));
}

/** A row of window panels along both sides of a cabin outline between two heights, each a little proud of the wall. */
function windows(s: Shape, cabin: Outline, y0: number, y1: number, step: number, w: number) {
  let x0 = Infinity, x1 = -Infinity, hz = 0;
  for (const [x, z] of cabin) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); hz = Math.max(hz, Math.abs(z)); }
  s.glow = 1;
  for (let x = x0 + 1.2; x + w < x1 - 0.8; x += step)
    for (const side of [-1, 1]) {
      const z = side * hz;
      s.box(x, y0, Math.min(z, z + side * 0.04), x + w, y1, Math.max(z, z + side * 0.04), GLASS);
    }
  s.glow = 0;
}

/** A tour boat 30 m long (stretched to its length by the instance): 0 modern white cruiser, 1 old steamer, 2 glass restaurant boat. */
function tourBoat(kind: number): THREE.BufferGeometry {
  const s = new Shape(), L = 30, B = kind === 2 ? 6.6 : 5.6;
  const dark = kind === 1;
  const water = capsulePlan(L - 1.4, B - 1.0, 5.0, 1.4), hull = capsulePlan(L, B, 5.5, 1.6);
  // Boot-top at the waterline, the hull's side flaring out to the deck, a dark rubbing strake under its edge.
  s.prism(water, -0.35, 0.2, () => (dark ? DARK : NAVY));
  s.band(water, 0.2, hull, 1.15, () => (dark ? DARK : WHITE));
  s.prism(inset(hull, -0.05, -0.06), 0.98, 1.12, () => STRAKE);
  s.lid(hull, 1.15, OFF, 1);
  // A low bulwark round the deck, the walkway inside it.
  s.prism(inset(hull, 0.1, 0.05), 1.15, 1.7, () => WHITE);
  s.prism(inset(hull, 0.3, 0.2), 1.15, 1.7, () => WHITE);
  s.lid(inset(hull, 0.1, 0.05), 1.7, OFF, 1);
  const cabin = inset(hull, 3.4, 0.5), y0 = 1.15;
  if (kind === 2) {
    // The restaurant boat: a long glass saloon under a white roof, mullions along it, a small wheelhouse forward.
    s.prism(cabin, y0, y0 + 0.5, () => WHITE);
    s.glow = 1; s.prism(cabin, y0 + 0.5, y0 + 2.3, () => GLASS); s.glow = 0;
    s.prism(cabin, y0 + 2.3, y0 + 2.75, () => WHITE);
    s.lid(cabin, y0 + 2.75, OFF, 1);
    let hz = 0; for (const [, z] of cabin) hz = Math.max(hz, Math.abs(z));
    for (let x = -10.5; x < 9; x += 1.7) for (const side of [-1, 1]) s.beam([x, y0 + 0.5, side * (hz + 0.02)], [x, y0 + 2.3, side * (hz + 0.02)], 0.08, WHITE);
    const top = y0 + 2.75;
    s.box(6.0, top, -1.5, 9.0, top + 0.45, 1.5, WHITE);
    s.glow = 1; s.box(6.0, top + 0.45, -1.52, 9.0, top + 1.2, 1.52, GLASS); s.glow = 0;
    s.box(5.8, top + 1.2, -1.7, 9.2, top + 1.32, 1.7, WHITE);
    flag(s, -13.2, 1.7, 0, 2.6);
    return s.geometry();
  }
  // The saloon: a white wall with a row of window panels, a coaming above; the open deck on top.
  s.prism(cabin, y0, y0 + 1.5, () => WHITE);
  windows(s, cabin, y0 + 0.55, y0 + 1.35, 1.7, 1.15);
  s.prism(cabin, y0 + 1.5, y0 + 1.85, () => WHITE);
  const top = y0 + 1.85;
  s.lid(cabin, top, OFF, 1);
  railing(s, inset(cabin, 0.12, 0.06), top, 1.0);
  // Benches in two rows, a canopy on posts over the after half, the wheelhouse forward.
  for (let x = -10; x <= 4; x += 1.6) { s.box(x, top, -1.9, x + 0.5, top + 0.45, -0.4, BENCH); s.box(x, top, 0.4, x + 0.5, top + 0.45, 1.9, BENCH); }
  const cz = B / 2 - 1.0;
  for (const x of [-10.8, -6, -1.2]) for (const side of [-1, 1]) s.beam([x, top, side * cz], [x, top + 2.25, side * cz], 0.08, RAIL);
  s.box(-11.3, top + 2.25, -cz - 0.3, -0.7, top + 2.4, cz + 0.3, WHITE, true);
  s.box(6.5, top, -1.4, 9.4, top + 0.5, 1.4, WHITE);
  s.glow = 1; s.box(6.5, top + 0.5, -1.42, 9.4, top + 1.25, 1.42, GLASS); s.glow = 0;
  s.box(6.3, top + 1.25, -1.6, 9.6, top + 1.4, 1.6, WHITE);
  s.beam([9.8, top, 0], [9.8, top + 3.2, 0], 0.07, RAIL);
  flag(s, -13.4, 1.7, 0, 2.4);
  if (kind === 1) {
    // The steamer: a tall black funnel with a red band amidships, and a canvas awning aft.
    s.box(-0.3, top, -0.6, 0.9, top + 3.4, 0.6, FUNNEL);
    s.box(-0.32, top + 2.5, -0.62, 0.92, top + 2.95, 0.62, REDBAND);
  }
  return s.geometry();
}

/** A pedal boat, white, a coloured band (the instance's colour), a windscreen, two striped bucket seats with their riders. */
function pedalBoat(): THREE.BufferGeometry {
  const s = new Shape();
  const hull = capsulePlan(3.6, 1.9, 1.0, 0.4);
  s.prism(hull, -0.12, 0.3, () => WHITE);
  s.tint = 1;
  s.prism(hull, 0.3, 0.48, () => [1, 1, 1]);
  s.tint = 0;
  s.lid(hull, 0.48, OFF, 1);
  s.box(0.75, 0.48, -0.72, 0.8, 0.9, 0.72, rgb('#9fb4bf'));
  const shirts: RGB[] = [rgb('#e9e4da'), rgb('#3b4452')];
  [-0.45, 0.45].forEach((z, k) => {
    s.box(-0.55, 0.48, z - 0.32, -0.05, 0.72, z + 0.32, SEAT);
    for (let q = 0; q < 5; q++) s.box(-0.62, 0.72 + q * 0.11, z - 0.32, -0.5, 0.83 + q * 0.11, z + 0.32, q % 2 ? SEAT2 : SEAT);
    s.box(-0.5, 0.72, z - 0.19, -0.18, 1.12, z + 0.19, shirts[k]);
    s.ellipsoid([-0.34, 1.25, z], [0.11, 0.13, 0.11], rgb('#c9a58a'), 6, 3);
  });
  return s.geometry();
}

/** A kayak (the instance's colour), its paddler and the paddle across. */
function kayak(): THREE.BufferGeometry {
  const s = new Shape();
  const hull = capsulePlan(4.3, 0.64, 1.9, 1.9);
  s.tint = 1;
  s.prism(hull, -0.1, 0.22, () => [1, 1, 1]);
  s.lid(hull, 0.22, [0.92, 0.92, 0.92], 1);
  s.tint = 0;
  s.box(-0.5, 0.22, -0.22, 0.4, 0.26, 0.22, rgb('#1c1e20'));
  s.box(-0.35, 0.22, -0.17, -0.02, 0.62, 0.17, rgb('#d9522f'));
  s.ellipsoid([-0.18, 0.74, 0], [0.1, 0.12, 0.1], rgb('#c9a58a'), 6, 3);
  s.beam([0.15, 0.62, -1.15], [0.15, 0.46, 1.15], 0.04, rgb('#e8e2c6'));
  s.box(0.12, 0.6, -1.3, 0.18, 0.7, -1.0, rgb('#f0c030'));
  s.box(0.12, 0.38, 1.0, 0.18, 0.5, 1.3, rgb('#f0c030'));
  return s.geometry();
}

/** A rowing eight: a shell 17.6 m long, eight rowers and a cox, the oars out square. */
function eight(): THREE.BufferGeometry {
  const s = new Shape();
  const hull = capsulePlan(17.6, 0.6, 6, 5);
  s.prism(hull, -0.05, 0.28, () => rgb('#e8e2c6'));
  s.lid(hull, 0.28, rgb('#d8d0b0'), 1);
  for (let k = 0; k < 8; k++) {
    const x = -5.2 + k * 1.4, side = k % 2 ? 1 : -1;
    s.box(x - 0.18, 0.28, -0.2, x + 0.18, 0.95, 0.2, rgb('#2d4f8c'));
    s.ellipsoid([x, 1.05, 0], [0.1, 0.12, 0.1], rgb('#c9a58a'), 6, 3);
    s.beam([x + 0.2, 0.55, 0.3 * side], [x + 0.6, 0.35, 3.6 * side], 0.05, rgb('#e2e2de'));
    s.box(x + 0.45, 0.25, 3.3 * side - 0.12, x + 0.75, 0.4, 3.9 * side + 0.12 * side, rgb('#c73a2e'));
  }
  s.box(6.3, 0.28, -0.2, 6.7, 0.8, 0.2, rgb('#3a3a3a'));
  return s.geometry();
}

/** A swan: body, neck, head with its orange bill, and wings that fold onto its back. */
function swan(): THREE.BufferGeometry {
  const s = new Shape(), W = rgb('#f1f0ea');
  s.ellipsoid([0, 0.12, 0], [0.55, 0.22, 0.26], W, 8, 4);
  s.beam([0.38, 0.2, 0], [0.5, 0.62, 0], 0.09, W);
  s.beam([0.5, 0.62, 0], [0.47, 0.8, 0], 0.08, W);
  s.ellipsoid([0.53, 0.82, 0], [0.09, 0.05, 0.05], W, 6, 3);
  s.box(0.6, 0.79, -0.025, 0.7, 0.83, 0.025, rgb('#d8662a'));
  s.wing = 1;
  for (const side of [-1, 1]) {
    s.tri([-0.35, 0.3, 0], [0.25, 0.3, 0], [-0.25, 0.3, 1.05 * side], W, [0, 1, 0]);
    s.tri([-0.35, 0.3, 0], [0.25, 0.3, 0], [-0.25, 0.3, 1.05 * side], W, [0, -1, 0]);
  }
  s.wing = 0;
  return s.geometry();
}

/** A pontoon: a low grey deck on floats. */
function pontoon(): THREE.BufferGeometry {
  const s = new Shape();
  s.box(-11, -0.3, -1.8, 11, 0.45, 1.8, rgb('#77736b'));
  s.box(-11, 0.45, 1.7, 11, 1.4, 1.8, rgb('#dcdad4'));
  s.box(-2, 0.45, -1.2, 2, 2.6, 0.8, rgb('#e2ded5'));
  return s.geometry();
}

/** A wake for a boat 1 long: the arms of a V from the bow, and the wash behind the stern (alpha in the colour). */
function wake(): THREE.BufferGeometry {
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const strip = (pts: [number, number, number, number][]) => {
    // pts: x, z, half width, alpha along the strip's middle line.
    const first = pos.length / 3;
    for (let i = 0; i < pts.length; i++) {
      const [x, z, w, a] = pts[i];
      const j = Math.min(pts.length - 1, i + 1), k = Math.max(0, i - 1);
      const dx = pts[j][0] - pts[k][0], dz = pts[j][1] - pts[k][1], l = Math.hypot(dx, dz) || 1;
      const nx = -dz / l, nz = dx / l;
      pos.push(x + nx * w, 0, z + nz * w, x - nx * w, 0, z - nz * w);
      col.push(0.6, 0.64, 0.66, a, 0.6, 0.64, 0.66, a);
    }
    for (let i = 0; i + 1 < pts.length; i++) { const a = first + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  };
  const ang = (19.5 * Math.PI) / 180;
  for (const side of [-1, 1]) {
    const arm: [number, number, number, number][] = [];
    for (let t = 0; t <= 1; t += 0.1) {
      const d = t * 3.2;
      arm.push([0.42 - d * Math.cos(ang), side * (0.06 + d * Math.sin(ang)), 0.02 + 0.05 * t, 0.12 * (1 - t) ** 1.6]);
    }
    strip(arm);
  }
  const wash: [number, number, number, number][] = [];
  for (let t = 0; t <= 1; t += 0.1) wash.push([-0.5 - t * 2.2, 0, 0.08 + 0.08 * t, 0.16 * (1 - t) ** 1.8]);
  strip(wash);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(pos.map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
  g.setAttribute('aGlow', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3), 1));
  g.setAttribute('aTint', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3), 1));
  g.setIndex(idx);
  return g;
}

// ---- The river's frame ----------------------------------------------------------------------------

/** The centreline's stations: position, level, widths, and the downstream frame at any distance. */
class Stations {
  readonly n: number;
  readonly length: number;
  private st: Float32Array;
  /** Half-widths smoothed over 100 m, for circuits that keep a steady line. */
  private wl: Float32Array;
  private wr: Float32Array;
  constructor(st: Float32Array) {
    this.st = st;
    this.n = st.length / 5;
    this.length = (this.n - 1) * RIVER_STEP;
    this.wl = new Float32Array(this.n);
    this.wr = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) {
      let a = 0, b = 0, c = 0;
      for (let d = -5; d <= 5; d++) { const j = Math.min(this.n - 1, Math.max(0, i + d)); a += st[j * 5 + 3]; b += st[j * 5 + 4]; c++; }
      this.wl[i] = a / c; this.wr[i] = b / c;
    }
  }
  /** Position `l` metres left of the centreline at distance `s`, and the downstream direction there. */
  at(s: number, l: number, out: { x: number; y: number; z: number; dx: number; dz: number; wl: number; wr: number }) {
    const f = Math.min(this.n - 1.001, Math.max(0, s / RIVER_STEP)), i = Math.floor(f), u = f - i, st = this.st;
    const x = st[i * 5] + (st[i * 5 + 5] - st[i * 5]) * u, z = st[i * 5 + 1] + (st[i * 5 + 6] - st[i * 5 + 1]) * u;
    let dx = st[i * 5 + 5] - st[i * 5], dz = st[i * 5 + 6] - st[i * 5 + 1];
    const len = Math.hypot(dx, dz) || 1;
    dx /= len; dz /= len;
    out.x = x + dz * l; out.z = z - dx * l;
    out.y = st[i * 5 + 2] + (st[i * 5 + 7] - st[i * 5 + 2]) * u;
    out.dx = dx; out.dz = dz;
    out.wl = this.wl[i] + (this.wl[i + 1] - this.wl[i]) * u;
    out.wr = this.wr[i] + (this.wr[i + 1] - this.wr[i]) * u;
    return out;
  }
  /** Distance along the river of the station nearest (x, z), searching from a guess. */
  locate(x: number, z: number, guess: number): number {
    let i = Math.min(this.n - 1, Math.max(0, Math.round(guess / RIVER_STEP)));
    const d = (k: number) => (this.st[k * 5] - x) ** 2 + (this.st[k * 5 + 1] - z) ** 2;
    for (let step = 0; step < 400; step++) {
      if (i > 0 && d(i - 1) < d(i)) i--;
      else if (i < this.n - 1 && d(i + 1) < d(i)) i++;
      else break;
    }
    return i * RIVER_STEP;
  }
  level(s: number) { const i = Math.min(this.n - 1, Math.max(0, Math.round(s / RIVER_STEP))); return this.st[i * 5 + 2]; }
}

/** A circuit in a pool: upstream on the left, round, downstream on the right, round. */
class Circuit {
  private st: Stations;
  private a: number; private b: number; private up: number; private down: number;
  readonly length: number;
  private R: number;
  constructor(st: Stations, a: number, b: number, up: number, down: number) {
    this.st = st;
    this.a = a; this.b = b; this.up = up; this.down = down;
    const p = st.at((a + b) / 2, 0, tmp);
    this.R = Math.min(60, (up * p.wl + down * p.wr) / 2);
    this.length = 2 * (b - a) + 2 * Math.PI * this.R;
  }
  /** Distance along and lateral offset at u metres round the circuit. */
  place(u: number): [number, number] {
    const L = this.b - this.a, T = Math.PI * this.R;
    u = ((u % this.length) + this.length) % this.length;
    const lat = (s: number, side: number) => { const p = this.st.at(s, 0, tmp); return side > 0 ? this.up * p.wl : -this.down * p.wr; };
    if (u < L) { const s = this.b - u; return [s, lat(s, 1)]; }
    u -= L;
    if (u < T) { const f = u / T, s = this.a - this.R * Math.sin(Math.PI * f); return [s, lat(this.a, 1) + (lat(this.a, -1) - lat(this.a, 1)) * (0.5 - 0.5 * Math.cos(Math.PI * f))]; }
    u -= T;
    if (u < L) { const s = this.a + u; return [s, lat(s, -1)]; }
    u -= L;
    const f = u / T, s = this.b + this.R * Math.sin(Math.PI * f);
    return [s, lat(this.b, -1) + (lat(this.b, 1) - lat(this.b, -1)) * (0.5 - 0.5 * Math.cos(Math.PI * f))];
  }
}
const tmp = { x: 0, y: 0, z: 0, dx: 0, dz: 0, wl: 0, wr: 0 };

interface Agent { x: number; z: number; th: number; w: number; wt: number; v: number; vt: number; s: number; rest: number; flap: number; home?: [number, number] }

export class RiverLife {
  readonly group = new THREE.Group();
  private st: Stations;
  private bank: Uint8Array;
  private level: Int16Array;
  private bm: LifeMeta['bank'];
  private tours: { c: Circuit; u0: number; v: number; kind: number; len: number }[] = [];
  private rowers: { c: Circuit; u0: number; v: number }[] = [];
  private pedal: Agent[] = [];
  private kayaks: Agent[] = [];
  private pedalRange: [number, number];
  private swans: Agent[] = [];
  private boats: THREE.InstancedMesh[];
  private pedalMesh: THREE.InstancedMesh;
  private kayakMesh: THREE.InstancedMesh;
  private eightMesh: THREE.InstancedMesh;
  private swanMesh: THREE.InstancedMesh;
  private wakeMesh: THREE.InstancedMesh;
  private flap: THREE.InstancedBufferAttribute;
  private moored: number[][];
  private pontoonAt: number[];
  private pontoonMesh: THREE.InstancedMesh;
  private rand: () => number;
  /** Lamps of the boats in view at night: x, y, z, kind (1 white, 0 red). */
  readonly lamps: number[] = [];

  constructor(meta: LifeMeta, river: Float32Array, bank: Uint8Array, level: Int16Array) {
    this.st = new Stations(river);
    this.bank = bank;
    this.level = level;
    this.bm = meta.bank;
    this.moored = meta.moored;
    this.pontoonAt = meta.pontoon;
    const mk = meta.river.marks, pools = meta.river.pools;
    const pool = (s: number) => pools.find(([a, b]) => s >= a && s <= b) ?? [s - 200, s + 200];
    // Tour boats: above Palacký Bridge up to the Šítkov weir, the Legion Bridge pool, and two from
    // Charles Bridge down past Čechův Bridge.
    const pA = pool(mk.palacky), pB = pool(mk.legion), pC = pool(mk.cechuv);
    const circuits: [Circuit, number][] = [
      [new Circuit(this.st, Math.max(pA[0], mk.railway - 150) + 70, pA[1] - 90, 0.42, 0.42), 1],
      [new Circuit(this.st, pB[0] + 80, pB[1] - 80, 0.35, 0.3), 1],
      [new Circuit(this.st, Math.max(pC[0], mk.charles) + 90, Math.min(pC[1] - 90, mk.cechuv + 380), 0.4, 0.4), 2],
    ];
    const r = rng(11);
    this.rand = rng(5);
    // A place in the water at least `clear` metres from the bank near (x, z), or (x, z).
    const wet = (x: number, z: number, spread: number, clear: number): [number, number] => {
      for (let k = 0; k < 60; k++) {
        const px = x + (r() - 0.5) * spread, pz = z + (r() - 0.5) * spread;
        if (this.bankAt(px, pz) >= clear) return [px, pz];
      }
      return [x, z];
    };
    for (const [c, n] of circuits)
      for (let k = 0; k < n; k++) this.tours.push({ c, u0: (k / n + r() * 0.2) * c.length, v: 2.8 + r() * 0.8, kind: r() < 0.3 ? 2 : 0, len: 26 + r() * 10 });
    // Rowers: the long pool above the Šítkov weir.
    const rowC = new Circuit(this.st, Math.max(pA[0] + 150, mk.vysehrad - 700), pA[1] - 70, 0.12, 0.12);
    this.rowers.push({ c: rowC, u0: 0, v: 4.6 }, { c: rowC, u0: rowC.length * 0.55, v: 4.9 });
    // Pedal boats: from the pontoon, between Legion Bridge and the Old Town weir, to the middle of its
    // slant across the river (the bank field keeps them off the crest; ranging up to its far end, they
    // slid along it and queued at the lip).
    const weir = meta.river.weirs.find(([a]) => a > mk.legion) ?? [pB[1], pB[1]];
    this.pedalRange = [mk.legion + 25, (weir[0] + weir[1]) / 2];
    for (let k = 0; k < 12; k++) {
      const s = this.pedalRange[0] + r() * (this.pedalRange[1] - this.pedalRange[0]);
      const p = this.st.at(s, 0, tmp);
      const [x, z] = wet(p.x, p.z, 160, 12);
      this.pedal.push({ x, z, th: r() * Math.PI * 2, w: 0, wt: 0, v: 0, vt: 1.1, s, rest: r() * 20, flap: 0 });
    }
    // Kayaks on the same water, quicker, in ones and twos.
    for (let k = 0; k < 6; k++) {
      const s = this.pedalRange[0] + r() * (this.pedalRange[1] - this.pedalRange[0]);
      const p = this.st.at(s, 0, tmp);
      const [x, z] = wet(p.x, p.z, 120, 10);
      this.kayaks.push({ x, z, th: r() * Math.PI * 2, w: 0, wt: 0, v: 0, vt: 1.5, s, rest: r() * 20, flap: 0 });
    }
    for (const [x, , z, n] of meta.swans)
      for (let k = 0; k < n; k++) {
        const [px, pz] = wet(x, z, 16, 3);
        this.swans.push({ x: px, z: pz, th: r() * 6.28, w: 0, wt: 0, v: 0, vt: 0.2, s: this.st.locate(x, z, 0), rest: 0, flap: 30 + r() * 60, home: [x, z] });
      }

    const mat = lifeMaterial({ roughness: 0.5 });
    const add = <T extends THREE.InstancedMesh>(m: T) => { this.group.add(m); return m; };
    this.boats = [0, 1, 2].map((k) => add(lifeMesh(tourBoat(k), mat, 24, { shadow: true, reflect: true })));
    this.pedalMesh = add(lifeMesh(pedalBoat(), mat, 40, { shadow: true, reflect: true }));
    this.kayakMesh = add(lifeMesh(kayak(), mat, 8, { reflect: true }));
    this.kayakMesh.setColorAt(0, KAYAK[0]);
    this.eightMesh = add(lifeMesh(eight(), mat, 4, { reflect: true }));
    this.pontoonMesh = add(lifeMesh(pontoon(), mat, 1, { shadow: true, reflect: true }));
    const swanGeom = swan();
    this.flap = new THREE.InstancedBufferAttribute(new Float32Array(this.swans.length * 4), 4);
    swanGeom.setAttribute('aFlap', this.flap);
    this.swanMesh = add(lifeMesh(swanGeom, lifeMaterial({ roughness: 0.7, wings: true }), this.swans.length, { reflect: true }));
    this.wakeMesh = add(lifeMesh(wake(), lifeMaterial({ roughness: 0.9, transparent: true }), 40));
    this.wakeMesh.receiveShadow = false;
    this.wakeMesh.renderOrder = 2;
    this.pedalMesh.setColorAt(0, PEDAL[0]);
  }

  private bankAt(x: number, z: number): number {
    const b = this.bm, i = Math.round((x - b.x0) / b.cell), j = Math.round((z - b.z0) / b.cell);
    return i >= 0 && j >= 0 && i < b.nx && j < b.nz ? this.bank[j * b.nx + i] : 0;
  }

  /** The water's level at a place (bilinear over the 5 m cells), or the centreline's at distance s. */
  private waterAt(x: number, z: number, s: number): number {
    const b = this.bm, fx = (x - b.x0) / b.cell, fz = (z - b.z0) / b.cell, i = Math.floor(fx), j = Math.floor(fz);
    if (i < 0 || j < 0 || i >= b.nx - 1 || j >= b.nz - 1) return this.st.level(s);
    const u = fx - i, v = fz - j, L = this.level, k = j * b.nx + i;
    const a = L[k], c = L[k + 1], d = L[k + b.nx], e = L[k + b.nx + 1];
    if (a === -32768 || c === -32768 || d === -32768 || e === -32768) {
      const n = [a, c, d, e].filter((q) => q !== -32768);
      return n.length ? n.reduce((p, q) => p + q, 0) / n.length / 100 : this.st.level(s);
    }
    return ((a * (1 - u) + c * u) * (1 - v) + (d * (1 - u) + e * u) * v) / 100;
  }

  /** One step of a meandering agent: wander, keep off the bank (and weirs), stay in [s0, s1] or near home. */
  private steer(a: Agent, dt: number, r: () => number, s0: number, s1: number, clear: number, others: Agent[]) {
    a.wt += dt;
    if (a.wt > 4) { a.wt = 0; a.w = (r() - 0.5) * 0.25; }
    let turn = a.w;
    const cx = Math.cos(a.th), cz = Math.sin(a.th);
    const ahead = clear + 4;
    const bx = a.x + cx * ahead, bz = a.z + cz * ahead;
    if (this.bankAt(bx, bz) < clear) {
      const gx = this.bankAt(bx + 6, bz) - this.bankAt(bx - 6, bz), gz = this.bankAt(bx, bz + 6) - this.bankAt(bx, bz - 6);
      const want = Math.atan2(gz, gx);
      let d = want - a.th;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      turn += Math.sign(d) * 0.6;
    }
    a.s = this.st.locate(a.x, a.z, a.s);
    const f = this.st.at(a.s, 0, tmp);
    if (a.home) {
      const hx = a.home[0] - a.x, hz = a.home[1] - a.z;
      if (hx * hx + hz * hz > 22 * 22) { let d = Math.atan2(hz, hx) - a.th; d = Math.atan2(Math.sin(d), Math.cos(d)); turn += Math.sign(d) * 0.3; }
    } else if (a.s < s0 || a.s > s1) {
      const sgn = a.s < s0 ? 1 : -1;
      let d = Math.atan2(f.dz * sgn, f.dx * sgn) - a.th;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      turn += Math.sign(d) * 0.4;
    }
    for (const o of others) {
      if (o === a) continue;
      const ox = o.x - a.x, oz = o.z - a.z, d2 = ox * ox + oz * oz;
      if (d2 < 100 && ox * cx + oz * cz > 0) turn += (ox * cz - oz * cx > 0 ? 1 : -1) * 0.3;
    }
    a.th += Math.max(-0.5, Math.min(0.5, turn)) * dt;
    a.v += (a.vt - a.v) * Math.min(1, dt * 0.5);
    const nx = a.x + Math.cos(a.th) * a.v * dt, nz = a.z + Math.sin(a.th) * a.v * dt;
    if (this.bankAt(nx, nz) >= 2) { a.x = nx; a.z = nz; } else a.th += Math.PI * 0.5 * dt;
  }

  /** Runs the meandering boats and swans forward by `dt` seconds. */
  simulate(dt: number) {
    const r = this.rand;
    for (const a of this.pedal) {
      a.rest -= dt;
      // Now and then the riders stop pedalling for a while.
      if (a.rest < 0) { const stop = r() < 0.25; a.vt = stop ? 0 : 0.8 + r() * 0.7; a.rest = stop ? 8 + r() * 20 : 20 + r() * 40; }
      this.steer(a, dt, r, this.pedalRange[0], this.pedalRange[1], 16, this.pedal);
    }
    for (const a of this.kayaks) {
      a.rest -= dt;
      if (a.rest < 0) { a.vt = r() < 0.2 ? 0.2 : 1.2 + r() * 0.8; a.rest = 15 + r() * 30; }
      this.steer(a, dt, r, this.pedalRange[0], this.pedalRange[1], 10, this.kayaks);
    }
    for (const a of this.swans) {
      a.rest -= dt;
      if (a.rest < 0) { a.vt = r() < 0.4 ? 0.05 : 0.15 + r() * 0.25; a.rest = 6 + r() * 14; }
      a.flap -= dt;
      if (a.flap < -2.2) a.flap = 40 + r() * 80;
      this.steer(a, dt, r, 0, this.st.length, 4, this.swans);
    }
  }

  update(time: number, dt: number, hour: number, eye: THREE.Vector3, night: boolean) {
    this.simulate(Math.min(dt, 0.25));
    this.lamps.length = 0;
    const range2 = (1800 + Math.max(0, eye.y) * 3) ** 2;
    const near = (x: number, z: number) => (x - eye.x) ** 2 + (z - eye.z) ** 2 < range2;
    for (const m of this.boats) m.count = 0;
    this.wakeMesh.count = 0;
    const p = { ...tmp }, q = { ...tmp };
    const wake = (x: number, y: number, z: number, dx: number, dz: number, len: number, width: number) => {
      if (this.wakeMesh.count < 40) setPose(this.wakeMesh, this.wakeMesh.count++, x, y + 0.06, z, dx, dz, len, 1, width);
    };
    // Tour boats on their circuits.
    for (const b of this.tours) {
      const u = b.u0 + b.v * time;
      const [s, l] = b.c.place(u), [s2, l2] = b.c.place(u + 2);
      this.st.at(s, l, p); this.st.at(s2, l2, q);
      if (!near(p.x, p.z)) continue;
      const dx = q.x - p.x, dz = q.z - p.z, dl = Math.hypot(dx, dz) || 1;
      const m = this.boats[b.kind];
      p.y = this.waterAt(p.x, p.z, s);
      setPose(m, m.count++, p.x, p.y, p.z, dx / dl, dz / dl, b.len / 30);
      wake(p.x, p.y, p.z, dx / dl, dz / dl, b.len, b.len * 0.9);
      if (night) this.lamps.push(p.x + (dx / dl) * b.len * 0.45, p.y + 3.5, p.z + (dz / dl) * b.len * 0.45, 1);
    }
    // Moored boats and the pontoon.
    for (const [x, y, z, h, len, kind] of this.moored) {
      if (!near(x, z)) continue;
      const m = this.boats[kind];
      if (m.count < 24) setPose(m, m.count++, x, y, z, Math.sin(h), -Math.cos(h), len / 30);
    }
    for (const m of this.boats) commit(m);
    {
      const [x, y, z, h] = this.pontoonAt;
      this.pontoonMesh.count = 0;
      if (x !== undefined && near(x, z)) setPose(this.pontoonMesh, this.pontoonMesh.count++, x, y, z, Math.sin(h), -Math.cos(h));
      commit(this.pontoonMesh);
    }
    // Rowing eights, in the morning.
    this.eightMesh.count = 0;
    if (hour > 5.5 && hour < 10.5)
      for (const b of this.rowers) {
        const u = b.u0 + b.v * time, [s, l] = b.c.place(u), [s2, l2] = b.c.place(u + 2);
        this.st.at(s, l, p); this.st.at(s2, l2, q);
        if (!near(p.x, p.z)) continue;
        const dx = q.x - p.x, dz = q.z - p.z, dl = Math.hypot(dx, dz) || 1;
        p.y = this.waterAt(p.x, p.z, s);
        setPose(this.eightMesh, this.eightMesh.count++, p.x, p.y, p.z, dx / dl, dz / dl);
        wake(p.x, p.y, p.z, dx / dl, dz / dl, 17.6, 9);
      }
    commit(this.eightMesh);
    // Pedal boats out by day; the rest tied up at the pontoon on its water side, bows to it.
    this.pedalMesh.count = 0;
    const out = hour > 9 && hour < 21.5;
    let tied = 7;
    this.pedal.forEach((a, k) => {
      if (!out) { tied++; return; }
      if (!near(a.x, a.z)) return;
      const dx = Math.cos(a.th), dz = Math.sin(a.th), y = this.waterAt(a.x, a.z, a.s);
      this.pedalMesh.setColorAt(this.pedalMesh.count, PEDAL[k % PEDAL.length]);
      setPose(this.pedalMesh, this.pedalMesh.count++, a.x, y, a.z, dx, dz);
      if (a.v > 0.3) wake(a.x, y, a.z, dx, dz, 3.5, 3.5 * Math.min(1, a.v));
    });
    {
      const [x, y, z, h] = this.pontoonAt;
      if (x !== undefined && near(x, z))
        for (let k = 0; k < tied; k++) {
          const fx = Math.sin(h), fz = -Math.cos(h), row = k < 10 ? 0 : 1, off = ((k % 10) - 4.5) * 2.2;
          const side = 3.6 + row * 3.6;
          this.pedalMesh.setColorAt(this.pedalMesh.count, PEDAL[(k * 5) % PEDAL.length]);
          setPose(this.pedalMesh, this.pedalMesh.count++, x + fx * off - fz * side, y, z + fz * off + fx * side, fz, -fx);
        }
    }
    commit(this.pedalMesh);
    this.kayakMesh.count = 0;
    if (out)
      this.kayaks.forEach((a, k) => {
        if (!near(a.x, a.z)) return;
        const dx = Math.cos(a.th), dz = Math.sin(a.th), y = this.waterAt(a.x, a.z, a.s);
        this.kayakMesh.setColorAt(this.kayakMesh.count, KAYAK[k % KAYAK.length]);
        setPose(this.kayakMesh, this.kayakMesh.count++, a.x, y, a.z, dx, dz);
        if (a.v > 0.4) wake(a.x, y, a.z, dx, dz, 4.3, 3.0 * Math.min(1, a.v / 1.5));
      });
    commit(this.kayakMesh);
    // Swans, flapping now and then.
    this.swanMesh.count = 0;
    for (const a of this.swans) {
      if (!near(a.x, a.z)) continue;
      const k = this.swanMesh.count++;
      setPose(this.swanMesh, k, a.x, this.waterAt(a.x, a.z, a.s), a.z, Math.cos(a.th), Math.sin(a.th));
      const open = a.flap < 0 ? Math.min(1, -a.flap * 3, (2.2 + a.flap) * 3) : 0;
      this.flap.setXYZW(k, open, 0.7, k * 1.7, 9);
    }
    commit(this.swanMesh);
    commit(this.wakeMesh);
  }
}
