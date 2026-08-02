import React from 'react';
import { SectionHeader } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';

export function CultureGrid() {
  const { lang } = useApp();
  const tr = lang === 'tr';

  const values = [
    {
      title: tr ? 'Etki Odaklı' : 'Impact Driven',
      desc: tr ? 'Yaptığımız her şeyin merkezinde sürdürülebilirlik ve dünyamıza kattığımız değer var.' : 'Sustainability and the value we add to our world are at the core of everything we do.',
      icon: '🌍',
      color: 'emerald',
    },
    {
      title: tr ? 'Sürekli Gelişim' : 'Continuous Growth',
      desc: tr ? 'Öğrenme bütçemiz ve açık iletişim kültürümüzle birbirimizi her gün daha iyiye taşıyoruz.' : 'With our learning budget and open communication culture, we push each other to be better every day.',
      icon: '🌱',
      color: 'cyan',
    },
    {
      title: tr ? 'Uzaktan Öncelikli' : 'Remote First',
      desc: tr ? 'Nereden çalıştığından ziyade ne başardığına odaklanıyor, esnekliği destekliyoruz.' : 'We focus on what you achieve rather than where you work from, supporting flexibility.',
      icon: '🏡',
      color: 'slate',
    },
    {
      title: tr ? 'Şeffaflık' : 'Transparency',
      desc: tr ? 'Tüm süreçlerimizde, kararlarımızda ve iletişimimizde dürüstlüğe önem veriyoruz.' : 'We value honesty in all our processes, decisions, and communication.',
      icon: '💡',
      color: 'amber',
    }
  ];

  return (
    <section id="culture" className="relative py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader 
          center 
          color="emerald" 
          eyebrow={tr ? 'Kültürümüz' : 'Our Culture'} 
          title={tr ? 'Ecozyon\'da Yaşam' : 'Life at Ecozyon'} 
          className="mb-12" 
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={i} delay={i * 50} className="h-full">
              <div className="eco-card eco-lift rounded-3xl p-6 flex flex-col h-full hover:ring-cyan-500/30 transition">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display text-[17px] tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                  {v.title}
                </h3>
                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  {v.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
