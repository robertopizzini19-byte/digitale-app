-- ============================================================================
-- digITAle — Migration 0004: Rate limiting lato DB
-- ============================================================================
-- Supabase Auth ha già un rate-limit base per signup/login (configurabile in UI).
-- Questa tabella serve per rate-limiting di azioni custom dalla nostra app:
--   - richieste reset password
--   - invio email/PEC
--   - upload documenti
--   - chiamate API voice (ChatGPT-like)
--
-- Pattern: token bucket semplice per (user_id, azione, finestra).
-- ============================================================================

create table if not exists public.rate_limit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  chiave text not null, -- es. "reset_password", "email_pec", "voice_query"
  finestra_inizio timestamptz not null default now(),
  contatore integer not null default 1,
  creato_il timestamptz not null default now(),
  constraint rate_limit_contatore_positive check (contatore > 0)
);

create unique index if not exists idx_rate_limit_user_chiave_finestra
  on public.rate_limit(user_id, chiave, finestra_inizio);

create index if not exists idx_rate_limit_cleanup
  on public.rate_limit(finestra_inizio);

-- RLS: ogni utente vede solo i propri rate-limit (per trasparenza, opzionale)
alter table public.rate_limit enable row level security;

drop policy if exists "rate_limit_own_select" on public.rate_limit;
create policy "rate_limit_own_select"
  on public.rate_limit for select
  using (auth.uid() = user_id);

-- Solo service_role scrive (edge functions / backend); nessun client scrive direttamente
revoke insert, update, delete on public.rate_limit from authenticated, anon;

-- ============================================================================
-- Funzione: consuma_rate_limit — atomica, sicura in concorrenza
-- ============================================================================
-- Ritorna true se la richiesta è consentita, false se oltre limite.
-- Usa advisory lock per race-safety.
--
-- Esempio: select public.consuma_rate_limit('reset_password', 5, 3600);
--   → max 5 richieste per finestra di 3600 secondi (1 ora)
-- ============================================================================

create or replace function public.consuma_rate_limit(
  p_chiave text,
  p_max integer,
  p_finestra_secondi integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  inizio_finestra timestamptz;
  contatore_attuale integer;
begin
  uid := auth.uid();
  if uid is null then
    return false; -- Utente non autenticato: deny (rate-limit anon gestito diversamente)
  end if;

  -- Advisory lock per-utente+chiave: previene race su concorrenza alta
  perform pg_advisory_xact_lock(hashtext(uid::text || p_chiave));

  -- Finestra corrente: arrotondata a p_finestra_secondi
  inizio_finestra := to_timestamp(
    floor(extract(epoch from now()) / p_finestra_secondi) * p_finestra_secondi
  );

  -- Upsert + increment
  insert into public.rate_limit (user_id, chiave, finestra_inizio, contatore)
  values (uid, p_chiave, inizio_finestra, 1)
  on conflict (user_id, chiave, finestra_inizio)
  do update set contatore = rate_limit.contatore + 1
  returning contatore into contatore_attuale;

  return contatore_attuale <= p_max;
end;
$$;

-- ============================================================================
-- Cleanup: elimina rate_limit entries vecchie (> 7 giorni)
-- Chiamata schedulata da pg_cron (Supabase lo supporta sui piani pagati) o
-- da edge function nightly.
-- ============================================================================

create or replace function public.cleanup_rate_limit_vecchi()
returns integer
language plpgsql
security definer
as $$
declare
  eliminati integer;
begin
  delete from public.rate_limit where finestra_inizio < now() - interval '7 days';
  get diagnostics eliminati = row_count;
  return eliminati;
end;
$$;

comment on function public.consuma_rate_limit(text, integer, integer) is
  'Consuma 1 unità del rate-limit per la chiave data. Ritorna true se sotto soglia.';
comment on function public.cleanup_rate_limit_vecchi() is
  'Cleanup entries rate_limit più vecchi di 7 giorni. Da schedulare nightly.';
