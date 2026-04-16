/**
 * DigiITAle — Costanti di Sistema
 * Tutte le costanti business dell'ecosistema.
 * Derivate dai documenti fondanti (Visione v1, Operativo v1, Proposta AVS v2).
 */

/* ─── Piani Tariffari (5 livelli da Operativo v1) ─── */

export const PIANI = {
  gratuito: {
    id: "gratuito",
    nome: "Gratuito",
    prezzo: 0,
    periodo: "per sempre",
    descrizione: "Per iniziare senza pensieri",
    limiti: {
      documentiMese: 5,
      progetti: 1,
      clienti: 10,
      fattureMese: 5,
      spazioMb: 100,
      utenti: 1,
      apiAccesso: false,
    },
    funzionalita: [
      "Identità digitale verificata",
      "Gestione documenti personali (5/mese)",
      "1 progetto attivo",
      "Assistente vocale base",
      "Promemoria scadenze",
    ],
  },
  starter: {
    id: "starter",
    nome: "Starter",
    prezzo: 700, // centesimi: €7
    periodo: "al mese",
    descrizione: "Per freelance junior e studenti avanzati",
    limiti: {
      documentiMese: -1, // illimitati
      progetti: 5,
      clienti: 50,
      fattureMese: -1,
      spazioMb: 1000,
      utenti: 1,
      apiAccesso: false,
    },
    funzionalita: [
      "Tutto del piano Gratuito",
      "Documenti illimitati",
      "Fatturazione elettronica base",
      "Firma digitale",
      "5 progetti attivi",
    ],
  },
  professionista: {
    id: "professionista",
    nome: "Professionista",
    prezzo: 1900, // centesimi: €19
    periodo: "al mese",
    descrizione: "Per chi lavora in proprio",
    limiti: {
      documentiMese: -1,
      progetti: -1,
      clienti: -1,
      fattureMese: -1,
      spazioMb: 5000,
      utenti: 1,
      apiAccesso: true,
    },
    funzionalita: [
      "Tutto del piano Starter",
      "Contabilità automatica",
      "CRM base clienti",
      "Accesso API",
      "Assistenza prioritaria 24/7",
      "Progetti illimitati",
    ],
  },
  impresa: {
    id: "impresa",
    nome: "Impresa",
    prezzo: 4900, // centesimi: €49
    periodo: "al mese",
    descrizione: "Per team e PMI",
    limiti: {
      documentiMese: -1,
      progetti: -1,
      clienti: -1,
      fattureMese: -1,
      spazioMb: 50000,
      utenti: 25,
      apiAccesso: true,
    },
    funzionalita: [
      "Tutto del piano Professionista",
      "Multi-utente fino a 25 persone",
      "Integrazioni PA, INPS, INAIL",
      "White label",
      "Report e analisi avanzate",
      "Account manager dedicato",
      "SLA garantito 99.9%",
    ],
  },
  enterprise: {
    id: "enterprise",
    nome: "Enterprise",
    prezzo: -1, // custom
    periodo: "personalizzato",
    descrizione: "Per grandi aziende e PA",
    limiti: {
      documentiMese: -1,
      progetti: -1,
      clienti: -1,
      fattureMese: -1,
      spazioMb: -1,
      utenti: -1,
      apiAccesso: true,
    },
    funzionalita: [
      "Tutto del piano Impresa",
      "SLA dedicato",
      "On-premise disponibile",
      "Compliance dedicata",
      "Supporto telefonico diretto",
      "Utenti illimitati",
    ],
  },
} as const;

/* ─── 26 Target — 5 Macro-Gruppi (da Visione v1) ─── */

export const MACRO_GRUPPI = {
  persone: {
    id: "persone",
    nome: "Persone",
    target: [
      { id: "cittadino", nome: "Cittadino Comune", punteggio: 19 },
      { id: "studente", nome: "Studenti", punteggio: 17 },
      { id: "famiglia", nome: "Famiglie", punteggio: 19 },
      { id: "docente", nome: "Docenti e Formatori", punteggio: 16 },
      { id: "creativo", nome: "Creativi e Artisti", punteggio: 17 },
      { id: "sanitario", nome: "Professionisti Sanitari", punteggio: 20 },
      { id: "ordinistico", nome: "Professionisti Ordinistici", punteggio: 20 },
    ],
  },
  organizzazioni: {
    id: "organizzazioni",
    nome: "Organizzazioni",
    target: [
      { id: "freelance", nome: "Freelance e Professionisti", punteggio: 23 },
      { id: "pmi", nome: "Piccole e Medie Imprese", punteggio: 20 },
      { id: "enterprise", nome: "Grandi Aziende", punteggio: 18 },
      { id: "pa", nome: "Pubblica Amministrazione", punteggio: 21 },
      { id: "noprofit", nome: "No-Profit e Associazioni", punteggio: 16 },
      { id: "artigiano", nome: "Artigiani e Commercianti", punteggio: 21 },
      { id: "turismo", nome: "Turismo e Hospitality", punteggio: 21 },
      { id: "agroalimentare", nome: "Agroalimentare", punteggio: 16 },
      { id: "logistica", nome: "Logistica e Trasporti", punteggio: 17 },
      { id: "immobiliare", nome: "Agenti Immobiliari", punteggio: 16 },
    ],
  },
  italiani_mondo: {
    id: "italiani_mondo",
    nome: "Italiani nel Mondo",
    target: [
      { id: "estero", nome: "Italiani all'Estero", punteggio: 20 },
      { id: "imprenditore_estero", nome: "Imprenditori ITA all'Estero", punteggio: 17 },
    ],
  },
  stranieri_italia: {
    id: "stranieri_italia",
    nome: "Stranieri in Italia",
    target: [
      { id: "immigrato", nome: "Immigrati e Lavoratori", punteggio: 19 },
      { id: "expat", nome: "Expat e Digital Nomad", punteggio: 17 },
      { id: "turista", nome: "Turisti", punteggio: 17 },
    ],
  },
  ricerca: {
    id: "ricerca",
    nome: "Ricerca e Innovazione",
    target: [
      { id: "universita", nome: "Università e Ricerca", punteggio: 16 },
      { id: "startup", nome: "Startup e Scaleup", punteggio: 17 },
      { id: "incubatore", nome: "Incubatori e Acceleratori", punteggio: 14 },
      { id: "investitore", nome: "Investitori e VC", punteggio: 13 },
    ],
  },
} as const;

