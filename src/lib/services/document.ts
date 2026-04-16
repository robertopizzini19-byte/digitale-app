/**
 * DigiITAle — Document Service
 * Gestione documenti: upload, download, validazione, hash.
 * Storage: Supabase Storage (quando connesso).
 */

import type { ApiResult } from "../core/types";
import type { DbDocumento } from "../db/schema";

export interface UploadDocumentoParams {
  file: File;
  tipo: DbDocumento["tipo"];
  categoria?: string;
  tags?: string[];
}

export interface DocumentService {
  /** Upload documento con validazione e hash */
  upload(userId: string, params: UploadDocumentoParams): Promise<ApiResult<DbDocumento>>;

  /** Download documento */
  download(documentoId: string): Promise<ApiResult<Blob>>;

  /** Elimina documento (soft delete) */
  elimina(documentoId: string): Promise<ApiResult<void>>;

  /** Lista documenti utente */
  lista(userId: string, filtri?: {
    tipo?: DbDocumento["tipo"];
    categoria?: string;
  }): Promise<ApiResult<DbDocumento[]>>;

  /** Verifica integrità documento (SHA-256) */
  verificaIntegrita(documentoId: string): Promise<ApiResult<boolean>>;
}

/** Validazione file prima dell'upload */
export function validaFile(
  file: File,
  opzioni: { maxSizeMb?: number; formatiAccettati?: string[] } = {}
): { valido: true } | { valido: false; motivo: string } {
  const { maxSizeMb = 10, formatiAccettati = ["pdf", "xml", "png", "jpg", "jpeg", "csv"] } = opzioni;

  const estensione = file.name.split(".").pop()?.toLowerCase();
  if (!estensione || !formatiAccettati.includes(estensione)) {
    return {
      valido: false,
      motivo: `Formato non supportato: .${estensione}. Formati accettati: ${formatiAccettati.join(", ")}`,
    };
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valido: false,
      motivo: `File troppo grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Massimo: ${maxSizeMb} MB`,
    };
  }

  if (file.size === 0) {
    return { valido: false, motivo: "Il file è vuoto" };
  }

  return { valido: true };
}

/** Calcola SHA-256 di un file (browser) */
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
