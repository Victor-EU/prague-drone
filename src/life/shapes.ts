// A small builder for the city's moving things (design.md §8.8): flat-shaded solids with a colour,
// a glow (windows lit at night) and a tint (how much the instance's colour applies) per vertex, and
// for birds which vertices are wing. Every face is wound from a hint of which way is out.

import * as THREE from 'three';
import { REFLECT } from '../render/reflection.ts';

export type V3 = [number, number, number];
export type RGB = [number, number, number];
export type Outline = [number, number][]; // plan points x, z

/** An sRGB hex colour as the linear values the vertex colours take. */
export const rgb = (h: string): RGB => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };

export class Shape {
  private p: number[] = [];
  private n: number[] = [];
  private c: number[] = [];
  private g: number[] = [];
  private t: number[] = [];
  private w: number[] = [];
  /** Applied to the faces added from now on. */
  glow = 0;
  tint = 0;
  wing = 0;

  /** A triangle, turned round if its face points against `out`. */
  tri(a: V3, b: V3, c: V3, col: RGB, out: V3) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz);
    if (l < 1e-9) return;
    nx /= l; ny /= l; nz /= l;
    if (nx * out[0] + ny * out[1] + nz * out[2] < 0) { [b, c] = [c, b]; nx = -nx; ny = -ny; nz = -nz; }
    for (const v of [a, b, c]) {
      this.p.push(v[0], v[1], v[2]);
      this.n.push(nx, ny, nz);
      this.c.push(col[0], col[1], col[2]);
      this.g.push(this.glow);
      this.t.push(this.tint);
      this.w.push(this.wing);
    }
  }

  quad(a: V3, b: V3, c: V3, d: V3, col: RGB, out: V3) {
    this.tri(a, b, c, col, out);
    this.tri(a, c, d, col, out);
  }

  box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, col: RGB, bottom = false) {
    this.prism([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], y0, y1, () => col);
    this.lid([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], y1, col, 1);
    if (bottom) this.lid([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], y0, col, -1);
  }

  /** A square beam from a to b, `w` wide. */
  beam(a: V3, b: V3, w: number, col: RGB) {
    const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
    const u = Math.abs(d.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const s = new THREE.Vector3().crossVectors(d, u).normalize().multiplyScalar(w / 2);
    const t = new THREE.Vector3().crossVectors(s, d).normalize().multiplyScalar(w / 2);
    const corner = (p: V3, i: number): V3 => {
      const cs = [[1, 1], [-1, 1], [-1, -1], [1, -1]][i];
      return [p[0] + s.x * cs[0] + t.x * cs[1], p[1] + s.y * cs[0] + t.y * cs[1], p[2] + s.z * cs[0] + t.z * cs[1]];
    };
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, ca = corner(a, i), cb = corner(a, j), cc = corner(b, j), cd = corner(b, i);
      const m = corner([0, 0, 0], i), q = corner([0, 0, 0], j);
      this.quad(ca, cb, cc, cd, col, [m[0] + q[0], m[1] + q[1], m[2] + q[2]]);
    }
  }

  /** Walls round an outline from y0 to y1; `col` picks each edge's colour from its middle. */
  prism(o: Outline, y0: number, y1: number, col: (mx: number, mz: number, i: number) => RGB) {
    this.band(o, y0, o, y1, col);
  }

  /** A band from outline `a` at y0 to outline `b` (as many points) at y1, facing out from the middle. */
  band(a: Outline, y0: number, b: Outline, y1: number, col: (mx: number, mz: number, i: number) => RGB) {
    let cx = 0, cz = 0;
    for (const [x, z] of a) { cx += x; cz += z; }
    cx /= a.length; cz /= a.length;
    for (let i = 0; i < a.length; i++) {
      const j = (i + 1) % a.length;
      const mx = (a[i][0] + a[j][0]) / 2, mz = (a[i][1] + a[j][1]) / 2;
      const up = y1 > y0 && (b[i][0] - a[i][0]) ** 2 + (b[i][1] - a[i][1]) ** 2 > 1e-6 ? 0.6 : 0;
      this.quad([a[i][0], y0, a[i][1]], [a[j][0], y0, a[j][1]], [b[j][0], y1, b[j][1]], [b[i][0], y1, b[i][1]], col(mx, mz, i), [mx - cx, up, mz - cz]);
    }
  }

  /** A flat lid over an outline, facing up (1) or down (-1). */
  lid(o: Outline, y: number, col: RGB, dir: 1 | -1) {
    let cx = 0, cz = 0;
    for (const [x, z] of o) { cx += x; cz += z; }
    cx /= o.length; cz /= o.length;
    for (let i = 0; i < o.length; i++) {
      const j = (i + 1) % o.length;
      this.tri([cx, y, cz], [o[i][0], y, o[i][1]], [o[j][0], y, o[j][1]], col, [0, dir, 0]);
    }
  }

  /** An ellipsoid, `seg` round and `rings` from pole to pole. */
  ellipsoid(c: V3, r: V3, col: RGB, seg = 8, rings = 5) {
    const pt = (i: number, k: number): V3 => {
      const th = (Math.PI * k) / rings, ph = (2 * Math.PI * i) / seg;
      return [c[0] + r[0] * Math.sin(th) * Math.cos(ph), c[1] + r[1] * Math.cos(th), c[2] + r[2] * Math.sin(th) * Math.sin(ph)];
    };
    for (let k = 0; k < rings; k++)
      for (let i = 0; i < seg; i++) {
        const a = pt(i, k), b = pt(i + 1, k), d = pt(i + 1, k + 1), e = pt(i, k + 1);
        const m: V3 = [(a[0] + d[0]) / 2 - c[0], (a[1] + d[1]) / 2 - c[1], (a[2] + d[2]) / 2 - c[2]];
        if (k === 0) this.tri(a, d, e, col, m);
        else if (k === rings - 1) this.tri(a, b, d, col, m);
        else this.quad(a, b, d, e, col, m);
      }
  }

  get triangles() { return this.p.length / 9; }

  geometry(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setAttribute('aGlow', new THREE.Float32BufferAttribute(this.g, 1));
    g.setAttribute('aTint', new THREE.Float32BufferAttribute(this.t, 1));
    if (this.w.some((v) => v)) g.setAttribute('aWing', new THREE.Float32BufferAttribute(this.w, 1));
    g.computeBoundingSphere();
    return g;
  }
}

