// The hand-built landmarks of design.md §7.1, modelled in code (tools/landmarks/*.ts) on their
// OSM footprints and the terrain, and packed into public/world/landmarks.bin for the app
// (src/world/landmarks.ts). Each model says which OSM elements it stands in for; the world build
// drops those, so the landmark is drawn once. Build side only.

import { Kit, type MeshBuffers } from './kit.ts';
import type { Feature, Ring, Tags } from '../lib/osm.ts';
import { encodePack, type Typed } from '../../src/core/pack.ts';
import { initSkeleton } from '../lib/skeleton.ts';
import { SFlag } from '../../src/core/buildings.ts';
import { petrinTower } from './petrin-tower.ts';
import { charlesBridge } from './charles-bridge.ts';
import { oldTownBridgeTower, lesserTownBridgeTowers } from './bridge-towers.ts';
import { tyn } from './tyn.ts';
import { stNicholas } from './st-nicholas.ts';
import { castle } from './castle.ts';
import { vysehrad } from './vysehrad.ts';
import { smetanaMuseum } from './old-town-bank.ts';
import { dancingHouse } from './dancing-house.ts';
import { nationalTheatre, sitkovTower, stFrancis, klementinumTower, rudolfinum } from './riverside.ts';
import { powderTower, oldTownHall, stNicholasOldTown, husMemorial } from './old-town.ts';
import { legionBridge, manesBridge, cechBridge, jirasekBridge, palackyBridge, stefanikBridge, railwayBridge } from './bridges.ts';
import { schonbornGloriette } from './gardens.ts';
import { zlomkovskyMill } from './mills.ts';
import { stSalvator } from './klementinum.ts';
import { kinskyPalace, stoneBell, tynSchool, whiteUnicorn } from './old-town-square.ts';
import { churches } from './churches.ts';
import { stGeorge, castleTowers, loreta, cerninPalace } from './hradcany.ts';
import { jindrisskaTower, newTownHallTower, municipalHouse, nationalMuseum, vitkov } from './new-town.ts';

/** What a model may ask of the world it stands in. */
export interface Site {
  /** Terrain height (y) after the river bed and the ramparts are carved. */
  ground(x: number, z: number): number;
  /** Terrain before carving. */
  bare(x: number, z: number): number;
  /** The water surface at a point, or NaN on land. */
  water(x: number, z: number): number;
  /** An OSM building, building part or bridge by key ("way/123"), in world metres. */
  feature(key: string): Feature | undefined;
  /** Every OSM building and part whose centre lies within r of (x, z). */
  near(x: number, z: number, r: number): Feature[];
  /** City walls as lines (flat x, z lists). */
  walls: { key: string; tags: Tags; line: Ring }[];
  /** A landmark's position from data/landmarks.json (world x, z). */
  landmark(id: string): { x: number; z: number };
  /** Every OSM building, part and bridge the filter passes (the church generator, M15). */
  features(filter: (tags: Tags, key: string) => boolean): Feature[];
  /** Whether a hand model already stands for this OSM key (a landmark's footprint or a model's `replaces`). */
  claimed(key: string): boolean;
  /** The cadastral district's name at a point ('' outside the named ones). */
  district(x: number, z: number): string;
}

export interface Model {
  /** The landmarks.json id the model stands for (its OSM footprints and parts are replaced). */
  id: string;
  /** Further landmarks.json ids the same model covers. */
  covers?: string[];
  /** Other OSM keys the model replaces (buildings, parts, bridge decks). */
  replaces?: string[];
  /** Floodlit at night (design.md §8.7); 'dim' for a quarter of it (Charles Bridge's body under its lanterns), 'bright' for twice (the Castle; M17). */
  floodlit?: boolean | 'dim' | 'bright';
  /** A piece of the city modelled by hand that is not one of §6.2's landmarks: no entry in
   * data/landmarks.json, nothing replaced by id, no name on the screen. */
  unnamed?: boolean;
  /**
   * Main geometry; the detail the app drops beyond about 1.4 km (statues, finials, lamps); and
   * the fine ornament drawn within about 300 m (mouldings, tracery, balusters, crockets; M12).
   */
  build(site: Site, main: Kit, detail: Kit, fine: Kit): void;
  /**
   * A generator (the churches, M15): instead of building, it returns the models it stands for,
   * each built and packed on its own, so the app culls their detail and fine tiers one by one.
   */
  expand?(site: Site): Model[];
  /**
   * For a generator: the models it returns are merged per tier into cells of these sizes (metres)
   * before packing, so a hundred churches cost a few draw calls, not four hundred (M15). The fine
   * cell should be small (its mesh is drawn within 300 m of the cell's sphere), the main one large.
   */
  merge?: { main: number; detail: number; fine: number };
}

