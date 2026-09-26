// The trees (design.md §8.4): every crown the world build found in the canopy height model
// (tools/lib/trees.ts), and the rose bushes of the beds, drawn in two ways by distance. Within
// 250 m of the drone each tree is a crown of lobes (spheres for the broad trees, fruit trees and
// roses, a column for the poplars, tiers of cones for the conifers) on a trunk, at three levels
// of detail, each lobe moved and resized by the tree's own seed; the near set is sorted again
// whenever the camera has moved a few metres. Beyond it every tree is a sprite facing the camera,
// shaded as the ellipsoid it stands for, with a lumpy edge, thinned with distance (fewer, bigger).
// All of it in three's standard material with the sky patch, so the crowns take the sun, the
// sky's light, the haze, and cast shadows (drawn with the simplest crowns, as is the mirror).
//
// Foliage is drawn in the shader from a small tiling 3D noise texture at three scales: two-metre
// clumps that show from 500 m, half-metre clusters, and near, the leaves themselves; each darkens
// and lightens the albedo, tilts the normal and breaks up the outline while it is bigger than a
// pixel or two. The lobes' normals are bent toward the whole crown's, so a crown is lit as one
// mass with bumps, and its inside and underside are darker to the sky's light.
//
// Cost (Apple M2): a shader that may discard is shaded under every crown that overlaps it on a
// tile-based GPU, so only the two nearest levels discard; and the geometry of the whole frame
// matters, which is why meshes stop at 250 m.

import * as THREE from 'three';
import type { Pack } from '../core/pack.ts';
import { Kind, TREE_XZ, TREE_H, TREE_R } from '../core/trees.ts';
import type { HeightGrid } from './heightgrid.ts';
import { patchLit } from '../sky/lit.ts';
import { U } from '../sky/uniforms.ts';
import { REFLECT } from '../render/reflection.ts';
import { BLOOMS } from './blooms.ts';

/** Within these 3D distances a tree has its most detailed crown, then its middle one. */
const NEAR0 = 90;
const NEAR_MID = 230;
/** Within this horizontal distance of the near set's centre a tree is a mesh; beyond it a sprite. */
const NEAR1 = 250;
/** The near set is sorted again when the camera has moved this far. */
const RESORT = 6;
const FLOATS = 12;

// ---- Crown geometry ----------------------------------------------------------------------------

interface Lobe { c: [number, number, number]; r: number }

/** A mesh under construction: positions, normals, part (0 crown, 1 trunk). */
class Builder {
  pos: number[] = []; nor: number[] = []; part: number[] = []; index: number[] = [];
  /** Per vertex, the lobe it belongs to (centre, radius; radius 0 for cones and trunks). */
  lobeOf: number[] = [];
  lobe(l: Lobe, detail: number) {
    const g = new THREE.IcosahedronGeometry(1, detail);
    const p = g.getAttribute('position');
    const base = this.pos.length / 3;
    // Icosahedron geometry is not indexed: weld its corners so each lobe is one smooth ball.
    const seen = new Map<string, number>();
    const map: number[] = [];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
      let k = seen.get(key);
      if (k === undefined) {
        k = this.pos.length / 3 - base;
        seen.set(key, k);
        this.pos.push(l.c[0] + x * l.r, l.c[1] + y * l.r, l.c[2] + z * l.r);
        this.nor.push(x, y, z);
        this.part.push(0);
        this.lobeOf.push(l.c[0], l.c[1], l.c[2], l.r);
      }
      map.push(k);
    }
    for (const k of map) this.index.push(base + k);
    g.dispose();
  }
  /** A cone from radius r at y0 to a point at y1, `n` sides, open at the bottom but for a skirt. */
  cone(y0: number, y1: number, r: number, n: number, phase: number) {
    const base = this.pos.length / 3;
    const slope = r / (y1 - y0);
    for (let i = 0; i <= n; i++) {
      const a = phase + (i / n) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      const len = Math.hypot(1, slope);
      this.pos.push(c * r, y0, s * r); this.nor.push(c / len, slope / len, s / len); this.part.push(0);
      this.pos.push(0, y1, 0); this.nor.push(c / len, slope / len, s / len); this.part.push(0);
      this.lobeOf.push(0, y0, 0, 0, 0, y0, 0, 0);
    }
    for (let i = 0; i < n; i++) {
      const a = base + i * 2;
      this.index.push(a, a + 1, a + 2);
    }
    // The underside, a flat ring seen from below.
    const hub = this.pos.length / 3;
    this.pos.push(0, y0 + (y1 - y0) * 0.15, 0); this.nor.push(0, -1, 0); this.part.push(0);
    this.lobeOf.push(0, y0, 0, 0);
    for (let i = 0; i < n; i++) {
      const a = base + i * 2, b = base + (i + 1) * 2;
      this.index.push(hub, b, a);
    }
  }
  /** The trunk: a prism of radius 1 from y 0 to 1 (scaled per tree). */
  trunk(n: number) {
    const base = this.pos.length / 3;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      this.pos.push(c, 0, s, c * 0.7, 1, s * 0.7);
      this.nor.push(c, 0, s, c, 0, s);
      this.part.push(1, 1);
      this.lobeOf.push(0, 0, 0, 0, 0, 0, 0, 0);
    }
    for (let i = 0; i < n; i++) {
      const a = base + i * 2;
      this.index.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  }
}

