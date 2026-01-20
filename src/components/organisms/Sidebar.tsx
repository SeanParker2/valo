"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LucideIcon, Menu, X } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  className?: string;
  variant?: "default" | "lab" | "archive";
  children?: React.ReactNode;
}

export function Sidebar({ className, variant = "default", children }: SidebarProps) {
  usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Base classes for the sidebar container (Desktop)
  const baseClasses = cn(
    "hidden md:flex fixed left-0 top-0 h-full w-28 md:w-32 flex-col items-center justify-between py-10 z-50 shrink-0 transition-colors duration-300",
    variant === "lab" ? "bg-[#0f0f0f] border-lab-border border-r" : "bg-atelier-bg border-[#e5e0d8] border-r",
    className
  );

  // Mobile Header Classes
  const mobileHeaderClasses = cn(
    "md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 border-b",
    variant === "lab" ? "bg-[#0f0f0f] border-lab-border text-white" : "bg-atelier-bg border-[#e5e0d8] text-atelier-black"
  );

  // Logo styles
  const logoClasses = cn(
    "font-serif font-bold transition-all duration-300",
    variant === "lab" 
      ? "text-3xl text-white hover:text-valo-gold" 
      : "text-3xl tracking-wider -rotate-90 origin-center translate-y-4 text-atelier-black hover:opacity-70"
  );
  
  const logoText = variant === "lab" ? "V." : "VALO";

  return (
    <>
      {/* MOBILE HEADER */}
      <header className={mobileHeaderClasses}>
        <Link href="/" className="font-serif text-2xl font-bold tracking-wide">
          {logoText.replace(".", "")}
        </Link>
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={cn(
              "md:hidden fixed inset-0 z-[60] flex flex-col p-8",
              variant === "lab" ? "bg-[#0f0f0f] text-white" : "bg-atelier-bg text-atelier-black"
            )}
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-2xl font-bold">MENU</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>

            <nav className="flex flex-col gap-8 items-start">
              <Link href="/" className="text-4xl font-serif font-light hover:italic transition-all">Home</Link>
              <Link href="/archive" className="text-4xl font-serif font-light hover:italic transition-all">Archive</Link>
              <Link href="/collective" className="text-4xl font-serif font-light hover:italic transition-all">Collective</Link>
              <Link href="/lab" className="text-4xl font-serif font-light hover:italic transition-all text-valo-gold">Light Lab</Link>
            </nav>

            <div className="mt-auto">
              <p className="font-sans text-xs tracking-widest opacity-50">VALO BJD ATELIER © 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <nav className={baseClasses}>
        {/* Logo */}
        <Link href="/" className={logoClasses}>
          {logoText}
        </Link>

        {/* Center Content (Navigation or Custom) */}
        <div className="flex flex-col items-center justify-center flex-1 w-full my-8">
          {variant === "default" && <DefaultNav />}
          {variant === "archive" && children}
          {variant === "lab" && children}
        </div>

        {/* Footer / Status */}
        <div className={cn("text-sm font-sans font-medium tracking-widest", variant === "lab" ? "hidden" : "")}>
          {variant === "default" && "EN"}
          {variant === "archive" && <span className="text-xs font-bold text-atelier-accent">V.1.0</span>}
        </div>
        
        {/* Lab specific bottom element */}
        {variant === "lab" && (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-600 to-gray-800 border-2 border-gray-600 hover:border-white transition-colors cursor-pointer"></div>
        )}
      </nav>
    </>
  );
}

import { motion, AnimatePresence } from "framer-motion";

function DefaultNav() {
  const pathname = usePathname();
  const links = [
    { href: "/archive", label: "Archive" },
    { href: "/collective", label: "Collective" },
    { href: "/lab", label: "Light Lab" },
  ];

  return (
    <div className="flex flex-col space-y-12 items-center w-full py-8">
      <div className="w-px h-16 bg-gray-400"></div>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <div key={link.label} className="relative group">
            <Link 
              href={link.href} 
              className={cn(
                "text-sm font-sans font-semibold tracking-[0.25em] uppercase [writing-mode:vertical-rl] rotate-180 transition-colors whitespace-nowrap py-4",
                isActive ? "text-atelier-gold" : "text-gray-800 hover:text-atelier-gold"
              )}
            >
              {link.label}
            </Link>
            <motion.div 
              className={cn(
                "absolute left-1/2 -translate-x-1/2 bottom-0 w-px bg-atelier-gold transition-all duration-300 ease-out -z-10",
                isActive ? "h-full opacity-100" : "h-0 opacity-30 group-hover:h-full"
              )}
              layoutId="nav-underline"
            />
          </div>
        );
      })}
      <div className="w-px h-16 bg-gray-400"></div>
    </div>
  );
}

// Sub-components for Archive/Lab specific buttons
export function SidebarButton({ 
  icon: Icon, 
  label, 
  active = false,
  variant = "light",
  onClick 
}: { 
  icon: LucideIcon, 
  label?: string, 
  active?: boolean,
  variant?: "light" | "dark",
  onClick?: () => void 
}) {
  if (variant === "dark") {
    // Lab style button
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
          <span className="absolute left-20 bg-white text-black text-sm font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
            {label}
          </span>
        )}
      </button>
    );
  }

  // Archive style button
  return (
    <button className="group relative p-2">
      <Icon className="w-6 h-6 text-atelier-accent group-hover:text-black transition-colors" />
      {label && (
        <span className="absolute left-14 top-2 bg-atelier-black text-white text-xs font-bold px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest">
          {label}
        </span>
      )}
    </button>
  );
}
