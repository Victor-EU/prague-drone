// Turns the raw downloads in cache/ into the app's world files under public/world/ (design.md §6.3).
//
//   node tools/build-world.ts
//
// Outputs, all gzipped PRAH packs (src/core/pack.ts) plus a manifest:
//   terrain.bin   5 m height grid over the world rectangle, river bed carved
//   horizon.bin   100 m height grid out to 16 km, detail grid inside the world rectangle
//   surface.bin   10 m grid of the highest thing at each place (ground, water, roofs, decks)
//   landuse.bin   2.5 m ground classes (src/core/landuse.ts)
//   water.bin     the water surface as a triangle mesh, with the flow direction and the weirs' foam
//   streets.bin   tram rails, lamp posts and the overhead wire's poles
//   life.bin      where the city's life moves: tram routes, the river, walks, roads (tools/lib/life.ts)
//   landmarks.bin the hand-built landmarks (tools/landmarks/) as finished meshes
//   tiles/*.bin   per 1 km tile: buildings, bridge decks and landmark boxes as footprints
//                 with base and top heights
// and cache/preview.png, a top-down map for checking the build by eye.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { WORLD, TILE, HORIZON, DATUM, xToLon, zToLat, lonToX, latToZ } from '../src/core/geo.ts';
import { Ground, GROUND_COLOURS, CANOPY_SHIFT, CANOPY_MASK } from '../src/core/landuse.ts';
import { encodePack, type Typed } from '../src/core/pack.ts';
import {
  loadLayer, layerExists, features, lineOf, parseLength, parseNumber, pointInPolygon, pointInRing, signedArea,
  type Polygon, type Ring, type Tags, type Feature,
} from './lib/osm.ts';
import { Grid, scanPolygon, scanLine, polygonRings } from './lib/raster.ts';
import { encodePng } from './lib/png.ts';
import { Route } from '../src/drone/route.ts';
import { Vector3 } from 'three';
import { Worker } from 'node:worker_threads';
import { availableParallelism } from 'node:os';
import type { Roof } from './lib/roofs.ts';
import type { PropRec } from './lib/props.ts';
import type { PlanInput, PlanOutput } from './lib/plan.ts';
import { District, districtMaps, districtAt, LANDMARK_COLOURS, BRIDGE, hexRgb, type DistrictId } from './lib/districts.ts';
import { Style, BFlag, EFlag } from '../src/core/buildings.ts';
import { buildLandmarks, packLandmarks, raiseSurface, MODELS, type Site, type Built } from './landmarks/index.ts';
import { rampartLines, carveRamparts } from './landmarks/vysehrad.ts';
import { Kit } from './landmarks/kit.ts';
import { Flow, flowLines, weirs, inWeirBand, weirStrip, embankments } from './lib/river.ts';
import { loadCanopy, findTrees, tally, hash as treeHash } from './lib/trees.ts';
import { gardenWalls } from './lib/walls.ts';
import { buildLife } from './lib/life.ts';
import { Kind as TreeKind, TREE_XZ, TREE_H, TREE_R } from '../src/core/trees.ts';

const OUT = join('public', 'world');
/** --partial: build with whatever layers are cached, for testing while a fetch is still running. */
const PARTIAL = process.argv.includes('--partial');
/** --landmarks: rebuild landmarks.bin and water.bin only (the rest of public/world/ stays as it is), for modelling. */
const ONLY_LANDMARKS = process.argv.includes('--landmarks');
/** --life: rebuild life.bin and streets.bin only, skipping the roofs, for working on city life. */
const ONLY_LIFE = process.argv.includes('--life');
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

const waterEls = layer('water');
const waterFeatures = features(waterEls, (t) =>
  (t.natural === 'water' || t.waterway === 'riverbank') && !underground(t) && t.water !== 'wastewater',
);
log(`water: ${waterFeatures.length} areas`);
// The Čertovka, the mill race between Kampa and Malá Strana (design.md §8.5, M10): its banks are
// dark and overgrown (9204), not the river's pale embankments.
const certovka = waterEls.filter((el) => el.type === 'way' && el.tags?.name === 'Čertovka' && !underground(el.tags ?? {})).map(lineOf);
function certovkaDist(x: number, z: number): number {
  let best = Infinity;
  for (const l of certovka)
    for (let i = 0; i + 3 < l.length; i += 2) {
      const ax = l[i], az = l[i + 1], dx = l[i + 2] - ax, dz = l[i + 3] - az;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)));
      best = Math.min(best, Math.hypot(ax + dx * t - x, az + dz * t - z));
    }
  return best;
}

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
  if (lu === 'flowerbed') return Ground.Flowerbed;
  if (lu === 'grass' || lu === 'village_green' || lu === 'recreation_ground' || na === 'grassland')
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
  [Ground.Vineyard]: 1, [Ground.Cemetery]: 1, [Ground.Rock]: 1, [Ground.Sand]: 1, [Ground.Flowerbed]: 1,
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

// Which way the water flows, and the weirs: the level each side of a weir is made even up to its
// crest, so the step falls under the foam (design.md §8.5, tools/lib/river.ts).
const flow = new Flow(flowLines(waterEls));
const weirList = weirs(waterEls, { water, level, bare }, flow, (x, z) => x > WORLD.xMin && x < WORLD.xMax && z > WORLD.zMin && z < WORLD.zMax);
log(`weirs: ${weirList.map((w) => `${w.key} ${w.length.toFixed(0)} m, ${w.upper.toFixed(1)} to ${w.lower.toFixed(1)}`).join('; ')}`);

// Vyšehrad's ramparts (tools/landmarks/vysehrad.ts): the ground at their feet and under their walks.
const wallLines = (PARTIAL && !layerExists('walls') ? [] : layer('walls'))
  .filter((el) => el.type === 'way')
  .map((el) => ({ key: `way/${el.id}`, tags: el.tags ?? {}, line: lineOf(el) }));
{
  const lines = rampartLines(wallLines, (x, z) => bare.sample(x, z));
  const nodes = carveRamparts(lines, ground);
  log(`ramparts: ${lines.length} walls, ${nodes} terrain nodes lowered`);
}

function levelAt(x: number, z: number): number {
  const i = Math.round((x - ground.x0) / CELL), j = Math.round((z - ground.z0) / CELL);
  if (i < 0 || j < 0 || i >= NX || j >= NZ) return NaN;
  return level[j * NX + i];
}

