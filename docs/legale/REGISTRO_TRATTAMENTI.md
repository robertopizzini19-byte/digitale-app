# Registro dei Trattamenti — digITAle

## Art. 30 GDPR — Registro del Titolare

> **Versione**: 1.0 — 2026-04-16
> **Status**: registro vivo, aggiornato ad ogni nuovo trattamento o modifica sostanziale
> **Formato**: versionato in git, export PDF su richiesta Garante
> **Owner**: DPO + Titolare

---

## 0. Identificazione del Titolare

- **Ragione sociale**: `[DA COMPILARE]`
- **P. IVA / CF**: `[DA COMPILARE]`
- **Sede legale**: `[DA COMPILARE]`
- **Rappresentante legale**: `[DA COMPILARE]`
- **DPO**: `[DA COMPILARE]` — dpo@digitale-italia.it
- **Referente privacy**: privacy@digitale-italia.it
- **PEC**: `[DA COMPILARE]`

---

## Indice dei trattamenti

| ID   | Trattamento                                             | Base giuridica                            | Rischio                      |
| ---- | ------------------------------------------------------- | ----------------------------------------- | ---------------------------- |
| T-01 | Registrazione e autenticazione utenti                   | Contratto + obbligo legale                | Medio                        |
| T-02 | Erogazione servizio (dashboard, fatturazione, scadenze) | Contratto                                 | Medio                        |
| T-03 | Pagamenti e fatturazione B2C/B2B                        | Contratto + obbligo legale                | Alto                         |
| T-04 | Comunicazioni transazionali                             | Contratto + legittimo interesse           | Basso                        |
| T-05 | Newsletter e marketing diretto                          | Consenso                                  | Basso                        |
| T-06 | Analytics e miglioramento prodotto                      | Consenso / legittimo interesse bilanciato | Basso                        |
| T-07 | Assistenza clienti e ticket                             | Contratto                                 | Medio                        |
| T-08 | Sicurezza e prevenzione frodi                           | Legittimo interesse + obbligo legale      | Medio                        |
| T-09 | Audit log e compliance                                  | Obbligo legale                            | Medio                        |
| T-10 | AI vocale (se attivato)                                 | Consenso esplicito                        | **Alto — DPIA obbligatoria** |
| T-11 | Trasmissione Fattura Elettronica SDI                    | Obbligo legale                            | Medio                        |
| T-12 | Adempimenti fiscali del Titolare                        | Obbligo legale                            | Basso                        |

---

## T-01. Registrazione e autenticazione

| Campo                      | Dettaglio                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Finalità**               | Creare e gestire l'account, autenticare l'accesso, prevenire accessi non autorizzati                                     |
| **Base giuridica**         | Art. 6.1.b (esecuzione contratto) + art. 6.1.c (obbligo legale antifrode)                                                |
| **Categorie interessati**  | Utenti registrati (maggiorenni)                                                                                          |
| **Categorie dati**         | Email, nome, cognome, hash password bcrypt cost 12, token 2FA, telefono (opzionale), IP e user-agent di login, timestamp |
| **Destinatari**            | Supabase (responsabile trattamento), hosting EU                                                                          |
| **Trasferimenti extra-UE** | Nessuno                                                                                                                  |
| **Retention**              | Durata account + 24 mesi post-cancellazione (prevenzione frodi e contenzioso)                                            |
| **Misure sicurezza**       | TLS 1.3, bcrypt cost 12, 2FA TOTP/WebAuthn, rate limit login, pepperamento, log accessi                                  |
| **Rischio**                | Medio (credential stuffing, account takeover)                                                                            |

---

## T-02. Erogazione servizio

