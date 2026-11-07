import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, Calendar, ChevronRight, MessageCircle, Info, X, ExternalLink, Headset } from 'lucide-react';
import { CLINIC_ATTENDANCE_DATA, TreatmentItem } from '../data/attendanceData';
import { PageView } from '../types';

interface ServicesPageProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
  onNavigate?: (page: PageView) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenBooking, onOpenChat, onNavigate }) => {
  const [activeTreatment, setActiveTreatment] = useState<TreatmentItem | null>(null);
  const treatments = CLINIC_ATTENDANCE_DATA.treatments;

  const openWhatsAppWithTreatment = (treatmentName: string) => {
    const text = encodeURIComponent(
      `Olá! Vim pelo site da OralPro e gostaria de saber mais informações sobre o tratamento de ${treatmentName}.`
    );
    window.open(`https://wa.me/${CLINIC_ATTENDANCE_DATA.whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        {onNavigate && (
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
            <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Início
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Tratamentos Odontológicos</span>
          </nav>
        )}

        {/* Header */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Catálogo Completo
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-3">
            Nossos Tratamentos Odontológicos
          </h1>
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            Conheça todas as especialidades clínicas disponíveis na OralPro. Do alívio da dor aos tratamentos estéticos e reabilitação oral com implantes.
          </p>
        </div>

        {/* 10 Treatments Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 text-left">
          {treatments.map((tr) => (
            <div
              key={tr.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Disponível
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {tr.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {tr.shortDesc}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
                  <span className="font-semibold text-slate-800 block mb-0.5">Para que serve:</span>
                  {tr.purpose}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Estimativa</span>
                  <span className="text-xs font-bold text-blue-700">{tr.demoPrice}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTreatment(tr)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Ver detalhes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Notice Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs max-w-3xl mx-auto flex items-start gap-3 text-left mb-12">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong className="text-amber-950">Aviso sobre estimativas: </strong>
            {CLINIC_ATTENDANCE_DATA.priceDisclaimer}
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-blue-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold">Deseja agendar uma avaliação odontológica?</h3>
            <p className="text-xs sm:text-sm text-blue-100">Nossa equipe está pronta para orientar o melhor tratamento para você.</p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Agendar avaliação
          </button>
        </div>
      </div>

      {/* Modal Saiba Mais */}
      {activeTreatment && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Procedimento Odontológico
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {activeTreatment.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTreatment(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 block mb-1">Sobre o procedimento</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{activeTreatment.shortDesc}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-blue-700 block mb-1">Para que serve:</span>
              <p className="text-xs text-slate-600 leading-relaxed">{activeTreatment.purpose}</p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-900 font-medium">Estimativa demonstrativa:</span>
                <strong className="text-blue-800 font-black">{activeTreatment.demoPrice}</strong>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">{CLINIC_ATTENDANCE_DATA.priceDisclaimer}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTreatment(null);
                  onOpenBooking();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar avaliação</span>
              </button>

              <button
                type="button"
                onClick={() => openWhatsAppWithTreatment(activeTreatment.name)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Headset className="w-4 h-4 text-emerald-600" />
                <span>Tirar dúvidas no WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