// The water mesh: 10 m cells over the water, dilated by one cell so its edges hide under the banks,
// and at each weir a finer strip in place of the cells round its crest. Per vertex: the downstream
// direction, and the foam.
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
  const pos: number[] = [], fl: number[] = [], foam: number[] = [];
  const idx: number[] = [];
  const vert = (I: number, J: number) => {
    const k = J * wnx + I;
    if (index[k] < 0) {
      const x = WORLD.xMin + I * WC, z = WORLD.zMin + J * WC;
      index[k] = pos.length / 3;
      pos.push(x, levelAt(x, z), z);
      const [fx, fz] = flow.at(x, z);
      fl.push(Math.round(fx * 127), Math.round(fz * 127));
      foam.push(0);
    }
    return index[k];
  };
  // Cells near a weir: tested only within reach of one.
  const nearWeir = (x: number, z: number) => weirList.some((w) => w.pts.some(([px, pz]) => Math.abs(px - x) < 40 && Math.abs(pz - z) < 40));
  let holed = 0;
  for (let J = 0; J + 1 < wnz; J++)
    for (let I = 0; I + 1 < wnx; I++) {
      if (!(near[J * wnx + I] && near[J * wnx + I + 1] && near[(J + 1) * wnx + I] && near[(J + 1) * wnx + I + 1])) continue;
      const hs = [levelAt(WORLD.xMin + I * WC, WORLD.zMin + J * WC), levelAt(WORLD.xMin + (I + 1) * WC, WORLD.zMin + J * WC),
        levelAt(WORLD.xMin + I * WC, WORLD.zMin + (J + 1) * WC), levelAt(WORLD.xMin + (I + 1) * WC, WORLD.zMin + (J + 1) * WC)];
      if (hs.some(Number.isNaN)) continue;
      const cx = WORLD.xMin + (I + 0.5) * WC, cz = WORLD.zMin + (J + 0.5) * WC;
      if (nearWeir(cx, cz) && inWeirBand(weirList, cx, cz)) { holed++; continue; }
      const a = vert(I, J), b = vert(I + 1, J), c = vert(I, J + 1), d = vert(I + 1, J + 1);
      idx.push(a, c, b, b, c, d);
    }
  for (const w of weirList) weirStrip(w, pos, fl, foam, idx);
  waterPack = encodePack({ cell: WC }, { position: new Float32Array(pos), flow: new Int8Array(fl), foam: new Uint8Array(foam), index: new Uint32Array(idx) });
  log(`water mesh: ${pos.length / 3} vertices, ${idx.length / 3} triangles (${holed} cells left to ${weirList.length} weir strips)`);
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
  /** Eave and ground reference (absolute), facade style, flags, colours (sRGB hex). */
  eave: number; gnd: number;
  style: number; flags: number;
  wall: string; roofC: string;
  /** Per footprint vertex (outer ring, then holes): EFlag bits for the edge that starts there. */
  edges: Uint8Array;
  roof: Roof | null;
  props: PropRec[];
  district: DistrictId;
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

/**
 * Collapses edges shorter than half a metre to their midpoints, then drops nearly collinear
 * vertices (0.25 m tolerance). The small steps OSM outlines carry are invisible from the air and
 * make the roofs' straight skeletons degenerate.
 */
function simplify(r: Ring): Ring {
  let pts = r;
  for (let guard = 0; guard < 64 && pts.length > 6; guard++) {
    const n = pts.length / 2;
    let shortest = -1, len = 0.5;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, l = Math.hypot(pts[j * 2] - pts[i * 2], pts[j * 2 + 1] - pts[i * 2 + 1]);
      if (l < len) { len = l; shortest = i; }
    }
    if (shortest < 0) break;
    const i = shortest, j = (i + 1) % n;
    const mx = (pts[i * 2] + pts[j * 2]) / 2, mz = (pts[i * 2 + 1] + pts[j * 2 + 1]) / 2;
    const out: number[] = [];
    for (let k = 0; k < n; k++) {
      if (k === j) continue;
      if (k === i) out.push(mx, mz); else out.push(pts[k * 2], pts[k * 2 + 1]);
    }
    pts = out;
  }
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

/** Snaps a ring to the decimetre grid the tiles store, so roofs meet their walls exactly. */
function quantize(r: Ring): Ring {
  const out: number[] = [];
  for (let i = 0; i < r.length; i += 2) {
    const x = Math.round(r[i] * 10) / 10, z = Math.round(r[i + 1] * 10) / 10;
    if (out.length && out[out.length - 2] === x && out[out.length - 1] === z) continue;
    out.push(x, z);
  }
  if (out.length >= 4 && out[0] === out[out.length - 2] && out[1] === out[out.length - 1]) out.length -= 2;
  return out;
}

const SKIP_BUILDING = new Set(['no', 'roof', 'construction', 'proposed', 'demolished', 'ruins', 'abandoned', 'razed', 'destroyed', 'collapsed']);

