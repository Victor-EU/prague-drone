// City life (design.md §8.8), build side: where things move; the app (src/life/) moves them.
//
//   trams     OSM's tram routes, the day lines, each direction as runs of track through the world:
//             every point with the time a tram takes to reach it (30 km/h, slower in curves, 10 s at
//             each stop), and a phase per run so that trams of lines sharing a track keep apart
//   river     the Vltava's centreline every 10 m, re-centred on its channel, with the level and the
//             width either side; the weirs across it and the pools between them
//   bank      the distance to the bank over the middle of the river, for boats and swans to steer by
//   walks     the paths people walk, by zone; roads, the lanes of the embankment roads
//   spots     swans, pigeons, the boats moored at the quays, the pedal boat pontoon
//
// See src/core/life.ts for the pack's layout.

import type { OsmElement, Polygon, Tags } from './osm.ts';
import { lineOf, features, pointInPolygon } from './osm.ts';
import { lonToX, latToZ } from '../../src/core/geo.ts';
import type { Weir } from './river.ts';
import { encodePack } from '../../src/core/pack.ts';
import { Zone, TRAM, RIVER_STEP, SCALE, packRuns, type LifeMeta } from '../../src/core/life.ts';

export interface LifeInput {
  railways: OsmElement[];
  stops: OsmElement[];
  highways: OsmElement[];
  landuse: OsmElement[];
  water: OsmElement[];
  /** The world build's 5 m node grid: water mask and water level. */
  grid: { x0: number; z0: number; cell: number; nx: number; nz: number };
  wet: Uint8Array;
  level: Float32Array;
  weirs: Weir[];
  ground: (x: number, z: number) => number;
  /** Height of a track or road: on a bridge's deck or on the ground; NaN outside the world or over water without a deck. */
  track: (x: number, z: number, onBridge: boolean) => number;
  /** The top of a bridge's deck, NaN off the decks. */
  deck: (x: number, z: number) => number;
  log: (...a: unknown[]) => void;
}

type Line = number[]; // x0, z0, x1, z1, …

const reversed = (l: Line): Line => { const r: Line = []; for (let k = l.length - 2; k >= 0; k -= 2) r.push(l[k], l[k + 1]); return r; };
const same = (ax: number, az: number, bx: number, bz: number) => Math.abs(ax - bx) < 0.5 && Math.abs(az - bz) < 0.5;
const lengthOf = (l: Line) => { let s = 0; for (let k = 0; k + 3 < l.length; k += 2) s += Math.hypot(l[k + 2] - l[k], l[k + 3] - l[k + 1]); return s; };
/** Deterministic noise from a string or numbers. */
function hash(...v: (number | string)[]): number {
  let h = 2166136261;
  for (const x of v) for (const c of String(x)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  return ((h ^ (h >>> 12)) >>> 0) / 4294967296;
}
/** A small seeded generator. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

/** Joins lines that meet end to start (turning a line round where that makes it meet), in their order. */
function chainInOrder<P extends { line: Line }>(pieces: P[]): P[][] {
  const chains: P[][] = [];
  let cur: P[] = [];
  for (const p of pieces) {
    if (p.line.length < 4) continue;
    if (!cur.length) { cur.push(p); continue; }
    const last = cur[cur.length - 1].line, ex = last[last.length - 2], ez = last[last.length - 1];
    const l = p.line, n = l.length;
    if (same(l[0], l[1], ex, ez)) cur.push(p);
    else if (same(l[n - 2], l[n - 1], ex, ez)) { p.line = reversed(l); cur.push(p); }
    else if (cur.length === 1 && (same(l[0], l[1], last[0], last[1]) || same(l[n - 2], l[n - 1], last[0], last[1]))) {
      cur[0].line = reversed(last);
      if (!same(l[0], l[1], last[0], last[1])) p.line = reversed(l);
      cur.push(p);
    } else { chains.push(cur); cur = [p]; }
  }
  if (cur.length) chains.push(cur);
  return chains;
}

/** Joins lines at shared ends, whichever way they are drawn (for paths, which have no direction). */
function chainAll(lines: Line[]): Line[] {
  const left = lines.filter((l) => l.length >= 4);
  const out: Line[] = [];
  while (left.length) {
    let cur = left.pop()!;
    for (let grown = true; grown; ) {
      grown = false;
      for (let i = 0; i < left.length; i++) {
        const l = left[i], n = l.length, m = cur.length;
        if (same(l[0], l[1], cur[m - 2], cur[m - 1])) cur = cur.concat(l.slice(2));
        else if (same(l[n - 2], l[n - 1], cur[m - 2], cur[m - 1])) cur = cur.concat(reversed(l).slice(2));
        else if (same(l[n - 2], l[n - 1], cur[0], cur[1])) cur = l.concat(cur.slice(2));
        else if (same(l[0], l[1], cur[0], cur[1])) cur = reversed(l).concat(cur.slice(2));
        else continue;
        left.splice(i, 1);
        grown = true;
        break;
      }
    }
    out.push(cur);
  }
  return out;
}

/** Points along a chain no more than `step` apart, each with the height `y` gives its piece (NaN breaks it). */
function densify<P extends { line: Line }>(chain: P[], step: number, y: (x: number, z: number, p: P) => number): number[][] {
  const runs: number[][] = [];
  let cur: number[] = [];
  const put = (x: number, z: number, p: P) => {
    const h = y(x, z, p);
    if (Number.isNaN(h)) { if (cur.length) runs.push(cur); cur = []; return; }
    cur.push(x, h, z);
  };
  chain.forEach((p, pi) => {
    const l = p.line;
    for (let k = 0; k + 3 < l.length; k += 2) {
      const ax = l[k], az = l[k + 1], bx = l[k + 2], bz = l[k + 3];
      const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / step));
      for (let q = pi > 0 && k === 0 ? 1 : 0; q < n; q++) put(ax + ((bx - ax) * q) / n, az + ((bz - az) * q) / n, p);
    }
    if (pi === chain.length - 1) put(l[l.length - 2], l[l.length - 1], p);
  });
  if (cur.length) runs.push(cur);
  return runs;
}