| Campo                      | Dettaglio                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Finalità**               | Rendere disponibili le funzioni del servizio (dashboard, scadenzario, anagrafica clienti)             |
| **Base giuridica**         | Art. 6.1.b (esecuzione contratto)                                                                     |
| **Categorie interessati**  | Utenti registrati, loro clienti (dati di contatto B2B)                                                |
| **Categorie dati**         | Anagrafica professionale, P.IVA, CF, indirizzo operativo, scadenze fiscali configurate, preferenze UI |
| **Destinatari**            | Supabase (DB), Netlify (CDN)                                                                          |
| **Trasferimenti extra-UE** | Nessuno (region EU forzata)                                                                           |
| **Retention**              | Durata account + 10 anni (adempimenti fiscali art. 2220 c.c.)                                         |
| **Misure sicurezza**       | RLS per isolamento tenant, audit log, backup cifrato, encryption at field per CF/P.IVA/IBAN           |
| **Rischio**                | Medio                                                                                                 |

---

## T-03. Pagamenti e fatturazione

| Campo                      | Dettaglio                                                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Finalità**               | Riscuotere il corrispettivo del servizio, emettere fattura al cliente, adempimenti fiscali                                                                           |
| **Base giuridica**         | Art. 6.1.b (contratto) + art. 6.1.c (obbligo fiscale)                                                                                                                |
| **Categorie interessati**  | Utenti paganti                                                                                                                                                       |
| **Categorie dati**         | Dati fatturazione (ragione sociale, P.IVA/CF, indirizzo, SDI/PEC), ID transazione Stripe, ultimi 4 cifre carta, IBAN SEPA (se applicabile), importi, data operazione |
| **Destinatari**            | Stripe Payments Europe (responsabile), commercialista del Titolare (autonomo titolare), SDI Agenzia Entrate                                                          |
| **Trasferimenti extra-UE** | Stripe può trasferire extra-UE con SCC 2021/914 + DPF per US                                                                                                         |
| **Retention**              | 10 anni (art. 2220 c.c. + DPR 600/1973)                                                                                                                              |
| **Misure sicurezza**       | PCI-DSS via Stripe Elements (digITAle non tocca PAN), webhook signed, idempotency, reconciliation                                                                    |
| **Rischio**                | Alto (dati fiscali e finanziari)                                                                                                                                     |
| **Note**                   | Nessun dato PCI conservato server-side in digITAle. Solo token Stripe riutilizzabili                                                                                 |

---

## T-04. Comunicazioni transazionali

| Campo                      | Dettaglio                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------ |
| **Finalità**               | Confermare operazioni (iscrizione, reset password, invio fattura, scadenze critiche) |
| **Base giuridica**         | Art. 6.1.b (contratto) + art. 6.1.f (legittimo interesse: sicurezza operazioni)      |
| **Categorie interessati**  | Utenti registrati                                                                    |
| **Categorie dati**         | Email, contenuto notifica, timestamp invio/consegna                                  |
| **Destinatari**            | Provider email transazionale EU (es. SendGrid EU, Mailgun EU, Resend EU)             |
| **Trasferimenti extra-UE** | Nessuno se EU provider; altrimenti SCC + DPF                                         |
| **Retention**              | 24 mesi log invio (prova di consegna)                                                |
| **Misure sicurezza**       | SPF, DKIM, DMARC reject, link tracking solo aggregato                                |
| **Rischio**                | Basso                                                                                |

---

## T-05. Newsletter e marketing diretto

| Campo                      | Dettaglio                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| **Finalità**               | Inviare aggiornamenti prodotto, novità fiscali, contenuti formativi a chi ha dato consenso |
| **Base giuridica**         | Art. 6.1.a (consenso)                                                                      |
| **Categorie interessati**  | Utenti che hanno acconsentito                                                              |
| **Categorie dati**         | Email, preferenze di contenuto, interazioni aggregate                                      |
| **Destinatari**            | Provider email marketing EU                                                                |
| **Trasferimenti extra-UE** | Nessuno (preferenza EU)                                                                    |
| **Retention**              | Fino a revoca + 30 giorni di grace per disiscrizione effettiva                             |
| **Misure sicurezza**       | Double opt-in, link unsubscribe in ogni email, gestione preferenze in dashboard            |
| **Rischio**                | Basso                                                                                      |

