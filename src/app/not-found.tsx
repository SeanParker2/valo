import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-paper text-black items-center justify-center relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-serif text-[20vw] text-cream leading-none">404</span>
      </div>

      <div className="relative z-10 text-center max-w-lg px-8">
        <span className="font-mono text-[10px] tracking-widest text-gold mb-6 block">
          PAGE NOT FOUND
        </span>
        <h1 className="section-title text-6xl md:text-8xl mb-6">
          Lost in <span className="italic text-gold">Resin</span>
        </h1>
        <p className="font-serif text-xl text-gray-500 leading-relaxed mb-12">
          The page you seek may have been archived, or the URL was mistyped. Like a prototype that never made it to production — sometimes the best things are hard to find.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn-primary">HOME</Link>
          <Link href="/archive" className="btn-secondary">ARCHIVE</Link>
          <Link href="/journal" className="btn-ghost">JOURNAL</Link>
        </div>
      </div>
    </div>
  );
}
