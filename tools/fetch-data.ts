// Downloads and caches the raw world data (design.md §6.3). Nothing here runs in the app.
//
//   node tools/fetch-data.ts               fetch whatever is missing from cache/
//   node tools/fetch-data.ts --force       fetch everything again
//   node tools/fetch-data.ts --overpass    take OSM from Overpass instead of the city extract
//   node tools/fetch-data.ts dem | osm     only one of the two
//
// OSM comes from the BBBike Prague extract (one PBF file, filtered here into the same layers the
// Overpass queries below describe), or from Overpass; terrain from the ČÚZK DMR 5G image service.

import { mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { request } from 'node:https';
import { createHash } from 'node:crypto';
import { readdirSync, rmSync } from 'node:fs';
import { readPbf, type Tags } from './lib/pbf.ts';
import { OSM_BBOX, WORLD, HORIZON, xToLon, zToLat } from '../src/core/geo.ts';

const CACHE = 'cache';
const FORCE = process.argv.includes('--force');
const USE_OVERPASS = process.argv.includes('--overpass');
const UA = 'praha-drone-build/0.1 (+https://github.com/Victor-EU/prague-drone)';

const OVERPASS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
const DMR5G = 'https://ags.cuzk.gov.cz/arcgis2/rest/services/dmr5g/ImageServer/exportImage';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fresh(path: string): boolean {
  return !FORCE && existsSync(path) && statSync(path).size > 0;
}

/**
 * One POST on a fresh connection. Overpass balances connections across backends, and fetch()
 * keeps its connection alive, which pins every retry to the same (possibly overloaded) backend.
 */
function post(url: string, body: string, timeoutMs: number): Promise<{ status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: 'POST',
        agent: false,
        headers: {
          'User-Agent': UA,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: timeoutMs,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode ?? 0, text: Buffer.concat(chunks).toString('utf8') }));
        res.on('error', reject);
      },
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end(body);
  });
}

async function overpass(query: string, attempts = 8): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    // The main instance first and most often; the mirrors only as fallbacks.
    const url = OVERPASS[attempt < 4 ? 0 : attempt % OVERPASS.length];
    try {
      const { status, text } = await post(url, 'data=' + encodeURIComponent(query), 240_000);
      if (status === 200 && text.trimStart().startsWith('{') && !text.includes('"remark": "runtime error')) return text;
      lastError = new Error(`${url} → ${status}: ${text.slice(0, 120).replace(/\s+/g, ' ')}`);
    } catch (e) {
      lastError = e;
    }
    console.warn(`  overpass attempt ${attempt + 1} failed: ${String(lastError).slice(0, 160)}`);
    await sleep(10000 * (attempt + 1));
  }
  throw lastError;
}

// ---- OSM ------------------------------------------------------------------

const [S, W, N, E] = OSM_BBOX;

/** Overpass statements per layer, each run against the bbox. `split` breaks the bbox into n×n cells. */
const LAYERS: { name: string; body: string; split?: number }[] = [
  {
    name: 'buildings',
    split: 6,
    body: `way["building"]; relation["building"]["type"="multipolygon"];
           way["building:part"]; relation["building:part"]["type"="multipolygon"];`,
  },
  {
    name: 'water',
    body: `way["natural"="water"]; relation["natural"="water"];
           way["waterway"="riverbank"]; relation["waterway"="riverbank"];
           way["waterway"]; node["waterway"~"weir|dam|lock_gate"];`,
  },
  {
    name: 'landuse',
    split: 3,
    body: `way["landuse"]; relation["landuse"]["type"="multipolygon"];
           way["leisure"]; relation["leisure"]["type"="multipolygon"];
           way["natural"~"wood|scrub|grassland|heath|bare_rock|cliff|sand|beach"];
           relation["natural"~"wood|scrub|grassland|heath|bare_rock"]["type"="multipolygon"];
           way["amenity"~"parking|grave_yard"]; way["place"="square"];
           way["highway"]["area"="yes"]; way["area:highway"];
           relation["place"="square"]; relation["highway"="pedestrian"]["type"="multipolygon"];`,
  },
  {
    name: 'highways',
    split: 4,
    body: `way["highway"];`,
  },
  {
    name: 'railways',
    body: `way["railway"~"^(tram|rail|light_rail|subway|funicular|narrow_gauge)$"];
           relation["route"="tram"];`,
  },
  {
    name: 'bridges',
    body: `way["man_made"="bridge"]; relation["man_made"="bridge"];`,
  },
  { name: 'districts', body: `relation["boundary"="cadastral"];` },
  { name: 'lamps', body: `node["highway"="street_lamp"];` },
];

