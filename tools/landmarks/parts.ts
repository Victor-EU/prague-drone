// Building a landmark from its OSM Simple 3D Buildings parts (height, min_height, roof:shape,
// roof:height), in the landmarks' materials: walls with the palace window rows or plain stone,
// roofs from the straight skeleton in tiles, slate, copper or glass. Used where the mappers' parts
// already carry the massing (the Rudolfinum, the National Theatre's stage house), with the
// landmark's own details added on top by its module.

import { Kit, mat, type V2, type Mat } from './kit.ts';
import type { Site } from './index.ts';
import { parseLength } from '../lib/osm.ts';
import type { Shape } from '../lib/roofs.ts';
import { Surface, Metal, Glass } from '../../src/core/buildings.ts';

const SHAPE: Record<string, Shape> = {
  gabled: 'gabled', hipped: 'hipped', mansard: 'mansard', pyramidal: 'pyramidal', dome: 'dome', onion: 'onion', skillion: 'skillion', many: 'hipped', flat: 'flat',
};

export const COPPER = mat('#6f9a88', Surface.Metal, Metal.Copper);
export const SLATE = mat('#4a4d52', Surface.Metal, Metal.Slate);
export const GLASS_ROOF = mat('#9fb0b8', Surface.Glass, Glass.Curtain);

export interface PartStyle {
  /** Walls: a Surface.Wall material gets window rows, others are plain. */
  wall: Mat;
  /** The roof's material from the part's tags (default: copper if tagged so, else slate). */
  roof?: (tags: Record<string, string>) => Mat;
  flatTop?: Mat;
}

/** Builds the given parts (world rings) standing on `ground` (y); returns the highest point. */
export function buildParts(site: Site, k: Kit, keys: string[], ground: number, st: PartStyle): number {
  k.place(0, ground, 0, 90);
  k.ground = ground;
  let top = 0;
  for (const key of keys) {
    const f = site.feature(key);
    if (!f) continue;
    const t = f.tags;
    for (const p of f.polygons) {
      const ring: V2[] = [];
      for (let i = 0; i < p.outer.length; i += 2) ring.push([p.outer[i], p.outer[i + 1]]);
      const h = parseLength(t.height) ?? (parseFloat(t['building:levels'] ?? '3') * 3.6);
      const min = parseLength(t.min_height) ?? 0;
      const shape = SHAPE[t['roof:shape'] ?? 'flat'] ?? 'flat';
      const rh = shape === 'flat' ? 0 : parseLength(t['roof:height']) ?? Math.min(6, h * 0.25);
      const eave = h - rh;
      const roofM = st.roof?.(t) ?? (/glass/.test(t['roof:material'] ?? '') ? GLASS_ROOF : /copper|green/.test((t['roof:material'] ?? '') + (t['roof:colour'] ?? '')) ? COPPER : SLATE);
      if (eave - min > 0.3) k.prism(ring, min > 0.5 ? min : -2, eave, st.wall, shape === 'flat' ? st.flatTop ?? roofM : null, { windows: st.wall.kind === Surface.Wall && eave - min > 4, eave: ground + eave });
      if (shape !== 'flat' && rh > 0.2) k.roof(ring, eave, { shape, pitch: 45, height: rh, cap: 99, gable: () => shape === 'gabled' }, roofM, st.wall);
      top = Math.max(top, h);
    }
  }
  return top;
}