/** A deterministic scatter of numbers in [0, 1). */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Lobes for a crown in the unit ellipsoid (x, z in −1..1, y in −1..1). */
function lobes(kind: number, count: number, seed: number): Lobe[] {
  const r = rng(seed);
  const out: Lobe[] = [];
  if (kind === Kind.Poplar) {
    // A column: lobes stacked up the axis, narrowing to the top.
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = -0.72 + t * 1.5;
      const rad = 0.62 * (1 - 0.55 * t * t);
      out.push({ c: [(r() - 0.5) * 0.25, y, (r() - 0.5) * 0.25], r: rad });
    }
    return out;
  }
  const flat = kind === Kind.Fruit ? 0.95 : kind === Kind.Rose ? 0.65 : 1;
  // One lobe at the core, a ring round the middle, a cap, and a few below.
  out.push({ c: [0, 0.05, 0], r: 0.66 });
  const ring = Math.max(3, Math.round(count * 0.45));
  for (let i = 0; i < ring; i++) {
    const a = (i / ring) * Math.PI * 2 + r() * 0.6;
    const d = 0.5 + r() * 0.08;
    out.push({ c: [Math.cos(a) * d, (-0.12 + r() * 0.3) * flat, Math.sin(a) * d], r: 0.44 + r() * 0.07 });
  }
  const cap = Math.max(1, Math.round(count * 0.3));
  for (let i = 0; i < cap; i++) {
    const a = (i / cap) * Math.PI * 2 + 1 + r();
    const d = cap === 1 ? 0.08 : 0.3;
    out.push({ c: [Math.cos(a) * d, 0.5 * flat, Math.sin(a) * d], r: 0.46 + r() * 0.06 });
  }
  for (let i = out.length; i < count; i++) {
    const a = r() * Math.PI * 2;
    out.push({ c: [Math.cos(a) * 0.35, -0.48, Math.sin(a) * 0.35], r: 0.4 });
  }
  return out;
}

/** One kind's geometry: its three levels of detail in one index buffer, the draw range picking between them. */
function crownGeometry(kind: number): { geom: THREE.BufferGeometry; lod: [number, number][] } {
  const b = new Builder();
  const lod: [number, number][] = [];
  const add = (detail: 0 | 1 | 2) => {
    const start = b.index.length;
    if (kind === Kind.Conifer) {
      // Tiers of cones, each overlapping the one below.
      const tiers = [3, 4, 5][detail], n = [5, 7, 9][detail];
      for (let i = 0; i < tiers; i++) {
        const t = i / tiers;
        const y0 = -1 + t * 1.7, y1 = y0 + [1.0, 0.85, 0.75][detail];
        b.cone(y0, Math.min(1, y1), 1 - t * 0.78, n, i * 0.7);
      }
    } else {
      const many = kind === Kind.Poplar ? 7 : 12, few = kind === Kind.Poplar ? 4 : 5;
      for (const l of lobes(kind, detail === 2 ? many : few, 11 + kind)) b.lobe(l, detail);
    }
    b.trunk([3, 4, 6][detail]);
    lod.push([start, b.index.length - start]);
  };
  add(2);
  add(1);
  add(0);
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(b.nor, 3));
  geom.setAttribute('aPart', new THREE.Float32BufferAttribute(b.part, 1));
  geom.setAttribute('aLobe', new THREE.Float32BufferAttribute(b.lobeOf, 4));
  geom.setIndex(b.index);
  return { geom, lod };
}

// ---- Shaders -----------------------------------------------------------------------------------

const NOISE = /* glsl */ `
float praTHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }`;

// Instance data, 12 floats: iA (x, ground y, z, yaw), iB (crown radius, crown half-height, crown
// centre above the ground, trunk radius), iC (colour, kind + seed).
const INSTANCE_PARS = /* glsl */ `
attribute vec4 iA;
attribute vec4 iB;
attribute vec4 iC;
uniform vec3 uNearCentre;
uniform float uNearR;
`;

const MESH_VERT_PARS = /* glsl */ `
${INSTANCE_PARS}
attribute float aPart;
attribute vec4 aLobe;
varying float vKind;
varying vec3 vTreeCol;
varying vec3 vUnit;
varying vec3 vCrownN;
varying float vPart;
varying float vSeed;
`;

// Each tree moves and resizes its lobes by its own seed, so no two crowns are alike.
const LOBE = /* glsl */ `
vec3 praLobe(vec3 p, vec4 lobe, float seed) {
  if (lobe.w <= 0.0) return p;
  vec3 h = fract(sin(vec3(dot(lobe.xyz, vec3(12.9898, 78.233, 37.719)), dot(lobe.xyz, vec3(39.346, 11.135, 83.155)), dot(lobe.xyz, vec3(73.156, 52.235, 9.151))) + seed * vec3(91.7, 53.1, 27.3)) * 43758.5453);
  vec3 c = lobe.xyz + (h - 0.5) * vec3(0.36, 0.24, 0.36);
  return c + (p - lobe.xyz) * (0.78 + 0.44 * h.y);
}`;

