// Garden walls (design.md §8.4, added in M5): OSM's walls and retaining walls round the gardens of
// Malá Strana and Petřín, the lines that make the slopes read as walled gardens from the air and
// that 8725 shows under the Schönborn gloriette. Each is a slab following the ground, rendered
// cream where OSM says nothing else, stone or brick where it does; retaining walls in rubble.

import type { OsmElement } from './osm.ts';
import { lineOf, parseLength } from './osm.ts';
import { Kit, mat, type V3, type Mat } from '../landmarks/kit.ts';
import { Surface, Stone } from '../../src/core/buildings.ts';

const PLASTER = [mat('#ddd3c0', Surface.Stone, Stone.Render, 0.35), mat('#e3dccd', Surface.Stone, Stone.Render, 0.3), mat('#d2c6ae', Surface.Stone, Stone.Render, 0.4)];
const STONE = mat('#8a8174', Surface.Stone, Stone.Rubble, 0.5);
const BRICK = mat('#8e5a45', Surface.Stone, Stone.Brick, 0.4);
const COPING = mat('#a39b8d', Surface.Stone, Stone.Ashlar, 0.2);

export function gardenWalls(els: OsmElement[], ground: (x: number, z: number) => number, k: Kit, seen: (x: number, z: number) => boolean): { metres: number; count: number } {
  let metres = 0, count = 0;
  k.place(0, 0, 0);
  k.seed = 61;
  for (const el of els) {
    const t = el.tags ?? {};
    if (el.type !== 'way' || (t.barrier !== 'wall' && t.barrier !== 'retaining_wall')) continue;
    const retaining = t.barrier === 'retaining_wall';
    const h = parseLength(t.height) ?? (retaining ? 2 : 2.4);
    if (h < 1.6 || h > 12) continue;
    const m: Mat = /stone|rock/.test(t.material ?? '') || retaining ? STONE : /brick/.test(t.material ?? '') ? BRICK : PLASTER[el.id % PLASTER.length];
    const w = h > 3 ? 0.6 : 0.45;
    const line = lineOf(el);
    // Points along the line, closer where the ground bends under it (the wall follows the ground
    // to within 0.3 m), at most 16 m apart.
    const pts: [number, number][] = [];
    const split = (ax: number, az: number, bx: number, bz: number, depth: number) => {
      const mx = (ax + bx) / 2, mz = (az + bz) / 2;
      const bend = Math.abs(ground(mx, mz) - (ground(ax, az) + ground(bx, bz)) / 2);
      if (depth < 5 && (Math.hypot(bx - ax, bz - az) > 16 || (bend > 0.3 && Math.hypot(bx - ax, bz - az) > 2))) {
        split(ax, az, mx, mz, depth + 1);
        split(mx, mz, bx, bz, depth + 1);
      } else pts.push([ax, az]);
    };
    for (let i = 0; i + 3 < line.length; i += 2) split(line[i], line[i + 1], line[i + 2], line[i + 3], 0);
    if (line.length >= 2) pts.push([line[line.length - 2], line[line.length - 1]]);
    let any = false;
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1];
      if (!seen((ax + bx) / 2, (az + bz) / 2)) continue;
      const len = Math.hypot(bx - ax, bz - az);
      if (len < 0.05) continue;
      const nx = -(bz - az) / len * (w / 2), nz = (bx - ax) / len * (w / 2);
      const ga = ground(ax, az), gb = ground(bx, bz);
      if (Number.isNaN(ga) || Number.isNaN(gb)) continue;
      const P = (x: number, z: number, s: number, y: number): V3 => [x + nx * s, y, z + nz * s];
      k.ground = (ga + gb) / 2;
      for (const s of [1, -1]) {
        const n: V3 = [nx * s, 0, nz * s];
        k.poly([P(ax, az, s, ga - 0.6), P(bx, bz, s, gb - 0.6), P(bx, bz, s, gb + h), P(ax, az, s, ga + h)], m, { normal: n });
      }
      k.poly([P(ax, az, 1, ga + h), P(bx, bz, 1, gb + h), P(bx, bz, -1, gb + h), P(ax, az, -1, ga + h)], COPING, { normal: [0, 1, 0] });
      metres += len;
      any = true;
    }
    if (any) count++;
  }
  return { metres, count };
}
