// Footprints to blocks: walls from base to top and a flat roof (the Tier 3 treatment of
// design.md §7.3). Since M1 the blocks carry the §8.9 palette: roofs by district in the core's
// proportions (terracotta, slate, copper), plaster walls by district, and stand-in colours for the
// landmarks until they are modelled. Runs in the tile worker.

import { ShapeUtils, Vector2 } from 'three';
import landmarkData from '../../data/landmarks.json';

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

// sRGB colours (design.md §8.9). Vertex colours are linear in three.js, so they are converted when written.
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const TERRACOTTA = ['#a46d54', '#b5714f', '#8f5a42', '#c08063', '#9c6a50', '#b87a5c'].map(rgb);
const TERRACOTTA_BRIGHT = ['#b8704a', '#c47a4f', '#b5714f', '#c98458', '#a9684a', '#bf7d5a'].map(rgb);
const TERRACOTTA_WEATHERED = ['#8f5a42', '#9c6a50', '#86604c', '#a46d54', '#7f5a48', '#96654e'].map(rgb);
const SLATE = ['#5e5d55', '#6d6a62', '#4a4d52'].map(rgb);
const COPPER = ['#5f8a7a', '#6f9a88'].map(rgb);
const OTHER = ['#7a6a5a', '#8a7f72'].map(rgb);
const FLAT = ['#6d6a62', '#7d7a74', '#8a8680', '#5e5d55'].map(rgb);
const PLASTER_MALA_STRANA = ['#eaccb3', '#dc9d64', '#cb7655', '#d8b08a', '#e8d6c4', '#c9b79c'].map(rgb);
const PLASTER_OLD_TOWN = ['#e4dddd', '#f2e6da', '#d9c9a8', '#e8d6c4', '#b2c6d8', '#e9c9c6'].map(rgb);
const PLASTER_OUTER = ['#d9c9a8', '#e8d6c4', '#cfc6b8', '#bdb4a6', '#d8b08a', '#c9c3bb', '#a9a49c'].map(rgb);
const BRIDGE = rgb('#a39584');

// Stand-ins for the landmarks until M3 models them: wall and roof.
const LANDMARK_COLOURS: Record<string, [string, string]> = {
  'charles-bridge': ['#8a8074', '#8a8074'],
  'old-town-bridge-tower': ['#857b6f', '#4a4d52'],
  'lesser-town-bridge-towers': ['#857b6f', '#4a4d52'],
  tyn: ['#7d766c', '#3f4247'],
  'old-town-hall': ['#b8a790', '#6d6a62'],
  'st-nicholas': ['#e4dddd', '#5f8a7a'],
  'st-vitus': ['#858075', '#56806f'],
  'petrin-tower': ['#6d5a4a', '#6d5a4a'],
  strahov: ['#e8d6c4', '#a46d54'],
  'vysehrad-basilica': ['#8a8074', '#4a5a52'],
  'leopold-gate': ['#b07a5a', '#8f5a42'],
  'dancing-house': ['#d9d4ca', '#8a8a86'],
  'national-theatre': ['#d9c9a8', '#3f4a55'],
  'sitkov-tower': ['#e4d6c0', '#4a4d52'],
  'smetana-museum': ['#cdbfa6', '#5e5d55'],
  'st-francis': ['#d4c7b0', '#5f8a7a'],
  'klementinum-tower': ['#d9c9a8', '#5e5d55'],
  rudolfinum: ['#d9c9a8', '#7a6f60'],
  'powder-tower': ['#5a554e', '#4a4d52'],
  'national-museum': ['#d9c9a8', '#5f7d74'],
  'letna-metronome': ['#3a3a3a', '#3a3a3a'],
  'zizkov-tower': ['#b8b8b8', '#b8b8b8'],
  'legion-bridge': ['#b0a590', '#b0a590'],
  'manes-bridge': ['#cdc6b8', '#cdc6b8'],
  'cechuv-bridge': ['#3f5a52', '#8a8680'],
  'jiraskuv-bridge': ['#cdc6b8', '#cdc6b8'],
  'palacky-bridge': ['#a09584', '#a09584'],
  'railway-bridge': ['#4f4a44', '#4f4a44'],
  'stefanik-bridge': ['#c0bab0', '#c0bab0'],
};
const LANDMARKS = (landmarkData as { landmarks: { id: string }[] }).landmarks.map((l) => {
  const c = LANDMARK_COLOURS[l.id] ?? ['#d9c9a8', '#6d6a62'];
  return { wall: rgb(c[0]), roof: rgb(c[1]) };
});