const MESH_TRANSFORM = /* glsl */ `
float praC = cos(iA.w), praS = sin(iA.w);
mat3 praRot = mat3(praC, 0.0, -praS, 0.0, 1.0, 0.0, praS, 0.0, praC);
vec3 praScale = vec3(iB.x, iB.y, iB.x);
vec3 transformed;
if (aPart > 0.5) {
  transformed = iA.xyz + praRot * vec3(position.x * iB.w, position.y * iB.z, position.z * iB.w);
} else {
  vec3 local = praLobe(position, aLobe, fract(iC.w));
  #ifdef PRA_BUMPS
  // Near, each lobe is lumpy: pushed in and out along its normal by the leaf-clump noise.
  if (aLobe.w > 0.0) {
    vec3 wp0 = iA.xyz + vec3(0.0, iB.z, 0.0) + praRot * (local * praScale);
    float bump = textureLod(tLeafNoise, wp0 * 0.9 / 8.0, 0.0).r - 0.5;
    local += normal * bump * 0.55 * aLobe.w;
  }
  #endif
  // The crown sways a little with the wind, its top most.
  float ph = fract(iC.w) * 6.2832 + uTime * 1.1;
  vec2 sway = vec2(sin(ph), sin(ph * 1.37 + 1.0)) * 0.006 * (local.y + 1.0) * iB.y;
  transformed = iA.xyz + vec3(0.0, iB.z, 0.0) + praRot * (local * praScale) + vec3(sway.x, 0.0, sway.y);
}
`;

const MESH_NORMAL = /* glsl */ `
float praC0 = cos(iA.w), praS0 = sin(iA.w);
mat3 praRot0 = mat3(praC0, 0.0, -praS0, 0.0, 1.0, 0.0, praS0, 0.0, praC0);
vec3 objectNormal = aPart > 0.5 ? praRot0 * normal : normalize(praRot0 * (normal / vec3(iB.x, iB.y, iB.x)));
vTreeCol = iC.rgb;
vUnit = praLobe(position, aLobe, fract(iC.w));
vPart = aPart;
vSeed = fract(iC.w);
vKind = floor(iC.w);
vCrownN = normalize(praRot0 * (vUnit / vec3(iB.x, iB.y, iB.x)));
`;

const FOLIAGE_PARS = /* glsl */ `
${BLOOMS}
uniform highp sampler3D tLeafNoise;
vec4 praNm = vec4(0.5);
vec4 praNd = vec4(0.5);
vec4 praNf = vec4(0.5);
float praFine = 0.0;
varying float vKind;
varying vec3 vTreeCol;
varying vec3 vUnit;
varying vec3 vCrownN;
varying float vPart;
varying float vSeed;
${NOISE}
float praTreeOcc = 1.0;
float praLeaf = 0.5;
float praClump = 0.5;
float praDetail = 0.0;
float praMid = 0.0;
float praRoseBloom = 0.0;
`;

