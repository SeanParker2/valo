"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/archive", label: "ARCHIVE" },
    { href: "/collection", label: "COLLECTION" },
    { href: "/tools/resin-lab", label: "RESIN LAB" },
    { href: "/tools/joints", label: "JOINTS" },
    { href: "/journal", label: "JOURNAL" },
    { href: "/collective", label: "COLLECTIVE" },
  ];

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
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-sans text-xs font-bold tracking-[0.2em] transition-colors relative",
                isActive ? "text-gold-warm" : "hover:text-gray-300"
              )}
            >
              {link.label}
              {isActive && (
                <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold-warm" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
