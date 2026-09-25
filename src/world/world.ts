// Loads the prebuilt world (public/world/, made by tools/build-world.ts) and assembles the scene
// parts: terrain, horizon, water, and the streamed tiles of buildings, bridge decks and landmark boxes.

import * as THREE from 'three';
import { fetchPack } from '../core/pack.ts';
import { HeightGrid } from './heightgrid.ts';
import { Terrain, landuseTexture, horizonMesh } from './terrain.ts';
import { Buildings, type TileInfo } from './buildings.ts';
import type { Ground } from '../drone/drone.ts';

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
  readonly bounds: Manifest['world'];
  private height: HeightGrid;
  private surf: HeightGrid;

  private constructor(base: string, manifest: Manifest, height: HeightGrid, surf: HeightGrid, landuse: THREE.Texture, horizon: HeightGrid, water: THREE.BufferGeometry, renderer: THREE.WebGLRenderer) {
    this.manifest = manifest;
    this.bounds = manifest.world;
    this.height = height;
    this.surf = surf;
    landuse.anisotropy = renderer.capabilities.getMaxAnisotropy();
    this.terrain = new Terrain(height, landuse, manifest.world);
    this.group.add(this.terrain.group);
    this.group.add(horizonMesh(horizon, manifest.world));

    const waterMat = new THREE.MeshStandardMaterial({ color: '#50646f', roughness: 0.16, metalness: 0, envMapIntensity: 1.1 });
    const waterMesh = new THREE.Mesh(water, waterMat);
    waterMesh.receiveShadow = true;
    waterMesh.matrixAutoUpdate = false;
    this.group.add(waterMesh);

    this.buildings = new Buildings(base, manifest.kinds, manifest.tile, manifest.world);
    this.group.add(this.buildings.group);
  }

  static async load(base: string, renderer: THREE.WebGLRenderer): Promise<World> {
    const manifest: Manifest = await (await fetch(`${base}/manifest.json`)).json();
    const [terrain, surface, landuse, horizon, water] = await Promise.all([
      fetchPack(`${base}/terrain.bin`),
      fetchPack(`${base}/surface.bin`),
      fetchPack(`${base}/landuse.bin`),
      fetchPack(`${base}/horizon.bin`),
      fetchPack(`${base}/water.bin`),
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
      HeightGrid.fromPack(horizon), waterGeom, renderer,
    );
  }

  ground(x: number, z: number): number {
    return this.height.contains(x, z) ? this.height.sample(x, z) : 0;
  }

  surface(x: number, z: number, r: number): number {
    return this.surf.contains(x, z) ? this.surf.maxAround(x, z, r) : this.ground(x, z);
  }
}
