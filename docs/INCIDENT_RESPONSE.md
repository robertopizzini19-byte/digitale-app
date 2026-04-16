# Incident Response Playbook — digITAle

> **Versione**: 2.0 — 2026-04-16
> **Classificazione**: INTERNAL — distribuzione controllata al team
> **Approvazione**: Titolare del trattamento + DPO + CTO
> **Revisione**: annuale o post-incident significativo
> **Framework di riferimento**: NIST SP 800-61r2, ENISA Good Practices, NIS2 (D.Lgs. 138/2024)

---

## 1. Scopo e ambito

Procedura operativa per rilevare, contenere, sradicare, recuperare e imparare da incidenti di sicurezza informatica e data breach.

Ambito: tutti gli asset digITAle — database, frontend, edge functions, integrazioni (SDI, Stripe, PEC), account amministrativi, repository, pipeline CI/CD.

---

## 2. Definizioni

| Termine       | Significato                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Evento**    | Qualsiasi occorrenza osservabile in un sistema (anche normale)                                                   |
| **Alert**     | Evento che richiede valutazione                                                                                  |
| **Incidente** | Violazione o minaccia imminente alle policy di sicurezza, all'uso accettabile o alle pratiche di sicurezza       |
| **Breach**    | Incidente confermato che comporta compromissione di **riservatezza, integrità, disponibilità** di dati personali |
| **IC**        | Incident Commander, responsabile delle decisioni durante l'incidente                                             |
| **CSIRT**     | Computer Security Incident Response Team (da formalizzare a 10 dipendenti)                                       |
| **RTO**       | Recovery Time Objective — tempo massimo accettabile di fermo                                                     |
| **RPO**       | Recovery Point Objective — perdita dati massima accettabile                                                      |
| **MTTD**      | Mean Time To Detect                                                                                              |
| **MTTR**      | Mean Time To Respond                                                                                             |

---

## 3. Ruoli e responsabilità

| Ruolo                       | Chi                                                         | Responsabilità                                   |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| **Incident Commander (IC)** | Roberto Pizzini (Titolare) o delegato (CTO quando nominato) | Decisioni operative, priorità, escalation        |
| **Technical Lead**          | Sviluppatore di turno                                       | Analisi tecnica, contenimento, remediation       |
| **Scribe**                  | Membro del team presente                                    | Timeline, log, chain of custody                  |
| **Comms Lead**              | IC o Marketing (quando nominato)                            | Comunicazioni interne ed esterne                 |
| **Legal Lead**              | Avvocato di fiducia                                         | Valutazione obblighi, rischi, notifiche autorità |
| **DPO**                     | `[DA NOMINARE]`                                             | Valutazione impatto privacy, notifica Garante    |

**H24**: il primo contatto reperibile è Roberto Pizzini. Rotazione on-call a 3+ membri quando il team cresce.

---

## 4. Severity matrix

| Severità       | Criteri                                                                                            | Response time MTTR |
| -------------- | -------------------------------------------------------------------------------------------------- | ------------------ |
| **SEV-0 (P0)** | Data breach confermato con PII, servizio giù >30 min, compromissione credenziali admin, ransomware | **15 minuti**      |
| **SEV-1 (P1)** | Attacco in corso, servizio degradato, vuln. critica sfruttabile, data leak sospetto                | **1 ora**          |
| **SEV-2 (P2)** | Vulnerabilità segnalata da ricercatore, anomalie log, performance gravemente degradate             | **24 ore**         |
| **SEV-3 (P3)** | Dependabot CVE alto, miglioramenti sicurezza, near-miss                                            | **7 giorni**       |

### 4.1 RTO / RPO target

| Componente            | RTO    | RPO                     |
| --------------------- | ------ | ----------------------- |
| Frontend statico      | 15 min | 0 (CDN)                 |
| Auth (Supabase)       | 1 h    | 5 min                   |
| Database operativo    | 4 h    | 1 h                     |
| Conservazione a norma | 24 h   | 0 (archivio immutabile) |
| Edge functions        | 2 h    | 0 (git)                 |

---

## 5. Ciclo di vita incident (NIST)

```
  Prepare → Detect → Analyze → Contain → Eradicate → Recover → Lessons Learned
       ↑________________________________________________________↓
```

### 5.1 Prepare (continuo)

- [ ] Playbook aggiornato ogni 6 mesi
- [ ] Tabletop exercise trimestrale (scenari: ransomware, data leak, DoS, insider)
- [ ] Backup verificati ogni mese (test restore su staging)
- [ ] Contatti emergenza aggiornati (sotto)
- [ ] Access control review trimestrale
- [ ] Pentest annuale esterno + automatico settimanale (RLS isolation test)

### 5.2 Detect

Sorgenti di rilevamento:

1. **Automatico**: Sentry alert, Supabase anomaly detection, UptimeRobot down-alert, GitHub security advisory, Dependabot
2. **Manuale**: segnalazione utente (supporto), segnalazione ricercatore (`security.txt`), audit interno
3. **Esterno**: CERT-AgID, Polizia Postale, fornitore di hosting

