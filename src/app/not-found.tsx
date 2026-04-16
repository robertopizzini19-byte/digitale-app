import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-5">
      {/* Tricolor accent bar at top */}
      <div className="fixed top-0 left-0 w-full tricolor-bar" />

      <div className="text-center max-w-md">
        {/* 404 number */}
        <h1 className="text-[8rem] sm:text-[10rem] font-extrabold leading-none tracking-tight text-gradient-italia select-none">
          404
        </h1>

        {/* Tricolor divider */}
        <div className="flex w-24 h-1 rounded-full overflow-hidden mx-auto mb-8">
          <div className="flex-1 bg-verde" />
          <div className="flex-1 bg-bianco border-y border-gray-200" />
          <div className="flex-1 bg-rosso" />
        </div>

        {/* Messages */}
        <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-3">
          Pagina non trovata
        </h2>
        <p className="text-base text-muted leading-relaxed mb-10">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
