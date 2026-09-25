// Ground classes painted into the land-use raster by tools/build-world.ts. The app turns them into
// the terrain's base colour. Colours are sRGB material bases before the grade (design.md §8.9).

export const Ground = {
  Urban: 0,
  Water: 1,
  Grass: 2,
  Wood: 3,
  Park: 4,
  Garden: 5,
  Orchard: 6,
  Cemetery: 7,
  Pitch: 8,
  Residential: 9,
  Industrial: 10,
  Road: 11,
  Cobbles: 12,
  Path: 13,
  Square: 14,
  Rail: 15,
  Meadow: 16,
  Scrub: 17,
  Rock: 18,
  Parking: 19,
  Vineyard: 20,
  Sand: 21,
  Construction: 22,
  Clay: 23,
  Farmland: 24,
  Flowerbed: 25,
} as const;
export type GroundClass = (typeof Ground)[keyof typeof Ground];

/** The land-use grid keeps the class in the low six bits and, above them, whether a tree crown stands over the cell. */
export const CANOPY_SHIFT = 6;
export const CANOPY_MASK = 63;
/** The ground in the crowns' shade: leaf litter and dark grass. */
export const CANOPY_FLOOR = '#353b2a';

export const GROUND_COLOURS: Record<number, string> = {
  [Ground.Urban]: '#6c665e',
  [Ground.Water]: '#3a4a52',
  [Ground.Grass]: '#455a34',
  [Ground.Wood]: '#3a4330',
  [Ground.Park]: '#425632',
  [Ground.Garden]: '#3f5030',
  [Ground.Orchard]: '#4d5a31',
  [Ground.Cemetery]: '#4b5a37',
  [Ground.Pitch]: '#445a35',
  [Ground.Residential]: '#6f695f',
  [Ground.Industrial]: '#716b62',
  [Ground.Road]: '#4f4d4b',
  [Ground.Cobbles]: '#5b5752',
  [Ground.Path]: '#8f877a',
  [Ground.Square]: '#6e685e',
  [Ground.Rail]: '#4c4540',
  [Ground.Meadow]: '#505e32',
  [Ground.Scrub]: '#4c5a35',
  [Ground.Rock]: '#8a8074',
  [Ground.Parking]: '#595755',
  [Ground.Vineyard]: '#5c6a3c',
  [Ground.Sand]: '#c2b28f',
  [Ground.Construction]: '#9a8d78',
  [Ground.Clay]: '#b0654a',
  [Ground.Farmland]: '#a0a06a',
  // Roses and their leaves, as a bed reads from a distance; the terrain shader scatters the blooms
  // over it (src/world/terrain.ts).
  [Ground.Flowerbed]: '#5e4a3e',
};
