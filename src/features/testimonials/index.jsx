import { SectionHeader, QuoteMark, InitialsAvatar } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { Marquee } from '@/shared/ui/Marquee';
import { useApp } from '@/app/providers/AppProvider';

/**
 * Testimonials — auto-rotating social proof carousel (Marquee).
 * Reads from t.testimonials dictionary.
 */
export function Testimonials() {
  const { t } = useApp();
  const data = t.testimonials;
  const items = data?.items || [];

  if (!data || !items.length) return null;

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader center color="emerald" eyebrow={data.eyebrow} title={data.title} className="mb-12" />

        <Reveal>
          {/* Fading edges for the marquee */}
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <Marquee speed="40s" pauseOnHover className="py-4">
              {items.map((item, i) => (
                <div key={i} className="eco-card eco-lift rounded-3xl p-6 lg:p-8 w-[350px] shrink-0 mx-2 flex flex-col justify-between">
                  <div>
                    <QuoteMark className="h-6 w-6 text-cyan-500/40 mb-4" />
                    <blockquote className="font-display text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
                      "{item.quote}"
                    </blockquote>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <InitialsAvatar
                      initials={item.initials}
                      background="linear-gradient(135deg,#0EA5E9,#10B981)"
                      className="h-9 w-9 font-display text-[12px] shadow-sm shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">{item.name}</div>
                      <div className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate">{item.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
