// Turns the raw downloads in cache/ into the app's world files under public/world/ (design.md §6.3).
//
//   node tools/build-world.ts
//
// Outputs, all gzipped PRAH packs (src/core/pack.ts) plus a manifest:
//   terrain.bin   5 m height grid over the world rectangle, river bed carved
//   horizon.bin   100 m height grid out to 16 km, detail grid inside the world rectangle
//   surface.bin   10 m grid of the highest thing at each place (ground, water, roofs, decks)
//   landuse.bin   2.5 m ground classes (src/core/landuse.ts)
//   water.bin     the water surface as a triangle mesh
//   tiles/*.bin   per 1 km tile: buildings, bridge decks and landmark boxes as footprints
//                 with base and top heights
// and cache/preview.png, a top-down map for checking the build by eye.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { WORLD, TILE, HORIZON, DATUM, xToLon, zToLat, lonToX, latToZ } from '../src/core/geo.ts';
import { Ground, GROUND_COLOURS } from '../src/core/landuse.ts';
import { encodePack, type Typed } from '../src/core/pack.ts';
import {
  loadLayer, layerExists, features, lineOf, parseLength, parseNumber, pointInPolygon, pointInRing, signedArea,
  type Polygon, type Ring, type Tags, type Feature,
} from './lib/osm.ts';
import { Grid, scanPolygon, scanLine, polygonRings } from './lib/raster.ts';
import { encodePng } from './lib/png.ts';
import { Route } from '../src/drone/route.ts';
import { Vector3 } from 'three';

