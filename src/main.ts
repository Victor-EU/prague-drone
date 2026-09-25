// PRAHA: a stylized 3D Prague in early summer, seen from a drone. See design.md.

import * as THREE from 'three';
import { World } from './world/world.ts';
import { Atmosphere } from './sky/sky.ts';
import { Route, hfovFor, type RouteData } from './drone/route.ts';
import { Drone } from './drone/drone.ts';
import { Keys } from './drone/input.ts';
import { Hud } from './ui/hud.ts';
import { parseClock } from './core/sun.ts';
import routeData from '../data/route.json';
import landmarkData from '../data/landmarks.json';

const params = new URLSearchParams(location.search);
const BASE = `${import.meta.env.BASE_URL}world`;

const canvas = document.getElementById('view') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', reversedDepthBuffer: true });
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 3, 60000);

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  // Cap the drawing buffer near 2560 × 1600 so the frame rate target holds on large screens.
  const ratio = Math.min(window.devicePixelRatio, Math.sqrt(4.2e6 / (w * h)));
  renderer.setPixelRatio(Math.max(1, ratio));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
}
window.addEventListener('resize', resize);
resize();

const loading = document.createElement('div');
loading.id = 'loading';
loading.innerHTML = '<h2>PRAHA</h2><div>EARLY SUMMER · LOADING THE CITY</div>';
document.body.appendChild(loading);

const route = new Route(routeData as unknown as RouteData);
const atmosphere = new Atmosphere(renderer, scene);
const world = await World.load(BASE, renderer);
scene.add(world.group);

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
if (dayAdvances) clock = route.clock(drone.t);

const hud = new Hud(document.getElementById('hud')!, {
  setClock: (h) => { fixedClock = clock = h; },
  setDayAdvances: (on) => { dayAdvances = on; if (!on) fixedClock = clock; },
  setMode: (m) => {
    if (m === 'manual') return drone.takeOver();
    drone.fast = m === 'fast';
    if (drone.mode === 'manual') drone.rejoin();
  },
}, world.manifest.attribution.replace('Map data ', '').replace(/\. /g, ' · '));
let statsOn = params.has('stats');
hud.stats.style.display = statsOn ? 'block' : 'none';

world.buildings.load(world.manifest.tiles, drone.position);
const worldLoadedAt = performance.now();

// Handles for poking at the running app from the console, in development only.
if (import.meta.env.DEV) Object.assign(window, { praha: { renderer, scene, camera, world, atmosphere, drone, route, bench, worldLoadedAt } });

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
    const t0 = performance.now();
    for (let k = 0; k < frames; k++) {
      drone.update(1 / 60, keys);
      camera.position.copy(drone.position);
      camera.quaternion.copy(drone.quaternion);
      camera.updateMatrixWorld();
      atmosphere.update(route.clock(drone.t), camera, drone.position);
      world.terrain.update(camera.position);
      renderer.render(scene, camera);
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

const focus = new THREE.Vector3();
const timer = new THREE.Timer();
let hudClock = 0, frames = 0, fpsTime = 0, fps = 0;

function frame(time: number) {
  timer.update(time);
  const dt = Math.min(timer.getDelta(), 0.1);

  for (const k of keys.drain()) {
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown' || k === 'KeyA' || k === 'KeyD') drone.takeOver();
    else if (k === 'Space') drone.toggleHover();
    else if (k === 'Enter' || k === 'NumpadEnter') {
      if (drone.mode === 'manual') drone.rejoin();
      else if (drone.holding) drone.setAuto(0);
    } else if (k === 'Backquote') {
      statsOn = !statsOn;
      hud.stats.style.display = statsOn ? 'block' : 'none';
    }
  }

  drone.update(dt, keys);

  // The clock follows the flight; in the hold it keeps going to 22:30 at a minute a second.
  if (dayAdvances && drone.mode === 'auto') {
    const target = drone.holding
      ? Math.min(route.holdClockEnd, route.clock(route.end) + drone.holdSeconds / 60)
      : route.clock(drone.t);
    clock += (target - clock) * (1 - Math.exp(-dt / 0.6));
  } else if (!dayAdvances) clock = fixedClock;

  camera.position.copy(drone.position);
  camera.quaternion.copy(drone.quaternion);
  const hfov = hfovFor(drone.focal);
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hfov / 2) / camera.aspect));
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();

  // The shadow covers the ground the camera is looking at.
  const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  fwd.y = 0;
  if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1);
  fwd.normalize();
  const agl = drone.position.y - world.ground(drone.position.x, drone.position.z);
  focus.copy(drone.position).addScaledVector(fwd, THREE.MathUtils.clamp(agl * 1.5, 150, 550));
  focus.y = world.ground(focus.x, focus.z);
  atmosphere.update(clock, camera, focus);
  atmosphere.updateEnvironment();
  world.terrain.update(camera.position);

  renderer.render(scene, camera);

  frames++;
  fpsTime += dt;
  if (fpsTime > 0.5) { fps = frames / fpsTime; frames = 0; fpsTime = 0; }
  hudClock += dt;
  if (hudClock > 0.2) {
    hudClock = 0;
    hud.update({
      mode: drone.mode === 'manual' ? 'manual' : drone.fast ? 'fast' : 'auto',
      clock, sun: atmosphere.elevation, altitude: agl, dayAdvances,
    });
    pickLandmark(time / 1000);
    if (statsOn) {
      const info = renderer.info.render;
      hud.stats.textContent =
        `${fps.toFixed(0)} fps  ${info.calls} calls  ${(info.triangles / 1e6).toFixed(2)} M tris\n` +
        `t ${drone.t.toFixed(1)} s  stop ${route.stopAt(drone.t).n}  ${drone.focal.toFixed(0)} mm\n` +
        `x ${drone.position.x.toFixed(0)}  north ${(-drone.position.z).toFixed(0)}  y ${drone.position.y.toFixed(0)}\n` +
        `tiles ${world.buildings.loaded}/${world.buildings.total}`;
    }
  }
  if (loading.style.opacity !== '0') {
    if (import.meta.env.DEV) console.info(`first frame at ${performance.now().toFixed(0)} ms`);
    loading.style.opacity = '0';
    setTimeout(() => loading.remove(), 1300);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
