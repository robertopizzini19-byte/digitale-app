"use client";

export function BrandLogo({ size = "default", variant = "dark" }: { size?: "sm" | "default" | "lg"; variant?: "dark" | "light" }) {
  const cfg = {
    sm:      { dig: "text-[1rem]",    ita: "text-[1.25rem]", le: "text-[0.9rem]",  bar: "h-[1.5px]" },
    default: { dig: "text-[1.35rem]", ita: "text-[1.75rem]", le: "text-[1.2rem]",  bar: "h-[2px]" },
    lg:      { dig: "text-[2rem]",    ita: "text-[2.6rem]",  le: "text-[1.75rem]", bar: "h-[2.5px]" },
  };
  const s = cfg[size];
  const base = variant === "dark" ? "text-[#0f172a]" : "text-white";

  return (
    <span className="inline-flex flex-col select-none" aria-label="DigITAle">
      <span className={`inline-flex items-baseline brand-ita brand-ita--${variant}`}>
        <span className={`${s.dig} font-medium ${base} tracking-tight leading-none`}>Dig</span>
        <span className={`${s.ita} font-extrabold tracking-[-0.02em] leading-none`}>
          <span className="brand-I">I</span>
          <span className="brand-T">T</span>
          <span className="brand-A">A</span>
        </span>
        <span className={`${s.le} font-light ${base} tracking-[0.08em] leading-none`}>le</span>
      </span>
      <span className={`brand-underline ${s.bar} mt-[3px] rounded-full`} style={{ width: "100%" }} />
    </span>
  );
}
