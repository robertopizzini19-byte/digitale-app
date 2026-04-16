"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth/provider";
import { supabaseConfigured } from "@/lib/supabase/client";

export default function AccediPage() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ricordami, setRicordami] = useState(true);

  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [resetInviato, setResetInviato] = useState(false);

  // Se già autenticato, vai subito a dashboard
  useEffect(() => {
    if (auth.stato === "autenticato") router.replace("/dashboard");
  }, [auth.stato, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (invio) return;
    setErrore(null);

    // Demo mode: nessun Supabase configurato → bypass amichevole
    if (!supabaseConfigured) {
      router.push("/dashboard");
      return;
    }

    setInvio(true);
    const r = await auth.accedi(email.trim(), password);
    setInvio(false);

    if (!r.ok) {
      setErrore(r.messaggio);
      return;
    }
    router.push("/dashboard");
  }

  async function onResetPassword() {
    setErrore(null);
    if (!email.trim()) {
      setErrore("Scrivi prima la tua email qui sopra, poi clicca di nuovo.");
      return;
    }
    if (!supabaseConfigured) {
      setErrore("Il recupero password sarà attivo al lancio.");
      return;
    }
    setInvio(true);
    const r = await auth.richiediReset(email.trim());
    setInvio(false);
    if (!r.ok) { setErrore(r.messaggio); return; }
    setResetInviato(true);
  }

  const caricamentoIniziale = auth.stato === "caricamento";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto py-8">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#009246]/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#CE2B37]/[0.03] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/">
              <BrandLogo size="lg" />
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Bentornato</h1>
            <p className="text-sm text-[#64748b]">Accedi per continuare su DigiITAle</p>
          </div>

          {/* Demo banner */}
          {!supabaseConfigured && !caricamentoIniziale && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Modalità anteprima.</span> Il servizio è ancora in forge — qualsiasi credenziale ti porta alla demo della dashboard.
              </p>
            </div>
          )}

          {/* Reset inviato */}
          {resetInviato && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800 leading-relaxed">
                <span className="font-semibold">Email inviata.</span> Controlla la tua casella per reimpostare la password.
              </p>
            </div>
          )}

          {/* Errore */}
          {errore && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-snug">{errore}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0f172a] mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@esempio.it"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#0f172a]">Password</label>
                <button
                  type="button"
                  onClick={onResetPassword}
                  className="text-xs font-medium text-[#009246] hover:text-[#007a3a] transition-colors"
                >
                  Password dimenticata?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="La tua password"
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} className="text-[#94a3b8]" /> : <Eye size={16} className="text-[#94a3b8]" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={ricordami}
                onChange={(e) => setRicordami(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#009246] focus:ring-[#009246]/30"
              />
              <label htmlFor="remember" className="text-sm text-[#64748b]">Ricordami su questo dispositivo</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={invio || caricamentoIniziale}
              className="w-full flex items-center justify-center gap-2 bg-[#009246] hover:bg-[#007a3a] disabled:bg-[#009246]/60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-[15px] font-semibold transition-all shadow-lg shadow-[#009246]/20 hover:shadow-xl hover:shadow-[#009246]/30 active:scale-[0.98]"
            >
              {invio ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Accedo...
                </>
              ) : (
                <>
                  Accedi
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[#94a3b8]">oppure</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* SPID (non ancora attivo — onesto) */}
          <button
            type="button"
            disabled
            title="Integrazione SPID prevista al lancio pubblico"
            className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            <span className="w-5 h-5 rounded bg-[#004080]/60 flex items-center justify-center text-white text-[9px] font-bold">SP</span>
            Accedi con SPID
            <span className="ml-1 text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">presto</span>
          </button>

          {/* Register */}
          <p className="text-center text-sm text-[#64748b] mt-6">
            Non hai un account?{" "}
            <Link href="/registrati" className="font-semibold text-[#009246] hover:text-[#007a3a] transition-colors">
              Registrati gratis
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#94a3b8] mt-6">
          &copy; 2026 DigiITAle &mdash; Fatto in Italia, per l&apos;Italia
        </p>
      </div>
    </div>
  );
}
