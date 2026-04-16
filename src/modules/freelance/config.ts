/**
 * DigiITAle — Modulo Freelance: Configurazione
 * Registrazione del modulo nel sistema.
 */

import type { DigiTaleModule } from "../../lib/modules/types";

export const freelanceModule: DigiTaleModule = {
  definizione: {
    id: "freelance",
    nome: "Freelance e Professionisti",
    descrizione: "Fatturazione, clienti, scadenze e contabilità per chi lavora in proprio",
    versione: "1.0.0",
    icona: "Briefcase",
    ruoliAbilitati: ["freelance"],
    pianoMinimo: "gratuito",
    stato: "attivo",
    rotte: [
      { path: "/dashboard", componente: "DashboardFreelance", protetta: true },
      { path: "/fatture", componente: "ListaFatture", protetta: true },
      { path: "/fatture/nuova", componente: "NuovaFattura", protetta: true, permessi: ["fatture:creare"] },
      { path: "/fatture/:id", componente: "DettaglioFattura", protetta: true },
      { path: "/clienti", componente: "ListaClienti", protetta: true },
      { path: "/clienti/nuovo", componente: "NuovoCliente", protetta: true, permessi: ["clienti:creare"] },
      { path: "/clienti/:id", componente: "DettaglioCliente", protetta: true },
      { path: "/scadenze", componente: "Scadenzario", protetta: true },
      { path: "/contabilita", componente: "Contabilita", protetta: true, permessi: ["contabilita:leggere"] },
      { path: "/documenti", componente: "Documenti", protetta: true },
      { path: "/impostazioni", componente: "ImpostazioniFreelance", protetta: true },
    ],
    navigazione: [
      { label: "Panoramica", href: "/dashboard", icona: "Home" },
      { label: "Fatture", href: "/fatture", icona: "FileText" },
      { label: "Clienti", href: "/clienti", icona: "Users" },
      { label: "Scadenze", href: "/scadenze", icona: "Calendar" },
      { label: "Contabilità", href: "/contabilita", icona: "BarChart3" },
      { label: "Documenti", href: "/documenti", icona: "Folder" },
    ],
    permessi: [
      "fatture:leggere",
      "fatture:creare",
      "fatture:modificare",
      "fatture:eliminare",
      "fatture:esportare",
      "clienti:leggere",
      "clienti:creare",
      "clienti:modificare",
      "clienti:eliminare",
      "contabilita:leggere",
      "contabilita:esportare",
      "documenti:leggere",
      "documenti:creare",
      "documenti:eliminare",
      "scadenze:leggere",
      "scadenze:creare",
      "scadenze:modificare",
    ],
    servizi: ["auth", "document", "payment", "notification", "email", "voice"],
  },
  hooks: {
    onAttiva: async () => {
      // Crea profilo freelance, genera scadenze anno corrente
    },
    onDisattiva: async () => {
      // Soft delete dati modulo
    },
    onLogin: async () => {
      // Controlla scadenze prossime, genera notifiche
    },
    onGdprExport: async () => {
      // Esporta: fatture, clienti, scadenze, documenti
      return {
        fatture: [],
        clienti: [],
        scadenze: [],
        documenti: [],
      };
    },
    onGdprDelete: async () => {
      // Elimina tutti i dati del modulo per l'utente
    },
  },
};
