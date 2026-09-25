// Regular grids over the local frame, and the rasterisers that fill them.

import type { Ring, Polygon } from './osm.ts';

/** A grid of nodes at (x0 + i·cell, z0 + j·cell), i < nx, j < nz, stored row by row. */
export class Grid<T extends Float32Array | Uint8Array | Uint16Array | Int32Array> {
  x0: number; z0: number; cell: number; nx: number; nz: number; data: T;
  constructor(x0: number, z0: number, cell: number, nx: number, nz: number, data: T) {
    this.x0 = x0; this.z0 = z0; this.cell = cell; this.nx = nx; this.nz = nz; this.data = data;
  }
  index(i: number, j: number) {
    return j * this.nx + i;
  }
  get(i: number, j: number) {
    i = i < 0 ? 0 : i >= this.nx ? this.nx - 1 : i;
    j = j < 0 ? 0 : j >= this.nz ? this.nz - 1 : j;
    return this.data[j * this.nx + i];
  }
  /** Bilinear sample at a world position, clamped at the edges. */
  sample(x: number, z: number): number {
    const fx = (x - this.x0) / this.cell, fz = (z - this.z0) / this.cell;
    const i = Math.floor(fx), j = Math.floor(fz);
    const tx = fx - i, tz = fz - j;
    const a = this.get(i, j), b = this.get(i + 1, j), c = this.get(i, j + 1), d = this.get(i + 1, j + 1);
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
  }
  /** The value of the node nearest to a world position. */
  nearest(x: number, z: number) {
    return this.get(Math.round((x - this.x0) / this.cell), Math.round((z - this.z0) / this.cell));
  }
}

/**
 * Calls `fill(i, j)` for every node whose position lies inside the polygon (even–odd rule over
 * the outer ring and the holes). Nodes are at x0 + i·cell.
 */
export function scanPolygon(
  rings: Ring[],
  x0: number, z0: number, cell: number, nx: number, nz: number,
  fill: (i: number, j: number) => void,
) {
  let minZ = Infinity, maxZ = -Infinity;
  for (const r of rings) for (let k = 1; k < r.length; k += 2) { minZ = Math.min(minZ, r[k]); maxZ = Math.max(maxZ, r[k]); }
  const j0 = Math.max(0, Math.ceil((minZ - z0) / cell));
  const j1 = Math.min(nz - 1, Math.floor((maxZ - z0) / cell));
  const xs: number[] = [];
  for (let j = j0; j <= j1; j++) {
    const z = z0 + j * cell;
    xs.length = 0;
    for (const r of rings) {
      const n = r.length / 2;
      for (let a = 0, b = n - 1; a < n; b = a++) {
        const za = r[a * 2 + 1], zb = r[b * 2 + 1];
        if (za > z !== zb > z) xs.push(r[a * 2] + ((z - za) / (zb - za)) * (r[b * 2] - r[a * 2]));
      }
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const i0 = Math.max(0, Math.ceil((xs[k] - x0) / cell));
      const i1 = Math.min(nx - 1, Math.floor((xs[k + 1] - x0) / cell));
      for (let i = i0; i <= i1; i++) fill(i, j);
    }
  }
}

export function polygonRings(p: Polygon): Ring[] {
  return [p.outer, ...p.holes];
}

/** Calls `fill(i, j)` for every node within `radius` of the polyline. */
export function scanLine(
  line: Ring, radius: number,
  x0: number, z0: number, cell: number, nx: number, nz: number,
  fill: (i: number, j: number) => void,
) {
  const r2 = radius * radius;
  for (let k = 0; k + 3 < line.length; k += 2) {
    const ax = line[k], az = line[k + 1], bx = line[k + 2], bz = line[k + 3];
    const dx = bx - ax, dz = bz - az;
    const len2 = dx * dx + dz * dz || 1e-9;
    const i0 = Math.max(0, Math.floor((Math.min(ax, bx) - radius - x0) / cell));
    const i1 = Math.min(nx - 1, Math.ceil((Math.max(ax, bx) + radius - x0) / cell));
    const j0 = Math.max(0, Math.floor((Math.min(az, bz) - radius - z0) / cell));
    const j1 = Math.min(nz - 1, Math.ceil((Math.max(az, bz) + radius - z0) / cell));
    for (let j = j0; j <= j1; j++) {
      const pz = z0 + j * cell;
      for (let i = i0; i <= i1; i++) {
        const px = x0 + i * cell;
        let t = ((px - ax) * dx + (pz - az) * dz) / len2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const ex = ax + t * dx - px, ez = az + t * dz - pz;
        if (ex * ex + ez * ez <= r2) fill(i, j);
      }
    }
  }
}
