/**
 * DigiITAle — Modulo Freelance: Calcoli Fiscali
 * Logica di calcolo fatture, IVA, ritenute, bollo.
 * Tutto in centesimi. Niente float per i soldi.
 */

import type { CreaFatturaParams, TotaliFattura, ProfiloFreelance } from "./types";

/**
 * Calcola tutti i totali di una fattura.
 * Gestisce: IVA, ritenuta d'acconto, contributo integrativo, bollo.
 */
export function calcolaTotaliFattura(
  righeInput: CreaFatturaParams["righe"],
  profilo: ProfiloFreelance
): TotaliFattura {
  // Calcola totale per ogni riga
  const righe = righeInput.map((r, i) => {
    const prezzoBase = r.prezzoUnitarioCentesimi * r.quantita;
    const sconto = Math.round(prezzoBase * ((r.scontoPercentuale ?? 0) / 100));
    const imponibileRiga = prezzoBase - sconto;
    const ivaPercentuale = r.ivaPercentuale ?? profilo.aliquotaIvaPredefinita;
    const ivaRiga = Math.round(imponibileRiga * (ivaPercentuale / 100));

    return {
      id: "",
      fattura_id: "",
      ordine: i,
      descrizione: r.descrizione,
      quantita: r.quantita,
      prezzo_unitario_centesimi: r.prezzoUnitarioCentesimi,
      sconto_percentuale: r.scontoPercentuale ?? 0,
      iva_percentuale: ivaPercentuale,
      totale_centesimi: imponibileRiga,
      codice_articolo: null,
      unita_misura: r.unitaMisura ?? null,
      totaleRigaCentesimi: imponibileRiga + ivaRiga,
    };
  });

  // Totali
  const imponibileCentesimi = righe.reduce((sum, r) => sum + r.totale_centesimi, 0);

  // Contributo integrativo (calcolato sull'imponibile, PRIMA dell'IVA)
  const contributoIntegrativoCentesimi = profilo.contributoIntegrativo
    ? Math.round(imponibileCentesimi * (profilo.contributoIntegrativoPercentuale / 100))
    : 0;

  // Base IVA = imponibile + contributo integrativo
  const baseIva = imponibileCentesimi + contributoIntegrativoCentesimi;

  // IVA (calcolata per aliquota — per ora semplificato con aliquota unica)
  const ivaCentesimi = Math.round(baseIva * (profilo.aliquotaIvaPredefinita / 100));

  // Totale lordo
  const totaleCentesimi = baseIva + ivaCentesimi;

  // Ritenuta d'acconto (sull'imponibile, NON sul contributo integrativo)
  const ritenutaAccontoCentesimi = profilo.ritenutaAcconto
    ? Math.round(imponibileCentesimi * (profilo.ritenutaPercentuale / 100))
    : 0;

  // Bollo (€2 se fattura esente IVA e imponibile > €77,47)
  const bolloImportoCentesimi =
    profilo.bolloAutomatico &&
    profilo.aliquotaIvaPredefinita === 0 &&
    imponibileCentesimi > 7747
      ? 200 // €2.00
      : 0;

  // Netto a pagare
  const nettoAPagareCentesimi =
    totaleCentesimi - ritenutaAccontoCentesimi + bolloImportoCentesimi;

  return {
    righe,
    imponibileCentesimi,
    ivaCentesimi,
    totaleCentesimi,
    ritenutaAccontoCentesimi,
    contributoIntegrativoCentesimi,
    nettoAPagareCentesimi,
    bolloImportoCentesimi,
  };
}

/**
 * Calcola il coefficiente di redditività per regime forfettario.
 * Basato sui codici ATECO (semplificato).
 */
export function coefficienteReddititivaAteco(codiceAteco: string): number {
  const mappa: Record<string, number> = {
    // Commercio
    "47": 40,
    // Alloggio e ristorazione
    "55": 40, "56": 40,
    // Costruzioni e immobiliare
    "41": 86, "42": 86, "43": 86, "68": 86,
    // Intermediari commercio
    "46": 62,
    // Servizi professionali, scientifici, tecnici
    "69": 78, "70": 78, "71": 78, "72": 78, "73": 78, "74": 78,
    // Informatica
    "62": 67, "63": 67,
    // Attività artistiche, sportive, intrattenimento
    "90": 67, "91": 67, "93": 67,
    // Trasporto
    "49": 67,
    // Industrie alimentari
    "10": 40, "11": 40,
  };

  const prefisso = codiceAteco.substring(0, 2);
  return mappa[prefisso] ?? 67; // default 67%
}