// Albedo, leaf texture and the outline's breakup; before the normal is formed. Two scales of
// leaf cluster: half-metre leaves that show near, and two-metre clumps that still show from 500 m.
const FOLIAGE_COLOUR = /* glsl */ `
{
  vec3 wp = vPraWorld;
  // Metres per pixel here: each scale fades out as it falls under two pixels.
  float mpp = length(fwidth(wp));
  praDetail = 1.0 - smoothstep(0.12, 0.45, mpp * (vKind > ${Kind.Rose - 0.5} ? 3.4 : 1.0));
  praMid = 1.0 - smoothstep(0.5, 1.8, mpp);
  #ifdef PRA_CUT
  // Nothing within a few metres of the lens: the near plane would cut a crown into slivers.
  if (length(vViewPosition) < (vKind > ${Kind.Rose - 0.5} ? 3.2 : 5.0)) discard;
  #endif
  if (vPart > 0.5) {
    diffuseColor.rgb = vec3(0.075, 0.062, 0.05) * (0.8 + 0.4 * texture(tLeafNoise, wp * 3.0 / 8.0).r);
  } else {
    // A rose's leaves are a few centimetres: the same texture, finer. The noise comes from a small
    // tiling 3D texture (four channels: a value and a tilt for the normal), each scale only where it shows.
    float ls = vKind > ${Kind.Rose - 0.5} ? 3.4 : 1.0;
    if (praDetail > 0.0) {
      praNd = texture(tLeafNoise, (wp * 2.2 * ls + vSeed * 31.0) / 8.0);
      float leaf2 = texture(tLeafNoise, (wp * 5.1 * ls + 7.0) / 8.0).r;
      praLeaf = mix(0.5, praNd.r * 0.65 + leaf2 * 0.35, praDetail);
      // Close, the leaves themselves: clusters of a decimetre or so, crisp, with dark gaps between.
      praFine = 1.0 - smoothstep(0.012, 0.05, mpp * ls);
      if (praFine > 0.0) {
        praNf = texture(tLeafNoise, (wp * 8.5 * ls + 3.0) / 8.0);
        float cluster = smoothstep(0.42, 0.58, praNf.r * 0.7 + leaf2 * 0.3);
        // A rose bush is dense: its gaps are shallower than a tree's.
        praLeaf = mix(praLeaf, vKind > ${Kind.Rose - 0.5} ? 0.35 + 0.55 * cluster : cluster * 0.9 + 0.05, praFine);
      }
    }
    if (praMid > 0.0) {
      praNm = texture(tLeafNoise, (wp * 0.6 + vSeed * 13.0) / 8.0);
      praClump = mix(0.5, praNm.r, praMid);
    }
    // Holes along each lobe's outline where the clusters thin out.
    #ifdef PRA_CUT
    float facing = abs(dot(normalize(vNormal), normalize(vViewPosition)));
    float ragged = 0.55 * praLeaf * praDetail + 0.5 * max(0.0, praClump - 0.35) * praMid + 0.25 * praFine * (1.0 - praLeaf);
    if (facing < ragged * (vKind > ${Kind.Rose - 0.5} ? 0.4 : 1.0)) discard;
    #endif
    vec3 c = vTreeCol;
    c *= (0.72 + 0.56 * praLeaf) * (0.62 + 0.76 * praClump * mix(1.0, 0.55, praDetail) + 0.17 * praDetail);
    // Lighter, yellower young growth where a cluster catches the light at the crown's top.
    c = mix(c, c * vec3(1.18, 1.16, 0.9), smoothstep(0.55, 0.95, vUnit.y) * praClump);
    if (vKind > ${Kind.Rose - 0.5}) {
      // A rose bush in bloom: flowers of eight to ten centimetres massed on its top and the sides
      // that face out, each with its petals in rings when near.
      vec3 q = wp / 0.085;
      vec3 cell = floor(q);
      vec3 off = vec3(praTHash(cell + 1.7), praTHash(cell + 2.9), praTHash(cell + 4.1)) - 0.5;
      float size = 0.34 + 0.2 * praTHash(cell + 6.3);
      vec3 dq = fract(q) - 0.5 - off * 0.3;
      float rr = length(dq) / size;
      float where = smoothstep(-0.6, 0.5, vCrownN.y + 0.4 * length(vUnit.xz) - 0.25);
      float here = step(praTHash(cell + 0.37), 0.8 * where) * (1.0 - smoothstep(0.85, 1.05, rr));
      float fade = smoothstep(0.015, 0.06, mpp);
      float cover = mix(here, 0.42 * where, fade);
      // Petals round the centre, turning as they go in; darker toward the heart.
      float ang = atan(dq.y + dq.z, dq.x);
      float petals = mix(1.0, (0.8 + 0.2 * cos(ang * 5.0 + rr * 9.0 + praTHash(cell + 3.3) * 6.0)) * (0.78 + 0.22 * smoothstep(0.0, 0.6, rr)), 1.0 - fade);
      c = mix(c, praBloom(wp.xz) * (0.85 + 0.3 * praTHash(cell)) * petals, cover);
      praRoseBloom = cover;
    }
    diffuseColor.rgb = c;
    // The sky reaches into a crown less deep down and inside.
    float depth = smoothstep(0.25, 0.95, length(vUnit));
    praTreeOcc = mix(0.25, 1.0, depth) * (0.5 + 0.5 * smoothstep(-1.0, 0.7, vCrownN.y));
    // A bush is small and open: the sky's light reaches most of it, and the blooms face it.
    if (vKind > ${Kind.Rose - 0.5}) praTreeOcc = mix(mix(0.55, 1.0, praTreeOcc), 1.0, praRoseBloom);
  }
}`;

// The normal: bent toward the crown's, tilted by the clumps and the leaf clusters.
const FOLIAGE_NORMAL = /* glsl */ `
if (vPart < 0.5) {
  vec3 cn = normalize((viewMatrix * vec4(vCrownN, 0.0)).xyz);
  normal = normalize(mix(normal, cn, 0.62));
  vec3 tilt = (praNm.gba - 0.5) * 2.0 * praMid + (praNd.gba - 0.5) * 1.6 * praDetail + (praNf.gba - 0.5) * 2.4 * praFine;
  normal = normalize(normal + (viewMatrix * vec4(tilt, 0.0)).xyz);
}`;

// A crown is mostly its own shadow: the sky's light reaches the outer leaves only, and the sheen
// of the leaves is weak and broken.
const OCCLUSION = /* glsl */ `#include <lights_fragment_end>
reflectedLight.indirectDiffuse *= praTreeOcc * 0.7;
reflectedLight.indirectSpecular *= praTreeOcc * praTreeOcc * 0.35;
reflectedLight.directDiffuse *= mix(1.0, praTreeOcc, 0.5);
reflectedLight.directSpecular *= 0.4;`;

/**
 * The crowns' material. `cut` lets it discard (the ragged outlines near, nothing at the lens): a
 * shader that may discard is shaded under every crown that overlaps it on a tile-based GPU, so
 * the far crowns, whose outlines are smooth anyway, have a material that never does.
 */
