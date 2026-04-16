# Data Processing Agreement (DPA)

## digITAle ↔ [Sub-responsabile]

> **Articolo di riferimento**: art. 28 GDPR + SCC Commissione Europea 2021/914 (modulo 3 — responsabile a sub-responsabile)
> **Versione template**: 1.0 — 2026-04-16
> **Status**: template da negoziare con ogni sub-responsabile
> **Legge applicabile**: Italiana (con prevalenza GDPR)

---

## PARTI

**Titolare del trattamento / "Committente"**:

- Ragione sociale: `[DA COMPILARE — digITAle titolare]`
- P. IVA: `[DA COMPILARE]`
- Sede: `[DA COMPILARE]`
- Rappresentante: `[DA COMPILARE]`
- DPO: dpo@digitale-italia.it

**Responsabile del trattamento / "Fornitore"**:

- Ragione sociale: `[DA COMPILARE]`
- P. IVA / EIN: `[DA COMPILARE]`
- Sede: `[DA COMPILARE]`
- Rappresentante: `[DA COMPILARE]`
- DPO / Privacy contact: `[DA COMPILARE]`

---

## PREMESSE

A. Il Committente opera digITAle, servizio digitale dedicato alla compliance fiscale per utenti italiani.

B. Il Fornitore eroga al Committente il servizio descritto in Appendice A ("Servizio"), che comporta trattamento di dati personali per conto del Committente.

C. Le Parti intendono disciplinare il trattamento ex art. 28 GDPR e, ove applicabile, il trasferimento ex artt. 44-49 GDPR.

D. Il Fornitore dichiara di disporre di garanzie sufficienti ex art. 28.1 e di presentare garanzie tecniche e organizzative adeguate.

---

## 1. Oggetto e durata

1.1 Il Fornitore tratta i dati personali esclusivamente per conto del Committente, secondo le istruzioni documentate (Appendice A + B).

1.2 Durata: coincidente con il contratto principale di servizio, con obblighi post-terminazione fino alla cancellazione/restituzione dei dati.

---

## 2. Natura, finalità, tipologia dati, categorie interessati

Specificati in **Appendice A**. Il Fornitore **non può modificarli unilateralmente**.

Modifiche sostanziali richiedono addendum scritto e firmato.

---

## 3. Istruzioni del Committente

3.1 Il Fornitore tratta i dati **solo** sulla base di istruzioni documentate (questo DPA + istruzioni scritte successive + funzionalità standard del Servizio come documentate).

3.2 Qualora ritenga che un'istruzione violi il GDPR o altra normativa applicabile, il Fornitore ne informa **immediatamente** il Committente e sospende l'esecuzione fino a chiarimento.

3.3 Il Fornitore **non può** trasferire i dati a terzi, utilizzarli per finalità proprie (inclusa la profilazione, il marketing, il training di modelli AI), aggregarli con dati di altri clienti, senza autorizzazione scritta del Committente.

---

## 4. Divieto di uso per training AI

4.1 Il Fornitore **non può**, in nessun caso, utilizzare i dati personali trattati per:

- Addestramento di modelli di machine learning o intelligenza artificiale
- Creazione di derivati, modelli statistici, feature extraction per miglioramento prodotto
- Training pipeline interne, anche in forma anonimizzata, senza consenso scritto preventivo

  4.2 Se il Servizio integra componenti AI (es. analytics, raccomandazioni, traduzione automatica), il Fornitore dichiara se i dati del Committente sono esclusi da ogni loop di training e fornisce prova tecnica.

  4.3 La violazione di questa clausola costituisce **inadempimento grave** e dà diritto al Committente di recedere con effetto immediato, al recupero dei danni e alla notifica al Garante.

---

## 5. Riservatezza e formazione del personale

5.1 Il Fornitore garantisce che il proprio personale autorizzato al trattamento sia:

- Vincolato da obbligo di riservatezza contrattuale
- Formato periodicamente sulla normativa privacy e sicurezza
- Soggetto a procedure disciplinari per violazioni

  5.2 L'accesso ai dati è concesso con principio di **minimizzazione** e tracciato via audit log.

