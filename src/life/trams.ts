// Trams (design.md §8.8) on the day lines' routes that tools/lib/life.ts lays out: every run carries
// the time a tram takes to reach each point from its start, 10 s at every stop included, and a
// phase; a tram of the run enters it every headway. Two liveries: the red and cream Tatra T3,
// mostly as coupled pairs, and the three-section Škoda 15T, red below, white above a black window
// band. Positions follow from the clock alone, so nothing is simulated.

import * as THREE from 'three';
import { Shape, rgb, capsulePlan, inset, type Outline, type RGB } from './shapes.ts';
import { commit } from './shapes.ts';
import { lifeMaterial } from './material.ts';
import { REFLECT } from '../render/reflection.ts';
import { SCALE, unpackRun, type LifeMeta } from '../core/life.ts';

const RED = rgb('#c8352a'), CREAM = rgb('#f2ede6'), GLASS = rgb('#1c2024'), DARK = rgb('#2e2d2b'), ROOF = rgb('#cfcbc2');
const WHITE = rgb('#ecebe6'), GREY = rgb('#8e9296'), BLACK = rgb('#151719'), PANTO = rgb('#6f6a5c'), BELLOWS = rgb('#232323');

/** How a tram's cars hang behind its front: per car, the model and its length along the track. */
const T3_LEN = 15.1, FT_LEN = [11.3, 8.6, 11.3];

function pantograph(s: Shape, x: number, roof: number) {
  s.box(x - 0.8, roof, -0.55, x + 0.8, roof + 0.12, 0.55, DARK);
  // Arms folding up to the wire, 5.6 m above the rail, and the collector across the top.
  const top = 5.55;
  s.beam([x - 0.7, roof + 0.12, 0], [x + 0.35, (roof + top) / 2 + 0.2, 0], 0.07, PANTO);
  s.beam([x + 0.35, (roof + top) / 2 + 0.2, 0], [x - 0.2, top - 0.05, 0], 0.06, PANTO);
  s.box(x - 0.35, top - 0.08, -0.85, x - 0.05, top, 0.85, DARK);
}

/** Pillars of a window band along a car: [x0, x1] pairs, windows between them. */
function pillars(len: number, first: number, pitch: number, w: number): number[][] {
  const out: number[][] = [];
  for (let x = -len / 2 + first; x < len / 2 - first + 0.01; x += pitch) out.push([x - w / 2, x + w / 2]);
  return out;
}

function sidePoints(p: number[][]): number[] { return p.flat(); }

/** A tram body: bands from the skirt to the roof; `bands` gives heights and colours, `win` the window band. */
function body(s: Shape, plan: Outline, bands: { y0: number; y1: number; col: RGB | ((x: number, z: number) => RGB); glow?: number }[], roof: { y: number; col: RGB; inset: number; top: number }) {
  for (const b of bands) {
    s.glow = b.glow ?? 0;
    s.prism(plan, b.y0, b.y1, typeof b.col === 'function' ? b.col : () => b.col as RGB);
  }
  s.glow = 0;
  const top = inset(plan, roof.inset, roof.inset);
  s.band(plan, roof.y, top, roof.top, () => roof.col);
  s.lid(top, roof.top, roof.col, 1);
}

/** The Tatra T3: 14 m over the body, cream roof and skirt stripe, red below the windows. */
function t3(): THREE.BufferGeometry {
  const s = new Shape(), L = 14, W = 2.5;
  const pil = pillars(L, 1.6, 1.42, 0.2);
  const plan = capsulePlan(L, W, 1.1, 0.8, sidePoints(pil));
  const inPillar = (x: number, z: number) => Math.abs(z) > W / 2 - 0.2 && pil.some(([a, b]) => x > a - 0.01 && x < b + 0.01);
  body(s, plan, [
    { y0: 0.45, y1: 0.62, col: CREAM },
    { y0: 0.62, y1: 1.32, col: RED },
    { y0: 1.32, y1: 2.28, col: (x, z) => (inPillar(x, z) ? CREAM : GLASS), glow: 1 },
    { y0: 2.28, y1: 2.72, col: CREAM },
  ], { y: 2.72, col: ROOF, inset: 0.3, top: 3.06 });
  // The bogies under the body, set in.
  s.box(-5.2, 0.12, -1.05, -2.6, 0.45, 1.05, DARK);
  s.box(2.6, 0.12, -1.05, 5.2, 0.45, 1.05, DARK);
  s.box(-1.2, 3.06, -0.7, 1.2, 3.3, 0.7, rgb('#b9b5ad'));
  pantograph(s, -0.2, 3.3);
  return s.geometry();
}