---

## T-06. Analytics e miglioramento prodotto

| Campo                      | Dettaglio                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Finalità**               | Capire uso del servizio in forma aggregata, prioritizzare roadmap                                                    |
| **Base giuridica**         | Art. 6.1.a (consenso, cookie analytics) O art. 6.1.f (legittimo interesse) se strumenti privacy-first tipo Plausible |
| **Categorie interessati**  | Visitatori e utenti                                                                                                  |
| **Categorie dati**         | Pagine visitate, device type, referrer, IP troncato (ultimo ottetto a 0), timestamp                                  |
| **Destinatari**            | Plausible Analytics (EU-hosted)                                                                                      |
| **Trasferimenti extra-UE** | Nessuno                                                                                                              |
| **Retention**              | Dati aggregati 24 mesi, dati individuali 0 giorni (Plausible cookieless)                                             |
| **Misure sicurezza**       | No fingerprinting, no cross-site tracking, no cookie                                                                 |
| **Rischio**                | Basso                                                                                                                |

---

## T-07. Assistenza clienti

| Campo                      | Dettaglio                                                             |
| -------------------------- | --------------------------------------------------------------------- |
| **Finalità**               | Rispondere a richieste di supporto, risolvere bug, gestire disservizi |
| **Base giuridica**         | Art. 6.1.b (contratto)                                                |
| **Categorie interessati**  | Utenti che aprono ticket                                              |
| **Categorie dati**         | Email, testo messaggio, allegati (screenshot), log pertinenti         |
| **Destinatari**            | Tool di helpdesk EU (es. Zammad self-hosted, Help Scout, etc.)        |
| **Trasferimenti extra-UE** | Nessuno (preferenza EU)                                               |
| **Retention**              | 24 mesi chiusura ticket                                               |
| **Misure sicurezza**       | Accesso role-based, audit interno, scrubbing PII non necessarie       |
| **Rischio**                | Medio                                                                 |

---

## T-08. Sicurezza e prevenzione frodi

| Campo                      | Dettaglio                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| **Finalità**               | Rilevare attacchi, credential stuffing, frode pagamenti, bot                                      |
| **Base giuridica**         | Art. 6.1.f (legittimo interesse: sicurezza rete e informazioni) + art. 6.1.c (obblighi antifrode) |
| **Categorie interessati**  | Tutti i visitatori e utenti                                                                       |
| **Categorie dati**         | IP, user-agent, pattern login, dispositivo, tentativi falliti                                     |
| **Destinatari**            | Nessun terzo (elaborazione interna); eventuale WAF Cloudflare EU                                  |
| **Trasferimenti extra-UE** | Nessuno (Cloudflare region EU)                                                                    |
| **Retention**              | 12 mesi (allineato a tutela contenzioso + forensics)                                              |
| **Misure sicurezza**       | Rate limit centralizzato, correlazione pattern, alert anomalie, audit                             |
| **Rischio**                | Medio                                                                                             |

---

## T-09. Audit log e compliance

| Campo                      | Dettaglio                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| **Finalità**               | Tracciare accessi e modifiche a dati critici per prova di conformità, forensics, contenzioso    |
| **Base giuridica**         | Art. 6.1.c (obbligo legale: accountability art. 5.2) + art. 6.1.f                               |
| **Categorie interessati**  | Utenti che eseguono azioni critiche, amministratori                                             |
| **Categorie dati**         | User ID, timestamp, azione, tabella/entità, IP pseudonimizzato, diff prima/dopo                 |
| **Destinatari**            | Nessun terzo                                                                                    |
| **Trasferimenti extra-UE** | Nessuno                                                                                         |
| **Retention**              | 24 mesi operativi + archivio freddo 60 mesi (cifrato)                                           |
| **Misure sicurezza**       | Append-only (revoke update/delete), firma riga, isolamento, accesso admin tracciato a sua volta |
| **Rischio**                | Medio                                                                                           |

