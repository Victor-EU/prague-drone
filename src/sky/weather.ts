// The cumulus coverage map (design.md §8.6): periodic noise over a 24 km tile, red for coverage and
// green for how tall the clouds grow, with the coverage values sorted so a coverage fraction maps
// to a threshold. Runs in a worker on reseeding (weather.worker.ts); a quarter of a second of work.

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

/** Periodic Worley cells: 1 − distance to the nearest feature point, in cells. */
export function cells(n: number, rand: () => number) {
  const px = new Float32Array(n * n), py = new Float32Array(n * n);
  for (let k = 0; k < n * n; k++) { px[k] = rand(); py[k] = rand(); }
  return (x: number, y: number) => {
    const i = Math.floor(x), j = Math.floor(y);
    let d = 9;
    for (let b = -1; b <= 1; b++)
      for (let a = -1; a <= 1; a++) {
        const k = ((((j + b) % n) + n) % n) * n + ((((i + a) % n) + n) % n);
        const dx = i + a + px[k] - x, dy = j + b + py[k] - y;
        d = Math.min(d, dx * dx + dy * dy);
      }
    return 1 - Math.min(1, Math.sqrt(d));
  };
}

export const WEATHER = 512;

export function makeWeather(seed: number) {
  const rand = rng(seed * 7919 + 17);
  const blobs = cells(13, rand), blobs2 = cells(29, rand);
  const octaves = [6, 12, 24, 48, 96].map((n) => lattice(n, rand));
  const tall = lattice(4, rand), tall2 = lattice(9, rand);
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
      const c = 0.5 * blobs(u * 13, v * 13) + 0.2 * blobs2(u * 29, v * 29) + 0.55 * (f + 0.5) - 0.1;
      const k = y * WEATHER + x;
      cover[k] = Math.min(1, Math.max(0, c));
      const t = 0.5 + 0.9 * tall(u * 4, v * 4) + 0.5 * tall2(u * 9, v * 9);
      data[k * 4] = Math.round(cover[k] * 255);
      data[k * 4 + 1] = Math.round(Math.min(1, Math.max(0, t)) * 255);
      data[k * 4 + 3] = 255;
    }
  const sorted = Float32Array.from(data.filter((_, i) => i % 4 === 0), (b) => b / 255).sort();
  return { data, sorted };
}
