// Cumulus (design.md §8.6): a layer 1200 to 1800 m above the river, raymarched at half resolution
// through a 2D coverage map and two tiling 3D noises (Schneider 2015, "The Real-Time Volumetric
// Cloudscapes of Horizon Zero Dawn"), lit by the sun through the scattering tables and by the sky.
// The same coverage map, projected along the sun, shades the city, so the shadows move with the
// clouds. Also the cirrus texture, and the per-session roll: seed, coverage, base, wind, cirrus.

import * as THREE from 'three';
import { FullScreen } from '../render/fullscreen.ts';
import { ATMOSPHERE, SKY_LOOKUP } from './glsl.ts';
import { U } from './uniforms.ts';
import { rng, lattice, makeWeather, WEATHER } from './weather.ts';

const NOISE_FRAG = /* glsl */ `
uniform float uLayer;
uniform float uSize;
uniform float uDetail;
uniform float uSeed;
varying vec2 vUv;
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
float grad(vec3 i, vec3 f, vec3 o, float period) {
  return dot(hash33(mod(i + o, period) + uSeed) * 2.0 - 1.0, f - o);
}
float perlin(vec3 x, float period) {
  vec3 i = floor(x), f = fract(x);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(mix(grad(i, f, vec3(0, 0, 0), period), grad(i, f, vec3(1, 0, 0), period), u.x),
        mix(grad(i, f, vec3(0, 1, 0), period), grad(i, f, vec3(1, 1, 0), period), u.x), u.y),
    mix(mix(grad(i, f, vec3(0, 0, 1), period), grad(i, f, vec3(1, 0, 1), period), u.x),
        mix(grad(i, f, vec3(0, 1, 1), period), grad(i, f, vec3(1, 1, 1), period), u.x), u.y), u.z);
}
float worley(vec3 x, float period) {
  vec3 i = floor(x), f = fract(x);
  float d = 1e9;
  for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int k = -1; k <= 1; k++) {
    vec3 o = vec3(float(k), float(y), float(z));
    vec3 r = o + hash33(mod(i + o, period) + uSeed * 1.7) - f;
    d = min(d, dot(r, r));
  }
  return 1.0 - clamp(sqrt(d), 0.0, 1.0);
}
float worleyFbm(vec3 p, float f) {
  return worley(p * f, f) * 0.625 + worley(p * f * 2.0, f * 2.0) * 0.25 + worley(p * f * 4.0, f * 4.0) * 0.125;
}
void main() {
  vec3 p = vec3(vUv, (uLayer + 0.5) / uSize);
  // Top octaves stay at four or more texels per cell: finer noise aliases into stripes.
  if (uDetail > 0.5) {
    gl_FragColor = vec4(worleyFbm(p, 1.0), worleyFbm(p, 2.0), worleyFbm(p, 4.0), 1.0);
    return;
  }
  float n = 0.0, a = 1.0, s = 0.0, f = 4.0;
  for (int k = 0; k < 5; k++) { n += a * perlin(p * f, f); s += a; a *= 0.5; f *= 2.0; }
  float pn = clamp(n / s * 1.4 + 0.5, 0.0, 1.0);
  float w = worleyFbm(p, 4.0);
  float pw = clamp(w + pn * (1.0 - w), 0.0, 1.0);  // Perlin-Worley: remap(perlin, 0, 1, worley, 1)
  gl_FragColor = vec4(pw, worleyFbm(p, 2.0), worleyFbm(p, 4.0), worleyFbm(p, 8.0));
}`;

