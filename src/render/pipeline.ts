// The frame after the scene (design.md §5.2): the scene renders into a half-float target with a
// jittered camera; TAA resolves it in linear light; a meter weighted toward the highlights sets
// the exposure, held within a stop of the sky's own brightness; then the filmic curve, the
// Classic Negative LUT, the family's trims, vignette, grain and, at the wide end, a trace of
// chromatic aberration.

import * as THREE from 'three';
import { FullScreen } from './fullscreen.ts';
import { U } from '../sky/uniforms.ts';
import type { Light } from '../sky/families.ts';

const LUMA = 'vec3(0.2126, 0.7152, 0.0722)';

const TAA_FRAG = /* glsl */ `
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform sampler2D tHistory;
uniform sampler2D tExposure;
uniform mat4 uInvViewProj;
uniform mat4 uPrevViewProj;
uniform vec2 uTexel;
uniform float uReset;
varying vec2 vUv;
float E;
vec3 comp(vec3 c) { c *= E; return c / (1.0 + max(c.r, max(c.g, c.b))); }
vec3 decomp(vec3 c) { return c / max(1e-6, 1.0 - max(c.r, max(c.g, c.b))) / E; }
vec3 ycocg(vec3 c) { return vec3(0.25 * c.r + 0.5 * c.g + 0.25 * c.b, 0.5 * c.r - 0.5 * c.b, -0.25 * c.r + 0.5 * c.g - 0.25 * c.b); }
vec3 rgb(vec3 c) { return vec3(c.x + c.y - c.z, c.x + c.z, c.x - c.y - c.z); }
vec3 fetch(vec2 uv) { return ycocg(comp(texture2D(tColor, uv).rgb)); }
// Catmull-Rom history sample in nine bilinear taps, for a sharper resolve.
vec3 history(vec2 uv) {
  vec2 size = 1.0 / uTexel;
  vec2 pos = uv * size, c = floor(pos - 0.5) + 0.5, f = pos - c;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2, o12 = w2 / w12;
  vec2 t0 = (c - 1.0) * uTexel, t3 = (c + 2.0) * uTexel, t12 = (c + o12) * uTexel;
  vec3 r = vec3(0.0);
  r += texture2D(tHistory, vec2(t12.x, t0.y)).rgb * w12.x * w0.y;
  r += texture2D(tHistory, vec2(t0.x, t12.y)).rgb * w0.x * w12.y;
  r += texture2D(tHistory, vec2(t12.x, t12.y)).rgb * w12.x * w12.y;
  r += texture2D(tHistory, vec2(t3.x, t12.y)).rgb * w3.x * w12.y;
  r += texture2D(tHistory, vec2(t12.x, t3.y)).rgb * w12.x * w3.y;
  float w = w12.x * w0.y + w0.x * w12.y + w12.x * w12.y + w3.x * w12.y + w12.x * w3.y;
  return max(r / w, 0.0);
}
void main() {
  E = exp2(texture2D(tExposure, vec2(0.5)).r);
  float d = texture2D(tDepth, vUv).r;
  vec4 wp = uInvViewProj * vec4(vUv * 2.0 - 1.0, d, 1.0);
  wp /= wp.w;
  vec4 pc = uPrevViewProj * wp;
  vec2 puv = pc.xy / pc.w * 0.5 + 0.5;
  vec3 m1 = vec3(0.0), m2 = vec3(0.0), cur = vec3(0.0);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec3 s = fetch(vUv + vec2(float(x), float(y)) * uTexel);
    if (x == 0 && y == 0) cur = s;
    m1 += s; m2 += s * s;
  }
  vec3 mu = m1 / 9.0, sigma = sqrt(abs(m2 / 9.0 - mu * mu));
  vec3 lo = mu - 1.25 * sigma, hi = mu + 1.25 * sigma;
  vec3 h = ycocg(comp(history(puv)));
  // Clip the history toward the neighbourhood mean.
  vec3 centre = 0.5 * (hi + lo), ext = 0.5 * (hi - lo) + 1e-5;
  vec3 v = h - centre, a = abs(v / ext);
  float m = max(a.x, max(a.y, a.z));
  if (m > 1.0) h = centre + v / m;
  float motion = length((puv - vUv) / uTexel);
  // The sky reprojects exactly under rotation and its clouds are noisy: keep a longer history there.
  float alpha = mix(d <= 0.0 ? 0.04 : 0.08, 0.25, clamp(motion / 24.0, 0.0, 1.0));
  if (uReset > 0.5 || puv.x < 0.0 || puv.y < 0.0 || puv.x > 1.0 || puv.y > 1.0) alpha = 1.0;
  gl_FragColor = vec4(decomp(rgb(mix(h, cur, alpha))), 1.0);
}`;

