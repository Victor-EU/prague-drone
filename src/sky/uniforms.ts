// Uniforms shared by every shader that needs the sky: the lit materials (haze, cloud and terrain
// shadows), the sky dome, the clouds and the post passes. One object, referenced, never copied,
// so an update reaches every material at once.

import * as THREE from 'three';

/** Solar illuminance in scene units. The scattering tables are per unit illuminance. */
export const SUN_E = 100;

const tex = () => ({ value: null as THREE.Texture | null });

export const U = {
  // Atmosphere (km units inside the scattering code)
  aTransLut: tex(),
  aMsLut: tex(),
  aSkyLut: tex(),
  aRayleigh: { value: new THREE.Vector3(5.802e-3, 13.558e-3, 33.1e-3) },
  aMieScat: { value: 3.996e-3 },
  aMieExt: { value: 4.4e-3 },
  aOzone: { value: new THREE.Vector3(0.65e-3, 1.881e-3, 0.085e-3) },
  aMieG: { value: 0.8 },
  aCamR: { value: 6360.2 },
  aSunE: { value: SUN_E },
  aSkySat: { value: 1 },
  aSkyFlat: { value: 0 },
  aSkyHorizon: { value: 0 },
  // Sky summary, 4 × 1: zenith, upper hemisphere mean, horizon mean, ground bounce (radiance)
  uSkyStats: tex(),
  uSunDir: { value: new THREE.Vector3(0, 1, 0) },
  // Haze: density per metre at the river, scale height (m), distance of full fog (m), sun up (0 to 1)
  uHaze: { value: new THREE.Vector4(1.5e-4, 900, 17000, 0) },
  uHazeTint: { value: new THREE.Color(1, 1, 1) },
  // Terrain shadow: texture of (shadow height, occluder distance) and its rectangle (x0, z0, 1/w, 1/d)
  uTerrainShadow: tex(),
  uTerrainShadowRect: { value: new THREE.Vector4(0, 0, 0, 0) },
  // Clouds: coverage map (24 km), (coverage threshold, shadow strength, layer middle, soft width), wind offset
  uWeather: tex(),
  uCloud: { value: new THREE.Vector4(1, 0, 1600, 0.1) },
  uWind: { value: new THREE.Vector2() },
  uOvercast: { value: 0 },
  uOvercastSky: { value: new THREE.Color() },
  uNight: { value: 0 },
  // Ambient occlusion of the sky light (src/render/pipeline.ts): last frame's, with the matrix it
  // was rendered with, so each material finds its own pixel in it; off after a camera jump.
  tAO: tex(),
  uAOViewProj: { value: new THREE.Matrix4() },
  uAOOn: { value: 0 },
  // Seconds since the app started, for what moves on its own: water, foam.
  uTime: { value: 0 },
  // The city's lights (design.md §8.7): 0 by day, 1 from sun elevation -6°; the lamp pools and their rectangle.
  uCityLights: { value: 0 },
  tLampMap: tex(),
  uLampRect: { value: new THREE.Vector4(0, 0, 0, 0) },
};
