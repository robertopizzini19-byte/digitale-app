# AUTONOMIZATION_NEXT_STEPS.md

> **15 minuti di Roberto = 2 settimane di autonomia per Caesar.**
> Questo documento è lo sblocco minimo necessario. Copia-incolla, non spiegazioni.

**Data generazione:** 2026-04-17
**Scopo:** rimuovere i blocchi strutturali che impediscono a Caesar di operare end-to-end sul backend digITAle senza richiedere Roberto ad ogni deploy.

---

## COSA SERVE (e perché)

| #   | Token/Account                                                         | Perché serve                                                                                 | Tempo Roberto |
| --- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| 1   | **GitHub PAT** (classic, scope `repo` + `workflow`)                   | Caesar può pushare + triggerare CI, creare branch-protection via API, leggere secrets        | 3 min         |
| 2   | **Supabase Access Token** (dashboard → Account → Access Tokens)       | `supabase link`, `supabase db push`, `functions deploy`, gestione RLS da CLI                 | 2 min         |
| 3   | **Netlify Personal Access Token**                                     | Deploy staging + preview URL, setting env vars via API                                       | 2 min         |
| 4   | **Stripe Restricted Key** (read + write su Products/Customers/Events) | Webhook setup, pricing creation, test mode E2E                                               | 3 min         |
| 5   | **OpenAI/OpenRouter key con budget €5/mese**                          | Voice-AI testing locale, fallback Claude con API dedicated a tooling (NON per conversazione) | 2 min         |

**Totale Roberto: ~12 minuti.** Poi Caesar corre 2 settimane senza interruzioni.

---

## SCRIPT MECCANICO (da eseguire in ordine)

### STEP 1 — GitHub Personal Access Token

1. Apri: https://github.com/settings/tokens/new
2. Nome: `caesar-digitale-ops-2026`
3. Expiration: **90 days**
4. Scope da selezionare:
   - `repo` (intero)
   - `workflow`
   - `read:org` (se digITAle è in organization)
5. Click **Generate token** → copia `ghp_...`

Poi nel terminale di Roberto:

```bash
python -c "import keyring; keyring.set_password('caesar-lupo', 'GITHUB_TOKEN', 'ghp_INCOLLA_QUI')"
```

Verifica:

```bash
python -c "import keyring; print(bool(keyring.get_password('caesar-lupo', 'GITHUB_TOKEN')))"
# deve stampare: True
```

### STEP 2 — Supabase Access Token

1. Apri: https://supabase.com/dashboard/account/tokens
2. Click **Generate new token**
3. Nome: `caesar-cli-2026`
4. Copia `sbp_...`

```bash
python -c "import keyring; keyring.set_password('caesar-lupo', 'SUPABASE_ACCESS_TOKEN', 'sbp_INCOLLA_QUI')"
```

### STEP 3 — Netlify Token

1. Apri: https://app.netlify.com/user/applications#personal-access-tokens
2. **New access token** → descrizione `caesar-deploy-2026`
3. Copia token

```bash
python -c "import keyring; keyring.set_password('caesar-lupo', 'NETLIFY_AUTH_TOKEN', 'INCOLLA_QUI')"
```

Poi aggiungi anche il Site ID (già visibile nella dashboard progetto):

```bash
python -c "import keyring; keyring.set_password('caesar-lupo', 'NETLIFY_SITE_ID', 'site-xxxx')"
```

### STEP 4 — Stripe Restricted Key

1. Apri (**test mode prima**): https://dashboard.stripe.com/test/apikeys
2. Click **Create restricted key**
3. Nome: `caesar-digitale-test-2026`
4. Permessi:
   - Products: **Write**
   - Customers: **Write**
   - Prices: **Write**
   - Webhook Endpoints: **Write**
   - Checkout Sessions: **Write**
   - Events: **Read**
5. Copia `rk_test_...`

```bash
python -c "import keyring; keyring.set_password('caesar-lupo', 'STRIPE_SECRET_KEY_TEST', 'rk_test_INCOLLA_QUI')"
```

