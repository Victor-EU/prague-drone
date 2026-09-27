// The cumulus coverage map (design.md §8.6): periodic noise over a 24 km tile, red for coverage,
// green for how tall the clouds grow and blue for how wispy they are, with the coverage values
// sorted so a coverage fraction maps to a threshold. Runs in a worker on reseeding
// (weather.worker.ts); a quarter of a second of work.

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** Periodic 2D gradient noise on an `n`-cell lattice, sampled at (x, y) in cells. */
export function lattice(n: number, rand: () => number) {
  const gx = new Float32Array(n * n), gy = new Float32Array(n * n);
  for (let k = 0; k < n * n; k++) {
    const a = rand() * Math.PI * 2;
    gx[k] = Math.cos(a); gy[k] = Math.sin(a);
  }
  return (x: number, y: number) => {
    const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
    const g = (a: number, b: number, ox: number, oy: number) => {
      const k = (((j + b) % n + n) % n) * n + (((i + a) % n + n) % n);
      return gx[k] * (fx - ox) + gy[k] * (fy - oy);
    };
    const u = fx * fx * fx * (fx * (fx * 6 - 15) + 10), v = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
    const a = g(0, 0, 0, 0) + (g(1, 0, 1, 0) - g(0, 0, 0, 0)) * u;
    const b = g(0, 1, 0, 1) + (g(1, 1, 1, 1) - g(0, 1, 0, 1)) * u;
    return a + (b - a) * v;
  };
}

/**
 * Periodic Worley cells: 1 − distance to the nearest feature point, in cells; `own` afterwards
 * holds that feature point's own random value (0 to 1), one per cloud.
 */
export function cells(n: number, rand: () => number) {
  const px = new Float32Array(n * n), py = new Float32Array(n * n), ph = new Float32Array(n * n);
  for (let k = 0; k < n * n; k++) { px[k] = rand(); py[k] = rand(); ph[k] = rand(); }
  const f = (x: number, y: number) => {
    const i = Math.floor(x), j = Math.floor(y);
    let d = 9, best = 0;
    for (let b = -1; b <= 1; b++)
      for (let a = -1; a <= 1; a++) {
        const k = ((((j + b) % n) + n) % n) * n + ((((i + a) % n) + n) % n);
        const dx = i + a + px[k] - x, dy = j + b + py[k] - y;
        const dd = dx * dx + dy * dy;
        if (dd < d) { d = dd; best = k; }
      }
    f.own = ph[best];
    return 1 - Math.min(1, Math.sqrt(d));
  };
  f.own = 0;
  return f;
}

export const WEATHER = 512;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The field. Three families of cells, about 1.8 km, 800 m and 350 m across on the 24 km tile,
 * each standing on its own (the largest value wins, not their sum), so small clouds float between
 * and apart from the large ones as in 8372 and 9369; the one-size field of M1 to M16 gave rows of
 * equal lumps. The medium and small families are allowed only in patches of the tile, as
 * fair-weather cumulus come in fields, and their peaks are held below the large ones', so a
 * session's coverage is spent on the big clouds first and the small ones fill in as it rises.
 * A cloud's family also sets its depth (green: the small ones shallow and flat) and its
 * wispiness (blue: the small ones thin and ragged, the large ones solid).
 */
export function makeWeather(seed: number) {
  const rand = rng(seed * 7919 + 17);
  const big = cells(13, rand), mid = cells(29, rand), small = cells(68, rand);
  const octaves = [6, 12, 24, 48, 96].map((n) => lattice(n, rand));
  const tall = lattice(4, rand), tall2 = lattice(9, rand);
  const fieldM = lattice(5, rand), fieldS = lattice(8, rand), sizeB = lattice(6, rand);
  const cover = new Float32Array(WEATHER * WEATHER);
  const data = new Uint8Array(WEATHER * WEATHER * 4);
  for (let y = 0; y < WEATHER; y++)
    for (let x = 0; x < WEATHER; x++) {
      const u = x / WEATHER, v = y / WEATHER;
      let f = 0, amp = 0.5;
      for (let o = 0; o < octaves.length; o++) {
        const n = [6, 12, 24, 48, 96][o];
        f += amp * octaves[o](u * n, v * n);
        amp *= 0.5;
      }
      // The roughness every family shares: the fbm, about −0.5 to 0.5.
      const rough = 0.55 * (f + 0.5) - 0.1;
      const cb = big(u * 13, v * 13), cm = mid(u * 29, v * 29), hm = mid.own, cs = small(u * 68, v * 68), hs = small.own;
      // The large clouds, the field of M1 to M16, their peaks raised and lowered by a slow field so
      // that at one threshold some spread wide and others stay small.
      const B = (0.5 * cb + 0.2 * cm + rough) * (0.9 + 0.5 * sizeB(u * 6, v * 6));
      // Medium and small clouds, in their patches; each family's own cells shape them, the shared
      // roughness a little less, so their outlines stay whole at their size; and each cloud has a
      // peak of its own, so a field of them is not a lattice of equal dots.
      const pm = clamp01(0.45 + 1.6 * fieldM(u * 5, v * 5)), ps = clamp01(0.2 + 1.8 * fieldS(u * 8, v * 8));
      const M = (0.7 * cm + 0.08 * cs + 0.6 * rough) * (0.8 + 0.2 * pm) * (0.68 + 0.45 * hm) - 0.16 * (1 - pm);
      const S = (0.74 * cs + 0.55 * rough) * (0.8 + 0.2 * ps) * (0.6 + 0.6 * hs) - 0.18 * (1 - ps);
      let c = B, fam = 0;
      if (M > c) { c = M; fam = 1; }
      if (S > c) { c = S; fam = 2; }
      const k = y * WEATHER + x;
      cover[k] = clamp01(c);
      const t = (0.5 + 0.9 * tall(u * 4, v * 4) + 0.5 * tall2(u * 9, v * 9)) * [1, 0.55, 0.3][fam];
      data[k * 4] = Math.round(cover[k] * 255);
      data[k * 4 + 1] = Math.round(clamp01(t) * 255);
      data[k * 4 + 2] = Math.round([0, 0.55, 1][fam] * 255);
      data[k * 4 + 3] = 255;
    }
  const sorted = Float32Array.from(data.filter((_, i) => i % 4 === 0), (b) => b / 255).sort();
  return { data, sorted };
}
