"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/provider";
import { supabaseConfigured } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import {
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
  Plus,
  LogOut,
  HelpCircle,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Panoramica", icon: Home, href: "/dashboard" },
  { label: "Fatture", icon: FileText, href: "/dashboard/fatture" },
  { label: "Clienti", icon: Users, href: "/dashboard/clienti" },
  { label: "Preventivi", icon: ClipboardList, href: "/dashboard/preventivi", presto: true },
  { label: "Scadenze", icon: Calendar, href: "/dashboard/scadenze", presto: true },
  { label: "Contabilità", icon: BarChart3, href: "/dashboard/contabilita", presto: true },
  { label: "Documenti", icon: Folder, href: "/dashboard/documenti", presto: true },
];

const NAV_BOTTOM = [
  { label: "Aiuto", icon: HelpCircle, href: "/dashboard/aiuto" },
  { label: "Impostazioni", icon: Settings, href: "/dashboard/impostazioni" },
];

const PIANO_LABEL: Record<string, string> = {
  gratuito: "Piano Gratuito",
  professionista: "Piano Professionista",
  impresa: "Piano Impresa",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDemo = auth.stato === "demo" || auth.stato === "non_autenticato";
  const nome = auth.stato === "autenticato" ? auth.user.nome || "amico" : "Roberto";
  const cognome = auth.stato === "autenticato" ? auth.user.cognome : "Pizzini";
  const piano =
    auth.stato === "autenticato"
      ? (PIANO_LABEL[auth.user.piano] ?? "Piano Gratuito")
      : "Piano Professionista (demo)";
  const iniziali = `${nome[0] ?? "D"}${cognome[0] ?? ""}`.toUpperCase();
  const isPianoGratuito = auth.stato === "autenticato" && auth.user.piano === "gratuito";

  async function onLogout() {
    if (auth.stato === "autenticato") {
      await auth.esci();
      router.replace("/accedi");
    } else {
      router.replace("/");
    }
  }

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
          <Link
            href="/dashboard/fatture?nuova=1"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-[#009246] hover:bg-[#007a3a] text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#009246]/20 active:scale-[0.98]"
          >
            <Plus size={16} />
            Nuova Fattura
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-3 mb-2">
            Menu Principale
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

            if (item.presto) {
              return (
                <div
                  key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-600 cursor-not-allowed select-none"
                >
                  <Icon size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-600 bg-gray-700/50 px-1.5 py-0.5 rounded">
                    presto
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                }`}
              >
                <Icon size={18} className={active ? "text-[#009246]" : ""} />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}

          <div className="my-4 border-t border-white/[0.06]" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-3 mb-2">
            Sistema
          </p>
          {NAV_BOTTOM.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                }`}
              >
                <Icon size={18} className={active ? "text-[#009246]" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade banner — solo piano gratuito */}
        {isPianoGratuito && (
          <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-gradient-to-br from-[#009246]/20 to-[#009246]/10 border border-[#009246]/20">
            <p className="text-xs font-semibold text-white mb-1">Passa a Professionista</p>
            <p className="text-[10px] text-gray-400 mb-2">
              Fatturazione illimitata, clienti, firma digitale.
            </p>
            <Link
              href="/dashboard/upgrade"
              className="block text-center text-[11px] font-bold text-white bg-[#009246] hover:bg-[#007a3a] py-1.5 rounded-lg transition-colors"
            >
              Upgradata — €9/mese →
            </Link>
          </div>
        )}

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
              title={
                auth.stato === "autenticato"
                  ? "Esci"
                  : supabaseConfigured
                    ? "Torna alla home"
                    : "Torna alla home"
              }
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
        {/* Demo banner */}
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
              <span>🟡 MODALITÀ DEMO — Dati mostrati sono fittizi.</span>
            )}
          </div>
        )}

        {/* TOP BAR */}
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

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
