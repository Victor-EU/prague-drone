// Fetches building tiles and extrudes them off the main thread.

import { fetchPack } from '../core/pack.ts';
import { extrude, type Footprints } from './extrude.ts';

interface Job { url: string; id: string; kinds: { bridge: number; box: number } }

self.onmessage = async (e: MessageEvent<Job>) => {
  const { url, id, kinds } = e.data;
  try {
    const pack = await fetchPack(url);
    const b = extrude(pack.arrays as unknown as Footprints, kinds, pack.meta.i * 131 + pack.meta.j);
    (self as unknown as Worker).postMessage({ id, meta: pack.meta, ...b }, [b.position.buffer, b.normal.buffer, b.color.buffer, b.index.buffer]);
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: String(err) });
  }
};