**Ogni alert → ticket nel sistema (GitHub Issues label "incident") con timestamp.**

### 5.3 Analyze (contenimento minuto 0-60)

Decisioni da prendere nei primi 60 minuti:

- [ ] Quale sistema è coinvolto?
- [ ] Tipo di incidente (breach, abuse, DoS, malware, misconfig, insider)?
- [ ] Dati coinvolti? (quali categorie, quanti soggetti)
- [ ] Severity (SEV-0..3)?
- [ ] È ancora attivo?
- [ ] Serve escalation legale/DPO/autorità?

**Prima comunicazione interna**: canale dedicato (Slack/Telegram `#incidents`) con:

- Timestamp
- Severity
- Sistema coinvolto
- IC assegnato
- Link al ticket

### 5.4 Contain (minuto 15-180)

Contenimento a breve termine:

- [ ] Isolare sistema compromesso (disable user, block IP, shutdown function)
- [ ] Ruotare secret compromessi: Supabase service role key, Netlify auth token, Stripe restricted key, GitHub PAT, SMTP credentials
- [ ] Forzare logout globale se sessioni compromesse:
  ```sql
  update auth.sessions set not_after = now() where not_after > now();
  ```
- [ ] Attivare modalità manutenzione se necessario (Netlify UI → Deploys → Lock deploys)
- [ ] Preservare **chain of custody**:
  - Snapshot volumi interessati (nome file: `YYYY-MM-DD-HH-<component>-snapshot`)
  - Export `audit_log` ultime 72h → archivio sigillato S3/equivalente
  - Export Netlify access log 72h
  - Screenshots timestamp
  - Checksum SHA-256 per ogni artefatto, loggato in `docs/incidents/YYYY-MM-DD-<id>/CHAIN_OF_CUSTODY.md`

**Non contaminare la scena**: prima si preservano le prove, poi si modifica lo stato.

### 5.5 Eradicate (ora 1-24)

- [ ] Patch della vulnerabilità (codice, config, permessi)
- [ ] Verificare assenza di persistenza (backdoor, account rogue, scheduled job, webhook aggiunti)
- [ ] Re-deploy da fonte pulita (`main` commit known-good)
- [ ] Validare remediation con RLS penetration test (`supabase/tests/rls_isolation.sql`)
- [ ] Eventuale rollback a backup pulito verificato

### 5.6 Recover (ora 4-72)

Ripristino incrementale:

1. **Staging**: verifica end-to-end su staging
2. **Canary**: 5% del traffico per 30 min
3. **Full**: roll-out completo
4. **Post-deploy**: monitoraggio intensificato 48h

**Dual-control**: operazioni di recovery critiche richiedono l'approvazione di **2 persone** (IC + Technical Lead).

### 5.7 Lessons learned (giorno 1-7)

**Post-mortem entro 7 giorni**, archiviato in `docs/post-mortems/YYYY-MM-DD-<id>.md`:

