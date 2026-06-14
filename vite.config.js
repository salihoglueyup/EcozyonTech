import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handle } from './api/_lib/forms.js'
import { handleVitals } from './api/_lib/vitals.js'
import { handleEvent } from './api/_lib/analytics.js'

// Shared /api middleware: runs the exact serverless logic locally so forms +
// vitals work without the Vercel CLI. Mounted on both the dev server and the
// preview server (the latter is what e2e tests run against).
function apiMiddleware(req, res, next) {
  const route = req.url?.split('?')[0]
  const KINDS = { '/api/contact': 'contact', '/api/newsletter': 'newsletter', '/api/apply': 'apply' }
  const kind = KINDS[route]
  const isVitals = route === '/api/vitals'
  const isAnalytics = route === '/api/analytics'
  if (!kind && !isVitals && !isAnalytics) return next()
  let raw = ''
  req.on('data', (c) => (raw += c))
  req.on('end', async () => {
    let body = {}
    try { body = raw ? JSON.parse(raw) : {} } catch { body = {} }
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || ''
    const { status, body: out } = isVitals
      ? await handleVitals(req.method, body, process.env)
      : isAnalytics
        ? await handleEvent(req.method, body, process.env)
        : await handle(kind, req.method, body, process.env, ip)
    res.statusCode = status
    if (out == null) { res.end(); return }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(out))
  })
}

function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) { server.middlewares.use(apiMiddleware) },
    configurePreviewServer(server) { server.middlewares.use(apiMiddleware) },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApi()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/')
          ) {
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
  // Match production's automatic JSX runtime in the Vitest transform so
  // files that don't import React (primitives, layouts, pages) work in tests.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    // Unit/integration tests live under src/ and api/; e2e/ is Playwright's
    // (different runner) so keep Vitest from picking up its *.spec.js files.
    include: ['src/**/*.{test,spec}.{js,jsx}', 'api/**/*.{test,spec}.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      // Only score the actual app + shared API logic. Three.js, dev-tweaks,
      // configs and tests are excluded so the percentage tracks coverage that
      // we can meaningfully act on.
      include: ['src/**/*.{js,jsx}', 'api/_lib/**/*.js'],
      thresholds: {
        // Baseline at the time of writing: 91% lines, 65% branches, 70% fns.
        // Floors guard against regressions; raise them as we add tests.
        lines: 85,
        statements: 85,
        functions: 65,
        branches: 60,
      },
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/**/*.config.{js,jsx}',
        'src/test/**',
        'src/main.jsx',
        'src/entry-server.jsx',
        'src/app/App.jsx',
        'src/core/lib/vitals.js',
        'src/shared/ui/VitalsHud.jsx',
        'src/core/lib/analytics.js',
        'src/shared/ui/EventsHud.jsx',
        'src/features/dev-tweaks/**',
        'src/shared/3d/**',
        'src/features/impact-map/**',
        'src/features/dashboard/**',
        'src/features/hero/**',
      ],
    },
  },
})
