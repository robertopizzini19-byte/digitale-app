"use client";

/**
 * digITAle — Auth Provider
 *
 * Espone useAuth() a tutte le pagine client.
 * Gestisce: sessione Supabase, profilo utente da public.utenti, signIn/signUp/signOut.
 *
 * Se Supabase non è configurato (dev senza env), gira in "demo mode":
 * nessuna auth reale, /dashboard accessibile come anteprima.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "../supabase/client";
import type { User, UserRole } from "../core/types";
import { mapErrore } from "./errors";

/* ─── Profilo DB (tabella public.utenti) ─── */

type UtenteRow = {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  codice_fiscale: string | null;
  partita_iva: string | null;
  telefono: string | null;
  ruolo: UserRole;
  piano: "gratuito" | "professionista" | "impresa";
  moduli_attivi: string[];
  avatar_url: string | null;
  email_verificata: boolean;
  spid_verificato: boolean;
  attivo: boolean;
  creato_il: string;
  aggiornato_il: string;
  ultimo_accesso: string | null;
};

function rowToUser(row: UtenteRow): User {
  return {
    id: row.id,
    email: row.email,
    nome: row.nome,
    cognome: row.cognome,
    codiceFiscale: row.codice_fiscale ?? undefined,
    partitaIva: row.partita_iva ?? undefined,
    telefono: row.telefono ?? undefined,
    ruolo: row.ruolo,
    piano: row.piano,
    moduliAttivi: row.moduli_attivi ?? [],
    consensiGdpr: [],
    creatoIl: row.creato_il,
    aggiornatoIl: row.aggiornato_il,
    ultimoAccesso: row.ultimo_accesso ?? undefined,
    attivo: row.attivo,
    emailVerificata: row.email_verificata,
    spidVerificato: row.spid_verificato,
  };
}

/* ─── Stato Auth ─── */

export type AuthStato =
  | { stato: "caricamento" }
  | { stato: "demo" }
  | { stato: "non_autenticato" }
  | { stato: "autenticato"; user: User; sessione: Session };

export interface AuthActions {
  accedi: (email: string, password: string) => Promise<{ ok: true } | { ok: false; messaggio: string }>;
  registra: (payload: RegistraPayload) => Promise<{ ok: true; richiedeVerifica: boolean } | { ok: false; messaggio: string }>;
  esci: () => Promise<void>;
  aggiornaProfilo: (patch: Partial<UtenteRow>) => Promise<{ ok: true } | { ok: false; messaggio: string }>;
  richiediReset: (email: string) => Promise<{ ok: true } | { ok: false; messaggio: string }>;
}

export interface RegistraPayload {
  email: string;
  password: string;
  nome: string;
  cognome: string;
  ruolo: UserRole;
  consensi: {
    privacy: true;
    termini: true;
    marketing?: boolean;
    profilazione?: boolean;
  };
}

type AuthContextValue = AuthStato & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

