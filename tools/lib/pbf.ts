// A minimal reader for the OSM PBF format (https://wiki.openstreetmap.org/wiki/PBF_Format):
// length-prefixed blobs, zlib-compressed primitive blocks, dense nodes, ways and relations.
// Enough to filter a city extract; no dependencies beyond node:zlib.

import { openSync, readSync, closeSync, fstatSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

export type Tags = Record<string, string>;
export interface PbfHandlers {
  node?(id: number, lat: number, lon: number, tags: Tags | null): void;
  way?(id: number, tags: Tags, refs: number[]): void;
  relation?(id: number, tags: Tags, members: { type: 'node' | 'way' | 'relation'; ref: number; role: string }[]): void;
}

/** Protocol buffer reader over a byte range. Numbers stay exact up to 2^53, which OSM ids fit. */
class Pb {
  buf: Uint8Array;
  pos: number;
  end: number;
  constructor(buf: Uint8Array, pos = 0, end = buf.length) {
    this.buf = buf; this.pos = pos; this.end = end;
  }
  varint(): number {
    let result = 0, mul = 1, b: number;
    do {
      b = this.buf[this.pos++];
      result += (b & 0x7f) * mul;
      mul *= 128;
    } while (b & 0x80);
    return result;
  }
  svarint(): number {
    const v = this.varint();
    return v % 2 === 0 ? v / 2 : -(v + 1) / 2;
  }
  /** Returns [field number, wire type], or null at the end. */
  tag(): [number, number] | null {
    if (this.pos >= this.end) return null;
    const t = this.varint();
    return [Math.floor(t / 8), t & 7];
  }
  sub(): Pb {
    const len = this.varint();
    const p = new Pb(this.buf, this.pos, this.pos + len);
    this.pos += len;
    return p;
  }
  bytes(): Uint8Array {
    const len = this.varint();
    const b = this.buf.subarray(this.pos, this.pos + len);
    this.pos += len;
    return b;
  }
  skip(wire: number) {
    if (wire === 0) this.varint();
    else if (wire === 1) this.pos += 8;
    else if (wire === 2) {
      const len = this.varint(); // read first: `pos += varint()` would use the old pos
      this.pos += len;
    }
    else if (wire === 5) this.pos += 4;
    else throw new Error(`unsupported wire type ${wire}`);
  }
  packedVarints(signed: boolean): number[] {
    const p = this.sub();
    const out: number[] = [];
    while (p.pos < p.end) out.push(signed ? p.svarint() : p.varint());
    return out;
  }
}

const decoder = new TextDecoder();

function readBlock(data: Uint8Array, h: PbfHandlers) {
  const pb = new Pb(data);
  let strings: string[] = [];
  const groups: Pb[] = [];
  let granularity = 100, latOffset = 0, lonOffset = 0;
  for (let t = pb.tag(); t; t = pb.tag()) {
    const [f, w] = t;
    if (f === 1) {
      const st = pb.sub();
      strings = [];
      for (let u = st.tag(); u; u = st.tag()) {
        if (u[0] === 1) strings.push(decoder.decode(st.bytes()));
        else st.skip(u[1]);
      }
    } else if (f === 2) groups.push(pb.sub());
    else if (f === 17) granularity = pb.varint();
    else if (f === 19) latOffset = pb.varint();
    else if (f === 20) lonOffset = pb.varint();
    else pb.skip(w);
  }
  const coord = (v: number, off: number) => 1e-9 * (off + granularity * v);
  const tagsOf = (keys: number[], vals: number[]): Tags => {
    const t: Tags = {};
    for (let i = 0; i < keys.length; i++) t[strings[keys[i]]] = strings[vals[i]];
    return t;
  };

  for (const g of groups) {
    for (let t = g.tag(); t; t = g.tag()) {
      const [f, w] = t;
      if (f === 2 && h.node) {
        // Dense nodes: delta-coded ids and coordinates, tags as a flat key/value list with 0 separators.
        const d = g.sub();
        let ids: number[] = [], lats: number[] = [], lons: number[] = [], kv: number[] = [];
        for (let u = d.tag(); u; u = d.tag()) {
          if (u[0] === 1) ids = d.packedVarints(true);
          else if (u[0] === 8) lats = d.packedVarints(true);
          else if (u[0] === 9) lons = d.packedVarints(true);
          else if (u[0] === 10) kv = d.packedVarints(false);
          else d.skip(u[1]);
        }
        let id = 0, lat = 0, lon = 0, k = 0;
        for (let i = 0; i < ids.length; i++) {
          id += ids[i]; lat += lats[i]; lon += lons[i];
          let tags: Tags | null = null;
          if (kv.length) {
            while (kv[k] !== 0) {
              (tags ??= {})[strings[kv[k]]] = strings[kv[k + 1]];
              k += 2;
            }
            k++;
          }
          h.node(id, coord(lat, latOffset), coord(lon, lonOffset), tags);
        }
      } else if (f === 1 && h.node) {
        const n = g.sub();
        let id = 0, lat = 0, lon = 0, keys: number[] = [], vals: number[] = [];
        for (let u = n.tag(); u; u = n.tag()) {
          if (u[0] === 1) id = n.svarint();
          else if (u[0] === 2) keys = n.packedVarints(false);
          else if (u[0] === 3) vals = n.packedVarints(false);
          else if (u[0] === 8) lat = n.svarint();
          else if (u[0] === 9) lon = n.svarint();
          else n.skip(u[1]);
        }
        h.node(id, coord(lat, latOffset), coord(lon, lonOffset), keys.length ? tagsOf(keys, vals) : null);
      } else if (f === 3 && h.way) {
        const wy = g.sub();
        let id = 0, keys: number[] = [], vals: number[] = [], refs: number[] = [];
        for (let u = wy.tag(); u; u = wy.tag()) {
          if (u[0] === 1) id = wy.varint();
          else if (u[0] === 2) keys = wy.packedVarints(false);
          else if (u[0] === 3) vals = wy.packedVarints(false);
          else if (u[0] === 8) refs = wy.packedVarints(true);
          else wy.skip(u[1]);
        }
        for (let i = 1; i < refs.length; i++) refs[i] += refs[i - 1];
        h.way(id, tagsOf(keys, vals), refs);
      } else if (f === 4 && h.relation) {
        const r = g.sub();
        let id = 0, keys: number[] = [], vals: number[] = [], roles: number[] = [], mems: number[] = [], types: number[] = [];
        for (let u = r.tag(); u; u = r.tag()) {
          if (u[0] === 1) id = r.varint();
          else if (u[0] === 2) keys = r.packedVarints(false);
          else if (u[0] === 3) vals = r.packedVarints(false);
          else if (u[0] === 8) roles = r.packedVarints(false);
          else if (u[0] === 9) mems = r.packedVarints(true);
          else if (u[0] === 10) types = r.packedVarints(false);
          else r.skip(u[1]);
        }
        let ref = 0;
        const members = mems.map((m, i) => {
          ref += m;
          return { type: (['node', 'way', 'relation'] as const)[types[i]], ref, role: strings[roles[i]] };
        });
        h.relation(id, tagsOf(keys, vals), members);
      } else g.skip(w);
    }
  }
}

/** Streams every entity of a .osm.pbf file through the handlers, in file order. */
export function readPbf(path: string, h: PbfHandlers) {
  const fd = openSync(path, 'r');
  const size = fstatSync(fd).size;
  let pos = 0;
  const len4 = Buffer.alloc(4);
  try {
    while (pos < size) {
      readSync(fd, len4, 0, 4, pos);
      const headerLen = len4.readUInt32BE(0);
      const header = Buffer.alloc(headerLen);
      readSync(fd, header, 0, headerLen, pos + 4);
      let type = '', dataSize = 0;
      const hp = new Pb(header);
      for (let t = hp.tag(); t; t = hp.tag()) {
        if (t[0] === 1) type = decoder.decode(hp.bytes());
        else if (t[0] === 3) dataSize = hp.varint();
        else hp.skip(t[1]);
      }
      const blob = Buffer.alloc(dataSize);
      readSync(fd, blob, 0, dataSize, pos + 4 + headerLen);
      pos += 4 + headerLen + dataSize;
      if (type !== 'OSMData') continue;
      const bp = new Pb(blob);
      let data: Uint8Array | null = null;
      for (let t = bp.tag(); t; t = bp.tag()) {
        if (t[0] === 1) data = bp.bytes();
        else if (t[0] === 3) data = inflateSync(bp.bytes());
        else if (t[0] === 4 || t[0] === 6 || t[0] === 7) throw new Error('only zlib-compressed PBF blobs are supported');
        else bp.skip(t[1]);
      }
      if (data) readBlock(data, h);
    }
  } finally {
    closeSync(fd);
  }
}
