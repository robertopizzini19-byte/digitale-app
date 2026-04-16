/**
 * digITAle — Core Types
 * Tipi fondamentali condivisi da tutti i moduli.
 * Ogni modulo importa da qui, mai il contrario.
 */

/* ─── Identità Utente ─── */

export type UserRole = "cittadino" | "freelance" | "pmi" | "pa" | "studente" | "estero";

export type SubscriptionTier = "gratuito" | "professionista" | "impresa";

export interface User {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  codiceFiscale?: string;
  partitaIva?: string;
  telefono?: string;
  ruolo: UserRole;
  piano: SubscriptionTier;
  moduliAttivi: string[]; // IDs dei moduli abilitati
  consensiGdpr: GdprConsent[];
  creatoIl: string;   // ISO 8601
  aggiornatoIl: string;
  ultimoAccesso?: string;
  attivo: boolean;
  emailVerificata: boolean;
  spidVerificato: boolean;
}

/* ─── GDPR ─── */

export interface GdprConsent {
  tipo: GdprConsentType;
  accettato: boolean;
  dataAccettazione: string;
  versione: string;
  ip?: string;
}

export type GdprConsentType =
  | "privacy_policy"
  | "termini_servizio"
  | "marketing"
  | "profilazione"
  | "cookie_analytics"
  | "cookie_marketing"
  | "trattamento_vocale";

/* ─── Indirizzo ─── */

export interface Indirizzo {
  via: string;
  civico: string;
  cap: string;
  comune: string;
  provincia: string; // sigla 2 lettere
  nazione: string;   // default "IT"
}

/* ─── Risultati API ─── */

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; errore: ApiError };

export interface ApiError {
  codice: ErrorCode;
  messaggio: string;
  dettagli?: Record<string, string>;
}

export type ErrorCode =
  | "NON_AUTENTICATO"
  | "NON_AUTORIZZATO"
  | "NON_TROVATO"
  | "VALIDAZIONE"
  | "CONFLITTO"
  | "LIMITE_RAGGIUNTO"
  | "ERRORE_INTERNO"
  | "SERVIZIO_NON_DISPONIBILE"
  | "RATE_LIMIT";

/* ─── Paginazione ─── */

export interface PaginazioneParams {
  pagina: number;
  perPagina: number;
  ordinaPer?: string;
  ordine?: "asc" | "desc";
}

export interface PaginazioneRisposta<T> {
  dati: T[];
  totale: number;
  pagina: number;
  perPagina: number;
  totalePagine: number;
}

/* ─── Audit Log ─── */

export interface AuditEntry {
  id: string;
  userId: string;
  azione: string;
  risorsa: string;
  risorsaId: string;
  dettagli?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

/* ─── Configurazione App ─── */

export interface AppConfig {
  nome: string;
  versione: string;
  ambiente: "development" | "staging" | "production";
  baseUrl: string;
  apiUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  stripePublicKey?: string;
}
