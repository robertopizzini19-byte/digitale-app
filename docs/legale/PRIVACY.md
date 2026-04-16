# Informativa sul Trattamento dei Dati Personali — digITAle

> **Versione**: 2.0 — 2026-04-16
> **Status**: BOZZA avanzata — da validare con avvocato/DPO per i soli campi marcati `[DA COMPILARE]` prima della pubblicazione.
> **Resa ai sensi di**: Reg. UE 2016/679 (GDPR), D.Lgs. 196/2003 come mod. dal D.Lgs. 101/2018 (Codice Privacy), Provvedimenti del Garante, D.Lgs. 82/2005 (CAD), D.Lgs. 231/2001.

---

## 0. Principi guida

digITAle adotta i seguenti principi **inderogabili**:

1. **Privacy by design e by default** (art. 25 GDPR): ogni funzione nasce con la protezione dei dati come requisito, non come aggiunta.
2. **Data minimization** (art. 5.1.c): raccogliamo solo ciò che serve, nulla di più.
3. **Sovranità digitale italiana**: i dati risiedono in UE (Frankfurt) con replica in Italia dove tecnicamente possibile. Nessun dato di identificazione italiana transita in giurisdizioni che non offrono garanzie equivalenti al GDPR.
4. **Trasparenza radicale**: questo documento è pubblico, versionato su GitHub, tracciabile nella storia.
5. **Nessuna vendita**: i tuoi dati non sono mai venduti, ceduti a terzi per finalità di marketing profilato, scambiati con data broker.

---

## 1. Titolare del trattamento

| Campo            | Valore                                                           |
| ---------------- | ---------------------------------------------------------------- |
| Ragione sociale  | **[DA COMPILARE]**                                               |
| Forma giuridica  | **[DA COMPILARE — consigliato: s.r.l.s. o s.r.l. semplificata]** |
| P.IVA / CF       | **[DA COMPILARE]**                                               |
| Sede legale      | **[DA COMPILARE]**                                               |
| Iscrizione CCIAA | **[DA COMPILARE]**                                               |
| REA              | **[DA COMPILARE]**                                               |
| Email            | privacy@digitale-italia.it                                       |
| PEC              | **[DA COMPILARE]**                                               |
| Telefono         | **[DA COMPILARE]**                                               |

### Responsabile della Protezione dei Dati (DPO)

**Obbligatorietà**: la nomina del DPO è obbligatoria ex art. 37 GDPR quando:

- il trattamento è svolto da autorità/organismo pubblico; **OPPURE**
- le attività principali consistono in trattamenti su larga scala di dati sensibili (art. 9) o di condanne penali (art. 10); **OPPURE**
- le attività principali consistono in monitoraggio regolare e sistematico degli interessati su larga scala.

digITAle, operando su dati fiscali di utenti italiani e prevedendo AI vocale (dato biometrico/comportamentale), **nomina volontariamente un DPO** per eccesso di cautela.

| DPO       | **[DA COMPILARE — nome e cognome]** |
| --------- | ----------------------------------- |
| Email     | dpo@digitale-italia.it              |
| Indirizzo | **[DA COMPILARE]**                  |

---

## 2. Categorie di dati personali trattati

### 2.1 Dati comuni (art. 4.1 GDPR)

| Categoria       | Esempi                                                                | Base giuridica                                      | Conservazione                   |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------- |
| Identificazione | Nome, cognome, data di nascita, email, telefono                       | Contratto (art. 6.1.b)                              | Durata account + 30 gg          |
| Fiscali         | Codice fiscale, P.IVA, regime fiscale                                 | Obbligo legale (art. 6.1.c) — DPR 633/72, 917/86    | 10 anni (art. 2220 c.c.)        |
| Indirizzo       | Via, CAP, città, provincia                                            | Contratto + obbligo legale fatturazione             | 10 anni                         |
| Fatturazione    | Clienti, importi, scadenze, metodi pagamento (**token**, non PAN)     | Contratto + obbligo legale                          | 10 anni                         |
| Autenticazione  | Hash password bcrypt + salt, TOTP seed cifrato, sessioni              | Contratto + obbligo art. 32 GDPR                    | Durata sessione / 90 gg rolling |
| Navigazione     | IP (pseudonimizzato dopo 24h), user-agent, timestamp, path            | Interesse legittimo (art. 6.1.f) — sicurezza, audit | 6 mesi raw, 2 anni aggregato    |
| Audit           | Log di ogni modifica a dati sensibili (chi, cosa, quando, IP, record) | Obbligo CAD + forensic readiness                    | 2 anni                          |
| Comunicazioni   | Messaggi a supporto, ticket                                           | Contratto                                           | 5 anni (prescrizione ordinaria) |

