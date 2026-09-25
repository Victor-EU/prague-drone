// Patches three.js's standard material with the sky: haze in place of three's fog, and the sun
// dimmed by the terrain shadow and the cloud shadows on top of the shadow cascades.

import * as THREE from 'three';
import { ATMOSPHERE, SKY_LOOKUP, LIT } from './glsl.ts';
import { U } from './uniforms.ts';

const SUN_LINE = 'getSunLightInfo( sunLight, directLight );';

if (!THREE.ShaderChunk.lights_fragment_begin.includes(SUN_LINE)) throw new Error('lit.ts: three.js sun light chunk changed');

const LIGHTS = THREE.ShaderChunk.lights_fragment_begin.replace(
  SUN_LINE,
  `${SUN_LINE}\n\t\tdirectLight.color *= praSunVisibility( vPraWorld );`,
);

export function patchLit<T extends THREE.Material>(material: T): T {
  material.onBeforeCompile = (shader) => {
    for (const [k, v] of Object.entries(U)) shader.uniforms[k] = v;
    shader.vertexShader = shader.vertexShader
      .replace('#include <fog_pars_vertex>', 'varying vec3 vPraWorld;')
      .replace('#include <fog_vertex>', 'vPraWorld = (mvPosition.xyz - viewMatrix[3].xyz) * mat3(viewMatrix);');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <fog_pars_fragment>', `varying vec3 vPraWorld;\n${ATMOSPHERE}\n${SKY_LOOKUP}\n${LIT}`)
      .replace('#include <lights_fragment_begin>', LIGHTS)
      .replace('#include <fog_fragment>', 'gl_FragColor.rgb = praAerial(gl_FragColor.rgb, vPraWorld);');
  };
  material.customProgramCacheKey = () => 'praha-lit-1';
  return material;
}
