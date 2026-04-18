"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ReferralInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("ref") ?? "";

  useEffect(() => {
    if (code && typeof window !== "undefined") {
      try {
        localStorage.setItem("digitale_referral", code);
      } catch {
        // localStorage non disponibile (incognito strict)
      }
    }
    router.replace("/registrati");
  }, [code, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f1f5f9]">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <div className="w-10 h-10 rounded-xl bg-[#009246]/10 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-[#009246] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm">Reindirizzamento in corso…</p>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  return (
    <Suspense>
      <ReferralInner />
    </Suspense>
  );
}
