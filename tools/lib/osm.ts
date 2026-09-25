// Reading the Overpass cache and turning OSM elements into polygons and lines in the local frame.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { lonToX, latToZ } from '../../src/core/geo.ts';

export type Tags = Record<string, string>;
export interface LatLon { lat: number; lon: number }
export interface OsmElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  tags?: Tags;
  lat?: number;
  lon?: number;
  geometry?: (LatLon | null)[];
  members?: { type: string; ref: number; role: string; geometry?: (LatLon | null)[] }[];
}

/** A ring is a flat [x0, z0, x1, z1, …] list, not closed (the last point is not repeated). */
export type Ring = number[];
export interface Polygon { outer: Ring; holes: Ring[] }

export interface Feature {
  key: string; // "way/123"
  tags: Tags;
  polygons: Polygon[];
}

/** Loads every cached file for a layer (split layers have several) and removes duplicates. */
export function loadLayer(name: string): OsmElement[] {
  const dir = join('cache', 'osm');
  const files = readdirSync(dir).filter((f) => f === `${name}.json` || new RegExp(`^${name}-\\d+\\.json$`).test(f));
  if (files.length === 0) throw new Error(`no cached OSM layer "${name}"; run tools/fetch-data.ts`);
  const seen = new Map<string, OsmElement>();
  for (const f of files) {
    const data = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    for (const el of data.elements as OsmElement[]) seen.set(`${el.type}/${el.id}`, el);
  }
  return [...seen.values()];
}

export function layerExists(name: string): boolean {
  return existsSync(join('cache', 'osm', `${name}.json`)) || existsSync(join('cache', 'osm', `${name}-0.json`));
}

function toRing(geom: (LatLon | null)[]): Ring {
  const r: Ring = [];
  for (const p of geom) if (p) r.push(lonToX(p.lon), latToZ(p.lat));
  return r;
}

function isClosed(r: Ring): boolean {
  const n = r.length;
  return n >= 8 && r[0] === r[n - 2] && r[1] === r[n - 1];
}

function open(r: Ring): Ring {
  return isClosed(r) ? r.slice(0, -2) : r;
}

export function signedArea(r: Ring): number {
  let a = 0;
  const n = r.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) a += r[j * 2] * r[i * 2 + 1] - r[i * 2] * r[j * 2 + 1];
  return a / 2;
}

export function pointInRing(x: number, z: number, r: Ring): boolean {
  let inside = false;
  const n = r.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = r[i * 2], zi = r[i * 2 + 1], xj = r[j * 2], zj = r[j * 2 + 1];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

export function pointInPolygon(x: number, z: number, p: Polygon): boolean {
  if (!pointInRing(x, z, p.outer)) return false;
  for (const h of p.holes) if (pointInRing(x, z, h)) return false;
  return true;
}

/** Joins way segments end to end into closed rings. Unclosable leftovers are dropped. */
function joinRings(segments: Ring[]): Ring[] {
  const rings: Ring[] = [];
  const pool = segments.filter((s) => s.length >= 4).map((s) => s.slice());
  const key = (r: Ring, end: boolean) => (end ? `${r[r.length - 2]},${r[r.length - 1]}` : `${r[0]},${r[1]}`);
  while (pool.length) {
    let cur = pool.pop()!;
    let guard = 0;
    while (!isClosed(cur) && guard++ < 10000) {
      const tail = key(cur, true);
      let found = -1, reverse = false;
      for (let i = 0; i < pool.length; i++) {
        if (key(pool[i], false) === tail) { found = i; break; }
        if (key(pool[i], true) === tail) { found = i; reverse = true; break; }
      }
      if (found < 0) break;
      let next = pool.splice(found, 1)[0];
      if (reverse) {
        const rev: Ring = [];
        for (let i = next.length - 2; i >= 0; i -= 2) rev.push(next[i], next[i + 1]);
        next = rev;
      }
      cur = cur.concat(next.slice(2));
    }
    if (isClosed(cur)) rings.push(open(cur));
  }
  return rings;
}

/** Polygons of an area element: a closed way, or a multipolygon relation assembled from its members. */
export function polygonsOf(el: OsmElement): Polygon[] {
  if (el.type === 'way' && el.geometry) {
    const r = toRing(el.geometry);
    return isClosed(r) && r.length >= 8 ? [{ outer: open(r), holes: [] }] : [];
  }
  if (el.type === 'relation' && el.members) {
    const outer: Ring[] = [], inner: Ring[] = [];
    for (const m of el.members) {
      if (m.type !== 'way' || !m.geometry) continue;
      (m.role === 'inner' ? inner : outer).push(toRing(m.geometry));
    }
    const outers = joinRings(outer).filter((r) => r.length >= 6);
    const inners = joinRings(inner).filter((r) => r.length >= 6);
    const polys: Polygon[] = outers.map((o) => ({ outer: o, holes: [] }));
    for (const h of inners) {
      const owner = polys.find((p) => pointInRing(h[0], h[1], p.outer));
      if (owner) owner.holes.push(h);
    }
    return polys;
  }
  return [];
}

/** The line geometry of a way, in local metres. */
export function lineOf(el: OsmElement): Ring {
  return el.geometry ? toRing(el.geometry) : [];
}

export function features(elements: OsmElement[], filter: (t: Tags, el: OsmElement) => boolean): Feature[] {
  const out: Feature[] = [];
  for (const el of elements) {
    const tags = el.tags ?? {};
    if (!filter(tags, el)) continue;
    const polygons = polygonsOf(el);
    if (polygons.length) out.push({ key: `${el.type}/${el.id}`, tags, polygons });
  }
  return out;
}

/** Parses an OSM length such as "12", "12 m", "12.5m"; feet are converted. */
export function parseLength(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const m = /^\s*(-?\d+(?:[.,]\d+)?)\s*(m|ft|')?/.exec(v);
  if (!m) return undefined;
  const n = parseFloat(m[1].replace(',', '.'));
  if (!isFinite(n)) return undefined;
  return m[2] === 'ft' || m[2] === "'" ? n * 0.3048 : n;
}

export function parseNumber(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = parseFloat(v.replace(',', '.'));
  return isFinite(n) ? n : undefined;
}
