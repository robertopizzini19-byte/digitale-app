/**
 * DigiITAle — GDPR Types
 * Conformità GDPR (Reg. UE 2016/679) e D.Lgs 196/2003 (Codice Privacy italiano).
 *
 * Diritti implementati:
 * - Art. 13-14: Informativa (consent management)
 * - Art. 15: Accesso ai dati
 * - Art. 16: Rettifica
 * - Art. 17: Cancellazione (diritto all'oblio)
 * - Art. 18: Limitazione del trattamento
 * - Art. 20: Portabilità dei dati
 * - Art. 21: Opposizione
 * - Art. 22: Decisioni automatizzate (AI voice)
 */

export interface ConsensoGdpr {
  id: string;
  userId: string;
  tipo: TipoConsenso;
  accettato: boolean;
  dataAccettazione: string;
  dataRevoca?: string;
  versione: string;           // versione del testo policy
  ip: string;
  userAgent: string;
  metodo: "click" | "spid" | "api";
}

export type TipoConsenso =
  | "privacy_policy"          // obbligatorio
  | "termini_servizio"        // obbligatorio
  | "marketing_email"         // facoltativo
  | "marketing_sms"           // facoltativo
  | "profilazione"            // facoltativo
  | "cookie_tecnici"          // obbligatorio (no consenso richiesto)
  | "cookie_analytics"        // facoltativo
  | "cookie_marketing"        // facoltativo
  | "trattamento_vocale"      // facoltativo — art. 22 decisioni automatizzate
  | "condivisione_terzi";     // facoltativo

export interface RichiestaAccessoDati {
  id: string;
  userId: string;
  tipo: "accesso" | "portabilita" | "cancellazione" | "rettifica" | "limitazione" | "opposizione";
  stato: "ricevuta" | "in_lavorazione" | "completata" | "rifiutata";
  dataRichiesta: string;
  dataCompletamento?: string;
  note?: string;
  /** GDPR art. 12: massimo 30 giorni per rispondere */
  scadenza: string;
}

export interface ExportDatiUtente {
  /** Dati anagrafici */
  profilo: Record<string, unknown>;
  /** Consensi dati */
  consensi: ConsensoGdpr[];
  /** Dati per modulo */
  moduli: Record<string, unknown>;
  /** Log attività */
  attivita: Array<{
    azione: string;
    data: string;
    dettagli?: string;
  }>;
  /** Metadati export */
  meta: {
    dataExport: string;
    formato: "json";
    versione: string;
  };
}

export interface RegistroTrattamento {
  /** Art. 30 GDPR — Registro delle attività di trattamento */
  titolare: {
    nome: string;
    indirizzo: string;
    email: string;
    pec: string;
  };
  dpo?: {
    nome: string;
    email: string;
  };
  trattamenti: Array<{
    finalita: string;
    categorieDati: string[];
    categorieInteressati: string[];
    destinatari: string[];
    trasferimentiExtraUe: boolean;
    terminiCancellazione: string;
    misureSicurezza: string[];
  }>;
}

/** Configurazione cookie banner */
export interface CookieBannerConfig {
  mostra: boolean;
  testo: string;
  linkPrivacy: string;
  linkCookie: string;
  categorie: Array<{
    id: string;
    nome: string;
    descrizione: string;
    obbligatorio: boolean;
    attivo: boolean;
  }>;
}
