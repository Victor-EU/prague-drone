// Roses close up (design.md §8.4, M10): within a few metres of the camera the blooms on the rose
// bushes are modelled, not painted: rings of cupped petals, the inner ones closed round the heart
// and darker, the outer ones open with their lips turned out, on a stem with sepals and two leaves,
// facing out and up from the bush, as 8722's roses stand against the sky. Only near: the drone
// never comes within 15 m of the ground, so on the route this costs nothing; the painted blooms of
// src/world/trees.ts carry the bushes from a few metres on. The colours are the painted ones',
// one variety to a stretch of bed.

import * as THREE from 'three';
import { patchLit } from '../sky/lit.ts';

/** Within these distances a bush's blooms are modelled, the nearest in full. */
export const BLOOM_NEAR = 3, BLOOM_FAR = 12;
const NEAR_MAX = 2048, FAR_MAX = 8192;

interface Ring { n: number; r0: number; r1: number; h: number; flare: number; w: number; tone: number; close?: number }

// From the heart out: petals per ring, radius at the base and at the lip, height, how far the lip
// turns out, the angle a petal spans, and how light it is (the heart is in its own shade).
const RINGS: Ring[] = [
  // The heart: petals wrapped round each other in a spiral and closed over it, a high centre.
  { n: 3, r0: 0.003, r1: 0.012, h: 0.046, flare: 0, w: 2.6, tone: 0.95, close: 0.011 },
  { n: 3, r0: 0.005, r1: 0.017, h: 0.049, flare: 0, w: 2.4, tone: 0.95, close: 0.01 },
  { n: 4, r0: 0.007, r1: 0.021, h: 0.05, flare: 0.002, w: 2.0, tone: 0.95, close: 0.006 },
  // The cup.
  { n: 5, r0: 0.009, r1: 0.027, h: 0.046, flare: 0.007, w: 1.7, tone: 0.93 },
  { n: 5, r0: 0.012, r1: 0.034, h: 0.046, flare: 0.01, w: 1.55, tone: 0.95 },
  // The outer petals, opening, their tips rolled back.
  { n: 6, r0: 0.015, r1: 0.042, h: 0.042, flare: 0.014, w: 1.35, tone: 0.97 },
  { n: 6, r0: 0.018, r1: 0.048, h: 0.032, flare: 0.02, w: 1.25, tone: 1.0 },
];

