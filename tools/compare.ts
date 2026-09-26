// The side-by-side of design.md §12.1, in batch: for each viewpoint in data/viewpoints.json (or the
// ids given on the command line), open the app at that viewpoint in headless Chrome, let the tiles
// load and the temporal history settle, and have the page write compare/<id>.png: the photograph
// on the left, the render on the right, a 50% blend below. Starts the dev server when none runs.
//
//   node tools/compare.ts            all viewpoints
//   node tools/compare.ts 8372 9369  some
//   node tools/compare.ts 8385@heading=40,tilt=-9   a viewpoint nudged, written to compare/8385-heading_40-tilt_-9.png
//   node tools/compare.ts look@x=-1100,north=-300,heading=250   a free camera, the render alone
//   node tools/compare.ts --fit [ids]   also the images tools/lut-fit.ts reads, in compare/fit/
//
// The photographs are read by the page from Photos/ (or mockup/set/) through the dev server; this
// is build-side only and nothing of it ships (design.md §1).

import { readFileSync } from 'node:fs';
import { devServer, openPage, sleep, waitFor } from './lib/chrome.ts';

const ORIGIN = 'http://localhost:5173';

const all = (JSON.parse(readFileSync('data/viewpoints.json', 'utf8')).frames as { id: string }[]).map((f) => f.id);
const args = process.argv.slice(2);
const fit = args.includes('--fit');
const ids = args.filter((a) => a !== '--fit').length ? args.filter((a) => a !== '--fit') : all;
for (const arg of ids) if (arg.split('@')[0] !== 'look' && !all.includes(arg.split('@')[0])) throw new Error(`no viewpoint ${arg} in data/viewpoints.json`);

const close = await devServer(ORIGIN);
const page = await openPage({ width: 1800, height: 1200 });

try {
  for (const arg of ids) {
    const [id, nudge = ''] = arg.split('@');
    const query = nudge ? '&' + nudge.split(',').join('&') : '';
    const suffix = nudge ? '-' + nudge.replace(/=/g, '_').replace(/,/g, '-').replace(/[^\w.-]/g, '') : '';
    await page.send('Page.navigate', { url: `${ORIGIN}/?view=${id}${query}` });
    const t0 = Date.now();
    // Wait for the world and every tile, then for the exposure and history to settle.
    await waitFor(page, 'window.praha && praha.world.complete', 90000, `${id} to load`);
    await sleep(4000);
    const gpu = await page.evaluate(`(() => { const g = praha.renderer.getContext(), d = g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?'; })()`);
    // A free look (id "look") has no photograph: the render alone.
    const file = await page.evaluate(id === 'look' ? `praha.capture(${JSON.stringify(`look${suffix}.png`)})` : `praha.sheet(0, ${JSON.stringify(suffix)})`);
    if (fit && id !== 'look') await page.evaluate('praha.fitCapture()');
    console.log(`${id}: ${file}  (${((Date.now() - t0) / 1000).toFixed(0)} s, ${gpu})`);
  }
} finally {
  await page.close();
  await close();
  // Chrome's pipes can keep the event loop alive after it is gone.
  process.exit(process.exitCode ?? 0);
}
