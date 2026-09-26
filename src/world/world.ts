// Loads the prebuilt world (public/world/, made by tools/build-world.ts) and assembles the scene
// parts: terrain, horizon and water for the first frame; then, streamed in (design.md §10.2), the
// tiles of buildings and bridge decks, the streets' furniture and lamps, the hand-built landmarks,
// the trees and the city's life.

import * as THREE from 'three';
import { fetchPack } from '../core/pack.ts';
import { HeightGrid } from './heightgrid.ts';
import { Terrain, landuseTexture, horizonMesh } from './terrain.ts';
import { Buildings, type TileInfo } from './buildings.ts';
import type { Ground } from '../drone/drone.ts';
import { patchLit } from '../sky/lit.ts';
import { Streets } from './streets.ts';
import { Landmarks } from './landmarks.ts';
import { Water, reflects } from './water.ts';
import { CityLights } from './lights.ts';
import { Trees } from './trees.ts';
import { Life } from '../life/life.ts';
import type { Pack } from '../core/pack.ts';
import type { LifeMeta } from '../core/life.ts';

export interface Manifest {
  datum: number;
  world: { xMin: number; xMax: number; zMin: number; zMax: number };
  tile: number;
  tiles: TileInfo[];
  kinds: { building: number; part: number; bridge: number; box: number };
  trees?: { file: string } | null;
  life?: { file: string } | null;
  attribution: string;
}

interface Rest { streets: Promise<Pack>; landmarks: Promise<Pack>; trees: Promise<Pack | null>; life: Promise<Pack<LifeMeta> | null> }

export class World implements Ground {
  readonly group = new THREE.Group();
  readonly manifest: Manifest;
  readonly terrain: Terrain;
  readonly buildings: Buildings;
  readonly water: Water;
  // Streamed in after the first frame (design.md §10.2), in this order: the streets and the lamps,
  // the landmarks, the trees, the city's life.
  streets: Streets | null = null;
  landmarks: Landmarks | null = null;
  lights: CityLights | null = null;
  trees: Trees | null = null;
  /** The city's life (src/life/). */
  life: Life | null = null;
  private rest: Rest;
  private streamDone = false;
  readonly bounds: Manifest['world'];
  readonly height: HeightGrid;
  private surf: HeightGrid;

  private constructor(base: string, manifest: Manifest, height: HeightGrid, surf: HeightGrid, landuse: THREE.Texture, horizon: HeightGrid, water: Pack, renderer: THREE.WebGLRenderer, rest: Rest) {
    this.manifest = manifest;
    this.bounds = manifest.world;
    this.height = height;
    this.surf = surf;
    landuse.anisotropy = renderer.capabilities.getMaxAnisotropy();
    this.terrain = new Terrain(height, landuse, manifest.world);
    this.group.add(this.terrain.group);
    const horizonRing = horizonMesh(horizon, manifest.world);
    this.group.add(horizonRing);

    // The river (src/world/water.ts), with its mirror of the terrain, the city and the landmarks.
    this.water = new Water(water as Pack<{ cell: number }>, renderer.capabilities.getMaxAnisotropy());
    this.group.add(this.water.group);

    this.buildings = new Buildings(base, manifest.tile, manifest.world);
    this.group.add(this.buildings.group);
    reflects(this.terrain.group);
    reflects(horizonRing);
    // Every lit material takes the sky's haze and the terrain and cloud shadows.
    patchLit(horizonRing.material as THREE.Material);
    this.rest = rest;
  }

  /** True once the streamed parts and every building tile are in. */
  get complete() {
    return this.streamDone && this.buildings.loaded >= this.buildings.total;
  }

  /**
   * Streams in the parts that come after the first frame, each added as soon as its data is in and
   * `prepare` (main.ts compiles its shaders, in parallel where the driver can) has run. Resolves when
   * all are in the scene; the building tiles stream on their own.
   */
  async stream(renderer: THREE.WebGLRenderer, prepare: (o: THREE.Object3D) => Promise<void>) {
    const rest = this.rest;
    const add = async (o: THREE.Object3D) => {
      await prepare(o);
      this.group.add(o);
    };
    const [streets, landmarks] = await Promise.all([rest.streets, rest.landmarks]);
    this.streets = new Streets(streets);
    this.landmarks = new Landmarks(landmarks, this.buildings.material);
    reflects(this.landmarks.group);
    // The lanterns on the walls light the street as the posts do.
    const posts = streets.arrays.lamp as Float32Array, onWalls = (streets.arrays.wallLamp as Float32Array | undefined) ?? new Float32Array(0);
    const lamps = new Float32Array(posts.length + (onWalls.length / 4) * 3);
    lamps.set(posts);
    for (let i = 0, o = posts.length; i < onWalls.length; i += 4, o += 3) lamps.set(onWalls.subarray(i, i + 3), o);
    this.lights = new CityLights(renderer, lamps, ((landmarks.meta as { lights?: number[] }).lights ?? []));
    await Promise.all([add(this.streets.group), add(this.landmarks.group), add(this.lights.points)]);
    const trees = await rest.trees;
    // The trees of the canopy model (src/world/trees.ts).
    if (trees) {
      const t = new Trees(trees as Pack<{ nx: number; nz: number; tile: number; x0: number; z0: number }>, this.height);
      await add(t.group);
      this.trees = t;
    }
    const life = await rest.life;
    if (life) {
      const l = new Life(life);
      await add(l.group);
      this.life = l;
    }
    this.streamDone = true;
  }

  static async load(base: string, renderer: THREE.WebGLRenderer): Promise<World> {
    const manifest: Manifest = await (await fetch(`${base}/manifest.json`)).json();
    // The first frame's data first, on the whole connection; the rest once it is in.
    const first = Promise.all([
      fetchPack(`${base}/terrain.bin`),
      fetchPack(`${base}/surface.bin`),
      fetchPack(`${base}/landuse.bin`),
      fetchPack(`${base}/horizon.bin`),
      fetchPack(`${base}/water.bin`),
    ]);
    const after = <T>(f: () => Promise<T>) => first.then(f);
    const rest: Rest = {
      streets: after(() => fetchPack(`${base}/streets.bin`)),
      landmarks: after(() => fetchPack(`${base}/landmarks.bin`)),
      trees: after(() => (manifest.trees ? fetchPack(`${base}/trees.bin`) : Promise.resolve(null))),
      life: after(() => (manifest.life ? fetchPack<LifeMeta>(`${base}/life.bin`) : Promise.resolve(null))),
    };
    const [terrain, surface, landuse, horizon, water] = await first;
    const lu = landuse.meta as { nx: number; nz: number };
    return new World(
      base, manifest,
      HeightGrid.fromPack(terrain), HeightGrid.fromPack(surface),
      landuseTexture(landuse.arrays.ground as Uint8Array, lu.nx, lu.nz),
      HeightGrid.fromPack(horizon), water, renderer, rest,
    );
  }

  ground(x: number, z: number): number {
    return this.height.contains(x, z) ? this.height.sample(x, z) : 0;
  }

  surface(x: number, z: number, r: number): number {
    return this.surf.contains(x, z) ? this.surf.maxAround(x, z, r) : this.ground(x, z);
  }
}
