import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-valo-gold/30">
      <div className="relative">
        <h1 className="font-serif text-[12rem] leading-none opacity-5 select-none pointer-events-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-xs tracking-[0.3em] text-valo-gold mb-4">ERROR_Code: NOT_FOUND</p>
          <h2 className="font-serif text-4xl mb-8">Lost in the Void</h2>
          <Link 
            href="/"
            className="group flex items-center gap-2 px-6 py-3 border border-white/10 hover:bg-white/5 transition-all rounded-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold tracking-widest uppercase">Return to Atelier</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
