import React from 'react';
import { ShieldCheck, ChevronRight, Heart, Award, Sparkles, CheckCircle2, Calendar, MessageCircle, MapPin } from 'lucide-react';
import { PageView } from '../types';
import { CLINIC_ATTENDANCE_DATA } from '../data/attendanceData';

interface AboutPageProps {
  onOpenBooking: () => void;
  onNavigate?: (page: PageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking, onNavigate }) => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        {onNavigate && (
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Início
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Sobre a clínica</span>
          </nav>
        )}

        {/* Header */}
        <div className="max-w-3xl mb-12 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Institucional OralPro
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-3">
            Sobre a OralPro Clínica Odontológica
          </h1>
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            Uma clínica moderna criada com o propósito de unir atendimento humanizado, precisão técnica e cuidado individualizado com a saúde e a estética do seu sorriso.
          </p>
        </div>

        {/* Narrative & Visuals */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16 text-left">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Nosso compromisso com você
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Na OralPro, acreditamos que ir ao dentista deve ser uma experiência tranquila, acolhedora e positiva. Sabemos que a saúde bucal impacta diretamente a sua qualidade de vida, mastigação, respiração e autoconfiança ao sorrir.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Por isso, estruturamos uma abordagem que prioriza a escuta atenta, o diagnóstico minucioso e a elaboração de planos de tratamento claros, sem pressa e adaptados ao ritmo e às necessidades de cada paciente.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Heart className="w-5 h-5 text-rose-600 mb-2" />
                <h3 className="font-bold text-slate-900 text-sm mb-1">Atendimento Humanizado</h3>
                <p className="text-xs text-slate-600">Empatia, escuta ativa e respeito em cada consulta.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                <h3 className="font-bold text-slate-900 text-sm mb-1">Qualidade & Segurança</h3>
                <p className="text-xs text-slate-600">Biossegurança e materiais certificados de alta durabilidade.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
                alt="Ambiente OralPro"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-bold text-sm">Instalações Projetadas para o Seu Bem-Estar</p>
                <p className="text-xs text-slate-200">Localização privilegiada na Av. Paulista em São Paulo, com fácil estacionamento.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Pronto para cuidar do seu sorriso?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Agende sua avaliação odontológica e venha nos conhecer pessoalmente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar avaliação</span>
            </button>
            <a
              href={`https://wa.me/${CLINIC_ATTENDANCE_DATA.whatsappNumber}?text=${encodeURIComponent(CLINIC_ATTENDANCE_DATA.defaultWhatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              title="Falar no WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
