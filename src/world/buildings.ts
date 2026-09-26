// Building tiles: requested nearest first from a small worker pool, turned into two meshes each:
// walls and roofs, and the detail (chimneys, dormers, roof boxes), which is hidden beyond
// `detailRange` and not drawn into the far shadow cascade.

import * as THREE from 'three';
import type { MeshBuffers } from './extrude.ts';
import { buildingMaterial } from './building-material.ts';
import { REFLECT } from '../render/reflection.ts';

export interface TileInfo { i: number; j: number; file: string; count: number }


export class Buildings {
  readonly group = new THREE.Group();
  readonly material = buildingMaterial();
  private details: THREE.Mesh[] = [];
  private workers: Worker[] = [];
  private pending = new Map<string, TileInfo>();
  private queue: TileInfo[] = [];
  private base: string;
  private tileSize: number;
  private world: { xMin: number; zMin: number };
  loaded = 0;
  total = 0;
  /** The detail meshes are hidden beyond this distance (the quality preset sets it). */
  detailRange = 1600;

  constructor(base: string, tileSize: number, world: { xMin: number; zMin: number }) {
    this.base = base;
    this.tileSize = tileSize;
    this.world = world;
    const n = Math.max(2, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
    for (let k = 0; k < n; k++) {
      const w = new Worker(new URL('./tiles.worker.ts', import.meta.url), { type: 'module' });
      w.onmessage = (e) => this.onTile(w, e.data);
      this.workers.push(w);
    }
  }

  /** Queues all tiles, nearest to `near` first. */
  load(tiles: TileInfo[], near: THREE.Vector3) {
    const centre = (t: TileInfo) => [this.world.xMin + (t.i + 0.5) * this.tileSize, this.world.zMin + (t.j + 0.5) * this.tileSize];
    this.queue = tiles.slice().sort((a, b) => {
      const [ax, az] = centre(a), [bx, bz] = centre(b);
      return Math.hypot(ax - near.x, az - near.z) - Math.hypot(bx - near.x, bz - near.z);
    });
    this.total = tiles.length;
    for (const w of this.workers) this.next(w);
  }

  /** Shows the detail meshes near the camera only. */
  update(camera: THREE.Vector3) {
    for (const m of this.details) {
      const s = m.geometry.boundingSphere!;
      const d = Math.hypot(camera.x - (s.center.x + m.position.x), camera.z - (s.center.z + m.position.z)) - s.radius;
      m.visible = d < this.detailRange;
    }
  }

  private next(w: Worker) {
    const t = this.queue.shift();
    if (!t) return;
    const id = `${t.i}_${t.j}`;
    this.pending.set(id, t);
    w.postMessage({ url: `${this.base}/${t.file}`, id });
  }

  private onTile(w: Worker, msg: { id: string; meta: { ox: number; oz: number }; main: MeshBuffers; detail: MeshBuffers; error?: string }) {
    this.pending.delete(msg.id);
    if (msg.error) console.warn('tile', msg.id, msg.error);
    else {
      if (msg.main.index.length) {
        const m = buildingMesh(msg.main, this.material, msg.meta.ox, msg.meta.oz);
        m.layers.enable(REFLECT);
        this.group.add(m);
      }
      if (msg.detail.index.length) {
        const d = buildingMesh(msg.detail, this.material, msg.meta.ox, msg.meta.oz);
        this.details.push(d);
        this.group.add(d);
      }
    }
    this.loaded++;
    this.next(w);
  }
}

export function buildingMesh(b: MeshBuffers, material: THREE.Material, ox: number, oz: number): THREE.Mesh {
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(b.position, 3));
  geom.setAttribute('normal', new THREE.BufferAttribute(b.normal, 3, true));
  geom.setAttribute('color', new THREE.BufferAttribute(b.color, 3, true));
  geom.setAttribute('aFacade', new THREE.BufferAttribute(b.facade, 4));
  geom.setAttribute('aInfo', new THREE.BufferAttribute(b.info, 4));
  geom.setIndex(new THREE.BufferAttribute(b.index, 1));
  geom.computeBoundingSphere();
  const mesh = new THREE.Mesh(geom, material);
  mesh.position.set(ox, 0, oz);
  mesh.updateMatrix();
  mesh.matrixAutoUpdate = false;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
