-- ============================================================================
-- digITAle — RLS Penetration Test (isolamento multi-tenant)
-- ============================================================================
-- Scopo: verificare che un utente NON possa MAI leggere/modificare dati di altri.
-- Esecuzione: chiamato da CI dopo ogni migration. Fallisce se trova data leak.
--
-- Come eseguire:
--   psql $SUPABASE_DB_URL -f supabase/tests/rls_isolation.sql
--
-- Exit: RAISE EXCEPTION se trova violazione; success se pulito.
-- ============================================================================

begin;

-- Crea due utenti fittizi
do $$
declare
  utente_a uuid := '11111111-1111-1111-1111-111111111111';
  utente_b uuid := '22222222-2222-2222-2222-222222222222';
  leak_count integer;
begin
  -- Inserisce dati per A e B (simulando l'utenza)
  -- Insert via service_role (bypassa RLS per setup)
  insert into auth.users (id, email, encrypted_password, created_at)
  values
    (utente_a, 'a-test@digitale.local', '$2a$10$dummy', now()),
    (utente_b, 'b-test@digitale.local', '$2a$10$dummy', now())
  on conflict (id) do nothing;

  insert into public.utenti (id, email, nome, cognome)
  values
    (utente_a, 'a-test@digitale.local', 'Alice', 'Test'),
    (utente_b, 'b-test@digitale.local', 'Bob', 'Test')
  on conflict (id) do nothing;

  -- Inserisce una fattura per A
  insert into public.fatture (user_id, numero, data_emissione, totale_centesimi)
  values (utente_a, 'TEST-A-001', current_date, 100000)
  on conflict do nothing;

  -- ========================================================================
  -- TEST 1: utente B non deve vedere le fatture di A
  -- ========================================================================
  -- Simula sessione di B
  perform set_config('request.jwt.claims', json_build_object('sub', utente_b::text, 'role', 'authenticated')::text, true);
  perform set_config('role', 'authenticated', true);

  select count(*) into leak_count
  from public.fatture
  where user_id = utente_a;

  if leak_count > 0 then
    raise exception 'RLS LEAK: utente B vede % fatture di utente A', leak_count;
  end if;

  -- ========================================================================
  -- TEST 2: utente B non deve poter UPDATE fatture di A
  -- ========================================================================
  begin
    update public.fatture set totale_centesimi = 0 where user_id = utente_a;
    -- Se arriviamo qui senza errore, verifica se ha effettivamente modificato
    if exists (select 1 from public.fatture where user_id = utente_a and totale_centesimi = 0) then
      raise exception 'RLS LEAK: utente B ha modificato fatture di utente A';
    end if;
  exception when insufficient_privilege then
    -- Atteso: RLS blocca
    null;
  end;

  -- ========================================================================
  -- TEST 3: utente B non deve poter DELETE fatture di A
  -- ========================================================================
  begin
    delete from public.fatture where user_id = utente_a;
    if not exists (select 1 from public.fatture where user_id = utente_a and numero = 'TEST-A-001') then
      raise exception 'RLS LEAK: utente B ha eliminato fatture di utente A';
    end if;
  exception when insufficient_privilege then
    null;
  end;

  -- ========================================================================
  -- TEST 4: utente B non deve vedere profilo utente di A
  -- ========================================================================
  select count(*) into leak_count
  from public.utenti
  where id = utente_a;

  if leak_count > 0 then
    raise exception 'RLS LEAK: utente B vede profilo di utente A';
  end if;

  -- ========================================================================
  -- TEST 5: utente B non deve poter INSERIRE con user_id di A
  -- ========================================================================
  begin
    insert into public.fatture (user_id, numero, data_emissione, totale_centesimi)
    values (utente_a, 'TEST-IMPERSONATION', current_date, 1);
    raise exception 'RLS LEAK: utente B ha inserito con user_id di A';
  exception when insufficient_privilege or check_violation then
    null;
  end;

  raise notice '✅ Tutti i test RLS isolation passati.';
end $$;

-- Rollback: non persistiamo i dati di test
rollback;
