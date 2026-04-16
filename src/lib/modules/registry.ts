/**
 * DigiITAle — Module Registry
 * Registro centrale di tutti i moduli. Punto unico di accesso.
 *
 * Uso:
 *   import { registry } from "@/lib/modules/registry";
 *   registry.registra(freelanceModule);
 *   const modulo = registry.get("freelance");
 *   const attivi = registry.moduliPerUtente(user);
 */

import type { DigiTaleModule, ModuleDefinition, ModuleEvent } from "./types";
import type { User } from "../core/types";

type EventHandler = (evento: ModuleEvent) => void | Promise<void>;

class ModuleRegistry {
  private moduli = new Map<string, DigiTaleModule>();
  private listeners = new Map<string, Set<EventHandler>>();

  /** Registra un modulo nel sistema */
  registra(modulo: DigiTaleModule): void {
    const id = modulo.definizione.id;
    if (this.moduli.has(id)) {
      throw new Error(`Modulo "${id}" già registrato`);
    }
    this.moduli.set(id, modulo);
  }

  /** Ottieni un modulo per ID */
  get(id: string): DigiTaleModule | undefined {
    return this.moduli.get(id);
  }

  /** Tutti i moduli registrati */
  tutti(): DigiTaleModule[] {
    return Array.from(this.moduli.values());
  }

  /** Moduli attivi */
  attivi(): DigiTaleModule[] {
    return this.tutti().filter((m) => m.definizione.stato === "attivo");
  }

  /** Moduli disponibili per un utente specifico */
  moduliPerUtente(user: User): DigiTaleModule[] {
    const pianoOrdine = { gratuito: 0, professionista: 1, impresa: 2 } as const;
    const pianoUtente = pianoOrdine[user.piano];

    return this.attivi().filter((m) => {
      const def = m.definizione;
      const pianoRichiesto = pianoOrdine[def.pianoMinimo];
      return (
        def.ruoliAbilitati.includes(user.ruolo) &&
        pianoUtente >= pianoRichiesto
      );
    });
  }

  /** Moduli effettivamente attivati dall'utente */
  moduliAttiviUtente(user: User): DigiTaleModule[] {
    return this.moduliPerUtente(user).filter((m) =>
      user.moduliAttivi.includes(m.definizione.id)
    );
  }

  /** Navigazione aggregata per l'utente */
  navigazioneUtente(user: User): ModuleDefinition["navigazione"][] {
    return this.moduliAttiviUtente(user).map((m) => m.definizione.navigazione);
  }

  /* ─── Sistema Eventi ─── */

  /** Sottoscrivi a un tipo di evento */
  on(tipoEvento: string, handler: EventHandler): () => void {
    if (!this.listeners.has(tipoEvento)) {
      this.listeners.set(tipoEvento, new Set());
    }
    this.listeners.get(tipoEvento)!.add(handler);

    // Ritorna funzione di unsubscribe
    return () => {
      this.listeners.get(tipoEvento)?.delete(handler);
    };
  }

  /** Emetti un evento (i moduli comunicano attraverso il core) */
  async emetti(evento: ModuleEvent): Promise<void> {
    const handlers = this.listeners.get(evento.tipo);
    if (handlers) {
      await Promise.all(
        Array.from(handlers).map((handler) => handler(evento))
      );
    }

    // Emetti anche su wildcard per logging/audit
    const wildcardHandlers = this.listeners.get("*");
    if (wildcardHandlers) {
      await Promise.all(
        Array.from(wildcardHandlers).map((handler) => handler(evento))
      );
    }
  }

  /* ─── GDPR ─── */

  /** Esporta tutti i dati utente da tutti i moduli (art. 20 GDPR) */
  async gdprExportCompleto(): Promise<Record<string, unknown>> {
    const dati: Record<string, unknown> = {};
    for (const [id, modulo] of this.moduli) {
      if (modulo.hooks.onGdprExport) {
        dati[id] = await modulo.hooks.onGdprExport();
      }
    }
    return dati;
  }

  /** Cancella tutti i dati utente da tutti i moduli (art. 17 GDPR) */
  async gdprCancellaCompleto(): Promise<void> {
    for (const [, modulo] of this.moduli) {
      if (modulo.hooks.onGdprDelete) {
        await modulo.hooks.onGdprDelete();
      }
    }
  }
}

/** Istanza singleton del registry */
export const registry = new ModuleRegistry();
