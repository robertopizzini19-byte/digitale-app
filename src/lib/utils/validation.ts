/**
 * DigiITAle — Validazione Input
 * Validazione dati italiani: CF, P.IVA, IBAN, email, PEC.
 * Solo a confini di sistema (input utente, API esterne).
 */

import { REGEX } from "../core/config";

/* ─── Codice Fiscale ─── */

/** Valida codice fiscale italiano (struttura + check digit) */
export function validaCodiceFiscale(cf: string): boolean {
  if (!REGEX.CODICE_FISCALE.test(cf)) return false;

  const pulito = cf.toUpperCase();
  const pari: Record<string, number> = {
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
    A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9,
    K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19,
    U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25,
  };
  const dispari: Record<string, number> = {
    "0": 1, "1": 0, "2": 5, "3": 7, "4": 9, "5": 13, "6": 15, "7": 17, "8": 19, "9": 21,
    A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21,
    K: 2, L: 4, M: 18, N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14,
    U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23,
  };

  let somma = 0;
  for (let i = 0; i < 15; i++) {
    const char = pulito[i];
    somma += i % 2 === 0 ? dispari[char] : pari[char];
  }

  const atteso = String.fromCharCode(65 + (somma % 26));
  return pulito[15] === atteso;
}

/* ─── Partita IVA ─── */

/** Valida P.IVA italiana (algoritmo di Luhn modificato) */
export function validaPartitaIva(piva: string): boolean {
  if (!REGEX.PARTITA_IVA.test(piva)) return false;

  const cifre = piva.split("").map(Number);
  let somma = 0;

  for (let i = 0; i < 11; i++) {
    if (i % 2 === 0) {
      somma += cifre[i];
    } else {
      const doppio = cifre[i] * 2;
      somma += doppio > 9 ? doppio - 9 : doppio;
    }
  }

  return somma % 10 === 0;
}

/* ─── IBAN ─── */

/** Valida IBAN italiano */
export function validaIban(raw: string): boolean {
  const iban = raw.replace(/\s/g, "").toUpperCase();
  if (!REGEX.IBAN.test(iban)) return false;
  if (iban.length !== 27) return false;

  // Spostamento e conversione per modulo 97
  const riordinato = iban.slice(4) + iban.slice(0, 4);
  const numerico = riordinato
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      return code >= 65 && code <= 90 ? String(code - 55) : c;
    })
    .join("");

  // Modulo 97 su numeri grandi
  let resto = 0;
  for (const cifra of numerico) {
    resto = (resto * 10 + parseInt(cifra)) % 97;
  }

  return resto === 1;
}

/* ─── Email e PEC ─── */

export function validaEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validaPec(pec: string): boolean {
  return REGEX.PEC.test(pec);
}

/* ─── CAP ─── */

export function validaCap(cap: string): boolean {
  return REGEX.CAP.test(cap);
}

/* ─── Telefono ─── */

export function validaTelefono(tel: string): boolean {
  return REGEX.TELEFONO.test(tel);
}

/* ─── Password ─── */

export function validaPassword(password: string): {
  valida: boolean;
  errori: string[];
} {
  const errori: string[] = [];

  if (password.length < 8) errori.push("Almeno 8 caratteri");
  if (password.length > 128) errori.push("Massimo 128 caratteri");
  if (!/[A-Z]/.test(password)) errori.push("Almeno una lettera maiuscola");
  if (!/[a-z]/.test(password)) errori.push("Almeno una lettera minuscola");
  if (!/[0-9]/.test(password)) errori.push("Almeno un numero");

  return { valida: errori.length === 0, errori };
}

/* ─── Validatore Generico ─── */

type ValidationRule<T> = {
  campo: keyof T & string;
  regole: Array<{
    test: (valore: unknown) => boolean;
    messaggio: string;
  }>;
};

export function valida<T extends Record<string, unknown>>(
  dati: T,
  regole: ValidationRule<T>[]
): { valido: true } | { valido: false; errori: Record<string, string> } {
  const errori: Record<string, string> = {};

  for (const { campo, regole: tests } of regole) {
    const valore = dati[campo];
    for (const { test, messaggio } of tests) {
      if (!test(valore)) {
        errori[campo] = messaggio;
        break;
      }
    }
  }

  if (Object.keys(errori).length === 0) {
    return { valido: true };
  }
  return { valido: false, errori };
}