const OUT = join('public', 'world');
/** --partial: build with whatever layers are cached, for testing while a fetch is still running. */
const PARTIAL = process.argv.includes('--partial');
function layer(name: string) {
  if (PARTIAL && !layerExists(name)) {
    console.warn(`  (partial build: no ${name} yet)`);
    return [];
  }
  return loadLayer(name);
}
const t0 = Date.now();
const log = (...a: unknown[]) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s]`, ...a);

const W = WORLD.xMax - WORLD.xMin;
const D = WORLD.zMax - WORLD.zMin;

// ---- Terrain --------------------------------------------------------------------------------

interface Dem { width: number; height: number; step: number; extent: { xmin: number; ymax: number }; data: Float32Array }

function loadDem(name: string): Dem {
  const meta = JSON.parse(readFileSync(join('cache', 'dem', `${name}.json`), 'utf8'));
  const buf = readFileSync(join('cache', 'dem', `${name}.f32`));
  const data = new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  return { ...meta, data };
}

/** Bilinear DEM height (metres above sea level) at a local position. Pixel centres are at half steps. */
function demAt(dem: Dem, x: number, z: number): number {
  const c = (xToLon(x) - dem.extent.xmin) / dem.step - 0.5;
  const r = (dem.extent.ymax - zToLat(z)) / dem.step - 0.5;
  const i = Math.max(0, Math.min(dem.width - 2, Math.floor(c)));
  const j = Math.max(0, Math.min(dem.height - 2, Math.floor(r)));
  const tx = Math.max(0, Math.min(1, c - i)), tz = Math.max(0, Math.min(1, r - j));
  const d = dem.data, w = dem.width;
  const a = d[j * w + i], b = d[j * w + i + 1], e = d[(j + 1) * w + i], f = d[(j + 1) * w + i + 1];
  return (a * (1 - tx) + b * tx) * (1 - tz) + (e * (1 - tx) + f * tx) * tz;
}

const CELL = 5;
const NX = W / CELL + 1, NZ = D / CELL + 1;
const detail = loadDem('detail');
const ground = new Grid(WORLD.xMin, WORLD.zMin, CELL, NX, NZ, new Float32Array(NX * NZ));
for (let j = 0; j < NZ; j++)
  for (let i = 0; i < NX; i++) ground.data[j * NX + i] = demAt(detail, WORLD.xMin + i * CELL, WORLD.zMin + j * CELL) - DATUM;
/** The DEM before the river bed is carved, for sampling bank and deck heights. */
const bare = new Grid(ground.x0, ground.z0, CELL, NX, NZ, ground.data.slice());
log(`terrain ${NX}×${NZ} at ${CELL} m`);

// ---- OSM ------------------------------------------------------------------------------------

const underground = (t: Tags) =>
  t.location === 'underground' || t.tunnel === 'yes' || t.covered === 'yes' || (parseNumber(t.layer) ?? 0) < 0;

const waterFeatures = features(layer('water'), (t) =>
  (t.natural === 'water' || t.waterway === 'riverbank') && !underground(t) && t.water !== 'wastewater',
);
log(`water: ${waterFeatures.length} areas`);

// ---- Land use raster ----------------------------------------------------------------------

const LU = 2.5;
const LNX = W / LU, LNZ = D / LU;
const landuse = new Grid(WORLD.xMin + LU / 2, WORLD.zMin + LU / 2, LU, LNX, LNZ, new Uint8Array(LNX * LNZ));
landuse.data.fill(Ground.Urban);

function paintPolygon(p: Polygon, cls: number) {
  scanPolygon(polygonRings(p), landuse.x0, landuse.z0, LU, LNX, LNZ, (i, j) => { landuse.data[j * LNX + i] = cls; });
}

function groundClass(t: Tags): number | undefined {
  const lu = t.landuse, le = t.leisure, na = t.natural, am = t.amenity, s = t.surface ?? '';
  if (le === 'pitch' || le === 'track') {
    if (s === 'clay') return Ground.Clay;
    if (/tartan|acrylic/.test(s)) return Ground.Clay;
    if (/asphalt|concrete|paved|paving|sett/.test(s)) return Ground.Square;
    if (/sand|gravel|dirt|fine_gravel|compacted/.test(s)) return Ground.Path;
    return Ground.Pitch;
  }
  if (le === 'playground') return Ground.Path;
  if (le === 'park' || le === 'dog_park') return Ground.Park;
  if (le === 'garden') return Ground.Garden;
  if (le === 'golf_course' || le === 'common') return Ground.Grass;
  if (lu === 'forest' || na === 'wood') return Ground.Wood;
  if (na === 'scrub' || na === 'heath') return Ground.Scrub;
  if (lu === 'grass' || lu === 'village_green' || lu === 'recreation_ground' || lu === 'flowerbed' || na === 'grassland')
    return Ground.Grass;
  if (lu === 'meadow') return Ground.Meadow;
  if (lu === 'orchard') return Ground.Orchard;
  if (lu === 'vineyard') return Ground.Vineyard;
  if (lu === 'cemetery' || am === 'grave_yard') return Ground.Cemetery;
  if (lu === 'allotments') return Ground.Garden;
  if (lu === 'farmland' || lu === 'greenhouse_horticulture' || lu === 'plant_nursery') return Ground.Farmland;
  if (lu === 'residential' || lu === 'commercial' || lu === 'retail' || lu === 'institutional' || lu === 'education' || lu === 'religious')
    return Ground.Residential;
  if (lu === 'industrial' || lu === 'railway' || lu === 'garages' || lu === 'depot' || lu === 'port' || lu === 'brownfield' || lu === 'landfill' || lu === 'quarry')
    return Ground.Industrial;
  if (lu === 'construction') return Ground.Construction;
  if (na === 'bare_rock' || na === 'cliff' || na === 'scree') return Ground.Rock;
  if (na === 'sand' || na === 'beach') return Ground.Sand;
  if (am === 'parking') return t.parking === 'underground' || t.parking === 'multi-storey' ? undefined : Ground.Parking;
  if (t.place === 'square' || t.highway === 'pedestrian' || t['area:highway'] === 'pedestrian' || t['area:highway'] === 'footway')
    return Ground.Square;
  if (t['area:highway']) return Ground.Road;
  if (t.highway && t.area === 'yes') return Ground.Square;
  return undefined;
}

const RANK: Record<number, number> = {
  [Ground.Residential]: 0, [Ground.Industrial]: 0, [Ground.Farmland]: 0, [Ground.Construction]: 0, [Ground.Meadow]: 0,
  [Ground.Wood]: 1, [Ground.Scrub]: 1, [Ground.Grass]: 1, [Ground.Park]: 1, [Ground.Garden]: 1, [Ground.Orchard]: 1,
  [Ground.Vineyard]: 1, [Ground.Cemetery]: 1, [Ground.Rock]: 1, [Ground.Sand]: 1,
  [Ground.Pitch]: 2, [Ground.Clay]: 2, [Ground.Parking]: 2, [Ground.Square]: 2, [Ground.Road]: 2, [Ground.Path]: 2,
};

function polygonArea(p: Polygon): number {
  return Math.abs(signedArea(p.outer)) - p.holes.reduce((a, h) => a + Math.abs(signedArea(h)), 0);
}

{
  const areas: { cls: number; rank: number; area: number; p: Polygon }[] = [];
  for (const f of features(layer('landuse'), (t) => !underground(t) && groundClass(t) !== undefined)) {
    const cls = groundClass(f.tags)!;
    for (const p of f.polygons) areas.push({ cls, rank: RANK[cls] ?? 1, area: polygonArea(p), p });
  }
  // Coarse and large first, so that smaller and more specific areas paint over them.
  areas.sort((a, b) => a.rank - b.rank || b.area - a.area);
  for (const a of areas) paintPolygon(a.p, a.cls);
  log(`land use: ${areas.length} areas painted`);
}

const ROAD_WIDTH: Record<string, number> = {
  motorway: 18, trunk: 16, primary: 13, secondary: 11, tertiary: 9, unclassified: 7, residential: 7,
  living_street: 6, service: 4.5, pedestrian: 7, footway: 2.5, path: 2, cycleway: 2.5, steps: 3, track: 3,
  bridleway: 2, motorway_link: 7, trunk_link: 7, primary_link: 7, secondary_link: 7, tertiary_link: 6, busway: 7,
};
const PAVED = /sett|cobblestone|paving_stones|unhewn/;

{
  let roads = 0;
  const lines: { w: number; cls: number; line: Ring }[] = [];
  for (const el of layer('highways')) {
    const t = el.tags ?? {};
    const hw = t.highway;
    if (el.type !== 'way' || !hw || !(hw in ROAD_WIDTH)) continue;
    if (underground(t) || (t.bridge && t.bridge !== 'no') || t.area === 'yes' || t.tunnel === 'building_passage') continue;
    const s = t.surface ?? '';
    const small = hw === 'footway' || hw === 'path' || hw === 'cycleway' || hw === 'steps' || hw === 'track' || hw === 'bridleway';
    let cls: number = small ? Ground.Path : PAVED.test(s) ? Ground.Cobbles : Ground.Road;
    if (small && PAVED.test(s)) cls = Ground.Square;
    if (small && /asphalt|concrete/.test(s)) cls = Ground.Square;
    if (hw === 'pedestrian') cls = PAVED.test(s) || !s ? Ground.Square : Ground.Road;
    let w = ROAD_WIDTH[hw];
    const tw = parseLength(t.width);
    if (tw && tw > 1 && tw < 40) w = tw;
    lines.push({ w, cls, line: lineOf(el) });
  }
  // Wide roads last so that they sit on top of paths at junctions.
  lines.sort((a, b) => a.w - b.w);
  for (const l of lines) {
    scanLine(l.line, l.w / 2, landuse.x0, landuse.z0, LU, LNX, LNZ, (i, j) => { landuse.data[j * LNX + i] = l.cls; });
    roads++;
  }
  for (const el of layer('railways')) {
    const t = el.tags ?? {};
    if (el.type !== 'way' || !t.railway || t.railway === 'tram' || t.railway === 'subway') continue;
    if (underground(t) || (t.bridge && t.bridge !== 'no')) continue;
    scanLine(lineOf(el), t.railway === 'funicular' ? 1.5 : 2.2, landuse.x0, landuse.z0, LU, LNX, LNZ, (i, j) => {
      landuse.data[j * LNX + i] = Ground.Rail;
    });
  }
  log(`roads: ${roads} lines painted`);
}

for (const f of waterFeatures) for (const p of f.polygons) paintPolygon(p, Ground.Water);

// ---- River: water level, carved bed, water mesh ------------------------------------------------

const water = new Uint8Array(NX * NZ);
for (const f of waterFeatures)
  for (const p of f.polygons) scanPolygon(polygonRings(p), ground.x0, ground.z0, CELL, NX, NZ, (i, j) => { water[j * NX + i] = 1; });

/** Water surface height per node: a low percentile of the DEM over nearby water, smoothed and spread onto the banks. */
const level = new Float32Array(NX * NZ).fill(NaN);
{
  const R = 6;
  const vals: number[] = [];
  for (let j = 0; j < NZ; j++)
    for (let i = 0; i < NX; i++) {
      if (!water[j * NX + i]) continue;
      vals.length = 0;
      for (let dj = -R; dj <= R; dj++) {
        const jj = j + dj;
        if (jj < 0 || jj >= NZ) continue;
        for (let di = -R; di <= R; di++) {
          const ii = i + di;
          if (ii < 0 || ii >= NX || !water[jj * NX + ii]) continue;
          vals.push(bare.data[jj * NX + ii]);
        }
      }
      vals.sort((a, b) => a - b);
      level[j * NX + i] = vals[Math.floor(vals.length * 0.2)];
    }
  for (let pass = 0; pass < 2; pass++) {
    const src = level.slice();
    for (let j = 0; j < NZ; j++)
      for (let i = 0; i < NX; i++) {
        if (!water[j * NX + i]) continue;
        let s = 0, n = 0;
        for (let dj = -2; dj <= 2; dj++)
          for (let di = -2; di <= 2; di++) {
            const ii = i + di, jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= NX || jj >= NZ || !water[jj * NX + ii]) continue;
            s += src[jj * NX + ii]; n++;
          }
        level[j * NX + i] = s / n;
      }
  }
  // Spread onto the banks, up to 6 nodes, so the water mesh can tuck under them.
  let frontier: number[] = [];
  for (let k = 0; k < NX * NZ; k++) if (water[k]) frontier.push(k);
  for (let step = 0; step < 6; step++) {
    const next: number[] = [];
    for (const k of frontier) {
      const i = k % NX, j = (k - i) / NX;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ii = i + di, jj = j + dj;
        if (ii < 0 || jj < 0 || ii >= NX || jj >= NZ) continue;
        const kk = jj * NX + ii;
        if (Number.isNaN(level[kk])) { level[kk] = level[k]; next.push(kk); }
      }
    }
    frontier = next;
  }
  // Carve the bed under the water.
  for (let k = 0; k < NX * NZ; k++) if (water[k]) ground.data[k] = Math.min(ground.data[k], level[k] - 2.5);
  log('river level and bed');
}

function levelAt(x: number, z: number): number {
  const i = Math.round((x - ground.x0) / CELL), j = Math.round((z - ground.z0) / CELL);
  if (i < 0 || j < 0 || i >= NX || j >= NZ) return NaN;
  return level[j * NX + i];
}

// The water mesh: 10 m cells over the water, dilated by one cell so its edges hide under the banks.
let waterPack: Uint8Array;
{
  const WC = 10, r = WC / CELL;
  const wnx = W / WC + 1, wnz = D / WC + 1;
  const near = new Uint8Array(wnx * wnz);
  for (let j = 0; j < NZ; j++)
    for (let i = 0; i < NX; i++) {
      if (!water[j * NX + i]) continue;
      const I = Math.round(i / r), J = Math.round(j / r);
      for (let dj = -1; dj <= 1; dj++)
        for (let di = -1; di <= 1; di++) {
          const II = I + di, JJ = J + dj;
          if (II >= 0 && JJ >= 0 && II < wnx && JJ < wnz) near[JJ * wnx + II] = 1;
        }
    }
  const index = new Int32Array(wnx * wnz).fill(-1);
  const pos: number[] = [];
  const idx: number[] = [];
  const vert = (I: number, J: number) => {
    const k = J * wnx + I;
    if (index[k] < 0) {
      const x = WORLD.xMin + I * WC, z = WORLD.zMin + J * WC;
      index[k] = pos.length / 3;
      pos.push(x, levelAt(x, z), z);
    }
    return index[k];
  };
  for (let J = 0; J + 1 < wnz; J++)
    for (let I = 0; I + 1 < wnx; I++) {
      if (!(near[J * wnx + I] && near[J * wnx + I + 1] && near[(J + 1) * wnx + I] && near[(J + 1) * wnx + I + 1])) continue;
      const hs = [levelAt(WORLD.xMin + I * WC, WORLD.zMin + J * WC), levelAt(WORLD.xMin + (I + 1) * WC, WORLD.zMin + J * WC),
        levelAt(WORLD.xMin + I * WC, WORLD.zMin + (J + 1) * WC), levelAt(WORLD.xMin + (I + 1) * WC, WORLD.zMin + (J + 1) * WC)];
      if (hs.some(Number.isNaN)) continue;
      const a = vert(I, J), b = vert(I + 1, J), c = vert(I, J + 1), d = vert(I + 1, J + 1);
      idx.push(a, c, b, b, c, d);
    }
  waterPack = encodePack({ cell: WC }, { position: new Float32Array(pos), index: new Uint32Array(idx) });
  log(`water mesh: ${pos.length / 3} vertices, ${idx.length / 3} triangles`);
}

// ---- Landmarks --------------------------------------------------------------------------------

interface Landmark {
  id: string; cz: string; en: string; kind: string; x: number; north: number;
  osm?: string[]; box?: { w: number; d: number; h: number; rot?: number; dx?: number; dz?: number };
}
const landmarks: Landmark[] = JSON.parse(readFileSync(join('data', 'landmarks.json'), 'utf8')).landmarks;
const landmarkOf = new Map<string, number>(); // OSM key → landmark index
landmarks.forEach((l, k) => l.osm?.forEach((key) => landmarkOf.set(key, k)));

// ---- Buildings --------------------------------------------------------------------------------

interface Building {
  poly: Polygon;
  key: string;
  part: boolean;
  tags: Tags;
  area: number;
  cx: number; cz: number;
  landmark: number;
  base: number; top: number;
}

function centroid(r: Ring): [number, number] {
  let a = 0, cx = 0, cz = 0;
  const n = r.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const f = r[j * 2] * r[i * 2 + 1] - r[i * 2] * r[j * 2 + 1];
    a += f; cx += (r[j * 2] + r[i * 2]) * f; cz += (r[j * 2 + 1] + r[i * 2 + 1]) * f;
  }
  if (Math.abs(a) < 1e-9) return [r[0], r[1]];
  return [cx / (3 * a), cz / (3 * a)];
}

/** Drops near-duplicate and nearly collinear vertices (0.25 m tolerance). */
function simplify(r: Ring): Ring {
  let pts = r;
  for (let pass = 0; pass < 2; pass++) {
    const n = pts.length / 2;
    if (n <= 3) return pts;
    const out: number[] = [];
    for (let i = 0; i < n; i++) {
      const px = pts[((i + n - 1) % n) * 2], pz = pts[((i + n - 1) % n) * 2 + 1];
      const x = pts[i * 2], z = pts[i * 2 + 1];
      const nx = pts[((i + 1) % n) * 2], nz = pts[((i + 1) % n) * 2 + 1];
      const ex = nx - px, ez = nz - pz, len = Math.hypot(ex, ez);
      const dist = len < 1e-6 ? Math.hypot(x - px, z - pz) : Math.abs((x - px) * ez - (z - pz) * ex) / len;
      if (dist > 0.25 || out.length / 2 + (n - i) <= 3) out.push(x, z);
    }
    pts = out;
  }
  return pts;
}

const SMALL = new Set(['garage', 'garages', 'shed', 'carport', 'hut', 'kiosk', 'cabin', 'toilets', 'service', 'transformer_tower', 'container', 'shelter']);
const HOUSE = new Set(['house', 'detached', 'semidetached_house', 'bungalow', 'terrace', 'villa']);

function heights(t: Tags, area: number): { h: number; minH: number } {
  let h = parseLength(t.height);
  const levels = parseNumber(t['building:levels']);
  if (h === undefined && levels !== undefined) {
    const roofH = parseLength(t['roof:height']);
    const roofLevels = parseNumber(t['roof:levels']) ?? 0;
    const pitched = t['roof:shape'] && t['roof:shape'] !== 'flat';
    h = levels * 3.3 + (roofH ?? (roofLevels ? roofLevels * 2.6 : pitched ? 3 : 1));
  }
  if (h === undefined) {
    const type = t.building ?? t['building:part'] ?? 'yes';
    if (SMALL.has(type)) h = 3.5;
    else if (HOUSE.has(type)) h = 9;
    else if (type === 'church' || type === 'cathedral' || type === 'chapel') h = 20;
    else if (area < 40) h = 4;
    else if (area < 120) h = 9;
    else h = 16;
  }
  let minH = parseLength(t.min_height);
  if (minH === undefined) {
    const ml = parseNumber(t['building:min_level']);
    if (ml) minH = ml * 3.3;
  }
  h = Math.max(2, Math.min(250, h));
  return { h, minH: Math.max(0, Math.min(h - 0.5, minH ?? 0)) };
}

const SKIP_BUILDING = new Set(['no', 'roof', 'construction', 'proposed', 'demolished', 'ruins', 'abandoned', 'razed', 'destroyed', 'collapsed']);

const buildings: Building[] = [];
{
  const els = layer('buildings');
  for (const f of features(els, (t) => {
    if (underground(t) && t.location === 'underground') return false;
    if (t['building:part'] && t['building:part'] !== 'no') return !SKIP_BUILDING.has(t['building:part']);
    return !!t.building && !SKIP_BUILDING.has(t.building);
  })) {
    const part = !!f.tags['building:part'] && f.tags['building:part'] !== 'no' && !f.tags.building;
    for (const p of f.polygons) {
      const poly = { outer: simplify(p.outer), holes: p.holes.map(simplify).filter((h) => h.length >= 6) };
      if (poly.outer.length < 6) continue;
      const area = polygonArea(poly);
      if (area < 6) continue;
      const [cx, cz] = centroid(poly.outer);
      if (cx < WORLD.xMin || cx >= WORLD.xMax || cz < WORLD.zMin || cz >= WORLD.zMax) continue;
      buildings.push({ poly, key: f.key, part, tags: f.tags, area, cx, cz, landmark: landmarkOf.get(f.key) ?? -1, base: 0, top: 0 });
    }
  }
  log(`buildings: ${buildings.filter((b) => !b.part).length} outlines, ${buildings.filter((b) => b.part).length} parts`);
}

// An outline with parts inside it is drawn as its parts (OSM Simple 3D Buildings).
{
  const G = 50;
  const partsAt = new Map<string, Building[]>();
  for (const b of buildings) if (b.part) {
    const k = `${Math.floor(b.cx / G)},${Math.floor(b.cz / G)}`;
    (partsAt.get(k) ?? partsAt.set(k, []).get(k)!).push(b);
  }
  let replaced = 0;
  for (const b of buildings) {
    if (b.part) continue;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let k = 0; k < b.poly.outer.length; k += 2) {
      minX = Math.min(minX, b.poly.outer[k]); maxX = Math.max(maxX, b.poly.outer[k]);
      minZ = Math.min(minZ, b.poly.outer[k + 1]); maxZ = Math.max(maxZ, b.poly.outer[k + 1]);
    }
    const inside: Building[] = [];
    for (let gx = Math.floor(minX / G); gx <= Math.floor(maxX / G); gx++)
      for (let gz = Math.floor(minZ / G); gz <= Math.floor(maxZ / G); gz++)
        for (const p of partsAt.get(`${gx},${gz}`) ?? []) if (pointInPolygon(p.cx, p.cz, b.poly)) inside.push(p);
    if (inside.length === 0) continue;
    (b as any).drop = true;
    replaced++;
    // Parts stand on their outline's ground and inherit its landmark.
    const g = groundRef(b.poly);
    for (const p of inside) {
      (p as any).ground = g;
      if (p.landmark < 0) p.landmark = b.landmark;
    }
  }
  log(`${replaced} outlines replaced by their parts`);
}

/** Ground heights under a footprint: the lowest point and a reference between lowest and median. */
function groundRef(p: Polygon): { min: number; ref: number } {
  const hs: number[] = [];
  const r = p.outer, n = r.length / 2;
  const stride = Math.max(1, Math.floor(n / 24));
  for (let i = 0; i < n; i += stride) hs.push(bare.sample(r[i * 2], r[i * 2 + 1]));
  const [cx, cz] = centroid(r);
  hs.push(bare.sample(cx, cz));
  hs.sort((a, b) => a - b);
  const min = hs[0], med = hs[Math.floor(hs.length / 2)];
  return { min, ref: (min + med) / 2 };
}

for (const b of buildings) {
  if ((b as any).drop) continue;
  const g: { min: number; ref: number } = (b as any).ground ?? groundRef(b.poly);
  const { h, minH } = heights(b.tags, b.area);
  b.top = g.ref + h;
  b.base = minH > 0 ? g.ref + minH : g.min - 1;
}
const kept = buildings.filter((b) => !(b as any).drop);

// ---- Bridges ----------------------------------------------------------------------------------

interface Deck { poly: Polygon; base: number; top: number; key: string; landmark: number }
const decks: Deck[] = [];
for (const f of features(layer('bridges'), (t) => t.man_made === 'bridge' && !underground(t))) {
  for (const p of f.polygons) {
    const hs: number[] = [];
    let overWater = false;
    const r = p.outer, n = r.length / 2;
    for (let i = 0; i < n; i++) {
      const ax = r[i * 2], az = r[i * 2 + 1], bx = r[((i + 1) % n) * 2], bz = r[((i + 1) % n) * 2 + 1];
      const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 4));
      for (let s = 0; s < steps; s++) {
        const x = ax + ((bx - ax) * s) / steps, z = az + ((bz - az) * s) / steps;
        const gi = Math.round((x - ground.x0) / CELL), gj = Math.round((z - ground.z0) / CELL);
        if (gi < 0 || gj < 0 || gi >= NX || gj >= NZ) continue;
        if (water[gj * NX + gi]) { overWater = true; continue; }
        hs.push(bare.data[gj * NX + gi]);
      }
    }
    const [cx, cz] = centroid(r);
    if (cx < WORLD.xMin || cx >= WORLD.xMax || cz < WORLD.zMin || cz >= WORLD.zMax) continue;
    hs.sort((a, b) => a - b);
    let deck = hs.length >= 3 ? hs[Math.floor(hs.length * 0.75)] : NaN;
    const lv = levelAt(cx, cz);
    if (overWater && !Number.isNaN(lv)) deck = Number.isNaN(deck) ? lv + 7 : Math.max(deck, lv + 4);
    if (Number.isNaN(deck)) continue;
    decks.push({ poly: { outer: simplify(r), holes: [] }, base: deck - 1.6, top: deck + 0.4, key: f.key, landmark: landmarkOf.get(f.key) ?? -1 });
  }
}
log(`bridges: ${decks.length} decks`);

// Landmarks placed as boxes (those without an OSM footprint, such as towers mapped as points).
const boxes: { poly: Polygon; base: number; top: number; landmark: number }[] = [];
landmarks.forEach((l, k) => {
  if (!l.box) return;
  const cx = l.x + (l.box.dx ?? 0), cz = -l.north + (l.box.dz ?? 0);
  const a = ((l.box.rot ?? 0) * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
  const outer: Ring = [];
  for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = (u * l.box.w) / 2, pz = (v * l.box.d) / 2;
    outer.push(cx + px * ca - pz * sa, cz + px * sa + pz * ca);
  }
  const g = groundRef({ outer, holes: [] });
  boxes.push({ poly: { outer, holes: [] }, base: g.min - 1, top: g.ref + l.box.h, landmark: k });
});

// Landmark check against OSM (design.md §6.2: verify each coordinate before modelling).
{
  const rows: string[] = [];
  landmarks.forEach((l, k) => {
    const mine = kept.filter((b) => b.landmark === k);
    const mineDecks = decks.filter((d) => d.landmark === k);
    let sx = 0, sz = 0, sa = 0;
    for (const b of mine) { sx += b.cx * b.area; sz += b.cz * b.area; sa += b.area; }
    for (const d of mineDecks) { const [cx, cz] = centroid(d.poly.outer); const a = polygonArea(d.poly); sx += cx * a; sz += cz * a; sa += a; }
    if (sa === 0) { rows.push(`${l.id.padEnd(26)} ${l.box ? 'box' : l.osm ? 'MISSING' : '-'}`); return; }
    const cx = sx / sa, cn = -sz / sa;
    const top = mine.length ? Math.max(...mine.map((b) => b.top)) : Math.max(...mineDecks.map((d) => d.top));
    rows.push(
      `${l.id.padEnd(26)} osm x ${cx.toFixed(0).padStart(6)} north ${cn.toFixed(0).padStart(6)}  §6.2 off by ${Math.hypot(cx - l.x, cn - l.north).toFixed(0).padStart(4)} m  top y ${top.toFixed(0)}  (${mine.length + mineDecks.length} pieces)`,
    );
  });
  writeFileSync(join('cache', 'landmarks-check.txt'), rows.join('\n') + '\n');
  log('landmark check written to cache/landmarks-check.txt');
}

// ---- Surface grid (clearance for the drone) -------------------------------------------------

const SC = 10;
const SNX = W / SC + 1, SNZ = D / SC + 1;
const surface = new Grid(WORLD.xMin, WORLD.zMin, SC, SNX, SNZ, new Float32Array(SNX * SNZ));
{
  const r = SC / CELL;
  for (let J = 0; J < SNZ; J++)
    for (let I = 0; I < SNX; I++) {
      let m = -Infinity;
      for (let dj = -1; dj <= 1; dj++)
        for (let di = -1; di <= 1; di++) {
          const i = I * r + di, j = J * r + dj;
          if (i < 0 || j < 0 || i >= NX || j >= NZ) continue;
          const k = j * NX + i;
          m = Math.max(m, ground.data[k], water[k] ? level[k] : -Infinity);
        }
      surface.data[J * SNX + I] = m;
    }
  const raise = (p: Polygon, top: number) => {
    const set = (i: number, j: number) => { const k = j * SNX + i; if (surface.data[k] < top) surface.data[k] = top; };
    scanPolygon(polygonRings(p), surface.x0, surface.z0, SC, SNX, SNZ, set);
    // Footprints smaller than a cell still mark the node nearest each corner.
    for (let k = 0; k < p.outer.length; k += 2) {
      const i = Math.round((p.outer[k] - surface.x0) / SC), j = Math.round((p.outer[k + 1] - surface.z0) / SC);
      if (i >= 0 && j >= 0 && i < SNX && j < SNZ) set(i, j);
    }
  };
  for (const b of kept) raise(b.poly, b.top);
  for (const d of decks) raise(d.poly, d.top);
  for (const b of boxes) raise(b.poly, b.top);
  log('surface grid');
}

// ---- Horizon ----------------------------------------------------------------------------------

const HC = 100;
const HN = (2 * HORIZON) / HC + 1;
const horizon = new Grid(-HORIZON, -HORIZON, HC, HN, HN, new Float32Array(HN * HN));
{
  const hdem = loadDem('horizon');
  for (let j = 0; j < HN; j++)
    for (let i = 0; i < HN; i++) {
      const x = -HORIZON + i * HC, z = -HORIZON + j * HC;
      const inside = x >= WORLD.xMin && x <= WORLD.xMax && z >= WORLD.zMin && z <= WORLD.zMax;
      horizon.data[j * HN + i] = inside ? ground.sample(x, z) : demAt(hdem, x, z) - DATUM;
    }
  log(`horizon ${HN}×${HN} at ${HC} m`);
}

// ---- Write ------------------------------------------------------------------------------------

/** Heights as centimetres + 100 m in a uint16, delta coded along rows so gzip can squeeze them. */
function encodeHeights(data: Float32Array, nx: number): Uint16Array {
  const out = new Uint16Array(data.length);
  for (let k = 0; k < data.length; k++) {
    const v = Math.max(0, Math.min(65535, Math.round((data[k] + 100) * 100)));
    const prev = k % nx === 0 ? 0 : Math.max(0, Math.min(65535, Math.round((data[k - 1] + 100) * 100)));
    out[k] = (v - prev) & 0xffff;
  }
  return out;
}

function write(name: string, meta: unknown, arrays: Record<string, Typed>): number {
  const bytes = gzipSync(encodePack(meta, arrays), { level: 9 });
  writeFileSync(join(OUT, name), bytes);
  return bytes.length;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'tiles'), { recursive: true });

const sizes: Record<string, number> = {};
const grid = (g: Grid<any>) => ({ x0: g.x0, z0: g.z0, cell: g.cell, nx: g.nx, nz: g.nz });
sizes.terrain = write('terrain.bin', grid(ground), { height: encodeHeights(ground.data, NX) });
sizes.horizon = write('horizon.bin', grid(horizon), { height: encodeHeights(horizon.data, HN) });
sizes.surface = write('surface.bin', grid(surface), { height: encodeHeights(surface.data, SNX) });
sizes.landuse = write('landuse.bin', grid(landuse), { ground: landuse.data });
writeFileSync(join(OUT, 'water.bin'), gzipSync(waterPack, { level: 9 }));

/** Footprints relative to an origin in decimetres, with base and top heights in decimetres. */
function packFootprints(items: { poly: Polygon; base: number; top: number; landmark: number; kind: number }[], ox: number, oz: number) {
  const bRing: number[] = [0], rVert: number[] = [0], xy: number[] = [], base: number[] = [], top: number[] = [], lm: number[] = [], kind: number[] = [];
  for (const it of items) {
    for (const r of [it.poly.outer, ...it.poly.holes]) {
      for (let k = 0; k < r.length; k += 2) xy.push(Math.round((r[k] - ox) * 10), Math.round((r[k + 1] - oz) * 10));
      rVert.push(xy.length / 2);
    }
    bRing.push(rVert.length - 1);
    base.push(Math.round(it.base * 10));
    top.push(Math.round(it.top * 10));
    lm.push(it.landmark);
    kind.push(it.kind);
  }
  return {
    ring: new Uint32Array(bRing), vert: new Uint32Array(rVert), xy: new Int16Array(xy),
    base: new Int16Array(base), top: new Int16Array(top), landmark: new Int8Array(lm), kind: new Uint8Array(kind),
  };
}

const KIND = { building: 0, part: 1, bridge: 2, box: 3 };
const tiles: { i: number; j: number; file: string; count: number; bytes: number }[] = [];
{
  // Buildings, bridge decks and landmark boxes all go into the tile that holds their centroid.
  type Item = { poly: Polygon; base: number; top: number; landmark: number; kind: number; cx: number; cz: number };
  const items: Item[] = [
    ...kept.map((b) => ({ poly: b.poly, base: b.base, top: b.top, landmark: b.landmark, kind: b.part ? KIND.part : KIND.building, cx: b.cx, cz: b.cz })),
    ...decks.map((d) => { const [cx, cz] = centroid(d.poly.outer); return { ...d, kind: KIND.bridge, cx, cz }; }),
    ...boxes.map((b) => { const [cx, cz] = centroid(b.poly.outer); return { ...b, kind: KIND.box, cx, cz }; }),
  ];
  const byTile = new Map<string, Item[]>();
  for (const it of items) {
    const i = Math.floor((it.cx - WORLD.xMin) / TILE), j = Math.floor((it.cz - WORLD.zMin) / TILE);
    if (i < 0 || j < 0 || WORLD.xMin + i * TILE >= WORLD.xMax || WORLD.zMin + j * TILE >= WORLD.zMax) continue;
    const k = `${i}_${j}`;
    (byTile.get(k) ?? byTile.set(k, []).get(k)!).push(it);
  }
  for (const [k, list] of [...byTile.entries()].sort()) {
    const [i, j] = k.split('_').map(Number);
    const ox = WORLD.xMin + (i + 0.5) * TILE, oz = WORLD.zMin + (j + 0.5) * TILE;
    const file = `tiles/${k}.bin`;
    const bytes = write(file, { i, j, ox, oz, count: list.length }, packFootprints(list, ox, oz));
    tiles.push({ i, j, file, count: list.length, bytes });
  }
}
sizes.tiles = tiles.reduce((a, t) => a + t.bytes, 0);

const manifest = {
  version: 1,
  built: new Date().toISOString(),
  datum: DATUM,
  world: WORLD,
  tile: TILE,
  heightEncoding: 'uint16 centimetres + 100 m, row delta coded',
  terrain: { file: 'terrain.bin', ...grid(ground) },
  horizon: { file: 'horizon.bin', ...grid(horizon) },
  surface: { file: 'surface.bin', ...grid(surface) },
  landuse: { file: 'landuse.bin', ...grid(landuse) },
  water: { file: 'water.bin' },
  tiles,
  kinds: KIND,
  attribution: 'Map data © OpenStreetMap contributors (ODbL). Terrain © ČÚZK, DMR 5G (CC BY 4.0).',
};
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
const total = Object.values(sizes).reduce((a, b) => a + b, 0);
log(`wrote ${OUT}: ${Object.entries(sizes).map(([k, v]) => `${k} ${(v / 1e6).toFixed(2)} MB`).join(', ')}; total ${(total / 1e6).toFixed(1)} MB`);

// ---- Preview ----------------------------------------------------------------------------------

{
  const P = 5; // metres per pixel
  const pw = W / P, ph = D / P;
  const rgb = new Uint8Array(pw * ph * 3);
  const colours = Object.fromEntries(Object.entries(GROUND_COLOURS).map(([k, v]) => [k, [1, 3, 5].map((o) => parseInt(v.slice(o, o + 2), 16))]));
  for (let py = 0; py < ph; py++)
    for (let px = 0; px < pw; px++) {
      const x = WORLD.xMin + (px + 0.5) * P, z = WORLD.zMin + (py + 0.5) * P;
      const c = colours[landuse.nearest(x, z)] ?? [255, 0, 255];
      // Hillshade from the north-west.
      const hx = ground.sample(x + CELL, z) - ground.sample(x - CELL, z);
      const hz = ground.sample(x, z + CELL) - ground.sample(x, z - CELL);
      const shade = Math.max(0.55, Math.min(1.35, 1 + (-hx - hz) * 0.08));
      const o = (py * pw + px) * 3;
      for (let c3 = 0; c3 < 3; c3++) rgb[o + c3] = Math.min(255, c[c3] * shade);
    }
  const plot = (x: number, z: number, col: number[]) => {
    const px = Math.floor((x - WORLD.xMin) / P), py = Math.floor((z - WORLD.zMin) / P);
    if (px < 0 || py < 0 || px >= pw || py >= ph) return;
    const o = (py * pw + px) * 3;
    rgb[o] = col[0]; rgb[o + 1] = col[1]; rgb[o + 2] = col[2];
  };
  const fill = (p: Polygon, col: number[]) =>
    scanPolygon(polygonRings(p), WORLD.xMin + P / 2, WORLD.zMin + P / 2, P, pw, ph, (i, j) => {
      const o = (j * pw + i) * 3;
      rgb[o] = col[0]; rgb[o + 1] = col[1]; rgb[o + 2] = col[2];
    });
  for (const b of kept) {
    const tone = Math.max(60, Math.min(235, 90 + (b.top - bare.sample(b.cx, b.cz)) * 3));
    fill(b.poly, b.landmark >= 0 ? [230, 80, 60] : [tone, tone * 0.97, tone * 0.93]);
  }
  for (const d of decks) fill(d.poly, d.landmark >= 0 ? [230, 80, 60] : [200, 190, 170]);
  for (const b of boxes) fill(b.poly, [230, 80, 60]);
  // The flown path (the spline the app uses), stops as squares, gaze targets as blue crosses.
  const route = new Route(JSON.parse(readFileSync(join('data', 'route.json'), 'utf8')));
  const q = new Vector3();
  for (let t = 0; t <= route.end; t += 0.1) { route.position(t, q); plot(q.x, q.z, [255, 220, 40]); }
  for (const s of route.stops) {
    for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) plot(s.pos.x + dx * P, s.pos.z + dz * P, [255, 220, 40]);
    for (let d = -3; d <= 3; d++) { plot(s.gaze.x + d * P, s.gaze.z, [40, 120, 255]); plot(s.gaze.x, s.gaze.z + d * P, [40, 120, 255]); }
  }
  for (const l of landmarks) for (let d = -4; d <= 4; d++) { plot(l.x + d * P, -l.north, [20, 20, 20]); plot(l.x, -l.north + d * P, [20, 20, 20]); }
  writeFileSync(join('cache', 'preview.png'), encodePng(pw, ph, rgb));
  log('preview written to cache/preview.png');
}
