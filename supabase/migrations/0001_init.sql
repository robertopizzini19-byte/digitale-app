-- ============================================================================
-- DigiITAle — Migration 0001 — Schema iniziale
-- ----------------------------------------------------------------------------
-- Esegui su Supabase SQL Editor (nuovo progetto) dopo la creazione.
-- Tutto idempotente: safe re-run in caso di errore.
--
-- Convenzioni:
--   - UUID v4 per tutte le PK
--   - snake_case italiano
--   - timestamps: creato_il, aggiornato_il (trigger auto-update)
--   - soft delete: eliminato_il (null = attivo)
--   - importi: centesimi (integer, mai float)
--   - multi-tenant: user_id + RLS su auth.uid()
-- ============================================================================

-- ─── Extensions ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ─── Trigger helper: aggiornato_il ─────────────────────────────────────────
create or replace function public.set_aggiornato_il()
returns trigger
language plpgsql
as $$
begin
  new.aggiornato_il := now();
  return new;
end;
$$;

-- ─── 1. utenti (profilo collegato a auth.users) ────────────────────────────
create table if not exists public.utenti (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  nome text not null default '',
  cognome text not null default '',
  codice_fiscale text,
  partita_iva text,
  telefono text,
  pec text,
  ruolo text not null default 'cittadino'
    check (ruolo in ('cittadino','freelance','pmi','pa','studente','estero')),
  piano text not null default 'gratuito'
    check (piano in ('gratuito','professionista','impresa')),
  moduli_attivi text[] not null default '{}',
  avatar_url text,
  email_verificata boolean not null default false,
  spid_verificato boolean not null default false,
  stripe_customer_id text,
  attivo boolean not null default true,
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now(),
  ultimo_accesso timestamptz,
  eliminato_il timestamptz
);

create index if not exists idx_utenti_ruolo on public.utenti(ruolo) where eliminato_il is null;
create index if not exists idx_utenti_piano on public.utenti(piano) where eliminato_il is null;

drop trigger if exists trg_utenti_aggiornato_il on public.utenti;
create trigger trg_utenti_aggiornato_il
  before update on public.utenti
  for each row execute function public.set_aggiornato_il();

-- Auto-crea profilo utenti quando Supabase Auth inserisce nuovo auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.utenti (id, email, nome, cognome, ruolo, email_verificata)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'cognome', ''),
    coalesce(new.raw_user_meta_data->>'ruolo', 'cittadino'),
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 2. indirizzi ──────────────────────────────────────────────────────────
create table if not exists public.indirizzi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.utenti(id) on delete cascade,
  tipo text not null
    check (tipo in ('residenza','sede_legale','sede_operativa','fatturazione')),
  via text not null,
  civico text not null,
  cap text not null,
  comune text not null,
  provincia text not null,
  nazione text not null default 'IT',
  predefinito boolean not null default false,
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now()
);

create index if not exists idx_indirizzi_user on public.indirizzi(user_id);

drop trigger if exists trg_indirizzi_aggiornato_il on public.indirizzi;
create trigger trg_indirizzi_aggiornato_il
  before update on public.indirizzi
  for each row execute function public.set_aggiornato_il();

-- ─── 3. clienti ────────────────────────────────────────────────────────────
create table if not exists public.clienti (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.utenti(id) on delete cascade,
  tipo text not null
    check (tipo in ('persona_fisica','persona_giuridica')),
  nome text not null,
  cognome text,
  ragione_sociale text,
  codice_fiscale text,
  partita_iva text,
  codice_sdi text,
  pec text,
  email citext,
  telefono text,
  note text,
  attivo boolean not null default true,
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now(),
  eliminato_il timestamptz
);

create index if not exists idx_clienti_user on public.clienti(user_id) where eliminato_il is null;
create index if not exists idx_clienti_piva on public.clienti(partita_iva) where partita_iva is not null;

drop trigger if exists trg_clienti_aggiornato_il on public.clienti;
create trigger trg_clienti_aggiornato_il
  before update on public.clienti
  for each row execute function public.set_aggiornato_il();

