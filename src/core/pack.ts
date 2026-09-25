// A small binary container for world data, shared by tools/build-world.ts and the app.
//
//   'PRAH' | u32 header length | header JSON (padded to 8) | arrays, each aligned to 8 bytes
//
// The header holds free-form `meta` and the name, type, byte offset and length of each array.

export type Typed =
  | Float32Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8Array
  | Int8Array;

const CTORS = { Float32Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Uint8Array, Int8Array } as const;
type CtorName = keyof typeof CTORS;

interface Entry {
  name: string;
  type: CtorName;
  offset: number;
  length: number;
}

const pad8 = (n: number) => (n + 7) & ~7;

export function encodePack(meta: unknown, arrays: Record<string, Typed>): Uint8Array {
  const entries: Entry[] = [];
  let offset = 0;
  for (const [name, arr] of Object.entries(arrays)) {
    entries.push({ name, type: arr.constructor.name as CtorName, offset, length: arr.length });
    offset = pad8(offset + arr.byteLength);
  }
  const header = new TextEncoder().encode(JSON.stringify({ meta, arrays: entries }));
  const headerLen = pad8(header.length);
  const out = new Uint8Array(8 + headerLen + offset);
  out.set([0x50, 0x52, 0x41, 0x48], 0); // PRAH
  new DataView(out.buffer).setUint32(4, headerLen, true);
  out.set(header, 8);
  out.fill(0x20, 8 + header.length, 8 + headerLen); // pad the JSON with spaces
  const base = 8 + headerLen;
  entries.forEach((e, i) => {
    const arr = Object.values(arrays)[i];
    out.set(new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength), base + e.offset);
  });
  return out;
}

export interface Pack<M = any> {
  meta: M;
  arrays: Record<string, Typed>;
}

export function decodePack<M = any>(buf: ArrayBuffer): Pack<M> {
  const bytes = new Uint8Array(buf);
  if (bytes[0] !== 0x50 || bytes[1] !== 0x52 || bytes[2] !== 0x41 || bytes[3] !== 0x48) throw new Error('not a PRAH pack');
  const headerLen = new DataView(buf).getUint32(4, true);
  const header = JSON.parse(new TextDecoder().decode(bytes.subarray(8, 8 + headerLen)));
  const base = 8 + headerLen;
  const arrays: Record<string, Typed> = {};
  for (const e of header.arrays as Entry[]) arrays[e.name] = new CTORS[e.type](buf, base + e.offset, e.length);
  return { meta: header.meta, arrays };
}

/** Fetches a pack, gunzipping it when the server did not (the files are stored gzipped). */
export async function fetchPack<M = any>(url: string): Promise<Pack<M>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  let buf = await res.arrayBuffer();
  const b = new Uint8Array(buf, 0, 2);
  if (b[0] === 0x1f && b[1] === 0x8b) {
    const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
    buf = await new Response(stream).arrayBuffer();
  }
  return decodePack<M>(buf);
}
