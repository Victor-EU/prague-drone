// The river (design.md §8.5): three's standard material with the sky patch, and in place of its
// environment reflection the river's own: the city from the mirror pass (src/render/reflection.ts),
// and where the mirror shows nothing, the sky and its cumulus along the reflected ray. Ripples come
// from one tiling slope texture at two scales, carried downstream along the flow the world build
// stores per vertex (two phases blended, so the pattern never stretches). The mirror is sampled
// through the ripples and smeared up and down the screen, as rippled water stretches reflections
// into columns, which is what makes the lights at night fall as broken streaks. At the weirs the
// water turns to foam: streaked, moving fast, rough.

import * as THREE from 'three';
import type { Pack } from '../core/pack.ts';
import { patchLit } from '../sky/lit.ts';
import { U } from '../sky/uniforms.ts';
import { PlanarReflection, REFLECT } from '../render/reflection.ts';

const TILE = 1000;

const PARS = /* glsl */ `
uniform sampler2D tRipple;
uniform sampler2D tReflect;
uniform mat4 uReflectMatrix;
uniform float uReflectOn;
uniform vec2 uReflectTexel;
uniform float uReflectScale;
uniform float uRipple;
uniform float uTime;
varying vec2 vFlow;
varying float vFoam;
vec3 praRipN;
float praFoamK;

// Slopes (d height / d x, d z) of the tiling ripple texture, carried along the flow in two phases.
vec2 praSlope(vec2 p, vec2 flow, float scale, float speed, float period) {
  float t = uTime / period;
  float a = fract(t), b = fract(t + 0.5);
  vec2 off = flow * speed * period / scale;
  vec2 sa = texture2D(tRipple, p / scale - off * a).rg * 2.0 - 1.0;
  vec2 sb = texture2D(tRipple, p / scale - off * b + 0.5).rg * 2.0 - 1.0;
  float wa = 1.0 - abs(2.0 * a - 1.0);
  return (sa * wa + sb * (1.0 - wa)) / scale;
}
`;

const MAIN = /* glsl */ `
{
  vec2 p = vPraWorld.xz;
  vec2 f = length(vFlow) > 0.01 ? normalize(vFlow) : vec2(0.0, -1.0);
  // Current ripples at two scales, and the wind's small chop across them.
  vec2 s = praSlope(p, f, 9.0, 0.55, 3.1) * 0.55 + praSlope(p, f, 2.4, 0.55, 1.7) * 0.8;
  s += praSlope(p.yx * vec2(1.0, -1.0), vec2(0.7, 0.7), 1.1, 0.3, 1.3) * 0.4;
  // Over the weirs: quick streaks down the glacis.
  float foam = vFoam;
  if (foam > 0.0) {
    vec2 q = vec2(dot(p, vec2(-f.y, f.x)) * 0.9, dot(p, f) * 0.22 - uTime * 0.9);
    float n = texture2D(tRipple, q / 3.0).b * 0.6 + texture2D(tRipple, q / 1.1 + 0.3).b * 0.4;
    // Streaks: foam where the noise rises over what the band's strength leaves uncovered; never all
    // of it, so from the air the band keeps its streaks and does not read as a painted strip.
    praFoamK = smoothstep(1.2 - foam * 0.9, 1.42 - foam * 0.9, n) * smoothstep(0.05, 0.3, foam);
    s += praSlope(p, f, 1.3, 2.2, 0.7) * foam * 1.4;
  } else praFoamK = 0.0;
  praRipN = normalize(vec3(-s.x, 1.0, -s.y));
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.55, 0.57, 0.56), praFoamK);
}
`;

