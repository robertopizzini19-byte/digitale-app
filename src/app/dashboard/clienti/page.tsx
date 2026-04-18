"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/provider";
import { getSupabase } from "@/lib/supabase/client";
import {
  Users,
  Plus,
  Search,
  Building2,
  User,
  Trash2,
  Pencil,
  X,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ─── Types ─── */

type TipoCliente = "persona_fisica" | "persona_giuridica";

interface Cliente {
  id: string;
  tipo: TipoCliente;
  nome: string;
  cognome: string | null;
  ragione_sociale: string | null;
  codice_fiscale: string | null;
  partita_iva: string | null;
  codice_sdi: string | null;
  pec: string | null;
  email: string | null;
  telefono: string | null;
  note: string | null;
  creato_il: string;
}

/* ─── Demo data ─── */

const DEMO_CLIENTI: Cliente[] = [
  {
    id: "demo-1",
    tipo: "persona_giuridica",
    nome: "Officine Meccaniche",
    cognome: null,
    ragione_sociale: "Officine Meccaniche Rossi Srl",
    codice_fiscale: null,
    partita_iva: "01234567890",
    codice_sdi: "ABCDEFG",
    pec: "officine@pec.it",
    email: "info@officinerossi.it",
    telefono: "02 1234567",
    note: null,
    creato_il: "2025-01-15T10:00:00Z",
  },
  {
    id: "demo-2",
    tipo: "persona_fisica",
    nome: "Marco",
    cognome: "Bianchi",
    ragione_sociale: null,
    codice_fiscale: "BNCMRC80A01H501Z",
    partita_iva: "09876543210",
    codice_sdi: null,
    pec: null,
    email: "marco.bianchi@gmail.com",
    telefono: "333 1234567",
    note: "Pagamento preferito: bonifico",
    creato_il: "2025-02-20T09:00:00Z",
  },
  {
    id: "demo-3",
    tipo: "persona_giuridica",
    nome: "Studio Legale",
    cognome: null,
    ragione_sociale: "Studio Legale Ferrari & Associati",
    codice_fiscale: null,
    partita_iva: "11223344556",
    codice_sdi: "XYZDEMO",
    pec: "studioferrari@pec.it",
    email: "segreteria@studioferrari.it",
    telefono: "06 9876543",
    note: null,
    creato_il: "2025-03-10T14:00:00Z",
  },
];

/* ─── Form defaults ─── */

const FORM_VUOTO = {
  tipo: "persona_fisica" as TipoCliente,
  nome: "",
  cognome: "",
  ragione_sociale: "",
  codice_fiscale: "",
  partita_iva: "",
  codice_sdi: "",
  pec: "",
  email: "",
  telefono: "",
  note: "",
};

/* ─── Component ─── */

export default function ClientiPage() {
  const auth = useAuth();
  const isDemo = auth.stato === "demo" || auth.stato === "non_autenticato";

  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [cerca, setCerca] = useState("");
  const [mostraForm, setMostraForm] = useState(false);
  const [form, setForm] = useState(FORM_VUOTO);
  const [editId, setEditId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [confermaElimina, setConfermaElimina] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const carica = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let canceled = false;

    async function load() {
      if (isDemo) {
        if (!canceled) {
          setClienti(DEMO_CLIENTI);
          setCaricamento(false);
        }
        return;
      }
      if (auth.stato !== "autenticato") return;
      const sb = getSupabase();
      if (!sb) return;

      setCaricamento(true);
      const { data, error } = await sb
        .from("clienti")
        .select("*")
        .is("eliminato_il", null)
        .order("creato_il", { ascending: false });

      if (!canceled) {
        if (!error && data) setClienti(data as Cliente[]);
        setCaricamento(false);
      }
    }

    void load();
    return () => {
      canceled = true;
    };
  }, [isDemo, auth.stato, refreshKey]);

  /* Filtra */
  const filtrati = clienti.filter((c) => {
    if (!cerca.trim()) return true;
    const q = cerca.toLowerCase();
    const nome =
      c.tipo === "persona_giuridica" ? (c.ragione_sociale ?? c.nome) : `${c.nome} ${c.cognome ?? ""}`;
    return (
      nome.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.partita_iva?.includes(q) ||
      c.telefono?.includes(q)
    );
  });

  /* Apri form nuovo */
  function apriNuovo() {
    setForm(FORM_VUOTO);
    setEditId(null);
    setErrore(null);
    setMostraForm(true);
  }

  /* Apri form edit */
  function apriEdit(c: Cliente) {
    setForm({
      tipo: c.tipo,
      nome: c.nome,
      cognome: c.cognome ?? "",
      ragione_sociale: c.ragione_sociale ?? "",
      codice_fiscale: c.codice_fiscale ?? "",
      partita_iva: c.partita_iva ?? "",
      codice_sdi: c.codice_sdi ?? "",
      pec: c.pec ?? "",
      email: c.email ?? "",
      telefono: c.telefono ?? "",
      note: c.note ?? "",
    });
    setEditId(c.id);
    setErrore(null);
    setMostraForm(true);
  }

  /* Salva */
  async function salva() {
    if (isDemo) {
      setMostraForm(false);
      return;
    }
    if (auth.stato !== "autenticato") return;

    const sb = getSupabase();
    if (!sb) return;

    if (!form.nome.trim()) {
      setErrore("Il nome è obbligatorio");
      return;
    }
    if (form.tipo === "persona_giuridica" && !form.ragione_sociale.trim()) {
      setErrore("La ragione sociale è obbligatoria per le società");
      return;
    }

    setSalvando(true);
    setErrore(null);

    const payload = {
      tipo: form.tipo,
      nome: form.nome.trim(),
      cognome: form.tipo === "persona_fisica" ? form.cognome.trim() || null : null,
      ragione_sociale: form.tipo === "persona_giuridica" ? form.ragione_sociale.trim() || null : null,
      codice_fiscale: form.codice_fiscale.trim() || null,
      partita_iva: form.partita_iva.trim() || null,
      codice_sdi: form.codice_sdi.trim() || null,
      pec: form.pec.trim() || null,
      email: form.email.trim() || null,
      telefono: form.telefono.trim() || null,
      note: form.note.trim() || null,
    };

    let error;
    if (editId) {
      ({ error } = await sb.from("clienti").update(payload).eq("id", editId).eq("user_id", auth.user.id));
    } else {
      ({ error } = await sb.from("clienti").insert({ ...payload, user_id: auth.user.id }));
    }

    setSalvando(false);
    if (error) {
      setErrore("Errore durante il salvataggio: " + error.message);
      return;
    }
    setMostraForm(false);
    carica();
  }

  /* Elimina (soft delete) */
  async function elimina(id: string) {
    if (isDemo) {
      setConfermaElimina(null);
      return;
    }
    if (auth.stato !== "autenticato") return;

    const sb = getSupabase();
    if (!sb) return;

    await sb
      .from("clienti")
      .update({ eliminato_il: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", auth.user.id);

    setConfermaElimina(null);
    carica();
  }

  /* Nome display */
  function nomeDisplay(c: Cliente) {
    if (c.tipo === "persona_giuridica") return c.ragione_sociale ?? c.nome;
    return `${c.nome}${c.cognome ? " " + c.cognome : ""}`;
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clienti</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isDemo ? "3 clienti di esempio" : `${clienti.length} clienti totali`}
          </p>
        </div>
        <button
          onClick={apriNuovo}
          className="flex items-center gap-2 bg-[#009246] hover:bg-[#007a3a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-[#009246]/20 active:scale-[0.98]"
        >
          <Plus size={16} />
          Nuovo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={cerca}
          onChange={(e) => setCerca(e.target.value)}
          placeholder="Cerca per nome, email, P.IVA..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
        />
      </div>

      {/* Demo banner */}
      {isDemo && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
          <AlertCircle size={15} />
          Dati di esempio — registrati per gestire i tuoi clienti reali
        </div>
      )}

      {/* Loading */}
      {caricamento ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : filtrati.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Users size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {cerca ? "Nessun cliente trovato" : "Nessun cliente ancora"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {cerca
              ? "Prova con un altro termine di ricerca"
              : "Aggiungi il tuo primo cliente per iniziare a fatturare"}
          </p>
          {!cerca && (
            <button
              onClick={apriNuovo}
              className="flex items-center gap-2 bg-[#009246] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#007a3a] transition-colors"
            >
              <Plus size={15} />
              Aggiungi cliente
            </button>
          )}
        </div>
      ) : (
        /* Lista clienti */
        <div className="grid gap-3">
          {filtrati.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Avatar + info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      c.tipo === "persona_giuridica"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {c.tipo === "persona_giuridica" ? <Building2 size={18} /> : <User size={18} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{nomeDisplay(c)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {c.tipo === "persona_giuridica" ? "Azienda" : "Persona fisica"}
                    </p>
                    {/* Dettagli inline */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      {c.email && (
                        <span className="flex items-center gap-1 text-[12px] text-gray-500">
                          <Mail size={11} />
                          {c.email}
                        </span>
                      )}
                      {c.telefono && (
                        <span className="flex items-center gap-1 text-[12px] text-gray-500">
                          <Phone size={11} />
                          {c.telefono}
                        </span>
                      )}
                      {c.partita_iva && (
                        <span className="flex items-center gap-1 text-[12px] text-gray-500">
                          <FileText size={11} />
                          P.IVA {c.partita_iva}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Azioni */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => apriEdit(c)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                    title="Modifica"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setConfermaElimina(c.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors text-gray-500 hover:text-red-600"
                    title="Elimina"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal nuovo/edit */}
      {mostraForm && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editId ? "Modifica Cliente" : "Nuovo Cliente"}
              </h2>
              <button
                onClick={() => setMostraForm(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Tipo */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo cliente</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["persona_fisica", "persona_giuridica"] as TipoCliente[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, tipo: t }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.tipo === t
                          ? "border-[#009246] bg-[#009246]/5 text-[#009246]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {t === "persona_fisica" ? <User size={15} /> : <Building2 size={15} />}
                      {t === "persona_fisica" ? "Persona fisica" : "Azienda"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nome / Ragione sociale */}
              {form.tipo === "persona_fisica" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Nome <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.nome}
                      onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                      placeholder="Marco"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cognome</label>
                    <input
                      type="text"
                      value={form.cognome}
                      onChange={(e) => setForm((f) => ({ ...f, cognome: e.target.value }))}
                      placeholder="Rossi"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Nome breve <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.nome}
                      onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                      placeholder="Rossi Srl"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Ragione sociale <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.ragione_sociale}
                      onChange={(e) => setForm((f) => ({ ...f, ragione_sociale: e.target.value }))}
                      placeholder="Officine Rossi S.r.l."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                    />
                  </div>
                </div>
              )}

              {/* Email + Telefono */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="email@azienda.it"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telefono</label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                    placeholder="02 1234567"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                  />
                </div>
              </div>

              {/* Fiscale */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">P.IVA</label>
                  <input
                    type="text"
                    value={form.partita_iva}
                    onChange={(e) => setForm((f) => ({ ...f, partita_iva: e.target.value }))}
                    placeholder="01234567890"
                    maxLength={11}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Codice fiscale</label>
                  <input
                    type="text"
                    value={form.codice_fiscale}
                    onChange={(e) => setForm((f) => ({ ...f, codice_fiscale: e.target.value.toUpperCase() }))}
                    placeholder="RSSMRC80A01H501Z"
                    maxLength={16}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                  />
                </div>
              </div>

              {/* SDI + PEC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Codice SDI</label>
                  <input
                    type="text"
                    value={form.codice_sdi}
                    onChange={(e) => setForm((f) => ({ ...f, codice_sdi: e.target.value.toUpperCase() }))}
                    placeholder="ABCDEFG"
                    maxLength={7}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">PEC</label>
                  <input
                    type="email"
                    value={form.pec}
                    onChange={(e) => setForm((f) => ({ ...f, pec: e.target.value }))}
                    placeholder="azienda@pec.it"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Note</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Note interne..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                />
              </div>

              {errore && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl">
                  <AlertCircle size={14} />
                  {errore}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setMostraForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={salva}
                disabled={salvando}
                className="flex items-center gap-2 bg-[#009246] hover:bg-[#007a3a] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                {salvando && <Loader2 size={14} className="animate-spin" />}
                {isDemo ? "Demo — non salvato" : editId ? "Salva modifiche" : "Aggiungi cliente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal conferma eliminazione */}
      {confermaElimina && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 text-center mb-2">Elimina cliente?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {isDemo
                ? "In modalità demo non è possibile eliminare"
                : "Il cliente verrà rimosso. Le fatture esistenti non saranno cancellate."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfermaElimina(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => elimina(confermaElimina)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {isDemo ? "Chiudi" : "Elimina"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
