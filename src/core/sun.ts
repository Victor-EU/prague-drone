// Solar position for Prague on 31 May, CEST (design.md §5.4). NOAA general solar position
// equations; accurate to a fraction of a degree, which is all a sky needs.

const LAT = 50.087;
const LON = 14.42;
const DAY_OF_YEAR = 151; // 31 May 2026
const UTC_OFFSET = 2; // CEST

const RAD = Math.PI / 180;

export interface SunPosition {
  /** Degrees above the horizon, without refraction. */
  elevation: number;
  /** Degrees clockwise from north. */
  azimuth: number;
}

/** `clock` is local time in hours, 0 to 24 (e.g. 6.333 for 06:20). */
export function sunPosition(clock: number): SunPosition {
  const utc = clock - UTC_OFFSET;
  const g = ((2 * Math.PI) / 365) * (DAY_OF_YEAR - 1 + (utc - 12) / 24);
  const eqTime =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g);
  const trueSolarMinutes = utc * 60 + eqTime + 4 * LON;
  const hourAngle = (trueSolarMinutes / 4 - 180) * RAD;
  const lat = LAT * RAD;
  const cosZenith = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(hourAngle);
  const zenith = Math.acos(Math.min(1, Math.max(-1, cosZenith)));
  const elevation = 90 - zenith / RAD;
  // Azimuth from north, clockwise.
  const az = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat),
  );
  const azimuth = (az / RAD + 180 + 360) % 360;
  return { elevation, azimuth };
}

/** Unit vector toward the sun in the §6.1 frame (x east, y up, z south). */
export function sunDirection(clock: number, out: { x: number; y: number; z: number }) {
  const { elevation, azimuth } = sunPosition(clock);
  const e = elevation * RAD, a = azimuth * RAD;
  out.x = Math.cos(e) * Math.sin(a);
  out.y = Math.sin(e);
  out.z = -Math.cos(e) * Math.cos(a);
  return out;
}

export function formatClock(clock: number): string {
  const m = Math.round(clock * 60);
  const h = Math.floor(m / 60) % 24, mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function parseClock(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return h + m / 60;
}
