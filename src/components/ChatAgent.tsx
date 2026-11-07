import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Calendar,
  PhoneCall,
  Clock,
  MapPin,
  CreditCard,
  BadgeDollarSign,
  HelpCircle,
  Headset,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  CLINIC_ATTENDANCE_DATA,
  TreatmentItem,
  FAQItem,
} from '../data/attendanceData';

export const AGENT_AVATAR_SRC = 'https://i.ibb.co/fV5RTsz1/chatgpt-4.png';
export const AGENT_AVATAR_FALLBACK = '/images/agent-avatar.png';

export const AgentAvatarImage: React.FC<{ className?: string; alt?: string }> = ({
  className = 'w-7 h-7 object-contain',
  alt = 'OralPro Atendimento',
}) => (
  <img
    src={AGENT_AVATAR_SRC}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      if (target.src !== AGENT_AVATAR_FALLBACK) {
        target.src = AGENT_AVATAR_FALLBACK;
      }
    }}
    alt={alt}
    className={className}
  />
);

type ActiveFlow =
  | 'menu'
  | 'treatments'
  | 'treatment_detail'
  | 'prices'
  | 'booking'
  | 'payments'
  | 'hours'
  | 'location'
  | 'faq'
  | 'faq_detail'
  | 'human';

interface BookingState {
  step: 1 | 2 | 3 | 4 | 'done';
  procedure: string;
  isFirstVisit: string;
  preferredDay: string;
  preferredPeriod: string;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface ChatAgentProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenBooking: () => void;
}

