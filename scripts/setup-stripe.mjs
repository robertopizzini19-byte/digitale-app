#!/usr/bin/env node
/**
 * setup-stripe.mjs — Crea prodotti Stripe + configura webhook + setta env vars su Netlify
 *
 * Prerequisiti (esegui una volta):
 *   stripe login          → autentica Stripe CLI
 *   supabase login        → autentica Supabase CLI
 *   netlify login         → già fatto (netlify status mostra l'utente)
 *
 * Poi: node scripts/setup-stripe.mjs [--live]
 *   --live  usa chiavi live (default: test)
 */

import { execSync, execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const LIVE_MODE = process.argv.includes("--live");
const NETLIFY_SITE = "digitale-italia";
const SUPABASE_PROJECT_REF = "sibjdponrgalwejlbzen";
const WEBHOOK_URL = "https://digitale-italia.netlify.app/.netlify/functions/stripe-webhook";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

function stripeCmd(args) {
  const modeFlag = LIVE_MODE ? "--live" : "";
  return run(`stripe ${args} ${modeFlag} --output-json`).trim();
}

function netlifySetEnv(key, value) {
  execSync(`netlify env:set ${key} "${value}" --force`, { stdio: "inherit" });
}

console.log(`\n⚡ DigiITAle Stripe Setup — ${LIVE_MODE ? "LIVE" : "TEST"} mode\n`);

/* ─── 1. Verifica Stripe login ─── */
let stripeConfig;
try {
  stripeConfig = JSON.parse(run("stripe config --list --output json 2>/dev/null") || "{}");
} catch {
  stripeConfig = {};
}

const apiKeyField = LIVE_MODE ? "live_mode_api_key" : "test_mode_api_key";
if (!stripeConfig.default?.[apiKeyField]) {
  console.error("❌ Stripe non autenticato. Esegui: stripe login");
  process.exit(1);
}

const stripeSecretKey = run(`stripe config get ${apiKeyField} 2>/dev/null`).replace(/^.*=\s*/, "").trim();
if (!stripeSecretKey || stripeSecretKey.startsWith("*")) {
  console.error("❌ Impossibile leggere la chiave Stripe. Riesegui: stripe login");
  process.exit(1);
}

console.log(`✓ Stripe autenticato (${LIVE_MODE ? "live" : "test"})`);

/* ─── 2. Crea prodotto Professionista ─── */
console.log("\n📦 Creando prodotti Stripe...");

let prodProf;
try {
  prodProf = JSON.parse(stripeCmd('products create --name="DigiITAle Professionista" --description="Fatturazione illimitata, firma digitale, supporto prioritario"'));
} catch (e) {
  console.error("Errore creazione prodotto Professionista:", e.message);
  process.exit(1);
}

let priceProf;
try {
  priceProf = JSON.parse(stripeCmd(`prices create --product="${prodProf.id}" --unit-amount=900 --currency=eur --recurring[interval]=month --nickname="Professionista Mensile"`));
} catch (e) {
  console.error("Errore creazione prezzo Professionista:", e.message);
  process.exit(1);
}

console.log(`  ✓ Professionista: ${prodProf.id} → prezzo ${priceProf.id} (€9/mese)`);

/* ─── 3. Crea prodotto Impresa ─── */
let prodImp;
try {
  prodImp = JSON.parse(stripeCmd('products create --name="DigiITAle Impresa" --description="Multi-utente, SDI, FattPA, API access, supporto dedicato"'));
} catch (e) {
  console.error("Errore creazione prodotto Impresa:", e.message);
  process.exit(1);
}

let priceImp;
try {
  priceImp = JSON.parse(stripeCmd(`prices create --product="${prodImp.id}" --unit-amount=4900 --currency=eur --recurring[interval]=month --nickname="Impresa Mensile"`));
} catch (e) {
  console.error("Errore creazione prezzo Impresa:", e.message);
  process.exit(1);
}

console.log(`  ✓ Impresa: ${prodImp.id} → prezzo ${priceImp.id} (€49/mese)`);

/* ─── 4. Crea webhook endpoint ─── */
console.log("\n🔗 Configurando webhook Stripe...");

let webhook;
try {
  webhook = JSON.parse(stripeCmd(
    `webhook_endpoints create --url="${WEBHOOK_URL}" --enabled-events="checkout.session.completed,customer.subscription.updated,customer.subscription.deleted,invoice.payment_failed"`
  ));
} catch (e) {
  console.error("Errore creazione webhook:", e.message);
  process.exit(1);
}

const webhookSecret = webhook.secret;
console.log(`  ✓ Webhook: ${webhook.id}`);

/* ─── 5. Ottieni Supabase service role key ─── */
console.log("\n🔑 Ottenendo Supabase service role key...");

let serviceRoleKey;
try {
  const keysJson = run(`supabase projects api-keys --project-ref ${SUPABASE_PROJECT_REF} --output json`);
  const keys = JSON.parse(keysJson);
  const srKey = keys.find((k) => k.name === "service_role");
  serviceRoleKey = srKey?.api_key;
} catch (e) {
  console.warn("⚠️  Impossibile ottenere Supabase service role key via CLI:", e.message);
  console.warn("   Recuperala da: https://supabase.com/dashboard/project/sibjdponrgalwejlbzen/settings/api");
  console.warn("   Poi: netlify env:set SUPABASE_SERVICE_ROLE_KEY 'tua-chiave'");
}

if (serviceRoleKey) {
  console.log("  ✓ Supabase service_role key ottenuta");
}

/* ─── 6. Setta variabili su Netlify ─── */
console.log("\n🌐 Settando variabili d'ambiente su Netlify...");

netlifySetEnv("STRIPE_SECRET_KEY", stripeSecretKey);
netlifySetEnv("STRIPE_PRICE_PROFESSIONISTA", priceProf.id);
netlifySetEnv("STRIPE_PRICE_IMPRESA", priceImp.id);
netlifySetEnv("STRIPE_WEBHOOK_SECRET", webhookSecret);

if (serviceRoleKey) {
  netlifySetEnv("SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey);
}

/* ─── 7. Aggiorna .env.local ─── */
const envPath = ".env.local";
if (existsSync(envPath)) {
  let envContent = readFileSync(envPath, "utf8");

  const toAdd = [
    `STRIPE_SECRET_KEY=${stripeSecretKey}`,
    `STRIPE_PRICE_PROFESSIONISTA=${priceProf.id}`,
    `STRIPE_PRICE_IMPRESA=${priceImp.id}`,
    `STRIPE_WEBHOOK_SECRET=${webhookSecret}`,
    serviceRoleKey ? `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}` : "",
  ].filter(Boolean).join("\n");

  envContent = envContent.replace(/^# --- Stripe.*$/m, "# --- Stripe (configurato da setup-stripe.mjs)");
  envContent += "\n\n# === AUTO-GENERATED da setup-stripe.mjs ===\n" + toAdd + "\n";
  writeFileSync(envPath, envContent);
  console.log("  ✓ .env.local aggiornato");
}

/* ─── 8. Trigger redeploy Netlify ─── */
console.log("\n🚀 Avviando redeploy Netlify per applicare le nuove env vars...");
try {
  execSync(`netlify deploy --build --site=${NETLIFY_SITE}`, { stdio: "inherit" });
} catch {
  console.log("  ℹ️  Il deploy partirà automaticamente al prossimo push su GitHub.");
}

/* ─── Summary ─── */
console.log(`
╔══════════════════════════════════════════════════════╗
║  ✅ DigiITAle Stripe Setup completato!               ║
╠══════════════════════════════════════════════════════╣
║  Stripe mode    : ${LIVE_MODE ? "LIVE ⚡" : "TEST 🧪"}${" ".repeat(LIVE_MODE ? 30 : 29)}║
║  Professionista : €9/mese  → ${priceProf.id.slice(0, 22)}  ║
║  Impresa        : €49/mese → ${priceImp.id.slice(0, 22)}  ║
║  Webhook        : ${webhook.id.slice(0, 35)}  ║
╚══════════════════════════════════════════════════════╝

Prossimi step:
  1. Testa il checkout: vai su /dashboard/upgrade e clicca "Passa a Professionista"
  2. Usa carta di test: 4242 4242 4242 4242 | 12/34 | 123
  3. Verifica che il piano venga aggiornato in Supabase dopo il pagamento
  4. Quando pronto per il live: node scripts/setup-stripe.mjs --live
`);