---

## 6. Misure di sicurezza (art. 32 GDPR)

Il Fornitore implementa e mantiene **almeno** le misure dell'**Appendice B**, che includono:

- Cifratura in transito (TLS 1.2+) e at-rest (AES-256)
- Autenticazione forte (2FA per accessi amministrativi)
- Segregazione dei dati tra clienti (multi-tenancy sicura)
- Backup cifrati con test di restore
- Access log e audit
- Procedure di incident response
- Business continuity e disaster recovery (RTO/RPO definiti)
- Vulnerability management e patching tempestivo
- Penetration test periodici (almeno annuali)
- Revisione periodica efficacia misure

Le misure vanno **aggiornate** in base all'evoluzione tecnologica e del rischio (principio dinamico).

---

## 7. Sub-responsabili (art. 28.2)

7.1 Il Fornitore può ricorrere a sub-responsabili **solo** con:

- Autorizzazione scritta generale del Committente (lista allegata come Appendice C)
- Preavviso di **30 giorni** per nuovi inserimenti
- Diritto di **obiezione motivata** del Committente entro 15 giorni: se non conciliabile, recesso senza penali

  7.2 Il Fornitore impone ai sub-responsabili obblighi equivalenti a quelli del presente DPA tramite contratto scritto ex art. 28.4.

  7.3 Il Fornitore **risponde in proprio** per l'inadempimento del sub-responsabile.

  7.4 Il Committente ha diritto a ricevere, su richiesta, copia dei contratti con i sub-responsabili (clausole privacy).

---

## 8. Assistenza al Committente

8.1 Il Fornitore assiste il Committente, con misure tecniche e organizzative adeguate, a:

- **Rispondere alle richieste degli interessati** (artt. 15-22): fornitura dati, cancellazione, portabilità, entro 15 giorni lavorativi dalla richiesta del Committente
- **Art. 32 (sicurezza)**: implementazione misure
- **Artt. 33-34 (breach)**: notifica tempestiva, supporto alla valutazione impatto
- **Art. 35 (DPIA)**: fornitura informazioni tecniche necessarie
- **Art. 36 (consultazione preventiva)**: supporto documentale

---

## 9. Notifica breach (art. 33.2)

9.1 Il Fornitore notifica al Committente **senza ingiustificato ritardo e comunque entro 24 ore** dalla conoscenza di qualsiasi violazione di dati personali che riguardi i dati trattati per conto del Committente.

9.2 La notifica include **almeno**:

- Descrizione natura del breach
- Categorie e numero approssimativo di interessati
- Categorie e numero approssimativo di record
- Nome e contatti DPO o altro referente per informazioni
- Probabili conseguenze
- Misure adottate o proposte

  9.3 Il Fornitore coopera attivamente alle indagini, fornisce evidenze, partecipa alle tabletop se richiesto.

  9.4 Il Committente effettua autonomamente la notifica al Garante e agli interessati.

---

## 10. Audit right (art. 28.3.h)

10.1 Il Fornitore mette a disposizione del Committente tutte le informazioni necessarie per dimostrare la conformità e consente audit:

- **Documentali**: report SOC2 / ISO 27001 / ISAE 3000 annuali
- **On-site**: almeno 1 volta l'anno o al verificarsi di breach / escalation
- **Tramite auditor terzo** di gradimento del Committente

  10.2 Costi degli audit:

- Documentali: gratuiti (parte del servizio)
- On-site annuali: a carico del Committente (viaggio + T&E)
- Audit triggered da breach: a carico del Fornitore

  10.3 Risultati dell'audit: azioni correttive concordate entro **30 giorni** dalla consegna del report.

---

## 11. Trasferimenti extra-UE (artt. 44-49)

11.1 Il Fornitore **non trasferisce** i dati al di fuori dello SEE se non:

