// Architectural parts for the hand-built landmarks (design.md §7.1, M12): the ornament that breaks
// a silhouette against the sky and throws relief shadow at the drone's distance, built from the
// kit's sweeps, lathes, plates and slabs. Balustrades, crenellations and corbel courses on walls'
// tops; pinnacles with crockets and tracery windows with stone mullions; columns, pilasters,
// entablatures and pediments; niches with canopies, rows of shields, ribs on domes; and statue
// silhouettes in dark stone. Parts on a wall take a plane as Kit.plate does: an origin o on the
// wall, u to the right as seen from outside, v up, and stand proud of it. Build side only.

import { Kit, PROFILE, arch, type Mat, type V2, type V3 } from './kit.ts';

const DEG = Math.PI / 180;
const sub = (p: V3, q: V3): V3 => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const cross = (p: V3, q: V3): V3 => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const norm = (p: V3): V3 => { const l = Math.hypot(p[0], p[1], p[2]) || 1; return [p[0] / l, p[1] / l, p[2] / l]; };
const len = (p: V3) => Math.hypot(p[0], p[1], p[2]);
/** A deterministic 0–1 from a seed and a salt. */
export const hash = (seed: number, salt: number) => { const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453; return x - Math.floor(x); };

/** A point on a wall's plane: `a` along u, `b` along v, `off` out along the normal. */
export function onPlane(o: V3, u: V3, v: V3, a: number, b: number, off = 0): V3 {
  const n = norm(cross(u, v));
  return [o[0] + u[0] * a + v[0] * b + n[0] * off, o[1] + u[1] * a + v[1] * b + n[1] * off, o[2] + u[2] * a + v[2] * b + n[2] * off];
}
export const planeNormal = (u: V3, v: V3): V3 => norm(cross(u, v));

// ---- Walls' tops ---------------------------------------------------------------------------------

/** A baluster: a vase between two blocks, `h` tall, its widest radius `r`. */
export function baluster(k: Kit, x: number, y: number, z: number, h: number, r: number, m: Mat, sides = 6) {
  k.box(x, z, 2 * r, 2 * r, y, y + 0.1 * h, m, m);
  k.lathe(x, z, [[0.6 * r, y + 0.1 * h], [r, y + 0.3 * h], [0.5 * r, y + 0.68 * h], [0.72 * r, y + 0.9 * h]], sides, m, { flat: true });
  k.box(x, z, 2 * r, 2 * r, y + 0.9 * h, y + h, m, m);
}

/**
 * A balustrade along a path on a wall's top (local points): a plinth and a rail astride the path,
 * balusters every `step` between them, and a post at each vertex if `posts`.
 */
export function balustrade(k: Kit, path: V3[], m: Mat, o: { h?: number; step?: number; w?: number; closed?: boolean; posts?: boolean; rail?: Mat; sides?: number } = {}) {
  const h = o.h ?? 1.0, step = o.step ?? 0.34, w = o.w ?? 0.3, rail = o.rail ?? m;
  const plinthH = 0.14 * h, railH = 0.16 * h;
  k.sweep(path, PROFILE.coping(w * 1.15, plinthH), m, { closed: o.closed, caps: !o.closed });
  k.sweep(path.map((p) => [p[0], p[1] + h - railH, p[2]] as V3), PROFILE.coping(w * 1.1, railH), rail, { closed: o.closed, caps: !o.closed });
  const n = path.length, segs = n - (o.closed ? 0 : 1);
  for (let i = 0; i < segs; i++) {
    const a = path[i], b = path[(i + 1) % n], L = len(sub(b, a));
    const free = L - (o.posts ? w * 1.6 : 0);
    const count = Math.max(1, Math.round(free / step));
    for (let q = 0; q < count; q++) {
      const t = (o.posts ? w * 0.8 : 0) / L + (free / L) * ((q + 0.5) / count);
      baluster(k, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + plinthH, a[2] + (b[2] - a[2]) * t, h - plinthH - railH, w * 0.36, m, o.sides ?? 6);
    }
  }
  if (o.posts) for (const p of path) k.box(p[0], p[2], w * 1.5, w * 1.5, p[1], p[1] + h + 0.05, m, m);
}

