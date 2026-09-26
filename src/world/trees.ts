// The trees (design.md §8.4): every crown the world build found in the canopy height model
// (tools/lib/trees.ts), and the rose bushes of the beds, drawn in two ways by distance. Within
// 250 m of the drone each tree is a crown of lobes on a trunk, at three levels of detail, its
// lobes laid out by its kind (M16: the lime's dome with a shoulder, the chestnut's tiers of flat
// lobes, the fruit tree's low open crown on a leaning trunk that forks into crooked limbs, the
// poplar's flame, the willow's dome over a curtain of hanging lobes, the conifer's tiers of
// cones), each lobe moved and resized by the tree's own seed, with limbs within 230 m; the near
// set is sorted again whenever the camera has moved a few metres. Beyond it every tree is a
// sprite facing the camera, its outline the union of a few lobes placed by the seed, shaded by
// those lobes and the ellipsoid it stands for, thinned with distance (fewer, bigger; the trees
// closed in by their neighbours go first).
// A crown is lit as a canopy (M16): the sun reaches the tops of the leaf clumps and not their
// hollows, less far down a side than a sphere's shading would have it, and less on the sides of a
// tree closed in by a wood (its exposure, measured by the world build); the shadow side is lifted
// by the sky and by the light the leaves let through toward the camera when the sun is behind them.
// Within 50 m the crown also carries leaf clusters (design.md §8.4, M9): small cards over the
// lobes, each cut into a sprig of small overlapping leaves in the shader (M16), so a near crown
// has leaves and sky between them at its edge, as the photographs' trees have (8385, 8884, 9204). Within 12 m the roses'
// blooms are modelled (src/world/roses.ts, M10).
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
import { Kind, TREE_XZ, TREE_H, TREE_R, KIND_MASK, EXPOSURE_SHIFT } from '../core/trees.ts';
import type { HeightGrid } from './heightgrid.ts';
import { patchLit } from '../sky/lit.ts';
import { U } from '../sky/uniforms.ts';
import { REFLECT } from '../render/reflection.ts';
import { BLOOMS } from './blooms.ts';
import { RoseBlooms, BLOOM_FAR, BLOOM_NEAR, type Bush } from './roses.ts';

/** Within this distance of the lens a rose bush is cut away (the near plane would slice it): a
 *  little beyond the camera's near plane, which a close-up viewpoint brings in (8722). */
export const LENS = { value: 3.2 };
/** Within this 3D distance a tree carries its leaf clusters. */
const NEAR_LEAF = 50;
/** Within these 3D distances a tree has its most detailed crown, then its middle one. */
const NEAR0 = 90;
const NEAR_MID = 230;
/** Within this horizontal distance of the near set's centre a tree is a mesh; beyond it a sprite. */
const NEAR1 = 250;
/** The near set is sorted again when the camera has moved this far. */
const RESORT = 6;
const FLOATS = 12;

// ---- Crown geometry ----------------------------------------------------------------------------

/** A lobe of the crown in the unit ellipsoid: centre, radius across, radius up. `limb` if a limb runs to it. */
interface Lobe { c: [number, number, number]; r: number; ry: number; limb?: boolean; main?: boolean }

/** A mesh under construction: positions, normals, part (0 crown, 1 trunk or limb, 2 leaf card). */
class Builder {
  pos: number[] = []; nor: number[] = []; part: number[] = []; index: number[] = [];
  /** Per vertex, a leaf card's corner (−1..1) and its seed; zero off the cards. */
  card: number[] = [];
  /**
   * Per vertex, the lobe it belongs to (centre, radius). Radius 0 on cones and the trunk (whose
   * y then holds the fork's height in the unit crown); negative on a limb, the weight with which
   * the vertex follows the lobe the limb leads to.
   */
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
        this.pos.push(l.c[0] + x * l.r, l.c[1] + y * l.ry, l.c[2] + z * l.r);
        const n = new THREE.Vector3(x / l.r, y / l.ry, z / l.r).normalize();
        this.nor.push(n.x, n.y, n.z);
        this.part.push(0);
        this.card.push(0, 0, 0);
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
      this.card.push(0, 0, 0, 0, 0, 0);
    }
    for (let i = 0; i < n; i++) {
      const a = base + i * 2;
      this.index.push(a, a + 1, a + 2);
    }
    // The underside, a flat ring seen from below.
    const hub = this.pos.length / 3;
    this.pos.push(0, y0 + (y1 - y0) * 0.15, 0); this.nor.push(0, -1, 0); this.part.push(0);
    this.lobeOf.push(0, y0, 0, 0);
    this.card.push(0, 0, 0);
    for (let i = 0; i < n; i++) {
      const a = base + i * 2, b = base + (i + 1) * 2;
      this.index.push(hub, b, a);
    }
  }
  /**
   * Leaf clusters over the lobes: square cards of half-size `h` a little outside each lobe's
   * surface, facing out but turned and tipped at random, where no other lobe covers them. Each is
   * drawn from both sides.
   */
  cards(ls: Lobe[], h: number, perArea: number, seed: number) {
    const r = rng(seed);
    const n = new THREE.Vector3(), t = new THREE.Vector3(), b = new THREE.Vector3(), up = new THREE.Vector3();
    const inside = (p: number[], o: Lobe) => {
      const dx = (p[0] - o.c[0]) / o.r, dy = (p[1] - o.c[1]) / o.ry, dz = (p[2] - o.c[2]) / o.r;
      return dx * dx + dy * dy + dz * dz < 0.94;
    };
    ls.forEach((l, li) => {
      const count = Math.round(perArea * 4 * Math.PI * l.r * Math.sqrt(l.r * l.ry));
      for (let i = 0; i < count; i++) {
        // An even spread over the sphere, jittered.
        const y = 1 - 2 * (i + r()) / count, rad = Math.sqrt(Math.max(0, 1 - y * y)), a = i * 2.39996 + r();
        n.set(Math.cos(a) * rad, y, Math.sin(a) * rad);
        const p = [l.c[0] + n.x * l.r * 1.04, l.c[1] + n.y * l.ry * 1.04, l.c[2] + n.z * l.r * 1.04];
        if (ls.some((o, oi) => oi !== li && inside(p, o))) continue;
        // Tip the card off the surface by up to 40°, turn it about its normal at random.
        up.set(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(0.9);
        const f = n.clone().add(up).normalize();
        t.set(-f.z, 0, f.x);
        if (t.lengthSq() < 1e-4) t.set(1, 0, 0);
        t.normalize();
        b.crossVectors(f, t);
        const turn = r() * Math.PI, ct = Math.cos(turn), st = Math.sin(turn);
        const T = t.clone().multiplyScalar(ct).addScaledVector(b, st), B = b.clone().multiplyScalar(ct).addScaledVector(t, -st);
        const s = h * (0.8 + 0.4 * r()), cs = r();
        const base = this.pos.length / 3;
        const nn = new THREE.Vector3(n.x / l.r, n.y / l.ry, n.z / l.r).normalize();
        for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          this.pos.push(p[0] + (T.x * u + B.x * v) * s, p[1] + (T.y * u + B.y * v) * s, p[2] + (T.z * u + B.z * v) * s);
          this.nor.push(nn.x, nn.y, nn.z);
          this.part.push(2);
          this.lobeOf.push(l.c[0], l.c[1], l.c[2], l.r);
          this.card.push(u, v, cs);
        }
        this.index.push(base, base + 1, base + 2, base, base + 2, base + 3, base, base + 2, base + 1, base, base + 3, base + 2);
      }
    });
  }
  /** The trunk: a prism of radius 1 from the ground (y 0) to the fork (y 1), scaled per tree; `fork` is the fork's height in the unit crown. */
  trunk(n: number, fork: number) {
    const base = this.pos.length / 3;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      this.pos.push(c, 0, s, c * 0.7, 1, s * 0.7);
      this.nor.push(c, 0, s, c, 0, s);
      this.part.push(1, 1);
      this.lobeOf.push(0, fork, 0, 0, 0, fork, 0, 0);
      this.card.push(0, 0, 0, 0, 0, 0);
    }
    for (let i = 0; i < n; i++) {
      const a = base + i * 2;
      this.index.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  }
  /**
   * A limb in the unit crown: a tapered tube of `n` sides from the fork to the lobe's centre with
   * a kink at its middle, radius r0 to r1. Its vertices follow the lobe's shift by their weight
   * along the limb, so it stays joined to the lobe the tree's seed moves.
   */
  limb(fork: [number, number, number], l: Lobe, r0: number, r1: number, n: number, kink: [number, number, number]) {
    const a = new THREE.Vector3(...fork), c = new THREE.Vector3(...l.c);
    const m = a.clone().add(c).multiplyScalar(0.5).add(new THREE.Vector3(...kink));
    const dir = c.clone().sub(a).normalize();
    const t = new THREE.Vector3(-dir.z, 0, dir.x);
    if (t.lengthSq() < 1e-4) t.set(1, 0, 0);
    t.normalize();
    const b = new THREE.Vector3().crossVectors(dir, t);
    const base = this.pos.length / 3;
    const rings: [THREE.Vector3, number, number][] = [[a, r0, 0], [m, (r0 + r1) * 0.55, 0.5], [c, r1, 1]];
    for (const [p, r, w] of rings)
      for (let i = 0; i <= n; i++) {
        const ang = (i / n) * Math.PI * 2, cs = Math.cos(ang), sn = Math.sin(ang);
        const nx = t.x * cs + b.x * sn, ny = t.y * cs + b.y * sn, nz = t.z * cs + b.z * sn;
        this.pos.push(p.x + nx * r, p.y + ny * r, p.z + nz * r);
        this.nor.push(nx, ny, nz);
        this.part.push(1);
        this.lobeOf.push(l.c[0], l.c[1], l.c[2], -Math.max(w, 0.001));
        this.card.push(0, 0, 0);
      }
    for (let k = 0; k < 2; k++)
      for (let i = 0; i < n; i++) {
        const p = base + k * (n + 1) + i, q = p + n + 1;
        this.index.push(p, q, p + 1, p + 1, q, q + 1);
      }
  }
}

