/**
 * digITAle — Modulo Freelance: Types
 * Tipi specifici per freelance e professionisti.
 * Score: 23/25 (primo modulo scelto).
 *
 * Funzionalità:
 * 1. Fatturazione elettronica (SDI)
 * 2. Gestione clienti (CRM leggero)
 * 3. Scadenzario fiscale automatico
 * 4. Contabilità semplificata
 * 5. Firma digitale
 * 6. Assistente vocale
 */

import type { DbFattura, DbCliente, DbScadenza, DbRigaFattura } from "../../lib/db/schema";

/* ─── Profilo Freelance ─── */

export interface ProfiloFreelance {
  userId: string;
  /** Regime fiscale */
  regimeFiscale: "ordinario" | "forfettario" | "minimi";
  /** Coefficiente redditività forfettario (es. 78% per consulenza IT) */
  coefficienteRedditivita?: number;
  /** Aliquota IVA predefinita */
  aliquotaIvaPredefinita: number;
  /** Ritenuta d'acconto applicabile */
  ritenutaAcconto: boolean;
  ritenutaPercentuale: number; // default 20%
  /** Cassa previdenza */
  cassaPrevidenza?: {
    tipo: "inps_gestione_separata" | "cassa_forense" | "inarcassa" | "enpam" | "enpap" | "cnpadc" | "altro";
    percentuale: number;
  };
  /** Contributo integrativo */
  contributoIntegrativo: boolean;
  contributoIntegrativoPercentuale: number; // es. 4% per avvocati
  /** Bollo su fatture esenti */
  bolloAutomatico: boolean;
  /** Numerazione fatture */
  prefissoFattura: string; // es. "FT", "FATT"
  prossimoNumero: number;
  /** Dati bancari */
  iban?: string;
  banca?: string;
  /** Dati per la fattura */
  intestazione: string;
  pieDiPagina?: string;
}

/* ─── Dashboard Freelance ─── */

export interface DashboardFreelance {
  /** Fatturato mese corrente (centesimi) */
  fatturatoCorrMese: number;
  /** Variazione rispetto al mese precedente (percentuale) */
  variazioneMese: number;
  /** Fatture in attesa di pagamento */
  fattureInAttesa: number;
  /** Importo totale in attesa (centesimi) */
  importoInAttesa: number;
  /** Clienti attivi */
  clientiAttivi: number;
  /** Nuovi clienti questo mese */
  nuoviClientiMese: number;
  /** Prossime 3 scadenze */
  prossimeScadenze: DbScadenza[];
  /** Ultime 5 fatture */
  ultimeFatture: DbFattura[];
  /** Fatturato ultimi 6 mesi (per grafico) */
  andamentoMensile: Array<{
    mese: string;
    anno: number;
    totaleCentesimi: number;
  }>;
}

/* ─── Creazione Fattura ─── */

export interface CreaFatturaParams {
  clienteId: string;
  tipo: DbFattura["tipo"];
  dataEmissione: string;
  dataScadenza: string;
  oggetto?: string;
  note?: string;
  righe: Array<{
    descrizione: string;
    quantita: number;
    prezzoUnitarioCentesimi: number;
    scontoPercentuale?: number;
    ivaPercentuale?: number;
    unitaMisura?: string;
  }>;
  metodoPagamento?: DbFattura["metodo_pagamento"];
  ibanPagamento?: string;
}

/** Risultato calcolo totali fattura */
export interface TotaliFattura {
  righe: Array<DbRigaFattura & { totaleRigaCentesimi: number }>;
  imponibileCentesimi: number;
  ivaCentesimi: number;
  totaleCentesimi: number;
  ritenutaAccontoCentesimi: number;
  contributoIntegrativoCentesimi: number;
  nettoAPagareCentesimi: number;
  bolloImportoCentesimi: number;
}

/* ─── Filtri ─── */

export interface FiltroFatture {
  stato?: DbFattura["stato"];
  clienteId?: string;
  tipo?: DbFattura["tipo"];
  daData?: string;
  aData?: string;
  importoMinimo?: number;
  importoMassimo?: number;
}

export interface FiltroClienti {
  tipo?: DbCliente["tipo"];
  attivo?: boolean;
  ricerca?: string; // cerca in nome, ragione_sociale, email, P.IVA
}

/* ─── Scadenzario Fiscale ─── */

export interface ScadenzeFiscaliAutomatiche {
  /** IVA trimestrale: 16 maggio, 16 agosto, 16 novembre, 16 marzo */
  ivaTrimestrale: Array<{ data: string; descrizione: string }>;
  /** IRPEF: 30 giugno (saldo + 1° acconto), 30 novembre (2° acconto) */
  irpef: Array<{ data: string; descrizione: string }>;
  /** INPS gestione separata: stesse scadenze IRPEF */
  inps: Array<{ data: string; descrizione: string }>;
  /** Diritto camerale annuale: 30 giugno */
  dirittoCamerale?: { data: string; descrizione: string };
}

/** Genera scadenze fiscali automatiche per l'anno */
export function generaScadenzeFiscali(anno: number, regime: ProfiloFreelance["regimeFiscale"]): ScadenzeFiscaliAutomatiche {
  const scadenze: ScadenzeFiscaliAutomatiche = {
    ivaTrimestrale: [],
    irpef: [],
    inps: [],
  };

  if (regime === "ordinario") {
    // IVA mensile o trimestrale
    scadenze.ivaTrimestrale = [
      { data: `${anno}-05-16`, descrizione: `IVA 1° trimestre ${anno}` },
      { data: `${anno}-08-20`, descrizione: `IVA 2° trimestre ${anno}` },
      { data: `${anno}-11-16`, descrizione: `IVA 3° trimestre ${anno}` },
      { data: `${anno + 1}-03-16`, descrizione: `IVA 4° trimestre ${anno}` },
    ];
  }

  // IRPEF (tutti i regimi)
  scadenze.irpef = [
    { data: `${anno}-06-30`, descrizione: `IRPEF saldo ${anno - 1} + 1° acconto ${anno}` },
    { data: `${anno}-11-30`, descrizione: `IRPEF 2° acconto ${anno}` },
  ];

  // INPS gestione separata
  scadenze.inps = [
    { data: `${anno}-06-30`, descrizione: `INPS saldo ${anno - 1} + 1° acconto ${anno}` },
    { data: `${anno}-11-30`, descrizione: `INPS 2° acconto ${anno}` },
  ];

  return scadenze;
}