/** A rounded-end plan: `len` along x, `wid` along z, ends bulging `nose` (front, +x) and `tail` (back) metres. */
export function capsulePlan(len: number, wid: number, nose: number, tail: number, sides: number[] = []): Outline {
  const o: Outline = [];
  const h = wid / 2, n = 6;
  const end = (x: number, depth: number, s: number) => {
    for (let k = 0; k <= n; k++) {
      const a = -Math.PI / 2 + (Math.PI * k) / n;
      const c = Math.cos(a), sn = Math.sin(a);
      o.push([x + s * depth * Math.sign(c) * Math.abs(c) ** 0.7, s * -h * Math.sign(sn) * Math.abs(sn) ** 0.5]);
    }
  };
  // Right side (z = +h) from back to front, then the nose, the left side, the tail.
  const xs = [-len / 2 + tail, ...sides.filter((x) => x > -len / 2 + tail && x < len / 2 - nose).sort((a, b) => a - b), len / 2 - nose];
  for (const x of xs.slice(1, -1)) o.push([x, h]);
  end(len / 2 - nose, nose, 1);
  for (const x of xs.slice(1, -1).reverse()) o.push([x, -h]);
  end(-len / 2 + tail, tail, -1);
  return o;
}

/** An outline pulled in by `d` toward its middle line (x kept, z scaled; the ends pulled in along x). */
export function inset(o: Outline, dx: number, dz: number): Outline {
  let x0 = Infinity, x1 = -Infinity, h = 0;
  for (const [x, z] of o) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); h = Math.max(h, Math.abs(z)); }
  const cx = (x0 + x1) / 2, hx = (x1 - x0) / 2;
  return o.map(([x, z]) => [cx + (x - cx) * (hx - dx) / hx, (z * (h - dz)) / h]);
}

const pose = new THREE.Matrix4();
/** Sets instance `i` of `mesh` at a place, its +x along (dx, dz) (unit), scaled along its own axes. */
export function setPose(mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number, dx: number, dz: number, sx = 1, sy = 1, sz = 1) {
  pose.set(dx * sx, 0, -dz * sz, x, 0, sy, 0, y, dz * sx, 0, dx * sz, z, 0, 0, 0, 1);
  mesh.setMatrixAt(i, pose);
}

/** A seeded generator, 0 to 1. */
export function rng(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

/** An instanced mesh for the city's life: no culling (instances are filled near the eye), shadows, and in the river's mirror if asked. */
export function lifeMesh(g: THREE.BufferGeometry, m: THREE.Material, n: number, opts: { shadow?: boolean; reflect?: boolean } = {}): THREE.InstancedMesh {
  const im = new THREE.InstancedMesh(g, m, n);
  im.count = 0;
  im.frustumCulled = false;
  im.castShadow = !!opts.shadow;
  im.receiveShadow = true;
  if (opts.reflect) im.layers.enable(REFLECT);
  return im;
}

/** Marks an instanced mesh's matrices (and colours) for upload, only as many as are drawn. */
export function commit(mesh: THREE.InstancedMesh) {
  const n = Math.max(1, mesh.count);
  mesh.instanceMatrix.clearUpdateRanges();
  mesh.instanceMatrix.addUpdateRange(0, n * 16);
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.clearUpdateRanges();
    mesh.instanceColor.addUpdateRange(0, n * 3);
    mesh.instanceColor.needsUpdate = true;
  }
  const flap = mesh.geometry.getAttribute('aFlap') as THREE.InstancedBufferAttribute | undefined;
  if (flap) {
    flap.clearUpdateRanges();
    flap.addUpdateRange(0, n * 4);
    flap.needsUpdate = true;
  }
}
