// The motion tests of design.md §12.2 and the loading budget of §10.2, in headless Chrome on the GPU.
//
//   node tools/motion.ts load [runs]     the production build (dist/, `npm run build` first) over a fast
//                                        connection, cache off: when the world's data is in, the
//                                        first frame, the last tile; the bytes transferred
//   node tools/motion.ts route [1|2]     the auto route in real time at 1× or 2× (fast mode), every
//                                        frame's interval and main-thread work: the hitches over 33 ms
//                                        (SIZE, default 1800x1100; END stops it early, route seconds)
//   node tools/motion.ts manual          five minutes of manual flight at Shift speed round the core,
//                                        steered at random, simulated at 60 Hz: the lowest clearance
//                                        over roofs, landmarks and ground, and whether it left the world
//   node tools/motion.ts clouds          20 reseeds: each session's coverage, the drawn coverage at
//                                        14:00, and the wind that moves the shadows
//   node tools/motion.ts clock           the clock slid from 04:30 to 23:00 over 3600 frames at a stop:
//                                        the largest jumps in the frame's brightness, sky and city
//   node tools/motion.ts bench [query …] GPU-synchronised milliseconds a frame at every stop of the
//                                        route, for each URL query (`quality=lite`), in alternating
//                                        rounds (ROUNDS, default 2), at SIZE (default 2048x1536)
//
// Frame rates measured here are this machine's, with whatever else is running on its GPU.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { openPage, quietServer, sleep, waitFor } from './lib/chrome.ts';

const [test = 'load', ...args] = process.argv.slice(2);

/** A fast connection (§10.2): 100 Mbit/s down, 20 ms to the server. */
const FAST = { offline: false, latency: 20, downloadThroughput: 100e6 / 8, uploadThroughput: 20e6 / 8 };