/** Merlons along a path on a wall's top: `w` wide, `gap` apart, `h` tall, `depth` across the wall. */
export function crenellation(k: Kit, path: V3[], m: Mat, o: { w?: number; gap?: number; h?: number; depth?: number; closed?: boolean; cap?: Mat } = {}) {
  const w = o.w ?? 0.9, gap = o.gap ?? 0.7, h = o.h ?? 1.1, depth = o.depth ?? 0.5;
  const n = path.length, segs = n - (o.closed ? 0 : 1);
  for (let i = 0; i < segs; i++) {
    const a = path[i], b = path[(i + 1) % n], L = len(sub(b, a));
    const t = norm(sub(b, a)), s: V3 = [t[2], 0, -t[0]];
    const count = Math.max(1, Math.floor((L + gap) / (w + gap)));
    const start = (L - (count * w + (count - 1) * gap)) / 2;
    for (let q = 0; q < count; q++) {
      const c0 = start + q * w, c1 = c0 + w;
      const ring: V2[] = [
        [a[0] + t[0] * c0 - s[0] * depth / 2, a[2] + t[2] * c0 - s[2] * depth / 2], [a[0] + t[0] * c1 - s[0] * depth / 2, a[2] + t[2] * c1 - s[2] * depth / 2],
        [a[0] + t[0] * c1 + s[0] * depth / 2, a[2] + t[2] * c1 + s[2] * depth / 2], [a[0] + t[0] * c0 + s[0] * depth / 2, a[2] + t[2] * c0 + s[2] * depth / 2],
      ];
      k.prism(ring, a[1], a[1] + h, m, o.cap ?? m);
    }
  }
}

/**
 * Corbels under a projecting course: blocks every `step` along a path at the wall's face, `w` wide,
 * standing `out`, their undersides sloping back to the wall over the lower half of `h`; outward is
 * to the left of travel (as Kit.sweep has it), or away from a closed ring's centre.
 */
export function corbels(k: Kit, path: V3[], m: Mat, o: { step?: number; w?: number; h?: number; out?: number; closed?: boolean } = {}) {
  const step = o.step ?? 1.4, w = o.w ?? 0.5, h = o.h ?? 0.9, out = o.out ?? 0.6;
  const n = path.length, segs = n - (o.closed ? 0 : 1);
  let flip = 1;
  if (o.closed) {
    const c: V3 = [0, 0, 0];
    for (const p of path) { c[0] += p[0] / n; c[1] += p[1] / n; c[2] += p[2] / n; }
    let acc = 0;
    for (let i = 0; i < segs; i++) { const t = norm(sub(path[(i + 1) % n], path[i])); const s: V3 = [-t[2], 0, t[0]]; const d = sub(path[i], c); acc += s[0] * d[0] + s[2] * d[2]; }
    if (acc < 0) flip = -1;
  }
  for (let i = 0; i < segs; i++) {
    const a = path[i], b = path[(i + 1) % n], L = len(sub(b, a));
    const t = norm(sub(b, a)), s: V3 = [-t[2] * flip, 0, t[0] * flip];
    const count = Math.max(1, Math.round(L / step));
    for (let q = 0; q < count; q++) {
      const c = (L * (q + 0.5)) / count, c0 = c - w / 2, c1 = c + w / 2;
      const P = (along: number, y: number, o2: number): V3 => [a[0] + t[0] * along + s[0] * o2, a[1] + y, a[2] + t[2] * along + s[2] * o2];
      const y1 = h * 0.45;
      k.poly([P(c0, y1, out), P(c1, y1, out), P(c1, h, out), P(c0, h, out)], m, { normal: s });
      k.poly([P(c0, 0, 0), P(c1, 0, 0), P(c1, y1, out), P(c0, y1, out)], m, { normal: [s[0], -1, s[2]] });
      k.poly([P(c0, 0, 0), P(c0, y1, out), P(c0, h, out), P(c0, h, 0)], m, { normal: [-t[0], 0, -t[2]] });
      k.poly([P(c1, 0, 0), P(c1, h, 0), P(c1, h, out), P(c1, y1, out)], m, { normal: t });
    }
  }
}

// ---- Gothic --------------------------------------------------------------------------------------

/**
 * A pinnacle or turret: a shaft from y0 to y1 of radius r (square or octagonal), a moulded cap and a
 * spire to `apex`; crockets up the spire's edges in the fine kit; the finial is the model's.
 */
