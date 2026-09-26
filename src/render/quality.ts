// Quality presets (design.md §11): full, for 60 fps on an M1 Pro or better, and lite, for a 30 fps
// floor on integrated graphics: no ambient occlusion, a mirror at half the resolution, the cumulus
// at a third of the resolution and fewer of them, fewer pixels, and less geometry, which is most of
// the frame: smaller shadow maps reaching half as far, no shadows from the far trees, the roofs'
// and landmarks' detail drawn only near. On top of either, a governor lowers the render scale while
// frames come too slowly, and hands a full session that is still too slow at its lowest scale over
// to lite.

export type Preset = 'full' | 'lite';

export interface Quality {
  preset: Preset;
  /** Most pixels in the drawing buffer, before the governor's scale. */
  pixels: number;
  ao: boolean;
  /** The river's mirror, as a fraction of the drawing buffer's size, and how far it draws, metres. */
  mirror: number;
  mirrorRange: number;
  /** The cumulus are raymarched at 1 / this of the drawing buffer's size. */
  clouds: number;
  /** Most of the session's peak coverage that is drawn. */
  coverage: number;
  /** The sun's shadow cascades, texels a side, and how far they reach, metres. */
  shadow: number;
  shadowFar: number;
  /** Whether the far trees (sprites beyond the near set) cast shadows. */
  spriteShadows: boolean;
  /** How far the buildings' detail (chimneys, dormers) and the landmarks' (statues, finials) are drawn. */
  detail: number;
  /** How far the landmarks' fine tier (mouldings, tracery, balusters, crockets; M12) is drawn; 0 leaves it out. */
  fine: number;
  /** The frame interval the governor holds, seconds, and its lowest scale (of each side). */
  target: number;
  minScale: number;
}

export const PRESETS: Record<Preset, Quality> = {
  full: { preset: 'full', pixels: 4.2e6, ao: true, mirror: 0.5, mirrorRange: 2200, clouds: 2, coverage: 0.65, shadow: 2048, shadowFar: 2800, spriteShadows: true, detail: 1600, fine: 300, target: 1 / 60, minScale: 0.72 },
  lite: { preset: 'lite', pixels: 1.7e6, ao: false, mirror: 0.2, mirrorRange: 1300, clouds: 3, coverage: 0.4, shadow: 1024, shadowFar: 1400, spriteShadows: false, detail: 900, fine: 0, target: 1 / 30, minScale: 0.6 },
};

/** `?quality=lite` or `full` forces a preset; otherwise integrated and software GPUs start on lite. */
export function choosePreset(params: URLSearchParams, gl: WebGLRenderingContext | WebGL2RenderingContext): Preset {
  const q = params.get('quality');
  if (q === 'lite' || q === 'full') return q;
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  return /Intel|Iris|UHD Graphics|HD Graphics|SwiftShader|llvmpipe|Software/i.test(name) ? 'lite' : 'full';
}

/**
 * Watches the frame interval and sets the render scale. Down quickly when frames are slow for a
 * second or so; back up only by probing, one step after a long quiet spell, since at the display's
 * refresh rate a fast frame and a frame with room to spare look the same. A probe that slows the
 * frames again is undone, and the next probe waits twice as long.
 */
export class Governor {
  scale = 1;
  private avg = 0;
  private quiet = 0;
  private settle = 3;
  private probeWait = 20;
  private probing = false;
  /** Seconds full has been too slow at its lowest scale. */
  private beaten = 0;
  private q: Quality;

  constructor(q: Quality) {
    this.q = q;
  }

  /** Switches the preset the governor works for (full to lite), starting again at full scale. */
  set quality(q: Quality) {
    this.q = q;
    this.scale = 1;
    this.avg = 0;
    this.settle = 3;
    this.probing = false;
    this.beaten = 0;
  }

  /** Feeds one frame's interval; returns 'scale' when the scale changed, 'lite' when full cannot keep up at its lowest. */
  sample(dt: number): 'scale' | 'lite' | undefined {
    // Hitches (a tab switch, a compile) are not the frame rate.
    if (dt <= 0 || dt > 0.25) return;
    this.avg = this.avg ? this.avg + (dt - this.avg) * Math.min(1, dt / 0.8) : dt;
    if ((this.settle -= dt) > 0) return;
    const { target, minScale } = this.q;
    if (this.avg > target * 1.2) {
      if (this.probing) {
        // The last step up was too much: back down, and wait longer before the next.
        this.probing = false;
        this.probeWait = Math.min(160, this.probeWait * 2);
      }
      if (this.scale <= minScale + 1e-3) {
        // Full gives way to lite only after six seconds under 40 fps at its lowest scale.
        this.beaten = this.avg > target * 1.5 ? this.beaten + dt : 0;
        return this.q.preset === 'full' && this.beaten > 6 ? 'lite' : undefined;
      }
      this.scale = Math.max(minScale, this.scale * Math.max(0.82, Math.sqrt(target / this.avg)));
      this.settle = 2.5;
      this.quiet = 0;
      return 'scale';
    }
    this.probing = false;
    this.beaten = 0;
    if (this.scale < 1 && (this.quiet += dt) > this.probeWait) {
      this.scale = Math.min(1, this.scale * 1.08);
      this.probing = true;
      this.settle = 2.5;
      this.quiet = 0;
      return 'scale';
    }
  }
}
