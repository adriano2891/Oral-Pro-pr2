import {
  Booking,
  Lead,
  KnowledgeItem,
  MediaAsset,
  AgentMetric,
  AdminUser,
  SiteContentSlot,
  CustomSection,
  MediaLibraryItem,
  AuditLogEntry,
} from '../types';

const STORAGE_KEYS = {
  TOKEN: 'oralpro_admin_token',
  AUTH: 'oralpro_admin_auth',
  USER: 'oralpro_admin_user',
  BOOKINGS: 'oralpro_db_bookings',
  LEADS: 'oralpro_db_leads',
  KNOWLEDGE: 'oralpro_db_knowledge',
  MEDIA: 'oralpro_db_media',
  METRICS: 'oralpro_db_metrics',
  SITE_CONTENT: 'oralpro_db_site_content',
};

const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'usr_admin_01',
  name: 'Administrador OralPro Italia',
  email: 'admin@oralpro.it',
  role: 'superadmin',
};

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    name: 'Dr. Tiago Ferreira',
    clinicName: 'Clínica Dentária Ferreira & Associados',
    email: 'tiago.ferreira@dentista.pt',
    phone: '+351 912 345 678',
    type: 'diagnostico',
    typeLabel: 'Diagnóstico Comercial Inicial',
    date: '2026-10-06',
    time: '11:00',
    timezone: 'America/Sao_Paulo',
    chairsCount: '3 gabinetes',
    targetServices: ['Implantologia', 'Estética Dentária'],
    status: 'confirmado',
    notes: 'Clínica com foco em aumentar reabilitações completas.',
    createdAt: new Date().toISOString(),
    history: [{ action: 'Marcação inicial registada', timestamp: new Date().toISOString() }],
  },
  {
    id: 'bk-102',
    name: 'Dra. Sofia Martins',
    clinicName: 'Smile Clinic',
    email: 'sofia.martins@smileclinic.pt',
    phone: '+351 934 567 890',
    type: 'estrategia',
    typeLabel: 'Apresentação de Estratégia',
    date: '2026-10-07',
    time: '15:30',
    timezone: 'America/Sao_Paulo',
    chairsCount: '4 gabinetes',
    targetServices: ['Ortodontia Invisível'],
    status: 'confirmado',
    notes: 'Interesse específico na transição para alinhadores.',
    createdAt: new Date().toISOString(),
    history: [{ action: 'Marcação inicial registada', timestamp: new Date().toISOString() }],
  },
];

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'ld-1',
    name: 'Dr. Miguel Castro',
    clinicName: 'Clínica Oral Norte',
    email: 'miguel@oralnorte.pt',
    phone: '+351 961 223 344',
    interest: 'Implantologia e Reabilitação',
    source: 'agente_chat',
    status: 'novo',
    notes: 'Contacto recebido via assistente virtual.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ld-2',
    name: 'Dra. Beatriz Santos',
    clinicName: 'Estética & Saúde Dentária',
    email: 'beatriz@esteticadental.pt',
    phone: '+351 925 889 900',
    interest: 'Estética Dentária e Facetas',
    source: 'site',
    status: 'em_contacto',
    notes: 'Solicitou informações de avaliação.',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'kb-1',
    category: 'identidade',
    title: 'Sobre a OralPro e Atendimento',
    content:
      'A OralPro é uma clínica odontológica e consultoria especializada com foco em cuidados humanizados, saúde bucal e tratamentos de alta tecnologia.',
    verified: true,
  },
  {
    id: 'kb-2',
    category: 'servicos',
    title: 'Tratamentos Odontológicos',
    content:
      'Oferecemos avaliação, limpeza, restauração, clareamento, próteses, ortodontia, implantes dentários, facetas cerâmicas e cirurgias menores.',
    verified: true,
  },
  {
    id: 'kb-3',
    category: 'precos_condicoes',
    title: 'Valores e Formas de Pagamento',
    content:
      'Pagamentos disponíveis em PIX, cartões de crédito e débito com parcelamento facilitado. Avaliação inicial a partir de R$ 80,00.',
    verified: true,
  },
  {
    id: 'kb-4',
    category: 'faq',
    title: 'Localização da Clínica',
    content:
      'Avenida Paulista, 1578 - 14º Andar, Bela Vista, São Paulo - SP, CEP 01310-200. Próximo ao MASP e Estação Trianon-MASP.',
    verified: true,
  },
];

