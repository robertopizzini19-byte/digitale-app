/**
 * DigiITAle — Configurazione Applicazione
 * Tutte le variabili ambiente centralizzate qui.
 * Mai leggere process.env direttamente nei moduli.
 */

import type { AppConfig } from "./types";

function env(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Variabile ambiente mancante: ${key}`);
  }
  return value;
}

function envOptional(key: string): string | undefined {
  return process.env[key] || undefined;
}

export function getConfig(): AppConfig {
  return {
    nome: "DigiITAle",
    versione: "1.0.0",
    ambiente: (envOptional("NODE_ENV") as AppConfig["ambiente"]) ?? "development",
    baseUrl: env("NEXT_PUBLIC_BASE_URL", "http://localhost:3000"),
    apiUrl: env("NEXT_PUBLIC_API_URL", "http://localhost:3000/api"),
    supabaseUrl: envOptional("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: envOptional("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    stripePublicKey: envOptional("NEXT_PUBLIC_STRIPE_PUBLIC_KEY"),
  };
}

/* ─── Costanti Globali ─── */

export const LIMITI = {
  /** Massimo upload file in bytes (10 MB) */
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  /** Formati file accettati */
  FORMATI_ACCETTATI: ["pdf", "xml", "png", "jpg", "jpeg", "csv"],
  /** Rate limit API (richieste per minuto) */
  RATE_LIMIT: {
    gratuito: 30,
    professionista: 120,
    impresa: 600,
  },
  /** Limiti per piano */
  PIANO: {
    gratuito: {
      fattureMese: 5,
      clienti: 10,
      spazioMb: 100,
      utenti: 1,
    },
    professionista: {
      fattureMese: -1, // illimitato
      clienti: -1,
      spazioMb: 5000,
      utenti: 1,
    },
    impresa: {
      fattureMese: -1,
      clienti: -1,
      spazioMb: 50000,
      utenti: 25,
    },
  },
} as const;

export const REGEX = {
  /** Codice fiscale italiano */
  CODICE_FISCALE: /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i,
  /** Partita IVA italiana */
  PARTITA_IVA: /^[0-9]{11}$/,
  /** CAP italiano */
  CAP: /^[0-9]{5}$/,
  /** Telefono italiano */
  TELEFONO: /^\+?39?\s?[0-9]{6,12}$/,
  /** PEC */
  PEC: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.pec\.it$/i,
  /** IBAN italiano */
  IBAN: /^IT[0-9]{2}[A-Z][0-9]{10}[A-Z0-9]{12}$/i,
} as const;
