/**
 * DigiITAle — Database Schema Types
 * Definizioni TypeScript che mappano 1:1 le tabelle PostgreSQL.
 * Le migration SQL in /migrations creano queste tabelle su Supabase.
 *
 * Convenzioni:
 * - Nomi tabelle: snake_case, italiano
 * - Chiavi primarie: UUID v4
 * - Timestamps: creato_il, aggiornato_il (con trigger auto-update)
 * - Soft delete: eliminato_il (null = attivo)
 * - Multi-tenant: ogni riga ha user_id (RLS Supabase)
 */

/* ─── Utenti ─── */

export interface DbUtente {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  codice_fiscale: string | null;
  partita_iva: string | null;
  telefono: string | null;
  pec: string | null;
  ruolo: "cittadino" | "freelance" | "pmi" | "pa" | "studente" | "estero";
  piano: "gratuito" | "professionista" | "impresa";
  moduli_attivi: string[];
  avatar_url: string | null;
  email_verificata: boolean;
  spid_verificato: boolean;
  stripe_customer_id: string | null;
  attivo: boolean;
  creato_il: string;
  aggiornato_il: string;
  ultimo_accesso: string | null;
  eliminato_il: string | null;
}

/* ─── Indirizzo ─── */

export interface DbIndirizzo {
  id: string;
  user_id: string;
  tipo: "residenza" | "sede_legale" | "sede_operativa" | "fatturazione";
  via: string;
  civico: string;
  cap: string;
  comune: string;
  provincia: string;
  nazione: string;
  predefinito: boolean;
  creato_il: string;
  aggiornato_il: string;
}

/* ─── Clienti (modulo freelance/pmi) ─── */

export interface DbCliente {
  id: string;
  user_id: string;
  tipo: "persona_fisica" | "persona_giuridica";
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
  attivo: boolean;
  creato_il: string;
  aggiornato_il: string;
  eliminato_il: string | null;
}

/* ─── Fatture ─── */

export interface DbFattura {
  id: string;
  user_id: string;
  cliente_id: string;
  numero: string;            // progressivo annuo (es. "2026/001")
  anno: number;
  tipo: "fattura" | "nota_credito" | "parcella" | "proforma";
  stato: "bozza" | "emessa" | "inviata_sdi" | "accettata" | "rifiutata" | "pagata" | "scaduta" | "annullata";
  data_emissione: string;
  data_scadenza: string;
  /* Importi in centesimi (integer, mai float per i soldi) */
  imponibile_centesimi: number;
  iva_percentuale: number;
  iva_centesimi: number;
  totale_centesimi: number;
  ritenuta_acconto_centesimi: number;
  contributo_integrativo_centesimi: number;
  netto_a_pagare_centesimi: number;
  valuta: "EUR";
  /* SDI */
  sdi_id_trasmissione: string | null;
  sdi_stato: string | null;
  sdi_data_invio: string | null;
  sdi_data_risposta: string | null;
  xml_fattura_url: string | null;
  pdf_fattura_url: string | null;
  /* Pagamento */
  metodo_pagamento: "bonifico" | "contanti" | "carta" | "paypal" | "ri_ba" | "altro" | null;
  iban_pagamento: string | null;
  data_pagamento: string | null;
  /* Note */
  oggetto: string | null;
  note: string | null;
  note_interne: string | null;
  /* Bollo */
  bollo_virtuale: boolean;
  bollo_importo_centesimi: number;
  /* Metadata */
  creato_il: string;
  aggiornato_il: string;
  eliminato_il: string | null;
}

/* ─── Righe Fattura ─── */

export interface DbRigaFattura {
  id: string;
  fattura_id: string;
  ordine: number;
  descrizione: string;
  quantita: number;          // decimale (es. 1.5 ore)
  prezzo_unitario_centesimi: number;
  sconto_percentuale: number;
  iva_percentuale: number;
  totale_centesimi: number;
  codice_articolo: string | null;
  unita_misura: string | null; // "ore", "pezzi", "gg", etc.
}

/* ─── Scadenze ─── */

export interface DbScadenza {
  id: string;
  user_id: string;
  tipo: "iva" | "inps" | "irpef" | "irap" | "f24" | "pec" | "firma_digitale" | "assicurazione" | "contratto" | "altro";
  titolo: string;
  descrizione: string | null;
  data_scadenza: string;
  importo_centesimi: number | null;
  stato: "attiva" | "completata" | "scaduta" | "annullata";
  priorita: "bassa" | "normale" | "alta" | "urgente";
  promemoria_giorni: number[]; // es. [30, 7, 1]
  ricorrenza: "nessuna" | "mensile" | "trimestrale" | "annuale";
  fattura_id: string | null;
  creato_il: string;
  aggiornato_il: string;
}

/* ─── Documenti ─── */

export interface DbDocumento {
  id: string;
  user_id: string;
  tipo: "fattura_xml" | "fattura_pdf" | "contratto" | "identita" | "certificato" | "altro";
  nome: string;
  descrizione: string | null;
  mime_type: string;
  dimensione_bytes: number;
  storage_path: string;       // path nel bucket Supabase Storage
  hash_sha256: string;        // integrità documento
  categoria: string | null;
  tags: string[];
  creato_il: string;
  aggiornato_il: string;
  eliminato_il: string | null;
}

/* ─── Consensi GDPR ─── */

export interface DbConsenso {
  id: string;
  user_id: string;
  tipo: string;
  accettato: boolean;
  versione: string;
  ip: string;
  user_agent: string;
  metodo: "click" | "spid" | "api";
  data_accettazione: string;
  data_revoca: string | null;
}

/* ─── Audit Log ─── */

export interface DbAuditLog {
  id: string;
  user_id: string;
  azione: string;
  risorsa: string;
  risorsa_id: string | null;
  dettagli: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  timestamp: string;
}

/* ─── Notifiche ─── */

export interface DbNotifica {
  id: string;
  user_id: string;
  tipo: "scadenza" | "fattura" | "pagamento" | "sistema" | "aggiornamento";
  titolo: string;
  messaggio: string;
  letta: boolean;
  azione_url: string | null;
  creato_il: string;
  letto_il: string | null;
}