const DEFAULT_SLOTS: SiteContentSlot[] = [
  {
    key: 'home_hero',
    page: 'home',
    pageLabel: 'Página Inicial',
    sectionLabel: 'Apresentação (Hero)',
    description: 'Imagem principal de destaque da página inicial',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85',
    altText: 'Instalações clínicas e tecnologia avançada OralPro',
    aspectRatio: '16:9',
    fit: 'cover',
    position: 'center',
    hasChanges: false,
  },
  {
    key: 'home_about',
    page: 'home',
    pageLabel: 'Página Inicial',
    sectionLabel: 'Sobre a OralPro (Secção Resumo)',
    description: 'Fotografia representativa da presença executiva e equipa da OralPro',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85',
    altText: 'Mario Provenzano em apresentação institucional OralPro',
    aspectRatio: '16:10',
    fit: 'cover',
    position: 'center',
    hasChanges: false,
  },
  {
    key: 'about_founder',
    page: 'sobre',
    pageLabel: 'Sobre a OralPro',
    sectionLabel: 'Apresentação Fundador (Mario Provenzano)',
    description: 'Foto oficial do fundador em conferência odontológica em Itália',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85',
    altText: 'Mario Provenzano em conferência para diretores de clínicas em Itália',
    aspectRatio: '16:10',
    fit: 'cover',
    position: 'center',
    hasChanges: false,
  },
  {
    key: 'about_masterclass',
    page: 'sobre',
    pageLabel: 'Sobre a OralPro',
    sectionLabel: 'Masterclasses & Eventos em Itália',
    description: 'Fotografia das sessões presenciais com médicos dentistas',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85',
    altText: 'Masterclass presencial da OralPro com diretores clínicos em Itália',
    aspectRatio: '16:9',
    fit: 'cover',
    position: 'center',
    hasChanges: false,
  },
  {
    key: 'services_implantologia',
    page: 'servicos',
    pageLabel: 'Serviços',
    sectionLabel: 'Implantologia e Reabilitação Oral',
    description: 'Ambiente de reabilitação e bloco cirúrgico de implantologia',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85',
    altText: 'Gabinete cirúrgico odontológico para implantes e reabilitação',
    aspectRatio: '4:3',
    fit: 'cover',
    position: 'center',
    hasChanges: false,
  },
  {
    key: 'services_estetica',
    page: 'servicos',
    pageLabel: 'Serviços',
    sectionLabel: 'Estética Dentária e Facetas',
    description: 'Tecnologia de planeamento estético do sorriso',
    imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85',
    altText: 'Planeamento estético e facetas cerâmicas em clínica parceira',
    aspectRatio: '4:3',
    fit: 'cover',
    position: 'center',
    hasChanges: false,
  },
  {
    key: 'services_ortodontia',
    page: 'servicos',
    pageLabel: 'Serviços',
    sectionLabel: 'Ortodontia Invisível e Alinhadores',
    description: 'Visualização 3D e diagnóstico ortodôntico digital',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
    altText: 'Acompanhamento digital e alinhadores transparentes',
    aspectRatio: '4:3',
    fit: 'cover',
    position: 'center',
    hasChanges: false,
  },
];

