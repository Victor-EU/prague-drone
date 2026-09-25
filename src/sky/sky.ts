// The sky and its light (design.md §5.3, §8.6): the sun at its computed position, coloured by
// the air it crosses; the sky dome from the scattering tables with the sun's disc, cirrus, the
// overcast deck, the stars and the cumulus composited in; the same dome, without the sun and with
// the ground below, as the environment light; the light families driving the knobs; the haze.

import * as THREE from 'three';
import { SunLight } from 'three/addons/lights/SunLight.js';
import { sunPosition } from '../core/sun.ts';
import { Scattering } from './scattering.ts';
import { Clouds, rollSession, type CloudSession } from './clouds.ts';
import { lightAt, type Light } from './families.ts';
import { ATMOSPHERE, SKY_LOOKUP } from './glsl.ts';
import { U, SUN_E } from './uniforms.ts';

// The dome sits on the far plane (depth 0 with the reversed depth buffer) and draws after the
// city, so the depth test leaves only the sky's own pixels to shade.
const DOME_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = (modelMatrix * vec4(position, 0.0)).xyz;
  vec4 p = projectionMatrix * viewMatrix * vec4((modelMatrix * vec4(position, 1.0)).xyz, 1.0);
  gl_Position = vec4(p.xy, 0.0, p.w);
}`;

const DOME_FRAG = /* glsl */ `
${ATMOSPHERE}
${SKY_LOOKUP}
uniform sampler2D uSkyStats;
uniform float uEnv;
uniform sampler2D tClouds;
uniform vec2 uResolution;
uniform float uCloudsOn;
uniform float uCoverage;
uniform sampler2D tCirrus;
uniform float uCirrus;
uniform vec2 uCirrusOffset;
uniform float uOvercast;
uniform vec3 uOvercastSky;
uniform vec3 uSunDisc;
uniform vec3 uCloudSun;
uniform float uNight;
varying vec3 vDir;

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

