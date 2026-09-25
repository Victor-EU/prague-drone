// City life (design.md §8.8): trams, boats, swans, pigeons, people and cars, from life.bin
// (tools/lib/life.ts). Everything moves on its own clock, the seconds since the city loaded, which
// runs at the same pace whatever the flight's speed; the flight's hour sets how many people are
// out, whether the rowers are on the water and whether the lamps are lit. Silent (§10.3).

import * as THREE from 'three';
import type { Pack } from '../core/pack.ts';
import type { LifeMeta } from '../core/life.ts';
import { U } from '../sky/uniforms.ts';
import { Trams } from './trams.ts';
import { RiverLife } from './river.ts';
import { People } from './people.ts';
import { Pigeons } from './birds.ts';
import { Cars } from './cars.ts';
import { VehicleLamps } from './lamps.ts';

export class Life {
  readonly group = new THREE.Group();
  readonly trams: Trams;
  readonly river: RiverLife;
  readonly people: People;
  readonly pigeons: Pigeons;
  readonly cars: Cars;
  readonly lamps = new VehicleLamps();
  /** Seconds of life so far. */
  time = 0;

  constructor(pack: Pack<LifeMeta>) {
    const a = pack.arrays, meta = pack.meta;
    this.trams = new Trams(meta, a.tram as Int16Array);
    this.river = new RiverLife(meta, a.river as Float32Array, a.bank as Uint8Array, a.level as Int16Array);
    this.people = new People(meta, a.walk as Int16Array);
    this.pigeons = new Pigeons(meta);
    this.cars = new Cars(meta, a.road as Int16Array);
    this.group.add(this.trams.group, this.river.group, this.people.group, this.pigeons.group, this.cars.group, this.lamps.points);
  }

  /** Moves life on to `time` seconds, running the boats and swans that steer themselves in steps. */
  setTime(time: number) {
    for (let t = this.time; t < time; t += 0.25) this.river.simulate(0.25);
    this.time = time;
  }

  /**
   * `dt`: seconds since the last frame (0 holds everything still); `hour`: the flight's clock; `eye`:
   * the camera; `drone` and `agl`: where the drone is and its height above the ground.
   */
  update(dt: number, hour: number, eye: THREE.Vector3, drone: THREE.Vector3, agl: number) {
    this.time += dt;
    const t = this.time, night = U.uCityLights.value > 0.001;
    const tramRange = Math.min(3000, 1300 + Math.max(0, eye.y) * 4);
    this.trams.update(t, eye, tramRange, night);
    this.river.update(t, dt, hour, eye, night);
    this.people.update(t, hour, eye);
    this.pigeons.update(t, eye, drone, agl);
    this.cars.update(t, eye, night);
    this.lamps.set(night ? [this.trams.lamps, this.cars.lamps, this.river.lamps] : []);
  }
}