/** A deterministic scatter of numbers in [0, 1). */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/**
 * Lobes for a crown in the unit ellipsoid (x, z in −1..1, y in −1..1), by kind. No crown is
 * symmetric: a bigger side, and lobes of unequal size, by the seed; the shader moves each lobe
 * again by the tree's own. The `main` lobes are the crown's body: the farther levels of detail,
 * the shadows and the mirror draw those alone, and since they lie within the full crown, the
 * shadow a crown casts on itself never falls where its full geometry is lit.
 */
function lobes(kind: number, seed: number): Lobe[] {
  const r = rng(seed);
  const out: Lobe[] = [];
  const big = r() * Math.PI * 2;
  /** A ring of `n` lobes at distance d, height y (± jitter), radius rad (× the side's favour). */
  const ring = (n: number, d: number, y: number, jy: number, rad: number, jr: number, ry: number, limb: boolean, main: boolean, phase = 0) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + phase + (r() - 0.5) * 0.5;
      const side = 1 + 0.16 * Math.cos(a - big);
      const rr = (rad + r() * jr) * side, dd = d * (0.96 + 0.08 * side);
      out.push({ c: [Math.cos(a) * dd, y + (r() - 0.5) * jy, Math.sin(a) * dd], r: rr, ry: rr * ry, limb, main });
    }
  };
  switch (kind) {
    case Kind.Poplar:
      // A flame: lobes stacked up the axis, narrowing to a point.
      for (let i = 0; i < 8; i++) {
        const t = i / 7;
        const y = -0.72 + t * 1.5;
        const rad = 0.62 * (1 - 0.6 * t * t) * (0.88 + 0.24 * r());
        out.push({ c: [(r() - 0.5) * 0.25, y, (r() - 0.5) * 0.25], r: rad, ry: rad * 1.2, main: i % 2 === 0 || i === 7 });
      }
      return out;
    case Kind.Chestnut:
      // Tiers of flat lobes over a core.
      out.push({ c: [0, 0, 0], r: 0.55, ry: 0.7, main: true });
      ring(5, 0.56, -0.42, 0.12, 0.4, 0.06, 0.66, true, true);
      ring(5, 0.46, 0.08, 0.12, 0.42, 0.06, 0.66, true, false, 0.63);
      ring(3, 0.24, 0.5, 0.06, 0.38, 0.05, 0.7, true, false, 1.2);
      out.push({ c: [0, 0.72, 0], r: 0.32, ry: 0.22, main: true });
      return out;
    case Kind.Fruit:
      // Low and wide, a little open: rounded lobes on the ends of the limbs, gaps between them.
      out.push({ c: [0, 0.05, 0], r: 0.5, ry: 0.46, main: true });
      ring(6, 0.5, -0.02, 0.3, 0.38, 0.1, 0.85, true, true);
      ring(2, 0.26, 0.45, 0.1, 0.36, 0.05, 0.8, true, false, 0.9);
      ring(3, 0.3, -0.5, 0.1, 0.32, 0.04, 0.8, false, false, 1.7);
      return out;
    case Kind.Willow:
      // A dome over a curtain of tall hanging lobes.
      out.push({ c: [0, 0.3, 0], r: 0.55, ry: 0.45, main: true });
      ring(4, 0.32, 0.5, 0.08, 0.4, 0.05, 0.8, true, false);
      ring(7, 0.68, -0.22, 0.2, 0.28, 0.06, 2.5, true, true, 0.4);
      ring(3, 0.4, -0.45, 0.1, 0.3, 0.04, 2.0, false, false, 1.1);
      return out;
    case Kind.Rose:
    case Kind.Shrub: {
      const flat = kind === Kind.Rose ? 0.65 : 0.8;
      out.push({ c: [0, 0.05, 0], r: 0.66, ry: 0.66, main: true });
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + r() * 0.6, d = 0.5 + r() * 0.08, rr = 0.44 + r() * 0.07;
        out.push({ c: [Math.cos(a) * d, (-0.12 + r() * 0.3) * flat, Math.sin(a) * d], r: rr, ry: rr, main: i < 3 });
      }
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 1 + r(), rr = 0.46 + r() * 0.06;
        out.push({ c: [Math.cos(a) * 0.3, 0.5 * flat, Math.sin(a) * 0.3], r: rr, ry: rr, main: i === 0 });
      }
      for (let i = 0; i < 2; i++) {
        const a = r() * Math.PI * 2;
        out.push({ c: [Math.cos(a) * 0.35, -0.48, Math.sin(a) * 0.35], r: 0.4, ry: 0.4 });
      }
      return out;
    }
    default:
      // The lime's dome: a core, a ring round the middle, a few above, a cap, two below; a shoulder
      // where the bigger side is.
      out.push({ c: [0, 0.02, 0], r: 0.6, ry: 0.66, main: true });
      ring(6, 0.5, -0.05, 0.3, 0.4, 0.1, 0.88, true, true);
      ring(4, 0.3, 0.42, 0.14, 0.38, 0.06, 0.85, true, false, 0.7);
      out.push({ c: [(r() - 0.5) * 0.1, 0.6, (r() - 0.5) * 0.1], r: 0.36, ry: 0.3, limb: true, main: true });
      ring(2, 0.38, -0.55, 0.08, 0.32, 0.04, 0.85, true, false, 1.5);
      return out;
  }
}

