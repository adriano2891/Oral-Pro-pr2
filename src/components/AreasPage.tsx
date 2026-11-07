import React from 'react';
import { Sparkles, CheckCircle2, ChevronRight, Calendar, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { PageView } from '../types';

interface AreasPageProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const AreasPage: React.FC<AreasPageProps> = ({ onNavigate, onOpenBooking, onOpenChat }) => {
  const specialties = [
    {
      title: 'Implantologia & Reabilitação',
      badge: 'Mastigação & Firmeza',
      description: 'Substituição definitiva de dentes perdidos com implantes em titânio e coroas estéticas de alta biocompatibilidade.',
      benefits: ['Recuperação total da função mastigatória', 'Preservação da estrutura óssea facial', 'Segurança e naturalidade ao sorrir'],
      tagline: 'Recupere o prazer de mastigar e sorrir sem insegurança.',
    },
    {
      title: 'Ortodontia & Alinhadores',
      badge: 'Alinhamento & Oclusão',
      description: 'Correção de dentes desalinhados, mordida cruzada e diastemas com aparelhos fixos ou alinhadores invisíveis modernos.',
      benefits: ['Melhora na higienização e respiração', 'Harmonia do arco dentário', 'Opções discretas e confortáveis'],
      tagline: 'Dentes perfeitamente alinhados para toda a vida.',
    },
    {
      title: 'Estética Dental & Clareamento',
      badge: 'Luminosidade & Harmonia',
      description: 'Facetas em resina, lentes de contato e clareamento a laser para transformar a cor, o formato e o brilho dos dentes.',
      benefits: ['Remoção de manchas e pigmentos', 'Recontorno estético proporcional', 'Acabamento natural e radiante'],
      tagline: 'O sorriso que você sempre sonhou com naturalidade.',
    },
    {
      title: 'Endodontia & Prevenção Geral',
      badge: 'Alívio da Dor & Saúde',
      description: 'Tratamento de canal seguro e profilaxia regular para salvar dentes naturais e manter as gengivas fortes e saudáveis.',
      benefits: ['Eliminação rápida da dor de dente', 'Preservação do dente na boca', 'Prevenção de cáries e periodontite'],
      tagline: 'Cuidado contínuo para evitar urgências e preservar seus dentes.',
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors cursor-pointer">
            Início
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Áreas Clínicas</span>
        </nav>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Especialidades
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-3">
            Áreas de Cuidado Odontológico
          </h1>
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            Soluções completas e integradas para devolver a saúde, a estabilidade e a beleza do seu sorriso com técnicas avançadas.
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {specialties.map((spec) => (
            <div
              key={spec.title}
              className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded">
                    {spec.badge}
                  </span>
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {spec.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {spec.description}
                </p>

                <div className="space-y-2 mb-6">
                  {spec.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 italic">{spec.tagline}</span>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Avaliar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-blue-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold">Tem dúvidas sobre qual tratamento é o mais indicado?</h3>
            <p className="text-xs sm:text-sm text-blue-100">Agende uma consulta de avaliação para realizarmos um diagnóstico preciso.</p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Agendar consulta
          </button>
        </div>
      </div>
    </div>
  );
};
