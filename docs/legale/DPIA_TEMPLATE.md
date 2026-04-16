# Valutazione d'Impatto sulla Protezione dei Dati (DPIA)

## digITAle — AI vocale e trattamento fiscale su larga scala

> **Articolo di riferimento**: art. 35 GDPR + Linee Guida WP248 + Provvedimento Garante 11 ottobre 2018 (elenco trattamenti soggetti a DPIA)
> **Versione**: 1.0 — 2026-04-16
> **Status**: template — da compilare e aggiornare ad ogni nuova funzione ad alto rischio
> **Owner**: DPO + Titolare + CTO

---

## 1. Quando è obbligatoria

La DPIA è **obbligatoria** quando un trattamento presenta **rischio elevato** per i diritti e le libertà delle persone. digITAle rientra per:

- ✅ Trattamento **su larga scala** di dati fiscali (art. 35.3.b GDPR)
- ✅ **AI vocale** con dati biometrici comportamentali (art. 35.3.a — profilazione / valutazione sistematica)
- ✅ **Monitoraggio sistematico** su utenti italiani (audit log)
- ✅ **Uso di tecnologie innovative** (LLM, speech-to-text italiani)

Numero 9 dell'elenco Garante del 2018: "trattamenti non occasionali di dati relativi a soggetti vulnerabili" — include soggetti che si rivolgono a noi per aiuto (artigiani, anziani).

---

## 2. Descrizione sistematica del trattamento (art. 35.7.a)

### 2.1 Finalità

1. Supporto vocale per comporre fatture, ricevere notifiche, fare domande fiscali
2. Trascrizione comandi dell'utente (speech-to-text)
3. Comprensione del linguaggio naturale italiano (NLU)
4. Generazione risposte testuali / vocali in italiano

### 2.2 Natura del trattamento

- Registrazione audio temporanea (24h max)
- Trascrizione testuale (conservata con il contenuto)
- Processing NLU per intent recognition
- Nessun addestramento di modelli su voce dell'utente (solo inference)

### 2.3 Dati trattati

| Dato                  | Categoria                | Conservazione                    |
| --------------------- | ------------------------ | -------------------------------- |
| Audio raw             | Biometrico (art. 9 GDPR) | 24h poi cancellazione automatica |
| Trascrizione          | Dato comune              | 2 anni (come log)                |
| Intent riconosciuto   | Dato comune              | 2 anni                           |
| Identificativo utente | Dato comune              | Durata account                   |

### 2.4 Soggetti coinvolti

- Utenti autenticati maggiorenni che attivano esplicitamente l'AI vocale
- Stima: 10-30% della base utenti (opt-in)

### 2.5 Tecnologie e fornitori

- Speech-to-text: `[DA DECIDERE — preferibile modello on-prem / EU: Whisper self-hosted su GPU EU, o servizio certificato EU]`
- NLU engine: `[DA DECIDERE]`
- TTS output: `[DA DECIDERE]`
- Storage audio: bucket cifrato EU (Supabase Storage o S3 EU)

**Divieto**: nessun provider USA non DPF-certificato, nessun provider cinese o russo in nessuna forma.

---

## 3. Valutazione necessità e proporzionalità (art. 35.7.b)

### 3.1 Necessità

**L'AI vocale è necessaria** per:

- Accessibilità (anziani con difficoltà tastiera, ipovedenti)
- Mobilità (uso in movimento)
- Velocità (comando vocale > compilazione form)

**Alternative considerate e rigettate**:

- Input solo testuale: escluderebbe soggetti vulnerabili (target core di digITAle)
- Input vocale senza trascrizione: non consente funzioni operative

### 3.2 Proporzionalità

- Conservazione audio limitata a 24h (minima necessaria per troubleshooting)
- Cancellazione immediata dopo processing per utenti che rifiutano il troubleshooting support
- Audio mai usato per addestramento modelli (contratto vincolante con fornitori)
- Opt-in esplicito, mai attivo di default, revocabile in qualsiasi momento con effetto immediato

---

## 4. Valutazione dei rischi per interessati (art. 35.7.c)

Scala: 1 = minimo, 5 = massimo.