const buildings: Building[] = [];
/** Every OSM building, part and bridge by key, for the landmark models. */
const featureOf = new Map<string, Feature>();
{
  const els = layer('buildings');
  for (const f of features(els, (t) => {
    if (underground(t) && t.location === 'underground') return false;
    if (t['building:part'] && t['building:part'] !== 'no') return !SKIP_BUILDING.has(t['building:part']);
    return !!t.building && !SKIP_BUILDING.has(t.building);
  })) {
    const part = !!f.tags['building:part'] && f.tags['building:part'] !== 'no' && !f.tags.building;
    featureOf.set(f.key, f);
    for (const p of f.polygons) {
      const poly = { outer: quantize(simplify(p.outer)), holes: p.holes.map((h) => quantize(simplify(h))).filter((h) => h.length >= 6) };
      if (poly.outer.length < 6) continue;
      const area = polygonArea(poly);
      if (area < 6) continue;
      const [cx, cz] = centroid(poly.outer);
      if (cx < WORLD.xMin || cx >= WORLD.xMax || cz < WORLD.zMin || cz >= WORLD.zMax) continue;
      buildings.push({
        poly, key: f.key, part, tags: f.tags, area, cx, cz, landmark: landmarkOf.get(f.key) ?? -1, base: 0, top: 0,
        eave: 0, gnd: 0, style: 0, flags: 0, wall: '#d9c9a8', roofC: '#6d6a62', edges: new Uint8Array(0), roof: null, props: [], district: District.Outer,
      });
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
      (p as any).outline = b.key;
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

let kept = buildings.filter((b) => !(b as any).drop);

// ---- Landmarks modelled by hand (design.md §7.1, tools/landmarks/) ------------------------------

const bridgeFeatures = features(layer('bridges'), (t) => t.man_made === 'bridge' && !underground(t));
for (const f of bridgeFeatures) featureOf.set(f.key, f);
const modelled = new Set<number>();
for (const m of MODELS)
  for (const id of [m.id, ...(m.covers ?? [])]) {
    const k = landmarks.findIndex((l) => l.id === id);
    if (k < 0) throw new Error(`landmark model ${id} is not in data/landmarks.json`);
    modelled.add(k);
  }
const replacedKeys = new Set(MODELS.flatMap((m) => m.replaces ?? []));
let landmarkMeshes: Built[];
{
  const featureCentre = new Map<string, [number, number]>();
  const site: Site = {
    ground: (x, z) => ground.sample(x, z),
    bare: (x, z) => bare.sample(x, z),
    water: (x, z) => {
      const i = Math.round((x - ground.x0) / CELL), j = Math.round((z - ground.z0) / CELL);
      return i >= 0 && j >= 0 && i < NX && j < NZ && water[j * NX + i] ? level[j * NX + i] : NaN;
    },
    feature: (key) => featureOf.get(key),
    near: (x, z, r) => {
      const out: Feature[] = [];
      for (const [key, f] of featureOf) {
        let c = featureCentre.get(key);
        if (!c) { c = centroid(f.polygons[0].outer); featureCentre.set(key, c); }
        if (Math.hypot(c[0] - x, c[1] - z) <= r) out.push(f);
      }
      return out;
    },
    walls: wallLines,
    landmark: (id) => {
      const l = landmarks.find((q) => q.id === id);
      if (!l) throw new Error(`no landmark ${id}`);
      return { x: l.x, z: -l.north };
    },
  };
  landmarkMeshes = await buildLandmarks(site, log);
  // The embankment walls along the river and its channels, in the same pack (tools/lib/river.ts).
  {
    const k = new Kit(), d = new Kit();
    const core = (p: Polygon) => { const [x, z] = centroid(p.outer); return Math.abs(x) < 2000 && Math.abs(z) < 2000; };
    // Walls only where the drone sees them: Vyšehrad to Letná and the banks either side.
    const seen = (x: number, z: number) => x > -2500 && x < 2800 && z > -2200 && z < 3600;
    const river = waterFeatures
      .filter((f) => /^(river|canal|lock|harbour)$/.test(f.tags.water ?? '') || f.tags.waterway === 'riverbank' || f.tags.water === 'stream')
      .flatMap((f) => f.tags.water === 'stream' ? f.polygons.filter(core) : f.polygons);
    const metres = embankments(river, { water, level, bare }, k, seen, (x, z) => certovkaDist(x, z) < 16);
    landmarkMeshes.push({ id: 'embankments', main: k.finish(), detail: d.finish() });
    log(`embankments: ${(metres / 1000).toFixed(1)} km of wall, ${k.triangles} triangles`);
  }
  // Garden walls in the photographed city (tools/lib/walls.ts).
  {
    const k = new Kit(), d = new Kit();
    // The gardens the route and the photographs see: Petřín, Strahov, Malá Strana, Hradčany, the Old Town.
    const seen = (x: number, z: number) => x > -1900 && x < 1500 && z > -900 && z < 1300;
    const els = PARTIAL && !layerExists('gardenwalls') ? [] : layer('gardenwalls');
    const wet = (x: number, z: number) => {
      const i = Math.round((x - ground.x0) / CELL), j = Math.round((z - ground.z0) / CELL);
      return i >= 0 && j >= 0 && i < NX && j < NZ && water[j * NX + i] === 1;
    };
    const { metres, count } = gardenWalls(els, (x, z) => ground.sample(x, z), k, seen, wet);
    landmarkMeshes.push({ id: 'garden-walls', main: k.finish(), detail: d.finish() });
    log(`garden walls: ${count} walls, ${(metres / 1000).toFixed(1)} km, ${k.triangles} triangles`);
  }
  if (ONLY_LANDMARKS) {
    const bytes = gzipSync(packLandmarks(landmarkMeshes), { level: 9 });
    writeFileSync(join(OUT, 'landmarks.bin'), bytes);
    writeFileSync(join(OUT, 'water.bin'), gzipSync(waterPack, { level: 9 }));
    log(`wrote ${join(OUT, 'landmarks.bin')}: ${(bytes.length / 1e6).toFixed(2)} MB, and water.bin (landmarks and water only)`);
    process.exit(0);
  }
  const before = kept.length;
  // A replaced outline takes its parts with it.
  kept = kept.filter((b) => !(b.landmark >= 0 && modelled.has(b.landmark)) && !replacedKeys.has(b.key) && !replacedKeys.has((b as any).outline));
  log(`landmarks: ${landmarkMeshes.length} modelled, ${before - kept.length} OSM buildings and parts replaced`);
}

// ---- Districts, party walls, roofs (design.md §7.2, §8.1, §8.2) -------------------------------

const districts = districtMaps(features(layer('districts'), (t) => t.boundary === 'cadastral'));
log(`districts: ${districts.length} cadastral areas`);

function ringsOf(p: Polygon): Ring[] { return [p.outer, ...p.holes]; }

// Party walls: an edge that runs along a neighbour's edge (within 0.7 m, parallel, overlapping for
// more than half its length) is shared.
{
  const G = 25;
  const cells = new Map<number, number[]>();
  const E: { b: number; v: number; ax: number; az: number; bx: number; bz: number; len: number }[] = [];
  kept.forEach((b, bi) => {
    const rings = ringsOf(b.poly);
    const nv = rings.reduce((a, r) => a + r.length / 2, 0);
    b.edges = new Uint8Array(nv);
    let v = 0;
    for (const r of rings) {
      const n = r.length / 2;
      for (let i = 0; i < n; i++, v++) {
        const j = (i + 1) % n;
        const e = { b: bi, v, ax: r[i * 2], az: r[i * 2 + 1], bx: r[j * 2], bz: r[j * 2 + 1], len: 0 };
        e.len = Math.hypot(e.bx - e.ax, e.bz - e.az);
        if (e.len < 0.5) continue;
        const id = E.push(e) - 1;
        for (let gx = Math.floor((Math.min(e.ax, e.bx) - 1) / G); gx <= Math.floor((Math.max(e.ax, e.bx) + 1) / G); gx++)
          for (let gz = Math.floor((Math.min(e.az, e.bz) - 1) / G); gz <= Math.floor((Math.max(e.az, e.bz) + 1) / G); gz++) {
            const k = (gx + 2000) * 4096 + (gz + 2000);
            (cells.get(k) ?? cells.set(k, []).get(k)!).push(id);
          }
      }
    }
  });
  let shared = 0;
  for (const e of E) {
    const ux = (e.bx - e.ax) / e.len, uz = (e.bz - e.az) / e.len;
    const seen = new Set<number>();
    const spans: [number, number][] = [];
    for (let gx = Math.floor((Math.min(e.ax, e.bx) - 1) / G); gx <= Math.floor((Math.max(e.ax, e.bx) + 1) / G); gx++)
      for (let gz = Math.floor((Math.min(e.az, e.bz) - 1) / G); gz <= Math.floor((Math.max(e.az, e.bz) + 1) / G); gz++)
        for (const id of cells.get((gx + 2000) * 4096 + (gz + 2000)) ?? []) {
          if (seen.has(id)) continue;
          seen.add(id);
          const f = E[id];
          if (f.b === e.b) continue;
          const fx = (f.bx - f.ax) / f.len, fz = (f.bz - f.az) / f.len;
          if (Math.abs(ux * fx + uz * fz) < 0.985) continue;
          const d0 = Math.abs((f.ax - e.ax) * -uz + (f.az - e.az) * ux), d1 = Math.abs((f.bx - e.ax) * -uz + (f.bz - e.az) * ux);
          if (d0 > 0.7 || d1 > 0.7) continue;
          const s0 = (f.ax - e.ax) * ux + (f.az - e.az) * uz, s1 = (f.bx - e.ax) * ux + (f.bz - e.az) * uz;
          const lo = Math.max(0, Math.min(s0, s1)), hi = Math.min(e.len, Math.max(s0, s1));
          if (hi > lo) spans.push([lo, hi]);
        }
    spans.sort((a, b) => a[0] - b[0]);
    let covered = 0, end = 0;
    for (const [lo, hi] of spans) { if (hi > end) { covered += hi - Math.max(lo, end); end = hi; } }
    if (covered > e.len * 0.5) { kept[e.b].edges[e.v] |= EFlag.Party; shared++; }
  }
  log(`party walls: ${shared} of ${E.length} edges`);
}

/** Plans every building on a pool of worker threads (the roofs' straight skeletons dominate). */
async function planAll(inputs: PlanInput[]): Promise<PlanOutput[]> {
  const out: PlanOutput[] = new Array(inputs.length);
  const BATCH = 400;
  let next = 0;
  const n = Math.max(1, Math.min(8, availableParallelism() - 1));
  await Promise.all(Array.from({ length: n }, () => new Promise<void>((done, fail) => {
    const w = new Worker(new URL('./lib/plan-worker.ts', import.meta.url));
    let from = 0;
    const send = () => {
      if (next >= inputs.length) { w.terminate(); done(); return; }
      from = next;
      next = Math.min(inputs.length, next + BATCH);
      w.postMessage(inputs.slice(from, next));
    };
    w.on('message', (m: PlanOutput[] | 'ready') => {
      if (m !== 'ready') m.forEach((o, k) => { out[from + k] = o; });
      send();
    });
    w.on('error', fail);
  })));
  return out;
}

{
  const t1 = Date.now();
  const inputs: PlanInput[] = kept.map((b) => {
    const g: { min: number; ref: number } = (b as any).ground ?? groundRef(b.poly);
    return {
      key: b.key, part: b.part, tags: b.tags, area: b.area, cx: b.cx, poly: b.poly,
      landmark: b.landmark >= 0 ? landmarks[b.landmark].id : undefined,
      gmin: g.min, gref: g.ref, district: districtAt(districts, b.cx, b.cz), edges: b.edges,
    };
  });
  const outputs = ONLY_LIFE ? inputs.map(() => ({ base: 0, top: 0, eave: 0, gnd: 0, style: 0, flags: 0, wall: '', roofC: '', roof: null, props: [], failed: false }) as unknown as PlanOutput) : await planAll(inputs);
  let failed = 0, pitched = 0, dormers = 0, chimneys = 0, roofBoxes = 0;
  kept.forEach((b, k) => {
    const o = outputs[k];
    b.base = o.base; b.top = o.top; b.eave = o.eave; b.gnd = o.gnd;
    b.style = o.style; b.flags = o.flags; b.wall = o.wall; b.roofC = o.roofC;
    b.roof = o.roof; b.props = o.props;
    if (o.failed) failed++;
    if (o.roof) pitched++;
    for (const pr of o.props) pr.type === 0 ? chimneys++ : pr.type === 3 ? roofBoxes++ : dormers++;
  });
  log(`roofs: ${pitched} pitched, ${failed} fell back to flat; ${dormers} dormers, ${chimneys} chimneys, ${roofBoxes} roof boxes (${((Date.now() - t1) / 1000).toFixed(1)} s)`);
}

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
/** Decks a landmark model stands in for: dropped, with the lamps OSM puts on them. */
const modelledDecks = decks.filter((d) => (d.landmark >= 0 && modelled.has(d.landmark)) || replacedKeys.has(d.key));
decks.splice(0, decks.length, ...decks.filter((d) => !modelledDecks.includes(d)));
log(`bridges: ${decks.length} decks (${modelledDecks.length} modelled)`);

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
    if (modelled.has(k)) {
      const b = landmarkMeshes.find((q) => q.id === l.id);
      rows.push(`${l.id.padEnd(26)} modelled${b ? ` (${(b.main.index.length + b.detail.index.length) / 3} triangles)` : ''}`);
      return;
    }
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
  raiseSurface(landmarkMeshes, (x, z, y) => {
    const i = Math.round((x - surface.x0) / SC), j = Math.round((z - surface.z0) / SC);
    if (i >= 0 && j >= 0 && i < SNX && j < SNZ && surface.data[j * SNX + i] < y) surface.data[j * SNX + i] = y;
  }, (x0, z0, x1, z1, f) => {
    for (let j = Math.ceil((z0 - surface.z0) / SC); j <= Math.floor((z1 - surface.z0) / SC); j++)
      for (let i = Math.ceil((x0 - surface.x0) / SC); i <= Math.floor((x1 - surface.x0) / SC); i++) f(surface.x0 + i * SC, surface.z0 + j * SC);
  });
  log('surface grid');
}

// ---- Streets: tram rails and lamp posts (design.md §8.3) -------------------------------------

// The road decks of the bridges: the level faces of the modelled bridges, or the top of an OSM deck.
const DC = 2, deckTop = new Map<number, number>();
const dkey = (x: number, z: number) => Math.round(x / DC) * 100000 + Math.round(z / DC);
{
  for (const b of landmarkMeshes) {
    const p = b.main.position, idx = b.main.index;
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t] * 3, c = idx[t + 1] * 3, d = idx[t + 2] * 3;
      const ux = p[c] - p[a], uy = p[c + 1] - p[a + 1], uz = p[c + 2] - p[a + 2], vx = p[d] - p[a], vy = p[d + 1] - p[a + 1], vz = p[d + 2] - p[a + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.hypot(nx, ny, nz);
      if (nl < 1e-6 || Math.abs(ny / nl) < 0.97) continue;
      const y = (p[a + 1] + p[c + 1] + p[d + 1]) / 3;
      for (let gx = Math.ceil(Math.min(p[a], p[c], p[d]) / DC); gx <= Math.floor(Math.max(p[a], p[c], p[d]) / DC); gx++)
        for (let gz = Math.ceil(Math.min(p[a + 2], p[c + 2], p[d + 2]) / DC); gz <= Math.floor(Math.max(p[a + 2], p[c + 2], p[d + 2]) / DC); gz++) {
          const k = gx * 100000 + gz;
          deckTop.set(k, Math.max(deckTop.get(k) ?? -Infinity, y));
        }
    }
  }
}
function deckAt(x: number, z: number): number {
  const y = deckTop.get(dkey(x, z));
  if (y !== undefined) return y;
  for (const d of decks) if (pointInPolygon(x, z, d.poly)) return d.top;
  return NaN;
}
const inWorld = (x: number, z: number) => x > WORLD.xMin && x < WORLD.xMax && z > WORLD.zMin && z < WORLD.zMax;
/** Where a track or a road runs: on a bridge's deck, or on the ground. NaN outside the world, or over water with no deck. */
function trackY(x: number, z: number, onBridge: boolean): number {
  if (!inWorld(x, z)) return NaN;
  const wet = water[Math.round((z - ground.z0) / CELL) * NX + Math.round((x - ground.x0) / CELL)];
  return onBridge || wet ? deckAt(x, z) : ground.sample(x, z);
}

let streetsPack: Uint8Array;
let railPos: Float32Array;
{
  // Tram tracks: each OSM way is one track; points every 3 m on the ground, and on a bridge on its
  // road deck.
  const rs: number[] = [0], rp: number[] = [];
  let km = 0;
  // The poles that carry the overhead wire (design.md §8.8): every 30 m on the right of each track,
  // which is the outside of a street's pair, 3.4 m out; not on bridges (their lamps carry it), not
  // in the river, and not where a house stands (the wire hangs from its wall there). Buildings are
  // looked up on a 2 m raster of the middle of the world.
  const BM = { x0: -3000, z0: -3000, cell: 2, n: 3000 };
  const built = new Uint8Array(BM.n * BM.n);
  for (const b of buildings) scanPolygon(polygonRings(b.poly), BM.x0 + 1, BM.z0 + 1, BM.cell, BM.n, BM.n, (i, j) => { built[j * BM.n + i] = 1; });
  const housed = (x: number, z: number) => {
    const i = Math.floor((x - BM.x0) / BM.cell), j = Math.floor((z - BM.z0) / BM.cell);
    if (i < 1 || j < 1 || i >= BM.n - 1 || j >= BM.n - 1) return false;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) if (built[(j + dj) * BM.n + i + di]) return true;
    return false;
  };
  const poles: number[] = [];
  const poleCells = new Map<number, number[]>();
  const poleNear = (x: number, z: number, r: number) => {
    const gx = Math.floor(x / 20), gz = Math.floor(z / 20);
    for (let i = gx - 1; i <= gx + 1; i++) for (let j = gz - 1; j <= gz + 1; j++)
      for (const k of poleCells.get(i * 100000 + j) ?? []) if (Math.hypot(poles[k] - x, poles[k + 2] - z) < r) return true;
    return false;
  };
  for (const el of layer('railways')) {
    const t = el.tags ?? {};
    if (el.type !== 'way' || t.railway !== 'tram' || underground(t)) continue;
    const onBridge = !!t.bridge && t.bridge !== 'no';
    const line = lineOf(el);
    const back = t.oneway === '-1';
    if (!onBridge)
      for (let k = 0, acc = 15; k + 2 < line.length; k += 2) {
        const ax = line[k], az = line[k + 1], bx = line[k + 2], bz = line[k + 3];
        const len = Math.hypot(bx - ax, bz - az);
        for (; acc < len; acc += 30) {
          const x = ax + ((bx - ax) * acc) / len, z = az + ((bz - az) * acc) / len;
          // Right of the way the trams run: x east, z south, so the right of (dx, dz) is (-dz, dx).
          const s = back ? -1 : 1, rx = (-(bz - az) / len) * s, rz = ((bx - ax) / len) * s;
          const px = x + rx * 3.4, pz = z + rz * 3.4;
          if (!inWorld(px, pz) || water[Math.round((pz - ground.z0) / CELL) * NX + Math.round((px - ground.x0) / CELL)]) continue;
          if (housed(px, pz) || poleNear(px, pz, 12)) continue;
          const key = Math.floor(px / 20) * 100000 + Math.floor(pz / 20);
          (poleCells.get(key) ?? poleCells.set(key, []).get(key)!).push(poles.length);
          poles.push(px, ground.sample(px, pz), pz, Math.atan2(-rz, -rx));
        }
        acc -= len;
      }
    const pts: number[] = [];
    for (let k = 0; k + 2 < line.length; k += 2) {
      const ax = line[k], az = line[k + 1], bx = line[k + 2], bz = line[k + 3];
      const len = Math.hypot(bx - ax, bz - az), steps = Math.max(1, Math.ceil(len / 3));
      for (let q = 0; q < steps; q++) pts.push(ax + ((bx - ax) * q) / steps, az + ((bz - az) * q) / steps);
      km += len / 1000;
    }
    pts.push(line[line.length - 2], line[line.length - 1]);
    let open = false;
    for (let k = 0; k < pts.length; k += 2) {
      const x = pts[k], z = pts[k + 1];
      const y = trackY(x, z, onBridge);
      if (Number.isNaN(y)) {
        if (open) { rs.push(rp.length / 3); open = false; }
        continue;
      }
      rp.push(x, y, z);
      open = true;
    }
    if (open) rs.push(rp.length / 3);
  }
  // Drop runs of a single point.
  const starts: number[] = [0], pos: number[] = [];
  for (let k = 0; k + 1 < rs.length; k++) {
    if (rs[k + 1] - rs[k] < 2) continue;
    pos.push(...rp.slice(rs[k] * 3, rs[k + 1] * 3));
    starts.push(pos.length / 3);
  }
  // Lamps: on the ground, or on a bridge deck; in the old town's streets, a lamp that stands
  // against a house hangs from a bracket on its wall (8082, 8777; M10).
  const OLD = new Set<number>([District.MalaStrana, District.Hradcany, District.StareMesto, District.Josefov]);
  const EG = 20, edges = new Map<number, number[]>();
  for (const b of kept) {
    if (b.part || Math.abs(b.cx) > 2500 || Math.abs(b.cz) > 2500) continue;
    const r = b.poly.outer, n = r.length / 2;
    for (let i = 0; i < n; i++) {
      const ax = r[i * 2], az = r[i * 2 + 1], bx = r[((i + 1) % n) * 2], bz = r[((i + 1) % n) * 2 + 1];
      for (let gx = Math.floor((Math.min(ax, bx) - 3) / EG); gx <= Math.floor((Math.max(ax, bx) + 3) / EG); gx++)
        for (let gz = Math.floor((Math.min(az, bz) - 3) / EG); gz <= Math.floor((Math.max(az, bz) + 3) / EG); gz++) {
          const key = gx * 100000 + gz;
          (edges.get(key) ?? edges.set(key, []).get(key)!).push(ax, az, bx, bz);
        }
    }
  }
  /** The nearest wall within 3 m: the foot of the perpendicular, and the way out from it. */
  const wallNear = (x: number, z: number) => {
    const list = edges.get(Math.floor(x / EG) * 100000 + Math.floor(z / EG));
    let best = 3, out: [number, number, number, number] | null = null;
    for (let i = 0; list && i < list.length; i += 4) {
      const ax = list[i], az = list[i + 1], dx = list[i + 2] - ax, dz = list[i + 3] - az, L2 = dx * dx + dz * dz;
      if (L2 < 1) continue;
      const t = Math.max(0.05, Math.min(0.95, ((x - ax) * dx + (z - az) * dz) / L2));
      const fx = ax + dx * t, fz = az + dz * t, d = Math.hypot(x - fx, z - fz);
      if (d < best) {
        best = d;
        // Away from the wall on the lamp's side (the street's), whatever the ring's winding.
        const L = Math.sqrt(L2);
        let nx = -dz / L, nz = dx / L;
        if ((x - fx) * nx + (z - fz) * nz < 0) { nx = -nx; nz = -nz; }
        out = [fx, fz, nx, nz];
      }
    }
    return out;
  };
  const lp: number[] = [], wl: number[] = [];
  for (const el of layer('lamps')) {
    if (el.type !== 'node' || el.lat === undefined || el.lon === undefined) continue;
    const x = lonToX(el.lon), z = latToZ(el.lat);
    if (x <= WORLD.xMin || x >= WORLD.xMax || z <= WORLD.zMin || z >= WORLD.zMax) continue;
    if (modelledDecks.some((d) => pointInPolygon(x, z, d.poly))) continue;
    let y = ground.sample(x, z), deck = false;
    for (const d of decks) if (pointInPolygon(x, z, d.poly)) { y = d.top; deck = true; break; }
    if (Number.isNaN(y)) continue;
    const w = !deck && OLD.has(districtAt(districts, x, z)) ? wallNear(x, z) : null;
    // The lantern 0.8 m out from the wall, the bracket's heading as an angle.
    if (w) wl.push(w[0] + w[2] * 0.8, ground.sample(w[0] + w[2] * 0.8, w[1] + w[3] * 0.8), w[1] + w[3] * 0.8, Math.atan2(w[2], w[3]));
    else lp.push(x, y, z);
  }
  railPos = new Float32Array(pos);
  streetsPack = encodePack({}, { railStart: new Uint32Array(starts), rail: railPos, lamp: new Float32Array(lp), wallLamp: new Float32Array(wl), pole: new Float32Array(poles) });
  log(`streets: ${km.toFixed(0)} km of tram track in ${starts.length - 1} runs, ${lp.length / 3} lamps and ${wl.length / 4} on walls, ${poles.length / 4} wire poles`);
}

