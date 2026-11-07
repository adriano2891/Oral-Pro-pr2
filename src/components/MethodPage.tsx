import React from 'react';
import { Heart, UserCheck, Home, Smile, Compass, Award, Check, ArrowRight, ChevronRight, Calendar, PhoneCall, CheckSquare, MessageCircle } from 'lucide-react';
import { PageView } from '../types';

interface MethodPageProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const MethodPage: React.FC<MethodPageProps> = ({ onNavigate, onOpenBooking, onOpenChat }) => {
  const differentiators = [
    {
      icon: Heart,
      title: 'Atendimento Humanizado',
      description: 'Acolhimento com calma, escuta ativa e empatia desde o primeiro contato, garantindo que você se sinta seguro e tranquilo.',
      details: ['Escuta atenta das suas queixas', 'Atendimento sem pressa', 'Respeito ao paciente'],
    },
    {
      icon: UserCheck,
      title: 'Atenção Individualizada',
      description: 'Cada paciente é único. Nossos planos de cuidado são estruturados sob medida para suas necessidades clínicas e objetivos.',
      details: ['Planejamento personalizado', 'Diagnóstico criterioso', 'Foco na sua saúde integral'],
    },
    {
      icon: Home,
      title: 'Ambiente Acolhedor',
      description: 'Um espaço clínico moderno, limpo, agradável e planejado para transformar sua visita ao dentista numa experiência positiva.',
      details: ['Instalações modernas', 'Conforto e bem-estar', 'Biossegurança rigorosa'],
    },
    {
      icon: Smile,
      title: 'Cuidado com Cada Sorriso',
      description: 'Foco na prevenção, na preservação dos dentes naturais e na harmonia funcional e estética de toda a arcada dentária.',
      details: ['Preservação do dente natural', 'Prevenção de problemas futuros', 'Estética natural'],
    },
    {
      icon: Compass,
      title: 'Orientação no Tratamento',
      description: 'Explicamos com total clareza cada etapa do procedimento, esclarecendo dúvidas e orientando sobre os cuidados após a consulta.',
      details: ['Explicação passo a passo', 'Acompanhamento pós-consulta', 'Transparência em orçamentos'],
    },
    {
      icon: Award,
      title: 'Compromisso com a Qualidade',
      description: 'Rigor ético, padrões elevados de biossegurança e dedicação constante ao aperfeiçoamento das práticas odontológicas.',
      details: ['Materiais biocompatíveis', 'Padrão clínico certificado', 'Ética médica odontológica'],
    },
  ];

  const steps = [
    { step: '01', title: 'Entre em contacto', desc: 'Envie uma mensagem pelo site, WhatsApp oficial ou fale com nossa assistente virtual.' },
    { step: '02', title: 'Escolha o tratamento', desc: 'Indique o procedimento desejado ou solicite uma avaliação clínica inicial completa.' },
    { step: '03', title: 'Solicite sua avaliação', desc: 'Escolha o dia e período (manhã, tarde ou noite) que melhor se encaixam na sua rotina.' },
    { step: '04', title: 'Receba orientação da equipe', desc: 'Exame clínico cuidadoso, diagnóstico compreensível e orçamento transparente.' },
    { step: '05', title: 'Inicie seu acompanhamento', desc: 'Procedimentos realizados com total carinho, segurança e foco no seu bem-estar.' },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors cursor-pointer">
            Início
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Diferenciais e Metodologia</span>
        </nav>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Diferenciais da OralPro
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-3">
            Por que escolher nossa clínica odontológica?
          </h1>
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            Nossa filosofia combina o rigor da odontologia moderna com o calor do atendimento humanizado, colocando você e a saúde do seu sorriso no centro de cada decisão.
          </p>
        </div>

        {/* 6 Differentiators Detailed Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 text-left">
          {differentiators.map((diff, idx) => {
            const Icon = diff.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{diff.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{diff.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                  {diff.details.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 5-Step Patient Journey */}
        <div className="mb-20 text-left">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Jornada do Paciente</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
              Como funciona o seu atendimento
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((st) => (
              <div key={st.step} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                  {st.step}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{st.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold">Venha conhecer a nossa equipe</h3>
            <p className="text-xs sm:text-sm text-slate-300">Marque a sua consulta de avaliação e tire todas as suas dúvidas.</p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar avaliação</span>
          </button>
        </div>
      </div>
    </div>
  );
};
