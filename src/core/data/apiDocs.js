// API reference data — documents the real serverless endpoints in /api. The
// request/response shapes mirror api/_lib/forms.js + api/_lib/vitals.js so the
// docs stay truthful. Bilingual where it helps; field/type tokens stay literal.

export const API_INTRO = {
  baseUrl: 'https://ecozyon.tech',
  contentType: 'application/json',
  notes: {
    tr: 'Tüm uçlar POST kabul eder ve JSON gövde bekler. Formlar IP başına oran sınırlamasına tabidir; gizli bir `company_website` honeypot alanı doldurulursa istek sessizce başarılı sayılır (bot koruması). Gizli anahtar gerekmez — demo modunda çalışır.',
    en: 'All endpoints accept POST with a JSON body. Form endpoints are rate-limited per IP; filling the hidden `company_website` honeypot makes the request silently succeed (bot protection). No secret key required — runs in demo mode.',
  },
};

export const ENDPOINTS = [
  {
    id: 'contact',
    method: 'POST',
    path: '/api/contact',
    summary: { tr: 'İletişim formu gönderimi.', en: 'Submit the contact form.' },
    request: [
      { field: 'name', type: 'string', required: true, note: { tr: 'En az 2 karakter', en: 'Min 2 characters' } },
      { field: 'company', type: 'string', required: true, note: { tr: 'Şirket adı', en: 'Company name' } },
      { field: 'email', type: 'string', required: true, note: { tr: 'Geçerli e-posta', en: 'Valid email' } },
      { field: 'message', type: 'string', required: false, note: { tr: 'En fazla 2000 karakter', en: 'Up to 2000 chars' } },
      { field: 'purpose', type: 'string', required: false, note: { tr: 'Konu / amaç', en: 'Topic / purpose' } },
    ],
    responses: [
      { status: 200, label: { tr: 'Başarılı', en: 'Success' }, body: '{ "ok": true }' },
      { status: 422, label: { tr: 'Doğrulama hatası', en: 'Validation error' }, body: '{ "ok": false, "errors": { "email": "invalid" } }' },
      { status: 429, label: { tr: 'Oran sınırı', en: 'Rate limited' }, body: '{ "ok": false, "error": "rate_limited", "retryAfterMs": 42000 }' },
    ],
    curl: `curl -X POST https://ecozyon.tech/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada","company":"Acme","email":"ada@acme.co","message":"Merhaba"}'`,
  },
  {
    id: 'newsletter',
    method: 'POST',
    path: '/api/newsletter',
    summary: { tr: 'Bültene e-posta kaydı.', en: 'Subscribe an email to the newsletter.' },
    request: [
      { field: 'email', type: 'string', required: true, note: { tr: 'Geçerli e-posta', en: 'Valid email' } },
    ],
    responses: [
      { status: 200, label: { tr: 'Başarılı', en: 'Success' }, body: '{ "ok": true }' },
      { status: 422, label: { tr: 'Geçersiz e-posta', en: 'Invalid email' }, body: '{ "ok": false, "errors": { "email": "invalid" } }' },
      { status: 429, label: { tr: 'Oran sınırı', en: 'Rate limited' }, body: '{ "ok": false, "error": "rate_limited" }' },
    ],
    curl: `curl -X POST https://ecozyon.tech/api/newsletter \\
  -H "Content-Type: application/json" \\
  -d '{"email":"ada@acme.co"}'`,
  },
  {
    id: 'apply',
    method: 'POST',
    path: '/api/apply',
    summary: { tr: 'Açık pozisyona başvuru.', en: 'Apply to an open role.' },
    request: [
      { field: 'name', type: 'string', required: true, note: { tr: 'En az 2 karakter', en: 'Min 2 characters' } },
      { field: 'email', type: 'string', required: true, note: { tr: 'Geçerli e-posta', en: 'Valid email' } },
      { field: 'role', type: 'string', required: true, note: { tr: 'Başvurulan pozisyon', en: 'Position applied for' } },
      { field: 'note', type: 'string', required: false, note: { tr: 'En fazla 2000 karakter', en: 'Up to 2000 chars' } },
    ],
    responses: [
      { status: 200, label: { tr: 'Başarılı', en: 'Success' }, body: '{ "ok": true }' },
      { status: 422, label: { tr: 'Doğrulama hatası', en: 'Validation error' }, body: '{ "ok": false, "errors": { "role": "required" } }' },
      { status: 429, label: { tr: 'Oran sınırı', en: 'Rate limited' }, body: '{ "ok": false, "error": "rate_limited" }' },
    ],
    curl: `curl -X POST https://ecozyon.tech/api/apply \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada","email":"ada@acme.co","role":"senior-frontend"}'`,
  },
  {
    id: 'vitals',
    method: 'POST',
    path: '/api/vitals',
    summary: { tr: 'Web Vitals metrik beacon’u (sendBeacon ile, yanıt okunmaz).', en: 'Web Vitals metric beacon (via sendBeacon; response is not read).' },
    request: [
      { field: 'name', type: 'enum', required: true, note: { tr: 'CLS · FCP · INP · LCP · TTFB', en: 'CLS · FCP · INP · LCP · TTFB' } },
      { field: 'value', type: 'number', required: true, note: { tr: 'Negatif olamaz', en: 'Non-negative' } },
      { field: 'rating', type: 'string', required: false, note: { tr: 'good · needs-improvement · poor', en: 'good · needs-improvement · poor' } },
      { field: 'path', type: 'string', required: false, note: { tr: 'Sayfa yolu', en: 'Page path' } },
    ],
    responses: [
      { status: 204, label: { tr: 'Kabul edildi (gövdesiz)', en: 'Accepted (no body)' }, body: '' },
      { status: 422, label: { tr: 'Geçersiz metrik', en: 'Invalid metric' }, body: '{ "ok": false, "error": "bad_value" }' },
    ],
    curl: `curl -X POST https://ecozyon.tech/api/vitals \\
  -H "Content-Type: application/json" \\
  -d '{"name":"LCP","value":1840,"rating":"good","path":"/"}'`,
  },
];

// An endpoint by id, or undefined.
export const endpointById = (id, all = ENDPOINTS) => all.find((e) => e.id === id);
