/**
 * email-drip-scheduler.mjs — Netlify Scheduled Function
 *
 * Eseguito automaticamente ogni giorno alle 09:00 UTC.
 * Trova utenti registrati 1, 3 e 7 giorni fa e invia l'email drip appropriata.
 * Richiede: SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL, BREVO_API_KEY
 */

import { createClient } from "@supabase/supabase-js";

export const config = {
  schedule: "0 9 * * *",
};

const DRIP_DAYS = [1, 3, 7];

function startOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d.toISOString();
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function sendDrip(nome, email, tipo) {
  const base = process.env.URL ?? "https://digitale-italia.netlify.app";
  try {
    const res = await fetch(`${base}/.netlify/functions/email-drip`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tipo, nome, email }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`email-drip ${tipo} -> ${email} FAILED:`, body);
      return false;
    }
    console.log(`email-drip ${tipo} -> ${email} OK`);
    return true;
  } catch (err) {
    console.error(`email-drip ${tipo} -> ${email} ERROR:`, err.message);
    return false;
  }
}

export async function handler() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("email-drip-scheduler: variabili d'ambiente mancanti (SUPABASE_SERVICE_ROLE_KEY)");
    return { statusCode: 503 };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  let totalSent = 0;

  for (const giorni of DRIP_DAYS) {
    const targetDate = daysAgo(giorni);
    const tipo = `d${giorni}`;

    const { data: utenti, error } = await supabase
      .from("utenti")
      .select("id, nome, email")
      .gte("creato_il", startOfDay(targetDate))
      .lte("creato_il", endOfDay(targetDate))
      .is("eliminato_il", null)
      .eq("attivo", true);

    if (error) {
      console.error(`Errore query utenti D+${giorni}:`, error.message);
      continue;
    }

    console.log(`D+${giorni}: trovati ${utenti?.length ?? 0} utenti da contattare`);

    for (const utente of utenti ?? []) {
      if (!utente.email) continue;
      const ok = await sendDrip(utente.nome || "amico", utente.email, tipo);
      if (ok) totalSent++;
    }
  }

  console.log(`email-drip-scheduler completato: ${totalSent} email inviate`);
  return { statusCode: 200 };
}
