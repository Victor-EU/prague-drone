// Fetches building tiles and turns them into meshes off the main thread; keeps each tile's
// arrays, and builds the facades' relief (design.md §8.2, M14) for a chunk of a tile when asked.

import { fetchPack } from '../core/pack.ts';
import { extrude, type TileArrays, type MeshBuffers } from './extrude.ts';
import { relief } from './relief.ts';

interface Job { url?: string; id: string; relief?: { ci: number; cj: number; tile: number; far: boolean } }

const transfer = (m: MeshBuffers) => [m.position.buffer, m.normal.buffer, m.color.buffer, m.facade.buffer, m.info.buffer, m.index.buffer];
const tiles = new Map<string, { arrays: TileArrays; seed: number }>();

self.onmessage = async (e: MessageEvent<Job>) => {
  const { url, id } = e.data;
  try {
    if (e.data.relief) {
      const t = tiles.get(id);
      if (!t) throw new Error(`no tile ${id} in this worker`);
      const { ci, cj, tile, far } = e.data.relief;
      const mesh = relief(t.arrays, t.seed, ci, cj, tile, far);
      (self as unknown as Worker).postMessage({ id, relief: { ci, cj, far }, mesh }, transfer(mesh));
      return;
    }
    const pack = await fetchPack(url!);
    const arrays = pack.arrays as unknown as TileArrays, seed = pack.meta.i * 131 + pack.meta.j;
    tiles.set(id, { arrays, seed });
    const { main, detail } = extrude(arrays, seed);
    (self as unknown as Worker).postMessage({ id, meta: pack.meta, main, detail }, [...transfer(main), ...transfer(detail)]);
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, relief: e.data.relief, error: String(err) });
  }
};
