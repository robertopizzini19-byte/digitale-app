# Cookie Policy — digITAle

> **Status**: BOZZA da validare con avvocato.
> **Normativa**: Provvedimento Garante 10/06/2021, GDPR art. 7 (consenso).

## Cosa sono i cookie

Piccoli file di testo che il sito salva sul tuo dispositivo per ricordare informazioni tra una visita e l'altra.

## Categorie usate da digITAle

### 1. Necessari (sempre attivi)

Non richiedono consenso — servono al funzionamento base.

| Cookie             | Scopo                             | Durata          |
| ------------------ | --------------------------------- | --------------- |
| `digitale-auth`    | Sessione autenticata (Supabase)   | Durata sessione |
| `sb-access-token`  | Token JWT Supabase                | 1 ora           |
| `sb-refresh-token` | Rinnovo sessione                  | 7 giorni        |
| `consent-v1`       | Ricorda le tue scelte di consenso | 12 mesi         |

### 2. Analitici (opt-in)

Solo se accetti. Usiamo alternative privacy-friendly (nessun Google Analytics di default).

| Cookie       | Scopo                       | Provider       | Durata    |
| ------------ | --------------------------- | -------------- | --------- |
| `_plausible` | Analytics aggregato anonimo | Plausible (EU) | 30 giorni |

### 3. Marketing (opt-in)

Solo se accetti. Usati per misurare efficacia di campagne pubblicitarie (se attive).

Attualmente **non attivi**. Se in futuro attiveremo, ti chiederemo nuovamente il consenso.

### 4. Profilazione (opt-in)

Solo se accetti. Usati per suggerimenti personalizzati nella dashboard.

Non usiamo profilazione automatizzata con effetti legali/significativi su di te (art. 22 GDPR).

## Come gestire il consenso

- **Prima volta**: banner in basso appena visiti il sito
- **Modifica successiva**: dashboard → Impostazioni → Privacy → Gestione cookie
- **Reset totale**: `/privacy/cookie-reset`

## Cookie di terze parti

Sito embed servizi esterni solo dove strettamente necessario:

- **Supabase** (auth): EU, cookie necessari
- **Netlify** (hosting): cookie tecnici CDN, non tracking
- **Stripe** (solo al checkout): cookie necessari, EU/USA con SCC

## Come bloccarli dal browser

Tutti i browser permettono di disabilitare cookie:

- Chrome: Impostazioni → Privacy → Cookie
- Firefox: Impostazioni → Privacy → Cookie
- Safari: Preferenze → Privacy
- Edge: Impostazioni → Privacy → Cookie

**Attenzione**: bloccare i cookie necessari impedisce l'uso di digITAle.

---

Versione 1.0 — 2026-04-16
