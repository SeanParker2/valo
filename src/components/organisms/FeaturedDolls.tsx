"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { ARCHIVE_ITEMS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/utils/blur";

const FEATURED = ARCHIVE_ITEMS.slice(0, 4);

export function FeaturedDolls() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });
  const doll = FEATURED[activeIndex];

  const next = () => setActiveIndex((i) => (i + 1) % FEATURED.length);
  const prev = () => setActiveIndex((i) => (i - 1 + FEATURED.length) % FEATURED.length);

  return (
    <section ref={ref} className="relative bg-background py-32 px-8 md:px-16 lg:px-32 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="section-label block mb-4">FEATURED</span>
            <h2 className="section-title text-5xl md:text-7xl">From the Archive</h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={prev} className="btn-ghost p-0 w-12 h-12 flex items-center justify-center border border-divider hover:border-black" aria-label="Previous">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="btn-ghost p-0 w-12 h-12 flex items-center justify-center border border-divider hover:border-black" aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-gray-400 ml-4">
              {String(activeIndex + 1).padStart(2, "0")} / {String(FEATURED.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="card-image aspect-[3/4] group" data-cursor="view">
            <AnimatePresence mode="wait">
              <motion.div
                key={doll.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={doll.image}
                  alt={doll.name}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <span className="font-mono text-[10px] text-white/60 tracking-widest">VALO-{doll.id}</span>
              <span className="font-sans text-[10px] text-white/60 tracking-widest uppercase">{doll.type}</span>
            </div>
          </div>

          {/* Info */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={doll.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-mono text-[10px] tracking-widest text-gold uppercase">{doll.series}</span>
                <h3 className="section-title text-6xl md:text-8xl mt-4 mb-6">{doll.name}</h3>
                <div className="w-12 h-px bg-gold mb-8" />
                <p className="font-serif text-xl text-gray-500 leading-relaxed mb-10 max-w-md">{doll.narrative}</p>

                <div className="grid grid-cols-2 gap-6 mb-10 max-w-sm">
                  <div>
                    <span className="section-label block mb-1">Height</span>
                    <span className="font-serif text-lg">{doll.spec.height.split(" ")[0]} {doll.spec.height.split(" ")[1]}</span>
                  </div>
                  <div>
                    <span className="section-label block mb-1">Material</span>
                    <span className="font-serif text-lg">{doll.spec.material.split("(")[0].trim()}</span>
                  </div>
                  <div>
                    <span className="section-label block mb-1">Joints</span>
                    <span className="font-serif text-lg">{doll.spec.joints} points</span>
                  </div>
                  <div>
                    <span className="section-label block mb-1">Year</span>
                    <span className="font-serif text-lg">{doll.year}</span>
                  </div>
                </div>

                <Link
                  href={`/archive/${doll.id}`}
                  className="inline-flex items-center gap-3 group/link text-[11px] font-bold tracking-[0.2em] uppercase border-b border-black pb-1 hover:text-gold hover:border-gold transition-all"
                >
                  View Details
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail nav */}
            <div className="flex gap-3 mt-12">
              {FEATURED.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative w-16 h-20 overflow-hidden transition-all duration-300",
                    i === activeIndex ? "ring-2 ring-gold ring-offset-2 ring-offset-paper" : "opacity-40 hover:opacity-70"
                  )}
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
