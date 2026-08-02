import { GRADIENTS } from '@/core/tokens';
import { useState, useEffect, useCallback } from 'react';
import { Tag, RelatedRoutes, GlowOrb } from '@/shared/ui/primitives';
import { GridPattern } from '@/shared/ui/GridPattern';
import { Donut } from '@/shared/ui/charts';
import { useApp } from '@/app/providers/AppProvider';
import { useToast } from '@/shared/ui/Toast';
import { Reveal } from '@/shared/ui/useReveal';
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

// Key map for A, B, C, D
const KEYS = ['a', 'b', 'c', 'd'];

export default function AssessmentPage() {
  const { lang, t } = useApp();
  const a = t.assessment;
  const toast = useToast();
  
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  useDocumentMeta(meta.title[lang], a.intro);

  const q = QUESTIONS[step];
  const progress = done ? 100 : Math.round((step / TOTAL) * 100);

  // Dynamic Background Glow Color based on progress
  const glowColor = step < 2 ? '#0ea5e9' : step < 3 ? '#3b82f6' : '#10b981';

  // --- Handlers ---

  const completeAssessment = (finalAnswers) => {
    setIsAnalyzing(true);
    // Fake Matrix Analysis Delay (1.5s)
    setTimeout(() => {
      const score = scoreAssessment(finalAnswers);
      track('assessment_complete', { score, profile: profileFor(score) });
      setIsAnalyzing(false);
      setDone(true);
    }, 1500);
  };

  const choose = useCallback((optId) => {
    if (isAnalyzing || done) return;
    
    setAnswers((prev) => {
      const newAnswers = { ...prev, [q.id]: optId };
      
      // Auto-advance after 400ms delay
      setTimeout(() => {
        if (step < TOTAL - 1) {
          setStep((s) => s + 1);
        } else if (isComplete(newAnswers)) {
          completeAssessment(newAnswers);
        }
      }, 400);
      
      return newAnswers;
    });
  }, [step, q, isAnalyzing, done]);

  // Keyboard Navigation
  useEffect(() => {
    if (isAnalyzing || done) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (KEYS.includes(key)) {
        const index = KEYS.indexOf(key);
        if (q && q.options[index]) {
          choose(q.options[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, q, isAnalyzing, done, choose]);

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    setIsAnalyzing(false);
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
    } catch { /* user dismissed */ }
  };

  // --- Render ---

  // Loading Matrix Effect
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-[#04080f] overflow-hidden">
        <GridPattern className="absolute inset-0 opacity-20 dark:opacity-[0.07] mix-blend-overlay dark:mix-blend-screen pointer-events-none" />
        <GlowOrb color="#10b981" size={800} blur={160} className="absolute opacity-30 animate-pulse pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
            <svg className="h-6 w-6 text-emerald-500 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="font-mono text-xl tracking-widest text-emerald-600 dark:text-emerald-400 uppercase animate-pulse">
            {lang === 'tr' ? 'Veriler Analiz Ediliyor...' : 'Analyzing Data...'}
          </h2>
        </div>
      </div>
    );
  }

  // Cinematic Full Screen Quiz
  if (!done) {
    return (
      <div className="fixed inset-0 z-40 bg-slate-50 dark:bg-[#04080f] flex flex-col justify-center overflow-hidden">
        <GridPattern className="absolute inset-0 opacity-20 dark:opacity-[0.07] mix-blend-overlay dark:mix-blend-screen pointer-events-none transition-colors duration-1000" />
        <GlowOrb color={glowColor} size={1000} blur={200} x="50%" y="0%" className="absolute opacity-20 dark:opacity-10 transition-colors duration-1000 pointer-events-none" />

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900/[.06] dark:bg-white/[.08]">
          <div
            className="h-full bg-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="absolute top-8 left-8">
          <button onClick={() => window.history.back()} className="text-[12px] font-mono text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            ← {lang === 'tr' ? 'Geri Dön' : 'Go Back'}
          </button>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <Reveal key={`q-${step}`}>
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                {a.cat[q.id]} • {step + 1}/{TOTAL}
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-12">
              {a.q[q.id].q}
            </h1>

            <div className="grid gap-3 sm:gap-4">
              {q.options.map((opt, index) => {
                const active = answers[q.id] === opt.id;
                const letter = KEYS[index].toUpperCase();
                return (
                  <button
                    key={opt.id}
                    onClick={() => choose(opt.id)}
                    className={`group relative flex items-center w-full text-left rounded-2xl border-2 px-6 py-5 transition-all duration-300 ${
                      active
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/[.08] shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] translate-x-2'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-white/[.02]'
                    }`}
                  >
                    {/* Keyboard Badge */}
                    <span className={`grid place-items-center h-8 w-8 shrink-0 rounded-md border mr-5 font-mono text-[13px] font-bold transition-colors ${
                      active 
                        ? 'border-emerald-500 bg-emerald-500 text-white' 
                        : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:border-slate-400 dark:group-hover:text-slate-300'
                    }`}>
                      {letter}
                    </span>
                    
                    <span className={`text-[clamp(1.1rem,2vw,1.4rem)] font-medium ${
                      active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {a.q[q.id].options[opt.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Footer Hint */}
          <div className="mt-12 text-center text-[13px] font-mono text-slate-400 dark:text-slate-500">
            {lang === 'tr' ? "Şıkları klavyeden A, B, C, D tuşlarına basarak seçebilirsiniz." : "Press A, B, C, D on your keyboard to select an option."}
          </div>
        </div>
      </div>
    );
  }

  // Final Results Screen
  return (
    <section className="relative min-h-screen py-24 lg:py-32 bg-slate-50 dark:bg-[#04080f] overflow-hidden">
      <GridPattern className="absolute inset-0 opacity-20 dark:opacity-[0.07] mix-blend-overlay dark:mix-blend-screen pointer-events-none z-0" />
      <GlowOrb color={scoreColor(score)} size={900} blur={160} x="-10%" y="20%" className="absolute opacity-20 pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="text-center mb-16">
            <Tag color="emerald">// {a.titleAccent}</Tag>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight text-slate-900 dark:text-white">
              {lang === 'tr' ? 'İşte Sürdürülebilirlik Profilin' : 'Here is your Sustainability Profile'}
            </h1>
          </div>

          <div className="rounded-3xl eco-card p-8 sm:p-12 shadow-[0_32px_64px_-24px_rgba(15,23,42,.2)]">
            <div className="flex flex-col sm:flex-row items-center gap-10">
              <Donut value={score} size={140} stroke={12} color={scoreColor(score)} label={a.result.scoreLabel}>
                <span className="text-[40px] font-display font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{score}</span>
              </Donut>
              <div className="text-center sm:text-left">
                <div className="text-[12px] uppercase tracking-[.2em] font-bold text-slate-400 mb-2">{a.result.scoreLabel}</div>
                <div className="text-[28px] font-display font-bold text-slate-900 dark:text-slate-100 mb-3">{a.result.profiles[profile].t}</div>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">{a.result.profiles[profile].d}</p>
              </div>
            </div>

            <hr className="my-10 border-slate-200 dark:border-white/10" />

            <div className="grid sm:grid-cols-2 gap-12">
              {/* Category breakdown */}
              <div>
                <div className="text-[11px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-5">{a.result.breakdownTitle}</div>
                <ul className="space-y-4">
                  {breakdown.map((c) => (
                    <li key={c.id} className="flex items-center gap-4">
                      <span className="w-28 shrink-0 text-[13px] font-medium text-slate-700 dark:text-slate-300">{a.cat[c.id]}</span>
                      <span className="flex-1 h-2 rounded-full bg-slate-900/[.06] dark:bg-white/[.08] overflow-hidden">
                        <span className="block h-full rounded-full transition-[width] duration-1000 ease-out delay-500" style={{ width: `${c.score}%`, backgroundColor: scoreColor(c.score) }} />
                      </span>
                      <span className="w-8 text-right text-[13px] font-mono font-bold tabular-nums text-slate-500 dark:text-slate-400">{c.score}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <div className="text-[11px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-5">{a.result.recsTitle}</div>
                <ol className="space-y-4">
                  {recs.map((id, i) => (
                    <li key={id} className="flex gap-4">
                      <span className="grid place-items-center h-7 w-7 shrink-0 rounded-full text-white font-mono text-[11px] font-bold shadow-lg" style={{ background: `linear-gradient(135deg,${['#0EA5E9','#10B981','#7C3AED'][i]}, ${['#0284C7','#059669','#6D28D9'][i]})` }}>
                        {i + 1}
                      </span>
                      <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">{a.recs[id]}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <button
                type="button"
                onClick={share}
                className="eco-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(16,185,129,0.6)] transition-all"
                style={{ backgroundImage: GRADIENTS.cta }}
              >
                {a.result.share}
              </button>
              <button
                type="button"
                onClick={restart}
                className="eco-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-900/[.05] dark:bg-white/[.05] hover:bg-slate-900/[.1] dark:hover:bg-white/[.1] transition-all"
              >
                ↺ {a.result.retake}
              </button>
            </div>
          </div>

          <div className="mt-12">
            <RelatedRoutes title={t.related.nextStep} routeKeys={['leaderboard', 'roi']} lang={lang} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
