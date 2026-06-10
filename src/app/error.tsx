"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen bg-paper text-black items-center justify-center">
      <div className="text-center max-w-md px-8">
        <h1 className="font-serif text-6xl mb-6">Something went wrong</h1>
        <p className="font-sans text-sm text-gray-500 tracking-widest uppercase mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="border border-black px-8 py-3 text-xs font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}
