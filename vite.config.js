import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handle } from './api/_lib/forms.js'
import { handleVitals } from './api/_lib/vitals.js'
import { handleEvent } from './api/_lib/telemetry.js'
import { handlePosts } from './api/_lib/posts-db.js'
import { handleLogin, handleCallback, handleMe, handleLogout } from './api/_lib/admin-auth.js'
import { handleAdminPosts, handleAdminPost } from './api/_lib/admin-posts.js'
import { applyResult, originOf } from './api/admin/_send.js'

// Shared /api middleware: runs the exact serverless logic locally so forms +
// vitals work without the Vercel CLI. Mounted on both the dev server and the
// preview server (the latter is what e2e tests run against).
function apiMiddleware(req, res, next) {
  const route = req.url?.split('?')[0]

  // Admin OAuth routes need real redirects + Set-Cookie, so they bypass the
  // JSON path below and translate the neutral handler result onto the response.
  if (route?.startsWith('/api/admin/')) {
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', async () => {
      const origin = originOf(req)
      const query = Object.fromEntries(new URLSearchParams(req.url?.split('?')[1] || ''))
      const cookie = req.headers.cookie || ''
      let result
      let body = {}
      try { body = raw ? JSON.parse(raw) : {} } catch { body = {} }
      if (route === '/api/admin/login') result = handleLogin(process.env, origin)
      else if (route === '/api/admin/callback') result = await handleCallback(query, cookie, process.env, origin)
      else if (route === '/api/admin/me') result = handleMe(cookie, process.env)
      else if (route === '/api/admin/logout') result = handleLogout()
      else if (route === '/api/admin/posts') result = await handleAdminPosts(req.method, body, cookie, process.env)
      else if (route.startsWith('/api/admin/posts/')) result = await handleAdminPost(req.method, route.slice('/api/admin/posts/'.length), body, cookie, process.env)
      else return next()
      applyResult(res, result)
    })
    return
  }

  const KINDS = { '/api/contact': 'contact', '/api/newsletter': 'newsletter', '/api/apply': 'apply' }
  const kind = KINDS[route]
  const isVitals = route === '/api/vitals'
  const isTelemetry = route === '/api/telemetry'
  const isPosts = route === '/api/posts'
  if (!kind && !isVitals && !isTelemetry && !isPosts) return next()
  let raw = ''
  req.on('data', (c) => (raw += c))
  req.on('end', async () => {
    let body = {}
    try { body = raw ? JSON.parse(raw) : {} } catch { body = {} }
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || ''
    const query = Object.fromEntries(new URLSearchParams(req.url?.split('?')[1] || ''))
    const { status, body: out } = isVitals
      ? await handleVitals(req.method, body, process.env)
      : isTelemetry
        ? await handleEvent(req.method, body, process.env)
        : isPosts
          ? await handlePosts(req.method, query, process.env)
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
        // Current: ~89% lines/stmts, ~78% branches, ~74% fns. Floors sit just
        // below to lock in coverage and guard regressions; raise as tests grow.
        lines: 88,
        statements: 88,
        functions: 70,
        branches: 73,
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
        'src/core/lib/telemetry.js',
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
