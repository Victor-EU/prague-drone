// Pigeons (design.md §8.8): flocks on Old Town Square and the walks along the water, pecking about
// their spot. When the drone comes down below 25 m close by, the flock lifts: each bird climbs to
// its own circle over the spot, wheels round for a quarter of a minute and comes down again.

import * as THREE from 'three';
import { Shape, rgb, setPose, rng, lifeMesh, commit } from './shapes.ts';
import { lifeMaterial } from './material.ts';
import type { LifeMeta } from '../core/life.ts';

function pigeon(): THREE.BufferGeometry {
  const s = new Shape(), G = rgb('#7c818d');
  s.ellipsoid([0, 0.13, 0], [0.17, 0.08, 0.075], G, 6, 3);
  s.ellipsoid([0.15, 0.22, 0], [0.05, 0.05, 0.045], rgb('#5d6470'), 5, 3);
  s.tri([-0.15, 0.14, 0], [-0.3, 0.12, -0.06], [-0.3, 0.12, 0.06], rgb('#50555f'), [0, 1, 0]);
  s.box(-0.01, 0, -0.03, 0.03, 0.06, 0.03, rgb('#b0585a'));
  s.wing = 1;
  for (const side of [-1, 1]) {
    s.tri([-0.1, 0.18, 0], [0.08, 0.18, 0], [-0.04, 0.18, 0.34 * side], G, [0, 1, 0]);
    s.tri([-0.1, 0.18, 0], [0.08, 0.18, 0], [-0.04, 0.18, 0.34 * side], rgb('#5a5f6a'), [0, -1, 0]);
  }
  s.wing = 0;
  return s.geometry();
}

interface Bird { dx: number; dz: number; R: number; H: number; w: number; psi: number; D: number; peck: number }
interface Flock { x: number; y: number; z: number; birds: Bird[]; lifted: number }

export class Pigeons {
  readonly group = new THREE.Group();
  private flocks: Flock[] = [];
  private mesh: THREE.InstancedMesh;
  private flap: THREE.InstancedBufferAttribute;

  constructor(meta: LifeMeta) {
    const r = rng(31);
    let total = 0;
    for (const [x, y, z, n] of meta.pigeons) {
      const birds: Bird[] = [];
      for (let k = 0; k < n; k++) {
        const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 5;
        birds.push({ dx: Math.cos(a) * d, dz: Math.sin(a) * d, R: 6 + r() * 12, H: 5 + r() * 10, w: (0.8 + r() * 0.5) * (r() < 0.8 ? 1 : -1), psi: r() * 6.28, D: 14 + r() * 9, peck: r() * 6.28 });
      }
      this.flocks.push({ x, y, z, birds, lifted: -1e9 });
      total += n;
    }
    const g = pigeon();
    this.flap = new THREE.InstancedBufferAttribute(new Float32Array(total * 4), 4);
    g.setAttribute('aFlap', this.flap);
    this.mesh = lifeMesh(g, lifeMaterial({ roughness: 0.8, wings: true }), total);
    this.group.add(this.mesh);
  }

  update(time: number, eye: THREE.Vector3, drone: THREE.Vector3, droneAgl: number) {
    let n = 0;
    for (const f of this.flocks) {
      const far = (f.x - eye.x) ** 2 + (f.z - eye.z) ** 2 > 400 * 400;
      // The drone low and close lifts the flock, unless it is up already.
      if (droneAgl < 25 && (f.x - drone.x) ** 2 + (f.z - drone.z) ** 2 < 35 * 35 && time - f.lifted > 26) f.lifted = time;
      if (far) continue;
      const tau = time - f.lifted;
      f.birds.forEach((b, k) => {
        let x = f.x + b.dx, y = f.y, z = f.z + b.dz, hx = Math.cos(b.peck), hz = Math.sin(b.peck), open = 0;
        if (tau < b.D) {
          const up = Math.min(1, tau / 2), down = Math.min(1, Math.max(0, (tau - b.D + 3) / 3));
          const e = (up * up * (3 - 2 * up)) * (1 - down * down * (3 - 2 * down));
          const a = b.psi + b.w * tau, cx = f.x + Math.cos(a) * b.R, cz = f.z + Math.sin(a) * b.R;
          x += (cx - x) * e; z += (cz - z) * e; y += b.H * e;
          hx = -Math.sin(a) * Math.sign(b.w); hz = Math.cos(a) * Math.sign(b.w);
          open = e > 0.02 ? 1 : 0;
        } else {
          // Pecking: a slow wander round the spot, a step now and then.
          const t = time * 0.3 + b.peck * 3;
          x += Math.sin(t) * 0.4; z += Math.cos(t * 0.7) * 0.4;
          hx = Math.cos(t * 0.5 + b.peck); hz = Math.sin(t * 0.5 + b.peck);
        }
        this.flap.setXYZW(n, open, 0.8, k * 2.3, 16);
        setPose(this.mesh, n++, x, y, z, hx, hz);
      });
    }
    this.mesh.count = n;
    commit(this.mesh);
  }
}
