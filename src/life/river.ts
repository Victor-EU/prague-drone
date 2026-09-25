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

// ---- Models --------------------------------------------------------------------------------------

/** A tour boat 30 m long (stretched to its length by the instance): 0 modern, 1 old steamer, 2 glass restaurant boat. */
function tourBoat(kind: number): THREE.BufferGeometry {
  const s = new Shape(), L = 30, B = kind === 2 ? 6.6 : 5.6;
  const hull = capsulePlan(L, B, 5.5, 1.6);
  const hullCol = kind === 1 ? DARK : WHITE;
  s.prism(hull, -0.3, 0.35, () => (kind === 1 ? DARK : NAVY));
  s.prism(hull, 0.35, 1.05, () => hullCol);
  s.lid(hull, 1.05, OFF, 1);
  const cabin = inset(hull, 3.2, 0.35);
  const top = kind === 2 ? 2.7 : 2.8;
  s.prism(cabin, 1.05, 1.35, () => WHITE);
  s.glow = 1;
  s.prism(cabin, 1.35, kind === 2 ? 2.5 : 2.35, () => GLASS);
  s.glow = 0;
  s.prism(cabin, kind === 2 ? 2.5 : 2.35, top, () => WHITE);
  s.lid(cabin, top, OFF, 1);
  if (kind !== 2) {
    // The open top deck: a solid white rail round it, benches, the wheelhouse forward.
    const rail = inset(cabin, 0.1, 0.05);
    s.prism(rail, top, top + 0.55, () => WHITE);
    for (let x = -9; x <= 6; x += 1.6) { s.box(x, top, -1.9, x + 0.55, top + 0.45, -0.3, rgb('#35507a')); s.box(x, top, 0.3, x + 0.55, top + 0.45, 1.9, rgb('#35507a')); }
    s.box(8, top, -1.3, 10.2, top + 1.2, 1.3, WHITE);
    s.glow = 1;
    s.box(8.05, top + 0.45, -1.32, 10.25, top + 1.0, 1.32, GLASS);
    s.glow = 0;
  }
  if (kind === 1) {
    s.box(-1, top, -0.5, 0.2, top + 2.3, 0.5, rgb('#1e1e1e'));
    s.box(-1.02, top + 1.6, -0.52, 0.22, top + 1.9, 0.52, rgb('#9b2a22'));
  }
  return s.geometry();
}

/** A pedal boat, white, a coloured band (the instance's colour), two riders. */
function pedalBoat(): THREE.BufferGeometry {
  const s = new Shape();
  const hull = capsulePlan(3.5, 1.9, 1.1, 0.35);
  s.prism(hull, -0.1, 0.32, () => WHITE);
  s.tint = 1;
  s.prism(hull, 0.32, 0.45, () => [1, 1, 1]);
  s.tint = 0;
  s.lid(hull, 0.45, OFF, 1);
  const shirts: RGB[] = [rgb('#e9e4da'), rgb('#3b4452')];
  [-0.45, 0.45].forEach((z, k) => {
    s.box(-0.55, 0.45, z - 0.2, -0.2, 1.05, z + 0.2, shirts[k]);
    s.ellipsoid([-0.38, 1.18, z], [0.11, 0.13, 0.11], rgb('#c9a58a'), 6, 3);
  });
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
  private pedalRange: [number, number];
  private swans: Agent[] = [];
  private boats: THREE.InstancedMesh[];
  private pedalMesh: THREE.InstancedMesh;
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
    // Pedal boats: from the pontoon, between Legion Bridge and the Old Town weir, up to its crest
    // (the bank field keeps them off it; it runs across the river on a slant).
    const weir = meta.river.weirs.find(([a]) => a > mk.legion) ?? [pB[1], pB[1]];
    this.pedalRange = [mk.legion + 25, weir[1]];
    for (let k = 0; k < 12; k++) {
      const s = this.pedalRange[0] + r() * (this.pedalRange[1] - this.pedalRange[0]);
      const p = this.st.at(s, 0, tmp);
      const [x, z] = wet(p.x, p.z, 160, 12);
      this.pedal.push({ x, z, th: r() * Math.PI * 2, w: 0, wt: 0, v: 0, vt: 1.1, s, rest: r() * 20, flap: 0 });
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
      this.steer(a, dt, r, this.pedalRange[0], this.pedalRange[1], 12, this.pedal);
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
