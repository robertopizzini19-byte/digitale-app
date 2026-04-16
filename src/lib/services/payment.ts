/**
 * digITAle — Payment Service
 * Motore economico: Stripe + Satispay.
 * Tutti gli importi in CENTESIMI (integer). Mai float per i soldi.
 */

import type { ApiResult } from "../core/types";

/* ─── Types ─── */

export interface PaymentService {
  /** Crea sessione checkout Stripe */
  creaCheckout(params: CheckoutParams): Promise<ApiResult<{ url: string }>>;

  /** Crea abbonamento */
  creaAbbonamento(params: AbbonamentoParams): Promise<ApiResult<Abbonamento>>;

  /** Cancella abbonamento */
  cancellaAbbonamento(abbonamentoId: string): Promise<ApiResult<void>>;

  /** Aggiorna piano */
  aggiornaPiano(abbonamentoId: string, nuovoPiano: string): Promise<ApiResult<Abbonamento>>;

  /** Storico pagamenti */
  storicoPagamenti(userId: string): Promise<ApiResult<Pagamento[]>>;

  /** Webhook handler (Stripe events) */
  gestisciWebhook(payload: string, signature: string): Promise<void>;
}

export interface CheckoutParams {
  userId: string;
  pianoId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export interface AbbonamentoParams {
  userId: string;
  pianoId: string;
  stripeCustomerId: string;
  metodoPagamento: string;
}

export interface Abbonamento {
  id: string;
  userId: string;
  pianoId: string;
  stato: "attivo" | "in_prova" | "scaduto" | "cancellato" | "sospeso";
  inizioIl: string;
  prossimoRinnovo: string;
  cancellatoIl?: string;
  importoCentesimi: number;
  valuta: "EUR";
}

export interface Pagamento {
  id: string;
  userId: string;
  importoCentesimi: number;
  valuta: "EUR";
  stato: "completato" | "fallito" | "rimborsato" | "in_attesa";
  metodo: "carta" | "satispay" | "bonifico";
  descrizione: string;
  dataCreazione: string;
  ricevutaUrl?: string;
}

/* ─── Utilità Importi ─── */

/** Converte centesimi in stringa formattata (€1.234,56) */
export function formattaEuro(centesimi: number): string {
  const euro = centesimi / 100;
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(euro);
}

/** Converte euro in centesimi */
export function euroCentesimi(euro: number): number {
  return Math.round(euro * 100);
}

/** Calcola IVA */
export function calcolaIva(
  imponibileCentesimi: number,
  aliquota: number
): { iva: number; totale: number } {
  const iva = Math.round(imponibileCentesimi * (aliquota / 100));
  return {
    iva,
    totale: imponibileCentesimi + iva,
  };
}

/** Calcola ritenuta d'acconto (20% sull'imponibile per professionisti) */
export function calcolaRitenuta(imponibileCentesimi: number, percentuale = 20): number {
  return Math.round(imponibileCentesimi * (percentuale / 100));
}

/** Calcola netto a pagare = totale - ritenuta + contributo integrativo */
export function calcolaNettoAPagare(params: {
  imponibileCentesimi: number;
  ivaCentesimi: number;
  ritenutaCentesimi: number;
  contributoIntegrativoCentesimi: number;
}): number {
  return (
    params.imponibileCentesimi +
    params.ivaCentesimi +
    params.contributoIntegrativoCentesimi -
    params.ritenutaCentesimi
  );
}