### 2.2 Dati "particolari" — categorie sensibili (art. 9 GDPR)

| Categoria                                | Trattati?                    | Base giuridica                | Garanzie specifiche                                                 |
| ---------------------------------------- | ---------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| Salute                                   | **NO**                       | —                             | —                                                                   |
| Biometrici (voce)                        | **SOLO SE ATTIVI AI vocale** | Consenso esplicito art. 9.2.a | DPIA eseguita, encryption a livello record, cancellazione al logout |
| Genetici                                 | **NO**                       | —                             | —                                                                   |
| Origine etnica/razziale                  | **NO**                       | —                             | —                                                                   |
| Opinioni politiche, religiose, sindacali | **NO**                       | —                             | —                                                                   |
| Orientamento sessuale/vita sessuale      | **NO**                       | —                             | —                                                                   |

### 2.3 Dati giudiziari (art. 10 GDPR)

**Non trattiamo dati relativi a condanne penali o reati**.

### 2.4 Minori (art. 8 GDPR)

digITAle è rivolto a maggiorenni. Non trattiamo consapevolmente dati di minori di 14 anni. Se scopriamo un account di minore, viene cancellato con notifica al genitore/tutore.

---

## 3. Finalità del trattamento e base giuridica

| #   | Finalità                                             | Base giuridica                                     | Separabile?      |
| --- | ---------------------------------------------------- | -------------------------------------------------- | ---------------- |
| F1  | Erogazione servizio (account, dashboard, funzioni)   | Contratto (art. 6.1.b)                             | No               |
| F2  | Fatturazione elettronica e invio SDI                 | Obbligo legale (art. 6.1.c)                        | No               |
| F3  | Conservazione a norma CAD art. 44                    | Obbligo legale (art. 6.1.c)                        | No               |
| F4  | Sicurezza, prevenzione frodi, audit                  | Interesse legittimo (art. 6.1.f) + obbligo art. 32 | No               |
| F5  | Comunicazioni di servizio (reset password, scadenze) | Contratto                                          | No               |
| F6  | Supporto clienti                                     | Contratto                                          | No               |
| F7  | Marketing diretto proprio su prodotti analoghi       | Soft spam (art. 130.4 Codice Privacy)              | **Sì** (opt-out) |
| F8  | Newsletter commerciale generica                      | Consenso (art. 6.1.a)                              | **Sì** (opt-in)  |
| F9  | Profilazione (raccomandazioni personalizzate)        | Consenso (art. 6.1.a) + art. 22.2.c                | **Sì** (opt-in)  |
| F10 | AI vocale (assistente)                               | Consenso esplicito (art. 9.2.a)                    | **Sì** (opt-in)  |
| F11 | Cessione a terzi per marketing                       | **MAI**                                            | —                |

### 3.1 Processi decisionali automatizzati (art. 22 GDPR)

digITAle **NON** sottopone gli utenti a decisioni basate unicamente su trattamenti automatizzati che producano effetti giuridici o incidano significativamente sulla loro persona. Le raccomandazioni dell'AI sono informative, mai vincolanti; l'utente mantiene piena autonomia decisionale.

Se in futuro introdurremo tali processi (es. scoring fiscale automatico), lo comunicheremo con 30 giorni di anticipo, consentendo opt-out e diritto di intervento umano.

---

## 4. Periodo di conservazione dei dati