---

## T-10. AI vocale (se attivato — condizionale)

| Campo                      | Dettaglio                                                                         |
| -------------------------- | --------------------------------------------------------------------------------- |
| **Finalità**               | Consentire interazione vocale con il servizio (accessibilità, mobilità, velocità) |
| **Base giuridica**         | Art. 9.2.a (consenso esplicito per dato biometrico)                               |
| **Categorie interessati**  | Utenti che hanno esplicitamente optato per l'AI vocale                            |
| **Categorie dati**         | Audio raw (biometrico art. 9), trascrizione, intent                               |
| **Destinatari**            | Fornitore STT EU/self-hosted (DPA rafforzato)                                     |
| **Trasferimenti extra-UE** | **Vietati**                                                                       |
| **Retention**              | Audio 24h, trascrizione 24 mesi, intent 24 mesi                                   |
| **Misure sicurezza**       | AES-256-GCM, ephemeralità, no-cross-training contractuale, pseudonimizzazione     |
| **Rischio**                | **Alto — DPIA obbligatoria** (vedi `DPIA_TEMPLATE.md`)                            |
| **Status**                 | Non attivo — attivazione subordinata a DPIA firmata dal DPO                       |

---

## T-11. Trasmissione Fattura Elettronica SDI

| Campo                      | Dettaglio                                                                        |
| -------------------------- | -------------------------------------------------------------------------------- |
| **Finalità**               | Emettere fattura elettronica XML verso SDI Agenzia Entrate per conto dell'utente |
| **Base giuridica**         | Art. 6.1.c (obbligo legale: D.M. 55/2013, DPR 633/1972)                          |
| **Categorie interessati**  | Utenti emittenti e loro clienti (cessionari)                                     |
| **Categorie dati**         | Dati fiscali emittente + cessionario, importi, righe fattura, riferimenti        |
| **Destinatari**            | SDI Agenzia delle Entrate (autonomo titolare ex lege)                            |
| **Trasferimenti extra-UE** | Nessuno                                                                          |
| **Retention**              | 10 anni (art. 2220 c.c.)                                                         |
| **Misure sicurezza**       | Firma XAdES-BES, trasmissione PEC o web service accreditato, ricevute conservate |
| **Rischio**                | Medio                                                                            |

---

## T-12. Adempimenti fiscali del Titolare

| Campo                      | Dettaglio                                                                      |
| -------------------------- | ------------------------------------------------------------------------------ |
| **Finalità**               | Emettere fatture ai clienti B2B/B2C per i servizi digITAle, tenuta contabilità |
| **Base giuridica**         | Art. 6.1.c (obbligo legale)                                                    |
| **Categorie interessati**  | Clienti paganti digITAle                                                       |
| **Categorie dati**         | Dati fatturazione, importi, IVA, estratti                                      |
| **Destinatari**            | Commercialista del Titolare, Agenzia Entrate                                   |
| **Trasferimenti extra-UE** | Nessuno                                                                        |
| **Retention**              | 10 anni                                                                        |
| **Misure sicurezza**       | Accesso limitato, DPA con commercialista                                       |
| **Rischio**                | Basso                                                                          |

---

## Governance del registro

- **Aggiornamento**: ad ogni nuovo trattamento o modifica sostanziale
- **Review completa**: annuale, owner DPO
- **Disponibilità Garante**: export PDF entro 48h da richiesta
- **Storia versioni**: `docs/legale/REGISTRO_TRATTAMENTI/versioni/<YYYY-MM-DD>-v<n>.md`
- **Hash documento**: `[generato al commit]`

---

_Documento di compliance ex art. 30 GDPR. Non soggetto a pubblicazione, ma consultabile dal Garante su richiesta._