| Rischio                                             | Probabilità | Impatto | Punteggio |
| --------------------------------------------------- | ----------- | ------- | --------- |
| Accesso non autorizzato all'audio (breach)          | 2           | 4       | **8**     |
| Trascrizione contenente PII di terzi (nomi, numeri) | 4           | 3       | **12**    |
| Errore NLU con esecuzione comando non voluto        | 3           | 2       | **6**     |
| Re-identificazione da pattern vocali                | 2           | 4       | **8**     |
| Uso dell'audio per fini ulteriori (creep scope)     | 2           | 5       | **10**    |
| Perdita del consenso (confusione UI)                | 3           | 3       | **9**     |
| Trasferimento extra-UE inadeguato                   | 2           | 5       | **10**    |
| Fornitore STT bancarottato con dati                 | 1           | 4       | **4**     |

**Soglia di attenzione**: > 8 → misura specifica richiesta.

---

## 5. Misure previste per affrontare i rischi (art. 35.7.d)

### 5.1 Misure tecniche

- **Cifratura audio** at-rest AES-256-GCM + in-transit TLS 1.3
- **Ephemeralità**: audio cancellato dopo 24h automaticamente (trigger cron)
- **Pseudonimizzazione**: audio salvato con UUID, non identificativi utente
- **Isolamento**: bucket audio ha access policy separata, accesso solo a edge function specifica
- **No cross-training**: contratto con fornitore STT vieta uso voce per training
- **Voice hash fingerprint anti-replay**: nonce per ogni richiesta vocale
- **Keyword activation privacy-first**: microfono non sempre attivo, solo su pressione pulsante (no always-on)
- **Compressione lossy** prima storage per ridurre quality e prevenire voice-print re-id

### 5.2 Misure organizzative

- **Consenso granulare** separato da altri consensi, con spiegazione chiara
- **Opt-out istantaneo** dalla dashboard
- **Review trimestrale** dell'uso dell'AI vocale con report al DPO
- **Formazione obbligatoria** del team su biometrici
- **Contratto DPA rafforzato** con fornitore STT (clausole extra su addestramento, sub-processing, return/delete on termination)
- **Audit del fornitore** annuale (SOC2 Type II report richiesto)

### 5.3 Misure contrattuali

Con ogni fornitore coinvolto, clausole:

- Divieto assoluto di uso della voce per addestramento
- Divieto di sub-processing senza consenso scritto
- Obbligo di delete entro 30 giorni a richiesta
- Obbligo di notifica breach entro 24h
- Diritto di audit annuale

---

## 6. Consultazioni

### 6.1 DPO (art. 35.2)

Parere del DPO `[DA COMPILARE]` — documento in `docs/legale/DPIA/<data>-dpo-opinion.md`

### 6.2 Interessati (art. 35.9)

Pre-lancio AI vocale: survey a 100 utenti beta, focus group con associazioni anziani/ipovedenti. Report archiviato.

### 6.3 Garante (art. 36 — consultazione preventiva)

**Obbligatoria** se la DPIA indica rischio residuo elevato nonostante le misure.

**Valutazione digITAle**: con le misure adottate il rischio residuo è **medio-basso**, quindi la consultazione preventiva **non è obbligatoria**. Tuttavia, per eccesso di cautela e per l'alto valore simbolico di digITAle come infrastruttura italiana, **il Titolare si riserva di effettuare consultazione volontaria** presso il Garante prima del rilascio pubblico.

---

## 7. Monitoraggio e aggiornamento

- **Rivalutazione**: ogni 12 mesi o ad ogni modifica sostanziale
- **Indicatori di re-trigger**:
  - Cambio fornitore STT/TTS/NLU
  - Modifica retention audio > 24h
  - Estensione a categorie di dati sensibili aggiuntive
  - Breach con impatto su audio
  - Modifica normativa rilevante
  - Nuova integrazione con SPID/CIE biometrico

- **Archivio**: `docs/legale/DPIA/<YYYY-MM-DD>-dpia-v<n>.md`

---

## 8. Dichiarazione

Il Titolare, ricevuto il parere del DPO e valutate le misure previste, dichiara che il trattamento descritto:

- [ ] Può procedere senza ulteriori cautele
- [ ] Può procedere con le misure integrative documentate
- [ ] Richiede consultazione preventiva del Garante prima del rilascio
- [ ] Non può procedere

Firma Titolare: `[DA FIRMARE]`
Firma DPO: `[DA FIRMARE]`
Data: `[DA COMPILARE]`
Hash documento: `[generato al commit]`

---

_Documento di compliance. Archiviazione permanente. Disponibile su richiesta del Garante ex art. 35.2._
