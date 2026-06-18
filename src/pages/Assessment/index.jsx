import { GRADIENTS } from '@/core/tokens';
import { useState } from 'react';
import { Tag, RelatedRoutes } from '@/shared/ui/primitives';
import { Donut } from '@/shared/ui/charts';
import { useApp } from '@/app/providers/AppProvider';
import { useToast } from '@/shared/ui/Toast';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey, SITE } from '@/core/config/site';
import { track } from '@/core/lib/telemetry';
import {
  QUESTIONS,
  scoreAssessment,
  isComplete,
  profileFor,
  recommendationsFor,
  categoryBreakdown,
} from '@/core/lib/assessment';

const meta = routeByKey('assessment');
const TOTAL = QUESTIONS.length;
const scoreColor = (s) => (s >= 70 ? '#10B981' : s >= 40 ? '#F59E0B' : '#E11D48');

export default function AssessmentPage() {
  const { lang, t } = useApp();
  const a = t.assessment;
  const toast = useToast();
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  useDocumentMeta(meta.title[lang], a.intro);

  const q = QUESTIONS[step];
  const answered = answers[q?.id] != null;
  const progress = done ? 100 : Math.round((step / TOTAL) * 100);

  const choose = (optId) => setAnswers((prev) => ({ ...prev, [q.id]: optId }));

  const onNext = () => {
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
    } else if (isComplete(answers)) {
      const score = scoreAssessment(answers);
      track('assessment_complete', { score, profile: profileFor(score) });
      setDone(true);
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  const score = scoreAssessment(answers);
  const profile = profileFor(score);
  const recs = recommendationsFor(answers);
  const breakdown = categoryBreakdown(answers);

  const share = async () => {
    const url = `${SITE.url}/assessment`;
    const text = lang === 'tr'
      ? `Sürdürülebilirlik skorum ${score}/100 — sen de ölç: ${url}`
      : `My sustainability score is ${score}/100 — measure yours: ${url}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Ecozyon Tech', text, url });
      else { await navigator.clipboard.writeText(text); toast({ message: a.result.shared, type: 'success' }); }
      track('assessment_share', { score });
    } catch { /* user dismissed — no-op */ }
  };

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-8">
          <Tag color="emerald">// {a.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {a.title}
            <span className="eco-gradient-text">{a.titleAccent}</span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">{a.intro}</p>
        </div>

        {/* Progress */}
        <div
          className="mb-5"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={a.progressLabel}
          aria-valuetext={done ? a.result.scoreLabel : a.step.replace('{n}', step + 1).replace('{total}', TOTAL)}
        >
          <div className="h-1.5 rounded-full bg-slate-900/[.06] dark:bg-white/[.08] overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${progress}%`, backgroundImage: 'linear-gradient(90deg,#0EA5E9,#10B981)' }}
            />
          </div>
        </div>

        {!done ? (
          <div className="rounded-3xl bg-white/70 dark:bg-white/[.04] border border-slate-900/[.08] dark:border-white/[.08] p-6 sm:p-8 shadow-[0_18px_44px_-24px_rgba(15,23,42,.3)]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-[11.5px] font-mono text-slate-400">
                {a.step.replace('{n}', step + 1).replace('{total}', TOTAL)}
              </span>
              <span className="rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide">
                {a.cat[q.id]}
              </span>
            </div>
            <fieldset>
              <legend className="text-[18px] font-display font-medium text-slate-900 dark:text-slate-100 mb-5">
                {a.q[q.id].q}
              </legend>
              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const active = answers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition ${
                        active
                          ? 'border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-500/[.08]'
                          : 'border-slate-900/[.08] dark:border-white/[.08] hover:border-slate-900/20 dark:hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={active}
                        onChange={() => choose(opt.id)}
                        className="sr-only peer"
                      />
                      <span
                        aria-hidden="true"
                        className={`grid place-items-center h-5 w-5 shrink-0 rounded-full border-2 transition ${
                          active ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {active && <span className="h-2 w-2 rounded-full bg-white" />}
                      </span>
                      <span className="text-[14px] text-slate-800 dark:text-slate-200">{a.q[q.id].options[opt.id]}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="eco-press text-[13px] font-medium text-slate-500 dark:text-slate-400 disabled:opacity-40 hover:text-slate-900 dark:hover:text-white transition"
              >
                ← {a.back}
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!answered}
                className="eco-press inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-medium text-white disabled:opacity-40 transition"
                style={{ backgroundImage: GRADIENTS.cta }}
              >
                {step < TOTAL - 1 ? a.next : a.result.scoreLabel}
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h6m-2-2 2 2-2 2" /></svg>
              </button>
            </div>
          </div>
        ) : (
          <>
          <div className="rounded-3xl bg-white/70 dark:bg-white/[.04] border border-slate-900/[.08] dark:border-white/[.08] p-6 sm:p-8 shadow-[0_18px_44px_-24px_rgba(15,23,42,.3)]">
            <div className="flex items-center gap-5">
              <Donut value={score} size={88} stroke={9} color={scoreColor(score)} label={a.result.scoreLabel}>
                <span className="text-[22px] font-display font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{score}</span>
              </Donut>
              <div>
                <div className="text-[11px] uppercase tracking-[.14em] font-semibold text-slate-400">{a.result.scoreLabel}</div>
                <div className="text-[20px] font-display font-medium text-slate-900 dark:text-slate-100">{a.result.profiles[profile].t}</div>
                <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{a.result.profiles[profile].d}</p>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="mt-7">
              <div className="text-[11px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-3">{a.result.breakdownTitle}</div>
              <ul className="space-y-2.5">
                {breakdown.map((c) => (
                  <li key={c.id} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-[12.5px] text-slate-600 dark:text-slate-400">{a.cat[c.id]}</span>
                    <span className="flex-1 h-2 rounded-full bg-slate-900/[.06] dark:bg-white/[.08] overflow-hidden">
                      <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: `${c.score}%`, backgroundColor: scoreColor(c.score) }} />
                    </span>
                    <span className="w-8 text-right text-[12px] font-mono tabular-nums text-slate-500 dark:text-slate-400">{c.score}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="mt-7">
              <div className="text-[11px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-3">{a.result.recsTitle}</div>
              <ol className="space-y-2.5">
                {recs.map((id, i) => (
                  <li key={id} className="flex gap-3">
                    <span className="grid place-items-center h-6 w-6 shrink-0 rounded-full text-white font-mono text-[10px] font-bold" style={{ background: `linear-gradient(135deg,${['#0EA5E9','#10B981','#7C3AED'][i]}, ${['#0EA5E9','#10B981','#7C3AED'][i]}cc)` }}>
                      {i + 1}
                    </span>
                    <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">{a.recs[id]}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={share}
                className="eco-press inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-medium text-white"
                style={{ backgroundImage: GRADIENTS.cta }}
              >
                {a.result.share}
              </button>
              <button
                type="button"
                onClick={restart}
                className="eco-press inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 bg-slate-900/[.05] dark:bg-white/[.08] hover:bg-slate-900/[.08] dark:hover:bg-white/[.12] transition"
              >
                ↺ {a.result.retake}
              </button>
            </div>
          </div>

          <RelatedRoutes title={t.related.nextStep} routeKeys={['leaderboard', 'roi']} lang={lang} />
          </>
        )}
      </div>
    </section>
  );
}
