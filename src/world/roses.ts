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
  { n: 3, r0: 0.003, r1: 0.012, h: 0.046, flare: 0, w: 2.6, tone: 0.8, close: 0.011 },
  { n: 3, r0: 0.005, r1: 0.017, h: 0.049, flare: 0, w: 2.4, tone: 0.84, close: 0.01 },
  { n: 4, r0: 0.007, r1: 0.021, h: 0.05, flare: 0.002, w: 2.0, tone: 0.86, close: 0.006 },
  // The cup.
  { n: 5, r0: 0.009, r1: 0.027, h: 0.046, flare: 0.007, w: 1.7, tone: 0.86 },
  { n: 5, r0: 0.012, r1: 0.034, h: 0.046, flare: 0.01, w: 1.55, tone: 0.92 },
  // The outer petals, opening, their tips rolled back.
  { n: 6, r0: 0.015, r1: 0.042, h: 0.042, flare: 0.014, w: 1.35, tone: 0.97 },
  { n: 6, r0: 0.018, r1: 0.048, h: 0.032, flare: 0.02, w: 1.25, tone: 1.0 },
];

/** One bloom, facing +y with its base at the origin; `full` with finer petals and every ring. */
function bloomGeometry(full: boolean): THREE.BufferGeometry {
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const S = full ? 6 : 3, T = full ? 5 : 2;
  const rings = full ? RINGS : RINGS.slice(2).filter((_, i) => i !== 1);
  rings.forEach((g, ri) => {
    for (let i = 0; i < g.n; i++) {
      // Each ring turned by the golden angle from the last: the petals overlap in a spiral.
      const c = (i / g.n) * Math.PI * 2 + ri * 2.4;
      // Each petal its own shade, so the folds between them show.
      const own = 0.86 + 0.14 * Math.abs(Math.sin(ri * 7.1 + i * 3.7));
      const base = pos.length / 3;
      for (let b = 0; b <= T; b++)
        for (let a = 0; a <= S; a++) {
          const s = (a / S) * 2 - 1, t = b / T;
          // Narrow at the base, wide at the lip; cupped across; the open petals' lips turned out
          // and down, their edges rolled back further, so each comes to a point (8722).
          const th = c + s * (g.w / 2) * (0.55 + 0.45 * Math.sin((t * Math.PI) / 2));
          const rho = g.r0 + (g.r1 - g.r0) * t - (g.close ?? 0) * t * t + g.flare * t * t * t * (1 + 0.8 * s * s) + 0.002 * (1 - s * s);
          const y = g.h * t - g.flare * 0.8 * t ** 4 - 0.28 * g.h * Math.abs(s) * t * t;
          pos.push(rho * Math.cos(th), y, rho * Math.sin(th));
          const k = own * g.tone * (0.7 + 0.3 * t) * (1 - 0.08 * s * s);
          col.push(k, k, k);
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
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** The green under a bloom: its stem into the bush, five sepals and two leaves. */
function greenGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const paint = (g: THREE.BufferGeometry, r: number, gr: number, b: number) => {
    const n = g.getAttribute('position').count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = r; a[i * 3 + 1] = gr; a[i * 3 + 2] = b; }
    g.setAttribute('color', new THREE.Float32BufferAttribute(a, 3));
    return g;
  };
  parts.push(paint(new THREE.CylinderGeometry(0.0035, 0.0045, 0.32, 5, 1, true).translate(0, -0.16, 0), 0.035, 0.055, 0.025));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([0.004, 0.002, -0.004, 0.004, 0.002, 0.004, 0.03, -0.012, 0], 3));
    parts.push(paint(g.rotateY(a), 0.03, 0.05, 0.022));
  }
  for (const [y, a] of [[-0.1, 0.3], [-0.19, 2.7]] as const) {
    // A leaf: a pointed oval a few centimetres long, out from the stem and a little up.
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([
      0.004, 0, 0, 0.03, 0.006, 0.014, 0.03, 0.006, -0.014, 0.065, 0.016, 0,
    ], 3));
    g.setIndex([0, 1, 2, 1, 3, 2]);
    parts.push(paint(g.toNonIndexed().rotateY(a).translate(0, y, 0), 0.03, 0.05, 0.024));
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
  return v < 0.5 ? out.setRGB(0.58, 0.035, 0.028) : v < 0.68 ? out.setRGB(0.62, 0.04, 0.012) : v < 0.86 ? out.setRGB(0.66, 0.24, 0.3) : out.setRGB(0.8, 0.76, 0.7);
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
        // Turned up more than out: from beside the bush they show their profile (8722).
        n.y += 1.1;
        n.x += (rnd() - 0.5) * 0.5; n.z += (rnd() - 0.5) * 0.5;
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
    // Petals take light through them: the sun lights a petal from either side, and the sky
    // reaches down into the heart more than its occlusion says.
    const petals = patchLit(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide }), (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
reflectedLight.indirectDiffuse *= 1.5;
#if NUM_DIR_LIGHTS > 0
reflectedLight.directDiffuse += diffuseColor.rgb * directionalLights[0].color * praSunVisibility(vPraWorld) * 0.3 * abs(dot(normal, directionalLights[0].direction)) * RECIPROCAL_PI;
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