/** Cumulative distance along x, y, z points (horizontal). */
function distances(p: number[]): number[] {
  const s = [0];
  for (let k = 3; k < p.length; k += 3) s.push(s[s.length - 1] + Math.hypot(p[k] - p[k - 3], p[k + 2] - p[k - 1]));
  return s;
}

/** A hash grid of points for nearest lookups. */
class Cells<T> {
  private m = new Map<number, T[]>();
  private size: number;
  constructor(size: number) { this.size = size; }
  add(x: number, z: number, v: T) { const k = this.key(Math.floor(x / this.size), Math.floor(z / this.size)); (this.m.get(k) ?? this.m.set(k, []).get(k)!).push(v); }
  near(x: number, z: number, f: (v: T) => void) {
    const gx = Math.floor(x / this.size), gz = Math.floor(z / this.size);
    for (let i = gx - 1; i <= gx + 1; i++) for (let j = gz - 1; j <= gz + 1; j++) for (const v of this.m.get(this.key(i, j)) ?? []) f(v);
  }
  private key(i: number, j: number) { return (i + 50000) * 100000 + j + 50000; }
}

// ---- Trams --------------------------------------------------------------------------------------

interface Run { line: string; rel: number; pts: number[]; s: number[] }

/** The day lines' routes as runs of track, both directions of each line, variants dropped. */
function tramRoutes(input: LifeInput): Run[] {
  const DAY = /^(?:[1-9]|1\d|2[0-6])$/;
  const ways = new Map<number, Tags>();
  for (const el of input.railways) if (el.type === 'way' && el.tags?.railway === 'tram') ways.set(el.id, el.tags);
  const under = (t: Tags) => t.tunnel === 'yes' || t.location === 'underground' || t.covered === 'yes';
  const byLine = new Map<string, { rel: number; runs: Run[]; len: number }[]>();
  for (const rel of input.railways) {
    if (rel.type !== 'relation' || rel.tags?.route !== 'tram' || !DAY.test(rel.tags.ref ?? '')) continue;
    const pieces: { line: Line; bridge: boolean; ok: boolean }[] = [];
    for (const m of rel.members ?? []) {
      if (m.type !== 'way' || !ways.has(m.ref) || !m.geometry || /platform|stop/.test(m.role)) continue;
      const t = ways.get(m.ref)!;
      const line: Line = [];
      for (const g of m.geometry) if (g) line.push(lonToX(g.lon), latToZ(g.lat));
      pieces.push({ line, bridge: !!t.bridge && t.bridge !== 'no', ok: !under(t) });
    }
    const runs: Run[] = [];
    for (const chain of chainInOrder(pieces))
      for (const pts of densify(chain, 3, (x, z, p) => (p.ok ? input.track(x, z, p.bridge) : NaN))) {
        const s = distances(pts);
        if (s[s.length - 1] >= 80) runs.push({ line: rel.tags.ref, rel: rel.id, pts, s });
      }
    const len = runs.reduce((a, r) => a + r.s[r.s.length - 1], 0);
    if (!runs.length) continue;
    (byLine.get(rel.tags.ref) ?? byLine.set(rel.tags.ref, []).get(rel.tags.ref)!).push({ rel: rel.id, runs, len });
  }
  // Each line once each way: the longest route, and the longest that runs against it.
  const out: Run[] = [];
  for (const [, rels] of byLine) {
    rels.sort((a, b) => b.len - a.len);
    const a = rels[0];
    out.push(...a.runs);
    const cells = new Cells<[number, number, number, number]>(10);
    for (const r of a.runs)
      for (let k = 3; k < r.pts.length; k += 9) cells.add(r.pts[k], r.pts[k + 2], [r.pts[k], r.pts[k + 2], r.pts[k] - r.pts[k - 3], r.pts[k + 2] - r.pts[k - 1]]);
    for (const b of rels.slice(1)) {
      let along = 0, against = 0;
      for (const r of b.runs)
        for (let k = 3; k < r.pts.length; k += 30) {
          const x = r.pts[k], z = r.pts[k + 2], dx = x - r.pts[k - 3], dz = z - r.pts[k - 1];
          let best = 12, dot = 0;
          cells.near(x, z, ([px, pz, ex, ez]) => {
            const d = Math.hypot(px - x, pz - z);
            if (d < best) { best = d; dot = (dx * ex + dz * ez) / (Math.hypot(dx, dz) * Math.hypot(ex, ez) || 1); }
          });
          if (best < 12) dot > 0 ? along++ : against++;
        }
      if (against > along) { out.push(...b.runs); break; }
    }
  }
  return out;
}

