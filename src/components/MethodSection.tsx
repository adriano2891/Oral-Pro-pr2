import React from 'react';
import {
  Heart,
  UserCheck,
  Home,
  Smile,
  Compass,
  Award,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { PageView } from '../types';

interface MethodSectionProps {
  onOpenBooking: () => void;
  onNavigate?: (page: PageView) => void;
}

export const MethodSection: React.FC<MethodSectionProps> = ({
  onOpenBooking,
  onNavigate,
}) => {
  const differentiators = [
    {
      icon: Heart,
      title: 'Atendimento Humanizado',
      description: 'Acolhimento com calma, escuta ativa e empatia desde o primeiro contato, garantindo que você se sinta seguro e tranquilo.',
      tag: 'Acolhimento',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      icon: UserCheck,
      title: 'Atenção Individualizada',
      description: 'Cada paciente é único. Nossos planos de cuidado são estruturados sob medida para suas necessidades clínicas e objetivos.',
      tag: 'Personalizado',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      icon: Home,
      title: 'Ambiente Acolhedor',
      description: 'Um espaço clínico moderno, limpo, agradável e planejado para transformar sua visita ao dentista numa experiência positiva.',
      tag: 'Conforto',
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },
    {
      icon: Smile,
      title: 'Cuidado com Cada Sorriso',
      description: 'Foco na prevenção, na preservação dos dentes naturais e na harmonia funcional e estética de toda a arcada dentária.',
      tag: 'Saúde Integral',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      icon: Compass,
      title: 'Orientação no Tratamento',
      description: 'Explicamos com total clareza cada etapa do procedimento, esclarecendo dúvidas e orientando sobre os cuidados após a consulta.',
      tag: 'Transparência',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      icon: Award,
      title: 'Compromisso com a Qualidade',
      description: 'Rigor ético, padrões elevados de biossegurança e dedicação constante ao aperfeiçoamento das práticas odontológicas.',
      tag: 'Excelência',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <section id="metodo" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">
            Nossos Diferenciais
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3">
            Por que escolher nossa clínica?
          </h2>
          <p className="text-slate-400 mt-4 text-base leading-relaxed">
            Acreditamos que a odontologia vai muito além dos procedimentos: trata-se de confiança, cuidado genuíno e respeito a quem confia o sorriso a nós.
          </p>
        </div>

        {/* 6 Differentiator Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((diff, idx) => {
            const Icon = diff.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:bg-slate-800 hover:border-blue-500/60 transition-all text-left flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {diff.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {diff.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {diff.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold">
                  <span>Padrão OralPro</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner inside Method */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/80 to-slate-800 border border-blue-700/40 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left space-y-1">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Quer conhecer nossa clínica de perto?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Agende uma visita de avaliação para conversarmos sobre os cuidados ideais para o seu sorriso.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors shadow-md shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar avaliação</span>
          </button>
        </div>
      </div>
    </section>
  );
};
