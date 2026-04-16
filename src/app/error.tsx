"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

/**
 * Error Boundary globale Next.js (route-level).
 * Cattura errori in tutte le route figlie. Niente stack trace visibile all'utente.
 * L'errore viene loggato a console e (se configurato) a Sentry/Datadog/etc.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log interno: digest è l'ID univoco che Next.js genera per correlare server logs.
    console.error("[digITAle:error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack?.split("\n").slice(0, 3).join(" | "),
    });

    // Hook per observability futura (Sentry.captureException, etc.)
    if (
      typeof window !== "undefined" &&
      (window as unknown as { __digitaleLogError?: (e: Error) => void }).__digitaleLogError
    ) {
      (window as unknown as { __digitaleLogError: (e: Error) => void }).__digitaleLogError(error);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full text-center">
        <div className="flex justify-center mb-8">
          <BrandLogo size="default" variant="dark" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-sm text-red-700 mb-6">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          Qualcosa è andato storto
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4 tracking-tight">
          Ci scusiamo, c&apos;è stato un imprevisto.
        </h1>

        <p className="text-lg text-[#64748b] mb-2 leading-relaxed">
          Il nostro sistema ha segnalato il problema al team. Niente dei tuoi dati è andato perso.
        </p>

        <p className="text-sm text-[#94a3b8] mb-8">
          Puoi riprovare questa pagina o tornare alla home. Se continua, scrivici: supporto@digitale-italia.it
        </p>

        {error.digest && (
          <p className="inline-block text-xs text-[#94a3b8] bg-white border border-[#e2e8f0] rounded-lg px-3 py-1.5 mb-8 font-mono">
            Codice riferimento: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#0f172a] text-white rounded-xl font-medium hover:bg-[#1e293b] transition-colors"
          >
            Riprova
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-[#0f172a] border border-[#e2e8f0] rounded-xl font-medium hover:bg-[#f1f5f9] transition-colors"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </main>
  );
}