/** Seconds from a run's start to each point, and the stops (point indices) on it. */
function tramTiming(r: Run, stops: Cells<[number, number]>): { t: number[]; stops: number[] } {
  const n = r.s.length, p = r.pts;
  // Stops: stop positions on this track, one per 20 m.
  const at: number[] = [];
  for (let i = 0; i + 1 < n; i++) {
    const ax = p[i * 3], az = p[i * 3 + 2], bx = p[i * 3 + 3], bz = p[i * 3 + 5];
    stops.near(ax, az, ([x, z]) => {
      const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1e-9;
      const u = ((x - ax) * ex + (z - az) * ez) / l2;
      if (u < 0 || u > 1 || Math.hypot(ax + ex * u - x, az + ez * u - z) > 2) return;
      const k = u < 0.5 ? i : i + 1;
      if (k > 3 && (!at.length || r.s[k] - r.s[at[at.length - 1]] > 20)) at.push(k);
    });
  }
  // Speed limits: the cruise, curves (the heading's change over 9 m either side), zero at the stops.
  const vmax = new Float64Array(n);
  const head = (i: number, j: number) => Math.atan2(p[j * 3] - p[i * 3], p[j * 3 + 2] - p[i * 3 + 2]);
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 3), b = Math.min(n - 1, i + 3);
    let v = TRAM.speed;
    if (b - a >= 4 && i > a && i < b) {
      let dh = Math.abs(head(i, b) - head(a, i));
      if (dh > Math.PI) dh = 2 * Math.PI - dh;
      const ds = r.s[b] - r.s[a];
      if (dh > 1e-3) v = Math.min(v, Math.max(2.5, Math.sqrt(TRAM.lateral * (ds / dh))));
    }
    vmax[i] = v;
  }
  for (const k of at) vmax[k] = 0;
  const v = Float64Array.from(vmax);
  for (let i = 1; i < n; i++) v[i] = Math.min(v[i], Math.sqrt(v[i - 1] ** 2 + 2 * TRAM.accel * (r.s[i] - r.s[i - 1])));
  for (let i = n - 2; i >= 0; i--) v[i] = Math.min(v[i], Math.sqrt(v[i + 1] ** 2 + 2 * TRAM.accel * (r.s[i + 1] - r.s[i])));
  const t = [0];
  for (let i = 1; i < n; i++) t.push(t[i - 1] + (r.s[i] - r.s[i - 1]) / Math.max(0.3, (v[i] + v[i - 1]) / 2));
  return { t, stops: at };
}

function trams(input: LifeInput, meta: LifeMeta): Int16Array {
  const stops = new Cells<[number, number]>(10);
  for (const el of input.stops) if (el.type === 'node' && el.lat !== undefined && el.lon !== undefined) stops.add(lonToX(el.lon), latToZ(el.lat), [lonToX(el.lon), latToZ(el.lat)]);
  const runs = tramRoutes(input);
  const H = TRAM.headway;
  // Timing, with each stop's dwell as a second point at the same place.
  const timed = runs.map((r) => {
    const { t, stops: at } = tramTiming(r, stops);
    const pts: number[] = [];
    let extra = 0, j = 0;
    for (let i = 0; i < r.s.length; i++) {
      pts.push(r.pts[i * 3], r.pts[i * 3 + 1], r.pts[i * 3 + 2], t[i] + extra);
      if (at[j] === i) { extra += TRAM.dwell; j++; pts.push(r.pts[i * 3], r.pts[i * 3 + 1], r.pts[i * 3 + 2], t[i] + extra); }
    }
    return { r, pts, stops: at.length };
  });
  // Phases: longest runs first, each at the middle of the widest gap the runs already placed leave
  // on the tracks it shares with them (same place, same direction).
  timed.sort((a, b) => b.pts.length - a.pts.length);
  const placed = new Cells<{ x: number; z: number; dx: number; dz: number; t: number }>(10);
  let worst = H;
  const phases = timed.map((run) => {
    const own: { x: number; z: number; dx: number; dz: number; t: number }[] = [];
    const deltas: number[] = [];
    const p = run.pts;
    for (let k = 4; k < p.length; k += 16) {
      const x = p[k], z = p[k + 2], dx = x - p[k - 4], dz = z - p[k - 2], l = Math.hypot(dx, dz);
      if (l < 0.1) continue;
      own.push({ x, z, dx: dx / l, dz: dz / l, t: p[k + 3] });
      placed.near(x, z, (q) => {
        if (Math.hypot(q.x - x, q.z - z) < 2.5 && q.dx * dx / l + q.dz * dz / l > 0.8) deltas.push((((q.t - p[k + 3]) % H) + H) % H);
      });
    }
    let phase = hash(run.r.line, run.r.rel) * H;
    if (deltas.length) {
      const d = [...new Set(deltas.map((v) => Math.round(v * 2) / 2))].sort((a, b) => a - b);
      let gap = -1;
      for (let i = 0; i < d.length; i++) {
        const next = i + 1 < d.length ? d[i + 1] : d[0] + H;
        if (next - d[i] > gap) { gap = next - d[i]; phase = (d[i] + gap / 2) % H; }
      }
      worst = Math.min(worst, gap / 2);
    }
    for (const o of own) placed.add(o.x, o.z, { ...o, t: o.t + phase });
    return phase;
  });
  const packed = packRuns(timed.map((r) => r.pts), SCALE.tram);
  timed.forEach((run, i) => {
    meta.trams.push({ line: run.r.line, start: packed.starts[i], count: run.pts.length / 4, first: packed.first[i], phase: +phases[i].toFixed(2), headway: H, stops: run.stops });
  });
  const lines = [...new Set(timed.map((r) => r.r.line))].sort((a, b) => Number(a) - Number(b));
  const km = timed.reduce((a, r) => a + r.r.s[r.r.s.length - 1], 0) / 1000;
  input.log(`trams: lines ${lines.join(' ')}, ${timed.length} runs, ${km.toFixed(0)} km, ${timed.reduce((a, r) => a + r.stops, 0)} stops; trams sharing a track at least ${worst.toFixed(0)} s apart`);
  return packed.data;
}