function meshMaterial(near: { centre: THREE.Vector3; r: { value: number } }, cut: boolean): { material: THREE.MeshStandardMaterial; depth: THREE.MeshDepthMaterial } {
  const uniforms = { uNearCentre: { value: near.centre }, uNearR: near.r };
  const base = new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0 });
  base.defines = cut ? { PRA_CUT: '', PRA_BUMPS: '' } : {};
  const material = patchLit(base, (shader) => {
    Object.assign(shader.uniforms, uniforms, { tLeafNoise: { value: leafNoise() } });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${MESH_VERT_PARS}\nuniform float uTime;\nuniform highp sampler3D tLeafNoise;\n${LOBE}`)
      .replace('#include <beginnormal_vertex>', MESH_NORMAL)
      .replace('#include <begin_vertex>', MESH_TRANSFORM);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FOLIAGE_PARS}`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${FOLIAGE_COLOUR}`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${FOLIAGE_NORMAL}`)
      .replace('#include <lights_fragment_end>', OCCLUSION);
  }, cut ? '-trees-cut' : '-trees');
  const depth = new THREE.MeshDepthMaterial();
  depth.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, { uTime: U.uTime });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${INSTANCE_PARS}\nattribute float aPart;\nattribute vec4 aLobe;\nuniform float uTime;\n${LOBE}`)
      .replace('#include <begin_vertex>', MESH_TRANSFORM);
  };
  depth.customProgramCacheKey = () => 'praha-tree-depth';
  return { material, depth };
}

// Sprites: a lumpy disc facing the camera (or, in a shadow pass, the sun), sized to the ellipsoid's
// outline seen from there, and pulled to the crown's front so the ground behind does not cut it.
// (A polygon outline instead of the discard cost more in vertices than it saved in shading.)
const SPRITE_VERT_PARS = /* glsl */ `
${INSTANCE_PARS}
attribute vec2 aCorner;
varying float vRadius;
varying vec2 vQuad;
varying vec3 vAxA;
varying vec3 vAxB;
varying vec3 vAxD;
varying vec3 vTreeCol;
varying float vKind;
varying float vSeed;
`;

const SPRITE_TRANSFORM = /* glsl */ `
vec3 praCentre = iA.xyz + vec3(0.0, iB.z, 0.0);
vec3 praD = isOrthographic ? normalize(vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2])) : normalize(cameraPosition - praCentre);
vec3 praA = normalize(cross(vec3(0.0, 1.0, 0.0), praD));
vec3 praB = cross(praD, praA);
float praUp = praB.y;
float praHa = iB.x, praHb = sqrt(iB.x * iB.x * (1.0 - praUp * praUp) + iB.y * iB.y * praUp * praUp);
// Far away, fewer and bigger crowns: a tree whose seed falls above the share kept shrinks away, and
// the rest grow so the canopy covers what it covered (fewer layers of sprites to shade).
// Distances from the drone (the near set's centre), so the shadows and the mirror thin alike.
float praDist = length(uNearCentre - praCentre);
float praKeep = clamp(pow(1400.0 / max(praDist, 1.0), 1.4), 0.3, 1.0);
float praSize = (1.0 - smoothstep(praKeep - 0.12, praKeep, fract(iC.w))) / sqrt(praKeep);
vec2 praQ = aCorner * 1.02;
vec3 transformed = praCentre + (praA * praQ.x * praHa + praB * praQ.y * praHb) * praSize + praD * iB.x * 0.9;
// Trees of the near set are meshes (and a sprite never draws under the near set's radius).
vec2 praOff = iA.xz - uNearCentre.xz;
if (dot(praOff, praOff) < uNearR * uNearR) transformed = vec3(0.0, -1e5, 0.0);
vQuad = praQ;
vAxA = praA; vAxB = praB; vAxD = praD;
vRadius = iB.x * praSize;
vTreeCol = iC.rgb;
vKind = floor(iC.w);
vSeed = fract(iC.w);
`;

// The lumpy outline, cut from the quad (a conifer's a spire).
const SPRITE_SHAPE = /* glsl */ `
{
  vec2 q = vQuad;
  float ang = atan(q.y, q.x);
  float edge = 0.86 + 0.07 * sin(ang * 5.0 + vSeed * 60.0) + 0.05 * sin(ang * 9.0 + vSeed * 17.0);
  if (abs(vKind - ${Kind.Conifer}.0) < 0.5) edge = min(edge, (1.0 - q.y) * 0.55 + 0.08);
  if (dot(q, q) > edge * edge) discard;
}`;

const SPRITE_FRAG_PARS = /* glsl */ `
varying float vRadius;
varying vec2 vQuad;
varying vec3 vAxA;
varying vec3 vAxB;
varying vec3 vAxD;
varying vec3 vTreeCol;
varying float vKind;
varying float vSeed;
`;

function spriteMaterial(near: { centre: THREE.Vector3; r: { value: number } }): { material: THREE.MeshStandardMaterial; depth: THREE.MeshDepthMaterial } {
  const uniforms = { uNearCentre: { value: near.centre }, uNearR: near.r };
  const material = patchLit(new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0 }), (shader) => {
    Object.assign(shader.uniforms, uniforms, { tLeafNoise: { value: leafNoise() } });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${SPRITE_VERT_PARS}`)
      .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3(0.0, 1.0, 0.0);')
      .replace('#include <begin_vertex>', SPRITE_TRANSFORM);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${SPRITE_FRAG_PARS}\nfloat praTreeOcc = 1.0;\nuniform highp sampler3D tLeafNoise;\nvec3 praSn;\nvec4 praClumpN = vec4(0.5);\nvec3 praClumpT;`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${SPRITE_SHAPE}
{
  // The crown's surface point this pixel stands for, on the ellipsoid, for the same two-metre
  // clumps the meshes have (while they are more than a pixel or two).
  vec2 q = vQuad;
  float d2 = dot(q, q);
  praSn = normalize(q.x * vAxA + q.y * vAxB + sqrt(max(0.05, 1.0 - d2)) * vAxD);
  float mid = 1.0 - smoothstep(0.5, 1.8, length(fwidth(vPraWorld)));
  if (mid > 0.0) praClumpN = texture(tLeafNoise, (vPraWorld + praSn * vRadius) * 0.6 / 8.0 + vSeed * 1.7);
  float clump = mix(0.5, praClumpN.r, mid);
  praClumpT = (praClumpN.gba - 0.5) * 2.0 * mid;
  diffuseColor.rgb = vTreeCol * (0.92 + 0.16 * vSeed) * (0.62 + 0.76 * clump);
  praTreeOcc = mix(0.45, 1.0, smoothstep(-0.9, 0.5, q.y)) * mix(1.0, 0.75, d2);
}`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
normal = normalize((viewMatrix * vec4(normalize(praSn + praClumpT), 0.0)).xyz);`)
      .replace('#include <lights_fragment_end>', OCCLUSION);
  }, '-tree-sprites');
  const depth = new THREE.MeshDepthMaterial();
  depth.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${SPRITE_VERT_PARS}`)
      .replace('#include <begin_vertex>', SPRITE_TRANSFORM);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${SPRITE_FRAG_PARS}`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\n${SPRITE_SHAPE}`);
  };
  depth.customProgramCacheKey = () => 'praha-tree-sprite-depth';
  return { material, depth };
}

