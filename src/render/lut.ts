// Reads a .cube 3D LUT (assets/lut/classic-neg.cube) into a texture for the grade pass.

import * as THREE from 'three';

export async function loadCube(url: string): Promise<THREE.Data3DTexture> {
  const text = await (await fetch(url)).text();
  let size = 0;
  const values: number[] = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('TITLE') || t.startsWith('DOMAIN')) continue;
    if (t.startsWith('LUT_3D_SIZE')) { size = Number(t.split(/\s+/)[1]); continue; }
    const [r, g, b] = t.split(/\s+/).map(Number);
    values.push(r, g, b);
  }
  if (!size || values.length !== size ** 3 * 3) throw new Error(`bad LUT ${url}`);
  // Red varies fastest, then green, then blue: the texture's x, y, z.
  const data = new Uint8Array(size ** 3 * 4);
  for (let k = 0; k < size ** 3; k++) {
    data[k * 4] = Math.round(values[k * 3] * 255);
    data[k * 4 + 1] = Math.round(values[k * 3 + 1] * 255);
    data[k * 4 + 2] = Math.round(values[k * 3 + 2] * 255);
    data[k * 4 + 3] = 255;
  }
  const tex = new THREE.Data3DTexture(data, size, size, size);
  tex.format = THREE.RGBAFormat;
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.ClampToEdgeWrapping;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  return tex;
}
