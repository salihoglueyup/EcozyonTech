# 06 — UI Bileşen Kütüphanesi (UI Components)

> 60+ paylaşılan UI bileşeninin kataloğu: primitives, etkileşim bileşenleri,
> görsel efektler, chart'lar ve özel hook'lar.

---

## İçindekiler

- [Genel Bakış](#genel-bakış)
- [Primitives (primitives.jsx)](#primitives-primitivesjsx)
- [Etkileşim Bileşenleri](#etkileşim-bileşenleri)
- [Görsel Efekt Bileşenleri](#görsel-efekt-bileşenleri)
- [Chart Bileşenleri](#chart-bileşenleri)
- [Overlay Bileşenleri](#overlay-bileşenleri)
- [Dev-Only Bileşenler](#dev-only-bileşenler)
- [Custom Hook'lar](#custom-hooklar)
- [Bileşen Kuralları](#bileşen-kuralları)
- [İlgili Dokümanlar](#i̇lgili-dokümanlar)

---

## Genel Bakış

Tüm paylaşılan UI bileşenleri `src/shared/ui/` altında yaşar. Bunlar feature'lardan
bağımsız, yeniden kullanılabilir yapı taşlarıdır. Çoğu unit test'e sahiptir.

**Dosya:** `src/shared/ui/`
**Bileşen sayısı:** 60+ dosya (bileşenler + hook'lar + testler)

## Primitives (primitives.jsx)

**Dosya:** `src/shared/ui/primitives.jsx` (~16 KB, en büyük paylaşılan dosya)

Primitives, projenin her yerinde yeniden kullanılan temel yapı taşlarıdır.
Bu kalıpların satır içi (inline) yeniden yazılması **yasaktır**.

### PageHeader

Per-route sayfa başlığı. Eyebrow Tag + **h1** + giriş paragrafı.

```jsx
<PageHeader
  eyebrow={t.tech.eyebrow}     // Tag bileşeni ile sarılır
  title={t.tech.heading}        // <h1> olarak render edilir
  intro={t.tech.intro}          // Giriş paragrafı
/>
```

### SectionHeader

Feature section başlığı. Varsayılan **h2**, `as` prop'u ile değiştirilebilir.

```jsx
<SectionHeader
  title={t.howItWorks.title}    // <h2> olarak render edilir
  subtitle={t.howItWorks.desc}
  as="h3"                       // Opsiyonel: heading seviyesi override
/>
```

### SearchInput

Büyüteç ikonu + pill formlu arama girişi. Blog, Careers, Help sayfalarında kullanılır.

```jsx
<SearchInput
  value={query}
  onChange={setQuery}
  placeholder={t.blog.searchPlaceholder}
/>
```

### FilterPills

Filtreleme pill grubu. `role="group"` + `aria-pressed` toggle satırı.

```jsx
<FilterPills
  items={categories}
  active={activeFilter}
  onChange={setActiveFilter}
  allLabel={t.blog.all}          // İlk pill: "Tümü" (id=null)
>
  {/* Ek özel pill'ler */}
</FilterPills>
```

### EmptyState

Sonuç bulunamadığında gösterilen eco-card kutusu.

```jsx
<EmptyState message={t.blog.noResults} />
```

### ResultCount

Sonuç sayısını gösteren `aria-live` bileşen.

```jsx
<ResultCount count={filteredPosts.length} label={t.blog.results} />
```

### StatusBadge

Accent renkli durum noktası + etiket.

```jsx
<StatusBadge status="active" label="Çalışıyor" />
```

### Diğer Primitives

| Bileşen | Açıklama |
|---------|----------|
| `Tag` | Küçük etiket pill'i |
| `EcoLogo` | Marka logosu bileşeni |
| `ArrowRight` | CTA ok ikonu (`aria-hidden`) |
| `GlowOrb` | Dekoratif parlama efekti |

## Etkileşim Bileşenleri

### Modal (`Modal.jsx`)

Erişilebilir dialog kabuğu:
- Overlay + backdrop
- Focus trap (`useFocusTrap`)
- Escape ile kapatma
- Scroll-lock

```jsx
<Modal open={isOpen} onClose={() => setOpen(false)} title="Başvuru Formu">
  <ApplyForm />
</Modal>
```

**Kullanım yerleri:** Careers başvuru, Hero video.

### Toast (`Toast.jsx`)

Bildirim sistemi. `ToastProvider` context + `useToast()` hook:

```jsx
const { addToast } = useToast();
addToast({ type: 'success', message: 'Mesajınız gönderildi!' });
```

Özellikler:
- Auto-dismiss (countdown animasyonu)
- Çıkış animasyonu (sağa kayma)
- `type`: success / error / info / warning

### Tooltip (`Tooltip.jsx`)

Hover/focus ile gösterilen bilgi kutusu.

### Collapse (`Collapse.jsx`)

Accordion tarzı açılır-kapanır panel. SSS, Help sayfasında kullanılır.

### Tabs (`Tabs.jsx`)

Sekme bileşeni. `role="tablist"` + `role="tab"` + `role="tabpanel"`.

## Görsel Efekt Bileşenleri

### AnimatedNumber (`AnimatedNumber.jsx`)

Sayı animasyonu — görünüme girdiğinde 0'dan hedef değere sayar.

```jsx
<AnimatedNumber value={15000} suffix="+" duration={2000} />
```

### AnimatedIcon (`AnimatedIcon.jsx`)

SVG ikon animasyonu — görünüme girdiğinde stroke-draw efekti.

### RevealText (`RevealText.jsx`)

Metin ortaya çıkma efekti — scroll ile tetiklenen fade-up animasyonu.

### Typewriter (`Typewriter.jsx`)

Daktilosu efekti — karakter karakter metin yazma.

### Marquee (`Marquee.jsx`)

Sonsuz kayan metin bandı (42s döngü).

### SpotlightCard (`SpotlightCard.jsx`)

Mouse izleyici spotlight efektli kart.

### TiltCard (`TiltCard.jsx`)

Mouse hareketine göre 3D eğilme efektli kart.

### CustomCursor (`CustomCursor.jsx`)

Özel mouse imleci (global, AppShell'de mount edilir).

### MouseTrail (`MouseTrail.jsx`)

Mouse izleyici parçacık izi efekti.

### BackToTop (`BackToTop.jsx`)

Scroll yukarı butonu. Belirli bir scroll mesafesinden sonra görünür.

### GridPattern (`GridPattern.jsx`)

Dekoratif grid arka plan deseni.

### Breadcrumbs (`Breadcrumbs.jsx`)

Sayfa hiyerarşi navigasyonu (derin içerik sayfalarında).

### Skeleton (`Skeleton.jsx`)

Yükleme iskeleti. `Skeleton` (çubuk) ve `CardSkeleton` (kart) varyantları.

### Spinner (`Spinner.jsx`)

Dönen yükleme göstergesi.

### SuccessCheck (`SuccessCheck.jsx`)

Animasyonlu onay işareti (stroke-draw efekti).

### NewsletterForm (`NewsletterForm.jsx`)

Bülten abonelik formu bileşeni. `/api/newsletter` endpoint'ine POST yapar.

### SectionNav (`SectionNav.jsx`)

Sayfa içi bölüm navigasyonu (sticky sidebar/top-bar).

## Chart Bileşenleri

**Dosya:** `src/shared/ui/charts/`

| Dosya | İçerik |
|-------|--------|
| `index.jsx` | BarChart, PieChart, DonutChart bileşenleri |
| `geometry.js` | SVG geometri yardımcıları (arc hesaplama, çubuk konumlandırma) |
| `geometry.test.js` | Geometri fonksiyon testleri |
| `charts.test.jsx` | Chart render testleri |

Chart'lar saf SVG ile çizilir — D3 veya üçüncü parti chart kütüphanesi
kullanılmaz. Token'lardan renk alır (`BRAND`, `SEMANTIC`).

## Overlay Bileşenleri

### CommandPalette (`CommandPalette.jsx`)

⌘K / Ctrl+K ile açılan komut paleti:
- Lazy-loaded (idle-mount, entry chunk dışında)
- Tüm content registry'den arama yapar
- Hızlı navigasyon
- Keyboard-first tasarım

```jsx
// MainLayout'ta mount (requestIdleCallback sonrası)
const CommandPalette = lazy(() => import('@/shared/ui/CommandPalette'));
```

### OnboardingTour (`OnboardingTour.jsx`)

İlk ziyaret onboarding turu:
- Lazy-loaded (idle-mount)
- Adım adım rehberlik
- Bir kez gösterilir (localStorage flag)

## Dev-Only Bileşenler

Bu bileşenler **sadece `import.meta.env.DEV` altında** mount edilir, production'a ship edilmez:

| Bileşen | Açıklama |
|---------|----------|
| `DevTweaks` | Tasarım paneli (font, renk, tema değiştirme) |
| `VitalsHud` | Web Vitals overlay |
| `EventsHud` | Telemetry event overlay |

## Custom Hook'lar

### useInView (`useInView.js`)

IntersectionObserver wrapper. Element görünüme girdiğinde tetiklenir.

```javascript
const [ref, isInView] = useInView({ threshold: 0.1 });
```

### useReveal (`useReveal.jsx`)

Scroll-triggered reveal animasyonu. IntersectionObserver + CSS transform.

```jsx
const { ref, style } = useReveal();
return <div ref={ref} style={style} data-reveal>...</div>;
```

### useReducedMotion (`useReducedMotion.js`)

`prefers-reduced-motion` medya sorgusunu dinler. OS ayarı değiştiğinde güncellenir.

```javascript
const prefersReduced = useReducedMotion();
```

### useFocusTrap (`useFocusTrap.js`)

Modal/dialog içinde focus'u hapseder. Tab/Shift+Tab döngüsü.

### usePersistentState (`usePersistentState.js`)

`localStorage` ile senkronize `useState`.

```javascript
const [value, setValue] = usePersistentState('key', defaultValue);
```

### useFilteredList (`useFilteredList.js`)

Liste sayfalarının filter + search state'ini yönetir:

```javascript
const { visible, query, setQuery, active, setActive } = useFilteredList({
  items,
  filterFn: (item, activeFilter) => ...,
  searchFn: (item, query, lang) => ...,
});
```

**Kullanım:** Careers, Help, Glossary sayfaları.

### useReadingProgress (`useReadingProgress.js`)

Okuma ilerleme yüzdesi (blog yazıları için).

### commands.js

CommandPalette komut tanımları ve navigasyon aksiyonları.

## Bileşen Kuralları

1. **Primitives'ı yeniden yazmayın** — `primitives.jsx`'teki kalıpları satır içi kopyalamak yasaktır. Her zaman import edin.
2. **Shared ≠ Feature** — Shared bileşenler feature-agnostik olmalıdır. Feature-specific UI, ilgili `features/` klasöründe yaşar.
3. **Test zorunluluğu** — Her yeni shared bileşen bir `.test.jsx` dosyası ile gelmelidir.
4. **a11y kuralları** — `role`, `aria-*` attribute'ları, keyboard navigasyonu zorunludur.
5. **Motion tokens kullanın** — Hardcoded süre/easing yerine `DURATION`/`EASING` veya CSS `--dur-*`/`--ease-*` kullanın.

---

## İlgili Dokümanlar

- [05 — Design Tokens](./05-design-tokens.md)
- [07 — 3D Globe Engine](./07-3d-globe-engine.md)
- [14 — Accessibility](./14-accessibility.md)
- [15 — Search & Command Palette](./15-search-and-command-palette.md)