export function pinnacle(k: Kit, f: Kit, x: number, z: number, y0: number, y1: number, apex: number, r: number, m: Mat, o: { sides?: number; spire?: Mat; cap?: Mat; crockets?: boolean; phase?: number } = {}) {
  const sides = o.sides ?? 8, ph = o.phase ?? (sides === 4 ? 45 : 22.5), cap = o.cap ?? m, spire = o.spire ?? m;
  const capY = y1 + Math.min(0.35, r * 0.4);
  k.lathe(x, z, [[r, y0], [r, y1]], sides, m, { flat: true, phase: ph });
  k.lathe(x, z, [[r * 1.22, y1], [r * 1.22, y1 + (capY - y1) * 0.7], [r * 1.05, capY]], sides, cap, { flat: true, phase: ph });
  k.lathe(x, z, [[r * 1.05, capY], [0, apex]], sides, spire, { flat: true, phase: ph });
  if (o.crockets) {
    const H = apex - capY;
    for (let e = 0; e < sides; e++)
      for (const t of [0.2, 0.42, 0.64]) {
        const a = (ph + (360 * e) / sides) * DEG, rr = r * 1.05 * (1 - t) + r * 0.12, y = capY + H * t;
        f.lathe(x + rr * Math.cos(a), z + rr * Math.sin(a), [[r * 0.2, y - r * 0.12], [0, y + r * 0.34]], 4, m, { flat: true, phase: ph + (360 * e) / sides });
      }
  }
}

/**
 * A Gothic window on a wall's plane, centred at `a` along u with its sill at `b`: the glass (or a
 * blind panel) standing a hair proud, a chamfered stone surround round the arch, and in the fine
 * kit the mullions dividing it into `lights` with a Y in the head.
 */
export function traceryWindow(k: Kit, f: Kit, o: V3, u: V3, v: V3, a: number, b: number, w: number, h: number, stone: Mat, glass: Mat, opt: { lights?: number; proud?: number; depth?: number; kind?: 'pointed' | 'round' | 'flat'; transom?: boolean; rise?: number } = {}) {
  const kind = opt.kind ?? 'pointed', lights = opt.lights ?? 2, proud = opt.proud ?? 0.12, depth = opt.depth ?? 0.22;
  const shape = arch(w, h, kind, opt.rise);
  const O = onPlane(o, u, v, a, b), n = planeNormal(u, v);
  k.plate(O, u, v, shape, glass, 0.03);
  const hw = w / 2, spring = h - (kind === 'flat' ? 0 : (opt.rise ?? (kind === 'round' ? hw : w * 0.75)));
  const path2: V2[] = [[-hw, 0], ...shape.slice(2).reverse(), [hw, 0]];
  f.sweep(path2.map(([x, y]) => onPlane(O, u, v, x, y)), PROFILE.ring(depth, proud), stone, { v: n });
  if (lights >= 2) {
    const bar = Math.min(0.14, w * 0.06), off = proud * 0.55;
    for (let i = 1; i < lights; i++) {
      const x = -hw + (w * i) / lights;
      f.beam(onPlane(O, u, v, x, 0, off), onPlane(O, u, v, x, spring, off), bar, stone, false, proud * 0.7);
      if (kind !== 'flat') {
        const dx = w / (2 * lights), top = spring + (h - spring) * 0.55;
        f.beam(onPlane(O, u, v, x, spring, off), onPlane(O, u, v, x - dx, top, off), bar, stone, false, proud * 0.7);
        f.beam(onPlane(O, u, v, x, spring, off), onPlane(O, u, v, x + dx, top, off), bar, stone, false, proud * 0.7);
      }
    }
    if (opt.transom ?? h > 4.5) f.beam(onPlane(O, u, v, -hw, spring * 0.5, off), onPlane(O, u, v, hw, spring * 0.5, off), bar, stone, false, proud * 0.7);
  }
}

/** A rectangular stone surround round an opening, standing `proud` of the wall, `depth` wide. */
export function surround(f: Kit, o: V3, u: V3, v: V3, a: number, b: number, w: number, h: number, stone: Mat, opt: { proud?: number; depth?: number } = {}) {
  const O = onPlane(o, u, v, a, b), n = planeNormal(u, v), hw = w / 2;
  const ring: V2[] = [[-hw, 0], [-hw, h], [hw, h], [hw, 0]];
  f.sweep(ring.map(([x, y]) => onPlane(O, u, v, x, y)), PROFILE.ring(opt.depth ?? 0.18, opt.proud ?? 0.1), stone, { v: n, closed: true });
}

// ---- Classical -----------------------------------------------------------------------------------

