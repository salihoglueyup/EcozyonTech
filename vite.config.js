import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Runs the same /api logic locally during `npm run dev` so forms work
// without the Vercel CLI. Production uses the real functions in /api.
function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const route = req.url?.split('?')[0]
        if (route !== '/api/contact' && route !== '/api/newsletter') return next()
        const kind = route === '/api/contact' ? 'contact' : 'newsletter'
        let raw = ''
        req.on('data', (c) => (raw += c))
        req.on('end', async () => {
          let body = {}
          try { body = raw ? JSON.parse(raw) : {} } catch { body = {} }
          const { handle } = await server.ssrLoadModule('/api/_lib/forms.js')
          const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || ''
          const { status, body: out } = await handle(kind, req.method, body, process.env, ip)
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(out))
        })
      })
    },
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
        'src/features/dev-tweaks/**',
        'src/shared/3d/**',
        'src/features/impact-map/**',
        'src/features/dashboard/**',
        'src/features/tech-ecosystem/**',
        'src/features/use-cases/**',
        'src/features/how-it-works/**',
        'src/features/about/**',
        'src/features/hero/**',
        'src/features/metrics/**',
      ],
    },
  },
})
