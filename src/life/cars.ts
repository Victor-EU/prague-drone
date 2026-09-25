// Cars (design.md §8.8): sparse, on the embankment roads only, at 40 km/h, each lane from the
// build (tools/lib/life.ts) carrying a car every quarter of a minute or so. All at one speed, so
// none overtakes another; the clock alone places them. Headlights and tail lights after dusk.

import * as THREE from 'three';
import { Shape, rgb, setPose, lifeMesh, commit } from './shapes.ts';
import { lifeMaterial } from './material.ts';
import { REFLECT } from '../render/reflection.ts';
import { SCALE, unpackRun, type LifeMeta } from '../core/life.ts';

const SPEED = 40 / 3.6, GAP = 17;
const PAINT = ['#c4c6c8', '#e9e9e6', '#1f2124', '#4b4f55', '#2a3752', '#7d2a26', '#d7d1c3', '#39443a', '#9aa2aa', '#e6e3dc'].map((h) => new THREE.Color(h));

function car(): THREE.BufferGeometry {
  const s = new Shape(), GLASS = rgb('#1e2327'), TYRE = rgb('#1b1b1b');
  s.box(-1.55, 0.12, -0.92, -0.95, 0.62, 0.92, TYRE);
  s.box(0.95, 0.12, -0.92, 1.55, 0.62, 0.92, TYRE);
  s.tint = 1;
  s.box(-2.15, 0.3, -0.88, 2.15, 0.86, 0.88, [1, 1, 1]);
  s.tint = 0;
  s.glow = 0.3;
  const cabin: [number, number][] = [[-1.45, -0.8], [0.75, -0.8], [0.75, 0.8], [-1.45, 0.8]];
  const roof: [number, number][] = [[-1.2, -0.72], [0.35, -0.72], [0.35, 0.72], [-1.2, 0.72]];
  s.band(cabin, 0.86, roof, 1.38, () => GLASS);
  s.glow = 0;
  s.tint = 1;
  s.lid(roof, 1.38, [1, 1, 1], 1);
  s.tint = 0;
  return s.geometry();
}

interface Lane { x: Float32Array; y: Float32Array; z: Float32Array; s: Float32Array; phase: number; box: [number, number, number, number] }

export class Cars {
  readonly group = new THREE.Group();
  private lanes: Lane[] = [];
  private mesh: THREE.InstancedMesh;
  /** Lamps of the cars in view at night: x, y, z, and 1 for a headlight, 0 for a tail light. */
  readonly lamps: number[] = [];

  constructor(meta: LifeMeta, packed: Int16Array) {
    meta.roads.forEach((r, li) => {
      const pts = unpackRun(packed, r.start, r.count, r.first, SCALE.road);
      const n = r.count, x = new Float32Array(n), y = new Float32Array(n), z = new Float32Array(n), s = new Float32Array(n);
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (let i = 0; i < n; i++) {
        const k = i * 3;
        x[i] = pts[k]; y[i] = pts[k + 1]; z[i] = pts[k + 2];
        s[i] = i ? s[i - 1] + Math.hypot(x[i] - x[i - 1], z[i] - z[i - 1]) : 0;
        x0 = Math.min(x0, x[i]); x1 = Math.max(x1, x[i]); z0 = Math.min(z0, z[i]); z1 = Math.max(z1, z[i]);
      }
      this.lanes.push({ x, y, z, s, phase: (li * 7.3) % GAP, box: [x0, x1, z0, z1] });
    });
    this.mesh = lifeMesh(car(), lifeMaterial({ roughness: 0.35, metalness: 0.3, glow: 0.05 }), 400, { shadow: true, reflect: true });
    this.mesh.setColorAt(0, PAINT[0]);
    this.mesh.layers.enable(REFLECT);
    this.group.add(this.mesh);
  }

  update(time: number, eye: THREE.Vector3, night: boolean) {
    const range = 900 + Math.max(0, eye.y), r2 = range * range;
    let n = 0;
    this.lamps.length = 0;
    this.lanes.forEach((l, li) => {
      if (eye.x < l.box[0] - range || eye.x > l.box[1] + range || eye.z < l.box[2] - range || eye.z > l.box[3] + range) return;
      const L = l.s[l.s.length - 1], now = time - l.phase;
      for (let j = Math.ceil((now - L / SPEED) / GAP) - 1; j <= Math.floor(now / GAP); j++) {
        // Entry times wander by up to a third of the gap; gaps of a whole minute now and then.
        const h = Math.sin(li * 91.7 + j * 12.9898) * 43758.5453, u = h - Math.floor(h);
        if (u < 0.25) continue;
        const s = (now - j * GAP - u * GAP * 0.33) * SPEED;
        if (s < 0 || s > L) continue;
        let lo = 0, hi = l.s.length - 2;
        while (lo < hi) { const m = (lo + hi + 1) >> 1; if (l.s[m] <= s) lo = m; else hi = m - 1; }
        const seg = l.s[lo + 1] - l.s[lo] || 1, f = (s - l.s[lo]) / seg;
        const x = l.x[lo] + (l.x[lo + 1] - l.x[lo]) * f, z = l.z[lo] + (l.z[lo + 1] - l.z[lo]) * f, y = l.y[lo] + (l.y[lo + 1] - l.y[lo]) * f;
        if ((x - eye.x) ** 2 + (z - eye.z) ** 2 > r2 || n >= 400) continue;
        const dx = (l.x[lo + 1] - l.x[lo]) / seg, dz = (l.z[lo + 1] - l.z[lo]) / seg;
        this.mesh.setColorAt(n, PAINT[Math.floor(u * 1000) % PAINT.length]);
        setPose(this.mesh, n++, x, y, z, dx, dz);
        if (night)
          for (const side of [-0.62, 0.62]) {
            this.lamps.push(x + dx * 2.15 - dz * side, y + 0.62, z + dz * 2.15 + dx * side, 1);
            this.lamps.push(x - dx * 2.15 - dz * side, y + 0.7, z - dz * 2.15 + dx * side, 0);
          }
      }
    });
    this.mesh.count = n;
    commit(this.mesh);
  }
}