// Ambient occlusion of the sky light (design.md §11), at half resolution from the depth buffer: for
// each pixel, how much of the hemisphere above its surface nearby geometry hides, from a spiral
// of samples within AO_RADIUS metres. The spiral turns every frame and TAA averages the noise.
// The next frame's materials reproject into it and dim only their sky light (src/sky/lit.ts).
const AO_FRAG = /* glsl */ `
uniform sampler2D tDepth;
uniform mat4 uProjInv;
uniform vec2 uTexel;
uniform float uProjScale;
uniform float uRadius;
uniform float uStrength;
uniform float uFrame;
varying vec2 vUv;
vec3 viewPos(vec2 uv) {
  vec4 p = uProjInv * vec4(uv * 2.0 - 1.0, texture2D(tDepth, uv).r, 1.0);
  return p.xyz / p.w;
}
void main() {
  if (texture2D(tDepth, vUv).r <= 0.0) { gl_FragColor = vec4(1.0); return; }
  vec3 P = viewPos(vUv);
  vec3 x1 = viewPos(vUv + vec2(uTexel.x, 0.0)), x0 = viewPos(vUv - vec2(uTexel.x, 0.0));
  vec3 y1 = viewPos(vUv + vec2(0.0, uTexel.y)), y0 = viewPos(vUv - vec2(0.0, uTexel.y));
  vec3 dx = abs(x1.z - P.z) < abs(P.z - x0.z) ? x1 - P : P - x0;
  vec3 dy = abs(y1.z - P.z) < abs(P.z - y0.z) ? y1 - P : P - y0;
  vec3 n = normalize(cross(dx, dy));
  if (dot(n, P) > 0.0) n = -n;
  float rpx = min(uRadius * uProjScale / -P.z, 120.0);
  if (rpx < 1.5) { gl_FragColor = vec4(1.0); return; }
  float noise = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  float rot = (noise + uFrame * 0.618034) * 6.2831853;
  float R2 = uRadius * uRadius, sum = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = (float(i) + 0.5) / 8.0;
    float ang = a * 6.2831853 * 2.0 + rot;
    vec2 uv = vUv + vec2(cos(ang), sin(ang)) * (a * rpx) * uTexel;
    vec3 v = viewPos(uv) - P;
    float vv = dot(v, v);
    float cosA = dot(v, n) * inversesqrt(vv + 1e-6);
    sum += max(0.0, cosA - 0.12) * max(0.0, 1.0 - vv / R2);
  }
  gl_FragColor = vec4(max(0.0, 1.0 - uStrength * sum / 8.0), 0.0, 0.0, 1.0);
}`;

