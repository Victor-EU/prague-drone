// The river's mirror (design.md §8.5): the city rendered once more, at half resolution, from the
// camera mirrored in the water's plane, into a texture the water samples through its ripples. Only
// what is on the REFLECT layer is drawn (terrain, buildings, landmarks, lights); the sky is not,
// because the water shader computes the sky and its clouds for the reflected ray itself and puts
// the city (alpha 1) over it. Everything below the plane is clipped by a world clipping plane
// (three's oblique projection trick assumes an ordinary depth range, and this renderer's is reversed).

import * as THREE from 'three';
import { U } from '../sky/uniforms.ts';

/** Objects that appear in the water enable this layer as well as layer 0. */
export const REFLECT = 1;

export class PlanarReflection {
  readonly target: THREE.WebGLRenderTarget;
  /** World position to texture coordinates (with the perspective divide). */
  readonly matrix = new THREE.Matrix4();
  readonly camera = new THREE.PerspectiveCamera();
  /** The plane's height this frame; NaN when the mirror was not rendered. */
  planeY = NaN;
  private clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  /** How far the mirror draws. */
  range = 2200;
  private scale: number;

  constructor(scale = 0.4) {
    this.scale = scale;
    this.target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: true });
    this.target.texture.minFilter = this.target.texture.magFilter = THREE.LinearFilter;
    this.target.texture.generateMipmaps = false;
    this.camera.layers.set(REFLECT);
  }

  setSize(w: number, h: number) {
    this.target.setSize(Math.max(1, Math.round(w * this.scale)), Math.max(1, Math.round(h * this.scale)));
  }

  /** Renders the mirror of `camera` in the plane y = planeY. */
  render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, planeY: number) {
    const eye = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
    if (eye.y <= planeY + 0.05) { this.planeY = NaN; return; }
    this.planeY = planeY;
    // Mirror the eye, the point it looks at and its up vector in the plane.
    const mirror = (v: THREE.Vector3) => v.set(v.x, 2 * planeY - v.y, v.z);
    const rot = new THREE.Matrix4().extractRotation(camera.matrixWorld);
    const look = new THREE.Vector3(0, 0, -1).applyMatrix4(rot).add(eye);
    const up = new THREE.Vector3(0, 1, 0).applyMatrix4(rot);
    const cam = this.camera;
    cam.position.copy(mirror(eye.clone()));
    cam.up.set(up.x, -up.y, up.z);
    cam.lookAt(mirror(look));
    cam.updateMatrixWorld();
    // The main camera's projection; only the nearer few kilometres are drawn (below): beyond them
    // the reflection is a sliver at the far bank, and the water shader's sky stands in.
    cam.projectionMatrix.copy(camera.projectionMatrix);
    cam.projectionMatrixInverse.copy(camera.projectionMatrixInverse);
    this.matrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1).multiply(cam.projectionMatrix).multiply(cam.matrixWorldInverse);

    // Clip what lies under the water (a little below the plane, so walls meet it).
    this.clip.constant = -(planeY - 0.3);
    const saved = { clip: renderer.clippingPlanes, shadows: renderer.shadowMap.autoUpdate, ao: U.uAOOn.value, target: renderer.getRenderTarget(), alpha: renderer.getClearAlpha() };
    const colour = renderer.getClearColor(new THREE.Color());
    renderer.clippingPlanes = [this.clip];
    // Shadow maps and the occlusion belong to the main view: keep the ones it made. (Switching
    // shadows off for the mirror would make three choose every program again, twice a frame.)
    renderer.shadowMap.autoUpdate = false;
    U.uAOOn.value = 0;
    // Hide what lies beyond the mirror's range.
    const hidden: THREE.Object3D[] = [];
    const eyeM = cam.position;
    scene.traverseVisible((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !m.layers.isEnabled(REFLECT) || !m.geometry.boundingSphere) return;
      const sph = m.geometry.boundingSphere, c = new THREE.Vector3().copy(sph.center).applyMatrix4(m.matrixWorld);
      if (Math.hypot(c.x - eyeM.x, c.z - eyeM.z) - sph.radius > this.range) { m.visible = false; hidden.push(m); }
    });
    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, false);
    renderer.render(scene, cam);
    renderer.setClearColor(colour, saved.alpha);
    renderer.setRenderTarget(saved.target);
    for (const m of hidden) m.visible = true;
    renderer.clippingPlanes = saved.clip;
    renderer.shadowMap.autoUpdate = saved.shadows;
    U.uAOOn.value = saved.ao;
  }
}
