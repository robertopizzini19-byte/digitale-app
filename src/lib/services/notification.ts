/**
 * DigiITAle — Notification Service
 * Notifiche in-app, email, push.
 * Le scadenze fiscali generano notifiche automatiche.
 */

import type { ApiResult } from "../core/types";
import type { DbNotifica } from "../db/schema";

export interface NotificationService {
  /** Invia notifica in-app */
  invia(params: InviaNotificaParams): Promise<ApiResult<DbNotifica>>;

  /** Lista notifiche utente */
  lista(userId: string, filtri?: {
    letta?: boolean;
    tipo?: DbNotifica["tipo"];
    limite?: number;
  }): Promise<ApiResult<DbNotifica[]>>;

  /** Segna come letta */
  segnaLetta(notificaId: string): Promise<ApiResult<void>>;

  /** Segna tutte come lette */
  segnaTutteLette(userId: string): Promise<ApiResult<void>>;

  /** Conta notifiche non lette */
  contaNonLette(userId: string): Promise<ApiResult<number>>;

  /** Elimina notifica */
  elimina(notificaId: string): Promise<ApiResult<void>>;
}

export interface InviaNotificaParams {
  userId: string;
  tipo: DbNotifica["tipo"];
  titolo: string;
  messaggio: string;
  azioneUrl?: string;
  /** Se true, invia anche email */
  email?: boolean;
  /** Se true, invia anche push */
  push?: boolean;
}

/* ─── Template Notifiche Italiane ─── */

export const TEMPLATE_NOTIFICHE = {
  fattura_emessa: (numero: string, importo: string) => ({
    titolo: `Fattura ${numero} emessa`,
    messaggio: `La fattura ${numero} di ${importo} è stata emessa con successo.`,
  }),
  fattura_pagata: (numero: string, importo: string) => ({
    titolo: `Pagamento ricevuto`,
    messaggio: `La fattura ${numero} di ${importo} è stata pagata.`,
  }),
  fattura_scaduta: (numero: string, cliente: string) => ({
    titolo: `Fattura scaduta`,
    messaggio: `La fattura ${numero} per ${cliente} è scaduta. Considera un sollecito.`,
  }),
  scadenza_prossima: (titolo: string, giorniMancanti: number) => ({
    titolo: `Scadenza in arrivo`,
    messaggio: `${titolo} scade tra ${giorniMancanti} giorn${giorniMancanti === 1 ? "o" : "i"}.`,
  }),
  scadenza_oggi: (titolo: string) => ({
    titolo: `Scadenza oggi`,
    messaggio: `${titolo} scade oggi. Non dimenticare!`,
  }),
  benvenuto: (nome: string) => ({
    titolo: `Benvenuto su DigiITAle, ${nome}!`,
    messaggio: "Il tuo account è pronto. Inizia configurando il tuo profilo professionale.",
  }),
  piano_aggiornato: (piano: string) => ({
    titolo: `Piano aggiornato`,
    messaggio: `Sei passato al piano ${piano}. Le nuove funzionalità sono già attive.`,
  }),
} as const;
