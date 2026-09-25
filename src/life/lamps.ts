// The lamps of the moving things after dusk (design.md §8.7, §8.8): headlights white, tail lights
// red, as glowing points like the street lamps' (src/world/lights.ts), in the scene and in the
// river's mirror, where the ripples draw them out. Refilled every frame from the trams, cars and boats in view.

import * as THREE from 'three';
import { U } from '../sky/uniforms.ts';
import { REFLECT } from '../render/reflection.ts';

const VERT = /* glsl */ `
attribute float aKind;
uniform float uCity;
uniform float uPx;
varying float vI;
varying vec3 vCol;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 1.0);
  float px = uPx * 0.9 / d;
  gl_PointSize = clamp(px, 3.0, 60.0);
  vI = uCity * min(1.0, pow(px / 3.0, 1.2) + 0.1) * exp(-d / 5000.0) * mix(0.5, 1.0, aKind);
  vCol = mix(vec3(1.0, 0.12, 0.08), vec3(1.0, 0.93, 0.8), aKind);
}`;

const FRAG = /* glsl */ `
varying float vI;
varying vec3 vCol;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(c, c);
  if (r2 > 1.0 || vI <= 0.0) discard;
  float core = exp(-r2 * 30.0), halo = exp(-r2 * 6.0);
  gl_FragColor = vec4(vCol * vI * (core * 8.0 + halo * 0.2), 1.0);
}`;

const MAX = 4096;

export class VehicleLamps {
  readonly points: THREE.Points;
  private pos = new Float32Array(MAX * 3);
  private kind = new Float32Array(MAX);
  private material: THREE.ShaderMaterial;

  constructor() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aKind', new THREE.BufferAttribute(this.kind, 1).setUsage(THREE.DynamicDrawUsage));
    g.setDrawRange(0, 0);
    this.material = new THREE.ShaderMaterial({
      uniforms: { uCity: U.uCityLights, uPx: { value: 1000 } },
      vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 10;
    this.points.layers.enable(REFLECT);
    this.points.onBeforeRender = (r, _s, cam) => {
      const t = r.getRenderTarget();
      const h = t ? t.height : r.getDrawingBufferSize(new THREE.Vector2()).y;
      this.material.uniforms.uPx.value = (cam as THREE.PerspectiveCamera).projectionMatrix.elements[5] * h * 0.5;
    };
  }

  /** Lists of x, y, z, kind (1 head, 0 tail). */
  set(lists: number[][]) {
    let n = 0;
    for (const l of lists)
      for (let k = 0; k + 3 < l.length && n < MAX; k += 4, n++) {
        this.pos[n * 3] = l[k]; this.pos[n * 3 + 1] = l[k + 1]; this.pos[n * 3 + 2] = l[k + 2];
        this.kind[n] = l[k + 3];
      }
    const g = this.points.geometry;
    g.setDrawRange(0, n);
    if (n) {
      (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (g.attributes.aKind as THREE.BufferAttribute).needsUpdate = true;
    }
    this.points.visible = n > 0 && U.uCityLights.value > 0.001;
  }
}
