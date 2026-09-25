// The atmosphere as precomputed scattering tables (Hillaire 2020, "A Scalable and Production Ready
// Sky and Atmosphere Rendering Technique"): transmittance and multiple scattering, recomputed when
// the aerosol amount changes, and the sky view table, recomputed every frame for the camera's
// height and the sun. Also the same transmittance on the CPU for the colour of the sunlight.

import * as THREE from 'three';
import { FullScreen } from '../render/fullscreen.ts';
import { ATMOSPHERE, TRANSMITTANCE, MULTISCATTER, SKY_LOOKUP } from './glsl.ts';
import { U, SUN_E } from './uniforms.ts';

const TRANS_FRAG = /* glsl */ `
${ATMOSPHERE}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5) / vec2(255.0, 63.0);
  float H = sqrt(A_RT * A_RT - A_RG * A_RG);
  float rho = H * uv.y;
  float r = sqrt(rho * rho + A_RG * A_RG);
  float dMin = A_RT - r, dMax = rho + H;
  float d = dMin + uv.x * (dMax - dMin);
  float mu = d <= 0.0 ? 1.0 : clamp((H * H - rho * rho - d * d) / (2.0 * r * d), -1.0, 1.0);
  vec3 ro = vec3(0.0, r, 0.0), rd = vec3(sqrt(max(0.0, 1.0 - mu * mu)), mu, 0.0);
  float tMax = max(0.0, aRaySphere(ro, rd, A_RT));
  vec3 od = vec3(0.0);
  const int N = 48;
  float dt = tMax / float(N);
  for (int i = 0; i < N; i++) {
    vec3 p = ro + rd * ((float(i) + 0.5) * dt);
    vec3 sR, sM, e;
    aMedium(length(p) - A_RG, sR, sM, e);
    od += e * dt;
  }
  gl_FragColor = vec4(exp(-od), 1.0);
}`;

const MS_FRAG = /* glsl */ `
${ATMOSPHERE}
${TRANSMITTANCE}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5) / 31.0;
  float muS = uv.x * 2.0 - 1.0;
  float r = A_RG + max(0.01, uv.y * (A_RT - A_RG));
  vec3 ro = vec3(0.0, r, 0.0);
  vec3 sunDir = vec3(0.0, muS, -sqrt(max(0.0, 1.0 - muS * muS)));
  vec3 lum = vec3(0.0), fms = vec3(0.0);
  const int SQ = 8;
  const float INV = 1.0 / float(SQ * SQ);
  for (int i = 0; i < SQ; i++) for (int j = 0; j < SQ; j++) {
    float theta = A_PI * (float(i) + 0.5) / float(SQ);
    float phi = acos(clamp(1.0 - 2.0 * (float(j) + 0.5) / float(SQ), -1.0, 1.0));
    vec3 rd = vec3(sin(phi) * sin(theta), cos(phi), sin(phi) * cos(theta));
    float tA = aRaySphere(ro, rd, A_RT), tG = aRaySphere(ro, rd, A_RG);
    float tMax = tG > 0.0 ? tG : tA;
    vec3 L = vec3(0.0), F = vec3(0.0), T = vec3(1.0);
    float t = 0.0;
    for (int k = 0; k < 20; k++) {
      float tn = (float(k) + 0.3) / 20.0 * tMax;
      float dt = tn - t;
      t = tn;
      vec3 p = ro + rd * t;
      float rr = length(p);
      vec3 sR, sM, e;
      aMedium(rr - A_RG, sR, sM, e);
      vec3 sT = exp(-dt * e);
      vec3 scat = sR + sM;
      vec3 ee = max(e, vec3(1e-7));
      F += T * (scat - scat * sT) / ee;
      vec3 inS = scat * (1.0 / (4.0 * A_PI)) * aSunTransmittance(rr, dot(p / rr, sunDir));
      L += T * (inS - inS * sT) / ee;
      T *= sT;
    }
    if (tG > 0.0) {
      vec3 hp = ro + rd * tG;
      float muG = dot(normalize(hp), sunDir);
      L += T * aSunTransmittance(A_RG, muG) * max(muG, 0.0) * (0.3 / A_PI);
    }
    lum += L * INV;
    fms += F * INV;
  }
  gl_FragColor = vec4(lum / max(vec3(1e-4), 1.0 - fms), 1.0);
}`;

