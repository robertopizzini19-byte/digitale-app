"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function BrandLogo() {
  return (
    <span className="inline-flex flex-col select-none" aria-label="DigITAle">
      <span className="inline-flex items-baseline brand-ita brand-ita--dark">
        <span className="text-[2rem] font-medium text-[#0f172a] tracking-tight leading-none">Dig</span>
        <span className="text-[2.6rem] font-extrabold tracking-[-0.02em] leading-none">
          <span className="brand-I">I</span>
          <span className="brand-T">T</span>
          <span className="brand-A">A</span>
        </span>
        <span className="text-[1.75rem] font-light text-[#0f172a] tracking-[0.08em] leading-none">le</span>
      </span>
      <span className="brand-underline h-[2.5px] mt-[3px] rounded-full" style={{ width: "100%" }} />
    </span>
  );
}

export default function AccediPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
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
              <BrandLogo />
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Accedi al tuo account</h1>
            <p className="text-sm text-[#64748b]">Inserisci le tue credenziali per continuare</p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); window.location.href = "/dashboard"; }} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0f172a] mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.it"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                  defaultValue="roberto@digitale.it"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#0f172a]">Password</label>
                <a href="#" className="text-xs font-medium text-[#009246] hover:text-[#007a3a] transition-colors">Password dimenticata?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="La tua password"
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#009246]/20 focus:border-[#009246]/40 transition-all"
                  defaultValue="demo12345"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-[#009246] focus:ring-[#009246]/30"
              />
              <label htmlFor="remember" className="text-sm text-[#64748b]">Ricordami su questo dispositivo</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#009246] hover:bg-[#007a3a] text-white py-3.5 rounded-xl text-[15px] font-semibold transition-all shadow-lg shadow-[#009246]/20 hover:shadow-xl hover:shadow-[#009246]/30 active:scale-[0.98]"
            >
              Accedi
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[#94a3b8]">oppure</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* SPID */}
          <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-[#009246]/30 py-3 rounded-xl text-sm font-medium text-[#0f172a] transition-all hover:bg-[#009246]/5">
            <span className="w-5 h-5 rounded bg-[#004080] flex items-center justify-center text-white text-[9px] font-bold">SP</span>
            Accedi con SPID
          </button>

          {/* Register */}
          <p className="text-center text-sm text-[#64748b] mt-6">
            Non hai un account?{" "}
            <Link href="/" className="font-semibold text-[#009246] hover:text-[#007a3a] transition-colors">
              Registrati gratis
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#94a3b8] mt-6">
          &copy; 2025 DigITAle &mdash; Fatto in Italia, per l&apos;Italia
        </p>
      </div>
    </div>
  );
}
