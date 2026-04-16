/**
 * digITAle — API Client
 * Client HTTP tipizzato. Unico punto di uscita verso il backend.
 * Gestisce: auth headers, refresh token, retry, error parsing.
 */

import type { ApiResult, ApiError, ErrorCode } from "../core/types";

interface RequestOptions {
  metodo?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private onUnauthorized?: () => void;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /** Imposta il token di autenticazione */
  setAuth(token: string, refreshToken?: string): void {
    this.token = token;
    if (refreshToken) this.refreshToken = refreshToken;
  }

  /** Rimuovi autenticazione */
  clearAuth(): void {
    this.token = null;
    this.refreshToken = null;
  }

  /** Callback quando il token è scaduto */
  onSessionExpired(callback: () => void): void {
    this.onUnauthorized = callback;
  }

  /** Richiesta GET tipizzata */
  async get<T>(path: string, params?: Record<string, string>): Promise<ApiResult<T>> {
    const url = params
      ? `${path}?${new URLSearchParams(params)}`
      : path;
    return this.request<T>(url, { metodo: "GET" });
  }

  /** Richiesta POST tipizzata */
  async post<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>(path, { metodo: "POST", body });
  }

  /** Richiesta PUT tipizzata */
  async put<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>(path, { metodo: "PUT", body });
  }

  /** Richiesta PATCH tipizzata */
  async patch<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>(path, { metodo: "PATCH", body });
  }

  /** Richiesta DELETE tipizzata */
  async delete<T>(path: string): Promise<ApiResult<T>> {
    return this.request<T>(path, { metodo: "DELETE" });
  }

  /** Richiesta base con gestione errori */
  private async request<T>(path: string, options: RequestOptions): Promise<ApiResult<T>> {
    const url = `${this.baseUrl}${path}`;
    const { metodo = "GET", body, headers = {}, timeout = 30000 } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const finalHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Client-Version": "1.0.0",
        ...headers,
      };

      if (this.token) {
        finalHeaders["Authorization"] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        method: metodo,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Token scaduto — prova refresh
        if (this.refreshToken) {
          const refreshed = await this.tentaRefresh();
          if (refreshed) {
            return this.request<T>(path, options); // Retry
          }
        }
        this.onUnauthorized?.();
        return { ok: false, errore: this.parseError(response.status) };
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        return {
          ok: false,
          errore: errorBody ?? this.parseError(response.status),
        };
      }

      // 204 No Content
      if (response.status === 204) {
        return { ok: true, data: undefined as T };
      }

      const data = await response.json();
      return { ok: true, data };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === "AbortError") {
        return {
          ok: false,
          errore: {
            codice: "SERVIZIO_NON_DISPONIBILE",
            messaggio: "Richiesta scaduta. Riprova.",
          },
        };
      }

      return {
        ok: false,
        errore: {
          codice: "ERRORE_INTERNO",
          messaggio: "Errore di connessione. Verifica la tua rete.",
        },
      };
    }
  }

  private async tentaRefresh(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.token = data.token;
      this.refreshToken = data.refreshToken;
      return true;
    } catch {
      return false;
    }
  }

  private parseError(status: number): ApiError {
    const mappa: Record<number, { codice: ErrorCode; messaggio: string }> = {
      400: { codice: "VALIDAZIONE", messaggio: "Dati non validi" },
      401: { codice: "NON_AUTENTICATO", messaggio: "Sessione scaduta. Accedi di nuovo." },
      403: { codice: "NON_AUTORIZZATO", messaggio: "Non hai i permessi per questa azione" },
      404: { codice: "NON_TROVATO", messaggio: "Risorsa non trovata" },
      409: { codice: "CONFLITTO", messaggio: "Conflitto con dati esistenti" },
      429: { codice: "RATE_LIMIT", messaggio: "Troppe richieste. Attendi un momento." },
      500: { codice: "ERRORE_INTERNO", messaggio: "Errore del server. Stiamo risolvendo." },
      503: { codice: "SERVIZIO_NON_DISPONIBILE", messaggio: "Servizio temporaneamente non disponibile" },
    };
    return mappa[status] ?? { codice: "ERRORE_INTERNO", messaggio: `Errore ${status}` };
  }
}

/** Istanza singleton del client API */
export const api = new ApiClient(
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "/api")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api")
);
