import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, MessageSquare, Search, Bot } from 'lucide-react';
import { CLINIC_ATTENDANCE_DATA } from '../data/attendanceData';
import { PageView } from '../types';

interface FAQPageProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate, onOpenBooking, onOpenChat }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

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
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-1')?.answer || 'Não dói! Utilizamos géis com agentes dessensibilizantes de última geração.',
    },
    {
      q: 'Quanto tempo dura o tratamento com aparelho ortodôntico?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-2')?.answer || 'Em média de 12 a 24 meses dependendo da complexidade do caso.',
    },
    {
      q: 'A limpeza dentária precisa ser feita de quanto em quanto tempo?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-3')?.answer || 'A recomendação clínica é realizar a cada 6 meses para prevenir tártaro e cáries.',
    },
    {
      q: 'O implante dentário dói para colocar?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-4')?.answer || 'O procedimento é realizado sob anestesia local eficaz e é totalmente indolor.',
    },
    {
      q: 'Crianças podem ser atendidas na clínica?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-5')?.answer || 'Sim! Contamos com equipe de acolhimento preparada para crianças e adolescentes.',
    },
    {
      q: 'Vocês atendem urgências e emergências?',
      a: CLINIC_ATTENDANCE_DATA.faqs.find((f) => f.id === 'faq-6')?.answer || 'Sim! Priorizamos pacientes com dor de dente aguda no mesmo dia em horário comercial.',
    },
    {
      q: 'Onde fica localizada a clínica?',
      a: `${CLINIC_ATTENDANCE_DATA.address} (${CLINIC_ATTENDANCE_DATA.referencePoint}).`,
    },
  ];

  const filteredItems = allFaqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors cursor-pointer">
            Início
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Perguntas Frequentes</span>
        </nav>

        {/* Page Hero Header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Tire Suas Dúvidas
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-3">
            Perguntas Frequentes
          </h1>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Esclareça dúvidas comuns sobre procedimentos, valores, recuperação e funcionamento da clínica.
          </p>

          {/* Search filter input */}
          <div className="mt-6 relative max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por dúvida (ex: clareamento, implante, horário)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 mb-16">
          {filteredItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 text-xs flex items-center justify-center shrink-0 font-black">
                      ?
                    </span>
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Callout to Chat Assistant */}
        <div className="p-8 rounded-3xl bg-blue-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Não encontrou sua resposta?</h3>
              <p className="text-xs sm:text-sm text-blue-100">Nossa assistente virtual responde instantaneamente a qualquer momento.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenChat}
            className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl text-xs sm:text-sm hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
          >
            Abrir assistente virtual
          </button>
        </div>
      </div>
    </div>
  );
};