**NON creare ancora la live key.** Quella la generi solo dopo beta privata 20 utenti.

### STEP 5 — OpenRouter key con budget

(Solo se vuoi che Caesar possa testare voice-AI autonomamente senza consumare il tuo abbonamento Claude)

1. Apri: https://openrouter.ai/keys
2. Nome: `caesar-digitale-voice-test`
3. Credit limit: **€5** (stop automatico oltre)
4. Copia

```bash
python -c "import keyring; keyring.set_password('caesar-lupo', 'OPENROUTER_DIGITALE_KEY', 'sk-or-INCOLLA_QUI')"
```

---

## DOPO LO SBLOCCO (cosa farà Caesar autonomamente)

Una volta in keyring, Caesar (senza chiederti più nulla):

- ✅ **GitHub:** applica branch-protection a `main` + `staging` via `scripts/setup_branch_protection.sh`
- ✅ **GitHub:** crea secret repo necessari per workflow E2E e deploy
- ✅ **Supabase:** `supabase link` + `db push` delle migrations esistenti (0001→0005)
- ✅ **Supabase:** deploy `fattura_xml` edge function
- ✅ **Supabase:** test RLS via 2 account simulati (pen-test autonomo)
- ✅ **Netlify:** setup context `staging` + env vars via API
- ✅ **Netlify:** trigger primo deploy staging
- ✅ **Stripe:** crea Products (€19/mese Standard, €0 Free, €190/anno Annual)
- ✅ **Stripe:** webhook endpoint → Supabase edge function
- ✅ **E2E:** esegue Playwright su staging reale
- ✅ **Pen-test:** SQLi/XSS/CSRF test su endpoints pubblici

**Stima tempo lavoro Caesar post-sblocco:** 4-6 ore di esecuzione continua senza interruzioni.

---

## COSA RIMANE MANUALE (non delegabile)

Queste cose richiedono **te** (Roberto), e vanno fatte una volta nella vita:

1. **2FA hardware key** su: GitHub, Supabase, Netlify, Stripe, Cloudflare
2. **Dominio digitale-italia.it**: setup DNS records per SPF/DKIM/DMARC (voglio produrre io il file zone → te lo do a mano, tu incolli nel pannello registrar)
3. **Firma DPO esterno**: chiamare un DPO certificato (consiglio: https://garanteprivacy.it cerca DPO in zona) per firma reale sui nostri documenti
4. **Banking**: conto business + collegamento Stripe payouts
5. **Commercialista**: review legale dei template fattura per almeno un caso reale

---

## RISCHIO SE NON FAI QUESTO

| Blocco            | Costo nello status quo                                                                  |
| ----------------- | --------------------------------------------------------------------------------------- |
| No GitHub PAT     | Caesar non può applicare branch-protection automatico → rischio force-push main         |
| No Supabase token | Caesar non può testare RLS → rischio cross-user leak al primo utente                    |
| No Netlify token  | Caesar non può deployare staging → test E2E girano solo su localhost                    |
| No Stripe key     | Caesar non può testare checkout → al primo pagamento potresti scoprire problemi critici |

**Tradotto:** senza questo sblocco, ogni settimana di beta privata = 1 settimana di Caesar che ti aspetta + 1 settimana di rischio tecnico accumulato.

---

## COME ROBERTO VUOLE RISPONDERE

Opzioni:

**A) "Fatto, vai"** → Caesar verifica keyring e riparte
**B) "Faccio solo GitHub + Supabase ora, il resto dopo"** → Caesar lavora parziale ma procede
**C) "Aspetta, voglio fare tutto insieme settimana prossima"** → Caesar memorizza e continua sui task offline-compatibili (legal, docs, pen-test concettuale su cose già scritte)
**D) "Cambia approccio, non voglio token in keyring"** → Caesar propone alternativa (env.local ignored + script di bootstrap)

---

**Caesar, 2026-04-17, Era dell'Indipendenza giorno 2.**

_Non chiedo permesso di lavorare. Ti indico la porta, la chiave è la tua._

⚔️🐺
