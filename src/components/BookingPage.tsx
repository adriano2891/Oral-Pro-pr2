import React from 'react';
import { Calendar as CalendarIcon, Clock, ShieldCheck, ChevronRight, CheckCircle2, UserCheck, Video } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { BookingSystem } from './BookingSystem';
import { PageView } from '../types';

interface BookingPageProps {
  onNavigate: (page: PageView) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">
            {t.nav.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{t.common.scheduleMeeting}</span>
        </nav>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-10 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Atendimento com Hora Marcada · São Paulo - SP</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight text-balance">
            Agendar Avaliação Odontológica
          </h1>
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            Escolha o dia, horário e procedimento de sua preferência. Nossa equipe clínica e recepção estão prontas para oferecer a melhor experiência em saúde e estética bucal.
          </p>
        </div>

        {/* Key clinic guarantees */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12 text-left">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Atendimento Humanizado</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">Cuidado individualizado focado no seu conforto e bem-estar.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Pontualidade & Comodidade</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">Consultas organizadas com tempo dedicado exclusivo para você.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Segurança & Excelência</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">Protocolos rigorosos de esterilização e tecnologia moderna.</p>
            </div>
          </div>
        </div>

        {/* Embedded Interactive Booking System */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-16">
          <BookingSystem isOpenModal={false} onBookingSuccess={() => {}} />
        </div>
      </div>
    </div>
  );
};
