// The material of every building: three's standard material with the sky patch (src/sky/lit.ts),
// plus the surfaces of design.md §8.1 and §8.2 drawn in the shader: window grids by facade style,
// cornices and ground floors on walls; tile courses, weathering and north-slope lichen on roofs;
// dark tops on chimneys, a window in each dormer; and for the landmarks (tools/landmarks/) stone
// courses blackened in patches, slate, copper and gold, traceried windows and dark openings. Every
// pattern is box-filtered by its own screen footprint, so at a distance it fades to its average
// instead of shimmering.

import * as THREE from 'three';
import { patchLit } from '../sky/lit.ts';
import { STYLES, Surface, Stone, Metal, Glass } from '../core/buildings.ts';

const GLSL_PARS = /* glsl */ `
varying vec4 vFacade;
flat varying vec4 vInfo;
varying vec3 vPraN;
uniform vec4 uStyleA[${STYLES.length}];
uniform vec4 uStyleB[${STYLES.length}];
float praHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float praNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(praHash(i), praHash(i + vec2(1.0, 0.0)), f.x), mix(praHash(i + vec2(0.0, 1.0)), praHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
// The share of [x - w/2, x + w/2] that falls inside [a, b] of each unit period: a box-filtered pulse train.
float praPulse(float x, float a, float b, float w) {
  w = max(w, 1e-4);
  float x0 = x - 0.5 * w, x1 = x + 0.5 * w;
  float F1 = floor(x1) * (b - a) + clamp(fract(x1), a, b);
  float F0 = floor(x0) * (b - a) + clamp(fract(x0), a, b);
  return (F1 - F0) / w;
}
float praStep(float e, float x, float w) { return clamp((x - e) / max(w, 1e-4) + 0.5, 0.0, 1.0); }
`;

