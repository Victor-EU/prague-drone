// Street furniture from tools/build-world.ts (design.md §8.3): the tram rails set into the streets
// and the lamp posts of the OSM lamp register, grouped by kilometre tile and drawn only near the
// camera, where they are more than a pixel wide.

import * as THREE from 'three';
import type { Pack } from '../core/pack.ts';
import { patchLit } from '../sky/lit.ts';

const TILE = 1000;
const RANGE = 900;
const GAUGE = 1.435;

interface Piece { mesh: THREE.Object3D; x: number; z: number; r: number }

export class Streets {
  readonly group = new THREE.Group();
  private pieces: Piece[] = [];

  constructor(pack: Pack) {
    const starts = pack.arrays.railStart as Uint32Array;
    const rail = pack.arrays.rail as Float32Array;
    const lamps = pack.arrays.lamp as Float32Array;

    // Rails: two steel strips per track, in chunks of up to 300 m sorted into tiles.
    const railMat = patchLit(new THREE.MeshStandardMaterial({ color: '#8d8b86', metalness: 0.45, roughness: 0.42 }));
    const byTile = new Map<string, number[][]>();
    for (let k = 0; k + 1 < starts.length; k++) {
      for (let a = starts[k]; a < starts[k + 1] - 1; a += 100) {
        const b = Math.min(starts[k + 1], a + 101);
        const m = (a + b) >> 1;
        const key = `${Math.floor(rail[m * 3] / TILE)},${Math.floor(rail[m * 3 + 2] / TILE)}`;
        const list = byTile.get(key) ?? byTile.set(key, []).get(key)!;
        list.push(Array.from(rail.subarray(a * 3, b * 3)));
      }
    }
    for (const runs of byTile.values()) {
      const pos: number[] = [], index: number[] = [];
      for (const run of runs) {
        const n = run.length / 3;
        for (const side of [-1, 1]) {
          const first = pos.length / 3;
          for (let i = 0; i < n; i++) {
            const p = Math.max(0, i - 1), q = Math.min(n - 1, i + 1);
            let dx = run[q * 3] - run[p * 3], dz = run[q * 3 + 2] - run[p * 3 + 2];
            const l = Math.hypot(dx, dz) || 1;
            dx /= l; dz /= l;
            const nx = -dz, nz = dx;
            const cx = run[i * 3] + nx * side * GAUGE / 2, cz = run[i * 3 + 2] + nz * side * GAUGE / 2, y = run[i * 3 + 1] + 0.07;
            pos.push(cx - nx * 0.04, y, cz - nz * 0.04, cx + nx * 0.04, y, cz + nz * 0.04);
          }
          for (let i = 0; i + 1 < n; i++) {
            const a = first + i * 2;
            index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
          }
        }
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const nor = new Float32Array(pos.length);
      for (let i = 1; i < nor.length; i += 3) nor[i] = 1;
      geom.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      geom.setIndex(index);
      geom.computeBoundingSphere();
      const mesh = new THREE.Mesh(geom, railMat);
      // Winding follows the track's direction; the strips are seen from above only.
      railMat.side = THREE.DoubleSide;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      this.add(mesh, geom.boundingSphere!);
    }

    // Lamp posts: a pole and a lantern, cast iron dark green.
    const pole = new THREE.BoxGeometry(0.12, 4.3, 0.12).translate(0, 2.15, 0);
    const lantern = new THREE.BoxGeometry(0.34, 0.55, 0.34).translate(0, 4.5, 0);
    const cap = new THREE.ConeGeometry(0.28, 0.25, 4).rotateY(Math.PI / 4).translate(0, 4.9, 0);
    const lampGeom = mergeBoxes([pole, lantern, cap]);
    const lampMat = patchLit(new THREE.MeshStandardMaterial({ color: '#2c3430', metalness: 0.3, roughness: 0.6 }));
    const lampTiles = new Map<string, number[]>();
    for (let i = 0; i < lamps.length; i += 3) {
      const key = `${Math.floor(lamps[i] / TILE)},${Math.floor(lamps[i + 2] / TILE)}`;
      (lampTiles.get(key) ?? lampTiles.set(key, []).get(key)!).push(lamps[i], lamps[i + 1], lamps[i + 2]);
    }
    const m = new THREE.Matrix4();
    for (const list of lampTiles.values()) {
      const n = list.length / 3;
      const mesh = new THREE.InstancedMesh(lampGeom, lampMat, n);
      const sphere = new THREE.Sphere();
      const box = new THREE.Box3();
      for (let i = 0; i < n; i++) {
        m.makeTranslation(list[i * 3], list[i * 3 + 1], list[i * 3 + 2]);
        mesh.setMatrixAt(i, m);
        box.expandByPoint(new THREE.Vector3(list[i * 3], list[i * 3 + 1], list[i * 3 + 2]));
      }
      box.getBoundingSphere(sphere);
      mesh.computeBoundingSphere();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.add(mesh, sphere);
    }
  }

  private add(mesh: THREE.Object3D, s: THREE.Sphere) {
    this.group.add(mesh);
    this.pieces.push({ mesh, x: s.center.x, z: s.center.z, r: s.radius });
  }

  /** Shows the pieces within range of the camera. */
  update(camera: THREE.Vector3) {
    const far = RANGE + Math.max(0, camera.y - 200) * 0.5;
    for (const p of this.pieces) p.mesh.visible = Math.hypot(camera.x - p.x, camera.z - p.z) - p.r < far;
  }
}

/** Merges non-indexed copies of simple geometries (position and normal only). */
function mergeBoxes(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [], nor: number[] = [];
  for (const g of parts) {
    const ng = g.index ? g.toNonIndexed() : g;
    pos.push(...(ng.getAttribute('position').array as Float32Array));
    nor.push(...(ng.getAttribute('normal').array as Float32Array));
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return out;
}
