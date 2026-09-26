import { defineConfig, type Plugin } from 'vite';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Development only: lets the page save renders and side-by-side sheets into compare/ (design.md
// §12.1). Serve-time middleware; nothing of it reaches the build.
function compareSink(): Plugin {
  return {
    name: 'praha-compare-sink',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__compare', (req, res) => {
        const name = new URL(req.url ?? '', 'http://x').searchParams.get('name') ?? '';
        if (req.method !== 'POST' || !/^(fit\/)?[\w.-]+\.(png|json)$/.test(name)) { res.statusCode = 400; res.end(); return; }
        const chunks: Buffer[] = [];
        req.on('data', (c: Buffer) => chunks.push(c));
        req.on('end', () => {
          mkdirSync(join('compare', name.startsWith('fit/') ? 'fit' : ''), { recursive: true });
          writeFileSync(join('compare', name), Buffer.concat(chunks));
          res.end('ok');
        });
      });
    },
  };
}

// The app is static. public/world/ holds the prebuilt tiles; nothing from Photos/ or mockup/ is
// referenced by the app, so no photograph can reach the build (design.md §1, non-goals). The
// development-only viewpoint mode reads a photograph for the side-by-side; it is behind
// import.meta.env.DEV and removed from the build.
export default defineConfig({
  server: { port: 5173, strictPort: true },
  build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
  worker: { format: 'es' },
  plugins: [compareSink()],
});