// A five-tap blur of the occlusion (centre and a diagonal cross) that does not cross depth edges.
const AO_BLUR_FRAG = /* glsl */ `
uniform sampler2D tAO;
uniform sampler2D tDepth;
uniform mat4 uProjInv;
uniform vec2 uTexel;
varying vec2 vUv;
float viewZ(vec2 uv) {
  vec4 p = uProjInv * vec4(uv * 2.0 - 1.0, texture2D(tDepth, uv).r, 1.0);
  return p.z / p.w;
}
void main() {
  float z0 = viewZ(vUv);
  float s = 0.0, w = 0.0;
  for (int i = 0; i < 5; i++) {
    vec2 o = i == 0 ? vec2(0.0) : vec2(i == 1 || i == 2 ? -1.0 : 1.0, i == 1 || i == 3 ? -1.0 : 1.0);
    vec2 uv = vUv + o * uTexel;
    float k = exp(-abs(viewZ(uv) - z0) / (0.02 * abs(z0) + 0.05));
    s += texture2D(tAO, uv).r * k;
    w += k;
  }
  gl_FragColor = vec4(s / max(w, 1e-4), 0.0, 0.0, 1.0);
}`;

const AO_RADIUS = 5;

// Each texel of the small meter image averages a patch of the frame; mipmaps average the rest.
const LUM_FRAG = /* glsl */ `
uniform sampler2D tColor;
uniform sampler2D tExposure;
uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  float E = exp2(texture2D(tExposure, vec2(0.5)).r);
  float s = 0.0, w = 0.0;
  for (int y = 0; y < 3; y++) for (int x = 0; x < 3; x++) {
    vec3 c = texture2D(tColor, vUv + (vec2(float(x), float(y)) - 1.0) * uTexel * 0.33).rgb;
    float L = max(dot(c, ${LUMA}), 1e-7);
    // Highlight priority: bright pixels weigh more.
    float k = pow(clamp(L * E, 0.02, 16.0), 0.7);
    s += k * log2(L);
    w += k;
  }
  gl_FragColor = vec4(s / 9.0, w / 9.0, 0.0, 1.0);
}`;

const ADAPT_FRAG = /* glsl */ `
uniform sampler2D tLum;
uniform float uLod;
uniform sampler2D tPrev;
uniform sampler2D uSkyStats;
uniform vec3 uOvercastSky;
uniform float uOvercast;
uniform float uCityLights;
uniform float uDt;
uniform float uBias;
uniform float uReset;
void main() {
  vec2 s = textureLod(tLum, vec2(0.5), uLod).rg;
  float meterLog = s.x / max(s.y, 1e-6);
  // The sky near the horizon sets the base, as a camera exposed for the highlights would: there
  // it lands near a third of full scale. The meter, weighted toward the highlights, may move a
  // stop darker or 0.8 of one brighter from there: views away from a low sun, where the
  // photographs let the pale sky go near white (8683, 9486), needed more than the 0.6 of M1.
  // Under overcast the deck is the sky, and the photographs let it go nearly white (8942, 8158).
  // After dark the photographs are exposed for the city's lights: the sky goes deep (9542, 9547).
  float target = mix(mix(0.24, 0.5, uOvercast), 0.07, uCityLights);
  float evFrame = log2(target) - meterLog;
  vec3 hor = texture2D(uSkyStats, vec2(0.625, 0.5)).rgb;
  hor = mix(hor, uOvercastSky * 0.85, uOvercast);
  // A camera stops brightening somewhere: 11.5 stops below the midday sky (9547 is 10 below).
  float evSky = log2(target / max(dot(hor, ${LUMA}), 0.003));
  float ev = evSky + clamp(evFrame - evSky, -1.0, 0.8) + uBias;
  float prev = texture2D(tPrev, vec2(0.5)).r;
  float next = uReset > 0.5 ? ev : prev + (ev - prev) * (1.0 - exp(-uDt / 0.7));
  gl_FragColor = vec4(next, ev, evFrame, evSky);
}`;

