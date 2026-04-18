/**
 * email-drip.mjs — Email drip sequence post-registrazione
 *
 * Chiamata da un cron job esterno (es. Netlify Scheduled Function o n8n)
 * con body: { tipo: "d1" | "d3" | "d7", nome: string, email: string }
 *
 * Oppure chiamata interna con autenticazione DIGITALE_FN_SECRET.
 */

const SENDER = {
  name: "Roberto di DigiITAle",
  email: "caesar.growthmarketer@gmail.com",
};

const EMAILS = {
  d1: {
    oggetto: "Come emettere la tua prima fattura in 3 minuti",
    html: (nome) => `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <h2 style="color:#009246">Ciao ${nome}! 👋</h2>
        <p>Sono Roberto, il fondatore di DigiITAle.</p>
        <p>Volevo assicurarmi che tu sappia come emettere la tua prima fattura in meno di 3 minuti:</p>
        <ol style="line-height:2">
          <li>Vai su <strong>Clienti</strong> e aggiungi il tuo primo cliente</li>
          <li>Clicca <strong>Nuova Fattura</strong> nel menu in alto</li>
          <li>Seleziona il cliente, inserisci l'importo e clicca <strong>Crea fattura</strong></li>
        </ol>
        <p>La fattura viene numerata automaticamente in ordine progressivo. Niente Excel, niente fogli volanti.</p>
        <a href="https://digitale-italia.netlify.app/dashboard/fatture?nuova=1"
           style="display:inline-block;background:#009246;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;margin:16px 0">
          Crea la prima fattura →
        </a>
        <p style="color:#64748b;font-size:14px">Se hai domande, rispondi a questa email. Rispondo personalmente.</p>
        <p>A presto,<br><strong>Roberto</strong></p>
      </div>
    `,
  },
  d3: {
    oggetto: "Il trucco che usano i professionisti per pagare meno tasse (legalmente)",
    html: (nome) => `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <h2 style="color:#009246">Ciao ${nome},</h2>
        <p>Sai qual è l'errore numero 1 che fanno i freelance italiani?</p>
        <p><strong>Dimenticare le scadenze fiscali.</strong></p>
        <p>Con DigiITAle puoi impostare promemoria automatici per ogni fattura — così non perdi mai una scadenza e mantieni il controllo del flusso di cassa.</p>
        <p>E se vuoi fare il salto successivo, con il piano <strong>Professionista a €9/mese</strong> ottieni:</p>
        <ul style="line-height:2">
          <li>✅ Fatture illimitate</li>
          <li>✅ Firma digitale</li>
          <li>✅ Report mensili automatici</li>
          <li>✅ 14 giorni di prova gratuita</li>
        </ul>
        <a href="https://digitale-italia.netlify.app/dashboard/upgrade"
           style="display:inline-block;background:#009246;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;margin:16px 0">
          Prova Professionista gratis →
        </a>
        <p style="color:#64748b;font-size:14px">Nessuna carta richiesta per la prova. Cancelli quando vuoi.</p>
        <p>Roberto</p>
      </div>
    `,
  },
  d7: {
    oggetto: "Come sta andando? (risposta onesta richiesta)",
    html: (nome) => `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <h2 style="color:#009246">Ciao ${nome},</h2>
        <p>Sono passati 7 giorni da quando ti sei iscritto a DigiITAle.</p>
        <p>Domanda diretta: <strong>hai emesso almeno una fattura?</strong></p>
        <p>Se sì → ottimo, siamo sulla strada giusta.</p>
        <p>Se no → dimmi cos'è che ti blocca. Rispondo entro 24h e sistemiamo insieme.</p>
        <p>DigiITAle esiste per una ragione sola: rendere la burocrazia italiana sopportabile per chi lavora onestamente. Se qualcosa non funziona, voglio saperlo.</p>
        <p style="margin-top:24px">Rispondi direttamente a questa email con la tua situazione. Ci sento io, nessun bot.</p>
        <p>Roberto<br><span style="color:#64748b;font-size:13px">Fondatore, DigiITAle</span></p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
        <p style="color:#94a3b8;font-size:12px">
          Non vuoi più ricevere queste email?
          <a href="https://digitale-italia.netlify.app/disiscriviti" style="color:#94a3b8">Disiscriviti</a>
        </p>
      </div>
    `,
  },
};

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return { statusCode: 503, body: JSON.stringify({ error: "BREVO_API_KEY non configurata" }) };
  }

  let tipo, nome, email;
  try {
    ({ tipo, nome, email } = JSON.parse(event.body ?? "{}"));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Body JSON non valido" }) };
  }

  if (!tipo || !nome || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Parametri mancanti: tipo, nome, email" }) };
  }

  const template = EMAILS[tipo];
  if (!template) {
    return { statusCode: 400, body: JSON.stringify({ error: `tipo non riconosciuto: ${tipo}` }) };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ name: nome, email }],
        subject: template.oggetto,
        htmlContent: template.html(nome),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Brevo error:", body);
      return { statusCode: 502, body: JSON.stringify({ error: "Brevo API error", detail: body }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, tipo, email }),
    };
  } catch (err) {
    console.error("email-drip error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