/**
 * A tiling 32³ texture of smooth value noise, one feature every four texels (so a lookup at
 * position / 8 has a feature a unit, like a lattice noise), in four independent channels.
 */
let noiseTexture: THREE.Data3DTexture | null = null;
function leafNoise(): THREE.Data3DTexture {
  if (noiseTexture) return noiseTexture;
  const N = 32, L = 8;
  const r = rng(4242);
  const lattice = Array.from({ length: 4 }, () => Float32Array.from({ length: L * L * L }, () => r()));
  const data = new Uint8Array(N * N * N * 4);
  const s = (t: number) => t * t * (3 - 2 * t);
  for (let z = 0; z < N; z++)
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const fx = x / 4, fy = y / 4, fz = z / 4;
        const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
        const tx = s(fx - ix), ty = s(fy - iy), tz = s(fz - iz);
        for (let c = 0; c < 4; c++) {
          const g = (a: number, b: number, d: number) => lattice[c][((d % L) * L + (b % L)) * L + (a % L)];
          const v =
            (g(ix, iy, iz) * (1 - tx) + g(ix + 1, iy, iz) * tx) * (1 - ty) * (1 - tz) +
            (g(ix, iy + 1, iz) * (1 - tx) + g(ix + 1, iy + 1, iz) * tx) * ty * (1 - tz) +
            (g(ix, iy, iz + 1) * (1 - tx) + g(ix + 1, iy, iz + 1) * tx) * (1 - ty) * tz +
            (g(ix, iy + 1, iz + 1) * (1 - tx) + g(ix + 1, iy + 1, iz + 1) * tx) * ty * tz;
          data[((z * N + y) * N + x) * 4 + c] = Math.round(v * 255);
        }
      }
  const t = new THREE.Data3DTexture(data, N, N, N);
  t.format = THREE.RGBAFormat;
  t.wrapS = t.wrapT = t.wrapR = THREE.RepeatWrapping;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  noiseTexture = t;
  return t;
}

// ---- Colours -----------------------------------------------------------------------------------

/** Foliage by kind, sRGB (design.md §8.9), before the grade makes them olive and teal. */
const FOLIAGE: Record<number, string[]> = {
  [Kind.Broad]: ['#4a5a40', '#3d4b34', '#52693f', '#43533a', '#4d5f3f'],
  [Kind.Fruit]: ['#5f7747', '#566d40', '#5b7344'],
  [Kind.Poplar]: ['#3d4b34', '#384730', '#435339'],
  [Kind.Conifer]: ['#27342b', '#2d3d2d', '#25322d'],
  [Kind.Rose]: ['#44573a', '#3d5134'],
};
const FOLIAGE_LINEAR: Record<number, THREE.Color[]> = Object.fromEntries(
  Object.entries(FOLIAGE).map(([k, list]) => [k, list.map((h) => new THREE.Color(h))]),
);

// ---- The trees ---------------------------------------------------------------------------------

interface Tile { x0: number; z0: number; n: number; data: Float32Array }

interface Bucket { mesh: THREE.Mesh; geom: THREE.InstancedBufferGeometry; buffer: THREE.InstancedInterleavedBuffer; count: number }