-- ─── 4. fatture ────────────────────────────────────────────────────────────
create table if not exists public.fatture (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.utenti(id) on delete cascade,
  cliente_id uuid not null references public.clienti(id) on delete restrict,
  numero text not null,
  anno integer not null,
  tipo text not null default 'fattura'
    check (tipo in ('fattura','nota_credito','parcella','proforma')),
  stato text not null default 'bozza'
    check (stato in ('bozza','emessa','inviata_sdi','accettata','rifiutata','pagata','scaduta','annullata')),
  data_emissione date not null,
  data_scadenza date not null,
  imponibile_centesimi bigint not null default 0,
  iva_percentuale numeric(5,2) not null default 22,
  iva_centesimi bigint not null default 0,
  totale_centesimi bigint not null default 0,
  ritenuta_acconto_centesimi bigint not null default 0,
  contributo_integrativo_centesimi bigint not null default 0,
  netto_a_pagare_centesimi bigint not null default 0,
  valuta text not null default 'EUR' check (valuta = 'EUR'),
  sdi_id_trasmissione text,
  sdi_stato text,
  sdi_data_invio timestamptz,
  sdi_data_risposta timestamptz,
  xml_fattura_url text,
  pdf_fattura_url text,
  metodo_pagamento text
    check (metodo_pagamento is null or metodo_pagamento in
      ('bonifico','contanti','carta','paypal','ri_ba','altro')),
  iban_pagamento text,
  data_pagamento date,
  oggetto text,
  note text,
  note_interne text,
  bollo_virtuale boolean not null default false,
  bollo_importo_centesimi bigint not null default 0,
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now(),
  eliminato_il timestamptz,
  unique (user_id, anno, numero)
);

create index if not exists idx_fatture_user on public.fatture(user_id) where eliminato_il is null;
create index if not exists idx_fatture_cliente on public.fatture(cliente_id);
create index if not exists idx_fatture_stato on public.fatture(stato) where eliminato_il is null;
create index if not exists idx_fatture_scadenza on public.fatture(data_scadenza) where eliminato_il is null;

drop trigger if exists trg_fatture_aggiornato_il on public.fatture;
create trigger trg_fatture_aggiornato_il
  before update on public.fatture
  for each row execute function public.set_aggiornato_il();

-- ─── 5. righe_fattura ──────────────────────────────────────────────────────
create table if not exists public.righe_fattura (
  id uuid primary key default gen_random_uuid(),
  fattura_id uuid not null references public.fatture(id) on delete cascade,
  ordine integer not null default 0,
  descrizione text not null,
  quantita numeric(12,3) not null default 1,
  prezzo_unitario_centesimi bigint not null default 0,
  sconto_percentuale numeric(5,2) not null default 0,
  iva_percentuale numeric(5,2) not null default 22,
  totale_centesimi bigint not null default 0,
  codice_articolo text,
  unita_misura text
);

create index if not exists idx_righe_fattura on public.righe_fattura(fattura_id);

-- ─── 6. scadenze ───────────────────────────────────────────────────────────
create table if not exists public.scadenze (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.utenti(id) on delete cascade,
  tipo text not null
    check (tipo in ('iva','inps','irpef','irap','f24','pec','firma_digitale','assicurazione','contratto','altro')),
  titolo text not null,
  descrizione text,
  data_scadenza date not null,
  importo_centesimi bigint,
  stato text not null default 'attiva'
    check (stato in ('attiva','completata','scaduta','annullata')),
  priorita text not null default 'normale'
    check (priorita in ('bassa','normale','alta','urgente')),
  promemoria_giorni integer[] not null default '{30,7,1}',
  ricorrenza text not null default 'nessuna'
    check (ricorrenza in ('nessuna','mensile','trimestrale','annuale')),
  fattura_id uuid references public.fatture(id) on delete set null,
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now()
);

create index if not exists idx_scadenze_user on public.scadenze(user_id);
create index if not exists idx_scadenze_data on public.scadenze(data_scadenza);

drop trigger if exists trg_scadenze_aggiornato_il on public.scadenze;
create trigger trg_scadenze_aggiornato_il
  before update on public.scadenze
  for each row execute function public.set_aggiornato_il();

-- ─── 7. documenti ──────────────────────────────────────────────────────────
create table if not exists public.documenti (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.utenti(id) on delete cascade,
  tipo text not null
    check (tipo in ('fattura_xml','fattura_pdf','contratto','identita','certificato','altro')),
  nome text not null,
  descrizione text,
  mime_type text not null,
  dimensione_bytes bigint not null,
  storage_path text not null,
  hash_sha256 text not null,
  categoria text,
  tags text[] not null default '{}',
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now(),
  eliminato_il timestamptz
);

create index if not exists idx_documenti_user on public.documenti(user_id) where eliminato_il is null;
create index if not exists idx_documenti_hash on public.documenti(hash_sha256);

drop trigger if exists trg_documenti_aggiornato_il on public.documenti;
create trigger trg_documenti_aggiornato_il
  before update on public.documenti
  for each row execute function public.set_aggiornato_il();