- In paesi con decisione di adeguatezza ex art. 45, OR
- Con SCC 2021/914 firmate (allegate come Appendice D), OR
- Con BCR approvate, OR
- Con deroghe art. 49 (interpretate restrittivamente)

  11.2 Se il Fornitore è soggetto a leggi extra-UE che obbligano al disclosure di dati (es. CLOUD Act US), deve:

- Notificare il Committente (se non vietato dalla legge applicabile)
- Contestare la richiesta quando possibile
- Fornire solo il minimo necessario
- Comunicare il numero di richieste ricevute (transparency report annuale)

  11.3 Per i trasferimenti US, il Fornitore deve avere **DPF (Data Privacy Framework) valida** o equivalente garanzia.

  11.4 **Transfer Impact Assessment (TIA)**: il Fornitore collabora alla TIA del Committente fornendo informazioni su:

- Leggi del paese di destinazione rilevanti
- Misure supplementari implementate (es. cifratura, pseudonimizzazione)
- Storico richieste di autorità governative

---

## 12. Obblighi al termine del contratto

12.1 Al termine del contratto principale, il Fornitore — a scelta del Committente — **cancella** o **restituisce** tutti i dati personali.

12.2 Tempistica: **entro 30 giorni** dalla richiesta.

12.3 Il Fornitore fornisce **attestazione scritta** della cancellazione (con elenco sistemi coinvolti).

12.4 Eccezione: legge applicabile può imporre conservazione → in tal caso il Fornitore:

- Documenta base giuridica
- Informa il Committente
- Limita il trattamento allo stretto necessario
- Protegge i dati con misure rafforzate fino al termine legale

  12.5 Backup: i dati nei backup sono cancellati al ciclo di rotazione successivo (max 90 giorni). Nel frattempo isolati e non accessibili.

---

## 13. Responsabilità e indennizzi

13.1 Il Fornitore risponde dei danni cagionati da trattamento non conforme alle istruzioni del Committente o agli obblighi GDPR, ex art. 82.

13.2 In caso di sanzione Garante / EDPB / altra autorità comminata al Committente per fatto imputabile al Fornitore: **manlevatoria integrale** da parte del Fornitore, incluse spese legali documentate.

13.3 Limitazioni di responsabilità contenute nel contratto principale **non si applicano** a:

- Dolo o colpa grave
- Violazione art. 28.3.a (no sub-processing senza consenso)
- Violazione art. 32 (sicurezza)
- Violazione art. 33 (notifica breach)
- Violazione clausola §4 (divieto uso AI)

---

## 14. Riservatezza

14.1 Il Fornitore mantiene la riservatezza su tutte le informazioni acquisite nell'esecuzione del servizio.

14.2 Obblighi di riservatezza **sopravvivono** alla terminazione del contratto per 5 anni.

---

## 15. Governance

15.1 **Referenti**:

- Committente: DPO (dpo@digitale-italia.it) + tecnico CTO
- Fornitore: DPO/Privacy lead + tecnico

  15.2 **Revisione DPA**: annuale o al verificarsi di modifiche normative/servizio.

  15.3 **Comunicazioni formali**: email certificata o PEC. Email ordinaria accettata per comunicazioni operative.

---

## 16. Risoluzione

16.1 Il Committente può risolvere il DPA e il contratto principale con effetto immediato in caso di:

- Violazione grave GDPR o DPA
- Notifica al Committente di indagine autorità
- Breach con impatto sistemico
- Cambio di controllo del Fornitore in soggetti in giurisdizioni non adeguate
- Violazione clausola §4 (training AI)

  16.2 In caso di risoluzione, si applicano gli obblighi di cui al §12.

---

## 17. Legge applicabile e foro

17.1 Il presente DPA è regolato dalla **legge italiana** con prevalenza GDPR e normativa UE.

17.2 Foro **esclusivo** di `[DA COMPILARE — sede Titolare]`, salvo foro del consumatore inderogabile.

17.3 Tentativo di mediazione preliminare obbligatorio per controversie < €50.000.

---

## 18. Varie

