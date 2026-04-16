# Procedura di Notifica Data Breach — digITAle

> **Articolo di riferimento**: artt. 33-34 GDPR + Provvedimento Garante 27 maggio 2021 (notifica breach) + Regolamento ACN per operatori NIS2
> **Versione**: 1.0 — 2026-04-16
> **Status**: procedura operativa vincolante
> **Owner**: DPO + CTO + Titolare

---

## 1. Quando scatta la notifica

### 1.1 Notifica al Garante (art. 33 GDPR)

**Obbligatoria** entro **72 ore** dalla conoscenza del breach, **salvo che** il trattamento non comporti rischio per i diritti e le libertà delle persone fisiche.

**digITAle adotta criterio conservativo**: in caso di dubbio, si notifica sempre. Il principio di accountability richiede documentazione anche della decisione di non notificare.

### 1.2 Notifica agli interessati (art. 34 GDPR)

**Obbligatoria** quando il breach comporta **rischio elevato** per i diritti e le libertà. Senza ritardo ingiustificato.

**Esenzione art. 34.3**:

- Dati cifrati con chiavi non compromesse (**digITAle usa AES-256-GCM field-level per dati fiscali**)
- Misure successive che annullano il rischio
- Notifica individuale sproporzionata → comunicazione pubblica

---

## 2. Timeline operativa

| T+         | Azione                                              | Responsabile           |
| ---------- | --------------------------------------------------- | ---------------------- |
| **0**      | Rilevamento breach                                  | On-call + Sentry alert |
| **15 min** | Triage severity + kickoff war room                  | Incident commander     |
| **1h**     | Contenimento iniziale + raccolta evidenze           | CTO + Security lead    |
| **4h**     | Pre-assessment: serve notifica? Valutazione rischio | DPO + CTO              |
| **24h**    | Bozza notifica Garante pronta per revisione         | DPO                    |
| **48h**    | Notifica Garante inviata (se rischio confermato)    | DPO                    |
| **72h**    | ✅ **Termine max notifica Garante**                 | DPO                    |
| **72h-7g** | Comunicazione interessati (se rischio elevato)      | DPO + Support          |
| **30g**    | Post-mortem pubblico (ridotto) + update compliance  | Titolare               |

**Se si supera il termine 72h** → la notifica deve comunque avvenire + motivazione del ritardo documentata.

---

## 3. Classificazione del breach

### 3.1 Tipologia (ENISA taxonomy)

- **Confidenzialità**: accesso/disclosure non autorizzato (leak DB, credenziali esposte, log pubblici)
- **Integrità**: modifica non autorizzata (ransomware, tampering record)
- **Disponibilità**: perdita accesso (ransomware con cifratura, distruzione backup, DoS prolungato)

### 3.2 Gravità (scoring ENISA + integrazione digITAle)

Score 0-4 su 3 assi:

| Asse                              | 0                   | 1                   | 2                           | 3                       | 4                         |
| --------------------------------- | ------------------- | ------------------- | --------------------------- | ----------------------- | ------------------------- |
| **DPC** (Data Processing Context) | Dato pubblico       | Identificativo base | Identificativo + behavioral | Finanziario / sanitario | Biometrico / giudiziario  |
| **EI** (Ease of Identification)   | Impossibile         | Molto difficile     | Possibile con sforzo        | Diretta                 | Pubblica                  |
| **CB** (Circumstances of Breach)  | Perso senza accesso | Tentato accesso     | Confermato accesso limitato | Diffusione ampia        | Diffusione + abuso attivo |

**Severity** = DPC × EI × CB scalato 0-100.

- **0-30**: Basso → notifica Garante non obbligatoria, documentare decisione
- **31-60**: Medio → notifica Garante, interessati solo se identificabili
- **61-100**: Alto → notifica Garante + interessati + comunicazione pubblica

### 3.3 digITAle-specific scenarios

| Scenario                                | DPC | EI  | CB  | Severity    | Azione                                            |
| --------------------------------------- | --- | --- | --- | ----------- | ------------------------------------------------- |
| Service role key leak                   | 4   | 4   | 4   | **CRITICO** | Notifica tutti + comunicazione pubblica immediata |
| Password hash dump (bcrypt cost 12)     | 2   | 2   | 2   | Medio-basso | Notifica Garante, force password reset            |
| Fattura utente mostrata ad altro utente | 3   | 4   | 1   | Medio       | Notifica Garante + 2 interessati coinvolti        |
| Audio vocale esposto                    | 4   | 3   | 2   | Alto        | Notifica Garante + interessati                    |
| Dump audit_log                          | 2   | 3   | 2   | Medio       | Notifica Garante (include metadati)               |
| Backup criptato rubato (chiave sicura)  | 0   | 0   | 0   | Basso       | Documentare, no notifica                          |