/** Where a kind's trunk forks, in the unit crown, and its limbs' radii and kink. */
function limbSpec(kind: number): { fork: number; r0: number; r1: number; kink: number } | null {
  switch (kind) {
    case Kind.Fruit: return { fork: -0.72, r0: 0.09, r1: 0.035, kink: 0.16 };
    case Kind.Willow: return { fork: -0.3, r0: 0.06, r1: 0.025, kink: 0.08 };
    case Kind.Chestnut: return { fork: -0.62, r0: 0.055, r1: 0.022, kink: 0.08 };
    case Kind.Broad: return { fork: -0.6, r0: 0.055, r1: 0.022, kink: 0.08 };
    default: return null;
  }
}

/** One kind's geometry: its three levels of detail in one index buffer, the draw range picking between them. */
export function crownGeometry(kind: number): { geom: THREE.BufferGeometry; lod: [number, number][] } {
  const b = new Builder();
  const lod: [number, number][] = [];
  const spec = limbSpec(kind);
  const add = (detail: 0 | 1 | 2, leaves = false) => {
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
      const all = lobes(kind, 11 + kind);
      const ls = detail === 2 ? all : all.filter((l) => l.main);
      for (const l of ls) b.lobe(l, detail);
      // Limbs from the fork to the main lobes, at the two nearest levels.
      if (spec && detail === 2) {
        const r = rng(5 + kind);
        for (const l of ls)
          if (l.limb) b.limb([0, spec.fork, 0], l, spec.r0, spec.r1, 5, [(r() - 0.5) * spec.kink, (r() - 0.5) * spec.kink, (r() - 0.5) * spec.kink]);
      }
      // Leaf clusters; their size in the unit crown (a rose's leaflets are a few centimetres, M10).
      if (leaves) b.cards(ls, kind === Kind.Poplar ? 0.05 : kind === Kind.Rose ? 0.1 : 0.06, kind === Kind.Poplar ? 90 : kind === Kind.Rose ? 60 : 80, 71 + kind);
    }
    b.trunk([3, 4, 6][detail], spec && detail === 2 ? spec.fork : kind === Kind.Fruit ? -0.5 : 0);
    lod.push([start, b.index.length - start]);
  };
  add(2, true);
  add(2);
  add(1);
  add(0);
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(b.nor, 3));
  geom.setAttribute('aPart', new THREE.Float32BufferAttribute(b.part, 1));
  geom.setAttribute('aLobe', new THREE.Float32BufferAttribute(b.lobeOf, 4));
  geom.setAttribute('aCard', new THREE.Float32BufferAttribute(b.card, 3));
  geom.setIndex(b.index);
  return { geom, lod };
}

// ---- Shaders -----------------------------------------------------------------------------------

const NOISE = /* glsl */ `
float praTHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }`;

// Instance data, 12 floats: iA (x, ground y, z, exposure), iB (crown radius, crown half-height,
// crown centre above the ground, trunk radius), iC (colour, kind + seed). The yaw is the seed's.
const INSTANCE_PARS = /* glsl */ `
attribute vec4 iA;
attribute vec4 iB;
attribute vec4 iC;
uniform vec3 uNearCentre;
uniform float uNearR;
float praVHash(float s) { return fract(sin(s * 12.9898 + 4.1) * 43758.5453); }
`;

const MESH_VERT_PARS = /* glsl */ `
${INSTANCE_PARS}
attribute float aPart;
attribute vec4 aLobe;
attribute vec3 aCard;
varying vec3 vCard;
varying float vKind;
varying vec3 vTreeCol;
varying vec3 vUnit;
varying vec3 vCrownN;
varying float vPart;
varying float vSeed;
varying float vExp;
varying float vHeight;
`;

// Each tree moves and resizes its lobes by its own seed, so no two crowns are alike; a limb's
// vertices follow the lobe the limb leads to, by their weight along it.
const LOBE = /* glsl */ `
vec3 praLobeHash(vec3 c, float seed) {
  return fract(sin(vec3(dot(c, vec3(12.9898, 78.233, 37.719)), dot(c, vec3(39.346, 11.135, 83.155)), dot(c, vec3(73.156, 52.235, 9.151))) + seed * vec3(91.7, 53.1, 27.3)) * 43758.5453);
}
vec3 praLobeShift(vec3 c, float seed) { return (praLobeHash(c, seed) - 0.5) * vec3(0.36, 0.24, 0.36); }
vec3 praLobe(vec3 p, vec4 lobe, float seed) {
  if (lobe.w <= 0.0) return p;
  vec3 h = praLobeHash(lobe.xyz, seed);
  vec3 c = lobe.xyz + (h - 0.5) * vec3(0.36, 0.24, 0.36);
  return c + (p - lobe.xyz) * (0.78 + 0.44 * h.y);
}
// How far a kind leans: the orchard trees and the willows most.
float praLeanOf(float kind) {
  return abs(kind - ${Kind.Fruit}.0) < 0.5 ? 0.24 : abs(kind - ${Kind.Willow}.0) < 0.5 ? 0.16 : (abs(kind - ${Kind.Broad}.0) < 0.5 || abs(kind - ${Kind.Chestnut}.0) < 0.5) ? 0.06 : 0.0;
}`;

