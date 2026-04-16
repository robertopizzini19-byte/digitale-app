/**
 * digITAle — Voice AI Service
 * Interfaccia assistente vocale italiano.
 * STT: Whisper API | TTS: edge-tts (Diego Neural)
 * NLU: Claude/Haiku per intent parsing in italiano naturale.
 *
 * Art. 22 GDPR: richiede consenso esplicito per decisioni automatizzate.
 */

import type { ApiResult } from "../core/types";

/* ─── Types ─── */

export interface VoiceService {
  /** Trascrivi audio in testo (STT) */
  trascrivi(audio: Blob, lingua?: string): Promise<ApiResult<Trascrizione>>;

  /** Interpreta intent da testo in italiano naturale */
  interpretaIntent(testo: string, contesto?: ConversazioneContesto): Promise<ApiResult<IntentRiconosciuto>>;

  /** Genera risposta vocale (TTS) */
  sintetizza(testo: string, voce?: string): Promise<ApiResult<Blob>>;

  /** Esegui azione dall'intent riconosciuto */
  eseguiAzione(intent: IntentRiconosciuto): Promise<ApiResult<RisultatoAzione>>;
}

export interface Trascrizione {
  testo: string;
  lingua: string;
  confidenza: number;
  durataSec: number;
}

export interface IntentRiconosciuto {
  intent: VoiceIntent;
  confidenza: number;
  parametri: Record<string, string>;
  testoOriginale: string;
  rispostaSuggerita: string;
}

export type VoiceIntent =
  | "crea_fattura"
  | "cerca_fattura"
  | "stato_fatture"
  | "aggiungi_cliente"
  | "cerca_cliente"
  | "prossime_scadenze"
  | "riepilogo_giornaliero"
  | "riepilogo_mensile"
  | "registra_spesa"
  | "aiuto"
  | "non_compreso";

export interface ConversazioneContesto {
  messaggiPrecedenti: Array<{
    ruolo: "utente" | "assistente";
    testo: string;
  }>;
  paginaCorrente: string;
  ultimaAzione?: string;
}

export interface RisultatoAzione {
  successo: boolean;
  messaggio: string;
  dati?: Record<string, unknown>;
  azioniSuggerite?: string[];
}

/* ─── Intent Patterns (italiano) ─── */

export const INTENT_PATTERNS: Array<{
  intent: VoiceIntent;
  patterns: RegExp[];
}> = [
  {
    intent: "crea_fattura",
    patterns: [
      /crea\s+(una\s+)?fattura/i,
      /nuova\s+fattura/i,
      /fattura\s+per\s+/i,
      /emetti\s+(una\s+)?fattura/i,
      /fai\s+(una\s+)?fattura/i,
    ],
  },
  {
    intent: "cerca_fattura",
    patterns: [
      /cerca\s+(la\s+)?fattura/i,
      /trova\s+(la\s+)?fattura/i,
      /mostra\s+(le\s+)?fattur[ae]/i,
      /vedi\s+(le\s+)?fattur[ae]/i,
    ],
  },
  {
    intent: "stato_fatture",
    patterns: [
      /stato\s+(delle\s+)?fattur[ae]/i,
      /fattur[ae]\s+(in\s+)?attesa/i,
      /fattur[ae]\s+non\s+pagate/i,
      /quante\s+fattur[ae]/i,
      /quanto\s+(ho\s+)?fatturato/i,
    ],
  },
  {
    intent: "aggiungi_cliente",
    patterns: [
      /aggiungi\s+(un\s+)?cliente/i,
      /nuovo\s+cliente/i,
      /crea\s+(un\s+)?cliente/i,
    ],
  },
  {
    intent: "prossime_scadenze",
    patterns: [
      /prossim[ae]\s+scadenz[ae]/i,
      /scadenz[ae]\s+in\s+arrivo/i,
      /cosa\s+scade/i,
      /quando\s+scade/i,
    ],
  },
  {
    intent: "riepilogo_giornaliero",
    patterns: [
      /riepilogo\s+(di\s+)?oggi/i,
      /com[e']\s+(va\s+)?oggi/i,
      /situazione\s+(di\s+)?oggi/i,
      /buongiorno/i,
    ],
  },
  {
    intent: "riepilogo_mensile",
    patterns: [
      /riepilogo\s+(del\s+)?mese/i,
      /andamento\s+mensile/i,
      /com[e']\s+(va\s+il\s+)?mese/i,
      /report\s+mensile/i,
    ],
  },
  {
    intent: "registra_spesa",
    patterns: [
      /registra\s+(una\s+)?spesa/i,
      /nuova\s+spesa/i,
      /aggiungi\s+(una\s+)?spesa/i,
      /ho\s+speso/i,
    ],
  },
  {
    intent: "aiuto",
    patterns: [
      /aiut[oa]/i,
      /come\s+(si\s+)?fa/i,
      /cosa\s+puoi\s+fare/i,
      /help/i,
    ],
  },
];

/** Match locale di intent senza API (fallback) */
export function matchIntentLocale(testo: string): VoiceIntent {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(testo))) {
      return intent;
    }
  }
  return "non_compreso";
}