// The water's reflection: the city from the mirror, over the sky and the cumulus.
const REFLECT_FN = /* glsl */ `
vec3 praWaterReflect(vec3 wp, vec3 N) {
  vec3 V = normalize(wp - cameraPosition);
  vec3 R = reflect(V, N);
  R.y = max(R.y, 0.015);
  R = normalize(R);
  // Ripples too small to see tilt the facets up and down: the water shows the sky over a band of
  // heights above the reflected ray, deeper blue than the horizon's alone.
  vec3 R1 = normalize(vec3(R.x, R.y + 0.08, R.z)), R2 = normalize(vec3(R.x, R.y + 0.2, R.z));
  vec3 sky = aSky(R) * 0.45 + aSky(R1) * 0.33 + aSky(R2) * 0.22;
  // Cumulus along the reflected ray, from the coverage map at the layer's middle.
  if (uCloud.x < 1.0) {
    vec3 c = wp + R * ((uCloud.z - wp.y) / R.y);
    float w = texture2D(uWeather, (c.xz - uWind) / 24000.0).r;
    float a = 0.85 * smoothstep(uCloud.x, uCloud.x + uCloud.w * 2.0, w) * smoothstep(0.02, 0.12, R.y);
    // Lit cumulus: a little brighter than the horizon sky under them.
    sky = mix(sky, texture2D(uSkyStats, vec2(0.625, 0.5)).rgb * 1.9, a);
  }
  sky = mix(sky, uOvercastSky * 0.9, uOvercast * smoothstep(0.0, 0.06, R.y));
  if (uReflectOn < 0.5) return sky;
  // The mirror, displaced by the ripples and drawn out into columns: ripples too small to see
  // still tilt the surface, by uRipple radians or so, and spread each reflection up and down the
  // screen by twice that. Taps jittered per pixel and frame; TAA smooths them.
  vec4 c = uReflectMatrix * vec4(wp, 1.0);
  vec2 uv = c.xy / c.w;
  float d = length(wp - cameraPosition);
  // A surface tilted by δ toward the eye turns the reflected ray up by 2δ: up the screen by
  // 2δ times the texture units per radian. Sideways tilts move it much less.
  vec2 hv = normalize(V.xz + vec2(1e-5, 0.0));
  float tiltV = dot(N.xz, -hv), tiltH = dot(N.xz, vec2(-hv.y, hv.x));
  // Seen at a grazing angle, the facets turned toward the eye show most, and they reflect higher:
  // the lookup leans toward the sky, keeping the far bank's reflection close under it.
  vec2 dist = vec2(tiltH * 0.3, tiltV * 1.1 - 2.5 * uRipple) * uReflectScale;
  // At night the lamps' reflections run down the water in long broken columns (9542).
  float spread = 2.0 * mix(uRipple, 0.03, uCityLights) * uReflectScale;
  float j = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))) + fract(uTime * 7.31));
  vec4 acc = vec4(0.0);
  float wsum = 0.0;
  for (int i = 0; i < 8; i++) {
    float k = (float(i) + j) / 8.0 * 2.0 - 1.0;
    float wt = exp(-2.5 * k * k);
    vec2 o = uv + dist + vec2(0.0, k * spread);
    acc += texture2D(tReflect, clamp(o, 0.001, 0.999)) * wt;
    wsum += wt;
  }
  vec4 m = acc / wsum;
  // Some of the facets of rippled water tilt up to the sky whatever lies across the river.
  return mix(sky, m.rgb / max(m.a, 1e-3), clamp(m.a, 0.0, 1.0) * 0.7);
}
`;