const MESH_TRANSFORM = /* glsl */ `
float praSeed = fract(iC.w);
float praYaw = praSeed * 6.2832;
float praC = cos(praYaw), praS = sin(praYaw);
mat3 praRot = mat3(praC, 0.0, -praS, 0.0, 1.0, 0.0, praS, 0.0, praC);
vec3 praScale = vec3(iB.x, iB.y, iB.x);
bool praTrunk = aPart > 0.5 && aPart < 1.5 && aLobe.w == 0.0;
vec3 transformed;
if (praTrunk) {
  // From the ground to the fork (or the crown's centre).
  transformed = iA.xyz + praRot * vec3(position.x * iB.w, position.y * (iB.z + aLobe.y * iB.y), position.z * iB.w);
} else {
  vec3 local;
  if (aPart > 0.5 && aPart < 1.5) {
    local = position + praLobeShift(aLobe.xyz, praSeed) * (-aLobe.w);
  } else {
    local = praLobe(position, aLobe, praSeed);
    #ifdef PRA_BUMPS
    // Near, each lobe is lumpy: pushed in and out along its normal by the leaf-clump noise; the
    // leaf cards on it move with it, or they would float off where a lobe is pushed in.
    if (aLobe.w > 0.0) {
      vec3 wp0 = iA.xyz + vec3(0.0, iB.z, 0.0) + praRot * (local * praScale);
      float bump = textureLod(tLeafNoise, wp0 * 0.9 / 8.0, 0.0).r - 0.5;
      local += normal * bump * 0.55 * aLobe.w;
    }
    #endif
  }
  // The crown sways a little with the wind, its top most.
  float ph = praSeed * 6.2832 + uTime * 1.1;
  vec2 sway = vec2(sin(ph), sin(ph * 1.37 + 1.0)) * 0.006 * (local.y + 1.0) * iB.y;
  transformed = iA.xyz + vec3(0.0, iB.z, 0.0) + praRot * (local * praScale) + vec3(sway.x, 0.0, sway.y);
}
// The whole tree leans a little, by its kind and seed.
vec2 praLean = (vec2(praVHash(praSeed * 7.1), praVHash(praSeed * 3.3 + 0.7)) - 0.5) * praLeanOf(floor(iC.w));
transformed.xz += praLean * max(0.0, transformed.y - iA.y);
`;

const MESH_NORMAL = /* glsl */ `
float praSeed0 = fract(iC.w);
float praYaw0 = praSeed0 * 6.2832;
float praC0 = cos(praYaw0), praS0 = sin(praYaw0);
mat3 praRot0 = mat3(praC0, 0.0, -praS0, 0.0, 1.0, 0.0, praS0, 0.0, praC0);
vec3 objectNormal = aPart > 0.5 && aPart < 1.5 && aLobe.w == 0.0 ? praRot0 * normal : normalize(praRot0 * (normal / vec3(iB.x, iB.y, iB.x)));
vTreeCol = iC.rgb;
vUnit = aPart > 0.5 && aPart < 1.5 ? position : praLobe(position, aLobe, praSeed0);
vPart = aPart;
vCard = aCard;
vSeed = praSeed0;
vKind = floor(iC.w);
vExp = iA.w;
vHeight = aPart > 0.5 && aPart < 1.5 && aLobe.w == 0.0 ? position.y * (iB.z + aLobe.y * iB.y) : iB.z + position.y * iB.y;
// Unnormalized: a unit vector interpolated across a coarse lobe's face can pass near zero (where
// the face lies close to the crown's centre), and its normalize went non-finite (8490's mirror).
vCrownN = praRot0 * (vUnit / vec3(iB.x, iB.y, iB.x));
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
varying vec3 vCard;
varying float vSeed;
varying float vExp;
varying float vHeight;
${NOISE}
float praTreeOcc = 1.0;
vec3 praCN = vec3(0.0, 1.0, 0.0);
float praSun = 1.0;
float praLeaf = 0.5;
float praClump = 0.5;
float praDetail = 0.0;
float praMid = 0.0;
float praRoseBloom = 0.0;
float praTrans = 0.0;
uniform float uLensCut;
// The leaf noise is read along turned axes: a value noise thresholded along the world's axes
// showed as square blocks up close (8884).
const mat3 PRA_TURN = mat3(0.8440, 0.4491, -0.2931, -0.2931, 0.8440, 0.4491, 0.4491, -0.2931, 0.8440);
// The sun lights the tops of the leaf clumps and not their hollows, and reaches less far down a
// crown's side than a sphere's shading would; a tree closed in by a wood (exposure 0) is lit on
// its top only. \`up\` is the crown normal's y, \`top\` how high in the crown (−1..1).
float praCanopySun(float clump, float mid, float up, float top, float exposure) {
  float gate = mix(0.85, mix(0.5, 1.1, smoothstep(0.3, 0.72, clump)), mid);
  float side = mix(0.7, 1.0, smoothstep(-0.8, 0.6, up));
  float closed = mix(mix(0.7, 1.0, exposure), 1.0, smoothstep(0.1, 0.8, top));
  return gate * side * closed;
}
`;

