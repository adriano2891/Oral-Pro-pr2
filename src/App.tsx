import React, { useState, useEffect } from 'react';
import { PageView, Language } from './types';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { MethodSection } from './components/MethodSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { LocationContactSection } from './components/LocationContactSection';
import { ServicesPage } from './components/ServicesPage';
import { MethodPage } from './components/MethodPage';
import { AreasPage } from './components/AreasPage';
import { AboutPage } from './components/AboutPage';
import { FAQPage } from './components/FAQPage';
import { ContactPage } from './components/ContactPage';
import { BookingPage } from './components/BookingPage';
import { BookingSystem } from './components/BookingSystem';
import { ChatAgent } from './components/ChatAgent';
import { AdminDashboard } from './components/AdminDashboard';
import { DynamicCustomSections } from './components/DynamicCustomSections';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import { Footer } from './components/Footer';

const PAGE_ALIASES: Record<string, PageView> = {
  '': 'home',
  'inicio': 'home',
  'home': 'home',
  'servicos': 'servicos',
  'services': 'servicos',
  'servizi': 'servicos',
  'metodo': 'metodo',
  'method': 'metodo',
  'areas': 'areas',
  'aree': 'areas',
  'specialties': 'areas',
  'sobre': 'sobre',
  'about': 'sobre',
  'chi-siamo': 'sobre',
  'duvidas': 'duvidas',
  'faq': 'duvidas',
  'contactos': 'contactos',
  'contact': 'contactos',
  'contatti': 'contactos',
  'agendamento': 'agendamento',
  'booking': 'agendamento',
  'prenota': 'agendamento',
  'admin': 'admin',
  'painel': 'admin',
  'cms': 'admin',
  'gestao': 'admin',
  'dashboard': 'admin',
};

const PAGE_TITLES: Record<string, Record<PageView, string>> = {
  pt: {
    home: 'OralPro - Clínica Odontológica Especializada',
    servicos: 'Tratamentos Odontológicos | OralPro',
    metodo: 'Diferenciais & Atendimento | OralPro',
    areas: 'Especialidades Odontológicas | OralPro',
    sobre: 'Sobre a Clínica | OralPro',
    duvidas: 'Perguntas Frequentes | OralPro',
    contactos: 'Localização e Contato | OralPro',
    agendamento: 'Agendar Avaliação Odontológica | OralPro',
    admin: 'Painel de Gestão | OralPro',
  },
  it: {
    home: 'OralPro - Clinica Odontoiatrica Specializzata',
    servicos: 'Trattamenti Odontoiatrici | OralPro',
    metodo: 'Il Nostro Metodo e Differenziali | OralPro',
    areas: 'Specializzazioni Cliniche | OralPro',
    sobre: 'Chi Siamo | OralPro',
    duvidas: 'Domande Frequenti | OralPro',
    contactos: 'Contatti e Sede | OralPro',
    agendamento: 'Prenota Valutazione Dentale | OralPro',
    admin: 'Pannello di Gestione | OralPro',
  },
  en: {
    home: 'OralPro - Advanced Dental Clinic',
    servicos: 'Dental Treatments | OralPro',
    metodo: 'Why Choose OralPro | OralPro',
    areas: 'Clinical Specialties | OralPro',
    sobre: 'About Our Clinic | OralPro',
    duvidas: 'Frequently Asked Questions | OralPro',
    contactos: 'Location & Contact | OralPro',
    agendamento: 'Schedule Dental Evaluation | OralPro',
    admin: 'Management Portal | OralPro',
  },
};

function parsePath(pathname: string): { lang?: Language; page: PageView } {
  // Support hash routing (e.g., #admin, #/admin)
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    if (hash && PAGE_ALIASES[hash]) {
      return { page: PAGE_ALIASES[hash] };
    }
  }

  // Support query param (e.g., ?page=admin)
  if (typeof window !== 'undefined' && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page')?.toLowerCase().trim();
    if (pageParam && PAGE_ALIASES[pageParam]) {
      return { page: PAGE_ALIASES[pageParam] };
    }
    if (params.has('admin')) {
      return { page: 'admin' };
    }
  }

  const clean = pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!clean) return { page: 'home' };

  const segments = clean.split('/');
  let detectedLang: Language | undefined;
  let pageSegment = segments[0];

  if (['pt', 'it', 'en'].includes(segments[0])) {
    detectedLang = segments[0] as Language;
    pageSegment = segments[1] || '';
  }

  const resolvedPage = PAGE_ALIASES[pageSegment] || 'home';
  return { lang: detectedLang, page: resolvedPage };
}

