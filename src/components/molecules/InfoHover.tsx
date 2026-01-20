"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfoHoverProps {
  term: string;
  definition: string;
  variant?: "light" | "dark";
}

export default function InfoHover({ term, definition, variant = "dark" }: InfoHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Term with animated underline */}
      <span className={cn(
        "relative z-10 border-b border-dashed transition-all duration-300",
        variant === "dark" 
          ? "text-white border-valo-gold/50 group-hover:border-solid group-hover:border-valo-gold" 
          : "text-gray-900 border-gray-400 group-hover:border-solid group-hover:border-black"
      )}>
        {term}
      </span>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-4 backdrop-blur-xl border rounded-sm shadow-2xl z-50 pointer-events-none text-left block",
              variant === "dark" 
                ? "bg-white/5 border-white/10" 
                : "bg-gray-900/95 border-gray-800"
            )}
          >
            <span className="flex items-start gap-2">
              <span className="w-1 h-full bg-valo-gold absolute left-0 top-0 bottom-0 rounded-l-sm" />
              <span className="pl-2 block">
                <span className="block font-mono text-[10px] text-valo-gold tracking-widest mb-1 uppercase">
                  Term Definition
                </span>
                <span className={cn(
                  "font-serif text-sm leading-relaxed italic block",
                  variant === "dark" ? "text-gray-200" : "text-gray-300"
                )}>
                  &quot;{definition}&quot;
                </span>
              </span>
            </span>
            {/* Arrow */}
            <span className={cn(
              "absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]",
              variant === "dark" ? "border-t-white/10" : "border-t-gray-900/95"
            )} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
