// The city's lamps at night (design.md §8.7): every street lamp of the OSM register and every lamp
// the landmark models carry (the bridges' lanterns and candelabra) as a glowing point, drawn into
// the scene and into the river's mirror, where the ripples draw them out into broken streaks. Their
// light on the ground and the lowest storeys comes from pools baked once into a texture over the
// photographed city (the lit materials read it through praLampPool, src/sky/glsl.ts). All of it
// scaled by uCityLights, which the sun's elevation sets.

import * as THREE from 'three';
import { U } from '../sky/uniforms.ts';
import { REFLECT } from '../render/reflection.ts';

/** The pools' square: 4096 m at 2 m a texel, over Vyšehrad to Letná, Strahov to the Powder Tower. */
const POOL = { x0: -2150, z0: -1350, size: 4096, res: 2048, radius: 18 };

const SPRITE_VERT = /* glsl */ `
attribute float aKind;
uniform float uCity;
uniform float uPx;
uniform float uMirrorPass;
varying float vI;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 1.0);
  // A lantern's glow about 2.4 m across, never less than four pixels; fading with distance once it
  // is that small, as a farther lamp gives less light to a pixel.
  float px = uPx * 2.4 / d;
  // In the river's mirror the point is drawn out into a streak many times its size by eight
  // jittered taps (src/world/water.ts): drawn four times as wide there, so the taps find a smooth
  // disc rather than a dot (which sparkled), with nine times the light in all, since a lamp is a
  // hundred times brighter than the exposure's white and the photographs' streaks are bright (9542,
  // M17). A far lamp, at the four-pixel floor in both, gets no more light in the mirror than in the
  // view: thousands of them seen from above had washed the river pale.
  float pm = px * mix(1.0, 4.0, uMirrorPass);
  gl_PointSize = clamp(pm, 4.0, 110.0);
  vI = uCity * min(1.0, pow(px / 4.0, 1.2) + 0.1) * exp(-d / 9000.0) * mix(1.0, 0.55, uMirrorPass * smoothstep(4.0, 8.0, pm));
}`;

const SPRITE_FRAG = /* glsl */ `
varying float vI;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(c, c);
  if (r2 > 1.0 || vI <= 0.0) discard;
  float core = exp(-r2 * 28.0), halo = exp(-r2 * 5.0);
  // Sodium: a deep orange halo round a warm core, through the blue hour's daylight balance (9547).
  vec3 col = mix(vec3(1.0, 0.42, 0.1), vec3(1.0, 0.74, 0.4), core);
  gl_FragColor = vec4(col * vI * (core * 20.0 + halo * 0.45), 1.0);
}`;

/**
 * Light added to the frame without touching its alpha (three's additive blend scales the source by
 * its alpha and adds the alpha too): over the mirror's sky, which has none, a lamp's streak then adds
 * to the sky, and over the city it is not halved by the alpha the city wrote (src/world/water.ts, M17).
 */
export const ADD_LIGHT = {
  blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
} as const;

const POOL_VERT = /* glsl */ `
uniform float uSize;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize;
}`;
const POOL_FRAG = /* glsl */ `
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(c, c);
  if (r2 > 1.0) discard;
  float f = (1.0 - r2) * (1.0 - r2);
  gl_FragColor = vec4(f, f, f, 1.0);
}`;

export class CityLights {
  readonly points: THREE.Points;
  readonly pool: THREE.WebGLRenderTarget;
  private material: THREE.ShaderMaterial;

  /** `lamps`: x, y (ground), z per street lamp; `extra`: x, y (lantern), z, kind per landmark lamp. */
  constructor(renderer: THREE.WebGLRenderer, lamps: Float32Array, extra: number[]) {
    const pos: number[] = [], kind: number[] = [];
    for (let i = 0; i < lamps.length; i += 3) { pos.push(lamps[i], lamps[i + 1] + 4.5, lamps[i + 2]); kind.push(0); }
    for (let i = 0; i < extra.length; i += 4) { pos.push(extra[i], extra[i + 1], extra[i + 2]); kind.push(extra[i + 3]); }
    // Sprites for the lanterns only; a landmark's floodlight shows on its walls instead.
    const sp: number[] = [];
    for (let i = 0; i < kind.length; i++) if (kind[i] === 0) sp.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    g.setAttribute('aKind', new THREE.Float32BufferAttribute(new Float32Array(sp.length / 3), 1));
    g.computeBoundingSphere();
    this.material = new THREE.ShaderMaterial({
      uniforms: { uCity: U.uCityLights, uPx: { value: 1000 }, uMirrorPass: U.uMirrorPass },
      vertexShader: SPRITE_VERT, fragmentShader: SPRITE_FRAG,
      transparent: true, depthWrite: false, ...ADD_LIGHT, fog: false,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 10;
    this.points.layers.enable(REFLECT);
    // Pixels per metre at one metre: the projection's scale times half the target's height, per pass
    // (the mirror renders at half size).
    this.points.onBeforeRender = (r, _s, cam) => {
      const t = r.getRenderTarget();
      const h = t ? t.height : r.getDrawingBufferSize(new THREE.Vector2()).y;
      this.material.uniforms.uPx.value = (cam as THREE.PerspectiveCamera).projectionMatrix.elements[5] * h * 0.5;
    };

    // Bake the pools: one soft disc per lamp, added up, seen from straight above.
    this.pool = new THREE.WebGLRenderTarget(POOL.res, POOL.res, { type: THREE.HalfFloatType, depthBuffer: false });
    this.pool.texture.minFilter = this.pool.texture.magFilter = THREE.LinearFilter;
    this.pool.texture.generateMipmaps = false;
    const scene = new THREE.Scene();
    const pg = new THREE.BufferGeometry();
    const pp: number[] = [];
    for (let i = 0; i < kind.length; i++) pp.push(pos[i * 3], 0, pos[i * 3 + 2]);
    pg.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
    const pm = new THREE.ShaderMaterial({
      uniforms: { uSize: { value: (2 * POOL.radius * POOL.res) / POOL.size } },
      vertexShader: POOL_VERT, fragmentShader: POOL_FRAG,
      transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(pg, pm);
    pts.frustumCulled = false;
    scene.add(pts);
    // Camera x is world x, camera y is world -z: the texture's first row at z0, as the shader reads it.
    const cam = new THREE.OrthographicCamera(POOL.x0, POOL.x0 + POOL.size, -(POOL.z0 + POOL.size), -POOL.z0, -100, 100);
    cam.position.set(0, 10, 0);
    cam.up.set(0, 0, -1);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld();
    const saved = renderer.getRenderTarget();
    renderer.setRenderTarget(this.pool);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, false, false);
    renderer.render(scene, cam);
    renderer.setRenderTarget(saved);
    pg.dispose(); pm.dispose();
    U.tLampMap.value = this.pool.texture;
    U.uLampRect.value.set(POOL.x0, POOL.z0, 1 / POOL.size, 1 / POOL.size);
  }

  /** The points are drawn only when the city is lit. */
  update() {
    this.points.visible = U.uCityLights.value > 0.001;
  }
}
