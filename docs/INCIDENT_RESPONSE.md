# Incident Response Playbook — digITAle

Guida operativa in caso di incidente di sicurezza. Da seguire in ordine.

## Severità

| Livello | Criterio                                                                          | Response time |
| ------- | --------------------------------------------------------------------------------- | ------------- |
| **P0**  | Data breach confermato, servizio giù per >30min, credenziali admin esposte        | <15 min       |
| **P1**  | Tentativo di breach attivo, servizio degradato, vulnerabilità critica sfruttabile | <1 h          |
| **P2**  | Vulnerabilità segnalata da ricercatore, log anomali, prestazioni degradate        | <24 h         |
| **P3**  | Dependabot alert, potenziale miglioramento sicurezza                              | <7 gg         |

## Chi fa cosa

- **Incident Commander (IC)**: Roberto Pizzini (o delegato)
- **Scribe**: chiunque presente — aggiorna questo file con timeline eventi
- **Comms**: IC decide chi comunica con utenti/garante

## Playbook P0/P1 (data breach sospetto o confermato)

### 1. Contenimento (0-60 min)

- [ ] Disabilita accesso ai service role key compromessi: ruota subito su Supabase Dashboard
- [ ] Forza logout globale: `update auth.users set ... ` via SQL (dettagli sotto)
- [ ] Se breach attivo: metti il sito in modalità manutenzione (Netlify UI → Site settings → Deploy off)
- [ ] Preserva i log: scarica `audit_log` ultime 72h, snapshot DB, export Netlify access log

### 2. Investigazione (1-24h)

- [ ] Apri `supabase/tests/rls_isolation.sql` → ri-esegui per confermare RLS integrità
- [ ] Query `audit_log` per pattern anomali (IP sospetti, volume eccessivo, accessi da nuova location)
- [ ] Verifica GitHub Actions log per secret leak nei commit recenti
- [ ] Controlla Dependabot per CVE pubblicati nelle deps

### 3. Notifica (entro 72h se breach confermato — GDPR art. 33)

- [ ] **Garante Privacy**: breach notification via https://servizi.gpdp.it (obbligo <72h)
- [ ] **Utenti impattati**: email italiana chiara, senza minimizzare
- [ ] **Status page**: aggiorna pubblicamente lo stato
- [ ] **Template notifica** vedi `docs/legale/BREACH_NOTIFICATION.md` (TODO)

### 4. Recovery

- [ ] Ripristina da backup se dati compromessi
- [ ] Ruota TUTTI i secret (Supabase, Netlify, Stripe, GitHub PAT)
- [ ] Rivalida RLS con test penetration completi
- [ ] Rimetti online incrementalmente: staging → canary → full

### 5. Post-mortem (entro 7 giorni)

- [ ] Timeline eventi (quando, chi, cosa)
- [ ] Root cause (non "umano", ma sistemico)
- [ ] Lesson learned → nuova regola preventiva
- [ ] Archivia in `docs/post-mortems/YYYY-MM-DD-incident.md`

## Query utili

```sql
-- Forza logout globale
update auth.sessions set not_after = now() where not_after > now();

-- Pattern accessi anomali ultime 24h
select ip_origine, count(*) as n
from public.audit_log
where creato_il > now() - interval '24 hours'
group by ip_origine
order by n desc
limit 20;

-- Chi ha letto/modificato cosa nelle ultime 2h
select user_id, tabella, azione, count(*)
from public.audit_log
where creato_il > now() - interval '2 hours'
group by 1, 2, 3
order by 4 desc;
```

## Contatti

- Garante Privacy: https://www.garanteprivacy.it (breach notification obbligatoria <72h)
- CERT-AgID (pubblica amministrazione): https://cert-agid.gov.it
- Polizia Postale (frode/crimine cibernetico): https://www.commissariatodips.it
