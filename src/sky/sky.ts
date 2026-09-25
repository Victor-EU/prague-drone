// The plain sky of milestone M0: a gradient dome keyed to the sun's elevation, the sun as a
// directional light with a shadow that follows the view, fog for haze, and the sky as the
// environment light. M1 replaces the dome with the analytic sky model of design.md §8.6.

import * as THREE from 'three';
import { sunPosition } from '../core/sun.ts';

interface Key { e: number; zenith: string; horizon: string; glow: string }

// Colours from design.md §8.9 where the palette has them (sky zenith day, morning and day horizons,
// blue hour), sRGB.
const KEYS: Key[] = [
  { e: -14, zenith: '#060b14', horizon: '#0d1520', glow: '#0d1520' },
  { e: -7, zenith: '#13213a', horizon: '#223a5e', glow: '#2a4166' },
  { e: -3, zenith: '#1f3247', horizon: '#376ba3', glow: '#7d6f8a' },
  { e: 0, zenith: '#34506e', horizon: '#9fa3b4', glow: '#e5935c' },
  { e: 4, zenith: '#44678a', horizon: '#d7c8bb', glow: '#f0b27c' },
  { e: 10, zenith: '#4f7396', horizon: '#e9ded5', glow: '#f2d2b0' },
  { e: 28, zenith: '#4f7396', horizon: '#c9d3d6', glow: '#e6e4dc' },
];

const SUN_COLOURS: [number, string][] = [
  [-2, '#ff7a3c'], [2, '#ff9a55'], [6, '#ffbd82'], [14, '#ffdcb6'], [30, '#fff1e2'], [60, '#fff6ec'],
];

const tmpA = new THREE.Color(), tmpB = new THREE.Color();

function lerpKeys(e: number, pick: (k: Key) => string, out: THREE.Color) {
  let a = KEYS[0], b = KEYS[KEYS.length - 1];
  if (e <= a.e) return out.set(pick(a));
  if (e >= b.e) return out.set(pick(b));
  for (let i = 0; i + 1 < KEYS.length; i++)
    if (e >= KEYS[i].e && e <= KEYS[i + 1].e) { a = KEYS[i]; b = KEYS[i + 1]; break; }
  const t = (e - a.e) / (b.e - a.e);
  return out.copy(tmpA.set(pick(a))).lerp(tmpB.set(pick(b)), t);
}

