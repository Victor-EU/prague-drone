// Building tiles: requested nearest first from a small worker pool, turned into two meshes each:
// walls and roofs, and the detail (chimneys, dormers, gables, turrets, bays, roof boxes), which is
// hidden beyond `detailRange` and not drawn into the far shadow cascade. The facades' relief
// (design.md §8.2, M14) is built by the same workers in chunks of 200 m as the camera comes
// within `reliefRange` of them, and dropped again 80 m beyond it.

import * as THREE from 'three';
import type { MeshBuffers } from './extrude.ts';
import { buildingMaterial } from './building-material.ts';
import { REFLECT } from '../render/reflection.ts';
import { CHUNK, NEAR } from './relief.ts';

export interface TileInfo { i: number; j: number; file: string; count: number }

/** A chunk of relief: `want` is the level the camera's distance asks for (0 near, 1 far), `built` the level of `mesh`, −1 for none yet. */
interface Chunk { id: string; ci: number; cj: number; x0: number; z0: number; want: 0 | 1; built: number; pending: boolean; mesh: THREE.Mesh | null; d: number }

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
  /** Which worker holds each tile's arrays, and where the tile sits. */
  private tileWorker = new Map<string, Worker>();
  private tileOrigin = new Map<string, { ox: number; oz: number }>();
  private chunks = new Map<string, Chunk>();
  private inflight = 0;
  /** Meshes that arrived, added one a frame so their upload does not pile into one. */
  private arrivals: { c: Chunk; mesh: MeshBuffers; far: boolean }[] = [];
  loaded = 0;
  total = 0;
  /** The detail meshes are hidden beyond this distance (the quality preset sets it). */
  detailRange = 1600;
  /** The relief is built within this distance of the camera (the quality preset sets it; 0 leaves it out). */
  reliefRange = 300;
  /** True when every chunk of relief the camera's position asks for has been built. */
  reliefSettled = true;
  /** Triangles of relief resident, for the HUD. */
  reliefTriangles = 0;

  constructor(base: string, tileSize: number, world: { xMin: number; zMin: number }) {
    this.base = base;
    this.tileSize = tileSize;
    this.world = world;
    const n = Math.max(2, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
    for (let k = 0; k < n; k++) {
      const w = new Worker(new URL('./tiles.worker.ts', import.meta.url), { type: 'module' });
      w.onmessage = (e) => this.onMessage(w, e.data);
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

  /** Shows the detail meshes near the camera only, and keeps the relief's chunks to the camera's reach. */
  update(camera: THREE.Vector3) {
    for (const m of this.details) {
      const s = m.geometry.boundingSphere!;
      const d = Math.hypot(camera.x - (s.center.x + m.position.x), camera.z - (s.center.z + m.position.z)) - s.radius;
      m.visible = d < this.detailRange;
    }
    this.updateRelief(camera);
  }

  private updateRelief(camera: THREE.Vector3) {
    // One arrival a frame: a chunk's buffers reach the GPU on its first draw, and several at once hitch.
    const a = this.arrivals.shift();
    if (a) this.place(a.c, a.mesh, a.far);
    const range = this.reliefRange, half = this.tileSize / 2, cells = Math.round(this.tileSize / CHUNK);
    // Distance from the camera to a square, in the plane.
    const dist = (x0: number, z0: number, side: number) => Math.hypot(Math.max(x0 - camera.x, 0, camera.x - x0 - side), Math.max(z0 - camera.z, 0, camera.z - z0 - side));
    const wanted: Chunk[] = [];
    if (range > 0) for (const [id, { ox, oz }] of this.tileOrigin) {
      if (dist(ox - half, oz - half, this.tileSize) > range) continue;
      for (let ci = 0; ci < cells; ci++) for (let cj = 0; cj < cells; cj++) {
        const x0 = ox - half + ci * CHUNK, z0 = oz - half + cj * CHUNK;
        const d = dist(x0, z0, CHUNK);
        if (d > range) continue;
        const key = `${id}/${ci}_${cj}`;
        let c = this.chunks.get(key);
        if (!c) { c = { id, ci, cj, x0, z0, want: 0, built: -1, pending: false, mesh: null, d }; this.chunks.set(key, c); }
        c.d = d;
        // The level, with some hysteresis so a chunk is not rebuilt as the camera hovers at the line.
        const near = Math.min(NEAR, range);
        if (c.built < 0) c.want = d < near ? 0 : 1;
        else if (c.built === 1 && d < near - 20) c.want = 0;
        else if (c.built === 0 && d > near + 20) c.want = 1;
        wanted.push(c);
      }
    }
    // Chunks the camera has left.
    for (const [key, c] of this.chunks) {
      if (c.pending) continue;
      if (dist(c.x0, c.z0, CHUNK) > range + 50 || range === 0) {
        if (c.mesh) this.drop(c);
        this.chunks.delete(key);
      }
    }
    // Requests, nearest first, two at a time.
    wanted.sort((a, b) => a.d - b.d);
    for (const c of wanted) {
      if (this.inflight >= 2) break;
      if (c.pending || c.built === c.want) continue;
      const w = this.tileWorker.get(c.id);
      if (!w) continue;
      c.pending = true;
      this.inflight++;
      w.postMessage({ id: c.id, relief: { ci: c.ci, cj: c.cj, tile: this.tileSize, far: c.want === 1 } });
    }
    this.reliefSettled = wanted.every((c) => c.built === c.want) && this.arrivals.length === 0;
  }

  private drop(c: Chunk) {
    if (!c.mesh) return;
    this.group.remove(c.mesh);
    this.reliefTriangles -= c.mesh.geometry.index!.count / 3;
    c.mesh.geometry.dispose();
    c.mesh = null;
  }

  private place(c: Chunk, mesh: MeshBuffers, far: boolean) {
    c.pending = false;
    // The camera may have left the chunk while its mesh was on its way.
    if (this.chunks.get(`${c.id}/${c.ci}_${c.cj}`) !== c) return;
    this.drop(c);
    c.built = far ? 1 : 0;
    const o = this.tileOrigin.get(c.id);
    if (mesh.index.length && o) {
      const m = buildingMesh(mesh, this.material, o.ox, o.oz);
      m.name = `relief ${c.id} ${c.ci},${c.cj}${far ? ' far' : ''}`;
      c.mesh = m;
      this.reliefTriangles += mesh.index.length / 3;
      this.group.add(m);
    }
  }

  private next(w: Worker) {
    const t = this.queue.shift();
    if (!t) return;
    const id = `${t.i}_${t.j}`;
    this.pending.set(id, t);
    w.postMessage({ url: `${this.base}/${t.file}`, id });
  }

  private onMessage(w: Worker, msg: { id: string; meta?: { ox: number; oz: number }; main?: MeshBuffers; detail?: MeshBuffers; relief?: { ci: number; cj: number; far: boolean }; mesh?: MeshBuffers; error?: string }) {
    if (msg.relief) {
      this.inflight--;
      const c = this.chunks.get(`${msg.id}/${msg.relief.ci}_${msg.relief.cj}`);
      if (msg.error) console.warn('relief', msg.id, msg.error);
      if (!c) return;
      // The chunk stays pending until its mesh is placed, one a frame, so it is not asked for twice.
      if (msg.mesh) this.arrivals.push({ c, mesh: msg.mesh, far: msg.relief.far });
      else { c.pending = false; c.built = c.want; }
      return;
    }
    this.pending.delete(msg.id);
    if (msg.error) console.warn('tile', msg.id, msg.error);
    else if (msg.meta && msg.main && msg.detail) {
      this.tileWorker.set(msg.id, w);
      this.tileOrigin.set(msg.id, { ox: msg.meta.ox, oz: msg.meta.oz });
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
