// Loads the prebuilt world (public/world/, made by tools/build-world.ts) and assembles the scene
// parts: terrain, horizon, water, the streamed tiles of buildings and bridge decks, the streets'
// furniture and the hand-built landmarks.

import * as THREE from 'three';
import { fetchPack } from '../core/pack.ts';
import { HeightGrid } from './heightgrid.ts';
import { Terrain, landuseTexture, horizonMesh } from './terrain.ts';
import { Buildings, type TileInfo } from './buildings.ts';
import type { Ground } from '../drone/drone.ts';
import { patchLit } from '../sky/lit.ts';
import { Streets } from './streets.ts';
import { Landmarks } from './landmarks.ts';
import type { Pack } from '../core/pack.ts';

export interface Manifest {
  datum: number;
  world: { xMin: number; xMax: number; zMin: number; zMax: number };
  tile: number;
  tiles: TileInfo[];
  kinds: { building: number; part: number; bridge: number; box: number };
  attribution: string;
}

export class World implements Ground {
  readonly group = new THREE.Group();
  readonly manifest: Manifest;
  readonly terrain: Terrain;
  readonly buildings: Buildings;
  readonly streets: Streets;
  readonly landmarks: Landmarks;
  readonly bounds: Manifest['world'];
  readonly height: HeightGrid;
  private surf: HeightGrid;

  private constructor(base: string, manifest: Manifest, height: HeightGrid, surf: HeightGrid, landuse: THREE.Texture, horizon: HeightGrid, water: THREE.BufferGeometry, streets: Pack, landmarks: Pack, renderer: THREE.WebGLRenderer) {
    this.manifest = manifest;
    this.bounds = manifest.world;
    this.height = height;
    this.surf = surf;
    landuse.anisotropy = renderer.capabilities.getMaxAnisotropy();
    this.terrain = new Terrain(height, landuse, manifest.world);
    this.group.add(this.terrain.group);
    const horizonRing = horizonMesh(horizon, manifest.world);
    this.group.add(horizonRing);

    // Until the river's own shader (M4): dark, and reflecting the sky less than a mirror would, as
    // rippled water does.
    const waterMat = new THREE.MeshStandardMaterial({ color: '#2d3c43', roughness: 0.3, metalness: 0, envMapIntensity: 0.32 });
    const waterMesh = new THREE.Mesh(water, waterMat);
    waterMesh.receiveShadow = true;
    waterMesh.matrixAutoUpdate = false;
    this.group.add(waterMesh);

    this.buildings = new Buildings(base, manifest.tile, manifest.world);
    this.group.add(this.buildings.group);
    this.streets = new Streets(streets);
    this.group.add(this.streets.group);
    this.landmarks = new Landmarks(landmarks, this.buildings.material);
    this.group.add(this.landmarks.group);
    // Every lit material takes the sky's haze and the terrain and cloud shadows.
    for (const m of [horizonRing.material as THREE.Material, waterMat]) patchLit(m);
  }

  static async load(base: string, renderer: THREE.WebGLRenderer): Promise<World> {
    const manifest: Manifest = await (await fetch(`${base}/manifest.json`)).json();
    const [terrain, surface, landuse, horizon, water, streets, landmarks] = await Promise.all([
      fetchPack(`${base}/terrain.bin`),
      fetchPack(`${base}/surface.bin`),
      fetchPack(`${base}/landuse.bin`),
      fetchPack(`${base}/horizon.bin`),
      fetchPack(`${base}/water.bin`),
      fetchPack(`${base}/streets.bin`),
      fetchPack(`${base}/landmarks.bin`),
    ]);
    const lu = landuse.meta as { nx: number; nz: number };
    const waterGeom = new THREE.BufferGeometry();
    waterGeom.setAttribute('position', new THREE.BufferAttribute(water.arrays.position as Float32Array, 3));
    waterGeom.setIndex(new THREE.BufferAttribute(water.arrays.index as Uint32Array, 1));
    waterGeom.computeVertexNormals();
    waterGeom.computeBoundingSphere();
    return new World(
      base, manifest,
      HeightGrid.fromPack(terrain), HeightGrid.fromPack(surface),
      landuseTexture(landuse.arrays.ground as Uint8Array, lu.nx, lu.nz),
      HeightGrid.fromPack(horizon), waterGeom, streets, landmarks, renderer,
    );
  }

  ground(x: number, z: number): number {
    return this.height.contains(x, z) ? this.height.sample(x, z) : 0;
  }

  surface(x: number, z: number, r: number): number {
    return this.surf.contains(x, z) ? this.surf.maxAround(x, z, r) : this.ground(x, z);
  }
}
