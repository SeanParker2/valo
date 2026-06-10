"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface LightboxImage {
  src: string;
  alt: string;
  author?: string;
  location?: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImage[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  isLiked?: boolean;
  onLike?: () => void;
}

export function Lightbox({ isOpen, onClose, images, activeIndex, onNavigate, isLiked, onLike }: LightboxProps) {
  const image = images[activeIndex];

  const handlePrev = useCallback(() => {
    onNavigate((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 md:p-12">
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-20">
              <span className="font-mono text-xs text-white/50 tracking-widest">
                {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-4">
                {onLike && (
                  <button
                    onClick={onLike}
                    className={`p-2 rounded-full transition-colors ${isLiked ? "text-red-500" : "text-white/50 hover:text-white"}`}
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  </button>
                )}
                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors" aria-label="Close">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-w-5xl max-h-[70vh] w-full aspect-[3/4]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 80vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Bottom info */}
            {image.author && (
              <div className="absolute bottom-6 left-6">
                <span className="text-white/80 text-sm font-bold block">{image.author}</span>
                {image.location && <span className="text-white/40 text-xs">{image.location}</span>}
              </div>
            )}

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