/** One bloom, facing +y with its base at the origin; `full` with finer petals and every ring. */
function bloomGeometry(full: boolean): THREE.BufferGeometry {
  const pos: number[] = [], col: number[] = [], uv: number[] = [], idx: number[] = [];
  const S = full ? 8 : 3, T = full ? 6 : 2;
  const rings = full ? RINGS : RINGS.slice(2).filter((_, i) => i !== 1);
  rings.forEach((g, ri) => {
    for (let i = 0; i < g.n; i++) {
      // Each ring turned by the golden angle from the last: the petals overlap in a spiral.
      const c = (i / g.n) * Math.PI * 2 + ri * 2.4;
      // Each petal its own shade, so the folds between them show.
      const own = 0.8 + 0.2 * Math.abs(Math.sin(ri * 7.1 + i * 3.7));
      const base = pos.length / 3;
      for (let b = 0; b <= T; b++)
        for (let a = 0; a <= S; a++) {
          const s = (a / S) * 2 - 1, t = b / T;
          // Narrow at the base, broad at the lip, and cupped: the middle of a petal bellies out
          // past its edges. The open petals' lips turn out and down, their edges rolled back a
          // little further, to a soft point (8722; M11, where M10's came to spikes).
          const th = c + s * (g.w / 2) * (0.55 + 0.45 * Math.sin((t * Math.PI) / 2));
          const cup = 0.011 * (g.r1 / 0.048) * (1 - s * s) * Math.sin(t * Math.PI * 0.85);
          const rho = g.r0 + (g.r1 - g.r0) * t - (g.close ?? 0) * t * t + g.flare * t * t * t * (1 + 0.5 * s * s) + cup;
          // The lip rolls back over the last third, its edges most (a hybrid tea's reflexed petal).
          const roll = Math.max(0, t - 0.6) / 0.4;
          const y = g.h * t - g.flare * 0.8 * t ** 4 - 0.22 * g.h * s * s * t * t - 0.12 * g.h * roll * roll * (0.4 + Math.abs(s));
          pos.push(rho * Math.cos(th), y, rho * Math.sin(th));
          // Deep in the cup a petal is in its neighbours' shade; its lip catches the light, and the
          // rolled edge more, a little paler and oranger where it thins (8722).
          // The heart's petals are lit through the ones round them: lighter, a little pinker.
          const heart = g.close ? 1.15 : 1;
          const k = own * g.tone * heart * (0.45 + 0.55 * t ** 0.9) * (1 - 0.12 * s * s) * (1 + 0.18 * roll * Math.abs(s));
          col.push(k, k * (0.85 + 0.25 * roll) * (g.close ? 1.2 : 1), k * (0.85 + 0.1 * t) * (g.close ? 1.3 : 1));
          uv.push(s, t);
        }
      for (let b = 0; b < T; b++)
        for (let a = 0; a < S; a++) {
          const p = base + b * (S + 1) + a, q = p + S + 1;
          idx.push(p, p + 1, q + 1, p, q + 1, q);
        }
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** The green under a bloom: its stem down into the bush, five sepals, and three leaves of five leaflets. */
function greenGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const paint = (g: THREE.BufferGeometry, r: number, gr: number, b: number) => {
    const n = g.getAttribute('position').count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = r; a[i * 3 + 1] = gr; a[i * 3 + 2] = b; }
    g.setAttribute('color', new THREE.Float32BufferAttribute(a, 3));
    return g;
  };
  parts.push(paint(new THREE.CylinderGeometry(0.0035, 0.005, 0.5, 5, 1, true).translate(0, -0.25, 0), 0.035, 0.055, 0.025));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([0.004, 0.002, -0.004, 0.004, 0.002, 0.004, 0.03, -0.012, 0], 3));
    parts.push(paint(g.rotateY(a), 0.03, 0.05, 0.022));
  }
  // A leaflet: a pointed oval, folded a little along its midrib, from its stalk along +x.
  const leaflet = (len: number) => {
    const w = len * 0.32, g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0, 0, len * 0.35, 0.002, w, len * 0.35, 0.002, -w, len * 0.4, -0.003, 0, len, 0, 0,
    ], 3));
    g.setIndex([0, 3, 1, 0, 2, 3, 3, 4, 1, 3, 2, 4]);
    return g.toNonIndexed();
  };
  for (const [y, a, k] of [[-0.09, 0.3, 1], [-0.2, 2.6, 1.15], [-0.33, 4.6, 1.25]] as const) {
    // A rose's leaf: a stalk out from the stem and a little up, a leaflet at its end and two pairs
    // along it, a few centimetres each, darker and glossier than the bush's mass seen from afar.
    const L = 0.1 * k, tone = 0.8 + 0.2 * Math.sin(a * 5);
    const leaf: THREE.BufferGeometry[] = [paint(new THREE.CylinderGeometry(0.0012, 0.0015, L, 3, 1, true).rotateZ(-Math.PI / 2).translate(L / 2, 0, 0), 0.03, 0.045, 0.022)];
    leaf.push(paint(leaflet(0.045 * k).translate(L, 0, 0), 0.03 * tone, 0.05 * tone, 0.022 * tone));
    for (const [at, side] of [[0.45, 1], [0.45, -1], [0.8, 1], [0.8, -1]] as const)
      leaf.push(paint(leaflet(0.038 * k).rotateY((side * Math.PI) / 3).translate(L * at, 0, 0), 0.028 * tone, 0.047 * tone, 0.02 * tone));
    for (const g of leaf) parts.push(g.rotateZ(0.35).rotateY(a).translate(0, y, 0));
  }
  const pos: number[] = [], col: number[] = [];
  for (const p of parts) {
    const g = p.index ? p.toNonIndexed() : p;
    pos.push(...(g.getAttribute('position').array as Float32Array));
    col.push(...(g.getAttribute('color').array as Float32Array));
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  out.computeVertexNormals();
  return out;
}

// The varieties of src/world/blooms.ts, on the CPU.
const fract = (x: number) => x - Math.floor(x);
function bhash(x: number, y: number) {
  let qx = fract(x * 0.1031), qy = fract(y * 0.1031), qz = qx;
  const d = qx * (qy + 33.33) + qy * (qz + 33.33) + qz * (qx + 33.33);
  qx += d; qy += d; qz += d;
  return fract((qx + qy) * qz);
}
function bnoise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const a = bhash(ix, iy), b = bhash(ix + 1, iy), c = bhash(ix, iy + 1), d = bhash(ix + 1, iy + 1);
  return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fy;
}
function bloomColour(x: number, z: number, out: THREE.Color) {
  const v = bnoise(x * 0.18 + 11, z * 0.18 + 11);
  return v < 0.5 ? out.setRGB(0.58, 0.035, 0.028) : v < 0.68 ? out.setRGB(0.7, 0.07, 0.004) : v < 0.86 ? out.setRGB(0.66, 0.24, 0.3) : out.setRGB(0.8, 0.76, 0.7);
}

/** A rose bush near the camera: where it stands, its crown's radii and centre height, its seed. */
export interface Bush { x: number; y: number; z: number; rx: number; ry: number; cy: number; seed: number; d: number }

export class RoseBlooms {
  readonly group = new THREE.Group();
  private meshes: { near: THREE.InstancedMesh; green: THREE.InstancedMesh; far: THREE.InstancedMesh } | null = null;