function cells(n: number): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const s = S + ((N - S) * i) / n, nn = S + ((N - S) * (i + 1)) / n;
      const w = W + ((E - W) * j) / n, e = W + ((E - W) * (j + 1)) / n;
      out.push([s, w, nn, e]);
    }
  return out;
}

type Box = [number, number, number, number];

/**
 * Elements of one layer in one box. A box the server keeps timing out on is split into quarters,
 * down to two levels, and the pieces are merged.
 */
async function fetchBox(body: string, box: Box, depth = 0): Promise<unknown[]> {
  const bbox = box.map((v) => v.toFixed(5)).join(',');
  const q = `[out:json][timeout:180][bbox:${bbox}];(${body});out geom;`;
  try {
    return JSON.parse(await overpass(q, depth < 2 ? 3 : 8)).elements;
  } catch (e) {
    if (depth >= 2) throw e;
    console.warn(`  splitting ${bbox} into quarters`);
    const [s, w, n, ee] = box, ms = (s + n) / 2, mw = (w + ee) / 2;
    const out: unknown[] = [];
    for (const q4 of [[s, w, ms, mw], [s, mw, ms, ee], [ms, w, n, mw], [ms, mw, n, ee]] as Box[])
      out.push(...(await fetchBox(body, q4, depth + 1)));
    return out;
  }
}