// ---- The river ----------------------------------------------------------------------------------

interface River { st: number[][]; pools: [number, number][]; weirs: [number, number][]; marks: Record<string, number> }

function river(input: LifeInput): River {
  const { grid: g, wet } = input;
  const wetAt = (x: number, z: number) => {
    const i = Math.round((x - g.x0) / g.cell), j = Math.round((z - g.z0) / g.cell);
    return i >= 0 && j >= 0 && i < g.nx && j < g.nz && wet[j * g.nx + i] === 1;
  };
  const levelAt = (x: number, z: number) => {
    const i = Math.round((x - g.x0) / g.cell), j = Math.round((z - g.z0) / g.cell);
    return i >= 0 && j >= 0 && i < g.nx && j < g.nz ? input.level[j * g.nx + i] : NaN;
  };
  // The Vltava's centreline, the longest chain of its ways, within the stretch the flight sees.
  const pieces = input.water.filter((e) => e.type === 'way' && e.tags?.waterway === 'river' && e.tags?.name === 'Vltava').map((e) => ({ line: lineOf(e) }));
  const clip = (l: Line) => { const keep: Line = []; for (let k = 0; k < l.length; k += 2) if (l[k + 1] > -1400 && l[k + 1] < 3900) keep.push(l[k], l[k + 1]); return keep; };
  const chains = chainAll(pieces.map((p) => p.line)).map(clip);
  let line = chains.sort((a, b) => lengthOf(b) - lengthOf(a))[0];
  // Drawn downstream, which here is north.
  if (line[line.length - 1] > line[1]) line = reversed(line);
  const resample = (l: Line, step: number): Line => {
    const out: Line = [l[0], l[1]];
    let carry = 0;
    for (let k = 0; k + 3 < l.length; k += 2) {
      const ax = l[k], az = l[k + 1], bx = l[k + 2], bz = l[k + 3], len = Math.hypot(bx - ax, bz - az);
      let u = step - carry;
      for (; u <= len; u += step) out.push(ax + ((bx - ax) * u) / len, az + ((bz - az) * u) / len);
      carry = len - (u - step);
    }
    return out;
  };
  const extents = (l: Line, i: number) => {
    const n = l.length / 2, a = Math.max(0, i - 2), b = Math.min(n - 1, i + 2);
    let dx = l[b * 2] - l[a * 2], dz = l[b * 2 + 1] - l[a * 2 + 1];
    const len = Math.hypot(dx, dz) || 1;
    dx /= len; dz /= len;
    const lx = dz, lz = -dx; // left, facing downstream
    const x = l[i * 2], z = l[i * 2 + 1];
    let off = 0;
    if (!wetAt(x, z)) for (let d = 2.5; d < 60; d += 2.5) { if (wetAt(x + lx * d, z + lz * d)) { off = d; break; } if (wetAt(x - lx * d, z - lz * d)) { off = -d; break; } }
    const march = (sx: number) => { let d = 0; while (d < 300 && wetAt(x + lx * (off + sx * (d + 2.5)), z + lz * (off + sx * (d + 2.5)))) d += 2.5; return d + 1.25; };
    const left = march(1) + off, right = march(-1) - off;
    return { dx, dz, lx, lz, left, right };
  };
  // Re-centred on the channel twice, smoothed each time.
  for (let pass = 0; pass < 2; pass++) {
    line = resample(line, RIVER_STEP);
    const n = line.length / 2, c: Line = [];
    for (let i = 0; i < n; i++) {
      const e = extents(line, i), m = (e.left - e.right) / 2;
      c.push(line[i * 2] + e.lx * m, line[i * 2 + 1] + e.lz * m);
    }
    const sm: Line = [];
    for (let i = 0; i < n; i++) {
      let sx = 0, sz = 0, w = 0;
      for (let d = -4; d <= 4; d++) { const j = Math.min(n - 1, Math.max(0, i + d)); sx += c[j * 2]; sz += c[j * 2 + 1]; w++; }
      sm.push(sx / w, sz / w);
    }
    line = sm;
  }
  line = resample(line, RIVER_STEP);
  const n = line.length / 2;
  const st: number[][] = [];
  for (let i = 0; i < n; i++) {
    const e = extents(line, i), x = line[i * 2], z = line[i * 2 + 1];
    let y = levelAt(x, z);
    if (Number.isNaN(y)) y = st.length ? st[st.length - 1][2] : 0;
    st.push([x, z, y, Math.min(e.left, 250), Math.min(e.right, 250)]);
  }
  // Nearest station: index and lateral offset (left positive).
  const locate = (x: number, z: number) => {
    let best = Infinity, bi = 0;
    for (let i = 0; i < n; i++) { const d = Math.hypot(st[i][0] - x, st[i][1] - z); if (d < best) { best = d; bi = i; } }
    const e = extents(line, bi);
    return { i: bi, s: bi * RIVER_STEP + (x - st[bi][0]) * e.dx + (z - st[bi][1]) * e.dz, l: (x - st[bi][0]) * e.lx + (z - st[bi][1]) * e.lz, d: best };
  };
  // The weirs across it, as spans of distance along it.
  const spans: [number, number][] = [];
  for (const w of input.weirs) {
    let lo = Infinity, hi = -Infinity;
    for (const [x, z] of w.pts) {
      const q = locate(x, z);
      if (q.d > 400 || q.l > st[q.i][3] + 15 || -q.l > st[q.i][4] + 15) continue;
      lo = Math.min(lo, q.s); hi = Math.max(hi, q.s);
    }
    if (lo < hi || (lo === hi && lo < Infinity)) spans.push([lo, hi]);
  }
  spans.sort((a, b) => a[0] - b[0]);
  const weirs: [number, number][] = [];
  for (const sp of spans) {
    const last = weirs[weirs.length - 1];
    if (last && sp[0] < last[1] + 50) last[1] = Math.max(last[1], sp[1]); else weirs.push([sp[0], sp[1]]);
  }
  const S = (n - 1) * RIVER_STEP, pools: [number, number][] = [];
  let from = 0;
  for (const [a, b] of weirs) { if (a - 40 > from + 150) pools.push([from, a - 40]); from = b + 40; }
  if (S > from + 150) pools.push([from, S]);
  const marks: Record<string, number> = {};
  for (const [name, x, north] of [['vysehrad', 420, -2600], ['railway', 150, -2180], ['palacky', 43, -1523], ['jirasek', 0, -1212], ['sitkov', 164, -1034], ['legion', -57, -578], ['charles', 0, 0], ['manes', 93, 334], ['cechuv', 400, 734], ['stefanik', 1115, 890]] as const)
    marks[name] = +locate(x, -north).s.toFixed(0);
  return { st, pools, weirs, marks };
}