// Albedo, leaf texture and the outline's breakup; before the normal is formed. Two scales of
// leaf cluster: half-metre leaves that show near, and two-metre clumps that still show from 500 m.
const FOLIAGE_COLOUR = /* glsl */ `
{
  bool praRose = abs(vKind - ${Kind.Rose}.0) < 0.5;
  bool praWillow = abs(vKind - ${Kind.Willow}.0) < 0.5;
  praCN = normalize(vCrownN + vec3(0.0, 1e-5, 0.0));
  vec3 wp = vPraWorld;
  // A willow's foliage hangs: its noise is read stretched down into streaks.
  vec3 wq = PRA_TURN * (praWillow ? vec3(wp.x, wp.y * 0.28, wp.z) : wp);
  // Metres per pixel here: each scale fades out as it falls under two pixels.
  float mpp = length(fwidth(wp));
  praDetail = 1.0 - smoothstep(0.12, 0.45, mpp * (praRose ? 3.4 : 1.0));
  praMid = 1.0 - smoothstep(0.5, 1.8, mpp);
  #ifdef PRA_CUT
  // Nothing within a few metres of the lens: the near plane would cut a crown into slivers.
  if (length(vViewPosition) < (praRose ? uLensCut : max(5.0, uLensCut))) discard;
  #endif
  float depth = smoothstep(0.25, 0.95, length(vUnit));
  if (vPart > 1.5) {
    // A leaf cluster: a sprig of sixteen small overlapping leaves on the card, pointed ellipses
    // turned at random (a willow's narrow); the rest cut away.
    float cs = vCard.z, top = -1.0, tone = 0.0;
    vec2 leafSize = praWillow ? vec2(0.42, 0.07) : praRose ? vec2(0.24, 0.13) : vec2(0.34, 0.16);
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      vec2 c0 = vec2(praTHash(vec3(cs * 91.0, fi, 1.3)), praTHash(vec3(cs * 91.0, fi, 2.7))) * 1.5 - 0.75;
      float a = praTHash(vec3(cs * 91.0, fi, 4.1)) * 6.2832;
      vec2 d = vCard.xy - c0;
      vec2 e = vec2(cos(a) * d.x + sin(a) * d.y, -sin(a) * d.x + cos(a) * d.y) / (leafSize * (0.8 + 0.4 * praTHash(vec3(cs * 91.0, fi, 9.3))));
      // Narrower toward the tip.
      if (e.x * e.x + e.y * e.y * (1.0 + 0.9 * max(e.x, 0.0)) < 1.0) { top = fi; tone = praTHash(vec3(cs * 91.0, fi, 7.7)); }
    }
    #ifdef PRA_CUT
    if (top < 0.0) discard;
    #endif
    // The sprig sits in the same clumps as the lobe under it: lit on a clump's top, dark in a hollow.
    if (praMid > 0.0) praNm = texture(tLeafNoise, (wq * 0.6 + vSeed * 13.0) / 8.0);
    praClump = mix(0.5, praNm.r, praMid);
    vec3 c = vTreeCol * (0.55 + 0.6 * tone) * (0.8 + 0.4 * praClump);
    // Leaves turned to the light at the top of the crown are lighter and yellower.
    c = mix(c, c * vec3(1.2, 1.2, 0.8), smoothstep(0.65, 1.0, tone) * smoothstep(0.0, 0.8, vUnit.y));
    diffuseColor.rgb = c;
    praLeaf = tone;
    praTreeOcc = mix(0.4, 1.0, depth) * (0.55 + 0.45 * smoothstep(-1.0, 0.7, praCN.y));
    // Each leaf of a sprig is lit or shaded on its own, not by the clump under it.
    praSun = praCanopySun(tone, 1.0, praCN.y, vUnit.y, vExp);
    praTrans = 0.6;
  } else if (vPart > 0.5) {
    // Bark; a fruit tree's trunk whitewashed to a metre, as the orchards' are (8725).
    vec3 bark = vec3(0.075, 0.062, 0.05) * (0.8 + 0.4 * texture(tLeafNoise, wp * 3.0 / 8.0).r);
    if (abs(vKind - ${Kind.Fruit}.0) < 0.5) bark = mix(vec3(0.62, 0.6, 0.54) * (0.85 + 0.3 * texture(tLeafNoise, wp * 5.0 / 8.0).g), bark, smoothstep(0.85, 1.15, vHeight));
    diffuseColor.rgb = bark;
    praTreeOcc = mix(0.5, 1.0, depth);
    praSun = 0.8;
  } else {
    // A rose's leaves are a few centimetres: the same texture, finer. The noise comes from a small
    // tiling 3D texture (four channels: a value and a tilt for the normal), each scale only where it shows.
    float ls = praRose ? 3.4 : 1.0;
    if (praDetail > 0.0) {
      praNd = texture(tLeafNoise, (wq * 2.2 * ls + vSeed * 31.0) / 8.0);
      float leaf2 = texture(tLeafNoise, (wq * 5.1 * ls + 7.0) / 8.0).r;
      praLeaf = mix(0.5, praNd.r * 0.65 + leaf2 * 0.35, praDetail);
      // Close, the leaves themselves: clusters of a decimetre or so, crisp, with dark gaps between.
      praFine = 1.0 - smoothstep(0.012, 0.05, mpp * ls);
      if (praFine > 0.0) {
        praNf = texture(tLeafNoise, (wq * 8.5 * ls + 3.0) / 8.0);
        float cluster = smoothstep(0.44, 0.56, praNf.r * 0.7 + leaf2 * 0.3);
        #ifdef PRA_CUT
        // Gaps between the leaf clusters open onto the lobes behind, darker for their depth: a
        // near crown is leaves with the crown's shade between them, not a skin (8385, 8884).
        if (!praRose && praFine > 0.4 && praNf.g * 0.6 + praNd.g * 0.4 < 0.36) discard;
        #endif
        // A rose bush is dense: its gaps are shallower than a tree's.
        praLeaf = mix(praLeaf, praRose ? 0.35 + 0.55 * cluster : cluster * 0.9 + 0.05, praFine);
      }
    }
    if (praMid > 0.0) {
      praNm = texture(tLeafNoise, (wq * 0.6 + vSeed * 13.0) / 8.0);
      // Close up the leaves carry the texture, and the two-metre clumps only half of it: at full
      // strength they read as camouflage blotches (8385).
      praClump = mix(0.5, praNm.r, praMid * (1.0 - 0.5 * praFine));
    }
    // Holes along each lobe's outline where the clusters thin out.
    #ifdef PRA_CUT
    float facing = abs(dot(normalize(vNormal), normalize(vViewPosition)));
    // The clumps cut deep lobes into the outline, as the photographs' crowns have (8884, 9204).
    float ragged = 0.55 * praLeaf * praDetail + 0.7 * max(0.0, praClump - 0.32) * praMid * (1.0 - 0.5 * praFine) + 0.4 * praFine * (1.0 - praLeaf);
    if (facing < min(ragged, 0.82) * (praRose ? 0.4 : 1.0)) discard;
    // A willow's hem: the fronds end at their own heights.
    if (praWillow && vUnit.y < -0.4 && praNd.r < 0.3 + 0.55 * smoothstep(-0.4, -1.05, vUnit.y)) discard;
    // Near the lens a rose bush opens (M11, 8722): its mass of lobes thins to its lit clusters and
    // then to nothing within two metres, leaving the leaf clusters, the stems, leaves and blooms of
    // src/world/roses.ts, and the sky between them.
    if (praRose && praLeaf < 1.05 * (1.0 - smoothstep(1.8, 4.5, length(vViewPosition)))) discard;
    #endif
    vec3 c = vTreeCol;
    // Near, the leaf clusters stand out more: lit clusters lighter and yellower, the gaps deeper.
    float lc = mix(0.56, 0.9, praFine);
    c *= (1.0 - 0.5 * lc + lc * praLeaf) * (0.62 + 0.76 * praClump * mix(1.0, 0.25, praDetail) + 0.28 * praDetail);
    c = mix(c, c * vec3(1.12, 1.15, 0.85), praFine * smoothstep(0.6, 0.9, praLeaf));
    // Lighter, yellower young growth where a cluster catches the light at the crown's top.
    c = mix(c, c * vec3(1.18, 1.16, 0.9), smoothstep(0.55, 0.95, vUnit.y) * praClump);
    if (praRose) {
      // A rose bush in bloom: flowers of eight to ten centimetres massed on its top and the sides
      // that face out, each with its petals in rings when near.
      vec3 q = wp / 0.085;
      vec3 cell = floor(q);
      vec3 off = vec3(praTHash(cell + 1.7), praTHash(cell + 2.9), praTHash(cell + 4.1)) - 0.5;
      float size = 0.34 + 0.2 * praTHash(cell + 6.3);
      vec3 dq = fract(q) - 0.5 - off * 0.3;
      float rr = length(dq) / size;
      float where = smoothstep(-0.6, 0.5, praCN.y + 0.4 * length(vUnit.xz) - 0.25);
      // Within a few metres the nearest blooms are modelled (src/world/roses.ts); fewer painted.
      float thin = mix(0.4, 1.0, smoothstep(${BLOOM_NEAR}.0, ${BLOOM_FAR - 4}.0, length(vViewPosition)));
      float here = step(praTHash(cell + 0.37), 0.8 * where * thin) * (1.0 - smoothstep(0.85, 1.05, rr));
      float fade = smoothstep(0.015, 0.06, mpp);
      float cover = mix(here, 0.42 * where, fade);
      // Petals round the centre, turning as they go in; darker toward the heart.
      float ang = atan(dq.y + dq.z, dq.x);
      float petals = mix(1.0, (0.8 + 0.2 * cos(ang * 5.0 + rr * 9.0 + praTHash(cell + 3.3) * 6.0)) * (0.78 + 0.22 * smoothstep(0.0, 0.6, rr)), 1.0 - fade);
      c = mix(c, praBloom(wp.xz) * (0.85 + 0.3 * praTHash(cell)) * petals, cover);
      praRoseBloom = cover;
    }
    diffuseColor.rgb = c;
    #ifdef PRA_DBG
    diffuseColor.rgb = vec3(praFine, praDetail, praMid); praSun = 0.0; praTrans = 0.0;
    #endif
    // The sky reaches into a crown less deep down and inside.
    praTreeOcc = mix(0.25, 1.0, depth) * (0.5 + 0.5 * smoothstep(-1.0, 0.7, praCN.y));
    // Near, the leaf clusters carry the light, not the two-metre clumps (which read as camouflage).
    praSun = praCanopySun(mix(praClump, praLeaf, praFine * 0.8), max(praMid, praFine), praCN.y, vUnit.y, vExp);
    praTrans = mix(0.25, 0.7, 1.0 - depth * 0.5) * (1.0 - praRoseBloom);
    // A bush is small and open: the sky's light reaches most of it, and the blooms face it.
    if (praRose) { praTreeOcc = mix(mix(0.55, 1.0, praTreeOcc), 1.0, praRoseBloom); praSun = mix(0.85, 1.0, praRoseBloom); }
    if (abs(vKind - ${Kind.Shrub}.0) < 0.5) praSun = mix(praSun, 1.0, 0.4);
  }
}`;

