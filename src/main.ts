// PRAHA: a stylized 3D Prague in early summer, seen from a drone. See design.md.

import * as THREE from 'three';
import { World } from './world/world.ts';
import { DETAIL } from './world/building-material.ts';
import { Atmosphere } from './sky/sky.ts';
import { rollSession } from './sky/clouds.ts';
import { TerrainShadow } from './sky/terrain-shadow.ts';
import { Pipeline } from './render/pipeline.ts';
import { REFLECT } from './render/reflection.ts';
import { U } from './sky/uniforms.ts';
import { loadCube } from './render/lut.ts';
import { Route, hfovFor, WIDE, LONG, type RouteData } from './drone/route.ts';
import { Drone } from './drone/drone.ts';
import { Keys } from './drone/input.ts';
import { Hud } from './ui/hud.ts';
import { PRESETS, choosePreset, Governor, type Quality } from './render/quality.ts';
import { Cover } from './ui/cover.ts';
import { parseClock } from './core/sun.ts';
import routeData from '../data/route.json';
import landmarkData from '../data/landmarks.json';
import lutUrl from '../assets/lut/classic-neg.cube?url';

const params = new URLSearchParams(location.search);
const BASE = `${import.meta.env.BASE_URL}world`;

// Development only: a hero frame's viewpoint (data/viewpoints.json), for judging the render
// against the photograph (design.md §12.1). The shipped app never loads either.
interface Viewpoint {
  id: string; x: number; north: number; agl: number; y?: number; heading: number; tilt: number; focal35: number; aspect: number; clock: string;
  weather: { seed: number; coverage: number; overcast: boolean; cirrus: number; cloudAt?: [number, number]; light?: Record<string, number> };
  /** Seconds of city life to show (trams, boats, people), so a frame always shows the same scene. */
  life?: number;
}
// `?view=look` is a free camera for inspecting the world (set it with the nudges below).
const LOOK: Viewpoint = { id: 'look', x: 0, north: 0, agl: 60, heading: 0, tilt: -10, focal35: 24, aspect: 1.5, clock: '17:30', weather: { seed: 1, coverage: 0.15, overcast: false, cirrus: 0 } };
const view: Viewpoint | undefined = import.meta.env.DEV && params.has('view')
  ? params.get('view') === 'look' ? LOOK : ((await import('../data/viewpoints.json')).default.frames as Viewpoint[]).find((f) => f.id === params.get('view'))
  : undefined;
if (view) {
  // Nudging a viewpoint while lining it up: /?view=8385&heading=40&tilt=-9 (tools/compare.ts id@heading=40,tilt=-9).
  for (const k of ['x', 'north', 'agl', 'y', 'heading', 'tilt', 'focal35', 'aspect'] as const) if (params.has(k)) view[k] = Number(params.get(k));
  // A height above ground is ambiguous over water and on bridges: `y` gives the eye's height instead.
  if (params.has('agl')) delete view.y;
  if (params.has('vclock')) view.clock = params.get('vclock')!;
  params.set('clock', view.clock);
  // The viewpoint's weather, unless the URL nudges it too.
  if (!params.has('seed')) params.set('seed', String(view.weather.seed));
  if (!params.has('coverage')) params.set('coverage', String(view.weather.coverage));
  if (!params.has('overcast')) params.set('overcast', view.weather.overcast ? '1' : '0');
  if (!params.has('cirrus')) params.set('cirrus', String(view.weather.cirrus));
  // The day's own air where it differs from the light family's (9486 and 8753 were hazier).
  for (const [k, v] of Object.entries(view.weather.light ?? {})) if (!params.has(`light.${k}`)) params.set(`light.${k}`, String(v));
  document.body.classList.add('viewpoint');
}

const canvas = document.getElementById('view') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', reversedDepthBuffer: true });
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.info.autoReset = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 3, 60000);

// The cover (design.md §10.2): the loading screen, then the first view under the title, until a
// click or a key. Development URLs that place the drone skip it.
const cover = !view && !params.has('t') && !params.has('manual') ? new Cover(document.body, () => fly()) : undefined;
let firstFrameAt = 0;

// The weather of this session: clouds rolled per session (design.md §8.6), overcast on one in five.
const session = rollSession(params.has('seed') ? Number(params.get('seed')) : undefined);
// A viewpoint may ask for no cumulus at all (0), where its photograph has none (8704, 9547).
if (params.has('coverage')) session.coverage = THREE.MathUtils.clamp(Number(params.get('coverage')), 0, 0.65);
if (params.has('cirrus')) session.cirrus = Number(params.get('cirrus'));
const overcast = params.has('overcast') ? params.get('overcast') !== '0' : Math.random() < 0.2;

