/**
 * DigiITAle — Sistema Moduli
 * Ogni nicchia (freelance, PMI, PA...) è un modulo indipendente.
 * I moduli si registrano nel registry e il core li orchestra.
 *
 * Regola fondamentale: un modulo può dipendere dal core, MAI da un altro modulo.
 * Se due moduli devono comunicare, passano dal core (eventi o servizi condivisi).
 */

import type { UserRole, SubscriptionTier } from "../core/types";

/* ─── Definizione Modulo ─── */

export interface ModuleDefinition {
  /** ID univoco del modulo (es. "freelance", "pmi") */
  id: string;
  /** Nome visualizzato */
  nome: string;
  /** Descrizione breve */
  descrizione: string;
  /** Versione semantica */
  versione: string;
  /** Icona lucide-react */
  icona: string;
  /** Ruoli utente che possono usare questo modulo */
  ruoliAbilitati: UserRole[];
  /** Piano minimo richiesto */
  pianoMinimo: SubscriptionTier;
  /** Rotte del modulo (path relativi) */
  rotte: ModuleRoute[];
  /** Navigazione sidebar */
  navigazione: ModuleNavItem[];
  /** Permessi definiti dal modulo */
  permessi: string[];
  /** Dipendenze da servizi core */
  servizi: string[];
  /** Stato del modulo */
  stato: "attivo" | "beta" | "sviluppo" | "disattivato";
}

/* ─── Rotta Modulo ─── */

export interface ModuleRoute {
  /** Path relativo (es. "/fatture") */
  path: string;
  /** Componente da renderizzare */
  componente: string;
  /** Richiede autenticazione */
  protetta: boolean;
  /** Permessi richiesti */
  permessi?: string[];
}

/* ─── Navigazione ─── */

export interface ModuleNavItem {
  /** Label nel menu */
  label: string;
  /** Path */
  href: string;
  /** Icona lucide-react */
  icona: string;
  /** Badge (es. contatore notifiche) */
  badge?: number;
  /** Sotto-voci */
  figli?: ModuleNavItem[];
}

/* ─── Evento Modulo ─── */

export interface ModuleEvent<T = unknown> {
  /** Tipo evento (es. "fattura:creata", "cliente:aggiornato") */
  tipo: string;
  /** ID del modulo che emette */
  sorgente: string;
  /** Payload */
  dati: T;
  /** Timestamp ISO 8601 */
  timestamp: string;
}

/* ─── Hook del Modulo ─── */

export interface ModuleHooks {
  /** Chiamato quando il modulo viene attivato per un utente */
  onAttiva?: () => Promise<void>;
  /** Chiamato quando il modulo viene disattivato */
  onDisattiva?: () => Promise<void>;
  /** Chiamato ad ogni login dell'utente */
  onLogin?: () => Promise<void>;
  /** Chiamato per generare i dati GDPR export */
  onGdprExport?: () => Promise<Record<string, unknown>>;
  /** Chiamato per cancellare i dati utente (diritto all'oblio) */
  onGdprDelete?: () => Promise<void>;
}

/* ─── Modulo Completo ─── */

export interface DigiTaleModule {
  definizione: ModuleDefinition;
  hooks: ModuleHooks;
}
