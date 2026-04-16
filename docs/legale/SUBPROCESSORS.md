# Sub-responsabili del trattamento — digITAle

## Elenco ufficiale (art. 28.2 GDPR)

> **Versione**: 1.0 — 2026-04-16
> **Status**: lista ufficiale, aggiornata ad ogni ingresso/uscita sub-processor
> **Preavviso modifiche**: 30 giorni via email + pagina dedicata
> **Obiezione Utente**: diritto di recesso dal servizio se non accetta il nuovo sub-processor

---

## 1. Principi

digITAle seleziona i sub-processor con i seguenti **criteri non negoziabili**:

1. **Hosting dati in UE** (o paese con decisione di adeguatezza ex art. 45 GDPR)
2. **DPA firmato** con clausole allineate SCC 2021/914
3. **Certificazioni** riconosciute (ISO 27001, SOC2 Type II, ENISA)
4. **Nessun uso dei dati utente per training** di modelli AI senza autorizzazione scritta separata
5. **Notifica breach** entro 24h al Titolare
6. **Return/Delete on termination** entro 30 giorni
7. **Audit right** almeno annuale
8. **No sub-processing a cascata** senza consenso scritto

**Divieti assoluti**:

- Provider USA senza DPF-certification valida
- Provider cinesi, russi o di paesi sotto embargo UE
- Provider che rifiutano DPA o SCC 2021/914

---

## 2. Elenco attuale

