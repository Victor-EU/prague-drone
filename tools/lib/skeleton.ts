// The straight skeleton of a footprint (CGAL through the `straight-skeleton` package, WebAssembly),
// for the roofs of tools/lib/roofs.ts. Build side only: the app ships the finished roof faces.

import { createRequire } from 'node:module';

export interface Skeleton {
  /** x, z and time (the distance the wavefront travelled to reach the vertex) per vertex. */
  x: Float64Array; z: Float64Array; t: Float64Array;
  /** One face per footprint edge, as vertex indices; input vertices come first, in input order. */
  faces: number[][];
  /** The footprint edge (index into the concatenated rings) that each face rises from. */
  edge: number[];
}

type Builder = { init(): Promise<void>; buildFromPolygon(rings: number[][][]): { vertices: [number, number, number][]; polygons: number[][] } | null };
let builder: Builder | undefined;

export async function initSkeleton() {
  if (builder) return;
  // The package is built for browsers; it only needs these two names to exist.
  const g = globalThis as Record<string, unknown>;
  const had = { self: 'self' in g, window: 'window' in g };
  g.self ??= g;
  g.window ??= g;
  const { SkeletonBuilder } = createRequire(import.meta.url)('straight-skeleton') as { SkeletonBuilder: Builder };
  await SkeletonBuilder.init();
  if (!had.window) delete g.window;
  if (!had.self) delete g.self;
  builder = SkeletonBuilder;
}

/**
 * `rings`: flat [x0, z0, x1, z1, …] lists, the outer ring first, in the local frame (x east, z
 * south). Returns null when CGAL gives up.
 */
export function skeleton(rings: number[][]): Skeleton | null {
  if (!builder) throw new Error('initSkeleton() first');
  // CGAL wants the outer ring counter-clockwise and holes clockwise in a y-up plane. With z south,
  // (x, −z) is that plane.
  const input: number[][][] = [];
  const order: number[][] = []; // per ring, the original vertex index for each input position
  let first = 0;
  rings.forEach((r, k) => {
    const n = r.length / 2;
    let area = 0;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += r[i * 2] * -r[j * 2 + 1] - r[j * 2] * -r[i * 2 + 1];
    }
    const ccw = area > 0;
    const want = k === 0;
    const idx = Array.from({ length: n }, (_, i) => first + (ccw === want ? i : n - 1 - i));
    const pts = idx.map((v) => [rings[k][(v - first) * 2], -rings[k][(v - first) * 2 + 1]]);
    pts.push(pts[0]);
    input.push(pts);
    order.push(idx);
    first += n;
  });
  let out;
  try {
    out = builder.buildFromPolygon(input);
  } catch {
    return null;
  }
  if (!out) return null;
  const N = first;
  const flat = order.flat();
  const nv = out.vertices.length;
  const x = new Float64Array(nv), z = new Float64Array(nv), t = new Float64Array(nv);
  // Output vertices: the input ones first (in input order), then the skeleton's own. Renumber the
  // input ones to the caller's order.
  const map = new Int32Array(nv);
  for (let v = 0; v < nv; v++) map[v] = v < N ? flat[v] : v;
  for (let v = 0; v < nv; v++) {
    const [vx, vy, vt] = out.vertices[v];
    x[map[v]] = vx; z[map[v]] = -vy; t[map[v]] = v < N ? 0 : vt;
  }
  const faces: number[][] = [];
  const edge: number[] = [];
  for (const p of out.polygons) {
    const f = p.map((v) => map[v]);
    // A face lists its edge's end first and its start last (in CGAL's winding).
    const a = f[f.length - 1], b = f[0];
    if (a >= N || b >= N) return null;
    faces.push(f);
    // The caller's edge i runs from vertex i to i + 1 within its ring; CGAL's winding may be the
    // reverse of the caller's, so name the edge by whichever end starts it in the caller's order.
    edge.push(edgeOf(a, b, rings));
  }
  return { x, z, t, faces, edge };
}

/** The index of the ring edge between vertices a and b (both orders), or −1. */
function edgeOf(a: number, b: number, rings: number[][]): number {
  let first = 0;
  for (const r of rings) {
    const n = r.length / 2;
    if (a >= first && a < first + n) {
      const i = a - first, j = b - first;
      if (j === (i + 1) % n) return a;
      if (i === (j + 1) % n) return b;
      return -1;
    }
    first += n;
  }
  return -1;
}
