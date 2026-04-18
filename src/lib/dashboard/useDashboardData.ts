"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

export type FatturaRecente = {
  id: string;
  cliente: string;
  azienda: string;
  importo: string;
  data: string;
  stato: "pagata" | "attesa" | "scaduta";
  tipo: string;
};

export type ScadenzaProssima = {
  label: string;
  date: string;
  type: "urgente" | "normale" | "info";
};

export type DashboardData = {
  fatturatoMese: number;
  fatturatoMesePrecedente: number;
  inAttesaCount: number;
  inAttesaImporto: number;
  clientiAttivi: number;
  prossimaScadenza: { titolo: string; data: string } | null;
  fattureRecenti: FatturaRecente[];
  scadenzeImminenti: ScadenzaProssima[];
  isEmpty: boolean;
  loading: boolean;
};

function formatEur(centesimi: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(centesimi / 100);
}

function formatData(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statoFattura(s: string): FatturaRecente["stato"] {
  if (s === "pagata") return "pagata";
  if (s === "scaduta") return "scaduta";
  return "attesa";
}

export function useDashboardData(userId: string | null): DashboardData {
  const [data, setData] = useState<DashboardData>({
    fatturatoMese: 0,
    fatturatoMesePrecedente: 0,
    inAttesaCount: 0,
    inAttesaImporto: 0,
    clientiAttivi: 0,
    prossimaScadenza: null,
    fattureRecenti: [],
    scadenzeImminenti: [],
    isEmpty: true,
    loading: true,
  });

  useEffect(() => {
    if (!userId) return;
    const sb = getSupabase();
    if (!sb) return;

    let annullato = false;

    async function fetch() {
      if (!sb || !userId) return;
      const now = new Date();
      const inizioMese = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const inizioMesePrecedente = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const fineMesePrecedente = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      const [
        { data: fattMese },
        { data: fattPrec },
        { data: fattAttesa },
        { count: clientiCount },
        { data: scadenze },
        { data: fattRecenti },
      ] = await Promise.all([
        sb
          .from("fatture")
          .select("totale_centesimi")
          .eq("user_id", userId)
          .eq("stato", "pagata")
          .gte("data_emissione", inizioMese)
          .is("eliminato_il", null),
        sb
          .from("fatture")
          .select("totale_centesimi")
          .eq("user_id", userId)
          .eq("stato", "pagata")
          .gte("data_emissione", inizioMesePrecedente)
          .lte("data_emissione", fineMesePrecedente)
          .is("eliminato_il", null),
        sb
          .from("fatture")
          .select("id, totale_centesimi")
          .eq("user_id", userId)
          .in("stato", ["emessa", "inviata_sdi", "accettata"])
          .is("eliminato_il", null),
        sb
          .from("clienti")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("attivo", true)
          .is("eliminato_il", null),
        sb
          .from("scadenze")
          .select("id, titolo, data_scadenza, priorita")
          .eq("user_id", userId)
          .eq("stato", "attiva")
          .gte("data_scadenza", now.toISOString().split("T")[0])
          .order("data_scadenza", { ascending: true })
          .limit(3),
        sb
          .from("fatture")
          .select(
            `
            id, stato, tipo, totale_centesimi, data_emissione, eliminato_il,
            clienti!fatture_cliente_id_fkey (nome, cognome, ragione_sociale, tipo)
          `,
          )
          .eq("user_id", userId)
          .is("eliminato_il", null)
          .order("creato_il", { ascending: false })
          .limit(6),
      ]);

      if (annullato) return;

      const fattMeseTotal = (fattMese ?? []).reduce(
        (s: number, r: { totale_centesimi: number }) => s + (r.totale_centesimi ?? 0),
        0,
      );
      const fattPrecTotal = (fattPrec ?? []).reduce(
        (s: number, r: { totale_centesimi: number }) => s + (r.totale_centesimi ?? 0),
        0,
      );
      const attesaImporto = (fattAttesa ?? []).reduce(
        (s: number, r: { totale_centesimi: number }) => s + (r.totale_centesimi ?? 0),
        0,
      );

      type FatturaRow = {
        id: string;
        stato: string;
        tipo: string;
        totale_centesimi: number;
        data_emissione: string;
        clienti: {
          nome: string | null;
          cognome: string | null;
          ragione_sociale: string | null;
          tipo: string;
        } | null;
      };

      const recenti: FatturaRecente[] = (fattRecenti ?? []).map((f: FatturaRow) => {
        const c = f.clienti;
        const cliente = c
          ? c.tipo === "persona_giuridica"
            ? (c.ragione_sociale ?? "")
            : `${c.nome ?? ""} ${c.cognome ?? ""}`.trim()
          : "—";
        return {
          id: f.id,
          cliente,
          azienda: c?.tipo === "persona_giuridica" ? (c.ragione_sociale ?? "") : "",
          importo: formatEur(f.totale_centesimi),
          data: formatData(f.data_emissione),
          stato: statoFattura(f.stato),
          tipo: f.tipo ?? "—",
        };
      });

      type ScadenzaRow = { titolo: string; data_scadenza: string; priorita: string };
      const scadImm: ScadenzaProssima[] = (scadenze ?? []).map((s: ScadenzaRow) => ({
        label: s.titolo,
        date: formatData(s.data_scadenza),
        type: s.priorita === "urgente" ? "urgente" : s.priorita === "alta" ? "normale" : "info",
      }));

      const prossima = scadenze?.[0]
        ? {
            titolo: (scadenze[0] as ScadenzaRow).titolo,
            data: formatData((scadenze[0] as ScadenzaRow).data_scadenza),
          }
        : null;

      setData({
        fatturatoMese: fattMeseTotal,
        fatturatoMesePrecedente: fattPrecTotal,
        inAttesaCount: (fattAttesa ?? []).length,
        inAttesaImporto: attesaImporto,
        clientiAttivi: clientiCount ?? 0,
        prossimaScadenza: prossima,
        fattureRecenti: recenti,
        scadenzeImminenti: scadImm,
        isEmpty: recenti.length === 0 && (clientiCount ?? 0) === 0,
        loading: false,
      });
    }

    fetch();
    return () => {
      annullato = true;
    };
  }, [userId]);

  return data;
}
