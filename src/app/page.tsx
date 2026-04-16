"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Globe,
  BadgeEuro,
  FileText,
  Mic,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Building2,
  Hammer,
  Heart,
  Stethoscope,
  Plane,
  Landmark,
  GraduationCap,
  ArrowRight,
  Check,
  Star,
  Users,
  TrendingUp,
  ChevronDown,
  Menu,
  X,
  Play,
  Zap,
  Lock,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

/* ================================================================== */
/*  NAVBAR                                                             */
/* ================================================================== */

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="tricolor-bar" />
      <nav className="sticky top-0 z-50 glass border-b border-border/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5">
              <BrandLogo />
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-10">
              <a href="#come-funziona" className="text-[15px] font-medium text-muted hover:text-dark transition-colors">
                Come Funziona
              </a>
              <a href="#per-chi" className="text-[15px] font-medium text-muted hover:text-dark transition-colors">
                Per Chi
              </a>
              <a href="#prezzi" className="text-[15px] font-medium text-muted hover:text-dark transition-colors">
                Prezzi
              </a>
              <a href="#contatti" className="text-[15px] font-medium text-muted hover:text-dark transition-colors">
                Contatti
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/accedi"
                className="text-[15px] font-medium text-dark hover:text-verde transition-colors px-4 py-2"
              >
                Accedi
              </Link>
              <Link
                href="/dashboard"
                className="btn-primary px-6 py-2.5 rounded-xl text-[15px] font-semibold"
              >
                Prova Gratis
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-border/60 bg-white">
            <div className="flex flex-col px-5 py-4 gap-1">
              <a href="#come-funziona" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium text-dark hover:bg-gray-50 transition-colors">Come Funziona</a>
              <a href="#per-chi" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium text-dark hover:bg-gray-50 transition-colors">Per Chi</a>
              <a href="#prezzi" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium text-dark hover:bg-gray-50 transition-colors">Prezzi</a>
              <a href="#contatti" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium text-dark hover:bg-gray-50 transition-colors">Contatti</a>
              <div className="mt-3 pt-3 border-t border-border/60 flex flex-col gap-2">
                <Link href="/accedi" className="text-center px-4 py-3 rounded-xl text-[15px] font-medium text-dark hover:bg-gray-50 transition-colors">Accedi</Link>
                <Link href="/dashboard" className="btn-primary text-center px-4 py-3 rounded-xl text-[15px] font-semibold">Prova Gratis</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */

function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex">
              <BrandLogo variant="light" />
            </Link>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              Lo standard digitale italiano.<br />
              Semplice, onesto, sovrano.
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="w-3 h-3 rounded-full bg-verde" />
              <span className="w-3 h-3 rounded-full bg-bianco" />
              <span className="w-3 h-3 rounded-full bg-rosso" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Prodotto</h4>
            <ul className="space-y-2.5">
              <li><a href="#come-funziona" className="text-sm text-gray-300 hover:text-verde transition-colors">Come Funziona</a></li>
              <li><a href="#prezzi" className="text-sm text-gray-300 hover:text-verde transition-colors">Prezzi</a></li>
              <li><a href="#per-chi" className="text-sm text-gray-300 hover:text-verde transition-colors">Per Chi</a></li>
              <li><Link href="/dashboard" className="text-sm text-gray-300 hover:text-verde transition-colors">Demo Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Risorse</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-300 hover:text-verde transition-colors">Documentazione</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-verde transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-verde transition-colors">Assistenza</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-verde transition-colors">Stato del Servizio</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Legale</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-300 hover:text-verde transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-verde transition-colors">Termini di Servizio</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-verde transition-colors">Cookie</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-verde transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 DigiITAle &mdash; Fatto in Italia, per l&apos;Italia. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-gray-600">
            P.IVA IT00000000000 &middot; Sede: Italia
          </p>
        </div>
      </div>
      <div className="tricolor-bar" />
    </footer>
  );
}

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */

const PROBLEMS = [
  {
    icon: FileText,
    title: "Frammentazione",
    desc: "Ogni servizio digitale è un abbonamento diverso. Nessuno parla con l'altro. Tempo e denaro persi ogni giorno.",
    stat: "4+ app",
    statLabel: "usate in media",
  },
  {
    icon: Globe,
    title: "Dipendenza Estera",
    desc: "Il 73% dei dati delle imprese italiane finisce su server americani. Nessun controllo sulla sovranità dei dati.",
    stat: "73%",
    statLabel: "dati all'estero",
  },
  {
    icon: BadgeEuro,
    title: "Prezzi Escludenti",
    desc: "Un artigiano paga fino a 2.000 euro l'anno per strumenti pensati per multinazionali. Non è giusto.",
    stat: "€2.000",
    statLabel: "costo medio annuo",
  },
  {
    icon: Shield,
    title: "Burocrazia Digitale",
    desc: "SPID, PEC, firma digitale, fatturazione: ogni passaggio è complicato. Milioni di italiani rinunciano.",
    stat: "18\u00b0",
    statLabel: "Italia nel DESI EU",
  },
];