// ---- City life (design.md §8.8, tools/lib/life.ts) ---------------------------------------------

const lifePack = buildLife({
  railways: layer('railways'), stops: layer('tramstops'), highways: layer('highways'), landuse: layer('landuse'), water: waterEls,
  grid: { x0: ground.x0, z0: ground.z0, cell: CELL, nx: NX, nz: NZ }, wet: water, level, weirs: weirList,
  ground: (x, z) => ground.sample(x, z), track: trackY, deck: deckAt, log,
}, railPos);
if (ONLY_LIFE) {
  writeFileSync(join(OUT, 'life.bin'), gzipSync(lifePack, { level: 9 }));
  writeFileSync(join(OUT, 'streets.bin'), gzipSync(streetsPack, { level: 9 }));
  const manifest = JSON.parse(readFileSync(join(OUT, 'manifest.json'), 'utf8'));
  manifest.life = { file: 'life.bin' };
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
  log(`wrote life.bin and streets.bin (life only)`);
  process.exit(0);
}

// ---- Trees -------------------------------------------------------------------------------------

// Every crown of the canopy height model (design.md §8.4, tools/lib/trees.ts), where no building,
// deck or water stands, and the kind of tree the land use and the mapped trees suggest.
let treesPack: Uint8Array | null = null;
{
  const c = loadCanopy();
  if (!c) console.warn('  (no canopy in cache/chm: no trees; run tools/fetch-data.ts chm)');
  else {
    const mask = new Uint8Array(c.nx * c.nz);
    const fill = (p: Polygon) => scanPolygon(polygonRings(p), c.x0 + 0.5, c.z0 + 0.5, 1, c.nx, c.nz, (i, j) => { mask[j * c.nx + i] = 1; });
    for (const b of buildings) fill(b.poly);
    for (const d of decks) fill(d.poly);
    for (const f of waterFeatures) for (const p of f.polygons) fill(p);
    // Rail lines: trains and their wires stand as high as young trees.
    for (const el of layer('railways')) {
      const t = el.tags ?? {};
      if (el.type !== 'way' || !t.railway || t.railway === 'tram' || t.railway === 'subway' || underground(t)) continue;
      scanLine(lineOf(el), 3, c.x0 + 0.5, c.z0 + 0.5, 1, c.nx, c.nz, (i, j) => { mask[j * c.nx + i] = 1; });
    }
    // A metre round every footprint: outlines and the survey disagree by about that much.
    const grown = mask.slice();
    for (let j = 1; j < c.nz - 1; j++)
      for (let i = 1; i < c.nx - 1; i++) {
        const k = j * c.nx + i;
        if (!mask[k] && (mask[k - 1] | mask[k + 1] | mask[k - c.nx] | mask[k + c.nx])) grown[k] = 1;
      }
    // Mapped trees say which are conifers.
    const needles = new Set<string>();
    for (const el of PARTIAL && !layerExists('trees') ? [] : layer('trees'))
      if (el.lat !== undefined && el.lon !== undefined && el.tags?.leaf_type === 'needleleaved')
        needles.add(`${Math.round(lonToX(el.lon) / 4)},${Math.round(latToZ(el.lat) / 4)}`);
    const isNeedle = (x: number, z: number) => {
      const i = Math.round(x / 4), j = Math.round(z / 4);
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) if (needles.has(`${i + di},${j + dj}`)) return true;
      return false;
    };
    // Islands and narrow banks: water on three sides within 150 m.
    const wet = (x: number, z: number) => landuse.nearest(x, z) === Ground.Water;
    const island = (x: number, z: number) => {
      let n = 0;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        for (let d = 10; d <= 150; d += 10) if (wet(x + dx * d, z + dz * d)) { n++; break; }
      }
      return n >= 3;
    };
    const GREEN = new Set<number>([Ground.Park, Ground.Garden, Ground.Grass, Ground.Meadow, Ground.Orchard, Ground.Scrub, Ground.Vineyard, Ground.Pitch, Ground.Flowerbed]);
    const kind = (x: number, z: number, h: number, r: number, seed: number) => {
      const cls = landuse.nearest(x, z);
      const a = seed / 256, b = ((seed * 97) % 256) / 256;
      if (isNeedle(x, z)) return TreeKind.Conifer;
      if (cls === Ground.Orchard && h < 12) return TreeKind.Fruit;
      if (h < 7.5 && r < 4.5 && GREEN.has(cls)) return TreeKind.Fruit;
      if (h > 14 && island(x, z) && a < 0.25) return TreeKind.Poplar;
      if (h > 18 && r < 0.2 * h) return a < 0.3 ? TreeKind.Poplar : a < 0.6 ? TreeKind.Conifer : TreeKind.Broad;
      const conifers = cls === Ground.Cemetery ? 0.3 : cls === Ground.Wood ? 0.1 : cls === Ground.Park || cls === Ground.Garden ? 0.07 : 0.03;
      if (h > 6 && b < conifers) return TreeKind.Conifer;
      return TreeKind.Broad;
    };
    const LOW = new Set<number>([Ground.Park, Ground.Garden, Ground.Grass, Ground.Meadow, Ground.Orchard, Ground.Cemetery]);
    // The Petřín rose garden (design.md §8.4): OSM draws its lawns and paths; the open ground
    // between the lawn panels, where no crown stands over it, is the rose beds.
    for (const f of features(layer('landuse'), (t) => t.name === 'Růžový sad'))
      for (const p of f.polygons)
        scanPolygon(polygonRings(p), landuse.x0, landuse.z0, LU, LNX, LNZ, (i, j) => {
          const k = j * LNX + i;
          if (landuse.data[k] !== Ground.Park) return;
          const x = landuse.x0 + i * LU, z = landuse.z0 + j * LU;
          let lawn = false, open = true;
          for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) if (landuse.data[(j + dj) * LNX + i + di] === Ground.Grass) lawn = true;
          for (let dz = -2; dz <= 2 && open; dz++)
            for (let dx = -2; dx <= 2; dx++) {
              const ci = Math.round(x + dx - c.x0), cj = Math.round(z + dz - c.z0);
              if (c.data[cj * c.nx + ci] > 8) { open = false; break; }
            }
          if (lawn && open) landuse.data[k] = Ground.Flowerbed;
        });
    const trees = findTrees(c, { mask: grown, kind, minHeight: (x, z) => (LOW.has(landuse.nearest(x, z)) ? 1.8 : 2.5) });
    // Rose bushes in the beds, about one to a square metre and a half, in bloom.
    for (let j = 0; j < LNZ; j++)
      for (let i = 0; i < LNX; i++) {
        if ((landuse.data[j * LNX + i] & CANOPY_MASK) !== Ground.Flowerbed) continue;
        for (let b = 0; b < 2; b++)
          for (let a = 0; a < 2; a++) {
            const x0 = landuse.x0 + i * LU + (a - 0.5) * LU / 2, z0 = landuse.z0 + j * LU + (b - 0.5) * LU / 2;
            const seed = treeHash(x0, z0), u = seed / 256, v = ((seed * 131) % 256) / 256;
            trees.push({ x: x0 + (u - 0.5) * 0.4, z: z0 + (v - 0.5) * 0.4, h: 0.8 + 0.5 * v, r: 0.42 + 0.18 * u, kind: TreeKind.Rose, seed });
          }
      }
    // The Čertovka's banks, overgrown (9204): bushes along both sides wherever no building stands
    // on the water, their crowns hanging over it.
    {
      const near = buildings.filter((b) => certovkaDist(b.cx, b.cz) < 60);
      let shrubs = 0;
      for (const l of certovka)
        for (let i = 0; i + 3 < l.length; i += 2) {
          const ax = l[i], az = l[i + 1], dx = l[i + 2] - ax, dz = l[i + 3] - az, len = Math.hypot(dx, dz);
          if (len < 0.5) continue;
          const nx = -dz / len, nz = dx / len;
          for (let s = 0; s < len; s += 2.3)
            for (const side of [-1, 1]) {
              const px = ax + (dx * s) / len, pz = az + (dz * s) / len;
              // The bank: out from the centreline to the first dry ground.
              let d = 1;
              while (d < 14 && wet(px + nx * side * d, pz + nz * side * d)) d += 0.5;
              if (d >= 14) continue;
              const seed = treeHash(px * 3 + side, pz * 3), u = seed / 256, v = ((seed * 131) % 256) / 256;
              const x = px + nx * side * (d + 0.4 + 0.8 * u), z = pz + nz * side * (d + 0.4 + 0.8 * u);
              if (near.some((b) => pointInPolygon(x, z, b.poly))) continue;
              trees.push({ x, z, h: 2.6 + 2.2 * u, r: 1.6 + 1.0 * v, kind: TreeKind.Shrub, seed });
              shrubs++;
            }
        }
      log(`Čertovka: ${shrubs} bushes on its banks`);
    }
    // By world tile, positions within the tile.
    const TNX = W / TILE, TNZ = D / TILE;
    const byTile: (typeof trees)[] = Array.from({ length: TNX * TNZ }, () => []);
    for (const t of trees) {
      const i = Math.floor((t.x - WORLD.xMin) / TILE), j = Math.floor((t.z - WORLD.zMin) / TILE);
      if (i >= 0 && j >= 0 && i < TNX && j < TNZ) byTile[j * TNX + i].push(t);
    }
    const start = new Uint32Array(TNX * TNZ + 1);
    const xz = new Uint16Array(trees.length * 2), hr = new Uint8Array(trees.length * 2), ks = new Uint8Array(trees.length * 2);
    let n = 0;
    byTile.forEach((list, k) => {
      start[k] = n;
      const x0 = WORLD.xMin + (k % TNX) * TILE, z0 = WORLD.zMin + Math.floor(k / TNX) * TILE;
      for (const t of list) {
        xz[n * 2] = Math.min(65535, Math.round((t.x - x0) * TREE_XZ));
        xz[n * 2 + 1] = Math.min(65535, Math.round((t.z - z0) * TREE_XZ));
        hr[n * 2] = Math.min(255, Math.round(t.h / TREE_H));
        hr[n * 2 + 1] = Math.min(255, Math.round(t.r / TREE_R));
        ks[n * 2] = t.kind;
        ks[n * 2 + 1] = t.seed;
        n++;
      }
    });
    start[TNX * TNZ] = n;
    treesPack = encodePack({ nx: TNX, nz: TNZ, tile: TILE, x0: WORLD.xMin, z0: WORLD.zMin }, { start, xz, hr, ks });
    // The ground under the crowns is in their shade: a bit above the class says a crown stands over
    // the cell (src/core/landuse.ts, CANOPY_SHIFT).
    const SHADED = new Set<number>([Ground.Urban, Ground.Grass, Ground.Wood, Ground.Park, Ground.Garden, Ground.Orchard, Ground.Cemetery, Ground.Residential, Ground.Meadow, Ground.Scrub, Ground.Vineyard, Ground.Farmland, Ground.Pitch]);
    for (const t of trees) {
      const rr = t.r * 0.8;
      const i0 = Math.max(0, Math.ceil((t.x - rr - landuse.x0) / LU)), i1 = Math.min(LNX - 1, Math.floor((t.x + rr - landuse.x0) / LU));
      const j0 = Math.max(0, Math.ceil((t.z - rr - landuse.z0) / LU)), j1 = Math.min(LNZ - 1, Math.floor((t.z + rr - landuse.z0) / LU));
      for (let j = j0; j <= j1; j++)
        for (let i = i0; i <= i1; i++) {
          const dx = landuse.x0 + i * LU - t.x, dz = landuse.z0 + j * LU - t.z;
          if (dx * dx + dz * dz > rr * rr) continue;
          const k = j * LNX + i, cls = landuse.data[k] & CANOPY_MASK;
          if (SHADED.has(cls)) landuse.data[k] = cls | (1 << CANOPY_SHIFT);
        }
    }
    log(`trees: ${n} crowns (${tally(trees)})`);
  }
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
{
  const bytes = gzipSync(streetsPack, { level: 9 });
  writeFileSync(join(OUT, 'streets.bin'), bytes);
  sizes.streets = bytes.length;
}
{
  const bytes = gzipSync(lifePack, { level: 9 });
  writeFileSync(join(OUT, 'life.bin'), bytes);
  sizes.life = bytes.length;
}
if (treesPack) {
  const bytes = gzipSync(treesPack, { level: 9 });
  writeFileSync(join(OUT, 'trees.bin'), bytes);
  sizes.trees = bytes.length;
}
{
  const bytes = gzipSync(packLandmarks(landmarkMeshes), { level: 9 });
  writeFileSync(join(OUT, 'landmarks.bin'), bytes);
  sizes.landmarks = bytes.length;
}