---

## 4. Template notifica Garante

> Invio via: **https://servizi.gpdp.it/databreach** (portale ufficiale)
> Firma digitale del Titolare o DPO richiesta

```
OGGETTO: Notifica di violazione di dati personali — [TITOLARE] — rif. [ID_INTERNO]

1. IDENTIFICAZIONE TITOLARE
   Ragione sociale: [DA COMPILARE]
   P. IVA: [DA COMPILARE]
   Sede legale: [DA COMPILARE]
   Referente: [NOME DPO / legale rappresentante]
   Contatti: dpo@digitale-italia.it — PEC: [DA COMPILARE]

2. NATURA DELLA VIOLAZIONE
   Data di conoscenza: [YYYY-MM-DD HH:MM UTC]
   Data stimata di accadimento: [YYYY-MM-DD HH:MM UTC]
   Modalità di conoscenza: [monitoring automatico / segnalazione interna / segnalazione esterna]
   Tipologia: [confidenzialità / integrità / disponibilità] (anche in combinazione)
   Descrizione sintetica: [max 500 caratteri]

3. CATEGORIE E NUMERO DI INTERESSATI
   Categorie: [utenti / clienti B2B / visitatori / minorenni / soggetti vulnerabili]
   Numero stimato: [N] (aggiornabile con successive comunicazioni)

4. CATEGORIE E NUMERO DI DATI
   Categorie:
   - [ ] Identificativi (nome, email)
   - [ ] Contatti (telefono, indirizzo)
   - [ ] Finanziari (IBAN, P.IVA, CF)
   - [ ] Documenti fiscali (fatture emesse/ricevute)
   - [ ] Credenziali (hash password)
   - [ ] Biometrici (audio, voice-print)
   - [ ] Altro: [specificare]
   Volume: [N record stimato]

5. PROBABILI CONSEGUENZE
   [Analisi rischio per gli interessati: furto identità / frodi / discriminazione / danno reputazionale / perdita controllo dati / danno patrimoniale / danno non patrimoniale]

6. MISURE ADOTTATE O PROPOSTE
   Contenimento:
   - [azione 1, es. rotazione chiavi API]
   - [azione 2, es. revoca sessioni utenti interessati]
   - [azione 3, es. patch vulnerabilità]
   Mitigazione:
   - [azione 1, es. force password reset]
   - [azione 2, es. monitoraggio accessi anomali 90gg]
   Prevenzione futura:
   - [azione 1]

7. CONTATTO DPO
   Nome: [DA COMPILARE]
   Email: dpo@digitale-italia.it
   Telefono: [DA COMPILARE]

8. ALLEGATI
   - Report tecnico preliminare
   - Log audit (estratto pertinente, pseudonimizzato)
   - Matrice di rischio compilata
   - Comunicazione agli interessati (se già inviata)

Data: [YYYY-MM-DD]
Firma digitale Titolare/DPO
```

---

## 5. Template comunicazione agli interessati

### 5.1 Principi di comunicazione (art. 34.2)

- **Linguaggio chiaro e semplice** (no legalese)
- Descrizione natura della violazione
- Nome e contatti DPO
- Probabili conseguenze
- Misure adottate o proposte
- Indicazioni per mitigare il rischio (lato utente)

### 5.2 Template email (user-facing)

```
OGGETTO: Informazione importante sul tuo account digITAle — [incidente di sicurezza]

Gentile [NOME],

ti scriviamo per informarti di un incidente di sicurezza che potrebbe aver riguardato il tuo account digITAle.

🔎 **COSA È SUCCESSO**
Il giorno [DATA] abbiamo rilevato [DESCRIZIONE IN LINGUAGGIO SEMPLICE]. Entro [TEMPO] abbiamo bloccato l'incidente e avviato le indagini.

📋 **QUALI DATI TUOI SONO COINVOLTI**
- [Categoria 1: es. email e nome]
- [Categoria 2: es. alcune fatture emesse]
- [NON coinvolti: le tue credenziali, i dati bancari, ecc.]

⚠️ **COSA PUÒ COMPORTARE**
[Descrizione onesta del rischio reale. No minimizzazione, no allarmismo.]

✅ **COSA STIAMO FACENDO NOI**
- [azione 1]
- [azione 2]
- Abbiamo notificato l'incidente al Garante per la Protezione dei Dati Personali.

🛡️ **COSA TI CONSIGLIAMO DI FARE**
1. Cambia la password del tuo account [link diretto]
2. Attiva la verifica a due fattori se non l'hai ancora fatto [link diretto]
3. Monitora il tuo account per attività sospette
4. [Eventuali azioni specifiche]

💬 **PER DOMANDE**
Il nostro Responsabile della Protezione dei Dati risponde a:
- Email: dpo@digitale-italia.it
- Pagina dedicata: digitale-italia.it/incidenti/[ID]

Ci scusiamo sinceramente per l'accaduto. La tua fiducia è la nostra responsabilità e stiamo lavorando perché non si ripeta.

Il team digITAle
```