const DEFAULT_MEDIA: MediaLibraryItem[] = [
  {
    id: 'med-lib-1',
    name: 'Mario Provenzano Apresentação',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85',
    category: 'Equipa & Fundador',
    aspectRatio: '16:10',
    size: '1.4 MB',
    createdAt: '2026-10-01',
    origin: 'Oficial OralPro',
    usedIn: ['about_founder', 'home_about'],
  },
  {
    id: 'med-lib-2',
    name: 'Masterclass Presencial Itália',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85',
    category: 'Eventos & Masterclasses',
    aspectRatio: '16:9',
    size: '2.1 MB',
    createdAt: '2026-10-02',
    origin: 'Oficial OralPro',
    usedIn: ['about_masterclass'],
  },
  {
    id: 'med-lib-3',
    name: 'Gabinete Odontológico Moderno',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85',
    category: 'Instalações & Clínica',
    aspectRatio: '16:9',
    size: '1.8 MB',
    createdAt: '2026-10-03',
    origin: 'Oficial OralPro',
    usedIn: ['home_hero'],
  },
];

export const adminClientStorage = {
  // Authentication
  login: (email: string, pass: string): { success: boolean; token?: string; user?: AdminUser; error?: string } => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    const isMatch =
      (cleanEmail === 'admin@oralpro.it' ||
        cleanEmail === 'admin' ||
        cleanEmail === 'admin@oralpro.com' ||
        cleanEmail === 'admin@oralpro.br') &&
      cleanPass === 'oralpro2026!';

    if (!isMatch) {
      return {
        success: false,
        error: 'Credenciais inválidas. Verifique o email/utilizador e a palavra-passe.',
      };
    }

    const token = 'oralpro_sess_client_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'admin2026');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_ADMIN_USER));
    }

    return {
      success: true,
      token,
      user: DEFAULT_ADMIN_USER,
    };
  },

  checkSession: (): AdminUser | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.AUTH);
    if (!token) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN_USER;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Bookings
  getBookings: (): Booking[] => {
    if (typeof window === 'undefined') return DEFAULT_BOOKINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return DEFAULT_BOOKINGS;
  },

  saveBooking: (booking: Booking): Booking => {
    const current = adminClientStorage.getBookings();
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    }
    return booking;
  },

  updateBooking: (id: string, updates: Partial<Booking>): boolean => {
    const current = adminClientStorage.getBookings();
    const index = current.findIndex((b) => b.id === id);
    if (index === -1) return false;
    current[index] = { ...current[index], ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(current));
    }
    return true;
  },

  // Leads
  getLeads: (): Lead[] => {
    if (typeof window === 'undefined') return DEFAULT_LEADS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return DEFAULT_LEADS;
  },

  saveLead: (lead: Lead): Lead => {
    const current = adminClientStorage.getLeads();
    const updated = [lead, ...current.filter((l) => l.id !== lead.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    }
    return lead;
  },

  // Knowledge Base
  getKnowledge: (): KnowledgeItem[] => {
    if (typeof window === 'undefined') return DEFAULT_KNOWLEDGE;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return DEFAULT_KNOWLEDGE;
  },

  addKnowledge: (item: Omit<KnowledgeItem, 'id'>): KnowledgeItem => {
    const newItem: KnowledgeItem = {
      ...item,
      id: 'kb-' + Date.now(),
    };
    const current = adminClientStorage.getKnowledge();
    const updated = [newItem, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(updated));
    }
    return newItem;
  },

  // Media
  getMedia: (): MediaLibraryItem[] => {
    if (typeof window === 'undefined') return DEFAULT_MEDIA;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return DEFAULT_MEDIA;
  },

  addMedia: (media: Omit<MediaLibraryItem, 'id' | 'createdAt'>): MediaLibraryItem => {
    const newItem: MediaLibraryItem = {
      ...media,
      id: 'med-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      usedIn: media.usedIn || [],
    };
    const current = adminClientStorage.getMedia();
    const updated = [newItem, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
    }
    return newItem;
  },

  deleteMedia: (id: string): boolean => {
    const current = adminClientStorage.getMedia();
    const updated = current.filter((m) => m.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
    }
    return true;
  },

  // Agent Metrics
  getMetrics: (): AgentMetric[] => {
    return [
      {
        id: 'met-1',
        timestamp: new Date().toISOString(),
        query: 'Como agendar avaliação na clínica?',
        response: 'Encaminhado para fluxo de agendamento online e WhatsApp.',
        rating: 'bom',
        topic: 'Agendamento',
        status: 'respondido',
      },
      {
        id: 'met-2',
        timestamp: new Date().toISOString(),
        query: 'Qual o valor da limpeza dentária?',
        response: 'Informado valor simulado de R$ 180,00 e condições.',
        rating: 'bom',
        topic: 'Preços',
        status: 'respondido',
      },
    ];
  },

  // Site Content & Slots
  getSiteContent: () => {
    if (typeof window === 'undefined') {
      return {
        slots: DEFAULT_SLOTS,
        customSections: [] as CustomSection[],
        mediaLibrary: DEFAULT_MEDIA,
        auditLogs: [] as AuditLogEntry[],
        lastPublished: new Date().toISOString(),
        hasUnpublished: false,
      };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }

    const initial = {
      slots: DEFAULT_SLOTS,
      customSections: [] as CustomSection[],
      mediaLibrary: DEFAULT_MEDIA,
      auditLogs: [
        {
          id: 'log-1',
          action: 'Inicialização da plataforma de gestão',
          user: 'Sistema OralPro',
          timestamp: new Date().toISOString(),
          details: 'Conteúdos sincronizados com sucesso.',
        },
      ] as AuditLogEntry[],
      lastPublished: new Date().toISOString(),
      hasUnpublished: false,
    };
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(initial));
    return initial;
  },

  updateSlot: (key: string, updates: Partial<SiteContentSlot>): boolean => {
    const data = adminClientStorage.getSiteContent();
    const index = data.slots.findIndex((s: SiteContentSlot) => s.key === key);
    if (index === -1) return false;

    data.slots[index] = {
      ...data.slots[index],
      ...updates,
      hasChanges: true,
    };
    data.hasUnpublished = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(data));
    }
    return true;
  },

  saveCustomSection: (section: Partial<CustomSection> & { id?: string }): boolean => {
    const data = adminClientStorage.getSiteContent();
    const id = section.id || 'sec-' + Date.now();
    const existingIndex = data.customSections.findIndex((s: CustomSection) => s.id === id);

    const fullSection: CustomSection = {
      id,
      page: (section.page || 'home') as any,
      sectionName: section.sectionName || 'Nova Secção',
      title: section.title || '',
      text: section.text || '',
      images: section.images || [],
      buttonText: section.buttonText,
      buttonLink: section.buttonLink,
      status: section.status || 'publicado',
      order: section.order || data.customSections.length + 1,
      createdAt: section.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      data.customSections[existingIndex] = fullSection;
    } else {
      data.customSections.push(fullSection);
    }
    data.hasUnpublished = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(data));
    }
    return true;
  },

  deleteCustomSection: (id: string): boolean => {
    const data = adminClientStorage.getSiteContent();
    data.customSections = data.customSections.filter((s: CustomSection) => s.id !== id);
    data.hasUnpublished = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(data));
    }
    return true;
  },

  publishSiteContent: (): boolean => {
    const data = adminClientStorage.getSiteContent();
    data.slots = data.slots.map((s: SiteContentSlot) => ({ ...s, hasChanges: false }));
    data.lastPublished = new Date().toISOString();
    data.hasUnpublished = false;
    data.auditLogs.unshift({
      id: 'log-' + Date.now(),
      action: 'Publicação oficial de conteúdos efetuada',
      user: 'Administrador OralPro',
      timestamp: new Date().toISOString(),
      details: 'Todas as alterações foram publicadas e sincronizadas.',
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(data));
    }
    return true;
  },
};
