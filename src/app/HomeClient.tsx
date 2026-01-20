"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import InfoHover from "@/components/molecules/InfoHover";

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background text-foreground">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <Image 
          src="/images/texture-01.svg"
          alt="Valo Hero"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <span className="font-sans-tech text-xs md:text-sm font-bold tracking-[0.5em] text-white/80 mb-6 block drop-shadow-md">
            EST. 2026
          </span>
          <h1 className="font-serif-heading text-8xl md:text-[11rem] leading-[0.85] font-medium tracking-tight mb-8 text-white drop-shadow-lg">
            The Soul <br /> <span className="italic font-light text-white/90">in Resin</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <span className="font-sans-tech text-[10px] tracking-[0.2em] text-white/70">SCROLL TO DISCOVER</span>
          <ChevronDown className="w-4 h-4 text-white/70 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

function Philosophy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%" });

  return (
    <section ref={ref} className="min-h-[80vh] w-full bg-background text-foreground flex items-center justify-center px-8 py-24 md:py-0 relative z-20">
      <div className="max-w-4xl text-center">
        <motion.p 
          className="font-serif-heading text-4xl md:text-6xl leading-tight text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-foreground">We do not manufacture dolls.</span> We orchestrate light, shadow, and resin to create <span className="italic text-valo-gold">vessels for the soul</span>. Every <InfoHover term="joint" definition="A ball-and-socket engineering marvel allowing 360° fluidity." /> is an engineering marvel; every contour, a poem.
        </motion.p>
        
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="h-24 w-px bg-linear-to-b from-valo-gold to-transparent"></div>
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

function FeatureNarrativeItem({ feature, index, scrollYProgress }: { feature: Feature, index: number, scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [index/3, index/3 + 0.05, (index+1)/3 - 0.05, (index+1)/3], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [index/3, index/3 + 0.05, (index+1)/3 - 0.05, (index+1)/3], [20, 0, 0, -20]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y }}
    >
      <h2 className="font-serif-heading text-8xl md:text-9xl mb-6 text-foreground">{feature.title}</h2>
      <div className="w-12 h-px bg-valo-gold mb-6"></div>
      <p className="font-sans-tech text-sm text-gray-500 max-w-xs leading-loose">{feature.desc}</p>
    </motion.div>
  );
}

function FeatureVisualItem({ feature, index, scrollYProgress }: { feature: Feature, index: number, scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [index/3, index/3 + 0.05, (index+1)/3 - 0.05, (index+1)/3], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [index/3, (index+1)/3], [1.1, 1]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, scale }}
    >
       <Image 
         src={feature.img} 
         fill 
         className="object-cover" 
         alt={feature.title} 
         priority={index === 0}
       />
       <div className="absolute inset-0 bg-black/10"></div>
    </motion.div>
  );
}

function StickyFeatures() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const features = [
    {
      title: "Sculpt",
      desc: "Anatomy refined to the micron.",
      img: "/images/texture-02.svg"
    },
    {
      title: "Resin",
      desc: "Skin-like translucency, eternal durability.",
      img: "/images/texture-03.svg"
    },
    {
      title: "Motion",
      desc: "Double-jointed engineering for fluid posing.",
      img: "/images/texture-04.svg"
    }
  ];

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen flex w-full overflow-hidden">
        <div className="w-1/2 h-full flex items-center justify-center p-12 md:p-24 bg-background z-10 border-r border-black/5">
           <div className="relative w-full h-full flex items-center">
             {features.map((f, i) => (
               <FeatureNarrativeItem key={i} feature={f} index={i} scrollYProgress={scrollYProgress} />
             ))}
           </div>
        </div>

        <div className="w-1/2 h-full relative bg-[#0a0a0a]">
           {features.map((f, i) => (
             <FeatureVisualItem key={i} feature={f} index={i} scrollYProgress={scrollYProgress} />
           ))}
        </div>
      </div>
    </section>
  );
}

function LabTeaser() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden group">
      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-1000">
         <Image 
           src="/images/texture-05.svg"
           alt="Lab Background"
           fill
           className="object-cover blur-xs scale-105 group-hover:scale-100 transition-transform duration-[2s]"
         />
      </div>
      
      <div className="relative z-10 text-center">
        <h2 className="font-serif-heading text-6xl md:text-8xl text-white mb-8 tracking-tight">
          Light Lab <span className="text-valo-gold text-2xl align-top font-mono">BETA</span>
        </h2>
        <p className="font-sans text-gray-400 max-w-lg mx-auto mb-12 leading-loose">
          Experience your creation under 4,000 lighting conditions. <br/>
          From candlelight to studio flash.
        </p>
        
        <Link href="/lab">
          <button className="relative px-12 py-4 bg-transparent border border-white/20 text-white font-sans-tech text-xs font-bold tracking-[0.2em] overflow-hidden group/btn hover:border-valo-gold transition-colors">
            <span className="relative z-10 group-hover/btn:text-black transition-colors">ENTER SIMULATION</span>
            <div className="absolute inset-0 bg-valo-gold transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
        </Link>
      </div>
    </section>
  )
}

export default function HomeClient() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <Philosophy />
      <StickyFeatures />
      <LabTeaser />
      <Footer />
    </main>
  );
}
