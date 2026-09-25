// Fetches building tiles and turns them into meshes off the main thread.

import { fetchPack } from '../core/pack.ts';
import { extrude, type TileArrays, type MeshBuffers } from './extrude.ts';

interface Job { url: string; id: string }

const transfer = (m: MeshBuffers) => [m.position.buffer, m.normal.buffer, m.color.buffer, m.facade.buffer, m.info.buffer, m.index.buffer];

self.onmessage = async (e: MessageEvent<Job>) => {
  const { url, id } = e.data;
  try {
    const pack = await fetchPack(url);
    const { main, detail } = extrude(pack.arrays as unknown as TileArrays, pack.meta.i * 131 + pack.meta.j);
    (self as unknown as Worker).postMessage({ id, meta: pack.meta, main, detail }, [...transfer(main), ...transfer(detail)]);
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: String(err) });
  }
};