/** A section of the 15T: 'front' has the cab and the rounded nose, 'rear' the rounded tail. */
function ft(kind: 'front' | 'mid' | 'rear'): THREE.BufferGeometry {
  const s = new Shape(), L = kind === 'mid' ? FT_LEN[1] - 0.6 : FT_LEN[0] - 0.6, W = 2.46;
  const pil = pillars(L, 1.2, 1.6, 0.14);
  const nose = kind === 'front' ? 1.0 : 0.05, tail = kind === 'rear' ? 0.9 : 0.05;
  const plan = capsulePlan(L, W, nose, tail, sidePoints(pil));
  const inPillar = (x: number, z: number) => Math.abs(z) > W / 2 - 0.2 && pil.some(([a, b]) => x > a - 0.01 && x < b + 0.01);
  body(s, plan, [
    { y0: 0.3, y1: 1.02, col: RED },
    { y0: 1.02, y1: 1.08, col: WHITE },
    { y0: 1.08, y1: 2.3, col: (x, z) => (inPillar(x, z) ? BLACK : GLASS), glow: 1 },
    { y0: 2.3, y1: 2.9, col: WHITE },
  ], { y: 2.9, col: GREY, inset: 0.25, top: 3.15 });
  // Equipment on the roof, and the bellows to the next section.
  s.box(-L / 2 + 1.2, 3.15, -0.8, L / 2 - 1.2, 3.5, 0.8, GREY);
  if (kind !== 'rear') s.box(-L / 2 - 0.65, 0.4, -1.12, -L / 2 + 0.05, 2.9, 1.12, BELLOWS);
  if (kind === 'mid') pantograph(s, 0, 3.5);
  return s.geometry();
}

interface TramRun { x: Float32Array; y: Float32Array; z: Float32Array; t: Float32Array; s: Float32Array; phase: number; headway: number; T: number; line: string; box: [number, number, number, number] }

/** Index i with a[i] <= v < a[i + 1] (a sorted), clamped to the ends. */
function search(a: Float32Array, v: number): number {
  let lo = 0, hi = a.length - 2;
  if (v <= a[0]) return 0;
  if (v >= a[hi + 1]) return hi;
  while (lo < hi) {
    const m = (lo + hi + 1) >> 1;
    if (a[m] <= v) lo = m; else hi = m - 1;
  }
  return lo;
}

export class Trams {
  readonly group = new THREE.Group();
  private runs: TramRun[] = [];
  private t3: THREE.InstancedMesh;
  private ft: THREE.InstancedMesh[];
  private m = new THREE.Matrix4();
  private a = new THREE.Vector3();
  private b = new THREE.Vector3();
  private X = new THREE.Vector3();
  private Y = new THREE.Vector3();
  private Z = new THREE.Vector3();
  /** Front and rear lamps of the trams in view, for the night: x, y, z, and 1 for a headlight, 0 for a tail light. */
  readonly lamps: number[] = [];
  /** Trams drawn in the last update. */
  shown = 0;

  constructor(meta: LifeMeta, packed: Int16Array) {
    for (const r of meta.trams) {
      const pts = unpackRun(packed, r.start, r.count, r.first, SCALE.tram);
      const n = r.count, x = new Float32Array(n), y = new Float32Array(n), z = new Float32Array(n), t = new Float32Array(n), s = new Float32Array(n);
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (let i = 0; i < n; i++) {
        const k = i * 4;
        x[i] = pts[k]; y[i] = pts[k + 1]; z[i] = pts[k + 2]; t[i] = pts[k + 3];
        s[i] = i ? s[i - 1] + Math.hypot(x[i] - x[i - 1], z[i] - z[i - 1]) : 0;
        x0 = Math.min(x0, x[i]); x1 = Math.max(x1, x[i]); z0 = Math.min(z0, z[i]); z1 = Math.max(z1, z[i]);
      }
      this.runs.push({ x, y, z, t, s, phase: r.phase, headway: r.headway, T: t[n - 1], line: r.line, box: [x0, x1, z0, z1] });
    }
    const mat = lifeMaterial({ roughness: 0.45 });
    const mesh = (g: THREE.BufferGeometry, n: number) => {
      const im = new THREE.InstancedMesh(g, mat, n);
      im.count = 0;
      im.castShadow = im.receiveShadow = true;
      im.frustumCulled = false;
      im.layers.enable(REFLECT);
      this.group.add(im);
      return im;
    };
    this.t3 = mesh(t3(), 512);
    this.ft = [mesh(ft('front'), 256), mesh(ft('mid'), 256), mesh(ft('rear'), 256)];
  }