const SKY_FRAG = /* glsl */ `
${ATMOSPHERE}
${TRANSMITTANCE}
${MULTISCATTER}
uniform float aCamR;
uniform vec3 uSunDir;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5) / vec2(191.0, 107.0);
  float r = aCamR;
  float vHorizon = sqrt(max(0.0, r * r - A_RG * A_RG));
  float beta = acos(clamp(vHorizon / r, -1.0, 1.0));
  float zh = A_PI - beta;
  float vza;
  if (uv.y < 0.5) { float c = 1.0 - 2.0 * uv.y; vza = zh * (1.0 - c * c); }
  else { float c = uv.y * 2.0 - 1.0; vza = zh + beta * c * c; }
  float cosL = -(uv.x * uv.x * 2.0 - 1.0);
  vec3 rd = vec3(sin(vza) * cosL, cos(vza), sin(vza) * sqrt(max(0.0, 1.0 - cosL * cosL)));
  float muS = uSunDir.y;
  vec3 sunDir = vec3(sqrt(max(0.0, 1.0 - muS * muS)), muS, 0.0);
  vec3 ro = vec3(0.0, r, 0.0);
  float tG = aRaySphere(ro, rd, A_RG), tA = aRaySphere(ro, rd, A_RT);
  float tMax = min(tG > 0.0 ? tG : tA, 3000.0);
  float cosT = dot(rd, sunDir);
  float pR = aRayleighPhase(cosT), pM = aMiePhase(cosT, aMieG);
  vec3 L = vec3(0.0), T = vec3(1.0);
  float t = 0.0;
  const int N = 40;
  for (int i = 0; i < N; i++) {
    float s = (float(i) + 0.5) / float(N);
    float tn = s * s * tMax;
    float dt = tn - t;
    t = tn;
    vec3 p = ro + rd * t;
    float rr = length(p);
    vec3 sR, sM, e;
    aMedium(rr - A_RG, sR, sM, e);
    vec3 sT = exp(-dt * e);
    float muSp = dot(p / rr, sunDir);
    vec3 S = (sR * pR + sM * pM) * aSunTransmittance(rr, muSp) + (sR + sM) * aMultiScat(rr, muSp);
    L += T * (S - S * sT) / max(e, vec3(1e-7));
    T *= sT;
  }
  gl_FragColor = vec4(L, 1.0);
}`;

// Sky summary for the rest of the frame: zenith radiance, mean over the upper hemisphere, mean at
// the horizon, and the radiance of the ground (albedo 0.13) lit by sun and sky.
const STATS_FRAG = /* glsl */ `
${ATMOSPHERE}
${SKY_LOOKUP}
uniform vec3 uSunIrradiance;
uniform float uOvercast;
uniform vec3 uOvercastSky;
void main() {
  int k = int(gl_FragCoord.x);
  vec3 zen = aSky(vec3(0.0, 1.0, 0.0));
  vec3 hemi = vec3(0.0), hor = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    float a = float(i) * A_PI / 4.0;
    hor += aSky(normalize(vec3(cos(a), 0.03, sin(a)))) / 8.0;
    hemi += (aSky(normalize(vec3(cos(a), 0.35, sin(a)))) + aSky(normalize(vec3(cos(a), 1.2, sin(a))))) / 16.0;
  }
  hemi = mix(hemi, uOvercastSky, uOvercast);
  hor = mix(hor, uOvercastSky, uOvercast);
  zen = mix(zen, uOvercastSky, uOvercast);
  vec3 ground = vec3(0.13, 0.12, 0.10) * (uSunIrradiance / A_PI + hemi);
  gl_FragColor = vec4(k == 0 ? zen : k == 1 ? hemi : k == 2 ? hor : ground, 1.0);
}`;

function target(w: number, h: number) {
  const t = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, depthBuffer: false });
  t.texture.minFilter = t.texture.magFilter = THREE.LinearFilter;
  t.texture.generateMipmaps = false;
  t.texture.wrapS = t.texture.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// The same media on the CPU (km).
