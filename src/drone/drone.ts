// The drone: the auto route, manual flight, the hand-over between them, and the blue-hour hold
// (design.md §9). Produces a camera pose and a focal length every frame.

import * as THREE from 'three';
import { Route, WIDE } from './route.ts';
import type { Keys } from './input.ts';

export type Mode = 'auto' | 'manual';

export interface Ground {
  /** Terrain height (y) at a point. */
  ground(x: number, z: number): number;
  /** Highest surface (terrain, water, roofs, decks) within r metres. */
  surface(x: number, z: number, r: number): number;
  /** The world rectangle. */
  bounds: { xMin: number; xMax: number; zMin: number; zMax: number };
}

const DEG = Math.PI / 180;
const CLEARANCE = 12; // metres above roofs (design.md §9.1)
const MIN_AGL = 15;
const MAX_AGL = 600;
const BLEND = 3; // seconds to rejoin the route

/** Exponential approach with time constant tau. */
const approach = (v: number, target: number, tau: number, dt: number) => v + (target - v) * (1 - Math.exp(-dt / tau));

export class Drone {
  readonly route: Route;
  private world: Ground;
  mode: Mode = 'auto';
  fast = false;
  /** True while the cover is up: the route waits at its start, drifting (design.md §10.2). */
  waiting = false;
  private waitTime = 0;
  private driftGain = 0;
  /** Route time in 1× seconds. */
  t = 0;
  readonly position = new THREE.Vector3();
  readonly quaternion = new THREE.Quaternion();
  focal = WIDE;

  // Manual state
  private heading = 0; // radians clockwise from north
  private pitch = -10 * DEG;
  private speed = 0;
  private yawRate = 0;
  private climb = 0;
  private strafe = 0;
  private bank = 0;
  private hover = false;

  // Auto state
  private floorY = -Infinity;
  private autoBank = 0;
  private lastYaw = 0;
  private blendFrom?: { pos: THREE.Vector3; quat: THREE.Quaternion; focal: number; left: number };
  private holdTime = 0;
  /** Seconds spent in the blue-hour hold. */
  get holdSeconds() {
    return this.holdTime;
  }
  private prev = new THREE.Vector3();
  /** True once the route has reached its last stop and holds there. */
  get holding() {
    return this.mode === 'auto' && this.t >= this.route.end;
  }

  constructor(route: Route, world: Ground) {
    this.route = route;
    this.world = world;
    this.setAuto(0);
  }

  /** Starts or resumes the auto route at route time t, without a blend. */
  setAuto(t: number) {
    this.mode = 'auto';
    this.t = t;
    this.blendFrom = undefined;
    this.holdTime = 0;
    this.autoPose(0);
    this.floorY = this.position.y;
  }

  /** Enter: fly a 3 s blend to the nearest point on the route and resume from there. */
  rejoin() {
    if (this.mode === 'auto') return;
    this.blendFrom = { pos: this.position.clone(), quat: this.quaternion.clone(), focal: this.focal, left: BLEND };
    this.t = Math.min(this.route.nearest(this.position), this.route.end);
    this.holdTime = 0;
    this.mode = 'auto';
  }

  /** The cover lifts: the route starts and the drift settles over a second. */
  fly() {
    this.waiting = false;
  }

  /** Hands control to the user at the current position and heading. */
  takeOver(hover = false) {
    if (this.mode === 'manual') return;
    this.waiting = false;
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(this.quaternion);
    this.heading = Math.atan2(fwd.x, -fwd.z);
    this.pitch = THREE.MathUtils.clamp(Math.asin(THREE.MathUtils.clamp(fwd.y, -1, 1)), -60 * DEG, 20 * DEG);
    this.speed = hover ? 0 : THREE.MathUtils.clamp(this.velocity.length(), 0, 60);
    this.hover = hover;
    this.yawRate = 0;
    this.climb = 0;
    this.strafe = 0;
    this.bank = this.autoBank;
    this.mode = 'manual';
    this.blendFrom = undefined;
    this.focal = WIDE;
  }

  readonly velocity = new THREE.Vector3();

  update(dt: number, keys: Keys) {
    this.prev.copy(this.position);
    if (this.mode === 'auto') this.updateAuto(dt);
    else this.updateManual(dt, keys);
    if (dt > 0) this.velocity.copy(this.position).sub(this.prev).divideScalar(dt);
  }

  private tmp = new THREE.Vector3();
  private look = new THREE.Vector3();
  private m = new THREE.Matrix4();

