export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-atelier-bg">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-atelier-black animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-atelier-black animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-atelier-black animate-bounce"></div>
      </div>
      <span className="mt-4 font-mono text-[10px] tracking-[0.3em] text-gray-400 uppercase">Loading Atelier</span>
    </div>
  );
}