const route = new Route(routeData as unknown as RouteData);
const [lut, world] = await Promise.all([loadCube(lutUrl), World.load(BASE, renderer)]);
const atmosphere = new Atmosphere(renderer, scene, session, overcast);
const pipeline = new Pipeline(renderer, lut);
if (import.meta.env.DEV) for (const [k, v] of params) if (k.startsWith('light.')) (atmosphere.lightOverride as Record<string, number | number[]>)[k.slice(6)] = v.includes(':') ? v.split(':').map(Number) : Number(v);
if (import.meta.env.DEV && params.get('ao') === '0') pipeline.ao = false;
if (import.meta.env.DEV && params.get('grade') === '0') pipeline.grade = false;
// The quality preset (design.md §11) and the governor of the render scale. Viewpoints and
// measurements (`?scale=1`) hold a fixed scale.
let quality: Quality = PRESETS[choosePreset(params, renderer.getContext())];
const governor = new Governor(quality);
const fixedScale = params.has('scale') ? Number(params.get('scale')) : view ? 1 : undefined;
if (fixedScale) governor.scale = fixedScale;
function applyQuality(q: Quality) {
  quality = q;
  pipeline.ao = q.ao && !(import.meta.env.DEV && params.get('ao') === '0');
  world.water.mirror.scale = q.mirror;
  world.water.mirror.range = q.mirrorRange;
  atmosphere.clouds.divisor = q.clouds;
  atmosphere.clouds.maxCoverage = q.coverage;
  atmosphere.sun.shadow.camera.far = q.shadowFar;
  world.buildings.detailRange = q.detail;
  if (world.landmarks) world.landmarks.detailRange = q.detail * 0.9;
  if (world.trees) world.trees.spriteShadows = q.spriteShadows;
  // The close-up details (design.md §8.2, §8.4), off with `?detail=0` in development to measure them.
  const detail = !(import.meta.env.DEV && params.get('detail') === '0');
  DETAIL.value = detail ? 1 : 0;
  if (world.trees) world.trees.leaves = detail;
}
applyQuality(quality);
// The shadow maps are sized once, before the first frame allocates them.
atmosphere.sun.shadow.mapSize.set(quality.shadow, quality.shadow);
const terrainShadow = new TerrainShadow(world.height);
scene.add(world.group);
atmosphere.sun.layers.enable(REFLECT);
// The rest of the world streams in behind the first frame (design.md §10.2).
const streamed = world.stream(renderer, (o) => pipeline.compile(o, camera, scene)).then(() => {
  performance.mark('praha:streamed');
  applyQuality(quality);
});

/**
 * Once the world is in (under the cover), the whole of it is drawn once, into the scene's target
 * and the mirror's, never to the screen: nothing culled and every detail shown, so each mesh's
 * buffers reach the GPU now and not on the frame it first comes into view, and every lamp lit, as
 * the driver finishes their programs on first use (the mirror took 80 ms over it at the first dusk).
 */
function warmUp() {
  const lit = U.uCityLights.value, p = camera.position;
  U.uCityLights.value = 1;
  if (world.lights) world.lights.points.visible = true;
  world.life?.lamps.set([[p.x, p.y - 40, p.z, 1, p.x + 2, p.y - 40, p.z, 0]]);
  world.buildings.detailRange = world.landmarks!.detailRange = Infinity;
  world.buildings.update(p);
  world.landmarks?.update(p);
  pipeline.warm(scene, camera, true);
  world.water.mirror.render(renderer, scene, camera, Math.min(0, p.y - 50));
  U.uCityLights.value = lit;
  world.life?.lamps.set([]);
  applyQuality(quality);
  world.lights?.update();
}

function resize() {
  let w = window.innerWidth, h = window.innerHeight;
  // A viewpoint renders at its photograph's aspect, the largest such frame in the window.
  if (view) {
    if (w / h > view.aspect) w = Math.round(h * view.aspect); else h = Math.round(w / view.aspect);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }
  // Cap the drawing buffer (near 2560 × 1600 on the full preset) so the frame rate target holds on
  // large screens; the governor's scale goes below a pixel a pixel when it must.
  const ratio = Math.min(window.devicePixelRatio, Math.sqrt(quality.pixels / (w * h)));
  renderer.setPixelRatio(Math.max(view ? 1 : 0.5, (view ? Math.max(1, ratio) : ratio) * governor.scale));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  pipeline.setSize(size.x, size.y);
  atmosphere.setSize(size.x, size.y);
  world.water.setSize(size.x, size.y);
}
window.addEventListener('resize', resize);
resize();

