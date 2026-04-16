/**
 * DigiITAle — Error Handling
 * Errori strutturati, logging, e messaggi utente in italiano.
 */

import type { ApiError, ErrorCode } from "../core/types";

/** Crea un errore API strutturato */
export function creaErrore(
  codice: ErrorCode,
  messaggio: string,
  dettagli?: Record<string, string>
): ApiError {
  return { codice, messaggio, dettagli };
}

/** Errori predefiniti */
export const ERRORI = {
  nonAutenticato: () =>
    creaErrore("NON_AUTENTICATO", "Devi accedere per continuare"),

  nonAutorizzato: (azione?: string) =>
    creaErrore("NON_AUTORIZZATO", azione
      ? `Non sei autorizzato a ${azione}`
      : "Non hai i permessi necessari"
    ),

  nonTrovato: (risorsa: string) =>
    creaErrore("NON_TROVATO", `${risorsa} non trovato/a`),

  validazione: (campo: string, motivo: string) =>
    creaErrore("VALIDAZIONE", `Campo "${campo}" non valido: ${motivo}`, { campo }),

  limiteRaggiunto: (risorsa: string, limite: number) =>
    creaErrore(
      "LIMITE_RAGGIUNTO",
      `Hai raggiunto il limite di ${limite} ${risorsa} per il tuo piano. Passa a un piano superiore.`
    ),

  conflitto: (dettaglio: string) =>
    creaErrore("CONFLITTO", dettaglio),

  interno: () =>
    creaErrore("ERRORE_INTERNO", "Si è verificato un errore. Il nostro team è stato avvisato."),

  rateLimit: () =>
    creaErrore("RATE_LIMIT", "Troppe richieste. Attendi qualche secondo e riprova."),
} as const;

/** Log strutturato (in produzione va su servizio di logging) */
export function logErrore(
  contesto: string,
  errore: unknown,
  meta?: Record<string, unknown>
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    livello: "errore",
    contesto,
    messaggio: errore instanceof Error ? errore.message : String(errore),
    stack: errore instanceof Error ? errore.stack : undefined,
    ...meta,
  };

  // In produzione: inviare a servizio di logging (es. Sentry)
  console.error("[DigiITAle]", JSON.stringify(entry));
}