export const MODELS: Model[] = [
  charlesBridge, oldTownBridgeTower, lesserTownBridgeTowers, tyn, stNicholas, castle, petrinTower, vysehrad,
  legionBridge, manesBridge, cechBridge, jirasekBridge, palackyBridge, stefanikBridge, railwayBridge,
  smetanaMuseum, dancingHouse, nationalTheatre, sitkovTower, stFrancis, klementinumTower, rudolfinum,
  powderTower, oldTownHall, stNicholasOldTown, husMemorial, schonbornGloriette, zlomkovskyMill, stSalvator,
  kinskyPalace, stoneBell, tynSchool, whiteUnicorn,
  stGeorge, castleTowers, loreta, cerninPalace, jindrisskaTower, newTownHallTower, municipalHouse, nationalMuseum, vitkov, churches,
];

export interface Built {
  id: string;
  main: MeshBuffers;
  detail: MeshBuffers;
  /** The fine tier (M12), drawn within a few hundred metres. */
  fine?: MeshBuffers;
  /** Lamps: x, y, z, kind per lamp. */
  lights?: number[];
  /** Rings the model keeps clear of bushes and trees (Kit.claims). */
  claims?: number[][];
  /** OSM keys the model replaces (from Model.replaces; the generators' models set theirs at build time). */
  replaces?: string[];
}

export async function buildLandmarks(site: Site, log: (...a: unknown[]) => void): Promise<Built[]> {
  await initSkeleton();
  const out: Built[] = [];
  for (const model of MODELS) {
    const t0 = Date.now();
    const list = model.expand ? model.expand(site) : [model];
    let tris = [0, 0, 0];
    const built: Built[] = [];
    for (const m of list) {
      const main = new Kit(), detail = new Kit(), fine = new Kit();
      if (m.floodlit) main.flagsOr = detail.flagsOr = fine.flagsOr = m.floodlit === 'dim' ? SFlag.FloodDim : m.floodlit === 'bright' ? SFlag.Floodlit | SFlag.FloodDim : SFlag.Floodlit;
      m.build(site, main, detail, fine);
      built.push({ id: m.id, main: main.finish(), detail: detail.finish(), fine: fine.finish(), lights: [...main.lights, ...detail.lights, ...fine.lights], claims: [...main.claims, ...detail.claims, ...fine.claims], replaces: m.replaces });
      tris = [tris[0] + main.triangles, tris[1] + detail.triangles, tris[2] + fine.triangles];
    }
    const merged = model.merge ? mergeBuilt(model.id, built, model.merge) : built;
    out.push(...merged);
    log(`landmark ${model.id}${model.expand ? ` (${list.length} models${model.merge ? `, ${merged.length} meshes` : ''})` : ''}: ${tris[0]} + ${tris[1]} detail + ${tris[2]} fine triangles (${Date.now() - t0} ms)`);
  }
  return out;
}

/** Concatenates mesh buffers, offsetting the indices. */
function concatMesh(list: MeshBuffers[]): MeshBuffers {
  const nv = list.reduce((a, b) => a + b.position.length / 3, 0), ni = list.reduce((a, b) => a + b.index.length, 0);
  const out: MeshBuffers = {
    position: new Float32Array(nv * 3), normal: new Int8Array(nv * 3), color: new Uint8Array(nv * 3),
    facade: new Float32Array(nv * 4), info: new Uint8Array(nv * 4), index: new Uint32Array(ni),
  };
  let v = 0, i = 0;
  for (const b of list) {
    const n = b.position.length / 3;
    out.position.set(b.position, v * 3); out.normal.set(b.normal, v * 3); out.color.set(b.color, v * 3);
    out.facade.set(b.facade, v * 4); out.info.set(b.info, v * 4);
    for (let k = 0; k < b.index.length; k++) out.index[i + k] = b.index[k] + v;
    v += n; i += b.index.length;
  }
  return out;
}

/**
 * Merges many small models' tiers into cells: one mesh per cell and tier, keyed by the model's
 * centre, so the app draws and culls a cell at a time (M15, the churches).
 */
function mergeBuilt(id: string, built: Built[], cell: { main: number; detail: number; fine: number }): Built[] {
  const centre = (b: Built): [number, number] => {
    const p = b.main.position.length ? b.main.position : b.detail.position;
    let x = 0, z = 0; const n = p.length / 3;
    for (let k = 0; k < n; k++) { x += p[k * 3]; z += p[k * 3 + 2]; }
    return [x / n, z / n];
  };
  const groups = new Map<string, { main: MeshBuffers[]; detail: MeshBuffers[]; fine: MeshBuffers[] }>();
  const tiers = ['main', 'detail', 'fine'] as const;
  for (const b of built) {
    const [cx, cz] = centre(b);
    for (const t of tiers) {
      const m = t === 'fine' ? b.fine : b[t];
      if (!m || !m.index.length) continue;
      const size = cell[t], key = `${t}:${Math.floor(cx / size)}_${Math.floor(cz / size)}`;
      const g = groups.get(key) ?? groups.set(key, { main: [], detail: [], fine: [] }).get(key)!;
      g[t].push(m);
    }
  }
  const empty = (): MeshBuffers => ({ position: new Float32Array(0), normal: new Int8Array(0), color: new Uint8Array(0), facade: new Float32Array(0), info: new Uint8Array(0), index: new Uint32Array(0) });
  const out: Built[] = [];
  for (const [key, g] of groups) {
    out.push({ id: `${id}:${key}`, main: g.main.length ? concatMesh(g.main) : empty(), detail: g.detail.length ? concatMesh(g.detail) : empty(), fine: g.fine.length ? concatMesh(g.fine) : empty() });
  }
  // Lights, claims and the replaced keys travel with the first cell.
  out[0] = { ...out[0], lights: built.flatMap((b) => b.lights ?? []), claims: built.flatMap((b) => b.claims ?? []), replaces: built.flatMap((b) => b.replaces ?? []) };
  return out;
}

