import React from 'react';
import { ArrowRight, Calendar, Sparkles, CheckCircle2, Shield, HeartPulse, Clock } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking, onOpenChat }) => {
  const { getSlot } = useSiteContent();

  const heroSlot = getSlot(
    'home_hero',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    'Consultório OralPro - Ambiente moderno e acolhedor'
  );

  const scrollToTreatments = () => {
    const el = document.getElementById('tratamentos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-100">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -z-10 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-900 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>OralPro Clínica Odontológica</span>
              <span className="text-blue-300">·</span>
              <span className="text-slate-600 font-normal">Saúde Bucal & Bem-Estar</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] text-balance">
              Seu sorriso merece o{' '}
              <span className="relative whitespace-nowrap text-blue-600 inline-block">
                melhor cuidado.
                <svg
                  className="absolute left-0 -bottom-1.5 w-full h-2.5 text-blue-200 -z-10"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Cuide da sua saúde bucal com atendimento humanizado, tecnologia e soluções odontológicas pensadas para você.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all group cursor-pointer text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Agende sua avaliação</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={scrollToTreatments}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold px-6 py-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer text-sm"
              >
                <span>Conheça nossos tratamentos</span>
              </button>
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-3 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">Humanizado</span>
                  <span className="text-[11px] text-slate-500">Cuidado individual</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">Segurança</span>
                  <span className="text-[11px] text-slate-500">Rigor clínico</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">Horários flex</span>
                  <span className="text-[11px] text-slate-500">Seg a Sábado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Clinical Photography with Trust Overlays */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
                <img
                  src={heroSlot.imageUrl}
                  alt={heroSlot.altText}
                  className="w-full aspect-[4/3] sm:aspect-[16/11] object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Badge Azul: Espaço Clínico OralPro posicionado no topo para nunca ser cortado no mobile */}
                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-md">
                    <span>Espaço Clínico OralPro</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Avaliação Inicial */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white p-3 sm:p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Atendimento Odontológico
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    Avaliação personalizada
                  </span>
                </div>
              </div>

              {/* Floating Badge 2: Atendente Virtual Trigger */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Agendamento Online Ativo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