const RG = 6360, RT = 6460;

export class Scattering {
  private trans = target(256, 64);
  private ms = target(32, 32);
  private sky = target(192, 108);
  private stats = target(4, 1);
  private transPass = new FullScreen(TRANS_FRAG, U);
  private msPass = new FullScreen(MS_FRAG, U);
  private skyPass = new FullScreen(SKY_FRAG, U);
  private statsPass: FullScreen;
  private aerosol = -1;
  readonly sunIrradiance = { value: new THREE.Color() };

  constructor() {
    U.aTransLut.value = this.trans.texture;
    U.aMsLut.value = this.ms.texture;
    U.aSkyLut.value = this.sky.texture;
    U.uSkyStats.value = this.stats.texture;
    this.stats.texture.minFilter = this.stats.texture.magFilter = THREE.NearestFilter;
    this.statsPass = new FullScreen(STATS_FRAG, { ...U, uSunIrradiance: this.sunIrradiance });
  }

  /** Sets the aerosol amount (1 = the clear standard atmosphere); rebuilds the tables if it moved. */
  setAerosol(renderer: THREE.WebGLRenderer, aerosol: number) {
    U.aMieScat.value = 3.996e-3 * aerosol;
    U.aMieExt.value = 4.4e-3 * aerosol;
    if (Math.abs(aerosol - this.aerosol) < 0.01 * this.aerosol) return;
    this.aerosol = aerosol;
    this.transPass.render(renderer, this.trans);
    this.msPass.render(renderer, this.ms);
  }

  /** The sky view table for a camera at height `y` (metres above the river) and the summary. */
  update(renderer: THREE.WebGLRenderer, y: number) {
    U.aCamR.value = RG + Math.max(0.02, (185 + y) / 1000);
    this.skyPass.render(renderer, this.sky);
    this.statsPass.render(renderer, this.stats);
  }

  /** Transmittance of sunlight to a point `altitude` km above sea level, per channel. */
  sunTransmittance(altitudeKm: number, sunDir: THREE.Vector3, out: THREE.Color): THREE.Color {
    const r = RG + altitudeKm;
    const mu = sunDir.y;
    // Planet shadow, soft over the sun's disc.
    const muH = -Math.sqrt(Math.max(0, 1 - (RG / r) ** 2));
    const vis = THREE.MathUtils.smoothstep(mu, muH - 0.0047, muH + 0.0047);
    if (vis <= 0) return out.setRGB(0, 0, 0);
    const m = Math.max(mu, muH);
    const sx = Math.sqrt(Math.max(0, 1 - m * m)), sy = m;
    // Distance to the top of the atmosphere.
    const b = r * sy, c = r * r - RT * RT;
    const tMax = -b + Math.sqrt(b * b - c);
    const ray = U.aRayleigh.value, oz = U.aOzone.value, mie = U.aMieExt.value;
    let odR = 0, odM = 0, odO = 0;
    const N = 64;
    for (let i = 0; i < N; i++) {
      // Denser sampling near the start, where the air is thick.
      const s0 = i / N, s1 = (i + 1) / N;
      const t0 = s0 * s0 * tMax, t1 = s1 * s1 * tMax, t = 0.5 * (t0 + t1), dt = t1 - t0;
      const px = sx * t, py = r + sy * t;
      const h = Math.hypot(px, py) - RG;
      odR += Math.exp(-h / 8) * dt;
      odM += Math.exp(-h / 1.2) * dt;
      odO += Math.max(0, 1 - Math.abs(h - 25) / 15) * dt;
    }
    // The aerosol's spectrum as in glsl.ts (A_MIE_SPECTRUM).
    return out.setRGB(
      Math.exp(-(ray.x * odR + mie * 0.76 * odM + oz.x * odO)) * vis,
      Math.exp(-(ray.y * odR + mie * odM + oz.y * odO)) * vis,
      Math.exp(-(ray.z * odR + mie * 1.34 * odM + oz.z * odO)) * vis,
    );
  }
}

export { SUN_E };
