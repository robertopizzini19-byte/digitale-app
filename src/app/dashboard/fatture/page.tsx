"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/provider";
import { getSupabase } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  Search,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  Send,
  Ban,
  ChevronDown,
  Euro,
  Calendar,
  User,
  Building2,
  Pencil,
} from "lucide-react";

/* ─── Types ─── */

type StatoFattura =
  | "bozza"
  | "emessa"
  | "inviata_sdi"
  | "accettata"
  | "rifiutata"
  | "pagata"
  | "scaduta"
  | "annullata";
type TipoFattura = "fattura" | "nota_credito" | "parcella" | "proforma";

interface ClienteMin {
  id: string;
  tipo: "persona_fisica" | "persona_giuridica";
  nome: string;
  cognome: string | null;
  ragione_sociale: string | null;
  partita_iva: string | null;
  codice_fiscale: string | null;
  pec: string | null;
  codice_sdi: string | null;
}

interface Fattura {
  id: string;
  cliente_id: string;
  numero: string;
  anno: number;
  tipo: TipoFattura;
  stato: StatoFattura;
  data_emissione: string;
  data_scadenza: string;
  imponibile_centesimi: number;
  iva_percentuale: number;
  iva_centesimi: number;
  totale_centesimi: number;
  netto_a_pagare_centesimi: number;
  oggetto: string | null;
  note: string | null;
  creato_il: string;
  clienti?: ClienteMin;
}

/* ─── Demo data ─── */

const DEMO_CLIENTI: ClienteMin[] = [
  {
    id: "demo-c1",
    tipo: "persona_giuridica",
    nome: "Officine Rossi",
    cognome: null,
    ragione_sociale: "Officine Meccaniche Rossi Srl",
    partita_iva: "01234567890",
    codice_fiscale: null,
    pec: "officine@pec.it",
    codice_sdi: "ABCDEFG",
  },
  {
    id: "demo-c2",
    tipo: "persona_fisica",
    nome: "Marco",
    cognome: "Bianchi",
    ragione_sociale: null,
    partita_iva: "09876543210",
    codice_fiscale: "BNCMRC80A01H501Z",
    pec: null,
    codice_sdi: null,
  },
];

const DEMO_FATTURE: Fattura[] = [
  {
    id: "demo-f1",
    cliente_id: "demo-c1",
    numero: "001",
    anno: 2025,
    tipo: "fattura",
    stato: "pagata",
    data_emissione: "2025-01-10",
    data_scadenza: "2025-02-10",
    imponibile_centesimi: 150000,
    iva_percentuale: 22,
    iva_centesimi: 33000,
    totale_centesimi: 183000,
    netto_a_pagare_centesimi: 183000,
    oggetto: "Consulenza web design",
    note: null,
    creato_il: "2025-01-10T09:00:00Z",
    clienti: DEMO_CLIENTI[0],
  },
  {
    id: "demo-f2",
    cliente_id: "demo-c2",
    numero: "002",
    anno: 2025,
    tipo: "fattura",
    stato: "emessa",
    data_emissione: "2025-02-15",
    data_scadenza: "2025-03-15",
    imponibile_centesimi: 80000,
    iva_percentuale: 22,
    iva_centesimi: 17600,
    totale_centesimi: 97600,
    netto_a_pagare_centesimi: 97600,
    oggetto: "Sviluppo app mobile",
    note: null,
    creato_il: "2025-02-15T10:00:00Z",
    clienti: DEMO_CLIENTI[1],
  },
  {
    id: "demo-f3",
    cliente_id: "demo-c1",
    numero: "003",
    anno: 2025,
    tipo: "fattura",
    stato: "bozza",
    data_emissione: "2025-03-01",
    data_scadenza: "2025-04-01",
    imponibile_centesimi: 200000,
    iva_percentuale: 22,
    iva_centesimi: 44000,
    totale_centesimi: 244000,
    netto_a_pagare_centesimi: 244000,
    oggetto: "Manutenzione server",
    note: null,
    creato_il: "2025-03-01T08:00:00Z",
    clienti: DEMO_CLIENTI[0],
  },
];

/* ─── Helpers ─── */

