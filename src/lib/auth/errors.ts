/**
 * DigiITAle — Mappa messaggi errore Supabase → italiano umano.
 * Niente gergo tecnico: parliamo a chi di tecnologia non capisce niente.
 */

const MAPPA: Array<{ match: RegExp; messaggio: string }> = [
  { match: /invalid login credentials/i, messaggio: "Email o password non corretti. Riprova." },
  { match: /email not confirmed/i, messaggio: "Devi prima confermare l'email. Controlla la casella di posta." },
  { match: /user already registered/i, messaggio: "Questa email è già registrata. Prova ad accedere." },
  { match: /password should be at least/i, messaggio: "La password è troppo corta. Minimo 8 caratteri." },
  { match: /unable to validate email/i, messaggio: "L'indirizzo email non è valido. Controlla e riprova." },
  { match: /rate limit/i, messaggio: "Troppi tentativi. Aspetta un minuto e riprova." },
  { match: /network|fetch/i, messaggio: "Connessione interrotta. Controlla internet e riprova." },
  { match: /expired/i, messaggio: "Il link è scaduto. Richiedine uno nuovo." },
  { match: /not authorized|permission/i, messaggio: "Non hai i permessi per questa operazione." },
];

export function mapErrore(messaggioOriginale: string): string {
  if (!messaggioOriginale) return "Qualcosa non ha funzionato. Riprova tra poco.";
  for (const m of MAPPA) {
    if (m.match.test(messaggioOriginale)) return m.messaggio;
  }
  // Fallback: mostra il messaggio originale in modo leggibile
  return messaggioOriginale.length > 120
    ? "Qualcosa non ha funzionato. Riprova tra poco."
    : messaggioOriginale;
}