// Depth of field for the close-ups (design.md §5.5, M11): the comparison tool's viewpoints that
// give a focus distance and an aperture, never the flight. A gather in linear light after TAA: each
// pixel averages the image over a golden-angle spiral out to the largest circle of confusion,
// taking a sample where the sample's own circle reaches back to it; what lies behind a pixel in
// sharper focus may blur only as far as that pixel's own circle, so the background does not bleed
// over a rose in focus.
const DOF_FRAG = /* glsl */ `
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform mat4 uProjInv;
uniform vec2 uTexel;
uniform float uK;
uniform float uFocus;
uniform float uMaxR;
uniform float uStep;
varying vec2 vUv;
float dist(vec2 uv) {
  float d = texture2D(tDepth, uv).r;
  if (d <= 0.0) return 1e6;
  vec4 p = uProjInv * vec4(uv * 2.0 - 1.0, d, 1.0);
  return -p.z / p.w;
}
float coc(float s) { return min(uK * abs(1.0 - uFocus / s), uMaxR); }
void main() {
  vec3 acc = texture2D(tColor, vUv).rgb;
  float d0 = dist(vUv), r0 = coc(d0), tot = 1.0;
  float radius = uStep, ang = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) * 6.2831853;
  for (int i = 0; i < 4096; i++) {
    if (radius >= uMaxR) break;
    vec2 uv = vUv + vec2(cos(ang), sin(ang)) * uTexel * radius;
    vec3 c = texture2D(tColor, uv).rgb;
    float d = dist(uv), r = coc(d);
    if (d > d0) r = min(r, r0 * 2.0);
    float m = smoothstep(radius - 0.5, radius + 0.5, r);
    acc += mix(acc / tot, c, m);
    tot += 1.0;
    radius += uStep / radius;
    ang += 2.39996323;
  }
  gl_FragColor = vec4(acc / tot, 1.0);
}`;

const FINAL_FRAG = /* glsl */ `
uniform sampler2D tColor;
uniform sampler2D tExposure;
uniform highp sampler3D tLut;
uniform float uLutSize;
uniform float uGrade;
uniform vec3 uWB;
uniform float uSat;
uniform float uContrast;
uniform float uLift;
uniform float uVignette;
uniform float uGrain;
uniform float uCA;
uniform float uTime;
uniform vec2 uResolution;
uniform float uFit;
uniform sampler2D tDepth;
varying vec2 vUv;

// Uchimura's filmic curve (Gran Turismo): toe, linear middle, shoulder, each its own knob.
const float P = 1.0, A = 1.2, M = 0.2, LL = 0.34, C = 1.55, B = 0.0;
float curve(float x) {
  float l0 = ((P - M) * LL) / A;
  float S0 = M + l0, S1 = M + A * l0;
  float C2 = (A * P) / (P - S1), CP = -C2 / P;
  float w0 = 1.0 - smoothstep(0.0, M, x);
  float w2 = step(M + l0, x);
  float w1 = 1.0 - w0 - w2;
  float T = M * pow(max(x, 0.0) / M, C) + B;
  float S = P - (P - S1) * exp(CP * (x - S0));
  float Lin = M + A * (x - M);
  return T * w0 + Lin * w1 + S * w2;
}
vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }

void main() {
  vec2 cc = vUv - 0.5;
  vec3 c;
  if (uCA > 0.0 && uGrade > 0.5) {
    vec2 o = cc * uCA;
    c = vec3(texture2D(tColor, vUv - o).r, texture2D(tColor, vUv).g, texture2D(tColor, vUv + o).b);
  } else c = texture2D(tColor, vUv).rgb;
  c *= exp2(texture2D(tExposure, vec2(0.5)).r);
  if (uGrade > 0.5) {
    c *= uWB;
    float l = dot(c, ${LUMA});
    c = max(mix(vec3(l), c, uSat), 0.0);
  }
  c = vec3(curve(c.r), curve(c.g), curve(c.b));
  vec3 s = srgb(clamp(c, 0.0, 1.0));
  // Development only, for tools/lut-fit.ts: the image as it enters the LUT, or the sky's mask.
  if (uFit > 0.5) { gl_FragColor = uFit > 1.5 ? vec4(vec3(step(texture2D(tDepth, vUv).r, 0.0)), 1.0) : vec4(s, 1.0); return; }
  float n = hash(gl_FragCoord.xy + fract(uTime * 7.31) * 517.0) + hash(gl_FragCoord.yx * 1.37 + fract(uTime * 3.17) * 911.0) - 1.0;
  if (uGrade > 0.5) {
    s = texture(tLut, s * ((uLutSize - 1.0) / uLutSize) + 0.5 / uLutSize).rgb;
    // The family's contrast as an S about the middle that keeps black and white where they are: a
    // straight stretch clipped the darkest few percent to black, and shadows never go to pure
    // black in daylight (design.md §5.1).
    s = clamp(s + 4.0 * (uContrast - 1.0) * (s - 0.5) * s * (1.0 - s), 0.0, 1.0);
    s = uLift + s * (1.0 - uLift);
    float aspect = uResolution.x / uResolution.y;
    float r = length(cc * vec2(aspect, 1.0)) / length(vec2(aspect, 1.0) * 0.5);
    s *= 1.0 - uVignette * pow(r, 2.4);
    float lum = dot(s, vec3(0.299, 0.587, 0.114));
    s += n * uGrain * (0.5 + 0.5 * (1.0 - abs(lum * 2.0 - 1.0)));
  } else {
    s += n / 255.0;
  }
  gl_FragColor = vec4(s, 1.0);
}`;