void main() {
  vec3 d = normalize(vDir);
  vec3 sky = aSky(d);
  vec3 hemi = texture2D(uSkyStats, vec2(0.375, 0.5)).rgb;
  float up = max(d.y, 0.0);

  // Night: the city's glow on the horizon and a few stars (design.md §8.7).
  if (uNight > 0.0) {
    // Light pollution: an orange glow low down, a few times brighter than the zenith.
    sky += uNight * aSunE * (vec3(0.5, 0.4, 0.32) * 6e-8 * exp(-up * 9.0) + vec3(0.03, 0.06, 0.12) * 3e-7);
    vec3 cell = floor(d * 260.0);
    float h = hash13(cell);
    if (h > 0.9965 && d.y > 0.05) {
      vec3 f = fract(d * 260.0) - 0.5 - (vec3(hash13(cell + 1.7), hash13(cell + 5.3), hash13(cell + 9.1)) - 0.5) * 0.6;
      sky += uNight * aSunE * 2e-5 * (h - 0.9965) / 0.0035 * smoothstep(0.12, 0.0, length(f)) * smoothstep(0.05, 0.3, d.y);
    }
  }

  // Cirrus far above, lit like thin ice: bright toward the sun.
  if (uCirrus > 0.0 && d.y > 0.01) {
    vec2 c = d.xz / d.y * 8500.0 + uCirrusOffset;
    float a = texture2D(tCirrus, c / 42000.0).r * uCirrus * smoothstep(0.01, 0.2, d.y);
    float cosS = dot(d, uSunDir);
    vec3 lit = uCloudSun * (0.02 + 0.25 * pow(max(cosS, 0.0), 6.0)) + hemi * 0.9;
    sky = mix(sky, lit, a * (1.0 - uOvercast));
  }

  // The overcast deck: bright grey with soft texture, a little darker toward the horizon.
  if (uOvercast > 0.0) {
    float tex = texture2D(tCirrus, d.xz / max(d.y, 0.04) * 900.0 / 9000.0 + uCirrusOffset / 60000.0).g;
    vec3 deck = uOvercastSky * (0.72 + 0.56 * tex) * (0.82 + 0.3 * smoothstep(0.0, 0.8, up));
    sky = mix(sky, deck, uOvercast * smoothstep(-0.03, 0.02, d.y));
  }

  if (uEnv < 0.5) {
    float cosS = dot(d, uSunDir);
    // The disc, limb darkened, and a soft glare; gone under the overcast.
    float disc = smoothstep(0.99998691, 0.99999124, cosS);
    sky += uSunDisc * disc * (1.0 - uOvercast);
    sky += uSunDisc * 2e-6 * exp(-acos(clamp(cosS, -1.0, 1.0)) * 90.0) * (1.0 - uOvercast);
    if (uCloudsOn > 0.5 && d.y > 0.0) {
      vec4 cl = texture2D(tClouds, gl_FragCoord.xy / uResolution);
      sky = sky * cl.a + cl.rgb;
    }
  } else {
    // For the environment light: the cumulus as a grey veil on the upper sky, the ground below.
    vec3 cloud = hemi * 1.2 + uCloudSun * max(uSunDir.y, 0.0) * 0.1;
    sky = mix(sky, cloud, uCoverage * 0.75 * smoothstep(0.0, 0.25, d.y));
    vec3 ground = texture2D(uSkyStats, vec2(0.875, 0.5)).rgb;
    sky = mix(sky, ground, smoothstep(0.0, -0.06, d.y));
  }
  gl_FragColor = vec4(sky, 1.0);
}`;

const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);

export class Atmosphere {
  readonly sun = new SunLight('#ffffff', 1);
  readonly dome: THREE.Mesh;
  readonly scattering = new Scattering();
  readonly clouds: Clouds;
  light: Light = lightAt(12, 0);
  /** Development: family values forced while tuning (URL ?light.ambient=0.6&light.haze=0.05). */
  lightOverride: Partial<Light> = {};
  elevation = 0;
  azimuth = 0;
  /** Overcast weather, eased toward `overcastTarget`. */
  overcast = 0;
  overcastTarget = 0;
  private domeUniforms: Record<string, THREE.IUniform>;
  private envUniforms: Record<string, THREE.IUniform>;
  private envScene = new THREE.Scene();
  private pmrem: THREE.PMREMGenerator;
  private env?: THREE.WebGLRenderTarget;
  private envKey = [-999, -1, -1, -1];
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private sunAtCamera = new THREE.Color();
  private sunAtClouds = new THREE.Color();
  private shadowsMade = false;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, session: CloudSession = rollSession(), overcast = Math.random() < 0.2) {
    this.renderer = renderer;
    this.scene = scene;
    this.clouds = new Clouds(renderer, session);
    this.overcast = this.overcastTarget = overcast ? 1 : 0;
    const own = {
      tClouds: { value: this.clouds.target.texture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCloudsOn: { value: 1 },
      uCoverage: { value: 0 },
      tCirrus: { value: this.clouds.cirrusTexture },
      uCirrus: { value: session.cirrus },
      uCirrusOffset: { value: this.clouds.cirrusOffset },
      uSunDisc: { value: new THREE.Color() },
      uCloudSun: this.clouds.sunColour,
    };
    this.domeUniforms = { ...U, ...own, uEnv: { value: 0 } };
    this.envUniforms = { ...U, ...own, uEnv: { value: 1 } };
    const material = (uniforms: Record<string, THREE.IUniform>) => new THREE.ShaderMaterial({
      uniforms, vertexShader: DOME_VERT, fragmentShader: DOME_FRAG, side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material(this.domeUniforms));
    this.dome.scale.setScalar(40000);
    this.dome.renderOrder = 1e6;
    this.dome.frustumCulled = false;
    scene.add(this.dome);
    this.envScene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 64, 32), material(this.envUniforms)));
    this.pmrem = new THREE.PMREMGenerator(renderer);

    // Two cascades of 2048 to 2.8 km (about 0.7 m a texel near, 2 m far); hills are shaded by the
    // terrain shadow instead. 4096 cascades cost a millisecond more for little visible gain.
    const s = this.sun.shadow;
    s.mapSize.set(2048, 2048);
    s.camera.near = 1;
    s.camera.far = 2800;
    s.bias = -0.00015;
    s.normalBias = 0.35;
    s.radius = 1.5;
    this.sun.castShadow = true;
    scene.add(this.sun);
  }

  get sunDir(): THREE.Vector3 { return U.uSunDir.value; }

  reseed(session: CloudSession) {
    this.clouds.reseed(session);
    this.domeUniforms.uCirrus.value = session.cirrus;
  }

  setSize(w: number, h: number) {
    this.clouds.setSize(w, h);
    (this.domeUniforms.uResolution.value as THREE.Vector2).set(w, h);
  }

  /** `clock` in hours; `camera` the view; `dt` seconds. */
  update(clock: number, camera: THREE.Camera, dt: number) {
    const { elevation, azimuth } = sunPosition(clock);
    this.elevation = elevation;
    this.azimuth = azimuth;
    const e = THREE.MathUtils.degToRad(elevation), a = THREE.MathUtils.degToRad(azimuth);
    const dir = U.uSunDir.value.set(Math.cos(e) * Math.sin(a), Math.sin(e), -Math.cos(e) * Math.cos(a));

    this.overcast += (this.overcastTarget - this.overcast) * (1 - Math.exp(-dt / 1.2));
    if (Math.abs(this.overcast - this.overcastTarget) < 1e-3) this.overcast = this.overcastTarget;
    const L = (this.light = { ...lightAt(clock, this.overcast), ...this.lightOverride });

    // Atmosphere and haze.
    this.scattering.setAerosol(this.renderer, L.aerosol);
    U.aSkySat.value = L.skySat;
    U.aSkyFlat.value = L.skyFlat;
    U.aSkyHorizon.value = L.skyHorizon;
    U.uHaze.value.set(L.haze / 1000, L.hazeHeight, 17000, smooth(-4, 5, elevation));
    U.uNight.value = L.night;
    // Lights come on from two degrees below the horizon and are all on by six (design.md §8.7).
    U.uCityLights.value = 1 - THREE.MathUtils.smoothstep(elevation, -6, -2);
    U.uOvercast.value = this.overcast;

    // Sunlight at the camera and at the clouds, through the air.
    const camY = camera.position.y;
    const T = this.scattering.sunTransmittance((185 + camY) / 1000, dir, this.sunAtCamera);
    this.sun.color.copy(T);
    this.sun.intensity = SUN_E * L.sun;
    this.sun.position.copy(dir);
    this.sun.updateMatrixWorld();
    // No shadow maps once the sun is down: nothing to shade. But they must exist once, as the
    // materials sample them: a view opened after dark renders them a single time.
    this.renderer.shadowMap.autoUpdate = elevation > -1.5;
    if (!this.shadowsMade) this.renderer.shadowMap.needsUpdate = true;
    this.shadowsMade = true;
    this.scattering.sunIrradiance.value.copy(T).multiplyScalar(SUN_E * L.sun * Math.max(0, dir.y));
    const Tc = this.scattering.sunTransmittance((185 + 2000) / 1000, dir, this.sunAtClouds);
    this.clouds.sunColour.value.copy(Tc).multiplyScalar(SUN_E * L.sun);
    (this.domeUniforms.uSunDisc.value as THREE.Color).copy(T).multiplyScalar(Math.min(30000, SUN_E / 6.8e-5));

    // The overcast deck's brightness follows the sun: roughly a fifth of the clear-day global light.
    const deck = SUN_E * (0.06 * Math.max(0, Math.sin(e)) + 0.004 * smooth(-8, 2, elevation)) * (0.2 + 0.8 * smooth(-4, 8, elevation));
    U.uOvercastSky.value.setRGB(deck * 0.95, deck * 0.97, deck * 1.02);

    this.clouds.update(dt, L.cumulus, this.overcast);
    this.domeUniforms.uCoverage.value = this.clouds.coverage;
    this.domeUniforms.uCloudsOn.value = this.overcast < 0.999 && this.clouds.coverage > 0 ? 1 : 0;

    this.scattering.update(this.renderer, camY);
    this.scene.environmentIntensity = L.ambient;
    this.dome.position.copy(camera.position);
  }

  /** Re-renders the environment light when the sky has changed enough to notice. */
  updateEnvironment() {
    const key = [this.elevation, this.clouds.coverage, this.overcast, this.light.aerosol];
    const moved = Math.abs(key[0] - this.envKey[0]) > 0.4 || Math.abs(key[1] - this.envKey[1]) > 0.03 ||
      Math.abs(key[2] - this.envKey[2]) > 0.05 || Math.abs(key[3] - this.envKey[3]) > 0.1;
    if (!moved && this.env) return;
    this.envKey = key;
    const next = this.pmrem.fromScene(this.envScene, 0, 1, 1000);
    this.env?.dispose();
    this.env = next;
    this.scene.environment = next.texture;
  }

  /** Renders the cumulus for this frame's camera, before the scene. */
  renderClouds(camera: THREE.Camera) {
    if (this.domeUniforms.uCloudsOn.value) this.clouds.render(this.renderer, camera);
  }
}
