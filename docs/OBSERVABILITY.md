# Observability — digITAle

> **Versione**: 1.0 — 2026-04-16
> **Scope**: error tracking, performance monitoring, log aggregation, alerting

---

## 1. Filosofia

- **Graceful fallback**: se il SDK non è installato o il DSN manca, il sistema **non si rompe**: gli errori vanno a `console.error` e basta. Nessun blocco runtime, nessun errore di build.
- **PII-first**: lo scrubber rimuove email, CF, P.IVA, IBAN, JWT, carte, Bearer token, IP troncato **prima** dell'invio al server esterno.
- **EU-only**: Sentry region = `eu.sentry.io` (Francoforte). Nessun dato su US.
- **Opt-out utente**: se un utente revoca consenso analytics, Sentry breadcrumbs sono disabilitati (hook in futuro).

---

## 2. Stack pianificato

| Capability         | Tool                          | Status                       | Region       |
| ------------------ | ----------------------------- | ---------------------------- | ------------ |
| Error tracking     | Sentry                        | Wiring pronto, SDK opzionale | eu.sentry.io |
| Performance traces | Sentry Performance            | Attivabile via stesso SDK    | eu.sentry.io |
| Uptime             | Better Stack o Uptrends EU    | Da attivare                  | EU           |
| Logs (structured)  | Netlify log drains → Axiom EU | Da attivare                  | EU           |
| Analytics prodotto | Plausible                     | Attivo                       | Germania     |
| Alerting           | Slack/PagerDuty-EU            | Canale post-launch           | EU           |

---

## 3. Attivazione Sentry (quando pronto)

### 3.1 Installazione SDK

```bash
npm install @sentry/nextjs
```

### 3.2 Wizard ufficiale

```bash
npx @sentry/wizard@latest -i nextjs
```

Rispondere:

- **Region**: `eu.sentry.io` (obbligatorio — NON `sentry.io`)
- **Create new project**: `digitale-web`
- **Upload sourcemaps**: sì (build only)

### 3.3 Configurazione privacy-first

Il wizard genera `sentry.client.config.ts` e `sentry.server.config.ts`. **Sostituire il blocco `beforeSend`** con:

```ts
import { sentryBeforeSend } from "@/lib/observability/pii-scrubber";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? "development",

  // Campionamento
  tracesSampleRate: 0.1, // 10% performance traces
  replaysSessionSampleRate: 0, // OFF: session replay è rischioso privacy
  replaysOnErrorSampleRate: 0, // OFF

  // Privacy
  sendDefaultPii: false, // MAI IP completo / user-agent / cookie
  beforeSend: sentryBeforeSend, // scrubber custom

  // Ignore liste
  ignoreErrors: [
    "NetworkError",
    "ChunkLoadError",
    "ResizeObserver loop limit exceeded",
    // errori noti del browser non actionable
  ],

  // Dist
  release: process.env.NEXT_PUBLIC_APP_VERSION,
});
```

### 3.4 Variabili d'ambiente

```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@o0.ingest.eu.sentry.io/0
SENTRY_ORG=digitale
SENTRY_PROJECT=digitale-web
SENTRY_ENVIRONMENT=production
SENTRY_AUTH_TOKEN=   # solo in env Netlify, MAI in .env.local committato
```

### 3.5 Verifica

1. Trigger errore forzato da `/test-error` (creare pagina protetta admin)
2. Check Sentry dashboard: evento arrivato **senza** email/CF/IP full
3. Verifica breadcrumb: nessun dato sensibile

---

## 4. Uso nel codice

Importare da `@/lib/observability/sentry`:

```ts
import { captureException, captureMessage, setUserId, addBreadcrumb } from "@/lib/observability/sentry";

// Errore
try {
  await riskyOp();
} catch (e) {
  void captureException(e, { op: "riskyOp" });
}

// Messaggio (info/warning/error/fatal)
void captureMessage("feature flag X attivata", "info");

// User context (dopo login) — SOLO userId, mai email
void setUserId(userId);

// Breadcrumb per tracciare flow
void addBreadcrumb("click CTA 'Registrati'", "ui");
```

Tutte le funzioni sono `async` + `void`-safe: non bloccano mai, non rompono se SDK assente.

---

## 5. PII scrubbing — regole

Vengono **redactati** automaticamente:

- Email → `[email]`
- CF italiani (16 caratteri alfanumerici tipizzati) → `[cf]`
- P.IVA (11 cifre) → `[piva]`
- IBAN IT → `[iban]`
- Carte (13-19 cifre) → `[card]`
- JWT → `[jwt]`
- Bearer/Basic token → `[bearer]`
- IPv4 → `x.x.x.0` (ultimo ottetto)
- Qualunque chiave con `password|secret|token|apikey|iban|cf|piva|cardnumber|cvv` → `[redacted]`
- Headers `authorization`, `cookie`, `x-csrf-token`, `x-stripe-signature`, `x-supabase-auth` → `[redacted]`

Stringhe > 2000 char troncate.

---

## 6. Alert routing (post-launch)

| Event                       | Destinatario | Canale          | SLA    |
| --------------------------- | ------------ | --------------- | ------ |
| Error rate > 1% 5min        | on-call      | Slack + SMS     | 15 min |
| Error new (mai visto)       | on-call      | Slack           | 30 min |
| p95 latency > 2s            | on-call      | Slack           | 1 h    |
| Breach trigger (log custom) | DPO + CTO    | PagerDuty + SMS | 15 min |
| Build failure prod          | team         | Slack           | 30 min |

---

## 7. Retention dati osservabilità

- Errori: 90 giorni (Sentry plan)
- Performance traces: 30 giorni
- Plausible analytics: 24 mesi aggregato
- Logs Netlify drain: 30 giorni hot + 1 anno cold

Oltre la retention → cancellazione automatica.

---

## 8. Coverage goal

- **Critical paths** 100% trace + error catch:
  - Signup / login
  - Checkout Stripe
  - Invio FatturaPA
  - Export dati
  - Cambio password
- **UX non critici**: 10% sampling performance

---

## 9. Testing observability

Nel E2E Playwright (quando attivo):

- test che forza errore lato client → verifica evento Sentry arrivato (solo in staging)
- test che fa login → verifica che NESSUN PII appaia in breadcrumb

---

_Documento tecnico interno. Aggiornamento ad ogni modifica SDK o policy privacy._