/** A column on a base with a capital: tuscan (echinus and abacus), ionic (with volute blocks) or corinthian (a tall bell). */
export function column(k: Kit, x: number, z: number, y0: number, y1: number, r: number, m: Mat, o: { order?: 'tuscan' | 'ionic' | 'corinthian'; sides?: number; cap?: Mat } = {}) {
  const sides = o.sides ?? 12, cap = o.cap ?? m, H = y1 - y0, order = o.order ?? 'tuscan';
  const baseH = Math.min(r * 0.9, H * 0.08), capH = order === 'corinthian' ? Math.min(r * 2.2, H * 0.14) : Math.min(r * 1.1, H * 0.09);
  k.box(x, z, 2.4 * r, 2.4 * r, y0, y0 + baseH * 0.45, m, m);
  k.lathe(x, z, [[1.2 * r, y0 + baseH * 0.45], [1.28 * r, y0 + baseH * 0.7], [1.12 * r, y0 + baseH * 0.9], [r, y0 + baseH]], sides, m);
  k.lathe(x, z, [[r, y0 + baseH], [r, y0 + baseH + H * 0.3], [r * 0.9, y1 - capH - H * 0.04], [r * 0.84, y1 - capH]], sides, m);
  if (order === 'corinthian') {
    k.lathe(x, z, [[r * 0.84, y1 - capH], [r * 0.9, y1 - capH * 0.6], [r * 1.25, y1 - capH * 0.22], [r * 1.35, y1 - capH * 0.14]], sides, cap);
    k.box(x, z, 2.9 * r, 2.9 * r, y1 - capH * 0.14, y1, cap, cap);
  } else {
    k.lathe(x, z, [[r * 0.84, y1 - capH], [r * 0.95, y1 - capH * 0.65], [r * 1.25, y1 - capH * 0.35]], sides, cap);
    k.box(x, z, 2.6 * r, 2.6 * r, y1 - capH * 0.35, y1, cap, cap);
    if (order === 'ionic') for (const sx of [-1, 1]) k.box(x + sx * r * 1.1, z, r * 0.7, r * 2.4, y1 - capH * 0.6, y1 - capH * 0.3, cap, cap);
  }
}

/** A pilaster on a wall's plane, centred at `a`, from y0 to y1, `w` wide, standing `depth` proud, with base and capital blocks. */
export function pilaster(k: Kit, o: V3, u: V3, v: V3, a: number, y0: number, y1: number, w: number, depth: number, m: Mat, opt: { cap?: Mat; capH?: number; baseH?: number } = {}) {
  const cap = opt.cap ?? m, capH = opt.capH ?? Math.min(0.6, (y1 - y0) * 0.08), baseH = opt.baseH ?? Math.min(0.5, (y1 - y0) * 0.06);
  const R = (w2: number, h0: number, h1: number): V2[] => [[-w2 / 2, h0], [w2 / 2, h0], [w2 / 2, h1], [-w2 / 2, h1]];
  k.slab(onPlane(o, u, v, a, y0, depth), u, v, R(w, 0, y1 - y0), depth, m);
  k.slab(onPlane(o, u, v, a, y0, depth * 1.25), u, v, R(w * 1.25, 0, baseH), depth * 1.25, m);
  k.slab(onPlane(o, u, v, a, y0, depth * 1.3), u, v, R(w * 1.3, y1 - y0 - capH, y1 - y0 - capH * 0.4), depth * 1.3, cap);
  k.slab(onPlane(o, u, v, a, y0, depth * 1.45), u, v, R(w * 1.45, y1 - y0 - capH * 0.4, y1 - y0), depth * 1.45, cap);
}

/** An entablature along a path (a closed ring round a building, or a run on one face): architrave, frieze set back a little, cornice. */
export function entablature(k: Kit, path: V3[], m: Mat, o: { out?: number; h?: number; closed?: boolean; v?: V3 } = {}) {
  const out = o.out ?? 0.7, h = o.h ?? 1.6;
  const prof: V2[] = [[0, 0], [out * 0.3, 0], [out * 0.3, h * 0.25], [out * 0.2, h * 0.28], [out * 0.2, h * 0.6], [out * 0.45, h * 0.62], [out * 0.45, h * 0.7], [out * 0.95, h * 0.75], [out * 0.95, h * 0.92], [out, h * 0.96], [out, h], [0, h]];
  k.sweep(path, prof, m, { closed: o.closed, caps: !o.closed, v: o.v });
}

/**
 * A pediment on a wall's plane over `a`, its base at `y`: a tympanum standing `depth` proud with
 * a cornice along its base and its raking (or curved) edges.
 */