// The normal: bent toward the crown's, tilted by the clumps and the leaf clusters.
const FOLIAGE_NORMAL = /* glsl */ `
if (vPart < 0.5 || vPart > 1.5) {
  vec3 cn = normalize((viewMatrix * vec4(praCN, 0.0)).xyz);
  normal = normalize(mix(normal, cn, 0.62));
  // Near, the two-metre clumps hardly tilt the normal (they read as camouflage blotches, 8385); the leaves do.
  vec3 tilt = (praNm.gba - 0.5) * 2.0 * praMid * (1.0 - 0.85 * praFine) + (praNd.gba - 0.5) * 1.6 * praDetail * (1.0 - 0.7 * praFine) + (praNf.gba - 0.5) * 2.8 * praFine;
  normal = normalize(normal + (viewMatrix * vec4(tilt, 0.0)).xyz);
}`;

// A crown is mostly its own shadow: the sky's light reaches the outer leaves only, and the sheen
// of the leaves is weak and broken. Leaves pass some light through, so the inside and underside
// of a crown seen against the sky are deep green, not black (9369, 9486); and seen against the
// sun, the leaves at the edge glow with the light through them (8490).
const OCCLUSION = /* glsl */ `#include <lights_fragment_end>
reflectedLight.indirectDiffuse *= (0.5 + 0.5 * praTreeOcc);
reflectedLight.indirectSpecular *= praTreeOcc * praTreeOcc * 0.35;
reflectedLight.directDiffuse *= mix(1.0, praTreeOcc, 0.5) * praSun;
reflectedLight.directSpecular *= 0.4 * praSun;
{
  vec3 praV = normalize(vViewPosition);
  vec3 praL = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
  float praBack = max(0.0, dot(-praV, praL));
  float praThin = 1.0 - abs(dot(normal, praV));
  reflectedLight.directDiffuse += directLight.color * diffuseColor.rgb * vec3(1.0, 1.1, 0.75) * praTrans * praBack * praBack * (0.35 + 0.65 * praThin) * (1.0 - 0.6 * max(0.0, dot(normal, praL)));
}`;

/**
 * The crowns' material. `cut` lets it discard (the ragged outlines near, nothing at the lens): a
 * shader that may discard is shaded under every crown that overlaps it on a tile-based GPU, so
 * the far crowns, whose outlines are smooth anyway, have a material that never does.
 */
