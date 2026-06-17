---
name: add-feature-section
description: Scaffold a new self-contained feature section for the Ecozyon Tech site (Feature-Sliced Design). Use when adding a new page section like hero/metrics/use-cases. Creates src/features/<name>/index.jsx that takes the `t` prop, uses the shared SectionHeader (h2), and is reduced-motion safe, plus a colocated test.
---

# Add a feature section (FSD)

Features are self-contained page sections under `src/features/<name>/`. A page
composes several of them and passes the active dictionary down as `t`.

## Steps

1. **Create `src/features/<name>/index.jsx`.** Export a default component that
   takes `{ t }` (the active TR/EN dictionary) and reads its own namespace:

   ```jsx
   import { SectionHeader } from '@/shared/ui/primitives';

   export default function <Name>({ t }) {
     const s = t.<namespace>;
     return (
       <section className="relative py-20 lg:py-28">
         <div className="mx-auto max-w-6xl px-6">
           <SectionHeader eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} sub={s.sub} />
           {/* section body */}
         </div>
       </section>
     );
   }
   ```

2. **Headings**: use `SectionHeader` (renders the section **h2**; takes an
   optional `as` prop to render h1, and a `shimmer` prop for the brand gradient
   sweep). Never hand-roll the eyebrow+h2 pattern — reuse the primitive. There
   must be **exactly one `<h1>` per route** (enforced by a test) — the page's
   `PageHeader` owns it, sections stay h2.

3. **Reuse primitives** from `src/shared/ui/primitives.jsx` (`Tag`, `ArrowRight`,
   `FilterPills`, `SearchInput`, `EmptyState`, `ResultCount`, `StatusBadge`,
   `SpotlightCard`, `AnimatedIcon`…). Cards use the `.eco-card` utility; CTAs use
   `GRADIENTS.cta`; brand headings use `.eco-gradient-text`. No inline gradient
   dupes.

4. **Motion must be reduced-motion safe** — use the motion tokens / `useInView`
   / `useReducedMotion` from `src/core/motion.js`; never ad-hoc `matchMedia`.

5. **i18n** — add the copy via the `add-i18n-namespace` skill; keep TR/EN parity.

6. **Compose it** into the relevant page in `src/pages/<Page>/index.jsx`, passing
   `t`.

7. **Test** — colocate `src/features/<name>/index.test.jsx` (render + key copy +
   any interaction). To assert `useInView`-gated reveal/draw state in tests,
   drive a **capturing IntersectionObserver mock** (see
   `src/shared/ui/useInView.test.jsx`) — the default test setup mocks IO to never
   fire, so reveals won't appear otherwise.

8. **Verify**: `npx vitest run`, `npm run lint`.

## Don'ts

- Don't touch the 3D globes (`WorldGlobe.jsx`/`EcoGlobe.jsx`) — a guard hook will
  ask for confirmation, and their invariants are strict.
- Don't import Three.js directly; use `LazyGlobes` if you need a globe.