export function pediment(k: Kit, o: V3, u: V3, v: V3, a: number, y: number, w: number, h: number, depth: number, m: Mat, kind: 'triangular' | 'segmental' = 'triangular', cornice: Mat = m) {
  const n = planeNormal(u, v), hw = w / 2;
  let top: V2[];
  if (kind === 'triangular') top = [[-hw, 0], [0, h]];
  else {
    const R = (hw * hw + h * h) / (2 * h), cy = h - R, a0 = Math.asin(Math.min(1, hw / R));
    top = [];
    for (let i = 0; i <= 8; i++) { const t = -a0 + (2 * a0 * i) / 8; top.push([R * Math.sin(t), cy + R * Math.cos(t)]); }
  }
  const outline: V2[] = kind === 'triangular' ? [[-hw, 0], [hw, 0], [0, h]] : [[-hw, 0], [hw, 0], ...top.slice().reverse()];
  const O = onPlane(o, u, v, a, y);
  k.slab(onPlane(O, u, v, 0, 0, depth * 0.6), u, v, outline, depth * 0.6, m);
  const c = Math.min(0.5, h * 0.35);
  const rake: V2[] = kind === 'triangular' ? [[-hw - c * 0.3, -c * 0.1], [0, h], [hw + c * 0.3, -c * 0.1]] : top;
  k.sweep(rake.map(([x, yy]) => onPlane(O, u, v, x, yy, depth * 0.6)), PROFILE.ring(c, depth * 0.5), cornice, { v: n, caps: true });
  k.sweep([onPlane(O, u, v, -hw - c * 0.3, -c * 0.4, 0), onPlane(O, u, v, hw + c * 0.3, -c * 0.4, 0)], PROFILE.cornice(depth, c * 0.5), cornice, { caps: true });
}

// ---- Sculpture -----------------------------------------------------------------------------------

export type StatueKind = 'single' | 'pair' | 'trio' | 'cross' | 'column' | 'angel' | 'seated' | 'pyramid' | 'rock' | 'obelisk';
export type Pose = 'stand' | 'bless' | 'hold' | 'staff' | 'open';

/**
 * A robed figure `H` tall standing at (cx, y, cz) and facing the x–z direction `facing`: body,
 * head and arms as a dark silhouette. `pose` sets the arms: at the sides, one raised in blessing,
 * both forward holding something, beside a staff, or open.
 */
export function figure(k: Kit, cx: number, y: number, cz: number, H: number, facing: V2, m: Mat, seed: number, pose: Pose = 'stand', o: { halo?: Mat; child?: boolean } = {}) {
  const [fx, fz] = facing, sx = -fz, sz = fx;
  const r = (s: number) => hash(seed, s);
  const at = (side: number, fwd: number, up: number): V3 => [cx + sx * side + fx * fwd, y + up, cz + sz * side + fz * fwd];
  const lean = 0.02 * H * (r(1) - 0.5);
  k.lathe(cx + fx * lean, cz + fz * lean, [[0, y], [0.2 * H, y], [0.19 * H, y + 0.06 * H], [0.15 * H, y + 0.36 * H], [0.13 * H, y + 0.5 * H], [0.175 * H, y + 0.66 * H], [0.16 * H, y + 0.72 * H], [0.06 * H, y + 0.76 * H], [0, y + 0.78 * H]], 7, m, { flat: true, phase: r(2) * 51 });
  k.ball(cx + fx * 0.02 * H, y + 0.85 * H, cz + fz * 0.02 * H, 0.075 * H, m, 6);
  const aw = 0.055 * H;
  const shoulder = (side: number) => at(side * 0.15 * H, 0, 0.7 * H);
  if (pose === 'bless') {
    k.beam(shoulder(1), at(0.2 * H, 0.1 * H, 0.52 * H), aw, m);
    k.beam(at(0.2 * H, 0.1 * H, 0.52 * H), at(0.24 * H, 0.2 * H, 0.86 * H), aw * 0.9, m);
    k.beam(shoulder(-1), at(-0.18 * H, 0.08 * H, 0.45 * H), aw, m);
  } else if (pose === 'hold') {
    for (const s of [-1, 1]) { k.beam(shoulder(s), at(s * 0.16 * H, 0.14 * H, 0.5 * H), aw, m); k.beam(at(s * 0.16 * H, 0.14 * H, 0.5 * H), at(s * 0.04 * H, 0.22 * H, 0.56 * H), aw * 0.9, m); }
    if (o.child) { k.lathe(cx + fx * 0.2 * H, cz + fz * 0.2 * H, [[0, y + 0.5 * H], [0.07 * H, y + 0.5 * H], [0.05 * H, y + 0.7 * H], [0, y + 0.72 * H]], 6, m, { flat: true }); k.ball(cx + fx * 0.2 * H, y + 0.77 * H, cz + fz * 0.2 * H, 0.045 * H, m, 5); }
    else k.box(cx + fx * 0.2 * H, cz + fz * 0.2 * H, 0.12 * H, 0.12 * H, y + 0.5 * H, y + 0.6 * H, m, m);
  } else if (pose === 'staff') {
    k.beam(shoulder(1), at(0.22 * H, 0.1 * H, 0.5 * H), aw, m);
    k.beam(at(0.24 * H, 0.14 * H, 0.02 * H), at(0.24 * H, 0.14 * H, 1.05 * H), aw * 0.6, m);
    k.beam(shoulder(-1), at(-0.17 * H, 0.06 * H, 0.42 * H), aw, m);
  } else if (pose === 'open') {
    for (const s of [-1, 1]) { k.beam(shoulder(s), at(s * 0.3 * H, 0.12 * H, 0.55 * H), aw, m); k.beam(at(s * 0.3 * H, 0.12 * H, 0.55 * H), at(s * 0.34 * H, 0.2 * H, 0.75 * H), aw * 0.9, m); }
  } else {
    for (const s of [-1, 1]) k.beam(shoulder(s), at(s * 0.17 * H, 0.05 * H, 0.42 * H), aw, m);
  }
  if (o.halo) k.lathe(cx + fx * 0.02 * H, cz + fz * 0.02 * H, [[0.11 * H, y + 0.86 * H], [0.13 * H, y + 0.865 * H], [0.11 * H, y + 0.87 * H]], 12, o.halo);
}

