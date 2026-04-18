"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/provider";
import { supabaseConfigured } from "@/lib/supabase/client";
import { useDashboardData } from "@/lib/dashboard/useDashboardData";
import {
  Search,
  Bell,
  Home,
  FileText,
  Users,
  ClipboardList,
  Calendar,
  BarChart3,
  Folder,
  Settings,
  Menu,
  X,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Mic,
  Send,
  Edit3,
  ChevronRight,
  Bot,
  Sparkles,
  Plus,
  ArrowDownRight,
  Eye,
  Download,
  MoreHorizontal,
  LogOut,
  HelpCircle,
  CreditCard,
  PieChart,
  Activity,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

/* ─────────────────────── DATA ─────────────────────── */

const NAV_ITEMS = [
  { label: "Panoramica", icon: Home, active: true },
  { label: "Fatture", icon: FileText, badge: 3 },
  { label: "Clienti", icon: Users },
  { label: "Preventivi", icon: ClipboardList },
  { label: "Scadenze", icon: Calendar, badge: 2 },
  { label: "Contabilità", icon: BarChart3 },
  { label: "Documenti", icon: Folder },
];

const NAV_BOTTOM = [
  { label: "Aiuto", icon: HelpCircle },
  { label: "Impostazioni", icon: Settings },
];

const INVOICES_DEMO = [
  {
    cliente: "Marco Bianchi",
    azienda: "Studio Bianchi",
    importo: "€1.200,00",
    data: "14 Apr 2026",
    stato: "pagata" as const,
    tipo: "Consulenza IT",
  },
  {
    cliente: "Studio Legale Verdi",
    azienda: "Verdi & Associati",
    importo: "€3.500,00",
    data: "12 Apr 2026",
    stato: "attesa" as const,
    tipo: "Sviluppo Web",
  },
  {
    cliente: "Francesca Moretti",
    azienda: "Moretti Design",
    importo: "€750,00",
    data: "10 Apr 2026",
    stato: "pagata" as const,
    tipo: "Grafica",
  },
  {
    cliente: "Agenzia Sole Srl",
    azienda: "Sole Media",
    importo: "€2.100,00",
    data: "08 Apr 2026",
    stato: "scaduta" as const,
    tipo: "Social Media",
  },
  {
    cliente: "Giuseppe Conti",
    azienda: "Conti Edilizia",
    importo: "€480,00",
    data: "05 Apr 2026",
    stato: "attesa" as const,
    tipo: "Preventivo",
  },
  {
    cliente: "Laura Ferrara",
    azienda: "Ferrara Consulting",
    importo: "€1.800,00",
    data: "02 Apr 2026",
    stato: "pagata" as const,
    tipo: "Consulenza",
  },
];

const STATO_CONFIG = {
  pagata: {
    label: "Pagata",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  attesa: {
    label: "In Attesa",
    icon: AlertCircle,
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  scaduta: { label: "Scaduta", icon: XCircle, bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const CHART_DATA_DEMO = [
  { month: "Nov", value: 2800, height: "45%" },
  { month: "Dic", value: 3200, height: "52%" },
  { month: "Gen", value: 2600, height: "42%" },
  { month: "Feb", value: 3800, height: "62%" },
  { month: "Mar", value: 4100, height: "67%" },
  { month: "Apr", value: 4250, height: "69%" },
];

const UPCOMING_DEMO = [
  { label: "IVA Trimestrale", date: "16 Mag 2026", type: "urgente" as const },
  { label: "F24 Contributi", date: "30 Mag 2026", type: "normale" as const },
  { label: "Rinnovo PEC", date: "15 Giu 2026", type: "info" as const },
];

/* ─────────────────────── HELPERS ─────────────────────── */

function todayIT(): string {
  const d = new Date();
  const giorni = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const mesi = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  return `${giorni[d.getDay()]} ${d.getDate()} ${mesi[d.getMonth()]} ${d.getFullYear()}`;
}

import { BrandLogo } from "@/components/BrandLogo";

/* ─────────────────────── COMPONENT ─────────────────────── */

const PIANO_LABEL: Record<string, string> = {
  gratuito: "Piano Gratuito",
  professionista: "Piano Professionista",
  impresa: "Piano Impresa",
};

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const userId = auth.stato === "autenticato" ? auth.user.id : null;
  const isDemo = auth.stato === "demo" || auth.stato === "non_autenticato";
  const db = useDashboardData(isDemo ? null : userId);

  // Derived: nome/cognome/piano dal DB utenti, con fallback demo
  const nome = auth.stato === "autenticato" ? auth.user.nome || "amico" : "Roberto";
  const cognome = auth.stato === "autenticato" ? auth.user.cognome : "Pizzini";
  const piano =
    auth.stato === "autenticato"
      ? (PIANO_LABEL[auth.user.piano] ?? "Piano Gratuito")
      : "Piano Professionista (demo)";
  const iniziali = `${nome[0] ?? "D"}${cognome[0] ?? ""}`.toUpperCase();

  // Dati: reali se autenticato, demo se demo mode
  const INVOICES = isDemo ? INVOICES_DEMO : db.fattureRecenti;
  const UPCOMING = isDemo ? UPCOMING_DEMO : db.scadenzeImminenti;
  const CHART_DATA = CHART_DATA_DEMO; // chart storico resta demo (serve aggregazione DB)

  const statFatturato = isDemo ? 4250 : Math.round(db.fatturatoMese / 100);
  const statFattPrecCents = db.fatturatoMesePrecedente;
  const statAttesaCount = isDemo ? 3 : db.inAttesaCount;
  const statAttesaImporto = isDemo
    ? "€6.080"
    : new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(db.inAttesaImporto / 100);
  const statClienti = isDemo ? 18 : db.clientiAttivi;
  const statProssima = isDemo ? { titolo: "IVA - 16 Mag", data: "Tra 30 giorni" } : db.prossimaScadenza;

  async function onLogout() {
    await auth.esci();
    router.replace("/accedi");
  }

  // Schermata di caricamento mentre verifichiamo la sessione
  if (auth.stato === "caricamento") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f1f5f9]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-10 h-10 rounded-xl bg-[#009246]/10 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#009246] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm">Carico la tua dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#f1f5f9]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[101] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ───── SIDEBAR ───── */}
      <aside
        className={`
          fixed top-0 left-0 z-[102] h-full w-[272px] bg-[#0f172a] text-white
          flex flex-col transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/[0.06]">
          <Link href="/">
            <BrandLogo variant="light" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Chiudi"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Invoice CTA */}
        <div className="px-4 py-4">
          <button className="w-full flex items-center justify-center gap-2 bg-[#009246] hover:bg-[#007a3a] text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#009246]/20 active:scale-[0.98]">
            <Plus size={16} />
            Nuova Fattura
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-3 mb-2">
            Menu Principale
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer
                  ${
                    item.active
                      ? "bg-white/[0.08] text-white"
                      : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                  }`}
              >
                <Icon size={18} className={item.active ? "text-[#009246]" : ""} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-md bg-[#009246]/20 text-[#009246] text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="my-4 border-t border-white/[0.06]" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-3 mb-2">
            Sistema
          </p>
          {NAV_BOTTOM.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 transition-all cursor-pointer"
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#009246] to-[#007a3a] flex items-center justify-center text-sm font-bold shadow-lg shadow-[#009246]/20">
              {iniziali}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {nome} {cognome}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{piano}</p>
            </div>
            <button
              onClick={onLogout}
              title={supabaseConfigured ? "Esci" : "Torna alla home"}
              aria-label="Esci"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <LogOut size={16} className="text-gray-500 hover:text-gray-300 transition-colors" />
            </button>
          </div>
        </div>
      </aside>

      {/* ───── MAIN AREA ───── */}
      <div className="flex-1 flex flex-col min-w-0">
        {isDemo && (
          <div
            role="status"
            aria-live="polite"
            className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 lg:px-8 py-2.5 text-center font-medium flex items-center justify-center gap-4"
          >
            {auth.stato === "non_autenticato" ? (
              <>
                <span>Stai vedendo un&apos;anteprima con dati di esempio.</span>
                <Link
                  href="/registrati"
                  className="inline-flex items-center gap-1 bg-[#009246] text-white px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-[#007a3a] transition-colors"
                >
                  Registrati gratis →
                </Link>
              </>
            ) : (
              <span>🟡 MODALITÀ DEMO — Dati mostrati sono fittizi. Per dati reali connetti Supabase.</span>
            )}
          </div>
        )}
        {/* ───── TOP BAR ───── */}
        <header className="h-[72px] bg-white border-b border-gray-200/80 flex items-center px-4 lg:px-8 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <Menu size={20} className="text-gray-700" />
          </button>

          <span className="lg:hidden">
            <BrandLogo size="sm" />
          </span>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca fatture, clienti, documenti..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                Ctrl+K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-500" />
              {isDemo && (
                <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                  3
                </span>
              )}
            </button>

            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#009246] to-[#007a3a] flex items-center justify-center text-white text-[11px] font-bold">
                {iniziali}
              </div>
              <span className="text-sm font-medium text-gray-700">{nome}</span>
              <ChevronRight size={14} className="text-gray-400 rotate-90" />
            </button>
          </div>
        </header>

        {/* ───── SCROLLABLE CONTENT ───── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
            {/* ─── WELCOME + VOICE ─── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-[28px] font-bold text-[#0f172a]">Buongiorno, {nome}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {todayIT()} &middot; {piano}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVoiceActive(!voiceActive)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]
                    ${
                      voiceActive
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 pulse-glow"
                        : "bg-[#009246] hover:bg-[#007a3a] text-white shadow-lg shadow-[#009246]/25"
                    }`}
                >
                  <Mic size={18} />
                  {voiceActive ? "Sto ascoltando..." : "Parla con digITAle"}
                </button>
                <button className="p-3 rounded-2xl border border-gray-200 hover:border-[#009246]/40 hover:bg-[#009246]/5 transition-all">
                  <Plus size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* ─── STATS ROW ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {/* Fatturato */}
              <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Fatturato Mese
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp size={18} className="text-emerald-600" />
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-[#0f172a]">
                  &euro;{statFatturato.toLocaleString("it-IT")}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  {statFattPrecCents > 0 && !isDemo ? (
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ArrowUpRight size={12} />
                      {statFatturato > 0
                        ? `+${Math.round(((db.fatturatoMese - statFattPrecCents) / statFattPrecCents) * 100)}%`
                        : "0%"}
                    </span>
                  ) : isDemo ? (
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ArrowUpRight size={12} /> +12%
                    </span>
                  ) : null}
                  <span className="text-xs text-gray-400">vs mese scorso</span>
                </div>
              </div>

              {/* In Attesa */}
              <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    In Attesa
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Clock size={18} className="text-amber-600" />
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-[#0f172a]">{statAttesaCount}</p>
                <p className="text-xs text-gray-400 mt-2">{statAttesaImporto} in sospeso</p>
              </div>

              {/* Clienti */}
              <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Clienti Attivi
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users size={18} className="text-blue-600" />
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-[#0f172a]">{statClienti}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  {isDemo && (
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ArrowUpRight size={12} /> +2
                    </span>
                  )}
                  <span className="text-xs text-gray-400">attivi in totale</span>
                </div>
              </div>

              {/* Scadenza */}
              <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Prossima Scadenza
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <Calendar size={18} className="text-red-600" />
                  </span>
                </div>
                {statProssima ? (
                  <>
                    <p className="text-2xl font-extrabold text-red-600">{statProssima.titolo}</p>
                    <p className="text-xs text-red-500 font-medium mt-2">{statProssima.data}</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-extrabold text-gray-400">Nessuna</p>
                    <p className="text-xs text-gray-400 font-medium mt-2">Nessuna scadenza imminente</p>
                  </>
                )}
              </div>
            </div>

            {/* ─── MIDDLE ROW: CHART + SCADENZE ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                  <div>
                    <h2 className="text-base font-semibold text-[#0f172a]">Andamento Fatturato</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Ultimi 6 mesi</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs font-medium text-[#009246] bg-[#009246]/8 px-3 py-1.5 rounded-lg">
                      Mensile
                    </button>
                    <button className="text-xs font-medium text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg transition-colors">
                      Settimanale
                    </button>
                  </div>
                </div>
                <div className="px-6 py-6">
                  <div className="flex items-end gap-4 h-[200px]">
                    {CHART_DATA.map((bar) => (
                      <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[11px] font-semibold text-gray-500">
                          &euro;{bar.value.toLocaleString()}
                        </span>
                        <div className="w-full relative" style={{ height: "160px" }}>
                          <div
                            className="absolute bottom-0 w-full rounded-xl bg-gradient-to-t from-[#009246] to-[#00b359] transition-all duration-700 hover:opacity-80"
                            style={{ height: bar.height }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-gray-400">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scadenze */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                  <h2 className="text-base font-semibold text-[#0f172a]">Prossime Scadenze</h2>
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <div className="divide-y divide-gray-50">
                  {UPCOMING.map((item) => (
                    <div
                      key={item.label}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          item.type === "urgente"
                            ? "bg-red-500"
                            : item.type === "normale"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0f172a]">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          item.type === "urgente"
                            ? "bg-red-50 text-red-600"
                            : item.type === "normale"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-50">
                  <button className="w-full text-center text-xs font-medium text-[#009246] hover:text-[#007a3a] transition-colors py-2">
                    Vedi tutte le scadenze
                  </button>
                </div>
              </div>
            </div>

            {/* ─── BOTTOM ROW: TABLE + VOICE ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Invoices Table */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                  <div>
                    <h2 className="text-base font-semibold text-[#0f172a]">Fatture Recenti</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Ultime 6 fatture emesse</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-[#009246] hover:text-[#007a3a] transition-colors">
                      Vedi tutte <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Empty state */}
                {!isDemo && db.isEmpty && !db.loading && (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#009246]/10 flex items-center justify-center mb-4">
                      <FileText size={28} className="text-[#009246]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#0f172a] mb-2">Nessuna fattura ancora</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Crea la tua prima fattura con il pulsante verde in alto a sinistra.
                    </p>
                  </div>
                )}

                {/* Desktop table */}
                {(isDemo || !db.isEmpty) && (
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/60">
                          <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                            Cliente
                          </th>
                          <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                            Tipo
                          </th>
                          <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                            Importo
                          </th>
                          <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                            Data
                          </th>
                          <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                            Stato
                          </th>
                          <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                            Azioni
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {INVOICES.map((inv, i) => {
                          const stato = STATO_CONFIG[inv.stato];
                          return (
                            <tr
                              key={i}
                              className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                            >
                              <td className="px-6 py-4">
                                <p className="text-sm font-semibold text-[#0f172a]">{inv.cliente}</p>
                                <p className="text-xs text-gray-400">{inv.azienda}</p>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{inv.tipo}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-[#0f172a] font-mono">
                                {inv.importo}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{inv.data}</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${stato.bg} ${stato.text}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${stato.dot}`} />
                                  {stato.label}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    title="Visualizza"
                                  >
                                    <Eye size={14} className="text-gray-400" />
                                  </button>
                                  <button
                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    title="Scarica"
                                  >
                                    <Download size={14} className="text-gray-400" />
                                  </button>
                                  <button
                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    title="Altro"
                                  >
                                    <MoreHorizontal size={14} className="text-gray-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Mobile cards */}
                {(isDemo || !db.isEmpty) && (
                  <div className="sm:hidden divide-y divide-gray-100">
                    {INVOICES.map((inv, i) => {
                      const stato = STATO_CONFIG[inv.stato];
                      return (
                        <div key={i} className="px-5 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600">
                              {inv.cliente
                                .split(" ")
                                .map((w) => w[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#0f172a]">{inv.cliente}</p>
                              <p className="text-xs text-gray-400">{inv.data}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#0f172a] font-mono">{inv.importo}</p>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold mt-1 ${stato.bg} ${stato.text}`}
                            >
                              <span className={`w-1 h-1 rounded-full ${stato.dot}`} />
                              {stato.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Voice Assistant */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-[#009246]/10 flex items-center justify-center">
                    <Bot size={18} className="text-[#009246]" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#0f172a]">Assistente Vocale</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-600 font-medium">Attivo</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
                  {/* System message */}
                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      Oggi, {new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-[88%] bg-[#009246] text-white px-4 py-3 rounded-2xl rounded-br-md text-[13px] leading-relaxed shadow-sm">
                      &ldquo;Crea una fattura per Mario Rossi, 500 euro per consulenza web&rdquo;
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex justify-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#009246]/10 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={14} className="text-[#009246]" />
                    </div>
                    <div className="max-w-[85%]">
                      <div className="bg-gray-50 text-[#0f172a] px-4 py-3 rounded-2xl rounded-tl-md text-[13px] leading-relaxed">
                        <p>
                          Fattura <span className="font-bold">#2026-047</span> creata per{" "}
                          <span className="font-bold">Mario Rossi</span>
                        </p>
                        <div className="mt-2 p-2.5 bg-white rounded-xl border border-gray-100 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Imponibile</span>
                            <span className="font-semibold">&euro;500,00</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">IVA 22%</span>
                            <span className="font-semibold">&euro;110,00</span>
                          </div>
                          <div className="flex justify-between text-xs pt-1 border-t border-gray-100">
                            <span className="text-gray-500 font-medium">Totale</span>
                            <span className="font-bold text-[#009246]">&euro;610,00</span>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-500 text-xs">Vuoi inviarla subito via PEC?</p>
                      </div>
                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        <button className="flex items-center gap-1.5 bg-[#009246] hover:bg-[#007a3a] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm">
                          <Send size={12} /> Invia via PEC
                        </button>
                        <button className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-600 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors">
                          <Edit3 size={12} /> Modifica
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Scrivi o parla con digITAle..."
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                    />
                    <button className="w-10 h-10 rounded-xl bg-[#009246] hover:bg-[#007a3a] flex items-center justify-center text-white transition-colors shrink-0 shadow-sm active:scale-95">
                      <Mic size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
              <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Azioni Rapide
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Nuova Fattura", icon: FileText },
                  { label: "Aggiungi Cliente", icon: Users },
                  { label: "Crea Preventivo", icon: ClipboardList },
                  { label: "Registra Spesa", icon: ArrowDownRight },
                  { label: "Scadenzario", icon: Calendar },
                  { label: "Report Mensile", icon: PieChart },
                  { label: "Pagamenti", icon: CreditCard },
                  { label: "Attività Recente", icon: Activity },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-[#009246]/40 hover:bg-[#009246]/5 text-sm font-medium text-gray-600 hover:text-[#009246] transition-all"
                    >
                      <Icon size={14} />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Back to landing */}
            <div className="text-center pb-4">
              <Link href="/" className="text-sm text-gray-400 hover:text-[#009246] transition-colors">
                &larr; Torna alla pagina principale
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
