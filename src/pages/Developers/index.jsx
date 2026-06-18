import { PageHeader, RelatedRoutes } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { SectionNav } from '@/shared/ui/SectionNav';
import { useToast } from '@/shared/ui/Toast';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { ENDPOINTS, API_INTRO } from '@/core/data/apiDocs';

const meta = routeByKey('developers');

const STATUS_COLOR = (s) => (s < 300 ? '#10B981' : s < 400 ? '#0EA5E9' : s < 500 ? '#F59E0B' : '#EF4444');

function CodeBlock({ code, label, onCopy }) {
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl bg-slate-900 dark:bg-black/60 text-slate-100 text-[12.5px] leading-relaxed p-4 ring-1 ring-white/10">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className="eco-press absolute top-2.5 right-2.5 rounded-md bg-white/10 hover:bg-white/20 px-2 py-1 text-[11px] font-medium text-slate-200 transition"
      >
        {label}
      </button>
    </div>
  );
}

export default function DevelopersPage() {
  const { lang, t } = useApp();
  const d = t.developers;
  const toast = useToast();
  useDocumentMeta(meta.title[lang], d.intro);

  const copy = async (text) => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(text);
      toast({ message: d.copied, type: 'success' });
    } catch {
      toast({ message: d.copyError, type: 'error' });
    }
  };

  const navSections = ENDPOINTS.map((e) => ({ id: e.id, label: e.path }));

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <SectionNav sections={navSections} />
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <PageHeader
            eyebrow={d.eyebrow}
            title={d.title}
            titleAccent={d.titleAccent}
            intro={d.intro}
          />
          <div className="mt-5 rounded-xl eco-card p-4 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-mono text-[12px] text-slate-500 dark:text-slate-300">{API_INTRO.baseUrl}</span>
            <p className="mt-2">{API_INTRO.notes[lang]}</p>
          </div>
        </div>

        <div className="space-y-10">
          {ENDPOINTS.map((e) => (
            <section key={e.id} id={e.id} className="scroll-mt-28 border-t border-slate-900/[.06] dark:border-white/[.06] pt-8">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[11px] font-bold tracking-wide">{e.method}</span>
                  <code className="font-mono text-[14px] text-slate-900 dark:text-slate-100">{e.path}</code>
                </div>
                <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-300">{e.summary[lang]}</p>

                {e.request.length > 0 && (
                  <>
                    <h2 className="mt-5 text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-2">{d.request}</h2>
                    <div className="overflow-x-auto rounded-xl eco-card">
                      <table className="w-full text-left text-[13px]">
                        <thead>
                          <tr className="border-b border-slate-900/[.06] dark:border-white/[.06] text-slate-500 dark:text-slate-400">
                            <th scope="col" className="py-2 px-3 font-medium">{d.field}</th>
                            <th scope="col" className="py-2 px-3 font-medium">{d.type}</th>
                            <th scope="col" className="py-2 px-3 font-medium">{d.notes}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e.request.map((f) => (
                            <tr key={f.field} className="border-b border-slate-900/[.04] dark:border-white/[.04] last:border-0">
                              <td className="py-2 px-3 font-mono text-slate-800 dark:text-slate-200">{f.field}</td>
                              <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{f.type}</td>
                              <td className="py-2 px-3 text-slate-500 dark:text-slate-400">
                                <span className={f.required ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}>{f.required ? d.required : d.optional}</span>
                                {f.note && <span className="ml-2 text-slate-400">· {f.note[lang]}</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <h2 className="mt-5 text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-2">{d.responses}</h2>
                <ul className="space-y-2">
                  {e.responses.map((r) => (
                    <li key={r.status} className="flex flex-wrap items-center gap-2.5 text-[13px]">
                      <span className="rounded-md px-1.5 py-0.5 font-mono text-[12px] font-semibold" style={{ backgroundColor: `${STATUS_COLOR(r.status)}1f`, color: STATUS_COLOR(r.status) }}>{r.status}</span>
                      <span className="text-slate-500 dark:text-slate-400">{r.label[lang]}</span>
                      {r.body && <code className="font-mono text-[12px] text-slate-600 dark:text-slate-300">{r.body}</code>}
                    </li>
                  ))}
                </ul>

                <h2 className="mt-5 text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-2">{d.example}</h2>
                <CodeBlock code={e.curl} label={d.copy} onCopy={() => copy(e.curl)} />
              </Reveal>
            </section>
          ))}
        </div>

        <RelatedRoutes title={t.related.related} routeKeys={['changelog', 'status', 'integrations']} lang={lang} />
      </div>
    </section>
  );
}
