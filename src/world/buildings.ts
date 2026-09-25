// Building tiles: requested nearest first from a small worker pool, turned into meshes.

import * as THREE from 'three';
import type { BlockBuffers } from './extrude.ts';

export interface TileInfo { i: number; j: number; file: string; count: number }

export class Buildings {
  readonly group = new THREE.Group();
  readonly material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 });
  private workers: Worker[] = [];
  private pending = new Map<string, TileInfo>();
  private queue: TileInfo[] = [];
  private base: string;
  private kinds: { bridge: number; box: number };
  private tileSize: number;
  private world: { xMin: number; zMin: number };
  loaded = 0;
  total = 0;

  constructor(base: string, kinds: { bridge: number; box: number }, tileSize: number, world: { xMin: number; zMin: number }) {
    this.base = base;
    this.kinds = kinds;
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

  private next(w: Worker) {
    const t = this.queue.shift();
    if (!t) return;
    const id = `${t.i}_${t.j}`;
    this.pending.set(id, t);
    w.postMessage({ url: `${this.base}/${t.file}`, id, kinds: this.kinds });
  }

  private onTile(w: Worker, msg: BlockBuffers & { id: string; meta: { ox: number; oz: number }; error?: string }) {
    this.pending.delete(msg.id);
    if (msg.error) console.warn('tile', msg.id, msg.error);
    else if (msg.index.length) this.group.add(blockMesh(msg, this.material, msg.meta.ox, msg.meta.oz));
    this.loaded++;
    this.next(w);
  }
}

export function blockMesh(b: BlockBuffers, material: THREE.Material, ox: number, oz: number): THREE.Mesh {
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(b.position, 3));
  geom.setAttribute('normal', new THREE.BufferAttribute(b.normal, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(b.color, 3, true));
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
