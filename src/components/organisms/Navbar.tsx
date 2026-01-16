"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full p-8 md:p-12 flex justify-between items-start z-50 mix-blend-difference text-white pointer-events-none">
      <div className="pointer-events-auto cursor-pointer group">
        <Link href="/">
          <h1 className="font-serif text-4xl font-bold tracking-tighter">VALO</h1>
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity block mt-1">
            ATELIER
          </span>
        </Link>
      </div>
      
      <div className="pointer-events-auto flex flex-col items-end gap-2">
         <Link href="/archive" className="font-sans text-xs font-bold tracking-[0.2em] hover:text-gray-300 transition-colors">ARCHIVE</Link>
         <Link href="/lab" className="font-sans text-xs font-bold tracking-[0.2em] hover:text-gray-300 transition-colors">LIGHT LAB</Link>
         <Link href="/collective" className="font-sans text-xs font-bold tracking-[0.2em] hover:text-gray-300 transition-colors">COLLECTIVE</Link>
      </div>
    </nav>
  );
}