/** A tiling map of ripple slopes (rg), heights (b) and a second noise (a), from random waves whose wave numbers repeat on the tile. */
function rippleTexture(): THREE.DataTexture {
  const N = 256;
  let seed = 1234567;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const waves: { kx: number; ky: number; a: number; ph: number }[] = [];
  while (waves.length < 96) {
    const kx = Math.round((rnd() * 2 - 1) * 40), ky = Math.round((rnd() * 2 - 1) * 40), k = Math.hypot(kx, ky);
    if (k < 3 || k > 42) continue;
    waves.push({ kx, ky, a: Math.pow(k, -1.25), ph: rnd() * Math.PI * 2 });
  }
  const sx = new Float32Array(N * N), sy = new Float32Array(N * N), h = new Float32Array(N * N);
  let smax = 0, hmin = Infinity, hmax = -Infinity;
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const u = i / N, v = j / N;
      let a = 0, b = 0, c = 0;
      for (const w of waves) {
        const ph = 2 * Math.PI * (w.kx * u + w.ky * v) + w.ph;
        const cs = Math.cos(ph);
        a += w.a * 2 * Math.PI * w.kx * cs;
        b += w.a * 2 * Math.PI * w.ky * cs;
        c += w.a * Math.sin(ph);
      }
      const k = j * N + i;
      sx[k] = a; sy[k] = b; h[k] = c;
      smax = Math.max(smax, Math.abs(a), Math.abs(b));
      hmin = Math.min(hmin, c); hmax = Math.max(hmax, c);
    }
  const data = new Uint8Array(N * N * 4);
  for (let k = 0; k < N * N; k++) {
    // Slopes in height units per tile width, scaled so the texture holds them; the shader's scale
    // and strength give them metres.
    data[k * 4] = Math.round((sx[k] / smax * 0.5 + 0.5) * 255);
    data[k * 4 + 1] = Math.round((sy[k] / smax * 0.5 + 0.5) * 255);
    data[k * 4 + 2] = Math.round(((h[k] - hmin) / (hmax - hmin)) * 255);
    data[k * 4 + 3] = data[((k * 7 + 131) % (N * N)) * 4 + 2];
  }
  const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

export class Water {
  readonly group = new THREE.Group();
  readonly material: THREE.MeshStandardMaterial;
  readonly mirror = new PlanarReflection(0.4);
  /** The mirror pass on (development: off to measure it). */
  mirrorOn = true;
  private tiles: THREE.Mesh[] = [];
  private levels = new Map<number, number>();
  private cell: number;
  private frustum = new THREE.Frustum();
  private frame = 0;
  private lastPos = new THREE.Vector3(1e9, 0, 0);
  private lastRot = new THREE.Quaternion();
  private m = new THREE.Matrix4();

  constructor(pack: Pack<{ cell: number }>, anisotropy = 1) {
    const pos = pack.arrays.position as Float32Array, idx = pack.arrays.index as Uint32Array;
    this.cell = pack.meta.cell;
    const geomAttrs = {
      position: new THREE.BufferAttribute(pos, 3),
      aFlow: new THREE.BufferAttribute(pack.arrays.flow as Int8Array, 2, true),
      aFoam: new THREE.BufferAttribute(pack.arrays.foam as Uint8Array, 1, true),
      normal: new THREE.BufferAttribute(new Int8Array(pos.length).map((_, i) => (i % 3 === 1 ? 127 : 0)), 3, true),
    };
    // Levels by grid cell, for the mirror's plane.
    for (let v = 0; v < pos.length; v += 3) this.levels.set(this.key(pos[v], pos[v + 2]), pos[v + 1]);

    const m = (this.material = new THREE.MeshStandardMaterial({ color: '#1f2a26', roughness: 0.1, metalness: 0 }));
    // Filtered along the view: at a grazing angle the ripples stay as lines across the river.
    const ripple = rippleTexture();
    ripple.anisotropy = anisotropy;
    const u = {
      tRipple: { value: ripple },
      tReflect: { value: this.mirror.target.texture },
      uReflectMatrix: { value: this.mirror.matrix },
      uReflectOn: { value: 0 },
      uReflectTexel: { value: new THREE.Vector2(1, 1) },
      uReflectScale: { value: 1 },
      uRipple: { value: 0.012 },
    };
    this.uniforms = u;
    patchLit(m, (shader) => {
      Object.assign(shader.uniforms, u);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec2 aFlow;\nattribute float aFoam;\nvarying vec2 vFlow;\nvarying float vFoam;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFlow = aFlow;\nvFoam = aFoam;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <clipping_planes_pars_fragment>', `#include <clipping_planes_pars_fragment>\n${PARS}\n${REFLECT_FN}`)
        .replace('#include <color_fragment>', `#include <color_fragment>\n${MAIN}`)
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.85, praFoamK);')
        .replace('#include <normal_fragment_maps>', 'normal = normalize((viewMatrix * vec4(praRipN, 0.0)).xyz);')
        .replace('#include <lights_fragment_maps>', '#include <lights_fragment_maps>\n// Seen almost edge on, ripples reflect less than a flat surface would.\nradiance = praWaterReflect(vPraWorld, praRipN) * (1.0 - praFoamK) * 0.74;');
    }, '-water');