const MARCH_FRAG = /* glsl */ `
${ATMOSPHERE}
${SKY_LOOKUP}
uniform sampler2D uSkyStats;
uniform highp sampler3D tShape;
uniform highp sampler3D tDetail;
uniform sampler2D uWeather;
uniform vec4 uCloud;
uniform vec2 uWind;
uniform vec4 uHaze;
uniform vec4 uLayer;       // base, top, extinction per metre at density 1, detail erosion
uniform vec3 uNoiseOffset;
uniform mat4 uInvViewProj;
uniform vec3 uCamPos;
uniform vec3 uSunColour;
uniform float uFrame;
varying vec2 vUv;

float remap(float v, float lo, float hi, float a, float b) { return a + (v - lo) * (b - a) / (hi - lo); }

float density(vec3 p, bool detail, out float hRel) {
  // Explicit level: inside the march, neighbouring pixels sample far-apart points and implicit
  // derivatives would pick a blurred level on alternate rows.
  vec2 w = textureLod(uWeather, (p.xz - uWind) / 24000.0, 0.0).rg;
  // Local coverage stays below 1 so the noise always carves the cell: cumulus, not cylinders.
  float cov = 0.82 * smoothstep(uCloud.x, uCloud.x + uCloud.w, w.r);
  hRel = 0.0;
  if (cov <= 0.0) return 0.0;
  float top = uLayer.x + (uLayer.y - uLayer.x) * mix(0.35, 1.0, w.g);
  float h = (p.y - uLayer.x) / (top - uLayer.x);
  hRel = h;
  if (h <= 0.0 || h >= 1.0) return 0.0;
  // Flat base, widest a quarter of the way up, rounding toward the top.
  float grad = smoothstep(0.0, 0.14, h) * (1.0 - smoothstep(0.3, 1.0, h));
  vec3 q = p;
  q.xz -= uWind;
  q += uNoiseOffset;
  vec4 n = texture(tShape, q / 1300.0);
  float fbm = n.g * 0.625 + n.b * 0.25 + n.a * 0.125;
  float base = remap(n.r, fbm - 1.0, 1.0, 0.0, 1.0);
  base = remap(base * grad, 1.0 - cov, 1.0, 0.0, 1.0) * cov;
  if (base <= 0.0) return 0.0;
  if (detail) {
    vec3 d = texture(tDetail, q / 320.0).rgb;
    float dfbm = d.r * 0.625 + d.g * 0.25 + d.b * 0.125;
    float m = mix(dfbm, 1.0 - dfbm, clamp(h * 4.0, 0.0, 1.0));
    base = remap(base, m * uLayer.w, 1.0, 0.0, 1.0);
  }
  // A soft knee at the low end: thin fringes vanish, so edges read crisp like cauliflower.
  base *= smoothstep(0.0, 0.2, base);
  return clamp(base * 1.8, 0.0, 1.0);
}

float lightDepth(vec3 p) {
  float od = 0.0, s = 30.0, h;
  vec3 q = p;
  for (int i = 0; i < 6; i++) {
    q += uSunDir * s;
    od += density(q, false, h) * s;
    s *= 1.8;
  }
  return od * uLayer.z;
}

float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / (4.0 * A_PI * pow(max(1e-4, 1.0 + g2 - 2.0 * g * c), 1.5));
}

void main() {
  vec4 wp = uInvViewProj * vec4(vUv * 2.0 - 1.0, 0.5, 1.0);
  vec3 dir = normalize(wp.xyz / wp.w - uCamPos);
  if (dir.y < 0.004) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  float t0 = (uLayer.x - uCamPos.y) / dir.y;
  if (t0 > 32000.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  // Long grazing paths are cut short: sparse steps there turn clouds into noise.
  float t1 = min((uLayer.y - uCamPos.y) / dir.y, t0 + 9000.0);
  float path = t1 - t0;
  float n = clamp(path / 40.0, 32.0, 96.0);
  float dt = path / n;
  float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))) + uFrame * 0.61803399);
  float cosT = dot(dir, uSunDir);
  vec3 hemi = texture2D(uSkyStats, vec2(0.375, 0.5)).rgb;
  vec3 ground = texture2D(uSkyStats, vec2(0.875, 0.5)).rgb;
  vec3 L = vec3(0.0);
  float T = 1.0, dSum = 0.0, wSum = 0.0;
  float t = t0 + dt * jitter;
  for (int i = 0; i < 96; i++) {
    if (float(i) >= n || T < 0.02) break;
    vec3 p = uCamPos + dir * t;
    float h;
    // Far away the erosion detail is below a pixel; leave it out.
    float dens = density(p, t < 12000.0, h);
    if (dens > 0.003) {
      float ext = dens * uLayer.z;
      float od = lightDepth(p);
      // Single scattering with a forward and a back lobe, plus the light that diffuses through
      // the cloud after many bounces: nearly isotropic and slow to fade. Without that second term
      // a cumulus renders grey; with it, sunlit tops are white and bases a soft grey.
      float single = mix(hg(cosT, 0.8), hg(cosT, -0.25), 0.3) * exp(-od);
      float diffuse = 0.24 * exp(-od * 0.1);
      vec3 sun = uSunColour * (single + diffuse);
      vec3 amb = mix(ground * 1.1, hemi * 1.25, clamp(h * 1.3, 0.0, 1.0));
      vec3 S = (sun + amb) * ext;
      float sT = exp(-ext * dt);
      L += T * (S - S * sT) / ext;
      float wgt = T * (1.0 - sT);
      dSum += wgt * t;
      wSum += wgt;
      T *= sT;
    }
    t += dt;
  }
  // The air between the camera and the cloud: height haze plus a clear-air term.
  float dm = wSum > 0.0 ? dSum / wSum : t0;
  float H = uHaze.y;
  float kk = dir.y * dm / H;
  float od = uHaze.x * exp(-uCamPos.y / H) * dm * (abs(kk) > 1e-3 ? (1.0 - exp(-kk)) / kk : 1.0) + dm * 1.2e-5;
  float Ta = exp(-od);
  gl_FragColor = vec4(L * Ta + aSky(dir) * (1.0 - T) * (1.0 - Ta), T);
}`;