  /** Puts blooms on the bushes given (those within BLOOM_FAR of the camera). */
  set(bushes: Bush[]) {
    if (!bushes.length && !this.meshes) return;
    const m = this.meshes ?? this.create();
    let nn = 0, nf = 0;
    const M = new THREE.Matrix4(), q = new THREE.Quaternion(), spin = new THREE.Quaternion(), s = new THREE.Vector3();
    const p = new THREE.Vector3(), n = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), c = new THREE.Color();
    for (const b of bushes) {
      const near = b.d < BLOOM_NEAR;
      // About twenty blooms to a square metre of the bush's top and outer sides, fewer farther off,
      // where the painted ones fill in between.
      const count = Math.round(Math.PI * 2 * b.rx * b.rx * (near ? 22 : 12));
      let r = Math.floor(b.seed * 2147483646) + 1 + Math.floor(Math.abs(b.x * 131 + b.z * 71)) % 1000;
      const rnd = () => ((r = (r * 16807) % 2147483647) - 1) / 2147483646;
      for (let i = 0; i < count; i++) {
        if (near ? nn >= NEAR_MAX : nf >= FAR_MAX) break;
        const yN = 1 - 1.15 * rnd() ** 1.4, ph = rnd() * Math.PI * 2, rr = Math.sqrt(Math.max(0, 1 - yN * yN));
        const dx = rr * Math.cos(ph), dz = rr * Math.sin(ph);
        // The lobes reach the ellipsoid's sides but only about four fifths of its top.
        n.set(dx / b.rx, yN / (0.82 * b.ry), dz / b.rx).normalize();
        p.set(b.x + dx * b.rx, b.y + b.cy + yN * 0.82 * b.ry, b.z + dz * b.rx).addScaledVector(n, 0.03 + 0.03 * rnd());
        // Turned out as much as up, each its own way: from beside the bush some show their cups
        // and some their profiles (8722; M11, where M10's all faced the sky).
        n.y += 0.45;
        n.x += (rnd() - 0.5) * 0.9; n.z += (rnd() - 0.5) * 0.9;
        n.normalize();
        q.setFromUnitVectors(up, n);
        spin.setFromAxisAngle(up, rnd() * Math.PI * 2);
        q.multiply(spin);
        const k = 1.0 + 0.3 * rnd();
        M.compose(p, q, s.set(k, k, k));
        bloomColour(b.x, b.z, c).multiplyScalar(0.85 + 0.3 * rnd());
        if (near) {
          m.near.setMatrixAt(nn, M); m.near.setColorAt(nn, c); m.green.setMatrixAt(nn, M);
          nn++;
        } else {
          m.far.setMatrixAt(nf, M); m.far.setColorAt(nf, c);
          nf++;
        }
      }
    }
    m.near.count = nn; m.green.count = nn; m.far.count = nf;
    for (const x of [m.near, m.green, m.far]) {
      x.visible = x.count > 0;
      x.instanceMatrix.needsUpdate = true;
      if (x.instanceColor) x.instanceColor.needsUpdate = true;
    }
  }

  private create() {
    // M11: lit as petals, not paint. The sky's light is its own, not raised; the sheen is velvet,
    // weak and never white; and light passes through a petal lit from behind only, deeper red for
    // it, so the side toward the sun is lit and the other glows (8722).
    // Across each petal (uv: s from edge to edge, t from base to lip): its base in shadow where it
    // leaves the one below, faint veins along it, and the thin edge of the lip paler, so each
    // petal shows as its own surface over the next (8722).
    const petals = patchLit(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, side: THREE.DoubleSide }), (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vPetal;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPetal = uv;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vPetal;')
        .replace('#include <color_fragment>', `#include <color_fragment>
{
  float s = abs(vPetal.x), t = vPetal.y;
  float veins = 1.0 - 0.07 * pow(abs(sin(vPetal.x * 9.0 + t * 1.5)), 6.0) * smoothstep(0.1, 0.5, t);
  float base = mix(0.55, 1.0, smoothstep(0.0, 0.35, t));
  float lip = smoothstep(0.75, 1.0, max(s, t)) * smoothstep(0.55, 0.9, t);
  diffuseColor.rgb *= veins * base * (1.0 + 0.22 * lip);
  diffuseColor.g += 0.012 * lip;
}`)
        .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
reflectedLight.indirectDiffuse *= 1.1;
reflectedLight.indirectSpecular *= 0.25;
reflectedLight.directSpecular *= 0.35;
#if NUM_DIR_LIGHTS > 0
reflectedLight.directDiffuse += diffuseColor.rgb * diffuseColor.rgb * 1.6 * directionalLights[0].color * praSunVisibility(vPraWorld) * 0.55 * max(-dot(normal, directionalLights[0].direction), 0.0) * RECIPROCAL_PI;
#endif`);
    }, '-petals');
    const green = patchLit(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, side: THREE.DoubleSide }));
    const make = (g: THREE.BufferGeometry, mat: THREE.Material, n: number, colours: boolean) => {
      const x = new THREE.InstancedMesh(g, mat, n);
      if (colours) x.setColorAt(0, new THREE.Color(1, 1, 1));
      x.count = 0;
      x.frustumCulled = false;
      x.receiveShadow = true;
      this.group.add(x);
      return x;
    };
    this.meshes = {
      near: make(bloomGeometry(true), petals, NEAR_MAX, true),
      green: make(greenGeometry(), green, NEAR_MAX, false),
      far: make(bloomGeometry(false), petals, FAR_MAX, true),
    };
    return this.meshes;
  }
}
