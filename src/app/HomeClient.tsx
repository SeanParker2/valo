"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import InfoHover from "@/components/molecules/InfoHover";
import { NewsletterBanner } from "@/components/molecules/Newsletter";
import { FeaturedDolls } from "@/components/organisms/FeaturedDolls";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, reduced ? 0 : 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, reduced ? 1 : 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background text-foreground">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544413660-299165566b1d?w=1920&h=1080&fit=crop&crop=faces"
          alt="VALO Hero"
          fill
          className="object-cover opacity-80"
          style={reduced ? undefined : { animation: "kenburns 20s ease-in-out infinite" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-sans text-xs md:text-sm font-bold tracking-[0.5em] text-white/80 mb-6 block drop-shadow-md">
            ATELIER &bull; TOKYO &bull; EST. 2024
          </span>
          <h1 className="font-serif text-7xl md:text-[11rem] leading-[0.85] font-light tracking-tight mb-8 text-white drop-shadow-lg">
            The Soul <br /> <span className="italic font-light text-white/90">in Resin</span>
          </h1>
          <p className="font-serif text-lg md:text-xl text-white/60 max-w-md mx-auto leading-relaxed">
            Artisan ball-jointed dolls crafted with French resin, precision engineering, and obsessive attention to light.
          </p>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? { duration: 0 } : { duration: 1, delay: 1.2 }}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <span className="font-sans text-[10px] tracking-[0.2em] text-white/70">SCROLL TO DISCOVER</span>
          <ChevronDown className="w-4 h-4 text-white/70 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

function Philosophy() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });

  return (
    <section ref={ref} className="min-h-[80vh] w-full bg-background text-foreground flex items-center justify-center px-8 py-24 md:py-32 relative z-20">
      <div className="max-w-4xl text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={reduced ? { duration: 0 } : { duration: 0.8 }}
          className="mb-8"
        >
          <span className="section-label">PHILOSOPHY</span>
        </motion.div>

        <motion.p
          className="font-serif text-4xl md:text-6xl leading-tight text-gray-500"
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={reduced ? { duration: 0 } : { duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-foreground">We do not manufacture dolls.</span> We orchestrate light, shadow, and resin to create{" "}
          <span className="italic text-gold">vessels for the soul</span>. Every{" "}
          <InfoHover term="joint" definition="A ball-and-socket engineering marvel allowing 360° fluidity. Each joint is CNC-machined to 0.1mm tolerance." /> is an
          engineering marvel; every contour, a poem. We cast in French resin because light doesn&apos;t just bounce off it — it lives inside.
        </motion.p>

        <motion.div
          className="mt-16 flex justify-center"
          initial={reduced ? false : { opacity: 0, scaleY: 0 }}
          animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
          transition={reduced ? { duration: 0 } : { delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "top" }}
        >
          <div className="h-24 w-px bg-linear-to-b from-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

interface Feature {
  title: string;
  desc: string;
  img: string;
}

function FeatureNarrativeItem({ feature, index, scrollYProgress }: { feature: Feature; index: number; scrollYProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const opacity = useTransform(scrollYProgress, [index / 3, index / 3 + 0.08, (index + 1) / 3 - 0.08, (index + 1) / 3], reduced ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [index / 3, index / 3 + 0.08, (index + 1) / 3 - 0.08, (index + 1) / 3], reduced ? [0, 0, 0, 0] : [30, 0, 0, -30]);

  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
      <span className="font-sans text-[10px] tracking-[0.3em] text-gold-warm mb-4 block">0{index + 1}</span>
      <h2 className="font-serif text-7xl md:text-9xl mb-6 text-foreground">{feature.title}</h2>
      <div className="w-12 h-px bg-gold-warm mb-6" />
      <p className="font-sans text-sm text-gray-500 max-w-xs leading-loose">{feature.desc}</p>
    </motion.div>
  );
}

function FeatureVisualItem({ feature, index, scrollYProgress }: { feature: Feature; index: number; scrollYProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const opacity = useTransform(scrollYProgress, [index / 3, index / 3 + 0.08, (index + 1) / 3 - 0.08, (index + 1) / 3], reduced ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [index / 3, (index + 1) / 3], reduced ? [1, 1] : [1.1, 1]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale }}>
      <Image src={feature.img} fill className="object-cover" alt={feature.title} priority={index === 0} />
      <div className="absolute inset-0 bg-black/10" />
    </motion.div>
  );
}

function StickyFeatures() {
  const reduced = useReducedMotion();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const features: Feature[] = [
    { title: "Sculpt", desc: "Anatomy refined to the micron. Each curve calculated, each proportion deliberate.", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=1600&fit=crop" },
    { title: "Resin", desc: "Skin-like translucency, eternal durability. Light passes through, not just bounces off.", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=1600&fit=crop" },
    { title: "Motion", desc: "Double-jointed engineering for fluid posing. 18 points of articulation.", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1600&fit=crop" },
  ];

  if (reduced) {
    return (
      <section className="bg-background py-32 px-8 md:px-16 lg:px-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((f, i) => (
            <div key={i}>
              <span className="font-sans text-[10px] tracking-[0.3em] text-gold-warm mb-4 block">0{i + 1}</span>
              <h2 className="font-serif text-5xl mb-4">{f.title}</h2>
              <div className="w-12 h-px bg-gold-warm mb-4" />
              <p className="font-sans text-sm text-gray-500 leading-loose">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen flex w-full overflow-hidden">
        <div className="w-full md:w-1/2 h-full flex items-center justify-center p-8 md:p-24 bg-background z-10 border-r border-black/5">
          <div className="relative w-full h-full flex items-center">
            {features.map((f, i) => (
              <FeatureNarrativeItem key={i} feature={f} index={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>

        <div className="hidden md:block w-1/2 h-full relative bg-[#0a0a0a]">
          {features.map((f, i) => (
            <FeatureVisualItem key={i} feature={f} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <main className="bg-background min-h-screen">
      <a href="#main-content" className="skip-nav">Skip to content</a>
      <Navbar />
      <div id="main-content">
        <Hero />
        <Philosophy />
        <StickyFeatures />
        <FeaturedDolls />
        <NewsletterBanner />
      </div>
      <Footer />
    </main>
  );
}
