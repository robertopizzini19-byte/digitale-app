/**
 * DigiITAle — Modulo Cittadino
 * Score: 19/25. Terzo modulo.
 * Documenti personali, bollette, scuola, sanità — tutto in un posto sicuro.
 * Piano minimo: Gratuito (€0)
 */

import type { DigiTaleModule } from "../../lib/modules/types";

export const cittadinoModule: DigiTaleModule = {
  definizione: {
    id: "cittadino",
    nome: "Cittadino e Famiglia",
    descrizione: "Gestisci documenti, bollette, scadenze familiari in un unico posto sicuro",
    versione: "0.1.0",
    icona: "Heart",
    ruoliAbilitati: ["cittadino"],
    pianoMinimo: "gratuito",
    stato: "sviluppo",
    rotte: [
      { path: "/dashboard", componente: "DashboardCittadino", protetta: true },
      { path: "/documenti", componente: "DocumentiPersonali", protetta: true },
      { path: "/scadenze", componente: "ScadenzeFamiglia", protetta: true },
      { path: "/servizi-pa", componente: "ServiziPa", protetta: true },
    ],
    navigazione: [
      { label: "La Mia Casa", href: "/dashboard", icona: "Home" },
      { label: "Documenti", href: "/documenti", icona: "Folder" },
      { label: "Scadenze", href: "/scadenze", icona: "Calendar" },
      { label: "Servizi PA", href: "/servizi-pa", icona: "Landmark" },
    ],
    permessi: [
      "documenti:leggere",
      "documenti:creare",
      "scadenze:leggere",
      "scadenze:creare",
      "servizi_pa:accedere",
    ],
    servizi: ["auth", "document", "notification"],
  },
  hooks: {
    onGdprExport: async () => ({ documenti: [], scadenze: [] }),
    onGdprDelete: async () => {},
  },
};
