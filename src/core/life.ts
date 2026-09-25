// City life (design.md §8.8): the constants shared by the world build (tools/lib/life.ts), which
// lays out where things move, and the app (src/life/), which moves them.

/** Where people walk. The app sets how many walk in each, by the hour. */
export const Zone = {
  /** Charles Bridge. */
  Bridge: 0,
  /** Old Town Square. */
  Square: 1,
  /** The Royal Route between them and on to Malá Strana: Karlova, Celetná, Mostecká. */
  Lanes: 2,
  /** Kampa's park and its riverside. */
  Kampa: 3,
  /** The quays: Náplavka, the Old Town quay, the Smíchov quay. */
  Quay: 4,
  /** The paths of Petřín's gardens. */
  Petrin: 5,
} as const;

export const TRAM = {
  /** Cruising speed, 30 km/h. */
  speed: 30 / 3.6,
  /** Acceleration and braking, m/s². */
  accel: 1.0,
  /** Sideways acceleration in curves, m/s². */
  lateral: 0.9,
  /** Seconds at each stop. */
  dwell: 10,
  /** Seconds between two trams of one line in one direction. */
  headway: 180,
};

/** Metres between the river's stations. */
export const RIVER_STEP = 10;

/**
 * life.bin, a PRAH pack (src/core/pack.ts). Arrays:
 *   tram      per point of every tram run: x, y, z, and t, the seconds a tram takes from the run's
 *             start (a stop is two points at one place, 10 s apart); runs listed in meta.trams
 * tram, walk and road are packed runs (packRuns below): int16 steps from each run's first point.
 *   river     per station of the Vltava's centreline, every RIVER_STEP m downstream: x, z, the water's
 *             level y, the water's width to the left and to the right (facing downstream)
 *   bank      metres to the bank (or a weir) over the middle of the river, 5 m cells (meta.bank)
 *   level     the water's level over the same cells, centimetres (int16; -32768 off the water)
 *   walk      per point of every walking path: x, y, z; paths listed in meta.walks
 *   road      per point of every lane of the embankment roads, in the direction of travel: x, y, z;
 *             lanes listed in meta.roads
 */
export interface LifeMeta {
  trams: { line: string; start: number; count: number; first: number[]; phase: number; headway: number; stops: number }[];
  river: { count: number; pools: [number, number][]; weirs: [number, number][]; marks: Record<string, number> };
  bank: { x0: number; z0: number; cell: number; nx: number; nz: number };
  walks: { zone: number; start: number; count: number; first: number[]; width: number }[];
  roads: { start: number; count: number; first: number[] }[];
  /** Groups of swans: x, y, z, how many. */
  swans: number[][];
  /** Flocks of pigeons: x, y, z, how many. */
  pigeons: number[][];
  /** Boats moored at the quays: x, y, z, heading (radians clockwise from north), length, kind. */
  moored: number[][];
  /** The pedal boat pontoon: x, y, z, heading, length. */
  pontoon: number[];
}

/** Steps per metre (x, y, z) and per second (t) of the packed runs. */
export const SCALE = { tram: [10, 100, 10, 10], walk: [10, 100, 10], road: [10, 100, 10] };

/**
 * Runs of points (`scales.length` values each), quantized and coded as int16 steps from the point
 * before: small numbers that compress well. Each run's first point (quantized) goes to the meta.
 */
export function packRuns(runs: number[][], scales: number[]): { data: Int16Array; starts: number[]; first: number[][] } {
  const n = scales.length, total = runs.reduce((a, r) => a + r.length, 0);
  const data = new Int16Array(total), starts: number[] = [], first: number[][] = [];
  let k = 0;
  for (const r of runs) {
    starts.push(k / n);
    const q0 = scales.map((sc, c) => Math.round(r[c] * sc));
    first.push(q0);
    const prev = q0.slice();
    for (let i = 0; i < r.length; i += n)
      for (let c = 0; c < n; c++) {
        const q = Math.round(r[i + c] * scales[c]), d = q - prev[c];
        if (d > 32767 || d < -32768) throw new Error(`packRuns: step ${d} too long`);
        data[k++] = d;
        prev[c] = q;
      }
  }
  return { data, starts, first };
}

/** One run of packRuns back as values: `count` points from point `start`. */
export function unpackRun(data: Int16Array, start: number, count: number, first: number[], scales: number[]): Float32Array {
  const n = scales.length, out = new Float32Array(count * n), acc = first.slice();
  for (let i = 0; i < count; i++)
    for (let c = 0; c < n; c++) {
      acc[c] += data[(start + i) * n + c];
      out[i * n + c] = acc[c] / scales[c];
    }
  return out;
}