  private autoPose(dt: number) {
    const r = this.route;
    const t = Math.min(this.t, r.end);
    r.position(t, this.position);
    r.target(t, this.look);
    // The blue-hour hold drifts very slowly around the last stop; the cover drifts the same way at the first.
    if (this.t >= r.end) this.drift(this.holdTime, 1);
    else if (this.driftGain > 0) this.drift(this.waitTime, this.driftGain);
    // Keep clear of roofs and hills: look a little ahead and rise early.
    let floor = -Infinity;
    for (const ahead of [0, 1, 2, 3]) {
      r.position(Math.min(t + ahead * (this.fast ? 2 : 1), r.end), this.tmp);
      floor = Math.max(floor, this.world.surface(this.tmp.x, this.tmp.z, CLEARANCE) + CLEARANCE, this.world.ground(this.tmp.x, this.tmp.z) + MIN_AGL);
    }
    this.floorY = dt > 0 ? (floor > this.floorY ? approach(this.floorY, floor, 0.6, dt) : approach(this.floorY, floor, 2.0, dt)) : floor;
    this.position.y = Math.max(this.position.y, this.floorY);

    this.m.lookAt(this.position, this.look, THREE.Object3D.DEFAULT_UP);
    this.quaternion.setFromRotationMatrix(this.m);
    // A slight bank in turns, as a drone would lean.
    const fwd = this.tmp.set(0, 0, -1).applyQuaternion(this.quaternion);
    const yaw = Math.atan2(fwd.x, -fwd.z);
    let dyaw = yaw - this.lastYaw;
    dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
    this.lastYaw = yaw;
    if (dt > 0) this.autoBank = approach(this.autoBank, THREE.MathUtils.clamp((dyaw / dt) * 0.35, -8 * DEG, 8 * DEG), 0.8, dt);
    this.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -this.autoBank));
    this.focal = r.focal(t);
  }

  private drift(time: number, gain: number) {
    const a = time * 0.05;
    this.position.x += Math.sin(a) * 12 * gain;
    this.position.z += (Math.cos(a) - 1) * 12 * gain;
    this.position.y += Math.sin(time * 0.21) * 1.2 * gain;
  }

  private updateAuto(dt: number) {
    const r = this.route;
    if (this.waiting || this.driftGain > 0) {
      this.waitTime += dt;
      this.driftGain = this.waiting ? 1 : approach(this.driftGain, 0, 0.5, dt);
      if (this.driftGain < 0.002) this.driftGain = 0;
    }
    if (this.waiting) { /* the route waits at its start under the cover */ }
    else if (this.t < r.end) this.t = Math.min(r.end, this.t + dt * (this.fast ? 2 : 1));
    else this.holdTime += dt;
    this.autoPose(dt);
    if (this.blendFrom) {
      const b = this.blendFrom;
      b.left -= dt;
      const x = THREE.MathUtils.smoothstep(1 - b.left / BLEND, 0, 1);
      this.position.lerpVectors(b.pos, this.position, x);
      this.quaternion.slerpQuaternions(b.quat, this.quaternion, x);
      this.focal = b.focal + (this.focal - b.focal) * x;
      if (b.left <= 0) this.blendFrom = undefined;
    }
  }

  private updateManual(dt: number, keys: Keys) {
    const left = keys.held('ArrowLeft'), right = keys.held('ArrowRight');
    const targetYaw = ((right ? 1 : 0) - (left ? 1 : 0)) * 45 * DEG;
    this.yawRate = approach(this.yawRate, targetYaw, 0.35, dt);
    this.heading += this.yawRate * dt;
    this.bank = approach(this.bank, (this.yawRate / (45 * DEG)) * 12 * DEG, 0.4, dt);

    const up = keys.held('ArrowUp'), down = keys.held('ArrowDown');
    this.climb = approach(this.climb, ((up ? 1 : 0) - (down ? 1 : 0)) * 20, 0.3, dt);

    const cruise = this.hover ? 0 : keys.held('ShiftLeft') || keys.held('ShiftRight') ? 60 : 22;
    this.speed = approach(this.speed, cruise, 1.2, dt);

    const a = keys.held('KeyA'), d = keys.held('KeyD');
    this.strafe = approach(this.strafe, ((d ? 1 : 0) - (a ? 1 : 0)) * 15, 0.3, dt);

    const w = keys.held('KeyW'), s = keys.held('KeyS');
    this.pitch = THREE.MathUtils.clamp(this.pitch + ((w ? 1 : 0) - (s ? 1 : 0)) * 40 * DEG * dt, -60 * DEG, 20 * DEG);

    // A gentle turn back toward the centre near the world's edge.
    const b = this.world.bounds, margin = 700;
    const px = this.position.x, pz = this.position.z;
    const out = Math.max(b.xMin + margin - px, px - (b.xMax - margin), b.zMin + margin - pz, pz - (b.zMax - margin), 0);
    if (out > 0) {
      const home = Math.atan2(-px, pz); // heading toward the origin
      let diff = home - this.heading;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.heading += diff * Math.min(1, (out / margin) * 1.5) * dt;
    }

    const sh = Math.sin(this.heading), ch = Math.cos(this.heading);
    this.position.x += (sh * this.speed + ch * this.strafe) * dt;
    this.position.z += (-ch * this.speed + sh * this.strafe) * dt;
    this.position.y += this.climb * dt;
    this.position.x = THREE.MathUtils.clamp(this.position.x, b.xMin + 100, b.xMax - 100);
    this.position.z = THREE.MathUtils.clamp(this.position.z, b.zMin + 100, b.zMax - 100);

    // Altitude limits and the soft repulsion from roofs: the drone slides over, never through.
    const g = this.world.ground(this.position.x, this.position.z);
    let floor = Math.max(g + MIN_AGL, this.world.surface(this.position.x, this.position.z, CLEARANCE) + CLEARANCE);
    for (const ahead of [1, 2]) {
      const ax = this.position.x + sh * this.speed * ahead, az = this.position.z - ch * this.speed * ahead;
      floor = Math.max(floor, this.world.surface(ax, az, CLEARANCE) + CLEARANCE - 4 * ahead);
    }
    if (this.position.y < floor) this.position.y = approach(this.position.y, floor, 0.25, dt);
    this.position.y = Math.min(this.position.y, g + MAX_AGL);

    const e = new THREE.Euler(this.pitch, -this.heading, -this.bank, 'YXZ');
    this.quaternion.setFromEuler(e);
    this.focal = WIDE;
  }

  /** Space: hover toggle in manual; from auto it takes over in hover. */
  toggleHover() {
    if (this.mode !== 'manual') return this.takeOver(true);
    this.hover = !this.hover;
  }
}