/**
 * A statue group `h` tall (the main figure's height) on its spot, the figures facing `facing`:
 * a saint alone, a pair, a trio, a crucifix, a figure on a column, an angel, a seated figure, a
 * pyramid of figures on a rock, a rock with a cave and figures on it, or a figure before an obelisk.
 */
export function statue(k: Kit, o: V3, facing: V2, h: number, m: Mat, kind: StatueKind, seed: number, opt: { halo?: Mat; gilt?: Mat; pose?: Pose } = {}) {
  const [fx, fz] = facing, sx = -fz, sz = fx;
  const P = (side: number, fwd: number, up = 0): V3 => [o[0] + sx * side + fx * fwd, o[1] + up, o[2] + sz * side + fz * fwd];
  const fig = (side: number, fwd: number, H: number, pose: Pose, s: number, turn = 0, extra: { halo?: Mat; child?: boolean } = {}) => {
    const t = turn * DEG, f2: V2 = [fx * Math.cos(t) - fz * Math.sin(t), fx * Math.sin(t) + fz * Math.cos(t)];
    const p = P(side, fwd);
    figure(k, p[0], p[1], p[2], H, f2, m, seed * 7 + s, pose, extra);
  };
  const poses: Pose[] = ['stand', 'bless', 'hold', 'staff', 'open'];
  const pick = (s: number): Pose => opt.pose ?? poses[Math.floor(hash(seed, s) * poses.length)];
  switch (kind) {
    case 'single': fig(0, 0, h, pick(1), 1, 0, { halo: opt.halo }); break;
    case 'pair': fig(-0.26 * h, 0, h, pick(1), 1, 12); fig(0.3 * h, -0.05 * h, 0.9 * h, pick(2), 2, -12); break;
    case 'trio': fig(0, -0.05 * h, h, pick(1), 1); fig(-0.42 * h, 0.05 * h, 0.85 * h, pick(2), 2, 20); fig(0.42 * h, 0.05 * h, 0.85 * h, pick(3), 3, -20); break;
    case 'cross': {
      const c = P(0, -0.15 * h);
      k.beam([c[0], o[1], c[2]], [c[0], o[1] + 1.3 * h, c[2]], 0.09 * h, m, true);
      k.beam(P(-0.4 * h, -0.15 * h, 1.0 * h), P(0.4 * h, -0.15 * h, 1.0 * h), 0.08 * h, m, true);
      const b = P(0, -0.1 * h, 0.45 * h);
      k.lathe(b[0], b[2], [[0, b[1]], [0.1 * h, b[1]], [0.1 * h, b[1] + 0.32 * h], [0.06 * h, b[1] + 0.5 * h], [0, b[1] + 0.52 * h]], 6, m, { flat: true });
      k.ball(b[0], b[1] + 0.57 * h, b[2], 0.06 * h, m, 5);
      for (const s of [-1, 1]) k.beam(P(s * 0.08 * h, -0.1 * h, 0.94 * h), P(s * 0.36 * h, -0.13 * h, 1.0 * h), 0.045 * h, m);
      fig(-0.42 * h, 0.15 * h, 0.55 * h, 'open', 2, 30); fig(0.42 * h, 0.15 * h, 0.55 * h, 'hold', 3, -30);
      break;
    }
    case 'column': {
      const c = P(0, 0);
      k.lathe(c[0], c[2], [[0.22 * h, o[1]], [0.22 * h, o[1] + 0.06 * h], [0.11 * h, o[1] + 0.1 * h], [0.1 * h, o[1] + 0.95 * h], [0.14 * h, o[1] + 1.0 * h], [0.14 * h, o[1] + 1.04 * h]], 8, m, { flat: true });
      // The figure stands on the column, two putti at its foot.
      const top = P(0, 0, 1.04 * h);
      figure(k, top[0], top[1], top[2], 0.62 * h, facing, m, seed * 7 + 4, 'hold', { halo: opt.gilt ?? opt.halo, child: true });
      fig(-0.32 * h, 0.1 * h, 0.35 * h, 'open', 2, 25); fig(0.32 * h, 0.1 * h, 0.35 * h, 'bless', 3, -25);
      break;
    }
    case 'angel': {
      fig(0, 0, h, 'bless', 1, 0, { halo: opt.halo });
      for (const s of [-1, 1]) {
        const root = P(s * 0.1 * h, -0.12 * h, 0.62 * h), tip = P(s * 0.5 * h, -0.2 * h, 1.05 * h), low = P(s * 0.32 * h, -0.16 * h, 0.35 * h);
        k.poly([root, low, tip], m, { normal: [-fx, 0.2, -fz] });
        k.poly([root, tip, low], m, { normal: [fx, 0.2, fz] });
      }
      break;
    }
    case 'seated': {
      const c = P(0, 0), H = h;
      k.lathe(c[0], c[2], [[0, o[1]], [0.3 * H, o[1]], [0.29 * H, o[1] + 0.3 * H], [0.19 * H, o[1] + 0.5 * H], [0.21 * H, o[1] + 0.64 * H], [0.07 * H, o[1] + 0.69 * H], [0, o[1] + 0.71 * H]], 7, m, { flat: true, phase: hash(seed, 3) * 40 });
      k.ball(c[0] + fx * 0.03 * H, o[1] + 0.78 * H, c[2] + fz * 0.03 * H, 0.08 * H, m, 6);
      k.box(c[0] + fx * 0.22 * H, c[2] + fz * 0.22 * H, 0.34 * H, 0.2 * H, o[1] + 0.3 * H, o[1] + 0.42 * H, m, m);
      for (const s of [-1, 1]) k.beam(P(s * 0.17 * H, 0.02 * H, 0.62 * H), P(s * 0.12 * H, 0.26 * H, 0.42 * H), 0.05 * H, m);
      if (opt.halo) k.lathe(c[0], c[2], [[0.12 * H, o[1] + 0.79 * H], [0.14 * H, o[1] + 0.795 * H], [0.12 * H, o[1] + 0.8 * H]], 12, opt.halo);
      break;
    }
    case 'pyramid': {
      const c = P(0, 0), R = 0.45 * h;
      const prof: V2[] = [[R, o[1]], [R * 0.9, o[1] + 0.12 * h], [R * 0.7, o[1] + 0.24 * h], [R * 0.5, o[1] + 0.34 * h], [R * 0.25, o[1] + 0.4 * h], [0, o[1] + 0.42 * h]];
      k.lathe(c[0], c[2], prof, 7, m, { flat: true, phase: hash(seed, 5) * 60 });
      for (let i = 0; i < 3; i++) { const a = (i / 3) * 360 + 60; fig(Math.sin(a * DEG) * 0.36 * h, -Math.cos(a * DEG) * 0.36 * h, 0.55 * h, pick(10 + i), 10 + i, a > 180 ? a - 360 : a); }
      const top = P(0, 0, 0.4 * h);
      figure(k, top[0], top[1], top[2], 0.72 * h, facing, m, seed * 7 + 9, 'open', { halo: opt.halo });
      break;
    }
    case 'rock': {
      const c = P(0, -0.05 * h), R = 0.5 * h;
      k.lathe(c[0], c[2], [[R, o[1]], [R * 1.02, o[1] + 0.2 * h], [R * 0.86, o[1] + 0.42 * h], [R * 0.6, o[1] + 0.55 * h], [0, o[1] + 0.58 * h]], 9, m, { flat: true, phase: hash(seed, 6) * 40 });
      const door = P(0, 0.45 * h, 0.05 * h);
      k.plate(door, [sx, 0, sz], [0, 1, 0], [[-0.14 * h, 0], [0.14 * h, 0], [0.14 * h, 0.22 * h], [-0.14 * h, 0.22 * h]], { ...m, c: [22, 20, 18] as [number, number, number] }, 0.02);
      fig(0.42 * h, 0.3 * h, 0.5 * h, 'staff', 2, -30);
      const top = P(0, -0.05 * h, 0.55 * h);
      figure(k, top[0] - sx * 0.14 * h, top[1], top[2] - sz * 0.14 * h, 0.62 * h, facing, m, seed * 7 + 7, 'bless', { halo: opt.halo });
      figure(k, top[0] + sx * 0.16 * h, top[1], top[2] + sz * 0.16 * h, 0.58 * h, facing, m, seed * 7 + 8, 'hold');
      break;
    }
    case 'obelisk': {
      const c = P(0, -0.22 * h);
      k.lathe(c[0], c[2], [[0.2 * h, o[1]], [0.14 * h, o[1] + 1.1 * h], [0, o[1] + 1.4 * h]], 4, m, { flat: true, phase: 45 });
      fig(0, 0.05 * h, 0.85 * h, pick(1), 1, 0, { halo: opt.halo });
      break;
    }
  }
}

