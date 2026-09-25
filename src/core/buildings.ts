// Shared by tools/build-world.ts (which decides) and the app (which draws): the kinds of roof
// face, the facade styles of design.md §8.2, and the flags carried per building and per edge.

/** Roof faces as shipped in the tiles. */
export const Face = { Slope: 1, Flat: 2, Gable: 3 } as const;

/** What a piece of surface is, for the building shader (the `aKind` attribute). */
export const Surface = { Wall: 0, Roof: 1, FlatRoof: 2, Gable: 3, Chimney: 4, DormerFront: 5, DormerRoof: 6, Plain: 7 } as const;

/** Small things on roofs, placed at build time and made into boxes by the app. */
export const Prop = { Chimney: 0, DormerGabled: 1, DormerFlat: 2, RoofBox: 3 } as const;

/** Per building. */
export const BFlag = { Landmark: 1, Detail: 2 } as const;
/** Per footprint edge: a party wall, shared with a neighbour (no windows, no cornice). */
export const EFlag = { Party: 1 } as const;

/**
 * Facade styles (design.md §8.2). Metres: the window pitch along the wall, window width and
 * height, sill above the storey's floor, storey height, and the ground floor's kind (0 plain with
 * a door, 1 shopfronts, 2 arcade-dark).
 */
export interface FacadeStyle { name: string; cell: number; winW: number; winH: number; sill: number; storey: number; ground: number }
export const STYLES: FacadeStyle[] = [
  { name: 'blank', cell: 0, winW: 0, winH: 0, sill: 0, storey: 3.5, ground: 0 },
  // Malá Strana, Hradčany: small windows, 2 to 3 storeys (design.md §8.2).
  { name: 'baroque', cell: 2.7, winW: 1.0, winH: 1.55, sill: 1.0, storey: 3.4, ground: 0 },
  // Old Town: 3 to 4 storeys, shops below.
  { name: 'old-town', cell: 2.9, winW: 1.1, winH: 1.75, sill: 0.95, storey: 3.6, ground: 1 },
  // New Town embankments and the 19th-century blocks: 5 to 6 storeys, tall windows.
  { name: 'block', cell: 3.1, winW: 1.2, winH: 2.05, sill: 0.9, storey: 3.6, ground: 1 },
  // Post-war: lower storeys, wide windows.
  { name: 'modern', cell: 2.6, winW: 1.9, winH: 1.45, sill: 0.9, storey: 3.0, ground: 1 },
  // Houses and villas.
  { name: 'house', cell: 3.2, winW: 1.2, winH: 1.4, sill: 0.9, storey: 3.0, ground: 0 },
];
export const Style = { Blank: 0, Baroque: 1, OldTown: 2, Block: 3, Modern: 4, House: 5 } as const;
