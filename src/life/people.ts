// People (design.md §8.8): simple figures in muted clothes walking the paths tools/lib/life.ts lays
// out on Charles Bridge, Old Town Square and the lanes between, Kampa, the quays and Petřín's
// gardens; a few stand. How many walk follows the hour: few before nine, the most from noon to six.
// Each walks to and fro along its path from a phase and a speed, so the clock alone places them.

import * as THREE from 'three';
import { Shape, rgb, setPose, rng, lifeMesh, commit } from './shapes.ts';
import { lifeMaterial } from './material.ts';
import { Zone, SCALE, unpackRun, type LifeMeta } from '../core/life.ts';

/** People in each zone at the busiest hour. */
const PEAK: Record<number, number> = { [Zone.Bridge]: 650, [Zone.Square]: 420, [Zone.Lanes]: 260, [Zone.Kampa]: 110, [Zone.Quay]: 300, [Zone.Petrin]: 150 };

/** The share of the peak out at an hour, by zone. */
function density(zone: number, h: number): number {
  const ramp = (a: number, b: number, va: number, vb: number) => va + (vb - va) * Math.min(1, Math.max(0, (h - a) / (b - a)));
  let d = h < 6 ? 0.06 : h < 9 ? ramp(6, 9, 0.08, 0.4) : h < 12 ? ramp(9, 12, 0.4, 1) : h < 18 ? 1 : h < 21 ? ramp(18, 21, 1, 0.65) : ramp(21, 23, 0.65, 0.3);
  if (zone === Zone.Quay) d = h < 12 ? d * 0.6 : h < 21.5 ? Math.max(d, 0.9) : d;
  if (zone === Zone.Petrin && h > 18) d *= ramp(18, 21, 1, 0.3);
  return d;
}

/** Summer clothes, muted: whites, beiges, denim, navy, greys, black, an olive, a few colours. */
const CLOTHES = ['#e8e4dc', '#d9cfbd', '#c2b49a', '#5b6f8c', '#34405a', '#23272e', '#6d7074', '#9aa0a6', '#f0ede6', '#4e5a3e', '#8c3b35', '#b98a5e', '#7fa3b8', '#c9a3a6', '#2f3a4a']
  .map((h) => new THREE.Color(h));

function figure(): THREE.BufferGeometry {
  const s = new Shape();
  s.box(-0.13, 0, -0.17, 0.13, 0.84, 0.17, rgb('#3a3c40'));
  s.tint = 1;
  s.box(-0.14, 0.84, -0.22, 0.14, 1.44, 0.22, [1, 1, 1]);
  s.tint = 0;
  s.box(-0.1, 1.44, -0.09, 0.1, 1.68, 0.09, rgb('#c19a80'));
  s.box(-0.11, 1.6, -0.1, 0.09, 1.72, 0.1, rgb('#4a3a2e'));
  return s.geometry();
}

interface Walker { path: number; phase: number; v: number; lat: number; rank: number; colour: number }
interface Path { zone: number; x: Float32Array; y: Float32Array; z: Float32Array; s: Float32Array; width: number; box: [number, number, number, number] }

export class People {
  readonly group = new THREE.Group();
  private paths: Path[] = [];
  private walkers: Walker[][] = [];
  private zoneBox: [number, number, number, number][] = [];
  private mesh: THREE.InstancedMesh;