function meshMaterial(near: { centre: THREE.Vector3; r: { value: number } }, cut: boolean): { material: THREE.MeshStandardMaterial; depth: THREE.MeshDepthMaterial } {
  const uniforms = { uNearCentre: { value: near.centre }, uNearR: near.r, uLensCut: LENS };
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

// Sprites: a lobed disc facing the camera (or, in a shadow pass, the sun), sized to the ellipsoid's
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
varying float vExp;
`;

const SPRITE_TRANSFORM = /* glsl */ `
vec3 praCentre = iA.xyz + vec3(0.0, iB.z, 0.0);
vec3 praD = isOrthographic ? normalize(vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2])) : normalize(cameraPosition - praCentre);
vec3 praA = normalize(cross(vec3(0.0, 1.0, 0.0), praD));
vec3 praB = cross(praD, praA);
float praUp = praB.y;
float praHa = iB.x, praHb = sqrt(iB.x * iB.x * (1.0 - praUp * praUp) + iB.y * iB.y * praUp * praUp);
// Far away, fewer and bigger crowns: a tree whose key falls above the share kept shrinks away, and
// the rest grow so the canopy covers what it covered (fewer layers of sprites to shade). The trees
// closed in by their neighbours go first, so a wood keeps its outline.
// Distances from the drone (the near set's centre), so the shadows and the mirror thin alike.
float praDist = length(uNearCentre - praCentre);
float praKeep = clamp(pow(1400.0 / max(praDist, 1.0), 1.4), 0.3, 1.0);
float praKey = fract(iC.w) * mix(1.5, 0.7, iA.w);
float praSize = (1.0 - smoothstep(praKeep - 0.12, praKeep, praKey)) / sqrt(praKeep);
vec2 praQ = aCorner * 1.06;
// Pulled toward the camera along the ground only: pulled along the line of sight, a crown that
// reaches the ground sank under it, and under the water in the mirror (8490).
vec3 transformed = praCentre + (praA * praQ.x * praHa + praB * praQ.y * praHb) * praSize + vec3(praD.x, 0.0, praD.z) * iB.x * 0.9;
// Trees of the near set are meshes (and a sprite never draws under the near set's radius).
vec2 praOff = iA.xz - uNearCentre.xz;
if (dot(praOff, praOff) < uNearR * uNearR) transformed = vec3(0.0, -1e5, 0.0);
vQuad = praQ;
vAxA = praA; vAxB = praB; vAxD = praD;
vRadius = iB.x * praSize;
vTreeCol = iC.rgb;
vKind = floor(iC.w);
vSeed = fract(iC.w);
vExp = iA.w;
`;

// The lobed outline, cut from the quad, and the lobe under each pixel for the shading: the union
// of a few discs placed by the seed (a poplar's flame, a conifer's spire, a willow's fountain with
// its streaky hem, a chestnut's tiers). Sets praSub (the lobe's own normal in quad space, z out)
// and praHollow (how deep between lobes the pixel is).
const SPRITE_SHAPE = /* glsl */ `
vec3 praSub = vec3(0.0, 0.0, 1.0);
float praHollow = 0.0;
{
  vec2 q = vQuad;
  float s1 = fract(sin(vSeed * 91.7) * 43758.5), s2 = fract(sin(vSeed * 53.1 + 1.0) * 43758.5), s3 = fract(sin(vSeed * 27.3 + 2.0) * 43758.5);
  float best = -1.0;
  bool inside = false;
  if (abs(vKind - ${Kind.Conifer}.0) < 0.5) {
    float edge = (1.0 - q.y) * 0.55 + 0.08 + 0.04 * sin(q.y * 14.0 + s1 * 6.0);
    inside = abs(q.x) < edge && q.y > -0.98;
    praSub = normalize(vec3(q.x / max(edge, 0.05), 0.35, 0.8));
    praHollow = 0.0;
  } else if (abs(vKind - ${Kind.Poplar}.0) < 0.5) {
    float w = 0.8 * pow(max(0.0, 1.0 - q.y * q.y), 0.35) * (1.0 - 0.55 * smoothstep(0.2, 1.0, q.y)) + 0.06 * sin(q.y * 7.0 + s1 * 6.0) + 0.04 * sin(q.y * 13.0 + s2 * 9.0);
    inside = abs(q.x) < w && abs(q.y) < 0.99;
    praSub = normalize(vec3(q.x / max(w, 0.05), 0.15 + 0.5 * step(0.5, q.y), sqrt(max(0.05, 1.0 - q.x * q.x / max(w * w, 0.01)))));
    praHollow = smoothstep(0.35, 0.65, fract(q.y * 2.5 + s2));
  } else {
    // Up to five discs: the kind lays them out, the seed turns and sizes them.
    vec2 c[5]; vec2 r[5]; int n = 4;
    if (abs(vKind - ${Kind.Chestnut}.0) < 0.5) {
      c[0] = vec2(0.0, -0.45); r[0] = vec2(0.9, 0.42);
      c[1] = vec2(0.06 * (s1 - 0.5), 0.05); r[1] = vec2(0.78, 0.4);
      c[2] = vec2(0.1 * (s2 - 0.5), 0.5); r[2] = vec2(0.56, 0.36);
      c[3] = vec2(0.0, 0.72); r[3] = vec2(0.3, 0.2);
    } else if (abs(vKind - ${Kind.Fruit}.0) < 0.5) {
      c[0] = vec2(0.0, 0.1); r[0] = vec2(0.72, 0.5);
      c[1] = vec2(-0.45 - 0.2 * s1, -0.05); r[1] = vec2(0.42, 0.34);
      c[2] = vec2(0.45 + 0.2 * s2, 0.0); r[2] = vec2(0.4, 0.32);
      c[3] = vec2(0.3 * (s3 - 0.5), 0.5); r[3] = vec2(0.36, 0.3);
    } else if (abs(vKind - ${Kind.Willow}.0) < 0.5) {
      c[0] = vec2(0.0, 0.42); r[0] = vec2(0.74, 0.55);
      c[1] = vec2(0.0, -0.3); r[1] = vec2(0.9, 0.75);
      c[2] = vec2(-0.5, -0.5); r[2] = vec2(0.45, 0.55);
      c[3] = vec2(0.5, -0.5); r[3] = vec2(0.45, 0.55);
    } else {
      float a1 = s1 * 6.2832, a2 = a1 + 2.1 + s2, a3 = a2 + 2.0 + s3;
      c[0] = vec2(0.0, 0.0); r[0] = vec2(0.7, 0.72);
      c[1] = vec2(cos(a1), sin(a1)) * 0.34; r[1] = vec2(0.5, 0.5) * (0.9 + 0.3 * s2);
      c[2] = vec2(cos(a2), sin(a2)) * 0.36; r[2] = vec2(0.45, 0.45) * (0.9 + 0.3 * s3);
      c[3] = vec2(cos(a3), sin(a3)) * 0.32; r[3] = vec2(0.42, 0.42) * (0.9 + 0.3 * s1);
      c[4] = vec2(0.1 * (s2 - 0.5), 0.55); r[4] = vec2(0.42, 0.36); n = 5;
    }
    float ang = atan(q.y, q.x);
    float wobble = 1.0 + 0.05 * sin(ang * 7.0 + vSeed * 60.0) + 0.035 * sin(ang * 11.0 + vSeed * 17.0);
    for (int i = 0; i < 5; i++) {
      if (i >= n) break;
      vec2 d = (q - c[i]) / (r[i] * wobble);
      float d2 = dot(d, d);
      if (d2 < 1.0) {
        inside = true;
        float h = sqrt(1.0 - d2) * min(r[i].x, r[i].y);
        if (h > best) { best = h; praSub = normalize(vec3(d.x, d.y, sqrt(1.0 - d2) * 1.3)); }
      }
    }
    praHollow = 1.0 - smoothstep(0.05, 0.3, best);
    if (abs(vKind - ${Kind.Willow}.0) < 0.5) {
      // The hem: fronds ending at their own heights, in streaks.
      float k = floor((q.x + 1.0) * 7.0 + s1 * 3.0);
      float hem = -1.02 + 0.35 * fract(sin(k * 12.9898 + vSeed * 78.2) * 43758.5);
      if (q.y < hem) inside = false;
      praSub = normalize(vec3(praSub.x * 0.6, praSub.y * 0.3 + 0.1, praSub.z));
    }
  }
  if (!inside) discard;
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
varying float vExp;
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
      .replace('#include <common>', `#include <common>\n${SPRITE_FRAG_PARS}\nfloat praTreeOcc = 1.0;\nfloat praSun = 1.0;\nfloat praTrans = 0.4;\nuniform highp sampler3D tLeafNoise;\nvec3 praSn;\nvec4 praClumpN = vec4(0.5);\nvec3 praClumpT;`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${SPRITE_SHAPE}
{
  // The crown's surface point this pixel stands for, on the ellipsoid, blended with the lobe under
  // it, for the same two-metre clumps the meshes have (while they are more than a pixel or two).
  vec2 q = vQuad;
  float d2 = min(1.0, dot(q, q));
  vec3 whole = normalize(q.x * vAxA + q.y * vAxB + sqrt(max(0.05, 1.0 - d2)) * vAxD);
  vec3 lobe = normalize(praSub.x * vAxA + praSub.y * vAxB + praSub.z * vAxD);
  praSn = normalize(mix(whole, lobe, 0.55));
  float mid = 1.0 - smoothstep(0.5, 1.8, length(fwidth(vPraWorld)));
  if (mid > 0.0) praClumpN = texture(tLeafNoise, (vPraWorld + praSn * vRadius) * 0.6 / 8.0 + vSeed * 1.7);
  float clump = mix(0.5, praClumpN.r, mid);
  praClumpT = (praClumpN.gba - 0.5) * 2.0 * mid;
  vec3 c = vTreeCol * (0.92 + 0.16 * vSeed) * (0.62 + 0.76 * clump) * (1.0 - 0.35 * praHollow);
  // Lighter, yellower growth on the top.
  c = mix(c, c * vec3(1.14, 1.12, 0.9), smoothstep(0.4, 0.95, q.y) * clump);
  diffuseColor.rgb = c;
  praTreeOcc = mix(0.45, 1.0, smoothstep(-0.9, 0.5, q.y)) * mix(1.0, 0.75, d2) * (1.0 - 0.3 * praHollow);
  praSun = mix(0.85, mix(0.5, 1.1, smoothstep(0.3, 0.72, clump)), mid) * mix(0.7, 1.0, smoothstep(-0.8, 0.6, praSn.y)) * mix(mix(0.7, 1.0, vExp), 1.0, smoothstep(0.1, 0.8, q.y)) * (1.0 - 0.35 * praHollow);
  praTrans = 0.45 * (1.0 - 0.5 * praHollow);
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
  [Kind.Fruit]: ['#58703f', '#516640', '#556c43'],
  [Kind.Poplar]: ['#3d4b34', '#384730', '#435339'],
  [Kind.Conifer]: ['#27342b', '#2d3d2d', '#25322d'],
  [Kind.Rose]: ['#44573a', '#3d5134'],
  [Kind.Shrub]: ['#39472f', '#34422c', '#3e4e33'],
  [Kind.Willow]: ['#5b6b48', '#526343', '#5a6a4e'],
  [Kind.Chestnut]: ['#44533c', '#3f4d37', '#4a5c40', '#42523a'],
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
  private roses = new RoseBlooms();

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
          const kind = ks[k * 2] & KIND_MASK, exposure = (ks[k * 2] >> EXPOSURE_SHIFT) / 15, seed = ks[k * 2 + 1] / 256;
          const o = (k - a) * FLOATS;
          const s = shape(kind, h, r, seed);
          data[o] = x; data[o + 1] = height.sample(x, z); data[o + 2] = z; data[o + 3] = exposure;
          data[o + 4] = s.rx; data[o + 5] = s.ry; data[o + 6] = s.cy; data[o + 7] = s.trunk;
          const list = FOLIAGE_LINEAR[kind] ?? FOLIAGE_LINEAR[Kind.Broad];
          col.copy(list[Math.floor(seed * 7919) % list.length]).multiplyScalar(0.9 + 0.2 * ((seed * 37) % 1));
          data[o + 8] = col.r; data[o + 9] = col.g; data[o + 10] = col.b; data[o + 11] = kind + Math.min(seed, 0.999);
        }
        this.tiles.push({ x0: tx, z0: tz, n: b - a, data });
      }

    // Near: per level of detail and kind, a mesh whose instances are rewritten as the camera moves.
    const meshes = [meshMaterial(this.near, true), meshMaterial(this.near, false)];
    const geoms = [Kind.Broad, Kind.Fruit, Kind.Poplar, Kind.Conifer, Kind.Rose, Kind.Shrub, Kind.Willow, Kind.Chestnut].map((k) => crownGeometry(k));
    for (let lod = 0; lod < 4; lod++) {
      const row: Bucket[] = [];
      for (let kind = 0; kind < geoms.length; kind++) {
        const { geom: base, lod: ranges } = geoms[kind];
        const geom = new THREE.InstancedBufferGeometry();
        geom.index = base.index;
        for (const name of ['position', 'normal', 'aPart', 'aLobe', 'aCard']) geom.setAttribute(name, base.getAttribute(name));
        const buffer = new THREE.InstancedInterleavedBuffer(new Float32Array(FLOATS * 64), FLOATS, 1).setUsage(THREE.DynamicDrawUsage);
        instanceAttributes(geom, buffer);
        geom.instanceCount = 0;
        const own = ranges[lod], cheap = ranges[ranges.length - 1];
        geom.setDrawRange(own[0], own[1]);
        const mesh = meshes[lod < 3 ? 0 : 1];
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

    this.group.add(this.roses.group);

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

  /** Whether the nearest trees carry their leaf clusters. */
  leaves = true;

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
    const r1 = NEAR1 * NEAR1, rl = this.leaves ? NEAR_LEAF * NEAR_LEAF : 0, r0 = NEAR0 * NEAR0, rm = NEAR_MID * NEAR_MID;
    const rb = this.leaves ? (BLOOM_FAR + RESORT) ** 2 : 0, bushes: Bush[] = [];
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
        const lod = d2 < rl ? 0 : d2 < r0 ? 1 : d2 < rm ? 2 : 3;
        const kind = Math.floor(d[o + 11]);
        if (kind === Kind.Rose && d2 < rb) bushes.push({ x: d[o], y: d[o + 1], z: d[o + 2], rx: d[o + 4], ry: d[o + 5], cy: d[o + 6], seed: d[o + 11] - kind, d: Math.sqrt(d2) });
        const b = this.buckets[lod][kind];
        if ((b.count + 1) * FLOATS > b.buffer.array.length) grow(b);
        (b.buffer.array as Float32Array).set(d.subarray(o, o + FLOATS), b.count * FLOATS);
        b.count++;
      }
    }
    this.roses.set(bushes);
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
export function shape(kind: number, h: number, r: number, seed: number) {
  let base: number, rx: number;
  switch (kind) {
    case Kind.Fruit:
      // Low, wide, open crowns on a short trunk.
      base = Math.min(1.4, Math.max(0.6, 0.22 * h));
      rx = Math.min(Math.max(r, 0.5 * (h - base)), 0.7 * (h - base));
      break;
    case Kind.Willow:
      // The fronds hang nearly to the ground (or the water).
      base = 0.08 * h;
      rx = Math.min(Math.max(r * 1.05, 0.38 * h), 0.6 * h);
      break;
    case Kind.Chestnut:
      base = h * (0.22 + 0.1 * seed);
      rx = Math.min(Math.max(r * 1.15, 0.35 * (h - base)), 0.9 * (h - base));
      break;
    case Kind.Poplar:
      base = 0.1 * h;
      rx = Math.min(Math.max(r, 0.1 * h), 0.2 * h);
      break;
    case Kind.Rose:
      // Sunk a little into the bed, as a bush stands on its stems among its neighbours.
      return { rx: r, ry: h / 2 + 0.1, cy: h / 2 - 0.1, trunk: 0 };
    case Kind.Shrub:
      // On the bank's edge, hanging a metre and a half down its wall toward the water.
      return { rx: r, ry: h / 2 + 0.75, cy: h / 2 - 0.75, trunk: 0 };
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
  return { rx, ry, cy: base + ry, trunk: (kind === Kind.Fruit ? 0.07 : kind === Kind.Willow ? 0.06 : 0.05) + 0.012 * h };
}
