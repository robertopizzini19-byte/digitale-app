#!/usr/bin/env node
// Custom secret scanner: pattern italiani + generici.
// Usage: node scripts/secret-scan.mjs [--staged]
// Exit 1 se trova qualcosa.

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PATTERNS = [
  { name: 'Supabase service role key',        re: /eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{30,}/ },
  { name: 'Stripe secret key',                re: /sk_(live|test)_[A-Za-z0-9]{20,}/ },
  { name: 'Stripe restricted key',            re: /rk_(live|test)_[A-Za-z0-9]{20,}/ },
  { name: 'AWS access key',                   re: /AKIA[0-9A-Z]{16}/ },
  { name: 'AWS secret key',                   re: /aws(.{0,20})?['\"][0-9a-zA-Z\/+]{40}['\"]/ },
  { name: 'Google API key',                   re: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'GitHub PAT',                       re: /ghp_[A-Za-z0-9]{36}/ },
  { name: 'GitHub fine-grained PAT',          re: /github_pat_[A-Za-z0-9_]{82}/ },
  { name: 'Private key (PEM)',                re: /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: 'Codice fiscale in codice',         re: /\b[A-Z]{6}\d{2}[A-EHLMPR-T]\d{2}[A-Z]\d{3}[A-Z]\b/ },
  { name: 'IBAN italiano hardcoded',          re: /\bIT\d{2}[A-Z]\d{10}[A-Z0-9]{12}\b/ },
];

const ALLOWED_FILES = [
  /\.example$/,
  /\.md$/,
  /NOTE_CREDENZIALI/,
  /secret-scan\.mjs$/,
  // File che contengono CF/IBAN di esempio per test/formatting (non dati reali utenti)
  /src\/lib\/utils\/formatting\.ts$/,
  /src\/lib\/utils\/validation\.ts$/,
  /tests\/.*\.(sql|ts|tsx|js|mjs)$/,
  // Pagine dashboard con DEMO_DATA: CF fittizi come "BNCMRC80A01H501Z"
  /src\/app\/dashboard\/.*\.tsx$/,
];

const IGNORED_DIRS = ['node_modules', '.next', 'out', '.git', 'dist', 'build'];

function getStagedFiles() {
  try {
    return execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getAllTrackedFiles() {
  try {
    return execSync('git ls-files', { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

const onlyStaged = process.argv.includes('--staged');
const files = onlyStaged ? getStagedFiles() : getAllTrackedFiles();

let findings = 0;
for (const f of files) {
  if (IGNORED_DIRS.some((d) => f.startsWith(d + '/') || f.includes('/' + d + '/'))) continue;
  if (ALLOWED_FILES.some((re) => re.test(f))) continue;
  if (!existsSync(f)) continue;

  let content;
  try {
    content = readFileSync(f, 'utf8');
  } catch {
    continue;
  }

  for (const { name, re } of PATTERNS) {
    const match = content.match(re);
    if (match) {
      console.error(`❌ [${name}] in ${f}`);
      console.error(`   match: ${match[0].slice(0, 40)}...`);
      findings++;
    }
  }
}

if (findings > 0) {
  console.error(`\n⛔ ${findings} potenziali secret trovati. Commit bloccato.`);
  console.error('   Se sono falsi positivi, aggiungi il file a ALLOWED_FILES in scripts/secret-scan.mjs.');
  process.exit(1);
}

if (!onlyStaged) {
  console.log(`✅ Nessun secret trovato su ${files.length} file tracciati.`);
}
