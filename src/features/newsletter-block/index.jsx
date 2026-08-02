import React, { useState } from 'react';
import { GRADIENTS } from '@/core/tokens';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';

export function NewsletterBlock() {
  const { lang } = useApp();
  const tr = lang === 'tr';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  return (
    <Reveal>
      <div className="relative rounded-3xl overflow-hidden mt-16 mb-8">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950">
          <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 80% 0%, rgba(14,165,233,.4), transparent 50%), radial-gradient(circle at 20% 100%, rgba(16,185,129,.4), transparent 50%)" }} />
        </div>

        <div className="relative p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-semibold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {tr ? 'Bültene Katıl' : 'Join Newsletter'}
            </div>
            
            <h3 className="font-display text-[26px] lg:text-[32px] tracking-tight text-white leading-tight mb-3">
              {tr ? 'Sürdürülebilirlik öngörüleri doğrudan kutunda.' : 'Sustainability insights, straight to your inbox.'}
            </h3>
            
            <p className="text-[14.5px] text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0">
              {tr 
                ? 'Ayda bir kez, karbon yönetimi ve ESG uyumluluğu hakkında uzman yazıları ve vaka analizleri gönderiyoruz. İstenmeyen e-posta yok.' 
                : 'Once a month, we send expert articles and case studies on carbon management and ESG compliance. No spam ever.'}
            </p>
          </div>

          <div className="w-full max-w-md lg:w-auto lg:min-w-[380px] shrink-0">
            <div className="eco-card backdrop-blur-xl bg-white/10 border-white/20 p-6 rounded-2xl shadow-2xl">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <h4 className="text-white font-medium text-[16px] mb-1">
                    {tr ? 'Aramıza hoş geldin!' : 'Welcome aboard!'}
                  </h4>
                  <p className="text-slate-300 text-[13px]">
                    {tr ? 'Aboneliğin başarıyla onaylandı.' : 'Your subscription has been confirmed.'}
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-[12px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                  >
                    {tr ? 'Yeni bir adres ekle' : 'Add another address'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div>
                    <label htmlFor="newsletter-email" className="sr-only">Email</label>
                    <input 
                      id="newsletter-email"
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={tr ? 'E-posta adresin' : 'Your email address'}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 rounded-xl font-medium text-[14px] text-white transition-opacity hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{ backgroundImage: GRADIENTS.cta }}
                  >
                    {status === 'loading' ? (
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : tr ? 'Abone Ol' : 'Subscribe'}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-1">
                    {tr ? 'İstediğin zaman abonelikten çıkabilirsin.' : 'You can unsubscribe at any time.'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