| Categoria                    | Retention                                                                                      | Motivazione                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Fatture emesse/ricevute      | **10 anni** dalla emissione                                                                    | Art. 2220 c.c. + art. 22 DPR 600/73                             |
| Documenti conservati a norma | **10 anni**                                                                                    | CAD art. 43-44                                                  |
| Registrazioni contabili      | **10 anni**                                                                                    | Art. 2220 c.c.                                                  |
| Contratti di servizio        | **10 anni** dalla cessazione                                                                   | Prescrizione ordinaria art. 2946 c.c.                           |
| Account attivo               | Durata contratto                                                                               | Contratto                                                       |
| Account cessato              | **30 giorni** per export poi **cancellazione logica** + **90 giorni** per cancellazione fisica | GDPR art. 17 + retention tecnica backup                         |
| Audit log                    | **2 anni**                                                                                     | Forensic readiness + CAD                                        |
| Log accesso (IP raw)         | **6 mesi**                                                                                     | Interesse legittimo sicurezza + obbligo art. 132 Codice Privacy |
| Log accesso (aggregati)      | **2 anni**                                                                                     | Interesse legittimo                                             |
| Backup                       | **90 giorni** rolling + snapshot mensili 1 anno                                                | Continuità operativa                                            |
| Consensi                     | **10 anni** post revoca                                                                        | Prova conformità GDPR art. 7.1                                  |
| Registrazioni vocali AI      | **24 ore** poi cancellazione automatica                                                        | Data minimization                                               |
| Sessioni attive              | Durata sessione (max 7 gg)                                                                     | Sicurezza                                                       |
| Rate limit data              | **7 giorni**                                                                                   | Efficienza                                                      |
| Dati di pagamento (token)    | Durata contratto                                                                               | Contratto                                                       |
| Dati di pagamento (PAN)      | **MAI memorizzati** (tokenizzati da Stripe)                                                    | PCI-DSS SAQ-A                                                   |

### 4.1 Cancellazione

La cancellazione segue una procedura in 3 fasi:

1. **Soft-delete** (immediato alla richiesta): flag `eliminato_il` impostato, dati non più accessibili né all'utente né agli operatori
2. **Hard-delete** (30 giorni): record rimosso dalle tabelle operative, resta solo in backup
3. **Backup purge** (90 giorni): backup ruotano e l'ultima copia esce dal rolling window

**Eccezione**: dati soggetti a obbligo di conservazione legale (fatture, contabilità) vengono segregati in un archivio di sola lettura, accessibile solo per obblighi fiscali e ispettivi, con cifratura aggiuntiva e accesso loggato separatamente.

---

## 5. Diritti dell'interessato (artt. 15-22 GDPR)

| Diritto                    | Articolo | Come esercitarlo                                                   | Tempo risposta                  |
| -------------------------- | -------- | ------------------------------------------------------------------ | ------------------------------- |
| Accesso                    | 15       | Dashboard → Privacy → "I miei dati" (export JSON + PDF leggibile)  | **7 giorni** (target, max 30)   |
| Rettifica                  | 16       | Dashboard → Impostazioni (self-service) o richiesta a privacy@     | Immediato (self-service) / 7 gg |
| Cancellazione              | 17       | Dashboard → Cancella account (conferma doppia)                     | 30 giorni                       |
| Limitazione                | 18       | Richiesta a privacy@digitale-italia.it                             | 7 giorni                        |
| Portabilità                | 20       | Dashboard → Privacy → "Esporta tutto" (JSON + CSV + XML FatturaPA) | Immediato                       |
| Opposizione                | 21       | Dashboard → Impostazioni → Comunicazioni → Opt-out                 | Immediato                       |
| No-profilazione automatica | 22       | Dashboard → Impostazioni → AI → Disattiva                          | Immediato                       |
| Revoca consenso            | 7.3      | Dashboard → Privacy → Gestione consensi                            | Immediato                       |
| Reclamo al Garante         | 77       | https://www.garanteprivacy.it                                      | —                               |

### 5.1 Principio di non-ritorsione

L'esercizio dei diritti dell'interessato **non comporta mai**:

- limitazione del servizio
- modifica delle condizioni economiche
- perdita di funzionalità (se non quelle strettamente dipendenti dal dato ritirato)
- discriminazione

### 5.2 Risposta gratuita

La risposta alle richieste è **gratuita**, salvo richieste manifestamente infondate o eccessive (art. 12.5) — nel qual caso il costo sarà comunicato prima dell'evasione e l'interessato potrà rinunciare.

### 5.3 Verifica dell'identità

Per proteggere i dati, richiediamo verifica dell'identità prima di evadere richieste che riguardano terzi o che potrebbero esporre dati a impostori. Metodi accettati: conferma via email + SPID/CIE o documento d'identità (valutato caso per caso con principio di proporzionalità).

