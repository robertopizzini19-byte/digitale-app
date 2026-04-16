# Cookie Policy — digITAle

> **Versione**: 2.0 — 2026-04-16
> **Status**: BOZZA avanzata — validata contro Provvedimento del Garante del 10 giugno 2021 e Linee Guida EDPB 03/2022 sui dark pattern nei consensi.

---

## 1. Premessa e principi

digITAle adotta un approccio **privacy-first**:

- Nessun cookie non strettamente necessario **prima** del consenso
- Consenso **granulare** per categoria (non tutto-o-niente)
- Rifiuto **equivalente** per effort: "Accetta tutti" e "Rifiuta tutti" hanno identica prominenza visiva, stessa dimensione, stesso colore (no dark pattern)
- Persistenza scelte **12 mesi** poi richiesta di aggiornamento
- Modifica consensi **sempre** accessibile da un link permanente a piè di pagina
- **Zero cookie di terze parti** a fini di advertising / tracking cross-site
- Preferenze utente archiviate con **hash tamper-evident** per prova di consenso (art. 7 GDPR)

---

## 2. Cosa sono i cookie e tecnologie simili

Sono piccoli file di testo o identificativi salvati sul dispositivo dell'Utente (browser, app) dal sito o da terzi. Questa Policy copre:

- **Cookie HTTP** (memoria persistente o di sessione del browser)
- **Local storage / Session storage** del browser
- **IndexedDB**
- **Pixel/Web beacon** (quando usati)
- **Identificativi basati su fingerprint** (NON usati da digITAle, mai, per qualsiasi finalità)

---

## 3. Categorie di cookie usati

### 3.1 Tecnici (strettamente necessari) — **sempre attivi**

Non richiedono consenso ex art. 122 Codice Privacy. Servono al funzionamento base.

| Nome                     | Tipologia             | Scopo                            | Durata          | Emittente              |
| ------------------------ | --------------------- | -------------------------------- | --------------- | ---------------------- |
| `digitale-auth`          | Cookie + localStorage | Token sessione autenticata       | Durata sessione | digITAle (primo parte) |
| `sb-<ref>-auth-token`    | localStorage          | Token JWT Supabase               | 1 ora           | Supabase (tecnico)     |
| `sb-<ref>-refresh-token` | localStorage          | Rinnovo sessione                 | 7 giorni        | Supabase (tecnico)     |
| `__csrf`                 | Cookie HttpOnly       | Protezione CSRF                  | Durata sessione | digITAle               |
| `consent-v1`             | Cookie                | Ricorda le scelte di consenso    | 12 mesi         | digITAle               |
| `consent-hash`           | Cookie                | Hash tamper-evident del consenso | 12 mesi         | digITAle               |
| `nf-geo`, `nf-ab`        | Cookie                | Routing CDN / A-B testing infra  | Durata sessione | Netlify (tecnico CDN)  |

### 3.2 Analitici anonimi — **opt-in esplicito**

Usiamo **Plausible Analytics** (EU, GDPR-first, cookieless by design). In modalità privacy-first **non attiviamo cookie** per analytics. Se in futuro attivassimo cookie analytics, sarebbero:

| Nome     | Scopo                             | Durata | Emittente | Anonimizzazione                |
| -------- | --------------------------------- | ------ | --------- | ------------------------------ |
| `_pa_id` | Identificativo sessione aggregata | 24h    | Plausible | IP troncato, no fingerprinting |

**Finalità**: capire quali pagine sono utili, dove gli utenti si bloccano, priorità di miglioramento. Dati in forma aggregata, mai individuale.

### 3.3 Funzionali — **opt-in esplicito**

Servizi che migliorano l'esperienza ma non sono necessari.

| Nome                  | Scopo                        | Durata    | Emittente |
| --------------------- | ---------------------------- | --------- | --------- |
| `ui-theme`            | Preferenza tema chiaro/scuro | 12 mesi   | digITAle  |
| `ui-lang`             | Lingua preferita (IT/EN)     | 12 mesi   | digITAle  |
| `dismiss-banner-<id>` | Banner già visto             | 30 giorni | digITAle  |

### 3.4 Marketing — **opt-in esplicito**

Attualmente **non attivi**. digITAle non usa cookie di marketing o retargeting.

Se in futuro attiveremo campagne pubblicitarie, **chiederemo nuovamente il consenso** con banner di refresh e informativa aggiornata. Nessun consenso precedente potrà essere riusato per finalità di marketing aggiuntive.

### 3.5 Profilazione — **opt-in esplicito**

