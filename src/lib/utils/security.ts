/**
 * DigiITAle — Security Utilities
 * Difesa in profondità: sanitizzazione, CSP, rate limiting.
 * OWASP Top 10 come baseline.
 */

/* ─── Sanitizzazione Input ─── */

/** Rimuove tag HTML da una stringa (anti-XSS) */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** Sanitizza un oggetto ricorsivamente */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeHtml(value);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return result;
}

/* ─── Rate Limiting (in-memory, per istanza) ─── */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/** Verifica rate limit. Ritorna true se la richiesta è permessa. */
export function checkRateLimit(
  key: string,
  limite: number,
  finestraMs: number = 60000
): { permesso: boolean; rimanenti: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + finestraMs });
    return { permesso: true, rimanenti: limite - 1, resetIn: finestraMs };
  }

  if (entry.count >= limite) {
    return {
      permesso: false,
      rimanenti: 0,
      resetIn: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    permesso: true,
    rimanenti: limite - entry.count,
    resetIn: entry.resetAt - now,
  };
}

/* ─── Security Headers ─── */

/** Headers di sicurezza per le risposte HTTP */
export const SECURITY_HEADERS: Record<string, string> = {
  /** Content Security Policy — Previene XSS */
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Next.js necessita unsafe-inline
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),

  /** Previene clickjacking */
  "X-Frame-Options": "DENY",

  /** Blocca MIME sniffing */
  "X-Content-Type-Options": "nosniff",

  /** Referrer policy */
  "Referrer-Policy": "strict-origin-when-cross-origin",

  /** Permessi API browser */
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=(), payment=(self)",

  /** HSTS — forza HTTPS */
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",

  /** XSS Protection (legacy browsers) */
  "X-XSS-Protection": "1; mode=block",
};

/* ─── CSRF Token ─── */

/** Genera un token CSRF */
export function generaCsrfToken(): string {
  return crypto.randomUUID();
}

/** Verifica token CSRF */
export function verificaCsrfToken(token: string, atteso: string): boolean {
  if (token.length !== atteso.length) return false;
  // Confronto a tempo costante per prevenire timing attacks
  let risultato = 0;
  for (let i = 0; i < token.length; i++) {
    risultato |= token.charCodeAt(i) ^ atteso.charCodeAt(i);
  }
  return risultato === 0;
}
