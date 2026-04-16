# Termini e Condizioni Generali di Contratto — digITAle

> **Versione**: 2.0 — 2026-04-16
> **Status**: BOZZA avanzata — da validare con avvocato prima della pubblicazione.
> **Natura**: contratto a distanza di fornitura di servizi digitali B2B e B2C, disciplinato dal diritto italiano.

---

## 1. Definizioni

| Termine                   | Significato                                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Titolare / Fornitore**  | `[DA COMPILARE]`, società di diritto italiano, P.IVA `[DA COMPILARE]`, con sede in `[DA COMPILARE]`                                 |
| **Servizio**              | La piattaforma SaaS denominata "digITAle" e tutte le sue funzioni, accessibile via `digitale-italia.netlify.app` e domini collegati |
| **Utente**                | La persona fisica o giuridica che sottoscrive il Servizio                                                                           |
| **Consumatore**           | Utente persona fisica che agisce per scopi estranei alla professione (art. 3 Codice del Consumo)                                    |
| **Professionista**        | Utente che agisce nell'esercizio di attività imprenditoriale, artigianale, libero-professionale                                     |
| **Piano**                 | Livello di servizio prescelto (Gratuito, Professionista, Impresa)                                                                   |
| **Contenuti dell'Utente** | Qualunque dato, file, documento, testo caricato dall'Utente sul Servizio                                                            |
| **Forza maggiore**        | Eventi eccezionali di cui all'art. 17.3                                                                                             |
| **SLA**                   | Service Level Agreement — vedi art. 8                                                                                               |

---

## 2. Oggetto del contratto

Il Fornitore mette a disposizione dell'Utente, dietro corrispettivo quando previsto, il Servizio digITAle, comprensivo di:

1. Gestione account e profilo fiscale
2. Emissione fatture elettroniche e invio al Sistema di Interscambio (SDI)
3. Ricezione fatture passive
4. Gestione clienti, scadenze, documenti
5. Conservazione a norma art. 44 CAD (decennale)
6. Integrazioni di pagamento (Stripe, Satispay)
7. AI vocale ove attivata dall'Utente
8. Supporto clienti via email/chat

**Natura del Servizio**: il Servizio è uno **strumento informatico**. Non sostituisce la consulenza di un commercialista, consulente del lavoro, avvocato, o altro professionista abilitato. Le dichiarazioni fiscali, i pagamenti di imposte e contributi restano sotto la piena e esclusiva responsabilità dell'Utente.

---

## 3. Formazione del contratto e accettazione

### 3.1 Registrazione

Il contratto si perfeziona al momento della conferma email di attivazione dell'account, previa:

- accettazione espressa dei presenti Termini (flag)
- accettazione espressa dell'Informativa Privacy (flag separato)
- per piani a pagamento: conferma del metodo di pagamento

### 3.2 Requisiti dell'Utente