export const ChatAgent: React.FC<ChatAgentProps> = ({
  isOpen,
  onToggle,
  onOpenBooking,
}) => {
  const { t, language } = useLanguage();

  const [activeFlow, setActiveFlow] = useState<ActiveFlow>('menu');
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentItem | null>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showTitleBadge, setShowTitleBadge] = useState<boolean>(true);
  const [freeformMessages, setFreeformMessages] = useState<ChatMessage[]>([]);

  const [bookingState, setBookingState] = useState<BookingState>({
    step: 1,
    procedure: '',
    isFirstVisit: '',
    preferredDay: '',
    preferredPeriod: '',
  });

  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Automatically hide the "Fale Connosco" title after 1 minute (reappears upon reloading the page)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitleBadge(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (isOpen && chatBodyRef.current) {
      if (activeFlow === 'menu') {
        // No menu principal, garante que o topo (com o balão inicial e saudação) apareça 100% por completo
        chatBodyRef.current.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        setTimeout(scrollToBottom, 60);
      }
    }
  }, [activeFlow, selectedTreatment, selectedFAQ, bookingState, freeformMessages, isOpen]);

  const handleResetToMenu = () => {
    setActiveFlow('menu');
    setSelectedTreatment(null);
    setSelectedFAQ(null);
    setBookingState({
      step: 1,
      procedure: '',
      isFirstVisit: '',
      preferredDay: '',
      preferredPeriod: '',
    });
  };

  const handleEndAttendance = () => {
    handleResetToMenu();
    setFreeformMessages([]);
    onToggle();
  };

  const openWhatsApp = (customMessage?: string) => {
    const message = customMessage || CLINIC_ATTENDANCE_DATA.defaultWhatsAppMessage;
    const url = `https://wa.me/${CLINIC_ATTENDANCE_DATA.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper to start booking with a chosen treatment
  const handleStartBookingWithTreatment = (treatment: TreatmentItem) => {
    setBookingState({
      step: 2, // skips step 1 since procedure is selected
      procedure: treatment.name,
      isFirstVisit: '',
      preferredDay: '',
      preferredPeriod: '',
    });
    setActiveFlow('booking');
  };

  // Freeform message sending (AI or local FAQ match)
  const handleSendFreeform = async () => {
    const text = inputText.trim();
    if (!text || loading) return;

    setInputText('');
    const timeFormatted = new Date().toLocaleTimeString(
      language === 'pt' ? 'pt-PT' : language === 'it' ? 'it-IT' : 'en-GB',
      { hour: '2-digit', minute: '2-digit' }
    );

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeFormatted,
    };

    setFreeformMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Try finding in FAQ first
    const queryLower = text.toLowerCase();
    const matchedFaq = CLINIC_ATTENDANCE_DATA.faqs.find(
      (f) =>
        queryLower.includes(f.question.toLowerCase().slice(0, 15)) ||
        f.question.toLowerCase().split(' ').some((word) => word.length > 4 && queryLower.includes(word))
    );

    if (matchedFaq) {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `${matchedFaq.answer}\n\n💡 Se precisar de mais detalhes, você também pode falar diretamente com nossa atendente.`,
          timestamp: new Date().toLocaleTimeString(
            language === 'pt' ? 'pt-PT' : language === 'it' ? 'it-IT' : 'en-GB',
            { hour: '2-digit', minute: '2-digit' }
          ),
        };
        setFreeformMessages((prev) => [...prev, botMsg]);
        setLoading(false);
      }, 400);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        'Agradecemos a sua mensagem! Para informações imediatas sobre tratamentos, preços ou agendamentos, você também pode usar os botões do menu ou falar com nossa equipe pelo WhatsApp.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString(
          language === 'pt' ? 'pt-PT' : language === 'it' ? 'it-IT' : 'en-GB',
          { hour: '2-digit', minute: '2-digit' }
        ),
      };
      setFreeformMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Nossa equipe está disponível para responder todas as suas dúvidas. Clique no botão "Falar com uma atendente" para suporte direto via WhatsApp!',
        timestamp: timeFormatted,
      };
      setFreeformMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING TRIGGER BUTTON (BOTTOM-RIGHT) */}
      {/* ========================================================= */}
      {!isOpen && (
        <button
          onClick={onToggle}
          type="button"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group flex items-center gap-2 cursor-pointer focus:outline-none select-none transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
          style={{
            bottom: 'max(1rem, env(safe-area-inset-bottom, 16px))',
            right: 'max(1rem, env(safe-area-inset-right, 16px))',
          }}
          aria-label={t.chat.buttonLabel}
        >
          {/* Badge de "Fale Connosco" com sumiço automático após 1 minuto */}
          <div
            className={`bg-white/95 backdrop-blur-xs text-slate-700 border border-slate-200/90 shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all duration-700 ease-in-out ${
              showTitleBadge
                ? 'opacity-100 max-w-[170px] translate-x-0'
                : 'opacity-0 max-w-0 -mr-2 px-0 py-0 border-0 overflow-hidden pointer-events-none translate-x-2'
            } group-hover:opacity-100 group-hover:max-w-[170px] group-hover:mr-0 group-hover:px-2.5 group-hover:py-1 group-hover:border group-hover:border-blue-400 group-hover:shadow-md group-hover:pointer-events-auto group-hover:translate-x-0`}
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 ring-1 ring-white" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 tracking-tight whitespace-nowrap">
              {t.chat.talkToUs}
            </span>
          </div>

          {/* Avatar com silhueta e pulsação suave */}
          <div className="relative w-13 h-14 sm:w-14 sm:h-15 flex items-center justify-center shrink-0 animate-gentle-pulse">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={AGENT_AVATAR_SRC}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== AGENT_AVATAR_FALLBACK) {
                    target.src = AGENT_AVATAR_FALLBACK;
                  }
                }}
                alt="OralPro Atendimento"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(30,64,175,0.22)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)] select-none pointer-events-none transition-transform duration-300 group-hover:scale-108"
              />
              <span className="absolute top-0 right-0 sm:top-0.5 sm:right-0.5 flex h-2.5 w-2.5 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-1.5 ring-white shadow-xs" />
              </span>
            </div>
          </div>
        </button>
      )}

      {/* ========================================================= */}
      {/* JANELA DE CONVERSA DO ATENDIMENTO AUTOMÁTICO */}
      {/* ========================================================= */}
      {isOpen && (
        <div
          className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[385px] h-[540px] sm:h-[570px] max-h-[90vh] z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
          style={{
            bottom: 'max(0.5rem, env(safe-area-inset-bottom, 8px))',
          }}
          role="dialog"
          aria-label="Atendimento OralPro"
        >
          {/* Header Superior com Identidade OralPro */}
          <div className="bg-slate-900 text-white px-3.5 py-3 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center ring-2 ring-blue-500/30 shadow-xs">
                  <AgentAvatarImage className="w-full h-full object-contain" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>Assistente Virtual</span>
                  <span className="text-[9px] bg-blue-600/90 text-white px-1.5 py-0.2 rounded font-medium">
                    Clínica
                  </span>
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online • Atendimento Automático</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleEndAttendance}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Encerrar atendimento"
                aria-label="Encerrar atendimento"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-header de Navegação (Voltar / Menu / Status) */}
          <div className="bg-slate-100 border-b border-slate-200 px-3 py-1 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
            <div className="flex items-center gap-1 font-medium">
              {activeFlow !== 'menu' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeFlow === 'treatment_detail') setActiveFlow('treatments');
                    else if (activeFlow === 'faq_detail') setActiveFlow('faq');
                    else handleResetToMenu();
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
              ) : (
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Menu Principal</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToMenu}
                className="text-[10px] text-slate-500 hover:text-blue-600 font-medium flex items-center gap-0.5 cursor-pointer"
                title="Voltar ao menu inicial"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 cursor-pointer"
              >
                <Headset className="w-3 h-3" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Corpo Rolável do Chat */}
          <div
            ref={chatBodyRef}
            className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-50 text-xs"
          >
            {/* Mensagem Inicial de Boas-Vindas Otimizada e Compacta */}
            <div className="flex gap-2 items-start shrink-0">
              <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-white p-0.5 flex items-center justify-center border border-slate-200 shadow-2xs">
                <AgentAvatarImage className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 bg-white border border-slate-200/90 rounded-xl rounded-tl-xs p-2.5 text-slate-800 shadow-2xs space-y-1">
                <p className="font-bold text-slate-900 text-xs">
                  Olá! 👋 Seja bem-vindo(a) à nossa clínica!
                </p>
                <p className="leading-snug text-slate-600 text-[11px]">
                  Sou a assistente virtual e estou aqui para ajudar você a encontrar informações sobre tratamentos, valores e agendamentos.
                </p>
                <p className="font-semibold text-blue-700 text-[11px] pt-0.5">
                  Como podemos ajudar hoje?
                </p>
              </div>
            </div>

            {/* ========================================================= */}
            {/* FLUXO 1: MENU PRINCIPAL COM CARDS OTIMIZADOS E COMPACTOS */}
            {/* ========================================================= */}
            {activeFlow === 'menu' && (
              <div className="space-y-1.5 animate-in fade-in duration-150 shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
                  Selecione uma opção de atendimento:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {/* 1. Tratamentos */}
                  <button
                    type="button"
                    onClick={() => setActiveFlow('treatments')}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50/80 active:bg-blue-100 border border-slate-200/90 hover:border-blue-300 text-left transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 text-[11px] leading-tight truncate">
                      Tratamentos
                    </span>
                  </button>

                  {/* 2. Preços */}
                  <button
                    type="button"
                    onClick={() => setActiveFlow('prices')}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50/80 active:bg-blue-100 border border-slate-200/90 hover:border-blue-300 text-left transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BadgeDollarSign className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 text-[11px] leading-tight truncate">
                      Preços e Valores
                    </span>
                  </button>

                  {/* 3. Agendamento */}
                  <button
                    type="button"
                    onClick={() => {
                      setBookingState({
                        step: 1,
                        procedure: '',
                        isFirstVisit: '',
                        preferredDay: '',
                        preferredPeriod: '',
                      });
                      setActiveFlow('booking');
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50/80 active:bg-blue-100 border border-slate-200/90 hover:border-blue-300 text-left transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 text-[11px] leading-tight truncate">
                      Agendamento
                    </span>
                  </button>

                  {/* 4. Pagamento */}
                  <button
                    type="button"
                    onClick={() => setActiveFlow('payments')}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50/80 active:bg-blue-100 border border-slate-200/90 hover:border-blue-300 text-left transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 text-[11px] leading-tight truncate">
                      Pagamento
                    </span>
                  </button>

                  {/* 5. Horários */}
                  <button
                    type="button"
                    onClick={() => setActiveFlow('hours')}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50/80 active:bg-blue-100 border border-slate-200/90 hover:border-blue-300 text-left transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 text-[11px] leading-tight truncate">
                      Horários
                    </span>
                  </button>

                  {/* 6. Localização */}
                  <button
                    type="button"
                    onClick={() => setActiveFlow('location')}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50/80 active:bg-blue-100 border border-slate-200/90 hover:border-blue-300 text-left transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 text-[11px] leading-tight truncate">
                      Localização
                    </span>
                  </button>

                  {/* 7. Dúvidas frequentes */}
                  <button
                    type="button"
                    onClick={() => setActiveFlow('faq')}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50/80 active:bg-blue-100 border border-slate-200/90 hover:border-blue-300 text-left transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 text-[11px] leading-tight truncate">
                      Dúvidas frequentes
                    </span>
                  </button>

                  {/* 8. Falar com atendente */}
                  <button
                    type="button"
                    onClick={() => setActiveFlow('human')}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 active:bg-emerald-200 border border-emerald-200/90 text-left transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Headset className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-emerald-900 group-hover:text-emerald-950 text-[11px] leading-tight truncate">
                      Falar com atendente
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FLUXO 2: CONHECER NOSSOS TRATAMENTOS */}
            {/* ========================================================= */}
            {activeFlow === 'treatments' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="font-semibold text-blue-900">
                    🦷 Selecione um tratamento para ver detalhes, para que serve e valor estimado:
                  </p>
                </div>
                <div className="space-y-1.5">
                  {CLINIC_ATTENDANCE_DATA.treatments.map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => {
                        setSelectedTreatment(tr);
                        setActiveFlow('treatment_detail');
                      }}
                      className="w-full p-2.5 bg-white hover:bg-blue-50/60 border border-slate-200 rounded-xl text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-blue-700">
                          {tr.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {tr.shortDesc}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DETALHE DO TRATAMENTO SELECIONADO */}
            {activeFlow === 'treatment_detail' && selectedTreatment && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                      <span>{selectedTreatment.name}</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Disponível
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Explicação
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedTreatment.shortDesc}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
                      Para que serve?
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {selectedTreatment.purpose}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 block">
                        Valor demonstrativo
                      </span>
                      <span className="text-sm font-black text-blue-700">
                        {selectedTreatment.demoPrice}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartBookingWithTreatment(selectedTreatment)}
                      className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tenho interesse (Agendar)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          `Olá! Gostaria de saber mais informações sobre o tratamento de ${selectedTreatment.name}.`
                        )
                      }
                      className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                    >
                      <Headset className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Falar com uma atendente</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FLUXO 3: CONSULTAR PREÇOS E VALORES */}
            {/* ========================================================= */}
            {activeFlow === 'prices' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BadgeDollarSign className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-xs">
                      Tabela de Serviços e Valores Demonstrativos
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100 text-[11px]">
                    {CLINIC_ATTENDANCE_DATA.priceList.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-2 flex items-center justify-between gap-2"
                      >
                        <span className="font-medium text-slate-700">
                          {item.service}
                        </span>
                        <span className="font-bold text-slate-900 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Aviso Obrigatório */}
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                    <p className="font-semibold flex items-center gap-1 text-amber-800 mb-0.5">
                      <span>⚠️ Estimativa Demonstrativa</span>
                    </p>
                    {CLINIC_ATTENDANCE_DATA.priceDisclaimer}
                  </div>

                  <div className="pt-1 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingState({
                          step: 1,
                          procedure: '',
                          isFirstVisit: '',
                          preferredDay: '',
                          preferredPeriod: '',
                        });
                        setActiveFlow('booking');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Agendar uma avaliação</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          'Olá! Gostaria de consultar os valores e condições de tratamentos na OralPro.'
                        )
                      }
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Headset className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Falar com uma atendente</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FLUXO 4: AGENDAR UMA AVALIAÇÃO (4 PASSOS GUIADOS) */}
            {/* ========================================================= */}
            {activeFlow === 'booking' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-xs">
                        Agendamento de Avaliação
                      </h3>
                    </div>
                    {bookingState.step !== 'done' && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Passo {bookingState.step} de 4
                      </span>
                    )}
                  </div>

                  {/* Passo 1: Qual procedimento? */}
                  {bookingState.step === 1 && (
                    <div className="space-y-2">
                      <p className="font-bold text-slate-800">
                        1. Qual procedimento você deseja realizar?
                      </p>
                      <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                        {[
                          'Avaliação odontológica geral',
                          'Limpeza dentária',
                          'Clareamento dental',
                          'Restauração dental',
                          'Tratamento de canal',
                          'Extração dentária',
                          'Implantes dentários',
                          'Aparelho ortodôntico',
                          'Prótese dentária',
                          'Estética e Facetas',
                          'Ainda não tenho certeza',
                        ].map((proc) => (
                          <button
                            key={proc}
                            type="button"
                            onClick={() =>
                              setBookingState((prev) => ({
                                ...prev,
                                procedure: proc,
                                step: 2,
                              }))
                            }
                            className="w-full p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-[11px] font-medium text-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <span>{proc}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Passo 2: Primeira consulta? */}
                  {bookingState.step === 2 && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] text-blue-700 bg-blue-50 p-2 rounded-lg font-medium">
                        Procedimento selecionado: <strong>{bookingState.procedure}</strong>
                      </div>
                      <p className="font-bold text-slate-800">
                        2. É a sua primeira consulta na clínica?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Sim, é a primeira vez', 'Não, já sou paciente'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              setBookingState((prev) => ({
                                ...prev,
                                isFirstVisit: opt,
                                step: 3,
                              }))
                            }
                            className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl text-center text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Passo 3: Qual dia seria melhor? */}
                  {bookingState.step === 3 && (
                    <div className="space-y-2.5">
                      <p className="font-bold text-slate-800">
                        3. Qual dia seria melhor para você?
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          'O mais breve possível (Hoje / Amanhã)',
                          'Esta semana',
                          'Próxima semana',
                          'Aos sábados',
                          'A combinar diretamente com a equipe',
                        ].map((dayOpt) => (
                          <button
                            key={dayOpt}
                            type="button"
                            onClick={() =>
                              setBookingState((prev) => ({
                                ...prev,
                                preferredDay: dayOpt,
                                step: 4,
                              }))
                            }
                            className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-xs font-semibold text-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <span>{dayOpt}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Passo 4: Qual período prefere? */}
                  {bookingState.step === 4 && (
                    <div className="space-y-2.5">
                      <p className="font-bold text-slate-800">
                        4. Qual período do dia você prefere?
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { label: '🌅 Manhã', detail: '08:30 às 12:00' },
                          { label: '☀️ Tarde', detail: '13:00 às 18:00' },
                          { label: '🌙 Noite', detail: '18:00 às 19:30' },
                        ].map((period) => (
                          <button
                            key={period.label}
                            type="button"
                            onClick={() =>
                              setBookingState((prev) => ({
                                ...prev,
                                preferredPeriod: `${period.label} (${period.detail})`,
                                step: 'done',
                              }))
                            }
                            className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <div>
                              <div className="font-bold text-slate-800">{period.label}</div>
                              <div className="text-[10px] text-slate-500">{period.detail}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Passo Concluído: Encaminhamento */}
                  {bookingState.step === 'done' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                        <p className="font-bold text-emerald-900 text-xs">
                          Perfeito! 😊 Agora vamos encaminhar sua solicitação para nossa equipe confirmar a disponibilidade.
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          Não confirmamos consultas automaticamente sem integração prévia com a agenda e os dentistas da clínica.
                        </p>
                      </div>

                      {/* Resumo da solicitação */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-700">
                        <div>
                          <strong>Procedimento:</strong> {bookingState.procedure}
                        </div>
                        <div>
                          <strong>Paciente:</strong> {bookingState.isFirstVisit}
                        </div>
                        <div>
                          <strong>Previsão de dia:</strong> {bookingState.preferredDay}
                        </div>
                        <div>
                          <strong>Período:</strong> {bookingState.preferredPeriod}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const msg = `Olá! Gostaria de confirmar uma avaliação na OralPro:\n- Procedimento: ${bookingState.procedure}\n- Situação: ${bookingState.isFirstVisit}\n- Preferência: ${bookingState.preferredDay}\n- Período: ${bookingState.preferredPeriod}`;
                          openWhatsApp(msg);
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm text-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Confirmar com Atendente no WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={onOpenBooking}
                        className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Ver Calendário Integrado</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FLUXO 5: FORMAS DE PAGAMENTO */}
            {/* ========================================================= */}
            {activeFlow === 'payments' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <CreditCard className="w-4 h-4 text-violet-600" />
                    <h3 className="font-bold text-slate-900 text-xs">
                      Formas de Pagamento Aceitas
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {CLINIC_ATTENDANCE_DATA.paymentMethods.map((pm, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">{pm.title}</span>
                          {pm.badge && (
                            <span className="text-[10px] font-semibold bg-violet-100 text-violet-800 px-2 py-0.2 rounded-full">
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {pm.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        'Olá! Gostaria de consultar as opções e condições de parcelamento de tratamentos na OralPro.'
                      )
                    }
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs text-xs"
                  >
                    <Headset className="w-4 h-4" />
                    <span>Consultar condições com a atendente</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FLUXO 6: HORÁRIOS DE FUNCIONAMENTO */}
            {/* ========================================================= */}
            {activeFlow === 'hours' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-xs">
                      Horários de Atendimento da Clínica
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {CLINIC_ATTENDANCE_DATA.businessHours.map((bh, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{bh.day}</div>
                          <div className="text-[10px] text-slate-500">{bh.status}</div>
                        </div>
                        <span className="font-bold text-blue-700 text-xs whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          {bh.hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingState({
                          step: 1,
                          procedure: '',
                          isFirstVisit: '',
                          preferredDay: '',
                          preferredPeriod: '',
                        });
                        setActiveFlow('booking');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs text-xs"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Agendar dentro destes horários</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          'Olá! Gostaria de consultar os horários de consulta disponíveis na OralPro.'
                        )
                      }
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                    >
                      <Headset className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Falar com uma atendente</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FLUXO 7: ENDEREÇO E LOCALIZAÇÃO */}
            {/* ========================================================= */}
            {activeFlow === 'location' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <h3 className="font-bold text-slate-900 text-xs">
                      📍 Como chegar à clínica?
                    </h3>
                  </div>

                  <div className="space-y-2 text-slate-700 text-xs leading-relaxed">
                    <p className="font-semibold text-slate-900">
                      Estamos esperando por você com todo o conforto e infraestrutura moderna!
                    </p>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Endereço
                        </span>
                        <p className="font-bold text-slate-900 text-xs">
                          {CLINIC_ATTENDANCE_DATA.address}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Ponto de Referência
                        </span>
                        <p className="text-[11px] text-slate-600">
                          {CLINIC_ATTENDANCE_DATA.referencePoint}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botão ABRIR NO GOOGLE MAPS com link exato https://google.com/map */}
                  <a
                    href={CLINIC_ATTENDANCE_DATA.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs text-xs tracking-wide uppercase"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>ABRIR NO GOOGLE MAPS</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        'Olá! Estou a caminho da clínica e gostaria de mais orientações de localização.'
                      )
                    }
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    <Headset className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Falar com atendente para orientações</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FLUXO 8: DÚVIDAS FREQUENTES (FAQ) */}
            {/* ========================================================= */}
            {activeFlow === 'faq' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                  <p className="font-semibold text-sky-900 text-xs">
                    ❓ Clique em qualquer dúvida para visualizar a resposta imediata:
                  </p>
                </div>

                <div className="space-y-1.5">
                  {CLINIC_ATTENDANCE_DATA.faqs.map((faq) => (
                    <button
                      key={faq.id}
                      type="button"
                      onClick={() => {
                        setSelectedFAQ(faq);
                        setActiveFlow('faq_detail');
                      }}
                      className="w-full p-2.5 bg-white hover:bg-blue-50/60 border border-slate-200 rounded-xl text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
                    >
                      <span className="font-semibold text-slate-800 group-hover:text-blue-700 text-[11px]">
                        {faq.question}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DETALHE DA DÚVIDA SELECIONADA */}
            {activeFlow === 'faq_detail' && selectedFAQ && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                      Pergunta
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs">
                      {selectedFAQ.question}
                    </h3>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Resposta
                    </span>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {selectedFAQ.answer}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFlow('faq')}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Ver outras dúvidas frequentes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          `Olá! Tive uma dúvida sobre: "${selectedFAQ.question}" e gostaria de falar com uma atendente.`
                        )
                      }
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                    >
                      <Headset className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Falar com uma atendente</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FLUXO 9: FALAR COM UMA ATENDENTE (WHATSAPP OFICIAL) */}
            {/* ========================================================= */}
            {activeFlow === 'human' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Headset className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">
                        Atendimento Humano em Tempo Real
                      </h3>
                      <p className="text-[10px] text-emerald-700">
                        Equipe de acolhimento OralPro disponível
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    Você será transferido(a) imediatamente para o nosso WhatsApp oficial. Nossas atendentes irão esclarecer dúvidas, confirmar disponibilidade de horários e valores personalizados.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                    <span className="text-slate-500 block">WhatsApp de Atendimento:</span>
                    <strong className="text-slate-900 text-sm">
                      +55 (11) 93473-9629
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      Mensagem pré-formatada pronta para envio
                    </span>
                  </div>

                  {/* Redirecionamento direto com o link e mensagem estipulados */}
                  <button
                    type="button"
                    onClick={() => openWhatsApp()}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md text-xs tracking-wide uppercase"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Iniciar conversa no WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToMenu}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Voltar ao menu inicial</span>
                  </button>
                </div>
              </div>
            )}

            {/* MENSAGENS DIGITADAS LIVRES (SE O USUÁRIO PERGUNTAR ALGO DIGITANDO) */}
            {freeformMessages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-white p-0.5 flex items-center justify-center border border-slate-200 shadow-2xs">
                    <AgentAvatarImage className="w-full h-full object-contain" />
                  </div>
                )}
                <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div
                    className={`rounded-xl px-3 py-2 leading-relaxed text-xs whitespace-pre-line ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-2xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Assistente verificando...</span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* BARRA DE AÇÕES PERSISTENTES (VOLTAR AO MENU / ENCERRAR) */}
          {/* ========================================================= */}
          <div className="px-3 py-1 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[10px] sm:text-[11px] shrink-0">
            <button
              type="button"
              onClick={handleResetToMenu}
              className="text-slate-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Menu Principal</span>
            </button>

            <button
              type="button"
              onClick={handleEndAttendance}
              className="text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Encerrar atendimento</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* CAMPO DE ENTRADA DE TEXTO (DIGITAR PERGUNTAS) */}
          {/* ========================================================= */}
          <div className="p-2 sm:p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              placeholder="Digite sua dúvida aqui..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendFreeform()}
              disabled={loading}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleSendFreeform}
              disabled={!inputText.trim() || loading}
              className="p-1.5 bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