function makeCirrus(seed: number) {
  const N = 256;
  const rand = rng(seed * 104729 + 3);
  const streaks = [[2, 24], [4, 48], [8, 96]].map(([a, b]) => ({ a, b, n: lattice(b, rand) }));
  const patches = lattice(3, rand), deck = [4, 8, 16, 32].map((n) => ({ n, f: lattice(n, rand) }));
  const data = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const u = x / N, v = y / N;
      // Fibres: stretched noise, strong along one axis.
      let s = 0, amp = 0.6;
      for (const { a, b, n } of streaks) { s += amp * Math.abs(n(u * a + v * 0.3 * a, v * b)); amp *= 0.5; }
      const mask = Math.max(0, patches(u * 3, v * 3) * 1.8 + 0.2);
      const c = Math.max(0, Math.min(1, (0.55 - s) * 1.8)) * Math.min(1, mask);
      // The overcast deck's texture: soft fbm.
      let d = 0; amp = 0.5;
      for (const { n, f } of deck) { d += amp * f(u * n, v * n); amp *= 0.5; }
      const k = (y * N + x) * 4;
      data[k] = Math.round(c * 255);
      data[k + 1] = Math.round(Math.min(1, Math.max(0, d + 0.5)) * 255);
      data[k + 3] = 255;
    }
  const tex = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export interface CloudSession {
  seed: number;
  /** Afternoon peak coverage, 0.05 to 0.65. */
  coverage: number;
  /** Cloud base above the river, metres. */
  base: number;
  /** Wind speed m/s, from the west-south-west. */
  wind: number;
  /** Cirrus opacity, 0 on half the sessions. */
  cirrus: number;
}

export function rollSession(seed = Math.floor(Math.random() * 1e9)): CloudSession {
  const r = rng(seed);
  return {
    seed,
    coverage: 0.05 + r() * 0.6,
    base: 1200 + r() * 600,
    wind: 3 + r() * 5,
    cirrus: r() < 0.5 ? 0 : 0.35 + r() * 0.45,
  };
}

export class Clouds {
  session: CloudSession;
  /** Coverage now: the session's peak times the hour's share (design.md §8.6). */
  coverage = 0;
  readonly target: THREE.WebGLRenderTarget;
  readonly cirrusOffset = new THREE.Vector2();
  cirrusTexture: THREE.DataTexture;
  private shape: THREE.WebGL3DRenderTarget;
  private detail: THREE.WebGL3DRenderTarget;
  private weather!: THREE.DataTexture;
  private sorted!: Float32Array;
  private pass: FullScreen;
  private frame = 0;
  private worker?: Worker;
  private time = 0;
  readonly sunColour = { value: new THREE.Color() };

  constructor(renderer: THREE.WebGLRenderer, session: CloudSession) {
    this.session = session;
    const mk = (n: number) => {
      const t = new THREE.WebGL3DRenderTarget(n, n, n, { depthBuffer: false });
      t.texture.wrapS = t.texture.wrapT = t.texture.wrapR = THREE.RepeatWrapping;
      t.texture.minFilter = t.texture.magFilter = THREE.LinearFilter;
      t.texture.generateMipmaps = false;
      return t;
    };
    this.shape = mk(128);
    this.detail = mk(64);
    const gen = new FullScreen(NOISE_FRAG, { uLayer: { value: 0 }, uSize: { value: 0 }, uDetail: { value: 0 }, uSeed: { value: 17.3 } });
    for (const [t, n, detail] of [[this.shape, 128, 0], [this.detail, 64, 1]] as const) {
      gen.uniforms.uSize.value = n;
      gen.uniforms.uDetail.value = detail;
      for (let z = 0; z < n; z++) {
        gen.uniforms.uLayer.value = z;
        gen.render(renderer, t as unknown as THREE.WebGLRenderTarget, z);
      }
    }
    gen.material.dispose();
    renderer.setRenderTarget(null);

    this.target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
    this.target.texture.minFilter = this.target.texture.magFilter = THREE.LinearFilter;
    this.target.texture.generateMipmaps = false;
    this.pass = new FullScreen(MARCH_FRAG, {
      ...U,
      tShape: { value: this.shape.texture },
      tDetail: { value: this.detail.texture },
      uLayer: { value: new THREE.Vector4() },
      uNoiseOffset: { value: new THREE.Vector3() },
      uInvViewProj: { value: new THREE.Matrix4() },
      uCamPos: { value: new THREE.Vector3() },
      uSunColour: this.sunColour,
      uFrame: { value: 0 },
    });
    this.cirrusTexture = makeCirrus(session.seed);
    this.apply(session, makeWeather(session.seed));
  }

