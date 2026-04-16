// digITAle — facciata osservabilità
//
// Principio "graceful fallback": Sentry è OPZIONALE.
// Se il pacchetto @sentry/nextjs non è installato o NEXT_PUBLIC_SENTRY_DSN è vuoto,
// tutte le funzioni diventano no-op senza rompere build/runtime.
//
// Attivazione:
//   1. npm install @sentry/nextjs
//   2. Setta NEXT_PUBLIC_SENTRY_DSN + SENTRY_ENVIRONMENT
//   3. Rigenera sentry.client.config.ts / sentry.server.config.ts da CLI ufficiale
//      (wizard: npx @sentry/wizard@latest -i nextjs)
//   4. Selezionare REGION = eu.sentry.io (obbligatorio per GDPR/DPF)

import { sentryBeforeSend } from "./pii-scrubber";

// Resolver lazy: evita l'import statico (che fallisce se il pacchetto non c'è)
type SentryModule = {
  captureException: (error: unknown, ctx?: Record<string, unknown>) => string;
  captureMessage: (msg: string, level?: "info" | "warning" | "error" | "fatal") => string;
  setUser: (user: { id: string } | null) => void;
  setTag: (key: string, value: string) => void;
  addBreadcrumb: (b: { category?: string; message?: string; level?: string; data?: unknown }) => void;
  init?: (opts: Record<string, unknown>) => void;
};

let cached: SentryModule | null | undefined;

async function loadSentry(): Promise<SentryModule | null> {
  if (cached !== undefined) return cached;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    cached = null;
    return null;
  }
  try {
    // Espressione dinamica per evitare che il typechecker risolva il package
    // quando @sentry/nextjs non è installato. Il bundler webpack produrrà un
    // chunk condizionale; se il package manca, .catch() torna null.
    const pkg = "@sentry/nextjs";
    const mod = (await (new Function("p", "return import(p)") as (p: string) => Promise<unknown>)(pkg).catch(
      () => null,
    )) as SentryModule | null;
    cached = mod;
    return mod;
  } catch {
    cached = null;
    return null;
  }
}

function hasDsn(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
}

export async function captureException(error: unknown, context?: Record<string, unknown>): Promise<void> {
  if (!hasDsn()) {
    if (typeof console !== "undefined") console.error("[obs:fallback]", error, context);
    return;
  }
  const s = await loadSentry();
  if (!s) return;
  try {
    const scrubbed = context
      ? (sentryBeforeSend({ extra: context }) as { extra?: Record<string, unknown> })
      : undefined;
    s.captureException(error, scrubbed?.extra ? { extra: scrubbed.extra } : undefined);
  } catch {
    // no-op
  }
}

export async function captureMessage(
  msg: string,
  level: "info" | "warning" | "error" | "fatal" = "info",
): Promise<void> {
  if (!hasDsn()) return;
  const s = await loadSentry();
  if (!s) return;
  try {
    s.captureMessage(msg, level);
  } catch {
    // no-op
  }
}

export async function setUserId(userId: string | null): Promise<void> {
  if (!hasDsn()) return;
  const s = await loadSentry();
  if (!s) return;
  try {
    s.setUser(userId ? { id: userId } : null);
  } catch {
    // no-op
  }
}

export async function addBreadcrumb(message: string, category?: string): Promise<void> {
  if (!hasDsn()) return;
  const s = await loadSentry();
  if (!s) return;
  try {
    s.addBreadcrumb({ category: category ?? "app", message, level: "info" });
  } catch {
    // no-op
  }
}

export { sentryBeforeSend };
