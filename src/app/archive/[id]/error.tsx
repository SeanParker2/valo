"use client";

export default function ArchiveDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen bg-paper text-black items-center justify-center">
      <div className="text-center max-w-md px-8">
        <h1 className="font-serif text-5xl mb-6">Doll Not Found</h1>
        <p className="font-sans text-sm text-gray-500 tracking-widest uppercase mb-8">
          We couldn&apos;t load this doll&apos;s details. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="border border-black px-8 py-3 text-xs font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all"
          >
            RETRY
          </button>
          <a
            href="/archive"
            className="border border-gray-300 px-8 py-3 text-xs font-bold tracking-[0.2em] text-gray-500 hover:text-black hover:border-black transition-all"
          >
            BACK TO ARCHIVE
          </a>
        </div>
      </div>
    </div>
  );
}
