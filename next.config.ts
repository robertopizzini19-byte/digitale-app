import type { NextConfig } from "next";

// Build guard: in produzione, fallisci il build se Supabase non è configurato.
// Evita deploy accidentali in "demo mode" con dati mock visibili pubblicamente.
// Override esplicito: DIGITALE_ALLOW_DEMO_PROD=1 (usare solo per preview intenzionale).
if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.DIGITALE_ALLOW_DEMO_PROD !== "1" &&
  !process.env.NETLIFY
) {
  throw new Error(
    "[next.config] Build produzione senza NEXT_PUBLIC_SUPABASE_URL. " +
      "Setta le env vars Supabase o usa DIGITALE_ALLOW_DEMO_PROD=1 per override esplicito.",
  );
}

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn(
    "\n⚠️  [digITAle] Build in demo mode — Supabase non configurato.\n" +
      "   Il sito sarà live ma con dati fittizi.\n" +
      "   Per attivare il backend: configura NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.\n",
  );
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "export",
};

export default nextConfig;
