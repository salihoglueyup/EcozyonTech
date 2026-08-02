import React from 'react';
import { SectionHeader } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';

export function ProcessTimeline() {
  const { lang } = useApp();
  const tr = lang === 'tr';

  const steps = [
    {
      title: tr ? 'İhtiyaç Analizi' : 'Needs Analysis',
      desc: tr 
        ? 'Uzmanlarımız karbon ayak izinizi ölçmek için mevcut altyapınızı analiz eder.' 
        : 'Our experts analyze your current infrastructure to measure your carbon footprint.',
      date: tr ? '1. Hafta' : 'Week 1',
    },
    {
      title: tr ? 'Donanım Kurulumu' : 'Hardware Setup',
      desc: tr 
        ? 'IoT sensörleri ve enerji ölçüm cihazları tesislerinize yerleştirilir.' 
        : 'IoT sensors and energy meters are deployed to your facilities.',
      date: tr ? '2. Hafta' : 'Week 2',
    },
    {
      title: tr ? 'Yazılım Entegrasyonu' : 'Software Integration',
      desc: tr 
        ? 'ERP, İK ve diğer kurumsal sistemleriniz Ecozyon API ile senkronize edilir.' 
        : 'Your ERP, HR, and other enterprise systems are synchronized with the Ecozyon API.',
      date: tr ? '3. Hafta' : 'Week 3',
    },
    {
      title: tr ? 'Pilot Test & Optimizasyon' : 'Pilot Test & Optimization',
      desc: tr 
        ? 'Canlı verilerle sistemin ilk testleri yapılır, AI modelleri ince ayarlanır.' 
        : 'Initial system tests with live data, AI models are fine-tuned.',
      date: tr ? '4. Hafta' : 'Week 4',
    },
    {
      title: tr ? 'Yaygınlaştırma' : 'Full Rollout',
      desc: tr 
        ? 'Tüm departmanların ve çalışanların platforma erişimi sağlanır.' 
        : 'All departments and employees gain access to the platform.',
      date: tr ? '5. Hafta' : 'Week 5',
    }
  ];

  return (
    <section id="process" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader 
          center 
          color="cyan" 
          eyebrow={tr ? 'Süreç' : 'Process'} 
          title={tr ? 'Ecozyon\'a Katılım Süreci' : 'Onboarding to Ecozyon'} 
          className="mb-16" 
        />

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-900/[.08] dark:bg-white/[.08] -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <Reveal key={i} delay={i * 100}>
                  <div className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Empty space for alternating layout on desktop */}
                    <div className="hidden md:block w-[45%]" />

                    {/* Timeline Node */}
                    <div className="absolute left-4 md:left-1/2 w-8 h-8 -translate-x-1/2 rounded-full border-4 border-white dark:border-slate-950 bg-cyan-500 shadow-[0_0_0_4px_rgba(14,165,233,0.15)] z-10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-[45%] pl-12 md:pl-0">
                      <div className="eco-card eco-lift rounded-3xl p-6 lg:p-8 relative hover:ring-cyan-500/30 transition-all duration-300">
                        {/* Decorative glow */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-10 transition-opacity duration-300" style={{ background: 'radial-gradient(circle at center, #0EA5E9 0%, transparent 70%)' }} />
                        
                        <div className="relative z-10">
                          <span className="inline-flex items-center rounded-full bg-slate-900/[.04] dark:bg-white/[.06] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-cyan-600 dark:text-cyan-400 uppercase mb-3">
                            {step.date}
                          </span>
                          <h3 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
