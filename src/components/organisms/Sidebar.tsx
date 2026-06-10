"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { type LucideIcon, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  className?: string;
  variant?: "default" | "lab" | "archive";
  children?: React.ReactNode;
}

export function Sidebar({ className, variant = "default", children }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobileMenu(); };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  const baseClasses = cn(
    "hidden md:flex fixed left-0 top-0 h-full w-28 md:w-32 flex-col items-center justify-between py-10 z-50 shrink-0 transition-colors duration-300",
    variant === "lab" ? "bg-lab-bg border-lab-border border-r" : "bg-paper border-divider border-r",
    className
  );

  const mobileHeaderClasses = cn(
    "md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 border-b",
    variant === "lab" ? "bg-lab-bg border-lab-border text-white" : "bg-paper border-divider text-black"
  );

  const logoClasses = cn(
    "font-serif font-bold transition-all duration-300",
    variant === "lab"
      ? "text-3xl text-white hover:text-gold-warm"
      : "text-3xl tracking-wider -rotate-90 origin-center translate-y-4 text-black hover:opacity-70"
  );

  const logoText = variant === "lab" ? "V." : "VALO";

  return (
    <>
      <header className={mobileHeaderClasses}>
        <Link href="/" className="font-serif text-2xl font-bold tracking-wide" onClick={closeMobileMenu}>
          {logoText.replace(".", "")}
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className={cn(
              "md:hidden fixed inset-0 z-[60] flex flex-col p-8",
              variant === "lab" ? "bg-lab-bg text-white" : "bg-paper text-black"
            )}
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-2xl font-bold">MENU</span>
              <button onClick={closeMobileMenu} aria-label="Close menu" autoFocus>
                <X className="w-8 h-8" />
              </button>
            </div>

            <nav className="flex flex-col gap-8 items-start">
              {[
                { href: "/", label: "Home" },
                { href: "/archive", label: "Archive" },
                { href: "/collection", label: "Collection" },
                { href: "/story", label: "Story" },
                { href: "/journal", label: "Journal" },
                { href: "/collective", label: "Collective" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="text-4xl font-serif font-light hover:italic transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto">
              <p className="font-sans text-xs tracking-widest opacity-50">VALO BJD ATELIER &copy; 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={baseClasses}>
        <Link href="/" className={logoClasses}>{logoText}</Link>

        <div className="flex flex-col items-center justify-center flex-1 w-full my-8">
          {variant === "default" && <DefaultNav />}
          {variant === "archive" && children}
          {variant === "lab" && children}
        </div>

        <div className={cn("text-sm font-sans font-medium tracking-widest", variant === "lab" ? "hidden" : "")}>
          {variant === "default" && "EN"}
          {variant === "archive" && <span className="text-[10px] font-bold text-accent">V.1.0</span>}
        </div>

        {variant === "lab" && (
          <div className="text-[10px] font-mono text-gray-600 tracking-widest">v1.1</div>
        )}
      </nav>
    </>
  );
}

function DefaultNav() {
  const pathname = usePathname();
  const links = [
    { href: "/archive", label: "Archive" },
    { href: "/collection", label: "Collection" },
    { href: "/tools/resin-lab", label: "Resin Lab" },
    { href: "/tools/joints", label: "Joints" },
    { href: "/journal", label: "Journal" },
    { href: "/collective", label: "Collective" },
  ];

  return (
    <div className="flex flex-col space-y-12 items-center w-full py-8">
      <div className="w-px h-16 bg-gray-400" />
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <div key={link.label} className="relative group">
            <Link
              href={link.href}
              className={cn(
                "text-sm font-sans font-semibold tracking-[0.25em] uppercase [writing-mode:vertical-rl] rotate-180 transition-colors whitespace-nowrap py-4",
                isActive ? "text-gold" : "text-gray-800 hover:text-gold"
              )}
            >
              {link.label}
            </Link>
            <motion.div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 bottom-0 w-px bg-gold transition-all duration-300 ease-out -z-10",
                isActive ? "h-full opacity-100" : "h-0 opacity-30 group-hover:h-full"
              )}
              layoutId="nav-underline"
            />
          </div>
        );
      })}
      <div className="w-px h-16 bg-gray-400" />
    </div>
  );
}

export function SidebarButton({
  icon: Icon,
  label,
  active = false,
  variant = "light",
  onClick,
}: {
  icon: LucideIcon;
  label?: string;
  active?: boolean;
  variant?: "light" | "dark";
  onClick?: () => void;
}) {
  if (variant === "dark") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full aspect-square rounded-2xl flex items-center justify-center transition-all group relative",
          active
            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/20"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon className="w-8 h-8" />
        {label && (
          <span className="absolute left-20 bg-white text-black text-sm font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity">
            {label}
          </span>
        )}
      </button>
    );
  }

  return (
    <button className="group relative p-2" onClick={onClick}>
      <Icon className="w-6 h-6 text-accent group-hover:text-black transition-colors" />
      {label && (
        <span className="absolute left-14 top-2 bg-black text-white text-xs font-bold px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest">
          {label}
        </span>
      )}
    </button>
  );
}
