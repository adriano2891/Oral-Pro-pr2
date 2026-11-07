import React from 'react';
import { MessageCircle, Calendar, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { CLINIC_ATTENDANCE_DATA } from '../data/attendanceData';

interface CTASectionProps {
  onOpenBooking: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenBooking }) => {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Vim pelo site OralPro e gostaria de falar com a equipe para cuidar do meu sorriso.'
    );
    window.open(`https://wa.me/${CLINIC_ATTENDANCE_DATA.whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-semibold text-blue-300">
          <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
          <span>Atendimento Humanizado & Especializado</span>
        </div>

        {/* Title requested by user */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Está na hora de cuidar do seu sorriso?
        </h2>

        {/* Subtitle requested by user */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Estamos prontos para ajudar você a dar o próximo passo para uma saúde bucal melhor.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={openWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-600/20 transition-all cursor-pointer text-sm tracking-wide"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Falar com nossa equipe</span>
          </button>

          <button
            type="button"
            onClick={onOpenBooking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 transition-colors cursor-pointer text-sm"
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Ver horários de avaliação</span>
          </button>
        </div>

        <div className="pt-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4">
          <span>WhatsApp oficial: +55 (11) 93473-9629</span>
          <span className="hidden sm:inline">•</span>
          <span>Atendimento em horário comercial</span>
        </div>
      </div>
    </section>
  );
};