const drone = new Drone(route, world);
const keys = new Keys(window);
let dayAdvances = true;
let clock = route.clock(0);
let fixedClock = clock;
if (params.has('clock')) {
  dayAdvances = false;
  fixedClock = clock = params.get('clock')!.includes(':') ? parseClock(params.get('clock')!) : Number(params.get('clock'));
}
if (params.has('t')) drone.setAuto(Number(params.get('t')));
drone.fast = params.has('fast');
if (params.has('manual')) drone.takeOver();
drone.waiting = cover !== undefined;
if (dayAdvances) clock = route.clock(drone.t);

const hud = new Hud(document.getElementById('hud')!, {
  setClock: (h) => { fixedClock = clock = h; },
  setDayAdvances: (on) => { dayAdvances = on; if (!on) fixedClock = clock; },
  setMode: (m) => {
    if (m === 'manual') return drone.takeOver();
    drone.fast = m === 'fast';
    if (drone.mode === 'manual') drone.rejoin();
  },
  setOvercast: (on) => { atmosphere.overcastTarget = on ? 1 : 0; },
}, world.manifest.attribution.replace('Map data ', '').replace(/\. /g, ' · '));
let statsOn = params.has('stats');
hud.stats.style.display = statsOn ? 'block' : 'none';
const hudEl = document.getElementById('hud')!;
hudEl.classList.toggle('covered', cover !== undefined);

/** The cover lifts: the drone starts the route, the interface follows a second later. */
function fly() {
  drone.fly();
  setTimeout(() => { hudEl.classList.remove('covered'); hud.shown(); }, 1000);
}
if (!cover) hud.shown();

world.buildings.load(world.manifest.tiles, drone.position);
// Loading milestones (design.md §10.2), read by tools/motion.ts: the world's data in, the first
// frame drawn, the last tile in.
performance.mark('praha:world');
const worldLoadedAt = performance.now();
let cityLoaded = false;
if (view?.weather.cloudAt) atmosphere.clouds.moveDensestOver(view.weather.cloudAt[0], -view.weather.cloudAt[1]);
// A viewpoint shows its moment of city life, still; `?life=seconds` sets it for any view.
if (view || params.has('life')) void streamed.then(() => world.life?.setTime(params.has('life') ? Number(params.get('life')) : (view?.life ?? 60)));

// Handles for poking at the running app from the console, in development only.
if (import.meta.env.DEV) {
  const dev = await import('./dev/compare.ts');
  const once = () => { placeCamera(); renderFrame(1 / 60); };
  Object.assign(window, {
    praha: {
      renderer, scene, camera, world, atmosphere, pipeline, drone, route, bench, worldLoadedAt, governor,
      quality: () => quality,
      setClock: (h: number) => { dayAdvances = false; fixedClock = clock = h; },
      keys, rollSession, U, hud,
      /** Starts recording frames; `false` stops and returns them: [route time, interval ms, work ms, programs]. */
      record: (on = true) => { const r = recording; recording = on ? [] : null; return r; },
      frame: (n = 1) => { for (let k = 0; k < n; k++) once(); },
      capture: (name = 'capture.png') => dev.capture(canvas, once, name),
      sheet: (width = 0, suffix = '') => view && dev.sheet(canvas, once, view.id, width, suffix),
      /** For tools/lut-fit.ts: what the grade does after the LUT at this viewpoint, and the images it needs. */
      fitCapture: () => view && dev.fitCapture(canvas, once, (m) => { pipeline.fit = m; }, view.id, {
        id: view.id, clock: view.clock, overcast, contrast: atmosphere.light.contrast, lift: atmosphere.light.lift,
        vignette: THREE.MathUtils.lerp(0.26, 0.12, THREE.MathUtils.clamp((view.focal35 - WIDE) / (LONG - WIDE), 0, 1)),
        grade: pipeline.grade,
      }),
    },
  });
}

