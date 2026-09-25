// The ground: 1 km chunks of the 5 m height grid with distance-based levels of detail, draped
// with the land-use colours; the horizon ring beyond the world rectangle.

import * as THREE from 'three';
import { HeightGrid } from './heightgrid.ts';
import { GROUND_COLOURS } from '../core/landuse.ts';

const CHUNK = 1000;
const STEPS = [1, 2, 4, 8]; // grid steps per level (5, 10, 20, 40 m)
const SWITCH = [900, 2000, 3800]; // camera distance at which each coarser level takes over
const SKIRT = 25;

interface Chunk {
  mesh: THREE.Mesh;
  cx: number; cz: number; // centre
  i0: number; j0: number; n: number; // node range in the grid
  level: number;
  geoms: (THREE.BufferGeometry | undefined)[];
}

export class Terrain {
  readonly group = new THREE.Group();
  readonly material: THREE.MeshStandardMaterial;
  private chunks: Chunk[] = [];
  private grid: HeightGrid;
  private world: { xMin: number; xMax: number; zMin: number; zMax: number };

  constructor(grid: HeightGrid, landuse: THREE.Texture, world: { xMin: number; xMax: number; zMin: number; zMax: number }) {
    this.grid = grid;
    this.world = world;
    this.material = new THREE.MeshStandardMaterial({ map: landuse, roughness: 0.95, metalness: 0 });
    const per = CHUNK / grid.cell;
    for (let j0 = 0; j0 < grid.nz - 1; j0 += per)
      for (let i0 = 0; i0 < grid.nx - 1; i0 += per) {
        const n = Math.min(per, grid.nx - 1 - i0, grid.nz - 1 - j0);
        const cx = grid.x0 + (i0 + n / 2) * grid.cell, cz = grid.z0 + (j0 + n / 2) * grid.cell;
        const mesh = new THREE.Mesh(undefined, this.material);
        mesh.receiveShadow = true;
        // Terrain casting cost 3 ms a frame for shadows that the 1.6 km shadow box mostly cannot
        // hold anyway; hill shadows come back with the cascades in M1.
        mesh.castShadow = false;
        mesh.matrixAutoUpdate = false;
        this.group.add(mesh);
        this.chunks.push({ mesh, cx, cz, i0, j0, n, level: -1, geoms: [] });
      }
    // Start everything at the coarsest level so the first frame is complete.
    for (const c of this.chunks) this.setLevel(c, STEPS.length - 1);
  }

  /** Picks each chunk's level from its distance to the camera; builds at most `budget` new geometries. */
  update(camera: THREE.Vector3, budget = 2) {
    const wanted = this.chunks.map((c) => {
      const y = this.grid.sample(c.cx, c.cz);
      const dx = Math.max(0, Math.abs(camera.x - c.cx) - CHUNK / 2);
      const dz = Math.max(0, Math.abs(camera.z - c.cz) - CHUNK / 2);
      const d = Math.hypot(dx, dz, (camera.y - y) * 0.5);
      let l = SWITCH.findIndex((s) => d < s);
      if (l < 0) l = STEPS.length - 1;
      return { c, l, d };
    });
    wanted.sort((a, b) => a.d - b.d);
    for (const { c, l } of wanted) {
      if (l === c.level) continue;
      if (!c.geoms[l]) {
        // The finest level costs several milliseconds to build: one of those per frame at most.
        const cost = l === 0 ? 2 : 1;
        if (budget < cost) continue;
        budget -= cost;
      }
      this.setLevel(c, l);
    }
  }

  private setLevel(c: Chunk, l: number) {
    c.geoms[l] ??= this.build(c, STEPS[l]);
    c.mesh.geometry = c.geoms[l]!;
    c.level = l;
    // Free detail that is far away.
    for (let k = 0; k < l - 1; k++) {
      c.geoms[k]?.dispose();
      c.geoms[k] = undefined;
    }
  }

