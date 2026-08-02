import React, { useState, useEffect } from 'react';
import { Reveal } from '@/shared/ui/useReveal';
import { useInView } from '@/shared/ui/useInView';

const LINES = [
  { text: "> ecozyon init --cloud", type: "input", delay: 0 },
  { text: "Initializing Ecozyon Cloud Environment...", type: "info", delay: 600 },
  { text: "Fetching nearest edge node...", type: "info", delay: 1200 },
  { text: "Connected to eu-central-1 (12ms ping)", type: "success", delay: 2000 },
  { text: "> ecozyon deploy --prod", type: "input", delay: 3500 },
  { text: "Bundling assets...", type: "info", delay: 4200 },
  { text: "Deploying AI inference models...", type: "info", delay: 5000 },
  { text: "Deployment successful! 🚀", type: "success", delay: 6500 },
  { text: "https://cloud.ecozyon.tech/ready", type: "link", delay: 7000 }
];

export function DeveloperPreview() {
  const [ref, seen] = useInView(0.5);
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    if (!seen) return;
    
    let timeouts = [];
    LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [seen]);

  return (
    <section className="relative py-20 lg:py-28 bg-slate-50 dark:bg-[#0b1220]">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        <Reveal>
          <div>
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-cyan-600 dark:text-cyan-400 mb-3">Developer Experience</div>
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
              Built for modern engineering teams.
            </h2>
            <p className="mt-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              Deploy your infrastructure globally in seconds. Our CLI and SDKs are designed to integrate seamlessly into your existing CI/CD pipelines, giving you full programmatic control over your cloud environment.
            </p>
            <div className="mt-8 flex gap-4">
               <button className="rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13px] font-medium text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition">
                 Read the Docs
               </button>
               <button className="rounded-full bg-transparent px-5 py-2.5 text-[13px] font-medium text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition">
                 View GitHub
               </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div ref={ref} className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-slate-800">
               <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
               </div>
               <div className="mx-auto text-[11px] font-mono text-slate-500">bash — ecozyon-cli</div>
            </div>
            {/* Terminal Body */}
            <div className="p-5 font-mono text-[13px] leading-relaxed h-[280px] overflow-hidden">
               {LINES.map((line, i) => (
                 <div 
                   key={i} 
                   className={`
                     transition-opacity duration-300
                     ${visibleLines.includes(i) ? 'opacity-100' : 'opacity-0 hidden'}
                     ${line.type === 'input' ? 'text-cyan-400 mt-2' : ''}
                     ${line.type === 'info' ? 'text-slate-400' : ''}
                     ${line.type === 'success' ? 'text-emerald-400' : ''}
                     ${line.type === 'link' ? 'text-indigo-400 underline cursor-pointer mt-2' : ''}
                   `}
                 >
                   {line.text}
                 </div>
               ))}
               {/* Blinking cursor */}
               {visibleLines.length > 0 && (
                 <div className="inline-block w-2 h-4 ml-1 bg-slate-400 animate-pulse align-middle"></div>
               )}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
