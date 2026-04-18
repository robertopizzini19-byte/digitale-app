/**
 * Netlify Function: email-benvenuto
 * Invia email di benvenuto via Brevo dopo la registrazione.
 * POST { nome, email, referral_code }
 * Header: x-digitale-secret = DIGITALE_FN_SECRET (anti-spam)
 */

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: "Bad Request" };
  }

  const { nome, email } = body;
  if (!email || !nome) {
    return { statusCode: 400, body: "email e nome obbligatori" };
  }

  const BREVO_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_KEY) {
    console.error("[email-benvenuto] BREVO_API_KEY mancante");
    return { statusCode: 500, body: "Email service non configurato" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://digitale-italia.netlify.app";

  const htmlContent = `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><title>Benvenuto su digITAle</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
    <div style="background:#009246;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">digITAle</h1>
      <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">Lo Standard Digitale Italiano</p>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#0f172a;margin:0 0 12px;font-size:20px;">Benvenuto, ${nome}!</h2>
      <p style="color:#475569;line-height:1.6;margin:0 0 24px;">
        Il tuo account digITAle è attivo. Hai accesso alla dashboard per gestire fatture,
        scadenze e documenti — tutto in italiano, tutto sotto il tuo controllo.
      </p>
      <a href="${appUrl}/dashboard" style="display:inline-block;background:#009246;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
        Vai alla Dashboard →
      </a>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        Hai ricevuto questa email perché ti sei registrato su <a href="${appUrl}" style="color:#009246;">digITAle</a>.
        <br>Per domande: <a href="mailto:supporto@digitale-italia.it" style="color:#009246;">supporto@digitale-italia.it</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "digITAle", email: "caesar.growthmarketer@gmail.com" },
        to: [{ email, name: nome }],
        subject: `Benvenuto su digITAle, ${nome}!`,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[email-benvenuto] Brevo error:", res.status, errText);
      return { statusCode: 502, body: "Errore invio email" };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("[email-benvenuto] fetch error:", err);
    return { statusCode: 500, body: "Errore interno" };
  }
}
