// Street furniture from tools/build-world.ts (design.md §8.3): the tram rails set into the streets,
// the lamp posts of the OSM lamp register (in the old town's streets, the lanterns on brackets on
// the walls, M10), and the trams' overhead wire on its poles (§8.8),
// grouped by kilometre tile and drawn only near the camera, where they are more than a pixel wide.

import * as THREE from 'three';
import type { Pack } from '../core/pack.ts';
import { patchLit } from '../sky/lit.ts';

const TILE = 1000;
const RANGE = 900;
const GAUGE = 1.435;
/** The contact wire's height over the rail, and how far the wires show. */
const WIRE = 5.6, WIRE_RANGE = 450;

interface Piece { mesh: THREE.Object3D; x: number; z: number; r: number; range?: number }

export class Streets {
  readonly group = new THREE.Group();
  private pieces: Piece[] = [];

  constructor(pack: Pack) {
    const starts = pack.arrays.railStart as Uint32Array;
    const rail = pack.arrays.rail as Float32Array;
    const lamps = pack.arrays.lamp as Float32Array;
    const wallLamps = (pack.arrays.wallLamp as Float32Array | undefined) ?? new Float32Array(0);

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

    // The overhead wire: one line over each track, drawn as the thinnest dark line.
    const wireMat = patchLit(new THREE.LineBasicMaterial({ color: '#15171a' }));
    for (const runs of byTile.values()) {
      const pos: number[] = [];
      for (const run of runs)
        for (let i = 0; i + 5 < run.length; i += 3) pos.push(run[i], run[i + 1] + WIRE, run[i + 2], run[i + 3], run[i + 4] + WIRE, run[i + 5]);
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geom.computeBoundingSphere();
      const lines = new THREE.LineSegments(geom, wireMat);
      lines.matrixAutoUpdate = false;
      this.add(lines, geom.boundingSphere!, WIRE_RANGE);
    }
    // Their poles: a steel mast with a bracket out over the track.
    const poles = pack.arrays.pole as Float32Array | undefined;
    if (poles?.length) {
      const steel = rgbArr('#3b423f');
      const parts = [
        new THREE.BoxGeometry(0.22, 8.2, 0.22).translate(0, 4.1, 0),
        new THREE.BoxGeometry(3.7, 0.09, 0.09).translate(1.85, 6.4, 0),
        stay(),
      ];
      const poleGeom = mergeBoxes(parts);
      const poleMat = patchLit(new THREE.MeshStandardMaterial({ color: new THREE.Color(...steel), metalness: 0.4, roughness: 0.55 }));
      const byT = new Map<string, number[]>();
      for (let i = 0; i < poles.length; i += 4) {
        const key = `${Math.floor(poles[i] / TILE)},${Math.floor(poles[i + 2] / TILE)}`;
        (byT.get(key) ?? byT.set(key, []).get(key)!).push(poles[i], poles[i + 1], poles[i + 2], poles[i + 3]);
      }
      const q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1), at = new THREE.Vector3();
      for (const list of byT.values()) {
        const n = list.length / 4;
        const mesh = new THREE.InstancedMesh(poleGeom, poleMat, n);
        const box = new THREE.Box3();
        for (let i = 0; i < n; i++) {
          // The bracket (the model's +x) points at the track.
          q.setFromAxisAngle(up, -list[i * 4 + 3]);
          at.set(list[i * 4], list[i * 4 + 1], list[i * 4 + 2]);
          mesh.setMatrixAt(i, new THREE.Matrix4().compose(at, q, one));
          box.expandByPoint(at);
        }
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);
        mesh.computeBoundingSphere();
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh, sphere, WIRE_RANGE + 150);
      }
    }

    // Lamp posts: a pole and a lantern, cast iron dark green, the lantern's panes pale (8777):
    // four of them, wider at the top, under a cap and a finial.
    const IRON = '#2c3430', PANE = '#b3ae9f';
    const lantern = (y: number) => [
      coloured(new THREE.CylinderGeometry(0.2, 0.12, 0.46, 4).rotateY(Math.PI / 4).translate(0, y, 0), PANE),
      coloured(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 4).translate(0, y - 0.28, 0), IRON),
      coloured(new THREE.ConeGeometry(0.27, 0.22, 4).rotateY(Math.PI / 4).translate(0, y + 0.34, 0), IRON),
      coloured(new THREE.BoxGeometry(0.3, 0.035, 0.3).translate(0, y + 0.23, 0), IRON),
      coloured(new THREE.ConeGeometry(0.04, 0.16, 4).translate(0, y + 0.53, 0), IRON),
    ];
    const lampGeom = mergeBoxes([
      coloured(new THREE.CylinderGeometry(0.06, 0.1, 4.1, 6).translate(0, 2.05, 0), IRON),
      coloured(new THREE.CylinderGeometry(0.14, 0.16, 0.7, 6).translate(0, 0.35, 0), IRON),
      ...lantern(4.4),
    ]);
    // On a wall: the lantern 0.8 m out from it (at the instance's origin), under an arm with a stay
    // and a plate on the wall (-z is toward the wall).
    const arm = 0.8;
    const wallGeom = mergeBoxes([
      ...lantern(4.4),
      coloured(new THREE.BoxGeometry(0.05, 0.05, arm).translate(0, 4.98, -arm / 2), IRON),
      coloured(new THREE.BoxGeometry(0.04, 0.04, Math.hypot(arm, 0.5)).rotateX(-Math.atan2(0.5, arm)).translate(0, 4.73, -arm / 2 - 0.05), IRON),
      coloured(new THREE.BoxGeometry(0.16, 0.7, 0.04).translate(0, 4.75, -arm), IRON),
    ]);
    const lampMat = patchLit(new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.3, roughness: 0.55 }));
    const lampTiles = new Map<string, number[]>();
    for (let i = 0; i < lamps.length; i += 3) {
      const key = `${Math.floor(lamps[i] / TILE)},${Math.floor(lamps[i + 2] / TILE)}`;
      (lampTiles.get(key) ?? lampTiles.set(key, []).get(key)!).push(lamps[i], lamps[i + 1], lamps[i + 2], NaN);
    }
    for (let i = 0; i < wallLamps.length; i += 4) {
      const key = `${Math.floor(wallLamps[i] / TILE)},${Math.floor(wallLamps[i + 2] / TILE)}`;
      (lampTiles.get(key) ?? lampTiles.set(key, []).get(key)!).push(wallLamps[i], wallLamps[i + 1], wallLamps[i + 2], wallLamps[i + 3]);
    }
    const m = new THREE.Matrix4(), rot = new THREE.Matrix4();
    for (const all of lampTiles.values()) {
      for (const onWall of [false, true]) {
        const list: number[] = [];
        for (let i = 0; i < all.length; i += 4) if (Number.isNaN(all[i + 3]) !== onWall) list.push(all[i], all[i + 1], all[i + 2], all[i + 3]);
        const n = list.length / 4;
        if (!n) continue;
        const mesh = new THREE.InstancedMesh(onWall ? wallGeom : lampGeom, lampMat, n);
        const sphere = new THREE.Sphere();
        const box = new THREE.Box3();
        for (let i = 0; i < n; i++) {
          m.makeTranslation(list[i * 4], list[i * 4 + 1], list[i * 4 + 2]);
          if (onWall) m.multiply(rot.makeRotationY(list[i * 4 + 3]));
          mesh.setMatrixAt(i, m);
          box.expandByPoint(new THREE.Vector3(list[i * 4], list[i * 4 + 1], list[i * 4 + 2]));
        }
        box.getBoundingSphere(sphere);
        mesh.computeBoundingSphere();
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh, sphere);
      }
    }
  }

  private add(mesh: THREE.Object3D, s: THREE.Sphere, range?: number) {
    this.group.add(mesh);
    this.pieces.push({ mesh, x: s.center.x, z: s.center.z, r: s.radius, range });
  }

  /** Shows the pieces within range of the camera. */
  update(camera: THREE.Vector3) {
    const far = RANGE + Math.max(0, camera.y - 200) * 0.5;
    for (const p of this.pieces) p.mesh.visible = Math.hypot(camera.x - p.x, camera.z - p.z) - p.r < (p.range ? p.range + Math.max(0, camera.y - 100) * 0.3 : far);
  }
}

