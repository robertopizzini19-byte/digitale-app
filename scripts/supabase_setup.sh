#!/usr/bin/env bash
# digITAle — Supabase one-shot setup
#
# Esegue (in ordine):
#   1. Verifica prerequisiti (supabase CLI, login)
#   2. Link al progetto remoto
#   3. Applica migrations 0001 -> 0004 in ordine
#   4. Verifica RLS + tabelle
#   5. Stampa riepilogo finale
#
# Prerequisiti (Roberto deve fare UNA VOLTA):
#   a) `supabase login`        (browser si apre, ok)
#   b) Creato progetto su supabase.com (region eu-west-1)
#   c) Avere a portata di mano: PROJECT_REF e DB_PASSWORD
#
# Uso:
#   bash scripts/supabase_setup.sh <PROJECT_REF>
#
# Output: /tmp/digitale-supabase-setup.log

set -euo pipefail

PROJECT_REF="${1:-}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="/tmp/digitale-supabase-setup.log"
: > "$LOG"

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG"; }
fail() { log "ERRORE: $*"; exit 1; }

log "=== digITAle Supabase setup ==="

# 1. Prerequisiti
command -v supabase >/dev/null 2>&1 || fail "supabase CLI non trovata. Install: https://supabase.com/docs/guides/cli"
supabase --version | tee -a "$LOG"

if [ -z "$PROJECT_REF" ]; then
  fail "Uso: bash scripts/supabase_setup.sh <PROJECT_REF>  (es. 'abcdefghijklmn')"
fi

# Check login (supabase projects list restituisce errore se non loggato)
if ! supabase projects list >/dev/null 2>&1; then
  fail "Non sei loggato. Esegui: supabase login"
fi
log "Login verificato"

# 2. Link
cd "$ROOT_DIR"
log "Link al progetto $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF" 2>&1 | tee -a "$LOG" || fail "Link fallito"

# 3. Migrations
log "--- Applicazione migrations ---"
for mig in supabase/migrations/000*.sql; do
  log "Applico: $mig"
  # `supabase db push` applica tutte le migrations non ancora applicate
done

# Push all pending migrations in one shot (preferibile rispetto a psql manuale)
supabase db push --include-all 2>&1 | tee -a "$LOG" || fail "db push fallito"

# 4. Verifica
log "--- Verifica integrità ---"
log "Esegui query di verifica in SQL Editor:"
cat <<'SQL' | tee -a "$LOG"
-- Conta tabelle pubbliche (atteso: 10+)
SELECT count(*) FROM pg_tables WHERE schemaname = 'public';

-- Verifica RLS attivo su tutte le tabelle utente
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;
-- Atteso: 0 righe

-- Verifica audit_log immutabile
SELECT has_table_privilege('authenticated', 'audit_log', 'UPDATE') as upd,
       has_table_privilege('authenticated', 'audit_log', 'DELETE') as del;
-- Atteso: false, false
SQL

log ""
log "=== SETUP COMPLETATO ==="
log "Prossimi passi manuali (dashboard Supabase):"
log "  1. Settings > API: copia URL e anon key"
log "  2. Metti in .env.local e in Netlify env vars"
log "  3. Auth > URL Configuration: aggiungi https://digitale-italia.netlify.app"
log "  4. Auth > Email Templates: personalizza in italiano (vedi supabase/README.md §6)"
log ""
log "Log completo: $LOG"