function placeCamera() {
  if (view) {
    const z = -view.north;
    camera.position.set(view.x, view.y ?? world.ground(view.x, z) + view.agl, z);
    camera.rotation.set(THREE.MathUtils.degToRad(view.tilt), THREE.MathUtils.degToRad(-view.heading), 0, 'YXZ');
  } else {
    camera.position.copy(drone.position);
    camera.quaternion.copy(drone.quaternion);
  }
  // A 35 mm frame is 36 mm wide in landscape and 24 mm in portrait.
  const hfov = view ? 2 * Math.atan((view.aspect >= 1 ? 18 : 12) / view.focal35) : hfovFor(drone.focal);
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hfov / 2) / camera.aspect));
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}

function renderFrame(dt: number) {
  renderer.info.reset();
  atmosphere.update(clock, camera, dt);
  atmosphere.updateEnvironment();
  terrainShadow.update(renderer, atmosphere.sunDir);
  world.terrain.update(camera.position);
  world.buildings.update(camera.position);
  world.streets?.update(camera.position);
  world.landmarks?.update(camera.position);
  world.trees?.update(camera.position);
  world.lights?.update();
  if (world.life) {
    const agl = drone.position.y - world.ground(drone.position.x, drone.position.z);
    world.life.update(view ? 0 : dt, clock, camera.position, drone.position, agl);
  }
  U.uTime.value += dt;
  world.water.renderMirror(renderer, scene, camera);
  pipeline.render(scene, camera, {
    dt,
    light: atmosphere.light,
    lens: THREE.MathUtils.clamp(((view ? view.focal35 : drone.focal) - WIDE) / (LONG - WIDE), 0, 1),
    beforeScene: (cam) => atmosphere.renderClouds(cam),
  });
}

/**
 * Development only: GPU-synchronised frame time at each stop, independent of requestAnimationFrame
 * (which a hidden or background window throttles). Returns milliseconds per frame by stop.
 */
function bench(frames = 12): Record<string, number> {
  const gl = renderer.getContext();
  const px = new Uint8Array(4);
  const sync = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
  const out: Record<string, number> = {};
  const saved = drone.t;
  for (const s of route.stops) {
    drone.setAuto(s.t);
    for (let k = 0; k < 40; k++) world.terrain.update(drone.position, 8);
    placeCamera();
    renderFrame(1 / 60);
    sync();
    const t0 = performance.now();
    for (let k = 0; k < frames; k++) {
      drone.update(1 / 60, keys);
      placeCamera();
      renderFrame(1 / 60);
    }
    sync();
    out[`${s.n} ${s.name}`] = +((performance.now() - t0) / frames).toFixed(1);
  }
  drone.setAuto(saved);
  return out;
}

const landmarks = (landmarkData as { landmarks: { cz: string; en: string; x: number; north: number }[] }).landmarks;
let landmarkShown = -1, landmarkSince = 0;
function pickLandmark(now: number) {
  const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(drone.quaternion);
  let best = -1, bestScore = Infinity;
  landmarks.forEach((l, k) => {
    const dx = l.x - drone.position.x, dz = -l.north - drone.position.z;
    const dy = world.ground(l.x, -l.north) + 20 - drone.position.y;
    const d = Math.hypot(dx, dy, dz);
    if (d > 900) return;
    const cos = (dx * fwd.x + dy * fwd.y + dz * fwd.z) / d;
    if (cos < Math.cos((22 * Math.PI) / 180)) return;
    const score = d * (2 - cos);
    if (score < bestScore) { bestScore = score; best = k; }
  });
  // Hold a name for at least 4 s so labels do not flicker.
  if (best !== landmarkShown && now - landmarkSince > 4) {
    landmarkShown = best;
    landmarkSince = now;
    hud.setLandmark(best >= 0 ? landmarks[best].cz : '', best >= 0 ? landmarks[best].en : '');
  }
}

const timer = new THREE.Timer();
let hudClock = 0, frames = 0, fpsTime = 0, fps = 0;

/**
 * Enter in the blue-hour hold: the flight again from stop 1 at dawn, a cut through black. The clock
 * jumps with the drone; eased, it would spin the sun back through the whole day.
 */
const fadeEl = document.createElement('div');
fadeEl.id = 'fade';
document.body.appendChild(fadeEl);
function restart() {
  drone.setAuto(0);
  if (dayAdvances) clock = route.clock(0);
  fadeEl.style.transition = 'none';
  fadeEl.style.opacity = '1';
  void fadeEl.offsetWidth;
  fadeEl.style.transition = '';
  fadeEl.style.opacity = '0';
}

/**
 * Development only: per frame, the route time, the interval since the last frame, the main thread's
 * work and the number of shader programs so far (tools/motion.ts).
 */
let recording: [number, number, number, number][] | null = null;

