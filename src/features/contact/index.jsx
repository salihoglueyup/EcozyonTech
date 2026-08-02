import React, { useState, useEffect } from 'react';
import { SpotlightCard } from '@/shared/ui/SpotlightCard';
import { TiltCard } from '@/shared/ui/TiltCard';
import { ArrowRight } from '@/shared/ui/primitives';
import { SuccessCheck } from '@/shared/ui/SuccessCheck';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { STATS } from '@/pages/Contact';

export function BentoForm({ t, lang }) {
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });
  const [topic, setTopic] = useState('sales');
  const [shake, setShake] = useState(false);

  const isTr = lang === 'tr';

  const getSpotlightColor = () => {
    switch(topic) {
      case 'sales': return 'rgba(16,185,129,0.15)'; // Emerald
      case 'support': return 'rgba(14,165,233,0.15)'; // Cyan
      case 'press': return 'rgba(139,92,246,0.15)'; // Violet
      default: return 'rgba(14,165,233,0.15)';
    }
  };

  const getAIFeedback = () => {
    const len = formData.message.length;
    if (len === 0) return '';
    if (len < 10) return isTr ? 'Analiz ediliyor...' : 'Analyzing...';
    if (len < 30) return isTr ? 'Detayları bekliyoruz...' : 'Waiting for more details...';
    return isTr ? 'Harika detay! Mühendislerimiz bunu çok sevecek.' : 'Great detail! Our engineers will love this.';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (status === 'loading') return;
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', company: '', email: '', message: '' });
      }, 5000);
    }, 1500);
  };

  return (
    <TiltCard tiltMaxAngleX={2} tiltMaxAngleY={2} className={`h-full ${shake ? 'animate-shake' : ''}`}>
      <SpotlightCard className="h-full flex flex-col rounded-3xl bg-white/60 dark:bg-[#0b1220]/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-sm p-8 transition-colors duration-500" color={getSpotlightColor()}>
        
        {/* Topic Selector */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl self-start">
          {[
            { id: 'sales', label: isTr ? 'Satış' : 'Sales' },
            { id: 'support', label: isTr ? 'Destek' : 'Support' },
            { id: 'press', label: isTr ? 'Basın' : 'Press' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${topic === t.id ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={isTr ? 'İsim' : 'Name'}
              value={formData.name}
              onChange={(e) => setFormData(d => ({...d, name: e.target.value}))}
              className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[14px] text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-colors"
            />
            <input
              type="email"
              placeholder={isTr ? 'E-posta' : 'Email'}
              value={formData.email}
              onChange={(e) => setFormData(d => ({...d, email: e.target.value}))}
              className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[14px] text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div className="relative flex-1 flex flex-col">
            <textarea
              rows={4}
              placeholder={isTr ? 'Nasıl yardımcı olabiliriz?' : 'How can we help?'}
              value={formData.message}
              onChange={(e) => setFormData(d => ({...d, message: e.target.value}))}
              className="w-full flex-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[14px] text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-colors resize-none mb-1"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
              <span className={`text-[11px] font-bold transition-opacity duration-300 ${formData.message.length > 20 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {getAIFeedback()}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {formData.message.length} / 500
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={`mt-2 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-[14px] font-bold text-white transition-all duration-300 ${
              status === 'success' 
                ? 'bg-emerald-500' 
                : topic === 'sales' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : topic === 'support' ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
            } hover:scale-[1.02] shadow-sm`}
          >
            {status === 'loading' ? (isTr ? 'İletiliyor...' : 'Transmitting...') : status === 'success' ? (isTr ? 'Ulaştı' : 'Delivered') : (isTr ? 'Gönder' : 'Submit')}
            {status === 'success' && <SuccessCheck className="h-4 w-4" />}
            {status === 'idle' && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </SpotlightCard>
    </TiltCard>
  );
}

export function BentoEmail({ lang }) {
  const isTr = lang === 'tr';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('hello@ecozyon.tech');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TiltCard tiltMaxAngleX={8} tiltMaxAngleY={8} className="h-full cursor-pointer" >
      <div onClick={handleCopy} className="h-full">
        <SpotlightCard className="h-full group flex flex-col justify-between rounded-3xl bg-white/60 dark:bg-[#0b1220]/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 p-8 hover:bg-white dark:hover:bg-slate-900 transition-colors" color="rgba(16,185,129,0.1)">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-white'}`}>
            {copied ? <SuccessCheck className="h-5 w-5" /> : <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
          </div>
          <div>
            <div className={`text-[12px] font-bold uppercase tracking-widest mb-1 transition-colors ${copied ? 'text-emerald-500' : 'text-slate-400'}`}>
              {copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Doğrudan Ulaş' : 'Direct Email')}
            </div>
            <div className="font-display text-[20px] font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">
              hello@ecozyon.tech
            </div>
          </div>
        </SpotlightCard>
      </div>
    </TiltCard>
  );
}

export function BentoLocation({ lang }) {
  const isTr = lang === 'tr';
  const [time, setTime] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const istanbulTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Istanbul', hour12: false });
      setTime(istanbulTime);
      const hour = parseInt(istanbulTime.split(':')[0], 10);
      setIsOnline(hour >= 9 && hour < 18);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TiltCard tiltMaxAngleX={8} tiltMaxAngleY={8} className="h-full">
      <SpotlightCard className="h-full relative overflow-hidden group flex flex-col justify-between rounded-3xl bg-white/60 dark:bg-[#0b1220]/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 p-8" color="rgba(14,165,233,0.1)">
        {/* Radar Background */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full border border-cyan-500/20 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.2)_360deg)] animate-[spin_4s_linear_infinite]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-display font-bold text-slate-900 dark:text-white tabular-nums tracking-wider">{time}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{isTr ? 'Yerel Saat' : 'Local Time'}</div>
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
              {isOnline ? (isTr ? 'Sistemler Aktif' : 'Systems Online') : (isTr ? 'Ekip Dinleniyor' : 'Team Away')}
            </div>
          </div>
          <div className="font-display text-[20px] font-bold text-slate-900 dark:text-white">
            Istanbul, TR
          </div>
        </div>
      </SpotlightCard>
    </TiltCard>
  );
}

export function BentoStats({ t, lang }) {
  const isTr = lang === 'tr';
  return (
    <TiltCard tiltMaxAngleX={4} tiltMaxAngleY={4} className="h-full">
      <SpotlightCard className="h-full rounded-3xl bg-white/60 dark:bg-[#0b1220]/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 p-8 flex flex-col justify-between" color="rgba(16,185,129,0.1)">
        <div className="flex items-center justify-between mb-8">
          <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{t.contact.presence.title}</div>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-display text-[32px] lg:text-[40px] font-bold text-slate-900 dark:text-white leading-none">
              <AnimatedNumber value={STATS.users} play={true} format={n => new Intl.NumberFormat().format(Math.floor(n))} />
            </div>
            <div className="text-[13px] text-slate-500 mt-1">{t.contact.presence.members}</div>
          </div>
          <div>
            <div className="font-display text-[32px] lg:text-[40px] font-bold text-slate-900 dark:text-white leading-none">
              <AnimatedNumber value={STATS.co2} play={true} format={n => new Intl.NumberFormat().format(Math.floor(n))} />
            </div>
            <div className="text-[13px] text-slate-500 mt-1">{t.contact.presence.co2}</div>
          </div>
        </div>
      </SpotlightCard>
    </TiltCard>
  );
}

export function BentoTimeline({ t, lang }) {
  return (
    <TiltCard tiltMaxAngleX={4} tiltMaxAngleY={4} className="h-full">
      <SpotlightCard className="h-full rounded-3xl bg-white/60 dark:bg-[#0b1220]/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 p-8 flex flex-col" color="rgba(14,165,233,0.1)">
        <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-6">{t.contact.nextTitle}</div>
        <div className="flex-1 relative flex flex-col justify-center">
          <span aria-hidden="true" className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-500/50 via-cyan-500/30 to-transparent rounded-full" />
          <ol className="space-y-6 relative z-10">
            {t.contact.nextSteps.slice(0,2).map((step, i) => (
              <li key={i} className="relative pl-10">
                <span className="absolute left-0 top-0 inline-flex h-6 w-6 items-center justify-center rounded-full text-white font-display text-[10px] font-bold shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${["#10B981","#0EA5E9"][i]}, ${["#059669","#0284C7"][i]})` }}>
                  {i + 1}
                </span>
                <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">{step.t}</div>
                <div className="text-[12px] text-slate-500 leading-relaxed mt-0.5">{step.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </SpotlightCard>
    </TiltCard>
  );
}

export function BentoSocial({ lang }) {
  const isTr = lang === 'tr';
  const socials = [
    { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
    { name: 'Twitter / X', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' }
  ];

  return (
    <TiltCard tiltMaxAngleX={4} tiltMaxAngleY={4} className="h-full">
      <SpotlightCard className="h-full rounded-3xl bg-white/60 dark:bg-[#0b1220]/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 p-8 flex flex-col justify-between" color="rgba(99,102,241,0.1)">
        <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{isTr ? 'Bizi Takip Edin' : 'Follow Us'}</div>
        <div className="flex gap-4 mt-6">
          {socials.map(s => (
            <a key={s.name} href="#" className="flex-1 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-colors group">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="currentColor"><path d={s.icon}/></svg>
              <span className="text-[12px] font-bold text-slate-900 dark:text-white">{s.name}</span>
            </a>
          ))}
        </div>
      </SpotlightCard>
    </TiltCard>
  );
}