Utilizzo: raccomandazioni personalizzate nella dashboard (es. suggerimenti scadenze fiscali, pattern d'uso).

**Non attivi per default**. **Nessuna profilazione con effetti legali/significativi** (art. 22 GDPR).

L'Utente può disattivarli in qualsiasi momento; l'effetto è immediato e irreversibile solo per il futuro (i dati di profilazione storici vengono cancellati entro 30 gg).

---

## 4. Cookie di terze parti

Solo servizi tecnicamente necessari al funzionamento di funzioni specifiche:

| Terza parte | Scopo                           | Attivazione          | Dove leggere la loro policy     |
| ----------- | ------------------------------- | -------------------- | ------------------------------- |
| Supabase    | Autenticazione + DB             | All'uso del servizio | https://supabase.com/privacy    |
| Netlify     | Hosting + CDN                   | Accesso al sito      | https://www.netlify.com/privacy |
| Stripe      | Checkout pagamenti              | Solo al checkout     | https://stripe.com/it/privacy   |
| Plausible   | Analytics anonimi (se consenso) | Solo se opt-in       | https://plausible.io/privacy    |
| Sentry      | Error monitoring (senza PII)    | All'uso del servizio | https://sentry.io/privacy       |

**Nessuno** di questi usa i cookie per finalità di marketing cross-site o profilazione pubblicitaria.

---

## 5. Gestione del consenso

### 5.1 Prima visita

All'atto della prima visita, l'Utente riceve un **banner** non intrusivo con:

- Accetta tutti
- Rifiuta tutti
- Personalizza (panel con toggle per categoria)

**Entrambi i pulsanti Accetta/Rifiuta hanno identica prominenza visiva** (stessa dimensione, stesso colore, stessa posizione — nessun dark pattern).

Fino alla scelta, **nessun cookie non strettamente necessario viene installato**. La navigazione può proseguire anche senza scelta (scroll non implica consenso).

### 5.2 Modifica e revoca

L'Utente può modificare le scelte in qualsiasi momento:

- Link permanente **"Gestione cookie"** a piè di pagina su tutte le pagine
- Dashboard → Privacy → Gestione cookie
- Comando browser console (per power user): `window.digitale.consent.reset()`

La revoca è **immediata**: i cookie attivi vengono immediatamente cancellati e le richieste di terze parti sospese.

### 5.3 Prova del consenso

digITAle archivia:

- **Timestamp** del consenso
- **Versione** della Policy accettata
- **Hash SHA-256** tamper-evident delle scelte effettuate
- **IP pseudonimizzato** al momento del consenso
- **User-agent**

Questa prova è conservata per **10 anni dalla revoca** (art. 7 GDPR — prova di conformità).

### 5.4 Rinnovo periodico

Ogni **12 mesi** viene richiesto un nuovo consenso attivo. La mancata risposta comporta il ritorno allo stato privacy-first (solo cookie tecnici attivi).

### 5.5 Consent storage format

Le scelte dell'Utente sono archiviate in formato strutturato compatibile con **IAB TCF v2.2** (laddove applicabile) per interoperabilità con subprocessor conformi.

---

## 6. Come disabilitare i cookie dal browser

| Browser | Percorso                          |
| ------- | --------------------------------- |
| Chrome  | `chrome://settings/cookies`       |
| Firefox | `about:preferences#privacy`       |
| Safari  | Preferenze → Privacy              |
| Edge    | `edge://settings/content/cookies` |
| Brave   | `brave://settings/privacy`        |

**Attenzione**: disabilitare i cookie tecnici **impedisce l'uso** del Servizio (autenticazione non funziona). Il Fornitore non ne risponde.

---

## 7. Diritti dell'Utente

Si rinvia all'[Informativa Privacy](./PRIVACY.md) per l'esercizio dei diritti di cui agli artt. 15-22 GDPR.

Per le preferenze cookie:

- **Accesso**: visualizzabili in dashboard → Privacy → Gestione cookie
- **Cancellazione**: revoca istantanea
- **Portabilità**: export JSON in dashboard → Privacy → "Esporta cookie preferences"

---

## 8. Contatti

- privacy@digitale-italia.it
- dpo@digitale-italia.it
- PEC: `[DA COMPILARE]`

---

## 9. Aggiornamenti

- **Versione corrente**: 2.0 — 2026-04-16
- **Prossima revisione**: 2027-04-16 o in caso di modifiche sostanziali
- **Hash SHA-256**: `[generato al commit]`
- **Storico**: `/cookie/versioni`

Le modifiche che introducono nuove categorie di cookie richiedono un **nuovo consenso attivo** (il precedente non si estende per default).