function formatEuro(centesimi: number) {
  return (centesimi / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
}

function nomeCliente(c: ClienteMin | undefined) {
  if (!c) return "—";
  return c.tipo === "persona_giuridica"
    ? (c.ragione_sociale ?? c.nome)
    : `${c.nome}${c.cognome ? " " + c.cognome : ""}`;
}

const STATO_CONFIG: Record<StatoFattura, { label: string; bg: string; text: string; icon: React.ReactNode }> =
  {
    bozza: { label: "Bozza", bg: "bg-gray-100", text: "text-gray-600", icon: <FileText size={11} /> },
    emessa: { label: "Emessa", bg: "bg-blue-50", text: "text-blue-700", icon: <Send size={11} /> },
    inviata_sdi: { label: "SDI", bg: "bg-indigo-50", text: "text-indigo-700", icon: <Send size={11} /> },
    accettata: {
      label: "Accettata",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: <CheckCircle2 size={11} />,
    },
    rifiutata: { label: "Rifiutata", bg: "bg-red-50", text: "text-red-700", icon: <Ban size={11} /> },
    pagata: { label: "Pagata", bg: "bg-green-50", text: "text-green-700", icon: <CheckCircle2 size={11} /> },
    scaduta: { label: "Scaduta", bg: "bg-orange-50", text: "text-orange-700", icon: <Clock size={11} /> },
    annullata: { label: "Annullata", bg: "bg-gray-100", text: "text-gray-500", icon: <Ban size={11} /> },
  };

const IVA_OPTIONS = [0, 4, 5, 10, 22];
const STATI_PROGRESSIONE: StatoFattura[] = ["bozza", "emessa", "pagata"];

/* ─── Form ─── */

const FORM_VUOTO = {
  cliente_id: "",
  tipo: "fattura" as TipoFattura,
  oggetto: "",
  data_emissione: new Date().toISOString().slice(0, 10),
  data_scadenza: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  imponibile: "",
  iva_percentuale: 22,
  note: "",
};

/* ─── Inner component that uses useSearchParams ─── */

function FattureContent() {
  const searchParams = useSearchParams();
  const auth = useAuth();
  const isDemo = auth.stato === "demo" || auth.stato === "non_autenticato";

  const [fatture, setFatture] = useState<Fattura[]>([]);
  const [clientiList, setClientiList] = useState<ClienteMin[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [cerca, setCerca] = useState("");
  const [filtroStato, setFiltroStato] = useState<StatoFattura | "tutti">("tutti");
  const [mostraForm, setMostraForm] = useState(false);
  const [form, setForm] = useState(FORM_VUOTO);
  const [editId, setEditId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [aggiornandoStato, setAggiornandoStato] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /* Calcoli IVA live */
  const imponibileCent = Math.round(parseFloat(form.imponibile || "0") * 100);
  const ivaCent = Math.round((imponibileCent * form.iva_percentuale) / 100);
  const totaleCent = imponibileCent + ivaCent;

  const carica = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let canceled = false;

    async function load() {
      if (isDemo) {
        if (!canceled) {
          setFatture(DEMO_FATTURE);
          setClientiList(DEMO_CLIENTI);
          setCaricamento(false);
        }
        return;
      }
      if (auth.stato !== "autenticato") return;

      const sb = getSupabase();
      if (!sb) return;

      setCaricamento(true);
      const [{ data: fatt }, { data: cli }] = await Promise.all([
        sb
          .from("fatture")
          .select(
            "*, clienti(id,tipo,nome,cognome,ragione_sociale,partita_iva,codice_fiscale,pec,codice_sdi)",
          )
          .is("eliminato_il", null)
          .order("creato_il", { ascending: false }),
        sb
          .from("clienti")
          .select("id,tipo,nome,cognome,ragione_sociale,partita_iva,codice_fiscale,pec,codice_sdi")
          .is("eliminato_il", null)
          .order("nome"),
      ]);

      if (!canceled) {
        if (fatt) setFatture(fatt as Fattura[]);
        if (cli) setClientiList(cli as ClienteMin[]);
        setCaricamento(false);
      }
    }

    void load();
    return () => {
      canceled = true;
    };
  }, [isDemo, auth.stato, refreshKey]);

  /* apriNuovo — dichiarato prima dell'effect che lo usa */
  const apriNuovo = useCallback(() => {
    setForm({ ...FORM_VUOTO });
    setEditId(null);
    setErrore(null);
    setMostraForm(true);
  }, []);

  /* Apri form se ?nuova=1 */
  useEffect(() => {
    if (searchParams.get("nuova") === "1" && !caricamento) {
      const t = setTimeout(() => apriNuovo(), 100);
      return () => clearTimeout(t);
    }
  }, [caricamento, searchParams, apriNuovo]);

  function apriEdit(f: Fattura) {
    setForm({
      cliente_id: f.cliente_id,
      tipo: f.tipo,
      oggetto: f.oggetto ?? "",
      data_emissione: f.data_emissione,
      data_scadenza: f.data_scadenza,
      imponibile: (f.imponibile_centesimi / 100).toString(),
      iva_percentuale: f.iva_percentuale,
      note: f.note ?? "",
    });
    setEditId(f.id);
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

    if (!form.cliente_id) {
      setErrore("Seleziona un cliente");
      return;
    }
    if (!form.oggetto.trim()) {
      setErrore("L'oggetto è obbligatorio");
      return;
    }
    if (imponibileCent <= 0) {
      setErrore("L'importo deve essere maggiore di zero");
      return;
    }

    setSalvando(true);
    setErrore(null);

    const anno = new Date().getFullYear();
    const payload = {
      cliente_id: form.cliente_id,
      tipo: form.tipo,
      stato: "bozza" as StatoFattura,
      oggetto: form.oggetto.trim(),
      data_emissione: form.data_emissione,
      data_scadenza: form.data_scadenza,
      imponibile_centesimi: imponibileCent,
      iva_percentuale: form.iva_percentuale,
      iva_centesimi: ivaCent,
      totale_centesimi: totaleCent,
      netto_a_pagare_centesimi: totaleCent,
      note: form.note.trim() || null,
      anno,
    };

    let error;
    if (editId) {
      ({ error } = await sb.from("fatture").update(payload).eq("id", editId).eq("user_id", auth.user.id));
    } else {
      const numero = prossimNumero();
      ({ error } = await sb.from("fatture").insert({ ...payload, user_id: auth.user.id, numero }));
    }

    setSalvando(false);
    if (error) {
      setErrore("Errore: " + error.message);
      return;
    }
    setMostraForm(false);
    carica();
  }

  /* Aggiorna stato rapido */
  async function avanzaStato(f: Fattura) {
    if (isDemo) return;
    if (auth.stato !== "autenticato") return;

    const sb = getSupabase();
    if (!sb) return;

    const idx = STATI_PROGRESSIONE.indexOf(f.stato as StatoFattura);
    const prossimo = idx >= 0 && idx < STATI_PROGRESSIONE.length - 1 ? STATI_PROGRESSIONE[idx + 1] : null;
    if (!prossimo) return;

    setAggiornandoStato(f.id);
    await sb.from("fatture").update({ stato: prossimo }).eq("id", f.id).eq("user_id", auth.user.id);
    setAggiornandoStato(null);
    carica();
  }

  /* Totali summary */
  const totaleEmesse = fatture
    .filter((f) => f.stato === "emessa" || f.stato === "inviata_sdi")
    .reduce((s, f) => s + f.totale_centesimi, 0);
  const totalePagato = fatture
    .filter((f) => f.stato === "pagata")
    .reduce((s, f) => s + f.totale_centesimi, 0);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fatture</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isDemo ? "Dati di esempio" : `${fatture.length} fatture totali`}
          </p>
        </div>
        <button
          onClick={apriNuovo}
          className="flex items-center gap-2 bg-[#009246] hover:bg-[#007a3a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-[#009246]/20 active:scale-[0.98]"
        >
          <Plus size={16} />
          Nuova Fattura
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Da incassare</p>
          <p className="text-2xl font-bold text-blue-600">{formatEuro(totaleEmesse)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Incassato</p>
          <p className="text-2xl font-bold text-green-600">{formatEuro(totalePagato)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={cerca}
            onChange={(e) => setCerca(e.target.value)}
            placeholder="Cerca per cliente, numero, oggetto..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {(["tutti", "bozza", "emessa", "pagata", "scaduta"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFiltroStato(s)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filtroStato === s
                  ? "bg-[#009246] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s === "tutti" ? "Tutte" : STATO_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo banner */}
      {isDemo && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
          <AlertCircle size={15} />
          Dati di esempio — registrati per creare fatture reali
        </div>
      )}

      {/* Lista */}
      {caricamento ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : filtrate.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <FileText size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {cerca || filtroStato !== "tutti" ? "Nessuna fattura trovata" : "Nessuna fattura ancora"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {cerca || filtroStato !== "tutti" ? "Prova con altri filtri" : "Crea la tua prima fattura"}
          </p>
          {!cerca && filtroStato === "tutti" && (
            <button
              onClick={apriNuovo}
              className="flex items-center gap-2 bg-[#009246] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#007a3a] transition-colors"
            >
              <Plus size={15} />
              Nuova fattura
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtrate.map((f) => {
            const cfg = STATO_CONFIG[f.stato];
            const idx = STATI_PROGRESSIONE.indexOf(f.stato as StatoFattura);
            const puoAvanzare = idx >= 0 && idx < STATI_PROGRESSIONE.length - 1 && !isDemo;
            const cliente = f.clienti;

            return (
              <div
                key={f.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      {cliente?.tipo === "persona_giuridica" ? (
                        <Building2 size={17} className="text-gray-500" />
                      ) : (
                        <User size={17} className="text-gray-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">{nomeCliente(cliente)}</p>
                        <span className="text-[11px] font-mono text-gray-400">
                          #{f.anno}/{f.numero}
                        </span>
                      </div>
                      {f.oggetto && (
                        <p className="text-[12px] text-gray-500 mt-0.5 truncate max-w-xs">{f.oggetto}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                        <span className="flex items-center gap-1 text-[12px] text-gray-400">
                          <Calendar size={10} />
                          Scadenza: {formatData(f.data_scadenza)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-base font-bold text-gray-900">{formatEuro(f.totale_centesimi)}</p>
                    <div className="flex items-center gap-1">
                      {puoAvanzare && (
                        <button
                          onClick={() => avanzaStato(f)}
                          disabled={aggiornandoStato === f.id}
                          className="text-[11px] font-semibold px-2.5 py-1 bg-[#009246]/10 text-[#009246] hover:bg-[#009246]/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {aggiornandoStato === f.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            `→ ${STATO_CONFIG[STATI_PROGRESSIONE[idx + 1]].label}`
                          )}
                        </button>
                      )}
                      {(f.stato === "bozza" || f.stato === "emessa") && (
                        <button
                          onClick={() => apriEdit(f)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal form */}
      {mostraForm && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editId ? "Modifica Fattura" : "Nuova Fattura"}
              </h2>
              <button
                onClick={() => setMostraForm(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Tipo */}
              <div className="grid grid-cols-2 gap-2">
                {(["fattura", "parcella", "proforma", "nota_credito"] as TipoFattura[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, tipo: t }))}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all capitalize ${
                      form.tipo === t
                        ? "border-[#009246] bg-[#009246]/5 text-[#009246]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {t.replace("_", " ")}
                  </button>
                ))}
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Cliente <span className="text-red-500">*</span>
                </label>
                {clientiList.length === 0 ? (
                  <div className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                    Nessun cliente disponibile —{" "}
                    <a href="/dashboard/clienti" className="text-[#009246] font-semibold">
                      aggiungi un cliente
                    </a>{" "}
                    prima di creare una fattura.
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={form.cliente_id}
                      onChange={(e) => setForm((f) => ({ ...f, cliente_id: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                    >
                      <option value="">Seleziona cliente...</option>
                      {clientiList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {nomeCliente(c)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                )}
              </div>

              {/* Oggetto */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Oggetto / Descrizione <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.oggetto}
                  onChange={(e) => setForm((f) => ({ ...f, oggetto: e.target.value }))}
                  placeholder="es. Consulenza sviluppo web — Marzo 2025"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                />
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Data emissione</label>
                  <input
                    type="date"
                    value={form.data_emissione}
                    onChange={(e) => setForm((f) => ({ ...f, data_emissione: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Scadenza pagamento
                  </label>
                  <input
                    type="date"
                    value={form.data_scadenza}
                    onChange={(e) => setForm((f) => ({ ...f, data_scadenza: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                  />
                </div>
              </div>

              {/* Importi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Imponibile (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Euro size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.imponibile}
                      onChange={(e) => setForm((f) => ({ ...f, imponibile: e.target.value }))}
                      placeholder="0,00"
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">IVA %</label>
                  <div className="relative">
                    <select
                      value={form.iva_percentuale}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, iva_percentuale: parseFloat(e.target.value) }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40"
                    >
                      {IVA_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v === 0 ? "Esente" : `${v}%`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Riepilogo */}
              {imponibileCent > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Imponibile</span>
                    <span>{formatEuro(imponibileCent)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA {form.iva_percentuale}%</span>
                    <span>{formatEuro(ivaCent)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                    <span>Totale</span>
                    <span>{formatEuro(totaleCent)}</span>
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Note</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Note aggiuntive per il cliente..."
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
                className="px-4 py-2 text-sm font-medium text-gray-600"
              >
                Annulla
              </button>
              <button
                onClick={salva}
                disabled={salvando}
                className="flex items-center gap-2 bg-[#009246] hover:bg-[#007a3a] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                {salvando && <Loader2 size={14} className="animate-spin" />}
                {isDemo ? "Demo — non salvato" : editId ? "Salva modifiche" : "Crea fattura"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Page wrapper with Suspense for useSearchParams ─── */

export default function FatturePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      }
    >
      <FattureContent />
    </Suspense>
  );
}
