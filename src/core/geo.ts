// The local metric frame of design.md §6.1, shared by the build tools and the app.
// Origin at the centre of Charles Bridge; x east, y up, z south (north is −z), metres.

export const ORIGIN_LON = 14.4114;
export const ORIGIN_LAT = 50.0865;
export const M_PER_DEG_LON = 71500;
export const M_PER_DEG_LAT = 111200;

/** Height above sea level (Bpv) that maps to y = 0. See design.md §6.1. */
export const DATUM = 185;

/** The built world, in local metres. Tiles are TILE metres square. */
export const WORLD = { xMin: -5000, xMax: 5000, zMin: -4000, zMax: 5000 } as const;
export const TILE = 1000;

/** Horizon terrain reaches this far from the origin in each direction. */
export const HORIZON = 16000;

/** OSM query box from design.md §6.3: south, west, north, east. */
export const OSM_BBOX = [50.04, 14.34, 50.13, 14.49] as const;

export function lonToX(lon: number): number {
  return (lon - ORIGIN_LON) * M_PER_DEG_LON;
}
export function latToZ(lat: number): number {
  return -(lat - ORIGIN_LAT) * M_PER_DEG_LAT;
}
export function xToLon(x: number): number {
  return ORIGIN_LON + x / M_PER_DEG_LON;
}
export function zToLat(z: number): number {
  return ORIGIN_LAT - z / M_PER_DEG_LAT;
}