  /** Point at distance s along a run into `out`. */
  private at(r: TramRun, s: number, out: THREE.Vector3) {
    const i = search(r.s, s), d = r.s[i + 1] - r.s[i], f = d > 1e-6 ? Math.min(1, Math.max(0, (s - r.s[i]) / d)) : 0;
    return out.set(r.x[i] + (r.x[i + 1] - r.x[i]) * f, r.y[i] + (r.y[i + 1] - r.y[i]) * f, r.z[i] + (r.z[i + 1] - r.z[i]) * f);
  }

  /** Places a car whose front end is at distance `s`, `len` long, into `mesh`. */
  private car(r: TramRun, s: number, len: number, mesh: THREE.InstancedMesh, flip = false) {
    if (s - len < 0 || s > r.s[r.s.length - 1]) return false;
    // Bogies a fifth of the car in from its ends.
    this.at(r, s - len * 0.2, this.a);
    this.at(r, s - len * 0.8, this.b);
    const fx = this.a.x - this.b.x, fy = this.a.y - this.b.y, fz = this.a.z - this.b.z, l = Math.hypot(fx, fy, fz) || 1;
    const { X, Y, Z } = this;
    X.set(fx / l, fy / l, fz / l);
    if (flip) X.negate();
    Z.set(-X.z, 0, X.x).normalize();
    Y.crossVectors(Z, X);
    this.m.makeBasis(X, Y, Z);
    this.m.setPosition((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2, (this.a.z + this.b.z) / 2);
    mesh.setMatrixAt(mesh.count++, this.m);
    return true;
  }

  update(time: number, eye: THREE.Vector3, range: number, night: boolean) {
    this.t3.count = 0;
    for (const m of this.ft) m.count = 0;
    this.lamps.length = 0;
    this.shown = 0;
    const r2 = range * range;
    for (let ri = 0; ri < this.runs.length; ri++) {
      const r = this.runs[ri];
      if (eye.x < r.box[0] - range || eye.x > r.box[1] + range || eye.z < r.box[2] - range || eye.z > r.box[3] + range) continue;
      // Trams on the run now: those that entered at phase + j × headway within the last T seconds.
      const now = time - r.phase;
      for (let j = Math.ceil((now - r.T) / r.headway); j <= Math.floor(now / r.headway); j++) {
        const tau = now - j * r.headway;
        const i = search(r.t, tau), dt = r.t[i + 1] - r.t[i];
        const f = dt > 1e-6 ? Math.min(1, Math.max(0, (tau - r.t[i]) / dt)) : 0;
        const s = r.s[i] + (r.s[i + 1] - r.s[i]) * f;
        const x = r.x[i], z = r.z[i];
        if ((x - eye.x) ** 2 + (z - eye.z) ** 2 > r2) continue;
        // The livery by the tram: a third are 15T.
        const h = Math.sin(ri * 12.9898 + j * 78.233) * 43758.5453, u = h - Math.floor(h);
        let shown = false;
        if (u < 0.34) {
          if (this.ft[0].count < 256) {
            let at = s;
            this.ft.forEach((m, k) => { shown = this.car(r, at, FT_LEN[k], m) || shown; at -= FT_LEN[k]; });
          }
        } else if (this.t3.count < 510) {
          shown = this.car(r, s, T3_LEN, this.t3);
          // Most T3 run as coupled pairs.
          if (u > 0.5) shown = this.car(r, s - T3_LEN, T3_LEN, this.t3) || shown;
        }
        if (!shown) continue;
        this.shown++;
        if (night) {
          this.at(r, s - 0.3, this.a);
          this.lamps.push(this.a.x, this.a.y + 1.0, this.a.z, 1);
        }
      }
    }
    for (const m of [this.t3, ...this.ft]) commit(m);
  }
}