18.1 **Interezza**: il presente DPA costituisce accordo completo tra le Parti sul trattamento dati personali.

18.2 **Prevalenza**: in caso di conflitto con il contratto principale, prevale il DPA per le materie privacy.

18.3 **Modifiche**: solo per iscritto, firmate da entrambe le Parti.

18.4 **Separabilità**: nullità di una clausola non compromette le altre.

---

## FIRME

**Per il Committente**

- Nome: `[DA COMPILARE]`
- Ruolo: `[DA COMPILARE]`
- Data: `[DA COMPILARE]`
- Firma digitale: `[DA FIRMARE]`

**Per il Fornitore**

- Nome: `[DA COMPILARE]`
- Ruolo: `[DA COMPILARE]`
- Data: `[DA COMPILARE]`
- Firma digitale: `[DA FIRMARE]`

---

## APPENDICE A — Dettaglio del trattamento

| Campo                          | Dettaglio                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Servizio                       | `[DA COMPILARE]`                                                             |
| Finalità                       | `[DA COMPILARE]`                                                             |
| Natura                         | `[raccolta / storage / elaborazione / trasmissione / cancellazione / altro]` |
| Categorie dati                 | `[DA COMPILARE]`                                                             |
| Categorie interessati          | `[DA COMPILARE]`                                                             |
| Volume stimato                 | `[DA COMPILARE]`                                                             |
| Durata trattamento             | Durata contratto                                                             |
| Base giuridica del Committente | `[contratto / obbligo legale / consenso / legittimo interesse]`              |

---

## APPENDICE B — Misure tecniche e organizzative

### B.1 Cifratura

- In transito: TLS 1.2 minimo (TLS 1.3 preferito)
- At-rest: AES-256 o equivalente
- Gestione chiavi: HSM o KMS con rotation policy

### B.2 Autenticazione e accessi

- 2FA obbligatorio per accessi amministrativi
- Principio minimo privilegio
- Revoca accessi entro 24h da cessazione rapporto

### B.3 Monitoraggio

- Log accessi
- Intrusion detection
- Alert anomalie

### B.4 Business continuity

- Backup cifrato con test di restore almeno trimestrale
- RTO: `[DA COMPILARE]`
- RPO: `[DA COMPILARE]`
- DR plan documentato e testato

### B.5 Vulnerability management

- Patching critici: `[entro N giorni dalla disclosure]`
- Vulnerability scan: almeno mensile
- Penetration test: almeno annuale da terzo indipendente

### B.6 Audit e compliance

- SOC2 Type II, ISO 27001, o equivalente — certificazione attiva
- Audit log conservati min 12 mesi
- Review annuale efficacia misure

### B.7 Personale

- Formazione privacy annuale obbligatoria
- Background check per ruoli sensibili
- Clausola riservatezza nei contratti

---

## APPENDICE C — Sub-responsabili autorizzati

Lista iniziale:

| #   | Sub-responsabile | Servizio         | Sede             | Certificazioni   |
| --- | ---------------- | ---------------- | ---------------- | ---------------- |
| 1   | `[DA COMPILARE]` | `[DA COMPILARE]` | `[DA COMPILARE]` | `[DA COMPILARE]` |
| ... | ...              | ...              | ...              | ...              |

Modifiche richiedono preavviso 30 giorni.

---

## APPENDICE D — Standard Contractual Clauses (se applicabili)

Se trasferimento extra-UE: allegare moduli SCC 2021/914 firmati + TIA documentata.

- Modulo: `[2 Controller-Processor / 3 Processor-Processor / 4 Processor-Controller]`
- Paese di destinazione: `[DA COMPILARE]`
- Misure supplementari: `[DA COMPILARE: cifratura con chiave EU-only / pseudonimizzazione / altro]`

---

_Template di conformità contrattuale. Da adattare al singolo sub-responsabile e firmare digitalmente con CAdES/PAdES. Archiviazione in `docs/legale/DPA/<fornitore>/<YYYY-MM-DD>-dpa-v<n>.md`._
