import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Bot, HelpCircle, Sparkles } from 'lucide-react';
import { CLINIC_ATTENDANCE_DATA } from '../data/attendanceData';
import { PageView } from '../types';

interface FAQSectionProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
  onNavigate?: (page: PageView) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenBooking,
  onOpenChat,
  onNavigate,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Combination of assistant's clinical FAQs + practical clinic FAQs
  const allFaqs = [
    {
      q: 'Quais tratamentos são oferecidos na OralPro?',
      a: 'Oferecemos 10 áreas integradas: Avaliação odontológica, Limpeza (profilaxia), Clareamento dental, Restaurações, Tratamento de canal (endodontia), Extrações, Implantes dentários, Aparelhos ortodônticos, Próteses dentárias e Estética dental (facetas e lentes).',
    },
    {
      q: 'Como faço para agendar uma avaliação?',
      a: 'Você pode agendar diretamente pelo botão de agendamento no site, falar com a nossa assistente virtual ou entrar em contato direto com a equipe pelo WhatsApp +55 (11) 93473-9629.',
    },
    {
      q: 'Quais são as formas de pagamento aceitas?',
      a: 'Aceitamos PIX, Cartão de Crédito (com parcelamento facilitado em até 12x), Cartão de Débito, Dinheiro e condições especiais de parcelamento para tratamentos de implantes, próteses e aparelhos.',
    },
    {
      q: 'O clareamento dental dói?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-1')?.answer || 'Não dói! Utilizamos géis clareadores com agentes dessensibilizantes modernos para garantir máximo conforto.',
    },
    {
      q: 'Quanto tempo dura o tratamento com aparelho ortodôntico?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-2')?.answer || 'Em média de 12 a 24 meses, dependendo do caso e do tipo de aparelho (fixo ou alinhador invisível).',
    },
    {
      q: 'A limpeza dentária precisa ser feita de quanto em quanto tempo?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-3')?.answer || 'A recomendação clínica é realizar a cada 6 meses para prevenir tártaro, cáries e doenças gengivais.',
    },
    {
      q: 'O implante dentário dói para colocar?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-4')?.answer || 'O procedimento é realizado sob anestesia local eficaz e é indolor, com pós-operatório tranquilo e bem medicado.',
    },
    {
      q: 'Crianças podem ser atendidas na clínica?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-5')?.answer || 'Sim! Contamos com acolhimento lúdico e seguro para crianças e adolescentes.',
    },
    {
      q: 'Vocês atendem urgências e emergências?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-6')?.answer || 'Sim! Priorizamos quadros de dor aguda e fraturas no mesmo dia em horário comercial, com suporte via WhatsApp.',
    },
    {
      q: 'Onde fica localizada a clínica?',
      a: `${CLINIC_ATTENDANCE_DATA.address} (${CLINIC_ATTENDANCE_DATA.referencePoint}).`,
    },
  ];

  return (
    <section id="duvidas" className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Dúvidas Frequentes
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-3">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Respostas claras para as principais dúvidas sobre procedimentos, agendamentos e atendimento.
          </p>
        </div>

        {/* Expandable Accordion List */}
        <div className="space-y-3">
          {allFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all text-left"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 text-xs flex items-center justify-center shrink-0 font-extrabold">
                      ?
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Callout: Assistente Virtual Trigger */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-blue-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Não encontrou sua resposta?
              </h4>
              <p className="text-xs sm:text-sm text-blue-100">
                Converse agora mesmo com nossa assistente virtual interativa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenChat}
            className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Falar com a assistente</span>
          </button>
        </div>
      </div>
    </section>
  );
};