-- ─── 8. consensi (GDPR art. 7 — tracciabilità) ─────────────────────────────
create table if not exists public.consensi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.utenti(id) on delete cascade,
  tipo text not null,
  accettato boolean not null,
  versione text not null,
  ip text,
  user_agent text,
  metodo text not null default 'click'
    check (metodo in ('click','spid','api')),
  data_accettazione timestamptz not null default now(),
  data_revoca timestamptz
);

create index if not exists idx_consensi_user on public.consensi(user_id);

-- ─── 9. audit_log (immutabile, append-only) ────────────────────────────────
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.utenti(id) on delete set null,
  azione text not null,
  risorsa text not null,
  risorsa_id text,
  dettagli jsonb,
  ip text,
  user_agent text,
  timestamp timestamptz not null default now()
);

create index if not exists idx_audit_user on public.audit_log(user_id);
create index if not exists idx_audit_risorsa on public.audit_log(risorsa, risorsa_id);
create index if not exists idx_audit_timestamp on public.audit_log(timestamp desc);

-- ─── 10. notifiche ─────────────────────────────────────────────────────────
create table if not exists public.notifiche (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.utenti(id) on delete cascade,
  tipo text not null
    check (tipo in ('scadenza','fattura','pagamento','sistema','aggiornamento')),
  titolo text not null,
  messaggio text not null,
  letta boolean not null default false,
  azione_url text,
  creato_il timestamptz not null default now(),
  letto_il timestamptz
);

create index if not exists idx_notifiche_user_nonlette on public.notifiche(user_id) where letta = false;

-- ============================================================================
-- ROW LEVEL SECURITY
-- Ogni utente vede SOLO le proprie righe. auth.uid() arriva dal JWT Supabase.
-- ============================================================================

alter table public.utenti enable row level security;
alter table public.indirizzi enable row level security;
alter table public.clienti enable row level security;
alter table public.fatture enable row level security;
alter table public.righe_fattura enable row level security;
alter table public.scadenze enable row level security;
alter table public.documenti enable row level security;
alter table public.consensi enable row level security;
alter table public.audit_log enable row level security;
alter table public.notifiche enable row level security;

-- utenti: ciascuno vede/modifica solo se stesso
drop policy if exists "utenti_self_select" on public.utenti;
create policy "utenti_self_select" on public.utenti
  for select using (auth.uid() = id);

drop policy if exists "utenti_self_update" on public.utenti;
create policy "utenti_self_update" on public.utenti
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policy generica riusabile: user_id = auth.uid()
-- (applicata singolarmente sotto per chiarezza)

-- indirizzi
drop policy if exists "indirizzi_own" on public.indirizzi;
create policy "indirizzi_own" on public.indirizzi
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- clienti
drop policy if exists "clienti_own" on public.clienti;
create policy "clienti_own" on public.clienti
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- fatture
drop policy if exists "fatture_own" on public.fatture;
create policy "fatture_own" on public.fatture
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- righe_fattura: via join fatture
drop policy if exists "righe_fattura_own" on public.righe_fattura;
create policy "righe_fattura_own" on public.righe_fattura
  for all using (
    exists (select 1 from public.fatture f where f.id = fattura_id and f.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.fatture f where f.id = fattura_id and f.user_id = auth.uid())
  );

-- scadenze
drop policy if exists "scadenze_own" on public.scadenze;
create policy "scadenze_own" on public.scadenze
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- documenti
drop policy if exists "documenti_own" on public.documenti;
create policy "documenti_own" on public.documenti
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- consensi (insert libero per utente, select limitato al proprio)
drop policy if exists "consensi_own_select" on public.consensi;
create policy "consensi_own_select" on public.consensi
  for select using (auth.uid() = user_id);

drop policy if exists "consensi_own_insert" on public.consensi;
create policy "consensi_own_insert" on public.consensi
  for insert with check (auth.uid() = user_id);

-- audit_log: solo lettura del proprio, nessuna modifica client-side
drop policy if exists "audit_own_select" on public.audit_log;
create policy "audit_own_select" on public.audit_log
  for select using (auth.uid() = user_id);

-- notifiche: lettura e update (marcare come letta) solo del proprio
drop policy if exists "notifiche_own_select" on public.notifiche;
create policy "notifiche_own_select" on public.notifiche
  for select using (auth.uid() = user_id);

drop policy if exists "notifiche_own_update" on public.notifiche;
create policy "notifiche_own_update" on public.notifiche
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- FINE MIGRATION 0001
-- ============================================================================
