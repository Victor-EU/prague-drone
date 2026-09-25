// Lists OSM candidates near each landmark of data/landmarks.json, to choose the `osm` ids by hand.
//
//   node tools/find-landmarks.ts [landmark-id …]

import { readFileSync } from 'node:fs';
import { loadLayer, features, pointInPolygon, signedArea, layerExists, type Feature } from './lib/osm.ts';

const { landmarks } = JSON.parse(readFileSync('data/landmarks.json', 'utf8'));
const only = process.argv.slice(2);

const pool: Feature[] = [];
for (const layer of ['buildings', 'bridges'])
  if (layerExists(layer)) pool.push(...features(loadLayer(layer), (t) => !!(t.building || t['building:part'] || t.man_made)));

function centre(f: Feature): [number, number, number] {
  let sx = 0, sz = 0, sa = 0;
  for (const p of f.polygons) {
    const a = Math.abs(signedArea(p.outer));
    let cx = 0, cz = 0;
    const r = p.outer;
    for (let k = 0; k < r.length; k += 2) { cx += r[k]; cz += r[k + 1]; }
    cx /= r.length / 2; cz /= r.length / 2;
    sx += cx * a; sz += cz * a; sa += a;
  }
  return [sx / sa, sz / sa, sa];
}

for (const l of landmarks) {
  if (only.length && !only.includes(l.id)) continue;
  if (l.kind === 'place' || l.kind === 'island') continue;
  const x = l.x, z = -l.north;
  const rows = pool
    .map((f) => {
      const [cx, cz, area] = centre(f);
      const inside = f.polygons.some((p) => pointInPolygon(x, z, p));
      return { f, d: Math.hypot(cx - x, cz - z), inside, area };
    })
    .filter((r) => r.inside || r.d < (l.kind === 'bridge' ? 250 : 90))
    .filter((r) => l.kind !== 'bridge' || r.f.tags.man_made === 'bridge')
    .sort((a, b) => Number(b.inside) - Number(a.inside) || a.d - b.d)
    .slice(0, 8);
  console.log(`\n${l.id} (${l.cz})`);
  for (const r of rows) {
    const t = r.f.tags;
    console.log(
      `  ${r.inside ? 'IN ' : '   '}${r.f.key.padEnd(20)} d ${r.d.toFixed(0).padStart(4)}  area ${r.area.toFixed(0).padStart(6)}  ` +
      `${t.building ? 'building=' + t.building : t['building:part'] ? 'part=' + t['building:part'] : 'man_made=' + t.man_made}` +
      `${t.height ? ' h=' + t.height : ''}${t['building:levels'] ? ' lv=' + t['building:levels'] : ''}${t.min_height ? ' min=' + t.min_height : ''}  ${t.name ?? ''}`,
    );
  }
}