- maggiore età (18 anni compiuti) e capacità di agire
- dati forniti veritieri, esatti, aggiornati (l'Utente si impegna a rettificarli tempestivamente)
- **per uso professionale**: P.IVA attiva, codice destinatario o PEC valido
- **per Consumatore**: codice fiscale valido

### 3.3 Natura contratto a distanza e diritto di recesso del Consumatore

Per il **Consumatore** si applicano gli artt. 45 ss. del Codice del Consumo (D.Lgs. 206/2005).

- **Diritto di recesso**: 14 giorni dalla conclusione del contratto, senza penale e senza obbligo di motivazione (art. 52)
- **Modulo di recesso**: allegato I del D.Lgs. 206/2005, disponibile in dashboard → Account → Recesso
- **Eccezione servizi digitali iniziati** (art. 59.1.o): se il Consumatore chiede espressamente l'inizio dell'esecuzione durante il periodo di recesso e riconosce la perdita del diritto al completamento, il recesso non è esercitabile dopo la piena esecuzione

**Prima di procedere** chiediamo all'Utente Consumatore una conferma esplicita se desidera iniziare immediatamente l'uso del Servizio rinunciando al diritto di recesso per la parte già eseguita.

---

## 4. Piani e corrispettivi

### 4.1 Listino

| Piano          | Prezzo mensile | Prezzo annuale (sconto)    | Destinatari                              |
| -------------- | -------------- | -------------------------- | ---------------------------------------- |
| Gratuito       | €0             | —                          | Chiunque, limite 5 fatture/mese          |
| Professionista | €7 + IVA       | €70 + IVA (2 mesi omaggio) | Freelance, partite IVA individuali       |
| Impresa        | €19 + IVA      | €190 + IVA                 | PMI multi-utente fino a 10 utenti        |
| Enterprise     | Personalizzato | Personalizzato             | Grandi aziende, pubblica amministrazione |

Prezzi in Euro, IVA esclusa (22% salvo regimi specifici). Addebiti via Stripe, Satispay, SEPA, bonifico bancario (solo Enterprise).

### 4.2 Modalità di pagamento

- **Automatica**: carta di credito/debito (tokenizzata Stripe), Satispay, SEPA Direct Debit
- **Manuale**: bonifico (solo piani annuali con pre-pagamento)
- **Fatturazione**: fattura elettronica emessa dal Fornitore entro 5 giorni dal pagamento

### 4.3 Ritardi di pagamento

- **Ritardo 0-7 gg**: reminder email, nessuna conseguenza
- **Ritardo 8-15 gg**: secondo reminder + sollecito PEC
- **Ritardo 16-30 gg**: sospensione del Servizio (dati preservati, accesso read-only per export)
- **Ritardo >30 gg**: diritto di risoluzione del contratto; dati esportabili per ulteriori 30 gg; poi cancellazione secondo `PRIVACY.md`

**Interessi di mora**: al tasso legale ex D.Lgs. 231/2002 per transazioni commerciali (Professionisti); al tasso legale civile per Consumatori.

### 4.4 Variazioni di prezzo

- **Preavviso minimo**: 30 giorni via email + dashboard
- **Diritto di recesso gratuito** se il nuovo prezzo non è accettato: comunicazione entro 15 giorni dalla notifica, cessazione al termine del periodo pagato
- **Aumenti per adeguamento costi documentati** (es. aumento IVA, rincari obbligatori): preavviso 30 giorni, non danno diritto speciale di recesso

---

## 5. Obblighi e diritti dell'Utente

### 5.1 Obblighi

L'Utente si impegna a:

1. Custodire le proprie credenziali di accesso; comunicare immediatamente eventuali accessi non autorizzati
2. Fornire dati veritieri e aggiornarli tempestivamente
3. Non usare il Servizio per attività illecite, truffaldine, riciclaggio, evasione fiscale, emissione di fatture per operazioni inesistenti (art. 8 D.Lgs. 74/2000)
4. Non tentare reverse engineering, scraping automatizzato, penetrazione non autorizzata, DDoS, ingegneria sociale
5. Non violare diritti di terzi nei Contenuti caricati (proprietà intellettuale, immagine, riservatezza)
6. Rispettare i limiti del Piano sottoscritto
7. Mantenere il proprio dispositivo/browser aggiornato per la sicurezza
8. Attivare 2FA dove obbligatoria

### 5.2 Diritti e proprietà dei Contenuti

**I Contenuti dell'Utente restano di piena proprietà dell'Utente**. Il Fornitore acquisisce unicamente la licenza strettamente necessaria a fornire il Servizio (hosting, backup, visualizzazione, invio a SDI, conservazione a norma).

- **Nessuna cessione** a terzi per finalità commerciali
- **Nessun addestramento di modelli AI** proprietari o di terzi sui Contenuti dell'Utente senza consenso esplicito separato
- **Diritto di esportare** sempre e senza oneri (formato JSON + XML FatturaPA + CSV)

---

## 6. Obblighi del Fornitore

### 6.1 Obblighi principali

1. Mantenere il Servizio disponibile secondo SLA (art. 8)
2. Adottare misure di sicurezza adeguate (art. 32 GDPR + ISO 27001 framework)
3. Conservare a norma le fatture per 10 anni (CAD art. 44)
4. Notificare tempestivamente variazioni contrattuali
5. Rispondere alle richieste dell'Utente secondo i tempi dichiarati
6. Notificare data breach entro 72h al Garante e senza ritardo all'Utente (artt. 33-34 GDPR)
7. Consentire export completo dei dati in qualsiasi momento
8. Operare nel rispetto del GDPR, del Codice Privacy, del CAD e delle normative fiscali italiane

### 6.2 Limiti tecnologici

Il Fornitore **non garantisce** (salvo quanto previsto da SLA):

- disponibilità continua in caso di **forza maggiore** (art. 17.3)
- corretto funzionamento di componenti di terzi (SDI, Stripe, provider PEC) al di fuori del proprio controllo
- l'interoperabilità con sistemi dell'Utente non compatibili o personalizzati

---

## 7. Limitazione di responsabilità

### 7.1 Responsabilità del Fornitore

Il Fornitore è responsabile per dolo e colpa grave; nei rapporti B2B la responsabilità per colpa lieve è limitata al **massimo di 12 mensilità del corrispettivo pagato** dall'Utente negli ultimi 12 mesi.

Per il Consumatore si applicano le disposizioni inderogabili del Codice del Consumo; le limitazioni di cui sopra non si applicano nei casi in cui la legge le vieti.

### 7.2 Esclusioni di responsabilità

Il Fornitore **non risponde** per:

1. Mancato invio SDI dovuto a blocchi o malfunzionamenti dell'Agenzia delle Entrate o del Sistema di Interscambio
2. Ritardi o errori dei provider di pagamento (Stripe, Satispay, banche)
3. Ritardi o errori dei provider PEC o di firma digitale
4. Danni derivanti dall'inesatta compilazione dei dati da parte dell'Utente
5. Danni derivanti dall'uso del Servizio in violazione dei presenti Termini o della legge
6. Danni derivanti da forza maggiore (art. 17.3)
7. Danni indiretti, consequenziali, perdita di profitto, perdita di chance, danno reputazionale, salvo dolo o colpa grave
8. Contenuti dell'Utente illeciti o che violino diritti di terzi

### 7.3 Manleva dell'Utente

L'Utente tiene indenne il Fornitore da qualunque pretesa di terzi derivante da violazione dei presenti Termini, della legge, o di diritti altrui, incluse spese legali ragionevoli.

### 7.4 Assicurazione

Il Fornitore mantiene polizza di **Cyber Liability Insurance** e **Professional Indemnity** con massimale adeguato al volume trattato, attestata e verificabile su richiesta (NDA eventuale).

---

## 8. Service Level Agreement (SLA)

### 8.1 Disponibilità

- **Target**: 99.5% mensile calcolato su base rolling 30 giorni (piani Professionista/Impresa); 99.9% (Enterprise su contratto separato)
- **Esclusioni**: manutenzione programmata (comunicata con 48h anticipo, max 4h/mese), forza maggiore, mancata disponibilità di provider di terzi (SDI, AdE)
- **Monitoraggio**: status page pubblica `status.digitale-italia.it`

### 8.2 Credit SLA

In caso di downtime superiore allo SLA:

| Disponibilità effettiva | Credit sulla fattura mensile |
| ----------------------- | ---------------------------- |
| < 99.5% e ≥ 99.0%       | 10%                          |
| < 99.0% e ≥ 95.0%       | 25%                          |
| < 95.0%                 | 50%                          |

Credit calcolato automaticamente ed emesso come nota di credito entro il ciclo di fatturazione successivo.

### 8.3 Tempi di risposta supporto

| Severità | Descrizione                      | Risposta                    | Risoluzione target |
| -------- | -------------------------------- | --------------------------- | ------------------ |
| P1       | Servizio giù, dati inaccessibili | 1 ora (h24 Professionista+) | 4 ore              |
| P2       | Funzione critica degradata       | 4 ore (giorni lavorativi)   | 1 giorno           |
| P3       | Bug non bloccante                | 1 giorno lavorativo         | Prossimo rilascio  |
| P4       | Richiesta feature, domanda       | 3 giorni lavorativi         | Best effort        |

---

## 9. Conservazione fatture a norma (CAD art. 44)

Per i piani che includono conservazione a norma:

- Conservazione per **10 anni** dalla data di emissione
- Firma elettronica qualificata o digitale del Titolare applicata al pacchetto di conservazione
- Marca temporale di ogni versamento
- Processo conforme al DPCM 13/11/2014 e alle Linee Guida AgID 2020
- **Manuale della conservazione** disponibile in `docs/legale/MANUALE_CONSERVAZIONE.md`
- In caso di cessazione del rapporto, il Fornitore consegna all'Utente il pacchetto di conservazione integrale (formato standard UNI 11386 "SInCRO") entro 60 giorni; obbligo di conservazione decennale resta comunque in capo all'Utente

---

## 10. Recesso e risoluzione

### 10.1 Recesso dell'Utente

- In qualsiasi momento dalla dashboard
- **Effetto**: cessazione al termine del periodo di fatturazione in corso
- **Rimborso pro-rata**: solo per piani annuali e su decisione espressa dell'Utente; in mancanza, il credito resta disponibile fino alla scadenza
- **Nessuna penale**

### 10.2 Recesso del Fornitore

- Preavviso **90 giorni** via email e PEC
- Motivi: cessazione del Servizio, ristrutturazione, ragioni tecniche o economiche oggettive
- Rimborso pro-rata automatico

### 10.3 Risoluzione per inadempimento

Costituiscono clausole **risolutive espresse** (art. 1456 c.c.) che legittimano il Fornitore a risolvere il contratto di diritto:

a. Violazione obblighi di cui all'art. 5.1 punti 3, 4, 5 (uso illecito, reverse engineering, violazione diritti terzi)
b. Ritardo pagamento > 30 giorni
c. Dichiarazioni false sui requisiti di accesso
d. Condotta che comprometta la sicurezza del Servizio o di altri Utenti

Il Fornitore comunica la risoluzione via email e PEC; l'Utente ha 30 giorni per export dati e diritto di opposizione documentata.

---

## 11. Proprietà intellettuale

- **Del Fornitore**: software, design, marchio "digITAle", logo tricolore, documentazione, interfaccia
- **Dell'Utente**: Contenuti caricati, dati fiscali, documenti
- **Licenza al Fornitore**: limitata, non esclusiva, non trasferibile, funzionale al Servizio
- **Open source**: alcuni componenti del core saranno rilasciati con licenza AGPL/EUPL (annuncio preventivo)

**Divieto**: riproduzione, modifica, distribuzione, sublicenza del software del Fornitore senza autorizzazione scritta, salvo eccezioni di legge.

---

## 12. Riservatezza

Ciascuna parte si impegna alla riservatezza di informazioni riservate ricevute dall'altra, per la durata del contratto e per 5 anni dopo la cessazione. Esclusi: informazioni pubbliche, note prima della comunicazione, sviluppate indipendentemente, o comunicabili per obbligo di legge.

---

## 13. Modifiche ai Termini

### 13.1 Modifiche non sostanziali

Comunicate via email con 15 giorni di preavviso. Continuazione dell'uso del Servizio vale come accettazione.

### 13.2 Modifiche sostanziali

(Es. nuove categorie di dati trattati, aumento materiale di prezzo, riduzione garanzie, modifiche sfavorevoli alle limitazioni di responsabilità):

- **Preavviso**: 30 giorni via email + banner dashboard
- **Consenso esplicito richiesto** per consumatori
- **Diritto di recesso gratuito** se non accettate, cessazione a termine del periodo pagato
- **Mancata risposta**: si applica il regime più favorevole all'Utente fino alla scadenza del periodo pagato

---

## 14. Cessione del contratto

- **Utente → terzi**: richiede consenso scritto del Fornitore
- **Fornitore → terzi**: ammessa in caso di operazioni straordinarie (fusione, scissione, cessione ramo d'azienda), con preavviso 60 giorni via email e PEC; l'Utente ha diritto di recesso gratuito se il cessionario non garantisce condizioni equivalenti

---

## 15. Legge applicabile e foro competente

### 15.1 Legge applicabile

**Legge italiana**, con esclusione delle norme sul conflitto di leggi, senza pregiudizio delle norme inderogabili del paese di residenza del Consumatore (Reg. UE 593/2008 Roma I).

### 15.2 Foro competente

- **B2B**: Foro di `[DA COMPILARE — sede del Fornitore]`, esclusivamente competente
- **Consumatore**: foro di residenza del Consumatore (art. 66-bis Codice del Consumo, inderogabile)

### 15.3 ODR e ADR (Consumatori)

Il Consumatore può utilizzare la piattaforma **ODR** della Commissione UE: https://ec.europa.eu/consumers/odr

In alternativa, procedura di **mediazione** obbligatoria presso organismo accreditato prima dell'azione giudiziale (D.Lgs. 28/2010 modificato dal D.Lgs. 149/2022), salvo azioni cautelari.

### 15.4 Clausola compromissoria (solo B2B e solo se accettata con doppia sottoscrizione art. 1341 c.c.)

Le parti Professioniste possono, con accordo separato, devolvere le controversie ad arbitrato amministrato dalla Camera di Arbitrato di `[sede]` secondo il suo regolamento.

---

## 16. Clausole specifiche ex artt. 1341-1342 c.c. (B2B)

Ai sensi e per gli effetti degli artt. 1341 e 1342 c.c., l'Utente Professionista dichiara di aver letto e **specificamente approvato** le seguenti clausole:

- Art. 4.3 (Ritardi di pagamento e interessi di mora)
- Art. 4.4 (Variazioni di prezzo)
- Art. 7 (Limitazione di responsabilità)
- Art. 7.3 (Manleva dell'Utente)
- Art. 8.2 (Credit SLA cap)
- Art. 10.3 (Clausole risolutive espresse)
- Art. 13.2 (Modifiche sostanziali)
- Art. 14 (Cessione del contratto)
- Art. 15.2 (Foro competente)
- Art. 15.4 (Clausola compromissoria, se accettata)

---

## 17. Disposizioni finali

### 17.1 Validità parziale (severability)

La nullità di una singola clausola non compromette la validità del contratto nel suo complesso; le parti si impegnano a sostituire la clausola con altra di effetti equivalenti conformi alla legge.

### 17.2 Tolleranza

La tolleranza di una parte a violazioni dell'altra non costituisce rinuncia a far valere i diritti derivanti dai presenti Termini.

### 17.3 Forza maggiore

Sono considerati eventi di forza maggiore che sospendono l'obbligazione: calamità naturali, atti di guerra, terrorismo, pandemie, ordini di autorità, scioperi generali, interruzioni di rete o energia non imputabili, attacchi cibernetici di entità straordinaria, malfunzionamenti di infrastrutture pubbliche (SDI, AdE, identità digitale). La parte impattata notifica all'altra senza ritardo. Se l'evento persiste > 60 giorni entrambe le parti possono recedere senza penale.

### 17.4 Comunicazioni

- **All'Utente**: email di registrazione (primario), dashboard, PEC se indicata
- **Al Fornitore**: email legale@digitale-italia.it + PEC `[DA COMPILARE]`

### 17.5 Lingua

Italiano. In caso di traduzione, fa fede la versione italiana.

### 17.6 Hash e versione

Hash SHA-256 del documento: `[generato al commit]`
Versione: 2.0 — 2026-04-16
Storico versioni: `/termini/versioni`

---

_Accettando i presenti Termini, l'Utente dichiara di averli letti integralmente, compresi e liberamente accettati._
