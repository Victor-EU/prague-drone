// GLSL shared by the sky, the clouds and the lit materials: the atmosphere's media and phase
// functions, lookups into the scattering tables (Hillaire 2020, with Bruneton's parameterisation
// of transmittance), and the haze. Distances in the atmosphere code are kilometres.

export const ATMOSPHERE = /* glsl */ `
#define A_PI 3.14159265359
const float A_RG = 6360.0;
const float A_RT = 6460.0;
uniform vec3 aRayleigh;
uniform float aMieScat;
uniform float aMieExt;
uniform vec3 aOzone;
uniform float aMieG;

void aMedium(float h, out vec3 scatR, out float scatM, out vec3 ext) {
  float dR = exp(-h / 8.0);
  float dM = exp(-h / 1.2);
  float dO = max(0.0, 1.0 - abs(h - 25.0) / 15.0);
  scatR = aRayleigh * dR;
  scatM = aMieScat * dM;
  ext = aRayleigh * dR + vec3(aMieExt * dM) + aOzone * dO;
}

// Nearest non-negative hit of a ray from inside or outside a sphere at the planet centre, or -1.
float aRaySphere(vec3 ro, vec3 rd, float r) {
  float b = dot(ro, rd), c = dot(ro, ro) - r * r;
  float disc = b * b - c;
  if (disc < 0.0) return -1.0;
  float s = sqrt(disc);
  float t0 = -b - s, t1 = -b + s;
  if (t0 >= 0.0) return t0;
  if (t1 >= 0.0) return t1;
  return -1.0;
}

float aRayleighPhase(float c) { return 3.0 / (16.0 * A_PI) * (1.0 + c * c); }
float aMiePhase(float c, float g) {
  float g2 = g * g;
  return 3.0 / (8.0 * A_PI) * ((1.0 - g2) * (1.0 + c * c)) / ((2.0 + g2) * pow(max(1e-4, 1.0 + g2 - 2.0 * g * c), 1.5));
}
`;

export const TRANSMITTANCE = /* glsl */ `
uniform sampler2D aTransLut;
vec2 aTransUv(float r, float mu) {
  float H = sqrt(A_RT * A_RT - A_RG * A_RG);
  float rho = sqrt(max(0.0, r * r - A_RG * A_RG));
  float disc = r * r * (mu * mu - 1.0) + A_RT * A_RT;
  float d = max(0.0, -r * mu + sqrt(max(0.0, disc)));
  float dMin = A_RT - r, dMax = rho + H;
  vec2 uv = vec2((d - dMin) / max(1e-6, dMax - dMin), rho / H);
  return clamp(uv, 0.0, 1.0) * (1.0 - 1.0 / vec2(256.0, 64.0)) + 0.5 / vec2(256.0, 64.0);
}
vec3 aTransmittance(float r, float mu) { return texture2D(aTransLut, aTransUv(r, mu)).rgb; }
// Transmittance toward the sun, fading out as the planet covers the sun's disc.
vec3 aSunTransmittance(float r, float mu) {
  float muH = -sqrt(max(0.0, 1.0 - (A_RG / r) * (A_RG / r)));
  float vis = smoothstep(muH - 0.0047, muH + 0.0047, mu);
  return aTransmittance(r, max(mu, muH)) * vis;
}
`;

export const MULTISCATTER = /* glsl */ `
uniform sampler2D aMsLut;
vec3 aMultiScat(float r, float muS) {
  vec2 uv = vec2(muS * 0.5 + 0.5, (r - A_RG) / (A_RT - A_RG));
  return texture2D(aMsLut, clamp(uv, 0.0, 1.0) * (31.0 / 32.0) + 0.5 / 32.0).rgb;
}
`;

