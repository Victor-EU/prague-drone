// The material of every building: three's standard material with the sky patch (src/sky/lit.ts),
// plus the surfaces of design.md §8.1 and §8.2 drawn in the shader: window grids by facade style,
// cornices and ground floors on walls; tile courses, weathering and north-slope lichen on roofs;
// dark tops on chimneys, a window in each dormer; and for the landmarks (tools/landmarks/) stone
// courses blackened in patches, slate, copper and gold, traceried windows and dark openings. Near,
// the close-ups' details (M9, M10): two-tone trim, casements, hoods, portals, round-headed windows,
// stucco in relief, balconies and shutters. Every pattern is box-filtered by its own screen
// footprint, so at a distance it fades to its average instead of shimmering.

import * as THREE from 'three';
import { patchLit } from '../sky/lit.ts';
import { STYLES, Style, Surface, Stone, Metal, Glass } from '../core/buildings.ts';

const GLSL_PARS = /* glsl */ `
varying vec4 vFacade;
flat varying vec4 vInfo;
varying vec3 vPraN;
uniform vec4 uStyleA[${STYLES.length}];
uniform vec4 uStyleB[${STYLES.length}];
uniform float uDetail;
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
// The box-filtered coverage of the rectangle [lo, hi] at p, for a footprint w.
float praBox(vec2 p, vec2 lo, vec2 hi, vec2 w) {
  return (praStep(lo.x, p.x, w.x) - praStep(hi.x, p.x, w.x)) * (praStep(lo.y, p.y, w.y) - praStep(hi.y, p.y, w.y));
}
// The coverage of an ellipse centred at c with radii r (by an approximate distance).
float praEll(vec2 p, vec2 c, vec2 r, vec2 w) {
  float d = (length((p - c) / r) - 1.0) * min(r.x, r.y);
  return 1.0 - clamp(d / max(max(w.x, w.y), 1e-4) + 0.5, 0.0, 1.0);
}
// An opening with a round head: a rectangle from y0 up to its spring ys, under a half disc of
// radius hw centred at (0, ys).
float praArch(vec2 p, float hw, float y0, float ys, vec2 w) {
  float disc = praEll(p, vec2(0.0, ys), vec2(hw), w) * praStep(ys, p.y, w.y);
  return clamp(praBox(p, vec2(-hw, y0), vec2(hw, ys), w) + disc, 0.0, 1.0);
}
// A thin line through the origin across n, for glazing bars.
float praBar(vec2 q, vec2 n, float hw, vec2 w) {
  float d = dot(q, n);
  return praStep(-hw, d, max(w.x, w.y)) - praStep(hw, d, max(w.x, w.y));
}
// Stucco (8777), each as a coverage; drawn in relief by reading it twice, a few centimetres apart.
// A cartouche filling an apron hw either side: a framed shield, a volute at each end, and a
// garland sagging between them.
float praCartouche(vec2 q, float hw, vec2 w) {
  vec2 k = vec2(abs(q.x), q.y);
  float s = praEll(q, vec2(0.0), vec2(0.19, 0.13), w);
  s = max(s, praEll(q, vec2(0.0), vec2(0.27, 0.18), w) - praEll(q, vec2(0.0), vec2(0.235, 0.15), w));
  float vx = hw - 0.11;
  s = max(s, praEll(k, vec2(vx, 0.02), vec2(0.095), w) - praEll(k, vec2(vx, 0.02), vec2(0.042), w));
  float t = (k.x - 0.25) / max(vx - 0.33, 0.05), yg = 0.03 - 0.1 * sin(3.1416 * clamp(t, 0.0, 1.0));
  s = max(s, step(0.0, t) * step(t, 1.0) * (praStep(yg - 0.022, k.y, w.y) - praStep(yg + 0.022, k.y, w.y)));
  return s;
}
// A wreath of leaves, 0.7 m across.
float praWreath(vec2 q, vec2 w) {
  float t = 0.055 + 0.025 * cos(atan(q.y, q.x) * 14.0);
  return clamp(praEll(q, vec2(0.0), vec2(0.3 + t), w) - praEll(q, vec2(0.0), vec2(0.3 - t), w), 0.0, 1.0);
}
// A shell in a pediment: a fan with flutes.
float praShell(vec2 q, vec2 w) {
  return praEll(q, vec2(0.0), vec2(0.21, 0.17), w) * praStep(0.0, q.y, w.y) * (0.72 + 0.28 * cos(atan(q.y, q.x) * 11.0));
}
// Where the balconies are: on the 19th-century blocks the middle windows of the upper floors but
// the top; on the rich fronts the window over the portal, on most palaces and some others.
bool praBalcony(int style, bool rich, bool portal, float fl, float col, float n, float nS, float dcol, float hb) {
  if (style == ${Style.Block}) return hb < 0.6 && abs(col - 0.5 * (n - 1.0)) < 0.6 && fl > 0.5 && fl < nS - 1.5;
  return rich && portal && fl > 0.5 && fl < 1.5 && col == dcol && hb < (style == ${Style.Palace} ? 0.8 : 0.45);
}
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
    float wv = max(fwidth(v), 1e-4), wu = max(fwidth(u), 1e-4);
    vec3 c = diffuseColor.rgb;
    // The details of the close-ups (design.md §8.2, M9) on the old fronts; the rich ones (baroque,
    // Old Town, palace) also get aprons and hoods. They fade out between about 50 and 150 m.
    bool orn = style == ${Style.Baroque} || style == ${Style.OldTown} || style == ${Style.Palace} || style == ${Style.Block} || style == ${Style.House};
    bool rich = style == ${Style.Baroque} || style == ${Style.OldTown} || style == ${Style.Palace};
    float near = orn ? (1.0 - smoothstep(0.03, 0.09, max(wu, wv))) * uDetail : 0.0;
    // Two tones: the trim paler (white and cream on ochre, 8884), deeper and warmer (salmon on pale
    // pink, 8777; red-orange on ochre, 8082), or the field's own colour in relief; by building.
    float mx = max(c.r, max(c.g, c.b)), sat = (mx - min(c.r, min(c.g, c.b))) / max(mx, 1e-3);
    float tk = praHash(vec2(seed * 7.13, 3.7));
    float pDeep = sat < 0.35 ? 0.5 : 0.2, pPale = sat < 0.35 ? 0.3 : 0.65;
    vec3 trim = tk < pDeep ? c * vec3(0.8, 0.44, 0.34) : tk < pDeep + pPale ? mix(c, vec3(0.86, 0.82, 0.72), 0.75) : c * 1.08;
    if (!orn) trim = c;
    float inC = 0.0;
    if (party > 0.5) {
      // A firewall: bare, a little grey.
      c = mix(c, vec3(dot(c, vec3(0.3333))), 0.35) * 0.86;
    } else if (top > 3.0) {
      // Cornice under the eave, in the trim: a lit moulding over a line of shadow.
      inC = praStep(top - 0.5, v, wv);
      float line = praStep(top - 0.78, v, wv) * (1.0 - inC);
      c = mix(c, trim, 0.85 * inC) * (1.0 + 0.12 * inC) * (1.0 - 0.38 * line);
      // Plinth.
      c *= mix(0.8, 1.0, praStep(0.9, v, wv));
      // Lesenes: strips of the trim up the ends of the front, from the plinth to the cornice.
      if (orn && style != ${Style.House} && L > 5.0) {
        float les = ((1.0 - praStep(0.55, u, wu)) + praStep(L - 0.55, u, wu)) * praStep(0.9, v, wv) * (1.0 - inC);
        c = mix(c, trim, les);
      }
    }
    float win = 0.0, frame = 0.0;
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
        // The blocks' ground floor is rusticated.
        if (style == ${Style.Block}) c *= 1.0 - 0.14 * ground * praPulse(v / 0.42, 0.0, 0.1, wv / 0.42);
      } else {
        win += ground * cols * praPulse(r, 0.3, min(0.88, 0.3 + A.z / sh), wr);
      }
      // String course between the ground floor and the first, in the trim.
      float sc = praPulse(r, 0.96, 1.0, wr) * step(0.5, r) * step(r, 1.5);
      c = mix(c, trim, 0.7 * sc) * (1.0 - 0.18 * sc);
      win = clamp(win, 0.0, 1.0);
      float h = praHash(vec2(floor(cc) + seed * 3.7, floor(r) + seed * 1.3));
      vec3 glass = mix(vec3(0.035, 0.042, 0.05), vec3(0.13, 0.13, 0.13), h * h);
      // White casements; the modern fronts' frames are dark metal. From afar a window is glass
      // with its frame in it, a grey, not a black hole.
      vec3 frameC = orn ? vec3(0.78, 0.76, 0.7) : vec3(0.08, 0.085, 0.09);
      // Painted over everything at the end: doors and balcony railings (M10).
      vec3 ovC = vec3(0.0);
      float ovA = 0.0;
      #ifndef PRA_NO_DETAIL
      if (near > 0.0) {
        // Metres from the window's axis, and above the storey's floor.
        vec2 p = vec2((fract(cc) - 0.5) * span, fract(r) * sh), w2 = vec2(wu, wv);
        float fl = floor(r), col = floor(cc);
        bool gf = fl < 0.5;
        // Nothing below the ground floor, where a street falls away along a front.
        float mCell = near * inside * step(0.0, fl) * step(fl, nS - 1.0);
        // The ground floor's plain windows take the same frames; shopfronts do not.
        float m = mCell * (gf && B.y > 0.5 ? 0.0 : 1.0);
        float W = A.y, y0 = gf ? 0.3 * sh : A.w, y1 = gf ? min(0.88 * sh, 0.3 * sh + A.z) : min(A.w + A.z, 0.9 * sh);
        float sw = rich ? 0.17 : 0.12;
        // The portal (8777, 8082): one door to a street front, in the middle of a rich one.
        float hd = praHash(vec2(seed * 2.3, L * 0.37)), hb = praHash(vec2(seed * 6.1, 1.7));
        bool portal = party < 0.5 && top > 3.0 && hd < 0.9 && span > 1.9;
        float dcol = rich && n >= 3.0 ? floor(n * 0.5) : floor(hd / 0.9 * n);
        bool door = portal && gf && col == dcol;
        bool balc = praBalcony(style, rich, portal, fl, col, n, nS, dcol, hb);
        bool balcUp = praBalcony(style, rich, portal, fl + 1.0, col, n, nS, dcol, hb);
        // Round-headed windows on the rich fronts' ground floors (8777).
        bool arch = rich && gf && B.y < 0.5 && !door && praHash(vec2(seed * 1.7, 5.3)) < 0.65;
        float ys = arch ? y1 - 0.5 * W : y1;
        float yb = 0.12; // a balcony's floor above the storey's
        float rect = arch ? praArch(p, 0.5 * W, y0, ys, w2) : praBox(p, vec2(-0.5 * W, y0), vec2(0.5 * W, y1), w2);
        float sur = (arch ? praArch(p, 0.5 * W + sw, y0 - sw, ys, w2) : praBox(p, vec2(-0.5 * W - sw, y0 - sw), vec2(0.5 * W + sw, y1 + sw), w2)) - rect;
        // Ears at the top corners of the surrounds on the rich fronts' upper windows.
        if (rich && !gf) sur += praBox(vec2(abs(p.x), p.y), vec2(0.5 * W + sw, y1 + sw - 0.17), vec2(0.5 * W + sw + 0.08, y1 + sw), w2);
        // The sill: a lit ledge with its shadow under it; the rich fronts an apron panel below.
        float noSill = balc ? 0.0 : 1.0;
        float sill = praBox(p, vec2(-0.5 * W - sw - 0.06, y0 - sw - 0.07), vec2(0.5 * W + sw + 0.06, y0 - sw + 0.01), w2) * noSill;
        float sillSh = praBox(p, vec2(-0.5 * W - sw, y0 - sw - 0.16), vec2(0.5 * W + sw, y0 - sw - 0.07), w2) * noSill;
        float apron = rich && !gf ? praBox(p, vec2(-0.5 * W + 0.05, y0 - sw - 0.62), vec2(0.5 * W - 0.05, y0 - sw - 0.22), w2) * noSill : 0.0;
        if (door) { sur = 0.0; sill = 0.0; sillSh = 0.0; }
        c = mix(c, trim, clamp(sur + 0.55 * apron, 0.0, 1.0) * m);
        c = mix(c, trim * 1.15, sill * m);
        c *= 1.0 - 0.35 * sillSh * m;
        // Stucco in relief, lit from above: a cartouche in the apron of the baroque and palace
        // fronts (the Old Town's first floor only), a keystone over the upper windows of the rich
        // fronts, a wreath on one pier of the first floor; a shell in its pediments (below).
        vec2 up = vec2(0.0, 0.03);
        float st0 = 0.0, st1 = 0.0;
        if (rich && !gf && apron > 0.0 && (style != ${Style.OldTown} || fl < 1.5)) {
          vec2 q = p - vec2(0.0, y0 - sw - 0.42);
          st0 = praCartouche(q, 0.5 * W - 0.05, w2); st1 = praCartouche(q + up, 0.5 * W - 0.05, w2);
        }
        if (rich && fl > 1.5 && !balc) {
          st0 = max(st0, praBox(p, vec2(-0.1, y1), vec2(0.1, y1 + sw + 0.12), w2));
          st1 = max(st1, praBox(p + up, vec2(-0.1, y1), vec2(0.1, y1 + sw + 0.12), w2));
        }
        float hk = praHash(vec2(seed * 3.1, 9.2));
        if (rich && fl > 0.5 && fl < 1.5) {
          float pc = floor(praHash(vec2(seed * 8.7, 3.3)) * max(n - 1.0, 1.0));
          if (praHash(vec2(seed * 5.5, 7.1)) < 0.4 && n > 1.5 && span - W > 1.1 && (col == pc || col == pc + 1.0)) {
            vec2 q = p - vec2((col == pc ? 0.5 : -0.5) * span, 0.5 * (y0 + y1));
            st0 = max(st0, praWreath(q, w2)); st1 = max(st1, praWreath(q + up, w2));
          }
        }
        c = mix(c, trim * 1.1, st0 * m);
        c *= 1.0 + (0.3 * st0 * (1.0 - st1) - 0.4 * (1.0 - st0) * st1) * m;
        // A hood over the window: on the first floor of the rich fronts segmental, triangular or
        // straight by building; over every upper window but the top row of the blocks, straight.
        if (((rich && fl > 0.5 && fl < 1.5) || (style == ${Style.Block} && fl > 0.5 && fl < nS - 1.5)) && !balc) {
          float yt = y1 + sw + 0.05, hwH = 0.5 * W + sw + 0.1;
          float xx = clamp(abs(p.x) / hwH, 0.0, 1.0);
          float rise = style == ${Style.Block} || hk < 0.34 ? 0.0 : hk < 0.67 ? 0.26 * sqrt(1.0 - xx * xx) : 0.34 * (1.0 - xx);
          float span2 = praStep(-hwH, p.x, wu) - praStep(hwH, p.x, wu);
          float hood = span2 * (praStep(yt, p.y, wv) - praStep(yt + 0.14 + rise, p.y, wv));
          float hoodSh = praBox(p, vec2(-hwH + 0.05, yt - 0.08), vec2(hwH - 0.05, yt), w2);
          c = mix(c, trim * 1.12, hood * m);
          c *= 1.0 - 0.4 * hoodSh * m;
          // In a segmental or triangular pediment, a shell in relief.
          if (rich && hk >= 0.34) {
            vec2 q = p - vec2(0.0, yt + 0.03);
            float s0 = praShell(q, w2), s1 = praShell(q + up, w2);
            c *= 1.0 + (0.3 * s0 * (1.0 - s1) - 0.4 * (1.0 - s0) * s1 + 0.08 * s0) * m;
          }
        }
        // The window: a casement with a frame, a mullion and a transom two thirds up, the upper
        // panes taking more sky; a round head has its fan of bars; a balcony's window is a door
        // down to the balcony's floor, panelled below the sill.
        float fw = 0.07, yT = arch ? ys : y0 + 0.66 * (y1 - y0);
        float open = rect, panes;
        if (arch) panes = praArch(p, 0.5 * W - fw, y0 + fw, ys, w2);
        else panes = praBox(p, vec2(-0.5 * W + fw, y0 + fw), vec2(0.5 * W - fw, y1 - fw), w2);
        if (balc) open = max(open, praBox(p, vec2(-0.5 * W, yb), vec2(0.5 * W, y0), w2));
        float bars = max(praBox(p, vec2(-0.035, y0), vec2(0.035, y1), w2), praBox(p, vec2(-0.5 * W, yT - 0.035), vec2(0.5 * W, yT + 0.035), w2));
        if (arch) {
          vec2 qf = p - vec2(0.0, ys);
          bars = max(bars, max(praBar(qf, vec2(-0.7071, 0.7071), 0.03, w2), praBar(qf, vec2(0.7071, 0.7071), 0.03, w2)) * praStep(ys, p.y, wv));
        }
        if (!door) {
          frame = clamp(open - panes * (1.0 - bars), 0.0, 1.0) * m;
          win = mix(win, open, m);
        }
        glass += vec3(0.03, 0.035, 0.04) * praStep(yT, p.y, wv) * m;
        // Balconies: a slab on two consoles, its shadow on the wall under it, an iron railing.
        for (int k = 0; k < 2; k++) {
          if (k == 0 ? !balc : !balcUp) continue;
          vec2 q = p - vec2(0.0, float(k) * sh);
          float bw = 0.5 * W + 0.45;
          float slab = praBox(q, vec2(-bw, yb - 0.16), vec2(bw, yb), w2);
          float cons = praBox(vec2(abs(q.x), q.y), vec2(bw - 0.3, yb - 0.5), vec2(bw - 0.14, yb - 0.16), w2);
          float under = praBox(q, vec2(-bw + 0.06, yb - 0.55), vec2(bw - 0.06, yb - 0.16), w2);
          c *= 1.0 - 0.45 * under * (1.0 - cons) * mCell;
          c = mix(c, trim * 0.92, cons * mCell);
          c = mix(c, trim * 1.15, slab * mCell);
          if (k == 0) {
            float rails = max(praBox(q, vec2(-bw, yb + 0.9), vec2(bw, yb + 0.95), w2), praBox(q, vec2(-bw, yb + 0.03), vec2(bw, yb + 0.07), w2));
            float bal = praPulse((q.x + bw) / 0.11, 0.0, 0.2, wu / 0.11) * praBox(q, vec2(-bw, yb), vec2(bw, yb + 0.92), w2);
            ovC = vec3(0.025, 0.028, 0.028);
            ovA = max(ovA, max(rails, bal) * mCell);
          }
        }
        if (door) {
          // The portal: a stone frame round the opening, round-headed on most baroque and palace
          // fronts with a keystone, straight under a cornice on the rest; the leaves dark painted
          // wood with raised panels; a fanlight or a transom light of glass above them.
          float Wd = min(rich ? 1.7 : 1.3, span - 0.7), Hd = min(sh - 0.7, rich ? 3.1 : 2.6);
          bool roundTop = style == ${Style.Baroque} || style == ${Style.Palace} ? hd < 0.6 : hd < 0.25;
          float ps = rich ? 0.3 : 0.18;
          float yS = roundTop ? Hd - 0.5 * Wd : Hd - 0.5;
          float hole = roundTop ? praArch(p, 0.5 * Wd, 0.0, yS, w2) : praBox(p, vec2(-0.5 * Wd, 0.0), vec2(0.5 * Wd, Hd), w2);
          float dfr = (roundTop ? praArch(p, 0.5 * Wd + ps, 0.0, yS, w2) : praBox(p, vec2(-0.5 * Wd - ps, 0.0), vec2(0.5 * Wd + ps, Hd + ps), w2)) - hole;
          vec3 stoneC = rich ? mix(trim, vec3(0.6, 0.58, 0.53), 0.5) : trim * 1.05;
          c = mix(c, stoneC, dfr * mCell);
          if (roundTop) {
            float key = praBox(p, vec2(-0.13, Hd - 0.08), vec2(0.13, Hd + ps + 0.1), w2);
            c = mix(c, stoneC * 1.12, key * mCell);
          } else if (rich) {
            float cor = praBox(p, vec2(-0.5 * Wd - ps - 0.15, Hd + ps), vec2(0.5 * Wd + ps + 0.15, Hd + ps + 0.17), w2);
            c = mix(c, stoneC * 1.12, cor * mCell);
            c *= 1.0 - 0.4 * praBox(p, vec2(-0.5 * Wd - ps - 0.1, Hd + ps - 0.08), vec2(0.5 * Wd + ps + 0.1, Hd + ps), w2) * mCell * (1.0 - cor);
          }
          // Glass above the leaves, with bars.
          float fan = clamp(hole - praBox(p, vec2(-0.5 * Wd, 0.0), vec2(0.5 * Wd, yS + 0.04), w2), 0.0, 1.0);
          vec2 qf = p - vec2(0.0, yS);
          float fb = roundTop
            ? max(max(praBar(qf, vec2(-0.7071, 0.7071), 0.025, w2), praBar(qf, vec2(0.7071, 0.7071), 0.025, w2)), praBar(qf, vec2(1.0, 0.0), 0.025, w2))
            : praBar(qf, vec2(1.0, 0.0), 0.025, w2);
          fb = max(fb, fan - (roundTop ? praEll(p, vec2(0.0, yS), vec2(0.5 * Wd - 0.06), w2) : praBox(p, vec2(-0.5 * Wd + 0.06, yS + 0.1), vec2(0.5 * Wd - 0.06, Hd - 0.06), w2)));
          frame = clamp(fan * fb, 0.0, 1.0) * mCell;
          win = mix(win, fan, mCell);
          frameC = vec3(0.06, 0.05, 0.04);
          // The leaves.
          float leaves = praBox(p, vec2(-0.5 * Wd, 0.0), vec2(0.5 * Wd, yS + 0.04), w2);
          float hw2 = 0.5 * Wd;
          vec2 a2 = vec2(abs(p.x), p.y);
          float pan = praBox(a2, vec2(0.1, 0.25), vec2(hw2 - 0.1, 0.4 * yS), w2) + praBox(a2, vec2(0.1, 0.48 * yS), vec2(hw2 - 0.1, yS - 0.14), w2);
          float panU = praBox(a2 + up, vec2(0.1, 0.25), vec2(hw2 - 0.1, 0.4 * yS), w2) + praBox(a2 + up, vec2(0.1, 0.48 * yS), vec2(hw2 - 0.1, yS - 0.14), w2);
          float wk = praHash(vec2(seed * 9.1, 0.7));
          vec3 wood = wk < 0.5 ? vec3(0.07, 0.038, 0.022) : wk < 0.75 ? vec3(0.028, 0.055, 0.038) : vec3(0.1, 0.03, 0.022);
          wood *= 1.0 + 0.5 * pan * (1.0 - panU) - 0.4 * (1.0 - pan) * panU;
          wood *= 1.0 - 0.6 * praBox(p, vec2(-0.012, 0.0), vec2(0.012, yS), w2);
          ovC = wood;
          ovA = leaves * mCell;
        }
      }
      // Shutters (design.md §8.2) on some plain houses and villas, not on the core's baroque fronts,
      // which the photographs show without: two painted leaves beside each window, louvred, in
      // faded colours; big enough to show from the drone.
      float shK = praHash(vec2(seed * 4.3, 2.9));
      if (style == ${Style.House} && shK < 0.12 && party < 0.5 && 2.0 * A.y < span - 0.4) {
        float rows = praPulse(r, a, b, wr) * upper + (B.y > 0.5 ? 0.0 : praStep(0.0, r, wr) * (1.0 - praStep(1.0, r, wr)) * praPulse(r, 0.3, min(0.88, 0.3 + A.z / sh), wr));
        float leaf = (praPulse(cc, 0.5 + hw, 0.5 + 2.0 * hw, wc) + praPulse(cc, 0.5 - 2.0 * hw, 0.5 - hw, wc)) * inside * rows;
        vec3 shC = shK < 0.045 ? vec3(0.1, 0.17, 0.11) : shK < 0.07 ? vec3(0.17, 0.09, 0.045) : shK < 0.095 ? vec3(0.24, 0.29, 0.23) : vec3(0.21, 0.065, 0.045);
        float lv = v / 0.07;
        shC *= 1.0 - 0.3 * praPulse(lv, 0.0, 0.35, max(fwidth(lv), 1e-4)) * (1.0 - smoothstep(0.3, 0.7, fwidth(lv)));
        c = mix(c, shC, leaf);
      }
      #endif
      glass = mix(glass, frameC, (orn ? 0.22 : 0.12) * (1.0 - near));
      c = mix(c, glass, win);
      c = mix(c, frameC, frame * win);
      c = mix(c, ovC, ovA);
      // At night a quarter of the windows are lit, and half the shopfronts: warm, some whiter.
      float hl = praHash(vec2(floor(cc) * 1.7 + seed * 5.3, floor(r) * 2.3 + seed));
      float lit = step(hl, r < 1.0 ? 0.4 : 0.18);
      vec3 warm = mix(vec3(1.0, 0.46, 0.17), vec3(1.0, 0.7, 0.42), praHash(vec2(hl * 7.0, seed)));
      praEmit += warm * win * (1.0 - 0.7 * frame) * lit * 0.07;
    }
    diffuseColor.rgb = c;
    praGlass = win * (1.0 - frame);
    // Where a street falls away along a front, the wall below the building's ground is at the
    // street's level for the lamps' pools, not unlit.
    praAbove = max(v, 0.0);
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
    // Skylights, one in about twelve cells of 3.4 by 2.6 m on the tiled slopes (8884): dark glass in
    // a pale metal frame, fading out beyond a few hundred metres.
    float su = max(fwidth(u), 1e-4), ss = max(fwidth(s), 1e-4);
    float nearR = kind == ${Surface.Roof} ? (1.0 - smoothstep(0.15, 0.4, max(su, ss))) * uDetail : 0.0;
    if (nearR > 0.0) {
      vec2 cell = vec2(u / 3.4, s / 2.6), id = floor(cell);
      float on = step(praHash(id + seed * 0.71), 0.085) * step(1.0, id.y * 2.6) * step((id.y + 1.0) * 2.6, smax - 1.0);
      vec2 q = (fract(cell) - 0.5) * vec2(3.4, 2.6), w2 = vec2(su, ss);
      float pane = praBox(q, vec2(-0.39, -0.55), vec2(0.39, 0.55), w2) * on * nearR;
      float gl = praBox(q, vec2(-0.33, -0.49), vec2(0.33, 0.49), w2) * on * nearR;
      c = mix(c, vec3(0.32, 0.32, 0.3), pane);
      c = mix(c, vec3(0.03, 0.036, 0.044), gl);
      praGlass = gl;
    }
    diffuseColor.rgb = c;
  } else if (kind == ${Surface.FlatRoof}) {
    diffuseColor.rgb *= 0.86 + 0.22 * praNoise(wp.xz * 0.4 + seed) + 0.08 * (praNoise(wp.xz * 2.7) - 0.5);
  } else if (kind == ${Surface.Gable}) {
    if (party > 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(dot(diffuseColor.rgb, vec3(0.3333))), 0.35) * 0.86;
  } else if (kind == ${Surface.Chimney}) {
    float v = vFacade.z, H = vFacade.w;
    // Most stacks in the core are plastered white or cream (8884), the rest the house's colour.
    float ck = praHash(vec2(seed * 5.9, 1.3));
    diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.84, 0.81, 0.74), vec3(0.72, 0.68, 0.6), ck), step(ck, 0.7));
    diffuseColor.rgb *= mix(1.0, 0.42, praStep(H - 0.28, v, max(fwidth(v), 1e-4)));
  } else if (kind == ${Surface.DormerFront}) {
    float x = vFacade.x / max(vFacade.y, 0.1), y = vFacade.z / max(vFacade.w, 0.1);
    float wx = fwidth(x), wy = fwidth(y);
    float win = (praStep(0.2, x, wx) - praStep(0.8, x, wx)) * (praStep(0.18, y, wy) - praStep(0.86, y, wy));
    // The front white (8884), the window a casement with a cross.
    vec3 front = mix(diffuseColor.rgb, vec3(0.84, 0.81, 0.74), 0.7);
    float fx = 0.06 / max(vFacade.y, 0.1), fy = 0.06 / max(vFacade.w, 0.1);
    float panes = (praStep(0.2 + fx, x, wx) - praStep(0.8 - fx, x, wx)) * (praStep(0.18 + fy, y, wy) - praStep(0.86 - fy, y, wy));
    float bars = max(praStep(0.5 - 0.5 * fx, x, wx) - praStep(0.5 + 0.5 * fx, x, wx), praStep(0.62 - 0.5 * fy, y, wy) - praStep(0.62 + 0.5 * fy, y, wy));
    float glassA = win * panes * (1.0 - bars);
    diffuseColor.rgb = mix(front, vec3(0.04, 0.045, 0.05), glassA);
    praGlass = glassA;
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

/** The close-up details of M9 and M10 (1 on, 0 off; `?detail=0` in development, to measure their cost). */
export const DETAIL = { value: 1 };

export function buildingMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 });
  // `?detail=0` leaves the facades' near details out of the shader altogether, so that a benchmark
  // also measures what their code costs where it is not drawn.
  if (import.meta.env.DEV && new URLSearchParams(location.search).get('detail') === '0') m.defines = { PRA_NO_DETAIL: '' };
  const styleA = STYLES.map((s) => new THREE.Vector4(s.cell, s.winW, s.winH, s.sill));
  const styleB = STYLES.map((s) => new THREE.Vector4(s.storey, s.ground, 0, 0));
  return patchLit(m, (shader) => {
    shader.uniforms.uStyleA = { value: styleA };
    shader.uniforms.uStyleB = { value: styleB };
    shader.uniforms.uDetail = DETAIL;
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
