// A decoded height grid from the world files (terrain, horizon, surface).

import type { Pack } from '../core/pack.ts';

export interface GridMeta { x0: number; z0: number; cell: number; nx: number; nz: number }

export class HeightGrid {
  readonly x0: number;
  readonly z0: number;
  readonly cell: number;
  readonly nx: number;
  readonly nz: number;
  readonly h: Float32Array;

  constructor(meta: GridMeta, h: Float32Array) {
    this.x0 = meta.x0; this.z0 = meta.z0; this.cell = meta.cell; this.nx = meta.nx; this.nz = meta.nz;
    this.h = h;
  }

  /** Decodes uint16 centimetres + 100 m, delta coded along rows (tools/build-world.ts). */
  static fromPack(pack: Pack<GridMeta>): HeightGrid {
    const d = pack.arrays.height as Uint16Array;
    const { nx } = pack.meta;
    const h = new Float32Array(d.length);
    let v = 0;
    for (let k = 0; k < d.length; k++) {
      v = k % nx === 0 ? d[k] : (v + d[k]) & 0xffff;
      h[k] = v / 100 - 100;
    }
    return new HeightGrid(pack.meta, h);
  }

  at(i: number, j: number): number {
    i = i < 0 ? 0 : i >= this.nx ? this.nx - 1 : i;
    j = j < 0 ? 0 : j >= this.nz ? this.nz - 1 : j;
    return this.h[j * this.nx + i];
  }

  sample(x: number, z: number): number {
    const fx = (x - this.x0) / this.cell, fz = (z - this.z0) / this.cell;
    const i = Math.floor(fx), j = Math.floor(fz);
    const tx = fx - i, tz = fz - j;
    const a = this.at(i, j), b = this.at(i + 1, j), c = this.at(i, j + 1), d = this.at(i + 1, j + 1);
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
  }

  /** Highest node within `r` metres of a point. */
  maxAround(x: number, z: number, r: number): number {
    const i0 = Math.floor((x - r - this.x0) / this.cell), i1 = Math.ceil((x + r - this.x0) / this.cell);
    const j0 = Math.floor((z - r - this.z0) / this.cell), j1 = Math.ceil((z + r - this.z0) / this.cell);
    let m = -Infinity;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) m = Math.max(m, this.at(i, j));
    return m;
  }

  contains(x: number, z: number): boolean {
    return x >= this.x0 && z >= this.z0 && x <= this.x0 + (this.nx - 1) * this.cell && z <= this.z0 + (this.nz - 1) * this.cell;
  }
}
