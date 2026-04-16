/**
 * digITAle — Modulo PMI (Piccole e Medie Imprese)
 * Score: 20/25. Secondo modulo dopo Freelance.
 * Estende il modulo Freelance con: multi-utente, team, ruoli, report avanzati.
 * Piano minimo: Impresa (€49/mese)
 */

import type { DigiTaleModule } from "../../lib/modules/types";

export const pmiModule: DigiTaleModule = {
  definizione: {
    id: "pmi",
    nome: "Piccole e Medie Imprese",
    descrizione: "Gestione completa dell'impresa: team, contabilità avanzata, integrazioni PA",
    versione: "0.1.0",
    icona: "Building2",
    ruoliAbilitati: ["pmi"],
    pianoMinimo: "impresa",
    stato: "sviluppo",
    rotte: [
      { path: "/dashboard", componente: "DashboardPmi", protetta: true },
      { path: "/team", componente: "GestioneTeam", protetta: true, permessi: ["team:gestire"] },
      { path: "/fatture", componente: "FatturePmi", protetta: true },
      { path: "/contabilita", componente: "ContabilitaAvanzata", protetta: true },
      { path: "/report", componente: "ReportPmi", protetta: true },
      { path: "/integrazioni", componente: "IntegrazioniPa", protetta: true },
    ],
    navigazione: [
      { label: "Panoramica", href: "/dashboard", icona: "Home" },
      { label: "Team", href: "/team", icona: "Users" },
      { label: "Fatture", href: "/fatture", icona: "FileText" },
      { label: "Contabilità", href: "/contabilita", icona: "BarChart3" },
      { label: "Report", href: "/report", icona: "PieChart" },
      { label: "Integrazioni PA", href: "/integrazioni", icona: "Landmark" },
    ],
    permessi: [
      "team:gestire",
      "team:invitare",
      "fatture:approvare",
      "contabilita:avanzata",
      "report:generare",
      "integrazioni:configurare",
    ],
    servizi: ["auth", "document", "payment", "notification", "email"],
  },
  hooks: {
    onGdprExport: async () => ({ team: [], fatture: [], contabilita: [] }),
    onGdprDelete: async () => {},
  },
};
