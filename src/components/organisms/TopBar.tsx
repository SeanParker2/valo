"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/archive", label: "Archive" },
  { href: "/collection", label: "Collection" },
  { href: "/tools/resin-lab", label: "Resin Lab" },
  { href: "/tools/joints", label: "Joints" },
  { href: "/journal", label: "Journal" },
  { href: "/collective", label: "Collective" },
];

export function TopBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, close]);

  return (
    <>
      {/* Desktop: top bar with logo + links */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-[55] bg-paper/90 backdrop-blur-md border-b border-divider h-14 items-center justify-between px-8">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-black hover:opacity-70 transition-opacity">
          VALO
        </Link>
        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors relative py-4",
                  isActive ? "text-gold" : "text-gray-500 hover:text-black"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="topbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile: hamburger header (replaces Sidebar mobile header) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[55] bg-paper/95 backdrop-blur-md border-b border-divider h-14 flex items-center justify-between px-6">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-black" onClick={close}>
          VALO
        </Link>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="w-5 h-5 text-black" />
        </button>
      </header>

      {/* Mobile: fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-[60] bg-paper flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-black" onClick={close}>
                VALO
              </Link>
              <button onClick={close} aria-label="Close menu">
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={cn(
                      "font-serif text-4xl font-light transition-colors",
                      isActive ? "text-gold" : "text-gray-400 hover:text-black"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto">
              <p className="font-sans text-[10px] tracking-widest text-gray-400 uppercase">VALO BJD ATELIER &copy; 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