function sunColour(e: number, out: THREE.Color) {
  if (e <= SUN_COLOURS[0][0]) return out.set(SUN_COLOURS[0][1]);
  for (let i = 0; i + 1 < SUN_COLOURS.length; i++) {
    const [ea, ca] = SUN_COLOURS[i], [eb, cb] = SUN_COLOURS[i + 1];
    if (e <= eb) return out.copy(tmpA.set(ca)).lerp(tmpB.set(cb), (e - ea) / (eb - ea));
  }
  return out.set(SUN_COLOURS[SUN_COLOURS.length - 1][1]);
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vec4 p = projectionMatrix * viewMatrix * vec4((modelMatrix * vec4(position, 1.0)).xyz, 1.0);
  gl_Position = p.xyww;
}`;

const FRAG = /* glsl */ `
uniform vec3 uZenith, uHorizon, uGlow, uSunDir, uSunColor;
uniform float uSunVisible;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float up = max(d.y, 0.0);
  vec3 col = mix(uHorizon, uZenith, pow(up, 0.45));
  // Warm the horizon toward the sun.
  vec2 h = normalize(d.xz + 1e-5), s = normalize(uSunDir.xz + 1e-5);
  float toward = pow(max(dot(h, s), 0.0), 3.0) * (1.0 - smoothstep(0.0, 0.5, up));
  col = mix(col, uGlow, toward * 0.85);
  // Below the horizon the dome shows a hazy ground colour; terrain covers it almost everywhere.
  col = mix(col, uHorizon * 0.8, smoothstep(0.0, -0.08, d.y));
  float c = dot(d, uSunDir);
  col += uSunColor * (pow(max(c, 0.0), 12.0) * 0.25 + pow(max(c, 0.0), 400.0) * 1.2) * uSunVisible;
  col += uSunColor * smoothstep(0.99985, 0.99995, c) * 30.0 * uSunVisible;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export class Atmosphere {
  readonly sun = new THREE.DirectionalLight('#ffffff', 3);
  readonly dome: THREE.Mesh;
  readonly fog = new THREE.FogExp2('#c9d3d6', 1e-4);
  elevation = 0;
  azimuth = 0;
  private uniforms = {
    uZenith: { value: new THREE.Color() },
    uHorizon: { value: new THREE.Color() },
    uGlow: { value: new THREE.Color() },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunColor: { value: new THREE.Color() },
    uSunVisible: { value: 1 },
  };
  private envScene = new THREE.Scene();
  private pmrem: THREE.PMREMGenerator;
  private env?: THREE.WebGLRenderTarget;
  private envElevation = -999;
  private scene: THREE.Scene;
  private focus = new THREE.Vector3();

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
    this.scene = scene;
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms, vertexShader: VERT, fragmentShader: FRAG,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), mat);
    this.dome.scale.setScalar(40000);
    this.dome.renderOrder = -10;
    this.dome.frustumCulled = false;
    scene.add(this.dome);
    this.envScene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 48, 24), mat));

    this.pmrem = new THREE.PMREMGenerator(renderer);
    scene.fog = this.fog;
    const s = this.sun.shadow;
    s.mapSize.set(4096, 4096);
    const cam = s.camera as THREE.OrthographicCamera;
    cam.left = -800; cam.right = 800; cam.top = 800; cam.bottom = -800;
    cam.near = 10; cam.far = 4000;
    s.bias = -0.0004;
    s.normalBias = 0.6;
    this.sun.castShadow = true;
    scene.add(this.sun, this.sun.target);
  }

  /** `clock` in hours; `camera` is where the view is, `focus` the ground point the shadow should cover. */
  update(clock: number, camera: THREE.Camera, focus: THREE.Vector3) {
    const { elevation, azimuth } = sunPosition(clock);
    this.elevation = elevation;
    this.azimuth = azimuth;
    const e = (elevation * Math.PI) / 180, a = (azimuth * Math.PI) / 180;
    const dir = this.uniforms.uSunDir.value.set(Math.cos(e) * Math.sin(a), Math.sin(e), -Math.cos(e) * Math.cos(a));

    const u = this.uniforms;
    lerpKeys(elevation, (k) => k.zenith, u.uZenith.value);
    lerpKeys(elevation, (k) => k.horizon, u.uHorizon.value);
    lerpKeys(elevation, (k) => k.glow, u.uGlow.value);
    sunColour(elevation, u.uSunColor.value);
    u.uSunVisible.value = smooth(-1.5, 0.5, elevation);

    this.dome.position.copy(camera.position);

    // The sun as light: fades out through the horizon; below it the sky alone lights the city.
    sunColour(elevation, this.sun.color);
    this.sun.intensity = smooth(-1, 6, elevation) * (2.4 + 1.2 * smooth(5, 40, elevation));
    this.sun.visible = this.sun.intensity > 0.001;

    // The shadow box follows the focus point, snapped to shadow texels so edges do not crawl.
    const cam = this.sun.shadow.camera as THREE.OrthographicCamera;
    const texel = (cam.right - cam.left) / this.sun.shadow.mapSize.x;
    const lightDir = new THREE.Vector3().copy(dir);
    const right = new THREE.Vector3().crossVectors(lightDir, new THREE.Vector3(0, 1, 0));
    if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
    right.normalize();
    const upv = new THREE.Vector3().crossVectors(right, lightDir).normalize();
    const fr = Math.round(focus.dot(right) / texel) * texel;
    const fu = Math.round(focus.dot(upv) / texel) * texel;
    const fd = focus.dot(lightDir);
    this.focus.copy(right).multiplyScalar(fr).addScaledVector(upv, fu).addScaledVector(lightDir, fd);
    this.sun.target.position.copy(this.focus);
    this.sun.position.copy(this.focus).addScaledVector(lightDir, 2000);
    this.sun.target.updateMatrixWorld();

    // Haze: strongest in the warm morning, weakest at midday (design.md §8.6).
    const morning = 1 - smooth(9, 12, clock), evening = smooth(16, 20, clock);
    this.fog.density = 0.9e-4 + 0.7e-4 * morning + 0.35e-4 * evening;
    this.fog.color.copy(u.uHorizon.value).lerp(u.uZenith.value, 0.15);
  }

  /** Re-renders the sky into the environment map when the light has moved enough. */
  updateEnvironment() {
    if (Math.abs(this.elevation - this.envElevation) < 0.4 && this.env) return;
    this.envElevation = this.elevation;
    this.dome.visible = false;
    const next = this.pmrem.fromScene(this.envScene, 0, 1, 1000);
    this.dome.visible = true;
    this.env?.dispose();
    this.env = next;
    this.scene.environment = next.texture;
  }
}