  /** New clouds: the coverage map is made in a worker and swapped in when ready. */
  reseed(session: CloudSession) {
    this.worker ??= new Worker(new URL('./weather.worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (e: MessageEvent<{ seed: number; data: Uint8Array; sorted: Float32Array }>) => {
      if (e.data.seed === session.seed) this.apply(session, e.data);
    };
    this.worker.postMessage(session.seed);
  }

  private apply(session: CloudSession, w: { data: Uint8Array; sorted: Float32Array }) {
    this.session = session;
    this.weather?.dispose();
    this.weather = new THREE.DataTexture(w.data, WEATHER, WEATHER, THREE.RGBAFormat);
    this.weather.wrapS = this.weather.wrapT = THREE.RepeatWrapping;
    this.weather.magFilter = THREE.LinearFilter;
    this.weather.minFilter = THREE.LinearMipmapLinearFilter;
    this.weather.generateMipmaps = true;
    this.weather.needsUpdate = true;
    this.sorted = w.sorted;
    U.uWeather.value = this.weather;
    const r = rng(session.seed + 99);
    (this.pass.uniforms.uNoiseOffset.value as THREE.Vector3).set(r() * 3000, r() * 3000, r() * 3000);
    U.uWind.value.set(r() * 24000, r() * 24000);
  }

  setSize(w: number, h: number) {
    this.target.setSize(Math.max(1, Math.ceil(w / 2)), Math.max(1, Math.ceil(h / 2)));
  }

  /** Shifts the cloud field so its densest cell drifts over the ground point (x, z) now. */
  moveDensestOver(x: number, z: number) {
    const d = this.weather.image.data as Uint8Array;
    let best = 0, at = 0;
    for (let k = 0; k < WEATHER * WEATHER; k++) if (d[k * 4] > best) { best = d[k * 4]; at = k; }
    const u = ((at % WEATHER) + 0.5) / WEATHER, v = (Math.floor(at / WEATHER) + 0.5) / WEATHER;
    U.uWind.value.set(x - u * 24000, z - v * 24000);
  }

  /** Advances the wind; `share` is the hour's share of the peak coverage, `overcast` 0 to 1. */
  update(dt: number, share: number, overcast: number) {
    this.time += dt;
    const s = this.session;
    // Wind from the west-south-west (from 247.5°), so the clouds travel toward 67.5°.
    const a = THREE.MathUtils.degToRad(67.5);
    U.uWind.value.x += Math.sin(a) * s.wind * dt;
    U.uWind.value.y += -Math.cos(a) * s.wind * dt;
    this.cirrusOffset.x += Math.sin(a) * s.wind * 2.5 * dt;
    this.cirrusOffset.y += -Math.cos(a) * s.wind * 2.5 * dt;
    this.coverage = THREE.MathUtils.clamp(s.coverage * share, 0.05, 0.65) * (1 - overcast);
    // The threshold that leaves `coverage` of the map above it; the soft edge takes a little more.
    const n = this.sorted.length;
    const thr = this.sorted[Math.floor(THREE.MathUtils.clamp(1 - this.coverage, 0, 0.9999) * n)];
    // Local coverage reaches 1 part of the way from the threshold to the densest cell, so the
    // cores are solid whatever the coverage.
    const width = Math.max(0.06, (this.sorted[n - 1] - thr) * 0.5);
    const thickness = 500 + 1100 * Math.min(1, s.coverage / 0.5);
    U.uCloud.value.set(thr, 0.82 * (1 - overcast), s.base + thickness * 0.3, width);
    (this.pass.uniforms.uLayer.value as THREE.Vector4).set(s.base, s.base + thickness, 0.065, 0.42);
    // Slow boil: the noise rises through the cloud.
    (this.pass.uniforms.uNoiseOffset.value as THREE.Vector3).y -= 0.8 * dt;
  }

  render(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
    const u = this.pass.uniforms;
    (u.uInvViewProj.value as THREE.Matrix4).multiplyMatrices(camera.matrixWorld, (camera as THREE.PerspectiveCamera).projectionMatrixInverse);
    (u.uCamPos.value as THREE.Vector3).setFromMatrixPosition(camera.matrixWorld);
    u.uFrame.value = this.frame++ % 64;
    this.pass.render(renderer, this.target);
  }
}