function frame(time: number) {
  const workStart = performance.now();
  timer.update(time);
  const raw = timer.getDelta(), dt = Math.min(raw, 0.1);
  // The render scale follows the frame rate once the city is in; a full session that cannot keep
  // up at its lowest scale goes lite.
  if (!fixedScale && cityLoaded) {
    const change = governor.sample(raw);
    if (change === 'lite') {
      applyQuality(PRESETS.lite);
      governor.quality = PRESETS.lite;
    }
    if (change) resize();
  }

  const pressed = keys.drain();
  if (pressed.length && cover?.up) cover.lift();
  for (const k of pressed) {
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown' || k === 'KeyA' || k === 'KeyD') drone.takeOver();
    else if (k === 'Space') drone.toggleHover();
    else if (k === 'Enter' || k === 'NumpadEnter') {
      if (drone.mode === 'manual') drone.rejoin();
      else if (drone.holding) restart();
    } else if (k === 'Backquote') {
      statsOn = !statsOn;
      hud.stats.style.display = statsOn ? 'block' : 'none';
    } else if (k === 'KeyC') atmosphere.reseed(rollSession());
    else if (k === 'KeyG' && import.meta.env.DEV) pipeline.grade = !pipeline.grade;
    else if (k === 'KeyO' && import.meta.env.DEV) pipeline.ao = !pipeline.ao;
  }

  if (!view) drone.update(dt, keys);

  // The clock follows the flight; in the hold it keeps going to 22:30 at a minute a second.
  if (dayAdvances && drone.mode === 'auto') {
    const target = drone.holding
      ? Math.min(route.holdClockEnd, route.clock(route.end) + drone.holdSeconds / 60)
      : route.clock(drone.t);
    clock += (target - clock) * (1 - Math.exp(-dt / 0.6));
  } else if (!dayAdvances) clock = fixedClock;

  placeCamera();
  renderFrame(dt);

  frames++;
  fpsTime += dt;
  if (fpsTime > 0.5) { fps = frames / fpsTime; frames = 0; fpsTime = 0; }
  hudClock += dt;
  if (hudClock > 0.2) {
    hudClock = 0;
    const agl = drone.position.y - world.ground(drone.position.x, drone.position.z);
    hud.update({
      mode: drone.mode === 'manual' ? 'manual' : drone.fast ? 'fast' : 'auto',
      clock, sun: atmosphere.elevation, altitude: agl, dayAdvances,
      clouds: atmosphere.overcast > 0.5 ? 1 : atmosphere.clouds.coverage, overcast: atmosphere.overcastTarget > 0.5,
    });
    pickLandmark(time / 1000);
    if (statsOn) {
      const info = renderer.info.render;
      const s = atmosphere.clouds.session;
      hud.stats.textContent =
        `${fps.toFixed(0)} fps  ${info.calls} calls  ${(info.triangles / 1e6).toFixed(2)} M tris\n` +
        `t ${drone.t.toFixed(1)} s  stop ${route.stopAt(drone.t).n}  ${drone.focal.toFixed(0)} mm\n` +
        `x ${drone.position.x.toFixed(0)}  north ${(-drone.position.z).toFixed(0)}  y ${drone.position.y.toFixed(0)}\n` +
        `clouds seed ${s.seed}  peak ${(s.coverage * 100).toFixed(0)}%  base ${s.base.toFixed(0)} m  wind ${s.wind.toFixed(1)} m/s  cirrus ${s.cirrus.toFixed(2)}\n` +
        `tiles ${world.buildings.loaded}/${world.buildings.total}  grade ${pipeline.grade ? 'on' : 'off'}  ao ${pipeline.ao ? 'on' : 'off'}\n` +
        `${quality.preset}  scale ${governor.scale.toFixed(2)}  ${renderer.domElement.width} × ${renderer.domElement.height}`;
    }
  }
  if (!firstFrameAt) {
    firstFrameAt = performance.now();
    performance.mark('praha:first-frame');
    if (import.meta.env.DEV) console.info(`first frame at ${firstFrameAt.toFixed(0)} ms`);
    cover?.showCity();
  }
  if (!cityLoaded && world.complete) {
    cityLoaded = true;
    performance.mark('praha:city');
    warmUp();
  }
  if (cover?.up && (cityLoaded || performance.now() - firstFrameAt > 6000)) cover.ready();
  if (recording) recording.push([drone.t, raw * 1000, performance.now() - workStart, renderer.info.programs?.length ?? 0]);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
