/**
 * DigiITAle — Supabase Client (browser)
 *
 * Singleton lato client. Usato dalle pagine "use client".
 * Static export Netlify → tutta l'auth avviene nel browser via ANON key + RLS.
 *
 * Configurazione:
 *   NEXT_PUBLIC_SUPABASE_URL       (dal dashboard Supabase)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  (chiave pubblica, safe nel bundle)
 *
 * RLS è OBBLIGATORIA su ogni tabella: la ANON key non bypassa mai la sicurezza,
 * filtra solo via auth.uid() definito nelle policy (vedi 0001_init.sql).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True se le env vars sono configurate. Permette al sito di buildare anche senza Supabase. */
export const supabaseConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

/**
 * Ritorna il client Supabase oppure null se non configurato.
 * Le pagine UI devono gestire entrambi i casi (demo mode vs connected).
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (cached) return cached;
  cached = createClient(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "digitale-auth",
    },
  });
  return cached;
}