function halfTarget(w: number, h: number, opts: THREE.RenderTargetOptions = {}) {
  const t = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, depthBuffer: false, ...opts });
  t.texture.minFilter = t.texture.magFilter = THREE.LinearFilter;
  t.texture.generateMipmaps = false;
  return t;
}

// Halton (2, 3), 16 samples, centred.
const JITTER = Array.from({ length: 16 }, (_, i) => {
  const h = (b: number, n: number) => { let f = 1, r = 0; while (n > 0) { f /= b; r += f * (n % b); n = Math.floor(n / b); } return r; };
  return [h(2, i + 1) - 0.5, h(3, i + 1) - 0.5];
});

export interface FrameOptions {
  dt: number;
  light: Light;
  /** 0 at the wide lens, 1 at the long one. */
  lens: number;
  /** Called after the camera is jittered and before the scene renders. */
  beforeScene?: (camera: THREE.PerspectiveCamera) => void;
}

export class Pipeline {
  /** Grade, vignette and grain on; key G in development turns them off (design.md §5.2). */
  grade = true;
  /** Development only: a close-up's lens (focus distance in metres, f-number at the 35 mm equivalent, focal length), for its depth of field (design.md §5.5). */
  dof: { focus: number; fstop: number; focal35: number } | null = null;
  /** Development only, for tools/lut-fit.ts: 1 draws the image as it enters the LUT, 2 the sky's mask. */
  fit = 0;
  readonly renderer: THREE.WebGLRenderer;
  private hdr: THREE.WebGLRenderTarget;
  private hist: THREE.WebGLRenderTarget[];
  private lum: THREE.WebGLRenderTarget;
  private expo: THREE.WebGLRenderTarget[];
  private aoRaw: THREE.WebGLRenderTarget;
  private aoOut: THREE.WebGLRenderTarget;
  private aoPass: FullScreen;
  private aoBlur: FullScreen;
  /** Occlusion on; key O in development turns it off. */
  ao = true;
  private taa: FullScreen;
  private lumPass: FullScreen;
  private adapt: FullScreen;
  private final: FullScreen;
  private dofPass: FullScreen;
  private dofOut: THREE.WebGLRenderTarget;
  private frame = 0;
  private time = 0;
  private reset = true;
  private prevViewProj = new THREE.Matrix4();
  private prevPos = new THREE.Vector3();
  private width = 1;
  private height = 1;

