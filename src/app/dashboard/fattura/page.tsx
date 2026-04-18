"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/provider";
import { getSupabase } from "@/lib/supabase/client";
import { ArrowLeft, Printer, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

/* ─── Types ─── */

interface FatturaDettaglio {
  id: string;
  numero: string;
  anno: number;
  tipo: string;
  stato: string;
  data_emissione: string;
  data_scadenza: string;
  oggetto: string | null;
  imponibile_centesimi: number;
  iva_percentuale: number;
  iva_centesimi: number;
  totale_centesimi: number;
  netto_a_pagare_centesimi: number;
  note: string | null;
  metodo_pagamento: string | null;
  iban_pagamento: string | null;
  clienti: {
    tipo: "persona_fisica" | "persona_giuridica";
    nome: string;
    cognome: string | null;
    ragione_sociale: string | null;
    codice_fiscale: string | null;
    partita_iva: string | null;
    pec: string | null;
    codice_sdi: string | null;
    email: string | null;
    telefono: string | null;
  } | null;
  utenti: {
    nome: string;
    cognome: string;
    partita_iva: string | null;
    codice_fiscale: string | null;
    pec: string | null;
    telefono: string | null;
  } | null;
}

/* ─── Demo fattura ─── */

const DEMO_FATTURA: FatturaDettaglio = {
  id: "demo",
  numero: "001",
  anno: 2025,
  tipo: "fattura",
  stato: "emessa",
  data_emissione: "2025-04-01",
  data_scadenza: "2025-05-01",
  oggetto: "Consulenza sviluppo web — Aprile 2025",
  imponibile_centesimi: 150000,
  iva_percentuale: 22,
  iva_centesimi: 33000,
  totale_centesimi: 183000,
  netto_a_pagare_centesimi: 183000,
  note: "Pagamento tramite bonifico bancario entro la data di scadenza.",
  metodo_pagamento: "bonifico",
  iban_pagamento: "IT60 X054 2811 1010 0000 0123 456",
  clienti: {
    tipo: "persona_giuridica",
    nome: "Officine Rossi",
    cognome: null,
    ragione_sociale: "Officine Meccaniche Rossi S.r.l.",
    codice_fiscale: null,
    partita_iva: "01234567890",
    pec: "officine@pec.it",
    codice_sdi: "ABCDEFG",
    email: "info@officinerossi.it",
    telefono: "02 1234567",
  },
  utenti: {
    nome: "Roberto",
    cognome: "Pizzini",
    partita_iva: "09876543210",
    codice_fiscale: null,
    pec: null,
    telefono: null,
  },
};

/* ─── Helpers ─── */

function formatEuro(c: number) {
  return (c / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}
function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}
function nomeCliente(c: FatturaDettaglio["clienti"]) {
  if (!c) return "—";
  return c.tipo === "persona_giuridica"
    ? (c.ragione_sociale ?? c.nome)
    : `${c.nome} ${c.cognome ?? ""}`.trim();
}

/* ─── Content ─── */

function FatturaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();
  const id = searchParams.get("id");
  const isDemo = auth.stato === "demo" || auth.stato === "non_autenticato";

  const [fattura, setFattura] = useState<FatturaDettaglio | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      if (isDemo || !id) {
        if (!canceled) {
          setFattura(DEMO_FATTURA);
          setCaricamento(false);
        }
        return;
      }
      if (auth.stato !== "autenticato") return;
      const sb = getSupabase();
      if (!sb) return;
      const { data, error } = await sb
        .from("fatture")
        .select(
          `
          id, numero, anno, tipo, stato, data_emissione, data_scadenza,
          oggetto, imponibile_centesimi, iva_percentuale, iva_centesimi,
          totale_centesimi, netto_a_pagare_centesimi, note,
          metodo_pagamento, iban_pagamento,
          clienti(tipo, nome, cognome, ragione_sociale, codice_fiscale, partita_iva, pec, codice_sdi, email, telefono),
          utenti(nome, cognome, partita_iva, codice_fiscale, pec, telefono)
        `,
        )
        .eq("id", id)
        .eq("user_id", auth.user.id)
        .is("eliminato_il", null)
        .maybeSingle();
      if (!canceled) {
        if (error || !data) setErrore("Fattura non trovata");
        else setFattura(data as unknown as FatturaDettaglio);
        setCaricamento(false);
      }
    }
    void load();
    return () => {
      canceled = true;
    };
  }, [id, isDemo, auth]);

  if (caricamento) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (errore || !fattura) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
        <AlertCircle size={32} className="text-red-400" />
        <p className="font-medium">{errore ?? "Fattura non trovata"}</p>
        <Link href="/dashboard/fatture" className="text-[#009246] text-sm font-semibold hover:underline">
          ← Torna alle fatture
        </Link>
      </div>
    );
  }

  const f = fattura;
  const c = f.clienti;
  const u = f.utenti;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Toolbar — si nasconde in stampa */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Torna alle fatture
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#009246] hover:bg-[#007a3a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
        >
          <Printer size={15} />
          Stampa / Salva PDF
        </button>
      </div>

      {/* Documento fattura */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 lg:p-12 shadow-sm print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Intestazione */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
              {f.tipo.replace("_", " ").toUpperCase()} N. {f.numero}/{f.anno}
            </h1>
            <p className="text-sm text-gray-400">
              Emessa il {formatData(f.data_emissione)} · Scadenza {formatData(f.data_scadenza)}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-[#009246] text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wide mb-2">
              {f.stato}
            </div>
            <p className="text-sm font-bold text-gray-900 mt-1">digITAle</p>
            <p className="text-xs text-gray-400">digitale-italia.netlify.app</p>
          </div>
        </div>

        {/* Mittente / Destinatario */}
        <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-100">
          {/* Emittente */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Da</p>
            {u ? (
              <>
                <p className="font-bold text-gray-900">
                  {u.nome} {u.cognome}
                </p>
                {u.partita_iva && <p className="text-sm text-gray-600">P.IVA: {u.partita_iva}</p>}
                {u.codice_fiscale && <p className="text-sm text-gray-600">C.F.: {u.codice_fiscale}</p>}
                {u.pec && <p className="text-sm text-gray-600">PEC: {u.pec}</p>}
                {u.telefono && <p className="text-sm text-gray-600">Tel: {u.telefono}</p>}
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">Compila i tuoi dati in Impostazioni</p>
            )}
          </div>

          {/* Cliente */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">A</p>
            {c ? (
              <>
                <p className="font-bold text-gray-900">{nomeCliente(c)}</p>
                {c.partita_iva && <p className="text-sm text-gray-600">P.IVA: {c.partita_iva}</p>}
                {c.codice_fiscale && <p className="text-sm text-gray-600">C.F.: {c.codice_fiscale}</p>}
                {c.codice_sdi && <p className="text-sm text-gray-600">Cod. SDI: {c.codice_sdi}</p>}
                {c.pec && <p className="text-sm text-gray-600">PEC: {c.pec}</p>}
                {c.email && <p className="text-sm text-gray-600">Email: {c.email}</p>}
              </>
            ) : (
              <p className="text-sm text-gray-400">—</p>
            )}
          </div>
        </div>

        {/* Oggetto */}
        {f.oggetto && (
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Oggetto</p>
            <p className="text-gray-800 font-medium">{f.oggetto}</p>
          </div>
        )}

        {/* Tabella importi */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                Descrizione
              </th>
              <th className="text-right py-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                Importo
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 text-gray-800">{f.oggetto ?? "Prestazione professionale"}</td>
              <td className="py-3 text-right font-mono text-gray-800">
                {formatEuro(f.imponibile_centesimi)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100">
              <td className="py-2 text-sm text-gray-500">Imponibile</td>
              <td className="py-2 text-right text-sm text-gray-500 font-mono">
                {formatEuro(f.imponibile_centesimi)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-sm text-gray-500">IVA {f.iva_percentuale}%</td>
              <td className="py-2 text-right text-sm text-gray-500 font-mono">
                {formatEuro(f.iva_centesimi)}
              </td>
            </tr>
            <tr className="border-t-2 border-gray-900">
              <td className="py-3 text-base font-bold text-gray-900">TOTALE DA PAGARE</td>
              <td className="py-3 text-right text-xl font-black text-gray-900 font-mono">
                {formatEuro(f.netto_a_pagare_centesimi)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Pagamento */}
        {(f.metodo_pagamento || f.iban_pagamento || f.note) && (
          <div className="bg-gray-50 rounded-xl p-5 space-y-2 print:bg-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Modalità di pagamento
            </p>
            {f.metodo_pagamento && (
              <p className="text-sm text-gray-700 capitalize">{f.metodo_pagamento.replace("_", " ")}</p>
            )}
            {f.iban_pagamento && <p className="text-sm text-gray-700 font-mono">IBAN: {f.iban_pagamento}</p>}
            {f.note && <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">{f.note}</p>}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Documento generato con <span className="font-semibold text-[#009246]">digITAle</span> ·
            digitale-italia.netlify.app
          </p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { font-size: 12px; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>
    </div>
  );
}

export default function FatturaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      }
    >
      <FatturaContent />
    </Suspense>
  );
}
