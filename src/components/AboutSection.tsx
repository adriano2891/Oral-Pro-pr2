import React from 'react';
import { Heart, ShieldCheck, UserCheck, Sparkles, Award, ArrowRight, MessageCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { PageView } from '../types';

interface AboutSectionProps {
  onOpenBooking: () => void;
  onNavigate?: (page: PageView) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking, onNavigate }) => {
  const { getSlot } = useSiteContent();

  const aboutSlot = getSlot(
    'home_about',
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    'Atendimento acolhedor na OralPro'
  );

  const pillars = [
    {
      icon: Heart,
      title: 'Atendimento Humanizado',
      description: 'Priorizamos a escuta atenta, o respeito ao seu tempo e o acolhimento sem pressa para que você se sinta seguro e confortável.',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      icon: UserCheck,
      title: 'Cuidado Individualizado',
      description: 'Cada paciente possui um histórico único. Desenvolvemos planos de tratamento personalizados para as suas reais necessidades.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: ShieldCheck,
      title: 'Qualidade nos Tratamentos',
      description: 'Rigor absoluto em biossegurança, materiais odontológicos de alta durabilidade e técnicas clínicas respaldadas cientificamente.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: Sparkles,
      title: 'Busca por Excelência',
      description: 'Dedicação diária à saúde bucal, estética funcional e ao aprimoramento constante para proporcionar resultados duradouros.',
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Sobre a OralPro
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-3">
            Cuidado humanizado e compromisso com o seu sorriso
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            A OralPro é uma clínica odontológica dedicada a transformar a saúde bucal e o bem-estar dos nossos pacientes através de uma odontologia ética, acolhedora e atenta a cada detalhe.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image with Quality Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src={aboutSlot.imageUrl}
                alt={aboutSlot.altText}
                className="w-full aspect-[4/3] sm:aspect-[16/11] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-600 text-[11px] font-bold mb-1 shadow-sm">
                  <span>Compromisso OralPro</span>
                </div>
                <h4 className="text-base font-bold text-white drop-shadow-xs">
                  Saúde bucal integrada com carinho e respeito
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">
                  Consultas com tempo dedicado para esclarecer todas as suas dúvidas.
                </p>
              </div>
            </div>

            {/* Float badge */}
            <div className="absolute -bottom-4 right-4 sm:-bottom-5 sm:right-6 bg-white py-2.5 px-4 rounded-2xl shadow-lg border border-slate-200/90 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Padrão Clínico
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  Excelência & Biossegurança
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Pillars of Care */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${p.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer text-xs sm:text-sm"
              >
                <span>Agendar avaliação na clínica</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/5511934739629?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20cl%C3%ADnica%20OralPro."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-3 rounded-xl border border-slate-200/90 transition-colors cursor-pointer text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
