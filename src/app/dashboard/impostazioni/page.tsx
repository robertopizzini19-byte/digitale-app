"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/provider";
import { getSupabase } from "@/lib/supabase/client";
import {
  User,
  Building2,
  Mail,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Shield,
} from "lucide-react";

const RUOLI = [
  { value: "cittadino", label: "Cittadino" },
  { value: "freelance", label: "Freelance / Professionista" },
  { value: "pmi", label: "PMI / Imprenditore" },
  { value: "pa", label: "Pubblica Amministrazione" },
  { value: "studente", label: "Studente" },
];

export default function ImpostazioniPage() {
  const auth = useAuth();
  const isDemo = auth.stato === "demo" || auth.stato === "non_autenticato";

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    telefono: "",
    partita_iva: "",
    codice_fiscale: "",
    pec: "",
    ruolo: "freelance",
  });
  const [salvando, setSalvando] = useState(false);
  const [esito, setEsito] = useState<"ok" | "errore" | null>(null);
  const [messaggioErrore, setMessaggioErrore] = useState("");

  useEffect(() => {
    if (auth.stato !== "autenticato") return;
    const u = auth.user;
    let canceled = false;
    async function init() {
      setForm({
        nome: u.nome ?? "",
        cognome: u.cognome ?? "",
        telefono: u.telefono ?? "",
        partita_iva: u.partitaIva ?? "",
        codice_fiscale: u.codiceFiscale ?? "",
        pec: "",
        ruolo: u.ruolo ?? "freelance",
      });
      const sb = getSupabase();
      if (!sb || canceled) return;
      const { data } = await sb.from("utenti").select("pec").eq("id", u.id).maybeSingle();
      if (data?.pec && !canceled) setForm((f) => ({ ...f, pec: data.pec }));
    }
    void init();
    return () => {
      canceled = true;
    };
  }, [auth]);

  async function salva(e: React.FormEvent) {
    e.preventDefault();
    if (isDemo) {
      setEsito("ok");
      return;
    }
    if (auth.stato !== "autenticato") return;

    setSalvando(true);
    setEsito(null);

    const res = await auth.aggiornaProfilo({
      nome: form.nome.trim(),
      cognome: form.cognome.trim(),
      telefono: form.telefono.trim() || null,
      partita_iva: form.partita_iva.trim() || null,
      codice_fiscale: form.codice_fiscale.trim() || null,
      pec: form.pec.trim() || null,
      ruolo: form.ruolo as "cittadino" | "freelance" | "pmi" | "pa" | "studente",
    });

    setSalvando(false);
    if (res.ok) {
      setEsito("ok");
      setTimeout(() => setEsito(null), 3000);
    } else {
      setEsito("errore");
      setMessaggioErrore(res.messaggio);
    }
  }

  const piano = auth.stato === "autenticato" ? auth.user.piano : "gratuito";
  const email = auth.stato === "autenticato" ? auth.user.email : "demo@digitale.it";

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
        <p className="text-sm text-gray-500 mt-0.5">Profilo e preferenze account</p>
      </div>

      {isDemo && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
          <AlertCircle size={15} />
          Modalità demo — registrati per salvare le tue informazioni
        </div>
      )}

      <form onSubmit={salva} className="space-y-6">
        {/* Profilo */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} className="text-[#009246]" />
            <h2 className="font-semibold text-gray-900">Dati personali</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cognome</label>
              <input
                type="text"
                value={form.cognome}
                onChange={(e) => setForm((f) => ({ ...f, cognome: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telefono</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                placeholder="333 1234567"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ruolo</label>
              <select
                value={form.ruolo}
                onChange={(e) => setForm((f) => ({ ...f, ruolo: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
              >
                {RUOLI.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dati fiscali */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-[#009246]" />
            <h2 className="font-semibold text-gray-900">Dati fiscali</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Partita IVA</label>
              <input
                type="text"
                value={form.partita_iva}
                onChange={(e) => setForm((f) => ({ ...f, partita_iva: e.target.value }))}
                placeholder="01234567890"
                maxLength={11}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Codice Fiscale</label>
              <input
                type="text"
                value={form.codice_fiscale}
                onChange={(e) => setForm((f) => ({ ...f, codice_fiscale: e.target.value.toUpperCase() }))}
                placeholder="RSSMRC80A01H501Z"
                maxLength={16}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">PEC</label>
              <input
                type="email"
                value={form.pec}
                onChange={(e) => setForm((f) => ({ ...f, pec: e.target.value }))}
                placeholder="tuanome@pec.it"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
              />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-[#009246]" />
            <h2 className="font-semibold text-gray-900">Account</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-gray-400" />
                Email
              </div>
              <span className="text-sm font-medium text-gray-800">{email}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={14} className="text-gray-400" />
                Piano attivo
              </div>
              <span className="text-sm font-semibold text-[#009246] capitalize">{piano}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock size={14} className="text-gray-400" />
                Password
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-[#009246] hover:text-[#007a3a] transition-colors"
                onClick={() => alert("Funzionalità in arrivo")}
              >
                Cambia password →
              </button>
            </div>
          </div>
        </div>

        {/* Esito */}
        {esito === "ok" && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            <CheckCircle2 size={15} />
            {isDemo
              ? "Demo — nella versione reale il profilo viene salvato"
              : "Profilo aggiornato con successo"}
          </div>
        )}
        {esito === "errore" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={15} />
            {messaggioErrore}
          </div>
        )}

        <button
          type="submit"
          disabled={salvando}
          className="w-full flex items-center justify-center gap-2 bg-[#009246] hover:bg-[#007a3a] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-all"
        >
          {salvando ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isDemo ? "Demo — non salvato" : "Salva modifiche"}
        </button>
      </form>
    </div>
  );
}