- Timeline dettagliata (quando, chi, cosa)
- **Root cause** (non "umano": causa sistemica che ha permesso l'errore umano)
- **5-Whys** applicato
- Impact assessment (utenti toccati, dati esposti, downtime, costo)
- Azioni correttive con owner e deadline
- Lezione permanente → aggiunta a questo playbook

**Blameless**: il post-mortem analizza sistemi e processi, non persone. L'obiettivo è imparare, non punire.

---

## 6. Notifiche obbligatorie

### 6.1 Al Garante Privacy (entro 72h dalla conoscenza, art. 33 GDPR)

**Obbligo**: sempre, salvo improbabilità di rischio per i diritti/libertà delle persone (documentare la valutazione).

**Canale**: https://servizi.gpdp.it → "Comunicazione violazioni dati personali"

**Contenuto obbligatorio** (art. 33.3 GDPR):

- Natura della violazione
- Categorie e numero approssimativo di interessati
- Categorie e numero approssimativo di record
- Nome e contatti DPO
- Probabili conseguenze
- Misure adottate o proposte
- Se notifica differita oltre 72h: motivazione del ritardo

**Template pronto**: `docs/legale/BREACH_NOTIFICATION.md`

### 6.2 Agli interessati (senza ingiustificato ritardo, art. 34 GDPR)

**Obbligo**: quando la violazione è suscettibile di presentare un rischio **elevato** per diritti/libertà.

**Esonero**: se sono state applicate misure appropriate (cifratura) o se il rischio è stato eliminato post-fatto, oppure se comporterebbe sforzi sproporzionati (in tal caso: comunicazione pubblica).

**Contenuto**:

- Natura della violazione (chiara, comprensibile, senza minimizzare)
- Nome e contatti DPO
- Conseguenze probabili
- Misure adottate
- Raccomandazioni per l'interessato (es. cambio password, vigilanza conto)

**Canale**: email all'indirizzo di registrazione + messaggio in dashboard

### 6.3 Ad altre autorità

| Autorità                                          | Quando                                                    | Canale                           |
| ------------------------------------------------- | --------------------------------------------------------- | -------------------------------- |
| **Polizia Postale**                               | Sospetto reato (frode, accesso abusivo art. 615-ter c.p.) | https://www.commissariatodips.it |
| **Procura della Repubblica**                      | Reato grave                                               | Denuncia diretta                 |
| **CERT-AgID**                                     | Se il Titolare rientra negli ambiti                       | https://cert-agid.gov.it         |
| **ACN (Agenzia per la Cybersicurezza Nazionale)** | NIS2 applicabile                                          | https://www.acn.gov.it           |

### 6.4 Comunicazione pubblica (trasparenza)

Anche quando non obbligatoria, digITAle pubblica incident report aggregati anonimizzati su `/trasparenza/incidenti` come scelta di trasparenza radicale.

---

## 7. Chain of custody e supporto forense

Per ogni artefatto raccolto durante l'incidente:

```markdown
# Artefatto: <nome-file>

- Raccolto da: <nome>
- Data/ora: <ISO8601 + TZ>
- Sorgente: <sistema>
- SHA-256: <hash>
- Custodia: <dove archiviato>
- Accessi successivi: <lista con timestamp>
- Scopo: <breach-analysis, litigation-hold, fiscal>
```

Archivio: bucket cifrato dedicato, write-once, access log separato e review mensile.

---

## 8. Query SQL utili per investigation

```sql
-- Forzare logout globale
update auth.sessions set not_after = now() where not_after > now();

-- Revocare refresh token tutti
delete from auth.refresh_tokens where created_at < now() - interval '0 seconds';

-- Pattern accessi anomali ultime 24h per IP
select ip_origine, count(*) as n, array_agg(distinct user_id) as utenti
from public.audit_log
where creato_il > now() - interval '24 hours'
group by ip_origine
order by n desc
limit 20;

-- Attività utente sospetto
select creato_il, tabella, azione, record_id, dati_dopo - dati_prima as diff
from public.audit_log
where user_id = '<uuid-sospetto>'
order by creato_il desc
limit 200;

-- Identificare record toccati da un certo IP
select tabella, record_id, count(*)
from public.audit_log
where ip_origine = '<ip-sospetto>'
  and creato_il > now() - interval '24 hours'
group by 1, 2
order by 3 desc;

-- Accessi falliti di autenticazione (se loggati in tabella custom)
select ip_origine, email_tentata, count(*)
from public.auth_failures
where creato_il > now() - interval '1 hour'
group by 1, 2
having count(*) > 5
order by 3 desc;
```

---

## 9. Contatti emergenza

| Entità                            | Canale                                           | Note                       |
| --------------------------------- | ------------------------------------------------ | -------------------------- |
| **Roberto Pizzini** (IC primario) | `[tel]` / email                                  | Reperibile H24 per SEV-0/1 |
| **DPO**                           | dpo@digitale-italia.it                           |                            |
| **Avvocato**                      | `[studio]`                                       | Litigation hold, notifiche |
| **Supabase Security**             | security@supabase.com                            | DB compromise              |
| **Netlify Security**              | security@netlify.com                             | Hosting compromise         |
| **Stripe Security**               | https://stripe.com/contact/email                 | Payment fraud              |
| **Garante Privacy**               | +39 06 696771 / protocollo@pec.gpdp.it           | Breach notification        |
| **CERT-AgID**                     | info@cert-agid.gov.it                            | Supporto tecnico           |
| **Polizia Postale**               | 113 (urgenze) / https://www.commissariatodips.it | Reato informatico          |
| **ACN**                           | info@acn.gov.it                                  | NIS2                       |

---

## 10. Test e manutenzione

| Attività                         | Frequenza      | Responsabile          |
| -------------------------------- | -------------- | --------------------- |
| Review playbook                  | 6 mesi         | IC + DPO              |
| Tabletop exercise                | 3 mesi         | IC                    |
| Restore da backup                | 1 mese         | Technical Lead        |
| Pentest interno automatico (RLS) | Ad ogni deploy | CI                    |
| Pentest esterno                  | 12 mesi        | Fornitore certificato |
| Access review                    | 3 mesi         | IC                    |
| Contact list update              | 3 mesi         | IC                    |

---

## 11. Metriche

Tracciate per maturity assessment:

- **MTTD** (Mean Time to Detect) — target <15 min per alert automatici
- **MTTR** (Mean Time to Respond) — target <1h SEV-1
- **MTTResolve** — target <24h SEV-1
- Numero incident per severity / trimestre
- Numero breach confermati / trimestre
- Percentuale post-mortem completati entro 7 gg
- Numero azioni correttive aperte >30 gg (target: 0)

Dashboard interna: `/admin/security-metrics`.

---

## 12. Appendice: BCP / DRP link

- Business Continuity Plan: `docs/legale/BCP.md` `[DA CREARE]`
- Disaster Recovery Plan: `docs/legale/DRP.md` `[DA CREARE]`
- Manuale della Conservazione: `docs/legale/MANUALE_CONSERVAZIONE.md` `[DA CREARE]`

---

_Documento riservato. Distribuzione controllata. Hash SHA-256 versione: `[generato al commit]`._