  constructor(meta: LifeMeta, packed: Int16Array) {
    for (const w of meta.walks) {
      const pts = unpackRun(packed, w.start, w.count, w.first, SCALE.walk);
      const n = w.count, x = new Float32Array(n), y = new Float32Array(n), z = new Float32Array(n), s = new Float32Array(n);
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (let i = 0; i < n; i++) {
        const k = i * 3;
        x[i] = pts[k]; y[i] = pts[k + 1]; z[i] = pts[k + 2];
        s[i] = i ? s[i - 1] + Math.hypot(x[i] - x[i - 1], z[i] - z[i - 1]) : 0;
        x0 = Math.min(x0, x[i]); x1 = Math.max(x1, x[i]); z0 = Math.min(z0, z[i]); z1 = Math.max(z1, z[i]);
      }
      this.paths.push({ zone: w.zone, x, y, z, s, width: w.width, box: [x0, x1, z0, z1] });
    }
    // Walkers per zone, spread over its paths by length; the rank decides who is out at an hour.
    const r = rng(23);
    let total = 0;
    for (const zone of Object.values(Zone)) {
      const paths = this.paths.map((p, i) => ({ p, i })).filter((q) => q.p.zone === zone);
      const len = paths.reduce((a, q) => a + q.p.s[q.p.s.length - 1], 0);
      const list: Walker[] = [];
      const box: [number, number, number, number] = [Infinity, -Infinity, Infinity, -Infinity];
      for (const { p } of paths) { box[0] = Math.min(box[0], p.box[0]); box[1] = Math.max(box[1], p.box[1]); box[2] = Math.min(box[2], p.box[2]); box[3] = Math.max(box[3], p.box[3]); }
      if (len > 0)
        for (let k = 0; k < PEAK[zone]; k++) {
          let pick = r() * len, q = paths[0];
          for (const c of paths) { pick -= c.p.s[c.p.s.length - 1]; q = c; if (pick <= 0) break; }
          const stand = r() < 0.18;
          list.push({ path: q.i, phase: r(), v: stand ? 0 : 1.0 + r() * 0.5, lat: (r() - 0.5) * q.p.width, rank: r(), colour: Math.floor(r() * CLOTHES.length) });
        }
      list.sort((a, b) => a.rank - b.rank);
      this.walkers[zone] = list;
      this.zoneBox[zone] = box;
      total += list.length;
    }
    this.mesh = lifeMesh(figure(), lifeMaterial({ roughness: 0.85 }), total);
    this.mesh.setColorAt(0, CLOTHES[0]);
    this.group.add(this.mesh);
  }

  update(time: number, hour: number, eye: THREE.Vector3) {
    const range = 700 + Math.max(0, eye.y) * 0.8, r2 = range * range;
    let n = 0;
    for (let zone = 0; zone < this.walkers.length; zone++) {
      const box = this.zoneBox[zone], list = this.walkers[zone];
      if (!list?.length || eye.x < box[0] - range || eye.x > box[1] + range || eye.z < box[2] - range || eye.z > box[3] + range) continue;
      const out = Math.round(list.length * density(zone, hour));
      for (let k = 0; k < out; k++) {
        const w = list[k], p = this.paths[w.path], L = p.s[p.s.length - 1];
        // To the end and back: distance u round a loop of twice the path.
        const u = (w.phase * 2 * L + w.v * time) % (2 * L), back = u > L, s = back ? 2 * L - u : u;
        let i = 0, lo = 0, hi = p.s.length - 2;
        while (lo < hi) { const m = (lo + hi + 1) >> 1; if (p.s[m] <= s) lo = m; else hi = m - 1; }
        i = lo;
        const seg = p.s[i + 1] - p.s[i] || 1, f = (s - p.s[i]) / seg;
        let dx = (p.x[i + 1] - p.x[i]) / seg, dz = (p.z[i + 1] - p.z[i]) / seg;
        const x = p.x[i] + (p.x[i + 1] - p.x[i]) * f - dz * w.lat, z = p.z[i] + (p.z[i + 1] - p.z[i]) * f + dx * w.lat;
        if ((x - eye.x) ** 2 + (z - eye.z) ** 2 > r2) continue;
        if (back) { dx = -dx; dz = -dz; }
        this.mesh.setColorAt(n, CLOTHES[w.colour]);
        setPose(this.mesh, n++, x, p.y[i] + (p.y[i + 1] - p.y[i]) * f, z, dx, dz);
      }
    }
    this.mesh.count = n;
    commit(this.mesh);
  }
}
