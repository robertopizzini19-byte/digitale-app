/**
 * DigiITAle — Traduzioni Italiano
 * Tutte le stringhe dell'interfaccia centralizzate.
 * L'app è Italian-first: l'italiano non è una traduzione, è la lingua nativa.
 */

export const it = {
  /* ─── Comune ─── */
  comune: {
    salva: "Salva",
    annulla: "Annulla",
    elimina: "Elimina",
    modifica: "Modifica",
    cerca: "Cerca",
    caricamento: "Caricamento...",
    errore: "Si è verificato un errore",
    successo: "Operazione completata",
    conferma: "Conferma",
    chiudi: "Chiudi",
    indietro: "Indietro",
    avanti: "Avanti",
    si: "Sì",
    no: "No",
    tutti: "Tutti",
    nessuno: "Nessuno",
    altro: "Altro",
    vediTutti: "Vedi tutti",
    aggiungi: "Aggiungi",
    scarica: "Scarica",
    invia: "Invia",
    copia: "Copia",
    copiato: "Copiato!",
  },

  /* ─── Auth ─── */
  auth: {
    accedi: "Accedi",
    registrati: "Registrati",
    esci: "Esci",
    email: "Email",
    password: "Password",
    passwordDimenticata: "Password dimenticata?",
    ricordami: "Ricordami su questo dispositivo",
    oppure: "oppure",
    accediConSpid: "Accedi con SPID",
    accediConCie: "Accedi con CIE",
    nonHaiAccount: "Non hai un account?",
    haiGiaAccount: "Hai già un account?",
    registratiGratis: "Registrati gratis",
    verificaEmail: "Controlla la tua email per verificare l'account",
    resetInviato: "Link di reset inviato alla tua email",
  },

  /* ─── Dashboard ─── */
  dashboard: {
    buongiorno: "Buongiorno",
    buonPomeriggio: "Buon pomeriggio",
    buonaSera: "Buona sera",
    fatturato: "Fatturato Mese",
    inAttesa: "In Attesa",
    clientiAttivi: "Clienti Attivi",
    prossimaScadenza: "Prossima Scadenza",
    andamento: "Andamento Fatturato",
    ultimeFatture: "Fatture Recenti",
    prossimeScadenze: "Prossime Scadenze",
    assistenteVocale: "Assistente Vocale",
    parlaConDigitale: "Parla con DigiITAle",
    stoAscoltando: "Sto ascoltando...",
    azioniRapide: "Azioni Rapide",
  },

  /* ─── Fatture ─── */
  fatture: {
    fattura: "Fattura",
    fatture: "Fatture",
    nuovaFattura: "Nuova Fattura",
    numero: "Numero",
    data: "Data",
    scadenza: "Scadenza",
    cliente: "Cliente",
    importo: "Importo",
    stato: "Stato",
    tipo: "Tipo",
    bozza: "Bozza",
    emessa: "Emessa",
    inviata: "Inviata SDI",
    accettata: "Accettata",
    rifiutata: "Rifiutata",
    pagata: "Pagata",
    scaduta: "Scaduta",
    annullata: "Annullata",
    imponibile: "Imponibile",
    iva: "IVA",
    totale: "Totale",
    ritenutaAcconto: "Ritenuta d'Acconto",
    contributoIntegrativo: "Contributo Integrativo",
    nettoAPagare: "Netto a Pagare",
    bollo: "Bollo Virtuale",
    inviaViaPec: "Invia via PEC",
    inviaAlSdi: "Invia al SDI",
    scaricaPdf: "Scarica PDF",
    scaricaXml: "Scarica XML",
  },

  /* ─── Clienti ─── */
  clienti: {
    cliente: "Cliente",
    clienti: "Clienti",
    nuovoCliente: "Nuovo Cliente",
    personaFisica: "Persona Fisica",
    personaGiuridica: "Persona Giuridica",
    ragioneSociale: "Ragione Sociale",
    codiceFiscale: "Codice Fiscale",
    partitaIva: "Partita IVA",
    codiceSdi: "Codice SDI",
    pec: "PEC",
  },

  /* ─── Scadenze ─── */
  scadenze: {
    scadenza: "Scadenza",
    scadenze: "Scadenze",
    nuovaScadenza: "Nuova Scadenza",
    urgente: "Urgente",
    alta: "Alta",
    normale: "Normale",
    bassa: "Bassa",
    completata: "Completata",
    attiva: "Attiva",
    iva: "IVA",
    inps: "INPS",
    irpef: "IRPEF",
    f24: "F24",
  },

  /* ─── GDPR ─── */
  gdpr: {
    privacyPolicy: "Informativa Privacy",
    terminiServizio: "Termini di Servizio",
    cookiePolicy: "Cookie Policy",
    consensoMarketing: "Consenso comunicazioni marketing",
    consensoProfilazione: "Consenso profilazione",
    consensoVocale: "Consenso trattamento dati vocali",
    esportaDati: "Esporta i tuoi dati",
    eliminaAccount: "Elimina il tuo account",
    revocoConsenso: "Revoca consenso",
    iTuoiDiritti: "I tuoi diritti (GDPR)",
  },

  /* ─── Errori ─── */
  errori: {
    campoObbligatorio: "Campo obbligatorio",
    emailNonValida: "Indirizzo email non valido",
    passwordDebole: "La password deve contenere almeno 8 caratteri, una maiuscola e un numero",
    codiceFiscaleNonValido: "Codice fiscale non valido",
    partitaIvaNonValida: "Partita IVA non valida",
    ibanNonValido: "IBAN non valido",
    pecNonValida: "Indirizzo PEC non valido",
    capNonValido: "CAP non valido (5 cifre)",
    fileTroppoGrande: "File troppo grande",
    formatoNonSupportato: "Formato file non supportato",
    sessioneScaduta: "La sessione è scaduta. Accedi di nuovo.",
    connessionePersa: "Connessione persa. Verifica la tua rete.",
  },
} as const;

/** Saluto basato sull'ora */
export function salutoOrario(nome: string): string {
  const ora = new Date().getHours();
  if (ora < 13) return `${it.dashboard.buongiorno}, ${nome}`;
  if (ora < 18) return `${it.dashboard.buonPomeriggio}, ${nome}`;
  return `${it.dashboard.buonaSera}, ${nome}`;
}
