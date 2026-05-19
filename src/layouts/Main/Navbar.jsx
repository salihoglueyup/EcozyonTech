import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="bg-primary p-1.5 rounded-lg">
            <Zap size={20} className="text-white" />
          </div>
          Ecozyon<span className="text-primary font-light">Tech</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <Link to="/about" className="hover:text-white transition-colors">Hakkımızda</Link>
          <Link to="/services" className="hover:text-white transition-colors">Hizmetler</Link>
          <Link to="/contact" className="hover:text-white transition-colors">İletişim</Link>
        </div>

        <button className="hidden md:block px-5 py-2 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Bize Ulaşın
        </button>
      </div>
    </motion.nav>
  );
}
