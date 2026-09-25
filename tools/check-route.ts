// Prints the auto route timeline for checking data/route.json by eye: clock, position (x, alt,
// north), speed, focal length and stop, every 6 s, then the lowest altitude and top speed.
//
//   node tools/check-route.ts

import { readFileSync } from 'node:fs';
import { Vector3 } from 'three';
import { Route } from '../src/drone/route.ts';
import { formatClock } from '../src/core/sun.ts';

const route = new Route(JSON.parse(readFileSync('data/route.json', 'utf8')));
const p = new Vector3(), q = new Vector3();
const pad = (v: number, n: number, d = 0) => v.toFixed(d).padStart(n);

for (let t = 0; t <= route.duration; t += 6) {
  route.position(t, p);
  route.position(t + 0.5, q);
  const speed = q.distanceTo(p) / 0.5;
  console.log(
    `${pad(t, 3)} s  ${formatClock(route.clock(t))}  x ${pad(p.x, 6)}  alt ${pad(p.y, 4)}  north ${pad(-p.z, 6)}` +
      `  ${pad(speed, 5, 1)} m/s  ${pad(route.focal(t), 4, 1)} mm  stop ${route.stopAt(t).n}`,
  );
}

let minAlt = Infinity, maxSpeed = 0;
for (let t = 0; t <= route.end; t += 0.25) {
  route.position(t, p);
  route.position(t + 0.25, q);
  minAlt = Math.min(minAlt, p.y);
  maxSpeed = Math.max(maxSpeed, q.distanceTo(p) / 0.25);
}
console.log(`lowest altitude ${minAlt.toFixed(1)} m, top speed ${maxSpeed.toFixed(1)} m/s`);
