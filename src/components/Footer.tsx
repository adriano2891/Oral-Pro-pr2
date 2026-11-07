import React from 'react';
import { OralProLogo } from './OralProLogo';
import { PageView } from '../types';
import { MapPin, Phone, Clock, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { CLINIC_ATTENDANCE_DATA } from '../data/attendanceData';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand lockup */}
          <div className="md:col-span-4 space-y-4 text-left">
            <OralProLogo size="md" light />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              OralPro Clínica Odontológica — Cuidado humanizado, tecnologia e compromisso integral com a saúde e a beleza do seu sorriso.
            </p>
            <div className="pt-1 flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Ambiente clínico seguro e higienizado</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-3 text-left">
            <span className="font-bold text-slate-200 text-xs uppercase tracking-wider block">
              Navegação
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('sobre')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sobre a clínica
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('servicos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tratamentos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('metodo')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Diferenciais
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('duvidas')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Perguntas frequentes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contactos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contactos
                </button>
              </li>
            </ul>
          </div>

          {/* Treatments List */}
          <div className="md:col-span-3 space-y-3 text-left">
            <span className="font-bold text-slate-200 text-xs uppercase tracking-wider block">
              Tratamentos
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>Avaliação odontológica</li>
              <li>Limpeza dentária (Profilaxia)</li>
              <li>Clareamento dental</li>
              <li>Restaurações estéticas</li>
              <li>Tratamento de canal (Endodontia)</li>
              <li>Implantes dentários</li>
              <li>Aparelhos ortodônticos</li>
              <li>Próteses dentárias</li>
              <li>Estética dental (Facetas)</li>
            </ul>
          </div>

          {/* Contacts & Location */}
          <div className="md:col-span-3 space-y-3 text-left">
            <span className="font-bold text-slate-200 text-xs uppercase tracking-wider block">
              Localização & Contactos
            </span>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{CLINIC_ATTENDANCE_DATA.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-white font-bold">+55 (11) 93473-9629</span>
              </div>
              <div className="flex items-start gap-2 text-[11px]">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Seg a Sex: 08:30 - 19:30 | Sáb: 08:30 - 13:00</span>
              </div>

              <div className="pt-2">
                <a
                  href={CLINIC_ATTENDANCE_DATA.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/60 text-blue-200 hover:text-white hover:bg-blue-800 transition-colors text-[11px]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver no Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin link and copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} OralPro Clínica Odontológica. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Acesso Administrativo
            </button>
            <span>•</span>
            <span>Atendimento Humanizado</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