const STEPS = [
  {
    icon: Mic,
    num: "01",
    title: "Parla",
    desc: "Descrivi cosa ti serve con parole tue. In italiano naturale, come parleresti a un collega fidato.",
    color: "verde",
  },
  {
    icon: Sparkles,
    num: "02",
    title: "DigiITAle Capisce",
    desc: "L'intelligenza artificiale italiana interpreta la tua richiesta e prepara tutto: fatture, documenti, comunicazioni.",
    color: "info",
  },
  {
    icon: CheckCircle2,
    num: "03",
    title: "Fatto",
    desc: "Ricevi il risultato pronto e verificato. Nessun passaggio manuale. Nessuna competenza tecnica richiesta.",
    color: "success",
  },
];

const TARGETS = [
  { icon: Briefcase, title: "Freelance e Professionisti", desc: "Fatture, clienti, scadenze e tasse in un unico posto." },
  { icon: Building2, title: "Piccole e Medie Imprese", desc: "Gestione completa della tua impresa, senza complicazioni." },
  { icon: Hammer, title: "Artigiani e Commercianti", desc: "Digitale semplice per chi lavora con le mani ogni giorno." },
  { icon: Heart, title: "Famiglie e Cittadini", desc: "Bollette, documenti, scuola: tutto in un posto sicuro." },
  { icon: Stethoscope, title: "Professionisti Sanitari", desc: "Pazienti, appuntamenti e referti senza burocrazia." },
  { icon: Plane, title: "Italiani all'Estero", desc: "Resta connesso con l'Italia ovunque tu sia nel mondo." },
  { icon: Landmark, title: "Comuni e Pubblica Amministrazione", desc: "Servizi digitali finalmente accessibili per ogni cittadino." },
  { icon: GraduationCap, title: "Studenti e Università", desc: "Strumenti gratuiti per studiare, organizzarsi e crescere." },
];

const PLANS = [
  {
    name: "Gratuito",
    price: "€0",
    period: "per sempre",
    desc: "Per iniziare senza pensieri",
    features: [
      "Identità digitale verificata",
      "Gestione documenti personali",
      "Assistente vocale base",
      "Promemoria scadenze",
      "Supporto comunità",
    ],
    highlighted: false,
    cta: "Inizia Gratis",
  },
  {
    name: "Professionista",
    price: "€9",
    period: "al mese",
    desc: "Per chi lavora in proprio",
    features: [
      "Tutto del piano Gratuito",
      "Fatturazione elettronica illimitata",
      "Gestione clienti e progetti",
      "Firma digitale integrata",
      "Contabilità automatica",
      "Assistenza prioritaria 24/7",
    ],
    highlighted: true,
    cta: "Scegli Professionista",
  },
  {
    name: "Impresa",
    price: "€49",
    period: "al mese",
    desc: "Per team e aziende",
    features: [
      "Tutto del piano Professionista",
      "Multi-utente fino a 25 persone",
      "Integrazioni PA, INPS, INAIL",
      "Report e analisi avanzate",
      "Account manager dedicato",
      "SLA garantito 99,9%",
    ],
    highlighted: false,
    cta: "Contattaci",
  },
];

