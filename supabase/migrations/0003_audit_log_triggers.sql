-- ============================================================================
-- digITAle — Migration 0003: Audit Log automatico via trigger
-- ============================================================================
-- Ogni INSERT/UPDATE/DELETE su tabelle sensibili viene registrato in audit_log.
-- Questo è obbligatorio per:
--   - GDPR art. 30 (registro trattamenti)
--   - Conservazione fatture a norma CAD art. 44 (integrità nel tempo)
--   - Forensic readiness in caso di breach
--
-- audit_log esiste già dal 0001_init.sql. Questa migration aggiunge i trigger.
-- ============================================================================

-- Funzione generica trigger: registra ogni modifica
create or replace function public.trigger_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  azione text;
  dati_prima jsonb;
  dati_dopo jsonb;
  ip_origine text;
begin
  -- Estrae utente corrente (null se modifica da servizio/trigger cascata)
  uid := auth.uid();

  if tg_op = 'INSERT' then
    azione := 'crea';
    dati_prima := null;
    dati_dopo := to_jsonb(new);
  elsif tg_op = 'UPDATE' then
    azione := 'modifica';
    dati_prima := to_jsonb(old);
    dati_dopo := to_jsonb(new);
  elsif tg_op = 'DELETE' then
    azione := 'elimina';
    dati_prima := to_jsonb(old);
    dati_dopo := null;
  end if;

  -- Tentativo di catturare IP dalla richiesta (se disponibile via JWT claims)
  begin
    ip_origine := current_setting('request.headers', true)::jsonb->>'x-forwarded-for';
  exception when others then
    ip_origine := null;
  end;

  insert into public.audit_log (
    user_id, risorsa, risorsa_id, azione, dettagli, ip
  ) values (
    uid,
    tg_table_name,
    coalesce(dati_dopo->>'id', dati_prima->>'id'),
    azione,
    jsonb_build_object('prima', dati_prima, 'dopo', dati_dopo),
    ip_origine
  );

  if tg_op = 'DELETE' then
    return old;
  else
    return new;
  end if;
end;
$$;

-- Applica trigger a tabelle sensibili
-- (NON su audit_log stesso — creerebbe loop infinito)

drop trigger if exists audit_utenti on public.utenti;
create trigger audit_utenti
  after insert or update or delete on public.utenti
  for each row execute function public.trigger_audit_log();

drop trigger if exists audit_fatture on public.fatture;
create trigger audit_fatture
  after insert or update or delete on public.fatture
  for each row execute function public.trigger_audit_log();

drop trigger if exists audit_righe_fattura on public.righe_fattura;
create trigger audit_righe_fattura
  after insert or update or delete on public.righe_fattura
  for each row execute function public.trigger_audit_log();

drop trigger if exists audit_clienti on public.clienti;
create trigger audit_clienti
  after insert or update or delete on public.clienti
  for each row execute function public.trigger_audit_log();

drop trigger if exists audit_documenti on public.documenti;
create trigger audit_documenti
  after insert or update or delete on public.documenti
  for each row execute function public.trigger_audit_log();

drop trigger if exists audit_consensi on public.consensi;
create trigger audit_consensi
  after insert or update or delete on public.consensi
  for each row execute function public.trigger_audit_log();

-- ============================================================================
-- audit_log: immutabile. Nessuno può UPDATE o DELETE una riga di audit.
-- ============================================================================

-- Revoca UPDATE/DELETE a tutti (inclusi authenticated), consentendo solo INSERT dal trigger
revoke update, delete on public.audit_log from authenticated, anon;

-- Retention: audit_log cresce linearmente. Aggiungiamo index per cleanup automatico dopo N anni.
-- idx_audit_timestamp already created by 0001_init.sql
create index if not exists idx_audit_log_risorsa_record on public.audit_log(risorsa, risorsa_id);
create index if not exists idx_audit_log_user_id on public.audit_log(user_id) where user_id is not null;

comment on function public.trigger_audit_log() is
  'Trigger di audit: cattura chi/cosa/quando/come per ogni modifica a tabelle sensibili. Immutabile.';
