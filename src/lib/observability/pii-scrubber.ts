// digITAle — PII scrubber per eventi osservabilità
//
// Regole:
//  - MAI spedire email, telefono, IBAN, CF, P.IVA, numeri carta, token, hash password
//  - MAI spedire IP completi (troncare ultimo ottetto v4, ultimi 80 bit v6)
//  - MAI spedire headers Authorization / Cookie / X-*-Token
//  - Limitare lunghezza stringhe a 2000 char per evitare leak accidentali di body

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const CF_RE = /\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi;
const PIVA_RE = /\b\d{11}\b/g;
const IBAN_IT_RE = /\bIT\d{2}[A-Z]\d{10}\d{12}\b/gi;
const CARD_RE = /\b(?:\d[ -]?){13,19}\b/g;
const JWT_RE = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g;
const BEARER_RE = /\b(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi;
const IPV4_RE = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.)\d{1,3}\b/g;

const SENSITIVE_HEADER_KEYS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-auth-token",
  "x-api-key",
  "x-csrf-token",
  "x-stripe-signature",
  "x-supabase-auth",
]);

const SENSITIVE_KEY_PARTS = [
  "password",
  "secret",
  "token",
  "apikey",
  "api_key",
  "authorization",
  "iban",
  "codicefiscale",
  "partitaiva",
  "cf",
  "piva",
  "cardnumber",
  "cvv",
];

const MAX_STRING = 2000;

export function scrubString(input: string): string {
  let out = input;
  out = out.replace(EMAIL_RE, "[email]");
  out = out.replace(IBAN_IT_RE, "[iban]");
  out = out.replace(CF_RE, "[cf]");
  out = out.replace(JWT_RE, "[jwt]");
  out = out.replace(BEARER_RE, "[bearer]");
  out = out.replace(CARD_RE, "[card]");
  out = out.replace(PIVA_RE, "[piva]");
  out = out.replace(IPV4_RE, "$10");
  if (out.length > MAX_STRING) out = out.slice(0, MAX_STRING) + "...[trunc]";
  return out;
}

export function scrubHeaders(
  headers: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!headers) return headers;
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(headers)) {
    if (SENSITIVE_HEADER_KEYS.has(k.toLowerCase())) {
      cleaned[k] = "[redacted]";
    } else if (typeof v === "string") {
      cleaned[k] = scrubString(v);
    } else {
      cleaned[k] = v;
    }
  }
  return cleaned;
}

function keyIsSensitive(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEY_PARTS.some((p) => lower.includes(p));
}

export function scrubObject<T>(value: T, depth = 0): T {
  if (depth > 6) return value;
  if (value == null) return value;
  if (typeof value === "string") return scrubString(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => scrubObject(v, depth + 1)) as unknown as T;
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (keyIsSensitive(k)) {
        out[k] = "[redacted]";
      } else {
        out[k] = scrubObject(v, depth + 1);
      }
    }
    return out as unknown as T;
  }
  return value;
}

// Hook compatibile con Sentry `beforeSend` / `beforeSendTransaction`.
export function sentryBeforeSend<E extends Record<string, unknown>>(event: E): E | null {
  try {
    const cloned = JSON.parse(JSON.stringify(event)) as Record<string, unknown>;
    // Rimuovi user.email / user.ip_address
    if (cloned.user && typeof cloned.user === "object") {
      const u = cloned.user as Record<string, unknown>;
      delete u.email;
      delete u.ip_address;
      delete u.username;
    }
    // Scrub request headers + data
    if (cloned.request && typeof cloned.request === "object") {
      const r = cloned.request as Record<string, unknown>;
      if (r.headers) r.headers = scrubHeaders(r.headers as Record<string, unknown>);
      if (r.data) r.data = scrubObject(r.data);
      if (typeof r.query_string === "string") r.query_string = scrubString(r.query_string);
      if (typeof r.url === "string") r.url = scrubString(r.url);
    }
    // Scrub extra + contexts + breadcrumbs
    if (cloned.extra) cloned.extra = scrubObject(cloned.extra);
    if (cloned.contexts) cloned.contexts = scrubObject(cloned.contexts);
    if (Array.isArray(cloned.breadcrumbs)) cloned.breadcrumbs = scrubObject(cloned.breadcrumbs);
    return cloned as unknown as E;
  } catch {
    // Mai bloccare un evento di errore per un errore nello scrubber
    return event;
  }
}
