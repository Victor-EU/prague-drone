// The hand-built landmarks (design.md §7.1), built by tools/landmarks/ into landmarks.bin as
// finished meshes in the building tiles' vertex layout, and drawn with the building material. Each
// landmark has a main mesh and a detail mesh (statues, finials, lamps, lattice bracing), which is
// hidden beyond `detailRange`.

import * as THREE from 'three';
import type { Pack } from '../core/pack.ts';
import { buildingMesh } from './buildings.ts';

interface Item { id: string; detail: boolean; v0: number; nv: number; i0: number; ni: number; sphere: [number, number, number, number] }


export class Landmarks {
  readonly group = new THREE.Group();
  private details: { mesh: THREE.Mesh; s: Item['sphere'] }[] = [];
  /** The detail meshes are hidden beyond this distance (the quality preset sets it). */
  detailRange = 1400;

  constructor(pack: Pack<{ items: Item[] }>, material: THREE.Material) {
    const a = pack.arrays;
    for (const it of pack.meta.items) {
      const v = (arr: ArrayLike<number> & { subarray(s: number, e: number): any }, k: number) => arr.subarray(it.v0 * k, (it.v0 + it.nv) * k);
      const mesh = buildingMesh({
        position: v(a.position as Float32Array, 3), normal: v(a.normal as Int8Array, 3), color: v(a.color as Uint8Array, 3),
        facade: v(a.facade as Float32Array, 4), info: v(a.info as Uint8Array, 4),
        index: (a.index as Uint32Array).subarray(it.i0, it.i0 + it.ni),
      }, material, 0, 0);
      mesh.name = `${it.id}${it.detail ? ' detail' : ''}`;
      this.group.add(mesh);
      if (it.detail) this.details.push({ mesh, s: it.sphere });
    }
  }

  update(camera: THREE.Vector3) {
    for (const { mesh, s } of this.details) mesh.visible = Math.hypot(camera.x - s[0], camera.y - s[1], camera.z - s[2]) - s[3] < this.detailRange;
  }
}