/* ─── 4 Mattoni Core (da Visione v1) ─── */

export const MATTONI_CORE = [
  {
    id: "identita",
    nome: "Identità Unica",
    descrizione: "Ogni utente ha un profilo unico e verificato (SPID/CIE)",
  },
  {
    id: "dati",
    nome: "Dati Portabili",
    descrizione: "I dati appartengono all'utente, si muovono liberamente tra moduli",
  },
  {
    id: "api",
    nome: "API Aperte",
    descrizione: "Ogni modulo comunica in modo standard, internamente e verso l'esterno",
  },
  {
    id: "motore_economico",
    nome: "Motore Economico",
    descrizione: "Pagamenti, abbonamenti, fatturazione integrati dal giorno 1",
  },
] as const;

/* ─── 3 Livelli Ecosistema ─── */

export const LIVELLI_ECOSISTEMA = [
  {
    livello: 1,
    nome: "Core (Fondamenta)",
    descrizione: "Identità, fiducia, dati, pagamenti — infrastruttura invisibile",
  },
  {
    livello: 2,
    nome: "Prodotti e Soluzioni",
    descrizione: "Un modulo per target, un problema risolto perfettamente",
  },
  {
    livello: 3,
    nome: "Community e Espansione",
    descrizione: "Gli utenti portano utenti, crescita a macchia d'olio",
  },
] as const;

/* ─── Integrazioni Italiane ─── */

export const INTEGRAZIONI_IT = {
  /** Sistema Pubblico di Identità Digitale */
  SPID: { nome: "SPID", tipo: "identita", ente: "AgID" },
  /** Carta d'Identità Elettronica */
  CIE: { nome: "CIE", tipo: "identita", ente: "Ministero Interno" },
  /** Sistema di Interscambio fatture */
  SDI: { nome: "SDI", tipo: "fatturazione", ente: "Agenzia delle Entrate" },
  /** Posta Elettronica Certificata */
  PEC: { nome: "PEC", tipo: "comunicazione", ente: "AgID" },
  /** Firma Digitale */
  FIRMA_DIGITALE: { nome: "Firma Digitale", tipo: "documenti", ente: "AgID" },
  /** Istituto Nazionale Previdenza Sociale */
  INPS: { nome: "INPS", tipo: "previdenza", ente: "INPS" },
  /** Istituto Nazionale Assicurazione Infortuni Lavoro */
  INAIL: { nome: "INAIL", tipo: "assicurazione", ente: "INAIL" },
  /** Cassetto Fiscale */
  CASSETTO_FISCALE: { nome: "Cassetto Fiscale", tipo: "fiscale", ente: "Agenzia delle Entrate" },
  /** F24 */
  F24: { nome: "F24", tipo: "pagamenti_fiscali", ente: "Agenzia delle Entrate" },
  /** Satispay (pagamento italiano) */
  SATISPAY: { nome: "Satispay", tipo: "pagamenti", ente: "Satispay S.p.A." },
} as const;

/* ─── IVA Percentuali ─── */

export const ALIQUOTE_IVA = [
  { valore: 22, descrizione: "Ordinaria" },
  { valore: 10, descrizione: "Ridotta" },
  { valore: 5, descrizione: "Super-ridotta" },
  { valore: 4, descrizione: "Minima" },
  { valore: 0, descrizione: "Esente (art. 10)" },
] as const;

/* ─── Regimi Fiscali ─── */

export const REGIMI_FISCALI = [
  { codice: "RF01", nome: "Ordinario" },
  { codice: "RF02", nome: "Forfettario (L. 190/2014)" },
  { codice: "RF04", nome: "Agricoltura" },
  { codice: "RF18", nome: "Altro" },
  { codice: "RF19", nome: "Regime dei minimi" },
] as const;
