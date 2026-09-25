// Footprints to blocks: walls from base to top and a flat roof (the Tier 3 treatment of
// design.md §7.3, and the grey blocks of milestone M0). Runs in the tile worker.

import { ShapeUtils, Vector2 } from 'three';

export interface Footprints {
  ring: Uint32Array; // per building, first ring index; length count + 1
  vert: Uint32Array; // per ring, first vertex index; length rings + 1
  xy: Int16Array; // decimetres relative to the pack origin
  base: Int16Array; // decimetres
  top: Int16Array; // decimetres
  landmark: Int8Array;
  kind: Uint8Array;
}

export interface BlockBuffers {
  position: Float32Array;
  normal: Float32Array;
  color: Uint8Array;
  index: Uint32Array;
}

// sRGB colours. Vertex colours are linear in three.js, so they are converted when written.
const GREY = [188, 182, 172];
const LANDMARK = [222, 164, 104];
const BRIDGE = [160, 150, 136];

const LINEAR = new Uint8Array(256).map((_, i) => {
  const c = i / 255;
  return Math.round(255 * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
});

function hash(n: number): number {
  n = (n ^ 61) ^ (n >>> 16);
  n = (n + (n << 3)) | 0;
  n ^= n >>> 4;
  n = Math.imul(n, 0x27d4eb2d);
  n ^= n >>> 15;
  return (n >>> 0) / 4294967296;
}

export function extrude(f: Footprints, kinds: { bridge: number; box: number }, seed = 0): BlockBuffers {
  const count = f.ring.length - 1;
  // Upper bound on sizes: every ring vertex gives 4 wall vertices and 1 roof vertex.
  const nv = f.xy.length / 2;
  const position = new Float32Array(nv * 5 * 3);
  const normal = new Float32Array(nv * 5 * 3);
  const color = new Uint8Array(nv * 5 * 3);
  const index: number[] = [];
  let v = 0;

  const push = (x: number, y: number, z: number, nx: number, ny: number, nz: number, c: number[], shade: number) => {
    position[v * 3] = x; position[v * 3 + 1] = y; position[v * 3 + 2] = z;
    normal[v * 3] = nx; normal[v * 3 + 1] = ny; normal[v * 3 + 2] = nz;
    color[v * 3] = LINEAR[Math.min(255, Math.round(c[0] * shade))];
    color[v * 3 + 1] = LINEAR[Math.min(255, Math.round(c[1] * shade))];
    color[v * 3 + 2] = LINEAR[Math.min(255, Math.round(c[2] * shade))];
    return v++;
  };

  for (let b = 0; b < count; b++) {
    const base = f.base[b] / 10, top = f.top[b] / 10;
    if (top - base < 0.5) continue;
    const kind = f.kind[b];
    const tone = 0.92 + hash(b * 7919 + seed) * 0.14;
    const c = kind === kinds.bridge ? BRIDGE : f.landmark[b] >= 0 || kind === kinds.box ? LANDMARK : GREY;
    const r0 = f.ring[b], r1 = f.ring[b + 1];
    const contour: Vector2[] = [];
    const holes: Vector2[][] = [];
    for (let r = r0; r < r1; r++) {
      const s = f.vert[r], e = f.vert[r + 1], n = e - s;
      if (n < 3) continue;
      let area = 0;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += (f.xy[(s + i) * 2] * f.xy[(s + j) * 2 + 1] - f.xy[(s + j) * 2] * f.xy[(s + i) * 2 + 1]);
      }
      const isHole = r > r0;
      const outward = (isHole ? -1 : 1) * Math.sign(area || 1);
      const pts: Vector2[] = [];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const ax = f.xy[(s + i) * 2] / 10, az = f.xy[(s + i) * 2 + 1] / 10;
        const bx = f.xy[(s + j) * 2] / 10, bz = f.xy[(s + j) * 2 + 1] / 10;
        pts.push(new Vector2(ax, az));
        const len = Math.hypot(bx - ax, bz - az);
        if (len < 1e-3) continue;
        const nx = (outward * (bz - az)) / len, nz = (outward * -(bx - ax)) / len;
        // Walls darken toward the ground: a cheap stand-in for ambient occlusion.
        const a0 = push(ax, base, az, nx, 0, nz, c, tone * 0.62);
        const b0 = push(bx, base, bz, nx, 0, nz, c, tone * 0.62);
        const b1 = push(bx, top, bz, nx, 0, nz, c, tone * 0.9);
        const a1 = push(ax, top, az, nx, 0, nz, c, tone * 0.9);
        if (outward > 0) index.push(a0, a1, b1, a0, b1, b0);
        else index.push(a0, b1, a1, a0, b0, b1);
      }
      if (isHole) holes.push(pts); else contour.push(...pts);
    }
    if (contour.length < 3) continue;
    const faces = ShapeUtils.triangulateShape(contour, holes);
    const all = contour.concat(...holes);
    const first = v;
    for (const p of all) push(p.x, top, p.y, 0, 1, 0, c, tone);
    for (const [a, b2, c2] of faces) {
      const pa = all[a], pb = all[b2], pc = all[c2];
      // Roofs face up: clockwise in x–z.
      const cross = (pb.x - pa.x) * (pc.y - pa.y) - (pb.y - pa.y) * (pc.x - pa.x);
      if (cross < 0) index.push(first + a, first + b2, first + c2);
      else index.push(first + a, first + c2, first + b2);
    }
  }
  return {
    position: position.slice(0, v * 3),
    normal: normal.slice(0, v * 3),
    color: color.slice(0, v * 3),
    index: new Uint32Array(index),
  };
}
