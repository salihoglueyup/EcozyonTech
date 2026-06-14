import { GRADIENTS } from '@/core/tokens';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';

function ErrorFallback({ onReset }) {
  const { lang } = useApp();
  const tr = lang === 'tr';
  return (
    <section className="min-h-[70vh] grid place-items-center px-6 py-24">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/[.12] text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/15 dark:ring-rose-400/20">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 8v5M12 16.5v.5" strokeLinecap="round" />
            <path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight text-slate-900 dark:text-slate-100">
          {tr ? 'Bir şeyler ters gitti' : 'Something went wrong'}
        </h1>
        <p className="mt-3 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {tr
            ? 'Beklenmedik bir hata oluştu. Sayfayı yenileyebilir ya da ana sayfaya dönebilirsin.'
            : 'An unexpected error occurred. Try reloading the page or going back home.'}
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white"
            style={{ backgroundImage: GRADIENTS.cta }}
          >
            {tr ? 'Tekrar dene' : 'Try again'}
          </button>
          <Link
            to="/"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-white/[.06] border border-white/70 dark:border-white/[.1] ring-1 ring-slate-900/[.06] dark:ring-white/[.06] hover:bg-white dark:hover:bg-white/[.1] transition"
          >
            {tr ? 'Ana sayfa' : 'Home'}
          </Link>
        </div>
      </div>
    </section>
  );
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface in dev; a real app would forward this to error tracking.
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  reset() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.reset} />;
    }
    return this.props.children;
  }
}
