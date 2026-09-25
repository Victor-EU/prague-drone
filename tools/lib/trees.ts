// Trees from the canopy height model (design.md §8.4): ČÚZK's surface model less the bare terrain,
// at 1 m over the world (tools/fetch-data.ts writes it to cache/chm/). Buildings, bridges and water
// are masked out; the rest is smoothed a little, and every local maximum that stands high enough
// above its surroundings is a crown's top. The crown's spread is where the canopy falls away from
// it, looking out in eight directions. Land use and the district then say what kind of tree it is.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { WORLD } from '../../src/core/geo.ts';
import { Kind } from '../../src/core/trees.ts';

export interface TreeRec { x: number; z: number; h: number; r: number; kind: number; seed: number }

/** The canopy over the world at 1 m, row by row from the north-west corner, in 0.2 m steps. */
export interface Canopy { data: Uint8Array; nx: number; nz: number; x0: number; z0: number }

const T = 1000;

export function loadCanopy(): Canopy | null {
  const nx = WORLD.xMax - WORLD.xMin, nz = WORLD.zMax - WORLD.zMin;
  const data = new Uint8Array(nx * nz);
  let missing = 0;
  for (let z0 = WORLD.zMin; z0 < WORLD.zMax; z0 += T)
    for (let x0 = WORLD.xMin; x0 < WORLD.xMax; x0 += T) {
      const file = join('cache', 'chm', `${x0}_${z0}.u8`);
      if (!existsSync(file)) { missing++; continue; }
      const tile = readFileSync(file);
      for (let j = 0; j < T; j++) data.set(tile.subarray(j * T, (j + 1) * T), (z0 - WORLD.zMin + j) * nx + (x0 - WORLD.xMin));
    }
  if (missing === (nx / T) * (nz / T)) return null;
  if (missing) console.warn(`  canopy: ${missing} tiles missing; run tools/fetch-data.ts chm`);
  return { data, nx, nz, x0: WORLD.xMin, z0: WORLD.zMin };
}

export interface FindOptions {
  /** 1 where no tree can stand (buildings, decks, water), same grid as the canopy. */
  mask: Uint8Array;
  /** The kind of tree at a place, from its height and crown radius. */
  kind: (x: number, z: number, h: number, r: number, seed: number) => number;
  /** The lowest top that counts as a tree at a place: lower on lawns and in orchards, where no car stands. */
  minHeight: (x: number, z: number) => number;
}

/** Finds the crowns, block by block (so the smoothed heights of the whole world never sit in memory). */
export function findTrees(c: Canopy, o: FindOptions): TreeRec[] {
  const out: TreeRec[] = [];
  const B = 250, M = 24;
  const W = B + 2 * M;
  const raw = new Float32Array(W * W), tmp = new Float32Array(W * W), s = new Float32Array(W * W);
  const MIN_H = 1.8;
  // Circular windows for the maximum test, by radius.
  const discs: number[][] = [];
  for (let w = 0; w <= 4; w++) {
    const d: number[] = [];
    for (let dj = -w; dj <= w; dj++) for (let di = -w; di <= w; di++) if ((di || dj) && di * di + dj * dj <= w * w + w) d.push(dj * W + di);
    discs.push(d);
  }
  const RAYS = [[1, 0], [0.7071, 0.7071], [0, 1], [-0.7071, 0.7071], [-1, 0], [-0.7071, -0.7071], [0, -1], [0.7071, -0.7071]];

  for (let bz = 0; bz < c.nz; bz += B)
    for (let bx = 0; bx < c.nx; bx += B) {
      // The block with its margin, masked, in metres.
      for (let j = 0; j < W; j++) {
        const gj = bz - M + j;
        for (let i = 0; i < W; i++) {
          const gi = bx - M + i;
          const k = j * W + i;
          if (gi < 0 || gj < 0 || gi >= c.nx || gj >= c.nz) { raw[k] = 0; continue; }
          const g = gj * c.nx + gi;
          raw[k] = o.mask[g] ? 0 : c.data[g] * 0.2;
        }
      }
      // Smoothed with a 1-2-1 kernel each way, which keeps the young orchard trees (two metres
      // across) and merges the leaf clusters of a big crown's top.
      for (let j = 0; j < W; j++)
        for (let i = 1; i < W - 1; i++) {
          const k = j * W + i;
          tmp[k] = (raw[k - 1] + 2 * raw[k] + raw[k + 1]) / 4;
        }
      for (let j = 1; j < W - 1; j++)
        for (let i = 0; i < W; i++) {
          const k = j * W + i;
          s[k] = (tmp[k - W] + 2 * tmp[k] + tmp[k + W]) / 4;
        }

      for (let j = M; j < M + B; j++)
        for (let i = M; i < M + B; i++) {
          const k = j * W + i;
          const h = s[k];
          if (h < MIN_H) continue;
          // A top: higher than everything within a radius that grows with the tree.
          const w = Math.min(4, Math.max(1, Math.round(1 + 0.08 * h)));
          let top = true;
          for (const d of discs[w]) {
            const v = s[k + d];
            if (v > h || (v === h && d < 0)) { top = false; break; }
          }
          if (!top) continue;
          const x = c.x0 + bx - M + i + 0.5, z = c.z0 + bz - M + j + 0.5;
          if (h < o.minHeight(x, z)) continue;
          // Flat tops are roofs and vehicles the footprints missed: a crown's leaves make it rough.
          let rough = 0;
          for (let dj = -2; dj <= 2; dj++)
            for (let di = -2; di <= 2; di++) {
              const q = k + dj * W + di;
              rough += Math.abs(4 * raw[q] - raw[q - 1] - raw[q + 1] - raw[q - W] - raw[q + W]);
            }
          rough /= 25 * 4;
          if (rough < 0.06) continue;
          // The crown's spread: out along eight rays until the canopy falls below half the height,
          // or climbs again toward a neighbouring crown.
          const edge = Math.max(2, 0.5 * h), maxR = Math.min(14, 3 + 0.45 * h);
          let sum = 0, lo = Infinity;
          for (const [dx, dz] of RAYS) {
            let len = maxR, low = h;
            for (let t = 1; t <= maxR; t++) {
              const q = Math.round(j + dz * t) * W + Math.round(i + dx * t);
              const v = s[q];
              if (v < edge || v > low + 0.6) { len = t - 0.5; break; }
              low = Math.min(low, v);
            }
            sum += len;
            lo = Math.min(lo, len);
          }
          let r = sum / RAYS.length + 0.5;
          // Poles and walls: too thin one way or all ways. The young orchard trees are a metre or
          // two across, which the survey smooths to a point: they keep a fruit tree's proportions.
          if (h < 6) { if (r < 1) continue; r = Math.max(r, 0.35 * h); }
          else if (r < 1.7 || lo < 0.5) continue;
          const seed = hash(x, z);
          r = Math.min(r, 14);
          out.push({ x, z, h, r, kind: o.kind(x, z, h, r, seed), seed });
        }
    }
  return out;
}

export function hash(x: number, z: number): number {
  let h = (Math.round(x * 10) * 73856093) ^ (Math.round(z * 10) * 19349663);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  return (h ^ (h >>> 15)) & 255;
}

/** Tallies by kind, for the build log. */
export function tally(trees: TreeRec[]): string {
  const names = Object.fromEntries(Object.entries(Kind).map(([k, v]) => [v, k]));
  const n: Record<string, number> = {};
  for (const t of trees) n[names[t.kind]] = (n[names[t.kind]] ?? 0) + 1;
  return Object.entries(n).map(([k, v]) => `${v} ${k.toLowerCase()}`).join(', ');
}
