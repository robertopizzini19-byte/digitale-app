#!/usr/bin/env bash
# digITAle — GitHub branch protection one-shot
#
# Applica branch protection rules su `main` (e opzionalmente `staging`).
# Richiede: gh CLI + login (`gh auth login`) con scope `repo` + `admin:repo_hook`.
#
# Uso:
#   bash scripts/setup_branch_protection.sh [owner/repo]
#
# Se il repo è indovinabile da `gh repo view`, l'arg è opzionale.

set -euo pipefail

REPO="${1:-}"
LOG="/tmp/digitale-branch-protection.log"
: > "$LOG"

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG"; }
fail() { log "ERRORE: $*"; exit 1; }

log "=== digITAle branch protection ==="

command -v gh >/dev/null 2>&1 || fail "gh CLI non trovata. Install: https://cli.github.com/"
gh auth status >/dev/null 2>&1 || fail "Non sei loggato. Esegui: gh auth login"
log "Login verificato"

if [ -z "$REPO" ]; then
  REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
  [ -z "$REPO" ] && fail "Repo non identificabile. Usa: bash scripts/setup_branch_protection.sh owner/repo"
fi
log "Repo: $REPO"

apply_protection() {
  local branch="$1"
  log "Applico protezione su branch: $branch"

  # Check che il branch esista
  if ! gh api "repos/$REPO/branches/$branch" >/dev/null 2>&1; then
    log "  SKIP: branch $branch non esiste"
    return 0
  fi

  # PUT branch protection
  # - required PR review (1 approval)
  # - dismiss stale reviews on new push
  # - require status checks: ci (build+typecheck+lint+gitleaks)
  # - enforce_admins: true (anche admin rispettano le regole)
  # - allow_force_pushes: false
  # - allow_deletions: false
  # - required_conversation_resolution: true
  gh api -X PUT "repos/$REPO/branches/$branch/protection" \
    -H "Accept: application/vnd.github+json" \
    --input - <<'JSON' 2>&1 | tee -a "$LOG"
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": false,
  "block_creations": false
}
JSON

  log "  OK: $branch protetto"
}

apply_protection "main"
apply_protection "staging"

log ""
log "=== Branch protection applicata ==="
log "Verifica su: https://github.com/$REPO/settings/branches"
log "Log completo: $LOG"
