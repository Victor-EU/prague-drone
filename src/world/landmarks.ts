// The hand-built landmarks (design.md §7.1), built by tools/landmarks/ into landmarks.bin as
// finished meshes in the building tiles' vertex layout, and drawn with the building material. Each
// landmark has up to three tiers: the main mesh; the detail mesh (statues, finials, lamps, lattice
// bracing), hidden beyond `detailRange`; and, from M12, the fine mesh (mouldings, tracery,
// balusters, crockets), drawn within `fineRange` only, casting no shadow and not in the mirror.

import * as THREE from 'three';
import type { Pack } from '../core/pack.ts';
import { buildingMesh } from './buildings.ts';

interface Item { id: string; tier: number; v0: number; nv: number; i0: number; ni: number; sphere: [number, number, number, number] }

export class Landmarks {
  readonly group = new THREE.Group();
  /** The fine meshes, for the world to keep off the mirror's layer. */
  readonly fine: THREE.Mesh[] = [];
  private details: { mesh: THREE.Mesh; s: Item['sphere'] }[] = [];
  private fines: { mesh: THREE.Mesh; s: Item['sphere'] }[] = [];
  /** The detail meshes are hidden beyond this distance (the quality preset sets it). */
  detailRange = 1400;
  /** The fine meshes are drawn within this distance (the quality preset sets it; 0 leaves them out). */
  fineRange = 300;

  constructor(pack: Pack<{ items: Item[] }>, material: THREE.Material) {
    const a = pack.arrays;
    for (const it of pack.meta.items) {
      const v = (arr: ArrayLike<number> & { subarray(s: number, e: number): any }, k: number) => arr.subarray(it.v0 * k, (it.v0 + it.nv) * k);
      const mesh = buildingMesh({
        position: v(a.position as Float32Array, 3), normal: v(a.normal as Int8Array, 3), color: v(a.color as Uint8Array, 3),
        facade: v(a.facade as Float32Array, 4), info: v(a.info as Uint8Array, 4),
        index: (a.index as Uint32Array).subarray(it.i0, it.i0 + it.ni),
      }, material, 0, 0);
      mesh.name = `${it.id}${it.tier === 1 ? ' detail' : it.tier === 2 ? ' fine' : ''}`;
      this.group.add(mesh);
      if (it.tier === 1) this.details.push({ mesh, s: it.sphere });
      else if (it.tier === 2) { this.fines.push({ mesh, s: it.sphere }); this.fine.push(mesh); mesh.castShadow = false; mesh.visible = false; }
    }
  }

  update(camera: THREE.Vector3) {
    for (const { mesh, s } of this.details) mesh.visible = Math.hypot(camera.x - s[0], camera.y - s[1], camera.z - s[2]) - s[3] < this.detailRange;
    for (const { mesh, s } of this.fines) mesh.visible = Math.hypot(camera.x - s[0], camera.y - s[1], camera.z - s[2]) - s[3] < this.fineRange;
  }
}