export class Trees {
  readonly group = new THREE.Group();
  readonly count: number;
  private tiles: Tile[] = [];
  private sprites: THREE.Mesh[] = [];
  private near = { centre: new THREE.Vector3(1e9, 0, 1e9), r: { value: NEAR1 } };
  private buckets: Bucket[][] = []; // [lod][kind]
  private sorted = new THREE.Vector3(1e9, 0, 1e9);

  constructor(pack: Pack<{ nx: number; nz: number; tile: number; x0: number; z0: number }>, height: HeightGrid) {
    const { nx, nz, tile, x0, z0 } = pack.meta;
    const start = pack.arrays.start as Uint32Array, xz = pack.arrays.xz as Uint16Array, hr = pack.arrays.hr as Uint8Array, ks = pack.arrays.ks as Uint8Array;
    this.count = start[start.length - 1];
    const col = new THREE.Color();
    for (let tj = 0; tj < nz; tj++)
      for (let ti = 0; ti < nx; ti++) {
        const t = tj * nx + ti, a = start[t], b = start[t + 1];
        if (b === a) continue;
        const tx = x0 + ti * tile, tz = z0 + tj * tile;
        const data = new Float32Array((b - a) * FLOATS);
        for (let k = a; k < b; k++) {
          const x = tx + xz[k * 2] / TREE_XZ, z = tz + xz[k * 2 + 1] / TREE_XZ;
          const h = hr[k * 2] * TREE_H, r = hr[k * 2 + 1] * TREE_R;
          const kind = ks[k * 2], seed = ks[k * 2 + 1] / 256;
          const o = (k - a) * FLOATS;
          const s = shape(kind, h, r, seed);
          data[o] = x; data[o + 1] = height.sample(x, z); data[o + 2] = z; data[o + 3] = seed * Math.PI * 2;
          data[o + 4] = s.rx; data[o + 5] = s.ry; data[o + 6] = s.cy; data[o + 7] = s.trunk;
          const list = FOLIAGE_LINEAR[kind] ?? FOLIAGE_LINEAR[Kind.Broad];
          col.copy(list[Math.floor(seed * 7919) % list.length]).multiplyScalar(0.9 + 0.2 * ((seed * 37) % 1));
          data[o + 8] = col.r; data[o + 9] = col.g; data[o + 10] = col.b; data[o + 11] = kind + Math.min(seed, 0.999);
        }
        this.tiles.push({ x0: tx, z0: tz, n: b - a, data });
      }

    // Near: per level of detail and kind, a mesh whose instances are rewritten as the camera moves.
    const meshes = [meshMaterial(this.near, true), meshMaterial(this.near, false)];
    const geoms = [Kind.Broad, Kind.Fruit, Kind.Poplar, Kind.Conifer, Kind.Rose].map((k) => crownGeometry(k));
    for (let lod = 0; lod < 3; lod++) {
      const row: Bucket[] = [];
      for (let kind = 0; kind < geoms.length; kind++) {
        const { geom: base, lod: ranges } = geoms[kind];
        const geom = new THREE.InstancedBufferGeometry();
        geom.index = base.index;
        for (const name of ['position', 'normal', 'aPart', 'aLobe']) geom.setAttribute(name, base.getAttribute(name));
        const buffer = new THREE.InstancedInterleavedBuffer(new Float32Array(FLOATS * 64), FLOATS, 1).setUsage(THREE.DynamicDrawUsage);
        instanceAttributes(geom, buffer);
        geom.instanceCount = 0;
        const own = ranges[lod], cheap = ranges[2];
        geom.setDrawRange(own[0], own[1]);
        const mesh = meshes[lod < 2 ? 0 : 1];
        const m = new THREE.Mesh(geom, mesh.material);
        m.customDepthMaterial = mesh.depth;
        m.frustumCulled = false;
        m.castShadow = true;
        m.receiveShadow = true;
        m.matrixAutoUpdate = false;
        // Shadows and the river's mirror take the simpler crowns.
        m.onBeforeShadow = () => geom.setDrawRange(cheap[0], cheap[1]);
        m.onAfterShadow = () => geom.setDrawRange(own[0], own[1]);
        m.onBeforeRender = (_r, _s, cam) => { if (!cam.layers.isEnabled(0)) geom.setDrawRange(cheap[0], cheap[1]); };
        m.onAfterRender = () => geom.setDrawRange(own[0], own[1]);
        m.layers.enable(REFLECT);
        this.group.add(m);
        row.push({ mesh: m, geom, buffer, count: 0 });
      }
      this.buckets.push(row);
    }

    // Far: a sprite per tree, a mesh per tile, static.
    const sprite = spriteMaterial(this.near);
    const quad = new THREE.BufferGeometry();
    quad.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(12), 3));
    quad.setAttribute('aCorner', new THREE.Float32BufferAttribute([-1, -1, 1, -1, 1, 1, -1, 1], 2));
    quad.setIndex([0, 1, 2, 0, 2, 3]);
    for (const t of this.tiles) {
      const geom = new THREE.InstancedBufferGeometry();
      geom.index = quad.index;
      geom.setAttribute('position', quad.getAttribute('position'));
      geom.setAttribute('aCorner', quad.getAttribute('aCorner'));
      instanceAttributes(geom, new THREE.InstancedInterleavedBuffer(t.data, FLOATS, 1));
      geom.instanceCount = t.n;
      let top = 0;
      for (let k = 0; k < t.n; k++) top = Math.max(top, t.data[k * FLOATS + 1] + t.data[k * FLOATS + 6] * 2);
      geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(t.x0 + 500, top / 2, t.z0 + 500), Math.hypot(720, top / 2 + 40));
      const m = new THREE.Mesh(geom, sprite.material);
      m.customDepthMaterial = sprite.depth;
      m.castShadow = true;
      // Beyond the near set the building shadows are lost in the crown's own shading.
      m.receiveShadow = false;
      m.matrixAutoUpdate = false;
      m.layers.enable(REFLECT);
      this.group.add(m);
      this.sprites.push(m);
    }
  }

  /** Whether the far trees' sprites cast shadows (the lite preset turns them off). */
  set spriteShadows(on: boolean) {
    for (const m of this.sprites) m.castShadow = on;
  }

  /** Sorts the trees round the camera into the near meshes, when it has moved far enough. */
  update(camera: THREE.Vector3) {
    if (Math.hypot(camera.x - this.sorted.x, camera.y - this.sorted.y, camera.z - this.sorted.z) < RESORT) return;
    this.sorted.copy(camera);
    this.near.centre.copy(camera);
    for (const row of this.buckets) for (const b of row) b.count = 0;
    const r1 = NEAR1 * NEAR1, r0 = NEAR0 * NEAR0, rm = NEAR_MID * NEAR_MID;
    for (const t of this.tiles) {
      const dx = Math.max(0, t.x0 - camera.x, camera.x - (t.x0 + 1000)), dz = Math.max(0, t.z0 - camera.z, camera.z - (t.z0 + 1000));
      if (dx * dx + dz * dz > r1) continue;
      const d = t.data;
      for (let k = 0, o = 0; k < t.n; k++, o += FLOATS) {
        const ex = d[o] - camera.x, ez = d[o + 2] - camera.z;
        const h2 = ex * ex + ez * ez;
        if (h2 >= r1) continue;
        const ey = d[o + 1] + d[o + 6] - camera.y;
        const d2 = h2 + ey * ey;
        const lod = d2 < r0 ? 0 : d2 < rm ? 1 : 2;
        const b = this.buckets[lod][Math.floor(d[o + 11])];
        if ((b.count + 1) * FLOATS > b.buffer.array.length) grow(b);
        (b.buffer.array as Float32Array).set(d.subarray(o, o + FLOATS), b.count * FLOATS);
        b.count++;
      }
    }
    for (const row of this.buckets)
      for (const b of row) {
        b.geom.instanceCount = b.count;
        b.mesh.visible = b.count > 0;
        b.buffer.clearUpdateRanges();
        b.buffer.addUpdateRange(0, b.count * FLOATS);
        b.buffer.needsUpdate = true;
      }
  }
}

