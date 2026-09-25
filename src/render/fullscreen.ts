// A full-screen triangle for the passes that render a shader into a target.

import * as THREE from 'three';

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));

export const FULLSCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

export class FullScreen {
  readonly mesh: THREE.Mesh;
  readonly material: THREE.ShaderMaterial;

  constructor(fragmentShader: string, uniforms: Record<string, THREE.IUniform>, defines: Record<string, string | number> = {}) {
    this.material = new THREE.ShaderMaterial({
      vertexShader: FULLSCREEN_VERT, fragmentShader, uniforms, defines,
      depthTest: false, depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.frustumCulled = false;
  }

  get uniforms() { return this.material.uniforms; }

  render(renderer: THREE.WebGLRenderer, target: THREE.WebGLRenderTarget | null, layer = 0) {
    renderer.setRenderTarget(target, layer);
    renderer.render(this.mesh, camera);
  }
}