/**
 * A niche on a wall's plane at `a`, its floor at `y`: a dark back, a stone frame standing proud in
 * the fine kit, a console below, a canopy above with a spirelet, and a figure inside (drawn into
 * `fig`) if asked.
 */
export function niche(k: Kit, f: Kit, fig: Kit, o: V3, u: V3, v: V3, a: number, y: number, w: number, h: number, depth: number, stone: Mat, dark: Mat, opt: { figure?: StatueKind; figureM?: Mat; canopy?: boolean; seed?: number; halo?: Mat } = {}) {
  const n = planeNormal(u, v), O = onPlane(o, u, v, a, y), shape = arch(w, h, 'pointed', w * 0.6), hw = w / 2;
  k.plate(O, u, v, shape, dark, 0.02);
  f.sweep([[-hw, 0], ...shape.slice(2).reverse(), [hw, 0]].map(([x, yy]) => onPlane(O, u, v, x, yy)), PROFILE.ring(0.16, depth), stone, { v: n });
  // The console the figure stands on, and the canopy over it.
  f.slab(onPlane(O, u, v, 0, -0.35, depth * 1.4), u, v, [[-hw * 0.7, 0], [hw * 0.7, 0], [hw * 0.55, 0.35], [-hw * 0.55, 0.35]], depth * 1.4, stone);
  if (opt.canopy ?? true) {
    const cy = h + 0.15;
    f.slab(onPlane(O, u, v, 0, cy, depth * 1.6), u, v, [[-hw - 0.15, 0], [hw + 0.15, 0], [hw + 0.15, 0.25], [0, 0.25 + hw * 0.9], [-hw - 0.15, 0.25]], depth * 1.6, stone);
    const tip = onPlane(O, u, v, 0, cy + 0.25 + hw * 0.9, depth * 0.8);
    f.lathe(tip[0], tip[2], [[0.1, tip[1] - 0.1], [0.08, tip[1] + 0.3], [0, tip[1] + 0.9]], 4, stone, { flat: true, phase: 45 });
  }
  if (opt.figure) {
    const p = onPlane(O, u, v, 0, 0.02, depth * 0.5);
    statue(fig, p, [n[0], n[2]], h * 0.78, opt.figureM ?? stone, opt.figure, opt.seed ?? 1, { halo: opt.halo });
  }
}

