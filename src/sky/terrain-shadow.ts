// Hills shading the city: for every 10 m cell of the world, the height below which the terrain
// hides the sun, found by marching toward the sun through the height field on the GPU. Recomputed
// when the sun moves. Soft by construction: the lit materials widen the edge with the occluder's
// distance. Buildings are left to the shadow cascades.

import * as THREE from 'three';
import { FullScreen } from '../render/fullscreen.ts';
import type { HeightGrid } from '../world/heightgrid.ts';
import { U } from './uniforms.ts';

const FRAG = /* glsl */ `
uniform sampler2D tHeight;
uniform vec4 uRect;
uniform vec3 uSunDir;
varying vec2 vUv;
float height(vec2 p) {
  vec2 uv = (p - uRect.xy) / uRect.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return -1e4;
  return texture2D(tHeight, uv).r;
}
void main() {
  vec2 p = uRect.xy + vUv * uRect.zw;
  vec2 dir = normalize(uSunDir.xz + vec2(1e-6, 0.0));
  float tanE = uSunDir.y / max(length(uSunDir.xz), 1e-4);
  float best = -1e4, bestD = 0.0, s = 12.0;
  for (int i = 0; i < 72; i++) {
    float h = height(p + dir * s) - s * tanE;
    if (h > best) { best = h; bestD = s; }
    s = s * 1.065 + 6.0;
  }
  gl_FragColor = vec4(best, bestD, 0.0, 1.0);
}`;

export class TerrainShadow {
  private target: THREE.WebGLRenderTarget;
  private pass: FullScreen;
  private last = new THREE.Vector3();

  constructor(grid: HeightGrid) {
    // Every other node of the 5 m grid: 10 m cells.
    const nx = Math.floor((grid.nx - 1) / 2) + 1, nz = Math.floor((grid.nz - 1) / 2) + 1;
    const data = new Uint16Array(nx * nz);
    for (let j = 0; j < nz; j++)
      for (let i = 0; i < nx; i++) data[j * nx + i] = THREE.DataUtils.toHalfFloat(grid.at(i * 2, j * 2));
    const height = new THREE.DataTexture(data, nx, nz, THREE.RedFormat, THREE.HalfFloatType);
    height.minFilter = height.magFilter = THREE.LinearFilter;
    height.needsUpdate = true;
    const w = (nx - 1) * grid.cell * 2, d = (nz - 1) * grid.cell * 2;
    this.target = new THREE.WebGLRenderTarget(nx, nz, { type: THREE.HalfFloatType, depthBuffer: false });
    this.target.texture.minFilter = this.target.texture.magFilter = THREE.LinearFilter;
    this.target.texture.generateMipmaps = false;
    this.pass = new FullScreen(FRAG, {
      tHeight: { value: height },
      uRect: { value: new THREE.Vector4(grid.x0, grid.z0, w, d) },
      uSunDir: U.uSunDir,
    });
    U.uTerrainShadow.value = this.target.texture;
    U.uTerrainShadowRect.value.set(grid.x0, grid.z0, 1 / w, 1 / d);
  }

  update(renderer: THREE.WebGLRenderer, sunDir: THREE.Vector3) {
    if (sunDir.dot(this.last) > Math.cos(THREE.MathUtils.degToRad(0.05))) return;
    this.last.copy(sunDir);
    this.pass.render(renderer, this.target);
  }
}
