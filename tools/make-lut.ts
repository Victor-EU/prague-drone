// Writes assets/lut/classic-neg.cube, the Classic Negative grade (design.md §5.1, §5.2). The grade
// is the parameters of tools/lib/grade.ts: the hand authoring there, refined against the hero
// frames by tools/lut-fit.ts into assets/lut/classic-neg.params.json, which is used when present.
//
//   node tools/make-lut.ts          the refined parameters (the hand ones if there are none)
//   node tools/make-lut.ts --hand   the hand authoring

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { HAND, grade, cube, type GradeParams } from './lib/grade.ts';

const PARAMS = 'assets/lut/classic-neg.params.json';
const refined = !process.argv.includes('--hand') && existsSync(PARAMS);
const P: GradeParams = refined ? JSON.parse(readFileSync(PARAMS, 'utf8')).params : HAND;

mkdirSync('assets/lut', { recursive: true });
writeFileSync('assets/lut/classic-neg.cube', cube(P, refined ? 'PRAHA Classic Negative v2' : 'PRAHA Classic Negative v1'));

// A few palette colours through the grade, for a sanity check.
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
const toHex = (c: number[]) => '#' + c.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
for (const h of ['#b5714f', '#c8352a', '#dc9d64', '#e0b040', '#54644e', '#8fc040', '#4f7396', '#c9d3d6', '#e8d6c4', '#202020', '#808080', '#5a3a78', '#302040'])
  console.log(h, '→', toHex(grade(P, ...hex(h))));
console.log(`wrote assets/lut/classic-neg.cube (32³, ${refined ? 'refined' : 'hand'} parameters)`);
