import { defineConfig } from 'vite';

// The app is static. public/world/ holds the prebuilt tiles; nothing from Photos/ or mockup/ is
// referenced, so no photograph can reach the build (design.md §1, non-goals).
export default defineConfig({
  server: { port: 5173, strictPort: true },
  build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
  worker: { format: 'es' },
});
