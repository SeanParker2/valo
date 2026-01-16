"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<"default" | "pointer" | "text" | "view">("default");
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check target type
      const target = e.target as HTMLElement;
      
      if (target.closest('a') || target.closest('button') || target.closest('[role="button"]')) {
        setHoverState("pointer");
      } else if (target.closest('p') || target.closest('h1') || target.closest('h2') || target.closest('span')) {
        setHoverState("text");
      } else if (target.closest('.group')) { // Assuming 'group' class is used for cards
        setHoverState("view");
      } else {
        setHoverState("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white hidden md:block",
        hoverState === "pointer" && "w-12 h-12 bg-transparent border border-white",
        hoverState === "text" && "w-1 h-8 rounded-none",
        hoverState === "view" && "w-20 h-20 bg-white mix-blend-difference flex items-center justify-center"
      )}
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        x: "-50%",
        y: "-50%"
      }}
    >
      {hoverState === "view" && (
        <span className="text-[10px] font-bold text-black tracking-widest uppercase">View</span>
      )}
    </motion.div>
  );
}