/** Metres to the bank over the river's box, 5 m cells; the weirs count as bank. */
function bankField(input: LifeInput, r: River): { meta: LifeMeta['bank']; data: Uint8Array; level: Int16Array } {
  const { grid: g, wet } = input;
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const [x, z, , a, b] of r.st) { const w = Math.max(a, b) + 60; x0 = Math.min(x0, x - w); x1 = Math.max(x1, x + w); z0 = Math.min(z0, z - w); z1 = Math.max(z1, z + w); }
  const C = g.cell;
  const i0 = Math.max(0, Math.floor((x0 - g.x0) / C)), i1 = Math.min(g.nx - 1, Math.ceil((x1 - g.x0) / C));
  const j0 = Math.max(0, Math.floor((z0 - g.z0) / C)), j1 = Math.min(g.nz - 1, Math.ceil((z1 - g.z0) / C));
  const nx = i1 - i0 + 1, nz = j1 - j0 + 1;
  const d = new Float32Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) d[j * nx + i] = wet[(j + j0) * g.nx + i + i0] ? 1e9 : 0;
  for (const w of input.weirs)
    for (const [x, z] of w.pts) {
      const ci = Math.round((x - g.x0) / C) - i0, cj = Math.round((z - g.z0) / C) - j0;
      for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) {
        const i = ci + di, j = cj + dj;
        if (i >= 0 && j >= 0 && i < nx && j < nz) d[j * nx + i] = 0;
      }
    }
  const o = C, q = C * Math.SQRT2;
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const k = j * nx + i;
    if (i > 0) d[k] = Math.min(d[k], d[k - 1] + o);
    if (j > 0) { d[k] = Math.min(d[k], d[k - nx] + o); if (i > 0) d[k] = Math.min(d[k], d[k - nx - 1] + q); if (i < nx - 1) d[k] = Math.min(d[k], d[k - nx + 1] + q); }
  }
  for (let j = nz - 1; j >= 0; j--) for (let i = nx - 1; i >= 0; i--) {
    const k = j * nx + i;
    if (i < nx - 1) d[k] = Math.min(d[k], d[k + 1] + o);
    if (j < nz - 1) { d[k] = Math.min(d[k], d[k + nx] + o); if (i < nx - 1) d[k] = Math.min(d[k], d[k + nx + 1] + q); if (i > 0) d[k] = Math.min(d[k], d[k + nx - 1] + q); }
  }
  const data = new Uint8Array(nx * nz);
  for (let k = 0; k < d.length; k++) data[k] = Math.min(255, Math.round(d[k]));
  // The water's level over the same cells, in centimetres, for what floats on it.
  const level = new Int16Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const v = input.level[(j + j0) * g.nx + i + i0];
    level[j * nx + i] = Number.isNaN(v) ? -32768 : Math.round(v * 100);
  }
  return { meta: { x0: g.x0 + i0 * C, z0: g.z0 + j0 * C, cell: C, nx, nz }, data, level };
}

// ---- Walks and roads ---------------------------------------------------------------------------

