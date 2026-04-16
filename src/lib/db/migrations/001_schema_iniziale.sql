-- ============================================================
-- digITAle — Migration 001: Schema Iniziale
-- Database: PostgreSQL (Supabase)
-- Sicurezza: RLS (Row Level Security) su TUTTE le tabelle
-- ============================================================

-- Abilita estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- UTENTI
-- ============================================================

CREATE TABLE utenti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Dati auth (collegati a auth.users di Supabase)
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  -- Anagrafica
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  codice_fiscale TEXT,
  partita_iva TEXT,
  telefono TEXT,
  pec TEXT,
  avatar_url TEXT,
  -- Ruolo e piano
  ruolo TEXT NOT NULL DEFAULT 'cittadino'
    CHECK (ruolo IN ('cittadino', 'freelance', 'pmi', 'pa', 'studente', 'estero')),
  piano TEXT NOT NULL DEFAULT 'gratuito'
    CHECK (piano IN ('gratuito', 'professionista', 'impresa')),
  moduli_attivi TEXT[] DEFAULT '{}',
  -- Stato
  email_verificata BOOLEAN DEFAULT FALSE,
  spid_verificato BOOLEAN DEFAULT FALSE,
  attivo BOOLEAN DEFAULT TRUE,
  -- Stripe
  stripe_customer_id TEXT,
  -- Timestamps
  creato_il TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il TIMESTAMPTZ DEFAULT NOW(),
  ultimo_accesso TIMESTAMPTZ,
  eliminato_il TIMESTAMPTZ
);

CREATE INDEX idx_utenti_email ON utenti(email);
CREATE INDEX idx_utenti_ruolo ON utenti(ruolo);
CREATE INDEX idx_utenti_piano ON utenti(piano);
CREATE INDEX idx_utenti_attivo ON utenti(attivo) WHERE attivo = TRUE;

-- ============================================================
-- INDIRIZZI
-- ============================================================

CREATE TABLE indirizzi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('residenza', 'sede_legale', 'sede_operativa', 'fatturazione')),
  via TEXT NOT NULL,
  civico TEXT NOT NULL,
  cap TEXT NOT NULL CHECK (cap ~ '^\d{5}$'),
  comune TEXT NOT NULL,
  provincia TEXT NOT NULL CHECK (LENGTH(provincia) = 2),
  nazione TEXT NOT NULL DEFAULT 'IT',
  predefinito BOOLEAN DEFAULT FALSE,
  creato_il TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_indirizzi_user ON indirizzi(user_id);

-- ============================================================
-- CLIENTI
-- ============================================================

CREATE TABLE clienti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('persona_fisica', 'persona_giuridica')),
  nome TEXT NOT NULL,
  cognome TEXT,
  ragione_sociale TEXT,
  codice_fiscale TEXT,
  partita_iva TEXT,
  codice_sdi TEXT DEFAULT '0000000',
  pec TEXT,
  email TEXT,
  telefono TEXT,
  note TEXT,
  attivo BOOLEAN DEFAULT TRUE,
  creato_il TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il TIMESTAMPTZ DEFAULT NOW(),
  eliminato_il TIMESTAMPTZ
);

CREATE INDEX idx_clienti_user ON clienti(user_id);
CREATE INDEX idx_clienti_attivo ON clienti(user_id, attivo) WHERE attivo = TRUE;

-- ============================================================
-- FATTURE
-- ============================================================