const GLSL_MAIN = /* glsl */ `
float praGlass = 0.0, praMetal = 0.0, praRough = -1.0;
// Night (design.md §8.7): light of its own (scaled by uCityLights), and the height above the ground
// the street lamps' pools are judged at (negative: not lit by them).
vec3 praEmit = vec3(0.0);
float praAbove = -1.0;
{
  int kind = int(vInfo.x + 0.5);
  int style = int(vInfo.y + 0.5);
  float party = mod(vInfo.z, 2.0);
  float seed = vInfo.w;
  vec3 wp = vPraWorld;
  if (kind == ${Surface.Wall}) {
    vec4 A = uStyleA[style], B = uStyleB[style];
    float u = vFacade.x, L = vFacade.y, v = vFacade.z, top = vFacade.w;
    float wv = max(fwidth(v), 1e-4);
    vec3 c = diffuseColor.rgb;
    if (party > 0.5) {
      // A firewall: bare, a little grey.
      c = mix(c, vec3(dot(c, vec3(0.3333))), 0.35) * 0.86;
    } else if (top > 3.0) {
      // Cornice under the eave: a lit moulding over a line of shadow.
      float inC = praStep(top - 0.5, v, wv);
      float line = praStep(top - 0.78, v, wv) * (1.0 - inC);
      c *= (1.0 + 0.12 * inC) * (1.0 - 0.38 * line);
      // Plinth.
      c *= mix(0.8, 1.0, praStep(0.9, v, wv));
    }
    float win = 0.0;
    float n = A.x > 0.0 ? floor((L - 0.8) / A.x) : 0.0;
    if (n >= 1.0 && top > 2.5) {
      float span = (L - 0.8) / n;
      float cc = (u - 0.4) / span;
      float wc = max(fwidth(cc), 1e-4);
      float inside = praStep(0.0, cc, wc) * (1.0 - praStep(n, cc, wc));
      float hw = 0.5 * A.y / span;
      float cols = praPulse(cc, 0.5 - hw, 0.5 + hw, wc) * inside;
      float usable = max(top - 0.9, 2.5);
      float nS = max(1.0, floor(usable / B.x + 0.35));
      float sh = usable / nS;
      float r = v / sh;
      float wr = max(fwidth(r), 1e-4);
      float upper = praStep(1.0, r, wr) * (1.0 - praStep(nS, r, wr));
      float a = A.w / sh, b = min(0.9, (A.w + A.z) / sh);
      win = cols * praPulse(r, a, b, wr) * upper;
      float ground = praStep(0.0, r, wr) * (1.0 - praStep(1.0, r, wr));
      if (B.y > 0.5) {
        float sw = min(0.42, hw * 1.7);
        win += ground * praPulse(cc, 0.5 - sw, 0.5 + sw, wc) * inside * praPulse(r, 0.1, 0.78, wr);
      } else {
        win += ground * cols * praPulse(r, 0.3, min(0.88, 0.3 + A.z / sh), wr);
      }
      // String course between the ground floor and the first.
      c *= 1.0 - 0.18 * praPulse(r, 0.96, 1.0, wr) * step(0.5, r) * step(r, 1.5);
      win = clamp(win, 0.0, 1.0);
      float h = praHash(vec2(floor(cc) + seed * 3.7, floor(r) + seed * 1.3));
      vec3 glass = mix(vec3(0.03, 0.038, 0.046), vec3(0.12, 0.11, 0.1), h * h);
      c = mix(c, glass, win);
      // At night a quarter of the windows are lit, and half the shopfronts: warm, some whiter.
      float hl = praHash(vec2(floor(cc) * 1.7 + seed * 5.3, floor(r) * 2.3 + seed));
      float lit = step(hl, r < 1.0 ? 0.4 : 0.18);
      vec3 warm = mix(vec3(1.0, 0.46, 0.17), vec3(1.0, 0.7, 0.42), praHash(vec2(hl * 7.0, seed)));
      praEmit += warm * win * lit * 0.07;
    }
    diffuseColor.rgb = c;
    praGlass = win;
    praAbove = v;
  } else if (kind == ${Surface.Roof} || kind == ${Surface.DormerRoof}) {
    float u = vFacade.x, s = vFacade.y, smax = vFacade.z;
    float course = s / 0.34;
    float cw = max(fwidth(course), 1e-4);
    float line = praPulse(course, 0.0, 0.18, cw);
    float colc = u / 0.24 + 0.5 * floor(course);
    float groove = praPulse(colc, 0.0, 0.14, max(fwidth(colc), 1e-4));
    float colTone = 0.94 + 0.12 * praHash(vec2(floor(colc), floor(course)));
    float fadeCols = 1.0 - smoothstep(0.3, 0.7, fwidth(colc));
    float tile = (1.0 - 0.32 * line - 0.07 * groove) * mix(1.0, colTone, fadeCols);
    float n1 = praNoise(wp.xz * 0.22 + seed), n2 = praNoise(wp.xz * 1.1 + seed * 0.37);
    float weather = 0.84 + 0.26 * n1 + 0.12 * (n2 - 0.5);
    float ridge = smoothstep(smax - 0.6, smax - 0.25, s) * step(0.8, smax);
    float north = clamp(-normalize(vPraN).z, 0.0, 1.0);
    vec3 c = diffuseColor.rgb * tile * weather * (1.0 + 0.16 * ridge);
    // Lichen and grime on north slopes, patchy.
    c = mix(c, c * vec3(0.7, 0.76, 0.64), north * (0.25 + 0.5 * n2) * 0.7);
    diffuseColor.rgb = c;
  } else if (kind == ${Surface.FlatRoof}) {
    diffuseColor.rgb *= 0.86 + 0.22 * praNoise(wp.xz * 0.4 + seed) + 0.08 * (praNoise(wp.xz * 2.7) - 0.5);
  } else if (kind == ${Surface.Gable}) {
    if (party > 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(dot(diffuseColor.rgb, vec3(0.3333))), 0.35) * 0.86;
  } else if (kind == ${Surface.Chimney}) {
    float v = vFacade.z, H = vFacade.w;
    diffuseColor.rgb *= mix(1.0, 0.42, praStep(H - 0.28, v, max(fwidth(v), 1e-4)));
  } else if (kind == ${Surface.DormerFront}) {
    float x = vFacade.x / max(vFacade.y, 0.1), y = vFacade.z / max(vFacade.w, 0.1);
    float wx = fwidth(x), wy = fwidth(y);
    float win = (praStep(0.2, x, wx) - praStep(0.8, x, wx)) * (praStep(0.18, y, wy) - praStep(0.86, y, wy));
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.04, 0.045, 0.05), win);
    praGlass = win;
  } else if (kind == ${Surface.Stone}) {
    // Courses of blocks (ashlar, brick, rubble) or setts, each block its own tone, the joints
    // darker; then the blackening Prague sandstone takes on in patches and streaks, and grime at
    // the foot. Every pattern fades to its average below a pixel.
    float u = vFacade.x, v = vFacade.y, wea = vFacade.z;
    vec3 c = diffuseColor.rgb;
    if (style != ${Stone.Render}) {
      vec2 cell = style == ${Stone.Brick} ? vec2(0.29, 0.085) : style == ${Stone.Rubble} ? vec2(0.62, 0.34) : style == ${Stone.Setts} ? vec2(0.16, 0.16) : vec2(0.95, 0.47);
      float row = v / cell.y;
      float rw = max(fwidth(row), 1e-4);
      float col = u / cell.x + (style == ${Stone.Setts} ? 0.37 * floor(row) : 0.5 * floor(row));
      if (style == ${Stone.Rubble}) col += 0.4 * praHash(vec2(floor(row), seed));
      float cw = max(fwidth(col), 1e-4);
      float jr = style == ${Stone.Brick} ? 0.16 : style == ${Stone.Setts} ? 0.14 : 0.06;
      float jc = style == ${Stone.Brick} ? 0.05 : style == ${Stone.Setts} ? 0.14 : 0.035;
      float joint = max(praPulse(row, 0.0, jr, rw), praPulse(col, 0.0, jc, cw));
      float fade = 1.0 - smoothstep(0.25, 0.6, max(rw, cw));
      float tone = 0.88 + 0.24 * praHash(vec2(floor(col) + seed * 1.7, floor(row)));
      c *= mix(1.0, tone, fade);
      c *= 1.0 - (style == ${Stone.Brick} ? 0.1 : 0.3) * joint;
    }
    float n1 = praNoise(vec2(u * 0.3, v * 0.07) + seed * 0.13), n2 = praNoise(vec2(u, v) * 0.9 + seed);
    float black = wea * smoothstep(0.3, 0.8, 0.65 * n1 + 0.45 * n2);
    c = mix(c, c * vec3(0.4, 0.39, 0.38), black);
    c *= mix(0.82, 1.0, smoothstep(0.0, 2.5, v));
    diffuseColor.rgb = c;
    praAbove = v;
  } else if (kind == ${Surface.Metal}) {
    float u = vFacade.x, s = vFacade.y, smax = vFacade.z;
    vec3 c = diffuseColor.rgb;
    if (style == ${Metal.Gold}) {
      c = vec3(0.78, 0.52, 0.2);
      praMetal = 1.0; praRough = 0.32;
    } else if (style == ${Metal.Copper}) {
      // Standing seams down the slope, patina in streaks, darker where the run-off gathers.
      float k = u / 0.55;
      float seam = praPulse(k, 0.0, 0.1, max(fwidth(k), 1e-4));
      float n = praNoise(vec2(u * 0.7, s * 0.12) + seed), n3 = praNoise(wp.xz * 0.4 + wp.y * 0.3);
      c *= (1.0 - 0.16 * seam) * (0.84 + 0.26 * n + 0.1 * (n3 - 0.5));
      c *= mix(0.85, 1.0, smoothstep(0.0, 1.5, s));
      praRough = 0.55;
    } else {
      // Slate and lead: small courses.
      float course = s / (style == ${Metal.Slate} ? 0.24 : 0.7);
      float cw = max(fwidth(course), 1e-4);
      float line = praPulse(course, 0.0, 0.16, cw);
      float colc = u / 0.32 + 0.5 * floor(course);
      float fade = 1.0 - smoothstep(0.3, 0.7, max(fwidth(colc), cw));
      float tone = 0.9 + 0.18 * praHash(vec2(floor(colc), floor(course)) + seed);
      float n = praNoise(wp.xz * 0.3 + wp.y * 0.2 + seed);
      c *= (1.0 - 0.22 * line) * mix(1.0, tone, fade) * (0.9 + 0.2 * n);
      praRough = 0.6;
    }
    diffuseColor.rgb = c;
  } else if (kind == ${Surface.Glass}) {
    // A window: dark glass in stone tracery (mullions, and a transom where the head begins) or a
    // rose; coordinates across and up in metres, with the window's width and height.
    float x = vFacade.x, y = vFacade.y, W = max(vFacade.z, 0.1), H = max(vFacade.w, 0.1);
    vec3 g = vec3(0.03, 0.036, 0.044) * (0.75 + 0.6 * praHash(vec2(seed, floor(y / 2.0))));
    float stone = 0.0;
    if (style == ${Glass.Curtain}) {
      // A curtain wall: pale, half-mirrored glass in a light frame of mullions and floors.
      g = vec3(0.3, 0.35, 0.38);
      float k = x / 1.5, f = y / 3.1;
      stone = max(praPulse(k, 0.0, 0.06, max(fwidth(k), 1e-4)), praPulse(f, 0.0, 0.08, max(fwidth(f), 1e-4)));
      praMetal = 0.55 * (1.0 - stone);
    } else if (style == ${Glass.Tracery}) {
      float n = max(2.0, floor(W / 0.85 + 0.5));
      float k = x / W * n;
      stone = praPulse(k + 0.06, 0.0, 0.12, max(fwidth(k), 1e-4)) * step(0.02, x / W) * step(x / W, 0.98);
      float bars = y / 1.1;
      stone = max(stone, 0.5 * praPulse(bars, 0.0, 0.05, max(fwidth(bars), 1e-4)));
    } else if (style == ${Glass.Rose}) {
      vec2 d = vec2(x - W * 0.5, y - H * 0.5) / (0.5 * W);
      float r = length(d), a = atan(d.y, d.x) * 12.0 / 6.2832;
      stone = max(praPulse(a, 0.0, 0.12, max(fwidth(a), 1e-4)) * step(0.25, r), 1.0 - smoothstep(0.18, 0.25, r) + praPulse(r * 3.0, 0.0, 0.1, max(fwidth(r * 3.0), 1e-4)));
    }
    stone = clamp(stone, 0.0, 1.0);
    diffuseColor.rgb = mix(g, diffuseColor.rgb, stone);
    praGlass = 1.0 - stone;
  } else if (kind == ${Surface.Opening}) {
    praRough = 1.0;
  }
  // Floodlit landmarks: warm light from below on the walls, less on the roofs, fading upward.
  if (mod(floor(vInfo.z / 2.0 + 0.01), 2.0) > 0.5) {
    float facing = 1.0 - 0.6 * abs(normalize(vPraN).y);
    float up = praAbove >= 0.0 ? praAbove : 20.0;
    // Sodium and halogen through a daylight white balance: deep orange (9542).
    praEmit += diffuseColor.rgb * vec3(1.0, 0.42, 0.12) * 0.13 * facing * (0.45 + 0.55 * exp(-up / 22.0));
  }
  if (kind == ${Surface.Glass} && style != ${Glass.Curtain}) praEmit += vec3(1.0, 0.7, 0.4) * 0.02 * praGlass;
  if (kind == ${Surface.Glass} && style == ${Glass.Curtain}) praEmit += vec3(1.0, 0.86, 0.66) * 0.07 * praGlass;
}
vec3 praPoolE = praAbove >= 0.0 ? diffuseColor.rgb * praLampPool(vPraWorld, praAbove) * 0.14 : vec3(0.0);
`;

export function buildingMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 });
  const styleA = STYLES.map((s) => new THREE.Vector4(s.cell, s.winW, s.winH, s.sill));
  const styleB = STYLES.map((s) => new THREE.Vector4(s.storey, s.ground, 0, 0));
  return patchLit(m, (shader) => {
    shader.uniforms.uStyleA = { value: styleA };
    shader.uniforms.uStyleB = { value: styleB };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aFacade;\nattribute vec4 aInfo;\nvarying vec4 vFacade;\nflat varying vec4 vInfo;\nvarying vec3 vPraN;')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvFacade = aFacade;\nvInfo = aInfo;\nvPraN = objectNormal;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${GLSL_PARS}`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n${GLSL_MAIN}\nif (praRough >= 0.0) roughnessFactor = praRough;\nroughnessFactor = mix(roughnessFactor, 0.14, praGlass);`)
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = max(metalnessFactor, praMetal);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += praEmit * uCityLights + praPoolE;');
  }, '-buildings');
}
