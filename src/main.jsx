import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'

const root = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Prerendered HTML present (production) -> hydrate; empty (dev) -> render.
if (root.hasChildNodes()) {
  hydrateRoot(root, tree)
} else {
  createRoot(root).render(tree)
}