/** The tiers of a landmark's geometry in the pack (src/world/landmarks.ts). */
export const Tier = { Main: 0, Detail: 1, Fine: 2 } as const;

/** All the landmarks in one pack: shared arrays, and per landmark and tier its ranges and bounds. */
export function packLandmarks(built: Built[]): Uint8Array {
  const parts: { id: string; tier: number; b: MeshBuffers }[] = [];
  for (const b of built) {
    if (b.main.index.length) parts.push({ id: b.id, tier: Tier.Main, b: b.main });
    if (b.detail.index.length) parts.push({ id: b.id, tier: Tier.Detail, b: b.detail });
    if (b.fine?.index.length) parts.push({ id: b.id, tier: Tier.Fine, b: b.fine });
  }
  const nv = parts.reduce((a, p) => a + p.b.position.length / 3, 0);
  const ni = parts.reduce((a, p) => a + p.b.index.length, 0);
  const arrays = {
    position: new Float32Array(nv * 3), normal: new Int8Array(nv * 3), color: new Uint8Array(nv * 3),
    facade: new Float32Array(nv * 4), info: new Uint8Array(nv * 4), index: new Uint32Array(ni),
  };
  const items: { id: string; tier: number; v0: number; nv: number; i0: number; ni: number; sphere: number[] }[] = [];
  let v = 0, i = 0;
  for (const p of parts) {
    const n = p.b.position.length / 3;
    arrays.position.set(p.b.position, v * 3); arrays.normal.set(p.b.normal, v * 3); arrays.color.set(p.b.color, v * 3);
    arrays.facade.set(p.b.facade, v * 4); arrays.info.set(p.b.info, v * 4); arrays.index.set(p.b.index, i);
    // Bounding sphere: the box centre and the farthest vertex from it.
    let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (let k = 0; k < n; k++) {
      const x = p.b.position[k * 3], y = p.b.position[k * 3 + 1], z = p.b.position[k * 3 + 2];
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); z0 = Math.min(z0, z); x1 = Math.max(x1, x); y1 = Math.max(y1, y); z1 = Math.max(z1, z);
    }
    const c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
    let r = 0;
    for (let k = 0; k < n; k++) r = Math.max(r, Math.hypot(p.b.position[k * 3] - c[0], p.b.position[k * 3 + 1] - c[1], p.b.position[k * 3 + 2] - c[2]));
    items.push({ id: p.id, tier: p.tier, v0: v, nv: n, i0: i, ni: p.b.index.length, sphere: [...c.map((q) => Math.round(q * 100) / 100), Math.ceil(r)] });
    v += n; i += p.b.index.length;
  }
  const lights = built.flatMap((b) => b.lights ?? []).map((v) => Math.round(v * 100) / 100);
  return encodePack({ items, lights }, arrays as Record<string, Typed>);
}

/**
 * Raises the drone's clearance grid under every triangle to its highest corner (node by node
 * inside the triangle's box, plus the node nearest each corner).
 */
export function raiseSurface(built: Built[], set: (x: number, z: number, y: number) => void, forEachNode: (x0: number, z0: number, x1: number, z1: number, f: (x: number, z: number) => void) => void) {
  for (const b of built)
    for (const m of [b.main, b.detail]) {
      const p = m.position, idx = m.index;
      for (let t = 0; t < idx.length; t += 3) {
        const a = idx[t] * 3, c = idx[t + 1] * 3, d = idx[t + 2] * 3;
        const top = Math.max(p[a + 1], p[c + 1], p[d + 1]);
        forEachNode(Math.min(p[a], p[c], p[d]), Math.min(p[a + 2], p[c + 2], p[d + 2]), Math.max(p[a], p[c], p[d]), Math.max(p[a + 2], p[c + 2], p[d + 2]), (x, z) => set(x, z, top));
        set(p[a], p[a + 2], p[a + 1]); set(p[c], p[c + 2], p[c + 1]); set(p[d], p[d + 2], p[d + 1]);
      }
    }
}
