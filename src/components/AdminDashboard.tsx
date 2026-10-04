import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Lock,
  LogOut,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Layers,
  LayoutGrid,
  FileText,
  FolderOpen,
  Send,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Booking, Lead, KnowledgeItem, MediaAsset, AgentMetric, AdminUser } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { LanguageSelector } from './LanguageSelector';
import { OralProLogo } from './OralProLogo';
import { SiteContentManager } from './SiteContentManager';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

type AdminMainTab =
  | 'visao_geral'
  | 'paginas'
  | 'conteudos'
  | 'biblioteca'
  | 'publicacao'
  | 'agendamentos'
  | 'leads'
  | 'atendimento_ia';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const { t } = useLanguage();
  const {
    slots,
    customSections,
    mediaLibrary,
    auditLogs,
    lastPublished,
    hasUnpublished,
    publishChanges,
    saveDrafts,
    revertDrafts,
    refreshContent,
  } = useSiteContent();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [emailInput, setEmailInput] = useState<string>('admin@oralpro.it');
  const [passwordInput, setPasswordInput] = useState<string>('oralpro2026!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Active Main Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminMainTab>('visao_geral');
  const [targetPageFilterForContent, setTargetPageFilterForContent] = useState<string>('todos');

  // Real-time CRM & Knowledge Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [metrics, setMetrics] = useState<AgentMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Sincronizado');

  // Preview Mode inside Publishing tab
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewPage, setPreviewPage] = useState<'home' | 'servicos' | 'metodo' | 'areas' | 'sobre' | 'galeria'>('home');
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // CRM Filters & Modals
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('');

  // Knowledge form
  const [showAddKbModal, setShowAddKbModal] = useState<boolean>(false);
  const [kbTitle, setKbTitle] = useState('');
  const [kbContent, setKbContent] = useState('');
  const [kbCategory, setKbCategory] = useState<'servicos' | 'metodo' | 'precos_condicoes' | 'faq' | 'identidade'>('faq');
  const [kbVerified, setKbVerified] = useState(true);

  // Check server session on mount
  useEffect(() => {
    const checkServerSession = async () => {
      setIsCheckingAuth(true);
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('oralpro_admin_token') || sessionStorage.getItem('oralpro_admin_token')
          : null;

      if (!token) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/session', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setIsAuthenticated(true);
            setAdminUser(data.user);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        // In local sandbox, keep logged in if token is present
        setIsAuthenticated(true);
        setAdminUser({
          id: 'usr_admin_01',
          name: 'Administrador OralPro Italia',
          email: 'admin@oralpro.it',
          role: 'superadmin',
        });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkServerSession();
  }, []);

  // Safe Fetch Helper
  const safeFetch = async <T,>(url: string): Promise<T | null> => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('oralpro_admin_token') || sessionStorage.getItem('oralpro_admin_token')
          : '';
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return null;
      const text = await res.text();
      if (!text || text.trim().startsWith('<')) return null;
      const parsed = JSON.parse(text);
      return parsed && parsed.success ? (parsed.data as T) : null;
    } catch {
      return null;
    }
  };

  const loadAllData = async () => {
    try {
      setSyncStatus('A atualizar...');
      const [dataB, dataL, dataK, dataM, dataA] = await Promise.all([
        safeFetch<Booking[]>('/api/bookings'),
        safeFetch<Lead[]>('/api/leads'),
        safeFetch<KnowledgeItem[]>('/api/knowledge-base'),
        safeFetch<MediaAsset[]>('/api/media'),
        safeFetch<AgentMetric[]>('/api/agent-metrics'),
      ]);

      if (dataB) setBookings(dataB);
      if (dataL) setLeads(dataL);
      if (dataK) setKnowledge(dataK);
      if (dataM) setMedia(dataM);
      if (dataA) setMetrics(dataA);

      setSyncStatus('Sincronizado');
    } catch {
      setSyncStatus('Reconectando...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      const interval = setInterval(loadAllData, 8000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Login Form Submission with Server-Side Validation
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('oralpro_admin_token', data.token);
          sessionStorage.setItem('oralpro_admin_auth', 'admin2026');
        }
        setIsAuthenticated(true);
        setAdminUser(data.user);
        loadAllData();
        refreshContent();
      } else {
        setAuthError(data.error || 'Credenciais inválidas. Verifique o email e a palavra-passe.');
      }
    } catch {
      setAuthError('Erro de ligação com o servidor administrativo. Tente novamente.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = () => {
    setEmailInput('admin@oralpro.it');
    setPasswordInput('oralpro2026!');
    handleLoginSubmit();
  };

  // Logout with Server Notification
  const handleLogout = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('oralpro_admin_token') : null;
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // ignore
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('oralpro_admin_token');
      sessionStorage.removeItem('oralpro_admin_auth');
    }
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Publish changes action
  const handlePublishAll = async () => {
    setIsPublishing(true);
    setPublishSuccessMsg(null);
    try {
      const success = await publishChanges();
      if (success) {
        setPublishSuccessMsg('Todas as alterações e fotografias foram publicadas oficialmente no site!');
        setTimeout(() => setPublishSuccessMsg(null), 5000);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Revert changes action
  const handleRevertAll = async () => {
    if (confirm('Tem a certeza que deseja descartar todos os rascunhos não publicados?')) {
      await revertDrafts();
    }
  };

  // Booking Update Handler
  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('oralpro_admin_token') : '';
      const payload: any = {
        status: newStatus || selectedBooking.status,
        notes: editNotes,
      };

      if (rescheduleDate && rescheduleTime) {
        payload.date = rescheduleDate;
        payload.time = rescheduleTime;
      }

      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Erro ao atualizar agendamento.');
        return;
      }

      setSelectedBooking(null);
      loadAllData();
    } catch {
      alert('Erro ao guardar alterações.');
    }
  };

  // Add Knowledge Article
  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('oralpro_admin_token') : '';
      const res = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category: kbCategory,
          title: kbTitle,
          content: kbContent,
          verified: kbVerified,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddKbModal(false);
        setKbTitle('');
        setKbContent('');
        loadAllData();
      }
    } catch {
      alert('Erro ao registar artigo.');
    }
  };

  // Check if checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <OralProLogo size="lg" light />
        <div className="mt-6 flex items-center gap-3 text-slate-400 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          <span>A validar sessão administrativa no servidor...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATION LOGIN PORTAL (Displayed when not authenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-8 selection:bg-blue-600 selection:text-white">
        {/* Top return bar */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-semibold text-slate-300">OralPro Italia</span>
          </div>
          <button
            onClick={onBackToSite}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            <span>Voltar ao Site Público</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Central Login Card */}
        <div className="max-w-md w-full mx-auto my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <OralProLogo size="md" light />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Painel de Administração OralPro</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Acesso reservado à administração e direção comercial da OralPro Italia.
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email ou Utilizador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@oralpro.it"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Palavra-passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>A autenticar no servidor...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700/60 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Acesso Imediato com Credenciais Predefinidas</span>
            </button>
            <p className="text-[11px] text-slate-500 mt-2">
              Credenciais: <code className="text-slate-400">admin@oralpro.it</code> / <code className="text-slate-400">oralpro2026!</code>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-500">
          <p>OralPro Italia &bull; Gestão de Conteúdos, Imagens e Captação &bull; Fuso Europe/Lisbon</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* ----------------- TOP ADMIN HEADER ----------------- */}
      <header className="bg-slate-950 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <OralProLogo size="header" light />
            <span className="hidden sm:inline-block h-5 w-px bg-slate-800" />
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                Admin Oficial
              </span>
              <span className="text-slate-400">
                {adminUser?.email || 'admin@oralpro.it'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{syncStatus}</span>
              <span className="text-slate-600">|</span>
              <Clock className="w-3 h-3 text-blue-400" />
              <span>Europe/Lisbon</span>
            </div>

            <LanguageSelector />

            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Abrir o site público"
            >
              <span>Ver Site Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              title="Terminar sessão administrativa"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ----------------- PRIMARY ADMIN TABS NAVIGATION ----------------- */}
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
            <button
              onClick={() => setActiveTab('visao_geral')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'visao_geral'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('paginas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'paginas'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Páginas do Site</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                6
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('conteudos');
                setTargetPageFilterForContent('todos');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'conteudos'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Conteúdos e Imagens</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {slots.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('biblioteca')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'biblioteca'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Biblioteca de Imagens</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {mediaLibrary.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('publicacao')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'publicacao'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : hasUnpublished
                  ? 'text-amber-400 hover:bg-slate-800'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pré-visualização e Publicação</span>
              {hasUnpublished && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            <span className="h-4 w-px bg-slate-800 shrink-0 mx-1" />

            <button
              onClick={() => setActiveTab('agendamentos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'agendamentos'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Agendamentos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'leads'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leads</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('atendimento_ia')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'atendimento_ia'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Atendimento IA</span>
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- MAIN VIEW CONTENT ROUTER ----------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ============================================================== */}
        {/* TAB 1: VISÃO GERAL (OVERVIEW) */}
        {/* ============================================================== */}
        {activeTab === 'visao_geral' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Welcome & KPI Metrics */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                    Painel Geral de Controlo
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Visão Geral da OralPro Italia
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Resumo em tempo real das páginas, secções, fotografias publicadas e alterações recentes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {hasUnpublished ? (
                    <button
                      onClick={() => setActiveTab('publicacao')}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Existem alterações por publicar</span>
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Site 100% atualizado e publicado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div
                  onClick={() => setActiveTab('paginas')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">6</div>
                  <div className="text-xs font-semibold text-slate-600">Páginas no Site</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Todas operacionais</div>
                </div>

                <div
                  onClick={() => setActiveTab('conteudos')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{slots.length}</div>
                  <div className="text-xs font-semibold text-slate-600">Secções Editáveis</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Imagens & textos configurados</div>
                </div>

                <div
                  onClick={() => setActiveTab('biblioteca')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{mediaLibrary.length}</div>
                  <div className="text-xs font-semibold text-slate-600">Biblioteca de Imagens</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Alta resolução catalogadas</div>
                </div>

                <div
                  onClick={() => setActiveTab('agendamentos')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{bookings.length}</div>
                  <div className="text-xs font-semibold text-slate-600">Agendamentos Ativos</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Fuso Europe/Lisbon</div>
                </div>
              </div>
            </div>

            {/* Quick Pages Summary */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Resumo das Páginas do Site</h2>
                  <p className="text-xs text-slate-500">Clique para editar diretamente as imagens e textos de qualquer página.</p>
                </div>
                <button
                  onClick={() => setActiveTab('paginas')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver todas</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Página Inicial',
                    path: '/',
                    key: 'home',
                    sectionsCount: 2,
                    desc: 'Apresentação Hero e destaque do ecossistema OralPro.',
                  },
                  {
                    title: 'Sobre a OralPro',
                    path: '/sobre',
                    key: 'sobre',
                    sectionsCount: 2,
                    desc: 'Mario Provenzano em conferências e Masterclasses em Itália.',
                  },
                  {
                    title: 'Serviços Especializados',
                    path: '/servicos',
                    key: 'servicos',
                    sectionsCount: 3,
                    desc: 'Implantologia, Estética Dentária e Ortodontia Invisível.',
                  },
                  {
                    title: 'Galeria Oficial (@oralpro.italia)',
                    path: '/galeria',
                    key: 'galeria',
                    sectionsCount: 6,
                    desc: '6 fotografias de bastidores, eventos ao vivo e clínicas parceiras.',
                  },
                  {
                    title: 'Método OralPro',
                    path: '/metodo',
                    key: 'metodo',
                    sectionsCount: 1,
                    desc: 'As 4 etapas de diagnóstico, planeamento e triagem comercial.',
                  },
                  {
                    title: 'Áreas Clínicas',
                    path: '/areas',
                    key: 'areas',
                    sectionsCount: 3,
                    desc: 'Reabilitação total, planeamento digital e estética do sorriso.',
                  },
                ].map((pg) => (
                  <div
                    key={pg.key}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                          {pg.title}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {pg.sectionsCount} secções
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{pg.desc}</p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">{pg.path}</span>
                      <button
                        onClick={() => {
                          setTargetPageFilterForContent(pg.key);
                          setActiveTab('conteudos');
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Gerir Secções &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log / Recent Changes */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Histórico de Alterações Recentes</h2>
                  <p className="text-xs text-slate-500">Registo de auditoria de publicações, rascunhos e logins no servidor.</p>
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  {auditLogs.length} registos gravados
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {auditLogs.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Ainda não existem registos de auditoria gravados.
                  </div>
                ) : (
                  auditLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{log.action}</p>
                          {log.details && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                          )}
                          <span className="text-[10px] text-slate-400">Por: {log.user}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                        {new Date(log.timestamp).toLocaleString('pt-PT')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PÁGINAS DO SITE */}
        {/* ============================================================== */}
        {activeTab === 'paginas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                Páginas do Site OralPro
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Lista de todas as páginas públicas com as respetivas secções editáveis e fotografias vinculadas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    title: 'Página Inicial (Home)',
                    url: '/',
                    key: 'home',
                    desc: 'A primeira impressão do visitante: apresentação oficial com foco em captação de pacientes particulares de alto valor.',
                    sections: [
                      'Apresentação (Hero) - Foto principal',
                      'Sobre a OralPro - Resumo institucional com Mario Provenzano',
                    ],
                  },
                  {
                    title: 'Sobre a OralPro',
                    url: '/sobre',
                    key: 'sobre',
                    desc: 'História, posicionamento e trajetória internacional de Mario Provenzano com mais de 281 clínicas acompanhadas.',
                    sections: [
                      'Apresentação Fundador - Foto oficial em conferência médica',
                      'Masterclasses & Eventos dal Vivo - Sessões presenciais com diretores de clínicas',
                    ],
                  },
                  {
                    title: 'Serviços Especializados',
                    url: '/servicos',
                    key: 'servicos',
                    desc: 'Planos estruturados para as 3 áreas prioritárias de alta rentabilidade clínica.',
                    sections: [
                      'Implantologia e Reabilitações Fixas',
                      'Estética Dentária e Facetas Cerâmicas',
                      'Ortodontia Invisível e Alinhadores Transparentes',
                    ],
                  },
                  {
                    title: 'Galeria Oficial (@oralpro.italia)',
                    url: '/galeria',
                    key: 'galeria',
                    desc: 'Fotografias reais das masterclasses, bastidores e estúdios odontológicos parceiros em Itália.',
                    sections: [
                      'Foto 1: Apresentação Mario Provenzano',
                      'Foto 2: Masterclasses com Médicos Dentistas',
                      'Foto 3: Gabinetes Clínicos Parceiros',
                      'Foto 4: Consultoria e Triagem com Secretárias',
                      'Foto 5: Biossegurança e Bloco Cirúrgico',
                      'Foto 6: Scanner Intraoral e Planeamento 3D',
                    ],
                  },
                  {
                    title: 'Método de Trabalho OralPro',
                    url: '/metodo',
                    key: 'metodo',
                    desc: 'O passo a passo estratégico em 4 fases: Conhecer, Estruturar, Executar e Acompanhar.',
                    sections: ['O Método em 4 Etapas - Visão global de execução e triagem'],
                  },
                  {
                    title: 'Áreas Clínicas',
                    url: '/areas',
                    key: 'areas',
                    desc: 'Destaques clínicos das especialidades atendidas pelos estúdios parceiros.',
                    sections: [
                      'Reabilitação Oral e Arcada Total',
                      'Ortodontia Digital e Alinhadores',
                      'Planeamento Estético do Sorriso',
                    ],
                  },
                ].map((pg) => (
                  <div
                    key={pg.key}
                    className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-base text-slate-900">{pg.title}</h3>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {pg.url}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">{pg.desc}</p>

                      <div className="space-y-1.5 mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Secções Editáveis:
                        </span>
                        {pg.sections.map((sec, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>{sec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setTargetPageFilterForContent(pg.key);
                          setActiveTab('conteudos');
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Gerir Conteúdos desta Página</span>
                      </button>

                      <button
                        onClick={() => {
                          setPreviewPage(pg.key as any);
                          setActiveTab('publicacao');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pré-visualizar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CONTEÚDOS E IMAGENS */}
        {/* ============================================================== */}
        {activeTab === 'conteudos' && (
          <div className="animate-fadeIn">
            <SiteContentManager
              initialSubTab="campos"
              initialPageFilter={targetPageFilterForContent}
              onNavigateToPreview={() => setActiveTab('publicacao')}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: BIBLIOTECA DE IMAGENS */}
        {/* ============================================================== */}
        {activeTab === 'biblioteca' && (
          <div className="animate-fadeIn">
            <SiteContentManager
              initialSubTab="biblioteca"
              onNavigateToPreview={() => setActiveTab('publicacao')}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: PRÉ-VISUALIZAÇÃO E PUBLICAÇÃO */}
        {/* ============================================================== */}
        {activeTab === 'publicacao' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Centro de Pré-visualização e Publicação
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Reveja as alterações de fotografias e textos antes de as tornar públicas no site oficial.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={saveDrafts}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Guardar Rascunho</span>
                  </button>

                  <button
                    onClick={handleRevertAll}
                    disabled={!hasUnpublished}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reverter Rascunhos</span>
                  </button>

                  <button
                    onClick={handlePublishAll}
                    disabled={isPublishing}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>A publicar...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Publicar Alterações no Site Oficial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {publishSuccessMsg && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{publishSuccessMsg}</span>
                </div>
              )}

              {/* Status summary */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      hasUnpublished ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {hasUnpublished
                        ? 'Existem modificações gravadas como rascunho por publicar'
                        : 'Todas as secções estão sincronizadas e publicadas no site'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Última publicação:{' '}
                      {lastPublished ? new Date(lastPublished).toLocaleString('pt-PT') : 'Inicial'}
                    </p>
                  </div>
                </div>

                {/* Device switch buttons */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      previewDevice === 'desktop'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Computador"
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      previewDevice === 'tablet'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Tablet"
                  >
                    <Tablet className="w-4 h-4" />
                    <span className="hidden sm:inline">Tablet</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      previewDevice === 'mobile'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Telemóvel"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Telemóvel</span>
                  </button>
                </div>
              </div>

              {/* Page Select for Preview Frame */}
              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-600 shrink-0">Página:</span>
                {[
                  { key: 'home', label: 'Início (Hero)' },
                  { key: 'sobre', label: 'Sobre a OralPro' },
                  { key: 'servicos', label: 'Serviços' },
                  { key: 'galeria', label: 'Galeria @oralpro.italia' },
                  { key: 'metodo', label: 'Método' },
                  { key: 'areas', label: 'Áreas Clínicas' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setPreviewPage(item.key as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      previewPage === item.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Simulated Responsive Preview Canvas */}
              <div className="mt-6 bg-slate-950 rounded-2xl p-4 sm:p-6 flex justify-center border border-slate-800">
                <div
                  className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border border-slate-300 ${
                    previewDevice === 'mobile'
                      ? 'w-[375px] min-h-[600px]'
                      : previewDevice === 'tablet'
                      ? 'w-[768px] min-h-[600px]'
                      : 'w-full min-h-[600px]'
                  }`}
                >
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="font-mono">https://oralpro.it/{previewPage === 'home' ? '' : previewPage}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Simulador de Pré-visualização
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="text-center max-w-xl mx-auto py-6">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                          Pré-visualização da Página &bull; {previewPage.toUpperCase()}
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 mt-3">
                          {previewPage === 'home' && 'Trazemos Pacientes de Alto Valor para o seu Consultório'}
                          {previewPage === 'sobre' && 'Assessoria Comercial Exclusiva com Mario Provenzano'}
                          {previewPage === 'servicos' && 'Tratamentos de Elevada Rentabilidade Odontológica'}
                          {previewPage === 'galeria' && 'Galeria Oficial @oralpro.italia'}
                          {previewPage === 'metodo' && 'O Método Comercial OralPro em 4 Fases'}
                          {previewPage === 'areas' && 'Especialidades Clínicas Integradas'}
                        </h2>
                      </div>

                      {/* Display slots configured for this page */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {slots
                          .filter((s) => s.page === previewPage)
                          .map((slot) => {
                            const activeImg = slot.draftImageUrl || slot.imageUrl;
                            return (
                              <div
                                key={slot.key}
                                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-xs text-slate-800">
                                      {slot.sectionLabel}
                                    </span>
                                    {slot.hasChanges && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                        Modificado (Rascunho)
                                      </span>
                                    )}
                                  </div>
                                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-200 relative mb-3">
                                    <img
                                      src={activeImg}
                                      alt={slot.draftAltText || slot.altText}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-xs text-slate-600 line-clamp-2">
                                    {slot.draftTitle || slot.title || slot.description}
                                  </p>
                                </div>

                                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                                  <span>Aspecto: {slot.draftAspectRatio || slot.aspectRatio}</span>
                                  <button
                                    onClick={() => {
                                      setTargetPageFilterForContent(slot.page);
                                      setActiveTab('conteudos');
                                    }}
                                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                                  >
                                    Editar este campo
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: AGENDAMENTOS (CRM & AGENDA) */}
        {/* ============================================================== */}
        {activeTab === 'agendamentos' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Reuniões & Agendamentos Comerciais
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Reuniões de diagnóstico e apresentação estratégica sincronizadas no fuso Europe/Lisbon.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="todos">Todos os Estados</option>
                    <option value="confirmado">Confirmados</option>
                    <option value="concluido">Concluídos</option>
                    <option value="cancelado">Cancelados</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Clínica & Contacto</th>
                      <th className="py-3 px-4">Tipo de Reunião</th>
                      <th className="py-3 px-4">Data & Hora (Lisboa)</th>
                      <th className="py-3 px-4">Interesse / Gabinetes</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings
                      .filter((b) => bookingFilterStatus === 'todos' || b.status === bookingFilterStatus)
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{b.name}</div>
                            <div className="text-[11px] text-slate-500">{b.clinicName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {b.email} &bull; {b.phone}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">{b.typeLabel}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-900">{b.date}</span>
                            <span className="text-slate-500 block font-mono text-[11px]">{b.time}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div>{b.chairsCount || 'Não informado'}</div>
                            <div className="text-[11px] text-slate-400">
                              {b.targetServices?.join(', ') || 'Captação Geral'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.status === 'confirmado'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : b.status === 'concluido'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setEditNotes(b.notes || '');
                                setNewStatus(b.status);
                                setRescheduleDate(b.date);
                                setRescheduleTime(b.time);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                            >
                              Gerir
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: LEADS */}
        {/* ============================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                Contactos e Oportunidades Comerciais (Leads)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Leads recebidas via site, formulário de contacto e assistente virtual.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Nome & Clínica</th>
                      <th className="py-3 px-4">Contactos</th>
                      <th className="py-3 px-4">Interesse</th>
                      <th className="py-3 px-4">Origem</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Data de Registo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {l.name}
                          <span className="block font-normal text-slate-500 text-[11px]">
                            {l.clinicName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          {l.email}
                          <span className="block text-slate-400">{l.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{l.interest}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                            {l.source}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(l.createdAt).toLocaleDateString('pt-PT')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: ATENDIMENTO DO AGENTE & IA */}
        {/* ============================================================== */}
        {activeTab === 'atendimento_ia' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Base de Conhecimento do Assistente Virtual
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Artigos validados que alimentam as respostas automatizadas com humanização e rigor.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddKbModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Artigo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {knowledge.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {item.category}
                      </span>
                      {item.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verificado OralPro</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Interações Recentes com Visitantes
              </h2>
              <div className="divide-y divide-slate-100">
                {metrics.slice(0, 6).map((m) => (
                  <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">&ldquo;{m.query}&rdquo;</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.response}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
                      {m.topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ----------------- MODAL: EDIT BOOKING ----------------- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Gerir Agendamento &bull; {selectedBooking.clinicName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Contacto: {selectedBooking.name} ({selectedBooking.phone || selectedBooking.email})
            </p>

            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estado</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="confirmado">Confirmado</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hora (Lisboa)</label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notas Internas</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Informações adicionais para a reunião..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Guardar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: ADD KNOWLEDGE ----------------- */}
      {showAddKbModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Novo Artigo de Conhecimento</h3>
            <p className="text-xs text-slate-500 mb-4">
              Adicione respostas oficiais para o assistente de IA.
            </p>

            <form onSubmit={handleAddKnowledge} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
                <select
                  value={kbCategory}
                  onChange={(e: any) => setKbCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="servicos">Serviços e Tratamentos</option>
                  <option value="metodo">Método OralPro</option>
                  <option value="precos_condicoes">Condições Comerciais</option>
                  <option value="faq">Perguntas Frequentes</option>
                  <option value="identidade">Identidade e Empresa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título / Questão</label>
                <input
                  type="text"
                  value={kbTitle}
                  onChange={(e) => setKbTitle(e.target.value)}
                  placeholder="Ex: Como funciona o agendamento de diagnóstico?"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Conteúdo / Resposta</label>
                <textarea
                  rows={4}
                  value={kbContent}
                  onChange={(e) => setKbContent(e.target.value)}
                  placeholder="Resposta oficial detalhada e humanizada..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddKbModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Registar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
