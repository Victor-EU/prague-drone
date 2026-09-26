// The auto route of design.md §9.2: position and gaze on splines through the stops, the flight
// clock, and the lens schedule. Times are route seconds at 1× speed.

import * as THREE from 'three';
import { parseClock } from '../core/sun.ts';

interface StopData {
  n: number; name: string; t: number; clock: string;
  pos: [number, number, number]; gaze: [number, number, number]; lens: 'wide' | 'long' | 'long>wide';
  /** A knot that shapes a leg without being a stop (no number, no name, no clock of its own). */
  via?: boolean;
}
export interface RouteData {
  duration: number; hold: number; clockEnd: string; holdClockEnd: string; stops: StopData[];
}

export const WIDE = 24;
export const LONG = 55;
const LENS_BLEND = 2.5;

/** Horizontal field of view in radians for a 35 mm-equivalent focal length (36 mm wide frame). */
export function hfovFor(focal: number): number {
  return 2 * Math.atan(18 / focal);
}

/**
 * A cubic Hermite spline through timed knots. Knot velocities are the weighted three-point
 * derivative, zero at both ends so the flight eases in and out. The vertical component is
 * limited like a monotone spline, so the drone never dips below a low stop between two higher ones.
 */
class TimedSpline {
  private t: number[];
  private p: THREE.Vector3[];
  private m: THREE.Vector3[];

  constructor(times: number[], points: THREE.Vector3[]) {
    this.t = times;
    this.p = points;
    const n = points.length;
    this.m = points.map(() => new THREE.Vector3());
    for (let k = 1; k < n - 1; k++) {
      const d0 = times[k] - times[k - 1], d1 = times[k + 1] - times[k];
      const v0 = points[k].clone().sub(points[k - 1]).divideScalar(d0);
      const v1 = points[k + 1].clone().sub(points[k]).divideScalar(d1);
      this.m[k].copy(v0).multiplyScalar(d1).addScaledVector(v1, d0).divideScalar(d0 + d1);
      if (v0.y * v1.y <= 0) this.m[k].y = 0;
      else {
        const lim = 3 * Math.min(Math.abs(v0.y), Math.abs(v1.y));
        this.m[k].y = Math.sign(this.m[k].y) * Math.min(Math.abs(this.m[k].y), lim);
      }
    }
  }

  at(time: number, out: THREE.Vector3): THREE.Vector3 {
    const t = this.t, n = t.length;
    if (time <= t[0]) return out.copy(this.p[0]);
    if (time >= t[n - 1]) return out.copy(this.p[n - 1]);
    let k = 0;
    while (k < n - 2 && time > t[k + 1]) k++;
    const d = t[k + 1] - t[k];
    const u = (time - t[k]) / d, u2 = u * u, u3 = u2 * u;
    const h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
    return out
      .copy(this.p[k]).multiplyScalar(h00)
      .addScaledVector(this.m[k], h10 * d)
      .addScaledVector(this.p[k + 1], h01)
      .addScaledVector(this.m[k + 1], h11 * d);
  }
}

const toVec = ([x, north, alt]: [number, number, number]) => new THREE.Vector3(x, alt, -north);
const smoothstep = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

export class Route {
  readonly data: RouteData;
  readonly duration: number;
  /** Route time of the last stop; the blue-hour hold starts here. */
  readonly end: number;
  readonly stops: { n: number; name: string; t: number; clock: number; pos: THREE.Vector3; gaze: THREE.Vector3 }[];
  private pos: TimedSpline;
  private gaze: TimedSpline;
  private knots: number[];
  private lensIn: number[];
  private lensOut: number[];
  private transitions: { start: number; from: number; to: number }[] = [];
  readonly holdClockEnd: number;

  constructor(data: RouteData) {
    this.data = data;
    this.duration = data.duration;
    // The splines run through every knot; the stops are the knots that are not via points.
    const knots = data.stops.map((s) => ({ n: s.n, name: s.name, t: s.t, clock: s.via ? NaN : parseClock(s.clock), pos: toVec(s.pos), gaze: toVec(s.gaze) }));
    this.stops = knots.filter((_, k) => !data.stops[k].via);
    this.end = knots[knots.length - 1].t;
    // Stop 1 holds for `hold` seconds before the spline starts.
    this.knots = knots.map((s, k) => (k === 0 ? data.hold : s.t));
    this.pos = new TimedSpline(this.knots, knots.map((s) => s.pos));
    this.gaze = new TimedSpline(this.knots, knots.map((s) => s.gaze));
    this.lensIn = data.stops.map((s) => (s.lens === 'wide' ? WIDE : LONG));
    this.lensOut = data.stops.map((s) => (s.lens === 'long' ? LONG : WIDE));
    this.holdClockEnd = parseClock(data.holdClockEnd);
    const k = this.knots;
    for (let i = 0; i < k.length; i++) {
      if (this.lensIn[i] !== this.lensOut[i]) this.transitions.push({ start: k[i] + 1, from: this.lensIn[i], to: this.lensOut[i] });
      if (i + 1 < k.length && this.lensOut[i] !== this.lensIn[i + 1]) {
        const narrowing = this.lensIn[i + 1] > this.lensOut[i];
        const start = narrowing ? k[i + 1] - 3 - LENS_BLEND : k[i] + 1;
        this.transitions.push({ start, from: this.lensOut[i], to: this.lensIn[i + 1] });
      }
    }
    this.transitions.sort((a, b) => a.start - b.start);
  }

  position(t: number, out: THREE.Vector3) {
    return this.pos.at(t, out);
  }

  target(t: number, out: THREE.Vector3) {
    return this.gaze.at(t, out);
  }

  /** The flight clock in hours: linear between the stops' clock times. */
  clock(t: number): number {
    const s = this.stops;
    if (t <= s[0].t) return s[0].clock;
    for (let k = 0; k + 1 < s.length; k++)
      if (t <= s[k + 1].t) return s[k].clock + ((t - s[k].t) / (s[k + 1].t - s[k].t)) * (s[k + 1].clock - s[k].clock);
    return s[s.length - 1].clock;
  }

  /**
   * Focal length at route time t. Wide to long finishes 3 s before the long stop; long to wide
   * starts 1 s after leaving it; a stop that arrives long and leaves wide opens 1 s after the stop.
   * Never a cut (design.md §5.5).
   */
  focal(t: number): number {
    let lens = this.lensIn[0];
    for (const tr of this.transitions) {
      if (t < tr.start) break;
      if (t < tr.start + LENS_BLEND) return this.blend(tr.from, tr.to, (t - tr.start) / LENS_BLEND);
      lens = tr.to;
    }
    return lens;
  }

  private blend(a: number, b: number, x: number): number {
    // Interpolate the field of view, not the focal length, so the zoom reads evenly.
    const fa = hfovFor(a), fb = hfovFor(b);
    const f = fa + (fb - fa) * smoothstep(x);
    return 18 / Math.tan(f / 2);
  }

  /** The stop the drone is at or approaching. */
  stopAt(t: number) {
    let k = 0;
    while (k < this.stops.length - 1 && t > (this.stops[k].t + this.stops[k + 1].t) / 2) k++;
    return this.stops[k];
  }

  /** Route time of the point on the route nearest to p (sampled every half second). */
  nearest(p: THREE.Vector3): number {
    const q = new THREE.Vector3();
    let best = 0, bestD = Infinity;
    for (let t = 0; t <= this.end; t += 0.5) {
      const d = this.position(t, q).distanceToSquared(p);
      if (d < bestD) { bestD = d; best = t; }
    }
    return best;
  }
}
