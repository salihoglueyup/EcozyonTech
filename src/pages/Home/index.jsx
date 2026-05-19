import { motion } from 'framer-motion';
import { ArrowRight, Code, Cpu, Globe } from 'lucide-react';
import heroBg from '../../assets/hero_bg.png';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Hero Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-primary font-medium text-sm"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Dijital Geleceğe Hoş Geldiniz
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl"
          >
            Teknolojiyi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Sanata</span> Dönüştürüyoruz
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl font-light"
          >
            Ecozyon Tech olarak, işletmenizi geleceğe taşıyacak yenilikçi, hızlı ve güvenilir dijital çözümler üretiyoruz.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <button className="px-8 py-4 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95">
              Hemen Başla <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-md hover:scale-105 active:scale-95">
              Çözümlerimizi İncele
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Neden Ecozyon Tech?</h2>
            <p className="text-white/50 max-w-2xl mx-auto">Modern mimari, yüksek performans ve premium kullanıcı deneyimi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Code size={32} className="text-blue-400" />}
              title="Modern Geliştirme"
              desc="En güncel teknolojiler (React, Tailwind, Framer Motion) ile hızlı ve ölçeklenebilir altyapılar kuruyoruz."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Cpu size={32} className="text-purple-400" />}
              title="Yüksek Performans"
              desc="Optimize edilmiş kod yapısı ile sınırları zorlayan, saniyeler içinde yüklenen premium projeler."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Globe size={32} className="text-emerald-400" />}
              title="Küresel Standartlar"
              desc="SEO uyumlu, erişilebilir ve tüm cihazlarda kusursuz çalışan uluslararası kalitede dijital ürünler."
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors group"
    >
      <div className="bg-white/5 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