| #   | Sub-responsabile                                    | Servizio                               | Categorie dati                                          | Sede hosting                             | Trasferimenti                       | DPA                                                           | Certificazioni                               |
| --- | --------------------------------------------------- | -------------------------------------- | ------------------------------------------------------- | ---------------------------------------- | ----------------------------------- | ------------------------------------------------------------- | -------------------------------------------- |
| 1   | **Supabase Inc.**                                   | Database PostgreSQL + Auth + Storage   | Anagrafica utenti, fatture, audit log, file utente      | EU (region `eu-west-1` / Francoforte)    | Nessuno (region EU)                 | ✅ [supabase.com/dpa](https://supabase.com/dpa)               | SOC2 Type II, HIPAA (US), ISO 27001 in corso |
| 2   | **Netlify, Inc.**                                   | Hosting statico + CDN + Edge Functions | Contenuti statici, log accessi (IP troncato), header    | EU (edge PoP Milano/Francoforte primari) | Eventuali SCC + DPF per supporto US | ✅ [netlify.com/gdpr-ccpa](https://www.netlify.com/gdpr-ccpa) | SOC2 Type II, ISO 27001                      |
| 3   | **Stripe Payments Europe Ltd**                      | Processamento pagamenti                | Dati fatturazione, token carta, ultimi 4 cifre, importi | Irlanda + US (tokenizzato)               | SCC 2021/914 + DPF                  | ✅ [stripe.com/dpa](https://stripe.com/legal/dpa)             | PCI-DSS Level 1, SOC2, ISO 27001             |
| 4   | **Plausible Insights OÜ**                           | Analytics cookieless                   | Pagine visitate, IP troncato, aggregati                 | Germania (Hetzner)                       | Nessuno                             | ✅ [plausible.io/dpa](https://plausible.io/dpa)               | GDPR-first by design                         |
| 5   | **Functional Software, Inc. (Sentry)**              | Error monitoring                       | Stack trace, breadcrumb, no PII                         | EU (eu.sentry.io)                        | SCC + DPF per supporto US           | ✅ [sentry.io/legal/dpa](https://sentry.io/legal/dpa)         | SOC2 Type II, ISO 27001, Privacy Shield 2.0  |
| 6   | **Resend (Drop Technologies Inc.)** _(pianificato)_ | Email transazionali                    | Email destinatario, contenuto, log invio                | EU (region EU)                           | Nessuno se region EU                | ✅ [resend.com/legal/dpa](https://resend.com/legal/dpa)       | SOC2 Type II                                 |
| 7   | **[DA SCEGLIERE]**                                  | Speech-to-text italiano                | Audio raw, trascrizione                                 | **Obbligo EU o self-hosted**             | **Vietati extra-UE**                | DPA rafforzato richiesto                                      | TBD                                          |

**Legenda**:

- ✅ = DPA firmato e in vigore
- ⚠️ = DPA in fase di negoziazione
- ❌ = Fornitore escluso

---

## 3. Schede dettagliate

### 3.1 Supabase

- **Entità**: Supabase Inc. (Delaware) + Supabase EU Ltd (Irlanda) per clienti UE
- **Ruolo**: responsabile trattamento art. 28
- **Dati trattati**: database utenti, anagrafica, fatture, audit log, storage file, autenticazione
- **Region configurata**: `eu-west-1` (Francoforte) — **non modificabile senza consenso scritto**
- **Misure sicurezza**: TLS in-transit, AES-256 at-rest, network isolation, RLS enforcement
- **Sub-processing**: AWS Frankfurt (IaaS), Cloudflare EU (edge), approvato
- **DPA**: https://supabase.com/dpa — ultima versione accettata 2026-XX
- **Certificazioni**: SOC2 Type II, HIPAA (mercato US), ISO 27001 in roadmap 2026
- **Audit right**: report SOC2 annuale disponibile a richiesta
- **Breach notification**: 24h via security@supabase.io
- **Terminazione**: export via `pg_dump` + delete conferma entro 30gg

### 3.2 Netlify

- **Entità**: Netlify, Inc. (Delaware, USA)
- **Ruolo**: responsabile trattamento (CDN + hosting) + titolare autonomo (per telemetria infrastrutturale)
- **Dati trattati**: contenuti statici pubblici, header HTTP, log accesso (IP hash)
- **Region configurata**: edge PoP EU con priorità Milano/Francoforte
- **Sub-processing**: AWS, Google Cloud (infrastruttura edge), approvato
- **Trasferimenti**: supporto tecnico può accedere da US con DPF + SCC
- **DPA**: https://www.netlify.com/gdpr-ccpa
- **Certificazioni**: SOC2 Type II, ISO 27001, CCPA-ready
- **Audit right**: report SOC2 annuale
- **Breach notification**: 24h via trust@netlify.com

### 3.3 Stripe

- **Entità**: Stripe Payments Europe Ltd (Dublino, Irlanda)
- **Ruolo**: responsabile trattamento per digITAle + autonomo titolare per obblighi antiriciclaggio e fiscali propri
- **Dati trattati**: dati fatturazione, token carta (digITAle non conserva PAN), importi, metadata
- **Region configurata**: EEA processing
- **Sub-processing**: elenco pubblico https://stripe.com/legal/subprocessors
- **Trasferimenti**: possibili US con SCC 2021/914 + DPF
- **DPA**: https://stripe.com/legal/dpa
- **Certificazioni**: PCI-DSS Level 1, SOC1/2 Type II, ISO 27001, ISO 22301
- **Breach notification**: 24h via security@stripe.com

### 3.4 Plausible Analytics

- **Entità**: Plausible Insights OÜ (Estonia)
- **Ruolo**: responsabile trattamento
- **Dati trattati**: URL pagina, referrer, device type, IP troncato (no storage)
- **Region configurata**: server Hetzner Germania
- **Sub-processing**: Hetzner Online GmbH (Germania)
- **Trasferimenti**: nessuno
- **DPA**: https://plausible.io/dpa
- **Design**: cookieless, no fingerprinting, no tracking cross-site by architecture
- **Breach notification**: 24h via support@plausible.io

### 3.5 Sentry

- **Entità**: Functional Software, Inc. (Delaware, USA)
- **Ruolo**: responsabile trattamento
- **Dati trattati**: stack trace, breadcrumb, user ID (pseudonimizzato), release, context
- **Region configurata**: **eu.sentry.io** (Frankfurt) — selezione obbligatoria
- **PII scrubbing**: pre-send hook lato digITAle blocca email, IBAN, CF, P.IVA
- **Sub-processing**: AWS EU
- **Trasferimenti**: personale US con DPF + SCC per supporto
- **DPA**: https://sentry.io/legal/dpa
- **Certificazioni**: SOC2 Type II, ISO 27001
- **Breach notification**: 24h

### 3.6 Resend (pianificato)

- **Entità**: Drop Technologies Inc. (Delaware, USA)
- **Ruolo**: responsabile trattamento
- **Dati trattati**: email destinatario, mittente, subject, body, log invio
- **Region**: region EU se disponibile, altrimenti scelta alternativa EU-only
- **Status**: valutazione in corso. Alternativa backup: Postmark EU, Mailjet, SendGrid EU

### 3.7 Speech-to-text italiano (da decidere)

**Criteri obbligatori**:

- Hosting EU o self-hosted su GPU EU
- Nessun training su voce utente (contratto vincolante)
- DPA rafforzato con clausole biometrici
- Audit annuale
- Breach notification 24h
- Delete entro 7gg su richiesta

**Candidati valutati**:

- ✅ Whisper self-hosted su GPU EU (controllo totale, no DPA necessario)
- ⚠️ AssemblyAI (US, DPF non sufficiente per dato biometrico)
- ❌ Google Speech, AWS Transcribe (US senza adequate protection per biometrici)
- ⚠️ Fornitori italiani emergenti (due diligence richiesta)

**Decisione**: preferenza a self-hosted. In caso di scelta commerciale, solo con DPIA + approvazione DPO.

---

## 4. Processo di aggiornamento

### 4.1 Aggiunta nuovo sub-processor

1. **Valutazione** (vendor assessment): criteri del §1, security questionnaire, DPA bozza
2. **Approvazione DPO**: firma formale, annotata nel registro
3. **Notifica Utenti**: 30 giorni prima dell'attivazione effettiva
   - Email + banner in-app + aggiornamento questa pagina
   - Meccanismo di **obiezione**: l'Utente può recedere gratuitamente entro 30 giorni se in disaccordo
4. **Commit Git**: hash del documento aggiornato
5. **Comunicazione Garante**: nessuna formale (non obbligatoria), ma aggiornamento registro trattamenti

### 4.2 Rimozione sub-processor

1. **Backup / export dati** dal sub-processor uscente
2. **Delete verification**: conferma scritta della cancellazione + attestato
3. **Aggiornamento questa pagina** con changelog
4. **Notifica utenti**: se rimozione ha impatto operativo

### 4.3 Cambio region o sub-sub-processor

Se il sub-processor modifica region o aggiunge propri sub-processor:

- digITAle valuta **entro 7 giorni** l'accettabilità
- Se non accettabile → escalation contrattuale + eventuale terminazione
- Notifica utenti se cambia effetto per loro

---

## 5. Storico modifiche

| Data       | Azione                   | Sub-processor | Motivazione            |
| ---------- | ------------------------ | ------------- | ---------------------- |
| 2026-04-16 | Creazione documento v1.0 | —             | Lancio compliance pack |

---

## 6. Diritto di obiezione dell'Utente

L'Utente può:

- **Visualizzare** la lista aggiornata a `digitale-italia.it/subprocessors`
- **Iscriversi agli aggiornamenti** (email automatica ad ogni modifica)
- **Obiettare** entro 30 giorni dalla notifica di un nuovo sub-processor
- **Recedere gratuitamente** se l'obiezione è motivata e non conciliabile

Canale di obiezione: privacy@digitale-italia.it — oggetto "Obiezione sub-processor [nome]"

---

## 7. Audit fornitori

- **Annuale**: review di tutti i DPA + certificazioni rinnovate
- **Trigger ad hoc**: breach presso sub-processor, cambio proprietà, modifica material DPA
- **Owner**: DPO + CTO
- **Report**: archiviato in `docs/legale/AUDIT_FORNITORI/<YYYY>/`

---

## 8. Contatti

- **Domande sulla lista**: privacy@digitale-italia.it
- **DPO**: dpo@digitale-italia.it
- **PEC**: `[DA COMPILARE]`

---

_Documento pubblico. Disponibile online a `digitale-italia.it/subprocessors` con possibilità di sottoscrizione aggiornamenti via email._