const FEATURES_GRID = [
  { icon: Zap, title: "Veloce", desc: "Ogni operazione in meno di 3 secondi" },
  { icon: Lock, title: "Sicuro", desc: "Dati crittografati su server italiani" },
  { icon: MessageCircle, title: "Vocale", desc: "Parla invece di scrivere e cliccare" },
  { icon: BarChart3, title: "Intelligente", desc: "L'AI impara le tue abitudini" },
  { icon: Users, title: "Collaborativo", desc: "Condividi con team e commercialista" },
  { icon: Play, title: "Automatico", desc: "Scadenze, promemoria, report: tutto da solo" },
];

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white min-h-[90vh] flex items-center">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-verde/[0.04] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-rosso/[0.03] blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-verde/[0.02] blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verde/10 text-verde text-sm font-semibold mb-8">
                <span className="w-2 h-2 rounded-full bg-verde animate-pulse" />
                Lo standard digitale italiano
              </div>

              <h1 className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold text-dark leading-[1.1] tracking-tight mb-6">
                Il Digitale{" "}
                <span className="text-gradient-italia">degli Italiani</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                Un&apos;unica piattaforma per fatture, documenti, clienti e burocrazia.
                Parli in italiano, DigiITAle fa il resto.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href="/dashboard"
                  className="btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold shadow-xl shadow-verde/20 w-full sm:w-auto justify-center"
                >
                  Prova la Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#come-funziona"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-dark border-2 border-gray-200 hover:border-verde/40 transition-all w-full sm:w-auto justify-center"
                >
                  <Play className="w-4 h-4 text-verde" />
                  Scopri Come Funziona
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {["RP", "MR", "LB", "GC", "AF"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ backgroundColor: ["#009246", "#CE2B37", "#2563eb", "#d97706", "#7c3aed"][i], zIndex: 5 - i }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark">2.400+ iscritti</p>
                  <p className="text-xs text-muted">alla lista d&apos;attesa</p>
                </div>
              </div>
            </div>

            {/* Right: Visual preview card */}
            <div className="relative hidden lg:block">
              <div className="animate-float">
                <div className="bg-white rounded-3xl shadow-2xl shadow-dark/10 border border-gray-100 overflow-hidden">
                  {/* Mini dashboard preview */}
                  <div className="bg-dark p-4 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rosso" />
                      <span className="w-3 h-3 rounded-full bg-warning" />
                      <span className="w-3 h-3 rounded-full bg-verde" />
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-gray-400">app.digitale.it/dashboard</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Voice command */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-verde/10 flex items-center justify-center shrink-0">
                        <Mic className="w-5 h-5 text-verde" />
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-dark">
                        &ldquo;Crea una fattura per Mario Rossi, 500 euro per consulenza web&rdquo;
                      </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-verde/10 rounded-2xl rounded-tr-md px-4 py-3 text-sm text-dark">
                        <p className="font-semibold">Fattura #2024-047 creata</p>
                        <p className="text-muted text-xs mt-1">Mario Rossi &middot; €500 + IVA &middot; Pronta per l&apos;invio</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-verde flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {/* Stats mini */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-dark">€4.250</p>
                        <p className="text-[10px] text-muted">Fatturato</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-verde">+12%</p>
                        <p className="text-[10px] text-muted">Crescita</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-dark">18</p>
                        <p className="text-[10px] text-muted">Clienti</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16 lg:mt-20">
            <a href="#problema" className="group">
              <ChevronDown className="w-6 h-6 text-muted animate-bounce group-hover:text-verde transition-colors" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== PROBLEMS ===== */}
      <section id="problema" className="bg-white py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-widest uppercase text-rosso mb-4">Il Problema</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark mb-5">
              Perché serve DigiITAle?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted leading-relaxed">
              L&apos;Italia è la terza economia dell&apos;Eurozona ma è 18esima nella digitalizzazione.
              Non manca il talento. Manca l&apos;infrastruttura.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="group card-hover rounded-2xl border border-gray-100 bg-white p-7">
                <div className="w-14 h-14 rounded-2xl bg-rosso/8 flex items-center justify-center mb-6 group-hover:bg-rosso/12 transition-colors">
                  <p.icon className="w-7 h-7 text-rosso" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4">{p.desc}</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-2xl font-extrabold text-dark">{p.stat}</p>
                  <p className="text-xs text-muted">{p.statLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="come-funziona" className="bg-gray-50 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-widest uppercase text-verde mb-4">La Soluzione</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark mb-5">
              Tre passaggi. La tua voce.
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted leading-relaxed">
              Niente manuali, niente formazione. Parla in italiano naturale e DigiITAle gestisce tutto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-verde via-info to-success" />

            {STEPS.map((s) => (
              <div key={s.title} className="relative text-center">
                <div className="relative z-10 w-12 h-12 mx-auto rounded-full bg-verde text-white text-lg font-bold flex items-center justify-center shadow-lg shadow-verde/30 mb-6">
                  {s.num}
                </div>

                <div className="card-hover bg-white rounded-2xl border border-gray-100 p-8 pt-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-verde/8 flex items-center justify-center mb-5">
                    <s.icon className="w-8 h-8 text-verde" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold"
            >
              Guarda la Demo in Azione
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-widest uppercase text-verde mb-4">Caratteristiche</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark mb-5">
              Costruito per semplificare
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURES_GRID.map((f) => (
              <div key={f.title} className="card-hover rounded-2xl border border-gray-100 p-6 sm:p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-verde/8 flex items-center justify-center mb-4">
                  <f.icon className="w-7 h-7 text-verde" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NUMBERS ===== */}
      <section className="relative bg-dark py-24 md:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-verde/10 to-transparent" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rosso/10 to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Un mercato che aspetta una risposta
            </h2>
            <p className="text-lg text-gray-400">Numeri reali, persone reali, problemi reali.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "4,5M", label: "Lavoratori Autonomi", sub: "in Italia" },
              { value: "4,2M", label: "Piccole Imprese", sub: "da digitalizzare" },
              { value: "60M", label: "Cittadini Italiani", sub: "potenziali utenti" },
              { value: "€0", label: "Piano Base", sub: "per sempre" },
            ].map((n) => (
              <div key={n.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-verde mb-2">{n.value}</div>
                <div className="text-sm font-semibold text-white mb-1">{n.label}</div>
                <div className="text-xs text-gray-500">{n.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TARGET ===== */}
      <section id="per-chi" className="bg-white py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-widest uppercase text-verde mb-4">Per Chi</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark mb-5">
              Per ogni italiano che lavora, studia, vive
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted leading-relaxed">
              26 categorie di utenti, un unico ecosistema. DigiITAle cresce con te.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TARGETS.map((t) => (
              <div key={t.title} className="group card-hover rounded-2xl border border-gray-100 bg-white p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-verde/8 flex items-center justify-center mb-4 group-hover:bg-verde group-hover:shadow-lg group-hover:shadow-verde/20 transition-all duration-300">
                  <t.icon className="w-7 h-7 text-verde group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base font-bold text-dark mb-2">{t.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="prezzi" className="bg-gray-50 py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-widest uppercase text-verde mb-4">Prezzi</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark mb-5">
              Onesti e trasparenti
            </h2>
            <p className="max-w-xl mx-auto text-lg text-muted">
              Nessun costo nascosto. Nessun vincolo. Inizia gratis, cresci quando vuoi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`card-hover relative rounded-3xl p-8 flex flex-col ${
                  plan.highlighted
                    ? "bg-white border-2 border-verde shadow-2xl shadow-verde/10 scale-[1.02] md:scale-105"
                    : "bg-white border border-gray-100"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-verde text-white text-xs font-bold px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-verde/30">
                    <Star className="w-3.5 h-3.5" />
                    Più Scelto
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-dark">{plan.name}</h3>
                  <p className="text-sm text-muted mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-dark">{plan.price}</span>
                    <span className="text-base text-muted">/{plan.period}</span>
                  </div>
                </div>

                <ul className="flex-1 space-y-3.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-dark">
                      <div className="w-5 h-5 rounded-full bg-verde/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-verde" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3.5 rounded-2xl font-semibold text-[15px] transition-all ${
                    plan.highlighted
                      ? "btn-primary shadow-lg shadow-verde/20"
                      : "bg-gray-100 text-dark hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEMO CTA ===== */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="bg-gradient-to-br from-dark to-dark-soft rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-verde/15 to-transparent" />
              <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-rosso/10 to-transparent" />
            </div>

            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="flex w-20 h-1 rounded-full overflow-hidden">
                  <div className="flex-1 bg-verde" />
                  <div className="flex-1 bg-bianco" />
                  <div className="flex-1 bg-rosso" />
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Guarda DigiITAle<br />
                <span className="text-verde">in azione</span>
              </h2>

              <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
                Esplora la dashboard interattiva e scopri come sarà lavorare con DigiITAle ogni giorno.
              </p>

              <Link
                href="/dashboard"
                className="btn-primary inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-verde/30"
              >
                Apri la Demo Dashboard
                <ArrowRight className="w-6 h-6" />
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Dati protetti in Italia
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> GDPR compliant
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Lancio 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section id="contatti" className="bg-gray-50 py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-5">
            L&apos;Italia merita il suo standard digitale
          </h2>
          <p className="text-lg text-muted mb-10 max-w-lg mx-auto">
            Unisciti a migliaia di italiani che credono in un digitale semplice, onesto e sovrano.
          </p>

          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="La tua email"
              className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-verde/30 focus:border-verde transition-all"
            />
            <button className="btn-primary px-8 py-4 rounded-2xl text-base font-bold whitespace-nowrap">
              Iscriviti
            </button>
          </div>

          <p className="text-xs text-muted mt-4">
            Zero spam. Solo aggiornamenti importanti. Cancellati quando vuoi.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
