// The kinds of tree (design.md §8.4) and the record trees.bin stores for each, shared by the world
// build (tools/lib/trees.ts) and the app (src/world/trees.ts).

export const Kind = {
  /** Broad round crowns: lime, chestnut, plane, maple. The default. */
  Broad: 0,
  /** Small fruit trees on grass: the Petřín orchards, the Seminary and Strahov gardens. */
  Fruit: 1,
  /** Tall narrow poplars: the islands and the river banks. */
  Poplar: 2,
  /** Spruce and pine: dark accents on Petřín, Strahov and in the cemeteries. */
  Conifer: 3,
  /** Rose bushes in the beds of the Petřín rose garden and the city's flower beds, in bloom. */
  Rose: 4,
} as const;
export type TreeKind = (typeof Kind)[keyof typeof Kind];

/**
 * trees.bin, per 1 km world tile (row by row, `start` indexing into the per-tree arrays):
 *   xz    uint16 pairs, position in the tile in 1/65.535 m
 *   hr    uint8 pairs, height to the crown's top in 0.2 m, crown radius in 0.1 m
 *   ks    uint8 pairs, kind, and a seed for its shape and tint
 * The tree stands on the terrain (terrain.bin) at its position.
 */
export const TREE_XZ = 65.535;
export const TREE_H = 0.2;
export const TREE_R = 0.1;