/* ─── Provider ─── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabase(), []);
  const [stato, setStato] = useState<AuthStato>(
    supabaseConfigured ? { stato: "caricamento" } : { stato: "demo" }
  );

  /* Carica profilo utente dalla tabella utenti */
  const caricaProfilo = useCallback(async (sb: NonNullable<typeof supabase>, sessione: Session): Promise<User | null> => {
    const { data, error } = await sb
      .from("utenti")
      .select("*")
      .eq("id", sessione.user.id)
      .maybeSingle();

    if (error || !data) return fallbackUser(sessione.user);
    return rowToUser(data as UtenteRow);
  }, []);

  /* Init: recupera sessione corrente + subscribe a cambi */
  useEffect(() => {
    if (!supabase) return;

    let annullato = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (annullato) return;
      if (data.session) {
        const user = await caricaProfilo(supabase, data.session);
        if (!annullato) {
          setStato(user
            ? { stato: "autenticato", user, sessione: data.session }
            : { stato: "non_autenticato" }
          );
        }
      } else {
        setStato({ stato: "non_autenticato" });
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (evento, sessione) => {
      if (evento === "SIGNED_OUT" || !sessione) {
        setStato({ stato: "non_autenticato" });
        return;
      }
      const user = await caricaProfilo(supabase, sessione);
      setStato(user
        ? { stato: "autenticato", user, sessione }
        : { stato: "non_autenticato" }
      );
    });

    return () => {
      annullato = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase, caricaProfilo]);

  /* ─── Azioni ─── */

  const accedi = useCallback<AuthActions["accedi"]>(async (email, password) => {
    if (!supabase) return { ok: false, messaggio: "Supabase non configurato" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, messaggio: mapErrore(error.message) };
    return { ok: true };
  }, [supabase]);

  const registra = useCallback<AuthActions["registra"]>(async (payload) => {
    if (!supabase) return { ok: false, messaggio: "Supabase non configurato" };

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          nome: payload.nome,
          cognome: payload.cognome,
          ruolo: payload.ruolo,
        },
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/accedi` : undefined,
      },
    });

    if (error) return { ok: false, messaggio: mapErrore(error.message) };

    // Log consensi GDPR (best-effort: se la policy RLS richiede sessione valida
    // e l'utente è in verifica email, il log verrà ritentato al primo login).
    const userId = data.user?.id;
    if (userId) {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
      const consensiRows = [
        { user_id: userId, tipo: "privacy_policy", accettato: true, versione: "1.0", user_agent: ua, metodo: "click" as const },
        { user_id: userId, tipo: "termini_servizio", accettato: true, versione: "1.0", user_agent: ua, metodo: "click" as const },
      ];
      if (payload.consensi.marketing) {
        consensiRows.push({ user_id: userId, tipo: "marketing", accettato: true, versione: "1.0", user_agent: ua, metodo: "click" });
      }
      if (payload.consensi.profilazione) {
        consensiRows.push({ user_id: userId, tipo: "profilazione", accettato: true, versione: "1.0", user_agent: ua, metodo: "click" });
      }
      await supabase.from("consensi").insert(consensiRows);
    }

    const richiedeVerifica = !data.session;
    return { ok: true, richiedeVerifica };
  }, [supabase]);

  const esci = useCallback<AuthActions["esci"]>(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase]);

  const aggiornaProfilo = useCallback<AuthActions["aggiornaProfilo"]>(async (patch) => {
    if (!supabase || stato.stato !== "autenticato") {
      return { ok: false, messaggio: "Sessione non attiva" };
    }
    const { error } = await supabase.from("utenti").update(patch).eq("id", stato.user.id);
    if (error) return { ok: false, messaggio: mapErrore(error.message) };
    return { ok: true };
  }, [supabase, stato]);

  const richiediReset = useCallback<AuthActions["richiediReset"]>(async (email) => {
    if (!supabase) return { ok: false, messaggio: "Supabase non configurato" };
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/accedi` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return { ok: false, messaggio: mapErrore(error.message) };
    return { ok: true };
  }, [supabase]);

  const value: AuthContextValue = {
    ...stato,
    accedi,
    registra,
    esci,
    aggiornaProfilo,
    richiediReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─── Hook ─── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro <AuthProvider>");
  return ctx;
}

/* ─── Fallback: se la tabella utenti non ha ancora la riga, costruisce un User minimale ─── */

function fallbackUser(u: SupabaseUser): User {
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: u.id,
    email: u.email ?? "",
    nome: typeof meta.nome === "string" ? meta.nome : "",
    cognome: typeof meta.cognome === "string" ? meta.cognome : "",
    ruolo: (typeof meta.ruolo === "string" ? meta.ruolo : "cittadino") as UserRole,
    piano: "gratuito",
    moduliAttivi: [],
    consensiGdpr: [],
    creatoIl: u.created_at ?? new Date().toISOString(),
    aggiornatoIl: u.created_at ?? new Date().toISOString(),
    attivo: true,
    emailVerificata: Boolean(u.email_confirmed_at),
    spidVerificato: false,
  };
}
