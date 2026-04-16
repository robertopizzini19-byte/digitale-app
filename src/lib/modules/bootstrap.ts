/**
 * digITAle — Bootstrap Moduli
 * Registra tutti i moduli nel registry all'avvio dell'app.
 * Aggiungere qui ogni nuovo modulo creato.
 *
 * Ordine di priorità (da Visione v1):
 * 1. Freelance (23/25) — ATTIVO
 * 2. PMI (20/25) — in sviluppo
 * 3. Cittadino (19/25) — in sviluppo
 * 4. PA (21/25) — futuro
 * 5. Artigiani (21/25) — futuro
 * 6. Turismo (21/25) — futuro
 * 7. Sanitari (20/25) — futuro
 * 8. Italiani estero (20/25) — futuro
 */

import { registry } from "./registry";
import { freelanceModule } from "../../modules/freelance";
import { pmiModule } from "../../modules/pmi";
import { cittadinoModule } from "../../modules/cittadino";

let inizializzato = false;

export function bootstrapModuli(): void {
  if (inizializzato) return;

  // Registra moduli in ordine di priorità
  registry.registra(freelanceModule);
  registry.registra(pmiModule);
  registry.registra(cittadinoModule);

  // Log moduli attivi
  const attivi = registry.attivi();
  console.log(
    `[digITAle] ${attivi.length} modul${attivi.length === 1 ? "o" : "i"} attiv${attivi.length === 1 ? "o" : "i"}:`,
    attivi.map((m) => m.definizione.nome).join(", ")
  );

  inizializzato = true;
}

/** Listener globale per audit log di tutti gli eventi modulo */
export function setupAuditListener(): () => void {
  return registry.on("*", (evento) => {
    console.log(`[Audit] ${evento.tipo} da ${evento.sorgente}:`, evento.dati);
    // In produzione: scrivere su tabella audit_log
  });
}
