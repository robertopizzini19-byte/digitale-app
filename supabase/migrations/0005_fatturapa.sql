-- ============================================================================
-- digITAle — Migration 0005 — FatturaPA/SDI support
-- ----------------------------------------------------------------------------
-- Prerequisiti: 0001 .. 0004 applicate.
--
-- Aggiunge:
--   - Tabella progressivi_invio (contatore atomico invio SDI per anno)
--   - RPC progressivo_fattura_next (advisory lock + increment + return)
--   - Tabella sdi_ricevute (storage risposte SDI)
--   - Bucket Storage 'fatture-xml' (privato, cifrato)
-- ============================================================================

-- ─── progressivi_invio ──────────────────────────────────────────────────────
create table if not exists public.progressivi_invio (
  user_id uuid not null references public.utenti(id) on delete cascade,
  anno integer not null check (anno between 2020 and 2100),
  ultimo_progressivo integer not null default 0,
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now(),
  primary key (user_id, anno)
);

alter table public.progressivi_invio enable row level security;

drop policy if exists "progressivi_invio_read_own" on public.progressivi_invio;
create policy "progressivi_invio_read_own" on public.progressivi_invio
  for select using (user_id = auth.uid());

-- No INSERT/UPDATE diretti: solo via RPC
drop policy if exists "progressivi_invio_no_write" on public.progressivi_invio;
create policy "progressivi_invio_no_write" on public.progressivi_invio
  for all using (false) with check (false);

drop trigger if exists trg_progressivi_invio_aggiornato_il on public.progressivi_invio;
create trigger trg_progressivi_invio_aggiornato_il
  before update on public.progressivi_invio
  for each row execute function public.set_aggiornato_il();

-- ─── RPC: progressivo_fattura_next ──────────────────────────────────────────
-- Advisory lock 2-chiavi per evitare race tra invii concorrenti stesso utente/anno.
-- Chiamabile SOLO da service_role (Edge Function); gli utenti non ci arrivano.
create or replace function public.progressivo_fattura_next(
  p_lock_a integer,
  p_lock_b integer,
  p_user_id uuid,
  p_anno integer
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_next integer;
begin
  -- Acquisisci lock transazionale (rilasciato a commit/rollback)
  perform pg_advisory_xact_lock(p_lock_a, p_lock_b);

  -- Upsert + increment atomico
  insert into public.progressivi_invio (user_id, anno, ultimo_progressivo)
  values (p_user_id, p_anno, 1)
  on conflict (user_id, anno) do update
    set ultimo_progressivo = public.progressivi_invio.ultimo_progressivo + 1,
        aggiornato_il = now()
  returning ultimo_progressivo into v_next;

  return v_next;
end;
$$;

revoke all on function public.progressivo_fattura_next(integer, integer, uuid, integer) from public;
grant execute on function public.progressivo_fattura_next(integer, integer, uuid, integer) to service_role;

-- ─── sdi_ricevute ───────────────────────────────────────────────────────────
-- Registra le notifiche ricevute da SDI (consegna / accettata / rifiutata / ...)
create table if not exists public.sdi_ricevute (
  id uuid primary key default gen_random_uuid(),
  fattura_id uuid not null references public.fatture(id) on delete cascade,
  user_id uuid not null references public.utenti(id) on delete cascade,
  tipo_notifica text not null
    check (tipo_notifica in ('RC','NS','MC','NE','MT','EC','SE','DT')),
  id_trasmissione text,
  ricevuta_xml_url text,
  messaggio text,
  ricevuta_il timestamptz not null default now(),
  hash_ricevuta text,
  creato_il timestamptz not null default now()
);

create index if not exists idx_sdi_ricevute_fattura on public.sdi_ricevute(fattura_id);
create index if not exists idx_sdi_ricevute_user on public.sdi_ricevute(user_id);

alter table public.sdi_ricevute enable row level security;

drop policy if exists "sdi_ricevute_own" on public.sdi_ricevute;
create policy "sdi_ricevute_own" on public.sdi_ricevute
  for select using (user_id = auth.uid());

drop policy if exists "sdi_ricevute_no_write" on public.sdi_ricevute;
create policy "sdi_ricevute_no_write" on public.sdi_ricevute
  for all using (false) with check (false);

-- ─── Storage bucket 'fatture-xml' ───────────────────────────────────────────
-- Bucket privato per XML FatturaPA. Access solo via signed URL (Edge Function).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fatture-xml', 'fatture-xml', false, 10485760, array['application/xml', 'text/xml'])
on conflict (id) do nothing;

-- Policy storage: utenti vedono solo i propri file (path: user_id/anno/...)
drop policy if exists "fatture_xml_read_own" on storage.objects;
create policy "fatture_xml_read_own" on storage.objects
  for select using (
    bucket_id = 'fatture-xml'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "fatture_xml_no_direct_write" on storage.objects;
create policy "fatture_xml_no_direct_write" on storage.objects
  for insert with check (false);

-- service_role bypassa automaticamente RLS storage

-- ─── Indici addizionali fatture per query SDI ──────────────────────────────
create index if not exists idx_fatture_sdi_stato on public.fatture(sdi_stato)
  where sdi_stato is not null;
create index if not exists idx_fatture_sdi_trasmissione on public.fatture(sdi_id_trasmissione)
  where sdi_id_trasmissione is not null;

-- ============================================================================
-- Fine migration 0005
-- ============================================================================