function MainAppLayout() {
  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    if (typeof window !== 'undefined') {
      const parsed = parsePath(window.location.pathname);
      return parsed.page;
    }
    return 'home';
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Sync document title on page or language change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentLang = localStorage.getItem('oralpro_language') || 'pt';
      const titles = PAGE_TITLES[currentLang] || PAGE_TITLES.pt;
      document.title = titles[currentPage] || titles.home;
    }
  }, [currentPage]);

  // Handle browser Back & Forward buttons and hash changes
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const parsed = parsePath(window.location.pathname);
        setCurrentPage(parsed.page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL path while preserving current language prefix
    if (typeof window !== 'undefined') {
      const currentLang = localStorage.getItem('oralpro_language') || 'pt';
      const pagePath = page === 'home' ? '' : `/${page}`;
      const newUrl = page === 'admin' ? '/admin' : `/${currentLang}${pagePath}`;
      window.history.pushState({ lang: currentLang, page }, '', newUrl);

      const titles = PAGE_TITLES[currentLang] || PAGE_TITLES.pt;
      document.title = titles[page] || titles.home;
    }
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const { getCustomSectionsForPage } = useSiteContent();
  const currentCustomSections = getCustomSectionsForPage(currentPage);

  // If in admin view, render AdminDashboard completely independent of the public site
  if (currentPage === 'admin') {
    return (
      <LanguageProvider currentPage={currentPage} onPageChange={setCurrentPage}>
        <AdminDashboard onBackToSite={() => handleNavigate('home')} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider currentPage={currentPage} onPageChange={setCurrentPage}>
      <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
        {/* Top Header - Always visible with active page indicator */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenBooking={() => handleNavigate('agendamento')}
          onOpenChat={handleOpenChat}
        />

        {/* Main Content Router */}
        <main className="flex-1">
          {currentPage === 'home' && (
            <>
              <HeroSection
                onOpenBooking={() => handleNavigate('agendamento')}
                onOpenChat={handleOpenChat}
              />
              <AboutSection
                onOpenBooking={() => handleNavigate('agendamento')}
                onNavigate={handleNavigate}
              />
              <ServicesSection
                onOpenBooking={() => handleNavigate('agendamento')}
                onNavigate={handleNavigate}
              />
              <MethodSection
                onOpenBooking={() => handleNavigate('agendamento')}
                onNavigate={handleNavigate}
              />
              <HowItWorksSection
                onOpenBooking={() => handleNavigate('agendamento')}
              />
              <FAQSection
                onOpenBooking={() => handleNavigate('agendamento')}
                onOpenChat={handleOpenChat}
                onNavigate={handleNavigate}
              />
              <CTASection onOpenBooking={() => handleNavigate('agendamento')} />
              <LocationContactSection />
            </>
          )}

          {currentPage === 'servicos' && (
            <ServicesPage
              onOpenBooking={() => handleNavigate('agendamento')}
              onOpenChat={handleOpenChat}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'metodo' && (
            <MethodPage
              onNavigate={handleNavigate}
              onOpenBooking={() => handleNavigate('agendamento')}
              onOpenChat={handleOpenChat}
            />
          )}

          {currentPage === 'areas' && (
            <AreasPage
              onNavigate={handleNavigate}
              onOpenBooking={() => handleNavigate('agendamento')}
              onOpenChat={handleOpenChat}
            />
          )}

          {currentPage === 'sobre' && (
            <AboutPage
              onOpenBooking={() => handleNavigate('agendamento')}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'duvidas' && (
            <FAQPage
              onNavigate={handleNavigate}
              onOpenBooking={() => handleNavigate('agendamento')}
              onOpenChat={handleOpenChat}
            />
          )}

          {currentPage === 'contactos' && (
            <ContactPage
              onOpenBooking={() => handleNavigate('agendamento')}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'agendamento' && (
            <BookingPage onNavigate={handleNavigate} />
          )}

          {/* Dynamic Custom Sections created via Admin CMS */}
          <DynamicCustomSections
            sections={currentCustomSections}
            onOpenBooking={() => handleNavigate('agendamento')}
            onNavigate={handleNavigate}
          />
        </main>

        {/* Footer - Always visible across all pages */}
        <Footer
          onNavigate={handleNavigate}
          onOpenBooking={() => handleNavigate('agendamento')}
        />

        {/* Reusable Booking Modal (when triggered via modal) */}
        {isBookingModalOpen && (
          <BookingSystem
            isOpenModal={true}
            onClose={handleCloseBookingModal}
            onBookingSuccess={() => {}}
          />
        )}

        {/* Humanized Conversational Agent - Always visible across all pages */}
        <ChatAgent
          isOpen={isChatOpen}
          onToggle={handleToggleChat}
          onOpenBooking={() => handleNavigate('agendamento')}
        />
      </div>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <SiteContentProvider>
      <MainAppLayout />
    </SiteContentProvider>
  );
}

