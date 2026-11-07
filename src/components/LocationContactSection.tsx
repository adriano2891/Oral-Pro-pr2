import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Car,
  Navigation,
} from 'lucide-react';
import { CLINIC_ATTENDANCE_DATA } from '../data/attendanceData';

export const LocationContactSection: React.FC = () => {
  return (
    <section id="contactos" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Onde Estamos
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-3">
            Localização e Contacto
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Fácil acesso no centro da cidade, com estacionamento conveniado e estrutura acolhedora para o seu conforto.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Clinic Data Cards */}
          <div className="lg:col-span-6 space-y-4 text-left">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center gap-2.5 text-blue-700">
                <MapPin className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-slate-900 text-base">
                  Endereço da Clínica
                </h3>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {CLINIC_ATTENDANCE_DATA.address}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                <Car className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{CLINIC_ATTENDANCE_DATA.referencePoint}</span>
              </div>
            </div>

            {/* Hours Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-amber-600">
                <Clock className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-slate-900 text-base">
                  Horários de Funcionamento
                </h3>
              </div>
              <div className="space-y-2 text-xs divide-y divide-slate-200/60">
                {CLINIC_ATTENDANCE_DATA.businessHours.map((bh, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{bh.day}</span>
                      <span className="text-[11px] text-slate-500 block">{bh.status}</span>
                    </div>
                    <span className="font-black text-blue-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {bh.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-600">
                <Phone className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-slate-900 text-base">
                  Telefone & WhatsApp
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">WhatsApp Oficial:</span>
                  <strong className="text-base font-black text-slate-900">
                    +55 (11) 93473-9629
                  </strong>
                </div>

                <a
                  href={`https://wa.me/${CLINIC_ATTENDANCE_DATA.whatsappNumber}?text=${encodeURIComponent(
                    CLINIC_ATTENDANCE_DATA.defaultWhatsAppMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Mensagem</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Access Card */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex-1 min-h-[340px] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex flex-col justify-between p-6 sm:p-8 relative text-left">
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Mapa de Localização</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  Venha conhecer a OralPro
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                  Estamos localizados no coração de São Paulo, na Avenida Paulista, com fácil acesso via metrô, ônibus ou veículo próprio com estacionamento conveniado.
                </p>
              </div>

              {/* Map Preview graphic */}
              <div className="my-6 relative z-10 p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-slate-200/90 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Av. Paulista, 1578 - Bela Vista, São Paulo - SP</span>
                </div>
                <p className="text-xs text-slate-500">
                  Próximo à Estação Trianon-Masp do Metrô e ao MASP. Fácil estacionamento.
                </p>
              </div>

              {/* Button 'Como chegar' / 'Abrir no Google Maps' with exact link https://google.com/map */}
              <div className="relative z-10 pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={CLINIC_ATTENDANCE_DATA.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer tracking-wide uppercase"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>ABRIR NO GOOGLE MAPS</span>
                </a>

                <a
                  href={CLINIC_ATTENDANCE_DATA.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm border border-slate-200 transition-colors shadow-2xs"
                >
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Como chegar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
