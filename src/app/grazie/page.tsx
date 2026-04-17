import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sei nella lista — digITAle",
  description: "Sei nella lista d'attesa di digITAle. Ti avvisiamo appena apriremo le porte.",
  robots: "noindex",
};

export default function GraziePage() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#009246]/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#CE2B37]/[0.03] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-10 text-center">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <BrandLogo size="lg" />
            </Link>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#0f172a] mb-3">Sei nella lista!</h1>

          <p className="text-sm text-[#64748b] leading-relaxed mb-8">
            Riceverai un&apos;email non appena apriremo le porte del lancio privato. Sii pronto — arriverà
            prima di quanto pensi.
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex w-12 h-1.5 rounded-full overflow-hidden">
              <div className="flex-1 bg-[#009246]" />
              <div className="flex-1 bg-white border-y border-gray-200" />
              <div className="flex-1 bg-[#CE2B37]" />
            </div>
            <span className="text-xs text-[#94a3b8]">digITAle · Fatto in Italia</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#009246] hover:text-[#007a3a] transition-colors"
          >
            Torna alla home <ArrowRight size={14} />
          </Link>
        </div>

        <p className="text-center text-xs text-[#94a3b8] mt-6">
          © 2026 digITAle — Fatto in Italia, per l&apos;Italia
        </p>
      </div>
    </div>
  );
}
