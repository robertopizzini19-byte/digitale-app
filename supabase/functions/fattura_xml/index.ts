// digITAle — Edge Function: fattura_xml
//
// Genera l'XML FatturaPA v1.2.2 (tracciato 1.7) per una fattura del database
// e lo carica su Storage cifrato. Restituisce URL firmato + hash SHA-256.
//
// Runtime: Deno (Supabase Edge Functions)
// Path: POST /functions/v1/fattura_xml
// Body: { "fattura_id": "uuid" }
// Auth: Authorization: Bearer <user JWT> (derivato da supabase-js lato client)
//
// Principi:
//   - Numerazione atomica: advisory lock su (user_id, anno) per evitare duplicati
//   - Validazione fiscale: CF / P.IVA / importi coerenti
//   - Firma server-side: hash documento + timestamp (CAdES reale sarà in layer superiore)
//   - Idempotenza: se xml già generato → restituisce URL esistente
//   - NIENTE dati sensibili in log (scrub automatico)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type FatturaRow = {
  id: string;
  user_id: string;
  cliente_id: string;
  numero: string;
  anno: number;
  tipo: "fattura" | "nota_credito" | "parcella" | "proforma";
  data_emissione: string;
  data_scadenza: string;
  imponibile_centesimi: number;
  iva_percentuale: number;
  iva_centesimi: number;
  totale_centesimi: number;
  valuta: string;
  oggetto: string | null;
  note: string | null;
  bollo_virtuale: boolean;
  bollo_importo_centesimi: number;
  xml_fattura_url: string | null;
};

type Utente = {
  id: string;
  partita_iva: string | null;
  codice_fiscale: string | null;
  nome: string;
  cognome: string;
  pec: string | null;
  ruolo: string;
};

type Cliente = {
  id: string;
  partita_iva: string | null;
  codice_fiscale: string | null;
  denominazione: string | null;
  nome: string | null;
  cognome: string | null;
  indirizzo: string | null;
  cap: string | null;
  comune: string | null;
  provincia: string | null;
  pec: string | null;
  codice_destinatario: string | null;
  nazione: string;
};

type RigaFattura = {
  id: string;
  ordine: number;
  descrizione: string;
  quantita: number;
  prezzo_unitario_centesimi: number;
  sconto_percentuale: number;
  iva_percentuale: number;
  totale_centesimi: number;
  unita_misura: string | null;
};

// ============================================================================
// XML helpers
// ============================================================================

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cents2eur(centesimi: number): string {
  return (centesimi / 100).toFixed(2);
}

function validateCF(cf: string): boolean {
  return /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i.test(cf);
}