async function load(runs: number) {
  if (!existsSync('dist/index.html')) throw new Error('no dist/: run `npm run build` first');
  const PORT = 4173, ORIGIN = `http://localhost:${PORT}`;
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true });
  // The preview server and its npx wrapper go with this process, however it ends.
  process.on('exit', () => { try { process.kill(-server.pid!, 'SIGTERM'); } catch { /* gone */ } });
  try {
    for (let k = 0; k < 40 && !(await fetch(ORIGIN).then((r) => r.ok, () => false)); k++) await sleep(250);
    for (let run = 0; run < runs; run++) {
      const page = await openPage();
      try {
        let bytes = 0;
        // The page's connection; its workers (which fetch the building tiles) share it, and are
        // attached only to count their bytes.
        const throttle = async (session?: string) => {
          await page.send('Network.enable', {}, session);
          await page.send('Network.setCacheDisabled', { cacheDisabled: true }, session);
          if (!session) await page.send('Network.emulateNetworkConditions', FAST);
        };
        page.on((method, p) => {
          if (method === 'Network.loadingFinished') bytes += Number(p.encodedDataLength ?? 0);
          if (method === 'Runtime.consoleAPICalled' && process.env.VERBOSE) console.log('  console:', (p.args as { value?: unknown }[]).map((a) => a.value).join(' '));
          if (method === 'Target.attachedToTarget') {
            const sid = p.sessionId as string;
            void throttle(sid).then(() => page.send('Runtime.runIfWaitingForDebugger', {}, sid));
          }
        });
        await throttle();
        await page.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
        if (process.env.VERBOSE) await page.send('Runtime.enable');
        await page.send('Page.navigate', { url: ORIGIN });
        await waitFor(page, `performance.getEntriesByName('praha:city').length`, 60000, 'the last tile');
        const marks = await page.evaluate<Record<string, number>>(
          `Object.fromEntries(['praha:world', 'praha:first-frame', 'praha:streamed', 'praha:city'].map((n) => [n.slice(6), performance.getEntriesByName(n)[0]?.startTime ?? -1]))`,
        );
        const s = (ms: number) => `${(ms / 1000).toFixed(2)} s`;
        console.log(`run ${run + 1}: data ${s(marks.world)}  first frame ${s(marks['first-frame'])}  streamed ${s(marks.streamed)}  city ${s(marks.city)}  ${(bytes / 1e6).toFixed(1)} MB`);
        if (process.env.VERBOSE) {
          const res = await page.evaluate<[string, number, number][]>(`performance.getEntriesByType('resource').filter((r) => !r.name.includes('/tiles/')).map((r) => [r.name.replace(location.origin, ''), Math.round(r.startTime), Math.round(r.responseEnd)])`);
          for (const [name, a, b] of res) console.log(`  ${name.padEnd(44)} ${String(a).padStart(5)} → ${String(b).padStart(5)} ms`);
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    try { process.kill(-server.pid!, 'SIGTERM'); } catch { /* gone */ }
  }
}

/**
 * Frame times at every stop: GPU-synchronised, and the CPU's share alone. Each variant is a URL
 * query, optionally `|` a setup expression run once the city is in; each in turn, ROUNDS times,
 * so the machine's load hits all alike.
 */
async function bench(variants: string[]) {
  const { origin, close } = await quietServer();
  const [width, height] = (process.env.SIZE ?? '2048x1536').split('x').map(Number);
  const frames = Number(process.env.FRAMES ?? 16);
  const page = await openPage({ width, height });
  try {
    for (let round = 0; round < Number(process.env.ROUNDS ?? 2); round++)
      for (const v of variants) {
        const [q, setup = ''] = v.split('|');
        await page.send('Page.navigate', { url: `${origin}/?scale=1&${q}` });
        await waitFor(page, 'window.praha && praha.world.complete', 90000, 'the city');
        await sleep(3000);
        const r = await page.evaluate<{ gpu: number[]; cpu: number[]; size: string }>(`(() => {
          ${setup};
          const gl = praha.renderer.getContext(), px = new Uint8Array(4);
          const sync = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
          const gpu = [], cpu = [];
          for (const s of praha.route.stops) {
            praha.drone.setAuto(s.t);
            for (let k = 0; k < 40; k++) praha.world.terrain.update(praha.drone.position, 8);
            praha.frame(3); sync();
            const t0 = performance.now();
            praha.frame(${frames}); sync();
            gpu.push((performance.now() - t0) / ${frames});
            // The CPU alone: frames timed without waiting (the GPU's queue drains behind).
            let c = 0;
            for (let k = 0; k < 6; k++) { const a = performance.now(); praha.frame(1); c += performance.now() - a; sync(); }
            cpu.push(c / 6);
          }
          return { gpu, cpu, size: praha.renderer.domElement.width + 'x' + praha.renderer.domElement.height };
        })()`);
        const avg = (a: number[]) => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1);
        console.log(`${v.slice(0, 40).padEnd(40)} ${r.size.padEnd(10)} avg ${avg(r.gpu)} (cpu ${avg(r.cpu)})  max ${Math.max(...r.gpu).toFixed(1)}   ${r.gpu.map((x) => x.toFixed(1)).join(' ')}`);
      }
  } finally {
    await page.close();
    await close();
  }
}

/** Opens the app at `query` on a dev server of its own (no hot reload) and waits for the whole city. */
async function app(query: string, size = { width: 1800, height: 1100 }) {
  const { origin, close } = await quietServer();
  const page = await openPage(size);
  // GOVERNOR=1 leaves the render scale to the governor, as a visitor has it; otherwise it is held at 1.
  await page.send('Page.navigate', { url: `${origin}/?${process.env.GOVERNOR ? '' : 'scale=1&'}seed=7&overcast=0&${query}` });
  await waitFor(page, 'window.praha && praha.world.complete', 90000, 'the city');
  await sleep(2000);
  return { page, close: async () => { await page.close(); await close(); } };
}

const pct = (a: number[], p: number) => { const b = a.slice().sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; };

async function route(speed: number) {
  const [width, height] = (process.env.SIZE ?? '1800x1100').split('x').map(Number);
  const { page, close } = await app(`t=0${speed === 2 ? '&fast' : ''}`, { width, height });
  try {
    await page.evaluate('praha.drone.setAuto(0), praha.record(true), 0');
    // END (route seconds) stops the flight early, for a quick look at one stretch.
    await waitFor(page, `praha.drone.t >= ${process.env.END ?? 'praha.route.end'}`, 400000, 'the end of the route');
    const rec = (await page.evaluate<[number, number, number, number][]>('praha.record(false)')).slice(2);
    const dt = rec.map((r) => r[1]), work = rec.map((r) => r[2]);
    // At 60 Hz a frame is 16.7 or 33.3 ms (one vsync missed) or more; a hitch is over 33 ms, past
    // the jitter of two vsyncs.
    const hitches = rec.filter((r) => r[1] > 34.5), missed = rec.filter((r) => r[1] > 20 && r[1] <= 34.5);
    const scale = await page.evaluate<string>('`${praha.quality().preset} at scale ${praha.governor.scale.toFixed(2)}, ${praha.renderer.domElement.width} × ${praha.renderer.domElement.height}`');
    console.log(`route at ${speed}×, ${scale} at the end: ${rec.length} frames, interval median ${pct(dt, 0.5).toFixed(1)} ms, 99th ${pct(dt, 0.99).toFixed(1)}, max ${Math.max(...dt).toFixed(1)}; ` +
      `main thread median ${pct(work, 0.5).toFixed(1)} ms, 99th ${pct(work, 0.99).toFixed(1)}, max ${Math.max(...work).toFixed(1)}`);
    console.log(`  hitches (intervals over 33 ms): ${hitches.length}; frames of two vsyncs: ${missed.length}; main-thread frames over 33 ms: ${rec.filter((r) => r[2] > 33).length}, over 16.7 ms: ${rec.filter((r) => r[2] > 16.7).length}`);
    const worst = rec.slice().sort((a, b) => b[1] - a[1]).slice(0, 12);
    console.log(`  longest intervals: ${worst.map(([t, d, w]) => `${d.toFixed(0)} ms (work ${w.toFixed(0)}) at ${t.toFixed(1)} s`).join(', ')}`);
    const busiest = rec.slice().sort((a, b) => b[2] - a[2]).slice(0, 6);
    console.log(`  most main-thread work: ${busiest.map(([t, d, w]) => `${w.toFixed(0)} ms at ${t.toFixed(1)} s`).join(', ')}`);
    // Shader programs compiled during the flight (each a likely hitch): they should all be made before it.
    const compiled = rec.filter((r, i) => i > 0 && r[3] > rec[i - 1][3]);
    console.log(`  programs compiled in flight: ${compiled.length ? compiled.map(([t, , w, n]) => `${n} at ${t.toFixed(1)} s (${w.toFixed(0)} ms)`).join(', ') : 'none'} (${rec[0]?.[3]} at the start)`);
    // Hitches by leg: intervals over twice the median, stop by stop.
    const med = pct(dt, 0.5), stops = await page.evaluate<number[]>('praha.route.stops.map((s) => s.t)');
    const legs = stops.map((t0, k) => { const t1 = stops[k + 1] ?? Infinity; return rec.filter((r) => r[0] >= t0 && r[0] < t1 && r[1] > med * 2 + 1).length; });
    console.log(`  intervals over twice the median, by stop: ${legs.map((n, k) => `${k + 1}:${n}`).join(' ')}`);
  } finally {
    await close();
  }
}

async function manual() {
  const { page, close } = await app('t=144');
  try {
    const r = await page.evaluate<Record<string, unknown>>(`(() => {
      const d = praha.drone, w = praha.world, b = w.bounds;
      d.setAuto(144); d.update(1 / 60, praha.keys); d.takeOver();
      const held = new Set(['ShiftLeft']);
      const keys = { held: (c) => held.has(c), drain: () => [] };
      let seed = 7;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const ACTIONS = [null, null, 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'KeyS'];
      let left = 0, minClear = Infinity, at = null, low = 0, minAgl = Infinity, maxAgl = 0, outside = 0, far = 0;
      const dt = 1 / 60, steps = 300 * 60;
      for (let i = 0; i < steps; i++) {
        const p = d.position, dist = Math.hypot(p.x, p.z);
        if (--left <= 0) {
          held.clear(); held.add('ShiftLeft');
          const a = ACTIONS[Math.floor(rnd() * ACTIONS.length)];
          if (a) held.add(a);
          // Round the core: past 1.6 km from Charles Bridge, turn back toward it.
          if (dist > 1600) {
            const fwd = new (p.constructor)(0, 0, -1).applyQuaternion(d.quaternion);
            held.delete('ArrowLeft'); held.delete('ArrowRight');
            held.add(fwd.x * -p.z - fwd.z * -p.x > 0 ? 'ArrowRight' : 'ArrowLeft');
          }
          left = Math.round((0.8 + rnd() * 3.5) * 60);
        }
        d.update(dt, keys);
        const q = d.position, top = w.surface(q.x, q.z, 3), g = w.ground(q.x, q.z);
        const clear = q.y - top;
        if (clear < minClear) { minClear = clear; at = [q.x, -q.z, q.y, top]; }
        if (clear < 12) low++;
        minAgl = Math.min(minAgl, q.y - g); maxAgl = Math.max(maxAgl, q.y - g);
        if (q.x < b.xMin || q.x > b.xMax || q.z < b.zMin || q.z > b.zMax) outside++;
        far = Math.max(far, Math.hypot(q.x, q.z));
      }
      return { minClear: +minClear.toFixed(2), at: at.map((v) => +v.toFixed(0)), underTwelve: +(low / steps * 100).toFixed(1), minAgl: +minAgl.toFixed(1), maxAgl: +maxAgl.toFixed(0), outside, farthest: +far.toFixed(0) };
    })()`);
    console.log('manual, 5 min at Shift speed:', JSON.stringify(r));
    console.log(Number(r.minClear) > 3 && r.outside === 0 ? '  pass: never within the camera\'s near plane (3 m) of a surface, never outside the world' : '  FAIL');
  } finally {
    await close();
  }
}

async function clouds() {
  const { page, close } = await app('t=100&clock=14:00');
  try {
    for (let k = 0; k < 20; k++) {
      const r = await page.evaluate<number[]>(`(async () => {
        const a = praha.atmosphere, s = praha.rollSession();
        a.reseed(s);
        for (let i = 0; i < 100 && a.clouds.session !== s; i++) await new Promise((ok) => setTimeout(ok, 50));
        praha.frame(2);
        const w0 = a.clouds.time;
        const u = praha.U;
        const x0 = u.uWind.value.x, y0 = u.uWind.value.y;
        praha.frame(60);
        const moved = Math.hypot(u.uWind.value.x - x0, u.uWind.value.y - y0);
        return [s.seed, s.coverage, a.clouds.coverage, s.wind, moved, u.uCloud.value.y, a.clouds.session === s ? 1 : 0];
      })()`);
      const [seed, peak, now, wind, moved, shade, applied] = r;
      const ok = applied && peak >= 0.05 && peak <= 0.65 && now >= 0.05 && now <= 0.65 && moved > 0 && shade > 0;
      console.log(`seed ${String(seed).padStart(10)}  peak ${(peak * 100).toFixed(0).padStart(2)}%  at 14:00 ${(now * 100).toFixed(0).padStart(2)}%  wind ${wind.toFixed(1)} m/s, shadows moved ${moved.toFixed(0)} m in a second  ${ok ? 'ok' : 'FAIL'}`);
    }
  } finally {
    await close();
  }
}

async function clock() {
  const stop = Number(args[0] ?? 16);
  const { page, close } = await app(`t=${stop}`);
  try {
    const r = await page.evaluate<{ h: number; y: number; sky: number; city: number; lights: number }[]>(`(async () => {
      const s = praha.route.stops[${stop} - 1];
      praha.drone.setAuto(s.t);
      const gl = praha.renderer.getContext(), W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
      const row = new Uint8Array(W * 4);
      const u = praha.U;
      // Mean brightness of rows across the frame: the upper third (mostly sky) and the lower two (city).
      const sample = (y0, y1) => { let sum = 0, n = 0; for (let k = 0; k < 6; k++) { const y = Math.round(H * (y0 + (y1 - y0) * (k + 0.5) / 6)); gl.readPixels(0, y, W, 1, gl.RGBA, gl.UNSIGNED_BYTE, row); for (let i = 0; i < W * 4; i += 16) { sum += 0.2126 * row[i] + 0.7152 * row[i + 1] + 0.0722 * row[i + 2]; n++; } } return sum / n; };
      const out = [];
      const N = 3600;
      for (let f = 0; f <= N; f++) {
        const h = 4.5 + (23 - 4.5) * f / N;
        praha.setClock(h);
        praha.frame(1);
        const sky = sample(0.7, 0.98), city = sample(0.05, 0.6);
        out.push({ h, y: (sky + 2 * city) / 3, sky, city, lights: u.uCityLights.value });
      }
      return out;
    })()`);
    const jumps = r.slice(1).map((e, i) => ({ h: e.h, d: e.y - r[i].y, ds: e.sky - r[i].sky, dc: e.city - r[i].city, dl: e.lights - r[i].lights }));
    const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
    const top = (key: 'd' | 'ds' | 'dc' | 'dl') => jumps.slice().sort((a, b) => Math.abs(b[key]) - Math.abs(a[key])).slice(0, 5).map((j) => `${j[key] >= 0 ? '+' : ''}${j[key].toFixed(key === 'dl' ? 3 : 2)} at ${fmt(j.h)}`).join(', ');
    console.log(`clock slide at stop ${stop}, 04:30 to 23:00 in ${r.length - 1} frames (${((18.5 * 60) / (r.length - 1)).toFixed(2)} min a frame); brightness 0 to 255`);
    console.log(`  frame:  ${top('d')}`);
    console.log(`  sky:    ${top('ds')}`);
    console.log(`  city:   ${top('dc')}`);
    console.log(`  lights: ${top('dl')}`);
    // A pop is a step unlike its neighbours: the step less the mean of the steps either side.
    const pops = jumps.slice(1, -1).map((j, i) => ({ h: j.h, p: j.d - (jumps[i].d + jumps[i + 2].d) / 2 })).sort((a, b) => Math.abs(b.p) - Math.abs(a.p)).slice(0, 5);
    console.log(`  pops:   ${pops.map((j) => `${j.p >= 0 ? '+' : ''}${j.p.toFixed(2)} at ${fmt(j.h)}`).join(', ')}`);
    const ranges = [4.5, 6, 9, 12, 15, 18, 20, 21, 22, 23];
    console.log('  brightness by hour: ' + ranges.map((h) => { const e = r.reduce((a, b) => (Math.abs(b.h - h) < Math.abs(a.h - h) ? b : a)); return `${fmt(h)} ${e.y.toFixed(0)}`; }).join('  '));
  } finally {
    await close();
  }
}

try {
  if (test === 'load') await load(Number(args[0] ?? 3));
  else if (test === 'route') await route(Number(args[0] ?? 1));
  else if (test === 'manual') await manual();
  else if (test === 'clouds') await clouds();
  else if (test === 'clock') await clock();
  else if (test === 'bench') await bench(args.length ? args : ['']);
  else throw new Error(`unknown test ${test}`);
} finally {
  process.exit(process.exitCode ?? 0);
}
