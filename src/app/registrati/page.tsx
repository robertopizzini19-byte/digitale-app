"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User as UserIcon,
  Briefcase,
  Building2,
  Landmark,
  GraduationCap,
  Globe,
  Heart,
  Shield,
} from "lucide-react";
import { useMemo, useState, Suspense } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth/provider";
import { supabaseConfigured } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/core/types";
import { PASSWORD_REQUIREMENTS } from "@/lib/auth/types";

const RUOLI: Array<{
  id: UserRole;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  desc: string;
}> = [
  { id: "freelance", label: "Freelance / P.IVA", icon: Briefcase, desc: "Liberi professionisti, autonomi" },
  { id: "pmi", label: "PMI / Impresa", icon: Building2, desc: "Piccole e medie imprese" },
  { id: "cittadino", label: "Cittadino", icon: Heart, desc: "Cittadino italiano privato" },
  { id: "pa", label: "Pubblica Amm.", icon: Landmark, desc: "Enti e amministrazioni" },
  { id: "studente", label: "Studente", icon: GraduationCap, desc: "Scuole superiori o università" },
  { id: "estero", label: "Italiano all'Estero", icon: Globe, desc: "Residente fuori dall'Italia" },
];

/* ─── Password strength ─── */

function calcolaForza(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= PASSWORD_REQUIREMENTS.minLength) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;

  if (score <= 1) return { score, label: "Troppo debole", color: "bg-red-500" };
  if (score === 2) return { score, label: "Debole", color: "bg-orange-500" };
  if (score === 3) return { score, label: "Media", color: "bg-amber-500" };
  if (score === 4) return { score, label: "Forte", color: "bg-emerald-500" };
  return { score, label: "Ottima", color: "bg-emerald-600" };
}

function passwordValida(pw: string): boolean {
  return (
    pw.length >= PASSWORD_REQUIREMENTS.minLength && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw)
  );
}