type District = 'malaStrana' | 'josefov' | 'vysehrad' | 'core' | 'outer';

function district(x: number, north: number): District {
  if (x < -150 && x > -1900 && north > -900 && north < 900) return 'malaStrana';
  if (x > 350 && x < 900 && north > 200 && north < 620) return 'josefov';
  if (north < -1500 && north > -3200 && x > 0 && x < 1400) return 'vysehrad';
  if (x > -150 && x < 1800 && north > -1500 && north < 800) return 'core';
  return 'outer';
}

function pick<T>(list: T[], u: number): T { return list[Math.min(list.length - 1, Math.floor(u * list.length))]; }

/** Roof and wall colours of an ordinary building, from its district, size and a hash. */
function palette(d: District, area: number, height: number, h1: number, h2: number, h3: number) {
  const walls = d === 'malaStrana' ? PLASTER_MALA_STRANA : d === 'outer' ? PLASTER_OUTER : PLASTER_OLD_TOWN;
  const wall = pick(walls, h1);
  // Big or tall buildings outside the old quarters have flat roofs.
  const flat = (d === 'outer' || d === 'core') && (area > 2500 || height > 32);
  if (flat && h2 < 0.8) return { wall, roof: pick(FLAT, h3) };
  const terracotta = d === 'vysehrad' ? TERRACOTTA_BRIGHT : d === 'malaStrana' ? TERRACOTTA_WEATHERED : TERRACOTTA;
  // Core proportions (design.md §8.1): terracotta 78%, slate 14%, copper 5%, other 3%.
  const [t, s, c] = d === 'josefov' ? [0.6, 0.35, 0.03] : d === 'outer' ? [0.6, 0.36, 0.01] : [0.78, 0.14, 0.05];
  const roof = h2 < t ? pick(terracotta, h3) : h2 < t + s ? pick(SLATE, h3) : h2 < t + s + c ? pick(COPPER, h3) : pick(OTHER, h3);
  return { wall, roof };
}

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

/** `ox`, `oz`: the pack origin in the world, for the districts. */
export function extrude(f: Footprints, kinds: { bridge: number; box: number }, seed = 0, ox = 0, oz = 0): BlockBuffers {
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
    const tone = 0.94 + hash(b * 7919 + seed) * 0.1;
    const r0 = f.ring[b], r1 = f.ring[b + 1];
    // Centroid and area of the outer ring.
    let cx = 0, cz = 0, area = 0;
    {
      const s = f.vert[r0], e = f.vert[r0 + 1], n = e - s;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const ax = f.xy[(s + i) * 2] / 10, az = f.xy[(s + i) * 2 + 1] / 10, bx = f.xy[(s + j) * 2] / 10, bz = f.xy[(s + j) * 2 + 1] / 10;
        const cr = ax * bz - bx * az;
        area += cr; cx += (ax + bx) * cr; cz += (az + bz) * cr;
      }
      if (Math.abs(area) > 1e-6) { cx /= 3 * area; cz /= 3 * area; }
      area = Math.abs(area) / 2;
    }
    const lm = f.landmark[b];
    let wallC: number[], roofC: number[];
    if (lm >= 0 && LANDMARKS[lm]) ({ wall: wallC, roof: roofC } = LANDMARKS[lm]);
    else if (kind === kinds.bridge) wallC = roofC = BRIDGE;
    else {
      const id = b * 7919 + seed * 104729;
      ({ wall: wallC, roof: roofC } = palette(district(ox + cx, -(oz + cz)), area, top - base, hash(id + 1), hash(id + 2), hash(id + 3)));
    }
    const c = wallC;
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
    for (const p of all) push(p.x, top, p.y, 0, 1, 0, roofC, tone);
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
