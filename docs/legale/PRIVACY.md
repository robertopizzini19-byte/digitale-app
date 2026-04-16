# Informativa Privacy — digITAle

> **Status**: BOZZA da validare con avvocato (DPO) prima di pubblicazione.
> **Base normativa**: GDPR 2016/679, Codice Privacy D.Lgs 196/2003 agg. 101/2018, Codice dell'Amministrazione Digitale (CAD).

## 1. Titolare del trattamento

- **Ragione sociale**: [da inserire — s.r.l. o ditta individuale]
- **P.IVA**: [da inserire]
- **Sede**: [da inserire]
- **Email**: privacy@digitale-italia.it
- **PEC**: [da inserire]
- **DPO** (se nominato): dpo@digitale-italia.it

## 2. Categorie di dati trattati

| Categoria          | Esempi                                   | Base giuridica (art. 6 GDPR)                 |
| ------------------ | ---------------------------------------- | -------------------------------------------- |
| Identificazione    | Nome, cognome, email, telefono           | Contratto (art. 6.1.b)                       |
| Fiscali            | Codice fiscale, P.IVA, indirizzo fiscale | Obblighi legali (art. 6.1.c) — fatturazione  |
| Fatturazione       | Clienti, importi, scadenze               | Contratto + obbligo legale                   |
| Navigazione        | IP, user-agent, pagine visitate          | Interesse legittimo (art. 6.1.f) — sicurezza |
| Autenticazione     | Hash password, sessioni attive           | Contratto                                    |
| Comunicazione      | Messaggi inviati a supporto              | Contratto                                    |
| Biometrici (audio) | Registrazioni vocali (se usi assistente) | Consenso esplicito (art. 9.2.a)              |

## 3. Finalità

1. **Fornitura servizio**: gestione account, fatturazione elettronica, scadenze, documenti
2. **Obblighi fiscali**: conservazione fatture 10 anni (art. 2220 c.c., DPR 917/86)
3. **Sicurezza**: audit log, rilevazione intrusioni, prevenzione frodi
4. **Comunicazioni di servizio**: notifiche critiche (reset password, scadenze)
5. **Marketing** (solo con consenso separato): newsletter, aggiornamenti prodotto
6. **Profilazione** (solo con consenso separato): suggerimenti personalizzati

## 4. Periodo di conservazione

| Dato                    | Retention                 | Motivazione                     |
| ----------------------- | ------------------------- | ------------------------------- |
| Fatture emesse/ricevute | 10 anni                   | Art. 2220 c.c.                  |
| Account attivo          | Durata contratto + 30 gg  | Contratto                       |
| Account eliminato       | Cancellazione entro 30 gg | Art. 17 GDPR                    |
| Audit log               | 2 anni                    | Forensic readiness, obbligo CAD |
| Log navigazione         | 6 mesi                    | Interesse legittimo sicurezza   |
| Backup                  | 90 giorni rolling         | Continuità operativa            |
| Consensi                | 10 anni post-revoca       | Prova conformità GDPR art. 7    |

## 5. Diritti dell'interessato (artt. 15-22 GDPR)

Hai diritto a:

- **Accesso** (art. 15): vedere tutti i dati che abbiamo su di te
- **Rettifica** (art. 16): correggere dati sbagliati
- **Cancellazione** (art. 17): "diritto all'oblio", salvo obblighi fiscali
- **Limitazione** (art. 18): congelare uso dei dati
- **Portabilità** (art. 20): export one-click in formato leggibile (JSON/CSV)
- **Opposizione** (art. 21): dire stop al marketing
- **Non essere sottoposto a profilazione automatizzata** (art. 22)

**Come esercitarli**: dashboard → Impostazioni → Privacy → Esercita i miei diritti.
Risposta entro 30 giorni (art. 12.3).

## 6. Destinatari dei dati

I tuoi dati possono essere comunicati a:

| Destinatario                    | Ruolo             | Dove           | Garanzie         |
| ------------------------------- | ----------------- | -------------- | ---------------- |
| Supabase (database)             | Responsabile      | EU (Frankfurt) | DPA firmato      |
| Netlify (hosting)               | Responsabile      | EU/USA         | SCC clauses      |
| Stripe (pagamenti)              | Responsabile      | EU/USA         | SCC + PCI-DSS    |
| Sistema di Interscambio (SDI)   | Titolare autonomo | Italia         | Obbligo di legge |
| Consulente fiscale (se scelto)  | Responsabile      | Italia         | DPA              |
| Autorità (fiscali, giudiziarie) | Titolare autonomo | Italia         | Obbligo di legge |

## 7. Trasferimenti extra-UE

I dati restano prevalentemente in UE. Quando transitano fuori (es. Netlify CDN globale):

- Garanzia: Standard Contractual Clauses (SCC) 2021/914
- Adeguate misure tecniche (encryption in transit + at-rest)

## 8. Misure di sicurezza

- Password hashate con bcrypt + salt
- TLS 1.3 forzato (HSTS 2 anni)
- Crittografia at-rest AES-256
- PII sensibili (CF) cifrati con `pgcrypto` a livello colonna
- Row Level Security (RLS) multi-tenant
- Audit log immutabile
- 2FA obbligatorio per piani Professionista+
- Backup quotidiani + test restore settimanale
- Pentest annuale

## 9. Reclami

Puoi rivolgerti al **Garante per la Protezione dei Dati Personali**:

- Web: https://www.garanteprivacy.it
- PEC: protocollo@pec.gpdp.it
- Tel: +39 06 696771

## 10. Aggiornamenti

Versione: 1.0 — 2026-04-16
Prossima revisione: 2027-04-16 o prima in caso di modifiche rilevanti.
Storico: `/privacy/versioni`