    // Triangles sorted into kilometre tiles, each its own mesh for culling, sharing the vertex arrays.
    const byTile = new Map<string, number[]>();
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t] * 3;
      const key = `${Math.floor(pos[a] / TILE)},${Math.floor(pos[a + 2] / TILE)}`;
      const list = byTile.get(key) ?? byTile.set(key, []).get(key)!;
      list.push(idx[t], idx[t + 1], idx[t + 2]);
    }
    for (const list of byTile.values()) {
      const g = new THREE.BufferGeometry();
      for (const [name, attr] of Object.entries(geomAttrs)) g.setAttribute(name, attr);
      g.setIndex(new THREE.BufferAttribute(new Uint32Array(list), 1));
      const box = new THREE.Box3(), v = new THREE.Vector3();
      for (const i of list) box.expandByPoint(v.fromArray(pos, i * 3));
      g.boundingBox = box;
      g.boundingSphere = box.getBoundingSphere(new THREE.Sphere());
      const mesh = new THREE.Mesh(g, m);
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      this.group.add(mesh);
      this.tiles.push(mesh);
    }
  }

  private uniforms: { uReflectOn: { value: number }; uReflectTexel: { value: THREE.Vector2 }; uReflectScale: { value: number }; uRipple: { value: number } } & Record<string, THREE.IUniform>;

  private key(x: number, z: number) { return Math.round(x / this.cell) * 100000 + Math.round(z / this.cell); }

  /** The water surface nearest (x, z) on the 10 m grid, or NaN. */
  levelAt(x: number, z: number): number {
    for (let r = 0; r <= 3; r++)
      for (let i = -r; i <= r; i++)
        for (let j = -r; j <= r; j++) {
          const y = this.levels.get(this.key(x + i * this.cell, z + j * this.cell));
          if (y !== undefined) return y;
        }
    return NaN;
  }

  setSize(w: number, h: number) {
    this.mirror.setSize(w, h);
    this.uniforms.uReflectTexel.value.set(1 / this.mirror.target.width, 1 / this.mirror.target.height);
  }

  /** Renders the mirror for this frame's camera if any water is in view. */
  renderMirror(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.frustum.setFromProjectionMatrix(this.m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse), camera.coordinateSystem, camera.reversedDepth);
    const seen = this.mirrorOn && this.tiles.some((t) => this.frustum.intersectsSphere(t.geometry.boundingSphere!));
    // The plane: the water level where the view meets the river, or under the camera.
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const ahead = Math.max(60, Math.min(600, camera.position.y * 4));
    let y = this.levelAt(camera.position.x + fwd.x * ahead, camera.position.z + fwd.z * ahead);
    if (Number.isNaN(y)) y = this.levelAt(camera.position.x, camera.position.z);
    if (Number.isNaN(y)) y = 0;
    // Every other frame is enough: the water projects through the matrix the mirror was drawn
    // with, so an older mirror still lines up; after a jump or a quick turn it is drawn at once.
    const moved = camera.position.distanceTo(this.lastPos) > 25 || camera.quaternion.angleTo(this.lastRot) > 0.06;
    this.frame++;
    if (seen && (moved || this.frame % 2 === 0 || Number.isNaN(this.mirror.planeY))) {
      this.mirror.render(renderer, scene, camera, y);
      this.lastPos.copy(camera.position);
      this.lastRot.copy(camera.quaternion);
    }
    // Texture units per radian up the screen, for the ripples' smear.
    this.uniforms.uReflectScale.value = 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    this.uniforms.uReflectOn.value = seen && !Number.isNaN(this.mirror.planeY) ? 1 : 0;
  }
}

/** Puts an object (and its children) on the mirror's layer as well as the main one. */
export function reflects(o: THREE.Object3D) {
  o.traverse((c) => c.layers.enable(REFLECT));
}
