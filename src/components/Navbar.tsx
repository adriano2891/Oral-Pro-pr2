import React, { useState, useEffect, useRef } from 'react';
import { OralProLogo } from './OralProLogo';
import { PageView } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Calendar, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenBooking: () => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on Esc key or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const navItems: { page: PageView; label: string }[] = [
    { page: 'home', label: t.nav.home || 'Início' },
    { page: 'servicos', label: t.nav.services || 'Serviços' },
    { page: 'metodo', label: t.nav.method || 'Método' },
    { page: 'areas', label: t.nav.areas || 'Áreas' },
    { page: 'sobre', label: t.nav.about || 'Sobre' },
    { page: 'duvidas', label: t.nav.faq || 'Dúvidas' },
    { page: 'contactos', label: t.nav.contact || 'Contactos' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors w-full">
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-3 xl:px-6 2xl:px-8 h-20 flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-2 xl:gap-3 2xl:gap-5">
        {/* ========================================================= */}
        {/* AREA 1: LOGÓTIPO À ESQUERDA */}
        {/* ========================================================= */}
        <div className="flex items-center shrink-0 min-w-0">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-0.5 transition-opacity hover:opacity-90 cursor-pointer flex items-center shrink-0"
            aria-label="OralPro - Página Inicial"
          >
            <OralProLogo size="header" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* AREA 2: NAVEGAÇÃO PRINCIPAL AO CENTRO (DESKTOP) */}
        {/* ========================================================= */}
        <nav
          className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 2xl:gap-3.5 text-xs xl:text-[13px] 2xl:text-sm font-semibold shrink-0 min-w-0"
          aria-label="Navegação Principal"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleNavClick(item.page)}
                className={`relative py-1.5 px-1.5 xl:px-2 transition-colors cursor-pointer text-xs xl:text-[13px] 2xl:text-sm whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-blue-600 font-medium'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-1 right-1 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ========================================================= */}
        {/* AREA 3: CONTROLOS À DIREITA (ADMIN, IDIOMA & AGENDAMENTO) */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
          {/* Botão Admin Provisório com Pulsação Suave */}
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className={`animate-gentle-pulse inline-flex items-center gap-1.5 text-[11px] xl:text-xs font-semibold px-2 sm:px-2.5 py-1.5 xl:py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer border shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              currentPage === 'admin'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border-slate-300'
            }`}
            title="Botão Admin provisório"
            aria-label="Botão Admin provisório"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden 2xl:inline">Botão Admin provisório</span>
            <span className="hidden sm:inline 2xl:hidden">Admin</span>
            <span className="inline sm:hidden">Admin</span>
          </button>

          {/* Seletor de Idioma Compacto em Menu (Desktop & Tablet >= 1024px) */}
          <div className="hidden lg:block shrink-0">
            <LanguageSelector variant="dropdown" />
          </div>

          {/* Botão Principal para Agendar Avaliação */}
          {/* Versão Desktop / Tablet com texto completo que não corta */}
          <button
            type="button"
            onClick={onOpenBooking}
            className={`hidden sm:inline-flex items-center gap-1.5 xl:gap-2 font-bold text-xs xl:text-sm px-2.5 sm:px-3.5 xl:px-4 py-1.5 xl:py-2.5 rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
              currentPage === 'agendamento'
                ? 'bg-blue-700 text-white ring-2 ring-blue-300'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
            <span className="hidden md:inline">Agendar avaliação</span>
            <span className="inline md:hidden">Agendar</span>
          </button>

          {/* Versão Compacta Mobile "Agendar" */}
          <button
            type="button"
            onClick={onOpenBooking}
            className="sm:hidden inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs transition-all whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label={t.common.scheduleMeeting}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Agendar</span>
          </button>

          {/* Botão de Menu Hambúrguer (Mobile & Tablet < 1024px) */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:bg-slate-200 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE MENU CARD (CONFORME IMAGEM 2 DE REFERÊNCIA) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-50 bg-slate-950/40 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div
            id="mobile-navigation-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu Principal"
            className="max-w-sm ml-auto w-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 space-y-3 animate-in slide-in-from-top-3 duration-200"
          >
            {/* Navigation links with chevron right arrows */}
            <nav className="flex flex-col divide-y divide-slate-100" aria-label="Links Móveis">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => handleNavClick(item.page)}
                    className={`w-full py-3.5 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-left text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50/80 font-bold'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-blue-600 translate-x-0.5' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Separator */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              {/* Botão Admin com Pulsação Suave no Menu Mobile */}
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className={`animate-gentle-pulse w-full py-3 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-left text-sm font-semibold border ${
                  currentPage === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                title="Botão Admin provisório"
                aria-label="Botão Admin provisório"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Botão Admin provisório</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-blue-800 border border-slate-200">
                  Provisório
                </span>
              </button>

              {/* Compact Language Selector matching reference Image 2 */}
              <LanguageSelector variant="mobile" />
            </div>

            {/* Quick Agendar action inside menu for convenience */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar avaliação</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