function walks(input: LifeInput, meta: LifeMeta): { data: Int16Array; pts: number[] } {
  const kept: number[][] = [], info: { zone: number; width: number }[] = [];
  const add = (zone: number, width: number, runs: number[][]) => {
    for (const r of runs) {
      if (r.length < 6 || distances(r).at(-1)! < 12) continue;
      kept.push(r);
      info.push({ zone, width });
    }
  };
  const ground = (x: number, z: number) => input.ground(x, z);
  const hw = input.highways.filter((e) => e.type === 'way' && e.tags);
  const named = (re: RegExp, kinds: RegExp) => hw.filter((e) => re.test(e.tags!.name ?? '') && kinds.test(e.tags!.highway) && e.tags!.area !== 'yes');
  const joined = (els: OsmElement[]) => chainAll(els.map(lineOf)).map((line) => ({ line }));
  // Charles Bridge, on its deck. The deck lookup takes the highest level face, which in the towers'
  // gates is their roofs: each point takes the lower quartile of its neighbours' heights.
  for (const c of joined(named(/^Karlův most$/, /pedestrian/)))
    for (const run of densify([c], 3, (x, z) => { const y = input.deck(x, z); return Number.isNaN(y) ? ground(x, z) : y; })) {
      const n = run.length / 3, ys: number[] = [];
      for (let i = 0; i < n; i++) {
        const w: number[] = [];
        for (let j = Math.max(0, i - 5); j <= Math.min(n - 1, i + 5); j++) w.push(run[j * 3 + 1]);
        w.sort((a, b) => a - b);
        ys.push(w[Math.floor((w.length - 1) / 4)]);
      }
      ys.forEach((y, i) => { run[i * 3 + 1] = y; });
      add(Zone.Bridge, 7.5, [run]);
    }
  // The Royal Route's lanes.
  for (const c of joined(named(/^(Karlova|Celetná|Mostecká|Malé náměstí)$/, /pedestrian|living_street|residential|footway/))) add(Zone.Lanes, 3, densify([c], 3, ground));
  // The quays; Náplavka's is wide.
  for (const name of ['Novoměstská náplavka', 'Staroměstská náplavka', 'Smíchovská náplavka'])
    for (const c of joined(named(new RegExp(`^${name}$`), /pedestrian|footway|service/))) add(Zone.Quay, name.startsWith('Novo') ? 10 : 4, densify([c], 3, ground));
  // Old Town Square: straight walks across it, between random points of the square, round the Hus memorial.
  const squares = features(input.landuse, (t) => t.name === 'Staroměstské náměstí' && (t.place === 'square' || t.highway === 'pedestrian'));
  const avoid: [number, number, number][] = [[710, -131, 15], [710, -96, 4]];
  const free = (x: number, z: number, p: Polygon) => pointInPolygon(x, z, p) && avoid.every(([ax, az, r]) => Math.hypot(x - ax, z - az) > r);
  for (const f of squares)
    for (const p of f.polygons) {
      const rnd = rng(7);
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (let k = 0; k < p.outer.length; k += 2) { x0 = Math.min(x0, p.outer[k]); x1 = Math.max(x1, p.outer[k]); z0 = Math.min(z0, p.outer[k + 1]); z1 = Math.max(z1, p.outer[k + 1]); }
      const pick = () => { for (let t = 0; t < 200; t++) { const x = x0 + rnd() * (x1 - x0), z = z0 + rnd() * (z1 - z0); if (free(x, z, p)) return [x, z]; } return null; };
      for (let c = 0; c < 160; c++) {
        const a = pick(), b = pick();
        if (!a || !b || Math.hypot(b[0] - a[0], b[1] - a[1]) < 25) continue;
        let ok = true;
        for (let t = 0.05; t < 1 && ok; t += 0.05) ok = free(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, p);
        if (ok) add(Zone.Square, 5, densify([{ line: [a[0], a[1], b[0], b[1]] }], 3, ground));
      }
    }
  // Paths inside parks: Kampa, and Petřín's gardens.
  const paths = hw.filter((e) => /footway|path|pedestrian|steps/.test(e.tags!.highway) && e.tags!.area !== 'yes').map(lineOf);
  const inside = (l: Line, polys: Polygon[]) => { let n = 0; for (let k = 0; k < l.length; k += 2) if (polys.some((p) => pointInPolygon(l[k], l[k + 1], p))) n++; return n * 2 >= l.length / 2; };
  const kampa = features(input.landuse, (t) => t.name === 'Kampa' && t.leisure === 'park').flatMap((f) => f.polygons);
  for (const l of chainAll(paths.filter((l) => inside(l, kampa)))) add(Zone.Kampa, 2, densify([{ line: l }], 3, ground));
  const onPetrin = (x: number, z: number) => x > -1500 && x < -450 && z > 80 && z < 950;
  const petrin = features(input.landuse, (t) => /park|garden/.test(t.leisure ?? '') || t.landuse === 'forest' || t.natural === 'wood')
    .flatMap((f) => f.polygons)
    .filter((p) => onPetrin(p.outer[0], p.outer[1]));
  for (const l of chainAll(paths.filter((l) => onPetrin(l[0], l[1]) && inside(l, petrin)))) add(Zone.Petrin, 1.5, densify([{ line: l }], 3, ground));
  const packed = packRuns(kept, SCALE.walk);
  kept.forEach((r, i) => meta.walks.push({ zone: info[i].zone, start: packed.starts[i], count: r.length / 3, first: packed.first[i], width: info[i].width }));
  const byZone = Object.entries(Zone).map(([k, v]) => `${meta.walks.filter((w) => w.zone === v).length} ${k.toLowerCase()}`);
  input.log(`walks: ${meta.walks.length} paths (${byZone.join(', ')})`);
  return { data: packed.data, pts: kept.flat() };
}

