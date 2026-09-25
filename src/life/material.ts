// The material of the city's moving things: three's standard material with the sky patch
// (src/sky/lit.ts), vertex colours from src/life/shapes.ts, the instance's colour where a vertex's
// tint says so (a tram's livery stays, a car's paint changes), windows that glow once the city's
// lights are on, the street lamps' pools, and for birds, wings that fold and beat.

import * as THREE from 'three';
import { patchLit } from '../sky/lit.ts';

const VERT_PARS = /* glsl */ `
attribute float aGlow;
attribute float aTint;
varying float vGlow;
#ifdef PRA_WINGS
attribute float aWing;
// Per bird: how far the wings are open, the beat's amplitude (radians), its phase, its rate (radians a second).
attribute vec4 aFlap;
uniform float uTime;
#endif
`;

const WINGS = /* glsl */ `
#ifdef PRA_WINGS
if (aWing > 0.5) {
  float span = abs(transformed.z) * aFlap.x;
  float a = aFlap.y * sin(uTime * aFlap.w + aFlap.z) + 0.2 * aFlap.x;
  transformed.z = sign(transformed.z) * span * cos(a);
  transformed.y += span * sin(a);
}
#endif
`;

// three's color_vertex, with the instance's colour applied by the vertex's tint.
const COLOR = /* glsl */ `
#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR )
  vColor = vec4(1.0);
#endif
#ifdef USE_COLOR_ALPHA
  vColor *= color;
#elif defined( USE_COLOR )
  vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
  vColor.rgb *= mix(vec3(1.0), instanceColor.rgb, aTint);
#endif
`;

export interface LifeMaterialOptions {
  roughness?: number;
  metalness?: number;
  wings?: boolean;
  /** How bright the lit windows are at night. */
  glow?: number;
  transparent?: boolean;
}

export function lifeMaterial(o: LifeMaterialOptions = {}): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: o.roughness ?? 0.6, metalness: o.metalness ?? 0 });
  if (o.transparent) { m.transparent = true; m.depthWrite = false; }
  if (o.wings) m.defines = { PRA_WINGS: '' };
  const glow = (o.glow ?? 0.09).toFixed(3);
  return patchLit(m, (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERT_PARS}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvGlow = aGlow;\n${WINGS}`)
      .replace('#include <color_vertex>', COLOR);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vGlow;')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
totalEmissiveRadiance += vGlow * uCityLights * vec3(1.0, 0.8, 0.56) * ${glow} + diffuseColor.rgb * praLampPool(vPraWorld, 1.5) * 0.14;`);
  }, `-life${o.wings ? '-wings' : ''}${o.transparent ? '-t' : ''}-${glow}`);
}