  constructor(renderer: THREE.WebGLRenderer, lut: THREE.Data3DTexture) {
    this.renderer = renderer;
    this.hdr = halfTarget(1, 1, { depthBuffer: true, depthTexture: new THREE.DepthTexture(1, 1, THREE.FloatType) });
    this.hdr.texture.minFilter = this.hdr.texture.magFilter = THREE.NearestFilter;
    this.hist = [halfTarget(1, 1), halfTarget(1, 1)];
    this.lum = halfTarget(128, 64);
    this.lum.texture.generateMipmaps = true;
    this.lum.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.expo = [0, 1].map(() => {
      const t = new THREE.WebGLRenderTarget(1, 1, { type: THREE.FloatType, depthBuffer: false });
      t.texture.minFilter = t.texture.magFilter = THREE.NearestFilter;
      return t;
    });
    this.aoRaw = halfTarget(1, 1);
    this.aoOut = halfTarget(1, 1);
    this.aoPass = new FullScreen(AO_FRAG, {
      tDepth: { value: this.hdr.depthTexture },
      uProjInv: { value: new THREE.Matrix4() },
      uTexel: { value: new THREE.Vector2() },
      uProjScale: { value: 1 },
      uRadius: { value: AO_RADIUS },
      uStrength: { value: 1.6 },
      uFrame: { value: 0 },
    });
    this.aoBlur = new FullScreen(AO_BLUR_FRAG, {
      tAO: { value: this.aoRaw.texture },
      tDepth: { value: this.hdr.depthTexture },
      uProjInv: this.aoPass.uniforms.uProjInv,
      uTexel: { value: new THREE.Vector2() },
    });
    this.taa = new FullScreen(TAA_FRAG, {
      tColor: { value: this.hdr.texture },
      tDepth: { value: this.hdr.depthTexture },
      tHistory: { value: null },
      tExposure: { value: null },
      uInvViewProj: { value: new THREE.Matrix4() },
      uPrevViewProj: { value: new THREE.Matrix4() },
      uTexel: { value: new THREE.Vector2() },
      uReset: { value: 1 },
    });
    this.dofOut = halfTarget(1, 1);
    this.dofPass = new FullScreen(DOF_FRAG, {
      tColor: { value: null },
      tDepth: { value: this.hdr.depthTexture },
      uProjInv: { value: new THREE.Matrix4() },
      uTexel: { value: new THREE.Vector2() },
      uK: { value: 0 },
      uFocus: { value: 1 },
      uMaxR: { value: 0 },
      uStep: { value: 1 },
    });
    this.lumPass = new FullScreen(LUM_FRAG, {
      tColor: { value: null },
      tExposure: { value: null },
      uTexel: { value: new THREE.Vector2(1 / 128, 1 / 64) },
    });
    this.adapt = new FullScreen(ADAPT_FRAG, {
      tLum: { value: this.lum.texture },
      uLod: { value: 7 },
      tPrev: { value: null },
      uSkyStats: U.uSkyStats,
      uOvercastSky: U.uOvercastSky,
      uOvercast: U.uOvercast,
      uCityLights: U.uCityLights,
      uDt: { value: 0 },
      uBias: { value: 0 },
      uReset: { value: 1 },
    });
    this.final = new FullScreen(FINAL_FRAG, {
      tColor: { value: null },
      tExposure: { value: null },
      tLut: { value: lut },
      uLutSize: { value: lut.image.width },
      uGrade: { value: 1 },
      uWB: { value: new THREE.Vector3(1, 1, 1) },
      uSat: { value: 1 },
      uContrast: { value: 1 },
      uLift: { value: 0 },
      uVignette: { value: 0.2 },
      uGrain: { value: 0.012 },
      uCA: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uFit: { value: 0 },
      tDepth: { value: this.hdr.depthTexture },
    });
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.hdr.setSize(w, h);
    for (const t of this.hist) t.setSize(w, h);
    this.dofOut.setSize(w, h);
    (this.dofPass.uniforms.uTexel.value as THREE.Vector2).set(1 / w, 1 / h);
    const hw = Math.max(1, Math.round(w / 2)), hh = Math.max(1, Math.round(h / 2));
    this.aoRaw.setSize(hw, hh);
    this.aoOut.setSize(hw, hh);
    (this.aoPass.uniforms.uTexel.value as THREE.Vector2).set(1 / w, 1 / h);
    (this.aoBlur.uniforms.uTexel.value as THREE.Vector2).set(1 / hw, 1 / hh);
    (this.taa.uniforms.uTexel.value as THREE.Vector2).set(1 / w, 1 / h);
    (this.final.uniforms.uResolution.value as THREE.Vector2).set(w, h);
    this.reset = true;
  }