interface Item {
  poly: Polygon; base: number; top: number; eave: number; gnd: number; landmark: number; kind: number;
  style: number; flags: number; wall: string; roofC: string; edges?: Uint8Array; roof?: Roof | null; props?: PropRec[];
  cx: number; cz: number;
}

/**
 * One tile's buildings, relative to the tile origin, lengths in decimetres:
 *   per building   ring, base, top, eave, gnd, landmark, kind, style, flags, wall and roof colour
 *                  (sRGB), roofV and roofF (first extra roof vertex and first roof face)
 *   per ring       vert (first vertex); per vertex xy and edge (EFlag bits of the edge it starts)
 *   roof           rv (x, z, y of the extra vertices), per face fk (kind), fe (edge, building-local
 *                  vertex, or −1), fn (triangles); ti (triangle corners, building-local: footprint
 *                  vertices first, then the building's extra vertices)
 *   props          pt (type), pa (facing, 256 steps), pb (building), pp (x, z, y0, y1 in dm; w, d in cm)
 */
function packTile(items: Item[], ox: number, oz: number) {
  const bRing: number[] = [0], rVert: number[] = [0], xy: number[] = [], edge: number[] = [];
  const base: number[] = [], top: number[] = [], eave: number[] = [], gnd: number[] = [];
  const lm: number[] = [], kind: number[] = [], style: number[] = [], flags: number[] = [], wall: number[] = [], roofC: number[] = [];
  const roofV: number[] = [0], roofF: number[] = [0], rv: number[] = [], fk: number[] = [], fe: number[] = [], fn: number[] = [], ti: number[] = [];
  const pt: number[] = [], pa: number[] = [], pb: number[] = [], pp: number[] = [];
  const dm = (v: number) => Math.round(v * 10);
  items.forEach((it, bi) => {
    let nv = 0;
    for (const r of [it.poly.outer, ...it.poly.holes]) {
      for (let k = 0; k < r.length; k += 2) xy.push(dm(r[k] - ox), dm(r[k + 1] - oz));
      nv += r.length / 2;
      rVert.push(xy.length / 2);
    }
    for (let v = 0; v < nv; v++) edge.push(it.edges?.[v] ?? 0);
    bRing.push(rVert.length - 1);
    base.push(dm(it.base)); top.push(dm(it.top)); eave.push(dm(it.eave)); gnd.push(dm(it.gnd));
    lm.push(it.landmark); kind.push(it.kind); style.push(it.style); flags.push(it.flags);
    wall.push(...hexRgb(it.wall)); roofC.push(...hexRgb(it.roofC));
    if (it.roof) {
      const r = it.roof;
      for (let k = 0; k < r.x.length; k++) rv.push(dm(r.x[k] - ox), dm(r.z[k] - oz), dm(it.eave + r.h[k]));
      for (const f of r.faces) {
        fk.push(f.kind); fe.push(f.edge); fn.push(f.tris.length / 3);
        ti.push(...f.tris);
      }
    }
    roofV.push(rv.length / 3);
    roofF.push(fk.length);
    for (const p of it.props ?? []) {
      pt.push(p.type);
      pa.push(Math.round(((p.angle / (2 * Math.PI)) % 1 + 1) % 1 * 256) & 255);
      pb.push(bi);
      pp.push(dm(p.x - ox), dm(p.z - oz), dm(p.y0), dm(p.y1), Math.round(p.w * 100), Math.round(p.d * 100));
    }
  });
  return {
    ring: new Uint32Array(bRing), vert: new Uint32Array(rVert), xy: new Int16Array(xy), edge: new Uint8Array(edge),
    base: new Int16Array(base), top: new Int16Array(top), eave: new Int16Array(eave), gnd: new Int16Array(gnd),
    landmark: new Int8Array(lm), kind: new Uint8Array(kind), style: new Uint8Array(style), flags: new Uint8Array(flags),
    wall: new Uint8Array(wall), roof: new Uint8Array(roofC),
    roofV: new Uint32Array(roofV), roofF: new Uint32Array(roofF), rv: new Int16Array(rv),
    fk: new Uint8Array(fk), fe: new Int16Array(fe), fn: new Uint16Array(fn), ti: new Uint16Array(ti),
    pt: new Uint8Array(pt), pa: new Uint8Array(pa), pb: new Uint16Array(pb), pp: new Int16Array(pp),
  };
}