function roads(input: LifeInput, meta: LifeMeta, rails: Cells<number>): Int16Array {
  // Directed pieces of the embankment roads, joined end to start into lanes.
  const ROAD = /^(primary|secondary|tertiary|residential|unclassified)$/;
  const pieces: { line: Line; bridge: boolean; offset: number }[] = [];
  for (const e of input.highways) {
    const t = e.tags;
    if (e.type !== 'way' || !t || !ROAD.test(t.highway) || !/nábřeží/i.test(t.name ?? '') || t.tunnel === 'yes' || t.area === 'yes') continue;
    const line = lineOf(e);
    const bridge = !!t.bridge && t.bridge !== 'no';
    // Trams in the middle of the road push the cars out to its sides.
    let tram = false;
    for (let k = 0; k < line.length && !tram; k += 2) rails.near(line[k], line[k + 1], () => { tram = true; });
    const oneway = t.oneway === 'yes' || t.oneway === '1' || t.oneway === '-1';
    const lane = oneway ? (tram ? 2.2 : 0) : tram ? 4.2 : 1.8;
    if (t.oneway !== '-1') pieces.push({ line, bridge, offset: lane });
    if (!oneway || t.oneway === '-1') pieces.push({ line: reversed(line), bridge, offset: lane });
  }
  // Chain: from each piece, follow the piece that starts where it ends and turns least.
  const starts = new Cells<number>(5);
  pieces.forEach((p, i) => starts.add(p.line[0], p.line[1], i));
  const used = new Set<number>();
  const hasPrev = new Set<number>();
  pieces.forEach((p) => { const n = p.line.length; starts.near(p.line[n - 2], p.line[n - 1], (j) => { if (pieces[j] !== p && same(pieces[j].line[0], pieces[j].line[1], p.line[n - 2], p.line[n - 1])) hasPrev.add(j); }); });
  const order = pieces.map((_, i) => i).sort((a, b) => Number(hasPrev.has(a)) - Number(hasPrev.has(b)));
  const lanes: number[][] = [];
  for (const i0 of order) {
    if (used.has(i0)) continue;
    const chain = [pieces[i0]];
    used.add(i0);
    for (;;) {
      const l = chain[chain.length - 1].line, n = l.length;
      const ex = l[n - 2], ez = l[n - 1], hx = ex - l[n - 4], hz = ez - l[n - 3];
      let best = -1, bestDot = 0.3;
      starts.near(ex, ez, (j) => {
        if (used.has(j) || !same(pieces[j].line[0], pieces[j].line[1], ex, ez)) return;
        const q = pieces[j].line, dx = q[2] - q[0], dz = q[3] - q[1];
        const dot = (dx * hx + dz * hz) / (Math.hypot(dx, dz) * Math.hypot(hx, hz) || 1);
        // Not straight back the way it came.
        if (dot > bestDot) { bestDot = dot; best = j; }
      });
      if (best < 0) break;
      used.add(best);
      chain.push(pieces[best]);
    }
    // Every 5 m, offset to the right of travel.
    for (const run of densify(chain, 5, (x, z, p) => input.track(x, z, p.bridge))) {
      const s = distances(run);
      if (s.at(-1)! < 150) continue;
      const out: number[] = [];
      const n = run.length / 3;
      const offs = chain.length ? chain.map((p) => p.offset) : [0];
      const off = offs.reduce((a, b) => a + b, 0) / offs.length;
      for (let i = 0; i < n; i++) {
        const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1);
        const dx = run[b * 3] - run[a * 3], dz = run[b * 3 + 2] - run[a * 3 + 2], l = Math.hypot(dx, dz) || 1;
        out.push(run[i * 3] - (dz / l) * off, run[i * 3 + 1], run[i * 3 + 2] + (dx / l) * off);
      }
      lanes.push(out);
    }
  }
  const packed = packRuns(lanes, SCALE.road);
  lanes.forEach((l, i) => meta.roads.push({ start: packed.starts[i], count: l.length / 3, first: packed.first[i] }));
  const km = meta.roads.reduce((a, r) => a + r.count * 5, 0) / 1000;
  input.log(`roads: ${meta.roads.length} lanes along the embankments, ${km.toFixed(1)} km`);
  return packed.data;
}

// ---- Everything ----------------------------------------------------------------------------------

