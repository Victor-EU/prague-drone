// Headless Chrome on the GPU, driven over the DevTools protocol, for the tools that run the app:
// the side-by-side (tools/compare.ts) and the motion and loading tests (tools/motion.ts).

import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const sleep = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

type Message = { id?: number; method?: string; params?: Record<string, unknown>; sessionId?: string; result?: Record<string, unknown>; error?: { message: string } };

export interface Page {
  /** A DevTools command on the page's session, or on another session (a worker's) when given. */
  send(method: string, params?: Record<string, unknown>, session?: string): Promise<Record<string, unknown>>;
  /** Evaluates an expression in the page, awaiting a promise, and returns its value. */
  evaluate<T = unknown>(expression: string): Promise<T>;
  /** Calls `fn` with each DevTools event, of the page's session and of any attached to it. */
  on(fn: (method: string, params: Record<string, unknown>, session?: string) => void): void;
  close(): Promise<void>;
}

/** Starts the Vite dev server unless one answers at `origin`; returns a function that stops it. */
export async function devServer(origin = 'http://localhost:5173'): Promise<() => Promise<void>> {
  if (await fetch(origin).then((r) => r.ok, () => false)) return async () => {};
  const { createServer } = await import('vite');
  const server = await createServer({ logLevel: 'error' });
  await server.listen();
  return () => server.close();
}

/**
 * A dev server of the tools' own on `port`, without hot reloading, so editing the source during a
 * long run (the route in real time) does not reload the page under it.
 */
export async function quietServer(port = 5174): Promise<{ origin: string; close: () => Promise<void> }> {
  const { createServer } = await import('vite');
  const server = await createServer({ logLevel: 'error', server: { port, strictPort: true, hmr: false, watch: null } });
  await server.listen();
  return { origin: `http://localhost:${port}`, close: () => server.close() };
}

/** Opens one page in a fresh headless Chrome with the GPU. */
export async function openPage(size = { width: 2048, height: 1536 }): Promise<Page> {
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'praha-chrome-'))}`,
    '--window-size=1800,1200', '--force-device-scale-factor=1', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist',
    '--hide-scrollbars', '--mute-audio', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  // Never leave a Chrome behind: an orphan keeps rendering the app and loads the GPU for every later
  // measurement. Exit on an interrupt so the handler runs then too.
  process.on('exit', () => chrome.kill('SIGKILL'));
  for (const sig of ['SIGINT', 'SIGTERM'] as const) process.once(sig, () => process.exit(130));
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
  const pending = new Map<number, (v: Message) => void>();
  const listeners: ((method: string, params: Record<string, unknown>, session?: string) => void)[] = [];
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(String(e.data)) as Message;
    if (msg.id !== undefined) {
      pending.get(msg.id)?.(msg);
      pending.delete(msg.id);
    } else if (msg.method) for (const l of listeners) l(msg.method, msg.params ?? {}, msg.sessionId);
  });
  const raw = async (method: string, params: Record<string, unknown> = {}, sessionId?: string) => {
    const id = ++seq;
    ws.send(JSON.stringify({ id, method, params, sessionId }));
    const msg = await new Promise<Message>((ok) => pending.set(id, ok));
    if (msg.error) throw new Error(`${method}: ${msg.error.message}`);
    return msg.result!;
  };

  const { targetId } = await raw('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await raw('Target.attachToTarget', { targetId, flatten: true }) as { sessionId: string };
  const send = (method: string, params: Record<string, unknown> = {}, session = sessionId) => raw(method, params, session);
  await send('Emulation.setDeviceMetricsOverride', { ...size, deviceScaleFactor: 1, mobile: false });
  return {
    send,
    async evaluate<T>(expression: string) {
      const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }) as {
        result: { value?: unknown }; exceptionDetails?: { exception?: { description?: string }; text: string };
      };
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      return r.result.value as T;
    },
    on(fn) { listeners.push(fn); },
    async close() {
      ws.close();
      chrome.kill('SIGKILL');
    },
  };
}

/** Waits until `expression` is true in the page, polling every half second. */
export async function waitFor(page: Page, expression: string, timeout = 90000, what = expression) {
  const t0 = Date.now();
  while (!(await page.evaluate<boolean>(`!!(${expression})`).catch(() => false))) {
    if (Date.now() - t0 > timeout) throw new Error(`timed out waiting for ${what}`);
    await sleep(500);
  }
}
