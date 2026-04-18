-- ============================================================================
-- DigiITAle — Migration 0006 — Sistema Referral
-- Aggiunge referral_code e referred_by a utenti.
-- Aggiorna handle_new_user() per generare codice univoco al signup.
-- ============================================================================

alter table public.utenti
  add column if not exists referral_code text unique default null,
  add column if not exists referred_by uuid references public.utenti(id) on delete set null default null;

create index if not exists idx_utenti_referral_code
  on public.utenti(referral_code)
  where referral_code is not null;

-- Riscrive la funzione: genera referral_code + accetta referred_by da user_metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_referral text;
  v_referred uuid;
begin
  loop
    v_referral := encode(gen_random_bytes(4), 'hex');
    exit when not exists (select 1 from public.utenti where referral_code = v_referral);
  end loop;

  begin
    v_referred := (new.raw_user_meta_data->>'referred_by')::uuid;
  exception when others then
    v_referred := null;
  end;

  insert into public.utenti (
    id, email, nome, cognome, ruolo,
    email_verificata, referral_code, referred_by
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'cognome', ''),
    coalesce(new.raw_user_meta_data->>'ruolo', 'cittadino'),
    new.email_confirmed_at is not null,
    v_referral,
    v_referred
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