CREATE TABLE fatture (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clienti(id),
  -- Identificazione
  numero TEXT NOT NULL,
  anno INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  tipo TEXT NOT NULL DEFAULT 'fattura'
    CHECK (tipo IN ('fattura', 'nota_credito', 'parcella', 'proforma')),
  stato TEXT NOT NULL DEFAULT 'bozza'
    CHECK (stato IN ('bozza', 'emessa', 'inviata_sdi', 'accettata', 'rifiutata', 'pagata', 'scaduta', 'annullata')),
  -- Date
  data_emissione DATE NOT NULL DEFAULT CURRENT_DATE,
  data_scadenza DATE NOT NULL,
  -- Importi (SEMPRE in centesimi per evitare errori floating point)
  imponibile_centesimi INTEGER NOT NULL DEFAULT 0,
  iva_percentuale NUMERIC(5,2) NOT NULL DEFAULT 22.00,
  iva_centesimi INTEGER NOT NULL DEFAULT 0,
  totale_centesimi INTEGER NOT NULL DEFAULT 0,
  ritenuta_acconto_centesimi INTEGER DEFAULT 0,
  contributo_integrativo_centesimi INTEGER DEFAULT 0,
  netto_a_pagare_centesimi INTEGER NOT NULL DEFAULT 0,
  valuta TEXT DEFAULT 'EUR',
  -- SDI (Sistema di Interscambio)
  sdi_id_trasmissione TEXT,
  sdi_stato TEXT,
  sdi_data_invio TIMESTAMPTZ,
  sdi_data_risposta TIMESTAMPTZ,
  xml_fattura_url TEXT,
  pdf_fattura_url TEXT,
  -- Pagamento
  metodo_pagamento TEXT CHECK (metodo_pagamento IN ('bonifico', 'contanti', 'carta', 'paypal', 'ri_ba', 'altro')),
  iban_pagamento TEXT,
  data_pagamento DATE,
  -- Contenuto
  oggetto TEXT,
  note TEXT,
  note_interne TEXT,
  -- Bollo
  bollo_virtuale BOOLEAN DEFAULT FALSE,
  bollo_importo_centesimi INTEGER DEFAULT 0,
  -- Timestamps
  creato_il TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il TIMESTAMPTZ DEFAULT NOW(),
  eliminato_il TIMESTAMPTZ,
  -- Vincolo unicità numero per anno per utente
  UNIQUE(user_id, anno, numero)
);

CREATE INDEX idx_fatture_user ON fatture(user_id);
CREATE INDEX idx_fatture_cliente ON fatture(cliente_id);
CREATE INDEX idx_fatture_stato ON fatture(user_id, stato);
CREATE INDEX idx_fatture_data ON fatture(user_id, data_emissione DESC);

-- ============================================================
-- RIGHE FATTURA
-- ============================================================

CREATE TABLE righe_fattura (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fattura_id UUID NOT NULL REFERENCES fatture(id) ON DELETE CASCADE,
  ordine INTEGER NOT NULL DEFAULT 0,
  descrizione TEXT NOT NULL,
  quantita NUMERIC(10,4) NOT NULL DEFAULT 1,
  prezzo_unitario_centesimi INTEGER NOT NULL,
  sconto_percentuale NUMERIC(5,2) DEFAULT 0,
  iva_percentuale NUMERIC(5,2) NOT NULL DEFAULT 22.00,
  totale_centesimi INTEGER NOT NULL,
  codice_articolo TEXT,
  unita_misura TEXT DEFAULT 'pezzi'
);

CREATE INDEX idx_righe_fattura ON righe_fattura(fattura_id);

-- ============================================================
-- SCADENZE
-- ============================================================

CREATE TABLE scadenze (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('iva', 'inps', 'irpef', 'irap', 'f24', 'pec', 'firma_digitale', 'assicurazione', 'contratto', 'altro')),
  titolo TEXT NOT NULL,
  descrizione TEXT,
  data_scadenza DATE NOT NULL,
  importo_centesimi INTEGER,
  stato TEXT NOT NULL DEFAULT 'attiva' CHECK (stato IN ('attiva', 'completata', 'scaduta', 'annullata')),
  priorita TEXT NOT NULL DEFAULT 'normale' CHECK (priorita IN ('bassa', 'normale', 'alta', 'urgente')),
  promemoria_giorni INTEGER[] DEFAULT '{30, 7, 1}',
  ricorrenza TEXT DEFAULT 'nessuna' CHECK (ricorrenza IN ('nessuna', 'mensile', 'trimestrale', 'annuale')),
  fattura_id UUID REFERENCES fatture(id),
  creato_il TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scadenze_user ON scadenze(user_id);
CREATE INDEX idx_scadenze_data ON scadenze(user_id, data_scadenza);
CREATE INDEX idx_scadenze_stato ON scadenze(user_id, stato) WHERE stato = 'attiva';

-- ============================================================
-- DOCUMENTI
-- ============================================================

CREATE TABLE documenti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('fattura_xml', 'fattura_pdf', 'contratto', 'identita', 'certificato', 'altro')),
  nome TEXT NOT NULL,
  descrizione TEXT,
  mime_type TEXT NOT NULL,
  dimensione_bytes INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  hash_sha256 TEXT NOT NULL,
  categoria TEXT,
  tags TEXT[] DEFAULT '{}',
  creato_il TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il TIMESTAMPTZ DEFAULT NOW(),
  eliminato_il TIMESTAMPTZ
);