/** A row of shields (coats of arms) on a wall's plane: `count` from `a` at `step`, bottoms at `y`, each a frame with its field in it. */
export function shields(f: Kit, o: V3, u: V3, v: V3, a: number, y: number, count: number, step: number, w: number, h: number, field: Mat, frame: Mat) {
  const shape = (s: number): V2[] => [[-w * s / 2, h * 0.35 * s + h * (1 - s) / 2], [-w * s / 2, h * s + h * (1 - s) / 2], [w * s / 2, h * s + h * (1 - s) / 2], [w * s / 2, h * 0.35 * s + h * (1 - s) / 2], [0, h * (1 - s) / 2]];
  for (let i = 0; i < count; i++) {
    const x = a + (i - (count - 1) / 2) * step, O = onPlane(o, u, v, x, y);
    f.plate(O, u, v, shape(1), frame, 0.07);
    f.plate(O, u, v, shape(0.78), field, 0.1, 0.9 + 0.2 * hash(i, 3));
  }
}

/** Ribs down a dome or onion: `count` meridian ridges standing `w` proud of the lathe profile `prof` ([radius, height]). */
export function ribs(k: Kit, cx: number, cz: number, prof: V2[], count: number, w: number, m: Mat, phase = 0) {
  for (let i = 0; i < count; i++) {
    const a = (phase + (360 * i) / count) * DEG, ca = Math.cos(a), sa = Math.sin(a);
    for (let j = 0; j + 1 < prof.length; j++) {
      const [r0, y0] = prof[j], [r1, y1] = prof[j + 1];
      if (r0 < 1e-3 && r1 < 1e-3) continue;
      const p: V3 = [cx + (r0 + w * 0.4) * ca, y0, cz + (r0 + w * 0.4) * sa], q: V3 = [cx + (r1 + w * 0.4) * ca, y1, cz + (r1 + w * 0.4) * sa];
      k.beam(p, q, w, m, j === 0 || j + 2 === prof.length);
    }
  }
}
