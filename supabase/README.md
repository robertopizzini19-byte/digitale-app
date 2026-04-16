# Supabase — Setup DigiITAle

Guida operativa per collegare DigiITAle al database. Dieci minuti, zero gergo.

---

## Cosa stiamo facendo

DigiITAle è l'interfaccia. Supabase è il **cervello dati**: tiene utenti, fatture, clienti, documenti.
Una volta collegato, il sito smette di essere una demo e diventa vivo.

---

## 1. Crea il progetto Supabase

1. Vai su **https://supabase.com** → Sign in con GitHub (stesso account `robertopizzini19-byte`).
2. Dashboard → **New project**.
3. Compila:
   - **Name**: `digitale-italia`
   - **Database password**: generala forte e **salvala in `NOTE_CREDENZIALI.txt`** (la userai se un giorno devi fare il reset).
   - **Region**: `West EU (Ireland)` — è il più vicino all'Italia fra quelli gratuiti.
   - **Pricing**: **Free** (500 MB DB, 50k utenti/mese — basta e avanza per il lancio).
4. Click **Create new project**. Aspetta 1-2 minuti che Supabase inizializzi.

---

## 2. Esegui la migration (crea le 10 tabelle)

1. Dal pannello Supabase → sinistra → **SQL Editor**.
2. Click **New query**.
3. Apri il file `supabase/migrations/0001_init.sql` di questo repo, **copia tutto** il contenuto.
4. Incolla nell'editor Supabase.
5. Click **Run** (in basso a destra, o `Ctrl+Enter`).
6. Verifica: in basso deve apparire **"Success. No rows returned"**.

Cosa hai appena creato:
- 10 tabelle italiane (utenti, fatture, clienti, documenti, scadenze, ecc.)
- Row Level Security su tutte → ogni utente vede SOLO i suoi dati
- Trigger automatico: quando uno si registra, viene creato il suo profilo
- Trigger `aggiornato_il`: timestamp automatici

### Controllo veloce
Sinistra → **Table Editor** → devi vedere le 10 tabelle. Se le vedi, sei a posto.

---

## 3. Copia le chiavi del progetto

1. Sinistra → ingranaggio **Settings** → **API**.
2. Copia due valori:
   - **Project URL** — es. `https://abcdefgh.supabase.co`
   - **Project API Key** → riga **"anon / public"** (NON quella service_role)

---

## 4. Configura il progetto locale

1. Nella cartella `digitale-app/`, crea un file **`.env.local`** (nota il punto iniziale).
2. Incolla:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...la-tua-anon-key-lunga
```

3. Salva. Il file è già protetto da `.gitignore` — non verrà mai pushato.

### Prova in locale
```bash
npm run dev
```
Apri http://localhost:3000/accedi — il banner giallo "Modalità anteprima" deve **sparire**.
Click "Registrati gratis" → crea un account vero con la tua email → controlla la casella per conferma.

---

## 5. Configura le env su Netlify (produzione)

Netlify deve avere le stesse chiavi o il sito live resta in modalità demo.

1. Vai su **https://app.netlify.com** → progetto `digitale-italia`.
2. **Site configuration** → **Environment variables** → **Add a variable**.
3. Aggiungi entrambe:
   - `NEXT_PUBLIC_SUPABASE_URL` = stesso valore di `.env.local`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = stesso valore
4. **Deploys** → **Trigger deploy** → **Deploy site**.

Dopo 1-2 minuti, `https://digitale-italia.netlify.app/accedi` è live con auth vera.

---

## 6. (Opzionale) Configura il template email italiano

Di default Supabase manda email di conferma in inglese. Per gli italiani è meglio italiano.

1. Supabase → **Authentication** → **Email Templates**.
2. Template **Confirm signup** → personalizza:
   ```
   Oggetto: Conferma la tua email su DigiITAle

   Ciao!

   Grazie per esserti registrato su DigiITAle.
   Clicca qui sotto per confermare la tua email e attivare l'account:

   {{ .ConfirmationURL }}

   Se non sei stato tu, ignora questo messaggio.

   — Il team DigiITAle
   ```
3. Ripeti per **Reset password**, **Magic Link**, **Invite**.

---

## 7. Hardening (quando hai i primi utenti veri)

- **Auth → URL Configuration** → aggiungi `https://digitale-italia.netlify.app` ai redirect URL consentiti.
- **Auth → Rate Limits** → alza se previsto (default 3/h signup è stretto).
- **Database → Backups** → automatici su Free (7 giorni retention).
- **Billing** → quando ti avvicini ai limiti free, upgrade a Pro ($25/mese).

---

## Problemi frequenti

| Sintomo | Soluzione |
|---|---|
| Banner giallo "Modalità anteprima" non sparisce | `.env.local` non trovato → verifica nome file (punto iniziale!) e riavvia `npm run dev` |
| "Email non confermata" al login | Controlla spam + apri il link di conferma |
| "permission denied for table utenti" | Migration non eseguita o RLS mal configurate → rileggi Step 2 |
| Netlify deploy non legge le env | Hai dimenticato di fare il redeploy dopo averle aggiunte |

---

**⚔️ Fatto. DigiITAle ora ha un cervello.**
