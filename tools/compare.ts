// The side-by-side of design.md §12.1, in batch: for each viewpoint in data/viewpoints.json (or the
// ids given on the command line), open the app at that viewpoint in headless Chrome, let the tiles
// load and the temporal history settle, and have the page write compare/<id>.png: the photograph
// on the left, the render on the right, a 50% blend below. Starts the dev server when none runs.
//
//   node tools/compare.ts            all viewpoints
//   node tools/compare.ts 8372 9369  some
//   node tools/compare.ts 8385@heading=40,tilt=-9   a viewpoint nudged, written to compare/8385-heading_40-tilt_-9.png
//   node tools/compare.ts look@x=-1100,north=-300,heading=250   a free camera, the render alone
//
// The photographs are read by the page from Photos/ (or mockup/set/) through the dev server; this
// is build-side only and nothing of it ships (design.md §1).

import { spawn } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ORIGIN = 'http://localhost:5173';
const sleep = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

const all = (JSON.parse(readFileSync('data/viewpoints.json', 'utf8')).frames as { id: string }[]).map((f) => f.id);
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all;
for (const arg of ids) if (arg.split('@')[0] !== 'look' && !all.includes(arg.split('@')[0])) throw new Error(`no viewpoint ${arg} in data/viewpoints.json`);

// The dev server: reuse a running one, else start one for the duration.
let close = async () => {};
if (!(await fetch(ORIGIN).then((r) => r.ok, () => false))) {
  const { createServer } = await import('vite');
  const server = await createServer({ logLevel: 'error' });
  await server.listen();
  close = () => server.close();
}

// Headless Chrome with the GPU, driven over the DevTools protocol.
const chrome = spawn(CHROME, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'praha-compare-'))}`,
  '--window-size=1800,1200', '--force-device-scale-factor=1', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist',
  '--hide-scrollbars', '--mute-audio', 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
const endpoint = await new Promise<string>((ok, fail) => {
  let err = '';
  chrome.stderr!.on('data', (d: Buffer) => {
    err += d;
    const m = err.match(/DevTools listening on (ws:\S+)/);
    if (m) ok(m[1]);
  });
  chrome.on('exit', () => fail(new Error(`Chrome exited: ${err}`)));
});

const ws = new WebSocket(endpoint);
await new Promise((ok) => ws.addEventListener('open', ok, { once: true }));
let seq = 0;
const pending = new Map<number, (v: { result?: Record<string, unknown>; error?: { message: string } }) => void>();
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(String(e.data));
  pending.get(msg.id)?.(msg);
  pending.delete(msg.id);
});
async function send(method: string, params: Record<string, unknown> = {}, sessionId?: string) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params, sessionId }));
  const msg = await new Promise<{ result?: Record<string, unknown>; error?: { message: string } }>((ok) => pending.set(id, ok));
  if (msg.error) throw new Error(`${method}: ${msg.error.message}`);
  return msg.result!;
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }) as { sessionId: string };
const evaluate = async (expression: string) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId) as {
    result: { value?: unknown }; exceptionDetails?: { exception?: { description?: string }; text: string };
  };
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
};

try {
  for (const arg of ids) {
    const [id, nudge = ''] = arg.split('@');
    const query = nudge ? '&' + nudge.split(',').join('&') : '';
    const suffix = nudge ? '-' + nudge.replace(/=/g, '_').replace(/,/g, '-').replace(/[^\w.-]/g, '') : '';
    await send('Page.navigate', { url: `${ORIGIN}/?view=${id}${query}` }, sessionId);
    const t0 = Date.now();
    // Wait for the world and every tile, then for the exposure and history to settle.
    while (!(await evaluate('!!(window.praha && praha.world.buildings.loaded === praha.world.buildings.total)').catch(() => false))) {
      if (Date.now() - t0 > 90000) throw new Error(`${id}: timed out loading`);
      await sleep(500);
    }
    await sleep(4000);
    const gpu = await evaluate(`(() => { const g = praha.renderer.getContext(), d = g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?'; })()`);
    // A free look (id "look") has no photograph: the render alone.
    const file = await evaluate(id === 'look' ? `praha.capture(${JSON.stringify(`look${suffix}.png`)})` : `praha.sheet(0, ${JSON.stringify(suffix)})`);
    console.log(`${id}: ${file}  (${((Date.now() - t0) / 1000).toFixed(0)} s, ${gpu})`);
  }
} finally {
  ws.close();
  chrome.kill('SIGKILL');
  await close();
  // Chrome's pipes can keep the event loop alive after it is gone.
  process.exit(process.exitCode ?? 0);
}