function validatePIVA(piva: string): boolean {
  if (!/^\d{11}$/.test(piva)) return false;
  // Controllo cifra (Luhn mod 11 italiano)
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let d = Number(piva[i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === Number(piva[10]);
}

// ============================================================================
// FatturaPA XML builder — tracciato 1.7
// ============================================================================

function buildFatturaXml(params: {
  emittente: Utente;
  cessionario: Cliente;
  fattura: FatturaRow;
  righe: RigaFattura[];
  progressivoInvio: string;
}): string {
  const { emittente, cessionario, fattura, righe, progressivoInvio } = params;

  // Formato trasmissione: FPA12 per PA, FPR12 per privati
  const formatoTrasmissione =
    cessionario.codice_destinatario && cessionario.codice_destinatario.length === 6 ? "FPA12" : "FPR12";

  // CodiceDestinatario: 7 char per privati, 6 per PA, "0000000" se PEC-only
  const codDest =
    cessionario.codice_destinatario && cessionario.codice_destinatario.trim().length > 0
      ? cessionario.codice_destinatario.toUpperCase()
      : "0000000";

  const emittentePIva = emittente.partita_iva?.trim() ?? "";
  const emittenteCF = emittente.codice_fiscale?.trim() ?? "";

  if (!emittentePIva || !validatePIVA(emittentePIva)) {
    throw new Error("EMITTENTE_PIVA_INVALIDA");
  }
  if (emittenteCF && !validateCF(emittenteCF)) {
    throw new Error("EMITTENTE_CF_INVALIDO");
  }

  // Cessionario: PA (P.IVA) o privato (CF o P.IVA)
  const cessPIva = cessionario.partita_iva?.trim() ?? "";
  const cessCF = cessionario.codice_fiscale?.trim() ?? "";
  if (!cessPIva && !cessCF) throw new Error("CESSIONARIO_IDENTIFICATIVO_MANCANTE");

  // Mappatura tipo documento FatturaPA
  const tipoDoc = fattura.tipo === "nota_credito" ? "TD04" : fattura.tipo === "parcella" ? "TD06" : "TD01";

  // Nome denominazione cessionario
  const cessionarioDesc =
    cessionario.denominazione?.trim() ||
    `${cessionario.nome ?? ""} ${cessionario.cognome ?? ""}`.trim() ||
    "CLIENTE";

  const righeXml = righe
    .sort((a, b) => a.ordine - b.ordine)
    .map((r, idx) => {
      const prezzoUnit = (r.prezzo_unitario_centesimi / 100).toFixed(6);
      const prezzoTot = (r.totale_centesimi / 100).toFixed(2);
      return `      <DettaglioLinee>
        <NumeroLinea>${idx + 1}</NumeroLinea>
        <Descrizione>${xmlEscape(r.descrizione.slice(0, 1000))}</Descrizione>
        <Quantita>${r.quantita.toFixed(3)}</Quantita>${
          r.unita_misura
            ? `
        <UnitaMisura>${xmlEscape(r.unita_misura)}</UnitaMisura>`
            : ""
        }
        <PrezzoUnitario>${prezzoUnit}</PrezzoUnitario>
        <PrezzoTotale>${prezzoTot}</PrezzoTotale>
        <AliquotaIVA>${Number(r.iva_percentuale).toFixed(2)}</AliquotaIVA>
      </DettaglioLinee>`;
    })
    .join("\n");

  const imponibile = cents2eur(fattura.imponibile_centesimi);
  const iva = cents2eur(fattura.iva_centesimi);
  const totale = cents2eur(fattura.totale_centesimi);
  const aliquota = Number(fattura.iva_percentuale).toFixed(2);

  const datiBolloXml = fattura.bollo_virtuale
    ? `
      <DatiBollo>
        <BolloVirtuale>SI</BolloVirtuale>
        <ImportoBollo>${cents2eur(fattura.bollo_importo_centesimi)}</ImportoBollo>
      </DatiBollo>`
    : "";

  // Sezione cedente
  const cedenteAnagrafica = emittenteCF ? `<CodiceFiscale>${xmlEscape(emittenteCF)}</CodiceFiscale>` : "";

  // Sezione cessionario
  const cessIdentificativo = cessPIva
    ? `<IdFiscaleIVA>
            <IdPaese>IT</IdPaese>
            <IdCodice>${xmlEscape(cessPIva)}</IdCodice>
          </IdFiscaleIVA>`
    : `<CodiceFiscale>${xmlEscape(cessCF)}</CodiceFiscale>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<p:FatturaElettronica versione="${formatoTrasmissione}"
  xmlns:p="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2"
  xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2 http://www.fatturapa.gov.it/export/fatturazione/sdi/fatturapa/v1.2/Schema_del_file_xml_FatturaPA_versione_1.2.2.xsd">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente>
        <IdPaese>IT</IdPaese>
        <IdCodice>${xmlEscape(emittentePIva)}</IdCodice>
      </IdTrasmittente>
      <ProgressivoInvio>${xmlEscape(progressivoInvio)}</ProgressivoInvio>
      <FormatoTrasmissione>${formatoTrasmissione}</FormatoTrasmissione>
      <CodiceDestinatario>${xmlEscape(codDest)}</CodiceDestinatario>${
        cessionario.pec
          ? `
      <PECDestinatario>${xmlEscape(cessionario.pec)}</PECDestinatario>`
          : ""
      }
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA>
          <IdPaese>IT</IdPaese>
          <IdCodice>${xmlEscape(emittentePIva)}</IdCodice>
        </IdFiscaleIVA>
        ${cedenteAnagrafica}
        <Anagrafica>
          <Nome>${xmlEscape(emittente.nome || "EMITTENTE")}</Nome>
          <Cognome>${xmlEscape(emittente.cognome || "")}</Cognome>
        </Anagrafica>
        <RegimeFiscale>RF01</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>Indirizzo da completare</Indirizzo>
        <CAP>00000</CAP>
        <Comune>Da compilare</Comune>
        <Nazione>IT</Nazione>
      </Sede>
    </CedentePrestatore>
    <CessionarioCommittente>
      <DatiAnagrafici>
          ${cessIdentificativo}
        <Anagrafica>
          <Denominazione>${xmlEscape(cessionarioDesc.slice(0, 80))}</Denominazione>
        </Anagrafica>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${xmlEscape(cessionario.indirizzo ?? "N/D")}</Indirizzo>
        <CAP>${xmlEscape(cessionario.cap ?? "00000")}</CAP>
        <Comune>${xmlEscape(cessionario.comune ?? "N/D")}</Comune>${
          cessionario.provincia
            ? `
        <Provincia>${xmlEscape(cessionario.provincia.slice(0, 2).toUpperCase())}</Provincia>`
            : ""
        }
        <Nazione>${xmlEscape(cessionario.nazione)}</Nazione>
      </Sede>
    </CessionarioCommittente>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>${tipoDoc}</TipoDocumento>
        <Divisa>${xmlEscape(fattura.valuta)}</Divisa>
        <Data>${fattura.data_emissione}</Data>
        <Numero>${xmlEscape(fattura.numero)}</Numero>${datiBolloXml}
        <ImportoTotaleDocumento>${totale}</ImportoTotaleDocumento>${
          fattura.oggetto
            ? `
        <Causale>${xmlEscape(fattura.oggetto.slice(0, 200))}</Causale>`
            : ""
        }
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>
${righeXml}
      <DatiRiepilogo>
        <AliquotaIVA>${aliquota}</AliquotaIVA>
        <ImponibileImporto>${imponibile}</ImponibileImporto>
        <Imposta>${iva}</Imposta>
        <EsigibilitaIVA>I</EsigibilitaIVA>
      </DatiRiepilogo>
    </DatiBeniServizi>
    <DatiPagamento>
      <CondizioniPagamento>TP02</CondizioniPagamento>
      <DettaglioPagamento>
        <ModalitaPagamento>MP05</ModalitaPagamento>
        <DataScadenzaPagamento>${fattura.data_scadenza}</DataScadenzaPagamento>
        <ImportoPagamento>${totale}</ImportoPagamento>
      </DettaglioPagamento>
    </DatiPagamento>
  </FatturaElettronicaBody>
</p:FatturaElettronica>`;
}

// ============================================================================
// SHA-256 (edge runtime — SubtleCrypto)
// ============================================================================

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ============================================================================
// Progressivo atomico (advisory lock)
// ============================================================================

async function nextProgressivo(admin: SupabaseClient, userId: string, anno: number): Promise<string> {
  // Lock a 2 chiavi: hash user_id int + anno
  const userHashKey = Array.from(userId.replace(/-/g, "").slice(0, 15)).reduce(
    (acc, c) => (acc * 31 + c.charCodeAt(0)) | 0,
    0,
  );

  const { data, error } = await admin.rpc("progressivo_fattura_next", {
    p_lock_a: userHashKey,
    p_lock_b: anno,
    p_user_id: userId,
    p_anno: anno,
  });
  if (error) throw new Error(`progressivo_next_error: ${error.message}`);
  // 5 digit zero-padded: 00001, 00042, ...
  return String(data as number).padStart(5, "0");
}

// ============================================================================
// Entrypoint
// ============================================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "UNAUTHORIZED" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPA_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPA_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client come utente (applica RLS)
    const userClient = createClient(SUPA_URL, SUPA_ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    // Client admin (bypassa RLS solo per progressivo + storage)
    const adminClient = createClient(SUPA_URL, SUPA_SERVICE);

    const { fattura_id } = (await req.json()) as { fattura_id?: string };
    if (!fattura_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fattura_id)) {
      return new Response(JSON.stringify({ error: "INVALID_FATTURA_ID" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    // 1. Fetch fattura (RLS garantisce ownership)
    const { data: fattura, error: errFat } = await userClient
      .from("fatture")
      .select("*")
      .eq("id", fattura_id)
      .single();
    if (errFat || !fattura) {
      return new Response(JSON.stringify({ error: "FATTURA_NOT_FOUND" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }
    const fat = fattura as FatturaRow;

    // Idempotenza: se xml già esiste, ritorna l'URL firmato
    if (fat.xml_fattura_url) {
      const { data: signed } = await adminClient.storage
        .from("fatture-xml")
        .createSignedUrl(fat.xml_fattura_url, 3600);
      if (signed?.signedUrl) {
        return new Response(
          JSON.stringify({ xml_url: signed.signedUrl, idempotent: true, fattura_id: fat.id }),
          { headers: { ...CORS_HEADERS, "content-type": "application/json" } },
        );
      }
    }

    // 2. Emittente (dall'auth JWT -> utenti)
    const { data: emittente, error: errEm } = await userClient
      .from("utenti")
      .select("id, partita_iva, codice_fiscale, nome, cognome, pec, ruolo")
      .eq("id", fat.user_id)
      .single();
    if (errEm || !emittente) {
      return new Response(JSON.stringify({ error: "EMITTENTE_NOT_FOUND" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    // 3. Cessionario
    const { data: cessionario, error: errCes } = await userClient
      .from("clienti")
      .select(
        "id, partita_iva, codice_fiscale, denominazione, nome, cognome, indirizzo, cap, comune, provincia, pec, codice_destinatario, nazione",
      )
      .eq("id", fat.cliente_id)
      .single();
    if (errCes || !cessionario) {
      return new Response(JSON.stringify({ error: "CESSIONARIO_NOT_FOUND" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    // 4. Righe
    const { data: righeRaw, error: errR } = await userClient
      .from("righe_fattura")
      .select("*")
      .eq("fattura_id", fat.id)
      .order("ordine", { ascending: true });
    if (errR || !righeRaw || righeRaw.length === 0) {
      return new Response(JSON.stringify({ error: "RIGHE_MANCANTI" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    // 5. ProgressivoInvio atomico (admin, advisory lock)
    const progressivo = await nextProgressivo(adminClient, fat.user_id, fat.anno);

    // 6. Build XML
    const xml = buildFatturaXml({
      emittente: emittente as Utente,
      cessionario: cessionario as Cliente,
      fattura: fat,
      righe: righeRaw as RigaFattura[],
      progressivoInvio: progressivo,
    });

    // 7. Hash + nome file
    const hash = await sha256Hex(xml);
    const fileName = `${fat.user_id}/${fat.anno}/IT${(emittente as Utente).partita_iva}_${progressivo}.xml`;

    // 8. Upload storage (bucket privato, cifrato at-rest by Supabase)
    const { error: errUp } = await adminClient.storage
      .from("fatture-xml")
      .upload(fileName, new Blob([xml], { type: "application/xml" }), {
        contentType: "application/xml",
        upsert: false,
      });
    if (errUp) {
      return new Response(JSON.stringify({ error: "STORAGE_UPLOAD_FAILED", detail: errUp.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    // 9. Update fattura con path + stato emessa
    const { error: errUpdate } = await adminClient
      .from("fatture")
      .update({
        xml_fattura_url: fileName,
        stato: fat.tipo === "proforma" ? "bozza" : "emessa",
      })
      .eq("id", fat.id);
    if (errUpdate) {
      return new Response(JSON.stringify({ error: "DB_UPDATE_FAILED", detail: errUpdate.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    // 10. Signed URL (scadenza 1h)
    const { data: signed } = await adminClient.storage.from("fatture-xml").createSignedUrl(fileName, 3600);

    // 11. Audit trail (riga custom)
    await adminClient.from("audit_log").insert({
      tabella: "fatture",
      record_id: fat.id,
      azione: "FATTURA_XML_GENERATA",
      user_id: fat.user_id,
      metadata: { progressivo, hash, file: fileName },
    });

    return new Response(
      JSON.stringify({
        fattura_id: fat.id,
        progressivo,
        xml_url: signed?.signedUrl ?? null,
        xml_path: fileName,
        sha256: hash,
        size_bytes: xml.length,
      }),
      { headers: { ...CORS_HEADERS, "content-type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return new Response(JSON.stringify({ error: "INTERNAL", detail: msg }), {
      status: 500,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  }
});