/** Sky radiance in any direction from the sky view table; needs uSunDir, aCamR, aSunE, aSkySat. */
export const SKY_LOOKUP = /* glsl */ `
uniform sampler2D aSkyLut;
uniform float aCamR;
uniform float aSunE;
uniform float aSkySat;
uniform float aSkyFlat;
uniform vec3 uSunDir;
vec2 aSkyUv(vec3 dir) {
  float r = aCamR;
  float vHorizon = sqrt(max(0.0, r * r - A_RG * A_RG));
  float beta = acos(clamp(vHorizon / r, -1.0, 1.0));
  float zh = A_PI - beta;
  float vza = acos(clamp(dir.y, -1.0, 1.0));
  float v = vza < zh
    ? 0.5 * (1.0 - sqrt(max(0.0, 1.0 - vza / zh)))
    : 0.5 + 0.5 * sqrt(max(0.0, (vza - zh) / beta));
  vec2 dh = dir.xz + vec2(1e-6, 0.0), sh = uSunDir.xz + vec2(1e-6, 0.0);
  float cosL = dot(normalize(dh), normalize(sh));
  float u = sqrt(clamp(0.5 - 0.5 * cosL, 0.0, 1.0));
  return vec2(u, v) * (1.0 - 1.0 / vec2(192.0, 108.0)) + 0.5 / vec2(192.0, 108.0);
}
// The photographs' skies are flatter than the physical one: the dark band opposite the sun is
// lifted toward the horizon's brightness in the same direction by a power, aSkyFlat.
vec3 aSky(vec3 dir) {
  vec3 s = texture2D(aSkyLut, aSkyUv(dir)).rgb * aSunE;
  float l = dot(s, vec3(0.2126, 0.7152, 0.0722));
  if (aSkyFlat > 0.0 && dir.y > 0.035) {
    vec3 h = texture2D(aSkyLut, aSkyUv(normalize(vec3(dir.x, 0.035, dir.z)))).rgb * aSunE;
    float lh = dot(h, vec3(0.2126, 0.7152, 0.0722));
    float k = pow(clamp(l / max(lh, 1e-9), 1e-3, 1.0), -aSkyFlat);
    s *= k;
    l *= k;
  }
  return max(mix(vec3(l), s, aSkySat), 0.0);
}
`;

/** Haze and sun visibility for the lit materials; needs SKY_LOOKUP and the vPraWorld varying. */
export const LIT = /* glsl */ `
uniform sampler2D uSkyStats;
uniform vec4 uHaze;
uniform vec3 uHazeTint;
uniform sampler2D uTerrainShadow;
uniform vec4 uTerrainShadowRect;
uniform sampler2D uWeather;
uniform vec4 uCloud;
uniform vec2 uWind;
uniform float uOvercast;
uniform vec3 uOvercastSky;

float praSunVisibility(vec3 wp) {
  float vis = 1.0;
  vec2 tuv = (wp.xz - uTerrainShadowRect.xy) * uTerrainShadowRect.zw;
  if (tuv.x > 0.0 && tuv.y > 0.0 && tuv.x < 1.0 && tuv.y < 1.0) {
    vec2 s = texture2D(uTerrainShadow, tuv).rg;
    float soft = 3.0 + s.y * 0.006;
    vis = smoothstep(s.x - soft, s.x + soft, wp.y + 3.0);
  }
  if (uCloud.y > 0.0) {
    vec3 p = wp + uSunDir * ((uCloud.z - wp.y) / max(uSunDir.y, 0.06));
    float w = texture2D(uWeather, (p.xz - uWind) / 24000.0).r;
    vis *= 1.0 - uCloud.y * smoothstep(uCloud.x, uCloud.x + uCloud.w, w);
  }
  return vis;
}

// Height fog along the view ray; its colour is the sky just above the horizon in that direction.
vec3 praAerial(vec3 col, vec3 wp) {
  vec3 v = wp - cameraPosition;
  float d = length(v);
  v /= max(d, 1e-3);
  float H = uHaze.y;
  float k = v.y * d / H;
  float od = uHaze.x * exp(-cameraPosition.y / H) * d * (abs(k) > 1e-3 ? (1.0 - exp(-k)) / k : 1.0);
  float T = exp(-od) * smoothstep(uHaze.z, uHaze.z * 0.55, d);
  vec3 hv = normalize(vec3(v.x, max(v.y, 0.03), v.z));
  // By day the haze glows like the horizon; once the sun is below it, the low air is in the
  // earth's shadow and lit only by the sky above, so it takes the sky's mean light instead of
  // the sunset glow (uHaze.w: 1 with the sun up, 0 below).
  vec3 hemi = texture2D(uSkyStats, vec2(0.375, 0.5)).rgb;
  // Low haze scatters less than the whole horizon column above it: about two thirds of its light,
  // which also leaves distant hills a shade darker than the sky behind them.
  vec3 S = mix(mix(hemi * 0.8, aSky(hv) * 0.65, uHaze.w), uOvercastSky * 0.85, uOvercast) * uHazeTint;
  return col * T + S * (1.0 - T);
}
`;