---

## 6. Destinatari e responsabili del trattamento (art. 28 GDPR)

I seguenti soggetti ricevono i dati come **responsabili del trattamento** (designati con atto scritto ex art. 28.3 — vedi `SUBPROCESSORS.md`):

| Destinatario                       | Ruolo                                                | Paese          | Garanzie                    | DPA         |
| ---------------------------------- | ---------------------------------------------------- | -------------- | --------------------------- | ----------- |
| Supabase Inc. (via Supabase EU)    | Hosting DB + Auth                                    | EU (Frankfurt) | SCC 2021/914 + DPA art. 28  | ✅ firmato  |
| Netlify Inc.                       | Hosting frontend + CDN                               | USA + edge EU  | SCC 2021/914 + DPF          | ✅ firmato  |
| Stripe Payments Europe Ltd         | Gateway pagamenti                                    | Irlanda        | PCI-DSS L1 + SCC            | ✅ firmato  |
| Sentry GmbH                        | Error monitoring                                     | Germania       | Hosting EU only             | ✅ firmato  |
| Plausible Insights OÜ              | Analytics anonimi                                    | EU (Estonia)   | GDPR-first by design        | ✅ firmato  |
| Aruba S.p.A. / Namirial S.p.A.     | Invio SDI + PEC + firma digitale                     | Italia         | Provider qualificati AgID   | ✅ firmato  |
| Resend Inc.                        | Invio email transazionali                            | EU region      | SCC + DPA                   | ✅ firmato  |
| **[Consulente fiscale opzionale]** | Supporto fatturazione (solo se attivato dall'utente) | Italia         | DPA + vincolo professionale | A richiesta |

**Elenco sempre aggiornato**: `docs/legale/SUBPROCESSORS.md` + pagina `/subprocessors` del sito. Preavviso di **30 giorni** per aggiunta di nuovi subprocessor, con diritto di recesso in caso di disaccordo.

### 6.1 Titolari autonomi

I seguenti soggetti ricevono i dati come **titolari autonomi** (non responsabili):

- **Agenzia delle Entrate / SDI**: per obbligo di legge (fatturazione elettronica)
- **Autorità giudiziarie, fiscali, di pubblica sicurezza**: solo su ordine vincolante di autorità competente, con verifica formale (MAI a richiesta informale)

### 6.2 Nessun trasferimento a terzi per marketing

**Mai**, nessuno, in nessuna forma, neppure aggregata o pseudonimizzata.

---

## 7. Trasferimenti extra-UE (artt. 44-49 GDPR)

I dati sono **primariamente in UE**. Trasferimenti extra-UE avvengono solo verso:

1. **Paesi con decisione di adeguatezza** (Andorra, Argentina, Canada, Giappone, Nuova Zelanda, Svizzera, UK) — nessuna garanzia aggiuntiva richiesta
2. **USA**: solo verso organizzazioni certificate **EU-US Data Privacy Framework** (DPF) — es. Netlify
3. **Altri paesi**: solo con **Standard Contractual Clauses (SCC) 2021/914** + **valutazione di impatto del trasferimento (TIA)** documentata

**TIA eseguita** per ogni subprocessor extra-UE. Documento archiviato in `docs/legale/TIA/`.

**Escalation** post Schrems II: crittografia end-to-end applicativa sui dati sensibili trasferiti, chiavi detenute in UE.

---

## 8. Misure di sicurezza (art. 32 GDPR)

### 8.1 Misure tecniche

- **Crittografia in transito**: TLS 1.3 forzato, HSTS 2 anni con preload, certificati ECDSA P-384
- **Crittografia at-rest**: AES-256-GCM su tutti i volumi
- **Crittografia a livello campo**: PII sensibili (CF, IBAN) cifrati con `pgcrypto` (AES-256), chiavi gestite in Supabase Vault
- **Pseudonimizzazione**: IP pseudonimizzati dopo 24h; identificativi utente separati da dati di contenuto dove possibile
- **Hashing password**: bcrypt cost factor 12 (oltre standard OWASP)
- **Autenticazione multi-fattore**: TOTP obbligatoria piani Professionista+, WebAuthn/Passkey roadmap Q3 2026
- **Row Level Security** (Postgres): multi-tenant isolation verificato con pen-test automatico ad ogni deploy
- **Audit log immutabile**: ogni modifica tracciata, write-only, tamper-evident
- **Network**: WAF cloud, rate limiting per IP/utente, DDoS protection CDN
- **Secret management**: rotazione 90 giorni, zero secret in git (pre-commit scanner)
- **Vulnerability management**: Dependabot weekly, patch critical <7 gg, pentest annuale esterno

### 8.2 Misure organizzative

- **Formazione privacy e security**: obbligatoria per chiunque acceda a dati, annuale
- **Contratti con riservatezza rafforzata** per collaboratori/fornitori
- **Principio least privilege**: accesso minimo necessario, revoca immediata a cessazione
- **Logging accessi amministrativi** separato, retention 2 anni
- **Incident response playbook**: `docs/INCIDENT_RESPONSE.md`
- **Business continuity / Disaster recovery**: RTO 4h, RPO 1h, test semestrali
- **Backup**: 3-2-1 (3 copie, 2 supporti, 1 off-site), test restore mensile
- **DPIA** (art. 35): eseguita per trattamenti a rischio elevato — vedi `docs/legale/DPIA_TEMPLATE.md`
- **Registro dei trattamenti** (art. 30): `docs/legale/REGISTRO_TRATTAMENTI.md`

### 8.3 Certificazioni e framework di riferimento

digITAle persegue la conformità ai seguenti framework:

- **ISO/IEC 27001** (Information Security Management System) — target audit 2027
- **ISO/IEC 27701** (Privacy Information Management System) — target 2027
- **NIS2** (D.Lgs. 138/2024) — applicabilità in valutazione con legale
- **AgID linee guida sicurezza** — ove applicabili

---

## 9. Violazioni di dati personali (artt. 33-34 GDPR)

In caso di violazione di dati personali (data breach):

- **Notifica al Garante** entro **72 ore** dalla conoscenza, salvo improbabilità di rischio
- **Notifica agli interessati** senza ingiustificato ritardo, se rischio elevato
- **Registrazione interna** di ogni violazione, anche minore, per 5 anni
- **Template e procedure**: `docs/legale/BREACH_NOTIFICATION.md`
- **Playbook operativo**: `docs/INCIDENT_RESPONSE.md`

### 9.1 Trasparenza post-breach

Anche nei casi in cui la notifica non è obbligatoria, digITAle comunicherà in forma aggregata e anonimizzata gli incidenti significativi attraverso la **pagina trasparenza** `/trasparenza/incidenti`.

---

## 10. Cookie e tracker

Vedi documento separato: [`COOKIE.md`](./COOKIE.md).

---

## 11. Contatti, reclami, risoluzione

| Tipo                 | Canale                                            | Tempo risposta        |
| -------------------- | ------------------------------------------------- | --------------------- |
| Esercizio diritti    | privacy@digitale-italia.it                        | 7 giorni (target)     |
| DPO                  | dpo@digitale-italia.it                            | 30 giorni (art. 12.3) |
| Reclamo interno      | privacy@digitale-italia.it + "Reclamo" in oggetto | 15 giorni             |
| Reclamo al Garante   | https://www.garanteprivacy.it                     | —                     |
| Autorità giudiziaria | art. 79 GDPR                                      | —                     |

---

## 12. Aggiornamenti

- **Versione attuale**: 2.0 — 2026-04-16
- **Versione precedente**: 1.0 — 2026-04-16 (minore, prima bozza)
- **Prossima revisione programmata**: 2027-04-16 o prima in caso di modifiche sostanziali
- **Storico**: `/privacy/versioni` (hash SHA-256 di ogni versione, firma digitale del Titolare)
- **Notifica modifiche sostanziali**: via email + banner in dashboard almeno 30 giorni prima dell'efficacia

**Modifiche a tua sfavore** richiedono il tuo consenso positivo; la mancata conferma non comporta decadenza automatica del contratto ma ritorno ai termini precedenti per la durata residua del periodo di fatturazione pagato.

---

_Questo documento è scritto in italiano. In caso di traduzione, fa fede la versione italiana._
_Hash SHA-256 versione: `[generato al commit]`_
