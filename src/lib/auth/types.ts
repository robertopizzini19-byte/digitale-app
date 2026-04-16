/**
 * digITAle — Auth Types
 * Supporta: email/password, SPID, CIE.
 * Backend: Supabase Auth (quando connesso).
 */

import type { User, UserRole, SubscriptionTier } from "../core/types";

/* ─── Sessione ─── */

export interface Session {
  user: User;
  token: string;
  refreshToken: string;
  scadenza: string; // ISO 8601
  provider: AuthProvider;
}

export type AuthProvider = "email" | "spid" | "cie" | "google";

/* ─── Login ─── */

export interface LoginCredentials {
  email: string;
  password: string;
  ricordami?: boolean;
}

export interface LoginSpidResponse {
  /** URL di redirect verso l'Identity Provider SPID */
  redirectUrl: string;
  /** Request ID per correlazione */
  requestId: string;
}

/* ─── Registrazione ─── */

export interface RegistrazionePayload {
  email: string;
  password: string;
  nome: string;
  cognome: string;
  ruolo: UserRole;
  codiceFiscale?: string;
  partitaIva?: string;
  /** Consensi GDPR accettati durante la registrazione */
  consensi: {
    privacyPolicy: true; // obbligatorio, deve essere true
    terminiServizio: true;
    marketing?: boolean;
    profilazione?: boolean;
    trattamentoVocale?: boolean;
  };
}

/* ─── Password ─── */

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  nuovaPassword: string;
}

/** Requisiti password — OWASP guidelines */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false, // troppo restrittivo per utenti non tecnici
} as const;

/* ─── Permessi ─── */

export interface Permission {
  risorsa: string;  // es. "fatture", "clienti"
  azione: "leggere" | "creare" | "modificare" | "eliminare" | "esportare";
}

export interface RuoloPermessi {
  ruolo: UserRole;
  piano: SubscriptionTier;
  permessi: Permission[];
}

/* ─── Auth State (frontend) ─── */

export type AuthState =
  | { stato: "caricamento" }
  | { stato: "non_autenticato" }
  | { stato: "autenticato"; sessione: Session }
  | { stato: "errore"; messaggio: string };
