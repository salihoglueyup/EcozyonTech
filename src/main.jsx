import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { registerVitals } from './core/lib/vitals.js'

const root = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Prerendered HTML present (production) -> hydrate; empty (dev) -> render.
// Test for an *element* child, not any node: in dev Vite serves index.html
// verbatim, so the `<!--ssr-outlet-->` comment is itself a child node and
// `hasChildNodes()` would wrongly trigger hydration against an empty root.
if (root.firstElementChild) {
  hydrateRoot(root, tree)
} else {
  createRoot(root).render(tree)
}

registerVitals()