async function fetchOsm() {
  mkdirSync(join(CACHE, 'osm'), { recursive: true });
  for (const layer of LAYERS) {
    const boxes = layer.split ? cells(layer.split) : [[S, W, N, E] as Box];
    for (let k = 0; k < boxes.length; k++) {
      const file = join(CACHE, 'osm', boxes.length > 1 ? `${layer.name}-${k}.json` : `${layer.name}.json`);
      if (fresh(file)) {
        console.log(`osm ${file}: cached`);
        continue;
      }
      const t0 = Date.now();
      const elements = await fetchBox(layer.body, boxes[k]);
      const text = JSON.stringify({ elements });
      writeFileSync(file, text);
      console.log(`osm ${file}: ${(text.length / 1e6).toFixed(1)} MB in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
      await sleep(2000);
    }
  }
}

// ---- OSM from the city extract -----------------------------------------------------------------

const EXTRACT_URL = 'https://download.bbbike.org/osm/bbbike/Prag/Prag.osm.pbf';
const EXTRACT = join(CACHE, 'osm-extract', 'Prag.osm.pbf');

/** The Overpass statements of LAYERS, as tag tests on ways, relations and nodes. */
const has = (t: Tags, k: string) => t[k] !== undefined;
const FILTERS: Record<string, { way?: (t: Tags) => boolean; relation?: (t: Tags) => boolean; node?: (t: Tags) => boolean }> = {
  buildings: {
    way: (t) => has(t, 'building') || has(t, 'building:part'),
    relation: (t) => t.type === 'multipolygon' && (has(t, 'building') || has(t, 'building:part')),
  },
  water: {
    way: (t) => t.natural === 'water' || has(t, 'waterway'),
    relation: (t) => t.natural === 'water' || t.waterway === 'riverbank',
    node: (t) => /weir|dam|lock_gate/.test(t.waterway ?? ''),
  },
  landuse: {
    way: (t) =>
      has(t, 'landuse') || has(t, 'leisure') || /^(wood|scrub|grassland|heath|bare_rock|cliff|sand|beach)$/.test(t.natural ?? '') ||
      /^(parking|grave_yard)$/.test(t.amenity ?? '') || t.place === 'square' || (has(t, 'highway') && t.area === 'yes') || has(t, 'area:highway'),
    relation: (t) =>
      (t.type === 'multipolygon' && (has(t, 'landuse') || has(t, 'leisure') || /^(wood|scrub|grassland|heath|bare_rock)$/.test(t.natural ?? ''))) ||
      t.place === 'square' || (t.highway === 'pedestrian' && t.type === 'multipolygon'),
  },
  highways: { way: (t) => has(t, 'highway') },
  railways: {
    way: (t) => /^(tram|rail|light_rail|subway|funicular|narrow_gauge)$/.test(t.railway ?? ''),
    relation: (t) => t.route === 'tram',
  },
  bridges: { way: (t) => t.man_made === 'bridge', relation: (t) => t.man_made === 'bridge' },
  // Cadastral areas (Malá Strana, Staré Město, …) for the district rules of design.md §7.2, §8.1.
  districts: { relation: (t) => t.boundary === 'cadastral' },
  lamps: { node: (t) => t.highway === 'street_lamp' },
};

async function downloadExtract() {
  if (!FORCE && existsSync(EXTRACT) && statSync(EXTRACT).size > 1e6) return;
  mkdirSync(join(CACHE, 'osm-extract'), { recursive: true });
  const t0 = Date.now();
  const res = await fetch(EXTRACT_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`extract: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const sums = await (await fetch(EXTRACT_URL.replace('Prag.osm.pbf', 'CHECKSUM.txt'), { headers: { 'User-Agent': UA } })).text();
  const md5 = createHash('md5').update(buf).digest('hex');
  if (!sums.includes(`${md5} Prag.osm.pbf`)) throw new Error('extract: checksum does not match CHECKSUM.txt');
  writeFileSync(EXTRACT, buf);
  console.log(`extract: ${(buf.length / 1e6).toFixed(1)} MB in ${((Date.now() - t0) / 1000).toFixed(0)} s, ${res.headers.get('last-modified')}`);
}

/** Filters the extract into cache/osm/<layer>.json, in the shape Overpass returns with `out geom`. */
function osmFromExtract() {
  const t0 = Date.now();
  const inBox = (lat: number, lon: number) => lat >= S && lat <= N && lon >= W && lon <= E;
  type Member = { type: string; ref: number; role: string };
  const out: Record<string, unknown[]> = Object.fromEntries(Object.keys(FILTERS).map((k) => [k, []]));

  // Pass 1: the relations we want, and the ways they are made of.
  const rels: { id: number; tags: Tags; members: Member[]; layers: string[] }[] = [];
  const memberWays = new Set<number>();
  readPbf(EXTRACT, {
    relation(id, tags, members) {
      const layers = Object.keys(FILTERS).filter((k) => FILTERS[k].relation?.(tags));
      if (!layers.length) return;
      rels.push({ id, tags, members, layers });
      for (const m of members) if (m.type === 'way') memberWays.add(m.ref);
    },
  });

  // Pass 2: every node's position (the file is sorted by id), then the ways.
  let ids = new Float64Array(1 << 22), lats = new Float64Array(1 << 22), lons = new Float64Array(1 << 22), n = 0;
  const wayGeom = new Map<number, { lat: number; lon: number }[]>();
  const wayIn = new Set<number>();
  const find = (id: number) => {
    let lo = 0, hi = n - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (ids[mid] < id) lo = mid + 1;
      else if (ids[mid] > id) hi = mid - 1;
      else return mid;
    }
    return -1;
  };
  readPbf(EXTRACT, {
    node(id, lat, lon, tags) {
      if (n === ids.length) {
        const grow = (a: Float64Array) => { const b = new Float64Array(a.length * 2); b.set(a); return b; };
        ids = grow(ids); lats = grow(lats); lons = grow(lons);
      }
      if (n && id < ids[n - 1]) throw new Error('extract nodes are not sorted by id');
      ids[n] = id; lats[n] = lat; lons[n] = lon; n++;
      if (tags && inBox(lat, lon))
        for (const [k, f] of Object.entries(FILTERS)) if (f.node?.(tags)) out[k].push({ type: 'node', id, lat, lon, tags });
    },
    way(id, tags, refs) {
      const layers = Object.keys(FILTERS).filter((k) => FILTERS[k].way?.(tags));
      const member = memberWays.has(id);
      if (!layers.length && !member) return;
      const geometry: { lat: number; lon: number }[] = [];
      let inside = false;
      for (const r of refs) {
        const k = find(r);
        if (k < 0) continue;
        const p = { lat: +lats[k].toFixed(7), lon: +lons[k].toFixed(7) };
        geometry.push(p);
        inside ||= inBox(p.lat, p.lon);
      }
      if (geometry.length < 2) return;
      if (member) { wayGeom.set(id, geometry); if (inside) wayIn.add(id); }
      if (inside) for (const k of layers) out[k].push({ type: 'way', id, tags, geometry });
    },
  });

  for (const r of rels) {
    if (!r.members.some((m) => m.type === 'way' && wayIn.has(m.ref))) continue;
    const members = r.members
      .filter((m) => m.type === 'way' && wayGeom.has(m.ref))
      .map((m) => ({ type: 'way', ref: m.ref, role: m.role, geometry: wayGeom.get(m.ref) }));
    for (const k of r.layers) out[k].push({ type: 'relation', id: r.id, tags: r.tags, members });
  }

  mkdirSync(join(CACHE, 'osm'), { recursive: true });
  for (const [layer, elements] of Object.entries(out)) {
    for (const f of readdirSync(join(CACHE, 'osm'))) if (new RegExp(`^${layer}-\\d+\\.json$`).test(f)) rmSync(join(CACHE, 'osm', f));
    const text = JSON.stringify({ source: EXTRACT_URL, elements });
    writeFileSync(join(CACHE, 'osm', `${layer}.json`), text);
    console.log(`osm ${layer}: ${elements.length} elements, ${(text.length / 1e6).toFixed(1)} MB`);
  }
  console.log(`osm from extract: ${n} nodes read in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

// ---- Terrain ----------------------------------------------------------------

/**
 * Requests a float32 grid in EPSG:4326 with square pixels of `step` degrees. The response is
 * band-sequential little-endian float32 followed by a one-bit validity mask; the service reports
 * the exact extent it delivered, which we store beside the data.
 */
async function fetchDem(name: string, lon0: number, lat0: number, lon1: number, lat1: number, step: number) {
  const bin = join(CACHE, 'dem', `${name}.f32`);
  const meta = join(CACHE, 'dem', `${name}.json`);
  if (fresh(bin) && fresh(meta)) {
    console.log(`dem ${name}: cached`);
    return;
  }
  const width = Math.round((lon1 - lon0) / step);
  const height = Math.round((lat1 - lat0) / step);
  lon1 = lon0 + width * step;
  lat1 = lat0 + height * step;
  const params = new URLSearchParams({
    bbox: [lon0, lat0, lon1, lat1].map((v) => v.toFixed(7)).join(','),
    bboxSR: '4326',
    imageSR: '4326',
    size: `${width},${height}`,
    format: 'bsq',
    pixelType: 'F32',
    interpolation: 'RSP_BilinearInterpolation',
    f: 'json',
  });
  const t0 = Date.now();
  const info = await (await fetch(`${DMR5G}?${params}`, { headers: { 'User-Agent': UA } })).json();
  if (!info.href) throw new Error(`dem ${name}: ${JSON.stringify(info).slice(0, 300)}`);
  if (info.width !== width || info.height !== height) throw new Error(`dem ${name}: size changed to ${info.width}×${info.height}`);
  const buf = Buffer.from(await (await fetch(info.href, { headers: { 'User-Agent': UA } })).arrayBuffer());
  const expected = width * height * 4;
  if (buf.length < expected) throw new Error(`dem ${name}: got ${buf.length} bytes, expected ${expected}`);
  const mask = buf.subarray(expected);
  let invalid = 0;
  for (let i = 0; i < width * height; i++) if (!(mask[i >> 3] & (0x80 >> (i & 7)))) invalid++;
  writeFileSync(bin, buf.subarray(0, expected));
  writeFileSync(
    meta,
    JSON.stringify({ source: 'ČÚZK DMR 5G', width, height, extent: info.extent, step, invalid }, null, 2),
  );
  console.log(`dem ${name}: ${width}×${height}, ${invalid} invalid px, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

async function fetchTerrain() {
  mkdirSync(join(CACHE, 'dem'), { recursive: true });
  // Detailed grid: the world rectangle plus a margin, at 0.00004° (≈4.4 m north–south, 2.9 m east–west).
  const m = 200;
  await fetchDem(
    'detail',
    xToLon(WORLD.xMin - m), zToLat(WORLD.zMax + m),
    xToLon(WORLD.xMax + m), zToLat(WORLD.zMin - m),
    0.00004,
  );
  // Horizon grid: 16 km around the origin at 0.0004° (≈44 m by 29 m).
  await fetchDem('horizon', xToLon(-HORIZON), zToLat(HORIZON), xToLon(HORIZON), zToLat(-HORIZON), 0.0004);
}

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (only.length === 0 || only.includes('dem')) await fetchTerrain();
if (only.length === 0 || only.includes('osm')) {
  if (USE_OVERPASS) await fetchOsm();
  else {
    await downloadExtract();
    const stamp = join(CACHE, 'osm', '.from-extract');
    if (FORCE || !existsSync(stamp) || statSync(stamp).mtimeMs < statSync(EXTRACT).mtimeMs) {
      osmFromExtract();
      writeFileSync(stamp, '');
    } else console.log('osm: cached (from extract)');
  }
}
console.log('done');
