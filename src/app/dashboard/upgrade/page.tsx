"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/provider";
import {
  CheckCircle2,
  Zap,
  Building2,
  Loader2,
  Star,
  Shield,
  FileText,
  Users,
  BarChart3,
  Mail,
} from "lucide-react";

const PIANI = [
  {
    id: "professionista",
    nome: "Professionista",
    prezzo: "9",
    frequenza: "/ mese",
    descrizione: "Per freelance e professionisti",
    colore: "from-[#009246] to-[#007a3a]",
    popolare: true,
    features: [
      "Fatture illimitate",
      "Clienti illimitati",
      "Esportazione PDF",
      "Promemoria scadenze",
      "Firma digitale",
      "Supporto email prioritario",
    ],
  },
  {
    id: "impresa",
    nome: "Impresa",
    prezzo: "49",
    frequenza: "/ mese",
    descrizione: "Per PMI e studi professionali",
    colore: "from-[#1e293b] to-[#0f172a]",
    popolare: false,
    features: [
      "Tutto di Professionista",
      "Multi-utente (5 posti)",
      "SDI integrato",
      "Fatturazione elettronica PA",
      "API access",
      "Supporto telefonico dedicato",
    ],
  },
];

const CONFRONTO = [
  {
    feature: "Fatture / mese",
    gratuito: "5",
    professionista: "Illimitate",
    impresa: "Illimitate",
    icon: FileText,
  },
  { feature: "Clienti", gratuito: "3", professionista: "Illimitati", impresa: "Illimitati", icon: Users },
  { feature: "Report avanzati", gratuito: "—", professionista: "✓", impresa: "✓", icon: BarChart3 },
  { feature: "Firma digitale", gratuito: "—", professionista: "✓", impresa: "✓", icon: Shield },
  { feature: "SDI / FattPA", gratuito: "—", professionista: "—", impresa: "✓", icon: Zap },
  { feature: "Email automatiche", gratuito: "—", professionista: "✓", impresa: "✓", icon: Mail },
];

export default function UpgradePage() {
  const auth = useAuth();
  const [caricando, setCaricando] = useState<string | null>(null);
  const [errore, setErrore] = useState<string | null>(null);

  const pianoAttuale = auth.stato === "autenticato" ? auth.user.piano : "gratuito";
  const isDemo = auth.stato === "demo" || auth.stato === "non_autenticato";

  async function avviaCheckout(pianId: string) {
    if (isDemo) {
      setErrore("Accedi per effettuare l'upgrade del piano.");
      return;
    }
    if (auth.stato !== "autenticato") return;

    setCaricando(pianId);
    setErrore(null);

    try {
      const res = await fetch("/.netlify/functions/stripe-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          piano: pianId,
          userId: auth.user.id,
          email: auth.user.email,
          returnUrl: window.location.origin + "/dashboard",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Errore durante il checkout");
      }

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      setErrore(e instanceof Error ? e.message : "Errore sconosciuto");
    } finally {
      setCaricando(null);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 bg-[#009246]/10 text-[#009246] text-xs font-bold px-3 py-1 rounded-full mb-4">
          <Star size={12} />
          Passa al piano superiore
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {pianoAttuale === "gratuito" ? "Fai crescere il tuo business" : "Gestisci il tuo piano"}
        </h1>
        <p className="text-gray-500 text-base">Fatturazione illimitata, firma digitale, nessun limite.</p>
      </div>

      {/* Piani */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {PIANI.map((piano) => {
          const isCurrent = pianoAttuale === piano.id;

          return (
            <div
              key={piano.id}
              className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
                piano.popolare ? "border-[#009246] shadow-xl shadow-[#009246]/10" : "border-gray-200"
              }`}
            >
              {piano.popolare && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#009246] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    Più scelto
                  </span>
                </div>
              )}

              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${piano.colore} flex items-center justify-center mb-4`}
              >
                {piano.popolare ? (
                  <Zap size={18} className="text-white" />
                ) : (
                  <Building2 size={18} className="text-white" />
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{piano.nome}</h2>
              <p className="text-sm text-gray-500 mb-4">{piano.descrizione}</p>

              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-gray-900">€{piano.prezzo}</span>
                <span className="text-gray-400 text-sm mb-1">{piano.frequenza}</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {piano.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={15} className="text-[#009246] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold text-center">
                  Piano attuale
                </div>
              ) : (
                <button
                  onClick={() => avviaCheckout(piano.id)}
                  disabled={caricando === piano.id}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    piano.popolare
                      ? "bg-[#009246] hover:bg-[#007a3a] text-white shadow-md shadow-[#009246]/20"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  } disabled:opacity-50`}
                >
                  {caricando === piano.id && <Loader2 size={15} className="animate-spin" />}
                  {isDemo ? "Accedi per acquistare" : `Passa a ${piano.nome} →`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Errore */}
      {errore && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl text-center">
          {errore}
        </div>
      )}

      {/* Tabella confronto */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Confronto piani</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 w-1/2">Funzionalità</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Gratuito</th>
                <th className="text-center px-4 py-3 font-semibold text-[#009246]">Professionista</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-900">Impresa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CONFRONTO.map((row) => {
                const Icon = row.icon;
                return (
                  <tr key={row.feature} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 text-gray-700 flex items-center gap-2">
                      <Icon size={14} className="text-gray-400 shrink-0" />
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-400">{row.gratuito}</td>
                    <td className="px-4 py-3 text-center text-[#009246] font-medium">{row.professionista}</td>
                    <td className="px-4 py-3 text-center text-gray-800 font-medium">{row.impresa}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Garanzia */}
      <div className="mt-6 text-center text-sm text-gray-400 flex items-center justify-center gap-1.5">
        <Shield size={13} />
        Soddisfatto o rimborsato entro 14 giorni · Nessun vincolo · Cancella quando vuoi
      </div>
    </div>
  );
}
