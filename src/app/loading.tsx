export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div
          className="w-12 h-12 rounded-full border-[3px] border-gray-200 animate-spin"
          style={{
            borderTopColor: "var(--verde)",
          }}
        />
        <p className="text-sm text-muted font-medium">Caricamento...</p>
      </div>
    </div>
  );
}