function instanceAttributes(geom: THREE.InstancedBufferGeometry, buffer: THREE.InstancedInterleavedBuffer) {
  geom.setAttribute('iA', new THREE.InterleavedBufferAttribute(buffer, 4, 0));
  geom.setAttribute('iB', new THREE.InterleavedBufferAttribute(buffer, 4, 4));
  geom.setAttribute('iC', new THREE.InterleavedBufferAttribute(buffer, 4, 8));
}

/** Doubles a bucket's buffer (a new buffer object, so three allocates it afresh). */
function grow(b: Bucket) {
  const old = b.buffer.array as Float32Array;
  const next = new Float32Array(old.length * 2);
  next.set(old);
  b.buffer = new THREE.InstancedInterleavedBuffer(next, FLOATS, 1).setUsage(THREE.DynamicDrawUsage);
  instanceAttributes(b.geom, b.buffer);
}

/** A tree's crown and trunk from its height and spread, by kind. */
function shape(kind: number, h: number, r: number, seed: number) {
  let base: number, rx: number;
  switch (kind) {
    case Kind.Fruit:
      // Low, round crowns on a short trunk.
      base = Math.min(1.2, Math.max(0.5, 0.18 * h));
      rx = Math.min(Math.max(r, 0.5 * (h - base)), 0.72 * (h - base));
      break;
    case Kind.Poplar:
      base = 0.1 * h;
      rx = Math.min(Math.max(r, 0.1 * h), 0.2 * h);
      break;
    case Kind.Rose:
      // Sunk a little into the bed, as a bush stands on its stems among its neighbours.
      return { rx: r, ry: h / 2 + 0.1, cy: h / 2 - 0.1, trunk: 0 };
    case Kind.Conifer:
      base = 0.06 * h;
      rx = Math.min(Math.max(r, 0.16 * h), 0.3 * h);
      break;
    default:
      base = h * (0.2 + 0.12 * seed);
      // Neighbouring crowns in a wood meet: a little wider than the survey's spread.
      rx = Math.min(Math.max(r * 1.12, 0.3 * (h - base)), 0.85 * (h - base));
  }
  const ry = (h - base) / 2;
  return { rx, ry, cy: base + ry, trunk: 0.05 + 0.012 * h };
}