function RegistratiInner() {
  const router = useRouter();
  const auth = useAuth();
  const searchParams = useSearchParams();
  const pianoIniziale = searchParams.get("piano") ?? "";

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ruolo, setRuolo] = useState<UserRole>("freelance");

  const [consensoPrivacy, setConsensoPrivacy] = useState(false);
  const [consensoTermini, setConsensoTermini] = useState(false);
  const [consensoMarketing, setConsensoMarketing] = useState(false);
  const [consensoProfilazione, setConsensoProfilazione] = useState(false);

  const [codiceReferral] = useState<string | undefined>(() => {
    try {
      if (typeof window === "undefined") return undefined;
      const saved = localStorage.getItem("digitale_referral");
      if (saved) {
        localStorage.removeItem("digitale_referral");
        return saved;
      }
    } catch {
      // localStorage non disponibile
    }
    return undefined;
  });
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [successo, setSuccesso] = useState<"verifica" | "auto" | null>(null);

  const forza = useMemo(() => calcolaForza(password), [password]);
  const pwValida = passwordValida(password);

  const formValido =
    nome.trim().length >= 2 &&
    cognome.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    pwValida &&
    consensoPrivacy &&
    consensoTermini;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (invio) return;
    setErrore(null);

    if (!consensoPrivacy || !consensoTermini) {
      setErrore("Devi accettare Privacy Policy e Termini di Servizio per procedere.");
      return;
    }
    if (!pwValida) {
      setErrore("La password deve avere almeno 8 caratteri, una maiuscola, una minuscola e un numero.");
      return;
    }

    if (!supabaseConfigured) {
      // Demo mode: raccoglie email waitlist via Netlify Forms, poi va a /grazie
      try {
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            "form-name": "waitlist",
            email: email.trim(),
            piano: pianoIniziale || ruolo,
            ruolo,
          }).toString(),
        });
      } catch {
        // Non blocare l'esperienza se Netlify Forms fallisce
      }
      router.push("/grazie");
      return;
    }

    setInvio(true);
    const r = await auth.registra({
      email: email.trim(),
      password,
      nome: nome.trim(),
      cognome: cognome.trim(),
      ruolo,
      codiceReferral,
      consensi: {
        privacy: true,
        termini: true,
        marketing: consensoMarketing,
        profilazione: consensoProfilazione,
      },
    });
    setInvio(false);

    if (!r.ok) {
      setErrore(r.messaggio);
      return;
    }

    if (r.richiedeVerifica) {
      setSuccesso("verifica");
    } else {
      setSuccesso("auto");
      setTimeout(() => router.push("/dashboard"), 1200);
    }
  }

  /* ─── Stato successo ─── */
  if (successo) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto py-8">
        <div className="relative w-full max-w-md mx-4">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0f172a] mb-3">
              {successo === "verifica" ? "Controlla la tua email" : "Benvenuto in digITAle"}
            </h1>
            <p className="text-sm text-[#64748b] leading-relaxed mb-8">
              {successo === "verifica" ? (
                <>
                  Ti abbiamo inviato un link di conferma a{" "}
                  <span className="font-semibold text-[#0f172a]">{email}</span>. Aprilo per completare la
                  registrazione.
                </>
              ) : (
                <>Account creato con successo. Ti sto portando alla dashboard...</>
              )}
            </p>
            {successo === "verifica" && (
              <Link
                href="/accedi"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#009246] hover:text-[#007a3a] transition-colors"
              >
                Torna all&apos;accesso <ArrowRight size={14} />
              </Link>
            )}
            {successo === "auto" && <Loader2 size={20} className="animate-spin text-[#009246] mx-auto" />}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Form ─── */
  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto py-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#009246]/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#CE2B37]/[0.03] blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl mx-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/">
              <BrandLogo size="lg" />
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-2">
              {supabaseConfigured ? "Crea il tuo account" : "Entra nella lista d'attesa"}
            </h1>
            <p className="text-sm text-[#64748b]">
              {supabaseConfigured
                ? "Gratuito. Senza scadenza. Senza carta di credito."
                : "Gratuito. Sarai tra i primi ad accedere al lancio privato."}
            </p>
          </div>

          {!supabaseConfigured && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-verde/10 border border-verde/20">
              <CheckCircle2 size={16} className="text-verde shrink-0 mt-0.5" />
              <p className="text-xs text-dark leading-relaxed">
                <span className="font-semibold">Lancio privato in arrivo.</span> Compila il modulo per entrare
                nella lista d&apos;attesa — ti avvisiamo per primi.
                {pianoIniziale && (
                  <span className="ml-1 font-semibold text-verde">Piano: {pianoIniziale}</span>
                )}
              </p>
            </div>
          )}

          {errore && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-snug">{errore}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            {/* Nome + Cognome */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-[#0f172a] mb-2">
                  Nome
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    id="nome"
                    type="text"
                    autoComplete="given-name"
                    required
                    minLength={2}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Mario"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cognome" className="block text-sm font-medium text-[#0f172a] mb-2">
                  Cognome
                </label>
                <input
                  id="cognome"
                  type="text"
                  autoComplete="family-name"
                  required
                  minLength={2}
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                  placeholder="Rossi"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0f172a] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mario.rossi@esempio.it"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0f172a] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={PASSWORD_REQUIREMENTS.minLength}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Almeno 8 caratteri, con maiuscole e numeri"
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-[#94a3b8]" />
                  ) : (
                    <Eye size={16} className="text-[#94a3b8]" />
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-colors ${
                          i < forza.score ? forza.color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${pwValida ? "text-emerald-600" : "text-gray-500"}`}>
                    {pwValida ? "✓ " : ""}
                    {forza.label}
                  </p>
                </div>
              )}
            </div>

            {/* Ruolo */}
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2.5">Cosa fai nella vita?</label>
              <div className="grid grid-cols-2 gap-2">
                {RUOLI.map((r) => {
                  const attivo = ruolo === r.id;
                  const Icon = r.icon;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRuolo(r.id)}
                      className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                        attivo
                          ? "border-[#009246] bg-[#009246]/5 ring-2 ring-[#009246]/10"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 mt-0.5 ${attivo ? "text-[#009246]" : "text-gray-400"}`}
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold leading-tight ${attivo ? "text-[#0f172a]" : "text-gray-700"}`}
                        >
                          {r.label}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consensi GDPR */}
            <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-[#009246]" />
                <span className="text-xs font-semibold text-[#0f172a] uppercase tracking-wider">
                  I tuoi dati, le tue regole
                </span>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consensoPrivacy}
                  onChange={(e) => setConsensoPrivacy(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#009246] focus:ring-[#009246]/30 shrink-0"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  Ho letto e accetto la{" "}
                  <a href="#" className="font-semibold text-[#009246] hover:underline">
                    Privacy Policy
                  </a>{" "}
                  <span className="text-red-600">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consensoTermini}
                  onChange={(e) => setConsensoTermini(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#009246] focus:ring-[#009246]/30 shrink-0"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  Ho letto e accetto i{" "}
                  <a href="#" className="font-semibold text-[#009246] hover:underline">
                    Termini di Servizio
                  </a>{" "}
                  <span className="text-red-600">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consensoMarketing}
                  onChange={(e) => setConsensoMarketing(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#009246] focus:ring-[#009246]/30 shrink-0"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Voglio ricevere novità e consigli utili sul servizio (facoltativo)
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consensoProfilazione}
                  onChange={(e) => setConsensoProfilazione(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#009246] focus:ring-[#009246]/30 shrink-0"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Personalizza la mia esperienza in base al mio utilizzo (facoltativo)
                </span>
              </label>

              <p className="text-[10px] text-gray-500 leading-relaxed pt-1 border-t border-gray-200">
                Puoi revocare ogni consenso quando vuoi dalle impostazioni. I tuoi dati non vengono venduti,
                mai.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={invio || !formValido}
              className="w-full flex items-center justify-center gap-2 bg-[#009246] hover:bg-[#007a3a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-[15px] font-semibold transition-all shadow-lg shadow-[#009246]/20 hover:shadow-xl hover:shadow-[#009246]/30 active:scale-[0.98]"
            >
              {invio ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sto creando il tuo account...
                </>
              ) : (
                <>
                  {supabaseConfigured ? "Crea il mio account" : "Mettimi in lista"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-[#64748b] mt-6">
            Hai già un account?{" "}
            <Link
              href="/accedi"
              className="font-semibold text-[#009246] hover:text-[#007a3a] transition-colors"
            >
              Accedi
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#94a3b8] mt-6">
          &copy; 2026 digITAle &mdash; Fatto in Italia, per l&apos;Italia
        </p>
      </div>
    </div>
  );
}

export default function RegistratiPage() {
  return (
    <Suspense>
      <RegistratiInner />
    </Suspense>
  );
}
