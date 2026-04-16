# Edge Function: `fattura_xml`

Genera l'XML FatturaPA v1.2.2 (tracciato 1.7) per una fattura, lo carica su Storage cifrato e restituisce URL firmato + hash SHA-256.

## Prerequisiti

- Migration `0005_fatturapa.sql` applicata (tabella `progressivi_invio` + bucket `fatture-xml`)
- Supabase CLI loggata
- Progetto linkato

## Deploy

```bash
supabase functions deploy fattura_xml --no-verify-jwt=false
```

## Variabili attese (env automatiche Supabase)

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Invocazione client

```ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const { data, error } = await supabase.functions.invoke("fattura_xml", {
  body: { fattura_id: "uuid-della-fattura" },
});
// data: { fattura_id, progressivo, xml_url, xml_path, sha256, size_bytes }
```

## Errori possibili

| Code                        | Significato                                 |
| --------------------------- | ------------------------------------------- |
| 400 INVALID_FATTURA_ID      | UUID malformato                             |
| 400 RIGHE_MANCANTI          | fattura senza righe                         |
| 401 UNAUTHORIZED            | manca Authorization Bearer                  |
| 404 FATTURA_NOT_FOUND       | fattura non trovata o RLS denies            |
| 404 EMITTENTE_NOT_FOUND     | profilo utente incompleto                   |
| 404 CESSIONARIO_NOT_FOUND   | cliente non trovato                         |
| 500 EMITTENTE_PIVA_INVALIDA | P.IVA emittente non valida                  |
| 500 EMITTENTE_CF_INVALIDO   | CF emittente non valido                     |
| 500 STORAGE_UPLOAD_FAILED   | errore Storage (nome duplicato, quota, ...) |
| 500 DB_UPDATE_FAILED        | errore aggiornamento fattura                |

## Idempotenza

Se la fattura ha già `xml_fattura_url` valorizzato, la Edge Function restituisce
direttamente la URL firmata esistente senza rigenerare l'XML. Per rigenerare
occorre prima resettare `xml_fattura_url = null`.

## Next step (non in questa Edge Function)

- **Firma CAdES-BES**: attualmente l'XML ha solo hash SHA-256 applicativo. La
  firma qualificata richiede HSM/smartcard del Titolare e andrà realizzata in
  un servizio separato (dedicated signer) con chiave custodita in HSM cloud.
- **Invio SDI**: upload via web service SDI o trasmissione via PEC. Anche
  questo è un servizio separato (poller/worker) che ascolta fatture in stato
  `emessa` e le trasmette.
- **Gestione ricevute**: webhook/poller che legge ricevute SDI e scrive in
  `sdi_ricevute` aggiornando `fatture.sdi_stato`.

## Privacy & Security

- Il bucket `fatture-xml` è **privato**. Gli utenti non-autenticati non possono
  accedervi direttamente; l'unica via è la signed URL (scadenza 1h) generata
  dalla Edge Function.
- Le Storage policy segregano per `user_id` (path `<user_id>/<anno>/...`).
- I log della Edge Function non contengono XML né PII (solo metadata: ID, hash, size).
- Audit trail automatico in `audit_log` per ogni generazione.
