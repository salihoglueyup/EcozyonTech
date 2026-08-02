# 14 — Erişilebilirlik (Accessibility — a11y)

> WCAG uyumu, skip link, reduced-motion, aria attribute'ları, keyboard
> navigasyonu, axe test coverage ve heading kuralları.

---

## İçindekiler

- [Genel Bakış](#genel-bakış)
- [Skip Link](#skip-link)
- [Reduced Motion](#reduced-motion)
- [Route Announcer](#route-announcer)
- [Keyboard Navigasyonu](#keyboard-navigasyonu)
- [ARIA Kullanımı](#aria-kullanımı)
- [Heading Hiyerarşisi](#heading-hiyerarşisi)
- [Form Erişilebilirliği](#form-erişilebilirliği)
- [Noscript Fallback](#noscript-fallback)
- [Dark Mode ve Renk Kontrastı](#dark-mode-ve-renk-kontrastı)
- [axe Test Coverage](#axe-test-coverage)
- [Erişilebilirlik Beyanı Sayfası](#erişilebilirlik-beyanı-sayfası)
- [İlgili Dokümanlar](#i̇lgili-dokümanlar)

---

## Genel Bakış

Proje, aşağıdaki erişilebilirlik standartlarını hedefler:

| Alan | Yaklaşım |
|------|----------|
| Skip link | `#main` hedefli, keyboard-only görünür |
| Motion | `prefers-reduced-motion` kontrollü |
| Screen reader | `aria-live` route announcer |
| Keyboard | Tab, Escape, Arrow keys, +/- |
| Forms | Etiketli input'lar, hata durumları |
| Heading | Test-enforced tek `<h1>` |
| Color | Dark/light, accent-independent semantics |
| Test | axe-core her sayfa + mega-menu |

## Skip Link

```jsx
// MainLayout (layouts/Main/index.jsx)
<a href="#main" className="skip-link">
  {t.a11y.skipToContent}
</a>

// Ana içerik
<main id="main" className="flex-grow">
  <Outlet />
</main>
```

CSS ile keyboard-only görünür:

```css
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 100;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  /* Görünür stil */
}
```

## Reduced Motion

Üç katmanlı reduced-motion desteği:

### 1. CSS Level

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2. JS One-Shot Check

```javascript
// src/core/motion.js
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)')?.matches ?? false;
}
```

Kullanım: Three.js globe'larında animasyon hızını sıfırlama.

### 3. React Hook (Reactive)

```javascript
// src/shared/ui/useReducedMotion.js
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}
```

Kullanım: Bileşen seviyesinde animasyon kararları (Reveal, Typewriter, vb.)

### View Transition API

Tema geçişi de reduced-motion'a saygı gösterir:

```javascript
// AppProvider.jsx
if (!document.startViewTransition ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setTweak('theme', v);  // Düz geçiş, animasyon yok
  return;
}
```

## Route Announcer

SPA navigasyonunda screen reader'lar sayfa değişikliğini fark etmez.
`RouteAnnouncer`, yeni sayfa başlığını `aria-live` bölgesine yazar:

```jsx
function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // Sayfa title'ının set edilmesini bekle (150ms gecikme)
    const id = setTimeout(() => setMsg(document.title), 150);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {msg}
    </div>
  );
}
```

## Keyboard Navigasyonu

### Genel Keyboard Desteği

| Kısayol | İşlev | Bileşen |
|---------|-------|---------|
| `Tab` / `Shift+Tab` | Focus navigasyonu | Global |
| `Escape` | Modal/Palette kapat | Modal, CommandPalette |
| `⌘K` / `Ctrl+K` | Command Palette aç | Global |
| `←` `→` | Globe yatay döndür | WorldGlobe |
| `↑` `↓` | Globe dikey döndür | WorldGlobe |
| `+` `-` | Globe zoom | WorldGlobe |

### Globe Keyboard Erişilebilirliği

```javascript
// WorldGlobe container
container.setAttribute('tabindex', '0');
container.setAttribute('role', 'application');
container.setAttribute('aria-label', 'Interactive 3D globe');
```

### Focus Trap

Modal ve dialog'larda focus hapsedilir:

```javascript
// useFocusTrap.js
// Tab: sonraki focusable element'e (döngüsel)
// Shift+Tab: önceki focusable element'e (döngüsel)
// Escape: kapatma callback'i
```

## ARIA Kullanımı

### FilterPills

```jsx
<div role="group" aria-label="Filtreler">
  <button aria-pressed={active === null}>Tümü</button>
  <button aria-pressed={active === 'category1'}>Kategori 1</button>
</div>
```

### Tabs

```jsx
<div role="tablist">
  <button role="tab" aria-selected={active === 0} aria-controls="panel-0">
    Sekme 1
  </button>
</div>
<div role="tabpanel" id="panel-0">
  İçerik
</div>
```

### Loading States

```jsx
<div aria-busy="true" aria-label="Yükleniyor">
  <Skeleton />
</div>
```

### ResultCount

```jsx
<span aria-live="polite">{count} sonuç</span>
```

### ArrowRight Icon

```jsx
<ArrowRight aria-hidden="true" />
```

## Heading Hiyerarşisi

### Tek h1 Kuralı

Her route sayfası **tam olarak bir `<h1>`** içermelidir. Bu kural,
`src/test/headers.test.js` tarafından zorlanır:

```
Home       → <h1> Hero başlığı
Services   → <h1> PageHeader başlığı
Blog       → <h1> PageHeader başlığı
Blog/:slug → <h1> Post başlığı
...
```

### Heading Düzeni

```
<h1> Sayfa başlığı (PageHeader)
  <h2> Feature Section 1 (SectionHeader)
    <h3> Alt bölüm
  <h2> Feature Section 2 (SectionHeader)
```

`SectionHeader` varsayılan `<h2>` render eder. `as` prop'u ile override edilebilir.

## Form Erişilebilirliği

- Tüm input'lar `<label>` ile etiketlidir
- `aria-describedby` ile hata mesajları ilişkilendirilir
- `aria-invalid` ile geçersiz durumlar işaretlenir
- Form hataları shake animasyonu ile görsel geri bildirim

## Noscript Fallback

Prerendered `<Reveal>` bileşenleri başlangıçta `opacity: 0` ile render edilir
(client effect animasyon başlatır). JavaScript devre dışıysa içerik görünmez kalır:

```html
<!-- index.html -->
<noscript>
  <style>
    [data-reveal] { opacity: 1 !important; transform: none !important; }
  </style>
</noscript>
```

## Dark Mode ve Renk Kontrastı

- Dark mode `class` stratejisi (`dark` class + Tailwind)
- Accent-independent semantic renkler (SEMANTIC token'ları)
- Arkaplan tonu seçenekleri her iki modda yeterli kontrast sağlar
- Koyu metin üzerinde gradient text kontrastı korunur

## axe Test Coverage

`src/test/a11y.test.jsx` her sayfa ve navbar mega-menu üzerinde `axe-core`
taraması yapar:

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Her sayfa için:
const results = await axe(container);
expect(results).toHaveNoViolations();
```

## Erişilebilirlik Beyanı Sayfası

`/accessibility` sayfası WCAG uyum beyanını içerir:
- Hedeflenen uyum seviyesi
- Desteklenen yardımcı teknolojiler
- Bilinen sınırlamalar
- Geri bildirim yolları

---

## İlgili Dokümanlar

- [06 — UI Components](./06-ui-components.md)
- [07 — 3D Globe Engine](./07-3d-globe-engine.md)
- [11 — Testing Strategy](./11-testing-strategy.md)
