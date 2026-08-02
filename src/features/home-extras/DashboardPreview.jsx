import React from 'react';
import { useApp } from '@/app/providers/AppProvider';
import { Reveal } from '@/shared/ui/useReveal';
import { Sparkline } from '@/shared/ui/charts';

export function DashboardPreview() {
  const { t } = useApp();
  
  return (
    <section className="relative py-12 lg:py-16 -mt-10 lg:-mt-20 z-10 hidden sm:block">
       <div className="mx-auto max-w-5xl px-6">
         <Reveal>
           <div className="relative rounded-2xl border border-white/20 dark:border-white/[.08] bg-white/60 dark:bg-[#0f172a]/70 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-slate-900/[.05] dark:ring-white/[.05]"
                style={{ transform: "perspective(1200px) rotateX(4deg)", transformOrigin: 'top center' }}>
             
             {/* Mac style header */}
             <div className="flex items-center gap-2 px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-white/10">
               <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                 <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                 <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
               </div>
               <div className="mx-auto text-[11px] font-mono text-slate-500 dark:text-slate-400">ecozyon-cloud-dashboard</div>
             </div>
             
             {/* Mock UI Content */}
             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Panel 1 */}
                <div className="col-span-2 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-white/[.02] p-5">
                   <div className="flex items-center justify-between mb-4">
                     <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">Global Traffic (Live)</div>
                     <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                       </span>
                       System Nominal
                     </div>
                   </div>
                   <Sparkline data={[12, 14, 18, 15, 22, 28, 25, 30, 35, 32, 40, 45]} color="#0EA5E9" height={60} width={400} className="w-full h-16 opacity-80" />
                </div>
                
                {/* Panel 2 */}
                <div className="rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-white/[.02] p-5">
                  <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-4">AI Inference Nodes</div>
                  <div className="space-y-4 mt-6">
                     {[
                       { label: 'eu-central-1', load: 45, color: 'bg-emerald-500' },
                       { label: 'us-east-2', load: 78, color: 'bg-amber-500' },
                       { label: 'ap-south-1', load: 22, color: 'bg-cyan-500' }
                     ].map(node => (
                       <div key={node.label}>
                         <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                           <span className="font-mono">{node.label}</span>
                           <span>{node.load}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${node.color} animate-pulse`} style={{ width: `${node.load}%`, animationDuration: `${2 + Math.random()}s` }}></div>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
             </div>
           </div>
         </Reveal>
       </div>
    </section>
  );
}
