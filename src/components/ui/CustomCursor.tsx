"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<"default" | "pointer" | "text" | "view">("default");
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouchDevice || prefersReduced) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;

      if (target.closest("a") || target.closest("button") || target.closest("[role='button']")) {
        setHoverState("pointer");
      } else if (target.closest("[data-cursor='view']") || target.closest(".cursor-zoom-in")) {
        setHoverState("view");
      } else if (target.closest("p") || target.closest("h1") || target.closest("h2") || target.closest("h3") || target.closest("span:not(.pointer-events-none)")) {
        setHoverState("text");
      } else {
        setHoverState("default");
      }
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference bg-white transition-opacity duration-200",
        !isVisible && "opacity-0",
        hoverState === "default" && "w-3 h-3 rounded-full",
        hoverState === "pointer" && "w-12 h-12 rounded-full bg-transparent border border-white",
        hoverState === "text" && "w-0.5 h-6 rounded-none",
        hoverState === "view" && "w-20 h-20 rounded-full flex items-center justify-center"
      )}
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        x: "-50%",
        y: "-50%",
      }}
    >
      {hoverState === "view" && (
        <span className="text-[10px] font-bold text-black tracking-widest uppercase">View</span>
      )}
    </motion.div>
  );
}
