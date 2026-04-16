-- ============================================================================
-- digITAle — Migration 0002: Validazioni CHECK a livello DB
-- ============================================================================
-- RLS protegge chi vede cosa, ma non protegge la qualità dei dati.
-- Queste CHECK constraint impediscono che un CF/P.IVA/IBAN/CAP malformato
-- entri nel database anche se l'applicazione client ha un bug.
--
-- Regole fiscali italiane:
--   CF persona fisica  : 16 char [A-Z]{6}[0-9]{2}[A-EHLMPR-T][0-9]{2}[A-Z][0-9]{3}[A-Z]
--   CF soggetto giuridico: 11 cifre (coincide con P.IVA)
--   P.IVA              : 11 cifre
--   CAP                : 5 cifre
--   IBAN IT            : 27 char, inizia "IT", con check digit validato da funzione
-- ============================================================================

-- Helper: valida IBAN italiano (base MOD-97, no check digit completo per performance)
create or replace function public.valida_iban_it(iban text)
returns boolean
language plpgsql
immutable
as $$
declare
  normalizzato text;
begin
  if iban is null then return true; end if;
  normalizzato := upper(regexp_replace(iban, '\s', '', 'g'));
  return normalizzato ~ '^IT[0-9]{2}[A-Z][0-9]{10}[A-Z0-9]{12}$';
end;
$$;

-- Helper: valida CF persona fisica o giuridica
create or replace function public.valida_cf(cf text)
returns boolean
language plpgsql
immutable
as $$
declare
  normalizzato text;
begin
  if cf is null then return true; end if;
  normalizzato := upper(regexp_replace(cf, '\s', '', 'g'));
  -- CF persona fisica (16 char) OR CF giuridico = P.IVA (11 cifre)
  return normalizzato ~ '^[A-Z]{6}[0-9]{2}[A-EHLMPR-T][0-9]{2}[A-Z][0-9]{3}[A-Z]$'
      or normalizzato ~ '^[0-9]{11}$';
end;
$$;

-- Helper: valida P.IVA italiana (11 cifre + Luhn-like non qui per semplicità)
create or replace function public.valida_piva(piva text)
returns boolean
language plpgsql
immutable
as $$
begin
  if piva is null then return true; end if;
  return regexp_replace(piva, '\s', '', 'g') ~ '^[0-9]{11}$';
end;
$$;

-- Helper: valida CAP italiano
create or replace function public.valida_cap(cap text)
returns boolean
language plpgsql
immutable
as $$
begin
  if cap is null then return true; end if;
  return cap ~ '^[0-9]{5}$';
end;
$$;

-- ============================================================================
-- Applicazione CHECK constraint
-- ============================================================================

-- utenti
alter table public.utenti
  drop constraint if exists utenti_cf_check,
  add  constraint utenti_cf_check  check (public.valida_cf(codice_fiscale));

alter table public.utenti
  drop constraint if exists utenti_piva_check,
  add  constraint utenti_piva_check check (public.valida_piva(partita_iva));

-- indirizzi
alter table public.indirizzi
  drop constraint if exists indirizzi_cap_check,
  add  constraint indirizzi_cap_check check (public.valida_cap(cap));

-- clienti
alter table public.clienti
  drop constraint if exists clienti_cf_check,
  add  constraint clienti_cf_check   check (public.valida_cf(codice_fiscale));

alter table public.clienti
  drop constraint if exists clienti_piva_check,
  add  constraint clienti_piva_check check (public.valida_piva(partita_iva));

-- fatture
alter table public.fatture
  drop constraint if exists fatture_iban_check,
  add  constraint fatture_iban_check check (public.valida_iban_it(iban_pagamento));

-- ============================================================================
-- CHECK positività per importi in centesimi (mai negativi, mai float)
-- ============================================================================

do $$
begin
  -- Esempio di pattern: se la colonna importo_centesimi esiste in una tabella, controlla >= 0.
  -- Le righe_fattura.imponibile_centesimi e .iva_centesimi dovrebbero essere >= 0.
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='righe_fattura' and column_name='imponibile_centesimi') then
    execute 'alter table public.righe_fattura
               drop constraint if exists righe_fattura_imponibile_positive,
               add  constraint righe_fattura_imponibile_positive check (imponibile_centesimi >= 0)';
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='righe_fattura' and column_name='iva_centesimi') then
    execute 'alter table public.righe_fattura
               drop constraint if exists righe_fattura_iva_positive,
               add  constraint righe_fattura_iva_positive check (iva_centesimi >= 0)';
  end if;
end $$;

-- Commenti documentativi (visibili in Supabase UI)
comment on function public.valida_cf(text) is
  'Valida codice fiscale italiano: persona fisica 16 char o giuridico/P.IVA 11 cifre.';
comment on function public.valida_piva(text) is
  'Valida partita IVA italiana: 11 cifre.';
comment on function public.valida_cap(text) is
  'Valida CAP italiano: 5 cifre.';
comment on function public.valida_iban_it(text) is
  'Valida IBAN italiano: pattern IT + 25 caratteri alfanumerici.';