export function buildLife(input: LifeInput, railPts: Float32Array): Uint8Array {
  const meta: LifeMeta = { trams: [], river: { count: 0, pools: [], weirs: [], marks: {} }, bank: { x0: 0, z0: 0, cell: 5, nx: 0, nz: 0 }, walks: [], roads: [], swans: [], pigeons: [], moored: [], pontoon: [] };
  const tram = trams(input, meta);

  const r = river(input);
  meta.river = { count: r.st.length, pools: r.pools.map(([a, b]) => [+a.toFixed(0), +b.toFixed(0)]), weirs: r.weirs.map(([a, b]) => [+a.toFixed(0), +b.toFixed(0)]), marks: r.marks };
  input.log(`river: ${r.st.length} stations, weirs at ${meta.river.weirs.map(([a, b]) => `${a}-${b}`).join(', ')} m; pools ${meta.river.pools.map(([a, b]) => `${a}-${b}`).join(', ')}; ${Object.entries(r.marks).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  const bank = bankField(input, r);
  meta.bank = bank.meta;
  const bankAt = (x: number, z: number) => {
    const i = Math.round((x - bank.meta.x0) / bank.meta.cell), j = Math.round((z - bank.meta.z0) / bank.meta.cell);
    return i >= 0 && j >= 0 && i < bank.meta.nx && j < bank.meta.nz ? bank.data[j * bank.meta.nx + i] : 0;
  };
  const levelNear = (x: number, z: number, fallback: number) => {
    const i = Math.round((x - input.grid.x0) / input.grid.cell), j = Math.round((z - input.grid.z0) / input.grid.cell);
    const v = input.level[j * input.grid.nx + i];
    return Number.isNaN(v) ? fallback : v;
  };
  const station = (s: number) => r.st[Math.max(0, Math.min(r.st.length - 1, Math.round(s / RIVER_STEP)))];
  const frame = (s: number) => {
    const i = Math.max(1, Math.min(r.st.length - 2, Math.round(s / RIVER_STEP)));
    const dx = r.st[i + 1][0] - r.st[i - 1][0], dz = r.st[i + 1][1] - r.st[i - 1][1], l = Math.hypot(dx, dz) || 1;
    return { dx: dx / l, dz: dz / l, lx: dz / l, lz: -dx / l };
  };

  // Swans, in the water off the bank: Kampa, below Charles Bridge on the Malá Strana side, Náplavka.
  for (const [x, north, count] of [[-178, -95, 5], [-222, 92, 7], [222, -1690, 4]]) {
    let best: number[] | null = null, bd = Infinity;
    for (let dz = -90; dz <= 90; dz += 5) for (let dx = -90; dx <= 90; dx += 5) {
      const px = x + dx, pz = -north + dz, b = bankAt(px, pz);
      if (b < 6 || b > 14) continue;
      const d = Math.hypot(dx, dz);
      if (d < bd) { bd = d; best = [px, pz]; }
    }
    if (best) {
      const i = Math.round((best[0] - input.grid.x0) / input.grid.cell), j = Math.round((best[1] - input.grid.z0) / input.grid.cell);
      meta.swans.push([+best[0].toFixed(1), +input.level[j * input.grid.nx + i].toFixed(2), +best[1].toFixed(1), count]);
    }
  }

  // Boats moored at the quays, bow upstream: Náplavka, the Smíchov quay across from it, and the
  // cruise quays below Čechův Bridge.
  const moor = (s0: number, s1: number, side: number, lengths: number[], kinds: number[]) => {
    let s = s0, k = 0;
    while (s < s1 && k < lengths.length) {
      const len = lengths[k], st = station(s + len / 2), f = frame(s + len / 2);
      const w = side > 0 ? st[3] : st[4];
      const l = side * (w - 5.5);
      const x = st[0] + f.lx * l, z = st[1] + f.lz * l;
      meta.moored.push([+x.toFixed(1), +levelNear(x, z, st[2]).toFixed(2), +z.toFixed(1), +Math.atan2(-f.dx, f.dz).toFixed(3), len, kinds[k]]);
      s += len + 8 + 20 * hash(s, side);
      k++;
    }
  };
  const m = r.marks;
  moor(m.palacky - 480, m.palacky - 60, -1, [34, 28, 42, 30, 26, 36], [1, 0, 2, 0, 1, 0]);
  moor(m.palacky - 420, m.palacky - 150, 1, [30, 36, 26], [0, 0, 1]);
  moor(m.manes + 120, m.cechuv - 40, -1, [38, 32, 40, 30], [0, 0, 0, 2]);
  moor(m.cechuv + 60, m.cechuv + 300, -1, [34, 40, 30], [0, 2, 0]);

  // The pedal boat pontoon on the east side of Střelecký island.
  {
    const s = m.legion + 60, st = station(s), f = frame(s);
    const l = st[3] - 4;
    meta.pontoon = [+(st[0] + f.lx * l).toFixed(1), +levelNear(st[0] + f.lx * l, st[1] + f.lz * l, st[2]).toFixed(2), +(st[1] + f.lz * l).toFixed(1), +Math.atan2(-f.dx, f.dz).toFixed(3), 22];
  }

  const walked = walks(input, meta), walk = walked.data;
  // Pigeons: Old Town Square, and the walks along the water, snapped to a path.
  const walkPts = walked.pts;
  for (const [x, north, count] of [[655, 95, 30], [700, 165, 22], [630, 40, 26], [178, -130, 18], [200, -1640, 34], [178, -1400, 20], [-205, -235, 16], [360, 600, 24]]) {
    let best = -1, bd = 60;
    for (let k = 0; k < walkPts.length; k += 3) { const d = Math.hypot(walkPts[k] - x, walkPts[k + 2] + north); if (d < bd) { bd = d; best = k; } }
    if (best >= 0) meta.pigeons.push([+walkPts[best].toFixed(1), +walkPts[best + 1].toFixed(2), +walkPts[best + 2].toFixed(1), count]);
  }
  const rails = new Cells<number>(4);
  for (let k = 0; k < railPts.length; k += 3) rails.add(railPts[k], railPts[k + 2], k);
  const road = roads(input, meta, rails);

  const riverArr = new Float32Array(r.st.flat());
  input.log(`life: ${meta.swans.length} groups of swans, ${meta.pigeons.length} flocks of pigeons, ${meta.moored.length} moored boats`);
  return encodePack(meta, { tram, river: riverArr, bank: bank.data, level: bank.level, walk, road });
}
