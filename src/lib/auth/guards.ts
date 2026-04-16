/**
 * digITAle — Auth Guards
 * Protezione rotte e verifica permessi.
 * Usato sia lato server (API) che client (navigazione).
 */

import type { User, UserRole, SubscriptionTier } from "../core/types";
import type { Permission } from "./types";

/** Verifica se l'utente ha un ruolo specifico */
export function haRuolo(user: User, ruolo: UserRole): boolean {
  return user.ruolo === ruolo;
}

/** Verifica se l'utente ha almeno il piano richiesto */
export function haPiano(user: User, pianoMinimo: SubscriptionTier): boolean {
  const ordine: Record<SubscriptionTier, number> = {
    gratuito: 0,
    professionista: 1,
    impresa: 2,
  };
  return ordine[user.piano] >= ordine[pianoMinimo];
}

/** Verifica se l'utente ha un modulo attivo */
export function haModulo(user: User, moduloId: string): boolean {
  return user.moduliAttivi.includes(moduloId);
}

/** Verifica un permesso specifico su una risorsa */
export function haPermesso(
  user: User,
  permesso: Permission,
  permessiUtente: Permission[]
): boolean {
  return permessiUtente.some(
    (p) => p.risorsa === permesso.risorsa && p.azione === permesso.azione
  );
}

/** Guard composta: ruolo + piano + modulo */
export function autorizzato(
  user: User,
  requisiti: {
    ruolo?: UserRole;
    piano?: SubscriptionTier;
    modulo?: string;
  }
): { ok: true } | { ok: false; motivo: string } {
  if (requisiti.ruolo && !haRuolo(user, requisiti.ruolo)) {
    return { ok: false, motivo: `Ruolo richiesto: ${requisiti.ruolo}` };
  }
  if (requisiti.piano && !haPiano(user, requisiti.piano)) {
    return { ok: false, motivo: `Piano minimo: ${requisiti.piano}` };
  }
  if (requisiti.modulo && !haModulo(user, requisiti.modulo)) {
    return { ok: false, motivo: `Modulo non attivo: ${requisiti.modulo}` };
  }
  return { ok: true };
}
