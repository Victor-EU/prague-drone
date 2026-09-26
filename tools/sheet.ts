// The final side-by-side sheet (design.md §12.1, §13 M8): every hero frame's photograph beside its
// render, on one page, with the three questions to answer for each pair (same silhouette, same
// colours, same light mood) and the colour statistics of tools/lut-fit.ts. Reads the images that
// `node tools/compare.ts --fit` leaves in compare/fit/; writes compare/sheet/, which stays local
// with the photographs (git-ignored, design.md §1).
//
//   node tools/sheet.ts

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { decodePng, encodePng } from './lib/png.ts';

const W = 720; // each image's width in the sheet
const hero = JSON.parse(readFileSync('data/hero.json', 'utf8')).frames as { id: string; viewpoint: string; tests: string }[];
const views = JSON.parse(readFileSync('data/viewpoints.json', 'utf8')).frames as { id: string; clock: string; focal35: number; weather: { overcast: boolean } }[];
const report = existsSync('assets/lut/classic-neg.params.json') ? JSON.parse(readFileSync('assets/lut/classic-neg.params.json', 'utf8')).report ?? {} : {};
mkdirSync('compare/sheet', { recursive: true });

/** Box-filtered down to `w` wide. */
function shrink(file: string, w: number) {
  const im = decodePng(readFileSync(file));
  const s = im.width / w, h = Math.round(im.height / s), out = new Uint8Array(w * h * 3);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const x0 = Math.floor(x * s), x1 = Math.max(x0 + 1, Math.floor((x + 1) * s)), y0 = Math.floor(y * s), y1 = Math.max(y0 + 1, Math.floor((y + 1) * s));
      for (let k = 0; k < 3; k++) {
        let sum = 0;
        for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) sum += im.rgb[(yy * im.width + xx) * 3 + k];
        out[(y * w + x) * 3 + k] = Math.round(sum / ((x1 - x0) * (y1 - y0)));
      }
    }
  return { w, h, rgb: out };
}

const rows: string[] = [];
for (const f of hero) {
  const photo = `compare/fit/${f.id}-photo.png`, render = `compare/fit/${f.id}-render.png`;
  if (!existsSync(photo) || !existsSync(render)) { console.log(`${f.id}: no capture, skipped`); continue; }
  // Portrait frames at half the width, so every pair is about as tall.
  const v = views.find((x) => x.id === f.id)!;
  const w = v && (v as unknown as { aspect: number }).aspect < 1 ? Math.round(W * 0.6) : W;
  const a = shrink(photo, w), b = shrink(render, w), gap = 8, out = new Uint8Array((w * 2 + gap) * a.h * 3).fill(255);
  for (let y = 0; y < a.h; y++) {
    out.set(a.rgb.subarray(y * w * 3, (y + 1) * w * 3), y * (w * 2 + gap) * 3);
    out.set(b.rgb.subarray(y * w * 3, (y + 1) * w * 3), (y * (w * 2 + gap) + w + gap) * 3);
  }
  writeFileSync(`compare/sheet/${f.id}.png`, encodePng(w * 2 + gap, a.h, out));
  const r = report[f.id];
  rows.push(`<section data-id="${f.id}">
  <h2>${f.id} <span>${f.viewpoint}</span></h2>
  <p class="meta">${v.clock}, ${v.focal35} mm${v.weather.overcast ? ', overcast' : ''} · tests: ${f.tests}${r ? ` · cluster ΔE ${r.clusterDE}` : ''}</p>
  <img src="${f.id}.png" alt="${f.id}: photograph left, render right" loading="lazy">
  <div class="q">${['silhouette', 'colours', 'light'].map((q) => `<button data-q="${q}">${q === 'light' ? 'light mood' : q}</button>`).join('')}<input placeholder="note"></div>
</section>`);
  console.log(`${f.id}: compare/sheet/${f.id}.png`);
}

writeFileSync('compare/sheet/index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Hero Sheet</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root { --bg: #f4f2ee; --fg: #1d1c1a; --mute: #6b6760; --line: #d8d4cc; --pass: #2f6f4f; --fail: #a4402c; }
@media (prefers-color-scheme: dark) { :root { --bg: #151514; --fg: #e8e5df; --mute: #9a958c; --line: #33312d; --pass: #6fbf8f; --fail: #e0806a; } }
body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.45 -apple-system, "Helvetica Neue", sans-serif; }
header { padding: 24px 16px 8px; max-width: 1480px; margin: auto; }
h1 { font-size: 22px; margin: 0 0 6px; } header p { color: var(--mute); margin: 0 0 8px; }
#tally { font-weight: 600; } button#copy { margin-left: 8px; }
main { max-width: 1480px; margin: auto; padding: 0 16px 40px; }
section { border-top: 1px solid var(--line); padding: 18px 0; }
h2 { font-size: 17px; margin: 0; } h2 span { color: var(--mute); font-weight: 400; }
.meta { color: var(--mute); margin: 2px 0 10px; font-size: 13px; }
img { max-width: 100%; height: auto; display: block; }
.q { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.q button { font: inherit; padding: 5px 12px; border-radius: 6px; border: 1px solid var(--line); background: transparent; color: var(--fg); cursor: pointer; }
.q button.pass { border-color: var(--pass); color: var(--pass); } .q button.pass::after { content: " ✓"; }
.q button.fail { border-color: var(--fail); color: var(--fail); } .q button.fail::after { content: " ✗"; }
.q input { flex: 1; min-width: 160px; font: inherit; padding: 5px 8px; border-radius: 6px; border: 1px solid var(--line); background: transparent; color: var(--fg); }
</style></head><body>
<header><h1>PRAHA: the hero frames side by side</h1>
<p>Photograph left, render right. For each pair: same silhouette, same colours, same light mood (design.md §12.1). Click once for pass, twice for fail, a third time to clear. Kept in this browser only.</p>
<p><span id="tally"></span><button id="copy">Copy verdicts</button></p></header>
<main>
${rows.join('\n')}
</main>
<script>
const KEY = 'praha-hero-verdicts';
let state = {};
try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} tally(); };
function tally() {
  let pass = 0, fail = 0, open = 0;
  document.querySelectorAll('section').forEach((s) => s.querySelectorAll('button').forEach((b) => {
    const v = state[s.dataset.id]?.[b.dataset.q];
    v === 'pass' ? pass++ : v === 'fail' ? fail++ : open++;
  }));
  document.getElementById('tally').textContent = pass + ' pass, ' + fail + ' fail, ' + open + ' to judge';
}
document.querySelectorAll('section').forEach((s) => {
  const id = s.dataset.id, st = (state[id] ??= {});
  s.querySelectorAll('button').forEach((b) => {
    const show = () => { b.className = st[b.dataset.q] || ''; };
    show();
    b.onclick = () => { st[b.dataset.q] = st[b.dataset.q] === 'pass' ? 'fail' : st[b.dataset.q] === 'fail' ? '' : 'pass'; show(); save(); };
  });
  const note = s.querySelector('input');
  note.value = st.note || '';
  note.oninput = () => { st.note = note.value; save(); };
});
document.getElementById('copy').onclick = () => {
  const lines = [...document.querySelectorAll('section')].map((s) => {
    const st = state[s.dataset.id] || {};
    return s.dataset.id + ': ' + ['silhouette', 'colours', 'light'].map((q) => q + ' ' + (st[q] || '?')).join(', ') + (st.note ? ' (' + st.note + ')' : '');
  });
  navigator.clipboard.writeText(lines.join('\\n'));
};
tally();
</script></body></html>
`);
console.log('wrote compare/sheet/index.html');
