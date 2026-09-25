// A worker thread of tools/build-world.ts: plans batches of buildings (tools/lib/plan.ts).

import { parentPort } from 'node:worker_threads';
import { initSkeleton } from './skeleton.ts';
import { planBuilding, type PlanInput } from './plan.ts';

await initSkeleton();
parentPort!.on('message', (jobs: PlanInput[]) => parentPort!.postMessage(jobs.map((j) => {
  const t0 = performance.now();
  const o = planBuilding(j);
  const ms = performance.now() - t0;
  if (process.env.PLAN_SLOW && ms > 150) console.log(`slow ${ms.toFixed(0)} ms ${j.key} ${j.poly.outer.length / 2}+${j.poly.holes.map((h) => h.length / 2).join('+')} vertices, ${j.area.toFixed(0)} m²`);
  return o;
})));
parentPort!.postMessage('ready');
