/**
 * DigiITAle — Formattazione Italiana
 * Date, importi, codice fiscale, P.IVA — tutto locale.
 */

/* ─── Valuta ─── */

/** €1.234,56 */
export function euro(centesimi: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(centesimi / 100);
}

/** 1.234,56 (senza simbolo) */
export function numero(valore: number, decimali = 2): string {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: decimali,
    maximumFractionDigits: decimali,
  }).format(valore);
}

/* ─── Date ─── */

const GIORNI = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
const MESI = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const MESI_BREVI = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

/** "Mercoledì 16 Aprile 2026" */
export function dataEstesa(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return `${GIORNI[d.getDay()]} ${d.getDate()} ${MESI[d.getMonth()]} ${d.getFullYear()}`;
}

/** "16 Apr 2026" */
export function dataBreve(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return `${d.getDate()} ${MESI_BREVI[d.getMonth()]} ${d.getFullYear()}`;
}

/** "16/04/2026" */
export function dataFormale(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** "16:30" */
export function ora(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

/** "3 giorni fa", "tra 2 settimane" */
export function tempoRelativo(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  const ora = new Date();
  const diffMs = d.getTime() - ora.getTime();
  const diffGiorni = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffGiorni === 0) return "oggi";
  if (diffGiorni === 1) return "domani";
  if (diffGiorni === -1) return "ieri";
  if (diffGiorni > 1 && diffGiorni < 7) return `tra ${diffGiorni} giorni`;
  if (diffGiorni < -1 && diffGiorni > -7) return `${Math.abs(diffGiorni)} giorni fa`;
  if (diffGiorni >= 7 && diffGiorni < 30) return `tra ${Math.round(diffGiorni / 7)} settiman${diffGiorni < 14 ? "a" : "e"}`;
  if (diffGiorni <= -7 && diffGiorni > -30) return `${Math.round(Math.abs(diffGiorni) / 7)} settiman${Math.abs(diffGiorni) < 14 ? "a" : "e"} fa`;
  if (diffGiorni >= 30) return `tra ${Math.round(diffGiorni / 30)} mes${diffGiorni < 60 ? "e" : "i"}`;
  return `${Math.round(Math.abs(diffGiorni) / 30)} mes${Math.abs(diffGiorni) < 60 ? "e" : "i"} fa`;
}

/* ─── Fiscale ─── */

/** Formatta P.IVA: 01234567890 */
export function partitaIva(piva: string): string {
  return piva.replace(/\D/g, "").padStart(11, "0");
}

/** Formatta Codice Fiscale: RSSMRA85M01H501Z (uppercase) */
export function codiceFiscale(cf: string): string {
  return cf.replace(/\s/g, "").toUpperCase();
}

/** Formatta IBAN: IT60 X054 2811 1010 0000 0123 456 */
export function iban(raw: string): string {
  const pulito = raw.replace(/\s/g, "").toUpperCase();
  return pulito.replace(/(.{4})/g, "$1 ").trim();
}

/** Formatta numero fattura: 2026/001 */
export function numeroFattura(anno: number, progressivo: number): string {
  return `${anno}/${String(progressivo).padStart(3, "0")}`;
}

/* ─── Telefono ─── */

/** +39 333 123 4567 */
export function telefono(raw: string): string {
  const pulito = raw.replace(/\D/g, "");
  if (pulito.startsWith("39")) {
    const num = pulito.slice(2);
    return `+39 ${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
  }
  return `+39 ${pulito.slice(0, 3)} ${pulito.slice(3, 6)} ${pulito.slice(6)}`;
}