  /** Throws the history away, for jumps of the camera. */
  invalidate() { this.reset = true; }

  /**
   * Draws the scene into the HDR target alone, none of the passes after it: to warm the driver up.
   * With `everything`, nothing is culled, so every mesh's buffers reach the GPU now rather than on
   * the frame it first comes into view.
   */
  warm(scene: THREE.Scene, camera: THREE.Camera, everything = false) {
    const r = this.renderer, saved = r.getRenderTarget(), culled: THREE.Object3D[] = [];
    if (everything) scene.traverse((o) => { if (o.frustumCulled) { o.frustumCulled = false; culled.push(o); } });
    r.setRenderTarget(this.hdr);
    r.render(scene, camera);
    r.setRenderTarget(saved);
    for (const o of culled) o.frustumCulled = true;
  }

  /**
   * Compiles the shaders of `o` for the scene pass (into the HDR target, so the programs are the ones
   * the frame will use), without waiting on the driver where it compiles in parallel. Parts hidden
   * for now are compiled too (the lamps, lit only after sunset), and so is the variant the river's
   * mirror draws with its clipping plane: made on first use, each cost a hitch in flight.
   */
  async compile(o: THREE.Object3D, camera: THREE.Camera, scene: THREE.Scene) {
    const r = this.renderer, saved = r.getRenderTarget(), clip = r.clippingPlanes;
    const hidden: THREE.Object3D[] = [];
    o.traverse((c) => { if (!c.visible) { c.visible = true; hidden.push(c); } });
    r.setRenderTarget(this.hdr);
    const plain = r.compileAsync(o, camera, scene);
    r.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)];
    const clipped = r.compileAsync(o, camera, scene);
    r.clippingPlanes = clip;
    r.setRenderTarget(saved);
    for (const c of hidden) c.visible = false;
    await Promise.all([plain, clipped]);
  }

  render(scene: THREE.Scene, camera: THREE.PerspectiveCamera, o: FrameOptions) {
    const r = this.renderer;
    this.time += o.dt;
    if (camera.position.distanceTo(this.prevPos) > 150) this.reset = true;
    this.prevPos.copy(camera.position);

    // Jitter the projection by a sub-pixel offset.
    const [jx, jy] = JITTER[this.frame % JITTER.length];
    const unjittered = camera.projectionMatrix.clone();
    camera.projectionMatrix.elements[8] += (2 * jx) / this.width;
    camera.projectionMatrix.elements[9] += (2 * jy) / this.height;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

    o.beforeScene?.(camera);
    // Last frame's occlusion is only valid if the camera did not jump.
    if (this.reset || !this.ao) U.uAOOn.value = 0;
    r.setRenderTarget(this.hdr);
    r.render(scene, camera);

    if (this.ao) {
      const au = this.aoPass.uniforms;
      (au.uProjInv.value as THREE.Matrix4).copy(camera.projectionMatrixInverse);
      // Half-resolution pixels per metre at a view distance of one metre.
      au.uProjScale.value = camera.projectionMatrix.elements[5] * this.height / 4;
      au.uFrame.value = this.frame % 64;
      // The samples step in full-resolution texels scaled to half-resolution pixels.
      (au.uTexel.value as THREE.Vector2).set(2 / this.width, 2 / this.height);
      this.aoPass.render(r, this.aoRaw);
      this.aoBlur.render(r, this.aoOut);
      U.tAO.value = this.aoOut.texture;
      U.uAOViewProj.value.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      U.uAOOn.value = 1;
    }

    const [histIn, histOut] = this.frame % 2 ? [this.hist[1], this.hist[0]] : [this.hist[0], this.hist[1]];
    const [expoIn, expoOut] = this.frame % 2 ? [this.expo[1], this.expo[0]] : [this.expo[0], this.expo[1]];

    const tu = this.taa.uniforms;
    tu.tHistory.value = histIn.texture;
    tu.tExposure.value = expoIn.texture;
    (tu.uInvViewProj.value as THREE.Matrix4).multiplyMatrices(camera.matrixWorld, camera.projectionMatrixInverse);
    (tu.uPrevViewProj.value as THREE.Matrix4).copy(this.prevViewProj);
    tu.uReset.value = this.reset ? 1 : 0;
    this.taa.render(r, histOut);

    // The close-up's depth of field: the circle of confusion's radius in pixels is uK·|1 − focus/s|,
    // uK = f² / (N (focus − f)) / 2 on a frame whose width is the 35 mm frame's 24 or 36 mm.
    let image = histOut;
    if (this.dof) {
      const du = this.dofPass.uniforms, f = this.dof.focal35, N = this.dof.fstop;
      const pxPerMm = this.width / (this.width < this.height ? 24 : 36);
      const K = ((f * f) / (N * Math.max(1, this.dof.focus * 1000 - f)) / 2) * pxPerMm;
      du.tColor.value = histOut.texture;
      (du.uProjInv.value as THREE.Matrix4).copy(camera.projectionMatrixInverse);
      du.uK.value = K;
      du.uFocus.value = this.dof.focus;
      du.uMaxR.value = Math.min(K, 48);
      // At most about 800 samples at the largest circle.
      du.uStep.value = Math.max(0.5, (du.uMaxR.value * du.uMaxR.value) / 1600);
      this.dofPass.render(r, this.dofOut);
      image = this.dofOut;
    }

    this.lumPass.uniforms.tColor.value = histOut.texture;
    this.lumPass.uniforms.tExposure.value = expoIn.texture;
    this.lumPass.render(r, this.lum);
    // Mipmaps for the meter image (the renderer makes them after rendering into a target).
    const au = this.adapt.uniforms;
    au.tPrev.value = expoIn.texture;
    au.uDt.value = o.dt;
    au.uBias.value = o.light.ev;
    au.uReset.value = this.reset ? 1 : 0;
    this.adapt.render(r, expoOut);

    const fu = this.final.uniforms;
    fu.tColor.value = image.texture;
    fu.tExposure.value = expoOut.texture;
    fu.uGrade.value = this.grade ? 1 : 0;
    fu.uFit.value = this.fit;
    (fu.uWB.value as THREE.Vector3).set(...o.light.wb);
    fu.uSat.value = o.light.sat;
    fu.uContrast.value = o.light.contrast;
    fu.uLift.value = o.light.lift;
    // Vignette and aberration belong to the wide end of the zoom (design.md §5.1, §5.2).
    fu.uVignette.value = THREE.MathUtils.lerp(0.26, 0.12, o.lens);
    fu.uCA.value = THREE.MathUtils.lerp(0.0016, 0, Math.min(1, o.lens * 3));
    fu.uTime.value = this.time;
    this.final.render(r, null);

    // Unjittered matrices for the next frame's reprojection.
    camera.projectionMatrix.copy(unjittered);
    camera.projectionMatrixInverse.copy(unjittered).invert();
    this.prevViewProj.multiplyMatrices(unjittered, camera.matrixWorldInverse);
    this.reset = false;
    this.frame++;
  }
}