  private build(c: Chunk, step: number): THREE.BufferGeometry {
    const g = this.grid;
    const m = c.n / step; // cells per side
    const side = m + 1;
    const count = side * side + 4 * side; // grid + skirt
    const pos = new Float32Array(count * 3);
    const nor = new Float32Array(count * 3);
    const uv = new Float32Array(count * 2);
    const W = this.world.xMax - this.world.xMin, D = this.world.zMax - this.world.zMin;
    const d = step * g.cell;
    let v = 0;
    const H = g.h, nx = g.nx, nz = g.nz;
    const at = (i: number, j: number) => H[(j < 0 ? 0 : j >= nz ? nz - 1 : j) * nx + (i < 0 ? 0 : i >= nx ? nx - 1 : i)];
    const put = (i: number, j: number, drop: number) => {
      const x = g.x0 + i * g.cell, z = g.z0 + j * g.cell;
      pos[v * 3] = x; pos[v * 3 + 1] = at(i, j) - drop; pos[v * 3 + 2] = z;
      const hx = (at(i + step, j) - at(i - step, j)) / (2 * d);
      const hz = (at(i, j + step) - at(i, j - step)) / (2 * d);
      const len = Math.sqrt(hx * hx + 1 + hz * hz);
      nor[v * 3] = -hx / len; nor[v * 3 + 1] = 1 / len; nor[v * 3 + 2] = -hz / len;
      uv[v * 2] = (x - this.world.xMin) / W; uv[v * 2 + 1] = (z - this.world.zMin) / D;
      return v++;
    };
    for (let b = 0; b <= m; b++) for (let a = 0; a <= m; a++) put(c.i0 + a * step, c.j0 + b * step, 0);
    const index = new Uint32Array(m * m * 6 + 4 * m * 12);
    let n = 0;
    for (let b = 0; b < m; b++)
      for (let a = 0; a < m; a++) {
        const p = b * side + a, q = p + 1, r = p + side, s = r + 1;
        index[n++] = p; index[n++] = r; index[n++] = q;
        index[n++] = q; index[n++] = r; index[n++] = s;
      }
    // Skirts hide the cracks between neighbouring levels. Both windings, so a skirt shows from
    // whichever side the crack is seen.
    const top = new Uint32Array(side), bottom = new Uint32Array(side);
    for (let e = 0; e < 4; e++) {
      for (let k = 0; k <= m; k++) {
        const a = e === 0 ? k : e === 1 ? m : e === 2 ? m - k : 0;
        const b = e === 0 ? 0 : e === 1 ? k : e === 2 ? m : m - k;
        top[k] = b * side + a;
        bottom[k] = put(c.i0 + a * step, c.j0 + b * step, SKIRT);
      }
      for (let k = 0; k < m; k++) {
        const t0 = top[k], t1 = top[k + 1], b0 = bottom[k], b1 = bottom[k + 1];
        index[n++] = t0; index[n++] = b0; index[n++] = t1; index[n++] = t1; index[n++] = b0; index[n++] = b1;
        index[n++] = t0; index[n++] = t1; index[n++] = b0; index[n++] = t1; index[n++] = b1; index[n++] = b0;
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, v * 3), 3));
    geom.setAttribute('normal', new THREE.BufferAttribute(nor.subarray(0, v * 3), 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(uv.subarray(0, v * 2), 2));
    geom.setIndex(new THREE.BufferAttribute(index, 1));
    geom.computeBoundingSphere();
    geom.computeBoundingBox();
    return geom;
  }
}

/** Land-use classes to an sRGB texture, with a little per-texel variation so flat areas breathe. */
export function landuseTexture(classes: Uint8Array, nx: number, nz: number): THREE.DataTexture {
  const lut = new Uint8Array(256 * 3);
  for (const [k, hex] of Object.entries(GROUND_COLOURS)) {
    const c = parseInt(hex.slice(1), 16);
    lut.set([(c >> 16) & 255, (c >> 8) & 255, c & 255], Number(k) * 3);
  }
  const data = new Uint8Array(nx * nz * 4);
  let seed = 1234567;
  for (let k = 0; k < nx * nz; k++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const jitter = 0.94 + ((seed >>> 16) & 255) / 255 * 0.12;
    const c = classes[k] * 3;
    data[k * 4] = Math.min(255, lut[c] * jitter);
    data[k * 4 + 1] = Math.min(255, lut[c + 1] * jitter);
    data[k * 4 + 2] = Math.min(255, lut[c + 2] * jitter);
    data[k * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, nx, nz, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

/** The ring of terrain from the world's edge to 16 km, without land use: the fog does the rest. */
export function horizonMesh(grid: HeightGrid, world: { xMin: number; xMax: number; zMin: number; zMax: number }): THREE.Mesh {
  const n = grid.nx;
  const pos: number[] = [], nor: number[] = [], index: number[] = [];
  const vid = new Int32Array(n * n).fill(-1);
  const inside = (x: number, z: number) => x > world.xMin + 1 && x < world.xMax - 1 && z > world.zMin + 1 && z < world.zMax - 1;
  const vert = (i: number, j: number) => {
    const k = j * n + i;
    if (vid[k] < 0) {
      vid[k] = pos.length / 3;
      const x = grid.x0 + i * grid.cell, z = grid.z0 + j * grid.cell;
      pos.push(x, grid.at(i, j), z);
      const hx = (grid.at(i + 1, j) - grid.at(i - 1, j)) / (2 * grid.cell);
      const hz = (grid.at(i, j + 1) - grid.at(i, j - 1)) / (2 * grid.cell);
      const len = Math.hypot(hx, 1, hz);
      nor.push(-hx / len, 1 / len, -hz / len);
    }
    return vid[k];
  };
  for (let j = 0; j + 1 < n; j++)
    for (let i = 0; i + 1 < n; i++) {
      const x = grid.x0 + (i + 0.5) * grid.cell, z = grid.z0 + (j + 0.5) * grid.cell;
      if (inside(x, z)) continue;
      const p = vert(i, j), q = vert(i + 1, j), r = vert(i, j + 1), s = vert(i + 1, j + 1);
      index.push(p, r, q, q, r, s);
    }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geom.setIndex(index);
  geom.computeBoundingSphere();
  const mat = new THREE.MeshStandardMaterial({ color: '#7f7b6a', roughness: 1, metalness: 0 });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.receiveShadow = false;
  mesh.matrixAutoUpdate = false;
  return mesh;
}
