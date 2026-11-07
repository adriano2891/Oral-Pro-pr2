import React from 'react';
import {
  PhoneCall,
  CheckSquare,
  Calendar,
  MessageCircle,
  Smile,
  ArrowRight,
} from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenBooking: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenBooking }) => {
  const steps = [
    {
      step: '01',
      icon: PhoneCall,
      title: 'Entre em contacto',
      description: 'Envie uma mensagem pelo site, fale com nossa assistente virtual ou chame nossa equipe no WhatsApp.',
    },
    {
      step: '02',
      icon: CheckSquare,
      title: 'Escolha o tratamento',
      description: 'Indique o procedimento desejado ou solicite uma avaliação geral se não tiver certeza.',
    },
    {
      step: '03',
      icon: Calendar,
      title: 'Solicite sua avaliação',
      description: 'Escolha o dia e o período (manhã, tarde ou noite) que melhor se encaixam no seu dia a dia.',
    },
    {
      step: '04',
      icon: MessageCircle,
      title: 'Receba orientação',
      description: 'Exame clínico detalhado, diálogo aberto sobre opções e plano de tratamento sem surpresas.',
    },
    {
      step: '05',
      icon: Smile,
      title: 'Inicie seu cuidado',
      description: 'Procedimentos realizados com conforto, biossegurança e acompanhamento contínuo da sua saúde bucal.',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Jornada do Paciente
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-3">
            Como funciona o atendimento?
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Uma sequência simples, transparente e sem burocracia para você cuidar do seu sorriso com total tranquilidade.
          </p>
        </div>

        {/* 5 Steps Timeline / Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {st.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Etapa {idx + 1} de 5
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar avaliação</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
