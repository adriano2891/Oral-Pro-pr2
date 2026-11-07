import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, ChevronRight, MessageCircle, ExternalLink, Navigation } from 'lucide-react';
import { CLINIC_ATTENDANCE_DATA } from '../data/attendanceData';
import { PageView } from '../types';

interface ContactPageProps {
  onOpenBooking: () => void;
  onNavigate?: (page: PageView) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    treatment: 'Avaliação odontológica geral',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError('Por favor, preencha seu nome e telefone.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || 'Não informado',
          interest: form.treatment,
          notes: form.notes,
          source: 'formulario_contactos',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao enviar mensagem.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Breadcrumb Navigation */}
        {onNavigate && (
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
            <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Início
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Contactos & Localização</span>
          </nav>
        )}

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Fale Conosco
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-3">
            Contactos & Como Chegar
          </h1>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Nossa equipe de recepção e atendimento está disponível para esclarecer suas dúvidas, orientar sobre procedimentos e agendar sua avaliação.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <MapPin className="w-5 h-5 shrink-0" />
                <span>Endereço da Clínica</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{CLINIC_ATTENDANCE_DATA.address}</p>
              <p className="text-xs text-slate-500">{CLINIC_ATTENDANCE_DATA.referencePoint}</p>
              <div className="pt-2">
                <a
                  href={CLINIC_ATTENDANCE_DATA.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir no Google Maps</span>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Phone className="w-5 h-5 shrink-0" />
                <span>Telefone & WhatsApp</span>
              </div>
              <p className="text-base font-black text-slate-900">+55 (11) 93473-9629</p>
              <p className="text-xs text-slate-500">Atendimento ágil durante o horário comercial.</p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${CLINIC_ATTENDANCE_DATA.whatsappNumber}?text=${encodeURIComponent(CLINIC_ATTENDANCE_DATA.defaultWhatsAppMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversar no WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <Clock className="w-5 h-5 shrink-0" />
                <span>Horários de Atendimento</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                {CLINIC_ATTENDANCE_DATA.businessHours.map((bh, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-200/60 pb-1 last:border-0">
                    <span className="font-medium text-slate-600">{bh.day}:</span>
                    <span className="font-bold text-slate-900">{bh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xl bg-white">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Envie uma mensagem para a clínica
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Preencha seus dados para solicitar informações ou agendar uma avaliação.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-emerald-900">Mensagem enviada com sucesso!</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
                    Agradecemos o seu contato. Nossa equipe retornará o mais breve possível para confirmar sua solicitação.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-900 cursor-pointer pt-2"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Seu nome completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ex: Maria Silva"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Ex: +55 (11) 99999-9999"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Ex: maria@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tratamento de interesse
                      </label>
                      <select
                        value={form.treatment}
                        onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option value="Avaliação odontológica geral">Avaliação odontológica geral</option>
                        <option value="Limpeza dentária">Limpeza dentária (Profilaxia)</option>
                        <option value="Clareamento dental">Clareamento dental</option>
                        <option value="Restauração">Restauração dental</option>
                        <option value="Tratamento de canal">Tratamento de canal</option>
                        <option value="Extração dentária">Extração dentária</option>
                        <option value="Implantes dentários">Implantes dentários</option>
                        <option value="Aparelhos ortodônticos">Aparelhos ortodônticos</option>
                        <option value="Próteses dentárias">Próteses dentárias</option>
                        <option value="Estética dental">Estética dental / Lentes</option>
                        <option value="Outro assunto">Outro assunto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mensagem ou preferência de horário
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Conte-nos brevemente o que procura ou sua dúvida..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Enviando...' : 'Enviar mensagem'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