const rgbArr = (h: string): [number, number, number] => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };

/** The diagonal stay under a pole's bracket. */
function stay(): THREE.BufferGeometry {
  const len = Math.hypot(2.6, 1.2);
  return new THREE.BoxGeometry(len, 0.06, 0.06).rotateZ(Math.atan2(1.2, 2.6)).translate(1.3, 5.8, 0);
}

/** Merges non-indexed copies of simple geometries (position and normal, and colour where all have it). */
function mergeBoxes(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [], nor: number[] = [], col: number[] = [];
  for (const g of parts) {
    const ng = g.index ? g.toNonIndexed() : g;
    pos.push(...(ng.getAttribute('position').array as Float32Array));
    nor.push(...(ng.getAttribute('normal').array as Float32Array));
    const c = ng.getAttribute('color');
    if (c) col.push(...(c.array as Float32Array));
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  if (col.length === pos.length) out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return out;
}

/** A geometry with one colour (sRGB) on every vertex. */
function coloured(g: THREE.BufferGeometry, hex: string): THREE.BufferGeometry {
  const ng = g.index ? g.toNonIndexed() : g;
  const c = new THREE.Color(hex), n = ng.getAttribute('position').count;
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  ng.setAttribute('color', new THREE.Float32BufferAttribute(a, 3));
  return ng;
}
