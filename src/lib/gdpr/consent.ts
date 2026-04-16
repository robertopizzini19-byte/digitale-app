/**
 * digITAle — Consent Manager
 * Gestione centralizzata dei consensi GDPR.
 * Ogni azione che tocca dati personali verifica il consenso qui.
 */

import type { ConsensoGdpr, TipoConsenso, CookieBannerConfig } from "./types";

/** Consensi obbligatori per la registrazione */
const CONSENSI_OBBLIGATORI: TipoConsenso[] = [
  "privacy_policy",
  "termini_servizio",
];

/** Versioni correnti delle policy */
const VERSIONI_POLICY: Record<string, string> = {
  privacy_policy: "1.0.0",
  termini_servizio: "1.0.0",
  cookie_policy: "1.0.0",
};

export class ConsentManager {
  private consensi: ConsensoGdpr[] = [];

  constructor(consensiIniziali?: ConsensoGdpr[]) {
    if (consensiIniziali) {
      this.consensi = consensiIniziali;
    }
  }

  /** Verifica se un consenso specifico è attivo */
  haConsenso(tipo: TipoConsenso): boolean {
    const consenso = this.consensi
      .filter((c) => c.tipo === tipo && c.accettato && !c.dataRevoca)
      .sort((a, b) => b.dataAccettazione.localeCompare(a.dataAccettazione))[0];

    if (!consenso) return false;

    // Verifica che sia la versione corrente della policy
    const versioneCorrente = VERSIONI_POLICY[tipo];
    if (versioneCorrente && consenso.versione !== versioneCorrente) {
      return false; // Serve ri-consenso per nuova versione
    }

    return true;
  }

  /** Verifica che tutti i consensi obbligatori siano presenti */
  haConsensiObbligatori(): boolean {
    return CONSENSI_OBBLIGATORI.every((tipo) => this.haConsenso(tipo));
  }

  /** Consensi mancanti o scaduti */
  consensiMancanti(): TipoConsenso[] {
    return CONSENSI_OBBLIGATORI.filter((tipo) => !this.haConsenso(tipo));
  }

  /** Registra un nuovo consenso */
  registra(
    userId: string,
    tipo: TipoConsenso,
    accettato: boolean,
    meta: { ip: string; userAgent: string; metodo: ConsensoGdpr["metodo"] }
  ): ConsensoGdpr {
    const consenso: ConsensoGdpr = {
      id: crypto.randomUUID(),
      userId,
      tipo,
      accettato,
      dataAccettazione: new Date().toISOString(),
      versione: VERSIONI_POLICY[tipo] ?? "1.0.0",
      ip: meta.ip,
      userAgent: meta.userAgent,
      metodo: meta.metodo,
    };
    this.consensi.push(consenso);
    return consenso;
  }

  /** Revoca un consenso (art. 7 par. 3 — revoca facile quanto il consenso) */
  revoca(userId: string, tipo: TipoConsenso): boolean {
    if (CONSENSI_OBBLIGATORI.includes(tipo)) {
      // La revoca di consensi obbligatori disabilita l'account
      // ma non può essere impedita
    }

    const consenso = this.consensi.find(
      (c) => c.userId === userId && c.tipo === tipo && c.accettato && !c.dataRevoca
    );

    if (!consenso) return false;

    consenso.dataRevoca = new Date().toISOString();
    consenso.accettato = false;
    return true;
  }

  /** Esporta tutti i consensi per un utente (art. 15) */
  esportaPerUtente(userId: string): ConsensoGdpr[] {
    return this.consensi.filter((c) => c.userId === userId);
  }

  /** Configurazione cookie banner */
  static cookieBanner(): CookieBannerConfig {
    return {
      mostra: true,
      testo: "digITAle utilizza cookie tecnici necessari al funzionamento e, con il tuo consenso, cookie di analisi per migliorare il servizio.",
      linkPrivacy: "/privacy",
      linkCookie: "/cookie-policy",
      categorie: [
        {
          id: "tecnici",
          nome: "Cookie Tecnici",
          descrizione: "Necessari per il funzionamento del sito. Non richiedono consenso.",
          obbligatorio: true,
          attivo: true,
        },
        {
          id: "analytics",
          nome: "Cookie Analitici",
          descrizione: "Ci aiutano a capire come usi digITAle per migliorare il servizio.",
          obbligatorio: false,
          attivo: false,
        },
        {
          id: "marketing",
          nome: "Cookie di Marketing",
          descrizione: "Utilizzati per mostrarti contenuti rilevanti.",
          obbligatorio: false,
          attivo: false,
        },
      ],
    };
  }
}