### 5.3 Canali di notifica

- **Email** all'indirizzo registrato (canale primario)
- **Notifica in-app** al prossimo login (canale di rinforzo)
- **Pagina pubblica** `digitale-italia.it/incidenti/[id]` (trasparenza)
- **Supporto telefonico dedicato** se breach > 10.000 utenti
- **Registrata A/R** se breach riguarda dati sensibili e l'indirizzo fisico è disponibile

### 5.4 Comunicazione pubblica (se richiesta)

Solo se:

- Breach > 100.000 interessati, OR
- Impossibilità di comunicazione individuale, OR
- Autorità richiede comunicazione pubblica

Formato: comunicato stampa + post su blog ufficiale + social (se account attivo) + notifica all'AGCOM se ha effetti su servizi di comunicazione.

---

## 6. Registro breach (art. 33.5)

Tutti i breach (notificati o meno) vanno registrati in:

**Path**: `docs/legale/REGISTRO_BREACH/<YYYY-MM-DD>-breach-<id>.md`

```yaml
id: BRCH-2026-001
data_conoscenza: 2026-XX-XX HH:MM UTC
data_accadimento: 2026-XX-XX HH:MM UTC (stimata)
tipologia: [confidenzialità|integrità|disponibilità]
severity_score: 0-100
categorie_interessati: [...]
numero_interessati: N
categorie_dati: [...]
numero_record: N
cause_radice: [tech|human|process|supplier]
descrizione: |
  ...
timeline:
  - t+0: rilevamento
  - t+15m: triage
  - t+1h: contenimento
  - ...
decisione_notifica_garante: [SI|NO] + motivazione
decisione_notifica_interessati: [SI|NO] + motivazione
riferimento_notifica_garante: [id protocollo]
costi_totali: €...
lessons_learned: |
  ...
azioni_preventive_implementate:
  - ...
stato: [aperto|chiuso]
owner: [nome]
firma_dpo_chiusura: [DA FIRMARE alla chiusura]
```

Il registro è **conservato permanentemente** e disponibile al Garante su richiesta.

---

## 7. Integrazione con NIS2 (D.Lgs. 138/2024)

Se digITAle rientrerà nel perimetro NIS2 (da valutare al raggiungimento soglie dimensionali):

- **Notifica ACN** entro **24 ore** (early warning) + **72 ore** (incident report) + **1 mese** (final report)
- Canale: servizi.acn.gov.it
- Parallela alla notifica Garante (non sostitutiva)
- Coordinamento DPO + responsabile NIS2 del Titolare

---

## 8. Ruoli e responsabilità durante il breach

| Ruolo                  | Responsabilità                                                             |
| ---------------------- | -------------------------------------------------------------------------- |
| **Incident Commander** | Coordinamento generale, decisioni operative                                |
| **Security Lead**      | Contenimento tecnico, forensics, patch                                     |
| **DPO**                | Valutazione obbligo notifica, redazione comunicazioni, interfaccia Garante |
| **CTO**                | Azioni infrastrutturali, recovery, comunicazione interna team              |
| **Titolare**           | Firma notifica, comunicazione pubblica, decisioni strategiche              |
| **Support Lead**       | Gestione richieste utenti, canale dedicato, FAQ pubblica                   |
| **Legal Counsel**      | Revisione comunicazioni, valutazione risvolti contrattuali                 |

**War room**: canale Slack `#incident-YYYYMMDD-<id>` + videocall continua + shared doc live.

---

## 9. Esercitazioni

- **Tabletop exercise** trimestrale con scenari variabili (leak, ransomware, supply chain attack, insider threat)
- **Red team / purple team** annuale
- **Simulazione completa** notifica Garante (su test portal se disponibile) annuale

Report esercitazioni in `docs/legale/ESERCITAZIONI/<YYYY-MM-DD>-tabletop.md`.

---

## 10. Contatti

- **DPO**: dpo@digitale-italia.it
- **Security oncall**: security@digitale-italia.it — `+39 ...` (PEC + telefono H24 post-launch)
- **Titolare**: [DA COMPILARE]
- **Legal counsel esterno**: [DA COMPILARE]
- **Portal Garante**: https://servizi.gpdp.it/databreach
- **Portal ACN** (se NIS2): https://servizi.acn.gov.it

---

_Procedura di compliance. Revisione annuale obbligatoria e ad ogni breach. Versione archiviata in `docs/legale/versioni/BREACH_NOTIFICATION_v<n>.md`._
