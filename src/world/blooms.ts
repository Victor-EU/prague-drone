// Roses in bloom (design.md §8.4), the same in the beds on the ground (src/world/terrain.ts) and on
// the bushes that stand in them (src/world/trees.ts): one variety to a stretch of bed, red, coral,
// pink or white, as the Petřín rose garden plants them. Linear colours; the red is the rose red of
// design.md §8.9; the coral turned orange-red in M10, the strongest colour of 8722.

export const BLOOMS = /* glsl */ `
float praBHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float praBNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(praBHash(i), praBHash(i + vec2(1.0, 0.0)), f.x), mix(praBHash(i + vec2(0.0, 1.0)), praBHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
vec3 praBloom(vec2 xz) {
  float v = praBNoise(xz * 0.18 + 11.0);
  return v < 0.5 ? vec3(0.58, 0.035, 0.028) : v < 0.68 ? vec3(0.7, 0.07, 0.004) : v < 0.86 ? vec3(0.66, 0.24, 0.3) : vec3(0.8, 0.76, 0.7);
}
// The leaves of a rose bed or bush.
const vec3 PRA_ROSE_LEAF = vec3(0.03, 0.045, 0.026);
`;