const KIND = { building: 0, part: 1, bridge: 2, box: 3 };
const tiles: { i: number; j: number; file: string; count: number; bytes: number }[] = [];
{
  // Buildings, bridge decks and landmark boxes all go into the tile that holds their centroid.
  const items: Item[] = [
    ...kept.map((b) => ({ ...b, roofC: b.roofC, kind: b.part ? KIND.part : KIND.building })),
    ...decks.map((d) => {
      const [cx, cz] = centroid(d.poly.outer);
      const c = d.landmark >= 0 ? LANDMARK_COLOURS[landmarks[d.landmark].id] ?? [BRIDGE, BRIDGE] : [BRIDGE, BRIDGE];
      return { ...d, eave: d.top, gnd: d.base, style: Style.Blank, flags: d.landmark >= 0 ? BFlag.Landmark : 0, wall: c[0], roofC: c[1], kind: KIND.bridge, cx, cz };
    }),
    ...boxes.map((b) => {
      const [cx, cz] = centroid(b.poly.outer);
      const c = LANDMARK_COLOURS[landmarks[b.landmark].id] ?? ['#d9c9a8', '#6d6a62'];
      return { ...b, eave: b.top, gnd: b.base, style: Style.Blank, flags: BFlag.Landmark, wall: c[0], roofC: c[1], kind: KIND.box, cx, cz };
    }),
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
    const bytes = write(file, { i, j, ox, oz, count: list.length }, packTile(list, ox, oz));
    tiles.push({ i, j, file, count: list.length, bytes });
  }
}
sizes.tiles = tiles.reduce((a, t) => a + t.bytes, 0);

const manifest = {
  version: 2,
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
  streets: { file: 'streets.bin' },
  landmarks: { file: 'landmarks.bin' },
  trees: treesPack ? { file: 'trees.bin' } : null,
  life: { file: 'life.bin' },
  tiles,
  kinds: KIND,
  attribution: 'Map data © OpenStreetMap contributors (ODbL). Terrain and trees © ČÚZK, DMR 5G and DMP OK (CC BY 4.0).',
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
      const c = colours[landuse.nearest(x, z) & CANOPY_MASK] ?? [255, 0, 255];
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
