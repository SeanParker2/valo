"use client";

export default function ArchiveError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen bg-paper text-black items-center justify-center">
      <div className="text-center max-w-md px-8">
        <h1 className="font-serif text-5xl mb-6">Archive Unavailable</h1>
        <p className="font-sans text-sm text-gray-500 tracking-widest uppercase mb-8">
          We couldn&apos;t load the archive. Please try again.
        </p>
        <button
          onClick={reset}
          className="border border-black px-8 py-3 text-xs font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all"
        >
          RETRY
        </button>
      </div>
    </div>
  );
}
