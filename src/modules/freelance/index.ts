/**
 * DigiITAle — Modulo Freelance: Entry Point
 * Re-export di tutto ciò che il modulo espone al core.
 */

export { freelanceModule } from "./config";
export type {
  ProfiloFreelance,
  DashboardFreelance,
  CreaFatturaParams,
  TotaliFattura,
  FiltroFatture,
  FiltroClienti,
  ScadenzeFiscaliAutomatiche,
} from "./types";
export { generaScadenzeFiscali } from "./types";
export { calcolaTotaliFattura } from "./calcoli";