CREATE INDEX idx_documenti_user ON documenti(user_id);
CREATE INDEX idx_documenti_tipo ON documenti(user_id, tipo);

-- ============================================================
-- CONSENSI GDPR
-- ============================================================

CREATE TABLE consensi_gdpr (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  accettato BOOLEAN NOT NULL,
  versione TEXT NOT NULL,
  ip TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  metodo TEXT NOT NULL CHECK (metodo IN ('click', 'spid', 'api')),
  data_accettazione TIMESTAMPTZ DEFAULT NOW(),
  data_revoca TIMESTAMPTZ
);

CREATE INDEX idx_consensi_user ON consensi_gdpr(user_id);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utenti(id),
  azione TEXT NOT NULL,
  risorsa TEXT NOT NULL,
  risorsa_id UUID,
  dettagli JSONB,
  ip TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioned by month for performance (audit logs grow fast)
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp DESC);

-- ============================================================
-- NOTIFICHE
-- ============================================================

CREATE TABLE notifiche (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('scadenza', 'fattura', 'pagamento', 'sistema', 'aggiornamento')),
  titolo TEXT NOT NULL,
  messaggio TEXT NOT NULL,
  letta BOOLEAN DEFAULT FALSE,
  azione_url TEXT,
  creato_il TIMESTAMPTZ DEFAULT NOW(),
  letto_il TIMESTAMPTZ
);

CREATE INDEX idx_notifiche_user ON notifiche(user_id);
CREATE INDEX idx_notifiche_nonlette ON notifiche(user_id, letta) WHERE letta = FALSE;

-- ============================================================
-- TRIGGER: aggiornamento automatico aggiornato_il
-- ============================================================

CREATE OR REPLACE FUNCTION aggiorna_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aggiornato_il = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_utenti_aggiornato BEFORE UPDATE ON utenti FOR EACH ROW EXECUTE FUNCTION aggiorna_timestamp();
CREATE TRIGGER tr_indirizzi_aggiornato BEFORE UPDATE ON indirizzi FOR EACH ROW EXECUTE FUNCTION aggiorna_timestamp();
CREATE TRIGGER tr_clienti_aggiornato BEFORE UPDATE ON clienti FOR EACH ROW EXECUTE FUNCTION aggiorna_timestamp();
CREATE TRIGGER tr_fatture_aggiornato BEFORE UPDATE ON fatture FOR EACH ROW EXECUTE FUNCTION aggiorna_timestamp();
CREATE TRIGGER tr_scadenze_aggiornato BEFORE UPDATE ON scadenze FOR EACH ROW EXECUTE FUNCTION aggiorna_timestamp();
CREATE TRIGGER tr_documenti_aggiornato BEFORE UPDATE ON documenti FOR EACH ROW EXECUTE FUNCTION aggiorna_timestamp();

-- ============================================================
-- RLS (Row Level Security) — OGNI utente vede SOLO i propri dati
-- ============================================================

ALTER TABLE utenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE indirizzi ENABLE ROW LEVEL SECURITY;
ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE fatture ENABLE ROW LEVEL SECURITY;
ALTER TABLE righe_fattura ENABLE ROW LEVEL SECURITY;
ALTER TABLE scadenze ENABLE ROW LEVEL SECURITY;
ALTER TABLE documenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE consensi_gdpr ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifiche ENABLE ROW LEVEL SECURITY;

-- Policy: utente vede solo i propri record
CREATE POLICY utenti_propri ON utenti FOR ALL USING (auth_id = auth.uid());
CREATE POLICY indirizzi_propri ON indirizzi FOR ALL USING (user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid()));
CREATE POLICY clienti_propri ON clienti FOR ALL USING (user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid()));
CREATE POLICY fatture_proprie ON fatture FOR ALL USING (user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid()));
CREATE POLICY righe_proprie ON righe_fattura FOR ALL USING (fattura_id IN (SELECT id FROM fatture WHERE user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid())));
CREATE POLICY scadenze_proprie ON scadenze FOR ALL USING (user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid()));
CREATE POLICY documenti_propri ON documenti FOR ALL USING (user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid()));
CREATE POLICY consensi_propri ON consensi_gdpr FOR ALL USING (user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid()));
CREATE POLICY audit_proprio ON audit_log FOR ALL USING (user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid()));
CREATE POLICY notifiche_proprie ON notifiche FOR ALL USING (user_id IN (SELECT id FROM utenti WHERE auth_id = auth.uid()));
