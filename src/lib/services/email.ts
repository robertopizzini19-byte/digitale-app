/**
 * digITAle — Email & PEC Service
 * Invio email transazionali + PEC per documenti legali.
 * Backend: Resend (transazionali) + provider PEC certificato.
 */

import type { ApiResult } from "../core/types";

export interface EmailService {
  /** Invia email transazionale (conferme, notifiche, reset password) */
  inviaTransazionale(params: EmailParams): Promise<ApiResult<{ messageId: string }>>;

  /** Invia via PEC (fatture, documenti legali) */
  inviaPec(params: PecParams): Promise<ApiResult<{ ricevutaId: string }>>;

  /** Verifica stato consegna PEC */
  statoPec(ricevutaId: string): Promise<ApiResult<StatoPec>>;
}

export interface EmailParams {
  a: string;
  oggetto: string;
  templateId: string;
  variabili: Record<string, string>;
  allegati?: Array<{
    nome: string;
    contenuto: Buffer | Blob;
    mimeType: string;
  }>;
}

export interface PecParams {
  da: string;      // PEC mittente
  a: string;       // PEC destinatario
  oggetto: string;
  corpo: string;
  allegati: Array<{
    nome: string;
    contenuto: Buffer | Blob;
    mimeType: string;
  }>;
}

export interface StatoPec {
  id: string;
  stato: "inviata" | "accettata" | "consegnata" | "errore";
  dataInvio: string;
  dataRicevuta?: string;
  ricevutaAccettazione?: string;
  ricevutaConsegna?: string;
}

/* ─── Template Email in Italiano ─── */

export const EMAIL_TEMPLATES = {
  BENVENUTO: "tmpl_benvenuto",
  VERIFICA_EMAIL: "tmpl_verifica_email",
  RESET_PASSWORD: "tmpl_reset_password",
  FATTURA_EMESSA: "tmpl_fattura_emessa",
  FATTURA_SOLLECITO: "tmpl_fattura_sollecito",
  SCADENZA_PROMEMORIA: "tmpl_scadenza_promemoria",
  PIANO_AGGIORNATO: "tmpl_piano_aggiornato",
  EXPORT_DATI_PRONTO: "tmpl_export_dati",
  ACCOUNT_ELIMINATO: "tmpl_account_eliminato",
} as const;
