"use client";

/**
 * Root error boundary — cattura anche errori nel layout.tsx.
 * Qui non possiamo usare BrandLogo perché il root layout non è montato.
 * Inline minimale IT, CSS inline (niente Tailwind garantito).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#f8fafc" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "36rem", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "2rem",
                color: "#0f172a",
              }}
            >
              <span style={{ fontWeight: 500 }}>dig</span>
              <span style={{ color: "#009246" }}>I</span>
              <span>T</span>
              <span style={{ color: "#CE2B37" }}>A</span>
              <span style={{ fontWeight: 300, letterSpacing: "0.08em" }}>le</span>
            </div>

            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
              Ci scusiamo, c&apos;è stato un imprevisto grave.
            </h1>

            <p style={{ color: "#64748b", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Il sistema si è riavviato in sicurezza. I tuoi dati sono al sicuro.
              <br />
              Scrivici se il problema continua: supporto@digitale-italia.it
            </p>

            {error.digest && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  padding: "0.375rem 0.75rem",
                  display: "inline-block",
                  marginBottom: "2rem",
                  fontFamily: "monospace",
                }}
              >
                Codice riferimento: {error.digest}
              </p>
            )}

            <div>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.75rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Riprova
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
